
import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { profileRepository } from "@/lib/repositories/profileRepository";
import { sendContactSupportEmail } from "@/lib/email/contactSupportEmailService";

export const runtime = "nodejs";

const MAX_ATTACHMENT_SIZE = 500 * 1024;

const allowedCategories = new Set([
    "Account and Login",
    "PIN and Security",
    "Family and Patient Profiles",
    "Health Records and Reports",
    "Invitations and Access",
    "Technical Issue",
    "Other",
]);

const allowedImageTypes = new Set([
    "image/jpeg",
    "image/png",
    "image/webp",
]);

export async function POST(request: Request) {
    try {
        const supabase = await createSupabaseServerClient();

        const {
            data: { user },
            error: authError,
        } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json(
                { success: false, error: "Please sign in to contact support." },
                { status: 401 }
            );
        }

        const formData = await request.formData();

        const category = String(formData.get("category") ?? "").trim();
        const subject = String(formData.get("subject") ?? "").trim();
        const message = String(formData.get("message") ?? "").trim();
        const uploaded = formData.get("attachment");

        if (!allowedCategories.has(category)) {
            return NextResponse.json(
                { success: false, error: "Please select a valid support category." },
                { status: 400 }
            );
        }

        if (subject.length < 3 || subject.length > 120) {
            return NextResponse.json(
                { success: false, error: "Subject must be between 3 and 120 characters." },
                { status: 400 }
            );
        }

        if (message.length < 10 || message.length > 5000) {
            return NextResponse.json(
                { success: false, error: "Message must be between 10 and 5000 characters." },
                { status: 400 }
            );
        }

        let attachment:
            | {
                  filename: string;
                  content: Buffer;
                  contentType: string;
              }
            | undefined;

        if (uploaded instanceof File && uploaded.size > 0) {
            if (!allowedImageTypes.has(uploaded.type)) {
                return NextResponse.json(
                    { success: false, error: "Attach a JPEG, PNG, or WebP image." },
                    { status: 400 }
                );
            }

            if (uploaded.size > MAX_ATTACHMENT_SIZE) {
                return NextResponse.json(
                    {
                        success: false,
                        error: "The attachment exceeds 500 KB. Please compress the image and try again.",
                    },
                    { status: 413 }
                );
            }

            const safeFilename = uploaded.name
                .replace(/[^a-zA-Z0-9._-]/g, "_")
                .slice(-100) || "support-attachment";

            attachment = {
                filename: safeFilename,
                content: Buffer.from(await uploaded.arrayBuffer()),
                contentType: uploaded.type,
            };
        } else if (uploaded !== null && !(uploaded instanceof File)) {
            return NextResponse.json(
                { success: false, error: "Invalid attachment." },
                { status: 400 }
            );
        }

        const profile = await profileRepository.getCurrentProfile();

        const name =
            typeof profile?.fullName === "string" && profile.fullName.trim()
                ? profile.fullName.trim()
                : typeof user.user_metadata?.full_name === "string"
                  ? user.user_metadata.full_name.trim()
                  : "CareVR User";

        const email = user.email?.trim().toLowerCase();

        if (!email) {
            return NextResponse.json(
                { success: false, error: "Your registered email address is unavailable." },
                { status: 400 }
            );
        }

        // Temporary reference only; no database ticket record is created yet.
        const ticketNumber =
            `CV-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-` +
            randomBytes(4).toString("hex").toUpperCase();

        await sendContactSupportEmail({
            name,
            email,
            category,
            subject,
            message,
            ticketNumber,
            attachment,
        });

        return NextResponse.json({
            success: true,
            ticketNumber,
        });
    } catch (error) {
        console.error("Contact support submission failed.", error);

        return NextResponse.json(
            {
                success: false,
                error: "We could not complete your support request. Please try again later.",
            },
            { status: 500 }
        );
    }
}
