
import { createHash, createHmac, randomBytes } from "node:crypto";
import { isIP } from "node:net";
import { NextRequest, NextResponse } from "next/server";

import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { verifySandboxTurnstile } from "@/lib/sandbox/turnstile";

export const runtime = "nodejs";

const SESSION_COOKIE = "carevr_sandbox_session";
const SESSION_DURATION_SECONDS = 12 * 60 * 60;
const MAX_BODY_BYTES = 16 * 1024;

const ALLOWED_ORIGINS = new Set([
    "https://carevr.in",
    "https://www.carevr.in",
]);

function getAllowedOrigins(): Set<string> {
    const origins = new Set(ALLOWED_ORIGINS);

    if (process.env.NODE_ENV !== "production") {
        origins.add("http://localhost:3000");
        origins.add("http://127.0.0.1:3000");
    }

    return origins;
}

function getClientIp(request: NextRequest): string | null {
    // On Vercel, prefer the platform-provided x-real-ip header.
    const realIp = request.headers.get("x-real-ip")?.trim();

    if (realIp && isIP(realIp)) {
        return realIp;
    }

    // Ignore leftmost forwarded values, which may be client-supplied.
    // The rightmost address is the expected client address when the
    // trusted deployment proxy appends the client IP.
    const forwarded = request.headers.get("x-forwarded-for");

    if (forwarded) {
        const candidates = forwarded
            .split(",")
            .map((value) => value.trim())
            .filter(Boolean);

        for (const candidate of candidates.reverse()) {
            if (isIP(candidate)) {
                return candidate;
            }
        }
    }

    return null;
}

function makeRateLimitKey(namespace: string, value: string): string {
    const secret = process.env.SANDBOX_RATE_LIMIT_SECRET;

    if (!secret) {
        throw new Error("Sandbox rate-limit secret is not configured.");
    }

    return createHmac("sha256", secret)
        .update(`carevr:sandbox:${namespace}:${value}`)
        .digest("hex");
}

async function consumeRateLimit(
    namespace: string,
    value: string,
    limit: number,
    windowSeconds: number,
): Promise<boolean> {
    const keyHash = makeRateLimitKey(namespace, value);

    const { data, error } = await supabaseAdmin.rpc(
        "consume_sandbox_rate_limit",
        {
            p_key_hash: keyHash,
            p_limit: limit,
            p_window_seconds: windowSeconds,
        },
    );

    if (error) {
        // Fail closed: registration must not bypass rate limiting
        // if the database limiter is unavailable.
        throw new Error("Sandbox rate limiting is unavailable.");
    }

    return data === true;
}


function genericError(
    message: string,
    status: number,
): NextResponse {
    return NextResponse.json(
        { success: false, message },
        {
            status,
            headers: {
                "Cache-Control": "no-store",
            },
        },
    );
}


