import medicines from "../data/medicineMaster.json";

import type {
    MedicineMaster,
} from "../types/medicineMaster";

import type {
    MedicationRepository,
} from "./medicationRepository";

export class MedicationJsonRepository
    implements MedicationRepository {

    private calculateSimilarity(
        a: string,
        b: string
    ): number {

        a = a.trim().toLowerCase();
        b = b.trim().toLowerCase();

        if (a === b) {
            return 1;
        }

        const matrix: number[][] = [];

        for (let i = 0; i <= b.length; i++) {
            matrix[i] = [i];
        }

        for (let j = 0; j <= a.length; j++) {
            matrix[0][j] = j;
        }

        for (let i = 1; i <= b.length; i++) {

            for (let j = 1; j <= a.length; j++) {

                if (b.charAt(i - 1) === a.charAt(j - 1)) {

                    matrix[i][j] =
                        matrix[i - 1][j - 1];

                } else {

                    matrix[i][j] = Math.min(
                        matrix[i - 1][j - 1] + 1,
                        matrix[i][j - 1] + 1,
                        matrix[i - 1][j] + 1
                    );

                }
            }
        }

        const distance =
            matrix[b.length][a.length];

        const longest =
            Math.max(a.length, b.length);

        return 1 - distance / longest;
    }

private normalize(
    value: string
): string {

    return value
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "");
}


    async search(
        searchText: string
    ): Promise<MedicineMaster[]> {

const search =
    this.normalize(searchText);

if (!search) {
    return [];
}

const searchTerms = searchText
    .split(/[\/|]/)
    .map(term => this.normalize(term))
    .filter(Boolean);
        /*
         * PASS 1
         * Exact / Partial Match
         */

for (const term of searchTerms) {

    const exactMatches =
        medicines.filter(medicine =>
            medicine.searchKeys.some(key =>
                this.normalize(key)
                    .includes(term)
            )
        );

    if (exactMatches.length > 0) {
        return exactMatches.slice(0, 10);
    }

}

        /*
         * PASS 2
         * Similarity Match
         */

let bestMedicine: MedicineMaster | null = null;
let bestScore = 0;

for (const medicine of medicines) {

    for (const key of medicine.searchKeys) {

        for (const term of searchTerms) {

            const score = this.calculateSimilarity(
                term,
                this.normalize(key)
            );

            if (score > bestScore) {

                bestScore = score;
                bestMedicine = medicine;

            }

        }

    }

}

if (
    bestMedicine &&
    bestScore >= 0.88
) {
    return [bestMedicine];
}

return [];
}

    async getById(
        id: string
    ): Promise<MedicineMaster | null> {

        return (
            medicines.find(
                medicine =>
                    medicine.id === id
            ) ?? null
        );
    }
}