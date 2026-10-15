import type {
    MedicationReviewItem,
    ResolverTrace,
} from "../types";

export interface MedicationResolverResult {

    item: MedicationReviewItem;

    resolver: ResolverTrace;

}

export interface MedicationResolverMapper {

  resolve(
    extraction: string
  ): Promise<MedicationResolverResult>;

}