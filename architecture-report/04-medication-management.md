# Medication Management Audit

Generated: 2026-07-19T10:03:51.797Z

---

## Executive Summary

|Metric|Value|
|------|----:|
|Medication Modules|68|
|Duplicate Symbols|14|

---

## Medication Modules

### app\api\prescription-identity\route.ts

Public : false

Dead : false

Dependencies : 0

Dependents : 0

---

### app\api\prescription-image\route.ts

Public : false

Dead : false

Dependencies : 0

Dependents : 0

---

### app\clinical-review\MedicineChangesCard.tsx

Public : false

Dead : false

Dependencies : 0

Dependents : 0

---

### app\help\medication-management\page.tsx

Public : true

Dead : false

Dependencies : 0

Dependents : 0

---

### app\medications\consultation-mode\page.tsx

Public : true

Dead : false

Dependencies : 0

Dependents : 0

---

### app\medications\page.tsx

Public : true

Dead : false

Dependencies : 0

Dependents : 0

---

### app\medications\prescription\page.tsx

Public : true

Dead : false

Dependencies : 0

Dependents : 0

---

### Components\dashboard\ConsultationWorkspace.tsx

Public : false

Dead : false

Dependencies : 0

Dependents : 0

---

### Components\dashboard\prescription\PrescriptionTabs.tsx

Public : true

Dead : false

Dependencies : 0

Dependents : 1

**Used By**

- Components/dashboard/PrescriptionReview.tsx

---

### Components\dashboard\prescription-review\AssessmentCard.tsx

Public : true

Dead : false

Dependencies : 0

Dependents : 1

**Used By**

- Components/dashboard/PrescriptionReview.tsx

---

### Components\dashboard\prescription-review\ComplaintsCard.tsx

Public : true

Dead : false

Dependencies : 0

Dependents : 1

**Used By**

- Components/dashboard/PrescriptionReview.tsx

---

### Components\dashboard\prescription-review\DoctorInstructionCard.tsx

Public : true

Dead : false

Dependencies : 0

Dependents : 1

**Used By**

- Components/dashboard/PrescriptionReview.tsx

---

### Components\dashboard\prescription-review\HistoryCard.tsx

Public : true

Dead : false

Dependencies : 0

Dependents : 1

**Used By**

- Components/dashboard/PrescriptionReview.tsx

---

### Components\dashboard\prescription-review\InvestigationCard.tsx

Public : true

Dead : false

Dependencies : 0

Dependents : 1

**Used By**

- Components/dashboard/PrescriptionReview.tsx

---

### Components\dashboard\prescription-review\MedicineCard.tsx

Public : true

Dead : false

Dependencies : 0

Dependents : 1

**Used By**

- Components/dashboard/PrescriptionReview.tsx

---

### Components\dashboard\prescription-review\OtherNotesCard.tsx

Public : true

Dead : false

Dependencies : 0

Dependents : 1

**Used By**

- Components/dashboard/PrescriptionReview.tsx

---

### Components\dashboard\prescription-review\PatientCard.tsx

Public : true

Dead : false

Dependencies : 0

Dependents : 1

**Used By**

- Components/dashboard/PrescriptionReview.tsx

---

### Components\dashboard\prescription-review\ReviewActions.tsx

Public : true

Dead : false

Dependencies : 0

Dependents : 1

**Used By**

- Components/dashboard/PrescriptionReview.tsx

---

### Components\dashboard\prescription-review\VitalsCard.tsx

Public : true

Dead : false

Dependencies : 0

Dependents : 1

**Used By**

- Components/dashboard/PrescriptionReview.tsx

---

### Components\dashboard\PrescriptionDetailsPanel.tsx

Public : false

Dead : false

Dependencies : 0

Dependents : 0

---

### Components\dashboard\PrescriptionHistoryWorkspace.tsx

Public : false

Dead : false

Dependencies : 0

Dependents : 0

---

### Components\dashboard\PrescriptionReview.tsx

Public : false

