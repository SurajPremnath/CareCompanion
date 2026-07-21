# CareVR Architecture Audit

Generated : 18/7/2026, 3:09:22 pm

Files : 401

---

# 

Files : 2

|File|Status|Responsibility|LOC|Interfaces|Classes|Functions|
|---|---|---|---:|---:|---:|---:|
|next-env.d.ts|MINIMAL|General|7|0|0|0|
|next.config.ts|MINIMAL|General|11|0|0|0|

---

# Components

Files : 2

|File|Status|Responsibility|LOC|Interfaces|Classes|Functions|
|---|---|---|---:|---:|---:|---:|
|AssessmentLayout.tsx|ACTIVE|General|81|0|0|1|
|Header.tsx|ACTIVE|General|99|0|0|4|

---

# Components\common

Files : 1

|File|Status|Responsibility|LOC|Interfaces|Classes|Functions|
|---|---|---|---:|---:|---:|---:|
|ResponsiveTable.tsx|EMPTY|General|1|0|0|0|

---

# Components\daily-care

Files : 1

|File|Status|Responsibility|LOC|Interfaces|Classes|Functions|
|---|---|---|---:|---:|---:|---:|
|VoiceRecorder.tsx|ACTIVE|General|557|1|0|11|

---

# Components\dashboard

Files : 10

|File|Status|Responsibility|LOC|Interfaces|Classes|Functions|
|---|---|---|---:|---:|---:|---:|
|ActionOptions.tsx|ACTIVE|General|817|1|0|12|
|ConsultationWorkspace.tsx|ACTIVE|General|614|1|0|9|
|ManualCareWorkspace.tsx|ACTIVE|General|1594|2|0|30|
|PrescriptionDetailsPanel.tsx|EMPTY|General|1|0|0|0|
|PrescriptionHistoryWorkspace.tsx|ACTIVE|General|1377|2|0|17|
|PrescriptionReview.tsx|ACTIVE|General|426|1|0|10|
|PrescriptionWorkspace.styles.ts|ACTIVE|General|203|0|0|0|
|PrescriptionWorkspace.tsx|ACTIVE|General|1195|1|0|20|
|UploadCareWorkspace.tsx|ACTIVE|General|1636|2|0|17|
|VoiceCareWorkspace.tsx|ACTIVE|General|1250|1|0|13|

---

# Components\dashboard\prescription

Files : 1

|File|Status|Responsibility|LOC|Interfaces|Classes|Functions|
|---|---|---|---:|---:|---:|---:|
|PrescriptionTabs.tsx|ACTIVE|General|133|1|0|3|

---

# Components\dashboard\prescription-review

Files : 10

|File|Status|Responsibility|LOC|Interfaces|Classes|Functions|
|---|---|---|---:|---:|---:|---:|
|AssessmentCard.tsx|ACTIVE|General|228|1|0|4|
|ComplaintsCard.tsx|ACTIVE|General|85|1|0|2|
|DoctorInstructionCard.tsx|ACTIVE|General|77|1|0|2|
|HistoryCard.tsx|ACTIVE|General|208|1|0|7|
|InvestigationCard.tsx|ACTIVE|General|78|1|0|2|
|MedicineCard.tsx|ACTIVE|General|332|1|0|4|
|OtherNotesCard.tsx|ACTIVE|General|71|1|0|2|
|PatientCard.tsx|ACTIVE|General|311|1|0|9|
|ReviewActions.tsx|ACTIVE|General|203|1|0|5|
|VitalsCard.tsx|ACTIVE|General|124|1|0|1|

---

# Components\help

Files : 2

|File|Status|Responsibility|LOC|Interfaces|Classes|Functions|
|---|---|---|---:|---:|---:|---:|
|HelpBackButton.tsx|ACTIVE|General|44|0|0|1|
|HelpCard.tsx|ACTIVE|General|104|1|0|1|

---

# Components\language

Files : 2

|File|Status|Responsibility|LOC|Interfaces|Classes|Functions|
|---|---|---|---:|---:|---:|---:|
|LanguageProvider.tsx|ACTIVE|Provider|210|2|0|9|
|LanguageSelector.tsx|ACTIVE|General|127|0|0|3|

---

# Components\patient

Files : 1

|File|Status|Responsibility|LOC|Interfaces|Classes|Functions|
|---|---|---|---:|---:|---:|---:|
|PersonSelector.tsx|ACTIVE|General|686|1|0|9|

---

# app

Files : 2

|File|Status|Responsibility|LOC|Interfaces|Classes|Functions|
|---|---|---|---:|---:|---:|---:|
|layout.tsx|ACTIVE|General|29|0|0|1|
|page.tsx|ACTIVE|Page|21|0|0|2|

---

# app\add-patient

Files : 1

|File|Status|Responsibility|LOC|Interfaces|Classes|Functions|
|---|---|---|---:|---:|---:|---:|
|page.tsx|ACTIVE|Page|546|0|0|10|

---

# app\admin\performance

Files : 1

|File|Status|Responsibility|LOC|Interfaces|Classes|Functions|
|---|---|---|---:|---:|---:|---:|
|page.tsx|ACTIVE|Page|484|0|0|10|

---

# app\api\analytics\auth-session\login

Files : 1

|File|Status|Responsibility|LOC|Interfaces|Classes|Functions|
|---|---|---|---:|---:|---:|---:|
|route.ts|ACTIVE|API Endpoint|282|0|0|1|

---

# app\api\analytics\auth-session\logout

Files : 1

|File|Status|Responsibility|LOC|Interfaces|Classes|Functions|
|---|---|---|---:|---:|---:|---:|
|route.ts|ACTIVE|API Endpoint|223|0|0|1|

---

# app\api\analytics\event

Files : 1

|File|Status|Responsibility|LOC|Interfaces|Classes|Functions|
|---|---|---|---:|---:|---:|---:|
|route.ts|ACTIVE|API Endpoint|362|0|0|1|

---

# app\api\medical-image

Files : 1

|File|Status|Responsibility|LOC|Interfaces|Classes|Functions|
|---|---|---|---:|---:|---:|---:|
|route.ts|ACTIVE|API Endpoint|850|1|0|7|

---

# app\api\medical-voice

Files : 1

|File|Status|Responsibility|LOC|Interfaces|Classes|Functions|
|---|---|---|---:|---:|---:|---:|
|route.ts|ACTIVE|API Endpoint|1086|0|0|9|

---

# app\api\prescription-identity

Files : 1

|File|Status|Responsibility|LOC|Interfaces|Classes|Functions|
|---|---|---|---:|---:|---:|---:|
|route.ts|ACTIVE|API Endpoint|1102|0|0|18|

---

# app\api\prescription-image

Files : 1

|File|Status|Responsibility|LOC|Interfaces|Classes|Functions|
|---|---|---|---:|---:|---:|---:|
|route.ts|ACTIVE|API Endpoint|1112|0|0|19|

---

# app\auth\callback

Files : 1

|File|Status|Responsibility|LOC|Interfaces|Classes|Functions|
|---|---|---|---:|---:|---:|---:|
|route.ts|ACTIVE|API Endpoint|42|0|0|1|

---

# app\care

Files : 1

|File|Status|Responsibility|LOC|Interfaces|Classes|Functions|
|---|---|---|---:|---:|---:|---:|
|page.tsx|ACTIVE|Page|1678|0|0|31|

---

# app\carevr-journey

Files : 1

|File|Status|Responsibility|LOC|Interfaces|Classes|Functions|
|---|---|---|---:|---:|---:|---:|
|page.tsx|ACTIVE|Page|338|0|0|3|

---

# app\checkin

Files : 1

|File|Status|Responsibility|LOC|Interfaces|Classes|Functions|
|---|---|---|---:|---:|---:|---:|
|page.tsx|ACTIVE|Page|491|0|0|10|

---

# app\clinical-review

Files : 13

