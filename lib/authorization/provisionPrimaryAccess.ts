import { carevrAccessRepository } from "@/lib/repositories/carevrAccessRepository";
import { carevrModulePermissions } from "@/lib/repositories/carevrModulePermissions";

export async function provisionPrimaryAccess(
    userId: string
): Promise<string> {
    if (!userId) {
        throw new Error("Authenticated user ID is required.");
    }

    // Do not create a second PRIMARY access record.
    const existingAccess =
        await carevrAccessRepository.getActiveAccessForLoginRole(
            userId,
            "SELF"
        );

    if (existingAccess) {
        return existingAccess.id;
    }

    // Create PRIMARY CareVR access for the existing Auth user.
    const carevrAccessId =
        await carevrAccessRepository.createPrimaryAccess(userId);

    // Create the default PRIMARY module permissions.
    await carevrModulePermissions.createPrimaryPermissions(
        carevrAccessId,
        userId
    );

    return carevrAccessId;
}