Dead : false

Dependencies : 11

Dependents : 0

**Dependencies**

- Components/dashboard/prescription/PrescriptionTabs.tsx
- Components/dashboard/prescription-review/HistoryCard.tsx
- Components/dashboard/prescription-review/AssessmentCard.tsx
- Components/dashboard/prescription-review/InvestigationCard.tsx
- Components/dashboard/prescription-review/DoctorInstructionCard.tsx
- Components/dashboard/prescription-review/OtherNotesCard.tsx
- Components/dashboard/prescription-review/ComplaintsCard.tsx
- Components/dashboard/prescription-review/PatientCard.tsx
- Components/dashboard/prescription-review/VitalsCard.tsx
- Components/dashboard/prescription-review/ReviewActions.tsx
- Components/dashboard/prescription-review/MedicineCard.tsx

---

### Components\dashboard\PrescriptionWorkspace.styles.ts

Public : true

Dead : false

Dependencies : 0

Dependents : 1

**Used By**

- Components/dashboard/PrescriptionWorkspace.tsx

---

### Components\dashboard\PrescriptionWorkspace.tsx

Public : false

Dead : false

Dependencies : 1

Dependents : 0

**Dependencies**

- Components/dashboard/PrescriptionWorkspace.styles.ts

---

### lib\journey\classification\consultationClassifier.ts

Public : false

Dead : false

Dependencies : 0

Dependents : 0

---

### lib\journey\comparison\prescriptionComparator.ts

Public : false

Dead : false

Dependencies : 1

Dependents : 0

**Dependencies**

- lib/journey/comparison/comparisonTypes.ts

---

### lib\journey\consultation\consultationEngine.ts

Public : false

Dead : false

Dependencies : 4

Dependents : 0

**Dependencies**

- lib/journey/consultation/consultationTypes.ts
- lib/journey/consultation/consultationValidator.ts
- lib/journey/consultation/consultationResolver.ts
- lib/journey/consultation/consultationMapper.ts

---

### lib\journey\consultation\consultationMapper.ts

Public : true

Dead : false

Dependencies : 1

Dependents : 1

**Dependencies**

- lib/journey/consultation/consultationTypes.ts

**Used By**

- lib/journey/consultation/consultationEngine.ts

---

### lib\journey\consultation\consultationResolver.ts

Public : true

Dead : false

Dependencies : 1

Dependents : 1

**Dependencies**

- lib/journey/consultation/consultationTypes.ts

**Used By**

- lib/journey/consultation/consultationEngine.ts

---

### lib\journey\consultation\consultationTypes.ts

Public : true

Dead : false

Dependencies : 0

Dependents : 3

**Used By**

- lib/journey/consultation/consultationEngine.ts
- lib/journey/consultation/consultationMapper.ts
- lib/journey/consultation/consultationResolver.ts

---

### lib\journey\consultation\consultationValidator.ts

Public : true

Dead : false

Dependencies : 0

Dependents : 1

**Used By**

- lib/journey/consultation/consultationEngine.ts

---

### lib\journey\consultation\index.ts

Public : false

Dead : false

Dependencies : 0

Dependents : 0

---

### lib\prescription\prescriptionMapper.ts

Public : false

Dead : false

Dependencies : 0

Dependents : 0

---

### lib\prescription\prescriptionRepository.ts

Public : false

Dead : false

Dependencies : 0

Dependents : 0

---

### lib\prescription\prescriptionReviewMapper.ts

Public : false

Dead : false

Dependencies : 0

Dependents : 0

---

### lib\prescription\prescriptionStorage.ts

Public : false

Dead : false

Dependencies : 0

Dependents : 0

---

### lib\prescription\prescriptionTypes.ts

Public : false

Dead : false

Dependencies : 0

Dependents : 0

---

### lib\prescription\prescriptionValidator.ts

Public : false

Dead : false

Dependencies : 0

Dependents : 0

---

### lib\prescription-ai\classification\clinicalRouter.ts

