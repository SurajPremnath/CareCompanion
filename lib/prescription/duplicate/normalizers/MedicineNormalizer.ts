import { PrescriptionNormalizer } from "../utils/PrescriptionNormalizer";
import { MedicineAliasRepository } from "../repositories/MedicineAliasRepository";

export class MedicineNormalizer {

    static normalize(
        value?: string | null,
    ): string {

        const normalized =
            PrescriptionNormalizer.normalize(value);

        return (
            MedicineAliasRepository.aliases[
                normalized
            ] ?? normalized
        );

    }

}