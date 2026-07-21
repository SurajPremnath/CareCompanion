# Journey Architecture Audit

Generated: 2026-07-18T18:58:05.558Z

---

## 1. Journey Related Files

- app\carevr-journey\page.tsx
- app\components\AppHeader.tsx
- app\dashboard\page.tsx
- app\help\getting-started\page.tsx
- app\help\page.tsx
- app\help\reports\page.tsx
- app\journey-review\ActiveTreatmentCard.tsx
- app\journey-review\ChangeCard.tsx
- app\journey-review\EmptyJourney.tsx
- app\journey-review\JourneyActions.tsx
- app\journey-review\JourneyComplete.tsx
- app\journey-review\JourneyConfidence.tsx
- app\journey-review\JourneyContext.tsx
- app\journey-review\JourneyDetectedChanges.tsx
- app\journey-review\JourneyHeader.tsx
- app\journey-review\JourneyQuestions.tsx
- app\journey-review\JourneyReview.tsx
- app\journey-review\JourneySummaryCard.tsx
- app\journey-review\JourneyTimeline.tsx
- app\journey-review\JourneyWizard.tsx
- app\journey-review\LoadingJourney.tsx
- app\journey-review\QuestionCard.tsx
- app\journey-review\QuestionRenderer.tsx
- app\journey-review\SummaryCard.tsx
- app\journey-review\TimelinePreview.tsx
- app\journey-review\TreatmentDecisionCard.tsx
- app\journey-review\index.ts
- lib\journey\JourneyAnalysisEngine.ts
- lib\journey\activeTreatment\index.ts
- lib\journey\activeTreatment\lifecycleEngine.ts
- lib\journey\activeTreatment\lifecycleMapper.ts
- lib\journey\activeTreatment\lifecycleRepository.ts
- lib\journey\activeTreatment\lifecycleRules.ts
- lib\journey\activeTreatment\lifecycleStorage.ts
- lib\journey\activeTreatment\lifecycleTypes.ts
- lib\journey\activeTreatment\lifecycleValidator.ts
- lib\journey\activeTreatment\models\lifecycleModel.ts
- lib\journey\classification\classificationMapper.ts
- lib\journey\classification\classificationRepository.ts
- lib\journey\classification\classificationRules.ts
- lib\journey\classification\classificationStorage.ts
- lib\journey\classification\classificationTypes.ts
- lib\journey\classification\classificationValidator.ts
- lib\journey\classification\consultationClassifier.ts
- lib\journey\classification\index.ts
- lib\journey\classification\journeyClassificationEngine.ts
- lib\journey\classification\models\classificationModel.ts
- lib\journey\comparison\comparisonEngine.ts
- lib\journey\comparison\comparisonMapper.ts
- lib\journey\comparison\comparisonTypes.ts
- lib\journey\comparison\comparisonValidator.ts
- lib\journey\comparison\index.ts
- lib\journey\comparison\models\comparisonModel.ts
- lib\journey\comparison\prescriptionComparator.ts
- lib\journey\consultation\consultationEngine.ts
- lib\journey\consultation\consultationMapper.ts
- lib\journey\consultation\consultationResolver.ts
- lib\journey\consultation\consultationTypes.ts
- lib\journey\consultation\consultationValidator.ts
- lib\journey\consultation\index.ts
- lib\journey\context\index.ts
- lib\journey\context\journeyContext.ts
- lib\journey\context\journeyContextBuilder.ts
- lib\journey\context\journeyContextValidator.ts
- lib\journey\engine\confidenceCalculator.ts
- lib\journey\engine\contextBuilder.ts
- lib\journey\engine\engineTypes.ts
- lib\journey\engine\index.ts
- lib\journey\engine\journeyAssembler.ts
- lib\journey\engine\journeyEngine.ts
- lib\journey\engine\metadataBuilder.ts
- lib\journey\engine\nodeBuilder.ts
- lib\journey\engine\ruleEvaluator.ts
- lib\journey\engine\transitionBuilder.ts
- lib\journey\governance\governanceEngine.ts
- lib\journey\governance\governanceRepository.ts
- lib\journey\governance\governanceRules.ts
- lib\journey\governance\governanceStorage.ts
- lib\journey\governance\governanceTypes.ts
- lib\journey\governance\governanceValidator.ts
- lib\journey\governance\index.ts
- lib\journey\governance\models\governanceModel.ts
- lib\journey\index.ts
- lib\journey\journeyAnalysisModels.ts
- lib\journey\journeyConstants.ts
- lib\journey\journeyMapper.ts
- lib\journey\journeyModels.ts
- lib\journey\journeyRepository.ts
- lib\journey\journeyRules.ts
- lib\journey\journeyStorage.ts
- lib\journey\journeyTypes.ts
- lib\journey\journeyUtils.ts
- lib\journey\journeyValidation.ts
- lib\journey\questionBuilder.ts
- lib\journey\questions\index.ts
- lib\journey\questions\models\questionModel.ts
- lib\journey\questions\questionEngine.ts
- lib\journey\questions\questionRegistry.ts
- lib\journey\questions\questionResolver.ts
- lib\journey\questions\questionTypes.ts
- lib\journey\questions\questionValidator.ts
- lib\journey\scenarios\index.ts
- lib\journey\scenarios\models\scenarioModel.ts
- lib\journey\scenarios\scenarioEngine.ts
- lib\journey\scenarios\scenarioRegistry.ts
- lib\journey\scenarios\scenarioResolver.ts
- lib\journey\scenarios\scenarioRules.ts
- lib\journey\scenarios\scenarioTypes.ts
- lib\journey\scenarios\scenarioValidator.ts
- lib\journey\shared\index.ts
- lib\journey\shared\journeyConfidence.ts
- lib\journey\shared\journeyConstants.ts
- lib\journey\shared\journeyErrors.ts
- lib\journey\shared\journeyHelpers.ts
- lib\journey\summaryBuilder.ts
- lib\journey\timelineBuilder.ts
- lib\journey\timeline\index.ts
- lib\journey\timeline\models\timelineEventModel.ts
- lib\journey\timeline\timelineEventBuilder.ts
- lib\journey\timeline\timelineEventGenerator.ts
- lib\journey\timeline\timelineEventRepository.ts
- lib\journey\timeline\timelineEventRules.ts
- lib\journey\timeline\timelineEventStorage.ts
- lib\journey\timeline\timelineEventTypes.ts
- lib\journey\timeline\timelineEventValidator.ts
- lib\journey\treatment\index.ts
- lib\journey\treatment\models\treatmentDecisionModel.ts
- lib\journey\treatment\treatmentDecisionEngine.ts
- lib\journey\treatment\treatmentDecisionMapper.ts
- lib\journey\treatment\treatmentDecisionRepository.ts
- lib\journey\treatment\treatmentDecisionRules.ts
- lib\journey\treatment\treatmentDecisionStorage.ts
- lib\journey\treatment\treatmentDecisionTypes.ts
- lib\journey\treatment\treatmentDecisionValidator.ts
- lib\performance\performanceTracker.ts
- scripts\governArchitecture.ts
- scripts\scaffoldDomain.ts

---

## 2. Exported Definitions

### Components\dashboard\ActionOptions.tsx

- type: ActionOption
- type: MedicationDetailOption

### Components\dashboard\prescription\PrescriptionTabs.tsx

- type: PrescriptionTab

### Components\patient\PersonSelector.tsx

- type: PersonMode
- interface: PersonSelection

### app\components\ReportTable.tsx

- interface: ReportTableColumn

### app\journey-review\JourneyContext.tsx

- enum: JourneyStep
- interface: JourneyAnswer
- interface: JourneyState

### app\reports\trends\trendRequest.ts

- interface: TrendRequest

### lib\analytics\analyticsTypes.ts

- type: AnalyticsPlatform
- type: AnalyticsInputMethod
- type: AnalyticsModule
- type: AnalyticsEventName
- type: AnalyticsContext
- interface: AnalyticsEventInput
- interface: AnalyticsEventRecord

### lib\analytics\authSessionService.ts

- interface: AuthSessionStartResult

### lib\auth\authService.ts

- class: AuthService

### lib\builders\SelfTrendBuilder.ts

- class: SelfTrendBuilder

### lib\builders\TrendBuilder.ts

- class: TrendBuilder

### lib\builders\assessmentBuilder.ts

- class: AssessmentBuilder

### lib\builders\clinicalEventBuilder.ts

- class: ClinicalEventBuilder

### lib\clinical-intelligence\ClinicalComparisonEngine.ts

- class: ClinicalComparisonEngine

### lib\clinical-intelligence\comparisonTypes.ts

