import { supabase } from "@/lib/supabase";

import {
    ClinicalEventDetail,
    CreateClinicalEventDetailRequest,
} from "@/lib/types/clinicalEventDetail";

import {
    ClinicalEventDetailMapper,
} from "@/lib/mappers/clinicalEventDetailMapper";


export class ClinicalEventDetailRepository {

    //------------------------------------------------------------
    // Create
    //------------------------------------------------------------

    static async create(
        detail: CreateClinicalEventDetailRequest
    ): Promise<ClinicalEventDetail> {

        const { data, error } =
            await supabase
                .from("clinical_event_details")
                .insert(
                    ClinicalEventDetailMapper.toInsert(
                        detail
                    )
                )
                .select("*")
                .single();

        if (error) {
            throw new Error(error.message);
        }

        return ClinicalEventDetailMapper.toDomain(
            data
        );

    }

}