|File|Status|Responsibility|LOC|Interfaces|Classes|Functions|
|---|---|---|---:|---:|---:|---:|
|AssessmentChangesCard.tsx|EMPTY|General|1|0|0|0|
|ChangeBadge.tsx|EMPTY|General|1|0|0|0|
|ClinicalReviewHeader.tsx|EMPTY|General|1|0|0|0|
|ClinicalSummaryCard.tsx|EMPTY|General|1|0|0|0|
|ComparisonValue.tsx|EMPTY|General|1|0|0|0|
|ComplaintChangesCard.tsx|EMPTY|General|1|0|0|0|
|ConfidenceCard.tsx|EMPTY|General|1|0|0|0|
|EmptyComparison.tsx|EMPTY|General|1|0|0|0|
|FollowUpCard.tsx|EMPTY|General|1|0|0|0|
|InvestigationChangesCard.tsx|EMPTY|General|1|0|0|0|
|MedicineChangesCard.tsx|EMPTY|General|1|0|0|0|
|ReviewFooter.tsx|EMPTY|General|1|0|0|0|
|VitalChangesCard.tsx|EMPTY|General|1|0|0|0|

---

# app\components

Files : 5

|File|Status|Responsibility|LOC|Interfaces|Classes|Functions|
|---|---|---|---:|---:|---:|---:|
|AppBrand.tsx|ACTIVE|General|43|1|0|1|
|AppHeader.tsx|ACTIVE|General|185|1|0|3|
|ReportTable.tsx|ACTIVE|General|87|2|0|7|
|TrendChart.tsx|ACTIVE|General|237|2|0|3|
|TrendLineChart.tsx|ACTIVE|General|221|1|0|3|

---

# app\components\common

Files : 2

|File|Status|Responsibility|LOC|Interfaces|Classes|Functions|
|---|---|---|---:|---:|---:|---:|
|ClinicalSummaryCard.tsx|ACTIVE|General|236|1|0|4|
|ReportNavigation.tsx|ACTIVE|General|89|1|0|1|

---

# app\components\dashboard

Files : 1

|File|Status|Responsibility|LOC|Interfaces|Classes|Functions|
|---|---|---|---:|---:|---:|---:|
|HelpWorkspace.tsx|ACTIVE|General|155|0|0|1|

---

# app\consent

Files : 1

|File|Status|Responsibility|LOC|Interfaces|Classes|Functions|
|---|---|---|---:|---:|---:|---:|
|page.tsx|ACTIVE|Page|749|0|0|12|

---

# app\daily-care

Files : 2

|File|Status|Responsibility|LOC|Interfaces|Classes|Functions|
|---|---|---|---:|---:|---:|---:|
|page.tsx|ACTIVE|Page|373|0|0|6|
|styles.ts|ACTIVE|General|243|0|0|0|

---

# app\daily-care\components

Files : 7

|File|Status|Responsibility|LOC|Interfaces|Classes|Functions|
|---|---|---|---:|---:|---:|---:|
|ActionButtons.tsx|ACTIVE|General|67|1|0|3|
|DailyCareForm.tsx|ACTIVE|General|2631|2|0|56|
|PainLocationCard.tsx|ACTIVE|General|194|1|0|6|
|PatientCard.tsx|ACTIVE|General|146|1|0|8|
|SymptomsCard.tsx|ACTIVE|General|233|1|0|7|
|TemperatureCard.tsx|ACTIVE|General|118|1|0|5|
|VitalsCard.tsx|ACTIVE|General|220|1|0|10|

---

# app\dashboard

Files : 1

|File|Status|Responsibility|LOC|Interfaces|Classes|Functions|
|---|---|---|---:|---:|---:|---:|
|page.tsx|ACTIVE|Page|2078|0|0|24|

---

# app\family

Files : 1

|File|Status|Responsibility|LOC|Interfaces|Classes|Functions|
|---|---|---|---:|---:|---:|---:|
|page.tsx|ACTIVE|Page|577|0|0|14|

---

# app\family\page2

Files : 1

|File|Status|Responsibility|LOC|Interfaces|Classes|Functions|
|---|---|---|---:|---:|---:|---:|
|page.tsx|ACTIVE|Page|220|0|0|13|

---

# app\family\page3

Files : 1

|File|Status|Responsibility|LOC|Interfaces|Classes|Functions|
|---|---|---|---:|---:|---:|---:|
|page.tsx|ACTIVE|Page|481|0|0|15|

---

# app\family\page4

Files : 1

|File|Status|Responsibility|LOC|Interfaces|Classes|Functions|
|---|---|---|---:|---:|---:|---:|
|page.tsx|ACTIVE|Page|365|0|0|16|

---

# app\family\page5

Files : 1

|File|Status|Responsibility|LOC|Interfaces|Classes|Functions|
|---|---|---|---:|---:|---:|---:|
|page.tsx|ACTIVE|Page|680|0|0|24|

---

# app\forgot-password

Files : 1

|File|Status|Responsibility|LOC|Interfaces|Classes|Functions|
|---|---|---|---:|---:|---:|---:|
|page.tsx|ACTIVE|Page|412|0|0|6|

---

# app\help

Files : 2

|File|Status|Responsibility|LOC|Interfaces|Classes|Functions|
|---|---|---|---:|---:|---:|---:|
|layout.tsx|ACTIVE|General|154|0|0|1|
|page.tsx|ACTIVE|Page|262|0|0|2|

---

# app\help\about

Files : 1

|File|Status|Responsibility|LOC|Interfaces|Classes|Functions|
|---|---|---|---:|---:|---:|---:|
|page.tsx|ACTIVE|Page|228|0|0|1|

---

# app\help\assessments

Files : 1

|File|Status|Responsibility|LOC|Interfaces|Classes|Functions|
|---|---|---|---:|---:|---:|---:|
|page.tsx|ACTIVE|Page|207|0|0|1|

---

# app\help\clinical-trends

Files : 1

|File|Status|Responsibility|LOC|Interfaces|Classes|Functions|
|---|---|---|---:|---:|---:|---:|
|page.tsx|ACTIVE|Page|208|0|0|1|

---

# app\help\daily-care

Files : 1

|File|Status|Responsibility|LOC|Interfaces|Classes|Functions|
|---|---|---|---:|---:|---:|---:|
|page.tsx|ACTIVE|Page|194|0|0|1|

---

# app\help\faq

Files : 1

|File|Status|Responsibility|LOC|Interfaces|Classes|Functions|
|---|---|---|---:|---:|---:|---:|
|page.tsx|ACTIVE|Page|215|0|0|1|

---

# app\help\getting-started

Files : 1

|File|Status|Responsibility|LOC|Interfaces|Classes|Functions|
|---|---|---|---:|---:|---:|---:|
|page.tsx|ACTIVE|Page|195|0|0|1|

---

# app\help\medication-management

Files : 1

|File|Status|Responsibility|LOC|Interfaces|Classes|Functions|
|---|---|---|---:|---:|---:|---:|
|page.tsx|ACTIVE|Page|240|0|0|1|

---

# app\help\pdf-reports

Files : 1

|File|Status|Responsibility|LOC|Interfaces|Classes|Functions|
|---|---|---|---:|---:|---:|---:|
|page.tsx|ACTIVE|Page|181|0|0|1|

---

# app\help\privacy

Files : 1

|File|Status|Responsibility|LOC|Interfaces|Classes|Functions|
|---|---|---|---:|---:|---:|---:|
|page.tsx|ACTIVE|Page|191|0|0|1|

---

# app\help\reports

Files : 1

|File|Status|Responsibility|LOC|Interfaces|Classes|Functions|
|---|---|---|---:|---:|---:|---:|
|page.tsx|ACTIVE|Page|184|0|0|1|

---

# app\journey-review

Files : 21

