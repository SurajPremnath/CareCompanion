# Public API Analysis

## Summary

|Metric|Value|
|------|----:|
|Modules|433|
|Public|182|
|Internal|251|
|Dead|9|
|Medication|68|
|Validation Issues|68|

---

## app\add-patient\page.tsx

**Public:** true

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## app\admin\performance\page.tsx

**Public:** true

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## app\api\analytics\auth-session\login\route.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## app\api\analytics\auth-session\logout\route.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## app\api\analytics\event\route.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## app\api\medical-image\route.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## app\api\medical-voice\route.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## app\api\prescription-identity\route.ts

**Public:** false

**Dead:** false

**Medication:** true

Dependencies : 0

Dependents : 0

---

## app\api\prescription-image\route.ts

**Public:** false

**Dead:** false

**Medication:** true

Dependencies : 0

Dependents : 0

---

## app\auth\callback\route.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## app\care\page.tsx

**Public:** true

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## app\carevr-journey\page.tsx

**Public:** true

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## app\checkin\page.tsx

**Public:** true

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## app\clinical-review\AssessmentChangesCard.tsx

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## app\clinical-review\ChangeBadge.tsx

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## app\clinical-review\ClinicalReviewHeader.tsx

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## app\clinical-review\ClinicalSummaryCard.tsx

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## app\clinical-review\ComparisonValue.tsx

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## app\clinical-review\ComplaintChangesCard.tsx

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## app\clinical-review\ConfidenceCard.tsx

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## app\clinical-review\EmptyComparison.tsx

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## app\clinical-review\FollowUpCard.tsx

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## app\clinical-review\InvestigationChangesCard.tsx

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## app\clinical-review\MedicineChangesCard.tsx

**Public:** false

**Dead:** false

**Medication:** true

Dependencies : 0

Dependents : 0

---

## app\clinical-review\ReviewFooter.tsx

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## app\clinical-review\VitalChangesCard.tsx

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## app\components\AppBrand.tsx

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## app\components\AppHeader.tsx

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## app\components\common\ClinicalSummaryCard.tsx

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## app\components\common\ReportNavigation.tsx

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## app\components\dashboard\HelpWorkspace.tsx

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## app\components\ReportTable.tsx

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## app\components\TrendChart.tsx

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 1

Dependents : 0

**Dependencies**

- app/components/TrendLineChart.tsx

---

## app\components\TrendLineChart.tsx

**Public:** true

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 1

**Dependents**

- app/components/TrendChart.tsx

---

## app\consent\page.tsx

**Public:** true

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## app\daily-care\components\ActionButtons.tsx

**Public:** true

**Dead:** false

**Medication:** false

Dependencies : 1

Dependents : 1

**Dependencies**

- app/daily-care/styles.ts

**Dependents**

- app/daily-care/components/DailyCareForm.tsx

---

## app\daily-care\components\DailyCareForm.tsx

**Public:** true

**Dead:** false

**Medication:** false

Dependencies : 6

Dependents : 1

**Dependencies**

- app/daily-care/components/PatientCard.tsx
- app/daily-care/components/TemperatureCard.tsx
- app/daily-care/components/VitalsCard.tsx
- app/daily-care/components/SymptomsCard.tsx
- app/daily-care/components/PainLocationCard.tsx
- app/daily-care/components/ActionButtons.tsx

**Dependents**

- app/daily-care/page.tsx

---

## app\daily-care\components\PainLocationCard.tsx

**Public:** true

**Dead:** false

**Medication:** false

Dependencies : 1

Dependents : 1

**Dependencies**

- app/daily-care/styles.ts

**Dependents**

- app/daily-care/components/DailyCareForm.tsx

---

## app\daily-care\components\PatientCard.tsx

**Public:** true

**Dead:** false

**Medication:** false

Dependencies : 1

Dependents : 1

**Dependencies**

- app/daily-care/styles.ts

**Dependents**

- app/daily-care/components/DailyCareForm.tsx

---

## app\daily-care\components\SymptomsCard.tsx

**Public:** true

**Dead:** false

**Medication:** false

Dependencies : 1

Dependents : 1

**Dependencies**

- app/daily-care/styles.ts

**Dependents**

- app/daily-care/components/DailyCareForm.tsx

---

## app\daily-care\components\TemperatureCard.tsx

**Public:** true

**Dead:** false

**Medication:** false

Dependencies : 1

Dependents : 1

**Dependencies**

- app/daily-care/styles.ts

**Dependents**

- app/daily-care/components/DailyCareForm.tsx

---

## app\daily-care\components\VitalsCard.tsx

**Public:** true

**Dead:** false

**Medication:** false

Dependencies : 1

Dependents : 1

**Dependencies**

- app/daily-care/styles.ts

**Dependents**

- app/daily-care/components/DailyCareForm.tsx

---

## app\daily-care\page.tsx

**Public:** true

**Dead:** false

**Medication:** false

Dependencies : 1

Dependents : 0

**Dependencies**

- app/daily-care/components/DailyCareForm.tsx

---

## app\daily-care\styles.ts

**Public:** true

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 6

**Dependents**

- app/daily-care/components/ActionButtons.tsx
- app/daily-care/components/PainLocationCard.tsx
- app/daily-care/components/PatientCard.tsx
- app/daily-care/components/SymptomsCard.tsx
- app/daily-care/components/TemperatureCard.tsx
- app/daily-care/components/VitalsCard.tsx

---

## app\dashboard\page.tsx

**Public:** true

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## app\family\page.tsx

**Public:** true

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## app\family\page2\page.tsx

**Public:** true

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## app\family\page3\page.tsx

**Public:** true

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## app\family\page4\page.tsx

**Public:** true

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## app\family\page5\page.tsx

**Public:** true

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## app\forgot-password\page.tsx

**Public:** true

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## app\help\about\page.tsx

**Public:** true

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## app\help\assessments\page.tsx

**Public:** true

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## app\help\clinical-trends\page.tsx

**Public:** true

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## app\help\daily-care\page.tsx

**Public:** true

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## app\help\faq\page.tsx

**Public:** true

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## app\help\getting-started\page.tsx

**Public:** true

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## app\help\layout.tsx

**Public:** true

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## app\help\medication-management\page.tsx

**Public:** true

**Dead:** false

**Medication:** true

Dependencies : 0

Dependents : 0

---

## app\help\page.tsx

**Public:** true

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## app\help\pdf-reports\page.tsx

**Public:** true

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## app\help\privacy\page.tsx

**Public:** true

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## app\help\reports\page.tsx

**Public:** true

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## app\journey-review\ActiveTreatmentCard.tsx

**Public:** true

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 1

**Dependents**

- app/journey-review/JourneyReview.tsx

---

## app\journey-review\ChangeCard.tsx

**Public:** true

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 1

**Dependents**

- app/journey-review/JourneyDetectedChanges.tsx

---

## app\journey-review\EmptyJourney.tsx

**Public:** true

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 1

**Dependents**

- app/journey-review/JourneyReview.tsx

---

## app\journey-review\index.ts

**Public:** true

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 1

**Dependents**

- app/journey-review/JourneyWizard.tsx

---

## app\journey-review\JourneyActions.tsx

**Public:** true

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 1

**Dependents**

- app/journey-review/JourneyReview.tsx

---

## app\journey-review\JourneyComplete.tsx

**Public:** true

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 1

**Dependents**

