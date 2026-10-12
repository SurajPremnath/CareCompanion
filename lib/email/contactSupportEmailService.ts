
import { Resend } from "resend";

export interface ContactSupportEmailInput {
    name: string;
    email: string;
    category: string;
    subject: string;
    message: string;
}

function escapeHtml(value: string): string {
    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

export async function sendContactSupportEmail(
    input: ContactSupportEmailInput
): Promise<{ emailId: string }> {
    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.CAREVR_EMAIL_FROM;

    if (!apiKey || !from) {
        throw new Error("Support email service is not configured.");
    }

    const resend = new Resend(apiKey);

    const html = `
        <div style="font-family:Arial,sans-serif;line-height:1.65;color:#243b53">
            <h2 style="color:#205f8b">New CareVR Support Request</h2>
            <p><strong>Category:</strong> ${escapeHtml(input.category)}</p>
            <p><strong>Subject:</strong> ${escapeHtml(input.subject)}</p>
            <p><strong>Name:</strong> ${escapeHtml(input.name)}</p>
            <p><strong>Reply email:</strong> ${escapeHtml(input.email)}</p>
            <hr style="border:none;border-top:1px solid #e2e8f0" />
            <p><strong>Message</strong></p>
            <p style="white-space:pre-wrap">${escapeHtml(input.message)}</p>
        </div>
    `;

    const { data, error } = await resend.emails.send({
        from,
        to: ["lineariseailabs@gmail.com"],
        replyTo: input.email,
        subject: `[CareVR Support] ${input.category}: ${input.subject}`,
        html,
        text: [
            "New CareVR Support Request",
            `Category: ${input.category}`,
            `Subject: ${input.subject}`,
            `Name: ${input.name}`,
            `Reply email: ${input.email}`,
            "",
            "Message:",
            input.message,
        ].join("\n"),
    });

    if (error) {
        throw new Error(error.message || "Unable to send support request.");
    }

    if (!data?.id) {
        throw new Error("Email provider did not return an email ID.");
    }

    return { emailId: data.id };
}
