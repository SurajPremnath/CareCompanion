import { Finding } from "../../core";
import { ValidationSummary } from "./validationSummary";

export interface ValidationResult {

    passed: boolean;

    summary: ValidationSummary;

    findings: Finding[];

}