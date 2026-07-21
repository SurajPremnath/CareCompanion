import type {

    ClinicalRisk,

    ClinicalSummarySection

} from "./clinicalSummaryTypes";

export interface ClinicalSummaryModel {

    id: string;

    section: ClinicalSummarySection;

    risk: ClinicalRisk;

    title: string;

    summary: string;

}