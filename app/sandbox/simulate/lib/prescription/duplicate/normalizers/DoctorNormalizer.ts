import { PrescriptionNormalizer } from "../utils/PrescriptionNormalizer";
import { DoctorAliasRepository } from "../repositories/DoctorAliasRepository";

export class DoctorNormalizer {

    static normalize(
        value?: string | null,
    ): string {

        const normalized =
            PrescriptionNormalizer.normalize(value);

        return (
            DoctorAliasRepository.aliases[
                normalized
            ] ?? normalized
        );

    }

}