- type: ChangeType
- type: MedicineChangeType
- type: ClarificationPriority
- type: MedicineField
- interface: MedicineComparison
- interface: CollectionComparison
- type: ComplaintComparison
- type: HistoryComparison
- type: AssessmentComparison
- type: InvestigationComparison
- type: DoctorInstructionComparison
- type: FollowUpComparison
- interface: PatientComparison
- interface: DoctorComparison
- interface: HospitalComparison
- interface: ConsultationModeComparison
- interface: ConsultationDateComparison
- interface: AdditionalNotesComparison
- type: VitalField
- interface: VitalComparison
- interface: VitalsComparison
- type: ClinicalNoteType
- interface: ClinicalNote
- type: ClarificationType
- interface: ClarificationOption
- interface: ClarificationQuestion
- interface: ComparisonStatistics
- interface: ComparisonEngineOptions
- interface: ComparisonConfidence
- type: ConfirmationStatus
- interface: ClinicalComparisonResult
- interface: TimelineEventDraft
- interface: ClinicalComparisonOutput

### lib\clinical-summary\ClinicalSummaryEngine.ts

- class: ClinicalSummaryEngine

### lib\clinical-summary\ClinicalSummaryTypes.ts

- type: ClinicalSeverity
- interface: ClinicalFinding
- interface: ClinicalRecommendation
- interface: ClinicalSummary
- interface: ClinicalSummaryInput

### lib\clinical-summary\PainAnalyzer.ts

- class: PainAnalyzer

### lib\clinical-summary\SymptomsAnalyzer.ts

- class: SymptomsAnalyzer

### lib\clinical-summary\TemperatureAnalyzer.ts

- class: TemperatureAnalyzer

### lib\clinical-summary\VitalsAnalyzer.ts

- class: VitalsAnalyzer

### lib\consent\mapper\consentMapper.ts

- interface: ConsentRow
- class: ConsentMapper

### lib\consent\models\Consent.ts

- interface: Consent

### lib\consent\repository\consentRepository.ts

- class: ConsentRepository

### lib\consent\storage\consentStorage.ts

- class: ConsentStorage

### lib\database.ts

- interface: PatientRow
- interface: SelfProfileRow
- interface: ClinicalEventRow

### lib\i18n\config.ts

- interface: LanguageOption

### lib\i18n\types.ts

- type: SupportedLanguage
- type: TranslationDictionary

### lib\journey\JourneyAnalysisEngine.ts

- class: JourneyAnalysisEngine

### lib\journey\activeTreatment\lifecycleEngine.ts

- class: Engine

### lib\journey\activeTreatment\lifecycleMapper.ts

- class: Mapper

### lib\journey\activeTreatment\lifecycleRepository.ts

- class: Repository

### lib\journey\activeTreatment\lifecycleStorage.ts

- class: Storage

### lib\journey\activeTreatment\lifecycleValidator.ts

- class: Validator

### lib\journey\activeTreatment\models\lifecycleModel.ts

- interface: Model

### lib\journey\classification\classificationMapper.ts

- class: Mapper

### lib\journey\classification\classificationRepository.ts

- class: Repository

### lib\journey\classification\classificationStorage.ts

- class: Storage

### lib\journey\classification\classificationValidator.ts

- class: Validator

### lib\journey\classification\consultationClassifier.ts

- class: Classifier

### lib\journey\classification\journeyClassificationEngine.ts

- class: Engine

### lib\journey\classification\models\classificationModel.ts

- interface: Model

### lib\journey\comparison\comparisonEngine.ts

- class: ComparisonEngine

### lib\journey\comparison\comparisonMapper.ts

- class: ComparisonMapper

### lib\journey\comparison\comparisonTypes.ts

- type: ComparisonCategory
- type: ChangeType
- type: ChangeSeverity
- type: ComparisonConfidence
- interface: ComparisonDifference
- interface: ComparisonSummary
- interface: ComparisonMetadata
- interface: ComparisonRequest
- interface: ComparisonResult
- interface: ComparisonEngineResult

### lib\journey\comparison\comparisonValidator.ts

- class: ComparisonValidator

### lib\journey\comparison\models\comparisonModel.ts

- interface: ComparisonModel

### lib\journey\comparison\prescriptionComparator.ts

- class: PrescriptionComparator

### lib\journey\consultation\consultationEngine.ts

- class: ConsultationEngine

### lib\journey\consultation\consultationMapper.ts

- class: ConsultationMapper

### lib\journey\consultation\consultationResolver.ts

- interface: ValidationIssue
- interface: ConsultationValidationResult
- class: ConsultationValidator

### lib\journey\consultation\consultationTypes.ts

- type: ConsultationSource
- type: ConsultationResolutionStatus
- type: ConsultationMatchConfidence
- interface: ConsultationMatchReason
- interface: ConsultationMatch
- interface: ConsultationContext
- interface: ConsultationResolutionRequest
- interface: ConsultationResolutionMetadata
- interface: ConsultationResolutionResult
- interface: ConsultationEngineResult
- interface: ResolvedConsultation

### lib\journey\consultation\consultationValidator.ts

- class: ConsultationValidator

### lib\journey\context\journeyContext.ts

- interface: JourneyContext

### lib\journey\context\journeyContextBuilder.ts

- class: Builder

### lib\journey\context\journeyContextValidator.ts

- class: Validator

### lib\journey\engine\journeyEngine.ts

- class: JourneyEngine

### lib\journey\engine\nodeBuilder.ts

- interface: NodeBuilderInput
- class: NodeBuilder

### lib\journey\governance\governanceEngine.ts

- class: Engine

### lib\journey\governance\governanceRepository.ts

- class: Repository

### lib\journey\governance\governanceStorage.ts

- class: Storage

### lib\journey\governance\governanceValidator.ts

- class: Validator

### lib\journey\governance\models\governanceModel.ts

- interface: Model

### lib\journey\journeyAnalysisModels.ts

- interface: JourneyTimelineEvent
- interface: ActiveTreatment
- interface: JourneyMedicine
- interface: JourneyRecommendation
- enum: JourneyActionType
- enum: JourneyStatus
- interface: JourneyAction
- interface: JourneyAnalysisResult
- enum: JourneyQuestionType
- interface: JourneyQuestionOption
- interface: JourneyQuestion
- enum: JourneyTimelineEventType
- enum: JourneyChangeType
- interface: DetectedChange
- enum: ConsultationSource
- type: ConsultationContext

### lib\journey\journeyMapper.ts

- class: JourneyMapper

### lib\journey\journeyModels.ts

- interface: Journey
- interface: JourneyNode
- interface: JourneyTransition
- interface: JourneyPattern
- interface: JourneyMatch
- interface: JourneyLearningRecord
- interface: JourneyProvider
- interface: JourneyFacility
- interface: JourneyMetadata
- interface: JourneyContext

### lib\journey\journeyRepository.ts

- class: JourneyRepository

### lib\journey\journeyRules.ts

- interface: JourneyRuleCondition
- interface: JourneyRule

### lib\journey\journeyStorage.ts

- class: JourneyStorage

### lib\journey\journeyTypes.ts

- enum: JourneyType
- enum: JourneyNodeType
- enum: JourneyEventType
- enum: JourneyTransitionType
- enum: JourneyLearningStatus
- enum: JourneyConfidence
- enum: ProviderType
- enum: ConsultationMode
- enum: ConsultationSource

### lib\journey\journeyUtils.ts

- class: JourneyUtils

### lib\journey\journeyValidation.ts

- class: JourneyValidation

### lib\journey\questionBuilder.ts

- class: QuestionBuilder

### lib\journey\questions\models\questionModel.ts

- interface: QuestionModel

### lib\journey\questions\questionEngine.ts

- class: QuestionEngine

### lib\journey\questions\questionRegistry.ts

- class: QuestionRegistry

### lib\journey\questions\questionResolver.ts

- class: QuestionResolver

### lib\journey\questions\questionTypes.ts

- enum: QuestionTypes

### lib\journey\questions\questionValidator.ts

- class: QuestionValidator

### lib\journey\scenarios\models\scenarioModel.ts

- interface: Model

### lib\journey\scenarios\scenarioEngine.ts

- class: Engine

### lib\journey\scenarios\scenarioRegistry.ts

- class: Registry

### lib\journey\scenarios\scenarioResolver.ts

- class: Resolver

### lib\journey\scenarios\scenarioValidator.ts

- class: Validator

### lib\journey\summaryBuilder.ts

- class: SummaryBuilder

### lib\journey\timelineBuilder.ts

- class: TimelineBuilder

### lib\journey\timeline\models\timelineEventModel.ts

- interface: Model

### lib\journey\timeline\timelineEventBuilder.ts

- class: Builder

### lib\journey\timeline\timelineEventRepository.ts

- class: Repository

### lib\journey\timeline\timelineEventStorage.ts

- class: Storage

### lib\journey\timeline\timelineEventValidator.ts

- class: Validator

### lib\journey\treatment\models\treatmentDecisionModel.ts

- interface: Model

### lib\journey\treatment\treatmentDecisionEngine.ts

- class: Engine

### lib\journey\treatment\treatmentDecisionMapper.ts

