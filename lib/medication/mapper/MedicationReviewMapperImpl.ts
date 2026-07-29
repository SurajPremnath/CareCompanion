import type { MedicationReviewMapper } from "./MedicationReviewMapper";
import type { MedicationReviewItem } from "../types/MedicationReviewItem";

export class MedicationReviewMapperImpl
  implements MedicationReviewMapper {

  constructor(

    private extractionMapper: any,

    private resolverMapper: any

  ) {}

  async fromExtraction(
    extraction: unknown
  ): Promise<MedicationReviewItem[]> {

    const extracted =
      this.extractionMapper.map(extraction);

    const results: MedicationReviewItem[] = [];

    for (const item of extracted) {

      const resolved =
        await this.resolverMapper.resolve(
          item.extractedMedicineName
        );

      results.push({

        medicine: resolved.medicine,

        extraction: item,

        resolver: resolved.resolver,

        review: {

          reviewRequired:
            resolved.resolver.confidence < 95,

          status:
            resolved.resolver.confidence >= 95
              ? "AUTO_VERIFIED"
              : "AUTO_VERIFIED"

        },

        audit: {

          createdAt:
            new Date().toISOString()

        }

      });

    }

    return results;

  }

}