export async function POST(request: NextRequest) {
    try {
        const origin = request.headers.get("origin");

        if (!origin || !getAllowedOrigins().has(origin)) {
            return genericError("Request could not be accepted.", 403);
        }

        const contentType = request.headers.get("content-type") ?? "";

        if (!contentType.toLowerCase().startsWith("application/json")) {
            return genericError("Invalid request format.", 415);
        }

        const contentLength = Number(
            request.headers.get("content-length") ?? "0",
        );

        if (
            !Number.isFinite(contentLength) ||
            contentLength < 0 ||
            contentLength > MAX_BODY_BYTES
        ) {
            return genericError("Request is too large.", 413);
        }

        const rawBody = await request.text();

        if (Buffer.byteLength(rawBody, "utf8") > MAX_BODY_BYTES) {
            return genericError("Request is too large.", 413);
        }

        let body: unknown;

        try {
            body = JSON.parse(rawBody);
        } catch {
            return genericError("Invalid request data.", 400);
        }

        if (!body || typeof body !== "object" || Array.isArray(body)) {
            return genericError("Invalid request data.", 400);
        }

        const input = body as Record<string, unknown>;

        if (
            typeof input.name !== "string" ||
            typeof input.email !== "string" ||
            typeof input.turnstileToken !== "string"
        ) {
            return genericError("Please provide valid registration details.", 400);
        }

        const name = input.name.trim();
        const email = input.email.trim().toLowerCase();
        const turnstileToken = input.turnstileToken.trim();

        if (
            name.length < 1 ||
            name.length > 100 ||
            /[\u0000-\u001F\u007F]/.test(name)
        ) {
            return genericError("Please enter a valid name.", 400);
        }

        if (
            email.length < 3 ||
            email.length > 254 ||
            /[\u0000-\u001F\u007F\s]/.test(email) ||
            !/^[^@]+@[^@]+\.[^@]+$/.test(email)
        ) {
            return genericError("Please enter a valid email address.", 400);
        }

        if (!turnstileToken || turnstileToken.length > 2048) {
            return genericError("Please complete the security check.", 400);
        }

        const clientIp = getClientIp(request);

        // Without a usable IP, reject instead of putting every unknown
        // visitor into one shared rate-limit bucket.
        if (!clientIp) {
            return genericError("Please retry your request.", 400);
        }

        // IP limit: 10 registration attempts per 15 minutes.
        const ipAllowed = await consumeRateLimit(
            "register-ip",
            clientIp,
            10,
            15 * 60,
        );

        if (!ipAllowed) {
            return genericError(
                "Too many attempts. Please try again later.",
                429,
            );
        }

        // Email limit: 5 attempts per hour. Only the HMAC is stored.
        const emailAllowed = await consumeRateLimit(
            "register-email",
            email,
            5,
            60 * 60,
        );

        if (!emailAllowed) {
            return genericError(
                "Too many attempts. Please try again later.",
                429,
            );
        }

        let turnstileValid: boolean;

        try {
            turnstileValid = await verifySandboxTurnstile({
                token: turnstileToken,
                remoteIp: clientIp,
            });
        } catch {
            return genericError(
                "The security service is temporarily unavailable. Please retry.",
                503,
            );
        }

        if (!turnstileValid) {
            return genericError(
                "The security check failed. Please try again.",
                400,
            );
        }

        // Reuse an existing Sandbox visitor without revealing whether
        // the email was previously registered or changing their name.
        const { data: existingVisitor, error: lookupError } =
            await supabaseAdmin
                .from("sandbox_visitors")
                .select("id")
                .eq("email_normalized", email)
                .maybeSingle();

        if (lookupError) {
            throw new Error("Sandbox visitor lookup failed.");
        }

        let visitorId: string;

        if (existingVisitor?.id) {
            visitorId = existingVisitor.id;
        } else {
            const { data: newVisitor, error: insertVisitorError } =
                await supabaseAdmin
                    .from("sandbox_visitors")
                    .insert({
                        full_name: name,
                        email_normalized: email,
                    })
                    .select("id")
                    .single();

            if (insertVisitorError) {
                // Another concurrent request may have inserted this email.
                if (insertVisitorError.code === "23505") {
                    const { data: racedVisitor, error: racedLookupError } =
                        await supabaseAdmin
                            .from("sandbox_visitors")
                            .select("id")
                            .eq("email_normalized", email)
                            .maybeSingle();

                    if (racedLookupError || !racedVisitor?.id) {
                        throw new Error("Sandbox visitor creation failed.");
                    }

                    visitorId = racedVisitor.id;
                } else {
                    throw new Error("Sandbox visitor creation failed.");
                }
            } else {
                visitorId = newVisitor.id;
            }
        }

        // The raw session token exists only in this response cookie.
        // Only its SHA-256 hash is stored in the database.
        const sessionToken = randomBytes(32).toString("base64url");
        const tokenHash = createHash("sha256")
            .update(sessionToken)
            .digest("hex");

        const expiresAt = new Date(
            Date.now() + SESSION_DURATION_SECONDS * 1000,
        ).toISOString();

        const { error: sessionError } = await supabaseAdmin
            .from("sandbox_sessions")
            .insert({
                visitor_id: visitorId,
                token_hash: tokenHash,
                expires_at: expiresAt,
            });

        if (sessionError) {
            throw new Error("Sandbox session creation failed.");
        }

        const response = NextResponse.json(
            {
                success: true,
                message: "You're ready to explore the CareVR Sandbox.",
            },
            {
                status: 200,
                headers: {
                    "Cache-Control": "no-store",
                },
            },
        );

        response.cookies.set({
            name: SESSION_COOKIE,
            value: sessionToken,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: SESSION_DURATION_SECONDS,
        });

        return response;
    } catch {
        // Do not log request bodies, email addresses, tokens, IPs or secrets.
        console.error("[SANDBOX_REGISTER] Registration request failed.");

        return genericError(
            "We couldn't complete your request right now. Please try again.",
            500,
        );
    }
}