- class: Mapper

### lib\journey\treatment\treatmentDecisionRepository.ts

- class: Repository

### lib\journey\treatment\treatmentDecisionStorage.ts

- class: Storage

### lib\journey\treatment\treatmentDecisionValidator.ts

- class: Validator

### lib\mappers\DailyCareMapper.ts

- interface: DailyCareRow
- class: DailyCareMapper

### lib\mappers\PatientMapper.ts

- class: PatientMapper

### lib\mappers\SelfDailyCareMapper.ts

- interface: SelfDailyCareRow
- class: SelfDailyCareMapper

### lib\mappers\SelfProfileMapper.ts

- class: SelfProfileMapper

### lib\mappers\assessmentMapper.ts

- interface: AssessmentRow
- class: AssessmentMapper

### lib\mappers\clinicalEventMapper.ts

- class: ClinicalEventMapper

### lib\medical-image\medicalImageTypes.ts

- type: TemperatureUnit
- interface: MedicalImageReadings
- interface: MedicalImageProcessingResult

### lib\medical-voice\medicalVoiceTypes.ts

- type: MedicalVoiceOverallObservation
- type: MedicalVoiceProcessingMode
- interface: MedicalVoiceDailyCareDraft
- interface: MedicalVoiceProcessingData
- type: MedicalVoiceProcessingResult

### lib\pdf\DailyCarePdfGenerator.ts

- class: DailyCarePdfGenerator

### lib\pdf\PdfFormatter.ts

- class: PdfFormatter

### lib\pdf\PdfModels.ts

- type: DailyCareReportType
- interface: DailyCarePdfRequest

### lib\pdf\trendReportPdf.ts

- class: TrendReportPdf

### lib\performance\performanceTypes.ts

- type: PerformanceStatus
- type: PerformanceContext
- type: PerformanceDeviceType
- type: PerformancePlatform
- interface: PendingPerformanceTransition
- interface: PerformanceRecord

### lib\prescription-ai\classification\clinicalRouter.ts

- interface: RoutedAssessment
- interface: RoutedInvestigation
- interface: RoutedInstruction
- interface: RoutedPrescription

### lib\prescription-ai\models\consultationModel.ts

- type: ConsultationMode
- interface: PatientInfo
- interface: ConsultationInfo
- interface: ConsultationVitals
- interface: Complaint
- type: HistoryCategory
- interface: History
- interface: Assessment
- interface: Investigation
- interface: Medicine
- interface: DoctorInstruction
- interface: FollowUp
- interface: ConsultationRecord

### lib\prescription-ai\prescriptionExamples.ts

- interface: PrescriptionExample

### lib\prescription-image\prescriptionImageTypes.ts

- type: ConsultationMode
- interface: ExtractedPrescriptionMedicine
- interface: ExtractedConsultationVital
- interface: ExtractedComplaint
- type: HistoryCategory
- interface: ExtractedHistory
- interface: ExtractedExaminationFinding
- type: MedicalDocumentType
- interface: ExtractedPrescription
- interface: PrescriptionImageProcessingResult

### lib\prescription\prescriptionStorage.ts

- interface: PrescriptionSaveContext

### lib\prescription\prescriptionTypes.ts

- type: PrescriptionRecordContext
- type: PrescriptionConsultationMode
- interface: PrescriptionMedicineInput
- interface: PrescriptionVitalInput
- interface: PrescriptionSymptomInput
- interface: PrescriptionHistoryInput
- interface: PrescriptionAssessmentInput
- interface: PrescriptionInvestigationInput
- interface: PrescriptionInstructionInput
- interface: PrescriptionNoteInput
- interface: PrescriptionSaveInput
- interface: PrescriptionRecord
- interface: PrescriptionMedicineRecord
- interface: CompletePrescriptionRecord

### lib\prescription\prescriptionValidator.ts

- interface: PrescriptionValidationResult

### lib\reportStorage.ts

- type: AssessmentRecord

### lib\repositories\DailyCareRepository.ts

- class: DailyCareRepository

### lib\repositories\SelfDailyCareRepository.ts

- class: SelfDailyCareRepository

### lib\repositories\SelfProfileRepository.ts

- class: SelfProfileRepository

### lib\repositories\SelfTrendRepository.ts

- class: SelfTrendRepository

### lib\repositories\TrendRepository.ts

- class: TrendRepository

### lib\repositories\assessmentRepository.ts

- class: AssessmentRepository

### lib\repositories\clinicalEventRepository.ts

- class: ClinicalEventRepository

### lib\repositories\patientRepository.ts

- class: PatientRepository

### lib\repositories\profileRepository.ts

- class: ProfileRepository

### lib\selfProfile.ts

- interface: SelfProfile

### lib\storage\DailyCareStorage.ts

- class: DailyCareStorage

### lib\storage\SelfDailyCareStorage.ts

- class: SelfDailyCareStorage

### lib\storage\TrendStorage.ts

- class: TrendStorage

### lib\storage\assessmentDraftStorage.ts

- class: AssessmentDraftStorage

### lib\storage\assessmentStorage.ts

- class: AssessmentStorage

### lib\storage\clinicalEventStorage.ts

- class: ClinicalEventStorage

### lib\storage\selfTrendStorage.ts

- class: SelfTrendStorage

### lib\storage\storageResult.ts

- class: StorageResult

### lib\storage\trendDraftStorage.ts

- class: TrendDraftStorage

### lib\treatment\treatmentModels.ts

- interface: ContactInformation
- interface: PostalAddress
- interface: GeoLocation
- interface: NameValuePair
- interface: DoctorModel
- interface: HospitalModel
- interface: DiagnosisModel
- interface: InvestigationModel
- interface: FollowUpModel
- interface: ConsultationReference
- interface: MedicineDose
- interface: MedicineSchedule
- interface: MedicineModel
- interface: TreatmentMedicineModel
- interface: TreatmentClinicalContext
- interface: TreatmentPlanModel
- interface: MedicineComparisonModel
- interface: TreatmentComparisonModel
- interface: FollowUpQuestionModel
- interface: ConsultationSummaryModel
- interface: TreatmentSummaryModel
- interface: TreatmentReviewModel
- interface: PrescriptionExtractionModel
- interface: TreatmentProcessingResultModel
- interface: TreatmentAggregateModel
- type: ReadonlyTreatmentPlan
- type: ReadonlyTreatmentMedicine
- type: ReadonlyMedicine
- type: ReadonlyTreatmentComparison
- type: ReadonlyTreatmentReview
- type: ReadonlyTreatmentAggregate

### lib\treatment\treatmentRepository.ts

- interface: TreatmentRepository

### lib\treatment\treatmentStorage.ts

- class: TreatmentStorage

### lib\treatment\treatmentTypes.ts

- type: UUID
- type: ISODate
- type: ISODateTime
- type: Nullable
- type: Optional
- type: ValueOf
- type: DeepReadonly
- type: JsonPrimitive
- type: JsonValue
- interface: JsonObject
- interface: JsonArray
- enum: AuditAction
- enum: AuditActorType
- interface: AuditMetadata
- enum: ConsultationMode
- enum: ConsultationSource
- enum: TreatmentStatus
- enum: TreatmentOutcome
- enum: TreatmentPriority
- enum: TreatmentSource
- enum: TreatmentChangeType
- enum: DiagnosisStatus
- enum: FollowUpStatus
- enum: InvestigationStatus
- enum: ConfidenceLevel
- interface: ConfidenceScore
- enum: MedicineStatus
- enum: MedicineType
- enum: MedicineForm
- enum: MedicineRoute
- enum: DosageUnit
- enum: MedicineFrequency
- enum: MedicineTiming
- enum: PrnReason
- enum: ScheduleType
- enum: MedicineInstructionType
- enum: TimelineEventType
- enum: ReconciliationStatus
- enum: MedicineMatchType
- enum: ExtractionStatus
- enum: ProcessingStage
- enum: QuestionPriority
- enum: QuestionReason
- enum: ReminderStatus
- enum: ReminderType
- enum: AdherenceStatus
- enum: InteractionSeverity
- enum: OperationResult
- type: ActiveTreatmentStatus
- type: ActiveMedicineStatus
- type: TerminalTreatmentStatus

### lib\treatment\treatmentValidation.ts

- enum: ValidationErrorCode
- enum: ValidationSeverity
- interface: ValidationIssue
- interface: ValidationResult

### lib\trends\selfTrendPdfGenerator.ts

- class: SelfTrendPdfGenerator

### lib\trends\trendChartConfig.ts

- interface: TrendChartConfiguration

### lib\trends\trendClinicalAnalyzer.ts

- class: TrendClinicalAnalyzer

### lib\trends\trendPdfGenerator.ts

- class: TrendPdfGenerator

### lib\trends\trendReport.ts

- interface: TrendReport

### lib\trends\trendReportBuilder.ts

- class: TrendReportBuilder