- app/journey-review/JourneyWizard.tsx

---

## app\journey-review\JourneyConfidence.tsx

**Public:** true

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 1

**Dependents**

- app/journey-review/JourneyReview.tsx

---

## app\journey-review\JourneyContext.tsx

**Public:** true

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 1

**Dependents**

- app/journey-review/JourneyWizard.tsx

---

## app\journey-review\JourneyDetectedChanges.tsx

**Public:** true

**Dead:** false

**Medication:** false

Dependencies : 1

Dependents : 1

**Dependencies**

- app/journey-review/ChangeCard.tsx

**Dependents**

- app/journey-review/JourneyReview.tsx

---

## app\journey-review\JourneyHeader.tsx

**Public:** true

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 1

**Dependents**

- app/journey-review/JourneyReview.tsx

---

## app\journey-review\JourneyQuestions.tsx

**Public:** true

**Dead:** false

**Medication:** false

Dependencies : 1

Dependents : 1

**Dependencies**

- app/journey-review/QuestionCard.tsx

**Dependents**

- app/journey-review/JourneyReview.tsx

---

## app\journey-review\JourneyReview.tsx

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 11

Dependents : 0

**Dependencies**

- app/journey-review/JourneyHeader.tsx
- app/journey-review/JourneyConfidence.tsx
- app/journey-review/JourneySummaryCard.tsx
- app/journey-review/JourneyDetectedChanges.tsx
- app/journey-review/JourneyQuestions.tsx
- app/journey-review/TreatmentDecisionCard.tsx
- app/journey-review/ActiveTreatmentCard.tsx
- app/journey-review/JourneyTimeline.tsx
- app/journey-review/JourneyActions.tsx
- app/journey-review/EmptyJourney.tsx
- app/journey-review/LoadingJourney.tsx

---

## app\journey-review\JourneySummaryCard.tsx

**Public:** true

**Dead:** false

**Medication:** false

Dependencies : 1

Dependents : 1

**Dependencies**

- app/journey-review/SummaryCard.tsx

**Dependents**

- app/journey-review/JourneyReview.tsx

---

## app\journey-review\JourneyTimeline.tsx

**Public:** true

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 1

**Dependents**

- app/journey-review/JourneyReview.tsx

---

## app\journey-review\JourneyWizard.tsx

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 4

Dependents : 0

**Dependencies**

- app/journey-review/JourneyContext.tsx
- app/journey-review/index.ts
- app/journey-review/TimelinePreview.tsx
- app/journey-review/JourneyComplete.tsx

---

## app\journey-review\LoadingJourney.tsx

**Public:** true

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 1

**Dependents**

- app/journey-review/JourneyReview.tsx

---

## app\journey-review\QuestionCard.tsx

**Public:** true

**Dead:** false

**Medication:** false

Dependencies : 1

Dependents : 1

**Dependencies**

- app/journey-review/QuestionRenderer.tsx

**Dependents**

- app/journey-review/JourneyQuestions.tsx

---

## app\journey-review\QuestionRenderer.tsx

**Public:** true

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 1

**Dependents**

- app/journey-review/QuestionCard.tsx

---

## app\journey-review\SummaryCard.tsx

**Public:** true

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 1

**Dependents**

- app/journey-review/JourneySummaryCard.tsx

---

## app\journey-review\TimelinePreview.tsx

**Public:** true

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 1

**Dependents**

- app/journey-review/JourneyWizard.tsx

---

## app\journey-review\TreatmentDecisionCard.tsx

**Public:** true

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 1

**Dependents**

- app/journey-review/JourneyReview.tsx

---

## app\layout.tsx

**Public:** true

**Dead:** false

**Medication:** false

Dependencies : 1

Dependents : 0

**Dependencies**

- app/globals.css

---

## app\login\page.tsx

**Public:** true

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## app\medications\consultation-mode\page.tsx

**Public:** true

**Dead:** false

**Medication:** true

Dependencies : 0

Dependents : 0

---

## app\medications\page.tsx

**Public:** true

**Dead:** false

**Medication:** true

Dependencies : 0

Dependents : 0

---

## app\medications\prescription\page.tsx

**Public:** true

**Dead:** false

**Medication:** true

Dependencies : 0

Dependents : 0

---

## app\page.tsx

**Public:** true

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## app\register\page.tsx

**Public:** true

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## app\report\page.tsx

**Public:** true

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## app\reports\assessment\family\page.tsx

**Public:** true

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## app\reports\assessment\family\[id]\page.tsx

**Public:** true

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## app\reports\assessment\page.tsx

**Public:** true

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## app\reports\assessment\self\page.tsx

**Public:** true

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## app\reports\assessment\self\[id]\page.tsx

**Public:** true

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## app\reports\daily-care\page.tsx

**Public:** true

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## app\reports\daily-care\select\page.tsx

**Public:** true

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## app\reports\daily-care\self\page.tsx

**Public:** true

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## app\reports\daily-care\self\[id]\page.tsx

**Public:** true

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## app\reports\daily-care\[id]\page.tsx

**Public:** true

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## app\reports\page.tsx

**Public:** true

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## app\reports\trends\page.tsx

**Public:** true

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## app\reports\trends\results\page.tsx

**Public:** true

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## app\reports\trends\selector\page.tsx

**Public:** true

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## app\reports\trends\self\page.tsx

**Public:** true

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## app\reports\trends\self\results\page.tsx

**Public:** true

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## app\reports\trends\trendRequest.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## app\reset-password\page.tsx

**Public:** true

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## app\review\page.tsx

**Public:** true

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## app\self\page.tsx

**Public:** true

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## app\self\page2\page.tsx

**Public:** true

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## app\self\page3\page.tsx

**Public:** true

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## app\self\page4\page.tsx

**Public:** true

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## app\self\page5\page.tsx

**Public:** true

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## app\self-profile\page.tsx

**Public:** true

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## app\welcome\page.tsx

**Public:** true

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## Components\AssessmentLayout.tsx

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## Components\common\ResponsiveTable.tsx

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## Components\daily-care\VoiceRecorder.tsx

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## Components\dashboard\ActionOptions.tsx

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## Components\dashboard\ConsultationWorkspace.tsx

**Public:** false

**Dead:** false

**Medication:** true

Dependencies : 0

Dependents : 0

---

## Components\dashboard\ManualCareWorkspace.tsx

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## Components\dashboard\prescription\PrescriptionTabs.tsx

**Public:** true

**Dead:** false

**Medication:** true

Dependencies : 0

Dependents : 1

**Dependents**

- Components/dashboard/PrescriptionReview.tsx

---

## Components\dashboard\prescription-review\AssessmentCard.tsx

**Public:** true

**Dead:** false

**Medication:** true

Dependencies : 0

Dependents : 1

**Dependents**

- Components/dashboard/PrescriptionReview.tsx

---

## Components\dashboard\prescription-review\ComplaintsCard.tsx

**Public:** true

**Dead:** false

**Medication:** true

Dependencies : 0

Dependents : 1

**Dependents**

- Components/dashboard/PrescriptionReview.tsx

---

## Components\dashboard\prescription-review\DoctorInstructionCard.tsx

**Public:** true

**Dead:** false

**Medication:** true

Dependencies : 0

Dependents : 1

**Dependents**

- Components/dashboard/PrescriptionReview.tsx

---

## Components\dashboard\prescription-review\HistoryCard.tsx

