import { Resend } from "resend";

export interface SendPasswordReminderEmailInput {
    to: string;
    daysRemaining: 7 | 3 | 1| 0;
    expiresAt: string;
}

export interface SendPasswordReminderEmailResult {
    success: true;
    emailId: string;
}

class PasswordReminderEmailService {

    private getClient(): Resend {
        const apiKey =
            process.env.RESEND_API_KEY;

        if (!apiKey) {
            throw new Error(
                "RESEND_API_KEY is not configured."
            );
        }

        return new Resend(apiKey);
    }

    async send(
        input: SendPasswordReminderEmailInput
    ): Promise<SendPasswordReminderEmailResult> {

        const email =
            input.to
                .trim()
                .toLowerCase();

        if (!email) {
            throw new Error(
                "User email address is required."
            );
        }

        if (
            input.daysRemaining !== 7 &&
            input.daysRemaining !== 3 &&
            input.daysRemaining !== 1 &&
            input.daysRemaining !== 0
        ) {
            throw new Error(
                "Password reminder must be sent 7, 3, 1 day before expiry, or on expiry day."
            );
        }

        if (!input.expiresAt.trim()) {
            throw new Error(
                "Password expiry date is required."
            );
        }

        const expiryDate =
            new Date(input.expiresAt);

        if (
            Number.isNaN(
                expiryDate.getTime()
            )
        ) {
            throw new Error(
                "Invalid password expiry date."
            );
        }

        const resend =
            this.getClient();

        const from =
            process.env.CAREVR_EMAIL_FROM;

        if (!from) {
            throw new Error(
                "CAREVR_EMAIL_FROM is not configured."
            );
        }

        const expiryDisplay =
            expiryDate.toLocaleDateString(
                "en-IN",
                {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                    timeZone: "Asia/Kolkata",
                }
            );

const subject =
    input.daysRemaining === 0
        ? "Your CareVR password expires today"
        : input.daysRemaining === 1
            ? "Your CareVR password expires tomorrow"
            : `Your CareVR password expires in ${input.daysRemaining} days`;

const body =
    input.daysRemaining === 0
        ? `Your CareVR password expires today, ${expiryDisplay}.

Please change your password today to continue using CareVR without interruption.

If you have already changed your password, no further action is required.`
        : input.daysRemaining === 1
            ? `Your CareVR password will expire tomorrow, ${expiryDisplay}.

Please change your password before it expires to continue using CareVR without interruption.

If you have already changed your password, no further action is required.`
            : `Your CareVR password will expire in ${input.daysRemaining} days, on ${expiryDisplay}.

Please change your password before it expires to continue using CareVR without interruption.

If you have already changed your password, no further action is required.`;

        const {
            data,
            error
        } =
            await resend.emails.send({
                from,
                to: [email],
                subject,
                html: this.toHtml(body),
            });

        if (error) {
            console.error(
                "Unable to send CareVR password reminder email.",
                error
            );

            throw new Error(
                error.message ||
                "Unable to send the CareVR password reminder email."
            );
        }

        if (!data?.id) {
            throw new Error(
                "CareVR password reminder email was not assigned an email ID."
            );
        }

        return {
            success: true,
            emailId: data.id,
        };
    }

    private toHtml(
        body: string
    ): string {

        const escapeHtml =
            (value: string): string =>
                value
                    .replace(
                        /&/g,
                        "&amp;"
                    )
                    .replace(
                        /</g,
                        "&lt;"
                    )
                    .replace(
                        />/g,
                        "&gt;"
                    )
                    .replace(
                        /"/g,
                        "&quot;"
                    )
                    .replace(
                        /'/g,
                        "&#039;"
                    );

        const safeBody =
            escapeHtml(body);

        return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
    />
    <title>CareVR Password Reminder</title>
</head>

<body
    style="
        margin:0;
        padding:0;
        background:#f5f8fc;
        font-family:Arial,Helvetica,sans-serif;
        color:#15203d;
    "
>
    <div
        style="
            max-width:680px;
            margin:0 auto;
            padding:32px 20px;
        "
    >
        <div
            style="
                background:#ffffff;
                border:1px solid #dce6f1;
                border-radius:14px;
                padding:32px;
            "
        >
            <div
                style="
                    font-size:22px;
                    font-weight:700;
                    color:#244b7f;
                    margin-bottom:24px;
                "
            >
                CareVR
            </div>

            <div
                style="
                    font-size:15px;
                    line-height:1.7;
                    white-space:pre-wrap;
                "
            >
                ${safeBody}
            </div>
        </div>

        <div
            style="
                padding:18px 4px 0;
                font-size:11px;
                line-height:1.5;
                color:#7185a0;
                text-align:center;
            "
        >
            This is an automated CareVR password reminder.
        </div>
    </div>
</body>
</html>
`;
    }
}

export const passwordReminderEmailService =
    new PasswordReminderEmailService();