|File|Status|Responsibility|LOC|Interfaces|Classes|Functions|
|---|---|---|---:|---:|---:|---:|
|ActiveTreatmentCard.tsx|ACTIVE|General|311|4|0|6|
|ChangeCard.tsx|ACTIVE|General|130|1|0|1|
|EmptyJourney.tsx|ACTIVE|General|33|1|0|1|
|index.ts|EMPTY|General|1|0|0|0|
|JourneyActions.tsx|ACTIVE|General|178|2|0|8|
|JourneyComplete.tsx|EMPTY|General|1|0|0|0|
|JourneyConfidence.tsx|ACTIVE|General|183|1|0|3|
|JourneyContext.tsx|ACTIVE|Context|400|3|0|7|
|JourneyDetectedChanges.tsx|ACTIVE|General|141|1|0|3|
|JourneyHeader.tsx|ACTIVE|General|189|2|0|6|
|JourneyQuestions.tsx|ACTIVE|General|61|1|0|4|
|JourneyReview.tsx|ACTIVE|General|131|1|0|7|
|JourneySummaryCard.tsx|ACTIVE|General|98|1|0|2|
|JourneyTimeline.tsx|ACTIVE|General|270|3|0|7|
|JourneyWizard.tsx|ACTIVE|General|355|2|0|15|
|LoadingJourney.tsx|ACTIVE|General|31|0|0|2|
|QuestionCard.tsx|ACTIVE|General|107|1|0|3|
|QuestionRenderer.tsx|ACTIVE|General|413|2|0|21|
|SummaryCard.tsx|ACTIVE|General|111|1|0|1|
|TimelinePreview.tsx|ACTIVE|General|181|1|0|5|
|TreatmentDecisionCard.tsx|ACTIVE|General|215|2|0|5|

---

# app\login

Files : 1

|File|Status|Responsibility|LOC|Interfaces|Classes|Functions|
|---|---|---|---:|---:|---:|---:|
|page.tsx|ACTIVE|Page|391|0|0|11|

---

# app\medications

Files : 1

|File|Status|Responsibility|LOC|Interfaces|Classes|Functions|
|---|---|---|---:|---:|---:|---:|
|page.tsx|ACTIVE|Page|489|0|0|6|

---

# app\medications\consultation-mode

Files : 1

|File|Status|Responsibility|LOC|Interfaces|Classes|Functions|
|---|---|---|---:|---:|---:|---:|
|page.tsx|ACTIVE|Page|1710|1|0|18|

---

# app\medications\prescription

Files : 1

|File|Status|Responsibility|LOC|Interfaces|Classes|Functions|
|---|---|---|---:|---:|---:|---:|
|page.tsx|ACTIVE|Page|1715|0|0|18|

---

# app\register

Files : 1

|File|Status|Responsibility|LOC|Interfaces|Classes|Functions|
|---|---|---|---:|---:|---:|---:|
|page.tsx|ACTIVE|Page|520|0|0|11|

---

# app\report

Files : 1

|File|Status|Responsibility|LOC|Interfaces|Classes|Functions|
|---|---|---|---:|---:|---:|---:|
|page.tsx|ACTIVE|Page|1181|0|0|10|

---

# app\reports

Files : 1

|File|Status|Responsibility|LOC|Interfaces|Classes|Functions|
|---|---|---|---:|---:|---:|---:|
|page.tsx|ACTIVE|Page|331|0|0|9|

---

# app\reports\assessment

Files : 1

|File|Status|Responsibility|LOC|Interfaces|Classes|Functions|
|---|---|---|---:|---:|---:|---:|
|page.tsx|ACTIVE|Page|182|0|0|4|

---

# app\reports\assessment\family

Files : 1

|File|Status|Responsibility|LOC|Interfaces|Classes|Functions|
|---|---|---|---:|---:|---:|---:|
|page.tsx|ACTIVE|Page|661|0|0|21|

---

# app\reports\assessment\family\[id]

Files : 1

|File|Status|Responsibility|LOC|Interfaces|Classes|Functions|
|---|---|---|---:|---:|---:|---:|
|page.tsx|ACTIVE|Page|661|0|0|11|

---

# app\reports\assessment\self

Files : 1

|File|Status|Responsibility|LOC|Interfaces|Classes|Functions|
|---|---|---|---:|---:|---:|---:|
|page.tsx|ACTIVE|Page|504|0|0|16|

---

# app\reports\assessment\self\[id]

Files : 1

|File|Status|Responsibility|LOC|Interfaces|Classes|Functions|
|---|---|---|---:|---:|---:|---:|
|page.tsx|ACTIVE|Page|664|0|0|11|

---

# app\reports\daily-care

Files : 1

|File|Status|Responsibility|LOC|Interfaces|Classes|Functions|
|---|---|---|---:|---:|---:|---:|
|page.tsx|ACTIVE|Page|752|0|0|12|

---

# app\reports\daily-care\[id]

Files : 1

|File|Status|Responsibility|LOC|Interfaces|Classes|Functions|
|---|---|---|---:|---:|---:|---:|
|page.tsx|ACTIVE|Page|730|0|0|8|

---

# app\reports\daily-care\select

Files : 1

|File|Status|Responsibility|LOC|Interfaces|Classes|Functions|
|---|---|---|---:|---:|---:|---:|
|page.tsx|ACTIVE|Page|222|0|0|6|

---

# app\reports\daily-care\self

Files : 1

|File|Status|Responsibility|LOC|Interfaces|Classes|Functions|
|---|---|---|---:|---:|---:|---:|
|page.tsx|ACTIVE|Page|563|0|0|6|

---

# app\reports\daily-care\self\[id]

Files : 1

|File|Status|Responsibility|LOC|Interfaces|Classes|Functions|
|---|---|---|---:|---:|---:|---:|
|page.tsx|ACTIVE|Page|693|0|0|7|

---

# app\reports\trends

Files : 2

|File|Status|Responsibility|LOC|Interfaces|Classes|Functions|
|---|---|---|---:|---:|---:|---:|
|page.tsx|ACTIVE|Page|900|0|0|20|
|trendRequest.ts|ACTIVE|General|23|1|0|0|

---

# app\reports\trends\results

Files : 1

|File|Status|Responsibility|LOC|Interfaces|Classes|Functions|
|---|---|---|---:|---:|---:|---:|
|page.tsx|ACTIVE|Page|751|0|0|6|

---

# app\reports\trends\selector

Files : 1

|File|Status|Responsibility|LOC|Interfaces|Classes|Functions|
|---|---|---|---:|---:|---:|---:|
|page.tsx|ACTIVE|Page|175|0|0|4|

---

# app\reports\trends\self

Files : 1

|File|Status|Responsibility|LOC|Interfaces|Classes|Functions|
|---|---|---|---:|---:|---:|---:|
|page.tsx|ACTIVE|Page|818|0|0|16|

---

# app\reports\trends\self\results

Files : 1

|File|Status|Responsibility|LOC|Interfaces|Classes|Functions|
|---|---|---|---:|---:|---:|---:|
|page.tsx|ACTIVE|Page|739|0|0|6|

---

# app\reset-password

Files : 1

|File|Status|Responsibility|LOC|Interfaces|Classes|Functions|
|---|---|---|---:|---:|---:|---:|
|page.tsx|ACTIVE|Page|683|0|0|16|

---

# app\review

Files : 1

|File|Status|Responsibility|LOC|Interfaces|Classes|Functions|
|---|---|---|---:|---:|---:|---:|
|page.tsx|EMPTY|Page|1|0|0|0|

---

# app\self

Files : 1

|File|Status|Responsibility|LOC|Interfaces|Classes|Functions|
|---|---|---|---:|---:|---:|---:|
|page.tsx|ACTIVE|Page|148|0|0|4|

---

# app\self-profile

Files : 1

|File|Status|Responsibility|LOC|Interfaces|Classes|Functions|
|---|---|---|---:|---:|---:|---:|
|page.tsx|ACTIVE|Page|366|0|0|6|

---

# app\self\page2

Files : 1

|File|Status|Responsibility|LOC|Interfaces|Classes|Functions|
|---|---|---|---:|---:|---:|---:|
|page.tsx|ACTIVE|Page|310|0|0|15|

---

# app\self\page3

Files : 1

|File|Status|Responsibility|LOC|Interfaces|Classes|Functions|
|---|---|---|---:|---:|---:|---:|
|page.tsx|ACTIVE|Page|221|0|0|14|

---

# app\self\page4

Files : 1

|File|Status|Responsibility|LOC|Interfaces|Classes|Functions|
|---|---|---|---:|---:|---:|---:|
|page.tsx|ACTIVE|Page|240|0|0|13|

---

# app\self\page5

Files : 1

|File|Status|Responsibility|LOC|Interfaces|Classes|Functions|
|---|---|---|---:|---:|---:|---:|
|page.tsx|ACTIVE|Page|252|0|0|16|