### lib\trends\trendRequest.ts

- type: TrendPeriod
- interface: TrendParameters
- interface: TrendRequest

### lib\trends\trendResult.ts

- type: TrendParameterType
- interface: TrendPoint
- interface: TrendStatistics
- interface: TrendAxis
- interface: ParameterTrend
- interface: TrendSummary
- interface: ClinicalSummary
- interface: TrendResult

### lib\types\assessment.ts

- type: AssessmentType
- type: AssessmentStatus
- type: AssessmentRecommendation
- interface: AssessmentAnswers
- interface: AssessmentInput
- interface: AssessmentRecord
- interface: AssessmentSummary
- interface: AssessmentHistoryItem

### lib\types\assessmentDraft.ts

- interface: AssessmentDraft

### lib\types\assessmentScore.ts

- interface: AssessmentScore

### lib\types\clinicalEvent.ts

- enum: ClinicalEventType
- interface: ClinicalEvent
- interface: CreateClinicalEventRequest

### lib\types\dailyCare.ts

- type: DailyCareOverallStatus
- interface: DailyCare
- type: DailyCareSymptom
- type: PainLocation
- interface: MedicationEntry
- interface: CreateDailyCareRequest

### lib\types\patient.ts

- interface: Patient

### lib\types\profile.ts

- interface: Profile

### lib\types\report.ts

- interface: AssessmentReport

### lib\types\result.ts

- interface: Result

### lib\types\selfDailyCare.ts

- type: SelfDailyCareOverallStatus
- interface: SelfDailyCare
- type: SelfDailyCareSymptom
- type: SelfPainLocation
- interface: SelfMedicationEntry
- interface: CreateSelfDailyCareRequest

### lib\validators\patientValidator.ts

- class: PatientValidator

---

## 3. Duplicate Interfaces / Types / Enums

### AssessmentRecord
- lib\reportStorage.ts
- lib\types\assessment.ts

### Builder
- lib\journey\context\journeyContextBuilder.ts
- lib\journey\timeline\timelineEventBuilder.ts

### ChangeType
- lib\clinical-intelligence\comparisonTypes.ts
- lib\journey\comparison\comparisonTypes.ts

### ClinicalSummary
- lib\clinical-summary\ClinicalSummaryTypes.ts
- lib\trends\trendResult.ts

### ComparisonConfidence
- lib\clinical-intelligence\comparisonTypes.ts
- lib\journey\comparison\comparisonTypes.ts

### ConsultationContext
- lib\journey\consultation\consultationTypes.ts
- lib\journey\journeyAnalysisModels.ts

### ConsultationMode
- lib\journey\journeyTypes.ts
- lib\prescription-ai\models\consultationModel.ts
- lib\prescription-image\prescriptionImageTypes.ts
- lib\treatment\treatmentTypes.ts

### ConsultationSource
- lib\journey\consultation\consultationTypes.ts
- lib\journey\journeyAnalysisModels.ts
- lib\journey\journeyTypes.ts
- lib\treatment\treatmentTypes.ts

### ConsultationValidator
- lib\journey\consultation\consultationResolver.ts
- lib\journey\consultation\consultationValidator.ts

### Engine
- lib\journey\activeTreatment\lifecycleEngine.ts
- lib\journey\classification\journeyClassificationEngine.ts
- lib\journey\governance\governanceEngine.ts
- lib\journey\scenarios\scenarioEngine.ts
- lib\journey\treatment\treatmentDecisionEngine.ts

### HistoryCategory
- lib\prescription-ai\models\consultationModel.ts
- lib\prescription-image\prescriptionImageTypes.ts

### JourneyContext
- lib\journey\context\journeyContext.ts
- lib\journey\journeyModels.ts

### Mapper
- lib\journey\activeTreatment\lifecycleMapper.ts
- lib\journey\classification\classificationMapper.ts
- lib\journey\treatment\treatmentDecisionMapper.ts

### Model
- lib\journey\activeTreatment\models\lifecycleModel.ts
- lib\journey\classification\models\classificationModel.ts
- lib\journey\governance\models\governanceModel.ts
- lib\journey\scenarios\models\scenarioModel.ts
- lib\journey\timeline\models\timelineEventModel.ts
- lib\journey\treatment\models\treatmentDecisionModel.ts

### Repository
- lib\journey\activeTreatment\lifecycleRepository.ts
- lib\journey\classification\classificationRepository.ts
- lib\journey\governance\governanceRepository.ts
- lib\journey\timeline\timelineEventRepository.ts
- lib\journey\treatment\treatmentDecisionRepository.ts

### Storage
- lib\journey\activeTreatment\lifecycleStorage.ts
- lib\journey\classification\classificationStorage.ts
- lib\journey\governance\governanceStorage.ts
- lib\journey\timeline\timelineEventStorage.ts
- lib\journey\treatment\treatmentDecisionStorage.ts

### TrendRequest
- app\reports\trends\trendRequest.ts
- lib\trends\trendRequest.ts

### ValidationIssue
- lib\journey\consultation\consultationResolver.ts
- lib\treatment\treatmentValidation.ts

### Validator
- lib\journey\activeTreatment\lifecycleValidator.ts
- lib\journey\classification\classificationValidator.ts
- lib\journey\context\journeyContextValidator.ts
- lib\journey\governance\governanceValidator.ts
- lib\journey\scenarios\scenarioValidator.ts
- lib\journey\timeline\timelineEventValidator.ts
- lib\journey\treatment\treatmentDecisionValidator.ts

---

## 4. Import Graph

### Components\AssessmentLayout.tsx
- @/Components/Header
- @/Components/language/LanguageProvider

### Components\Header.tsx
- react
- @/Components/language/LanguageProvider

### Components\daily-care\VoiceRecorder.tsx
- react

### Components\dashboard\ActionOptions.tsx
- react
- @/Components/language/LanguageProvider

### Components\dashboard\ConsultationWorkspace.tsx
- react
- @/Components/dashboard/ActionOptions
- @/Components/language/LanguageProvider

### Components\dashboard\ManualCareWorkspace.tsx
- react
- @/lib/types/dailyCare
- @/app/daily-care/components/VitalsCard
- @/app/daily-care/components/SymptomsCard
- @/app/daily-care/components/PainLocationCard
- @/lib/storage/DailyCareStorage
- @/lib/storage/SelfDailyCareStorage
- @/lib/utils/appAlert
- @/Components/language/LanguageProvider

### Components\dashboard\PrescriptionHistoryWorkspace.tsx
- react
- @/lib/prescription/prescriptionRepository
- @/lib/prescription-image/prescriptionImageTypes
- @/lib/prescription/prescriptionReviewMapper
- @/Components/dashboard/PrescriptionReview

### Components\dashboard\PrescriptionReview.tsx
- react
- @/lib/prescription-image/prescriptionImageTypes
- ./prescription/PrescriptionTabs
- ./prescription-review/HistoryCard
- ./prescription-review/AssessmentCard
- ./prescription-review/InvestigationCard
- ./prescription-review/DoctorInstructionCard
- ./prescription-review/OtherNotesCard
- ./prescription-review/ComplaintsCard
- ./prescription-review/PatientCard
- ./prescription-review/VitalsCard
- ./prescription-review/ReviewActions
- ./prescription-review/MedicineCard
- @/lib/prescription/prescriptionValidator
- @/Components/language/LanguageProvider

### Components\dashboard\PrescriptionWorkspace.styles.ts
- react

### Components\dashboard\PrescriptionWorkspace.tsx
- react
- @/Components/dashboard/ActionOptions
- @/Components/dashboard/PrescriptionReview
- @/lib/prescription-image/prescriptionImageService
- @/lib/prescription-image/prescriptionImageTypes
- @/lib/prescription/prescriptionStorage
- ./PrescriptionWorkspace.styles
- @/Components/language/LanguageProvider

### Components\dashboard\UploadCareWorkspace.tsx
- react
- @/lib/medical-image/medicalImageService
- @/lib/storage/DailyCareStorage
- @/lib/storage/SelfDailyCareStorage
- @/lib/medical-image/medicalImageTypes
- @/Components/language/LanguageProvider

### Components\dashboard\VoiceCareWorkspace.tsx
- @/Components/daily-care/VoiceRecorder
- react
- @/lib/medical-voice/medicalVoiceService
- @/lib/medical-voice/medicalVoiceTypes
- @/lib/storage/DailyCareStorage
- @/lib/storage/SelfDailyCareStorage
- @/Components/language/LanguageProvider

### Components\dashboard\prescription-review\AssessmentCard.tsx
- @/lib/medicalFormatter
- @/lib/prescription-image/prescriptionImageTypes
- @/Components/language/LanguageProvider

### Components\dashboard\prescription-review\ComplaintsCard.tsx
- @/lib/medicalFormatter
- @/lib/prescription-image/prescriptionImageTypes
- @/Components/language/LanguageProvider

