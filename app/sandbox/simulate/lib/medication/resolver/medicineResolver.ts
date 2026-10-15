import type { MedicineMaster } from "../types/medicineMaster";

export interface MedicineResolver {

    search(
        searchText: string
    ): Promise<MedicineMaster[]>;

    getStrengthsByBrandName(
        brandName: string
    ): Promise<string[]>;

}