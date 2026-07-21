# CareVR Project Discovery

Generated: 18/7/2026, 3:05:45 pm

Total Files: 400

---

## app\add-patient\page.tsx

Lines : 546
Size  : 10463 bytes
Empty : NO

### Imports
- react
- next/navigation
- @/lib/auth/authService
- @/lib/storage/patientStorage
- @/app/components/AppHeader
- @/lib/utils/appAlert

### Functions
- AddPatientPage

---

## app\admin\performance\page.tsx

Lines : 484
Size  : 11799 bytes
Empty : NO

### Functions
- formatDuration
- formatDateTime
- PerformanceDiagnosticsPage

---

## app\api\analytics\auth-session\login\route.ts

Lines : 282
Size  : 6093 bytes
Empty : NO

### Exports
- runtime

### Functions
- POST

---

## app\api\analytics\auth-session\logout\route.ts

Lines : 223
Size  : 4916 bytes
Empty : NO

### Exports
- runtime

### Functions
- POST

---

## app\api\analytics\event\route.ts

Lines : 362
Size  : 6695 bytes
Empty : NO

### Exports
- runtime

### Functions
- POST

---

## app\api\medical-image\route.ts

Lines : 850
Size  : 17410 bytes
Empty : NO

### Imports
- openai
- next/server

### Exports
- runtime

### Interfaces
- ParsedMedicalImageResponse

### Functions
- getOpenAIClient
- toNullableNumber
- toTemperatureUnit
- parseMedicalReadings
- POST

---

## app\api\medical-voice\route.ts

Lines : 1086
Size  : 22268 bytes
Empty : NO

### Imports
- openai

### Exports
- runtime

### Functions
- getOpenAIClient
- toNullableNumber
- toTemperatureUnit
- toNullableText
- toOverallObservation
- parseVoiceDraft
- POST

---

## app\api\prescription-identity\route.ts

Lines : 1102
Size  : 20318 bytes
Empty : NO

### Exports
- runtime

### Functions
- getOpenAIClient
- toNullableString
- toStringArray
- toConsultationMode
- toDocumentType
- parseMedicine
- parsePrescription
- POST

---

## app\api\prescription-image\route.ts

Lines : 1112
Size  : 20637 bytes
Empty : NO

### Exports
- runtime

### Functions
- getOpenAIClient
- toNullableString
- toStringArray
- toConsultationMode
- toDocumentType
- parseMedicine
- parsePrescription
- POST

---

## app\auth\callback\route.ts

Lines : 42
Size  : 658 bytes
Empty : NO

### Imports
- next/server
- @/lib/supabase/server

### Functions
- GET

---

## app\care\page.tsx

Lines : 1678
Size  : 35162 bytes
Empty : NO

### Imports
- next/navigation
- @/app/components/AppHeader
- @/lib/auth/authService
- @/lib/storage/patientStorage
- @/lib/types/patient
- @/Components/daily-care/VoiceRecorder

### Functions
- CarePage
- loadUser
- loadPatients
- resetVoiceSession
- selectCareMode
- openDailyCare
- openSelfAssessment
- openFamilyAssessment
- openAssessment
- processVoiceRecording
- reRecordVoice
- confirmVoice
- saveVoiceObservation

---

## app\carevr-journey\page.tsx

Lines : 338
Size  : 5394 bytes
Empty : NO

### Imports
- next/image
- react

### Functions
- CareVRJourneyPage

---

## app\checkin\page.tsx

Lines : 491
Size  : 11107 bytes
Empty : NO

### Imports
- react
- next/navigation
- @/app/components/AppBrand

### Functions
- CheckinPage

---

## app\clinical-review\AssessmentChangesCard.tsx

Lines : 1
Size  : 0 bytes
Empty : YES

---

## app\clinical-review\ChangeBadge.tsx

Lines : 1
Size  : 0 bytes
Empty : YES

---

## app\clinical-review\ClinicalReviewHeader.tsx

Lines : 1
Size  : 0 bytes
Empty : YES

---

## app\clinical-review\ClinicalSummaryCard.tsx

Lines : 1
Size  : 0 bytes
Empty : YES

---

## app\clinical-review\ComparisonValue.tsx

Lines : 1
Size  : 0 bytes
Empty : YES

---

## app\clinical-review\ComplaintChangesCard.tsx

Lines : 1
Size  : 0 bytes
Empty : YES

---

## app\clinical-review\ConfidenceCard.tsx

Lines : 1
Size  : 0 bytes
Empty : YES

---

## app\clinical-review\EmptyComparison.tsx

Lines : 1
Size  : 0 bytes
Empty : YES

---

## app\clinical-review\FollowUpCard.tsx

Lines : 1
Size  : 0 bytes
Empty : YES

---

## app\clinical-review\InvestigationChangesCard.tsx

Lines : 1
Size  : 0 bytes
Empty : YES

---

## app\clinical-review\MedicineChangesCard.tsx

Lines : 1
Size  : 0 bytes
Empty : YES

---

## app\clinical-review\ReviewFooter.tsx

Lines : 1
Size  : 0 bytes
Empty : YES

---

## app\clinical-review\VitalChangesCard.tsx

Lines : 1
Size  : 0 bytes
Empty : YES

---

## app\components\AppBrand.tsx

Lines : 43
Size  : 815 bytes
Empty : NO

### Interfaces
- AppBrandProps

### Functions
- AppBrand

---

## app\components\AppHeader.tsx

Lines : 185
Size  : 3881 bytes
Empty : NO

### Interfaces
- AppHeaderProps

### Functions
- AppHeader

---

## app\components\common\ClinicalSummaryCard.tsx

Lines : 236
Size  : 4184 bytes
Empty : NO

### Imports
- @/lib/clinical-summary/ClinicalSummaryTypes
- @/lib/utils/displayFormatter

### Interfaces
- ClinicalSummaryCardProps

### Functions
- ClinicalSummaryCard

---

## app\components\common\ReportNavigation.tsx

Lines : 89
Size  : 1690 bytes
Empty : NO

### Imports
- next/link
- react

### Interfaces
- ReportNavigationProps

### Functions
- ReportNavigation

---

## app\components\dashboard\HelpWorkspace.tsx

Lines : 155
Size  : 3853 bytes
Empty : NO

### Imports
- @/Components/help/HelpCard

### Functions
- HelpWorkspace

---

## app\components\ReportTable.tsx

Lines : 87
Size  : 2086 bytes
Empty : NO

### Imports
- react

### Exports
- ReportTableColumn

### Interfaces
- ReportTableColumn
- ReportTableProps

### Functions
- ReportTable

---

## app\components\TrendChart.tsx

Lines : 237
Size  : 4265 bytes
Empty : NO

### Imports
- ./TrendLineChart
- @/lib/trends/trendChartConfig

### Interfaces
- TrendChartProps
- StatCardProps

### Functions
- TrendChart
- StatCard

---

## app\components\TrendLineChart.tsx

Lines : 221
Size  : 3638 bytes
Empty : NO

### Interfaces
- TrendLineChartProps

### Functions
- TrendLineChart

---

## app\consent\page.tsx

Lines : 749
Size  : 13755 bytes
Empty : NO

### Imports
- next/navigation
- @/lib/auth/authService

### Functions
- ConsentPage

---

## app\daily-care\components\ActionButtons.tsx

Lines : 67
Size  : 938 bytes
Empty : NO

### Interfaces
- ActionButtonsProps

### Functions
- ActionButtons

---

## app\daily-care\components\DailyCareForm.tsx

Lines : 2631
Size  : 44309 bytes
Empty : NO

### Imports
- react
- next/navigation
- @/lib/storage/patientStorage
- @/lib/types/patient
- ./PatientCard
- ./TemperatureCard
- ./VitalsCard
- ./SymptomsCard
- ./PainLocationCard
- ./ActionButtons
- @/lib/storage/DailyCareStorage
- @/lib/storage/SelfDailyCareStorage
- @/lib/utils/appAlert
- @/Components/daily-care/VoiceRecorder

### Interfaces
- DailyCareFormState
- DailyCareFormProps

### Functions
- getCurrentDate
- getCurrentTime
- createInitialForm
- DailyCareForm
- updateField
- toggleSymptom
- togglePainLocation
- selectReadingInputMethod
- clearImageReadings
- handleMedicalImage
- clearVoiceVitals
- handleMedicalVoice
- resetForm
- handleBackToDashboard
- validateForm
- handleSave

---

## app\daily-care\components\PainLocationCard.tsx

Lines : 194
Size  : 3450 bytes
Empty : NO

### Imports
- @/lib/types/dailyCare

### Interfaces
- PainLocationCardProps

### Functions
- PainLocationCard

---

## app\daily-care\components\PatientCard.tsx

Lines : 146
Size  : 2176 bytes
Empty : NO

### Imports
- @/lib/types/patient

### Interfaces
- PatientCardProps

### Functions
- PatientCard

---

## app\daily-care\components\SymptomsCard.tsx

Lines : 233
Size  : 3938 bytes
Empty : NO

### Imports
- @/lib/types/dailyCare

### Interfaces
- SymptomsCardProps

### Functions
- SymptomsCard

---

## app\daily-care\components\TemperatureCard.tsx

Lines : 118
Size  : 2007 bytes
Empty : NO

### Interfaces
- TemperatureCardProps

### Functions
- TemperatureCard

---

## app\daily-care\components\VitalsCard.tsx

Lines : 220
Size  : 3813 bytes
Empty : NO

### Interfaces
- VitalsCardProps

### Functions
- VitalsCard

---

## app\daily-care\page.tsx

Lines : 373
Size  : 6451 bytes
Empty : NO

### Imports
- react
- next/navigation
- @/lib/auth/authService
- @/lib/storage/SelfProfileStorage
- @/lib/utils/appAlert
- ./components/DailyCareForm
- @/app/components/AppHeader

### Functions
- DailyCarePage

---

## app\daily-care\styles.ts

Lines : 243
Size  : 4382 bytes
Empty : NO

### Imports
- react

### Exports
- cardStyle
- sectionTitle
- labelStyle
- inputStyle
- collapseButton
- checkboxLabel
- primaryButton
- secondaryButton
- twoColumnGrid
- fourColumnGrid
- checkboxGrid
- buttonContainer

---

## app\dashboard\page.tsx

Lines : 2078
Size  : 34562 bytes
Empty : NO

### Imports
- @/app/components/AppHeader
- @/Components/language/LanguageSelector
- @/app/components/dashboard/HelpWorkspace

### Functions
- DashboardPage
- loadDashboard

---

## app\family\page.tsx

Lines : 577
Size  : 12609 bytes
Empty : NO

### Imports
- react
- next/navigation
- @/lib/assessmentStorage
- @/lib/auth/authService
- @/lib/repositories/profileRepository
- @/lib/storage/patientStorage
- @/app/components/AppHeader
- @/lib/types/patient

### Functions
- FamilyPage
- calculateAge

---

## app\family\page2\page.tsx

Lines : 220
Size  : 5556 bytes
Empty : NO

### Imports
- react
- next/navigation
- @/Components/AssessmentLayout

### Functions
- FamilyPage2

---

## app\family\page3\page.tsx

Lines : 481
Size  : 10838 bytes
Empty : NO

### Imports
- react
- next/navigation
- @/Components/AssessmentLayout

### Functions
- FamilyPage3

---

## app\family\page4\page.tsx

Lines : 365
Size  : 7593 bytes
Empty : NO

### Imports
- react
- next/navigation
- @/Components/AssessmentLayout

### Functions
- FamilyPage4

---

## app\family\page5\page.tsx

Lines : 680
Size  : 13516 bytes
Empty : NO

### Imports
- next/navigation
- @/Components/AssessmentLayout

### Functions
- FamilyPage5

---

## app\forgot-password\page.tsx

Lines : 412
Size  : 6751 bytes
Empty : NO

### Imports
- @/app/components/AppBrand

### Functions
- ForgotPasswordPage

---

## app\help\about\page.tsx

Lines : 228
Size  : 8098 bytes
Empty : NO

### Imports
- @/Components/help/HelpBackButton

### Functions
- AboutPage

---

## app\help\assessments\page.tsx

Lines : 207
Size  : 7203 bytes
Empty : NO

### Imports
- @/Components/help/HelpBackButton

### Functions
- AssessmentsPage

---

## app\help\clinical-trends\page.tsx

Lines : 208
Size  : 7401 bytes
Empty : NO

### Imports
- @/Components/help/HelpBackButton

### Functions
- ClinicalTrendsPage

---

## app\help\daily-care\page.tsx

Lines : 194
Size  : 7054 bytes
Empty : NO

### Imports
- @/Components/help/HelpBackButton

### Functions
- DailyCarePage

---

## app\help\faq\page.tsx

Lines : 215
Size  : 7484 bytes
Empty : NO