**Public:** true

**Dead:** false

**Medication:** true

Dependencies : 0

Dependents : 1

**Dependents**

- Components/dashboard/PrescriptionReview.tsx

---

## Components\dashboard\prescription-review\InvestigationCard.tsx

**Public:** true

**Dead:** false

**Medication:** true

Dependencies : 0

Dependents : 1

**Dependents**

- Components/dashboard/PrescriptionReview.tsx

---

## Components\dashboard\prescription-review\MedicineCard.tsx

**Public:** true

**Dead:** false

**Medication:** true

Dependencies : 0

Dependents : 1

**Dependents**

- Components/dashboard/PrescriptionReview.tsx

---

## Components\dashboard\prescription-review\OtherNotesCard.tsx

**Public:** true

**Dead:** false

**Medication:** true

Dependencies : 0

Dependents : 1

**Dependents**

- Components/dashboard/PrescriptionReview.tsx

---

## Components\dashboard\prescription-review\PatientCard.tsx

**Public:** true

**Dead:** false

**Medication:** true

Dependencies : 0

Dependents : 1

**Dependents**

- Components/dashboard/PrescriptionReview.tsx

---

## Components\dashboard\prescription-review\ReviewActions.tsx

**Public:** true

**Dead:** false

**Medication:** true

Dependencies : 0

Dependents : 1

**Dependents**

- Components/dashboard/PrescriptionReview.tsx

---

## Components\dashboard\prescription-review\VitalsCard.tsx

**Public:** true

**Dead:** false

**Medication:** true

Dependencies : 0

Dependents : 1

**Dependents**

- Components/dashboard/PrescriptionReview.tsx

---

## Components\dashboard\PrescriptionDetailsPanel.tsx

**Public:** false

**Dead:** false

**Medication:** true

Dependencies : 0

Dependents : 0

---

## Components\dashboard\PrescriptionHistoryWorkspace.tsx

**Public:** false

**Dead:** false

**Medication:** true

Dependencies : 0

Dependents : 0

---

## Components\dashboard\PrescriptionReview.tsx

**Public:** false

**Dead:** false

**Medication:** true

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

## Components\dashboard\PrescriptionWorkspace.styles.ts

**Public:** true

**Dead:** false

**Medication:** true

Dependencies : 0

Dependents : 1

**Dependents**

- Components/dashboard/PrescriptionWorkspace.tsx

---

## Components\dashboard\PrescriptionWorkspace.tsx

**Public:** false

**Dead:** false

**Medication:** true

Dependencies : 1

Dependents : 0

**Dependencies**

- Components/dashboard/PrescriptionWorkspace.styles.ts

---

## Components\dashboard\UploadCareWorkspace.tsx

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## Components\dashboard\VoiceCareWorkspace.tsx

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## Components\Header.tsx

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## Components\help\HelpBackButton.tsx

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## Components\help\HelpCard.tsx

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## Components\language\LanguageProvider.tsx

**Public:** true

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 1

**Dependents**

- Components/language/LanguageSelector.tsx

---

## Components\language\LanguageSelector.tsx

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 1

Dependents : 0

**Dependencies**

- Components/language/LanguageProvider.tsx

---

## Components\patient\PersonSelector.tsx

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## journey-audit.js

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## lib\analytics\analyticsEvents.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## lib\analytics\analyticsIdentity.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## lib\analytics\analyticsService.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## lib\analytics\analyticsTypes.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## lib\analytics\authSessionService.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## lib\assessmentStorage.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 1

Dependents : 0

**Dependencies**

- lib/reportStorage.ts

---

## lib\auth\authService.ts

**Public:** true

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 1

**Dependents**

- lib/repositories/profileRepository.ts

---

## lib\builders\assessmentBuilder.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## lib\builders\clinicalEventBuilder.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## lib\builders\SelfTrendBuilder.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## lib\builders\TrendBuilder.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## lib\clinical-intelligence\ClarificationEngine.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## lib\clinical-intelligence\ClinicalComparisonEngine.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 1

Dependents : 0

**Dependencies**

- lib/clinical-intelligence/comparisonTypes.ts

---

## lib\clinical-intelligence\comparisonTypes.ts

**Public:** true

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 1

**Dependents**

- lib/clinical-intelligence/ClinicalComparisonEngine.ts

---

## lib\clinical-intelligence\index.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## lib\clinical-summary\ClinicalSummaryEngine.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 5

Dependents : 0

**Dependencies**

- lib/clinical-summary/ClinicalSummaryTypes.ts
- lib/clinical-summary/TemperatureAnalyzer.ts
- lib/clinical-summary/VitalsAnalyzer.ts
- lib/clinical-summary/SymptomsAnalyzer.ts
- lib/clinical-summary/PainAnalyzer.ts

---

## lib\clinical-summary\ClinicalSummaryTypes.ts

**Public:** true

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 5

**Dependents**

- lib/clinical-summary/ClinicalSummaryEngine.ts
- lib/clinical-summary/PainAnalyzer.ts
- lib/clinical-summary/SymptomsAnalyzer.ts
- lib/clinical-summary/TemperatureAnalyzer.ts
- lib/clinical-summary/VitalsAnalyzer.ts

---

## lib\clinical-summary\PainAnalyzer.ts

**Public:** true

**Dead:** false

**Medication:** false

Dependencies : 1

Dependents : 1

**Dependencies**

- lib/clinical-summary/ClinicalSummaryTypes.ts

**Dependents**

- lib/clinical-summary/ClinicalSummaryEngine.ts

---

## lib\clinical-summary\RecommendationEngine.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## lib\clinical-summary\SymptomsAnalyzer.ts

**Public:** true

**Dead:** false

**Medication:** false

Dependencies : 1

Dependents : 1

**Dependencies**

- lib/clinical-summary/ClinicalSummaryTypes.ts

**Dependents**

- lib/clinical-summary/ClinicalSummaryEngine.ts

---

## lib\clinical-summary\TemperatureAnalyzer.ts

**Public:** true

**Dead:** false

**Medication:** false

Dependencies : 1

Dependents : 1

**Dependencies**

- lib/clinical-summary/ClinicalSummaryTypes.ts

**Dependents**

- lib/clinical-summary/ClinicalSummaryEngine.ts

---

## lib\clinical-summary\VitalsAnalyzer.ts

**Public:** true

**Dead:** false

**Medication:** false

Dependencies : 1

Dependents : 1

**Dependencies**

- lib/clinical-summary/ClinicalSummaryTypes.ts

**Dependents**

- lib/clinical-summary/ClinicalSummaryEngine.ts

---

## lib\config\consent.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## lib\consent\mapper\consentMapper.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## lib\consent\models\Consent.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## lib\consent\repository\consentRepository.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## lib\consent\storage\consentStorage.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## lib\constants\consentVersions.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## lib\database.ts

**Public:** true

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 4

**Dependents**

- lib/mappers/PatientMapper.ts
- lib/mappers/SelfProfileMapper.ts
- lib/repositories/patientRepository.ts
- lib/repositories/SelfProfileRepository.ts

---

## lib\i18n\config.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 1

Dependents : 0

**Dependencies**

- lib/i18n/types.ts

---

## lib\i18n\index.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 13

Dependents : 0

**Dependencies**

