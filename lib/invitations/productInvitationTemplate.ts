export interface ProductInvitationTemplateInput {
    inviteeEmail: string;
    activationUrl: string;
    expiresAt: string;
}

export interface ProductInvitationTemplateResult {
    subject: string;
    body: string;
}

class ProductInvitationTemplate {

    create(
        input: ProductInvitationTemplateInput
    ): ProductInvitationTemplateResult {

        return {
            subject:
                "Invitation to access CareVR",

            body:
                `Hello,

You have been invited to access the CareVR application.

To begin, please use the secure activation link below:

${input.activationUrl}

During activation, you will be asked to confirm that you are a Primary Family Member before continuing with CareVR registration.

This invitation is valid for ${input.expiresAt}.

The activation link is single-use. Please do not share it with anyone else.

If you did not expect this invitation, you may disregard this message.

Regards,
CareVR`
        };
    }
}

export const productInvitationTemplate =
    new ProductInvitationTemplate();