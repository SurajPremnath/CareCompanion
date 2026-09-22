import { carevrAccessRepository } from "@/lib/repositories/carevrAccessRepository";
import { carevrModulePermissions } from "@/lib/repositories/carevrModulePermissions";
import { familyRepository } from "@/lib/repositories/familyRepository";
import { supabase } from "@/lib/supabase";

export async function provisionPrimaryAccess(
    userId: string
): Promise<string> {

    if (!userId) {

        throw new Error(
            "Authenticated user ID is required."
        );

    }

    //------------------------------------------------------
    // Resolve the existing user's CareVR profile.
    //
    // The Auth account and Profile already exist because
    // this function is used for an existing invited user
    // establishing a PRIMARY context.
    //------------------------------------------------------

const {
    data: profile,
    error: profileError
} = await supabase
    .from("profiles")
    .select("id, full_name, email")
    .eq("id", userId)
    .maybeSingle();

if (profileError) {

    throw profileError;

}

if (!profile) {

    throw new Error(
        "CareVR user profile could not be found."
    );

}

/*
 * Existing invitees already have an Auth/Profile identity.
 * When an invitee accepts Primary responsibility, establish
 * a temporary profile name from the authenticated email if
 * the profile does not yet have a name.
 *
 * Example:
 * test222@gmail.com -> Test222
 *
 * This is intentionally limited to an empty profile name.
 * A later Profile feature will allow the user to maintain
 * their proper full name.
 */
if (!profile.full_name?.trim() && profile.email?.trim()) {

    const emailLocalPart =
        profile.email
            .trim()
            .split("@")[0]
            .trim();

    const derivedFullName =
        emailLocalPart
            .replace(/[._-]+/g, " ")
            .replace(/\s+/g, " ")
            .trim()
            .replace(/\b\w/g, (character: string) =>
                character.toUpperCase()
            );

    if (derivedFullName) {

        const {
            error: profileUpdateError
        } = await supabase
            .from("profiles")
            .update({
                full_name: derivedFullName,
            })
            .eq("id", userId);

        if (profileUpdateError) {

            throw profileUpdateError;

        }

        profile.full_name = derivedFullName;

    }

}

    //------------------------------------------------------
    // Resolve an existing active PRIMARY access context.
    //------------------------------------------------------

    const existingAccess =
        await carevrAccessRepository.getActiveAccessForLoginRole(
            userId,
            "SELF"
        );

    if (existingAccess) {

        //--------------------------------------------------
        // An active PRIMARY context already exists.
        //
        // If it already has a Family, leave it unchanged.
        // This makes the operation safe to repeat.
        //--------------------------------------------------

        if (existingAccess.familyId) {

            await carevrModulePermissions.createPrimaryPermissions(
                existingAccess.id,
                userId
            );

            return existingAccess.id;

        }

        //--------------------------------------------------
        // Existing PRIMARY access without a Family is the
        // incomplete context created by the previous
        // implementation.
        //
        // Establish a NEW Family for this PRIMARY context.
        //--------------------------------------------------

        const familyId =
            await familyRepository.createFamilyForPrimary(
                userId,
                profile.full_name ?? ""
            );

        const {
            error: accessUpdateError
        } = await supabase
            .from("carevr_access")
            .update({
                family_id: familyId,
            })
            .eq("id", existingAccess.id)
            .eq("user_id", userId)
            .eq("access_type", "PRIMARY")
            .eq("access_status", "ACTIVE");

        if (accessUpdateError) {

            throw accessUpdateError;

        }

        //--------------------------------------------------
        // Establish the Primary's membership in the NEW
        // Family.
        //--------------------------------------------------

        const {
            error: membershipError
        } = await supabase
            .from("family_memberships")
            .upsert(
                {
                    family_id: familyId,
                    user_id: userId,
                    role: "ADMIN",
                    status: "ACTIVE",
                },
                {
                    onConflict: "family_id,user_id",
                }
            );

        if (membershipError) {

            throw membershipError;

        }

        //--------------------------------------------------
        // Create the Primary module permissions according
        // to the existing Primary governance path.
        //--------------------------------------------------

        await carevrModulePermissions.createPrimaryPermissions(
            existingAccess.id,
            userId
        );

        return existingAccess.id;
    }

    //------------------------------------------------------
    // No active PRIMARY access exists.
    //
    // This supports an existing Auth/Profile identity
    // establishing its first PRIMARY context.
    //------------------------------------------------------

    const carevrAccessId =
        await carevrAccessRepository.createPrimaryAccess(
            userId
        );

    //------------------------------------------------------
    // Establish a NEW Family for the PRIMARY context.
    //------------------------------------------------------

    const familyId =
        await familyRepository.createFamilyForPrimary(
            userId,
            profile.full_name ?? ""
        );

    //------------------------------------------------------
    // Attach the PRIMARY access to the NEW Family.
    //------------------------------------------------------

    const {
        error: accessUpdateError
    } = await supabase
        .from("carevr_access")
        .update({
            family_id: familyId,
        })
        .eq("id", carevrAccessId)
        .eq("user_id", userId)
        .eq("access_type", "PRIMARY")
        .eq("access_status", "ACTIVE");

    if (accessUpdateError) {

        throw accessUpdateError;

    }

    //------------------------------------------------------
    // Establish the Primary's membership in the NEW
    // Family.
    //------------------------------------------------------

    const {
        error: membershipError
    } = await supabase
        .from("family_memberships")
        .upsert(
            {
                family_id: familyId,
                user_id: userId,
                role: "ADMIN",
                status: "ACTIVE",
            },
            {
                onConflict: "family_id,user_id",
            }
        );

    if (membershipError) {

        throw membershipError;

    }

    //------------------------------------------------------
    // Create the Primary module permissions.
    //------------------------------------------------------

    await carevrModulePermissions.createPrimaryPermissions(
        carevrAccessId,
        userId
    );

    return carevrAccessId;
}