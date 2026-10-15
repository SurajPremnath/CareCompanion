
const TURNSTILE_VERIFY_URL =
    "https://challenges.cloudflare.com/turnstile/v0/siteverify";

const ALLOWED_HOSTNAMES = new Set([
    "carevr.in",
    "www.carevr.in",
    "localhost",
]);

interface TurnstileVerificationResponse {
    success: boolean;
    hostname?: string;
    action?: string;
    "error-codes"?: string[];
}

export interface TurnstileVerificationOptions {
    token: string;
    remoteIp?: string;
    expectedAction?: string;
}

export async function verifySandboxTurnstile({
    token,
    remoteIp,
    expectedAction,
}: TurnstileVerificationOptions): Promise<boolean> {
    const secret = process.env.TURNSTILE_SECRET_KEY;

    if (!secret) {
        throw new Error(
            "Sandbox Turnstile server secret is not configured."
        );
    }

    const normalizedToken = token.trim();

    if (
        normalizedToken.length === 0 ||
        normalizedToken.length > 2048
    ) {
        return false;
    }

    const body = new URLSearchParams({
        secret,
        response: normalizedToken,
    });

    if (remoteIp) {
        body.set("remoteip", remoteIp);
    }

    let response: Response;

    try {
        response = await fetch(TURNSTILE_VERIFY_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body,
            cache: "no-store",
            signal: AbortSignal.timeout(5000),
        });
    } catch {
        throw new Error(
            "Sandbox Turnstile verification service is unavailable."
        );
    }

    if (!response.ok) {
        throw new Error(
            "Sandbox Turnstile verification service returned an error."
        );
    }

    let result: TurnstileVerificationResponse;

    try {
        result =
            (await response.json()) as TurnstileVerificationResponse;
    } catch {
        throw new Error(
            "Sandbox Turnstile returned an invalid verification response."
        );
    }

    if (result.success !== true) {
        return false;
    }

    const hostname =
        typeof result.hostname === "string"
            ? result.hostname.toLowerCase().replace(/\.$/, "")
            : "";

    if (!ALLOWED_HOSTNAMES.has(hostname)) {
        return false;
    }

    if (
        expectedAction &&
        result.action !== expectedAction
    ) {
        return false;
    }

    return true;
}