Public : false

Dead : false

Dependencies : 0

Dependents : 0

---

### lib\prescription-ai\consultation\assessmentRules.ts

Public : true

Dead : false

Dependencies : 0

Dependents : 1

**Used By**

- lib/prescription-ai/consultation/consultationPromptBuilder.ts

---

### lib\prescription-ai\consultation\complaintsRules.ts

Public : true

Dead : false

Dependencies : 0

Dependents : 1

**Used By**

- lib/prescription-ai/consultation/consultationPromptBuilder.ts

---

### lib\prescription-ai\consultation\consultationPromptBuilder.ts

Public : true

Dead : false

Dependencies : 7

Dependents : 1

**Dependencies**

- lib/prescription-ai/consultation/complaintsRules.ts
- lib/prescription-ai/consultation/vitalsRules.ts
- lib/prescription-ai/consultation/historyRules.ts
- lib/prescription-ai/consultation/examinationRules.ts
- lib/prescription-ai/consultation/assessmentRules.ts
- lib/prescription-ai/consultation/investigationRules.ts
- lib/prescription-ai/consultation/doctorInstructionRules.ts

**Used By**

- lib/prescription-ai/extractionInstructions.ts

---

### lib\prescription-ai\consultation\doctorInstructionRules.ts

Public : true

Dead : false

Dependencies : 0

Dependents : 1

**Used By**

- lib/prescription-ai/consultation/consultationPromptBuilder.ts

---

### lib\prescription-ai\consultation\examinationRules.ts

Public : true

Dead : false

Dependencies : 0

Dependents : 1

**Used By**

- lib/prescription-ai/consultation/consultationPromptBuilder.ts

---

### lib\prescription-ai\consultation\historyRules.ts

Public : true

Dead : false

Dependencies : 0

Dependents : 1

**Used By**

- lib/prescription-ai/consultation/consultationPromptBuilder.ts

---

### lib\prescription-ai\consultation\investigationRules.ts

Public : true

Dead : false

Dependencies : 0

Dependents : 1

**Used By**

- lib/prescription-ai/consultation/consultationPromptBuilder.ts

---

### lib\prescription-ai\consultation\vitalsRules.ts

Public : true

Dead : false

Dependencies : 0

Dependents : 1

**Used By**

- lib/prescription-ai/consultation/consultationPromptBuilder.ts

---

### lib\prescription-ai\examples\cardiologyExamples.ts

Public : true

Dead : false

Dependencies : 1

Dependents : 1

**Dependencies**

- lib/prescription-ai/prescriptionExamples.ts

**Used By**

- lib/prescription-ai/examples/index.ts

---

### lib\prescription-ai\examples\consultationExamples.ts

Public : true

Dead : false

Dependencies : 1

Dependents : 1

**Dependencies**

- lib/prescription-ai/prescriptionExamples.ts

**Used By**

- lib/prescription-ai/examples/index.ts

---

### lib\prescription-ai\examples\diabetesExamples.ts

Public : true

Dead : false

Dependencies : 1

Dependents : 1

**Dependencies**

- lib/prescription-ai/prescriptionExamples.ts

**Used By**

- lib/prescription-ai/examples/index.ts

---

### lib\prescription-ai\examples\generalMedicineExamples.ts

Public : true

Dead : false

Dependencies : 1

Dependents : 1

**Dependencies**

- lib/prescription-ai/prescriptionExamples.ts

**Used By**

- lib/prescription-ai/examples/index.ts

---

### lib\prescription-ai\examples\index.ts

Public : true

Dead : false

Dependencies : 6

Dependents : 1

**Dependencies**

- lib/prescription-ai/examples/consultationExamples.ts
- lib/prescription-ai/examples/generalMedicineExamples.ts
- lib/prescription-ai/examples/oncologyExamples.ts
- lib/prescription-ai/examples/cardiologyExamples.ts
- lib/prescription-ai/examples/diabetesExamples.ts
- lib/prescription-ai/examples/pulmonologyExamples.ts