### Imports
- @/Components/help/HelpBackButton

### Functions
- FaqPage

---

## app\help\getting-started\page.tsx

Lines : 195
Size  : 7024 bytes
Empty : NO

### Imports
- @/Components/help/HelpBackButton

### Functions
- GettingStartedPage

---

## app\help\layout.tsx

Lines : 154
Size  : 3275 bytes
Empty : NO

### Imports
- react

### Functions
- HelpLayout

---

## app\help\medication-management\page.tsx

Lines : 240
Size  : 9285 bytes
Empty : NO

### Imports
- @/Components/help/HelpBackButton

### Functions
- MedicationManagementPage

---

## app\help\page.tsx

Lines : 262
Size  : 6955 bytes
Empty : NO

### Imports
- next/link
- @/Components/help/HelpCard
- @/lib/performance/performanceTracker

### Functions
- HelpPage

---

## app\help\pdf-reports\page.tsx

Lines : 181
Size  : 6591 bytes
Empty : NO

### Imports
- @/Components/help/HelpBackButton

### Functions
- PdfReportsPage

---

## app\help\privacy\page.tsx

Lines : 191
Size  : 6961 bytes
Empty : NO

### Imports
- @/Components/help/HelpBackButton

### Functions
- PrivacyPage

---

## app\help\reports\page.tsx

Lines : 184
Size  : 6791 bytes
Empty : NO

### Imports
- @/Components/help/HelpBackButton

### Functions
- ReportsPage

---

## app\journey-review\ActiveTreatmentCard.tsx

Lines : 311
Size  : 7042 bytes
Empty : NO

### Exports
- ActiveTreatmentCard

### Interfaces
- ActiveTreatmentCardProps
- InfoTileProps
- MedicineCardProps
- MedicineFieldProps

### Functions
- ActiveTreatmentCard
- InfoTile
- MedicineCard
- MedicineField
- formatDate

---

## app\journey-review\ChangeCard.tsx

Lines : 130
Size  : 3508 bytes
Empty : NO

### Exports
- ChangeCard

### Interfaces
- ChangeCardProps

### Functions
- ChangeCard

---

## app\journey-review\EmptyJourney.tsx

Lines : 33
Size  : 763 bytes
Empty : NO

### Exports
- EmptyJourney

### Interfaces
- EmptyJourneyProps

### Functions
- EmptyJourney

---

## app\journey-review\index.ts

Lines : 1
Size  : 0 bytes
Empty : YES

---

## app\journey-review\JourneyActions.tsx

Lines : 178
Size  : 3794 bytes
Empty : NO

### Exports
- JourneyActions

### Interfaces
- JourneyActionsProps
- ActionCardProps

### Functions
- JourneyActions
- ActionCard
- getIcon
- priorityClass

---

## app\journey-review\JourneyComplete.tsx

Lines : 1
Size  : 0 bytes
Empty : YES

---

## app\journey-review\JourneyConfidence.tsx

Lines : 183
Size  : 4182 bytes
Empty : NO

### Imports
- @/lib/journey

### Exports
- JourneyConfidence

### Interfaces
- JourneyConfidenceProps

### Functions
- JourneyConfidence
- StatusBadge
- getConfidenceLevel

---

## app\journey-review\JourneyContext.tsx

Lines : 400
Size  : 7506 bytes
Empty : NO

### Exports
- JourneyStep
- JourneyAnswer
- JourneyState
- JourneyProvider
- useJourney

### Interfaces
- JourneyAnswer
- JourneyState
- JourneyContextValue

### Enums
- JourneyStep

### Functions
- reducer
- JourneyProvider
- useJourney

---

## app\journey-review\JourneyDetectedChanges.tsx

Lines : 141
Size  : 3423 bytes
Empty : NO

### Imports
- ./ChangeCard

### Exports
- JourneyDetectedChanges

### Interfaces
- JourneyDetectedChangesProps

### Functions
- JourneyDetectedChanges
- getIcon

---

## app\journey-review\JourneyHeader.tsx

Lines : 189
Size  : 4394 bytes
Empty : NO

### Exports
- JourneyHeader

### Interfaces
- JourneyHeaderProps
- InfoCardProps

### Functions
- JourneyHeader
- InfoCard
- formatDate
- formatEnum
- getSourceIcon

---

## app\journey-review\JourneyQuestions.tsx

Lines : 61
Size  : 1388 bytes
Empty : NO

### Imports
- @/lib/journey
- ./QuestionCard

### Exports
- JourneyQuestions

### Interfaces
- JourneyQuestionsProps

### Functions
- JourneyQuestions

---

## app\journey-review\JourneyReview.tsx

Lines : 131
Size  : 2961 bytes
Empty : NO

### Imports
- @/lib/journey
- ./JourneyHeader
- ./JourneyConfidence
- ./JourneySummaryCard
- ./JourneyDetectedChanges
- ./JourneyQuestions
- ./TreatmentDecisionCard
- ./ActiveTreatmentCard
- ./JourneyTimeline
- ./JourneyActions
- ./EmptyJourney
- ./LoadingJourney

### Exports
- JourneyReview

### Interfaces
- JourneyReviewProps

### Functions
- JourneyReview

---

## app\journey-review\JourneySummaryCard.tsx

Lines : 98
Size  : 2176 bytes
Empty : NO

### Imports
- lucide-react
- ./SummaryCard

### Exports
- JourneySummaryCard

### Interfaces
- JourneySummaryCardProps

### Functions
- JourneySummaryCard

---

## app\journey-review\JourneyTimeline.tsx

Lines : 270
Size  : 6134 bytes
Empty : NO

### Exports
- JourneyTimeline

### Interfaces
- JourneyTimelineProps
- TimelineCardProps
- InfoTileProps

### Functions
- JourneyTimeline
- TimelineCard
- InfoTile
- getIcon
- formatDate

---

## app\journey-review\JourneyWizard.tsx

Lines : 355
Size  : 7634 bytes
Empty : NO

### Imports
- ./JourneyContext
- ./TimelinePreview
- ./JourneyComplete

### Exports
- JourneyWizard

### Interfaces
- JourneyWizardProps
- WizardFooterProps

### Functions
- JourneyWizard
- WizardStepper
- UploadStep
- AnalysisStep
- SavingStep
- WizardFooter

---

## app\journey-review\LoadingJourney.tsx

Lines : 31
Size  : 688 bytes
Empty : NO

### Exports
- LoadingJourney

### Functions
- LoadingJourney

---

## app\journey-review\QuestionCard.tsx

Lines : 107
Size  : 2308 bytes
Empty : NO

### Imports
- react
- ./QuestionRenderer

### Exports
- QuestionCard

### Interfaces
- QuestionCardProps

### Functions
- QuestionCard

---

## app\journey-review\QuestionRenderer.tsx

Lines : 413
Size  : 8196 bytes
Empty : NO

### Exports
- QuestionRenderer

### Interfaces
- QuestionRendererProps
- ChoiceButtonProps

### Functions
- QuestionRenderer
- YesNoQuestion
- SingleSelectQuestion
- MultiSelectQuestion
- TextQuestion
- NumberQuestion
- DateQuestion
- TextAreaQuestion
- ChoiceButton

---

## app\journey-review\SummaryCard.tsx

Lines : 111
Size  : 2550 bytes
Empty : NO

### Imports
- lucide-react

### Exports
- SummaryCard

### Interfaces
- SummaryCardProps

### Functions
- SummaryCard

---

## app\journey-review\TimelinePreview.tsx

Lines : 181
Size  : 4240 bytes
Empty : NO

### Exports
- TimelinePreview

### Interfaces
- TimelinePreviewProps

### Functions
- TimelinePreview
- getIcon
- formatDate

---

## app\journey-review\TreatmentDecisionCard.tsx

Lines : 215
Size  : 5089 bytes
Empty : NO

### Exports
- TreatmentDecisionCard

### Interfaces
- TreatmentDecisionCardProps
- InfoCardProps

### Functions
- TreatmentDecisionCard
- InfoCard
- formatDecision

---

## app\layout.tsx

Lines : 29
Size  : 615 bytes
Empty : NO

### Functions
- RootLayout

---

## app\login\page.tsx

Lines : 391
Size  : 7882 bytes
Empty : NO

### Imports
- next/navigation
- @/lib/auth/authService
- @/app/components/AppBrand

### Functions
- LoginPage

---

## app\medications\consultation-mode\page.tsx

Lines : 1710
Size  : 35535 bytes
Empty : NO

### Imports
- @/app/components/AppHeader

### Interfaces
- ConsultationModeOption

### Functions
- ConsultationModePage
- loadPage
- resetConsultationDetails

---

## app\medications\page.tsx

Lines : 489
Size  : 8765 bytes
Empty : NO

### Imports
- @/app/components/AppHeader

### Functions
- MedicationManagementPage
- loadUser
- openAddPrescription
- openConsultationMode

---

## app\medications\prescription\page.tsx

Lines : 1715
Size  : 29508 bytes
Empty : NO

### Imports
- @/app/components/AppHeader

### Functions
- AddPrescriptionPage
- loadUser
- validatePrescriptionFile
- handlePrescriptionFiles
- removeAllSelectedFiles
- removeSelectedFile
- readPrescription

---

## app\page.tsx

Lines : 21
Size  : 418 bytes
Empty : NO

### Imports
- react
- next/navigation

### Functions
- HomePage

---

## app\register\page.tsx

Lines : 520
Size  : 9729 bytes
Empty : NO

### Imports
- react
- next/navigation
- @/lib/auth/authService

### Functions
- RegisterPage

---

## app\report\page.tsx

Lines : 1181
Size  : 25982 bytes
Empty : NO

### Imports
- react
- next/navigation
- @/app/components/AppBrand
- @/lib/storage/assessmentStorage
- @/lib/types/assessment

### Functions
- ReportPage

---

## app\reports\assessment\family\[id]\page.tsx

Lines : 661
Size  : 12802 bytes
Empty : NO

### Imports
- react
- next/navigation
- @/lib/storage/assessmentStorage
- @/lib/storage/patientStorage
- @/lib/types/patient
- @/app/components/AppHeader

### Functions
- FamilyAssessmentDetailPage
- calculateAge

---

## app\reports\assessment\family\page.tsx

Lines : 661
Size  : 12565 bytes
Empty : NO

### Imports
- react
- next/navigation
- @/lib/storage/assessmentStorage
- @/lib/storage/patientStorage
- @/lib/types/patient
- @/app/components/AppHeader

### Functions
- FamilyAssessmentHistoryPage

---

## app\reports\assessment\page.tsx

Lines : 182
Size  : 3801 bytes
Empty : NO

### Imports
- next/navigation
- @/app/components/AppHeader
- @/app/components/common/ReportNavigation

### Functions
- AssessmentReportsPage

---

## app\reports\assessment\self\[id]\page.tsx

Lines : 664
Size  : 12325 bytes
Empty : NO

### Imports
- react
- next/navigation
- @/lib/storage/assessmentStorage
- @/lib/repositories/profileRepository
- @/lib/types/profile
- @/app/components/AppHeader

### Functions
- SelfAssessmentDetailPage
- calculateAge

---

## app\reports\assessment\self\page.tsx

Lines : 504
Size  : 9726 bytes
Empty : NO

### Imports
- react
- next/navigation
- @/lib/storage/assessmentStorage
- @/lib/repositories/profileRepository
- @/lib/types/profile
- @/app/components/AppHeader

### Functions
- SelfAssessmentHistoryPage

---

## app\reports\daily-care\[id]\page.tsx

Lines : 730
Size  : 11792 bytes
Empty : NO

### Imports
- react
- next/navigation
- @/lib/storage/DailyCareStorage
- @/lib/types/dailyCare
- @/lib/storage/patientStorage
- @/app/components/AppHeader
- @/lib/pdf/DailyCarePdfGenerator
- @/lib/pdf/PdfModels

### Functions
- DailyCareReportPage

---

## app\reports\daily-care\page.tsx

Lines : 752
Size  : 12771 bytes
Empty : NO

### Imports
- react
- next/navigation
- @/lib/utils/appAlert
- @/lib/storage/DailyCareStorage
- @/lib/types/dailyCare
- @/lib/storage/patientStorage
- @/lib/types/patient
- @/app/components/common/ReportNavigation

### Functions
- DailyCareHistoryPage

---

## app\reports\daily-care\select\page.tsx

Lines : 222
Size  : 4612 bytes
Empty : NO

### Imports
- next/navigation
- @/app/components/AppHeader

### Functions
- DailyCareReportSelectorPage

---

## app\reports\daily-care\self\[id]\page.tsx

Lines : 693
Size  : 11190 bytes
Empty : NO

### Imports
- react
- next/navigation
- @/lib/storage/SelfDailyCareStorage
- @/lib/types/selfDailyCare
- @/lib/auth/authService
- @/lib/storage/SelfProfileStorage
- @/app/components/AppHeader
- @/lib/utils/dateUtils