### Components\dashboard\prescription-review\DoctorInstructionCard.tsx
- @/lib/medicalFormatter
- @/lib/prescription-image/prescriptionImageTypes
- @/Components/language/LanguageProvider

### Components\dashboard\prescription-review\HistoryCard.tsx
- @/lib/medicalFormatter
- @/lib/prescription-image/prescriptionImageTypes
- @/Components/language/LanguageProvider

### Components\dashboard\prescription-review\InvestigationCard.tsx
- @/lib/medicalFormatter
- @/lib/prescription-image/prescriptionImageTypes
- @/Components/language/LanguageProvider

### Components\dashboard\prescription-review\MedicineCard.tsx
- @/lib/prescription-image/prescriptionImageTypes
- @/Components/language/LanguageProvider

### Components\dashboard\prescription-review\OtherNotesCard.tsx
- @/lib/medicalFormatter
- @/lib/prescription-image/prescriptionImageTypes
- @/Components/language/LanguageProvider

### Components\dashboard\prescription-review\PatientCard.tsx
- @/lib/medicalFormatter
- @/lib/prescription-image/prescriptionImageTypes
- @/Components/language/LanguageProvider

### Components\dashboard\prescription-review\ReviewActions.tsx
- @/lib/medicalFormatter
- @/Components/language/LanguageProvider

### Components\dashboard\prescription-review\VitalsCard.tsx
- @/lib/medicalFormatter
- @/lib/prescription-image/prescriptionImageTypes
- @/Components/language/LanguageProvider

### Components\dashboard\prescription\PrescriptionTabs.tsx
- react

### Components\help\HelpBackButton.tsx
- next/link
- @/Components/language/LanguageProvider

### Components\help\HelpCard.tsx
- next/link

### Components\language\LanguageProvider.tsx
- react
- @/lib/i18n
- @/lib/i18n/types

### Components\language\LanguageSelector.tsx
- @/lib/i18n
- @/lib/i18n/types
- ./LanguageProvider

### Components\patient\PersonSelector.tsx
- react
- @/lib/storage/patientStorage
- @/lib/types/patient

### app\add-patient\page.tsx
- react
- next/navigation
- @/lib/auth/authService
- @/lib/storage/patientStorage
- @/app/components/AppHeader
- @/lib/utils/appAlert
- @/Components/language/LanguageProvider
- @/lib/performance/performanceTracker

### app\admin\performance\page.tsx
- react
- next/navigation
- @/lib/performance/performanceTypes
- @/lib/performance/performanceStorage

### app\api\analytics\auth-session\login\route.ts
- next/server
- @/lib/supabaseAdmin

### app\api\analytics\auth-session\logout\route.ts
- next/server
- @/lib/supabaseAdmin

### app\api\analytics\event\route.ts
- next/server
- @/lib/supabaseAdmin
- @/lib/analytics/analyticsTypes
- @/lib/analytics/analyticsEvents

### app\api\medical-image\route.ts
- openai
- next/server
- @/lib/medical-image/medicalImageTypes
- @/lib/supabaseAdmin

### app\api\medical-voice\route.ts
- openai
- next/server
- @/lib/supabaseAdmin
- @/lib/types/dailyCare
- @/lib/medical-voice/medicalVoiceTypes

### app\api\prescription-identity\route.ts
- openai
- next/server
- @/lib/prescription-image/prescriptionImageTypes
- @/lib/supabaseAdmin
- @/lib/prescription-ai/extractionInstructions

### app\api\prescription-image\route.ts
- openai
- next/server
- @/lib/prescription-image/prescriptionImageTypes
- @/lib/supabaseAdmin
- @/lib/prescription-ai/extractionInstructions

### app\auth\callback\route.ts
- next/server
- @/lib/supabase/server

### app\care\page.tsx
- react
- next/navigation
- @/app/components/AppHeader
- @/lib/auth/authService
- @/lib/storage/patientStorage
- @/lib/types/patient
- @/Components/daily-care/VoiceRecorder
- @/lib/medical-voice/medicalVoiceService
- @/lib/medical-voice/medicalVoiceTypes
- @/lib/storage/DailyCareStorage
- @/lib/storage/SelfDailyCareStorage
- @/Components/language/LanguageProvider

### app\carevr-journey\page.tsx
- next/image
- react

### app\checkin\page.tsx
- react
- next/navigation
- @/app/components/AppBrand

### app\components\ReportTable.tsx
- react

### app\components\TrendChart.tsx
- @/lib/trends/trendResult
- ./TrendLineChart
- @/lib/trends/trendChartConfig

### app\components\TrendLineChart.tsx
- recharts

### app\components\common\ClinicalSummaryCard.tsx
- @/lib/clinical-summary/ClinicalSummaryTypes
- @/lib/utils/displayFormatter

### app\components\common\ReportNavigation.tsx
- next/link
- react

### app\components\dashboard\HelpWorkspace.tsx
- @/Components/help/HelpCard

### app\consent\page.tsx
- react
- next/navigation
- @/lib/auth/authService
- @/lib/consent/storage/consentStorage

### app\daily-care\components\ActionButtons.tsx
- ../styles

### app\daily-care\components\DailyCareForm.tsx
- react
- next/navigation
- @/lib/storage/patientStorage
- @/lib/types/patient
- @/lib/types/dailyCare
- ./PatientCard
- ./TemperatureCard
- ./VitalsCard
- ./SymptomsCard
- ./PainLocationCard
- ./ActionButtons
- @/lib/storage/DailyCareStorage
- @/lib/storage/SelfDailyCareStorage
- @/lib/utils/appAlert
- @/Components/language/LanguageProvider
- @/lib/medical-image/medicalImageService
- @/lib/analytics/analyticsService
- @/lib/analytics/analyticsEvents
- @/lib/medical-voice/medicalVoiceService
- @/Components/daily-care/VoiceRecorder
- @/lib/performance/performanceTracker

### app\daily-care\components\PainLocationCard.tsx
- @/lib/types/dailyCare
- ../styles
- @/Components/language/LanguageProvider

### app\daily-care\components\PatientCard.tsx
- @/lib/types/patient
- ../styles

### app\daily-care\components\SymptomsCard.tsx
- @/lib/types/dailyCare
- @/Components/language/LanguageProvider
- ../styles

### app\daily-care\components\TemperatureCard.tsx
- ../styles

### app\daily-care\components\VitalsCard.tsx
- ../styles
- @/Components/language/LanguageProvider

### app\daily-care\page.tsx
- react
- next/navigation
- @/lib/auth/authService
- @/lib/storage/SelfProfileStorage
- @/lib/utils/appAlert
- ./components/DailyCareForm
- @/app/components/AppHeader
- @/Components/language/LanguageProvider
- @/lib/analytics/analyticsService
- @/lib/analytics/analyticsEvents
- @/lib/performance/performanceTracker

### app\daily-care\styles.ts
- react

### app\dashboard\page.tsx
- react
- next/navigation
- @/lib/auth/authService
- @/lib/repositories/profileRepository
- @/app/components/AppHeader
- @/Components/language/LanguageSelector
- @/Components/language/LanguageProvider
- @/lib/analytics/analyticsService
- @/lib/analytics/analyticsEvents
- @/lib/analytics/authSessionService
- @/lib/performance/performanceTracker
- @/app/components/dashboard/HelpWorkspace
- @/Components/dashboard/ManualCareWorkspace
- @/Components/patient/PersonSelector
- @/Components/dashboard/ActionOptions
- @/Components/dashboard/PrescriptionWorkspace
- @/Components/dashboard/PrescriptionHistoryWorkspace
- @/Components/dashboard/ConsultationWorkspace
- @/Components/dashboard/VoiceCareWorkspace
- @/Components/dashboard/UploadCareWorkspace
- @/lib/consent/storage/consentStorage

### app\family\page.tsx
- react
- next/navigation
- @/lib/assessmentStorage
- @/lib/auth/authService
- @/lib/repositories/profileRepository
- @/lib/storage/patientStorage
- @/app/components/AppHeader
- @/lib/types/patient
- @/Components/language/LanguageProvider
- @/lib/analytics/analyticsService
- @/lib/analytics/analyticsEvents
- @/lib/performance/performanceTracker

### app\family\page2\page.tsx
- react
- next/navigation
- @/Components/AssessmentLayout
- @/Components/language/LanguageProvider
- @/lib/analytics/analyticsService
- @/lib/analytics/analyticsEvents

### app\family\page3\page.tsx
- react
- next/navigation
- @/Components/AssessmentLayout
- @/Components/language/LanguageProvider
- @/lib/analytics/analyticsService
- @/lib/analytics/analyticsEvents

### app\family\page4\page.tsx
- react
- next/navigation
- @/Components/AssessmentLayout
- @/Components/language/LanguageProvider
- @/lib/analytics/analyticsService
- @/lib/analytics/analyticsEvents

