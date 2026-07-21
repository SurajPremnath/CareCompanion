import type {
    TreatmentAction,
    TreatmentCategory,
    TreatmentPriority
} from "./treatmentTypes";

export interface TreatmentModel {

    id: string;

    category: TreatmentCategory;

    action: TreatmentAction;

    priority: TreatmentPriority;

    title: string;

    description: string;

    recommendation?: string;

}