### Functions
- DailyCareReportPage

---

## app\reports\daily-care\self\page.tsx

Lines : 563
Size  : 9644 bytes
Empty : NO

### Imports
- react
- next/navigation
- @/lib/storage/SelfDailyCareStorage
- @/lib/types/selfDailyCare
- @/lib/auth/authService
- @/app/components/common/ReportNavigation

### Functions
- DailyCareHistoryPage

---

## app\reports\page.tsx

Lines : 331
Size  : 6424 bytes
Empty : NO

### Imports
- react
- next/navigation
- @/app/components/AppHeader

### Functions
- ReportsPage

---

## app\reports\trends\page.tsx

Lines : 900
Size  : 16400 bytes
Empty : NO

### Imports
- react
- next/navigation
- @/app/components/AppHeader
- @/lib/utils/appAlert
- @/lib/storage/trendDraftStorage
- @/lib/storage/patientStorage
- @/lib/types/patient

### Functions
- ClinicalTrendsPage
- handleResize
- loadPatients

---

## app\reports\trends\results\page.tsx

Lines : 751
Size  : 12854 bytes
Empty : NO

### Imports
- html-to-image
- next/navigation
- @/app/components/AppHeader
- @/lib/utils/appAlert

### Functions
- ClinicalTrendResultsPage
- loadTrend

---

## app\reports\trends\selector\page.tsx

Lines : 175
Size  : 3306 bytes
Empty : NO

### Imports
- next/navigation
- @/app/components/AppHeader
- @/app/components/common/ReportNavigation

### Functions
- TrendSelectorPage

---

## app\reports\trends\self\page.tsx

Lines : 818
Size  : 14917 bytes
Empty : NO

### Imports
- react
- next/navigation
- @/app/components/AppHeader
- @/lib/utils/appAlert
- @/lib/storage/trendDraftStorage
- @/lib/auth/authService

### Functions
- ClinicalTrendsPage
- handleResize
- loadUser

---

## app\reports\trends\self\results\page.tsx

Lines : 739
Size  : 12664 bytes
Empty : NO

### Imports
- html-to-image
- next/navigation
- @/app/components/AppHeader
- @/lib/utils/appAlert

### Functions
- ClinicalTrendResultsPage
- loadTrend

---

## app\reports\trends\trendRequest.ts

Lines : 23
Size  : 289 bytes
Empty : NO

### Exports
- TrendRequest

### Interfaces
- TrendRequest

---

## app\reset-password\page.tsx

Lines : 683
Size  : 12618 bytes
Empty : NO

### Imports
- @/app/components/AppBrand

### Functions
- ResetPasswordPage

---

## app\review\page.tsx

Lines : 1
Size  : 0 bytes
Empty : YES

---

## app\self-profile\page.tsx

Lines : 366
Size  : 5972 bytes
Empty : NO

### Imports
- @/app/components/AppHeader
- react
- next/navigation
- @/lib/auth/authService
- @/lib/storage/SelfProfileStorage
- @/lib/utils/appAlert

### Functions
- SelfProfilePage

---

## app\self\page.tsx

Lines : 148
Size  : 3375 bytes
Empty : NO

### Imports
- react
- next/navigation
- @/app/components/AppHeader

### Functions
- SelfPage

---

## app\self\page2\page.tsx

Lines : 310
Size  : 7724 bytes
Empty : NO

### Imports
- @/lib/assessmentStorage
- react
- next/navigation
- @/Components/AssessmentLayout

### Functions
- SelfPage2

---

## app\self\page3\page.tsx

Lines : 221
Size  : 5032 bytes
Empty : NO

### Imports
- react
- next/navigation
- @/Components/AssessmentLayout

### Functions
- Page3

---

## app\self\page4\page.tsx

Lines : 240
Size  : 5931 bytes
Empty : NO

### Imports
- react
- next/navigation
- @/Components/AssessmentLayout

### Functions
- Page4

---

## app\self\page5\page.tsx

Lines : 252
Size  : 6391 bytes
Empty : NO

### Imports
- react
- next/navigation
- @/Components/AssessmentLayout

### Functions
- Page5

---

## app\welcome\page.tsx

Lines : 153
Size  : 4315 bytes
Empty : NO

### Imports
- react
- next/navigation

### Functions
- HomePage

---

## Components\AssessmentLayout.tsx

Lines : 81
Size  : 1874 bytes
Empty : NO

### Imports
- @/Components/Header

### Functions
- AssessmentLayout

---

## Components\common\ResponsiveTable.tsx

Lines : 1
Size  : 0 bytes
Empty : YES

---

## Components\daily-care\VoiceRecorder.tsx

Lines : 557
Size  : 9599 bytes
Empty : NO

### Interfaces
- VoiceRecorderProps

### Functions
- VoiceRecorder
- stopMediaTracks
- startRecording
- stopRecording

---

## Components\dashboard\ActionOptions.tsx

Lines : 817
Size  : 14119 bytes
Empty : NO

### Exports
- ActionOption
- MedicationDetailOption

### Interfaces
- ActionOptionsProps

### Functions
- ActionOptions

---

## Components\dashboard\ConsultationWorkspace.tsx

Lines : 614
Size  : 13497 bytes
Empty : NO

### Interfaces
- ConsultationWorkspaceProps

### Functions
- ConsultationWorkspace

---

## Components\dashboard\ManualCareWorkspace.tsx

Lines : 1594
Size  : 31696 bytes
Empty : NO

### Interfaces
- ManualCareFormState
- ManualCareWorkspaceProps

### Functions
- getCurrentDate
- getCurrentTime
- createInitialForm
- ManualCareWorkspace
- updateField
- toggleSymptom
- togglePainLocation
- validateForm
- resetForm
- handleSave

---

## Components\dashboard\prescription-review\AssessmentCard.tsx

Lines : 228
Size  : 4193 bytes
Empty : NO

### Imports
- @/lib/medicalFormatter

### Interfaces
- AssessmentCardProps

### Functions
- AssessmentCard

---

## Components\dashboard\prescription-review\ComplaintsCard.tsx

Lines : 85
Size  : 1073 bytes
Empty : NO

### Imports
- @/lib/medicalFormatter

### Interfaces
- Props

### Functions
- ComplaintsCard

---

## Components\dashboard\prescription-review\DoctorInstructionCard.tsx

Lines : 77
Size  : 1012 bytes
Empty : NO

### Imports
- @/lib/medicalFormatter

### Interfaces
- Props

### Functions
- DoctorInstructionCard

---

## Components\dashboard\prescription-review\HistoryCard.tsx

Lines : 208
Size  : 3713 bytes
Empty : NO

### Imports
- @/lib/medicalFormatter

### Interfaces
- HistoryCardProps

### Functions
- formatMedicalHistory
- HistoryCard

---

## Components\dashboard\prescription-review\InvestigationCard.tsx

Lines : 78
Size  : 1476 bytes
Empty : NO

### Imports
- @/lib/medicalFormatter

### Interfaces
- InvestigationCardProps

### Functions
- InvestigationCard

---

## Components\dashboard\prescription-review\MedicineCard.tsx

Lines : 332
Size  : 10161 bytes
Empty : NO

### Imports
- @/lib/prescription-image/prescriptionImageTypes

### Interfaces
- MedicineCardProps

### Functions
- MedicineCard

---

## Components\dashboard\prescription-review\OtherNotesCard.tsx

Lines : 71
Size  : 1032 bytes
Empty : NO

### Imports
- @/lib/medicalFormatter

### Interfaces
- Props

### Functions
- OtherNotesCard

---

## Components\dashboard\prescription-review\PatientCard.tsx

Lines : 311
Size  : 4097 bytes
Empty : NO

### Imports
- @/lib/medicalFormatter

### Interfaces
- PatientCardProps

### Functions
- formatDate
- toTitleCase
- PatientCard

---

## Components\dashboard\prescription-review\ReviewActions.tsx

Lines : 203
Size  : 1653 bytes
Empty : NO

### Imports
- @/lib/medicalFormatter

### Interfaces
- Props

### Functions
- ReviewActions

---

## Components\dashboard\prescription-review\VitalsCard.tsx

Lines : 124
Size  : 1725 bytes
Empty : NO

### Imports
- @/lib/medicalFormatter

### Interfaces
- Props

### Functions
- VitalsCard

---

## Components\dashboard\prescription\PrescriptionTabs.tsx

Lines : 133
Size  : 2842 bytes
Empty : NO

### Imports
- react

### Exports
- PrescriptionTab

### Interfaces
- Props

### Functions
- PrescriptionTabs

---

## Components\dashboard\PrescriptionDetailsPanel.tsx

Lines : 1
Size  : 0 bytes
Empty : YES

---

## Components\dashboard\PrescriptionHistoryWorkspace.tsx

Lines : 1377
Size  : 21909 bytes
Empty : NO

### Imports
- react
- @/lib/prescription/prescriptionRepository

### Interfaces
- PrescriptionHistoryWorkspaceProps
- PrescriptionSummary

### Functions
- PrescriptionHistoryWorkspace
- loadSummary
- handleRetrieve
- SummaryItem

---

## Components\dashboard\PrescriptionReview.tsx

Lines : 426
Size  : 6973 bytes
Empty : NO

### Imports
- react

### Interfaces
- PrescriptionReviewProps

### Functions
- PrescriptionReview

---

## Components\dashboard\PrescriptionWorkspace.styles.ts

Lines : 203
Size  : 2923 bytes
Empty : NO

### Imports
- react

### Exports
- workspaceContainer
- cameraContainer
- cameraVideo
- cameraActionRow
- progressContainer
- progressHeader
- progressTrack
- progressFill
- errorBox
- errorText
- successBox
- successText
- primaryButton
- secondaryButton

---

## Components\dashboard\PrescriptionWorkspace.tsx

Lines : 1195
Size  : 22456 bytes
Empty : NO

### Interfaces
- PrescriptionWorkspaceProps

### Functions
- PrescriptionWorkspace
- handleFiles
- openCamera
- captureCameraPhoto
- closeCamera
- removeAllSelectedFiles
- cancelReview
- readPrescription
- savePrescription

---

## Components\dashboard\UploadCareWorkspace.tsx

Lines : 1636
Size  : 30177 bytes
Empty : NO

### Interfaces
- UploadCareWorkspaceProps
- UploadReadingState

### Functions
- createEmptyReading
- UploadCareWorkspace
- updateField
- resetUploadSession
- handleMedicalImage
- saveReading

---

## Components\dashboard\VoiceCareWorkspace.tsx

Lines : 1250
Size  : 20978 bytes
Empty : NO

### Imports
- @/Components/daily-care/VoiceRecorder

### Interfaces
- VoiceCareWorkspaceProps

### Functions
- VoiceCareWorkspace
- resetVoiceSession
- processVoiceRecording
- reRecordVoice
- saveVoiceObservation

---

## Components\Header.tsx

Lines : 99
Size  : 1999 bytes
Empty : NO

### Imports
- react

### Functions
- Header

---

## Components\help\HelpBackButton.tsx

Lines : 44
Size  : 725 bytes
Empty : NO

### Imports
- next/link

### Functions
- HelpBackButton

---

## Components\help\HelpCard.tsx

Lines : 104
Size  : 2237 bytes
Empty : NO

### Imports
- next/link

### Interfaces
- HelpCardProps

### Functions
- HelpCard

---

## Components\language\LanguageProvider.tsx

Lines : 210
Size  : 3649 bytes
Empty : NO

### Exports
- LanguageProvider
- useLanguage

### Interfaces
- LanguageContextValue
- LanguageProviderProps

### Functions
- isSupportedLanguage
- LanguageProvider
- setLanguage
- useLanguage

---

## Components\language\LanguageSelector.tsx

Lines : 127
Size  : 1985 bytes
Empty : NO

### Functions
- LanguageSelector

---

## Components\patient\PersonSelector.tsx

Lines : 686
Size  : 11311 bytes
Empty : NO

### Exports
- PersonMode
- PersonSelection

### Interfaces
- PersonSelection

### Functions
- PersonSelector
- loadPatients

---

## lib\analytics\analyticsEvents.ts

Lines : 207
Size  : 4196 bytes
Empty : NO

### Exports
- ANALYTICS_MODULES
- ANALYTICS_EVENTS
- ANALYTICS_CONTEXTS
- ANALYTICS_INPUT_METHODS
- ANALYTICS_PLATFORMS

---

## lib\analytics\analyticsIdentity.ts

Lines : 183
Size  : 3517 bytes
Empty : NO

### Exports
- getAnalyticsSessionId
- getAnalyticsAnonymousId

### Functions
- createId
- getAnalyticsSessionId
- getAnalyticsAnonymousId

---

## lib\analytics\analyticsService.ts

