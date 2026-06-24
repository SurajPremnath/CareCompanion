export const clearAssessmentData = () => {
  const assessmentKeys = [
    // Assessment Metadata
    "assessmentType",
    "patientName",
    "patientAge",
    "observerName",
    "observerRelationship",
    "assessmentDate",

    // Page 2
    "fever",
    "temperatureChecked",
    "temperatureReading",
    "temperatureUnit",
    "energy",

    // Page 3
    "appetite",
    "water",
    "waterGlasses",

    // Page 4
    "discomfort",
    "discomfortAreas",
    "otherDiscomfort",

    // Page 5
    "walking",
    "walkingHelp",
    "looseMotions",
    "looseMotionType",

    // Report
    "score",
    "riskLevel",
    "summary",
    "reportData",
  ];

  assessmentKeys.forEach((key) => {
    localStorage.removeItem(key);
  });
};