### app\family\page5\page.tsx
- react
- next/navigation
- @/Components/AssessmentLayout
- @/Components/language/LanguageProvider
- @/lib/analytics/analyticsService
- @/lib/analytics/analyticsEvents

### app\forgot-password\page.tsx
- react
- next/navigation
- @/lib/auth/authService
- @/app/components/AppBrand

### app\help\about\page.tsx
- @/Components/help/HelpBackButton

### app\help\assessments\page.tsx
- @/Components/help/HelpBackButton

### app\help\clinical-trends\page.tsx
- @/Components/help/HelpBackButton

### app\help\daily-care\page.tsx
- @/Components/help/HelpBackButton

### app\help\faq\page.tsx
- @/Components/help/HelpBackButton

### app\help\getting-started\page.tsx
- @/Components/help/HelpBackButton

### app\help\layout.tsx
- react

### app\help\medication-management\page.tsx
- @/Components/help/HelpBackButton

### app\help\page.tsx
- next/link
- @/Components/help/HelpCard
- @/lib/performance/performanceTracker

### app\help\pdf-reports\page.tsx
- @/Components/help/HelpBackButton

### app\help\privacy\page.tsx
- @/Components/help/HelpBackButton

### app\help\reports\page.tsx
- @/Components/help/HelpBackButton

### app\journey-review\ActiveTreatmentCard.tsx
- lucide-react
- @/lib/journey

### app\journey-review\ChangeCard.tsx
- lucide-react

### app\journey-review\EmptyJourney.tsx
- lucide-react

### app\journey-review\JourneyActions.tsx
- lucide-react
- @/lib/journey

### app\journey-review\JourneyConfidence.tsx
- lucide-react
- @/lib/journey

### app\journey-review\JourneyContext.tsx
- react
- @/lib/journey

### app\journey-review\JourneyDetectedChanges.tsx
- lucide-react
- @/lib/journey
- ./ChangeCard

### app\journey-review\JourneyHeader.tsx
- lucide-react
- @/lib/journey

### app\journey-review\JourneyQuestions.tsx
- @/lib/journey
- ./QuestionCard

### app\journey-review\JourneyReview.tsx
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

### app\journey-review\JourneySummaryCard.tsx
- lucide-react
- @/lib/journey
- ./SummaryCard

### app\journey-review\JourneyTimeline.tsx
- lucide-react
- @/lib/journey

### app\journey-review\JourneyWizard.tsx
- lucide-react
- ./JourneyContext
- ../journey-review
- ./TimelinePreview
- ./JourneyComplete

### app\journey-review\QuestionCard.tsx
- react
- lucide-react
- @/lib/journey
- ./QuestionRenderer

### app\journey-review\QuestionRenderer.tsx
- @/lib/journey

### app\journey-review\SummaryCard.tsx
- lucide-react

### app\journey-review\TimelinePreview.tsx
- lucide-react
- @/lib/journey

### app\journey-review\TreatmentDecisionCard.tsx
- lucide-react
- @/lib/journey

### app\layout.tsx
- @/Components/language/LanguageProvider

### app\login\page.tsx
- react
- next/navigation
- @/lib/auth/authService
- @/app/components/AppBrand
- @/lib/analytics/authSessionService
- @/lib/performance/performanceTracker

### app\medications\consultation-mode\page.tsx
- react
- next/navigation
- @/app/components/AppHeader
- @/lib/auth/authService
- @/lib/storage/patientStorage
- @/lib/types/patient

### app\medications\page.tsx
- react
- next/navigation
- @/app/components/AppHeader
- @/lib/auth/authService
- @/Components/language/LanguageProvider

### app\medications\prescription\page.tsx
- react
- next/navigation
- @/app/components/AppHeader
- @/lib/auth/authService
- @/lib/prescription-image/prescriptionImageTypes
- @/lib/prescription-image/prescriptionImageService

### app\page.tsx
- react
- next/navigation

### app\register\page.tsx
- react
- next/navigation
- @/lib/auth/authService

### app\report\page.tsx
- react
- @/lib/utils/pdf/assessmentPdf
- next/navigation
- @/app/components/AppBrand
- @/lib/storage/assessmentStorage
- @/lib/types/assessment
- @/lib/reportStorage
- @/lib/analytics/analyticsService
- @/lib/analytics/analyticsEvents
- @/lib/performance/performanceTracker

### app\reports\assessment\family\[id]\page.tsx
- react
- next/navigation
- @/lib/storage/assessmentStorage
- @/lib/storage/patientStorage
- @/lib/types/patient
- @/lib/types/assessment
- @/app/components/AppHeader
- @/lib/analytics/analyticsEvents
- @/lib/analytics/analyticsService

### app\reports\assessment\family\page.tsx
- react
- next/navigation
- @/lib/storage/assessmentStorage
- @/lib/storage/patientStorage
- @/lib/types/patient
- @/lib/types/assessment
- @/app/components/AppHeader
- @/app/components/ReportTable
- @/lib/analytics/analyticsEvents
- @/lib/analytics/analyticsService

### app\reports\assessment\page.tsx
- next/navigation
- @/app/components/AppHeader
- @/app/components/common/ReportNavigation
- @/lib/analytics/analyticsEvents
- @/lib/analytics/analyticsService

### app\reports\assessment\self\[id]\page.tsx
- react
- next/navigation
- @/lib/storage/assessmentStorage
- @/lib/repositories/profileRepository
- @/lib/types/profile
- @/lib/types/assessment
- @/app/components/AppHeader
- @/lib/analytics/analyticsEvents
- @/lib/analytics/analyticsService

### app\reports\assessment\self\page.tsx
- react
- next/navigation
- @/lib/storage/assessmentStorage
- @/lib/repositories/profileRepository
- @/lib/types/profile
- @/lib/types/assessment
- @/app/components/AppHeader
- @/app/components/ReportTable
- @/lib/analytics/analyticsEvents
- @/lib/analytics/analyticsService

### app\reports\daily-care\[id]\page.tsx
- react
- next/navigation
- @/lib/storage/DailyCareStorage
- @/lib/types/dailyCare
- @/lib/storage/patientStorage
- @/app/components/AppHeader
- @/lib/utils/displayFormatter
- @/lib/clinical-summary/ClinicalSummaryEngine
- @/app/components/common/ClinicalSummaryCard
- @/lib/pdf/DailyCarePdfGenerator
- @/lib/pdf/PdfModels
- @/lib/analytics/analyticsEvents
- @/lib/analytics/analyticsService

### app\reports\daily-care\page.tsx
- react
- next/navigation
- @/lib/utils/appAlert
- @/lib/storage/DailyCareStorage
- @/lib/types/dailyCare
- @/lib/storage/patientStorage
- @/lib/types/patient
- @/lib/utils/displayFormatter
- @/app/components/common/ReportNavigation
- @/lib/analytics/analyticsEvents
- @/lib/analytics/analyticsService

### app\reports\daily-care\select\page.tsx
- next/navigation
- @/app/components/AppHeader
- @/lib/analytics/analyticsEvents
- @/lib/analytics/analyticsService

### app\reports\daily-care\self\[id]\page.tsx
- react
- next/navigation
- @/lib/storage/SelfDailyCareStorage
- @/lib/types/selfDailyCare
- @/lib/auth/authService
- @/lib/storage/SelfProfileStorage
- @/app/components/AppHeader
- @/lib/utils/displayFormatter
- @/lib/utils/dateUtils
- @/lib/clinical-summary/ClinicalSummaryEngine
- @/app/components/common/ClinicalSummaryCard
- @/lib/pdf/DailyCarePdfGenerator
- @/lib/pdf/PdfModels
- @/lib/analytics/analyticsEvents
- @/lib/analytics/analyticsService

### app\reports\daily-care\self\page.tsx
- react
- next/navigation
- @/lib/storage/SelfDailyCareStorage
- @/lib/types/selfDailyCare
- @/lib/auth/authService
- @/lib/utils/displayFormatter
- @/app/components/common/ReportNavigation
- @/lib/analytics/analyticsEvents
- @/lib/analytics/analyticsService

### app\reports\page.tsx
- react
- next/navigation
- @/app/components/AppHeader
- @/lib/analytics/analyticsEvents
- @/lib/analytics/analyticsService
- @/lib/performance/performanceTracker

### app\reports\trends\page.tsx
- react
- next/navigation
- @/app/components/AppHeader
- @/lib/utils/appAlert
- @/lib/storage/trendDraftStorage
- @/lib/trends/trendRequest
- @/lib/storage/patientStorage
- @/lib/types/patient
- @/lib/analytics/analyticsEvents
- @/lib/analytics/analyticsService