Lines : 250
Size  : 4970 bytes
Empty : NO

### Exports
- analyticsService

### Classes
- AnalyticsService

---

## lib\analytics\analyticsTypes.ts

Lines : 190
Size  : 4142 bytes
Empty : NO

### Exports
- AnalyticsPlatform
- AnalyticsInputMethod
- AnalyticsModule
- AnalyticsEventName
- AnalyticsContext
- AnalyticsEventInput
- AnalyticsEventRecord

### Interfaces
- AnalyticsEventInput
- AnalyticsEventRecord

---

## lib\analytics\authSessionService.ts

Lines : 280
Size  : 6239 bytes
Empty : NO

### Exports
- AuthSessionStartResult
- authSessionService

### Interfaces
- AuthSessionStartResult

### Classes
- AuthSessionService

---

## lib\assessmentStorage.ts

Lines : 48
Size  : 879 bytes
Empty : NO

### Imports
- ./reportStorage

### Exports
- clearAssessmentData

---

## lib\auth\authService.ts

Lines : 298
Size  : 4534 bytes
Empty : NO

### Imports
- @/lib/supabase

### Exports
- AuthService
- authService

### Classes
- AuthService

---

## lib\builders\assessmentBuilder.ts

Lines : 73
Size  : 1394 bytes
Empty : NO

### Imports
- @/lib/types/assessmentDraft
- @/lib/types/assessmentScore

### Exports
- AssessmentBuilder

### Classes
- AssessmentBuilder

---

## lib\builders\clinicalEventBuilder.ts

Lines : 79
Size  : 1625 bytes
Empty : NO

### Imports
- @/lib/types/dailyCare

### Exports
- ClinicalEventBuilder

### Classes
- ClinicalEventBuilder

---

## lib\builders\SelfTrendBuilder.ts

Lines : 406
Size  : 6367 bytes
Empty : NO

### Imports
- @/lib/types/selfDailyCare
- @/lib/trends/trendRequest

### Exports
- SelfTrendBuilder
- selfTrendBuilder

### Classes
- SelfTrendBuilder

---

## lib\builders\TrendBuilder.ts

Lines : 406
Size  : 6331 bytes
Empty : NO

### Imports
- @/lib/types/dailyCare
- @/lib/trends/trendRequest

### Exports
- TrendBuilder
- trendBuilder

### Classes
- TrendBuilder

---

## lib\clinical-intelligence\ClarificationEngine.ts

Lines : 1
Size  : 0 bytes
Empty : YES

---

## lib\clinical-intelligence\ClinicalComparisonEngine.ts

Lines : 1677
Size  : 34348 bytes
Empty : NO

### Exports
- ClinicalComparisonEngine

### Classes
- ClinicalComparisonEngine

---

## lib\clinical-intelligence\comparisonTypes.ts

Lines : 465
Size  : 9174 bytes
Empty : NO

### Exports
- ChangeType
- MedicineChangeType
- ClarificationPriority
- MedicineField
- MedicineComparison
- CollectionComparison
- ComplaintComparison
- HistoryComparison
- AssessmentComparison
- InvestigationComparison
- DoctorInstructionComparison
- FollowUpComparison
- PatientComparison
- DoctorComparison
- HospitalComparison
- ConsultationModeComparison
- ConsultationDateComparison
- AdditionalNotesComparison
- VitalField
- VitalComparison
- VitalsComparison
- ClinicalNoteType
- ClinicalNote
- ClarificationType
- ClarificationOption
- ClarificationQuestion
- ComparisonStatistics
- ComparisonEngineOptions
- DEFAULT_COMPARISON_OPTIONS
- ComparisonConfidence
- ConfirmationStatus
- ClinicalComparisonResult
- TimelineEventDraft
- ClinicalComparisonOutput
- DEFAULT_CONFIDENCE_SCORE
- LOW_CONFIDENCE_THRESHOLD

### Interfaces
- MedicineComparison
- CollectionComparison
- PatientComparison
- DoctorComparison
- HospitalComparison
- ConsultationModeComparison
- ConsultationDateComparison
- AdditionalNotesComparison
- VitalComparison
- VitalsComparison
- ClinicalNote
- ClarificationOption
- ClarificationQuestion
- ComparisonStatistics
- ComparisonEngineOptions
- ComparisonConfidence
- ClinicalComparisonResult
- TimelineEventDraft
- ClinicalComparisonOutput

---

## lib\clinical-intelligence\index.ts

Lines : 1
Size  : 0 bytes
Empty : YES

---

## lib\clinical-summary\ClinicalSummaryEngine.ts

Lines : 319
Size  : 6019 bytes
Empty : NO

### Imports
- ./TemperatureAnalyzer
- ./VitalsAnalyzer
- ./SymptomsAnalyzer
- ./PainAnalyzer

### Exports
- ClinicalSummaryEngine

### Classes
- ClinicalSummaryEngine

### Functions
- determineOverallStatus

---

## lib\clinical-summary\ClinicalSummaryTypes.ts

Lines : 70
Size  : 1233 bytes
Empty : NO

### Exports
- ClinicalSeverity
- ClinicalFinding
- ClinicalRecommendation
- ClinicalSummary
- ClinicalSummaryInput

### Interfaces
- ClinicalFinding
- ClinicalRecommendation
- ClinicalSummary
- ClinicalSummaryInput

---

## lib\clinical-summary\PainAnalyzer.ts

Lines : 88
Size  : 1854 bytes
Empty : NO

### Exports
- PainAnalyzer

### Classes
- PainAnalyzer

---

## lib\clinical-summary\RecommendationEngine.ts

Lines : 1
Size  : 0 bytes
Empty : YES

---

## lib\clinical-summary\SymptomsAnalyzer.ts

Lines : 200
Size  : 3627 bytes
Empty : NO

### Exports
- SymptomsAnalyzer

### Classes
- SymptomsAnalyzer

---

## lib\clinical-summary\TemperatureAnalyzer.ts

Lines : 134
Size  : 2420 bytes
Empty : NO

### Exports
- TemperatureAnalyzer

### Classes
- TemperatureAnalyzer

---

## lib\clinical-summary\VitalsAnalyzer.ts

Lines : 151
Size  : 3596 bytes
Empty : NO

### Exports
- VitalsAnalyzer

### Classes
- VitalsAnalyzer

---

## lib\config\consent.ts

Lines : 11
Size  : 259 bytes
Empty : NO

### Exports
- CONSENT_VERSION
- PRIVACY_POLICY_VERSION
- TERMS_OF_USE_VERSION
- MEDICAL_DISCLAIMER_VERSION
- AI_DISCLAIMER_VERSION
- DEFAULT_CONSENT_LANGUAGE

---

## lib\consent\mapper\consentMapper.ts

Lines : 131
Size  : 2167 bytes
Empty : NO

### Exports
- ConsentRow
- ConsentMapper

### Interfaces
- ConsentRow

### Classes
- ConsentMapper

---

## lib\consent\models\Consent.ts

Lines : 27
Size  : 378 bytes
Empty : NO

### Exports
- Consent

### Interfaces
- Consent

---

## lib\consent\repository\consentRepository.ts

Lines : 122
Size  : 1932 bytes
Empty : NO

### Imports
- @/lib/supabase
- @/lib/repositories/BaseRepository

### Exports
- ConsentRepository
- consentRepository

### Classes
- ConsentRepository

---

## lib\consent\storage\consentStorage.ts

Lines : 69
Size  : 1286 bytes
Empty : NO

### Exports
- ConsentStorage
- consentStorage

### Classes
- ConsentStorage

---

## lib\constants\consentVersions.ts

Lines : 15
Size  : 450 bytes
Empty : NO

### Exports
- CURRENT_CONSENT_VERSION
- CURRENT_PRIVACY_POLICY_VERSION
- CURRENT_TERMS_VERSION
- CURRENT_MEDICAL_DISCLAIMER_VERSION
- CURRENT_AI_DISCLAIMER_VERSION
- DEFAULT_CONSENT_LANGUAGE

---

## lib\core\clinical\clinicalConstants.ts

Lines : 17
Size  : 385 bytes
Empty : NO

---

## lib\core\clinical\clinicalEnums.ts

Lines : 17
Size  : 381 bytes
Empty : NO

---

## lib\core\clinical\comparison.ts

Lines : 17
Size  : 378 bytes
Empty : NO

---

## lib\core\clinical\confidence.ts

Lines : 17
Size  : 378 bytes
Empty : NO

---

## lib\core\clinical\consultation.ts

Lines : 17
Size  : 380 bytes
Empty : NO

---

## lib\core\clinical\governance.ts

Lines : 17
Size  : 378 bytes
Empty : NO

---

## lib\core\clinical\identifiers.ts

Lines : 17
Size  : 379 bytes
Empty : NO

---

## lib\core\clinical\index.ts

Lines : 17
Size  : 463 bytes
Empty : NO

---

## lib\core\clinical\journeyContext.ts

Lines : 17
Size  : 382 bytes
Empty : NO

---

## lib\core\clinical\metadata.ts

Lines : 17
Size  : 376 bytes
Empty : NO

---

## lib\core\clinical\patient.ts

Lines : 17
Size  : 375 bytes
Empty : NO

---

## lib\core\clinical\prescription.ts

Lines : 17
Size  : 380 bytes
Empty : NO

---

## lib\core\clinical\reconciliation.ts

Lines : 17
Size  : 382 bytes
Empty : NO

---

## lib\core\clinical\timeline.ts

Lines : 17
Size  : 376 bytes
Empty : NO

---

## lib\core\clinical\treatment.ts

Lines : 17
Size  : 377 bytes
Empty : NO

---

## lib\database.ts

Lines : 63
Size  : 942 bytes
Empty : NO

### Exports
- PatientRow
- SelfProfileRow
- ClinicalEventRow

### Interfaces
- PatientRow
- SelfProfileRow
- ClinicalEventRow

---

## lib\i18n\config.ts

Lines : 78
Size  : 1375 bytes
Empty : NO

### Exports
- LanguageOption
- DEFAULT_LANGUAGE
- LANGUAGE_STORAGE_KEY
- LANGUAGE_OPTIONS

### Interfaces
- LanguageOption

---

## lib\i18n\index.ts

Lines : 114
Size  : 1893 bytes
Empty : NO

### Imports
- ./translations/en
- ./translations/hi
- ./translations/kn
- ./translations/te
- ./translations/ml
- ./translations/ta
- ./translations/mr
- ./translations/bn
- ./translations/gu
- ./translations/pa
- ./translations/or
- ./translations/as

### Exports
- translations
- translate

### Functions
- getTranslationValue
- translate

---

## lib\i18n\translations\as.ts

Lines : 1338
Size  : 42562 bytes
Empty : NO

### Exports
- as

---

## lib\i18n\translations\bn.ts

Lines : 1228
Size  : 41656 bytes
Empty : NO

### Exports
- bn

---

## lib\i18n\translations\en.ts

Lines : 1381
Size  : 26273 bytes
Empty : NO

### Exports
- en

---

## lib\i18n\translations\gu.ts

Lines : 1335
Size  : 40958 bytes
Empty : NO

### Exports
- gu

---

## lib\i18n\translations\hi.ts

Lines : 1224
Size  : 39319 bytes
Empty : NO

### Exports
- hi

---

## lib\i18n\translations\kn.ts

Lines : 1225
Size  : 43036 bytes
Empty : NO

### Exports
- kn

---

## lib\i18n\translations\ml.ts

Lines : 1227
Size  : 46430 bytes
Empty : NO

### Exports
- ml

---

## lib\i18n\translations\mr.ts

Lines : 1228
Size  : 40080 bytes
Empty : NO

### Exports
- mr

---

## lib\i18n\translations\or.ts

Lines : 1278
Size  : 43115 bytes
Empty : NO

### Exports
- or

---

## lib\i18n\translations\pa.ts

Lines : 1338
Size  : 41181 bytes
Empty : NO

### Exports
- pa

---

## lib\i18n\translations\ta.ts

Lines : 1228
Size  : 48761 bytes
Empty : NO

### Exports
- ta

---

## lib\i18n\translations\te.ts

Lines : 1228
Size  : 43937 bytes
Empty : NO

### Exports
- te

---

## lib\i18n\types.ts

Lines : 23
Size  : 340 bytes
Empty : NO

### Exports
- SUPPORTED_LANGUAGES
- SupportedLanguage
- TranslationDictionary

---

## lib\journey\activeTreatment\index.ts

Lines : 2
Size  : 31 bytes
Empty : NO

---

## lib\journey\activeTreatment\lifecycleEngine.ts

Lines : 4
Size  : 50 bytes
Empty : NO

### Exports
- Engine

### Classes
- Engine

---

## lib\journey\activeTreatment\lifecycleMapper.ts

Lines : 4
Size  : 50 bytes
Empty : NO

