import {
  ScenarioCategory,
  ScenarioDetectedChange,
  ScenarioPriority,
} from "./ScenarioTypes";

export class ScenarioRules {

  consultationChanged(): ScenarioDetectedChange {

    return {
      category: ScenarioCategory.CONSULTATION_CHANGE,
      code: "CONSULTATION_CHANGED",
      title: "Consultation changed",
      priority: ScenarioPriority.HIGH,
    };

  }

  medicationChanged(): ScenarioDetectedChange {

    return {
      category: ScenarioCategory.MEDICATION_CHANGE,
      code: "MEDICATION_CHANGED",
      title: "Medication changed",
      priority: ScenarioPriority.CRITICAL,
    };

  }

  diagnosisChanged(): ScenarioDetectedChange {

    return {
      category: ScenarioCategory.DIAGNOSIS_CHANGE,
      code: "DIAGNOSIS_CHANGED",
      title: "Diagnosis changed",
      priority: ScenarioPriority.CRITICAL,
    };

  }

  investigationChanged(): ScenarioDetectedChange {

    return {
      category: ScenarioCategory.INVESTIGATION_CHANGE,
      code: "INVESTIGATION_CHANGED",
      title: "Investigation changed",
      priority: ScenarioPriority.HIGH,
    };

  }

  assessmentChanged(): ScenarioDetectedChange {

    return {
      category: ScenarioCategory.ASSESSMENT_CHANGE,
      code: "ASSESSMENT_CHANGED",
      title: "Assessment changed",
      priority: ScenarioPriority.MEDIUM,
    };

  }

  treatmentChanged(): ScenarioDetectedChange {

    return {
      category: ScenarioCategory.TREATMENT_CHANGE,
      code: "TREATMENT_CHANGED",
      title: "Treatment changed",
      priority: ScenarioPriority.HIGH,
    };

  }

historyChanged() {

  return {
    category: ScenarioCategory.HISTORY_CHANGE,
    code: "HISTORY_CHANGED",
    title: "History changed",
    priority: ScenarioPriority.MEDIUM,
  };

}

}