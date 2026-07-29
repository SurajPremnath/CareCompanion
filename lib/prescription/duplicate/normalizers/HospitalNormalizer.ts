import { PrescriptionNormalizer } from "../utils/PrescriptionNormalizer";
import { HospitalAliasRepository } from "../repositories/HospitalAliasRepository";

export class HospitalNormalizer {

    static normalize(
    value?: string | null,
): string {

    const normalized =
        PrescriptionNormalizer.normalize(value);

    return (
    HospitalAliasRepository.aliases[
        normalized
    ] ?? normalized
);

}

}