### Exports
- Mapper

### Classes
- Mapper

---

## lib\journey\activeTreatment\lifecycleRepository.ts

Lines : 4
Size  : 58 bytes
Empty : NO

### Exports
- Repository

### Classes
- Repository

---

## lib\journey\activeTreatment\lifecycleRules.ts

Lines : 4
Size  : 46 bytes
Empty : NO

---

## lib\journey\activeTreatment\lifecycleStorage.ts

Lines : 4
Size  : 52 bytes
Empty : NO

### Exports
- Storage

### Classes
- Storage

---

## lib\journey\activeTreatment\lifecycleTypes.ts

Lines : 4
Size  : 46 bytes
Empty : NO

---

## lib\journey\activeTreatment\lifecycleValidator.ts

Lines : 4
Size  : 63 bytes
Empty : NO

### Exports
- Validator

### Classes
- Validator

---

## lib\journey\activeTreatment\models\lifecycleModel.ts

Lines : 4
Size  : 56 bytes
Empty : NO

### Exports
- Model

### Interfaces
- Model

---

## lib\journey\classification\classificationMapper.ts

Lines : 4
Size  : 50 bytes
Empty : NO

### Exports
- Mapper

### Classes
- Mapper

---

## lib\journey\classification\classificationRepository.ts

Lines : 4
Size  : 58 bytes
Empty : NO

### Exports
- Repository

### Classes
- Repository

---

## lib\journey\classification\classificationRules.ts

Lines : 4
Size  : 46 bytes
Empty : NO

---

## lib\journey\classification\classificationStorage.ts

Lines : 4
Size  : 52 bytes
Empty : NO

### Exports
- Storage

### Classes
- Storage

---

## lib\journey\classification\classificationTypes.ts

Lines : 4
Size  : 46 bytes
Empty : NO

---

## lib\journey\classification\classificationValidator.ts

Lines : 4
Size  : 63 bytes
Empty : NO

### Exports
- Validator

### Classes
- Validator

---

## lib\journey\classification\consultationClassifier.ts

Lines : 4
Size  : 58 bytes
Empty : NO

### Exports
- Classifier

### Classes
- Classifier

---

## lib\journey\classification\index.ts

Lines : 1
Size  : 0 bytes
Empty : YES

---

## lib\journey\classification\journeyClassificationEngine.ts

Lines : 4
Size  : 50 bytes
Empty : NO

### Exports
- Engine

### Classes
- Engine

---

## lib\journey\classification\models\classificationModel.ts

Lines : 4
Size  : 56 bytes
Empty : NO

### Exports
- Model

### Interfaces
- Model

---

## lib\journey\context\index.ts

Lines : 2
Size  : 31 bytes
Empty : NO

---

## lib\journey\context\journeyContext.ts

Lines : 69
Size  : 1267 bytes
Empty : NO

### Exports
- JourneyContext

### Interfaces
- JourneyContext

---

## lib\journey\context\journeyContextBuilder.ts

Lines : 4
Size  : 52 bytes
Empty : NO

### Exports
- Builder

### Classes
- Builder

---

## lib\journey\context\journeyContextValidator.ts

Lines : 4
Size  : 63 bytes
Empty : NO

### Exports
- Validator

### Classes
- Validator

---

## lib\journey\governance\governanceEngine.ts

Lines : 4
Size  : 50 bytes
Empty : NO

### Exports
- Engine

### Classes
- Engine

---

## lib\journey\governance\governanceRepository.ts

Lines : 4
Size  : 58 bytes
Empty : NO

### Exports
- Repository

### Classes
- Repository

---

## lib\journey\governance\governanceRules.ts

Lines : 4
Size  : 46 bytes
Empty : NO

---

## lib\journey\governance\governanceStorage.ts

Lines : 4
Size  : 52 bytes
Empty : NO

### Exports
- Storage

### Classes
- Storage

---

## lib\journey\governance\governanceTypes.ts

Lines : 4
Size  : 46 bytes
Empty : NO

---

## lib\journey\governance\governanceValidator.ts

Lines : 4
Size  : 63 bytes
Empty : NO

### Exports
- Validator

### Classes
- Validator

---

## lib\journey\governance\index.ts

Lines : 2
Size  : 31 bytes
Empty : NO

---

## lib\journey\governance\models\governanceModel.ts

Lines : 4
Size  : 56 bytes
Empty : NO

### Exports
- Model

### Interfaces
- Model

---

## lib\journey\index.ts

Lines : 26
Size  : 753 bytes
Empty : NO

---

## lib\journey\JourneyAnalysisEngine.ts

Lines : 195
Size  : 4719 bytes
Empty : NO

### Imports
- ../clinical/comparison/comparisonTypes
- ./journeyTypes
- ./journeyValidation
- ./questionBuilder
- ./summaryBuilder
- ./timelineBuilder

### Exports
- JourneyAnalysisEngine

### Classes
- JourneyAnalysisEngine

---

## lib\journey\journeyConstants.ts

Lines : 187
Size  : 5159 bytes
Empty : NO

### Exports
- DEFAULT_ANALYSIS_CONFIDENCE
- MINIMUM_AUTO_SAVE_CONFIDENCE
- MINIMUM_USER_REVIEW_CONFIDENCE
- MAX_QUESTIONS_PER_ANALYSIS
- MAX_TIMELINE_EVENTS
- MAX_SUMMARY_ITEMS
- QUESTION_PRIORITY
- TIMELINE_ICONS
- TIMELINE_COLORS
- DEFAULT_QUESTION_LABELS
- DEFAULT_QUESTION_TEMPLATE
- TIMELINE_TITLES
- TREATMENT_CHANGE_REASONS
- DIGITAL_CONSULTATION_SOURCES
- SUPPORTED_DOCUMENT_TYPES
- MAX_REASON_LENGTH
- MAX_NOTE_LENGTH
- MAX_TITLE_LENGTH
- MAX_DESCRIPTION_LENGTH
- JOURNEY_METADATA_KEYS

---

## lib\journey\journeyMapper.ts

Lines : 124
Size  : 3065 bytes
Empty : NO

### Exports
- JourneyMapper

### Classes
- JourneyMapper

---

## lib\journey\journeyModels.ts

Lines : 331
Size  : 5635 bytes
Empty : NO

### Exports
- JourneyContext
- DetectedChange
- JourneyQuestionOption
- JourneyQuestion
- JourneyAnswer
- TreatmentDecision
- TreatmentMedicine
- ActiveTreatment
- JourneySummaryItem
- JourneySummary
- TimelineDraftEvent
- TimelineDraft
- JourneyAction
- JourneyAnalysisResult
- ActiveTreatment
- TreatmentMedicine

### Interfaces
- JourneyContext
- DetectedChange
- JourneyQuestionOption
- JourneyQuestion
- JourneyAnswer
- TreatmentDecision
- TreatmentMedicine
- ActiveTreatment
- JourneySummaryItem
- JourneySummary
- TimelineDraftEvent
- TimelineDraft
- JourneyAction
- JourneyAnalysisResult
- ActiveTreatment
- TreatmentMedicine

---

## lib\journey\journeyRepository.ts

Lines : 123
Size  : 3215 bytes
Empty : NO

### Imports
- ./journeyModels
- ./journeyMapper
- ./journeyStorage

### Exports
- JourneyRepository

### Classes
- JourneyRepository

---

## lib\journey\journeyRules.ts

Lines : 205
Size  : 4661 bytes
Empty : NO

### Exports
- JourneyRule
- JOURNEY_RULES
- JOURNEY_RULE_MAP

### Interfaces
- JourneyRule

---

## lib\journey\journeyStorage.ts

Lines : 169
Size  : 3960 bytes
Empty : NO

### Imports
- @/lib/supabase/client

### Exports
- JourneyStorage

### Classes
- JourneyStorage

---

## lib\journey\journeyTypes.ts

Lines : 157
Size  : 4371 bytes
Empty : NO

### Exports
- JourneyType
- JourneyStatus
- JourneyQuestionType
- JourneyQuestionCategory
- JourneyChangeType
- JourneyEventType
- TreatmentDecisionType
- EmergencyType
- ConsultationContext
- ConsultationSource

### Enums
- JourneyType
- JourneyStatus
- JourneyQuestionType
- JourneyQuestionCategory
- JourneyChangeType
- JourneyEventType
- TreatmentDecisionType
- EmergencyType
- ConsultationContext
- ConsultationSource

---

## lib\journey\journeyUtils.ts

Lines : 150
Size  : 3227 bytes
Empty : NO

### Imports
- ./journeyRules
- ./journeyTypes

### Exports
- JourneyUtils

### Classes
- JourneyUtils

---

## lib\journey\journeyValidation.ts

Lines : 111
Size  : 2584 bytes
Empty : NO

### Exports
- JourneyValidation

### Classes
- JourneyValidation

---

## lib\journey\questionBuilder.ts

Lines : 100
Size  : 3019 bytes
Empty : NO

### Imports
- ./journeyRules
- ./journeyUtils
- ./journeyTypes

### Exports
- QuestionBuilder

### Classes
- QuestionBuilder

---

## lib\journey\scenarios\index.ts

Lines : 2
Size  : 31 bytes
Empty : NO

---

## lib\journey\scenarios\models\scenarioModel.ts

Lines : 4
Size  : 56 bytes
Empty : NO

### Exports
- Model

### Interfaces
- Model

---

## lib\journey\scenarios\scenarioEngine.ts

Lines : 4
Size  : 50 bytes
Empty : NO

### Exports
- Engine

### Classes
- Engine

---

## lib\journey\scenarios\scenarioRegistry.ts

Lines : 4
Size  : 54 bytes
Empty : NO

### Exports
- Registry

### Classes
- Registry

---

## lib\journey\scenarios\scenarioResolver.ts

Lines : 4
Size  : 54 bytes
Empty : NO

### Exports
- Resolver

### Classes
- Resolver

---

## lib\journey\scenarios\scenarioRules.ts

Lines : 4
Size  : 46 bytes
Empty : NO

---

## lib\journey\scenarios\scenarioTypes.ts

Lines : 4
Size  : 46 bytes
Empty : NO

---

## lib\journey\scenarios\scenarioValidator.ts

Lines : 4
Size  : 63 bytes
Empty : NO

### Exports
- Validator

### Classes
- Validator

---

## lib\journey\summaryBuilder.ts

Lines : 73
Size  : 1853 bytes
Empty : NO

### Exports
- SummaryBuilder

### Classes
- SummaryBuilder

---

## lib\journey\timeline\index.ts

Lines : 2
Size  : 31 bytes
Empty : NO

---

## lib\journey\timeline\models\timelineEventModel.ts

Lines : 4
Size  : 56 bytes
Empty : NO

### Exports
- Model

### Interfaces
- Model

---

## lib\journey\timeline\timelineEventBuilder.ts

Lines : 4
Size  : 52 bytes
Empty : NO

### Exports
- Builder

### Classes
- Builder

---

## lib\journey\timeline\timelineEventGenerator.ts

Lines : 2
Size  : 8 bytes
Empty : NO

---

## lib\journey\timeline\timelineEventRepository.ts

Lines : 4
Size  : 58 bytes
Empty : NO

### Exports
- Repository

### Classes
- Repository

---

## lib\journey\timeline\timelineEventRules.ts

Lines : 4
Size  : 46 bytes
Empty : NO

---

## lib\journey\timeline\timelineEventStorage.ts

Lines : 4
Size  : 52 bytes
Empty : NO

### Exports
- Storage

### Classes
- Storage

---

## lib\journey\timeline\timelineEventTypes.ts

Lines : 4
Size  : 46 bytes
Empty : NO

---

## lib\journey\timeline\timelineEventValidator.ts

Lines : 4
Size  : 63 bytes
Empty : NO

### Exports
- Validator

### Classes
- Validator

---

## lib\journey\timelineBuilder.ts

Lines : 96
Size  : 2060 bytes
Empty : NO

### Imports
- ./journeyRules
- ./journeyUtils

### Exports
- TimelineBuilder

### Classes
- TimelineBuilder

---

## lib\journey\treatment\index.ts

Lines : 2
Size  : 31 bytes
Empty : NO

---

## lib\journey\treatment\models\treatmentDecisionModel.ts

Lines : 4
Size  : 56 bytes
Empty : NO

### Exports
- Model

### Interfaces
- Model

---

## lib\journey\treatment\treatmentDecisionEngine.ts

Lines : 4
Size  : 50 bytes
Empty : NO

### Exports
- Engine

### Classes
- Engine

---

## lib\journey\treatment\treatmentDecisionMapper.ts

Lines : 4
Size  : 50 bytes
Empty : NO

### Exports
- Mapper

### Classes
- Mapper

---

## lib\journey\treatment\treatmentDecisionRepository.ts

Lines : 4
Size  : 58 bytes
Empty : NO

