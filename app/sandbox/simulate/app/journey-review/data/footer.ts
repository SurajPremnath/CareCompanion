import { FooterViewModel } from "../components/types";

export function buildFooter(): FooterViewModel {
    return {
        generatedAt: new Date().toISOString(),
        generatedBy: "CareVR",
        version: "1.0",
    };
}