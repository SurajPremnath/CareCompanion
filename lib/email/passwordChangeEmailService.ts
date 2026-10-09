import { Resend } from "resend";

export interface SendPasswordChangeEmailInput {
    to: string;
    changedAt: string;
}

export interface SendPasswordChangeEmailResult {
    success: true;
    emailId: string;
}

class PasswordChangeEmailService {
    private getClient(): Resend {
        const apiKey = process.env.RESEND_API_KEY;

        if (!apiKey) {
            throw new Error(
                "RESEND_API_KEY is not configured."
            );
        }

        return new Resend(apiKey);
    }

    async send(
        input: SendPasswordChangeEmailInput
    ): Promise<SendPasswordChangeEmailResult> {
        const email = input.to.trim().toLowerCase();

        if (!email) {
            throw new Error(
                "User email address is required."
            );
        }

        const changedDate = new Date(input.changedAt);

        if (Number.isNaN(changedDate.getTime())) {
            throw new Error(
                "Invalid password-change date."
            );
        }

        const from = process.env.CAREVR_EMAIL_FROM;

        if (!from) {
            throw new Error(
                "CAREVR_EMAIL_FROM is not configured."
            );
        }

        const changedAtDisplay =
            changedDate.toLocaleString("en-IN", {
                day: "2-digit",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: true,
                timeZone: "Asia/Kolkata",
            }) + " IST";

        const resend = this.getClient();

        const subject =
            "Your CareVR password has been changed";

        const body = `Your CareVR account password was changed successfully.

Date and time: ${changedAtDisplay}

If you made this change, no further action is required.

If you did not change your password, please contact CareVR support immediately so that your account security can be reviewed.

For your security, this email does not contain your password.`;

        const escapeHtml = (value: string): string =>
            value
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#039;");

        const safeBody = escapeHtml(body);

        const { data, error } = await resend.emails.send({
            from,
            to: [email],
            subject,
            html: `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
    />
    <title>CareVR Password Changed</title>
</head>
<body style="
    margin:0;
    padding:0;
    background:#f5f8fc;
    font-family:Arial,Helvetica,sans-serif;
    color:#15203d;
">
    <div style="
        max-width:680px;
        margin:0 auto;
        padding:32px 20px;
    ">
        <div style="
            background:#ffffff;
            border:1px solid #dce6f1;
            border-radius:14px;
            padding:32px;
        ">
            <div style="
                font-size:22px;
                font-weight:700;
                color:#244b7f;
                margin-bottom:24px;
            ">
                CareVR
            </div>

            <div style="
                font-size:15px;
                line-height:1.7;
                white-space:pre-wrap;
            ">${safeBody}</div>
        </div>

        <div style="
            padding:18px 4px 0;
            font-size:11px;
            line-height:1.5;
            color:#7185a0;
            text-align:center;
        ">
            This is an automated CareVR account security notification.
        </div>
    </div>
</body>
</html>`,
        });

        if (error) {
            console.error(
                "Unable to send CareVR password-change email.",
                error
            );

            throw new Error(
                error.message ||
                "Unable to send the CareVR password-change email."
            );
        }

        if (!data?.id) {
            throw new Error(
                "CareVR password-change email was not assigned an email ID."
            );
        }

        return {
            success: true,
            emailId: data.id,
        };
    }
}

export const passwordChangeEmailService =
    new PasswordChangeEmailService();