### Exports
- Repository

### Classes
- Repository

---

## lib\journey\treatment\treatmentDecisionRules.ts

Lines : 4
Size  : 46 bytes
Empty : NO

---

## lib\journey\treatment\treatmentDecisionStorage.ts

Lines : 4
Size  : 52 bytes
Empty : NO

### Exports
- Storage

### Classes
- Storage

---

## lib\journey\treatment\treatmentDecisionTypes.ts

Lines : 4
Size  : 46 bytes
Empty : NO

---

## lib\journey\treatment\treatmentDecisionValidator.ts

Lines : 4
Size  : 63 bytes
Empty : NO

### Exports
- Validator

### Classes
- Validator

---

## lib\mappers\assessmentMapper.ts

Lines : 126
Size  : 2526 bytes
Empty : NO

### Exports
- AssessmentRow
- AssessmentMapper

### Interfaces
- AssessmentRow

### Classes
- AssessmentMapper

---

## lib\mappers\clinicalEventMapper.ts

Lines : 76
Size  : 1337 bytes
Empty : NO

### Imports
- @/lib/database

### Exports
- ClinicalEventMapper

### Classes
- ClinicalEventMapper

---

## lib\mappers\DailyCareMapper.ts

Lines : 157
Size  : 2646 bytes
Empty : NO

### Exports
- DailyCareRow
- DailyCareMapper

### Interfaces
- DailyCareRow

### Classes
- DailyCareMapper

---

## lib\mappers\PatientMapper.ts

Lines : 54
Size  : 1048 bytes
Empty : NO

### Imports
- ../types/patient
- ../database

### Exports
- PatientMapper

### Classes
- PatientMapper

---

## lib\mappers\SelfDailyCareMapper.ts

Lines : 171
Size  : 3076 bytes
Empty : NO

### Exports
- SelfDailyCareRow
- SelfDailyCareMapper

### Interfaces
- SelfDailyCareRow

### Classes
- SelfDailyCareMapper

---

## lib\mappers\SelfProfileMapper.ts

Lines : 54
Size  : 910 bytes
Empty : NO

### Imports
- ../selfProfile
- ../database

### Exports
- SelfProfileMapper

### Classes
- SelfProfileMapper

---

## lib\medical-image\medicalImageParser.ts

Lines : 214
Size  : 3531 bytes
Empty : NO

### Exports
- parseMedicalImageText
- hasMedicalReading

### Functions
- extractNumberAfterLabel
- extractTemperature
- extractWeight
- parseMedicalImageText
- hasMedicalReading

---

## lib\medical-image\medicalImageService.ts

Lines : 102
Size  : 1656 bytes
Empty : NO

### Exports
- medicalImageService

---

## lib\medical-image\medicalImageTypes.ts

Lines : 41
Size  : 932 bytes
Empty : NO

### Exports
- TemperatureUnit
- MedicalImageReadings
- MedicalImageProcessingResult

### Interfaces
- MedicalImageReadings
- MedicalImageProcessingResult

---

## lib\medical-voice\medicalVoiceService.ts

Lines : 233
Size  : 3921 bytes
Empty : NO

### Exports
- medicalVoiceService

---

## lib\medical-voice\medicalVoiceTypes.ts

Lines : 103
Size  : 1734 bytes
Empty : NO

### Exports
- MedicalVoiceOverallObservation
- MedicalVoiceProcessingMode
- MedicalVoiceDailyCareDraft
- MedicalVoiceProcessingData
- MedicalVoiceProcessingResult

### Interfaces
- MedicalVoiceDailyCareDraft
- MedicalVoiceProcessingData

---

## lib\medicalFormatter.ts

Lines : 44
Size  : 2048 bytes
Empty : NO

### Exports
- expandMedicalText

### Functions
- expandMedicalText

---

## lib\pdf\DailyCarePdfGenerator.ts

Lines : 782
Size  : 10730 bytes
Empty : NO

### Imports
- ./PdfModels
- @/lib/utils/displayFormatter

### Exports
- DailyCarePdfGenerator

### Classes
- DailyCarePdfGenerator

---

## lib\pdf\PdfFormatter.ts

Lines : 8
Size  : 189 bytes
Empty : NO

### Exports
- PdfFormatter

### Classes
- PdfFormatter

---

## lib\pdf\PdfModels.ts

Lines : 26
Size  : 505 bytes
Empty : NO

### Imports
- @/lib/types/selfDailyCare
- @/lib/clinical-summary/ClinicalSummaryTypes

### Exports
- DailyCareReportType
- DailyCarePdfRequest

### Interfaces
- DailyCarePdfRequest

---

## lib\pdf\PdfStyles.ts

Lines : 1
Size  : 0 bytes
Empty : YES

---

## lib\pdf\trendReportPdf.ts

Lines : 23
Size  : 528 bytes
Empty : NO

### Imports
- @/lib/trends/trendResult

### Exports
- TrendReportPdf
- trendReportPdf

### Classes
- TrendReportPdf

---

## lib\performance\performanceStorage.ts

Lines : 365
Size  : 5715 bytes
Empty : NO

### Exports
- performanceStorage

### Functions
- openDatabase
- save
- getAll
- clear

---

## lib\performance\performanceTracker.ts

Lines : 447
Size  : 6228 bytes
Empty : NO

### Exports
- performanceTracker

### Functions
- createId
- getJourneyId
- detectDeviceType
- detectPlatform
- start
- complete
- cancel

---

## lib\performance\performanceTypes.ts

Lines : 94
Size  : 1766 bytes
Empty : NO

### Exports
- PerformanceStatus
- PerformanceContext
- PerformanceDeviceType
- PerformancePlatform
- PendingPerformanceTransition
- PerformanceRecord

### Interfaces
- PendingPerformanceTransition
- PerformanceRecord

---

## lib\prescription-ai\classification\clinicalRouter.ts

Lines : 374
Size  : 7574 bytes
Empty : NO

### Exports
- RoutedAssessment
- RoutedInvestigation
- RoutedInstruction
- RoutedPrescription
- routeClinicalInformation

### Interfaces
- RoutedAssessment
- RoutedInvestigation
- RoutedInstruction
- RoutedPrescription

### Functions
- routeClinicalInformation
- clean
- uniqueStrings
- deduplicateMedicines
- buildAssessment
- buildInvestigations
- classifyInvestigation
- buildInstructions
- classifyInstruction
- buildFollowUpNotes

---

## lib\prescription-ai\consultation\assessmentRules.ts

Lines : 117
Size  : 2254 bytes
Empty : NO

### Exports
- ASSESSMENT_RULES

---

## lib\prescription-ai\consultation\complaintsRules.ts

Lines : 293
Size  : 4564 bytes
Empty : NO

### Exports
- COMPLAINTS_RULES

---

## lib\prescription-ai\consultation\consultationPromptBuilder.ts

Lines : 33
Size  : 957 bytes
Empty : NO

### Imports
- ./complaintsRules
- ./vitalsRules
- ./historyRules
- ./examinationRules
- ./assessmentRules
- ./investigationRules
- ./doctorInstructionRules

### Exports
- buildConsultationPrompt

### Functions
- buildConsultationPrompt

---

## lib\prescription-ai\consultation\consultationTypes.ts

Lines : 1
Size  : 0 bytes
Empty : YES

---

## lib\prescription-ai\consultation\doctorInstructionRules.ts

Lines : 188
Size  : 3076 bytes
Empty : NO

### Exports
- DOCTOR_INSTRUCTION_RULES

---

## lib\prescription-ai\consultation\examinationRules.ts

Lines : 232
Size  : 3441 bytes
Empty : NO

### Exports
- EXAMINATION_RULES

---

## lib\prescription-ai\consultation\historyRules.ts

Lines : 159
Size  : 2655 bytes
Empty : NO

### Exports
- HISTORY_RULES

---

## lib\prescription-ai\consultation\investigationRules.ts

Lines : 165
Size  : 2723 bytes
Empty : NO

### Exports
- INVESTIGATION_RULES

---

## lib\prescription-ai\consultation\vitalsRules.ts

Lines : 267
Size  : 4129 bytes
Empty : NO

### Exports
- VITALS_RULES

---

## lib\prescription-ai\examples\cardiologyExamples.ts

Lines : 3
Size  : 132 bytes
Empty : NO

### Imports
- ../prescriptionExamples

### Exports
- CARDIOLOGY_EXAMPLES

---

## lib\prescription-ai\examples\consultationExamples.ts

Lines : 225
Size  : 3811 bytes
Empty : NO

### Imports
- ../prescriptionExamples

### Exports
- CONSULTATION_EXAMPLES

---

## lib\prescription-ai\examples\diabetesExamples.ts

Lines : 3
Size  : 130 bytes
Empty : NO

### Imports
- ../prescriptionExamples

### Exports
- DIABETES_EXAMPLES

---

## lib\prescription-ai\examples\generalMedicineExamples.ts

Lines : 116
Size  : 1551 bytes
Empty : NO

### Imports
- ../prescriptionExamples

### Exports
- GENERAL_MEDICINE_EXAMPLES

---

## lib\prescription-ai\examples\index.ts

Lines : 22
Size  : 612 bytes
Empty : NO

### Imports
- ./consultationExamples
- ./generalMedicineExamples
- ./oncologyExamples
- ./cardiologyExamples
- ./diabetesExamples
- ./pulmonologyExamples

### Exports
- PRESCRIPTION_EXAMPLES

---

## lib\prescription-ai\examples\oncologyExamples.ts

Lines : 61
Size  : 927 bytes
Empty : NO

### Imports
- ../prescriptionExamples

### Exports
- ONCOLOGY_EXAMPLES

---

## lib\prescription-ai\examples\pulmonologyExamples.ts

Lines : 3
Size  : 133 bytes
Empty : NO

### Imports
- ../prescriptionExamples

### Exports
- PULMONOLOGY_EXAMPLES

---

## lib\prescription-ai\extractionInstructions.ts

Lines : 1338
Size  : 23598 bytes
Empty : NO

### Exports
- EXTRACTION_INSTRUCTIONS

---

## lib\prescription-ai\identityExtractionInstructions.ts

Lines : 31
Size  : 828 bytes
Empty : NO

### Exports
- IDENTITY_EXTRACTION_INSTRUCTIONS

---

## lib\prescription-ai\medicines\dosageRules.ts

Lines : 1
Size  : 0 bytes
Empty : YES

---

## lib\prescription-ai\medicines\durationRules.ts

Lines : 1
Size  : 0 bytes
Empty : YES

---

## lib\prescription-ai\medicines\frequencyRules.ts

Lines : 1
Size  : 0 bytes
Empty : YES

---

## lib\prescription-ai\medicines\medicineAssociationRules.ts

Lines : 1
Size  : 0 bytes
Empty : YES

---

## lib\prescription-ai\medicines\timingRules.ts

Lines : 1
Size  : 0 bytes
Empty : YES

---

## lib\prescription-ai\models\consultationModel.ts

Lines : 95
Size  : 2091 bytes
Empty : NO

### Exports
- ConsultationMode
- PatientInfo
- ConsultationInfo
- ConsultationVitals
- Complaint
- HistoryCategory
- History
- Assessment
- Investigation
- Medicine
- DoctorInstruction
- FollowUp
- ConsultationRecord

### Interfaces
- PatientInfo
- ConsultationInfo
- ConsultationVitals
- Complaint
- History
- Assessment
- Investigation
- Medicine
- DoctorInstruction
- FollowUp
- ConsultationRecord

---

## lib\prescription-ai\prescriptionExamples.ts

Lines : 86
Size  : 1421 bytes
Empty : NO

### Exports
- PrescriptionExample

### Interfaces
- PrescriptionExample

---

## lib\prescription-ai\prescriptionKnowledge.ts

Lines : 347
Size  : 4271 bytes
Empty : NO

### Exports
- MEDICINE_PREFIXES
- DOSAGE_PATTERNS
- DURATION_PATTERNS
- INVESTIGATION_KEYWORDS
- INSTRUCTION_KEYWORDS
- DEVICE_KEYWORDS
- SYMPTOM_KEYWORDS
- PAST_HISTORY_KEYWORDS
- EXAMINATION_KEYWORDS
- CONSULTATION_KEYWORDS
- COMMON_MEDICAL_ABBREVIATIONS

---

## lib\prescription-ai\prescriptionReadingRules.ts

Lines : 388
Size  : 7365 bytes
Empty : NO

### Exports
- PRESCRIPTION_READING_RULES

---

## lib\prescription-ai\prescriptionRecognitionRules.ts

Lines : 155
Size  : 2392 bytes
Empty : NO

### Exports
- PRESCRIPTION_RECOGNITION_RULES

---

## lib\prescription-image\prescriptionImageService.ts

Lines : 187
Size  : 3270 bytes
Empty : NO

### Exports
- prescriptionImageService