---

# app\welcome

Files : 1

|File|Status|Responsibility|LOC|Interfaces|Classes|Functions|
|---|---|---|---:|---:|---:|---:|
|page.tsx|ACTIVE|Page|153|0|0|4|

---

# lib

Files : 7

|File|Status|Responsibility|LOC|Interfaces|Classes|Functions|
|---|---|---|---:|---:|---:|---:|
|assessmentStorage.ts|ACTIVE|Storage Layer|48|0|0|2|
|database.ts|ACTIVE|General|63|3|0|0|
|medicalFormatter.ts|ACTIVE|General|44|0|0|1|
|reportStorage.ts|ACTIVE|Storage Layer|100|0|0|8|
|selfProfile.ts|MINIMAL|General|15|1|0|0|
|supabase.ts|MINIMAL|General|17|0|0|0|
|supabaseAdmin.ts|ACTIVE|General|33|0|0|0|

---

# lib\analytics

Files : 5

|File|Status|Responsibility|LOC|Interfaces|Classes|Functions|
|---|---|---|---:|---:|---:|---:|
|analyticsEvents.ts|ACTIVE|General|207|0|0|0|
|analyticsIdentity.ts|ACTIVE|General|183|0|0|6|
|analyticsService.ts|ACTIVE|Service|250|0|1|1|
|analyticsTypes.ts|ACTIVE|Domain Types|190|2|0|0|
|authSessionService.ts|ACTIVE|Service|280|1|1|0|

---

# lib\auth

Files : 1

|File|Status|Responsibility|LOC|Interfaces|Classes|Functions|
|---|---|---|---:|---:|---:|---:|
|authService.ts|ACTIVE|Service|298|0|1|1|

---

# lib\builders

Files : 4

|File|Status|Responsibility|LOC|Interfaces|Classes|Functions|
|---|---|---|---:|---:|---:|---:|
|assessmentBuilder.ts|ACTIVE|Builder|73|0|1|0|
|clinicalEventBuilder.ts|ACTIVE|Builder|79|0|1|0|
|SelfTrendBuilder.ts|ACTIVE|Builder|406|0|1|5|
|TrendBuilder.ts|ACTIVE|Builder|406|0|1|5|

---

# lib\clinical-intelligence

Files : 4

|File|Status|Responsibility|LOC|Interfaces|Classes|Functions|
|---|---|---|---:|---:|---:|---:|
|ClarificationEngine.ts|EMPTY|Business Engine|1|0|0|0|
|ClinicalComparisonEngine.ts|ACTIVE|Business Engine|1677|0|1|37|
|comparisonTypes.ts|ACTIVE|Domain Types|465|19|0|0|
|index.ts|EMPTY|General|1|0|0|0|

---

# lib\clinical-summary

Files : 7

|File|Status|Responsibility|LOC|Interfaces|Classes|Functions|
|---|---|---|---:|---:|---:|---:|
|ClinicalSummaryEngine.ts|ACTIVE|Business Engine|319|0|1|20|
|ClinicalSummaryTypes.ts|ACTIVE|Domain Types|70|4|0|0|
|PainAnalyzer.ts|ACTIVE|General|88|0|1|1|
|RecommendationEngine.ts|EMPTY|Business Engine|1|0|0|0|
|SymptomsAnalyzer.ts|ACTIVE|General|200|0|1|1|
|TemperatureAnalyzer.ts|ACTIVE|General|134|0|1|0|
|VitalsAnalyzer.ts|ACTIVE|General|151|0|1|0|

---

# lib\config

Files : 1

|File|Status|Responsibility|LOC|Interfaces|Classes|Functions|
|---|---|---|---:|---:|---:|---:|
|consent.ts|MINIMAL|General|11|0|0|0|

---

# lib\consent\mapper

Files : 1

|File|Status|Responsibility|LOC|Interfaces|Classes|Functions|
|---|---|---|---:|---:|---:|---:|
|consentMapper.ts|ACTIVE|Mapper|131|1|1|0|

---

# lib\consent\models

Files : 1

|File|Status|Responsibility|LOC|Interfaces|Classes|Functions|
|---|---|---|---:|---:|---:|---:|
|Consent.ts|ACTIVE|Model|27|1|0|0|

---

# lib\consent\repository

Files : 1

|File|Status|Responsibility|LOC|Interfaces|Classes|Functions|
|---|---|---|---:|---:|---:|---:|
|consentRepository.ts|ACTIVE|Repository Layer|122|0|1|0|

---

# lib\consent\storage

Files : 1

|File|Status|Responsibility|LOC|Interfaces|Classes|Functions|
|---|---|---|---:|---:|---:|---:|
|consentStorage.ts|ACTIVE|Storage Layer|69|0|1|0|

---

# lib\constants

Files : 1

|File|Status|Responsibility|LOC|Interfaces|Classes|Functions|
|---|---|---|---:|---:|---:|---:|
|consentVersions.ts|MINIMAL|General|15|0|0|0|

---

# lib\core\clinical

Files : 15

|File|Status|Responsibility|LOC|Interfaces|Classes|Functions|
|---|---|---|---:|---:|---:|---:|
|clinicalConstants.ts|MINIMAL|General|17|0|0|0|
|clinicalEnums.ts|MINIMAL|General|17|0|0|0|
|comparison.ts|MINIMAL|General|17|0|0|0|
|confidence.ts|MINIMAL|General|17|0|0|0|
|consultation.ts|MINIMAL|General|17|0|0|0|
|governance.ts|MINIMAL|General|17|0|0|0|
|identifiers.ts|MINIMAL|General|17|0|0|0|
|index.ts|MINIMAL|General|17|0|0|0|
|journeyContext.ts|MINIMAL|Context|17|0|0|0|
|metadata.ts|MINIMAL|General|17|0|0|0|
|patient.ts|MINIMAL|General|17|0|0|0|
|prescription.ts|MINIMAL|General|17|0|0|0|
|reconciliation.ts|MINIMAL|General|17|0|0|0|
|timeline.ts|MINIMAL|General|17|0|0|0|
|treatment.ts|MINIMAL|General|17|0|0|0|

---

# lib\i18n

Files : 3

|File|Status|Responsibility|LOC|Interfaces|Classes|Functions|
|---|---|---|---:|---:|---:|---:|
|config.ts|ACTIVE|General|78|1|0|0|
|index.ts|ACTIVE|General|114|0|0|2|
|types.ts|ACTIVE|Domain Types|23|0|0|0|

---

# lib\i18n\translations

Files : 12

|File|Status|Responsibility|LOC|Interfaces|Classes|Functions|
|---|---|---|---:|---:|---:|---:|
|as.ts|ACTIVE|General|1338|0|0|0|
|bn.ts|ACTIVE|General|1228|0|0|0|
|en.ts|ACTIVE|General|1381|0|0|0|
|gu.ts|ACTIVE|General|1335|0|0|0|
|hi.ts|ACTIVE|General|1224|0|0|0|
|kn.ts|ACTIVE|General|1225|0|0|0|
|ml.ts|ACTIVE|General|1227|0|0|0|
|mr.ts|ACTIVE|General|1228|0|0|0|
|or.ts|ACTIVE|General|1278|0|0|0|
|pa.ts|ACTIVE|General|1338|0|0|0|
|ta.ts|ACTIVE|General|1228|0|0|0|
|te.ts|ACTIVE|General|1228|0|0|0|

---

# lib\journey

Files : 14

|File|Status|Responsibility|LOC|Interfaces|Classes|Functions|
|---|---|---|---:|---:|---:|---:|
|index.ts|ACTIVE|General|26|0|0|0|
|JourneyAnalysisEngine.ts|ACTIVE|Business Engine|195|0|1|0|
|journeyConstants.ts|ACTIVE|General|187|0|0|0|
|journeyMapper.ts|ACTIVE|Mapper|124|0|1|2|
|journeyModels.ts|ACTIVE|Model|331|16|0|0|
|journeyRepository.ts|ACTIVE|Repository Layer|123|0|1|1|
|journeyRules.ts|ACTIVE|General|205|1|0|1|
|journeyStorage.ts|ACTIVE|Storage Layer|169|0|1|0|
|journeyTypes.ts|ACTIVE|Domain Types|157|0|0|0|
|journeyUtils.ts|ACTIVE|General|150|0|1|4|
|journeyValidation.ts|ACTIVE|General|111|0|1|1|
|questionBuilder.ts|ACTIVE|Builder|100|0|1|0|
|summaryBuilder.ts|ACTIVE|Builder|73|0|1|2|
|timelineBuilder.ts|ACTIVE|Builder|96|0|1|0|