**Used By**

- lib/prescription-ai/extractionInstructions.ts

---

### lib\prescription-ai\examples\oncologyExamples.ts

Public : true

Dead : false

Dependencies : 1

Dependents : 1

**Dependencies**

- lib/prescription-ai/prescriptionExamples.ts

**Used By**

- lib/prescription-ai/examples/index.ts

---

### lib\prescription-ai\examples\pulmonologyExamples.ts

Public : true

Dead : false

Dependencies : 1

Dependents : 1

**Dependencies**

- lib/prescription-ai/prescriptionExamples.ts

**Used By**

- lib/prescription-ai/examples/index.ts

---

### lib\prescription-ai\extractionInstructions.ts

Public : false

Dead : false

Dependencies : 5

Dependents : 0

**Dependencies**

- lib/prescription-ai/prescriptionKnowledge.ts
- lib/prescription-ai/prescriptionReadingRules.ts
- lib/prescription-ai/prescriptionRecognitionRules.ts
- lib/prescription-ai/examples/index.ts
- lib/prescription-ai/consultation/consultationPromptBuilder.ts

---

### lib\prescription-ai\identityExtractionInstructions.ts

Public : false

Dead : false

Dependencies : 0

Dependents : 0

---

### lib\prescription-ai\medicines\dosageRules.ts

Public : false

Dead : false

Dependencies : 0

Dependents : 0

---

### lib\prescription-ai\medicines\durationRules.ts

Public : false

Dead : false

Dependencies : 0

Dependents : 0

---

### lib\prescription-ai\medicines\frequencyRules.ts

Public : false

Dead : false

Dependencies : 0

Dependents : 0

---

### lib\prescription-ai\medicines\medicineAssociationRules.ts

Public : false

Dead : false

Dependencies : 0

Dependents : 0

---

### lib\prescription-ai\medicines\timingRules.ts

Public : false

Dead : false

Dependencies : 0

Dependents : 0

---

### lib\prescription-ai\models\consultationModel.ts

Public : false

Dead : false

Dependencies : 0

Dependents : 0

---

### lib\prescription-ai\prescriptionExamples.ts

Public : true

Dead : false

Dependencies : 0

Dependents : 6

**Used By**

- lib/prescription-ai/examples/cardiologyExamples.ts
- lib/prescription-ai/examples/consultationExamples.ts
- lib/prescription-ai/examples/diabetesExamples.ts
- lib/prescription-ai/examples/generalMedicineExamples.ts
- lib/prescription-ai/examples/oncologyExamples.ts
- lib/prescription-ai/examples/pulmonologyExamples.ts

---

### lib\prescription-ai\prescriptionKnowledge.ts

Public : true

Dead : false

Dependencies : 0

Dependents : 1

**Used By**

- lib/prescription-ai/extractionInstructions.ts

---

### lib\prescription-ai\prescriptionReadingRules.ts

Public : true

Dead : false

Dependencies : 0

Dependents : 1

**Used By**

- lib/prescription-ai/extractionInstructions.ts

---

### lib\prescription-ai\prescriptionRecognitionRules.ts

Public : true

Dead : false

Dependencies : 0

Dependents : 1

**Used By**

- lib/prescription-ai/extractionInstructions.ts

---

### lib\prescription-image\prescriptionImageService.ts

Public : false

Dead : false

Dependencies : 1

Dependents : 0

**Dependencies**

- lib/prescription-image/prescriptionImageTypes.ts

---

### lib\prescription-image\prescriptionImageTypes.ts

Public : true

Dead : false

Dependencies : 0

Dependents : 1

**Used By**

- lib/prescription-image/prescriptionImageService.ts

---

## Duplicate Medication Symbols

### MedicationManagementPage

Severity : Medium

**Files**

- app\help\medication-management\page.tsx
- app\medications\page.tsx

**Recommendation**

Consolidate duplicate symbol into a single canonical implementation.

---

### MedicineCard