---

## lib\prescription-image\prescriptionImageTypes.ts

Lines : 186
Size  : 3502 bytes
Empty : NO

### Exports
- ConsultationMode
- ExtractedPrescriptionMedicine
- ExtractedConsultationVital
- ExtractedComplaint
- HistoryCategory
- ExtractedHistory
- ExtractedExaminationFinding
- MedicalDocumentType
- ExtractedPrescription
- PrescriptionImageProcessingResult

### Interfaces
- ExtractedPrescriptionMedicine
- ExtractedConsultationVital
- ExtractedComplaint
- ExtractedHistory
- ExtractedExaminationFinding
- ExtractedPrescription
- PrescriptionImageProcessingResult

---

## lib\prescription\prescriptionMapper.ts

Lines : 371
Size  : 8669 bytes
Empty : NO

### Exports
- mapReviewedPrescriptionToSaveInput

### Interfaces
- PrescriptionMapperContext

### Functions
- normaliseOptionalText
- mapReviewedPrescriptionToSaveInput

---

## lib\prescription\prescriptionRepository.ts

Lines : 1642
Size  : 27470 bytes
Empty : NO

### Exports
- prescriptionRepository

### Interfaces
- PrescriptionRow
- PrescriptionMedicineRow
- PrescriptionHistoryRow
- PrescriptionVitalRow
- PrescriptionSymptomRow

### Functions
- mapPrescriptionRow
- mapMedicineRow
- saveVitals
- saveSymptoms
- saveHistory
- saveAssessments
- saveInvestigations
- saveInstructions
- saveNotes
- getPrescriptionSummary

---

## lib\prescription\prescriptionReviewMapper.ts

Lines : 237
Size  : 3785 bytes
Empty : NO

### Exports
- mapPrescriptionToReview

### Functions
- mapPrescriptionToReview

---

## lib\prescription\prescriptionStorage.ts

Lines : 288
Size  : 5954 bytes
Empty : NO

### Exports
- PrescriptionSaveContext
- prescriptionStorage

### Interfaces
- PrescriptionSaveContext

### Functions
- normaliseConsultationDate
- validateContext

---

## lib\prescription\prescriptionTypes.ts

Lines : 325
Size  : 6411 bytes
Empty : NO

### Exports
- PrescriptionRecordContext
- PrescriptionConsultationMode
- PrescriptionMedicineInput
- PrescriptionVitalInput
- PrescriptionSymptomInput
- PrescriptionHistoryInput
- PrescriptionAssessmentInput
- PrescriptionInvestigationInput
- PrescriptionInstructionInput
- PrescriptionNoteInput
- PrescriptionSaveInput
- PrescriptionRecord
- PrescriptionMedicineRecord
- CompletePrescriptionRecord

### Interfaces
- PrescriptionMedicineInput
- PrescriptionVitalInput
- PrescriptionSymptomInput
- PrescriptionHistoryInput
- PrescriptionAssessmentInput
- PrescriptionInvestigationInput
- PrescriptionInstructionInput
- PrescriptionNoteInput
- PrescriptionSaveInput
- PrescriptionRecord
- PrescriptionMedicineRecord
- CompletePrescriptionRecord

---

## lib\prescription\prescriptionValidator.ts

Lines : 224
Size  : 4022 bytes
Empty : NO

### Exports
- PrescriptionValidationResult
- validatePrescriptionBeforeSave

### Interfaces
- PrescriptionValidationResult

### Functions
- validatePrescriptionBeforeSave

---

## lib\reportStorage.ts

Lines : 100
Size  : 1768 bytes
Empty : NO

### Exports
- AssessmentRecord
- saveAssessment
- getAssessmentHistory
- getPatientHistory
- getLatestPatientAssessment
- hasAssessmentBeenSaved
- markAssessmentSaved
- clearAssessmentSavedFlag

---

## lib\repositories\assessmentRepository.ts

Lines : 247
Size  : 4311 bytes
Empty : NO

### Imports
- @/lib/supabase

### Exports
- AssessmentRepository
- assessmentRepository

### Classes
- AssessmentRepository

---

## lib\repositories\BaseRepository.ts

Lines : 43
Size  : 1200 bytes
Empty : NO

### Imports
- @/lib/auth/authService

### Classes
- BaseRepository

---

## lib\repositories\clinicalEventRepository.ts

Lines : 91
Size  : 1959 bytes
Empty : NO

### Imports
- @/lib/supabase
- @/lib/database
- @/lib/mappers/clinicalEventMapper

### Exports
- ClinicalEventRepository

### Classes
- ClinicalEventRepository

---

## lib\repositories\DailyCareRepository.ts

Lines : 179
Size  : 3210 bytes
Empty : NO

### Imports
- @/lib/supabase
- @/lib/types/dailyCare

### Exports
- DailyCareRepository
- dailyCareRepository

### Classes
- DailyCareRepository

---

## lib\repositories\patientRepository.ts

Lines : 238
Size  : 4903 bytes
Empty : NO

### Imports
- ../supabase
- ./BaseRepository
- ../types/patient
- ../database
- ../mappers/PatientMapper

### Exports
- PatientRepository
- patientRepository

### Interfaces
- PatientAccess

### Classes
- PatientRepository

---

## lib\repositories\profileRepository.ts

Lines : 76
Size  : 1571 bytes
Empty : NO

### Imports
- ../supabase
- ./BaseRepository
- ../types/profile
- ../auth/authService

### Exports
- ProfileRepository
- profileRepository

### Classes
- ProfileRepository

---

## lib\repositories\SelfDailyCareRepository.ts

Lines : 145
Size  : 2681 bytes
Empty : NO

### Imports
- @/lib/supabase
- @/lib/types/selfDailyCare

### Exports
- SelfDailyCareRepository
- selfDailyCareRepository

### Classes
- SelfDailyCareRepository

---

## lib\repositories\SelfProfileRepository.ts

Lines : 129
Size  : 2501 bytes
Empty : NO

### Imports
- ../supabase
- ./BaseRepository
- ../selfProfile
- ../database
- ../mappers/SelfProfileMapper

### Exports
- SelfProfileRepository
- selfProfileRepository

### Classes
- SelfProfileRepository

---

## lib\repositories\SelfTrendRepository.ts

Lines : 134
Size  : 2316 bytes
Empty : NO

### Imports
- @/lib/types/selfDailyCare
- @/lib/types/result

### Exports
- SelfTrendRepository
- selfTrendRepository

### Classes
- SelfTrendRepository

---

## lib\repositories\TrendRepository.ts

Lines : 133
Size  : 2282 bytes
Empty : NO

### Imports
- @/lib/repositories/DailyCareRepository
- @/lib/types/dailyCare
- @/lib/types/result

### Exports
- TrendRepository
- trendRepository

### Classes
- TrendRepository

---

## lib\selfProfile.ts

Lines : 15
Size  : 181 bytes
Empty : NO

### Exports
- SelfProfile

### Interfaces
- SelfProfile

---

## lib\storage\assessmentDraftStorage.ts

Lines : 68
Size  : 1243 bytes
Empty : NO

### Imports
- @/lib/types/assessmentDraft

### Exports
- AssessmentDraftStorage
- assessmentDraftStorage

### Classes
- AssessmentDraftStorage

---

## lib\storage\assessmentStorage.ts

Lines : 381
Size  : 6078 bytes
Empty : NO

### Imports
- @/lib/repositories/assessmentRepository
- @/lib/auth/authService
- @/lib/types/result

### Exports
- AssessmentStorage
- assessmentStorage

### Classes
- AssessmentStorage

---

## lib\storage\clinicalEventStorage.ts

Lines : 46
Size  : 1149 bytes
Empty : NO

### Imports
- @/lib/repositories/clinicalEventRepository

### Exports
- ClinicalEventStorage

### Classes
- ClinicalEventStorage

---

## lib\storage\DailyCareStorage.ts

Lines : 319
Size  : 5024 bytes
Empty : NO

### Imports
- @/lib/repositories/DailyCareRepository
- @/lib/auth/authService
- @/lib/types/result
- @/lib/builders/clinicalEventBuilder
- @/lib/storage/clinicalEventStorage

### Exports
- DailyCareStorage
- dailyCareStorage

### Classes
- DailyCareStorage

---

## lib\storage\patientStorage.ts

Lines : 293
Size  : 5208 bytes
Empty : NO

### Imports
- ../types/patient
- ./storageResult
- ../validators/patientValidator
- ../repositories/patientRepository
- @/lib/types/result

### Exports
- patientStorage

### Classes
- contains
- PatientStorage

---

## lib\storage\SelfDailyCareStorage.ts

Lines : 238
Size  : 3946 bytes
Empty : NO

### Imports
- @/lib/repositories/SelfDailyCareRepository
- @/lib/auth/authService
- @/lib/types/result

### Exports
- SelfDailyCareStorage
- selfDailyCareStorage

### Classes
- SelfDailyCareStorage

---

## lib\storage\SelfProfileStorage.ts

Lines : 185
Size  : 3471 bytes
Empty : NO

### Imports
- ../selfProfile
- ./storageResult
- ../repositories/SelfProfileRepository
- @/lib/types/result

### Exports
- selfProfileStorage

### Classes
- SelfProfileStorage

---

## lib\storage\selfTrendStorage.ts

Lines : 71
Size  : 1216 bytes
Empty : NO

### Imports
- @/lib/types/result

### Exports
- SelfTrendStorage
- selfTrendStorage

### Classes
- SelfTrendStorage

---

## lib\storage\storageResult.ts

Lines : 56
Size  : 892 bytes
Empty : NO

### Imports
- @/lib/types/result

### Exports
- StorageResult

### Classes
- for
- StorageResult

---

## lib\storage\trendDraftStorage.ts

Lines : 87
Size  : 1810 bytes
Empty : NO

### Imports
- @/lib/trends/trendRequest

### Exports
- TrendDraftStorage
- trendDraftStorage

### Classes
- TrendDraftStorage

---

## lib\storage\TrendStorage.ts

Lines : 68
Size  : 1187 bytes
Empty : NO

### Imports
- @/lib/types/dailyCare
- @/lib/types/result

### Exports
- TrendStorage
- trendStorage

### Classes
- TrendStorage

---

## lib\supabase.ts

Lines : 17
Size  : 437 bytes
Empty : NO

### Imports
- @supabase/supabase-js

### Exports
- supabase

---

## lib\supabase\server.ts

Lines : 52
Size  : 834 bytes
Empty : NO

### Imports
- next/headers
- @supabase/ssr

### Functions
- createSupabaseServerClient

---

## lib\supabaseAdmin.ts

Lines : 33
Size  : 601 bytes
Empty : NO

### Exports
- supabaseAdmin

---

## lib\treatment\index.ts

Lines : 1
Size  : 0 bytes
Empty : YES

---

## lib\treatment\treatmentMapper.ts

Lines : 311
Size  : 6491 bytes
Empty : NO

### Exports
- TreatmentMapper

### Functions
- clone
- freeze
- nowIso
- normalize
- normalizeLower
- safeArray
- mapMedicine
- mapTreatmentMedicine
- mapDiagnosis
- mapInvestigation
- mapFollowUp
- mapClinicalContext
- mapTreatment
- mapTimelineEvent
- mapTreatmentComparison

---

## lib\treatment\treatmentModels.ts

Lines : 750
Size  : 17692 bytes
Empty : NO

### Exports
- ContactInformation
- PostalAddress
- GeoLocation
- NameValuePair
- DoctorModel
- HospitalModel
- DiagnosisModel
- InvestigationModel
- FollowUpModel
- ConsultationReference
- MedicineDose
- MedicineSchedule
- MedicineModel
- TreatmentMedicineModel
- TreatmentClinicalContext
- TreatmentPlanModel
- MedicineComparisonModel
- TreatmentComparisonModel
- FollowUpQuestionModel
- ConsultationSummaryModel
- TreatmentSummaryModel
- TreatmentReviewModel
- PrescriptionExtractionModel
- TreatmentProcessingResultModel
- TreatmentAggregateModel
- ReadonlyTreatmentPlan
- ReadonlyTreatmentMedicine
- ReadonlyMedicine
- ReadonlyTreatmentComparison
- ReadonlyTreatmentReview
- ReadonlyTreatmentAggregate

### Interfaces
- ContactInformation
- PostalAddress
- GeoLocation
- NameValuePair
- DoctorModel
- HospitalModel
- DiagnosisModel
- InvestigationModel
- FollowUpModel
- ConsultationReference
- MedicineDose
- MedicineSchedule
- MedicineModel
- TreatmentMedicineModel
- TreatmentClinicalContext
- TreatmentPlanModel
- MedicineComparisonModel
- TreatmentComparisonModel
- FollowUpQuestionModel
- ConsultationSummaryModel
- TreatmentSummaryModel
- TreatmentReviewModel
- PrescriptionExtractionModel
- TreatmentProcessingResultModel
- TreatmentAggregateModel