---

# lib\journey\activeTreatment

Files : 8

|File|Status|Responsibility|LOC|Interfaces|Classes|Functions|
|---|---|---|---:|---:|---:|---:|
|index.ts|MINIMAL|General|2|0|0|0|
|lifecycleEngine.ts|MINIMAL|Business Engine|4|0|1|0|
|lifecycleMapper.ts|MINIMAL|Mapper|4|0|1|0|
|lifecycleRepository.ts|MINIMAL|Repository Layer|4|0|1|0|
|lifecycleRules.ts|MINIMAL|General|4|0|0|0|
|lifecycleStorage.ts|MINIMAL|Storage Layer|4|0|1|0|
|lifecycleTypes.ts|MINIMAL|Domain Types|4|0|0|0|
|lifecycleValidator.ts|MINIMAL|Validation|4|0|1|0|

---

# lib\journey\activeTreatment\models

Files : 1

|File|Status|Responsibility|LOC|Interfaces|Classes|Functions|
|---|---|---|---:|---:|---:|---:|
|lifecycleModel.ts|MINIMAL|Model|4|1|0|0|

---

# lib\journey\classification

Files : 9

|File|Status|Responsibility|LOC|Interfaces|Classes|Functions|
|---|---|---|---:|---:|---:|---:|
|classificationMapper.ts|MINIMAL|Mapper|4|0|1|0|
|classificationRepository.ts|MINIMAL|Repository Layer|4|0|1|0|
|classificationRules.ts|MINIMAL|General|4|0|0|0|
|classificationStorage.ts|MINIMAL|Storage Layer|4|0|1|0|
|classificationTypes.ts|MINIMAL|Domain Types|4|0|0|0|
|classificationValidator.ts|MINIMAL|Validation|4|0|1|0|
|consultationClassifier.ts|MINIMAL|General|4|0|1|0|
|index.ts|EMPTY|General|1|0|0|0|
|journeyClassificationEngine.ts|MINIMAL|Business Engine|4|0|1|0|

---

# lib\journey\classification\models

Files : 1

|File|Status|Responsibility|LOC|Interfaces|Classes|Functions|
|---|---|---|---:|---:|---:|---:|
|classificationModel.ts|MINIMAL|Model|4|1|0|0|

---

# lib\journey\context

Files : 4

|File|Status|Responsibility|LOC|Interfaces|Classes|Functions|
|---|---|---|---:|---:|---:|---:|
|index.ts|MINIMAL|Context|2|0|0|0|
|journeyContext.ts|ACTIVE|Context|69|1|0|0|
|journeyContextBuilder.ts|MINIMAL|Builder|4|0|1|0|
|journeyContextValidator.ts|MINIMAL|Validation|4|0|1|0|

---

# lib\journey\governance

Files : 7

|File|Status|Responsibility|LOC|Interfaces|Classes|Functions|
|---|---|---|---:|---:|---:|---:|
|governanceEngine.ts|MINIMAL|Business Engine|4|0|1|0|
|governanceRepository.ts|MINIMAL|Repository Layer|4|0|1|0|
|governanceRules.ts|MINIMAL|General|4|0|0|0|
|governanceStorage.ts|MINIMAL|Storage Layer|4|0|1|0|
|governanceTypes.ts|MINIMAL|Domain Types|4|0|0|0|
|governanceValidator.ts|MINIMAL|Validation|4|0|1|0|
|index.ts|MINIMAL|General|2|0|0|0|

---

# lib\journey\governance\models

Files : 1

|File|Status|Responsibility|LOC|Interfaces|Classes|Functions|
|---|---|---|---:|---:|---:|---:|
|governanceModel.ts|MINIMAL|Model|4|1|0|0|

---

# lib\journey\scenarios

Files : 7

|File|Status|Responsibility|LOC|Interfaces|Classes|Functions|
|---|---|---|---:|---:|---:|---:|
|index.ts|MINIMAL|General|2|0|0|0|
|scenarioEngine.ts|MINIMAL|Business Engine|4|0|1|0|
|scenarioRegistry.ts|MINIMAL|General|4|0|1|0|
|scenarioResolver.ts|MINIMAL|General|4|0|1|0|
|scenarioRules.ts|MINIMAL|General|4|0|0|0|
|scenarioTypes.ts|MINIMAL|Domain Types|4|0|0|0|
|scenarioValidator.ts|MINIMAL|Validation|4|0|1|0|

---

# lib\journey\scenarios\models

Files : 1

|File|Status|Responsibility|LOC|Interfaces|Classes|Functions|
|---|---|---|---:|---:|---:|---:|
|scenarioModel.ts|MINIMAL|Model|4|1|0|0|

---

# lib\journey\timeline

Files : 8

|File|Status|Responsibility|LOC|Interfaces|Classes|Functions|
|---|---|---|---:|---:|---:|---:|
|index.ts|MINIMAL|General|2|0|0|0|
|timelineEventBuilder.ts|MINIMAL|Builder|4|0|1|0|
|timelineEventGenerator.ts|MINIMAL|General|2|0|0|0|
|timelineEventRepository.ts|MINIMAL|Repository Layer|4|0|1|0|
|timelineEventRules.ts|MINIMAL|General|4|0|0|0|
|timelineEventStorage.ts|MINIMAL|Storage Layer|4|0|1|0|
|timelineEventTypes.ts|MINIMAL|Domain Types|4|0|0|0|
|timelineEventValidator.ts|MINIMAL|Validation|4|0|1|0|

---

# lib\journey\timeline\models

Files : 1

|File|Status|Responsibility|LOC|Interfaces|Classes|Functions|
|---|---|---|---:|---:|---:|---:|
|timelineEventModel.ts|MINIMAL|Model|4|1|0|0|

---

# lib\journey\treatment

Files : 8

|File|Status|Responsibility|LOC|Interfaces|Classes|Functions|
|---|---|---|---:|---:|---:|---:|
|index.ts|MINIMAL|General|2|0|0|0|
|treatmentDecisionEngine.ts|MINIMAL|Business Engine|4|0|1|0|
|treatmentDecisionMapper.ts|MINIMAL|Mapper|4|0|1|0|
|treatmentDecisionRepository.ts|MINIMAL|Repository Layer|4|0|1|0|
|treatmentDecisionRules.ts|MINIMAL|General|4|0|0|0|
|treatmentDecisionStorage.ts|MINIMAL|Storage Layer|4|0|1|0|
|treatmentDecisionTypes.ts|MINIMAL|Domain Types|4|0|0|0|
|treatmentDecisionValidator.ts|MINIMAL|Validation|4|0|1|0|

---

# lib\journey\treatment\models

Files : 1

|File|Status|Responsibility|LOC|Interfaces|Classes|Functions|
|---|---|---|---:|---:|---:|---:|
|treatmentDecisionModel.ts|MINIMAL|Model|4|1|0|0|

---

# lib\mappers

Files : 6

|File|Status|Responsibility|LOC|Interfaces|Classes|Functions|
|---|---|---|---:|---:|---:|---:|
|assessmentMapper.ts|ACTIVE|Mapper|126|1|1|1|
|clinicalEventMapper.ts|ACTIVE|Mapper|76|0|1|0|
|DailyCareMapper.ts|ACTIVE|Mapper|157|1|1|0|
|PatientMapper.ts|ACTIVE|Mapper|54|0|1|0|
|SelfDailyCareMapper.ts|ACTIVE|Mapper|171|1|1|0|
|SelfProfileMapper.ts|ACTIVE|Mapper|54|0|1|0|

---

# lib\medical-image

Files : 3

