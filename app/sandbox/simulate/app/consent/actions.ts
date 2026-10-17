
"use server";

export async function markDigitalHealthConsentAccepted(): Promise<{
    success: false;
    message: string;
}> {
    return {
        success: false,
        message:
            "Consent persistence is disabled in the public Sandbox. No consent record was saved.",
    };
}
