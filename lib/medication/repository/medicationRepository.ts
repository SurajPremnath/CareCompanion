import type { MedicineMaster } from "../types/medicineMaster";

export interface MedicationRepository {

    search(
        searchText: string
    ): Promise<MedicineMaster[]>;

    getById(
        id: string
    ): Promise<MedicineMaster | null>;

}