- lib/i18n/types.ts
- lib/i18n/translations/en.ts
- lib/i18n/translations/hi.ts
- lib/i18n/translations/kn.ts
- lib/i18n/translations/te.ts
- lib/i18n/translations/ml.ts
- lib/i18n/translations/ta.ts
- lib/i18n/translations/mr.ts
- lib/i18n/translations/bn.ts
- lib/i18n/translations/gu.ts
- lib/i18n/translations/pa.ts
- lib/i18n/translations/or.ts
- lib/i18n/translations/as.ts

---

## lib\i18n\translations\as.ts

**Public:** true

**Dead:** false

**Medication:** false

Dependencies : 1

Dependents : 1

**Dependencies**

- lib/i18n/types.ts

**Dependents**

- lib/i18n/index.ts

---

## lib\i18n\translations\bn.ts

**Public:** true

**Dead:** false

**Medication:** false

Dependencies : 1

Dependents : 1

**Dependencies**

- lib/i18n/types.ts

**Dependents**

- lib/i18n/index.ts

---

## lib\i18n\translations\en.ts

**Public:** true

**Dead:** false

**Medication:** false

Dependencies : 1

Dependents : 1

**Dependencies**

- lib/i18n/types.ts

**Dependents**

- lib/i18n/index.ts

---

## lib\i18n\translations\gu.ts

**Public:** true

**Dead:** false

**Medication:** false

Dependencies : 1

Dependents : 1

**Dependencies**

- lib/i18n/types.ts

**Dependents**

- lib/i18n/index.ts

---

## lib\i18n\translations\hi.ts

**Public:** true

**Dead:** false

**Medication:** false

Dependencies : 1

Dependents : 1

**Dependencies**

- lib/i18n/types.ts

**Dependents**

- lib/i18n/index.ts

---

## lib\i18n\translations\kn.ts

**Public:** true

**Dead:** false

**Medication:** false

Dependencies : 1

Dependents : 1

**Dependencies**

- lib/i18n/types.ts

**Dependents**

- lib/i18n/index.ts

---

## lib\i18n\translations\ml.ts

**Public:** true

**Dead:** false

**Medication:** false

Dependencies : 1

Dependents : 1

**Dependencies**

- lib/i18n/types.ts

**Dependents**

- lib/i18n/index.ts

---

## lib\i18n\translations\mr.ts

**Public:** true

**Dead:** false

**Medication:** false

Dependencies : 1

Dependents : 1

**Dependencies**

- lib/i18n/types.ts

**Dependents**

- lib/i18n/index.ts

---

## lib\i18n\translations\or.ts

**Public:** true

**Dead:** false

**Medication:** false

Dependencies : 1

Dependents : 1

**Dependencies**

- lib/i18n/types.ts

**Dependents**

- lib/i18n/index.ts

---

## lib\i18n\translations\pa.ts

**Public:** true

**Dead:** false

**Medication:** false

Dependencies : 1

Dependents : 1

**Dependencies**

- lib/i18n/types.ts

**Dependents**

- lib/i18n/index.ts

---

## lib\i18n\translations\ta.ts

**Public:** true

**Dead:** false

**Medication:** false

Dependencies : 1

Dependents : 1

**Dependencies**

- lib/i18n/types.ts

**Dependents**

- lib/i18n/index.ts

---

## lib\i18n\translations\te.ts

**Public:** true

**Dead:** false

**Medication:** false

Dependencies : 1

Dependents : 1

**Dependencies**

- lib/i18n/types.ts

**Dependents**

- lib/i18n/index.ts

---

## lib\i18n\types.ts

**Public:** true

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 14

**Dependents**

- lib/i18n/config.ts
- lib/i18n/index.ts
- lib/i18n/translations/as.ts
- lib/i18n/translations/bn.ts
- lib/i18n/translations/en.ts
- lib/i18n/translations/gu.ts
- lib/i18n/translations/hi.ts
- lib/i18n/translations/kn.ts
- lib/i18n/translations/ml.ts
- lib/i18n/translations/mr.ts
- lib/i18n/translations/or.ts
- lib/i18n/translations/pa.ts
- lib/i18n/translations/ta.ts
- lib/i18n/translations/te.ts

---

## lib\journey\activeTreatment\index.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## lib\journey\activeTreatment\lifecycleEngine.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## lib\journey\activeTreatment\lifecycleMapper.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## lib\journey\activeTreatment\lifecycleRepository.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## lib\journey\activeTreatment\lifecycleRules.ts

**Public:** false

**Dead:** true

**Medication:** false

Dependencies : 0

Dependents : 0

---

## lib\journey\activeTreatment\lifecycleStorage.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## lib\journey\activeTreatment\lifecycleTypes.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## lib\journey\activeTreatment\lifecycleValidator.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## lib\journey\activeTreatment\models\lifecycleModel.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## lib\journey\classification\classificationMapper.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## lib\journey\classification\classificationRepository.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## lib\journey\classification\classificationRules.ts

**Public:** false

**Dead:** true

**Medication:** false

Dependencies : 0

Dependents : 0

---

## lib\journey\classification\classificationStorage.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## lib\journey\classification\classificationTypes.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## lib\journey\classification\classificationValidator.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## lib\journey\classification\consultationClassifier.ts

**Public:** false

**Dead:** false

**Medication:** true

Dependencies : 0

Dependents : 0

---

## lib\journey\classification\index.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## lib\journey\classification\journeyClassificationEngine.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## lib\journey\classification\models\classificationModel.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## lib\journey\comparison\comparisonEngine.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## lib\journey\comparison\comparisonMapper.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## lib\journey\comparison\comparisonTypes.ts

**Public:** true

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 1

**Dependents**

- lib/journey/comparison/prescriptionComparator.ts

---

## lib\journey\comparison\comparisonValidator.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## lib\journey\comparison\index.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## lib\journey\comparison\models\comparisonModel.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## lib\journey\comparison\prescriptionComparator.ts

**Public:** false

**Dead:** false

**Medication:** true

Dependencies : 1

Dependents : 0

**Dependencies**

- lib/journey/comparison/comparisonTypes.ts

---

## lib\journey\consultation\consultationEngine.ts

**Public:** false

**Dead:** false

**Medication:** true

Dependencies : 4

Dependents : 0

**Dependencies**

- lib/journey/consultation/consultationTypes.ts
- lib/journey/consultation/consultationValidator.ts
- lib/journey/consultation/consultationResolver.ts
- lib/journey/consultation/consultationMapper.ts

---

## lib\journey\consultation\consultationMapper.ts

**Public:** true

**Dead:** false

**Medication:** true

Dependencies : 1

Dependents : 1

**Dependencies**

- lib/journey/consultation/consultationTypes.ts

**Dependents**

- lib/journey/consultation/consultationEngine.ts

---

## lib\journey\consultation\consultationResolver.ts

**Public:** true

**Dead:** false

**Medication:** true

Dependencies : 1

Dependents : 1

**Dependencies**

- lib/journey/consultation/consultationTypes.ts

**Dependents**

- lib/journey/consultation/consultationEngine.ts

---

## lib\journey\consultation\consultationTypes.ts

**Public:** true

**Dead:** false

**Medication:** true

Dependencies : 0

Dependents : 3

**Dependents**

- lib/journey/consultation/consultationEngine.ts
- lib/journey/consultation/consultationMapper.ts
- lib/journey/consultation/consultationResolver.ts

---

## lib\journey\consultation\consultationValidator.ts

**Public:** true

