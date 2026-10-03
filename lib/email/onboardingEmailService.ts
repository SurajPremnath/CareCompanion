import { Resend } from "resend";

export interface SendOnboardingEmailInput {
    to: string;
    fullName?: string;
}

export interface SendOnboardingEmailResult {
    success: true;
    emailId: string;
}

class OnboardingEmailService {

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
        input: SendOnboardingEmailInput
    ): Promise<SendOnboardingEmailResult> {

        const email =
            input.to
                .trim()
                .toLowerCase();

        if (!email) {
            throw new Error(
                "User email address is required."
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


        const name =
            input.fullName?.trim() ||
            "CareVR User";


        const subject =
            "Welcome to CareVR — Your Care Journey Starts Here";


        const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>

<body style="
    margin:0;
    padding:0;
    background:#f5f3fb;
    font-family:Arial,Helvetica,sans-serif;
    color:#1d2948;
">

<div style="
    max-width:680px;
    margin:0 auto;
    padding:32px 20px;
">

    <div style="
        background:#ffffff;
        border-radius:14px;
        padding:36px 32px;
        box-shadow:0 2px 12px rgba(0,0,0,0.06);
    ">

        <h1 style="
            margin:0 0 20px;
            color:#244b7f;
            font-size:28px;
            line-height:1.25;
        ">
            Welcome to CareVR
        </h1>


        <p style="
            font-size:17px;
            line-height:1.7;
            margin:0 0 18px;
        ">
            Hello ${this.escapeHtml(name)},
        </p>


        <p style="
            font-size:16px;
            line-height:1.7;
            margin:0 0 18px;
        ">
            Welcome to CareVR. Your CareVR account is now ready,
            and your care journey can begin.
        </p>


        <p style="
            font-size:16px;
            line-height:1.7;
            margin:0 0 24px;
        ">
            CareVR helps you record, understand, manage and share
            your healthcare information in one place.
        </p>


        <h2 style="
            color:#244b7f;
            font-size:21px;
            margin:28px 0 12px;
        ">
            Basic Features
        </h2>

        <ul style="
            font-size:16px;
            line-height:1.8;
            padding-left:24px;
            margin-top:8px;
        ">
            <li>Record Health using manual entry.</li>
            <li>Health Assessment.</li>
            <li>Health Timeline.</li>
            <li>Executive Summary and Clinical Trends reports.</li>
            <li>Care Family management according to your access.</li>
            <li>Secure access to your CareVR information.</li>
        </ul>


        <h2 style="
            color:#244b7f;
            font-size:21px;
            margin:28px 0 12px;
        ">
            Premium Features
        </h2>

        <ul style="
            font-size:16px;
            line-height:1.8;
            padding-left:24px;
            margin-top:8px;
        ">
            <li>Voice Recording for Health Data.</li>
            <li>Image Upload for Health Data.</li>
        </ul>


        <p style="
            font-size:16px;
            line-height:1.7;
            margin:28px 0 18px;
        ">
            We have attached the CareVR SOP to this email.
            It provides a guided introduction to CareVR and
            explains how to use the available features.
        </p>


        <div style="
            margin:28px 0;
            padding:20px;
            background:#f4f1fb;
            border-radius:10px;
        ">

            <p style="
                margin:0;
                font-size:16px;
                line-height:1.7;
            ">
                Need help or have questions?
                Contact us at
                <a
                    href="mailto:lineariseailabs@gmail.com"
                    style="
                        color:#244b7f;
                        font-weight:600;
                        text-decoration:underline;
                    "
                >
                    lineariseailabs@gmail.com
                </a>.
            </p>

        </div>


        <p style="
            font-size:16px;
            line-height:1.7;
            margin:24px 0 0;
        ">
            Welcome to CareVR.
        </p>


        <p style="
            font-size:16px;
            line-height:1.7;
            margin:4px 0 0;
        ">
            Team CareVR<br />
            Linearise AI Labs
        </p>

    </div>

</div>

</body>
</html>
`;


        const sopPath =
            `${process.cwd()}/public/documents/CareVR-SOP.pdf`;


        const {
            data,
            error
        } =
            await resend.emails.send({

                from,

                to: [email],

                subject,

                html,

                attachments: [
                    {
                        filename:
                            "CareVR-SOP.pdf",
                        path:
                            sopPath,
                    },
                ],

            });


        if (error) {

            console.error(
                "Unable to send CareVR onboarding email.",
                error
            );

            throw new Error(
                error.message ||
                "Unable to send the CareVR onboarding email."
            );
        }


        if (!data?.id) {

            throw new Error(
                "CareVR onboarding email was not assigned an email ID."
            );
        }


        return {
            success: true,
            emailId: data.id,
        };
    }


    private escapeHtml(
        value: string
    ): string {

        return value
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
}


export const onboardingEmailService =
    new OnboardingEmailService();