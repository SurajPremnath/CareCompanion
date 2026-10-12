
import { Resend } from "resend";

export interface ContactSupportEmailInput {
    name: string;
    email: string;
    category: string;
    subject: string;
    message: string;
    ticketNumber: string;
    attachment?: {
        filename: string;
        content: Buffer;
        contentType: string;
    };
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
): Promise<{ emailId: string; acknowledgementEmailId: string }> {
    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.CAREVR_EMAIL_FROM;

    if (!apiKey || !from) {
        throw new Error("Support email service is not configured.");
    }

    const resend = new Resend(apiKey);
    const ticket = input.ticketNumber;

    const attachment = input.attachment
        ? [{
              filename: input.attachment.filename,
              content: input.attachment.content,
              contentType: input.attachment.contentType,
          }]
        : undefined;

    const { data: supportData, error: supportError } =
        await resend.emails.send({
            from,
            to: ["lineariseailabs@gmail.com"],
            replyTo: input.email,
            subject: `[CareVR Support] ${ticket}: ${input.subject}`,
            html: `
                <div style="font-family:Arial,sans-serif;line-height:1.65;color:#243b53">
                    <h2 style="color:#205f8b">New CareVR Support Request</h2>
                    <p><strong>Ticket reference:</strong> ${escapeHtml(ticket)}</p>
                    <p><strong>Category:</strong> ${escapeHtml(input.category)}</p>
                    <p><strong>Subject:</strong> ${escapeHtml(input.subject)}</p>
                    <p><strong>Name:</strong> ${escapeHtml(input.name)}</p>
                    <p><strong>Reply email:</strong> ${escapeHtml(input.email)}</p>
                    <hr style="border:none;border-top:1px solid #e2e8f0" />
                    <p><strong>Message</strong></p>
                    <p style="white-space:pre-wrap">${escapeHtml(input.message)}</p>
                </div>
            `,
            text: [
                "New CareVR Support Request",
                `Ticket reference: ${ticket}`,
                `Category: ${input.category}`,
                `Subject: ${input.subject}`,
                `Name: ${input.name}`,
                `Reply email: ${input.email}`,
                "",
                "Message:",
                input.message,
            ].join("\n"),
            ...(attachment ? { attachments: attachment } : {}),
        });

    if (supportError) {
        throw new Error(supportError.message || "Unable to send support request.");
    }

    if (!supportData?.id) {
        throw new Error("Email provider did not return a support email ID.");
    }

    const { data: acknowledgementData, error: acknowledgementError } =
        await resend.emails.send({
            from,
            to: [input.email],
            subject: `CareVR Support Ticket ${ticket} — Request received`,
            html: `
                <div style="font-family:Arial,sans-serif;line-height:1.7;color:#243b53;max-width:600px">
                    <h2 style="color:#205f8b">We've received your support request</h2>
                    <p>Hello ${escapeHtml(input.name)},</p>
                    <p>Thank you for contacting CareVR Support.</p>
                    <p>Your support reference is:</p>
                    <p style="font-size:22px;font-weight:bold;color:#205f8b">
                        ${escapeHtml(ticket)}
                    </p>
                    <p>Our team will review and investigate the issue. We aim to respond within <strong>24 hours</strong>.</p>
                    <p>Please keep this reference for any follow-up about your request.</p>
                    <p>Regards,<br />CareVR Support</p>
                </div>
            `,
            text: [
                `Hello ${input.name},`,
                "",
                "Thank you for contacting CareVR Support.",
                `Your support reference is ${ticket}.`,
                "",
                "Our team will review and investigate the issue. We aim to respond within 24 hours.",
                "Please keep this reference for any follow-up about your request.",
                "",
                "Regards,",
                "CareVR Support",
            ].join("\n"),
        });

    if (acknowledgementError) {
        throw new Error(
            acknowledgementError.message ||
                "Support request was sent, but the acknowledgement email failed."
        );
    }

    if (!acknowledgementData?.id) {
        throw new Error("Email provider did not return an acknowledgement email ID.");
    }

    return {
        emailId: supportData.id,
        acknowledgementEmailId: acknowledgementData.id,
    };
}