**Dead:** false

**Medication:** true

Dependencies : 0

Dependents : 1

**Dependents**

- lib/journey/consultation/consultationEngine.ts

---

## lib\journey\consultation\index.ts

**Public:** false

**Dead:** false

**Medication:** true

Dependencies : 0

Dependents : 0

---

## lib\journey\context\index.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## lib\journey\context\journeyContext.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## lib\journey\context\journeyContextBuilder.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## lib\journey\context\journeyContextValidator.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## lib\journey\engine\confidenceCalculator.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## lib\journey\engine\contextBuilder.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## lib\journey\engine\engineTypes.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## lib\journey\engine\index.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## lib\journey\engine\journeyAssembler.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## lib\journey\engine\journeyEngine.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## lib\journey\engine\metadataBuilder.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## lib\journey\engine\nodeBuilder.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 2

Dependents : 0

**Dependencies**

- lib/journey/journeyModels.ts
- lib/journey/journeyTypes.ts

---

## lib\journey\engine\ruleEvaluator.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## lib\journey\engine\transitionBuilder.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## lib\journey\governance\governanceEngine.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## lib\journey\governance\governanceRepository.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## lib\journey\governance\governanceRules.ts

**Public:** false

**Dead:** true

**Medication:** false

Dependencies : 0

Dependents : 0

---

## lib\journey\governance\governanceStorage.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## lib\journey\governance\governanceTypes.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## lib\journey\governance\governanceValidator.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## lib\journey\governance\index.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## lib\journey\governance\models\governanceModel.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## lib\journey\index.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## lib\journey\JourneyAnalysisEngine.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 7

Dependents : 0

**Dependencies**

- lib/journey/journeyModels.ts
- lib/journey/journeyConstants.ts
- lib/journey/journeyTypes.ts
- lib/journey/journeyValidation.ts
- lib/journey/questionBuilder.ts
- lib/journey/summaryBuilder.ts
- lib/journey/timelineBuilder.ts

---

## lib\journey\journeyAnalysisModels.ts

**Public:** true

**Dead:** false

**Medication:** false

Dependencies : 2

Dependents : 1

**Dependencies**

- lib/journey/journeyModels.ts
- lib/journey/questionBuilder.ts

**Dependents**

- lib/journey/journeyModels.ts

---

## lib\journey\journeyConstants.ts

**Public:** true

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 1

**Dependents**

- lib/journey/JourneyAnalysisEngine.ts

---

## lib\journey\journeyMapper.ts

**Public:** true

**Dead:** false

**Medication:** false

Dependencies : 1

Dependents : 1

**Dependencies**

- lib/journey/journeyModels.ts

**Dependents**

- lib/journey/journeyRepository.ts

---

## lib\journey\journeyModels.ts

**Public:** true

**Dead:** false

**Medication:** false

Dependencies : 2

Dependents : 10

**Dependencies**

- lib/journey/journeyTypes.ts
- lib/journey/journeyAnalysisModels.ts

**Dependents**

- lib/journey/engine/nodeBuilder.ts
- lib/journey/JourneyAnalysisEngine.ts
- lib/journey/journeyAnalysisModels.ts
- lib/journey/journeyMapper.ts
- lib/journey/journeyRepository.ts
- lib/journey/journeyUtils.ts
- lib/journey/journeyValidation.ts
- lib/journey/questionBuilder.ts
- lib/journey/summaryBuilder.ts
- lib/journey/timelineBuilder.ts

---

## lib\journey\journeyRepository.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 3

Dependents : 0

**Dependencies**

- lib/journey/journeyModels.ts
- lib/journey/journeyMapper.ts
- lib/journey/journeyStorage.ts

---

## lib\journey\journeyRules.ts

**Public:** true

**Dead:** false

**Medication:** false

Dependencies : 1

Dependents : 3

**Dependencies**

- lib/journey/journeyTypes.ts

**Dependents**

- lib/journey/journeyUtils.ts
- lib/journey/questionBuilder.ts
- lib/journey/timelineBuilder.ts

---

## lib\journey\journeyStorage.ts

**Public:** true

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 1

**Dependents**

- lib/journey/journeyRepository.ts

---

## lib\journey\journeyTypes.ts

**Public:** true

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 6

**Dependents**

- lib/journey/engine/nodeBuilder.ts
- lib/journey/JourneyAnalysisEngine.ts
- lib/journey/journeyModels.ts
- lib/journey/journeyRules.ts
- lib/journey/journeyUtils.ts
- lib/journey/questionBuilder.ts

---

## lib\journey\journeyUtils.ts

**Public:** true

**Dead:** false

**Medication:** false

Dependencies : 3

Dependents : 2

**Dependencies**

- lib/journey/journeyModels.ts
- lib/journey/journeyRules.ts
- lib/journey/journeyTypes.ts

**Dependents**

- lib/journey/questionBuilder.ts
- lib/journey/timelineBuilder.ts

---

## lib\journey\journeyValidation.ts

**Public:** true

**Dead:** false

**Medication:** false

Dependencies : 1

Dependents : 1

**Dependencies**

- lib/journey/journeyModels.ts

**Dependents**

- lib/journey/JourneyAnalysisEngine.ts

---

## lib\journey\questionBuilder.ts

**Public:** true

**Dead:** false

**Medication:** false

Dependencies : 4

Dependents : 2

**Dependencies**

- lib/journey/journeyModels.ts
- lib/journey/journeyRules.ts
- lib/journey/journeyUtils.ts
- lib/journey/journeyTypes.ts

**Dependents**

- lib/journey/JourneyAnalysisEngine.ts
- lib/journey/journeyAnalysisModels.ts

---

## lib\journey\questions\index.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## lib\journey\questions\models\questionModel.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## lib\journey\questions\questionEngine.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## lib\journey\questions\questionRegistry.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## lib\journey\questions\questionResolver.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## lib\journey\questions\questionTypes.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## lib\journey\questions\questionValidator.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## lib\journey\scenarios\index.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## lib\journey\scenarios\models\scenarioModel.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## lib\journey\scenarios\scenarioEngine.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## lib\journey\scenarios\scenarioRegistry.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## lib\journey\scenarios\scenarioResolver.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## lib\journey\scenarios\scenarioRules.ts

**Public:** false

**Dead:** true

**Medication:** false

Dependencies : 0

Dependents : 0

---

## lib\journey\scenarios\scenarioTypes.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## lib\journey\scenarios\scenarioValidator.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## lib\journey\shared\index.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## lib\journey\shared\journeyConfidence.ts

**Public:** false

**Dead:** true

**Medication:** false

Dependencies : 0

Dependents : 0

---

## lib\journey\shared\journeyConstants.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## lib\journey\shared\journeyErrors.ts

**Public:** false

**Dead:** true

**Medication:** false

Dependencies : 0

Dependents : 0

---

## lib\journey\shared\journeyHelpers.ts

**Public:** false

**Dead:** true

**Medication:** false

Dependencies : 0

Dependents : 0

---

## lib\journey\summaryBuilder.ts

**Public:** true

**Dead:** false

**Medication:** false

Dependencies : 1

Dependents : 1

**Dependencies**

- lib/journey/journeyModels.ts

**Dependents**

- lib/journey/JourneyAnalysisEngine.ts

---