|File|Status|Responsibility|LOC|Interfaces|Classes|Functions|
|---|---|---|---:|---:|---:|---:|
|medicalImageParser.ts|ACTIVE|General|214|0|0|5|
|medicalImageService.ts|ACTIVE|Service|102|0|0|0|
|medicalImageTypes.ts|ACTIVE|Domain Types|41|2|0|0|

---

# lib\medical-voice

Files : 2

|File|Status|Responsibility|LOC|Interfaces|Classes|Functions|
|---|---|---|---:|---:|---:|---:|
|medicalVoiceService.ts|ACTIVE|Service|233|0|0|0|
|medicalVoiceTypes.ts|ACTIVE|Domain Types|103|2|0|0|

---

# lib\pdf

Files : 5

|File|Status|Responsibility|LOC|Interfaces|Classes|Functions|
|---|---|---|---:|---:|---:|---:|
|DailyCarePdfGenerator.ts|ACTIVE|General|782|0|1|7|
|PdfFormatter.ts|MINIMAL|General|8|0|1|0|
|PdfModels.ts|ACTIVE|Model|26|1|0|0|
|PdfStyles.ts|EMPTY|General|1|0|0|0|
|trendReportPdf.ts|ACTIVE|General|23|0|1|0|

---

# lib\performance

Files : 3

|File|Status|Responsibility|LOC|Interfaces|Classes|Functions|
|---|---|---|---:|---:|---:|---:|
|performanceStorage.ts|ACTIVE|Storage Layer|365|0|0|19|
|performanceTracker.ts|ACTIVE|General|447|0|0|7|
|performanceTypes.ts|ACTIVE|Domain Types|94|2|0|0|

---

# lib\prescription

Files : 6

|File|Status|Responsibility|LOC|Interfaces|Classes|Functions|
|---|---|---|---:|---:|---:|---:|
|prescriptionMapper.ts|ACTIVE|Mapper|371|1|0|13|
|prescriptionRepository.ts|ACTIVE|Repository Layer|1642|5|0|25|
|prescriptionReviewMapper.ts|ACTIVE|Mapper|237|0|0|10|
|prescriptionStorage.ts|ACTIVE|Storage Layer|288|1|0|2|
|prescriptionTypes.ts|ACTIVE|Domain Types|325|12|0|0|
|prescriptionValidator.ts|ACTIVE|Validation|224|1|0|1|

---

# lib\prescription-ai

Files : 6

|File|Status|Responsibility|LOC|Interfaces|Classes|Functions|
|---|---|---|---:|---:|---:|---:|
|extractionInstructions.ts|ACTIVE|General|1338|0|0|1|
|identityExtractionInstructions.ts|ACTIVE|General|31|0|0|0|
|prescriptionExamples.ts|ACTIVE|General|86|1|0|0|
|prescriptionKnowledge.ts|ACTIVE|General|347|0|0|0|
|prescriptionReadingRules.ts|ACTIVE|General|388|0|0|0|
|prescriptionRecognitionRules.ts|ACTIVE|General|155|0|0|0|

---

# lib\prescription-ai\classification

Files : 1

|File|Status|Responsibility|LOC|Interfaces|Classes|Functions|
|---|---|---|---:|---:|---:|---:|
|clinicalRouter.ts|ACTIVE|API Endpoint|374|4|0|18|

---

# lib\prescription-ai\consultation

Files : 9

|File|Status|Responsibility|LOC|Interfaces|Classes|Functions|
|---|---|---|---:|---:|---:|---:|
|assessmentRules.ts|ACTIVE|General|117|0|0|0|
|complaintsRules.ts|ACTIVE|General|293|0|0|0|
|consultationPromptBuilder.ts|ACTIVE|Builder|33|0|0|1|
|consultationTypes.ts|EMPTY|Domain Types|1|0|0|0|
|doctorInstructionRules.ts|ACTIVE|General|188|0|0|0|
|examinationRules.ts|ACTIVE|General|232|0|0|0|
|historyRules.ts|ACTIVE|General|159|0|0|0|
|investigationRules.ts|ACTIVE|General|165|0|0|0|
|vitalsRules.ts|ACTIVE|General|267|0|0|0|

---

# lib\prescription-ai\examples

Files : 7

|File|Status|Responsibility|LOC|Interfaces|Classes|Functions|
|---|---|---|---:|---:|---:|---:|
|cardiologyExamples.ts|MINIMAL|General|3|0|0|0|
|consultationExamples.ts|ACTIVE|General|225|0|0|0|
|diabetesExamples.ts|MINIMAL|General|3|0|0|0|
|generalMedicineExamples.ts|ACTIVE|General|116|0|0|0|
|index.ts|ACTIVE|General|22|0|0|0|
|oncologyExamples.ts|ACTIVE|General|61|0|0|0|
|pulmonologyExamples.ts|MINIMAL|General|3|0|0|0|

---

# lib\prescription-ai\medicines

Files : 5

|File|Status|Responsibility|LOC|Interfaces|Classes|Functions|
|---|---|---|---:|---:|---:|---:|
|dosageRules.ts|EMPTY|General|1|0|0|0|
|durationRules.ts|EMPTY|General|1|0|0|0|
|frequencyRules.ts|EMPTY|General|1|0|0|0|
|medicineAssociationRules.ts|EMPTY|General|1|0|0|0|
|timingRules.ts|EMPTY|General|1|0|0|0|

---

# lib\prescription-ai\models

Files : 1

|File|Status|Responsibility|LOC|Interfaces|Classes|Functions|
|---|---|---|---:|---:|---:|---:|
|consultationModel.ts|ACTIVE|Model|95|11|0|0|

---

# lib\prescription-image

Files : 2

|File|Status|Responsibility|LOC|Interfaces|Classes|Functions|
|---|---|---|---:|---:|---:|---:|
|prescriptionImageService.ts|ACTIVE|Service|187|0|0|0|
|prescriptionImageTypes.ts|ACTIVE|Domain Types|186|7|0|0|

---

# lib\repositories

Files : 10

|File|Status|Responsibility|LOC|Interfaces|Classes|Functions|
|---|---|---|---:|---:|---:|---:|
|assessmentRepository.ts|ACTIVE|Repository Layer|247|0|1|0|
|BaseRepository.ts|ACTIVE|Repository Layer|43|0|1|0|
|clinicalEventRepository.ts|ACTIVE|Repository Layer|91|0|1|1|
|DailyCareRepository.ts|ACTIVE|Repository Layer|179|0|1|2|
|patientRepository.ts|ACTIVE|Repository Layer|238|1|1|0|
|profileRepository.ts|ACTIVE|Repository Layer|76|0|1|0|
|SelfDailyCareRepository.ts|ACTIVE|Repository Layer|145|0|1|1|
|SelfProfileRepository.ts|ACTIVE|Repository Layer|129|0|1|0|
|SelfTrendRepository.ts|ACTIVE|Repository Layer|134|0|1|2|
|TrendRepository.ts|ACTIVE|Repository Layer|133|0|1|2|

---

# lib\storage

Files : 11

|File|Status|Responsibility|LOC|Interfaces|Classes|Functions|
|---|---|---|---:|---:|---:|---:|
|assessmentDraftStorage.ts|ACTIVE|Storage Layer|68|0|1|0|
|assessmentStorage.ts|ACTIVE|Storage Layer|381|0|1|0|
|clinicalEventStorage.ts|ACTIVE|Storage Layer|46|0|1|0|
|DailyCareStorage.ts|ACTIVE|Storage Layer|319|0|1|0|
|patientStorage.ts|ACTIVE|Storage Layer|293|0|2|0|
|SelfDailyCareStorage.ts|ACTIVE|Storage Layer|238|0|1|0|
|SelfProfileStorage.ts|ACTIVE|Storage Layer|185|0|1|0|
|selfTrendStorage.ts|ACTIVE|Storage Layer|71|0|1|0|
|storageResult.ts|ACTIVE|Storage Layer|56|0|2|0|
|trendDraftStorage.ts|ACTIVE|Storage Layer|87|0|1|0|
|TrendStorage.ts|ACTIVE|Storage Layer|68|0|1|0|

---

# lib\supabase

Files : 1

|File|Status|Responsibility|LOC|Interfaces|Classes|Functions|
|---|---|---|---:|---:|---:|---:|
|server.ts|ACTIVE|General|52|0|0|1|

