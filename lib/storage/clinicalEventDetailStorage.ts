import {
    ClinicalEventDetail,
    CreateClinicalEventDetailRequest,
} from "@/lib/types/clinicalEventDetail";

import {
    ClinicalEventDetailRepository,
} from "@/lib/repositories/clinicalEventDetailRepository";


export class ClinicalEventDetailStorage {

    //------------------------------------------------------------
    // Create Clinical Event Detail
    //------------------------------------------------------------

    static async create(
        detail: CreateClinicalEventDetailRequest
    ): Promise<ClinicalEventDetail> {

        return ClinicalEventDetailRepository.create(
            detail
        );

    }

}