## lib\journey\timeline\index.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## lib\journey\timeline\models\timelineEventModel.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## lib\journey\timeline\timelineEventBuilder.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## lib\journey\timeline\timelineEventGenerator.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## lib\journey\timeline\timelineEventRepository.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## lib\journey\timeline\timelineEventRules.ts

**Public:** false

**Dead:** true

**Medication:** false

Dependencies : 0

Dependents : 0

---

## lib\journey\timeline\timelineEventStorage.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## lib\journey\timeline\timelineEventTypes.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## lib\journey\timeline\timelineEventValidator.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## lib\journey\timelineBuilder.ts

**Public:** true

**Dead:** false

**Medication:** false

Dependencies : 3

Dependents : 1

**Dependencies**

- lib/journey/journeyModels.ts
- lib/journey/journeyRules.ts
- lib/journey/journeyUtils.ts

**Dependents**

- lib/journey/JourneyAnalysisEngine.ts

---

## lib\journey\treatment\index.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## lib\journey\treatment\models\treatmentDecisionModel.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## lib\journey\treatment\treatmentDecisionEngine.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## lib\journey\treatment\treatmentDecisionMapper.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## lib\journey\treatment\treatmentDecisionRepository.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## lib\journey\treatment\treatmentDecisionRules.ts

**Public:** false

**Dead:** true

**Medication:** false

Dependencies : 0

Dependents : 0

---

## lib\journey\treatment\treatmentDecisionStorage.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## lib\journey\treatment\treatmentDecisionTypes.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## lib\journey\treatment\treatmentDecisionValidator.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## lib\mappers\assessmentMapper.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## lib\mappers\clinicalEventMapper.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## lib\mappers\DailyCareMapper.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## lib\mappers\PatientMapper.ts

**Public:** true

**Dead:** false

**Medication:** false

Dependencies : 2

Dependents : 1

**Dependencies**

- lib/types/patient.ts
- lib/database.ts

**Dependents**

- lib/repositories/patientRepository.ts

---

## lib\mappers\SelfDailyCareMapper.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## lib\mappers\SelfProfileMapper.ts

**Public:** true

**Dead:** false

**Medication:** false

Dependencies : 2

Dependents : 1

**Dependencies**

- lib/selfProfile.ts
- lib/database.ts

**Dependents**

- lib/repositories/SelfProfileRepository.ts

---

## lib\medical-image\medicalImageParser.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 1

Dependents : 0

**Dependencies**

- lib/medical-image/medicalImageTypes.ts

---

## lib\medical-image\medicalImageService.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 1

Dependents : 0

**Dependencies**

- lib/medical-image/medicalImageTypes.ts

---

## lib\medical-image\medicalImageTypes.ts

**Public:** true

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 2

**Dependents**

- lib/medical-image/medicalImageParser.ts
- lib/medical-image/medicalImageService.ts

---

## lib\medical-voice\medicalVoiceService.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 2

Dependents : 0

**Dependencies**

- lib/medical-voice/medicalVoiceTypes.ts
- lib/medical-voice/medicalVoiceTypes.ts

---

## lib\medical-voice\medicalVoiceTypes.ts

**Public:** true

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 2

**Dependents**

- lib/medical-voice/medicalVoiceService.ts
- lib/medical-voice/medicalVoiceService.ts

---

## lib\medicalFormatter.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## lib\pdf\DailyCarePdfGenerator.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 1

Dependents : 0

**Dependencies**

- lib/pdf/PdfModels.ts

---

## lib\pdf\PdfFormatter.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## lib\pdf\PdfModels.ts

**Public:** true

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 1

**Dependents**

- lib/pdf/DailyCarePdfGenerator.ts

---

## lib\pdf\PdfStyles.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## lib\pdf\trendReportPdf.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## lib\performance\performanceStorage.ts

**Public:** true

**Dead:** false

**Medication:** false

Dependencies : 1

Dependents : 1

**Dependencies**

- lib/performance/performanceTypes.ts

**Dependents**

- lib/performance/performanceTracker.ts

---

## lib\performance\performanceTracker.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 2

Dependents : 0

**Dependencies**

- lib/performance/performanceTypes.ts
- lib/performance/performanceStorage.ts

---

## lib\performance\performanceTypes.ts

**Public:** true

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 2

**Dependents**

- lib/performance/performanceStorage.ts
- lib/performance/performanceTracker.ts

---

## lib\prescription\prescriptionMapper.ts

**Public:** false

**Dead:** false

**Medication:** true

Dependencies : 0

Dependents : 0

---

## lib\prescription\prescriptionRepository.ts

**Public:** false

**Dead:** false

**Medication:** true

Dependencies : 0

Dependents : 0

---

## lib\prescription\prescriptionReviewMapper.ts

**Public:** false

**Dead:** false

**Medication:** true

Dependencies : 0

Dependents : 0

---

## lib\prescription\prescriptionStorage.ts

**Public:** false

**Dead:** false

**Medication:** true

Dependencies : 0

Dependents : 0

---

## lib\prescription\prescriptionTypes.ts

**Public:** false

**Dead:** false

**Medication:** true

Dependencies : 0

Dependents : 0

---

## lib\prescription\prescriptionValidator.ts

**Public:** false

**Dead:** false

**Medication:** true

Dependencies : 0

Dependents : 0

---

## lib\prescription-ai\classification\clinicalRouter.ts

**Public:** false

**Dead:** false

**Medication:** true

Dependencies : 0

Dependents : 0

---

## lib\prescription-ai\consultation\assessmentRules.ts

**Public:** true

**Dead:** false

**Medication:** true

Dependencies : 0

Dependents : 1

**Dependents**

- lib/prescription-ai/consultation/consultationPromptBuilder.ts

---

## lib\prescription-ai\consultation\complaintsRules.ts

**Public:** true

**Dead:** false

**Medication:** true

Dependencies : 0

Dependents : 1

**Dependents**

- lib/prescription-ai/consultation/consultationPromptBuilder.ts

---

## lib\prescription-ai\consultation\consultationPromptBuilder.ts

**Public:** true

**Dead:** false

**Medication:** true

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

**Dependents**

- lib/prescription-ai/extractionInstructions.ts

---

## lib\prescription-ai\consultation\doctorInstructionRules.ts

**Public:** true

**Dead:** false

**Medication:** true

Dependencies : 0

Dependents : 1

**Dependents**

- lib/prescription-ai/consultation/consultationPromptBuilder.ts

---

## lib\prescription-ai\consultation\examinationRules.ts

**Public:** true

**Dead:** false

**Medication:** true

Dependencies : 0

Dependents : 1

**Dependents**

- lib/prescription-ai/consultation/consultationPromptBuilder.ts

---

## lib\prescription-ai\consultation\historyRules.ts

**Public:** true

**Dead:** false

**Medication:** true

Dependencies : 0

Dependents : 1

**Dependents**

- lib/prescription-ai/consultation/consultationPromptBuilder.ts

---

## lib\prescription-ai\consultation\investigationRules.ts

**Public:** true

**Dead:** false

**Medication:** true

Dependencies : 0

Dependents : 1

**Dependents**

- lib/prescription-ai/consultation/consultationPromptBuilder.ts

---

## lib\prescription-ai\consultation\vitalsRules.ts

**Public:** true

**Dead:** false

**Medication:** true

Dependencies : 0

Dependents : 1

**Dependents**

- lib/prescription-ai/consultation/consultationPromptBuilder.ts

---

