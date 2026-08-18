import { supabase } from "@/lib/supabase";
import type {
    HealthcareFacility,
} from "./healthcareTypes";

export const healthcareRepository = {

    async getActiveFacilities(): Promise<
        HealthcareFacility[]
    > {

        const {
            data,
            error,
        } = await supabase
            .from("healthcare_facilities")
            .select(
                `
                id,
                name,
                facility_type,
                area,
                city,
                state,
                country,
                is_active
                `
            )
            .eq(
                "is_active",
                true
            )
            .order(
                "city",
                {
                    ascending: true,
                }
            )
            .order(
                "name",
                {
                    ascending: true,
                }
            );

        if (error) {
            throw new Error(
                error.message
            );
        }

        return (
            data ?? []
        ).map(
            row => ({
                id: row.id,
                name: row.name,
                facilityType:
                    row.facility_type,
                area: row.area,
                city: row.city,
                state: row.state,
                country: row.country,
                isActive:
                    row.is_active,
            })
        );
    },
};