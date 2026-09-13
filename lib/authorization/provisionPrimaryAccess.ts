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
        .select("id, full_name")
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