### app\reports\trends\results\page.tsx
- react
- html-to-image
- next/navigation
- @/app/components/AppHeader
- @/lib/utils/appAlert
- @/lib/trends/trendRequest
- @/lib/trends/trendResult
- @/lib/storage/trendDraftStorage
- @/lib/storage/TrendStorage
- @/lib/builders/TrendBuilder
- @/app/components/TrendChart
- @/lib/trends/trendReportBuilder
- @/lib/trends/trendPdfGenerator
- @/lib/analytics/analyticsEvents
- @/lib/analytics/analyticsService

### app\reports\trends\selector\page.tsx
- next/navigation
- @/app/components/AppHeader
- @/app/components/common/ReportNavigation
- @/lib/analytics/analyticsEvents
- @/lib/analytics/analyticsService

### app\reports\trends\self\page.tsx
- react
- next/navigation
- @/app/components/AppHeader
- @/lib/utils/appAlert
- @/lib/storage/trendDraftStorage
- @/lib/trends/trendRequest
- @/lib/auth/authService
- @/lib/analytics/analyticsEvents
- @/lib/analytics/analyticsService

### app\reports\trends\self\results\page.tsx
- react
- html-to-image
- next/navigation
- @/app/components/AppHeader
- @/lib/utils/appAlert
- @/lib/trends/trendRequest
- @/lib/trends/trendResult
- @/lib/storage/trendDraftStorage
- @/lib/storage/selfTrendStorage
- @/lib/builders/SelfTrendBuilder
- @/app/components/TrendChart
- @/lib/trends/trendReportBuilder
- @/lib/trends/selfTrendPdfGenerator
- @/lib/analytics/analyticsEvents
- @/lib/analytics/analyticsService

### app\reset-password\page.tsx
- react
- next/navigation
- @/lib/auth/authService
- @/app/components/AppBrand

### app\self-profile\page.tsx
- @/app/components/AppHeader
- react
- next/navigation
- @/lib/auth/authService
- @/lib/storage/SelfProfileStorage
- @/lib/utils/appAlert

### app\self\page.tsx
- react
- next/navigation
- @/app/components/AppHeader
- @/Components/language/LanguageProvider
- @/lib/assessmentStorage
- @/lib/analytics/analyticsService
- @/lib/analytics/analyticsEvents

### app\self\page2\page.tsx
- @/lib/assessmentStorage
- react
- next/navigation
- @/Components/AssessmentLayout
- @/Components/language/LanguageProvider
- @/lib/analytics/analyticsService
- @/lib/analytics/analyticsEvents
- @/lib/performance/performanceTracker

### app\self\page3\page.tsx
- react
- next/navigation
- @/Components/AssessmentLayout
- @/Components/language/LanguageProvider
- @/lib/analytics/analyticsService
- @/lib/analytics/analyticsEvents

### app\self\page4\page.tsx
- react
- next/navigation
- @/Components/AssessmentLayout
- @/Components/language/LanguageProvider
- @/lib/analytics/analyticsService
- @/lib/analytics/analyticsEvents

### app\self\page5\page.tsx
- react
- next/navigation
- @/Components/AssessmentLayout
- @/Components/language/LanguageProvider
- @/lib/analytics/analyticsService
- @/lib/analytics/analyticsEvents

### app\welcome\page.tsx
- react
- next/navigation

### lib\analytics\analyticsService.ts
- @/lib/supabase
- @/lib/analytics/analyticsTypes
- @/lib/analytics/analyticsIdentity

### lib\analytics\authSessionService.ts
- @/lib/supabase
- @/lib/analytics/analyticsIdentity

### lib\assessmentStorage.ts
- ./reportStorage

### lib\auth\authService.ts
- @supabase/supabase-js
- @/lib/supabase

### lib\builders\SelfTrendBuilder.ts
- @/lib/types/selfDailyCare
- @/lib/trends/trendRequest
- @/lib/trends/trendResult
- @/lib/trends/trendClinicalAnalyzer

### lib\builders\TrendBuilder.ts
- @/lib/types/dailyCare
- @/lib/trends/trendRequest
- @/lib/trends/trendResult
- @/lib/trends/trendClinicalAnalyzer

### lib\builders\assessmentBuilder.ts
- @/lib/types/assessmentDraft
- @/lib/types/assessment
- @/lib/types/assessmentScore

### lib\builders\clinicalEventBuilder.ts
- @/lib/types/dailyCare
- @/lib/types/clinicalEvent

### lib\clinical-intelligence\ClinicalComparisonEngine.ts
- @/lib/prescription-ai/models/consultationModel
- ./comparisonTypes

### lib\clinical-intelligence\comparisonTypes.ts
- @/lib/prescription-ai/models/consultationModel

### lib\clinical-summary\ClinicalSummaryEngine.ts
- ./ClinicalSummaryTypes
- ./TemperatureAnalyzer
- ./VitalsAnalyzer
- ./SymptomsAnalyzer
- ./PainAnalyzer

### lib\clinical-summary\PainAnalyzer.ts
- ./ClinicalSummaryTypes

### lib\clinical-summary\SymptomsAnalyzer.ts
- ./ClinicalSummaryTypes

### lib\clinical-summary\TemperatureAnalyzer.ts
- ./ClinicalSummaryTypes

### lib\clinical-summary\VitalsAnalyzer.ts
- ./ClinicalSummaryTypes

### lib\consent\mapper\consentMapper.ts
- @/lib/consent/models/Consent

### lib\consent\repository\consentRepository.ts
- @/lib/supabase
- @/lib/consent/mapper/consentMapper
- @/lib/consent/models/Consent
- @/lib/repositories/BaseRepository
- @/lib/constants/consentVersions

### lib\consent\storage\consentStorage.ts
- @/lib/consent/models/Consent
- @/lib/auth/authService
- @/lib/consent/repository/consentRepository
- @/lib/constants/consentVersions

### lib\i18n\config.ts
- ./types

### lib\i18n\index.ts
- ./types
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

### lib\i18n\translations\as.ts
- ../types

### lib\i18n\translations\bn.ts
- ../types

### lib\i18n\translations\en.ts
- ../types

### lib\i18n\translations\gu.ts
- ../types

### lib\i18n\translations\hi.ts
- ../types

### lib\i18n\translations\kn.ts
- ../types

### lib\i18n\translations\ml.ts
- ../types

### lib\i18n\translations\mr.ts
- ../types

### lib\i18n\translations\or.ts
- ../types

### lib\i18n\translations\pa.ts
- ../types

### lib\i18n\translations\ta.ts
- ../types

### lib\i18n\translations\te.ts
- ../types

### lib\journey\JourneyAnalysisEngine.ts
- ../clinical/comparison/comparisonTypes
- ./journeyModels
- ./journeyConstants
- ./journeyTypes
- ./journeyValidation
- ./questionBuilder
- ./summaryBuilder
- ./timelineBuilder

### lib\journey\comparison\comparisonTypes.ts
- ../model/consultationModel

### lib\journey\comparison\prescriptionComparator.ts
- ../model/consultationModel
- ./comparisonTypes

### lib\journey\consultation\consultationEngine.ts
- ./consultationTypes
- ./consultationValidator
- ./consultationResolver
- ./consultationMapper

### lib\journey\consultation\consultationMapper.ts
- ../model/consultationModel
- ./consultationTypes

### lib\journey\consultation\consultationResolver.ts
- ../model/consultationModel
- ./consultationTypes

### lib\journey\consultation\consultationTypes.ts
- ../model/consultationModel

### lib\journey\engine\nodeBuilder.ts
- ../journeyModels
- ../journeyTypes
- ../consultation/consultationModel
- ../comparison/comparisonModels

### lib\journey\journeyAnalysisModels.ts
- ./journeyModels
- ./questionBuilder

### lib\journey\journeyMapper.ts
- ./journeyModels

### lib\journey\journeyModels.ts
- ./journeyTypes
- ./journeyAnalysisModels

### lib\journey\journeyRepository.ts
- ./journeyModels
- ./journeyMapper
- ./journeyStorage

### lib\journey\journeyRules.ts
- ./journeyTypes

### lib\journey\journeyStorage.ts
- @/lib/supabase/client

### lib\journey\journeyUtils.ts
- ./journeyModels
- ./journeyRules
- ./journeyTypes

### lib\journey\journeyValidation.ts
- ./journeyModels

### lib\journey\questionBuilder.ts
- ./journeyModels
- ./journeyRules
- ./journeyUtils
- ./journeyTypes

### lib\journey\summaryBuilder.ts
- ./journeyModels

### lib\journey\timelineBuilder.ts
- ./journeyModels
- ./journeyRules
- ./journeyUtils

### lib\mappers\DailyCareMapper.ts
- @/lib/types/dailyCare

### lib\mappers\PatientMapper.ts
- ../types/patient
- ../database

### lib\mappers\SelfDailyCareMapper.ts
- @/lib/types/selfDailyCare

### lib\mappers\SelfProfileMapper.ts
- ../selfProfile
- ../database

### lib\mappers\assessmentMapper.ts
- @/lib/types/assessment

### lib\mappers\clinicalEventMapper.ts
- @/lib/database
- @/lib/types/clinicalEvent

