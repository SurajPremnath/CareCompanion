export enum ScenarioCategory {
  CONSULTATION_CHANGE = "CONSULTATION_CHANGE",
  MEDICATION_CHANGE = "MEDICATION_CHANGE",
  DIAGNOSIS_CHANGE = "DIAGNOSIS_CHANGE",
  INVESTIGATION_CHANGE = "INVESTIGATION_CHANGE",
  ASSESSMENT_CHANGE = "ASSESSMENT_CHANGE",
  TREATMENT_CHANGE = "TREATMENT_CHANGE",
  HISTORY_CHANGE = "HISTORY_CHANGE",
  MULTIPLE_CHANGES = "MULTIPLE_CHANGES",
}

export enum ScenarioPriority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  CRITICAL = "CRITICAL",
}

export interface ScenarioDetectedChange {
  category: ScenarioCategory;
  code: string;
  title: string;
  priority: ScenarioPriority;
}

export interface ScenarioQuestion {
  id: string;
  category: ScenarioCategory;
  question: string;
  options: string[];
}
