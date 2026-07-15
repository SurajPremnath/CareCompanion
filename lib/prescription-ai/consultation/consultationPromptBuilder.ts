import { COMPLAINTS_RULES } from "./complaintsRules";
import { VITALS_RULES } from "./vitalsRules";
import { HISTORY_RULES } from "./historyRules";
import { EXAMINATION_RULES } from "./examinationRules";
import { ASSESSMENT_RULES } from "./assessmentRules";
import { INVESTIGATION_RULES } from "./investigationRules";
import { DOCTOR_INSTRUCTION_RULES } from "./doctorInstructionRules";

export function buildConsultationPrompt(): string {
    return `
===========================================================
CONSULTATION UNDERSTANDING ENGINE
===========================================================

${VITALS_RULES}

${COMPLAINTS_RULES}

${HISTORY_RULES}

${EXAMINATION_RULES}

${ASSESSMENT_RULES}

${INVESTIGATION_RULES}

${DOCTOR_INSTRUCTION_RULES}

===========================================================
END OF CONSULTATION UNDERSTANDING ENGINE
===========================================================
`;
}