## lib\prescription-ai\examples\cardiologyExamples.ts

**Public:** true

**Dead:** false

**Medication:** true

Dependencies : 1

Dependents : 1

**Dependencies**

- lib/prescription-ai/prescriptionExamples.ts

**Dependents**

- lib/prescription-ai/examples/index.ts

---

## lib\prescription-ai\examples\consultationExamples.ts

**Public:** true

**Dead:** false

**Medication:** true

Dependencies : 1

Dependents : 1

**Dependencies**

- lib/prescription-ai/prescriptionExamples.ts

**Dependents**

- lib/prescription-ai/examples/index.ts

---

## lib\prescription-ai\examples\diabetesExamples.ts

**Public:** true

**Dead:** false

**Medication:** true

Dependencies : 1

Dependents : 1

**Dependencies**

- lib/prescription-ai/prescriptionExamples.ts

**Dependents**

- lib/prescription-ai/examples/index.ts

---

## lib\prescription-ai\examples\generalMedicineExamples.ts

**Public:** true

**Dead:** false

**Medication:** true

Dependencies : 1

Dependents : 1

**Dependencies**

- lib/prescription-ai/prescriptionExamples.ts

**Dependents**

- lib/prescription-ai/examples/index.ts

---

## lib\prescription-ai\examples\index.ts

**Public:** true

**Dead:** false

**Medication:** true

Dependencies : 6

Dependents : 1

**Dependencies**

- lib/prescription-ai/examples/consultationExamples.ts
- lib/prescription-ai/examples/generalMedicineExamples.ts
- lib/prescription-ai/examples/oncologyExamples.ts
- lib/prescription-ai/examples/cardiologyExamples.ts
- lib/prescription-ai/examples/diabetesExamples.ts
- lib/prescription-ai/examples/pulmonologyExamples.ts

**Dependents**

- lib/prescription-ai/extractionInstructions.ts

---

## lib\prescription-ai\examples\oncologyExamples.ts

**Public:** true

**Dead:** false

**Medication:** true

Dependencies : 1

Dependents : 1

**Dependencies**

- lib/prescription-ai/prescriptionExamples.ts

**Dependents**

- lib/prescription-ai/examples/index.ts

---

## lib\prescription-ai\examples\pulmonologyExamples.ts

**Public:** true

**Dead:** false

**Medication:** true

Dependencies : 1

Dependents : 1

**Dependencies**

- lib/prescription-ai/prescriptionExamples.ts

**Dependents**

- lib/prescription-ai/examples/index.ts

---

## lib\prescription-ai\extractionInstructions.ts

**Public:** false

**Dead:** false

**Medication:** true

Dependencies : 5

Dependents : 0

**Dependencies**

- lib/prescription-ai/prescriptionKnowledge.ts
- lib/prescription-ai/prescriptionReadingRules.ts
- lib/prescription-ai/prescriptionRecognitionRules.ts
- lib/prescription-ai/examples/index.ts
- lib/prescription-ai/consultation/consultationPromptBuilder.ts

---

## lib\prescription-ai\identityExtractionInstructions.ts

**Public:** false

**Dead:** false

**Medication:** true

Dependencies : 0

Dependents : 0

---

## lib\prescription-ai\medicines\dosageRules.ts

**Public:** false

**Dead:** false

**Medication:** true

Dependencies : 0

Dependents : 0

---

## lib\prescription-ai\medicines\durationRules.ts

**Public:** false

**Dead:** false

**Medication:** true

Dependencies : 0

Dependents : 0

---

## lib\prescription-ai\medicines\frequencyRules.ts

**Public:** false

**Dead:** false

**Medication:** true

Dependencies : 0

Dependents : 0

---

## lib\prescription-ai\medicines\medicineAssociationRules.ts

**Public:** false

**Dead:** false

**Medication:** true

Dependencies : 0

Dependents : 0

---

## lib\prescription-ai\medicines\timingRules.ts

**Public:** false

**Dead:** false

**Medication:** true

Dependencies : 0

Dependents : 0

---

## lib\prescription-ai\models\consultationModel.ts

**Public:** false

**Dead:** false

**Medication:** true

Dependencies : 0

Dependents : 0

---

## lib\prescription-ai\prescriptionExamples.ts

**Public:** true

**Dead:** false

**Medication:** true

Dependencies : 0

Dependents : 6

**Dependents**

- lib/prescription-ai/examples/cardiologyExamples.ts
- lib/prescription-ai/examples/consultationExamples.ts
- lib/prescription-ai/examples/diabetesExamples.ts
- lib/prescription-ai/examples/generalMedicineExamples.ts
- lib/prescription-ai/examples/oncologyExamples.ts
- lib/prescription-ai/examples/pulmonologyExamples.ts

---

## lib\prescription-ai\prescriptionKnowledge.ts

**Public:** true

**Dead:** false

**Medication:** true

Dependencies : 0

Dependents : 1

**Dependents**

- lib/prescription-ai/extractionInstructions.ts

---

## lib\prescription-ai\prescriptionReadingRules.ts

**Public:** true

**Dead:** false

**Medication:** true

Dependencies : 0

Dependents : 1

**Dependents**

- lib/prescription-ai/extractionInstructions.ts

---

## lib\prescription-ai\prescriptionRecognitionRules.ts

**Public:** true

**Dead:** false

**Medication:** true

Dependencies : 0

Dependents : 1

**Dependents**

- lib/prescription-ai/extractionInstructions.ts

---

## lib\prescription-image\prescriptionImageService.ts

**Public:** false

**Dead:** false

**Medication:** true

Dependencies : 1

Dependents : 0

**Dependencies**

- lib/prescription-image/prescriptionImageTypes.ts

---

## lib\prescription-image\prescriptionImageTypes.ts

**Public:** true

**Dead:** false

**Medication:** true

Dependencies : 0

Dependents : 1

**Dependents**

- lib/prescription-image/prescriptionImageService.ts

---

## lib\reportStorage.ts

**Public:** true

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 1

**Dependents**

- lib/assessmentStorage.ts

---

## lib\repositories\assessmentRepository.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## lib\repositories\BaseRepository.ts

**Public:** true

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 3

**Dependents**

- lib/repositories/patientRepository.ts
- lib/repositories/profileRepository.ts
- lib/repositories/SelfProfileRepository.ts

---

## lib\repositories\clinicalEventRepository.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## lib\repositories\DailyCareRepository.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## lib\repositories\patientRepository.ts

**Public:** true

**Dead:** false

**Medication:** false

Dependencies : 5

Dependents : 1

**Dependencies**

- lib/supabase.ts
- lib/repositories/BaseRepository.ts
- lib/types/patient.ts
- lib/database.ts
- lib/mappers/PatientMapper.ts

**Dependents**

- lib/storage/patientStorage.ts

---

## lib\repositories\profileRepository.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 4

Dependents : 0

**Dependencies**

- lib/supabase.ts
- lib/repositories/BaseRepository.ts
- lib/types/profile.ts
- lib/auth/authService.ts

---

## lib\repositories\SelfDailyCareRepository.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## lib\repositories\SelfProfileRepository.ts

**Public:** true

**Dead:** false

**Medication:** false

Dependencies : 5

Dependents : 1

**Dependencies**

- lib/supabase.ts
- lib/repositories/BaseRepository.ts
- lib/selfProfile.ts
- lib/database.ts
- lib/mappers/SelfProfileMapper.ts

