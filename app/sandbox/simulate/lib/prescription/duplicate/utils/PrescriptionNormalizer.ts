export class PrescriptionNormalizer {

    static normalize(
        value?: string | null,
    ): string {

        return (value ?? "")
            .toLowerCase()
            .replace(/\./g, "")
            .replace(/\s+/g, " ")
            .trim();

    }

}