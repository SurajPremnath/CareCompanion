import { Resend } from "resend";

export interface SendInvitationEmailInput {
    to: string;
    subject: string;
    body: string;
}

export interface SendInvitationEmailResult {
    success: true;
    emailId: string;
}

class InvitationEmailService {

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
        input: SendInvitationEmailInput
    ): Promise<SendInvitationEmailResult> {

        const email =
            input.to
                .trim()
                .toLowerCase();

        if (!email) {
            throw new Error(
                "Invitee email address is required."
            );
        }

        if (!input.subject.trim()) {
            throw new Error(
                "Invitation email subject is required."
            );
        }

        if (!input.body.trim()) {
            throw new Error(
                "Invitation email body is required."
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

        const {
            data,
            error
        } =
            await resend.emails.send({
                from,
                to: [email],
                subject: input.subject,
                html: this.toHtml(input.body),
            });

        if (error) {
            console.error(
                "Unable to send CareVR invitation email.",
                error
            );

            throw new Error(
                error.message ||
                "Unable to send the CareVR invitation email."
            );
        }

        if (!data?.id) {
            throw new Error(
                "CareVR invitation email was not assigned an email ID."
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

    const linkedBody =
        body.replace(
            /(https?:\/\/[^\s]+)/g,
            (url) => {

                const safeUrl =
                    escapeHtml(url);

return `
<a
    href="${safeUrl}"
    style="
        color:#244b7f;
        text-decoration:underline;
        font-weight:600;
    font-size:16px;
    "
    target="_blank"
    rel="noopener noreferrer"
>
    Activate CareVR
</a>
`;
            }
        );

    const safeBody =
        linkedBody
            .split(/(<a[\s\S]*?<\/a>)/gi)
            .map(
                (part) =>
                    /^<a[\s\S]*?<\/a>$/i.test(part)
                        ? part
                        : escapeHtml(part)
            )
            .join("");

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
    />
    <title>CareVR Invitation</title>
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
            This invitation was sent by CareVR.
        </div>
    </div>
</body>
</html>
`;
}
}

export const invitationEmailService =
    new InvitationEmailService();