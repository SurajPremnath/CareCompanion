import type { MedicineMaster } from "../types/medicineMaster";

import type { MedicineResolver } from "./medicineResolver";

import {
    MedicationJsonRepository,
} from "../repository/MedicationJsonRepository";

export class MedicineResolverImpl
    implements MedicineResolver {

    private repository =
        new MedicationJsonRepository();

    async search(
        searchText: string
    ): Promise<MedicineMaster[]> {

        return this.repository.search(
            searchText
        );

    }

}