Severity : Medium

**Files**

- app\journey-review\ActiveTreatmentCard.tsx
- Components\dashboard\prescription-review\MedicineCard.tsx

**Recommendation**

Consolidate duplicate symbol into a single canonical implementation.

---

### MedicineField

Severity : Medium

**Files**

- app\journey-review\ActiveTreatmentCard.tsx
- lib\clinical-intelligence\comparisonTypes.ts

**Recommendation**

Consolidate duplicate symbol into a single canonical implementation.

---

### ConsultationMode

Severity : Critical

**Files**

- app\medications\consultation-mode\page.tsx
- lib\journey\journeyTypes.ts
- lib\prescription-ai\models\consultationModel.ts
- lib\prescription-image\prescriptionImageTypes.ts
- lib\treatment\treatmentTypes.ts

**Recommendation**

Consolidate duplicate symbol into a single canonical implementation.

---

### ConsultationValidator

Severity : Medium

**Files**

- lib\journey\consultation\consultationResolver.ts
- lib\journey\consultation\consultationValidator.ts

**Recommendation**

Consolidate duplicate symbol into a single canonical implementation.

---

### ConsultationSource

Severity : High

**Files**

- lib\journey\consultation\consultationTypes.ts
- lib\journey\journeyAnalysisModels.ts
- lib\journey\journeyTypes.ts
- lib\treatment\treatmentTypes.ts

**Recommendation**

Consolidate duplicate symbol into a single canonical implementation.

---

### ConsultationContext

Severity : Medium

**Files**

- lib\journey\consultation\consultationTypes.ts
- lib\journey\journeyAnalysisModels.ts

**Recommendation**

Consolidate duplicate symbol into a single canonical implementation.

---

### MedicationManagementPage

Severity : Medium

**Files**

- app\help\medication-management\page.tsx
- app\medications\page.tsx

**Recommendation**

Consolidate duplicate symbol into a single canonical implementation.

---

### MedicineCard

Severity : Medium

**Files**

- app\journey-review\ActiveTreatmentCard.tsx
- Components\dashboard\prescription-review\MedicineCard.tsx

**Recommendation**

Consolidate duplicate symbol into a single canonical implementation.

---

### MedicineField

Severity : Medium

**Files**

- app\journey-review\ActiveTreatmentCard.tsx
- lib\clinical-intelligence\comparisonTypes.ts

**Recommendation**

Consolidate duplicate symbol into a single canonical implementation.

---

### ConsultationMode

Severity : Critical

**Files**

- app\medications\consultation-mode\page.tsx
- lib\journey\journeyTypes.ts
- lib\prescription-ai\models\consultationModel.ts
- lib\prescription-image\prescriptionImageTypes.ts
- lib\treatment\treatmentTypes.ts

**Recommendation**

Consolidate duplicate symbol into a single canonical implementation.

---

### ConsultationValidator

Severity : Medium

**Files**

- lib\journey\consultation\consultationResolver.ts
- lib\journey\consultation\consultationValidator.ts

**Recommendation**

Consolidate duplicate symbol into a single canonical implementation.

---

### ConsultationSource

Severity : High

**Files**

- lib\journey\consultation\consultationTypes.ts
- lib\journey\journeyAnalysisModels.ts
- lib\journey\journeyTypes.ts
- lib\treatment\treatmentTypes.ts

**Recommendation**

Consolidate duplicate symbol into a single canonical implementation.

---

### ConsultationContext

Severity : Medium

**Files**

- lib\journey\consultation\consultationTypes.ts
- lib\journey\journeyAnalysisModels.ts

**Recommendation**

Consolidate duplicate symbol into a single canonical implementation.

---

## Initial Recommendations

- Consolidate duplicate medication models.
- Eliminate dead medication modules.
- Introduce a single canonical Medication Service.
- Ensure repository and storage follow the UI → Storage → Repository architecture.
- Validate Timeline integration before refactoring.
- Avoid introducing parallel medication workflows.
