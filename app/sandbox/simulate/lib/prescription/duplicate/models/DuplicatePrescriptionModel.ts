import { DuplicateMedicineModel } from "./DuplicateMedicineModel";

export interface DuplicatePrescriptionModel {

    consultationDate?: string;

    doctorName: string;

    hospitalName: string;

    diagnosis: string;

    medicines: DuplicateMedicineModel[];

}