---

# lib\treatment

Files : 9

|File|Status|Responsibility|LOC|Interfaces|Classes|Functions|
|---|---|---|---:|---:|---:|---:|
|index.ts|EMPTY|General|1|0|0|0|
|treatmentMapper.ts|ACTIVE|Mapper|311|0|0|15|
|treatmentModels.ts|ACTIVE|Model|750|25|0|0|
|treatmentRepository.ts|ACTIVE|Repository Layer|288|1|1|16|
|treatmentRules.ts|ACTIVE|General|1706|4|0|38|
|TreatmentService.ts|EMPTY|Service|1|0|0|0|
|treatmentStorage.ts|ACTIVE|Storage Layer|164|0|1|0|
|treatmentTypes.ts|ACTIVE|Domain Types|765|4|0|0|
|treatmentValidation.ts|ACTIVE|General|883|2|0|21|

---

# lib\trends

Files : 8

|File|Status|Responsibility|LOC|Interfaces|Classes|Functions|
|---|---|---|---:|---:|---:|---:|
|selfTrendPdfGenerator.ts|ACTIVE|General|714|0|1|1|
|trendChartConfig.ts|ACTIVE|General|66|1|0|0|
|trendClinicalAnalyzer.ts|ACTIVE|General|32|0|1|0|
|trendPdfGenerator.ts|ACTIVE|General|714|0|1|1|
|trendReport.ts|ACTIVE|General|36|1|0|0|
|trendReportBuilder.ts|ACTIVE|Builder|107|0|1|2|
|trendRequest.ts|ACTIVE|General|54|2|0|0|
|trendResult.ts|ACTIVE|General|139|7|0|0|

---

# lib\types

Files : 10

|File|Status|Responsibility|LOC|Interfaces|Classes|Functions|
|---|---|---|---:|---:|---:|---:|
|assessment.ts|ACTIVE|Domain Types|95|5|0|0|
|assessmentDraft.ts|ACTIVE|Domain Types|49|1|0|0|
|assessmentScore.ts|ACTIVE|Domain Types|36|1|0|0|
|clinicalEvent.ts|ACTIVE|Domain Types|48|2|0|0|
|dailyCare.ts|ACTIVE|Domain Types|150|3|0|0|
|patient.ts|MINIMAL|Domain Types|16|1|0|0|
|profile.ts|MINIMAL|Domain Types|13|1|0|0|
|report.ts|MINIMAL|Domain Types|10|1|0|0|
|result.ts|ACTIVE|Domain Types|28|1|0|0|
|selfDailyCare.ts|ACTIVE|Domain Types|153|3|0|0|

---

# lib\utils

Files : 3

|File|Status|Responsibility|LOC|Interfaces|Classes|Functions|
|---|---|---|---:|---:|---:|---:|
|appAlert.ts|ACTIVE|General|21|0|0|0|
|dateUtils.ts|ACTIVE|General|45|0|0|1|
|displayFormatter.ts|ACTIVE|General|143|0|0|4|

---

# lib\utils\pdf

Files : 1

|File|Status|Responsibility|LOC|Interfaces|Classes|Functions|
|---|---|---|---:|---:|---:|---:|
|assessmentPdf.ts|ACTIVE|General|115|0|0|1|

---

# lib\validators

Files : 1

|File|Status|Responsibility|LOC|Interfaces|Classes|Functions|
|---|---|---|---:|---:|---:|---:|
|patientValidator.ts|ACTIVE|Validation|98|0|2|0|

---

# scripts

Files : 6

|File|Status|Responsibility|LOC|Interfaces|Classes|Functions|
|---|---|---|---:|---:|---:|---:|
|analyzeArchitecture.ts|EMPTY|General|1|0|0|0|
|auditArchitecture.ts|ACTIVE|General|321|1|0|14|
|benchmarkComparator.ts|EMPTY|General|1|0|0|0|
|discoverProject.ts|ACTIVE|General|224|3|2|13|
|scaffoldClinicalCore.ts|ACTIVE|General|146|0|0|3|
|scaffoldMedicationManagement.ts|ACTIVE|General|217|2|9|3|

---

# Empty Files

- app\clinical-review\AssessmentChangesCard.tsx
- app\clinical-review\ChangeBadge.tsx
- app\clinical-review\ClinicalReviewHeader.tsx
- app\clinical-review\ClinicalSummaryCard.tsx
- app\clinical-review\ComparisonValue.tsx
- app\clinical-review\ComplaintChangesCard.tsx
- app\clinical-review\ConfidenceCard.tsx
- app\clinical-review\EmptyComparison.tsx
- app\clinical-review\FollowUpCard.tsx
- app\clinical-review\InvestigationChangesCard.tsx
- app\clinical-review\MedicineChangesCard.tsx
- app\clinical-review\ReviewFooter.tsx
- app\clinical-review\VitalChangesCard.tsx
- app\journey-review\index.ts
- app\journey-review\JourneyComplete.tsx
- app\review\page.tsx
- Components\common\ResponsiveTable.tsx
- Components\dashboard\PrescriptionDetailsPanel.tsx
- lib\clinical-intelligence\ClarificationEngine.ts
- lib\clinical-intelligence\index.ts
- lib\clinical-summary\RecommendationEngine.ts
- lib\journey\classification\index.ts
- lib\pdf\PdfStyles.ts
- lib\prescription-ai\consultation\consultationTypes.ts
- lib\prescription-ai\medicines\dosageRules.ts
- lib\prescription-ai\medicines\durationRules.ts
- lib\prescription-ai\medicines\frequencyRules.ts
- lib\prescription-ai\medicines\medicineAssociationRules.ts
- lib\prescription-ai\medicines\timingRules.ts
- lib\treatment\index.ts
- lib\treatment\TreatmentService.ts
- scripts\analyzeArchitecture.ts
- scripts\benchmarkComparator.ts

---

# Files Larger Than 1000 LOC

- app\daily-care\components\DailyCareForm.tsx (2631 LOC)
- app\dashboard\page.tsx (2078 LOC)
- app\medications\prescription\page.tsx (1715 LOC)
- app\medications\consultation-mode\page.tsx (1710 LOC)
- lib\treatment\treatmentRules.ts (1706 LOC)
- app\care\page.tsx (1678 LOC)
- lib\clinical-intelligence\ClinicalComparisonEngine.ts (1677 LOC)
- lib\prescription\prescriptionRepository.ts (1642 LOC)
- Components\dashboard\UploadCareWorkspace.tsx (1636 LOC)
- Components\dashboard\ManualCareWorkspace.tsx (1594 LOC)
- lib\i18n\translations\en.ts (1381 LOC)
- Components\dashboard\PrescriptionHistoryWorkspace.tsx (1377 LOC)
- lib\i18n\translations\as.ts (1338 LOC)
- lib\i18n\translations\pa.ts (1338 LOC)
- lib\prescription-ai\extractionInstructions.ts (1338 LOC)
- lib\i18n\translations\gu.ts (1335 LOC)
- lib\i18n\translations\or.ts (1278 LOC)
- Components\dashboard\VoiceCareWorkspace.tsx (1250 LOC)
- lib\i18n\translations\bn.ts (1228 LOC)
- lib\i18n\translations\mr.ts (1228 LOC)
- lib\i18n\translations\ta.ts (1228 LOC)
- lib\i18n\translations\te.ts (1228 LOC)
- lib\i18n\translations\ml.ts (1227 LOC)
- lib\i18n\translations\kn.ts (1225 LOC)
- lib\i18n\translations\hi.ts (1224 LOC)
- Components\dashboard\PrescriptionWorkspace.tsx (1195 LOC)
- app\report\page.tsx (1181 LOC)
- app\api\prescription-image\route.ts (1112 LOC)
- app\api\prescription-identity\route.ts (1102 LOC)
- app\api\medical-voice\route.ts (1086 LOC)

---

# TODO / FIXME