---

## lib\treatment\treatmentRepository.ts

Lines : 288
Size  : 6137 bytes
Empty : NO

### Exports
- TreatmentRepository
- sortByVersion
- getLatestTreatment
- getActiveTreatment
- getTreatmentByVersion
- getTreatmentById
- getPreviousTreatment
- getNextTreatment
- hasActiveTreatment
- getTreatmentCount
- TreatmentRepositoryUtils

### Interfaces
- TreatmentRepository

### Classes
- BaseTreatmentRepository

### Functions
- sortByVersion
- getLatestTreatment
- getActiveTreatment
- getTreatmentByVersion
- getTreatmentById
- getPreviousTreatment
- getNextTreatment
- hasActiveTreatment
- getTreatmentCount

---

## lib\treatment\treatmentRules.ts

Lines : 1706
Size  : 34618 bytes
Empty : NO

### Exports
- TreatmentRules

### Interfaces
- RuleViolation
- RuleWarning
- RuleAction
- RuleResult

### Enums
- RuleSeverity
- RuleActionType

### Functions
- violation
- warning
- action
- ruleResult
- mergeRuleResults
- hasActiveTreatment
- getActiveTreatment
- medicineExists
- isTreatmentCompleted
- isTreatmentArchived
- evaluateSingleActiveTreatment
- evaluateVersionIncrement
- evaluateTreatmentActivation
- evaluateTreatmentReplacement
- evaluateTreatmentSupersession
- evaluateTreatmentArchival
- evaluateTreatmentCompletion
- evaluateTreatmentDiscontinuation
- evaluateTreatmentReactivation
- evaluateMedicineStatusTransitions
- evaluateMedicineDuplicates
- evaluateMedicineActivation
- evaluateMedicineDeactivation
- evaluateMedicineConsistency
- evaluateMedicineOrdering
- evaluateFollowUpRules
- evaluateTimelineRules
- evaluateClinicalContextRules
- evaluateClinicalRules
- evaluateTreatmentComparison
- evaluateTreatment

---

## lib\treatment\TreatmentService.ts

Lines : 1
Size  : 0 bytes
Empty : YES

---

## lib\treatment\treatmentStorage.ts

Lines : 164
Size  : 2860 bytes
Empty : NO

### Imports
- @/lib/supabase/client
- ./treatmentRepository

### Exports
- TreatmentStorage

### Classes
- TreatmentStorage

---

## lib\treatment\treatmentTypes.ts

Lines : 765
Size  : 19725 bytes
Empty : NO

### Exports
- UUID
- ISODate
- ISODateTime
- Nullable
- Optional
- ValueOf
- DeepReadonly
- JsonPrimitive
- JsonValue
- JsonObject
- JsonArray
- AuditAction
- AuditActorType
- AuditMetadata
- ConsultationMode
- ConsultationSource
- TreatmentStatus
- TreatmentOutcome
- TreatmentPriority
- TreatmentSource
- TreatmentChangeType
- DiagnosisStatus
- FollowUpStatus
- InvestigationStatus
- ConfidenceLevel
- ConfidenceScore
- MedicineStatus
- MedicineType
- MedicineForm
- MedicineRoute
- DosageUnit
- MedicineFrequency
- MedicineTiming
- PrnReason
- ScheduleType
- MedicineInstructionType
- TimelineEventType
- ReconciliationStatus
- MedicineMatchType
- ExtractionStatus
- ProcessingStage
- QuestionPriority
- QuestionReason
- ReminderStatus
- ReminderType
- AdherenceStatus
- InteractionSeverity
- OperationResult
- ACTIVE_TREATMENT_STATUSES
- TERMINAL_TREATMENT_STATUSES
- ACTIVE_MEDICINE_STATUSES
- RECONCILIATION_CHANGE_TYPES
- ActiveTreatmentStatus
- ActiveMedicineStatus
- TerminalTreatmentStatus

### Interfaces
- JsonObject
- JsonArray
- AuditMetadata
- ConfidenceScore

### Enums
- AuditAction
- AuditActorType
- ConsultationMode
- ConsultationSource
- TreatmentStatus
- TreatmentOutcome
- TreatmentPriority
- TreatmentSource
- TreatmentChangeType
- DiagnosisStatus
- FollowUpStatus
- InvestigationStatus
- ConfidenceLevel
- MedicineStatus
- MedicineType
- MedicineForm
- MedicineRoute
- DosageUnit
- MedicineFrequency
- MedicineTiming
- PrnReason
- ScheduleType
- MedicineInstructionType
- TimelineEventType
- ReconciliationStatus
- MedicineMatchType
- ExtractionStatus
- ProcessingStage
- QuestionPriority
- QuestionReason
- ReminderStatus
- ReminderType
- AdherenceStatus
- InteractionSeverity
- OperationResult

---

## lib\treatment\treatmentValidation.ts

Lines : 883
Size  : 19477 bytes
Empty : NO

### Exports
- VALIDATION_LIMITS
- ValidationErrorCode
- ValidationSeverity
- ValidationIssue
- ValidationResult
- TreatmentValidator

### Interfaces
- ValidationIssue
- ValidationResult

### Enums
- ValidationErrorCode
- ValidationSeverity

### Functions
- createIssue
- createError
- createWarning
- createResult
- isBlank
- exceedsLength
- isPositive
- isNonNegative
- isValidDate
- isDefined
- mergeResults
- validateMedicineDose
- validateMedicineSchedule
- validateMedicine
- validateDiagnosis
- validateInvestigation
- validateFollowUp
- validateTreatmentClinicalContext
- validateTreatmentPlan
- validateTreatmentComparison
- validateTreatmentPlans

---

## lib\trends\selfTrendPdfGenerator.ts

Lines : 714
Size  : 13086 bytes
Empty : NO

### Exports
- SelfTrendPdfGenerator
- selfTrendPdfGenerator

### Classes
- SelfTrendPdfGenerator

---

## lib\trends\trendChartConfig.ts

Lines : 66
Size  : 1257 bytes
Empty : NO

### Imports
- ./trendResult

### Exports
- TrendChartConfiguration
- TrendChartConfig

### Interfaces
- TrendChartConfiguration

---

## lib\trends\trendClinicalAnalyzer.ts

Lines : 32
Size  : 742 bytes
Empty : NO

### Exports
- TrendClinicalAnalyzer
- trendClinicalAnalyzer

### Classes
- TrendClinicalAnalyzer

---

## lib\trends\trendPdfGenerator.ts

Lines : 714
Size  : 13074 bytes
Empty : NO

### Exports
- TrendPdfGenerator
- trendPdfGenerator

### Classes
- TrendPdfGenerator

---

## lib\trends\trendReport.ts

Lines : 36
Size  : 889 bytes
Empty : NO

### Exports
- TrendReport

### Interfaces
- TrendReport

---

## lib\trends\trendReportBuilder.ts

Lines : 107
Size  : 2063 bytes
Empty : NO

### Exports
- TrendReportBuilder
- trendReportBuilder

### Classes
- TrendReportBuilder

---

## lib\trends\trendRequest.ts

Lines : 54
Size  : 1254 bytes
Empty : NO

### Exports
- TrendPeriod
- TrendParameters
- TrendRequest

### Interfaces
- TrendParameters
- TrendRequest

---

## lib\trends\trendResult.ts

Lines : 139
Size  : 3418 bytes
Empty : NO

### Exports
- TrendParameterType
- TrendPoint
- TrendStatistics
- TrendAxis
- ParameterTrend
- TrendSummary
- ClinicalSummary
- TrendResult

### Interfaces
- TrendPoint
- TrendStatistics
- TrendAxis
- ParameterTrend
- TrendSummary
- ClinicalSummary
- TrendResult

---

## lib\types\assessment.ts

Lines : 95
Size  : 1787 bytes
Empty : NO

### Exports
- AssessmentType
- AssessmentStatus
- AssessmentRecommendation
- AssessmentAnswers
- AssessmentInput
- AssessmentRecord
- AssessmentSummary
- AssessmentHistoryItem

### Interfaces
- AssessmentAnswers
- AssessmentInput
- AssessmentRecord
- AssessmentSummary
- AssessmentHistoryItem

---

## lib\types\assessmentDraft.ts

Lines : 49
Size  : 932 bytes
Empty : NO

### Imports
- @/lib/types/assessment

### Exports
- AssessmentDraft

### Interfaces
- AssessmentDraft

---

## lib\types\assessmentScore.ts

Lines : 36
Size  : 697 bytes
Empty : NO

### Exports
- AssessmentScore

### Interfaces
- AssessmentScore

---

## lib\types\clinicalEvent.ts

Lines : 48
Size  : 732 bytes
Empty : NO

### Exports
- ClinicalEventType
- ClinicalEvent
- CreateClinicalEventRequest

### Interfaces
- ClinicalEvent
- CreateClinicalEventRequest

### Enums
- ClinicalEventType

---

## lib\types\dailyCare.ts

Lines : 150
Size  : 2398 bytes
Empty : NO

### Exports
- DailyCareOverallStatus
- DailyCare
- DailyCareSymptom
- PainLocation
- MedicationEntry
- CreateDailyCareRequest

### Interfaces
- DailyCare
- MedicationEntry
- CreateDailyCareRequest

---

## lib\types\patient.ts

Lines : 16
Size  : 304 bytes
Empty : NO

### Exports
- Patient

### Interfaces
- Patient

---

## lib\types\profile.ts

Lines : 13
Size  : 154 bytes
Empty : NO

### Exports
- Profile

### Interfaces
- Profile

---

## lib\types\report.ts

Lines : 10
Size  : 144 bytes
Empty : NO

### Exports
- AssessmentReport

### Interfaces
- AssessmentReport

---

## lib\types\result.ts

Lines : 28
Size  : 474 bytes
Empty : NO

### Exports
- Result

### Interfaces
- Result

---

## lib\types\selfDailyCare.ts

Lines : 153
Size  : 2378 bytes
Empty : NO

### Exports
- SelfDailyCareOverallStatus
- SelfDailyCare
- SelfDailyCareSymptom
- SelfPainLocation
- SelfMedicationEntry
- CreateSelfDailyCareRequest

### Interfaces
- SelfDailyCare
- SelfMedicationEntry
- CreateSelfDailyCareRequest

---

## lib\utils\appAlert.ts

Lines : 21
Size  : 424 bytes
Empty : NO

### Exports
- AppAlert

---

## lib\utils\dateUtils.ts

Lines : 45
Size  : 679 bytes
Empty : NO

### Exports
- calculateAge

### Functions
- calculateAge

---

## lib\utils\displayFormatter.ts

Lines : 143
Size  : 2353 bytes
Empty : NO

### Exports
- formatDisplayText
- formatDisplayList
- formatRecordedDate

### Enums
- values

### Functions
- formatDisplayText
- formatDisplayList
- formatRecordedDate

---

## lib\utils\pdf\assessmentPdf.ts

Lines : 115
Size  : 2035 bytes
Empty : NO

### Imports
- html2canvas
- jspdf

### Functions
- downloadAssessmentPdf

---

## lib\validators\patientValidator.ts

Lines : 98
Size  : 2027 bytes
Empty : NO

### Imports
- ../types/patient
- ../types/result
- ../storage/storageResult

### Exports
- PatientValidator
- patientValidator

### Classes
- performs
- PatientValidator

---

## next-env.d.ts

Lines : 7
Size  : 253 bytes
Empty : NO

---

## next.config.ts

Lines : 11
Size  : 182 bytes
Empty : NO

### Imports
- next

---

## scripts\analyzeArchitecture.ts

Lines : 1
Size  : 0 bytes
Empty : YES

---

## scripts\benchmarkComparator.ts

Lines : 1
Size  : 0 bytes
Empty : YES

---

## scripts\discoverProject.ts

Lines : 224
Size  : 4099 bytes
Empty : NO

### Imports
- fs
- path

### Interfaces
- FileInfo

### Functions
- scan
- extract
- analyse

---

## scripts\scaffoldClinicalCore.ts

Lines : 146
Size  : 3612 bytes
Empty : NO

### Imports
- fs
- path

### Functions
- ensureDirectory
- createTemplate
- createFile

---

## scripts\scaffoldMedicationManagement.ts

Lines : 217
Size  : 6118 bytes
Empty : NO

### Imports
- fs
- path

### Exports
- Validator
- Mapper
- Repository
- Storage
- Engine
- Builder
- Classifier
- Resolver
- Registry
- JourneyContext
- Model

### Interfaces
- JourneyContext
- Model

### Classes
- Validator
- Mapper
- Repository
- Storage
- Engine
- Builder
- Classifier
- Resolver
- Registry

### Functions
- ensureDirectory
- createFile
- createTemplate