### lib\medical-image\medicalImageParser.ts
- ./medicalImageTypes

### lib\medical-image\medicalImageService.ts
- ./medicalImageTypes
- @/lib/supabase

### lib\medical-voice\medicalVoiceService.ts
- ./medicalVoiceTypes
- @/lib/supabase
- ./medicalVoiceTypes

### lib\medical-voice\medicalVoiceTypes.ts
- @/lib/types/dailyCare

### lib\pdf\DailyCarePdfGenerator.ts
- pdf-lib
- ./PdfModels
- @/lib/utils/displayFormatter

### lib\pdf\PdfModels.ts
- @/lib/types/selfDailyCare
- @/lib/clinical-summary/ClinicalSummaryTypes

### lib\pdf\trendReportPdf.ts
- @/lib/trends/trendResult

### lib\performance\performanceStorage.ts
- ./performanceTypes

### lib\performance\performanceTracker.ts
- ./performanceTypes
- ./performanceStorage

### lib\prescription-ai\classification\clinicalRouter.ts
- @/lib/prescription-image/prescriptionImageTypes

### lib\prescription-ai\consultation\consultationPromptBuilder.ts
- ./complaintsRules
- ./vitalsRules
- ./historyRules
- ./examinationRules
- ./assessmentRules
- ./investigationRules
- ./doctorInstructionRules

### lib\prescription-ai\examples\cardiologyExamples.ts
- ../prescriptionExamples

### lib\prescription-ai\examples\consultationExamples.ts
- ../prescriptionExamples

### lib\prescription-ai\examples\diabetesExamples.ts
- ../prescriptionExamples

### lib\prescription-ai\examples\generalMedicineExamples.ts
- ../prescriptionExamples

### lib\prescription-ai\examples\index.ts
- ./consultationExamples
- ./generalMedicineExamples
- ./oncologyExamples
- ./cardiologyExamples
- ./diabetesExamples
- ./pulmonologyExamples

### lib\prescription-ai\examples\oncologyExamples.ts
- ../prescriptionExamples

### lib\prescription-ai\examples\pulmonologyExamples.ts
- ../prescriptionExamples

### lib\prescription-ai\extractionInstructions.ts
- ./prescriptionKnowledge
- ./prescriptionReadingRules
- ./prescriptionRecognitionRules
- ./examples
- ./consultation/consultationPromptBuilder

### lib\prescription-image\prescriptionImageService.ts
- ./prescriptionImageTypes
- @/lib/supabase

### lib\prescription\prescriptionMapper.ts
- @/lib/prescription-image/prescriptionImageTypes
- @/lib/prescription/prescriptionTypes

### lib\prescription\prescriptionRepository.ts
- @/lib/supabase
- @/lib/prescription/prescriptionTypes

### lib\prescription\prescriptionReviewMapper.ts
- @/lib/prescription/prescriptionTypes
- @/lib/prescription-image/prescriptionImageTypes

### lib\prescription\prescriptionStorage.ts
- @/lib/prescription-image/prescriptionImageTypes
- @/lib/prescription/prescriptionMapper
- @/lib/prescription/prescriptionRepository
- @/lib/prescription/prescriptionTypes

### lib\prescription\prescriptionValidator.ts
- @/lib/prescription-image/prescriptionImageTypes

### lib\repositories\BaseRepository.ts
- @/lib/auth/authService

### lib\repositories\DailyCareRepository.ts
- @/lib/supabase
- @/lib/mappers/DailyCareMapper
- @/lib/types/dailyCare

### lib\repositories\SelfDailyCareRepository.ts
- @/lib/supabase
- @/lib/mappers/SelfDailyCareMapper
- @/lib/types/selfDailyCare

### lib\repositories\SelfProfileRepository.ts
- ../supabase
- ./BaseRepository
- ../selfProfile
- ../database
- ../mappers/SelfProfileMapper

### lib\repositories\SelfTrendRepository.ts
- @/lib/repositories/SelfDailyCareRepository
- @/lib/types/selfDailyCare
- @/lib/types/result
- @/lib/trends/trendRequest

### lib\repositories\TrendRepository.ts
- @/lib/repositories/DailyCareRepository
- @/lib/types/dailyCare
- @/lib/types/result
- @/lib/trends/trendRequest

### lib\repositories\assessmentRepository.ts
- @/lib/supabase
- @/lib/mappers/assessmentMapper
- @/lib/types/assessment

### lib\repositories\clinicalEventRepository.ts
- @/lib/supabase
- @/lib/database
- @/lib/types/clinicalEvent
- @/lib/mappers/clinicalEventMapper

### lib\repositories\patientRepository.ts
- ../supabase
- ./BaseRepository
- ../types/patient
- ../database
- ../mappers/PatientMapper

### lib\repositories\profileRepository.ts
- ../supabase
- ./BaseRepository
- ../types/profile
- ../auth/authService

### lib\storage\DailyCareStorage.ts
- @/lib/repositories/DailyCareRepository
- @/lib/auth/authService
- @/lib/types/dailyCare
- @/lib/types/result
- @/lib/builders/clinicalEventBuilder
- @/lib/storage/clinicalEventStorage

### lib\storage\SelfDailyCareStorage.ts
- @/lib/repositories/SelfDailyCareRepository
- @/lib/auth/authService
- @/lib/types/selfDailyCare
- @/lib/types/result

### lib\storage\SelfProfileStorage.ts
- ../selfProfile
- ./storageResult
- ../repositories/SelfProfileRepository
- @/lib/types/result

### lib\storage\TrendStorage.ts
- @/lib/repositories/TrendRepository
- @/lib/trends/trendRequest
- @/lib/types/dailyCare
- @/lib/types/result

### lib\storage\assessmentDraftStorage.ts
- @/lib/types/assessmentDraft

### lib\storage\assessmentStorage.ts
- @/lib/repositories/assessmentRepository
- @/lib/auth/authService
- @/lib/types/assessment
- @/lib/types/result

### lib\storage\clinicalEventStorage.ts
- @/lib/types/clinicalEvent
- @/lib/repositories/clinicalEventRepository

### lib\storage\patientStorage.ts
- ../types/patient
- ./storageResult
- ../validators/patientValidator
- ../repositories/patientRepository
- @/lib/types/result

### lib\storage\selfTrendStorage.ts
- @/lib/repositories/SelfTrendRepository
- @/lib/trends/trendRequest
- @/lib/types/selfDailyCare
- @/lib/types/result

### lib\storage\storageResult.ts
- @/lib/types/result

### lib\storage\trendDraftStorage.ts
- @/lib/trends/trendRequest

### lib\supabase.ts
- @supabase/supabase-js

### lib\supabaseAdmin.ts
- @supabase/supabase-js

### lib\supabase\server.ts
- next/headers
- @supabase/ssr

### lib\treatment\treatmentMapper.ts
- ./treatmentModels
- ./treatmentTypes

### lib\treatment\treatmentModels.ts
- ./treatmentTypes
- ./treatmentTypes
- ./treatmentTypes

### lib\treatment\treatmentRepository.ts
- ./treatmentModels

### lib\treatment\treatmentRules.ts
- ./treatmentModels
- ./treatmentTypes

### lib\treatment\treatmentStorage.ts
- @/lib/supabase/client
- ./treatmentModels
- ./treatmentRepository

### lib\treatment\treatmentValidation.ts
- ./treatmentModels

### lib\trends\selfTrendPdfGenerator.ts
- pdf-lib
- ./trendReport
- ./trendChartConfig

### lib\trends\trendChartConfig.ts
- ./trendResult

### lib\trends\trendClinicalAnalyzer.ts
- ./trendResult

### lib\trends\trendPdfGenerator.ts
- pdf-lib
- ./trendReport
- ./trendChartConfig

### lib\trends\trendReport.ts
- @/lib/trends/trendResult

### lib\trends\trendReportBuilder.ts
- @/lib/trends/trendResult
- ./trendReport
- ./trendChartConfig

### lib\trends\trendResult.ts
- @/lib/trends/trendRequest

### lib\types\assessmentDraft.ts
- @/lib/types/assessment

### lib\types\assessmentScore.ts
- @/lib/types/assessment

### lib\utils\pdf\assessmentPdf.ts
- html2canvas
- jspdf

### lib\validators\patientValidator.ts
- ../types/patient
- ../types/result
- ../storage/storageResult

### next.config.ts
- next

### scripts\auditArchitecture.ts
- fs
- path

### scripts\dependencyAudit.ts
- fs
- path

### scripts\discoverProject.ts
- fs
- path

### scripts\governArchitecture.ts
- fs
- path

### scripts\scaffoldClinicalCore.ts
- fs
- path

### scripts\scaffoldDomain.ts
- fs
- path

---

## 5. Summary

Total TypeScript files: 424

Journey related files: 137

Total exported definitions: 429

Potential duplicate definitions: 19