- app\api\prescription-identity\route.ts (TODO:2, FIXME:0)
- app\api\prescription-image\route.ts (TODO:2, FIXME:0)
- app\dashboard\page.tsx (TODO:1, FIXME:0)
- app\medications\page.tsx (TODO:1, FIXME:0)
- Components\dashboard\ActionOptions.tsx (TODO:1, FIXME:0)
- lib\consent\mapper\consentMapper.ts (TODO:1, FIXME:0)
- lib\consent\repository\consentRepository.ts (TODO:2, FIXME:0)
- lib\core\clinical\clinicalConstants.ts (TODO:1, FIXME:0)
- lib\core\clinical\clinicalEnums.ts (TODO:1, FIXME:0)
- lib\core\clinical\comparison.ts (TODO:1, FIXME:0)
- lib\core\clinical\confidence.ts (TODO:1, FIXME:0)
- lib\core\clinical\consultation.ts (TODO:1, FIXME:0)
- lib\core\clinical\governance.ts (TODO:1, FIXME:0)
- lib\core\clinical\identifiers.ts (TODO:1, FIXME:0)
- lib\core\clinical\journeyContext.ts (TODO:1, FIXME:0)
- lib\core\clinical\metadata.ts (TODO:1, FIXME:0)
- lib\core\clinical\patient.ts (TODO:1, FIXME:0)
- lib\core\clinical\prescription.ts (TODO:1, FIXME:0)
- lib\core\clinical\reconciliation.ts (TODO:1, FIXME:0)
- lib\core\clinical\timeline.ts (TODO:1, FIXME:0)
- lib\core\clinical\treatment.ts (TODO:1, FIXME:0)
- lib\i18n\translations\as.ts (TODO:2, FIXME:0)
- lib\i18n\translations\bn.ts (TODO:2, FIXME:0)
- lib\i18n\translations\en.ts (TODO:2, FIXME:0)
- lib\i18n\translations\gu.ts (TODO:2, FIXME:0)
- lib\i18n\translations\hi.ts (TODO:2, FIXME:0)
- lib\i18n\translations\kn.ts (TODO:2, FIXME:0)
- lib\i18n\translations\ml.ts (TODO:2, FIXME:0)
- lib\i18n\translations\mr.ts (TODO:2, FIXME:0)
- lib\i18n\translations\or.ts (TODO:2, FIXME:0)
- lib\i18n\translations\pa.ts (TODO:2, FIXME:0)
- lib\i18n\translations\ta.ts (TODO:2, FIXME:0)
- lib\i18n\translations\te.ts (TODO:2, FIXME:0)
- lib\journey\activeTreatment\index.ts (TODO:1, FIXME:0)
- lib\journey\activeTreatment\lifecycleEngine.ts (TODO:1, FIXME:0)
- lib\journey\activeTreatment\lifecycleMapper.ts (TODO:1, FIXME:0)
- lib\journey\activeTreatment\lifecycleRepository.ts (TODO:1, FIXME:0)
- lib\journey\activeTreatment\lifecycleRules.ts (TODO:1, FIXME:0)
- lib\journey\activeTreatment\lifecycleStorage.ts (TODO:1, FIXME:0)
- lib\journey\activeTreatment\lifecycleTypes.ts (TODO:1, FIXME:0)
- lib\journey\activeTreatment\lifecycleValidator.ts (TODO:1, FIXME:0)
- lib\journey\activeTreatment\models\lifecycleModel.ts (TODO:1, FIXME:0)
- lib\journey\classification\classificationMapper.ts (TODO:1, FIXME:0)
- lib\journey\classification\classificationRepository.ts (TODO:1, FIXME:0)
- lib\journey\classification\classificationRules.ts (TODO:1, FIXME:0)
- lib\journey\classification\classificationStorage.ts (TODO:1, FIXME:0)
- lib\journey\classification\classificationTypes.ts (TODO:1, FIXME:0)
- lib\journey\classification\classificationValidator.ts (TODO:1, FIXME:0)
- lib\journey\classification\consultationClassifier.ts (TODO:1, FIXME:0)
- lib\journey\classification\journeyClassificationEngine.ts (TODO:1, FIXME:0)
- lib\journey\classification\models\classificationModel.ts (TODO:1, FIXME:0)
- lib\journey\context\index.ts (TODO:1, FIXME:0)
- lib\journey\context\journeyContextBuilder.ts (TODO:1, FIXME:0)
- lib\journey\context\journeyContextValidator.ts (TODO:1, FIXME:0)
- lib\journey\governance\governanceEngine.ts (TODO:1, FIXME:0)
- lib\journey\governance\governanceRepository.ts (TODO:1, FIXME:0)
- lib\journey\governance\governanceRules.ts (TODO:1, FIXME:0)
- lib\journey\governance\governanceStorage.ts (TODO:1, FIXME:0)
- lib\journey\governance\governanceTypes.ts (TODO:1, FIXME:0)
- lib\journey\governance\governanceValidator.ts (TODO:1, FIXME:0)
- lib\journey\governance\index.ts (TODO:1, FIXME:0)
- lib\journey\governance\models\governanceModel.ts (TODO:1, FIXME:0)
- lib\journey\scenarios\index.ts (TODO:1, FIXME:0)
- lib\journey\scenarios\models\scenarioModel.ts (TODO:1, FIXME:0)
- lib\journey\scenarios\scenarioEngine.ts (TODO:1, FIXME:0)
- lib\journey\scenarios\scenarioRegistry.ts (TODO:1, FIXME:0)
- lib\journey\scenarios\scenarioResolver.ts (TODO:1, FIXME:0)
- lib\journey\scenarios\scenarioRules.ts (TODO:1, FIXME:0)
- lib\journey\scenarios\scenarioTypes.ts (TODO:1, FIXME:0)
- lib\journey\scenarios\scenarioValidator.ts (TODO:1, FIXME:0)
- lib\journey\timeline\index.ts (TODO:1, FIXME:0)
- lib\journey\timeline\models\timelineEventModel.ts (TODO:1, FIXME:0)
- lib\journey\timeline\timelineEventBuilder.ts (TODO:1, FIXME:0)
- lib\journey\timeline\timelineEventGenerator.ts (TODO:1, FIXME:0)
- lib\journey\timeline\timelineEventRepository.ts (TODO:1, FIXME:0)
- lib\journey\timeline\timelineEventRules.ts (TODO:1, FIXME:0)
- lib\journey\timeline\timelineEventStorage.ts (TODO:1, FIXME:0)
- lib\journey\timeline\timelineEventTypes.ts (TODO:1, FIXME:0)
- lib\journey\timeline\timelineEventValidator.ts (TODO:1, FIXME:0)
- lib\journey\treatment\index.ts (TODO:1, FIXME:0)
- lib\journey\treatment\models\treatmentDecisionModel.ts (TODO:1, FIXME:0)
- lib\journey\treatment\treatmentDecisionEngine.ts (TODO:1, FIXME:0)
- lib\journey\treatment\treatmentDecisionMapper.ts (TODO:1, FIXME:0)
- lib\journey\treatment\treatmentDecisionRepository.ts (TODO:1, FIXME:0)
- lib\journey\treatment\treatmentDecisionRules.ts (TODO:1, FIXME:0)
- lib\journey\treatment\treatmentDecisionStorage.ts (TODO:1, FIXME:0)
- lib\journey\treatment\treatmentDecisionTypes.ts (TODO:1, FIXME:0)
- lib\journey\treatment\treatmentDecisionValidator.ts (TODO:1, FIXME:0)
- lib\mappers\assessmentMapper.ts (TODO:3, FIXME:0)
- lib\mappers\clinicalEventMapper.ts (TODO:1, FIXME:0)
- lib\mappers\DailyCareMapper.ts (TODO:1, FIXME:0)
- lib\mappers\SelfDailyCareMapper.ts (TODO:1, FIXME:0)
- lib\repositories\assessmentRepository.ts (TODO:5, FIXME:0)
- lib\repositories\clinicalEventRepository.ts (TODO:2, FIXME:0)
- lib\repositories\DailyCareRepository.ts (TODO:4, FIXME:0)
- lib\repositories\SelfDailyCareRepository.ts (TODO:3, FIXME:0)
- scripts\auditArchitecture.ts (TODO:8, FIXME:8)
- scripts\scaffoldClinicalCore.ts (TODO:1, FIXME:0)
- scripts\scaffoldMedicationManagement.ts (TODO:15, FIXME:0)