**Dependents**

- lib/storage/SelfProfileStorage.ts

---

## lib\repositories\SelfTrendRepository.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## lib\repositories\TrendRepository.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## lib\selfProfile.ts

**Public:** true

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 3

**Dependents**

- lib/mappers/SelfProfileMapper.ts
- lib/repositories/SelfProfileRepository.ts
- lib/storage/SelfProfileStorage.ts

---

## lib\storage\assessmentDraftStorage.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## lib\storage\assessmentStorage.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## lib\storage\clinicalEventStorage.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## lib\storage\DailyCareStorage.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## lib\storage\patientStorage.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 4

Dependents : 0

**Dependencies**

- lib/types/patient.ts
- lib/storage/storageResult.ts
- lib/validators/patientValidator.ts
- lib/repositories/patientRepository.ts

---

## lib\storage\SelfDailyCareStorage.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## lib\storage\SelfProfileStorage.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 3

Dependents : 0

**Dependencies**

- lib/selfProfile.ts
- lib/storage/storageResult.ts
- lib/repositories/SelfProfileRepository.ts

---

## lib\storage\selfTrendStorage.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## lib\storage\storageResult.ts

**Public:** true

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 3

**Dependents**

- lib/storage/patientStorage.ts
- lib/storage/SelfProfileStorage.ts
- lib/validators/patientValidator.ts

---

## lib\storage\trendDraftStorage.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## lib\storage\TrendStorage.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## lib\supabase\server.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## lib\supabase.ts

**Public:** true

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 3

**Dependents**

- lib/repositories/patientRepository.ts
- lib/repositories/profileRepository.ts
- lib/repositories/SelfProfileRepository.ts

---

## lib\supabaseAdmin.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## lib\treatment\index.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## lib\treatment\treatmentMapper.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 2

Dependents : 0

**Dependencies**

- lib/treatment/treatmentModels.ts
- lib/treatment/treatmentTypes.ts

---

## lib\treatment\treatmentModels.ts

**Public:** true

**Dead:** false

**Medication:** false

Dependencies : 3

Dependents : 5

**Dependencies**

- lib/treatment/treatmentTypes.ts
- lib/treatment/treatmentTypes.ts
- lib/treatment/treatmentTypes.ts

**Dependents**

- lib/treatment/treatmentMapper.ts
- lib/treatment/treatmentRepository.ts
- lib/treatment/treatmentRules.ts
- lib/treatment/treatmentStorage.ts
- lib/treatment/treatmentValidation.ts

---

## lib\treatment\treatmentRepository.ts

**Public:** true

**Dead:** false

**Medication:** false

Dependencies : 1

Dependents : 1

**Dependencies**

- lib/treatment/treatmentModels.ts

**Dependents**

- lib/treatment/treatmentStorage.ts

---

## lib\treatment\treatmentRules.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 2

Dependents : 0

**Dependencies**

- lib/treatment/treatmentModels.ts
- lib/treatment/treatmentTypes.ts

---

## lib\treatment\TreatmentService.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## lib\treatment\treatmentStorage.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 2

Dependents : 0

**Dependencies**

- lib/treatment/treatmentModels.ts
- lib/treatment/treatmentRepository.ts

---

## lib\treatment\treatmentTypes.ts

**Public:** true

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 5

**Dependents**

- lib/treatment/treatmentMapper.ts
- lib/treatment/treatmentModels.ts
- lib/treatment/treatmentModels.ts
- lib/treatment/treatmentModels.ts
- lib/treatment/treatmentRules.ts

---

## lib\treatment\treatmentValidation.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 1

Dependents : 0

**Dependencies**

- lib/treatment/treatmentModels.ts

---

## lib\trends\selfTrendPdfGenerator.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 2

Dependents : 0

**Dependencies**

- lib/trends/trendReport.ts
- lib/trends/trendChartConfig.ts

---

## lib\trends\trendChartConfig.ts

**Public:** true

**Dead:** false

**Medication:** false

Dependencies : 1

Dependents : 3

**Dependencies**

- lib/trends/trendResult.ts

**Dependents**

- lib/trends/selfTrendPdfGenerator.ts
- lib/trends/trendPdfGenerator.ts
- lib/trends/trendReportBuilder.ts

---

## lib\trends\trendClinicalAnalyzer.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 1

Dependents : 0

**Dependencies**

- lib/trends/trendResult.ts

---

## lib\trends\trendPdfGenerator.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 2

Dependents : 0

**Dependencies**

- lib/trends/trendReport.ts
- lib/trends/trendChartConfig.ts

---

## lib\trends\trendReport.ts

**Public:** true

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 3

**Dependents**

- lib/trends/selfTrendPdfGenerator.ts
- lib/trends/trendPdfGenerator.ts
- lib/trends/trendReportBuilder.ts

---

## lib\trends\trendReportBuilder.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 2

Dependents : 0

**Dependencies**

- lib/trends/trendReport.ts
- lib/trends/trendChartConfig.ts

---

## lib\trends\trendRequest.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## lib\trends\trendResult.ts

**Public:** true

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 2

**Dependents**

- lib/trends/trendChartConfig.ts
- lib/trends/trendClinicalAnalyzer.ts

---

## lib\types\assessment.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## lib\types\assessmentDraft.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## lib\types\assessmentScore.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## lib\types\clinicalEvent.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## lib\types\dailyCare.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## lib\types\patient.ts

**Public:** true

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 4

**Dependents**

- lib/mappers/PatientMapper.ts
- lib/repositories/patientRepository.ts
- lib/storage/patientStorage.ts
- lib/validators/patientValidator.ts

---

## lib\types\profile.ts

**Public:** true

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 1

**Dependents**

- lib/repositories/profileRepository.ts

---

## lib\types\report.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## lib\types\result.ts

**Public:** true

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 1

**Dependents**

- lib/validators/patientValidator.ts

---

## lib\types\selfDailyCare.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## lib\utils\appAlert.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## lib\utils\dateUtils.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## lib\utils\displayFormatter.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## lib\utils\pdf\assessmentPdf.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## lib\validators\patientValidator.ts

**Public:** true

**Dead:** false

**Medication:** false

Dependencies : 3

Dependents : 1

**Dependencies**

- lib/types/patient.ts
- lib/types/result.ts
- lib/storage/storageResult.ts

**Dependents**

- lib/storage/patientStorage.ts

---

## next-env.d.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 1

Dependents : 0

**Dependencies**

- .next/types/routes.d.ts

---

## next.config.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## scripts\analyzeArchitecture.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## scripts\architecture-auditor\dependencyGraph.js

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## scripts\architecture-auditor\duplicateDetector.js

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## scripts\architecture-auditor\layerValidator.js

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## scripts\architecture-auditor\parser.js

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## scripts\architecture-auditor\publicApiAnalyzer.js

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## scripts\architecture-auditor\reportWriter.js

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## scripts\architecture-auditor\symbolIndexer.js

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## scripts\architecture-auditor.js

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## scripts\auditArchitecture.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## scripts\benchmarkComparator.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## scripts\dependencyAudit.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## scripts\discoverProject.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## scripts\governArchitecture.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## scripts\reviewArchitecture.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## scripts\scaffoldClinicalCore.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

## scripts\scaffoldDomain.ts

**Public:** false

**Dead:** false

**Medication:** false

Dependencies : 0

Dependents : 0

---

