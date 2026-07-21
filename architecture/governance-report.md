# CareVR Architecture Governance Report

Generated : 18/7/2026, 4:19:49 pm

## Executive Summary

| Metric | Value |
|---|---:|
|Folders|140|
|Files|417|
|Duplicate Symbols|388|
|Architecture Violations|0|

## Folder Governance

| Folder | Files | LOC | Status | Recommendation |
| --- | --- | --- | --- | --- |
| app | 2 | 50 | DEFER | Review Later |
| app\add-patient | 1 | 546 | ACTIVE | Continue Development |
| app\admin\performance | 1 | 484 | ACTIVE | Continue Development |
| app\api\analytics\auth-session\login | 1 | 282 | ACTIVE | Continue Development |
| app\api\analytics\auth-session\logout | 1 | 223 | ACTIVE | Continue Development |
| app\api\analytics\event | 1 | 362 | ACTIVE | Continue Development |
| app\api\medical-image | 1 | 850 | ACTIVE | Continue Development |
| app\api\medical-voice | 1 | 1086 | ACTIVE | Continue Development |
| app\api\prescription-identity | 1 | 1102 | ACTIVE | Continue Development |
| app\api\prescription-image | 1 | 1112 | ACTIVE | Continue Development |
| app\auth\callback | 1 | 42 | DEFER | Review Later |
| app\care | 1 | 1678 | ACTIVE | Continue Development |
| app\carevr-journey | 1 | 338 | ACTIVE | Continue Development |
| app\checkin | 1 | 491 | ACTIVE | Continue Development |
| app\clinical-review | 13 | 0 | REVIEW | Cleanup |
| app\components | 5 | 773 | ACTIVE | Continue Development |
| app\components\common | 2 | 325 | ACTIVE | Continue Development |
| app\components\dashboard | 1 | 155 | ACTIVE | Continue Development |
| app\consent | 1 | 749 | ACTIVE | Continue Development |
| app\daily-care | 2 | 616 | ACTIVE | Continue Development |
| app\daily-care\components | 7 | 3609 | ACTIVE | Continue Development |
| app\dashboard | 1 | 2078 | ACTIVE | Continue Development |
| app\family | 1 | 577 | ACTIVE | Continue Development |
| app\family\page2 | 1 | 220 | ACTIVE | Continue Development |
| app\family\page3 | 1 | 481 | ACTIVE | Continue Development |
| app\family\page4 | 1 | 365 | ACTIVE | Continue Development |
| app\family\page5 | 1 | 680 | ACTIVE | Continue Development |
| app\forgot-password | 1 | 412 | ACTIVE | Continue Development |
| app\help | 2 | 416 | ACTIVE | Continue Development |
| app\help\about | 1 | 228 | ACTIVE | Continue Development |
| app\help\assessments | 1 | 207 | ACTIVE | Continue Development |
| app\help\clinical-trends | 1 | 208 | ACTIVE | Continue Development |
| app\help\daily-care | 1 | 194 | ACTIVE | Continue Development |
| app\help\faq | 1 | 215 | ACTIVE | Continue Development |
| app\help\getting-started | 1 | 195 | ACTIVE | Continue Development |
| app\help\medication-management | 1 | 240 | ACTIVE | Continue Development |
| app\help\pdf-reports | 1 | 181 | ACTIVE | Continue Development |
| app\help\privacy | 1 | 191 | ACTIVE | Continue Development |
| app\help\reports | 1 | 184 | ACTIVE | Continue Development |
| app\journey-review | 21 | 3538 | ACTIVE | Continue Development |
| app\login | 1 | 391 | ACTIVE | Continue Development |
| app\medications | 1 | 489 | ACTIVE | Continue Development |
| app\medications\consultation-mode | 1 | 1710 | ACTIVE | Continue Development |
| app\medications\prescription | 1 | 1715 | ACTIVE | Continue Development |
| app\register | 1 | 520 | ACTIVE | Continue Development |
| app\report | 1 | 1181 | ACTIVE | Continue Development |
| app\reports | 1 | 331 | ACTIVE | Continue Development |
| app\reports\assessment | 1 | 182 | ACTIVE | Continue Development |
| app\reports\assessment\family | 1 | 661 | ACTIVE | Continue Development |
| app\reports\assessment\family\[id] | 1 | 661 | ACTIVE | Continue Development |
| app\reports\assessment\self | 1 | 504 | ACTIVE | Continue Development |
| app\reports\assessment\self\[id] | 1 | 664 | ACTIVE | Continue Development |
| app\reports\daily-care | 1 | 752 | ACTIVE | Continue Development |
| app\reports\daily-care\[id] | 1 | 730 | ACTIVE | Continue Development |
| app\reports\daily-care\select | 1 | 222 | ACTIVE | Continue Development |
| app\reports\daily-care\self | 1 | 563 | ACTIVE | Continue Development |
| app\reports\daily-care\self\[id] | 1 | 693 | ACTIVE | Continue Development |
| app\reports\trends | 2 | 923 | ACTIVE | Continue Development |
| app\reports\trends\results | 1 | 751 | ACTIVE | Continue Development |
| app\reports\trends\selector | 1 | 175 | ACTIVE | Continue Development |
| app\reports\trends\self | 1 | 818 | ACTIVE | Continue Development |
| app\reports\trends\self\results | 1 | 739 | ACTIVE | Continue Development |
| app\reset-password | 1 | 683 | ACTIVE | Continue Development |
| app\review | 1 | 0 | DEFER | Review Later |
| app\self | 1 | 148 | DEFER | Review Later |
| app\self-profile | 1 | 366 | ACTIVE | Continue Development |
| app\self\page2 | 1 | 310 | ACTIVE | Continue Development |
| app\self\page3 | 1 | 221 | ACTIVE | Continue Development |
| app\self\page4 | 1 | 240 | ACTIVE | Continue Development |
| app\self\page5 | 1 | 252 | ACTIVE | Continue Development |
| app\welcome | 1 | 153 | ACTIVE | Continue Development |
| components | 2 | 180 | ACTIVE | Continue Development |
| Components | 2 | 180 | ACTIVE | Continue Development |
| components\common | 1 | 0 | DEFER | Review Later |
| Components\common | 1 | 0 | DEFER | Review Later |
| components\daily-care | 1 | 557 | ACTIVE | Continue Development |
| Components\daily-care | 1 | 557 | ACTIVE | Continue Development |
| components\dashboard | 10 | 9112 | ACTIVE | Continue Development |
| Components\dashboard | 10 | 9112 | ACTIVE | Continue Development |
| components\dashboard\prescription | 1 | 133 | DEFER | Review Later |
| Components\dashboard\prescription | 1 | 133 | DEFER | Review Later |
| components\dashboard\prescription-review | 10 | 1717 | ACTIVE | Continue Development |
| Components\dashboard\prescription-review | 10 | 1717 | ACTIVE | Continue Development |
| components\help | 2 | 148 | DEFER | Review Later |
| Components\help | 2 | 148 | DEFER | Review Later |
| components\language | 2 | 337 | ACTIVE | Continue Development |
| Components\language | 2 | 337 | ACTIVE | Continue Development |
| components\patient | 1 | 686 | ACTIVE | Continue Development |
| Components\patient | 1 | 686 | ACTIVE | Continue Development |
| lib | 7 | 320 | ACTIVE | Continue Development |
| lib\analytics | 5 | 1110 | ACTIVE | Continue Development |
| lib\auth | 1 | 298 | ACTIVE | Continue Development |
| lib\builders | 4 | 964 | ACTIVE | Continue Development |
| lib\clinical-intelligence | 4 | 2142 | ACTIVE | Continue Development |
| lib\clinical-summary | 7 | 962 | ACTIVE | Continue Development |
| lib\config | 1 | 11 | DEFER | Review Later |
| lib\consent\mapper | 1 | 131 | DEFER | Review Later |
| lib\consent\models | 1 | 27 | DEFER | Review Later |
| lib\consent\repository | 1 | 122 | DEFER | Review Later |
| lib\consent\storage | 1 | 69 | DEFER | Review Later |
| lib\constants | 1 | 15 | DEFER | Review Later |
| lib\i18n | 3 | 215 | ACTIVE | Continue Development |
| lib\i18n\translations | 12 | 15258 | ACTIVE | Continue Development |
| lib\journey | 14 | 2047 | ACTIVE | Continue Development |
| lib\journey\activeTreatment | 8 | 30 | DEFER | Review Later |
| lib\journey\activeTreatment\models | 1 | 4 | DEFER | Review Later |
| lib\journey\classification | 9 | 32 | DEFER | Review Later |
| lib\journey\classification\models | 1 | 4 | DEFER | Review Later |
| lib\journey\context | 4 | 79 | DEFER | Review Later |
| lib\journey\governance | 7 | 26 | DEFER | Review Later |
| lib\journey\governance\models | 1 | 4 | DEFER | Review Later |
| lib\journey\scenarios | 7 | 26 | DEFER | Review Later |
| lib\journey\scenarios\models | 1 | 4 | DEFER | Review Later |
| lib\journey\timeline | 8 | 28 | DEFER | Review Later |
| lib\journey\timeline\models | 1 | 4 | DEFER | Review Later |
| lib\journey\treatment | 8 | 30 | DEFER | Review Later |
| lib\journey\treatment\models | 1 | 4 | DEFER | Review Later |
| lib\mappers | 6 | 638 | ACTIVE | Continue Development |
| lib\medical-image | 3 | 357 | ACTIVE | Continue Development |
| lib\medical-voice | 2 | 336 | ACTIVE | Continue Development |
| lib\pdf | 5 | 839 | ACTIVE | Continue Development |
| lib\performance | 3 | 906 | ACTIVE | Continue Development |
| lib\prescription | 6 | 3087 | ACTIVE | Continue Development |
| lib\prescription-ai | 6 | 2345 | ACTIVE | Continue Development |
| lib\prescription-ai\classification | 1 | 374 | ACTIVE | Continue Development |
| lib\prescription-ai\consultation | 9 | 1454 | ACTIVE | Continue Development |
| lib\prescription-ai\examples | 7 | 433 | ACTIVE | Continue Development |
| lib\prescription-ai\medicines | 5 | 0 | REVIEW | Cleanup |
| lib\prescription-ai\models | 1 | 95 | DEFER | Review Later |
| lib\prescription-image | 2 | 373 | ACTIVE | Continue Development |
| lib\repositories | 10 | 1415 | ACTIVE | Continue Development |
| lib\storage | 11 | 1812 | ACTIVE | Continue Development |
| lib\supabase | 1 | 52 | DEFER | Review Later |
| lib\treatment | 9 | 4867 | ACTIVE | Continue Development |
| lib\trends | 8 | 1862 | ACTIVE | Continue Development |
| lib\types | 10 | 598 | ACTIVE | Continue Development |
| lib\utils | 3 | 209 | ACTIVE | Continue Development |
| lib\utils\pdf | 1 | 115 | DEFER | Review Later |
| lib\validators | 1 | 98 | DEFER | Review Later |
| scripts | 9 | 2835 | REVIEW | Cleanup |

## File Review

--------------------------------------------------------------------------------

### app\add-patient\page.tsx

|Property|Value|
|---|---|
|Purpose|Storage|
|LOC|546|
|Imports|8|
|Imported By|0|
|Exports|0|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|2|
|TODO|0|
|Placeholder Score|2|
|Business Importance|Low|
|Phase|Future|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### app\admin\performance\page.tsx

|Property|Value|
|---|---|
|Purpose|Storage|
|LOC|484|
|Imports|4|
|Imported By|0|
|Exports|0|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|3|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Low|
|Phase|Future|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### app\api\analytics\auth-session\login\route.ts

|Property|Value|
|---|---|
|Purpose|Unknown|
|LOC|282|
|Imports|2|
|Imported By|0|
|Exports|1|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|2|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Low|
|Phase|P0|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### app\api\analytics\auth-session\logout\route.ts

|Property|Value|
|---|---|
|Purpose|Unknown|
|LOC|223|
|Imports|2|
|Imported By|0|
|Exports|1|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|2|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Low|
|Phase|P0|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### app\api\analytics\event\route.ts

|Property|Value|
|---|---|
|Purpose|Unknown|
|LOC|362|
|Imports|4|
|Imported By|0|
|Exports|1|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|2|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Low|
|Phase|Future|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### app\api\medical-image\route.ts

|Property|Value|
|---|---|
|Purpose|Shared Types|
|LOC|850|
|Imports|4|
|Imported By|0|
|Exports|1|
|Interfaces|1|
|Classes|0|
|Enums|0|
|Functions|6|
|TODO|0|
|Placeholder Score|2|
|Business Importance|Low|
|Phase|Phase 1|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### app\api\medical-voice\route.ts

|Property|Value|
|---|---|
|Purpose|Unknown|
|LOC|1086|
|Imports|5|
|Imported By|0|
|Exports|1|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|8|
|TODO|0|
|Placeholder Score|2|
|Business Importance|Low|
|Phase|Phase 1|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### app\api\prescription-identity\route.ts

|Property|Value|
|---|---|
|Purpose|Unknown|
|LOC|1102|
|Imports|5|
|Imported By|0|
|Exports|1|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|9|
|TODO|2|
|Placeholder Score|4|
|Business Importance|Low|
|Phase|Phase 1|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### app\api\prescription-image\route.ts

|Property|Value|
|---|---|
|Purpose|Unknown|
|LOC|1112|
|Imports|5|
|Imported By|0|
|Exports|1|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|9|
|TODO|2|
|Placeholder Score|4|
|Business Importance|Low|
|Phase|Phase 1|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### app\auth\callback\route.ts

|Property|Value|
|---|---|
|Purpose|Unknown|
|LOC|42|
|Imports|2|
|Imported By|0|
|Exports|0|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|2|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Low|
|Phase|P0|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### app\care\page.tsx

|Property|Value|
|---|---|
|Purpose|Storage|
|LOC|1678|
|Imports|12|
|Imported By|0|
|Exports|0|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|17|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Low|
|Phase|Future|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### app\carevr-journey\page.tsx

|Property|Value|
|---|---|
|Purpose|React Component|
|LOC|338|
|Imports|2|
|Imported By|0|
|Exports|0|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|1|
|TODO|0|
|Placeholder Score|0|
|Business Importance|High|
|Phase|Phase 3|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### app\checkin\page.tsx

|Property|Value|
|---|---|
|Purpose|Storage|
|LOC|491|
|Imports|3|
|Imported By|0|
|Exports|0|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|2|
|TODO|0|
|Placeholder Score|1|
|Business Importance|Low|
|Phase|Future|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### app\clinical-review\AssessmentChangesCard.tsx

|Property|Value|
|---|---|
|Purpose|Unknown|
|LOC|0|
|Imports|0|
|Imported By|0|
|Exports|0|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|0|
|TODO|0|
|Placeholder Score|0|
|Business Importance|High|
|Phase|Phase 2|
|Recommendation|DELETE|

--------------------------------------------------------------------------------

### app\clinical-review\ChangeBadge.tsx

|Property|Value|
|---|---|
|Purpose|Unknown|
|LOC|0|
|Imports|0|
|Imported By|0|
|Exports|0|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|0|
|TODO|0|
|Placeholder Score|0|
|Business Importance|High|
|Phase|Future|
|Recommendation|DELETE|

--------------------------------------------------------------------------------

### app\clinical-review\ClinicalReviewHeader.tsx

|Property|Value|
|---|---|
|Purpose|Unknown|
|LOC|0|
|Imports|0|
|Imported By|0|
|Exports|0|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|0|
|TODO|0|
|Placeholder Score|0|
|Business Importance|High|
|Phase|Future|
|Recommendation|DELETE|

--------------------------------------------------------------------------------

### app\clinical-review\ClinicalSummaryCard.tsx

|Property|Value|
|---|---|
|Purpose|Unknown|
|LOC|0|
|Imports|0|
|Imported By|0|
|Exports|0|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|0|
|TODO|0|
|Placeholder Score|0|
|Business Importance|High|
|Phase|Future|
|Recommendation|DELETE|

--------------------------------------------------------------------------------

### app\clinical-review\ComparisonValue.tsx

|Property|Value|
|---|---|
|Purpose|Unknown|
|LOC|0|
|Imports|0|
|Imported By|0|
|Exports|0|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|0|
|TODO|0|
|Placeholder Score|0|
|Business Importance|High|
|Phase|Future|
|Recommendation|DELETE|

--------------------------------------------------------------------------------

### app\clinical-review\ComplaintChangesCard.tsx

|Property|Value|
|---|---|
|Purpose|Unknown|
|LOC|0|
|Imports|0|
|Imported By|0|
|Exports|0|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|0|
|TODO|0|
|Placeholder Score|0|
|Business Importance|High|
|Phase|Future|
|Recommendation|DELETE|

--------------------------------------------------------------------------------

### app\clinical-review\ConfidenceCard.tsx

|Property|Value|
|---|---|
|Purpose|Unknown|
|LOC|0|
|Imports|0|
|Imported By|0|
|Exports|0|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|0|
|TODO|0|
|Placeholder Score|0|
|Business Importance|High|
|Phase|Future|
|Recommendation|DELETE|

--------------------------------------------------------------------------------

### app\clinical-review\EmptyComparison.tsx

|Property|Value|
|---|---|
|Purpose|Unknown|
|LOC|0|
|Imports|0|
|Imported By|0|
|Exports|0|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|0|
|TODO|0|
|Placeholder Score|0|
|Business Importance|High|
|Phase|Future|
|Recommendation|DELETE|

--------------------------------------------------------------------------------

### app\clinical-review\FollowUpCard.tsx

|Property|Value|
|---|---|
|Purpose|Unknown|
|LOC|0|
|Imports|0|
|Imported By|0|
|Exports|0|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|0|
|TODO|0|
|Placeholder Score|0|
|Business Importance|High|
|Phase|Future|
|Recommendation|DELETE|

--------------------------------------------------------------------------------

### app\clinical-review\InvestigationChangesCard.tsx

|Property|Value|
|---|---|
|Purpose|Unknown|
|LOC|0|
|Imports|0|
|Imported By|0|
|Exports|0|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|0|
|TODO|0|
|Placeholder Score|0|
|Business Importance|High|
|Phase|Future|
|Recommendation|DELETE|

--------------------------------------------------------------------------------

### app\clinical-review\MedicineChangesCard.tsx

|Property|Value|
|---|---|
|Purpose|Unknown|
|LOC|0|
|Imports|0|
|Imported By|0|
|Exports|0|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|0|
|TODO|0|
|Placeholder Score|0|
|Business Importance|High|
|Phase|Future|
|Recommendation|DELETE|

--------------------------------------------------------------------------------

### app\clinical-review\ReviewFooter.tsx

|Property|Value|
|---|---|
|Purpose|Unknown|
|LOC|0|
|Imports|0|
|Imported By|0|
|Exports|0|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|0|
|TODO|0|
|Placeholder Score|0|
|Business Importance|High|
|Phase|Future|
|Recommendation|DELETE|

--------------------------------------------------------------------------------

### app\clinical-review\VitalChangesCard.tsx

|Property|Value|
|---|---|
|Purpose|Unknown|
|LOC|0|
|Imports|0|
|Imported By|0|
|Exports|0|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|0|
|TODO|0|
|Placeholder Score|0|
|Business Importance|High|
|Phase|Future|
|Recommendation|DELETE|

--------------------------------------------------------------------------------

### app\components\AppBrand.tsx

|Property|Value|
|---|---|
|Purpose|Shared Types|
|LOC|43|
|Imports|0|
|Imported By|0|
|Exports|0|
|Interfaces|1|
|Classes|0|
|Enums|0|
|Functions|1|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Low|
|Phase|Future|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### app\components\AppHeader.tsx

|Property|Value|
|---|---|
|Purpose|Shared Types|
|LOC|185|
|Imports|0|
|Imported By|0|
|Exports|0|
|Interfaces|1|
|Classes|0|
|Enums|0|
|Functions|1|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Low|
|Phase|Future|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### app\components\common\ClinicalSummaryCard.tsx

|Property|Value|
|---|---|
|Purpose|Shared Types|
|LOC|236|
|Imports|2|
|Imported By|0|
|Exports|0|
|Interfaces|1|
|Classes|0|
|Enums|0|
|Functions|1|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Low|
|Phase|Future|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### app\components\common\ReportNavigation.tsx

|Property|Value|
|---|---|
|Purpose|Shared Types|
|LOC|89|
|Imports|2|
|Imported By|0|
|Exports|0|
|Interfaces|1|
|Classes|0|
|Enums|0|
|Functions|1|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Low|
|Phase|Future|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### app\components\dashboard\HelpWorkspace.tsx

|Property|Value|
|---|---|
|Purpose|React Component|
|LOC|155|
|Imports|1|
|Imported By|0|
|Exports|0|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|1|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Low|
|Phase|Future|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### app\components\ReportTable.tsx

|Property|Value|
|---|---|
|Purpose|Shared Types|
|LOC|87|
|Imports|1|
|Imported By|0|
|Exports|1|
|Interfaces|2|
|Classes|0|
|Enums|0|
|Functions|1|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Low|
|Phase|Future|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### app\components\TrendChart.tsx

|Property|Value|
|---|---|
|Purpose|Shared Types|
|LOC|237|
|Imports|3|
|Imported By|0|
|Exports|0|
|Interfaces|2|
|Classes|0|
|Enums|0|
|Functions|2|
|TODO|0|
|Placeholder Score|1|
|Business Importance|Low|
|Phase|Future|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### app\components\TrendLineChart.tsx

|Property|Value|
|---|---|
|Purpose|Shared Types|
|LOC|221|
|Imports|1|
|Imported By|1|
|Exports|0|
|Interfaces|1|
|Classes|0|
|Enums|0|
|Functions|1|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Low|
|Phase|Future|
|Recommendation|KEEP|

**Imported By**

- app\components\TrendChart.tsx

--------------------------------------------------------------------------------

### app\consent\page.tsx

|Property|Value|
|---|---|
|Purpose|Storage|
|LOC|749|
|Imports|4|
|Imported By|0|
|Exports|0|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|2|
|TODO|0|
|Placeholder Score|1|
|Business Importance|Low|
|Phase|P0|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### app\daily-care\components\ActionButtons.tsx

|Property|Value|
|---|---|
|Purpose|Shared Types|
|LOC|67|
|Imports|1|
|Imported By|1|
|Exports|0|
|Interfaces|1|
|Classes|0|
|Enums|0|
|Functions|1|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Low|
|Phase|Phase 2|
|Recommendation|KEEP|

**Imported By**

- app\daily-care\components\DailyCareForm.tsx

--------------------------------------------------------------------------------

### app\daily-care\components\DailyCareForm.tsx

|Property|Value|
|---|---|
|Purpose|Storage|
|LOC|2631|
|Imports|21|
|Imported By|1|
|Exports|0|
|Interfaces|2|
|Classes|0|
|Enums|0|
|Functions|19|
|TODO|0|
|Placeholder Score|2|
|Business Importance|Low|
|Phase|Phase 2|
|Recommendation|KEEP|

**Imported By**

- app\daily-care\page.tsx

--------------------------------------------------------------------------------

### app\daily-care\components\PainLocationCard.tsx

|Property|Value|
|---|---|
|Purpose|Shared Types|
|LOC|194|
|Imports|3|
|Imported By|1|
|Exports|0|
|Interfaces|1|
|Classes|0|
|Enums|0|
|Functions|1|
|TODO|0|
|Placeholder Score|1|
|Business Importance|Low|
|Phase|Phase 2|
|Recommendation|KEEP|

**Imported By**

- app\daily-care\components\DailyCareForm.tsx

--------------------------------------------------------------------------------

### app\daily-care\components\PatientCard.tsx

|Property|Value|
|---|---|
|Purpose|Shared Types|
|LOC|146|
|Imports|2|
|Imported By|1|
|Exports|0|
|Interfaces|1|
|Classes|0|
|Enums|0|
|Functions|1|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Low|
|Phase|Phase 2|
|Recommendation|KEEP|

**Imported By**

- app\daily-care\components\DailyCareForm.tsx

--------------------------------------------------------------------------------

### app\daily-care\components\SymptomsCard.tsx

|Property|Value|
|---|---|
|Purpose|Shared Types|
|LOC|233|
|Imports|3|
|Imported By|1|
|Exports|0|
|Interfaces|1|
|Classes|0|
|Enums|0|
|Functions|1|
|TODO|0|
|Placeholder Score|1|
|Business Importance|Low|
|Phase|Phase 2|
|Recommendation|KEEP|

**Imported By**

- app\daily-care\components\DailyCareForm.tsx

--------------------------------------------------------------------------------

### app\daily-care\components\TemperatureCard.tsx

|Property|Value|
|---|---|
|Purpose|Shared Types|
|LOC|118|
|Imports|1|
|Imported By|1|
|Exports|0|
|Interfaces|1|
|Classes|0|
|Enums|0|
|Functions|1|
|TODO|0|
|Placeholder Score|1|
|Business Importance|Low|
|Phase|Phase 2|
|Recommendation|KEEP|

**Imported By**

- app\daily-care\components\DailyCareForm.tsx

--------------------------------------------------------------------------------

### app\daily-care\components\VitalsCard.tsx

|Property|Value|
|---|---|
|Purpose|Shared Types|
|LOC|220|
|Imports|2|
|Imported By|1|
|Exports|0|
|Interfaces|1|
|Classes|0|
|Enums|0|
|Functions|1|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Low|
|Phase|Phase 2|
|Recommendation|KEEP|

**Imported By**

- app\daily-care\components\DailyCareForm.tsx

--------------------------------------------------------------------------------

### app\daily-care\page.tsx

|Property|Value|
|---|---|
|Purpose|Storage|
|LOC|373|
|Imports|11|
|Imported By|0|
|Exports|0|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|2|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Low|
|Phase|Phase 2|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### app\daily-care\styles.ts

|Property|Value|
|---|---|
|Purpose|Unknown|
|LOC|243|
|Imports|1|
|Imported By|6|
|Exports|12|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|0|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Low|
|Phase|Phase 2|
|Recommendation|KEEP|

**Imported By**

- app\daily-care\components\ActionButtons.tsx
- app\daily-care\components\PainLocationCard.tsx
- app\daily-care\components\PatientCard.tsx
- app\daily-care\components\SymptomsCard.tsx
- app\daily-care\components\TemperatureCard.tsx
- app\daily-care\components\VitalsCard.tsx

--------------------------------------------------------------------------------

### app\dashboard\page.tsx

|Property|Value|
|---|---|
|Purpose|Repository|
|LOC|2078|
|Imports|21|
|Imported By|0|
|Exports|0|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|10|
|TODO|1|
|Placeholder Score|2|
|Business Importance|Low|
|Phase|Future|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### app\family\page.tsx

|Property|Value|
|---|---|
|Purpose|Repository|
|LOC|577|
|Imports|12|
|Imported By|0|
|Exports|0|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|4|
|TODO|0|
|Placeholder Score|1|
|Business Importance|Low|
|Phase|Future|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### app\family\page2\page.tsx

|Property|Value|
|---|---|
|Purpose|Storage|
|LOC|220|
|Imports|6|
|Imported By|0|
|Exports|0|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|3|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Low|
|Phase|Future|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### app\family\page3\page.tsx

|Property|Value|
|---|---|
|Purpose|Storage|
|LOC|481|
|Imports|6|
|Imported By|0|
|Exports|0|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|3|
|TODO|0|
|Placeholder Score|1|
|Business Importance|Low|
|Phase|Future|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### app\family\page4\page.tsx

|Property|Value|
|---|---|
|Purpose|Storage|
|LOC|365|
|Imports|6|
|Imported By|0|
|Exports|0|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|3|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Low|
|Phase|Future|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### app\family\page5\page.tsx

|Property|Value|
|---|---|
|Purpose|Storage|
|LOC|680|
|Imports|6|
|Imported By|0|
|Exports|0|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|3|
|TODO|0|
|Placeholder Score|1|
|Business Importance|Low|
|Phase|Future|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### app\forgot-password\page.tsx

|Property|Value|
|---|---|
|Purpose|React Component|
|LOC|412|
|Imports|4|
|Imported By|0|
|Exports|0|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|1|
|TODO|0|
|Placeholder Score|1|
|Business Importance|Low|
|Phase|Future|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### app\help\about\page.tsx

|Property|Value|
|---|---|
|Purpose|React Component|
|LOC|228|
|Imports|1|
|Imported By|0|
|Exports|0|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|1|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Low|
|Phase|Future|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### app\help\assessments\page.tsx

|Property|Value|
|---|---|
|Purpose|React Component|
|LOC|207|
|Imports|1|
|Imported By|0|
|Exports|0|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|1|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Low|
|Phase|Phase 2|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### app\help\clinical-trends\page.tsx

|Property|Value|
|---|---|
|Purpose|React Component|
|LOC|208|
|Imports|1|
|Imported By|0|
|Exports|0|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|1|
|TODO|0|
|Placeholder Score|0|
|Business Importance|High|
|Phase|Future|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### app\help\daily-care\page.tsx

|Property|Value|
|---|---|
|Purpose|React Component|
|LOC|194|
|Imports|1|
|Imported By|0|
|Exports|0|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|1|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Low|
|Phase|Phase 2|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### app\help\faq\page.tsx

|Property|Value|
|---|---|
|Purpose|React Component|
|LOC|215|
|Imports|1|
|Imported By|0|
|Exports|0|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|1|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Low|
|Phase|Future|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### app\help\getting-started\page.tsx

|Property|Value|
|---|---|
|Purpose|React Component|
|LOC|195|
|Imports|1|
|Imported By|0|
|Exports|0|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|1|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Low|
|Phase|Future|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### app\help\layout.tsx

|Property|Value|
|---|---|
|Purpose|React Component|
|LOC|154|
|Imports|1|
|Imported By|0|
|Exports|0|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|1|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Low|
|Phase|Future|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### app\help\medication-management\page.tsx

|Property|Value|
|---|---|
|Purpose|React Component|
|LOC|240|
|Imports|1|
|Imported By|0|
|Exports|0|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|1|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Low|
|Phase|Future|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### app\help\page.tsx

|Property|Value|
|---|---|
|Purpose|React Component|
|LOC|262|
|Imports|3|
|Imported By|0|
|Exports|0|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|2|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Low|
|Phase|Future|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### app\help\pdf-reports\page.tsx

|Property|Value|
|---|---|
|Purpose|React Component|
|LOC|181|
|Imports|1|
|Imported By|0|
|Exports|0|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|1|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Low|
|Phase|Phase 2|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### app\help\privacy\page.tsx

|Property|Value|
|---|---|
|Purpose|React Component|
|LOC|191|
|Imports|1|
|Imported By|0|
|Exports|0|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|1|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Low|
|Phase|Future|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### app\help\reports\page.tsx

|Property|Value|
|---|---|
|Purpose|React Component|
|LOC|184|
|Imports|1|
|Imported By|0|
|Exports|0|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|1|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Low|
|Phase|Phase 2|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### app\journey-review\ActiveTreatmentCard.tsx

|Property|Value|
|---|---|
|Purpose|Shared Types|
|LOC|311|
|Imports|2|
|Imported By|1|
|Exports|1|
|Interfaces|4|
|Classes|0|
|Enums|0|
|Functions|5|
|TODO|0|
|Placeholder Score|0|
|Business Importance|High|
|Phase|Phase 3|
|Recommendation|KEEP|

**Imported By**

- app\journey-review\JourneyReview.tsx

--------------------------------------------------------------------------------

### app\journey-review\ChangeCard.tsx

|Property|Value|
|---|---|
|Purpose|Shared Types|
|LOC|130|
|Imports|1|
|Imported By|1|
|Exports|1|
|Interfaces|1|
|Classes|0|
|Enums|0|
|Functions|1|
|TODO|0|
|Placeholder Score|0|
|Business Importance|High|
|Phase|Phase 3|
|Recommendation|KEEP|

**Imported By**

- app\journey-review\JourneyDetectedChanges.tsx

--------------------------------------------------------------------------------

### app\journey-review\EmptyJourney.tsx

|Property|Value|
|---|---|
|Purpose|Shared Types|
|LOC|33|
|Imports|1|
|Imported By|1|
|Exports|1|
|Interfaces|1|
|Classes|0|
|Enums|0|
|Functions|1|
|TODO|0|
|Placeholder Score|0|
|Business Importance|High|
|Phase|Phase 3|
|Recommendation|KEEP|

**Imported By**

- app\journey-review\JourneyReview.tsx

--------------------------------------------------------------------------------

### app\journey-review\index.ts

|Property|Value|
|---|---|
|Purpose|Unknown|
|LOC|0|
|Imports|0|
|Imported By|1|
|Exports|0|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|0|
|TODO|0|
|Placeholder Score|0|
|Business Importance|High|
|Phase|Phase 3|
|Recommendation|DELETE|

**Imported By**

- app\journey-review\JourneyWizard.tsx

--------------------------------------------------------------------------------

### app\journey-review\JourneyActions.tsx

|Property|Value|
|---|---|
|Purpose|Shared Types|
|LOC|178|
|Imports|2|
|Imported By|1|
|Exports|1|
|Interfaces|2|
|Classes|0|
|Enums|0|
|Functions|4|
|TODO|0|
|Placeholder Score|1|
|Business Importance|High|
|Phase|Phase 3|
|Recommendation|KEEP|

**Imported By**

- app\journey-review\JourneyReview.tsx

--------------------------------------------------------------------------------

### app\journey-review\JourneyComplete.tsx

|Property|Value|
|---|---|
|Purpose|Unknown|
|LOC|0|
|Imports|0|
|Imported By|1|
|Exports|0|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|0|
|TODO|0|
|Placeholder Score|0|
|Business Importance|High|
|Phase|Phase 3|
|Recommendation|DELETE|

**Imported By**

- app\journey-review\JourneyWizard.tsx

--------------------------------------------------------------------------------

### app\journey-review\JourneyConfidence.tsx

|Property|Value|
|---|---|
|Purpose|Shared Types|
|LOC|183|
|Imports|2|
|Imported By|1|
|Exports|1|
|Interfaces|1|
|Classes|0|
|Enums|0|
|Functions|3|
|TODO|0|
|Placeholder Score|0|
|Business Importance|High|
|Phase|Phase 3|
|Recommendation|KEEP|

**Imported By**

- app\journey-review\JourneyReview.tsx

--------------------------------------------------------------------------------

### app\journey-review\JourneyContext.tsx

|Property|Value|
|---|---|
|Purpose|Shared Types|
|LOC|400|
|Imports|2|
|Imported By|1|
|Exports|5|
|Interfaces|3|
|Classes|0|
|Enums|1|
|Functions|3|
|TODO|0|
|Placeholder Score|1|
|Business Importance|High|
|Phase|Phase 3|
|Recommendation|KEEP|

**Imported By**

- app\journey-review\JourneyWizard.tsx

--------------------------------------------------------------------------------

### app\journey-review\JourneyDetectedChanges.tsx

|Property|Value|
|---|---|
|Purpose|Shared Types|
|LOC|141|
|Imports|3|
|Imported By|1|
|Exports|1|
|Interfaces|1|
|Classes|0|
|Enums|0|
|Functions|2|
|TODO|0|
|Placeholder Score|0|
|Business Importance|High|
|Phase|Phase 3|
|Recommendation|KEEP|

**Imported By**

- app\journey-review\JourneyReview.tsx

--------------------------------------------------------------------------------

### app\journey-review\JourneyHeader.tsx

|Property|Value|
|---|---|
|Purpose|Shared Types|
|LOC|189|
|Imports|2|
|Imported By|1|
|Exports|1|
|Interfaces|2|
|Classes|0|
|Enums|0|
|Functions|5|
|TODO|0|
|Placeholder Score|0|
|Business Importance|High|
|Phase|Phase 3|
|Recommendation|KEEP|

**Imported By**

- app\journey-review\JourneyReview.tsx

--------------------------------------------------------------------------------

### app\journey-review\JourneyQuestions.tsx

|Property|Value|
|---|---|
|Purpose|Shared Types|
|LOC|61|
|Imports|2|
|Imported By|1|
|Exports|1|
|Interfaces|1|
|Classes|0|
|Enums|0|
|Functions|1|
|TODO|0|
|Placeholder Score|1|
|Business Importance|High|
|Phase|Phase 3|
|Recommendation|KEEP|

**Imported By**

- app\journey-review\JourneyReview.tsx

--------------------------------------------------------------------------------

### app\journey-review\JourneyReview.tsx

|Property|Value|
|---|---|
|Purpose|Shared Types|
|LOC|131|
|Imports|12|
|Imported By|0|
|Exports|1|
|Interfaces|1|
|Classes|0|
|Enums|0|
|Functions|1|
|TODO|0|
|Placeholder Score|0|
|Business Importance|High|
|Phase|Phase 3|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### app\journey-review\JourneySummaryCard.tsx

|Property|Value|
|---|---|
|Purpose|Shared Types|
|LOC|98|
|Imports|3|
|Imported By|1|
|Exports|1|
|Interfaces|1|
|Classes|0|
|Enums|0|
|Functions|1|
|TODO|0|
|Placeholder Score|1|
|Business Importance|High|
|Phase|Phase 3|
|Recommendation|KEEP|

**Imported By**

- app\journey-review\JourneyReview.tsx

--------------------------------------------------------------------------------

### app\journey-review\JourneyTimeline.tsx

|Property|Value|
|---|---|
|Purpose|Shared Types|
|LOC|270|
|Imports|2|
|Imported By|1|
|Exports|1|
|Interfaces|3|
|Classes|0|
|Enums|0|
|Functions|5|
|TODO|0|
|Placeholder Score|0|
|Business Importance|High|
|Phase|Phase 3|
|Recommendation|KEEP|

**Imported By**

- app\journey-review\JourneyReview.tsx

--------------------------------------------------------------------------------

### app\journey-review\JourneyWizard.tsx

|Property|Value|
|---|---|
|Purpose|Shared Types|
|LOC|355|
|Imports|5|
|Imported By|0|
|Exports|1|
|Interfaces|2|
|Classes|0|
|Enums|0|
|Functions|6|
|TODO|0|
|Placeholder Score|0|
|Business Importance|High|
|Phase|Phase 3|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### app\journey-review\LoadingJourney.tsx

|Property|Value|
|---|---|
|Purpose|Utility|
|LOC|31|
|Imports|0|
|Imported By|1|
|Exports|1|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|1|
|TODO|0|
|Placeholder Score|0|
|Business Importance|High|
|Phase|Phase 3|
|Recommendation|KEEP|

**Imported By**

- app\journey-review\JourneyReview.tsx

--------------------------------------------------------------------------------

### app\journey-review\QuestionCard.tsx

|Property|Value|
|---|---|
|Purpose|Shared Types|
|LOC|107|
|Imports|4|
|Imported By|1|
|Exports|1|
|Interfaces|1|
|Classes|0|
|Enums|0|
|Functions|2|
|TODO|0|
|Placeholder Score|0|
|Business Importance|High|
|Phase|Phase 3|
|Recommendation|KEEP|

**Imported By**

- app\journey-review\JourneyQuestions.tsx

--------------------------------------------------------------------------------

### app\journey-review\QuestionRenderer.tsx

|Property|Value|
|---|---|
|Purpose|Shared Types|
|LOC|413|
|Imports|1|
|Imported By|1|
|Exports|1|
|Interfaces|2|
|Classes|0|
|Enums|0|
|Functions|9|
|TODO|0|
|Placeholder Score|1|
|Business Importance|High|
|Phase|Phase 3|
|Recommendation|KEEP|

**Imported By**

- app\journey-review\QuestionCard.tsx

--------------------------------------------------------------------------------

### app\journey-review\SummaryCard.tsx

|Property|Value|
|---|---|
|Purpose|Shared Types|
|LOC|111|
|Imports|1|
|Imported By|1|
|Exports|1|
|Interfaces|1|
|Classes|0|
|Enums|0|
|Functions|1|
|TODO|0|
|Placeholder Score|0|
|Business Importance|High|
|Phase|Phase 3|
|Recommendation|KEEP|

**Imported By**

- app\journey-review\JourneySummaryCard.tsx

--------------------------------------------------------------------------------

### app\journey-review\TimelinePreview.tsx

|Property|Value|
|---|---|
|Purpose|Shared Types|
|LOC|181|
|Imports|2|
|Imported By|1|
|Exports|1|
|Interfaces|1|
|Classes|0|
|Enums|0|
|Functions|3|
|TODO|0|
|Placeholder Score|1|
|Business Importance|High|
|Phase|Phase 3|
|Recommendation|KEEP|

**Imported By**

- app\journey-review\JourneyWizard.tsx

--------------------------------------------------------------------------------

### app\journey-review\TreatmentDecisionCard.tsx

|Property|Value|
|---|---|
|Purpose|Shared Types|
|LOC|215|
|Imports|2|
|Imported By|1|
|Exports|1|
|Interfaces|2|
|Classes|0|
|Enums|0|
|Functions|3|
|TODO|0|
|Placeholder Score|0|
|Business Importance|High|
|Phase|Phase 3|
|Recommendation|KEEP|

**Imported By**

- app\journey-review\JourneyReview.tsx

--------------------------------------------------------------------------------

### app\layout.tsx

|Property|Value|
|---|---|
|Purpose|React Component|
|LOC|29|
|Imports|1|
|Imported By|0|
|Exports|0|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|1|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Low|
|Phase|Future|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### app\login\page.tsx

|Property|Value|
|---|---|
|Purpose|React Component|
|LOC|391|
|Imports|6|
|Imported By|0|
|Exports|0|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|1|
|TODO|0|
|Placeholder Score|1|
|Business Importance|Low|
|Phase|Future|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### app\medications\consultation-mode\page.tsx

|Property|Value|
|---|---|
|Purpose|Storage|
|LOC|1710|
|Imports|6|
|Imported By|0|
|Exports|0|
|Interfaces|1|
|Classes|0|
|Enums|0|
|Functions|4|
|TODO|0|
|Placeholder Score|1|
|Business Importance|Low|
|Phase|Future|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### app\medications\page.tsx

|Property|Value|
|---|---|
|Purpose|React Component|
|LOC|489|
|Imports|5|
|Imported By|0|
|Exports|0|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|5|
|TODO|1|
|Placeholder Score|1|
|Business Importance|Low|
|Phase|Future|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### app\medications\prescription\page.tsx

|Property|Value|
|---|---|
|Purpose|React Component|
|LOC|1715|
|Imports|6|
|Imported By|0|
|Exports|0|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|9|
|TODO|0|
|Placeholder Score|1|
|Business Importance|Low|
|Phase|Phase 1|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### app\page.tsx

|Property|Value|
|---|---|
|Purpose|Storage|
|LOC|21|
|Imports|2|
|Imported By|0|
|Exports|0|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|1|
|TODO|0|
|Placeholder Score|1|
|Business Importance|Low|
|Phase|Future|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### app\register\page.tsx

|Property|Value|
|---|---|
|Purpose|React Component|
|LOC|520|
|Imports|3|
|Imported By|0|
|Exports|0|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|2|
|TODO|0|
|Placeholder Score|1|
|Business Importance|Low|
|Phase|Future|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### app\report\page.tsx

|Property|Value|
|---|---|
|Purpose|Storage|
|LOC|1181|
|Imports|10|
|Imported By|0|
|Exports|0|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|3|
|TODO|0|
|Placeholder Score|1|
|Business Importance|Low|
|Phase|Future|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### app\reports\assessment\family\[id]\page.tsx

|Property|Value|
|---|---|
|Purpose|Storage|
|LOC|661|
|Imports|9|
|Imported By|0|
|Exports|0|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|5|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Low|
|Phase|Phase 2|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### app\reports\assessment\family\page.tsx

|Property|Value|
|---|---|
|Purpose|Storage|
|LOC|661|
|Imports|10|
|Imported By|0|
|Exports|0|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|4|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Low|
|Phase|Phase 2|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### app\reports\assessment\page.tsx

|Property|Value|
|---|---|
|Purpose|React Component|
|LOC|182|
|Imports|5|
|Imported By|0|
|Exports|0|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|1|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Low|
|Phase|Phase 2|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### app\reports\assessment\self\[id]\page.tsx

|Property|Value|
|---|---|
|Purpose|Repository|
|LOC|664|
|Imports|9|
|Imported By|0|
|Exports|0|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|5|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Low|
|Phase|Phase 2|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### app\reports\assessment\self\page.tsx

|Property|Value|
|---|---|
|Purpose|Repository|
|LOC|504|
|Imports|10|
|Imported By|0|
|Exports|0|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|4|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Low|
|Phase|Phase 2|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### app\reports\daily-care\[id]\page.tsx

|Property|Value|
|---|---|
|Purpose|Storage|
|LOC|730|
|Imports|13|
|Imported By|0|
|Exports|0|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|1|
|TODO|0|
|Placeholder Score|1|
|Business Importance|Low|
|Phase|Phase 2|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### app\reports\daily-care\page.tsx

|Property|Value|
|---|---|
|Purpose|Storage|
|LOC|752|
|Imports|11|
|Imported By|0|
|Exports|0|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|2|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Low|
|Phase|Phase 2|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### app\reports\daily-care\select\page.tsx

|Property|Value|
|---|---|
|Purpose|React Component|
|LOC|222|
|Imports|4|
|Imported By|0|
|Exports|0|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|2|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Low|
|Phase|Phase 2|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### app\reports\daily-care\self\[id]\page.tsx

|Property|Value|
|---|---|
|Purpose|Storage|
|LOC|693|
|Imports|15|
|Imported By|0|
|Exports|0|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|1|
|TODO|0|
|Placeholder Score|1|
|Business Importance|Low|
|Phase|Phase 2|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### app\reports\daily-care\self\page.tsx

|Property|Value|
|---|---|
|Purpose|Storage|
|LOC|563|
|Imports|9|
|Imported By|0|
|Exports|0|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|1|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Low|
|Phase|Phase 2|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### app\reports\page.tsx

|Property|Value|
|---|---|
|Purpose|React Component|
|LOC|331|
|Imports|6|
|Imported By|0|
|Exports|0|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|2|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Low|
|Phase|Phase 2|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### app\reports\trends\page.tsx

|Property|Value|
|---|---|
|Purpose|Storage|
|LOC|900|
|Imports|10|
|Imported By|0|
|Exports|0|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|6|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Low|
|Phase|Phase 2|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### app\reports\trends\results\page.tsx

|Property|Value|
|---|---|
|Purpose|Storage|
|LOC|751|
|Imports|15|
|Imported By|0|
|Exports|0|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|3|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Low|
|Phase|Phase 2|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### app\reports\trends\selector\page.tsx

|Property|Value|
|---|---|
|Purpose|React Component|
|LOC|175|
|Imports|5|
|Imported By|0|
|Exports|0|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|1|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Low|
|Phase|Phase 2|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### app\reports\trends\self\page.tsx

|Property|Value|
|---|---|
|Purpose|Storage|
|LOC|818|
|Imports|9|
|Imported By|0|
|Exports|0|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|5|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Low|
|Phase|Phase 2|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### app\reports\trends\self\results\page.tsx

|Property|Value|
|---|---|
|Purpose|Storage|
|LOC|739|
|Imports|15|
|Imported By|0|
|Exports|0|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|3|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Low|
|Phase|Phase 2|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### app\reports\trends\trendRequest.ts

|Property|Value|
|---|---|
|Purpose|Shared Types|
|LOC|23|
|Imports|0|
|Imported By|0|
|Exports|1|
|Interfaces|1|
|Classes|0|
|Enums|0|
|Functions|0|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Low|
|Phase|Phase 2|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### app\reset-password\page.tsx

|Property|Value|
|---|---|
|Purpose|React Component|
|LOC|683|
|Imports|4|
|Imported By|0|
|Exports|0|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|1|
|TODO|0|
|Placeholder Score|1|
|Business Importance|Low|
|Phase|Future|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### app\review\page.tsx

|Property|Value|
|---|---|
|Purpose|Unknown|
|LOC|0|
|Imports|0|
|Imported By|0|
|Exports|0|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|0|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Low|
|Phase|Future|
|Recommendation|DELETE|

--------------------------------------------------------------------------------

### app\self-profile\page.tsx

|Property|Value|
|---|---|
|Purpose|Storage|
|LOC|366|
|Imports|6|
|Imported By|0|
|Exports|0|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|1|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Low|
|Phase|Future|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### app\self\page.tsx

|Property|Value|
|---|---|
|Purpose|Storage|
|LOC|148|
|Imports|7|
|Imported By|0|
|Exports|0|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|1|
|TODO|0|
|Placeholder Score|1|
|Business Importance|Low|
|Phase|Future|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### app\self\page2\page.tsx

|Property|Value|
|---|---|
|Purpose|Storage|
|LOC|310|
|Imports|8|
|Imported By|0|
|Exports|0|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|4|
|TODO|0|
|Placeholder Score|1|
|Business Importance|Low|
|Phase|Future|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### app\self\page3\page.tsx

|Property|Value|
|---|---|
|Purpose|Storage|
|LOC|221|
|Imports|6|
|Imported By|0|
|Exports|0|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|3|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Low|
|Phase|Future|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### app\self\page4\page.tsx

|Property|Value|
|---|---|
|Purpose|Storage|
|LOC|240|
|Imports|6|
|Imported By|0|
|Exports|0|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|4|
|TODO|0|
|Placeholder Score|1|
|Business Importance|Low|
|Phase|Future|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### app\self\page5\page.tsx

|Property|Value|
|---|---|
|Purpose|Storage|
|LOC|252|
|Imports|6|
|Imported By|0|
|Exports|0|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|3|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Low|
|Phase|Future|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### app\welcome\page.tsx

|Property|Value|
|---|---|
|Purpose|Storage|
|LOC|153|
|Imports|2|
|Imported By|0|
|Exports|0|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|1|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Low|
|Phase|Future|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### components\AssessmentLayout.tsx

|Property|Value|
|---|---|
|Purpose|React Component|
|LOC|81|
|Imports|2|
|Imported By|0|
|Exports|0|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|2|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Low|
|Phase|Phase 2|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### Components\AssessmentLayout.tsx

|Property|Value|
|---|---|
|Purpose|React Component|
|LOC|81|
|Imports|2|
|Imported By|0|
|Exports|0|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|2|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Low|
|Phase|Phase 2|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### components\common\ResponsiveTable.tsx

|Property|Value|
|---|---|
|Purpose|Unknown|
|LOC|0|
|Imports|0|
|Imported By|0|
|Exports|0|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|0|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Low|
|Phase|Future|
|Recommendation|DELETE|

--------------------------------------------------------------------------------

### Components\common\ResponsiveTable.tsx

|Property|Value|
|---|---|
|Purpose|Unknown|
|LOC|0|
|Imports|0|
|Imported By|0|
|Exports|0|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|0|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Low|
|Phase|Future|
|Recommendation|DELETE|

--------------------------------------------------------------------------------

### components\daily-care\VoiceRecorder.tsx

|Property|Value|
|---|---|
|Purpose|Shared Types|
|LOC|557|
|Imports|1|
|Imported By|0|
|Exports|0|
|Interfaces|1|
|Classes|0|
|Enums|0|
|Functions|5|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Low|
|Phase|Phase 2|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### Components\daily-care\VoiceRecorder.tsx

|Property|Value|
|---|---|
|Purpose|Shared Types|
|LOC|557|
|Imports|1|
|Imported By|0|
|Exports|0|
|Interfaces|1|
|Classes|0|
|Enums|0|
|Functions|5|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Low|
|Phase|Phase 2|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### components\dashboard\ActionOptions.tsx

|Property|Value|
|---|---|
|Purpose|Shared Types|
|LOC|817|
|Imports|2|
|Imported By|0|
|Exports|2|
|Interfaces|1|
|Classes|0|
|Enums|0|
|Functions|1|
|TODO|1|
|Placeholder Score|1|
|Business Importance|Low|
|Phase|Future|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### Components\dashboard\ActionOptions.tsx

|Property|Value|
|---|---|
|Purpose|Shared Types|
|LOC|817|
|Imports|2|
|Imported By|0|
|Exports|2|
|Interfaces|1|
|Classes|0|
|Enums|0|
|Functions|1|
|TODO|1|
|Placeholder Score|1|
|Business Importance|Low|
|Phase|Future|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### components\dashboard\ConsultationWorkspace.tsx

|Property|Value|
|---|---|
|Purpose|Shared Types|
|LOC|614|
|Imports|3|
|Imported By|0|
|Exports|0|
|Interfaces|1|
|Classes|0|
|Enums|0|
|Functions|1|
|TODO|0|
|Placeholder Score|1|
|Business Importance|Low|
|Phase|Future|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### Components\dashboard\ConsultationWorkspace.tsx

|Property|Value|
|---|---|
|Purpose|Shared Types|
|LOC|614|
|Imports|3|
|Imported By|0|
|Exports|0|
|Interfaces|1|
|Classes|0|
|Enums|0|
|Functions|1|
|TODO|0|
|Placeholder Score|1|
|Business Importance|Low|
|Phase|Future|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### components\dashboard\ManualCareWorkspace.tsx

|Property|Value|
|---|---|
|Purpose|Storage|
|LOC|1594|
|Imports|9|
|Imported By|0|
|Exports|0|
|Interfaces|2|
|Classes|0|
|Enums|0|
|Functions|11|
|TODO|0|
|Placeholder Score|2|
|Business Importance|Low|
|Phase|Future|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### Components\dashboard\ManualCareWorkspace.tsx

|Property|Value|
|---|---|
|Purpose|Storage|
|LOC|1594|
|Imports|9|
|Imported By|0|
|Exports|0|
|Interfaces|2|
|Classes|0|
|Enums|0|
|Functions|11|
|TODO|0|
|Placeholder Score|2|
|Business Importance|Low|
|Phase|Future|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### components\dashboard\prescription-review\AssessmentCard.tsx

|Property|Value|
|---|---|
|Purpose|Shared Types|
|LOC|228|
|Imports|3|
|Imported By|1|
|Exports|0|
|Interfaces|1|
|Classes|0|
|Enums|0|
|Functions|1|
|TODO|0|
|Placeholder Score|1|
|Business Importance|Low|
|Phase|Phase 1|
|Recommendation|KEEP|

**Imported By**

- components\dashboard\PrescriptionReview.tsx

--------------------------------------------------------------------------------

### Components\dashboard\prescription-review\AssessmentCard.tsx

|Property|Value|
|---|---|
|Purpose|Shared Types|
|LOC|228|
|Imports|3|
|Imported By|1|
|Exports|0|
|Interfaces|1|
|Classes|0|
|Enums|0|
|Functions|1|
|TODO|0|
|Placeholder Score|1|
|Business Importance|Low|
|Phase|Phase 1|
|Recommendation|KEEP|

**Imported By**

- Components\dashboard\PrescriptionReview.tsx

--------------------------------------------------------------------------------

### components\dashboard\prescription-review\ComplaintsCard.tsx

|Property|Value|
|---|---|
|Purpose|Shared Types|
|LOC|85|
|Imports|3|
|Imported By|1|
|Exports|0|
|Interfaces|1|
|Classes|0|
|Enums|0|
|Functions|1|
|TODO|0|
|Placeholder Score|1|
|Business Importance|Low|
|Phase|Phase 1|
|Recommendation|KEEP|

**Imported By**

- components\dashboard\PrescriptionReview.tsx

--------------------------------------------------------------------------------

### Components\dashboard\prescription-review\ComplaintsCard.tsx

|Property|Value|
|---|---|
|Purpose|Shared Types|
|LOC|85|
|Imports|3|
|Imported By|1|
|Exports|0|
|Interfaces|1|
|Classes|0|
|Enums|0|
|Functions|1|
|TODO|0|
|Placeholder Score|1|
|Business Importance|Low|
|Phase|Phase 1|
|Recommendation|KEEP|

**Imported By**

- Components\dashboard\PrescriptionReview.tsx

--------------------------------------------------------------------------------

### components\dashboard\prescription-review\DoctorInstructionCard.tsx

|Property|Value|
|---|---|
|Purpose|Shared Types|
|LOC|77|
|Imports|3|
|Imported By|1|
|Exports|0|
|Interfaces|1|
|Classes|0|
|Enums|0|
|Functions|1|
|TODO|0|
|Placeholder Score|1|
|Business Importance|Low|
|Phase|Phase 1|
|Recommendation|KEEP|

**Imported By**

- components\dashboard\PrescriptionReview.tsx

--------------------------------------------------------------------------------

### Components\dashboard\prescription-review\DoctorInstructionCard.tsx

|Property|Value|
|---|---|
|Purpose|Shared Types|
|LOC|77|
|Imports|3|
|Imported By|1|
|Exports|0|
|Interfaces|1|
|Classes|0|
|Enums|0|
|Functions|1|
|TODO|0|
|Placeholder Score|1|
|Business Importance|Low|
|Phase|Phase 1|
|Recommendation|KEEP|

**Imported By**

- Components\dashboard\PrescriptionReview.tsx

--------------------------------------------------------------------------------

### components\dashboard\prescription-review\HistoryCard.tsx

|Property|Value|
|---|---|
|Purpose|Shared Types|
|LOC|208|
|Imports|3|
|Imported By|1|
|Exports|0|
|Interfaces|1|
|Classes|0|
|Enums|0|
|Functions|2|
|TODO|0|
|Placeholder Score|1|
|Business Importance|Low|
|Phase|Phase 1|
|Recommendation|KEEP|

**Imported By**

- components\dashboard\PrescriptionReview.tsx

--------------------------------------------------------------------------------

### Components\dashboard\prescription-review\HistoryCard.tsx

|Property|Value|
|---|---|
|Purpose|Shared Types|
|LOC|208|
|Imports|3|
|Imported By|1|
|Exports|0|
|Interfaces|1|
|Classes|0|
|Enums|0|
|Functions|2|
|TODO|0|
|Placeholder Score|1|
|Business Importance|Low|
|Phase|Phase 1|
|Recommendation|KEEP|

**Imported By**

- Components\dashboard\PrescriptionReview.tsx

--------------------------------------------------------------------------------

### components\dashboard\prescription-review\InvestigationCard.tsx

|Property|Value|
|---|---|
|Purpose|Shared Types|
|LOC|78|
|Imports|3|
|Imported By|1|
|Exports|0|
|Interfaces|1|
|Classes|0|
|Enums|0|
|Functions|1|
|TODO|0|
|Placeholder Score|1|
|Business Importance|Low|
|Phase|Phase 1|
|Recommendation|KEEP|

**Imported By**

- components\dashboard\PrescriptionReview.tsx

--------------------------------------------------------------------------------

### Components\dashboard\prescription-review\InvestigationCard.tsx

|Property|Value|
|---|---|
|Purpose|Shared Types|
|LOC|78|
|Imports|3|
|Imported By|1|
|Exports|0|
|Interfaces|1|
|Classes|0|
|Enums|0|
|Functions|1|
|TODO|0|
|Placeholder Score|1|
|Business Importance|Low|
|Phase|Phase 1|
|Recommendation|KEEP|

**Imported By**

- Components\dashboard\PrescriptionReview.tsx

--------------------------------------------------------------------------------

### components\dashboard\prescription-review\MedicineCard.tsx

|Property|Value|
|---|---|
|Purpose|Shared Types|
|LOC|332|
|Imports|2|
|Imported By|1|
|Exports|0|
|Interfaces|1|
|Classes|0|
|Enums|0|
|Functions|1|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Low|
|Phase|Phase 1|
|Recommendation|KEEP|

**Imported By**

- components\dashboard\PrescriptionReview.tsx

--------------------------------------------------------------------------------

### Components\dashboard\prescription-review\MedicineCard.tsx

|Property|Value|
|---|---|
|Purpose|Shared Types|
|LOC|332|
|Imports|2|
|Imported By|1|
|Exports|0|
|Interfaces|1|
|Classes|0|
|Enums|0|
|Functions|1|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Low|
|Phase|Phase 1|
|Recommendation|KEEP|

**Imported By**

- Components\dashboard\PrescriptionReview.tsx

--------------------------------------------------------------------------------

### components\dashboard\prescription-review\OtherNotesCard.tsx

|Property|Value|
|---|---|
|Purpose|Shared Types|
|LOC|71|
|Imports|3|
|Imported By|1|
|Exports|0|
|Interfaces|1|
|Classes|0|
|Enums|0|
|Functions|1|
|TODO|0|
|Placeholder Score|1|
|Business Importance|Low|
|Phase|Phase 1|
|Recommendation|KEEP|

**Imported By**

- components\dashboard\PrescriptionReview.tsx

--------------------------------------------------------------------------------

### Components\dashboard\prescription-review\OtherNotesCard.tsx

|Property|Value|
|---|---|
|Purpose|Shared Types|
|LOC|71|
|Imports|3|
|Imported By|1|
|Exports|0|
|Interfaces|1|
|Classes|0|
|Enums|0|
|Functions|1|
|TODO|0|
|Placeholder Score|1|
|Business Importance|Low|
|Phase|Phase 1|
|Recommendation|KEEP|

**Imported By**

- Components\dashboard\PrescriptionReview.tsx

--------------------------------------------------------------------------------

### components\dashboard\prescription-review\PatientCard.tsx

|Property|Value|
|---|---|
|Purpose|Shared Types|
|LOC|311|
|Imports|3|
|Imported By|1|
|Exports|0|
|Interfaces|1|
|Classes|0|
|Enums|0|
|Functions|3|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Low|
|Phase|Phase 1|
|Recommendation|KEEP|

**Imported By**

- components\dashboard\PrescriptionReview.tsx

--------------------------------------------------------------------------------

### Components\dashboard\prescription-review\PatientCard.tsx

|Property|Value|
|---|---|
|Purpose|Shared Types|
|LOC|311|
|Imports|3|
|Imported By|1|
|Exports|0|
|Interfaces|1|
|Classes|0|
|Enums|0|
|Functions|3|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Low|
|Phase|Phase 1|
|Recommendation|KEEP|

**Imported By**

- Components\dashboard\PrescriptionReview.tsx

--------------------------------------------------------------------------------

### components\dashboard\prescription-review\ReviewActions.tsx

|Property|Value|
|---|---|
|Purpose|Shared Types|
|LOC|203|
|Imports|2|
|Imported By|1|
|Exports|0|
|Interfaces|1|
|Classes|0|
|Enums|0|
|Functions|1|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Low|
|Phase|Phase 1|
|Recommendation|KEEP|

**Imported By**

- components\dashboard\PrescriptionReview.tsx

--------------------------------------------------------------------------------

### Components\dashboard\prescription-review\ReviewActions.tsx

|Property|Value|
|---|---|
|Purpose|Shared Types|
|LOC|203|
|Imports|2|
|Imported By|1|
|Exports|0|
|Interfaces|1|
|Classes|0|
|Enums|0|
|Functions|1|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Low|
|Phase|Phase 1|
|Recommendation|KEEP|

**Imported By**

- Components\dashboard\PrescriptionReview.tsx

--------------------------------------------------------------------------------

### components\dashboard\prescription-review\VitalsCard.tsx

|Property|Value|
|---|---|
|Purpose|Shared Types|
|LOC|124|
|Imports|3|
|Imported By|1|
|Exports|0|
|Interfaces|1|
|Classes|0|
|Enums|0|
|Functions|1|
|TODO|0|
|Placeholder Score|1|
|Business Importance|Low|
|Phase|Phase 1|
|Recommendation|KEEP|

**Imported By**

- components\dashboard\PrescriptionReview.tsx

--------------------------------------------------------------------------------

### Components\dashboard\prescription-review\VitalsCard.tsx

|Property|Value|
|---|---|
|Purpose|Shared Types|
|LOC|124|
|Imports|3|
|Imported By|1|
|Exports|0|
|Interfaces|1|
|Classes|0|
|Enums|0|
|Functions|1|
|TODO|0|
|Placeholder Score|1|
|Business Importance|Low|
|Phase|Phase 1|
|Recommendation|KEEP|

**Imported By**

- Components\dashboard\PrescriptionReview.tsx

--------------------------------------------------------------------------------

### components\dashboard\prescription\PrescriptionTabs.tsx

|Property|Value|
|---|---|
|Purpose|Shared Types|
|LOC|133|
|Imports|1|
|Imported By|1|
|Exports|1|
|Interfaces|1|
|Classes|0|
|Enums|0|
|Functions|1|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Low|
|Phase|Phase 1|
|Recommendation|KEEP|

**Imported By**

- components\dashboard\PrescriptionReview.tsx

--------------------------------------------------------------------------------

### Components\dashboard\prescription\PrescriptionTabs.tsx

|Property|Value|
|---|---|
|Purpose|Shared Types|
|LOC|133|
|Imports|1|
|Imported By|1|
|Exports|1|
|Interfaces|1|
|Classes|0|
|Enums|0|
|Functions|1|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Low|
|Phase|Phase 1|
|Recommendation|KEEP|

**Imported By**

- Components\dashboard\PrescriptionReview.tsx

--------------------------------------------------------------------------------

### components\dashboard\PrescriptionDetailsPanel.tsx

|Property|Value|
|---|---|
|Purpose|Unknown|
|LOC|0|
|Imports|0|
|Imported By|0|
|Exports|0|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|0|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Low|
|Phase|Phase 1|
|Recommendation|DELETE|

--------------------------------------------------------------------------------

### Components\dashboard\PrescriptionDetailsPanel.tsx

|Property|Value|
|---|---|
|Purpose|Unknown|
|LOC|0|
|Imports|0|
|Imported By|0|
|Exports|0|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|0|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Low|
|Phase|Phase 1|
|Recommendation|DELETE|

--------------------------------------------------------------------------------

### components\dashboard\PrescriptionHistoryWorkspace.tsx

|Property|Value|
|---|---|
|Purpose|Repository|
|LOC|1377|
|Imports|5|
|Imported By|0|
|Exports|0|
|Interfaces|2|
|Classes|0|
|Enums|0|
|Functions|6|
|TODO|0|
|Placeholder Score|2|
|Business Importance|Low|
|Phase|Phase 1|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### Components\dashboard\PrescriptionHistoryWorkspace.tsx

|Property|Value|
|---|---|
|Purpose|Repository|
|LOC|1377|
|Imports|5|
|Imported By|0|
|Exports|0|
|Interfaces|2|
|Classes|0|
|Enums|0|
|Functions|6|
|TODO|0|
|Placeholder Score|2|
|Business Importance|Low|
|Phase|Phase 1|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### components\dashboard\PrescriptionReview.tsx

|Property|Value|
|---|---|
|Purpose|Validator|
|LOC|426|
|Imports|15|
|Imported By|0|
|Exports|0|
|Interfaces|1|
|Classes|0|
|Enums|0|
|Functions|1|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Low|
|Phase|Phase 1|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### Components\dashboard\PrescriptionReview.tsx

|Property|Value|
|---|---|
|Purpose|Validator|
|LOC|426|
|Imports|15|
|Imported By|0|
|Exports|0|
|Interfaces|1|
|Classes|0|
|Enums|0|
|Functions|1|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Low|
|Phase|Phase 1|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### components\dashboard\PrescriptionWorkspace.styles.ts

|Property|Value|
|---|---|
|Purpose|Unknown|
|LOC|203|
|Imports|1|
|Imported By|1|
|Exports|14|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|0|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Low|
|Phase|Phase 1|
|Recommendation|KEEP|

**Imported By**

- components\dashboard\PrescriptionWorkspace.tsx

--------------------------------------------------------------------------------

### Components\dashboard\PrescriptionWorkspace.styles.ts

|Property|Value|
|---|---|
|Purpose|Unknown|
|LOC|203|
|Imports|1|
|Imported By|1|
|Exports|14|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|0|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Low|
|Phase|Phase 1|
|Recommendation|KEEP|

**Imported By**

- Components\dashboard\PrescriptionWorkspace.tsx

--------------------------------------------------------------------------------

### components\dashboard\PrescriptionWorkspace.tsx

|Property|Value|
|---|---|
|Purpose|Storage|
|LOC|1195|
|Imports|8|
|Imported By|0|
|Exports|0|
|Interfaces|1|
|Classes|0|
|Enums|0|
|Functions|14|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Low|
|Phase|Phase 1|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### Components\dashboard\PrescriptionWorkspace.tsx

|Property|Value|
|---|---|
|Purpose|Storage|
|LOC|1195|
|Imports|8|
|Imported By|0|
|Exports|0|
|Interfaces|1|
|Classes|0|
|Enums|0|
|Functions|14|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Low|
|Phase|Phase 1|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### components\dashboard\UploadCareWorkspace.tsx

|Property|Value|
|---|---|
|Purpose|Storage|
|LOC|1636|
|Imports|6|
|Imported By|0|
|Exports|0|
|Interfaces|2|
|Classes|0|
|Enums|0|
|Functions|8|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Low|
|Phase|Future|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### Components\dashboard\UploadCareWorkspace.tsx

|Property|Value|
|---|---|
|Purpose|Storage|
|LOC|1636|
|Imports|6|
|Imported By|0|
|Exports|0|
|Interfaces|2|
|Classes|0|
|Enums|0|
|Functions|8|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Low|
|Phase|Future|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### components\dashboard\VoiceCareWorkspace.tsx

|Property|Value|
|---|---|
|Purpose|Storage|
|LOC|1250|
|Imports|7|
|Imported By|0|
|Exports|0|
|Interfaces|1|
|Classes|0|
|Enums|0|
|Functions|7|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Low|
|Phase|Future|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### Components\dashboard\VoiceCareWorkspace.tsx

|Property|Value|
|---|---|
|Purpose|Storage|
|LOC|1250|
|Imports|7|
|Imported By|0|
|Exports|0|
|Interfaces|1|
|Classes|0|
|Enums|0|
|Functions|7|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Low|
|Phase|Future|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### components\Header.tsx

|Property|Value|
|---|---|
|Purpose|Storage|
|LOC|99|
|Imports|2|
|Imported By|0|
|Exports|0|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|2|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Low|
|Phase|Future|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### Components\Header.tsx

|Property|Value|
|---|---|
|Purpose|Storage|
|LOC|99|
|Imports|2|
|Imported By|0|
|Exports|0|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|2|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Low|
|Phase|Future|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### components\help\HelpBackButton.tsx

|Property|Value|
|---|---|
|Purpose|React Component|
|LOC|44|
|Imports|2|
|Imported By|0|
|Exports|0|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|1|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Low|
|Phase|Future|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### Components\help\HelpBackButton.tsx

|Property|Value|
|---|---|
|Purpose|React Component|
|LOC|44|
|Imports|2|
|Imported By|0|
|Exports|0|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|1|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Low|
|Phase|Future|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### components\help\HelpCard.tsx

|Property|Value|
|---|---|
|Purpose|Shared Types|
|LOC|104|
|Imports|1|
|Imported By|0|
|Exports|0|
|Interfaces|1|
|Classes|0|
|Enums|0|
|Functions|1|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Low|
|Phase|Future|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### Components\help\HelpCard.tsx

|Property|Value|
|---|---|
|Purpose|Shared Types|
|LOC|104|
|Imports|1|
|Imported By|0|
|Exports|0|
|Interfaces|1|
|Classes|0|
|Enums|0|
|Functions|1|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Low|
|Phase|Future|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### components\language\LanguageProvider.tsx

|Property|Value|
|---|---|
|Purpose|Storage|
|LOC|210|
|Imports|3|
|Imported By|1|
|Exports|2|
|Interfaces|2|
|Classes|0|
|Enums|0|
|Functions|4|
|TODO|0|
|Placeholder Score|1|
|Business Importance|Low|
|Phase|Future|
|Recommendation|KEEP|

**Imported By**

- components\language\LanguageSelector.tsx

--------------------------------------------------------------------------------

### Components\language\LanguageProvider.tsx

|Property|Value|
|---|---|
|Purpose|Storage|
|LOC|210|
|Imports|3|
|Imported By|1|
|Exports|2|
|Interfaces|2|
|Classes|0|
|Enums|0|
|Functions|4|
|TODO|0|
|Placeholder Score|1|
|Business Importance|Low|
|Phase|Future|
|Recommendation|KEEP|

**Imported By**

- Components\language\LanguageSelector.tsx

--------------------------------------------------------------------------------

### components\language\LanguageSelector.tsx

|Property|Value|
|---|---|
|Purpose|React Component|
|LOC|127|
|Imports|3|
|Imported By|0|
|Exports|0|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|1|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Low|
|Phase|Future|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### Components\language\LanguageSelector.tsx

|Property|Value|
|---|---|
|Purpose|React Component|
|LOC|127|
|Imports|3|
|Imported By|0|
|Exports|0|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|1|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Low|
|Phase|Future|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### components\patient\PersonSelector.tsx

|Property|Value|
|---|---|
|Purpose|Storage|
|LOC|686|
|Imports|3|
|Imported By|0|
|Exports|2|
|Interfaces|1|
|Classes|0|
|Enums|0|
|Functions|3|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Low|
|Phase|Future|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### Components\patient\PersonSelector.tsx

|Property|Value|
|---|---|
|Purpose|Storage|
|LOC|686|
|Imports|3|
|Imported By|0|
|Exports|2|
|Interfaces|1|
|Classes|0|
|Enums|0|
|Functions|3|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Low|
|Phase|Future|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### lib\analytics\analyticsEvents.ts

|Property|Value|
|---|---|
|Purpose|Unknown|
|LOC|207|
|Imports|0|
|Imported By|0|
|Exports|5|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|0|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Low|
|Phase|Future|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### lib\analytics\analyticsIdentity.ts

|Property|Value|
|---|---|
|Purpose|Storage|
|LOC|183|
|Imports|0|
|Imported By|0|
|Exports|2|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|3|
|TODO|0|
|Placeholder Score|1|
|Business Importance|Low|
|Phase|Future|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### lib\analytics\analyticsService.ts

|Property|Value|
|---|---|
|Purpose|Unknown|
|LOC|250|
|Imports|3|
|Imported By|0|
|Exports|1|
|Interfaces|0|
|Classes|1|
|Enums|0|
|Functions|0|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Low|
|Phase|Future|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### lib\analytics\analyticsTypes.ts

|Property|Value|
|---|---|
|Purpose|Shared Types|
|LOC|190|
|Imports|0|
|Imported By|0|
|Exports|7|
|Interfaces|2|
|Classes|0|
|Enums|0|
|Functions|0|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Low|
|Phase|Future|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### lib\analytics\authSessionService.ts

|Property|Value|
|---|---|
|Purpose|Storage|
|LOC|280|
|Imports|2|
|Imported By|0|
|Exports|2|
|Interfaces|1|
|Classes|1|
|Enums|0|
|Functions|0|
|TODO|0|
|Placeholder Score|2|
|Business Importance|Low|
|Phase|P0|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### lib\assessmentStorage.ts

|Property|Value|
|---|---|
|Purpose|Storage|
|LOC|48|
|Imports|1|
|Imported By|0|
|Exports|1|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|1|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Low|
|Phase|Phase 2|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### lib\auth\authService.ts

|Property|Value|
|---|---|
|Purpose|Unknown|
|LOC|298|
|Imports|2|
|Imported By|1|
|Exports|2|
|Interfaces|0|
|Classes|1|
|Enums|0|
|Functions|0|
|TODO|0|
|Placeholder Score|2|
|Business Importance|Low|
|Phase|P0|
|Recommendation|KEEP|

**Imported By**

- lib\repositories\profileRepository.ts

--------------------------------------------------------------------------------

### lib\builders\assessmentBuilder.ts

|Property|Value|
|---|---|
|Purpose|Builder|
|LOC|73|
|Imports|3|
|Imported By|0|
|Exports|1|
|Interfaces|0|
|Classes|1|
|Enums|0|
|Functions|0|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Medium|
|Phase|Phase 2|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### lib\builders\clinicalEventBuilder.ts

|Property|Value|
|---|---|
|Purpose|Builder|
|LOC|79|
|Imports|2|
|Imported By|0|
|Exports|1|
|Interfaces|0|
|Classes|1|
|Enums|0|
|Functions|0|
|TODO|0|
|Placeholder Score|0|
|Business Importance|High|
|Phase|Future|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### lib\builders\SelfTrendBuilder.ts

|Property|Value|
|---|---|
|Purpose|Builder|
|LOC|406|
|Imports|4|
|Imported By|0|
|Exports|2|
|Interfaces|0|
|Classes|1|
|Enums|0|
|Functions|0|
|TODO|0|
|Placeholder Score|1|
|Business Importance|Medium|
|Phase|Future|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### lib\builders\TrendBuilder.ts

|Property|Value|
|---|---|
|Purpose|Builder|
|LOC|406|
|Imports|4|
|Imported By|0|
|Exports|2|
|Interfaces|0|
|Classes|1|
|Enums|0|
|Functions|0|
|TODO|0|
|Placeholder Score|1|
|Business Importance|Medium|
|Phase|Future|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### lib\clinical-intelligence\ClarificationEngine.ts

|Property|Value|
|---|---|
|Purpose|Unknown|
|LOC|0|
|Imports|0|
|Imported By|0|
|Exports|0|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|0|
|TODO|0|
|Placeholder Score|0|
|Business Importance|High|
|Phase|Future|
|Recommendation|DELETE|

--------------------------------------------------------------------------------

### lib\clinical-intelligence\ClinicalComparisonEngine.ts

|Property|Value|
|---|---|
|Purpose|Builder|
|LOC|1677|
|Imports|2|
|Imported By|0|
|Exports|1|
|Interfaces|0|
|Classes|1|
|Enums|0|
|Functions|0|
|TODO|0|
|Placeholder Score|1|
|Business Importance|High|
|Phase|Future|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### lib\clinical-intelligence\comparisonTypes.ts

|Property|Value|
|---|---|
|Purpose|Business Engine|
|LOC|465|
|Imports|1|
|Imported By|1|
|Exports|36|
|Interfaces|19|
|Classes|0|
|Enums|0|
|Functions|0|
|TODO|0|
|Placeholder Score|0|
|Business Importance|High|
|Phase|Future|
|Recommendation|KEEP|

**Imported By**

- lib\clinical-intelligence\ClinicalComparisonEngine.ts

--------------------------------------------------------------------------------

### lib\clinical-intelligence\index.ts

|Property|Value|
|---|---|
|Purpose|Unknown|
|LOC|0|
|Imports|0|
|Imported By|0|
|Exports|0|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|0|
|TODO|0|
|Placeholder Score|0|
|Business Importance|High|
|Phase|Future|
|Recommendation|DELETE|

--------------------------------------------------------------------------------

### lib\clinical-summary\ClinicalSummaryEngine.ts

|Property|Value|
|---|---|
|Purpose|Business Engine|
|LOC|319|
|Imports|5|
|Imported By|0|
|Exports|1|
|Interfaces|0|
|Classes|1|
|Enums|0|
|Functions|1|
|TODO|0|
|Placeholder Score|0|
|Business Importance|High|
|Phase|Future|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### lib\clinical-summary\ClinicalSummaryTypes.ts

|Property|Value|
|---|---|
|Purpose|Shared Types|
|LOC|70|
|Imports|0|
|Imported By|5|
|Exports|5|
|Interfaces|4|
|Classes|0|
|Enums|0|
|Functions|0|
|TODO|0|
|Placeholder Score|0|
|Business Importance|High|
|Phase|Future|
|Recommendation|KEEP|

**Imported By**

- lib\clinical-summary\ClinicalSummaryEngine.ts
- lib\clinical-summary\PainAnalyzer.ts
- lib\clinical-summary\SymptomsAnalyzer.ts
- lib\clinical-summary\TemperatureAnalyzer.ts
- lib\clinical-summary\VitalsAnalyzer.ts

--------------------------------------------------------------------------------

### lib\clinical-summary\PainAnalyzer.ts

|Property|Value|
|---|---|
|Purpose|Unknown|
|LOC|88|
|Imports|1|
|Imported By|1|
|Exports|1|
|Interfaces|0|
|Classes|1|
|Enums|0|
|Functions|0|
|TODO|0|
|Placeholder Score|0|
|Business Importance|High|
|Phase|Future|
|Recommendation|KEEP|

**Imported By**

- lib\clinical-summary\ClinicalSummaryEngine.ts

--------------------------------------------------------------------------------

### lib\clinical-summary\RecommendationEngine.ts

|Property|Value|
|---|---|
|Purpose|Unknown|
|LOC|0|
|Imports|0|
|Imported By|0|
|Exports|0|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|0|
|TODO|0|
|Placeholder Score|0|
|Business Importance|High|
|Phase|Future|
|Recommendation|DELETE|

--------------------------------------------------------------------------------

### lib\clinical-summary\SymptomsAnalyzer.ts

|Property|Value|
|---|---|
|Purpose|Unknown|
|LOC|200|
|Imports|1|
|Imported By|1|
|Exports|1|
|Interfaces|0|
|Classes|1|
|Enums|0|
|Functions|0|
|TODO|0|
|Placeholder Score|0|
|Business Importance|High|
|Phase|Future|
|Recommendation|KEEP|

**Imported By**

- lib\clinical-summary\ClinicalSummaryEngine.ts

--------------------------------------------------------------------------------

### lib\clinical-summary\TemperatureAnalyzer.ts

|Property|Value|
|---|---|
|Purpose|Unknown|
|LOC|134|
|Imports|1|
|Imported By|1|
|Exports|1|
|Interfaces|0|
|Classes|1|
|Enums|0|
|Functions|0|
|TODO|0|
|Placeholder Score|0|
|Business Importance|High|
|Phase|Future|
|Recommendation|KEEP|

**Imported By**

- lib\clinical-summary\ClinicalSummaryEngine.ts

--------------------------------------------------------------------------------

### lib\clinical-summary\VitalsAnalyzer.ts

|Property|Value|
|---|---|
|Purpose|Unknown|
|LOC|151|
|Imports|1|
|Imported By|1|
|Exports|1|
|Interfaces|0|
|Classes|1|
|Enums|0|
|Functions|0|
|TODO|0|
|Placeholder Score|0|
|Business Importance|High|
|Phase|Future|
|Recommendation|KEEP|

**Imported By**

- lib\clinical-summary\ClinicalSummaryEngine.ts

--------------------------------------------------------------------------------

### lib\config\consent.ts

|Property|Value|
|---|---|
|Purpose|Unknown|
|LOC|11|
|Imports|0|
|Imported By|0|
|Exports|6|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|0|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Low|
|Phase|P0|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### lib\consent\mapper\consentMapper.ts

|Property|Value|
|---|---|
|Purpose|Mapper|
|LOC|131|
|Imports|1|
|Imported By|0|
|Exports|2|
|Interfaces|1|
|Classes|1|
|Enums|0|
|Functions|0|
|TODO|1|
|Placeholder Score|1|
|Business Importance|Medium|
|Phase|P0|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### lib\consent\models\Consent.ts

|Property|Value|
|---|---|
|Purpose|Shared Types|
|LOC|27|
|Imports|0|
|Imported By|0|
|Exports|1|
|Interfaces|1|
|Classes|0|
|Enums|0|
|Functions|0|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Low|
|Phase|P0|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### lib\consent\repository\consentRepository.ts

|Property|Value|
|---|---|
|Purpose|Repository|
|LOC|122|
|Imports|5|
|Imported By|0|
|Exports|2|
|Interfaces|0|
|Classes|1|
|Enums|0|
|Functions|0|
|TODO|2|
|Placeholder Score|2|
|Business Importance|Critical|
|Phase|P0|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### lib\consent\storage\consentStorage.ts

|Property|Value|
|---|---|
|Purpose|Repository|
|LOC|69|
|Imports|4|
|Imported By|0|
|Exports|2|
|Interfaces|0|
|Classes|1|
|Enums|0|
|Functions|0|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Critical|
|Phase|P0|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### lib\constants\consentVersions.ts

|Property|Value|
|---|---|
|Purpose|Unknown|
|LOC|15|
|Imports|0|
|Imported By|0|
|Exports|6|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|0|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Low|
|Phase|P0|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### lib\database.ts

|Property|Value|
|---|---|
|Purpose|Shared Types|
|LOC|63|
|Imports|0|
|Imported By|4|
|Exports|3|
|Interfaces|3|
|Classes|0|
|Enums|0|
|Functions|0|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Low|
|Phase|Future|
|Recommendation|KEEP|

**Imported By**

- lib\mappers\PatientMapper.ts
- lib\mappers\SelfProfileMapper.ts
- lib\repositories\patientRepository.ts
- lib\repositories\SelfProfileRepository.ts

--------------------------------------------------------------------------------

### lib\i18n\config.ts

|Property|Value|
|---|---|
|Purpose|Shared Types|
|LOC|78|
|Imports|1|
|Imported By|0|
|Exports|4|
|Interfaces|1|
|Classes|0|
|Enums|0|
|Functions|0|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Low|
|Phase|Future|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### lib\i18n\index.ts

|Property|Value|
|---|---|
|Purpose|Utility|
|LOC|114|
|Imports|13|
|Imported By|0|
|Exports|2|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|2|
|TODO|0|
|Placeholder Score|1|
|Business Importance|Low|
|Phase|Future|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### lib\i18n\translations\as.ts

|Property|Value|
|---|---|
|Purpose|Unknown|
|LOC|1338|
|Imports|1|
|Imported By|1|
|Exports|1|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|0|
|TODO|2|
|Placeholder Score|2|
|Business Importance|Low|
|Phase|Future|
|Recommendation|KEEP|

**Imported By**

- lib\i18n\index.ts

--------------------------------------------------------------------------------

### lib\i18n\translations\bn.ts

|Property|Value|
|---|---|
|Purpose|Unknown|
|LOC|1228|
|Imports|1|
|Imported By|1|
|Exports|1|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|0|
|TODO|2|
|Placeholder Score|2|
|Business Importance|Low|
|Phase|Future|
|Recommendation|KEEP|

**Imported By**

- lib\i18n\index.ts

--------------------------------------------------------------------------------

### lib\i18n\translations\en.ts

|Property|Value|
|---|---|
|Purpose|Unknown|
|LOC|1381|
|Imports|1|
|Imported By|1|
|Exports|1|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|0|
|TODO|2|
|Placeholder Score|2|
|Business Importance|Low|
|Phase|Future|
|Recommendation|KEEP|

**Imported By**

- lib\i18n\index.ts

--------------------------------------------------------------------------------

### lib\i18n\translations\gu.ts

|Property|Value|
|---|---|
|Purpose|Unknown|
|LOC|1335|
|Imports|1|
|Imported By|1|
|Exports|1|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|0|
|TODO|2|
|Placeholder Score|2|
|Business Importance|Low|
|Phase|Future|
|Recommendation|KEEP|

**Imported By**

- lib\i18n\index.ts

--------------------------------------------------------------------------------

### lib\i18n\translations\hi.ts

|Property|Value|
|---|---|
|Purpose|Unknown|
|LOC|1224|
|Imports|1|
|Imported By|1|
|Exports|1|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|0|
|TODO|2|
|Placeholder Score|2|
|Business Importance|Low|
|Phase|Future|
|Recommendation|KEEP|

**Imported By**

- lib\i18n\index.ts

--------------------------------------------------------------------------------

### lib\i18n\translations\kn.ts

|Property|Value|
|---|---|
|Purpose|Unknown|
|LOC|1225|
|Imports|1|
|Imported By|1|
|Exports|1|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|0|
|TODO|2|
|Placeholder Score|2|
|Business Importance|Low|
|Phase|Future|
|Recommendation|KEEP|

**Imported By**

- lib\i18n\index.ts

--------------------------------------------------------------------------------

### lib\i18n\translations\ml.ts

|Property|Value|
|---|---|
|Purpose|Unknown|
|LOC|1227|
|Imports|1|
|Imported By|1|
|Exports|1|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|0|
|TODO|2|
|Placeholder Score|2|
|Business Importance|Low|
|Phase|Future|
|Recommendation|KEEP|

**Imported By**

- lib\i18n\index.ts

--------------------------------------------------------------------------------

### lib\i18n\translations\mr.ts

|Property|Value|
|---|---|
|Purpose|Unknown|
|LOC|1228|
|Imports|1|
|Imported By|1|
|Exports|1|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|0|
|TODO|2|
|Placeholder Score|2|
|Business Importance|Low|
|Phase|Future|
|Recommendation|KEEP|

**Imported By**

- lib\i18n\index.ts

--------------------------------------------------------------------------------

### lib\i18n\translations\or.ts

|Property|Value|
|---|---|
|Purpose|Unknown|
|LOC|1278|
|Imports|1|
|Imported By|1|
|Exports|1|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|0|
|TODO|2|
|Placeholder Score|2|
|Business Importance|Low|
|Phase|Future|
|Recommendation|KEEP|

**Imported By**

- lib\i18n\index.ts

--------------------------------------------------------------------------------

### lib\i18n\translations\pa.ts

|Property|Value|
|---|---|
|Purpose|Unknown|
|LOC|1338|
|Imports|1|
|Imported By|1|
|Exports|1|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|0|
|TODO|2|
|Placeholder Score|2|
|Business Importance|Low|
|Phase|Future|
|Recommendation|KEEP|

**Imported By**

- lib\i18n\index.ts

--------------------------------------------------------------------------------

### lib\i18n\translations\ta.ts

|Property|Value|
|---|---|
|Purpose|Unknown|
|LOC|1228|
|Imports|1|
|Imported By|1|
|Exports|1|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|0|
|TODO|2|
|Placeholder Score|2|
|Business Importance|Low|
|Phase|Future|
|Recommendation|KEEP|

**Imported By**

- lib\i18n\index.ts

--------------------------------------------------------------------------------

### lib\i18n\translations\te.ts

|Property|Value|
|---|---|
|Purpose|Unknown|
|LOC|1228|
|Imports|1|
|Imported By|1|
|Exports|1|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|0|
|TODO|2|
|Placeholder Score|2|
|Business Importance|Low|
|Phase|Future|
|Recommendation|KEEP|

**Imported By**

- lib\i18n\index.ts

--------------------------------------------------------------------------------

### lib\i18n\types.ts

|Property|Value|
|---|---|
|Purpose|Unknown|
|LOC|23|
|Imports|0|
|Imported By|14|
|Exports|3|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|0|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Medium|
|Phase|Future|
|Recommendation|KEEP|

**Imported By**

- lib\i18n\config.ts
- lib\i18n\index.ts
- lib\i18n\translations\as.ts
- lib\i18n\translations\bn.ts
- lib\i18n\translations\en.ts
- lib\i18n\translations\gu.ts
- lib\i18n\translations\hi.ts
- lib\i18n\translations\kn.ts
- lib\i18n\translations\ml.ts
- lib\i18n\translations\mr.ts
- lib\i18n\translations\or.ts
- lib\i18n\translations\pa.ts
- lib\i18n\translations\ta.ts
- lib\i18n\translations\te.ts

--------------------------------------------------------------------------------

### lib\journey\activeTreatment\index.ts

|Property|Value|
|---|---|
|Purpose|Unknown|
|LOC|2|
|Imports|0|
|Imported By|0|
|Exports|0|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|0|
|TODO|1|
|Placeholder Score|1|
|Business Importance|High|
|Phase|Phase 3|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### lib\journey\activeTreatment\lifecycleEngine.ts

|Property|Value|
|---|---|
|Purpose|Business Engine|
|LOC|4|
|Imports|0|
|Imported By|0|
|Exports|1|
|Interfaces|0|
|Classes|1|
|Enums|0|
|Functions|0|
|TODO|1|
|Placeholder Score|1|
|Business Importance|High|
|Phase|Phase 3|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### lib\journey\activeTreatment\lifecycleMapper.ts

|Property|Value|
|---|---|
|Purpose|Mapper|
|LOC|4|
|Imports|0|
|Imported By|0|
|Exports|1|
|Interfaces|0|
|Classes|1|
|Enums|0|
|Functions|0|
|TODO|1|
|Placeholder Score|1|
|Business Importance|High|
|Phase|Phase 3|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### lib\journey\activeTreatment\lifecycleRepository.ts

|Property|Value|
|---|---|
|Purpose|Repository|
|LOC|4|
|Imports|0|
|Imported By|0|
|Exports|1|
|Interfaces|0|
|Classes|1|
|Enums|0|
|Functions|0|
|TODO|1|
|Placeholder Score|1|
|Business Importance|High|
|Phase|Phase 3|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### lib\journey\activeTreatment\lifecycleRules.ts

|Property|Value|
|---|---|
|Purpose|Unknown|
|LOC|4|
|Imports|0|
|Imported By|0|
|Exports|0|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|0|
|TODO|1|
|Placeholder Score|1|
|Business Importance|High|
|Phase|Phase 3|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### lib\journey\activeTreatment\lifecycleStorage.ts

|Property|Value|
|---|---|
|Purpose|Storage|
|LOC|4|
|Imports|0|
|Imported By|0|
|Exports|1|
|Interfaces|0|
|Classes|1|
|Enums|0|
|Functions|0|
|TODO|1|
|Placeholder Score|1|
|Business Importance|High|
|Phase|Phase 3|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### lib\journey\activeTreatment\lifecycleTypes.ts

|Property|Value|
|---|---|
|Purpose|Unknown|
|LOC|4|
|Imports|0|
|Imported By|0|
|Exports|0|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|0|
|TODO|1|
|Placeholder Score|1|
|Business Importance|High|
|Phase|Phase 3|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### lib\journey\activeTreatment\lifecycleValidator.ts

|Property|Value|
|---|---|
|Purpose|Validator|
|LOC|4|
|Imports|0|
|Imported By|0|
|Exports|1|
|Interfaces|0|
|Classes|1|
|Enums|0|
|Functions|0|
|TODO|1|
|Placeholder Score|1|
|Business Importance|High|
|Phase|Phase 3|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### lib\journey\activeTreatment\models\lifecycleModel.ts

|Property|Value|
|---|---|
|Purpose|Shared Types|
|LOC|4|
|Imports|0|
|Imported By|0|
|Exports|1|
|Interfaces|1|
|Classes|0|
|Enums|0|
|Functions|0|
|TODO|1|
|Placeholder Score|1|
|Business Importance|High|
|Phase|Phase 3|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### lib\journey\classification\classificationMapper.ts

|Property|Value|
|---|---|
|Purpose|Mapper|
|LOC|4|
|Imports|0|
|Imported By|0|
|Exports|1|
|Interfaces|0|
|Classes|1|
|Enums|0|
|Functions|0|
|TODO|1|
|Placeholder Score|1|
|Business Importance|High|
|Phase|Phase 3|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### lib\journey\classification\classificationRepository.ts

|Property|Value|
|---|---|
|Purpose|Repository|
|LOC|4|
|Imports|0|
|Imported By|0|
|Exports|1|
|Interfaces|0|
|Classes|1|
|Enums|0|
|Functions|0|
|TODO|1|
|Placeholder Score|1|
|Business Importance|High|
|Phase|Phase 3|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### lib\journey\classification\classificationRules.ts

|Property|Value|
|---|---|
|Purpose|Unknown|
|LOC|4|
|Imports|0|
|Imported By|0|
|Exports|0|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|0|
|TODO|1|
|Placeholder Score|1|
|Business Importance|High|
|Phase|Phase 3|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### lib\journey\classification\classificationStorage.ts

|Property|Value|
|---|---|
|Purpose|Storage|
|LOC|4|
|Imports|0|
|Imported By|0|
|Exports|1|
|Interfaces|0|
|Classes|1|
|Enums|0|
|Functions|0|
|TODO|1|
|Placeholder Score|1|
|Business Importance|High|
|Phase|Phase 3|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### lib\journey\classification\classificationTypes.ts

|Property|Value|
|---|---|
|Purpose|Unknown|
|LOC|4|
|Imports|0|
|Imported By|0|
|Exports|0|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|0|
|TODO|1|
|Placeholder Score|1|
|Business Importance|High|
|Phase|Phase 3|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### lib\journey\classification\classificationValidator.ts

|Property|Value|
|---|---|
|Purpose|Validator|
|LOC|4|
|Imports|0|
|Imported By|0|
|Exports|1|
|Interfaces|0|
|Classes|1|
|Enums|0|
|Functions|0|
|TODO|1|
|Placeholder Score|1|
|Business Importance|High|
|Phase|Phase 3|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### lib\journey\classification\consultationClassifier.ts

|Property|Value|
|---|---|
|Purpose|Unknown|
|LOC|4|
|Imports|0|
|Imported By|0|
|Exports|1|
|Interfaces|0|
|Classes|1|
|Enums|0|
|Functions|0|
|TODO|1|
|Placeholder Score|1|
|Business Importance|High|
|Phase|Phase 3|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### lib\journey\classification\index.ts

|Property|Value|
|---|---|
|Purpose|Unknown|
|LOC|0|
|Imports|0|
|Imported By|0|
|Exports|0|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|0|
|TODO|0|
|Placeholder Score|0|
|Business Importance|High|
|Phase|Phase 3|
|Recommendation|DELETE|

--------------------------------------------------------------------------------

### lib\journey\classification\journeyClassificationEngine.ts

|Property|Value|
|---|---|
|Purpose|Business Engine|
|LOC|4|
|Imports|0|
|Imported By|0|
|Exports|1|
|Interfaces|0|
|Classes|1|
|Enums|0|
|Functions|0|
|TODO|1|
|Placeholder Score|1|
|Business Importance|High|
|Phase|Phase 3|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### lib\journey\classification\models\classificationModel.ts

|Property|Value|
|---|---|
|Purpose|Shared Types|
|LOC|4|
|Imports|0|
|Imported By|0|
|Exports|1|
|Interfaces|1|
|Classes|0|
|Enums|0|
|Functions|0|
|TODO|1|
|Placeholder Score|1|
|Business Importance|High|
|Phase|Phase 3|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### lib\journey\context\index.ts

|Property|Value|
|---|---|
|Purpose|Unknown|
|LOC|2|
|Imports|0|
|Imported By|0|
|Exports|0|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|0|
|TODO|1|
|Placeholder Score|1|
|Business Importance|High|
|Phase|Phase 3|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### lib\journey\context\journeyContext.ts

|Property|Value|
|---|---|
|Purpose|Business Engine|
|LOC|69|
|Imports|0|
|Imported By|0|
|Exports|1|
|Interfaces|1|
|Classes|0|
|Enums|0|
|Functions|0|
|TODO|0|
|Placeholder Score|0|
|Business Importance|High|
|Phase|Phase 3|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### lib\journey\context\journeyContextBuilder.ts

|Property|Value|
|---|---|
|Purpose|Builder|
|LOC|4|
|Imports|0|
|Imported By|0|
|Exports|1|
|Interfaces|0|
|Classes|1|
|Enums|0|
|Functions|0|
|TODO|1|
|Placeholder Score|1|
|Business Importance|High|
|Phase|Phase 3|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### lib\journey\context\journeyContextValidator.ts

|Property|Value|
|---|---|
|Purpose|Validator|
|LOC|4|
|Imports|0|
|Imported By|0|
|Exports|1|
|Interfaces|0|
|Classes|1|
|Enums|0|
|Functions|0|
|TODO|1|
|Placeholder Score|1|
|Business Importance|High|
|Phase|Phase 3|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### lib\journey\governance\governanceEngine.ts

|Property|Value|
|---|---|
|Purpose|Business Engine|
|LOC|4|
|Imports|0|
|Imported By|0|
|Exports|1|
|Interfaces|0|
|Classes|1|
|Enums|0|
|Functions|0|
|TODO|1|
|Placeholder Score|1|
|Business Importance|High|
|Phase|Phase 3|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### lib\journey\governance\governanceRepository.ts

|Property|Value|
|---|---|
|Purpose|Repository|
|LOC|4|
|Imports|0|
|Imported By|0|
|Exports|1|
|Interfaces|0|
|Classes|1|
|Enums|0|
|Functions|0|
|TODO|1|
|Placeholder Score|1|
|Business Importance|High|
|Phase|Phase 3|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### lib\journey\governance\governanceRules.ts

|Property|Value|
|---|---|
|Purpose|Unknown|
|LOC|4|
|Imports|0|
|Imported By|0|
|Exports|0|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|0|
|TODO|1|
|Placeholder Score|1|
|Business Importance|High|
|Phase|Phase 3|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### lib\journey\governance\governanceStorage.ts

|Property|Value|
|---|---|
|Purpose|Storage|
|LOC|4|
|Imports|0|
|Imported By|0|
|Exports|1|
|Interfaces|0|
|Classes|1|
|Enums|0|
|Functions|0|
|TODO|1|
|Placeholder Score|1|
|Business Importance|High|
|Phase|Phase 3|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### lib\journey\governance\governanceTypes.ts

|Property|Value|
|---|---|
|Purpose|Unknown|
|LOC|4|
|Imports|0|
|Imported By|0|
|Exports|0|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|0|
|TODO|1|
|Placeholder Score|1|
|Business Importance|High|
|Phase|Phase 3|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### lib\journey\governance\governanceValidator.ts

|Property|Value|
|---|---|
|Purpose|Validator|
|LOC|4|
|Imports|0|
|Imported By|0|
|Exports|1|
|Interfaces|0|
|Classes|1|
|Enums|0|
|Functions|0|
|TODO|1|
|Placeholder Score|1|
|Business Importance|High|
|Phase|Phase 3|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### lib\journey\governance\index.ts

|Property|Value|
|---|---|
|Purpose|Unknown|
|LOC|2|
|Imports|0|
|Imported By|0|
|Exports|0|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|0|
|TODO|1|
|Placeholder Score|1|
|Business Importance|High|
|Phase|Phase 3|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### lib\journey\governance\models\governanceModel.ts

|Property|Value|
|---|---|
|Purpose|Shared Types|
|LOC|4|
|Imports|0|
|Imported By|0|
|Exports|1|
|Interfaces|1|
|Classes|0|
|Enums|0|
|Functions|0|
|TODO|1|
|Placeholder Score|1|
|Business Importance|High|
|Phase|Phase 3|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### lib\journey\index.ts

|Property|Value|
|---|---|
|Purpose|Repository|
|LOC|26|
|Imports|0|
|Imported By|0|
|Exports|0|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|0|
|TODO|0|
|Placeholder Score|0|
|Business Importance|High|
|Phase|Phase 3|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### lib\journey\JourneyAnalysisEngine.ts

|Property|Value|
|---|---|
|Purpose|Builder|
|LOC|195|
|Imports|8|
|Imported By|0|
|Exports|1|
|Interfaces|0|
|Classes|1|
|Enums|0|
|Functions|1|
|TODO|0|
|Placeholder Score|1|
|Business Importance|High|
|Phase|Phase 3|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### lib\journey\journeyConstants.ts

|Property|Value|
|---|---|
|Purpose|Business Engine|
|LOC|187|
|Imports|1|
|Imported By|1|
|Exports|20|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|0|
|TODO|0|
|Placeholder Score|0|
|Business Importance|High|
|Phase|Phase 3|
|Recommendation|KEEP|

**Imported By**

- lib\journey\JourneyAnalysisEngine.ts

--------------------------------------------------------------------------------

### lib\journey\journeyMapper.ts

|Property|Value|
|---|---|
|Purpose|Mapper|
|LOC|124|
|Imports|1|
|Imported By|1|
|Exports|1|
|Interfaces|0|
|Classes|1|
|Enums|0|
|Functions|0|
|TODO|0|
|Placeholder Score|0|
|Business Importance|High|
|Phase|Phase 3|
|Recommendation|KEEP|

**Imported By**

- lib\journey\journeyRepository.ts

--------------------------------------------------------------------------------

### lib\journey\journeyModels.ts

|Property|Value|
|---|---|
|Purpose|Shared Types|
|LOC|331|
|Imports|2|
|Imported By|8|
|Exports|14|
|Interfaces|14|
|Classes|0|
|Enums|0|
|Functions|0|
|TODO|0|
|Placeholder Score|1|
|Business Importance|High|
|Phase|Phase 3|
|Recommendation|KEEP|

**Imported By**

- lib\journey\JourneyAnalysisEngine.ts
- lib\journey\journeyMapper.ts
- lib\journey\journeyRepository.ts
- lib\journey\journeyUtils.ts
- lib\journey\journeyValidation.ts
- lib\journey\questionBuilder.ts
- lib\journey\summaryBuilder.ts
- lib\journey\timelineBuilder.ts

--------------------------------------------------------------------------------

### lib\journey\journeyRepository.ts

|Property|Value|
|---|---|
|Purpose|Repository|
|LOC|123|
|Imports|3|
|Imported By|0|
|Exports|1|
|Interfaces|0|
|Classes|1|
|Enums|0|
|Functions|0|
|TODO|0|
|Placeholder Score|1|
|Business Importance|High|
|Phase|Phase 3|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### lib\journey\journeyRules.ts

|Property|Value|
|---|---|
|Purpose|Shared Types|
|LOC|205|
|Imports|1|
|Imported By|3|
|Exports|3|
|Interfaces|1|
|Classes|0|
|Enums|0|
|Functions|0|
|TODO|0|
|Placeholder Score|0|
|Business Importance|High|
|Phase|Phase 3|
|Recommendation|KEEP|

**Imported By**

- lib\journey\journeyUtils.ts
- lib\journey\questionBuilder.ts
- lib\journey\timelineBuilder.ts

--------------------------------------------------------------------------------

### lib\journey\journeyStorage.ts

|Property|Value|
|---|---|
|Purpose|Storage|
|LOC|169|
|Imports|1|
|Imported By|1|
|Exports|1|
|Interfaces|0|
|Classes|1|
|Enums|0|
|Functions|0|
|TODO|0|
|Placeholder Score|2|
|Business Importance|High|
|Phase|Phase 3|
|Recommendation|KEEP|

**Imported By**

- lib\journey\journeyRepository.ts

--------------------------------------------------------------------------------

### lib\journey\journeyTypes.ts

|Property|Value|
|---|---|
|Purpose|Unknown|
|LOC|157|
|Imports|0|
|Imported By|6|
|Exports|10|
|Interfaces|0|
|Classes|0|
|Enums|10|
|Functions|0|
|TODO|0|
|Placeholder Score|0|
|Business Importance|High|
|Phase|Phase 3|
|Recommendation|KEEP|

**Imported By**

- lib\journey\JourneyAnalysisEngine.ts
- lib\journey\journeyConstants.ts
- lib\journey\journeyModels.ts
- lib\journey\journeyRules.ts
- lib\journey\journeyUtils.ts
- lib\journey\questionBuilder.ts

--------------------------------------------------------------------------------

### lib\journey\journeyUtils.ts

|Property|Value|
|---|---|
|Purpose|Unknown|
|LOC|150|
|Imports|3|
|Imported By|2|
|Exports|1|
|Interfaces|0|
|Classes|1|
|Enums|0|
|Functions|0|
|TODO|0|
|Placeholder Score|0|
|Business Importance|High|
|Phase|Phase 3|
|Recommendation|KEEP|

**Imported By**

- lib\journey\questionBuilder.ts
- lib\journey\timelineBuilder.ts

--------------------------------------------------------------------------------

### lib\journey\journeyValidation.ts

|Property|Value|
|---|---|
|Purpose|Unknown|
|LOC|111|
|Imports|1|
|Imported By|1|
|Exports|1|
|Interfaces|0|
|Classes|1|
|Enums|0|
|Functions|0|
|TODO|0|
|Placeholder Score|1|
|Business Importance|High|
|Phase|Phase 3|
|Recommendation|KEEP|

**Imported By**

- lib\journey\JourneyAnalysisEngine.ts

--------------------------------------------------------------------------------

### lib\journey\questionBuilder.ts

|Property|Value|
|---|---|
|Purpose|Builder|
|LOC|100|
|Imports|4|
|Imported By|1|
|Exports|1|
|Interfaces|0|
|Classes|1|
|Enums|0|
|Functions|0|
|TODO|0|
|Placeholder Score|1|
|Business Importance|High|
|Phase|Phase 3|
|Recommendation|KEEP|

**Imported By**

- lib\journey\JourneyAnalysisEngine.ts

--------------------------------------------------------------------------------

### lib\journey\scenarios\index.ts

|Property|Value|
|---|---|
|Purpose|Unknown|
|LOC|2|
|Imports|0|
|Imported By|0|
|Exports|0|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|0|
|TODO|1|
|Placeholder Score|1|
|Business Importance|High|
|Phase|Phase 3|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### lib\journey\scenarios\models\scenarioModel.ts

|Property|Value|
|---|---|
|Purpose|Shared Types|
|LOC|4|
|Imports|0|
|Imported By|0|
|Exports|1|
|Interfaces|1|
|Classes|0|
|Enums|0|
|Functions|0|
|TODO|1|
|Placeholder Score|1|
|Business Importance|High|
|Phase|Phase 3|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### lib\journey\scenarios\scenarioEngine.ts

|Property|Value|
|---|---|
|Purpose|Business Engine|
|LOC|4|
|Imports|0|
|Imported By|0|
|Exports|1|
|Interfaces|0|
|Classes|1|
|Enums|0|
|Functions|0|
|TODO|1|
|Placeholder Score|1|
|Business Importance|High|
|Phase|Phase 3|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### lib\journey\scenarios\scenarioRegistry.ts

|Property|Value|
|---|---|
|Purpose|Unknown|
|LOC|4|
|Imports|0|
|Imported By|0|
|Exports|1|
|Interfaces|0|
|Classes|1|
|Enums|0|
|Functions|0|
|TODO|1|
|Placeholder Score|1|
|Business Importance|High|
|Phase|Phase 3|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### lib\journey\scenarios\scenarioResolver.ts

|Property|Value|
|---|---|
|Purpose|Unknown|
|LOC|4|
|Imports|0|
|Imported By|0|
|Exports|1|
|Interfaces|0|
|Classes|1|
|Enums|0|
|Functions|0|
|TODO|1|
|Placeholder Score|1|
|Business Importance|High|
|Phase|Phase 3|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### lib\journey\scenarios\scenarioRules.ts

|Property|Value|
|---|---|
|Purpose|Unknown|
|LOC|4|
|Imports|0|
|Imported By|0|
|Exports|0|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|0|
|TODO|1|
|Placeholder Score|1|
|Business Importance|High|
|Phase|Phase 3|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### lib\journey\scenarios\scenarioTypes.ts

|Property|Value|
|---|---|
|Purpose|Unknown|
|LOC|4|
|Imports|0|
|Imported By|0|
|Exports|0|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|0|
|TODO|1|
|Placeholder Score|1|
|Business Importance|High|
|Phase|Phase 3|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### lib\journey\scenarios\scenarioValidator.ts

|Property|Value|
|---|---|
|Purpose|Validator|
|LOC|4|
|Imports|0|
|Imported By|0|
|Exports|1|
|Interfaces|0|
|Classes|1|
|Enums|0|
|Functions|0|
|TODO|1|
|Placeholder Score|1|
|Business Importance|High|
|Phase|Phase 3|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### lib\journey\summaryBuilder.ts

|Property|Value|
|---|---|
|Purpose|Builder|
|LOC|73|
|Imports|1|
|Imported By|1|
|Exports|1|
|Interfaces|0|
|Classes|1|
|Enums|0|
|Functions|1|
|TODO|0|
|Placeholder Score|1|
|Business Importance|High|
|Phase|Phase 3|
|Recommendation|KEEP|

**Imported By**

- lib\journey\JourneyAnalysisEngine.ts

--------------------------------------------------------------------------------

### lib\journey\timeline\index.ts

|Property|Value|
|---|---|
|Purpose|Unknown|
|LOC|2|
|Imports|0|
|Imported By|0|
|Exports|0|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|0|
|TODO|1|
|Placeholder Score|1|
|Business Importance|High|
|Phase|Phase 3|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### lib\journey\timeline\models\timelineEventModel.ts

|Property|Value|
|---|---|
|Purpose|Shared Types|
|LOC|4|
|Imports|0|
|Imported By|0|
|Exports|1|
|Interfaces|1|
|Classes|0|
|Enums|0|
|Functions|0|
|TODO|1|
|Placeholder Score|1|
|Business Importance|High|
|Phase|Phase 3|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### lib\journey\timeline\timelineEventBuilder.ts

|Property|Value|
|---|---|
|Purpose|Builder|
|LOC|4|
|Imports|0|
|Imported By|0|
|Exports|1|
|Interfaces|0|
|Classes|1|
|Enums|0|
|Functions|0|
|TODO|1|
|Placeholder Score|1|
|Business Importance|High|
|Phase|Phase 3|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### lib\journey\timeline\timelineEventGenerator.ts

|Property|Value|
|---|---|
|Purpose|Unknown|
|LOC|2|
|Imports|0|
|Imported By|0|
|Exports|0|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|0|
|TODO|1|
|Placeholder Score|1|
|Business Importance|High|
|Phase|Phase 3|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### lib\journey\timeline\timelineEventRepository.ts

|Property|Value|
|---|---|
|Purpose|Repository|
|LOC|4|
|Imports|0|
|Imported By|0|
|Exports|1|
|Interfaces|0|
|Classes|1|
|Enums|0|
|Functions|0|
|TODO|1|
|Placeholder Score|1|
|Business Importance|High|
|Phase|Phase 3|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### lib\journey\timeline\timelineEventRules.ts

|Property|Value|
|---|---|
|Purpose|Unknown|
|LOC|4|
|Imports|0|
|Imported By|0|
|Exports|0|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|0|
|TODO|1|
|Placeholder Score|1|
|Business Importance|High|
|Phase|Phase 3|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### lib\journey\timeline\timelineEventStorage.ts

|Property|Value|
|---|---|
|Purpose|Storage|
|LOC|4|
|Imports|0|
|Imported By|0|
|Exports|1|
|Interfaces|0|
|Classes|1|
|Enums|0|
|Functions|0|
|TODO|1|
|Placeholder Score|1|
|Business Importance|High|
|Phase|Phase 3|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### lib\journey\timeline\timelineEventTypes.ts

|Property|Value|
|---|---|
|Purpose|Unknown|
|LOC|4|
|Imports|0|
|Imported By|0|
|Exports|0|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|0|
|TODO|1|
|Placeholder Score|1|
|Business Importance|High|
|Phase|Phase 3|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### lib\journey\timeline\timelineEventValidator.ts

|Property|Value|
|---|---|
|Purpose|Validator|
|LOC|4|
|Imports|0|
|Imported By|0|
|Exports|1|
|Interfaces|0|
|Classes|1|
|Enums|0|
|Functions|0|
|TODO|1|
|Placeholder Score|1|
|Business Importance|High|
|Phase|Phase 3|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### lib\journey\timelineBuilder.ts

|Property|Value|
|---|---|
|Purpose|Builder|
|LOC|96|
|Imports|3|
|Imported By|1|
|Exports|1|
|Interfaces|0|
|Classes|1|
|Enums|0|
|Functions|0|
|TODO|0|
|Placeholder Score|0|
|Business Importance|High|
|Phase|Phase 3|
|Recommendation|KEEP|

**Imported By**

- lib\journey\JourneyAnalysisEngine.ts

--------------------------------------------------------------------------------

### lib\journey\treatment\index.ts

|Property|Value|
|---|---|
|Purpose|Unknown|
|LOC|2|
|Imports|0|
|Imported By|0|
|Exports|0|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|0|
|TODO|1|
|Placeholder Score|1|
|Business Importance|High|
|Phase|Phase 3|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### lib\journey\treatment\models\treatmentDecisionModel.ts

|Property|Value|
|---|---|
|Purpose|Shared Types|
|LOC|4|
|Imports|0|
|Imported By|0|
|Exports|1|
|Interfaces|1|
|Classes|0|
|Enums|0|
|Functions|0|
|TODO|1|
|Placeholder Score|1|
|Business Importance|High|
|Phase|Phase 3|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### lib\journey\treatment\treatmentDecisionEngine.ts

|Property|Value|
|---|---|
|Purpose|Business Engine|
|LOC|4|
|Imports|0|
|Imported By|0|
|Exports|1|
|Interfaces|0|
|Classes|1|
|Enums|0|
|Functions|0|
|TODO|1|
|Placeholder Score|1|
|Business Importance|High|
|Phase|Phase 3|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### lib\journey\treatment\treatmentDecisionMapper.ts

|Property|Value|
|---|---|
|Purpose|Mapper|
|LOC|4|
|Imports|0|
|Imported By|0|
|Exports|1|
|Interfaces|0|
|Classes|1|
|Enums|0|
|Functions|0|
|TODO|1|
|Placeholder Score|1|
|Business Importance|High|
|Phase|Phase 3|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### lib\journey\treatment\treatmentDecisionRepository.ts

|Property|Value|
|---|---|
|Purpose|Repository|
|LOC|4|
|Imports|0|
|Imported By|0|
|Exports|1|
|Interfaces|0|
|Classes|1|
|Enums|0|
|Functions|0|
|TODO|1|
|Placeholder Score|1|
|Business Importance|High|
|Phase|Phase 3|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### lib\journey\treatment\treatmentDecisionRules.ts

|Property|Value|
|---|---|
|Purpose|Unknown|
|LOC|4|
|Imports|0|
|Imported By|0|
|Exports|0|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|0|
|TODO|1|
|Placeholder Score|1|
|Business Importance|High|
|Phase|Phase 3|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### lib\journey\treatment\treatmentDecisionStorage.ts

|Property|Value|
|---|---|
|Purpose|Storage|
|LOC|4|
|Imports|0|
|Imported By|0|
|Exports|1|
|Interfaces|0|
|Classes|1|
|Enums|0|
|Functions|0|
|TODO|1|
|Placeholder Score|1|
|Business Importance|High|
|Phase|Phase 3|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### lib\journey\treatment\treatmentDecisionTypes.ts

|Property|Value|
|---|---|
|Purpose|Unknown|
|LOC|4|
|Imports|0|
|Imported By|0|
|Exports|0|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|0|
|TODO|1|
|Placeholder Score|1|
|Business Importance|High|
|Phase|Phase 3|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### lib\journey\treatment\treatmentDecisionValidator.ts

|Property|Value|
|---|---|
|Purpose|Validator|
|LOC|4|
|Imports|0|
|Imported By|0|
|Exports|1|
|Interfaces|0|
|Classes|1|
|Enums|0|
|Functions|0|
|TODO|1|
|Placeholder Score|1|
|Business Importance|High|
|Phase|Phase 3|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### lib\mappers\assessmentMapper.ts

|Property|Value|
|---|---|
|Purpose|Mapper|
|LOC|126|
|Imports|1|
|Imported By|0|
|Exports|2|
|Interfaces|1|
|Classes|1|
|Enums|0|
|Functions|0|
|TODO|3|
|Placeholder Score|1|
|Business Importance|Medium|
|Phase|Phase 2|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### lib\mappers\clinicalEventMapper.ts

|Property|Value|
|---|---|
|Purpose|Mapper|
|LOC|76|
|Imports|2|
|Imported By|0|
|Exports|1|
|Interfaces|0|
|Classes|1|
|Enums|0|
|Functions|0|
|TODO|1|
|Placeholder Score|1|
|Business Importance|High|
|Phase|Future|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### lib\mappers\DailyCareMapper.ts

|Property|Value|
|---|---|
|Purpose|Mapper|
|LOC|157|
|Imports|1|
|Imported By|0|
|Exports|2|
|Interfaces|1|
|Classes|1|
|Enums|0|
|Functions|0|
|TODO|1|
|Placeholder Score|1|
|Business Importance|Medium|
|Phase|Phase 2|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### lib\mappers\PatientMapper.ts

|Property|Value|
|---|---|
|Purpose|Mapper|
|LOC|54|
|Imports|2|
|Imported By|1|
|Exports|1|
|Interfaces|0|
|Classes|1|
|Enums|0|
|Functions|0|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Medium|
|Phase|Future|
|Recommendation|KEEP|

**Imported By**

- lib\repositories\patientRepository.ts

--------------------------------------------------------------------------------

### lib\mappers\SelfDailyCareMapper.ts

|Property|Value|
|---|---|
|Purpose|Mapper|
|LOC|171|
|Imports|1|
|Imported By|0|
|Exports|2|
|Interfaces|1|
|Classes|1|
|Enums|0|
|Functions|0|
|TODO|1|
|Placeholder Score|1|
|Business Importance|Medium|
|Phase|Phase 2|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### lib\mappers\SelfProfileMapper.ts

|Property|Value|
|---|---|
|Purpose|Mapper|
|LOC|54|
|Imports|2|
|Imported By|1|
|Exports|1|
|Interfaces|0|
|Classes|1|
|Enums|0|
|Functions|0|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Medium|
|Phase|Future|
|Recommendation|KEEP|

**Imported By**

- lib\repositories\SelfProfileRepository.ts

--------------------------------------------------------------------------------

### lib\medical-image\medicalImageParser.ts

|Property|Value|
|---|---|
|Purpose|Utility|
|LOC|214|
|Imports|1|
|Imported By|0|
|Exports|2|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|5|
|TODO|0|
|Placeholder Score|1|
|Business Importance|Low|
|Phase|Phase 1|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### lib\medical-image\medicalImageService.ts

|Property|Value|
|---|---|
|Purpose|Unknown|
|LOC|102|
|Imports|2|
|Imported By|0|
|Exports|1|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|0|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Low|
|Phase|Phase 1|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### lib\medical-image\medicalImageTypes.ts

|Property|Value|
|---|---|
|Purpose|Shared Types|
|LOC|41|
|Imports|0|
|Imported By|2|
|Exports|3|
|Interfaces|2|
|Classes|0|
|Enums|0|
|Functions|0|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Low|
|Phase|Phase 1|
|Recommendation|KEEP|

**Imported By**

- lib\medical-image\medicalImageParser.ts
- lib\medical-image\medicalImageService.ts

--------------------------------------------------------------------------------

### lib\medical-voice\medicalVoiceService.ts

|Property|Value|
|---|---|
|Purpose|Unknown|
|LOC|233|
|Imports|2|
|Imported By|0|
|Exports|1|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|0|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Low|
|Phase|Phase 1|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### lib\medical-voice\medicalVoiceTypes.ts

|Property|Value|
|---|---|
|Purpose|Shared Types|
|LOC|103|
|Imports|1|
|Imported By|1|
|Exports|5|
|Interfaces|2|
|Classes|0|
|Enums|0|
|Functions|0|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Low|
|Phase|Phase 1|
|Recommendation|KEEP|

**Imported By**

- lib\medical-voice\medicalVoiceService.ts

--------------------------------------------------------------------------------

### lib\medicalFormatter.ts

|Property|Value|
|---|---|
|Purpose|Utility|
|LOC|44|
|Imports|0|
|Imported By|0|
|Exports|1|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|1|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Low|
|Phase|Phase 1|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### lib\pdf\DailyCarePdfGenerator.ts

|Property|Value|
|---|---|
|Purpose|Unknown|
|LOC|782|
|Imports|3|
|Imported By|0|
|Exports|1|
|Interfaces|0|
|Classes|1|
|Enums|0|
|Functions|0|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Low|
|Phase|Phase 2|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### lib\pdf\PdfFormatter.ts

|Property|Value|
|---|---|
|Purpose|Unknown|
|LOC|8|
|Imports|0|
|Imported By|0|
|Exports|1|
|Interfaces|0|
|Classes|1|
|Enums|0|
|Functions|0|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Low|
|Phase|Future|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### lib\pdf\PdfModels.ts

|Property|Value|
|---|---|
|Purpose|Shared Types|
|LOC|26|
|Imports|2|
|Imported By|1|
|Exports|2|
|Interfaces|1|
|Classes|0|
|Enums|0|
|Functions|0|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Low|
|Phase|Future|
|Recommendation|KEEP|

**Imported By**

- lib\pdf\DailyCarePdfGenerator.ts

--------------------------------------------------------------------------------

### lib\pdf\PdfStyles.ts

|Property|Value|
|---|---|
|Purpose|Unknown|
|LOC|0|
|Imports|0|
|Imported By|0|
|Exports|0|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|0|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Low|
|Phase|Future|
|Recommendation|DELETE|

--------------------------------------------------------------------------------

### lib\pdf\trendReportPdf.ts

|Property|Value|
|---|---|
|Purpose|Unknown|
|LOC|23|
|Imports|1|
|Imported By|0|
|Exports|2|
|Interfaces|0|
|Classes|1|
|Enums|0|
|Functions|0|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Low|
|Phase|Future|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### lib\performance\performanceStorage.ts

|Property|Value|
|---|---|
|Purpose|Storage|
|LOC|365|
|Imports|1|
|Imported By|1|
|Exports|1|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|8|
|TODO|0|
|Placeholder Score|1|
|Business Importance|Low|
|Phase|Future|
|Recommendation|KEEP|

**Imported By**

- lib\performance\performanceTracker.ts

--------------------------------------------------------------------------------

### lib\performance\performanceTracker.ts

|Property|Value|
|---|---|
|Purpose|Storage|
|LOC|447|
|Imports|2|
|Imported By|0|
|Exports|1|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|8|
|TODO|0|
|Placeholder Score|1|
|Business Importance|Low|
|Phase|Future|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### lib\performance\performanceTypes.ts

|Property|Value|
|---|---|
|Purpose|Shared Types|
|LOC|94|
|Imports|0|
|Imported By|2|
|Exports|6|
|Interfaces|2|
|Classes|0|
|Enums|0|
|Functions|0|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Low|
|Phase|Future|
|Recommendation|KEEP|

**Imported By**

- lib\performance\performanceStorage.ts
- lib\performance\performanceTracker.ts

--------------------------------------------------------------------------------

### lib\prescription-ai\classification\clinicalRouter.ts

|Property|Value|
|---|---|
|Purpose|Shared Types|
|LOC|374|
|Imports|1|
|Imported By|0|
|Exports|5|
|Interfaces|4|
|Classes|0|
|Enums|0|
|Functions|10|
|TODO|0|
|Placeholder Score|2|
|Business Importance|High|
|Phase|Phase 1|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### lib\prescription-ai\consultation\assessmentRules.ts

|Property|Value|
|---|---|
|Purpose|Unknown|
|LOC|117|
|Imports|0|
|Imported By|1|
|Exports|1|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|0|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Low|
|Phase|Phase 1|
|Recommendation|KEEP|

**Imported By**

- lib\prescription-ai\consultation\consultationPromptBuilder.ts

--------------------------------------------------------------------------------

### lib\prescription-ai\consultation\complaintsRules.ts

|Property|Value|
|---|---|
|Purpose|Unknown|
|LOC|293|
|Imports|0|
|Imported By|1|
|Exports|1|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|0|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Low|
|Phase|Phase 1|
|Recommendation|KEEP|

**Imported By**

- lib\prescription-ai\consultation\consultationPromptBuilder.ts

--------------------------------------------------------------------------------

### lib\prescription-ai\consultation\consultationPromptBuilder.ts

|Property|Value|
|---|---|
|Purpose|Utility|
|LOC|33|
|Imports|7|
|Imported By|1|
|Exports|1|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|1|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Low|
|Phase|Phase 1|
|Recommendation|KEEP|

**Imported By**

- lib\prescription-ai\extractionInstructions.ts

--------------------------------------------------------------------------------

### lib\prescription-ai\consultation\consultationTypes.ts

|Property|Value|
|---|---|
|Purpose|Unknown|
|LOC|0|
|Imports|0|
|Imported By|0|
|Exports|0|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|0|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Low|
|Phase|Phase 1|
|Recommendation|DELETE|

--------------------------------------------------------------------------------

### lib\prescription-ai\consultation\doctorInstructionRules.ts

|Property|Value|
|---|---|
|Purpose|Unknown|
|LOC|188|
|Imports|0|
|Imported By|1|
|Exports|1|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|0|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Low|
|Phase|Phase 1|
|Recommendation|KEEP|

**Imported By**

- lib\prescription-ai\consultation\consultationPromptBuilder.ts

--------------------------------------------------------------------------------

### lib\prescription-ai\consultation\examinationRules.ts

|Property|Value|
|---|---|
|Purpose|Unknown|
|LOC|232|
|Imports|0|
|Imported By|1|
|Exports|1|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|0|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Low|
|Phase|Phase 1|
|Recommendation|KEEP|

**Imported By**

- lib\prescription-ai\consultation\consultationPromptBuilder.ts

--------------------------------------------------------------------------------

### lib\prescription-ai\consultation\historyRules.ts

|Property|Value|
|---|---|
|Purpose|Unknown|
|LOC|159|
|Imports|0|
|Imported By|1|
|Exports|1|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|0|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Low|
|Phase|Phase 1|
|Recommendation|KEEP|

**Imported By**

- lib\prescription-ai\consultation\consultationPromptBuilder.ts

--------------------------------------------------------------------------------

### lib\prescription-ai\consultation\investigationRules.ts

|Property|Value|
|---|---|
|Purpose|Unknown|
|LOC|165|
|Imports|0|
|Imported By|1|
|Exports|1|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|0|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Low|
|Phase|Phase 1|
|Recommendation|KEEP|

**Imported By**

- lib\prescription-ai\consultation\consultationPromptBuilder.ts

--------------------------------------------------------------------------------

### lib\prescription-ai\consultation\vitalsRules.ts

|Property|Value|
|---|---|
|Purpose|Unknown|
|LOC|267|
|Imports|0|
|Imported By|1|
|Exports|1|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|0|
|TODO|0|
|Placeholder Score|1|
|Business Importance|Low|
|Phase|Phase 1|
|Recommendation|KEEP|

**Imported By**

- lib\prescription-ai\consultation\consultationPromptBuilder.ts

--------------------------------------------------------------------------------

### lib\prescription-ai\examples\cardiologyExamples.ts

|Property|Value|
|---|---|
|Purpose|Unknown|
|LOC|3|
|Imports|1|
|Imported By|1|
|Exports|1|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|0|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Low|
|Phase|Phase 1|
|Recommendation|REVIEW|

**Imported By**

- lib\prescription-ai\examples\index.ts

--------------------------------------------------------------------------------

### lib\prescription-ai\examples\consultationExamples.ts

|Property|Value|
|---|---|
|Purpose|Unknown|
|LOC|225|
|Imports|1|
|Imported By|1|
|Exports|1|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|0|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Low|
|Phase|Phase 1|
|Recommendation|KEEP|

**Imported By**

- lib\prescription-ai\examples\index.ts

--------------------------------------------------------------------------------

### lib\prescription-ai\examples\diabetesExamples.ts

|Property|Value|
|---|---|
|Purpose|Unknown|
|LOC|3|
|Imports|1|
|Imported By|1|
|Exports|1|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|0|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Low|
|Phase|Phase 1|
|Recommendation|REVIEW|

**Imported By**

- lib\prescription-ai\examples\index.ts

--------------------------------------------------------------------------------

### lib\prescription-ai\examples\generalMedicineExamples.ts

|Property|Value|
|---|---|
|Purpose|Unknown|
|LOC|116|
|Imports|1|
|Imported By|1|
|Exports|1|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|0|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Low|
|Phase|Phase 1|
|Recommendation|KEEP|

**Imported By**

- lib\prescription-ai\examples\index.ts

--------------------------------------------------------------------------------

### lib\prescription-ai\examples\index.ts

|Property|Value|
|---|---|
|Purpose|Unknown|
|LOC|22|
|Imports|6|
|Imported By|1|
|Exports|1|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|0|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Low|
|Phase|Phase 1|
|Recommendation|KEEP|

**Imported By**

- lib\prescription-ai\extractionInstructions.ts

--------------------------------------------------------------------------------

### lib\prescription-ai\examples\oncologyExamples.ts

|Property|Value|
|---|---|
|Purpose|Unknown|
|LOC|61|
|Imports|1|
|Imported By|1|
|Exports|1|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|0|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Low|
|Phase|Phase 1|
|Recommendation|KEEP|

**Imported By**

- lib\prescription-ai\examples\index.ts

--------------------------------------------------------------------------------

### lib\prescription-ai\examples\pulmonologyExamples.ts

|Property|Value|
|---|---|
|Purpose|Unknown|
|LOC|3|
|Imports|1|
|Imported By|1|
|Exports|1|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|0|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Low|
|Phase|Phase 1|
|Recommendation|REVIEW|

**Imported By**

- lib\prescription-ai\examples\index.ts

--------------------------------------------------------------------------------

### lib\prescription-ai\extractionInstructions.ts

|Property|Value|
|---|---|
|Purpose|Builder|
|LOC|1338|
|Imports|5|
|Imported By|0|
|Exports|1|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|0|
|TODO|0|
|Placeholder Score|1|
|Business Importance|Low|
|Phase|Phase 1|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### lib\prescription-ai\identityExtractionInstructions.ts

|Property|Value|
|---|---|
|Purpose|Unknown|
|LOC|31|
|Imports|0|
|Imported By|0|
|Exports|1|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|0|
|TODO|0|
|Placeholder Score|1|
|Business Importance|Low|
|Phase|Phase 1|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### lib\prescription-ai\medicines\dosageRules.ts

|Property|Value|
|---|---|
|Purpose|Unknown|
|LOC|0|
|Imports|0|
|Imported By|0|
|Exports|0|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|0|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Low|
|Phase|Phase 1|
|Recommendation|DELETE|

--------------------------------------------------------------------------------

### lib\prescription-ai\medicines\durationRules.ts

|Property|Value|
|---|---|
|Purpose|Unknown|
|LOC|0|
|Imports|0|
|Imported By|0|
|Exports|0|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|0|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Low|
|Phase|Phase 1|
|Recommendation|DELETE|

--------------------------------------------------------------------------------

### lib\prescription-ai\medicines\frequencyRules.ts

|Property|Value|
|---|---|
|Purpose|Unknown|
|LOC|0|
|Imports|0|
|Imported By|0|
|Exports|0|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|0|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Low|
|Phase|Phase 1|
|Recommendation|DELETE|

--------------------------------------------------------------------------------

### lib\prescription-ai\medicines\medicineAssociationRules.ts

|Property|Value|
|---|---|
|Purpose|Unknown|
|LOC|0|
|Imports|0|
|Imported By|0|
|Exports|0|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|0|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Low|
|Phase|Phase 1|
|Recommendation|DELETE|

--------------------------------------------------------------------------------

### lib\prescription-ai\medicines\timingRules.ts

|Property|Value|
|---|---|
|Purpose|Unknown|
|LOC|0|
|Imports|0|
|Imported By|0|
|Exports|0|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|0|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Low|
|Phase|Phase 1|
|Recommendation|DELETE|

--------------------------------------------------------------------------------

### lib\prescription-ai\models\consultationModel.ts

|Property|Value|
|---|---|
|Purpose|Shared Types|
|LOC|95|
|Imports|0|
|Imported By|0|
|Exports|13|
|Interfaces|11|
|Classes|0|
|Enums|0|
|Functions|0|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Low|
|Phase|Phase 1|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### lib\prescription-ai\prescriptionExamples.ts

|Property|Value|
|---|---|
|Purpose|Shared Types|
|LOC|86|
|Imports|0|
|Imported By|6|
|Exports|1|
|Interfaces|1|
|Classes|0|
|Enums|0|
|Functions|0|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Low|
|Phase|Phase 1|
|Recommendation|KEEP|

**Imported By**

- lib\prescription-ai\examples\cardiologyExamples.ts
- lib\prescription-ai\examples\consultationExamples.ts
- lib\prescription-ai\examples\diabetesExamples.ts
- lib\prescription-ai\examples\generalMedicineExamples.ts
- lib\prescription-ai\examples\oncologyExamples.ts
- lib\prescription-ai\examples\pulmonologyExamples.ts

--------------------------------------------------------------------------------

### lib\prescription-ai\prescriptionKnowledge.ts

|Property|Value|
|---|---|
|Purpose|Unknown|
|LOC|347|
|Imports|0|
|Imported By|1|
|Exports|11|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|0|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Low|
|Phase|Phase 1|
|Recommendation|KEEP|

**Imported By**

- lib\prescription-ai\extractionInstructions.ts

--------------------------------------------------------------------------------

### lib\prescription-ai\prescriptionReadingRules.ts

|Property|Value|
|---|---|
|Purpose|Unknown|
|LOC|388|
|Imports|0|
|Imported By|1|
|Exports|1|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|0|
|TODO|0|
|Placeholder Score|1|
|Business Importance|Low|
|Phase|Phase 1|
|Recommendation|KEEP|

**Imported By**

- lib\prescription-ai\extractionInstructions.ts

--------------------------------------------------------------------------------

### lib\prescription-ai\prescriptionRecognitionRules.ts

|Property|Value|
|---|---|
|Purpose|Unknown|
|LOC|155|
|Imports|0|
|Imported By|1|
|Exports|1|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|0|
|TODO|0|
|Placeholder Score|1|
|Business Importance|Low|
|Phase|Phase 1|
|Recommendation|KEEP|

**Imported By**

- lib\prescription-ai\extractionInstructions.ts

--------------------------------------------------------------------------------

### lib\prescription-image\prescriptionImageService.ts

|Property|Value|
|---|---|
|Purpose|Unknown|
|LOC|187|
|Imports|2|
|Imported By|0|
|Exports|1|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|0|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Low|
|Phase|Phase 1|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### lib\prescription-image\prescriptionImageTypes.ts

|Property|Value|
|---|---|
|Purpose|Shared Types|
|LOC|186|
|Imports|0|
|Imported By|1|
|Exports|10|
|Interfaces|7|
|Classes|0|
|Enums|0|
|Functions|0|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Low|
|Phase|Phase 1|
|Recommendation|KEEP|

**Imported By**

- lib\prescription-image\prescriptionImageService.ts

--------------------------------------------------------------------------------

### lib\prescription\prescriptionMapper.ts

|Property|Value|
|---|---|
|Purpose|Mapper|
|LOC|371|
|Imports|2|
|Imported By|0|
|Exports|1|
|Interfaces|1|
|Classes|0|
|Enums|0|
|Functions|2|
|TODO|0|
|Placeholder Score|1|
|Business Importance|Low|
|Phase|Phase 1|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### lib\prescription\prescriptionRepository.ts

|Property|Value|
|---|---|
|Purpose|Repository|
|LOC|1642|
|Imports|2|
|Imported By|0|
|Exports|1|
|Interfaces|5|
|Classes|0|
|Enums|0|
|Functions|19|
|TODO|0|
|Placeholder Score|1|
|Business Importance|Low|
|Phase|Phase 1|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### lib\prescription\prescriptionReviewMapper.ts

|Property|Value|
|---|---|
|Purpose|Utility|
|LOC|237|
|Imports|2|
|Imported By|0|
|Exports|1|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|1|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Low|
|Phase|Phase 1|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### lib\prescription\prescriptionStorage.ts

|Property|Value|
|---|---|
|Purpose|Repository|
|LOC|288|
|Imports|4|
|Imported By|0|
|Exports|2|
|Interfaces|1|
|Classes|0|
|Enums|0|
|Functions|2|
|TODO|0|
|Placeholder Score|2|
|Business Importance|Low|
|Phase|Phase 1|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### lib\prescription\prescriptionTypes.ts

|Property|Value|
|---|---|
|Purpose|Shared Types|
|LOC|325|
|Imports|0|
|Imported By|0|
|Exports|14|
|Interfaces|12|
|Classes|0|
|Enums|0|
|Functions|0|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Low|
|Phase|Phase 1|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### lib\prescription\prescriptionValidator.ts

|Property|Value|
|---|---|
|Purpose|Shared Types|
|LOC|224|
|Imports|1|
|Imported By|0|
|Exports|2|
|Interfaces|1|
|Classes|0|
|Enums|0|
|Functions|1|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Low|
|Phase|Phase 1|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### lib\reportStorage.ts

|Property|Value|
|---|---|
|Purpose|Storage|
|LOC|100|
|Imports|0|
|Imported By|1|
|Exports|8|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|7|
|TODO|0|
|Placeholder Score|1|
|Business Importance|Low|
|Phase|Phase 2|
|Recommendation|KEEP|

**Imported By**

- lib\assessmentStorage.ts

--------------------------------------------------------------------------------

### lib\repositories\assessmentRepository.ts

|Property|Value|
|---|---|
|Purpose|Repository|
|LOC|247|
|Imports|3|
|Imported By|0|
|Exports|2|
|Interfaces|0|
|Classes|1|
|Enums|0|
|Functions|0|
|TODO|5|
|Placeholder Score|4|
|Business Importance|Low|
|Phase|Phase 2|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### lib\repositories\BaseRepository.ts

|Property|Value|
|---|---|
|Purpose|Repository|
|LOC|43|
|Imports|1|
|Imported By|3|
|Exports|0|
|Interfaces|0|
|Classes|1|
|Enums|0|
|Functions|0|
|TODO|0|
|Placeholder Score|1|
|Business Importance|Low|
|Phase|Future|
|Recommendation|KEEP|

**Imported By**

- lib\repositories\patientRepository.ts
- lib\repositories\profileRepository.ts
- lib\repositories\SelfProfileRepository.ts

--------------------------------------------------------------------------------

### lib\repositories\clinicalEventRepository.ts

|Property|Value|
|---|---|
|Purpose|Repository|
|LOC|91|
|Imports|4|
|Imported By|0|
|Exports|1|
|Interfaces|0|
|Classes|1|
|Enums|0|
|Functions|0|
|TODO|2|
|Placeholder Score|3|
|Business Importance|High|
|Phase|Future|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### lib\repositories\DailyCareRepository.ts

|Property|Value|
|---|---|
|Purpose|Repository|
|LOC|179|
|Imports|3|
|Imported By|0|
|Exports|2|
|Interfaces|0|
|Classes|1|
|Enums|0|
|Functions|0|
|TODO|4|
|Placeholder Score|4|
|Business Importance|Low|
|Phase|Phase 2|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### lib\repositories\patientRepository.ts

|Property|Value|
|---|---|
|Purpose|Repository|
|LOC|238|
|Imports|5|
|Imported By|1|
|Exports|2|
|Interfaces|1|
|Classes|1|
|Enums|0|
|Functions|0|
|TODO|0|
|Placeholder Score|1|
|Business Importance|Low|
|Phase|Future|
|Recommendation|KEEP|

**Imported By**

- lib\storage\patientStorage.ts

--------------------------------------------------------------------------------

### lib\repositories\profileRepository.ts

|Property|Value|
|---|---|
|Purpose|Repository|
|LOC|76|
|Imports|4|
|Imported By|0|
|Exports|2|
|Interfaces|0|
|Classes|1|
|Enums|0|
|Functions|0|
|TODO|0|
|Placeholder Score|1|
|Business Importance|Low|
|Phase|Future|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### lib\repositories\SelfDailyCareRepository.ts

|Property|Value|
|---|---|
|Purpose|Repository|
|LOC|145|
|Imports|3|
|Imported By|0|
|Exports|2|
|Interfaces|0|
|Classes|1|
|Enums|0|
|Functions|0|
|TODO|3|
|Placeholder Score|4|
|Business Importance|Low|
|Phase|Phase 2|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### lib\repositories\SelfProfileRepository.ts

|Property|Value|
|---|---|
|Purpose|Repository|
|LOC|129|
|Imports|5|
|Imported By|1|
|Exports|2|
|Interfaces|0|
|Classes|1|
|Enums|0|
|Functions|0|
|TODO|0|
|Placeholder Score|1|
|Business Importance|Low|
|Phase|Future|
|Recommendation|KEEP|

**Imported By**

- lib\storage\SelfProfileStorage.ts

--------------------------------------------------------------------------------

### lib\repositories\SelfTrendRepository.ts

|Property|Value|
|---|---|
|Purpose|Repository|
|LOC|134|
|Imports|4|
|Imported By|0|
|Exports|2|
|Interfaces|0|
|Classes|1|
|Enums|0|
|Functions|0|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Low|
|Phase|Future|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### lib\repositories\TrendRepository.ts

|Property|Value|
|---|---|
|Purpose|Repository|
|LOC|133|
|Imports|4|
|Imported By|0|
|Exports|2|
|Interfaces|0|
|Classes|1|
|Enums|0|
|Functions|0|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Low|
|Phase|Future|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### lib\selfProfile.ts

|Property|Value|
|---|---|
|Purpose|Shared Types|
|LOC|15|
|Imports|0|
|Imported By|3|
|Exports|1|
|Interfaces|1|
|Classes|0|
|Enums|0|
|Functions|0|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Low|
|Phase|Future|
|Recommendation|KEEP|

**Imported By**

- lib\mappers\SelfProfileMapper.ts
- lib\repositories\SelfProfileRepository.ts
- lib\storage\SelfProfileStorage.ts

--------------------------------------------------------------------------------

### lib\storage\assessmentDraftStorage.ts

|Property|Value|
|---|---|
|Purpose|Storage|
|LOC|68|
|Imports|1|
|Imported By|0|
|Exports|2|
|Interfaces|0|
|Classes|1|
|Enums|0|
|Functions|0|
|TODO|0|
|Placeholder Score|1|
|Business Importance|Critical|
|Phase|Phase 2|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### lib\storage\assessmentStorage.ts

|Property|Value|
|---|---|
|Purpose|Repository|
|LOC|381|
|Imports|4|
|Imported By|0|
|Exports|2|
|Interfaces|0|
|Classes|1|
|Enums|0|
|Functions|0|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Critical|
|Phase|Phase 2|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### lib\storage\clinicalEventStorage.ts

|Property|Value|
|---|---|
|Purpose|Repository|
|LOC|46|
|Imports|2|
|Imported By|0|
|Exports|1|
|Interfaces|0|
|Classes|1|
|Enums|0|
|Functions|0|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Critical|
|Phase|Future|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### lib\storage\DailyCareStorage.ts

|Property|Value|
|---|---|
|Purpose|Repository|
|LOC|319|
|Imports|6|
|Imported By|0|
|Exports|2|
|Interfaces|0|
|Classes|1|
|Enums|0|
|Functions|0|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Critical|
|Phase|Phase 2|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### lib\storage\patientStorage.ts

|Property|Value|
|---|---|
|Purpose|Repository|
|LOC|293|
|Imports|5|
|Imported By|0|
|Exports|1|
|Interfaces|0|
|Classes|2|
|Enums|0|
|Functions|0|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Critical|
|Phase|Future|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### lib\storage\SelfDailyCareStorage.ts

|Property|Value|
|---|---|
|Purpose|Repository|
|LOC|238|
|Imports|4|
|Imported By|0|
|Exports|2|
|Interfaces|0|
|Classes|1|
|Enums|0|
|Functions|0|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Critical|
|Phase|Phase 2|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### lib\storage\SelfProfileStorage.ts

|Property|Value|
|---|---|
|Purpose|Repository|
|LOC|185|
|Imports|4|
|Imported By|0|
|Exports|1|
|Interfaces|0|
|Classes|1|
|Enums|0|
|Functions|0|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Critical|
|Phase|Future|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### lib\storage\selfTrendStorage.ts

|Property|Value|
|---|---|
|Purpose|Repository|
|LOC|71|
|Imports|4|
|Imported By|0|
|Exports|2|
|Interfaces|0|
|Classes|1|
|Enums|0|
|Functions|0|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Critical|
|Phase|Future|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### lib\storage\storageResult.ts

|Property|Value|
|---|---|
|Purpose|Storage|
|LOC|56|
|Imports|1|
|Imported By|3|
|Exports|1|
|Interfaces|0|
|Classes|2|
|Enums|0|
|Functions|0|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Critical|
|Phase|Future|
|Recommendation|KEEP|

**Imported By**

- lib\storage\patientStorage.ts
- lib\storage\SelfProfileStorage.ts
- lib\validators\patientValidator.ts

--------------------------------------------------------------------------------

### lib\storage\trendDraftStorage.ts

|Property|Value|
|---|---|
|Purpose|Storage|
|LOC|87|
|Imports|1|
|Imported By|0|
|Exports|2|
|Interfaces|0|
|Classes|1|
|Enums|0|
|Functions|0|
|TODO|0|
|Placeholder Score|1|
|Business Importance|Critical|
|Phase|Future|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### lib\storage\TrendStorage.ts

|Property|Value|
|---|---|
|Purpose|Repository|
|LOC|68|
|Imports|4|
|Imported By|0|
|Exports|2|
|Interfaces|0|
|Classes|1|
|Enums|0|
|Functions|0|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Critical|
|Phase|Future|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### lib\supabase.ts

|Property|Value|
|---|---|
|Purpose|Unknown|
|LOC|17|
|Imports|1|
|Imported By|3|
|Exports|1|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|0|
|TODO|0|
|Placeholder Score|1|
|Business Importance|Low|
|Phase|Future|
|Recommendation|KEEP|

**Imported By**

- lib\repositories\patientRepository.ts
- lib\repositories\profileRepository.ts
- lib\repositories\SelfProfileRepository.ts

--------------------------------------------------------------------------------

### lib\supabase\server.ts

|Property|Value|
|---|---|
|Purpose|Unknown|
|LOC|52|
|Imports|2|
|Imported By|0|
|Exports|0|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|2|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Low|
|Phase|Future|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### lib\supabaseAdmin.ts

|Property|Value|
|---|---|
|Purpose|Unknown|
|LOC|33|
|Imports|1|
|Imported By|0|
|Exports|1|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|0|
|TODO|0|
|Placeholder Score|1|
|Business Importance|Low|
|Phase|Future|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### lib\treatment\index.ts

|Property|Value|
|---|---|
|Purpose|Unknown|
|LOC|0|
|Imports|0|
|Imported By|0|
|Exports|0|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|0|
|TODO|0|
|Placeholder Score|0|
|Business Importance|High|
|Phase|Phase 3|
|Recommendation|DELETE|

--------------------------------------------------------------------------------

### lib\treatment\treatmentMapper.ts

|Property|Value|
|---|---|
|Purpose|Repository|
|LOC|311|
|Imports|2|
|Imported By|0|
|Exports|1|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|15|
|TODO|0|
|Placeholder Score|1|
|Business Importance|High|
|Phase|Phase 3|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### lib\treatment\treatmentModels.ts

|Property|Value|
|---|---|
|Purpose|Shared Types|
|LOC|750|
|Imports|1|
|Imported By|5|
|Exports|31|
|Interfaces|25|
|Classes|0|
|Enums|0|
|Functions|0|
|TODO|0|
|Placeholder Score|0|
|Business Importance|High|
|Phase|Phase 3|
|Recommendation|KEEP|

**Imported By**

- lib\treatment\treatmentMapper.ts
- lib\treatment\treatmentRepository.ts
- lib\treatment\treatmentRules.ts
- lib\treatment\treatmentStorage.ts
- lib\treatment\treatmentValidation.ts

--------------------------------------------------------------------------------

### lib\treatment\treatmentRepository.ts

|Property|Value|
|---|---|
|Purpose|Repository|
|LOC|288|
|Imports|1|
|Imported By|1|
|Exports|11|
|Interfaces|1|
|Classes|1|
|Enums|0|
|Functions|9|
|TODO|0|
|Placeholder Score|1|
|Business Importance|High|
|Phase|Phase 3|
|Recommendation|KEEP|

**Imported By**

- lib\treatment\treatmentStorage.ts

--------------------------------------------------------------------------------

### lib\treatment\treatmentRules.ts

|Property|Value|
|---|---|
|Purpose|Builder|
|LOC|1706|
|Imports|2|
|Imported By|0|
|Exports|1|
|Interfaces|4|
|Classes|0|
|Enums|2|
|Functions|31|
|TODO|0|
|Placeholder Score|0|
|Business Importance|High|
|Phase|Phase 3|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### lib\treatment\TreatmentService.ts

|Property|Value|
|---|---|
|Purpose|Unknown|
|LOC|0|
|Imports|0|
|Imported By|0|
|Exports|0|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|0|
|TODO|0|
|Placeholder Score|0|
|Business Importance|High|
|Phase|Phase 3|
|Recommendation|DELETE|

--------------------------------------------------------------------------------

### lib\treatment\treatmentStorage.ts

|Property|Value|
|---|---|
|Purpose|Repository|
|LOC|164|
|Imports|3|
|Imported By|0|
|Exports|1|
|Interfaces|0|
|Classes|1|
|Enums|0|
|Functions|0|
|TODO|0|
|Placeholder Score|3|
|Business Importance|High|
|Phase|Phase 3|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### lib\treatment\treatmentTypes.ts

|Property|Value|
|---|---|
|Purpose|Repository|
|LOC|765|
|Imports|0|
|Imported By|3|
|Exports|55|
|Interfaces|4|
|Classes|0|
|Enums|35|
|Functions|0|
|TODO|0|
|Placeholder Score|0|
|Business Importance|High|
|Phase|Phase 3|
|Recommendation|KEEP|

**Imported By**

- lib\treatment\treatmentMapper.ts
- lib\treatment\treatmentModels.ts
- lib\treatment\treatmentRules.ts

--------------------------------------------------------------------------------

### lib\treatment\treatmentValidation.ts

|Property|Value|
|---|---|
|Purpose|Builder|
|LOC|883|
|Imports|1|
|Imported By|0|
|Exports|6|
|Interfaces|2|
|Classes|0|
|Enums|2|
|Functions|21|
|TODO|0|
|Placeholder Score|0|
|Business Importance|High|
|Phase|Phase 3|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### lib\trends\selfTrendPdfGenerator.ts

|Property|Value|
|---|---|
|Purpose|Unknown|
|LOC|714|
|Imports|3|
|Imported By|0|
|Exports|2|
|Interfaces|0|
|Classes|1|
|Enums|0|
|Functions|1|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Low|
|Phase|Future|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### lib\trends\trendChartConfig.ts

|Property|Value|
|---|---|
|Purpose|Shared Types|
|LOC|66|
|Imports|1|
|Imported By|3|
|Exports|2|
|Interfaces|1|
|Classes|0|
|Enums|0|
|Functions|0|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Low|
|Phase|Future|
|Recommendation|KEEP|

**Imported By**

- lib\trends\selfTrendPdfGenerator.ts
- lib\trends\trendPdfGenerator.ts
- lib\trends\trendReportBuilder.ts

--------------------------------------------------------------------------------

### lib\trends\trendClinicalAnalyzer.ts

|Property|Value|
|---|---|
|Purpose|Unknown|
|LOC|32|
|Imports|1|
|Imported By|0|
|Exports|2|
|Interfaces|0|
|Classes|1|
|Enums|0|
|Functions|0|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Low|
|Phase|Future|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### lib\trends\trendPdfGenerator.ts

|Property|Value|
|---|---|
|Purpose|Unknown|
|LOC|714|
|Imports|3|
|Imported By|0|
|Exports|2|
|Interfaces|0|
|Classes|1|
|Enums|0|
|Functions|1|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Low|
|Phase|Future|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### lib\trends\trendReport.ts

|Property|Value|
|---|---|
|Purpose|Shared Types|
|LOC|36|
|Imports|1|
|Imported By|3|
|Exports|1|
|Interfaces|1|
|Classes|0|
|Enums|0|
|Functions|0|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Low|
|Phase|Future|
|Recommendation|KEEP|

**Imported By**

- lib\trends\selfTrendPdfGenerator.ts
- lib\trends\trendPdfGenerator.ts
- lib\trends\trendReportBuilder.ts

--------------------------------------------------------------------------------

### lib\trends\trendReportBuilder.ts

|Property|Value|
|---|---|
|Purpose|Builder|
|LOC|107|
|Imports|3|
|Imported By|0|
|Exports|2|
|Interfaces|0|
|Classes|1|
|Enums|0|
|Functions|0|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Low|
|Phase|Future|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### lib\trends\trendRequest.ts

|Property|Value|
|---|---|
|Purpose|Shared Types|
|LOC|54|
|Imports|0|
|Imported By|0|
|Exports|3|
|Interfaces|2|
|Classes|0|
|Enums|0|
|Functions|0|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Low|
|Phase|Future|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### lib\trends\trendResult.ts

|Property|Value|
|---|---|
|Purpose|Shared Types|
|LOC|139|
|Imports|1|
|Imported By|2|
|Exports|8|
|Interfaces|7|
|Classes|0|
|Enums|0|
|Functions|0|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Low|
|Phase|Future|
|Recommendation|KEEP|

**Imported By**

- lib\trends\trendChartConfig.ts
- lib\trends\trendClinicalAnalyzer.ts

--------------------------------------------------------------------------------

### lib\types\assessment.ts

|Property|Value|
|---|---|
|Purpose|Shared Types|
|LOC|95|
|Imports|0|
|Imported By|0|
|Exports|8|
|Interfaces|5|
|Classes|0|
|Enums|0|
|Functions|0|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Medium|
|Phase|Phase 2|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### lib\types\assessmentDraft.ts

|Property|Value|
|---|---|
|Purpose|Shared Types|
|LOC|49|
|Imports|1|
|Imported By|0|
|Exports|1|
|Interfaces|1|
|Classes|0|
|Enums|0|
|Functions|0|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Medium|
|Phase|Phase 2|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### lib\types\assessmentScore.ts

|Property|Value|
|---|---|
|Purpose|Builder|
|LOC|36|
|Imports|1|
|Imported By|0|
|Exports|1|
|Interfaces|1|
|Classes|0|
|Enums|0|
|Functions|0|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Medium|
|Phase|Phase 2|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### lib\types\clinicalEvent.ts

|Property|Value|
|---|---|
|Purpose|Shared Types|
|LOC|48|
|Imports|0|
|Imported By|0|
|Exports|3|
|Interfaces|2|
|Classes|0|
|Enums|1|
|Functions|0|
|TODO|0|
|Placeholder Score|0|
|Business Importance|High|
|Phase|Future|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### lib\types\dailyCare.ts

|Property|Value|
|---|---|
|Purpose|Shared Types|
|LOC|150|
|Imports|0|
|Imported By|0|
|Exports|6|
|Interfaces|3|
|Classes|0|
|Enums|0|
|Functions|0|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Medium|
|Phase|Phase 2|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### lib\types\patient.ts

|Property|Value|
|---|---|
|Purpose|Shared Types|
|LOC|16|
|Imports|0|
|Imported By|4|
|Exports|1|
|Interfaces|1|
|Classes|0|
|Enums|0|
|Functions|0|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Medium|
|Phase|Future|
|Recommendation|KEEP|

**Imported By**

- lib\mappers\PatientMapper.ts
- lib\repositories\patientRepository.ts
- lib\storage\patientStorage.ts
- lib\validators\patientValidator.ts

--------------------------------------------------------------------------------

### lib\types\profile.ts

|Property|Value|
|---|---|
|Purpose|Shared Types|
|LOC|13|
|Imports|0|
|Imported By|1|
|Exports|1|
|Interfaces|1|
|Classes|0|
|Enums|0|
|Functions|0|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Medium|
|Phase|Future|
|Recommendation|REVIEW|

**Imported By**

- lib\repositories\profileRepository.ts

--------------------------------------------------------------------------------

### lib\types\report.ts

|Property|Value|
|---|---|
|Purpose|Shared Types|
|LOC|10|
|Imports|0|
|Imported By|0|
|Exports|1|
|Interfaces|1|
|Classes|0|
|Enums|0|
|Functions|0|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Medium|
|Phase|Future|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### lib\types\result.ts

|Property|Value|
|---|---|
|Purpose|Repository|
|LOC|28|
|Imports|0|
|Imported By|1|
|Exports|1|
|Interfaces|1|
|Classes|0|
|Enums|0|
|Functions|0|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Medium|
|Phase|Future|
|Recommendation|KEEP|

**Imported By**

- lib\validators\patientValidator.ts

--------------------------------------------------------------------------------

### lib\types\selfDailyCare.ts

|Property|Value|
|---|---|
|Purpose|Shared Types|
|LOC|153|
|Imports|0|
|Imported By|0|
|Exports|6|
|Interfaces|3|
|Classes|0|
|Enums|0|
|Functions|0|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Medium|
|Phase|Phase 2|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### lib\utils\appAlert.ts

|Property|Value|
|---|---|
|Purpose|Unknown|
|LOC|21|
|Imports|0|
|Imported By|0|
|Exports|1|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|0|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Low|
|Phase|Future|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### lib\utils\dateUtils.ts

|Property|Value|
|---|---|
|Purpose|Utility|
|LOC|45|
|Imports|0|
|Imported By|0|
|Exports|1|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|1|
|TODO|0|
|Placeholder Score|1|
|Business Importance|Low|
|Phase|Future|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### lib\utils\displayFormatter.ts

|Property|Value|
|---|---|
|Purpose|Utility|
|LOC|143|
|Imports|0|
|Imported By|0|
|Exports|3|
|Interfaces|0|
|Classes|0|
|Enums|1|
|Functions|3|
|TODO|0|
|Placeholder Score|1|
|Business Importance|Low|
|Phase|Future|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### lib\utils\pdf\assessmentPdf.ts

|Property|Value|
|---|---|
|Purpose|Unknown|
|LOC|115|
|Imports|2|
|Imported By|0|
|Exports|0|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|3|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Low|
|Phase|Phase 2|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### lib\validators\patientValidator.ts

|Property|Value|
|---|---|
|Purpose|Storage|
|LOC|98|
|Imports|3|
|Imported By|1|
|Exports|2|
|Interfaces|0|
|Classes|2|
|Enums|0|
|Functions|0|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Low|
|Phase|Future|
|Recommendation|KEEP|

**Imported By**

- lib\storage\patientStorage.ts

--------------------------------------------------------------------------------

### scripts\analyzeArchitecture.ts

|Property|Value|
|---|---|
|Purpose|Unknown|
|LOC|0|
|Imports|0|
|Imported By|0|
|Exports|0|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|0|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Low|
|Phase|Future|
|Recommendation|DELETE|

--------------------------------------------------------------------------------

### scripts\auditArchitecture.ts

|Property|Value|
|---|---|
|Purpose|Repository|
|LOC|321|
|Imports|2|
|Imported By|0|
|Exports|0|
|Interfaces|1|
|Classes|0|
|Enums|0|
|Functions|5|
|TODO|8|
|Placeholder Score|2|
|Business Importance|Low|
|Phase|Future|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### scripts\benchmarkComparator.ts

|Property|Value|
|---|---|
|Purpose|Unknown|
|LOC|0|
|Imports|0|
|Imported By|0|
|Exports|0|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|0|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Low|
|Phase|Future|
|Recommendation|DELETE|

--------------------------------------------------------------------------------

### scripts\dependencyAudit.ts

|Property|Value|
|---|---|
|Purpose|Shared Types|
|LOC|246|
|Imports|2|
|Imported By|0|
|Exports|0|
|Interfaces|1|
|Classes|0|
|Enums|0|
|Functions|3|
|TODO|0|
|Placeholder Score|1|
|Business Importance|Low|
|Phase|Future|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### scripts\discoverProject.ts

|Property|Value|
|---|---|
|Purpose|Shared Types|
|LOC|224|
|Imports|2|
|Imported By|0|
|Exports|0|
|Interfaces|1|
|Classes|0|
|Enums|0|
|Functions|3|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Low|
|Phase|Future|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### scripts\governArchitecture.ts

|Property|Value|
|---|---|
|Purpose|Repository|
|LOC|1681|
|Imports|2|
|Imported By|0|
|Exports|0|
|Interfaces|5|
|Classes|0|
|Enums|0|
|Functions|43|
|TODO|7|
|Placeholder Score|13|
|Business Importance|Low|
|Phase|Future|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### scripts\reviewArchitecture.ts

|Property|Value|
|---|---|
|Purpose|Unknown|
|LOC|0|
|Imports|0|
|Imported By|0|
|Exports|0|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|0|
|TODO|0|
|Placeholder Score|0|
|Business Importance|Low|
|Phase|Future|
|Recommendation|DELETE|

--------------------------------------------------------------------------------

### scripts\scaffoldClinicalCore.ts

|Property|Value|
|---|---|
|Purpose|Unknown|
|LOC|146|
|Imports|2|
|Imported By|0|
|Exports|0|
|Interfaces|0|
|Classes|0|
|Enums|0|
|Functions|3|
|TODO|1|
|Placeholder Score|1|
|Business Importance|Low|
|Phase|Future|
|Recommendation|REVIEW|

--------------------------------------------------------------------------------

### scripts\scaffoldMedicationManagement.ts

|Property|Value|
|---|---|
|Purpose|Repository|
|LOC|217|
|Imports|2|
|Imported By|0|
|Exports|11|
|Interfaces|2|
|Classes|9|
|Enums|0|
|Functions|3|
|TODO|15|
|Placeholder Score|1|
|Business Importance|Low|
|Phase|Future|
|Recommendation|REVIEW|

## Duplicate Responsibilities

### runtime

- app\api\analytics\auth-session\login\route.ts
- app\api\analytics\auth-session\logout\route.ts
- app\api\analytics\event\route.ts
- app\api\medical-image\route.ts
- app\api\medical-voice\route.ts
- app\api\prescription-identity\route.ts
- app\api\prescription-image\route.ts

### ReportTableColumn

- app\components\ReportTable.tsx
- app\components\ReportTable.tsx

### TemperatureUnit

- app\daily-care\components\DailyCareForm.tsx
- app\daily-care\components\TemperatureCard.tsx
- lib\medical-image\medicalImageTypes.ts
- lib\medical-image\medicalImageTypes.ts
- components\dashboard\ManualCareWorkspace.tsx
- Components\dashboard\ManualCareWorkspace.tsx

### ImageSource

- app\daily-care\components\DailyCareForm.tsx
- components\dashboard\UploadCareWorkspace.tsx
- Components\dashboard\UploadCareWorkspace.tsx

### PatientCardProps

- app\daily-care\components\PatientCard.tsx
- components\dashboard\prescription-review\PatientCard.tsx
- Components\dashboard\prescription-review\PatientCard.tsx

### primaryButton

- app\daily-care\styles.ts
- components\dashboard\PrescriptionWorkspace.styles.ts
- Components\dashboard\PrescriptionWorkspace.styles.ts

### secondaryButton

- app\daily-care\styles.ts
- components\dashboard\PrescriptionWorkspace.styles.ts
- Components\dashboard\PrescriptionWorkspace.styles.ts

### PersonSelection

- app\dashboard\page.tsx
- components\patient\PersonSelector.tsx
- components\patient\PersonSelector.tsx
- Components\patient\PersonSelector.tsx
- Components\patient\PersonSelector.tsx

### ActionOption

- app\dashboard\page.tsx
- components\dashboard\ActionOptions.tsx
- components\dashboard\ActionOptions.tsx
- Components\dashboard\ActionOptions.tsx
- Components\dashboard\ActionOptions.tsx

### MedicationDetailOption

- app\dashboard\page.tsx
- components\dashboard\ActionOptions.tsx
- components\dashboard\ActionOptions.tsx
- Components\dashboard\ActionOptions.tsx
- Components\dashboard\ActionOptions.tsx

### InfoTileProps

- app\journey-review\ActiveTreatmentCard.tsx
- app\journey-review\JourneyTimeline.tsx

### MedicineCardProps

- app\journey-review\ActiveTreatmentCard.tsx
- components\dashboard\prescription-review\MedicineCard.tsx
- Components\dashboard\prescription-review\MedicineCard.tsx

### JourneyAnswer

- app\journey-review\JourneyContext.tsx
- app\journey-review\JourneyContext.tsx
- lib\journey\journeyModels.ts
- lib\journey\journeyModels.ts

### JourneyState

- app\journey-review\JourneyContext.tsx
- app\journey-review\JourneyContext.tsx

### JourneyStep

- app\journey-review\JourneyContext.tsx
- app\journey-review\JourneyContext.tsx

### InfoCardProps

- app\journey-review\JourneyHeader.tsx
- app\journey-review\TreatmentDecisionCard.tsx

### ConsultationMode

- app\medications\consultation-mode\page.tsx
- lib\prescription-ai\models\consultationModel.ts
- lib\prescription-ai\models\consultationModel.ts
- lib\prescription-image\prescriptionImageTypes.ts
- lib\prescription-image\prescriptionImageTypes.ts
- lib\treatment\treatmentTypes.ts
- lib\treatment\treatmentTypes.ts

### of

- app\medications\consultation-mode\page.tsx
- lib\i18n\translations\en.ts

### TrendRequest

- app\reports\trends\trendRequest.ts
- app\reports\trends\trendRequest.ts
- lib\trends\trendRequest.ts
- lib\trends\trendRequest.ts

### AnalyticsEventInput

- lib\analytics\analyticsTypes.ts
- lib\analytics\analyticsTypes.ts

### AnalyticsEventRecord

- lib\analytics\analyticsTypes.ts
- lib\analytics\analyticsTypes.ts

### AnalyticsPlatform

- lib\analytics\analyticsTypes.ts
- lib\analytics\analyticsTypes.ts

### AnalyticsInputMethod

- lib\analytics\analyticsTypes.ts
- lib\analytics\analyticsTypes.ts

### AnalyticsModule

- lib\analytics\analyticsTypes.ts
- lib\analytics\analyticsTypes.ts

### AnalyticsEventName

- lib\analytics\analyticsTypes.ts
- lib\analytics\analyticsTypes.ts

### AnalyticsContext

- lib\analytics\analyticsTypes.ts
- lib\analytics\analyticsTypes.ts

### AuthSessionStartResult

- lib\analytics\authSessionService.ts
- lib\analytics\authSessionService.ts

### AuthService

- lib\auth\authService.ts
- lib\auth\authService.ts

### AssessmentBuilder

- lib\builders\assessmentBuilder.ts
- lib\builders\assessmentBuilder.ts

### ClinicalEventBuilder

- lib\builders\clinicalEventBuilder.ts
- lib\builders\clinicalEventBuilder.ts

### SelfTrendBuilder

- lib\builders\SelfTrendBuilder.ts
- lib\builders\SelfTrendBuilder.ts

### TrendBuilder

- lib\builders\TrendBuilder.ts
- lib\builders\TrendBuilder.ts

### ClinicalComparisonEngine

- lib\clinical-intelligence\ClinicalComparisonEngine.ts
- lib\clinical-intelligence\ClinicalComparisonEngine.ts

### ClinicalComparisonResult

- lib\clinical-intelligence\ClinicalComparisonEngine.ts
- lib\clinical-intelligence\comparisonTypes.ts
- lib\clinical-intelligence\comparisonTypes.ts

### ComparisonEngineOptions

- lib\clinical-intelligence\ClinicalComparisonEngine.ts
- lib\clinical-intelligence\comparisonTypes.ts
- lib\clinical-intelligence\comparisonTypes.ts

### MedicineComparison

- lib\clinical-intelligence\ClinicalComparisonEngine.ts
- lib\clinical-intelligence\comparisonTypes.ts
- lib\clinical-intelligence\comparisonTypes.ts

### ComplaintComparison

- lib\clinical-intelligence\ClinicalComparisonEngine.ts
- lib\clinical-intelligence\comparisonTypes.ts
- lib\clinical-intelligence\comparisonTypes.ts

### HistoryComparison

- lib\clinical-intelligence\ClinicalComparisonEngine.ts
- lib\clinical-intelligence\comparisonTypes.ts
- lib\clinical-intelligence\comparisonTypes.ts

### AssessmentComparison

- lib\clinical-intelligence\ClinicalComparisonEngine.ts
- lib\clinical-intelligence\comparisonTypes.ts
- lib\clinical-intelligence\comparisonTypes.ts

### InvestigationComparison

- lib\clinical-intelligence\ClinicalComparisonEngine.ts
- lib\clinical-intelligence\comparisonTypes.ts
- lib\clinical-intelligence\comparisonTypes.ts

### DoctorInstructionComparison

- lib\clinical-intelligence\ClinicalComparisonEngine.ts
- lib\clinical-intelligence\comparisonTypes.ts
- lib\clinical-intelligence\comparisonTypes.ts

### FollowUpComparison

- lib\clinical-intelligence\ClinicalComparisonEngine.ts
- lib\clinical-intelligence\comparisonTypes.ts
- lib\clinical-intelligence\comparisonTypes.ts

### VitalsComparison

- lib\clinical-intelligence\ClinicalComparisonEngine.ts
- lib\clinical-intelligence\comparisonTypes.ts
- lib\clinical-intelligence\comparisonTypes.ts

### ComparisonStatistics

- lib\clinical-intelligence\ClinicalComparisonEngine.ts
- lib\clinical-intelligence\comparisonTypes.ts
- lib\clinical-intelligence\comparisonTypes.ts

### ClinicalNote

- lib\clinical-intelligence\ClinicalComparisonEngine.ts
- lib\clinical-intelligence\comparisonTypes.ts
- lib\clinical-intelligence\comparisonTypes.ts

### ClarificationQuestion

- lib\clinical-intelligence\ClinicalComparisonEngine.ts
- lib\clinical-intelligence\comparisonTypes.ts
- lib\clinical-intelligence\comparisonTypes.ts

### CollectionComparison

- lib\clinical-intelligence\ClinicalComparisonEngine.ts
- lib\clinical-intelligence\comparisonTypes.ts
- lib\clinical-intelligence\comparisonTypes.ts

### PatientComparison

- lib\clinical-intelligence\comparisonTypes.ts
- lib\clinical-intelligence\comparisonTypes.ts

### DoctorComparison

- lib\clinical-intelligence\comparisonTypes.ts
- lib\clinical-intelligence\comparisonTypes.ts

### HospitalComparison

- lib\clinical-intelligence\comparisonTypes.ts
- lib\clinical-intelligence\comparisonTypes.ts

### ConsultationModeComparison

- lib\clinical-intelligence\comparisonTypes.ts
- lib\clinical-intelligence\comparisonTypes.ts

### ConsultationDateComparison

- lib\clinical-intelligence\comparisonTypes.ts
- lib\clinical-intelligence\comparisonTypes.ts

### AdditionalNotesComparison

- lib\clinical-intelligence\comparisonTypes.ts
- lib\clinical-intelligence\comparisonTypes.ts

### VitalComparison

- lib\clinical-intelligence\comparisonTypes.ts
- lib\clinical-intelligence\comparisonTypes.ts

### ClarificationOption

- lib\clinical-intelligence\comparisonTypes.ts
- lib\clinical-intelligence\comparisonTypes.ts

### ComparisonConfidence

- lib\clinical-intelligence\comparisonTypes.ts
- lib\clinical-intelligence\comparisonTypes.ts

### TimelineEventDraft

- lib\clinical-intelligence\comparisonTypes.ts
- lib\clinical-intelligence\comparisonTypes.ts

### ClinicalComparisonOutput

- lib\clinical-intelligence\comparisonTypes.ts
- lib\clinical-intelligence\comparisonTypes.ts

### ChangeType

- lib\clinical-intelligence\comparisonTypes.ts
- lib\clinical-intelligence\comparisonTypes.ts

### MedicineChangeType

- lib\clinical-intelligence\comparisonTypes.ts
- lib\clinical-intelligence\comparisonTypes.ts

### ClarificationPriority

- lib\clinical-intelligence\comparisonTypes.ts
- lib\clinical-intelligence\comparisonTypes.ts

### MedicineField

- lib\clinical-intelligence\comparisonTypes.ts
- lib\clinical-intelligence\comparisonTypes.ts

### VitalField

- lib\clinical-intelligence\comparisonTypes.ts
- lib\clinical-intelligence\comparisonTypes.ts

### ClinicalNoteType

- lib\clinical-intelligence\comparisonTypes.ts
- lib\clinical-intelligence\comparisonTypes.ts

### ClarificationType

- lib\clinical-intelligence\comparisonTypes.ts
- lib\clinical-intelligence\comparisonTypes.ts

### ConfirmationStatus

- lib\clinical-intelligence\comparisonTypes.ts
- lib\clinical-intelligence\comparisonTypes.ts

### ClinicalSummaryEngine

- lib\clinical-summary\ClinicalSummaryEngine.ts
- lib\clinical-summary\ClinicalSummaryEngine.ts

### ClinicalFinding

- lib\clinical-summary\ClinicalSummaryTypes.ts
- lib\clinical-summary\ClinicalSummaryTypes.ts

### ClinicalRecommendation

- lib\clinical-summary\ClinicalSummaryTypes.ts
- lib\clinical-summary\ClinicalSummaryTypes.ts

### ClinicalSummary

- lib\clinical-summary\ClinicalSummaryTypes.ts
- lib\clinical-summary\ClinicalSummaryTypes.ts
- lib\trends\trendResult.ts
- lib\trends\trendResult.ts

### ClinicalSummaryInput

- lib\clinical-summary\ClinicalSummaryTypes.ts
- lib\clinical-summary\ClinicalSummaryTypes.ts

### ClinicalSeverity

- lib\clinical-summary\ClinicalSummaryTypes.ts
- lib\clinical-summary\ClinicalSummaryTypes.ts

### PainAnalyzer

- lib\clinical-summary\PainAnalyzer.ts
- lib\clinical-summary\PainAnalyzer.ts

### SymptomsAnalyzer

- lib\clinical-summary\SymptomsAnalyzer.ts
- lib\clinical-summary\SymptomsAnalyzer.ts

### TemperatureAnalyzer

- lib\clinical-summary\TemperatureAnalyzer.ts
- lib\clinical-summary\TemperatureAnalyzer.ts

### VitalsAnalyzer

- lib\clinical-summary\VitalsAnalyzer.ts
- lib\clinical-summary\VitalsAnalyzer.ts

### DEFAULT_CONSENT_LANGUAGE

- lib\config\consent.ts
- lib\constants\consentVersions.ts

### ConsentMapper

- lib\consent\mapper\consentMapper.ts
- lib\consent\mapper\consentMapper.ts

### ConsentRow

- lib\consent\mapper\consentMapper.ts
- lib\consent\mapper\consentMapper.ts
- lib\consent\repository\consentRepository.ts

### Consent

- lib\consent\models\Consent.ts
- lib\consent\models\Consent.ts

### ConsentRepository

- lib\consent\repository\consentRepository.ts
- lib\consent\repository\consentRepository.ts

### ConsentStorage

- lib\consent\storage\consentStorage.ts
- lib\consent\storage\consentStorage.ts

### PatientRow

- lib\database.ts
- lib\database.ts

### SelfProfileRow

- lib\database.ts
- lib\database.ts

### ClinicalEventRow

- lib\database.ts
- lib\database.ts

### LanguageOption

- lib\i18n\config.ts
- lib\i18n\config.ts

### as

- lib\i18n\translations\as.ts
- lib\mappers\clinicalEventMapper.ts

### SupportedLanguage

- lib\i18n\types.ts
- lib\i18n\types.ts
- components\language\LanguageProvider.tsx
- Components\language\LanguageProvider.tsx

### TranslationDictionary

- lib\i18n\types.ts
- lib\i18n\types.ts

### Engine

- lib\journey\activeTreatment\lifecycleEngine.ts
- lib\journey\activeTreatment\lifecycleEngine.ts
- lib\journey\classification\journeyClassificationEngine.ts
- lib\journey\classification\journeyClassificationEngine.ts
- lib\journey\governance\governanceEngine.ts
- lib\journey\governance\governanceEngine.ts
- lib\journey\scenarios\scenarioEngine.ts
- lib\journey\scenarios\scenarioEngine.ts
- lib\journey\treatment\treatmentDecisionEngine.ts
- lib\journey\treatment\treatmentDecisionEngine.ts
- scripts\scaffoldMedicationManagement.ts
- scripts\scaffoldMedicationManagement.ts

### Mapper

- lib\journey\activeTreatment\lifecycleMapper.ts
- lib\journey\activeTreatment\lifecycleMapper.ts
- lib\journey\classification\classificationMapper.ts
- lib\journey\classification\classificationMapper.ts
- lib\journey\treatment\treatmentDecisionMapper.ts
- lib\journey\treatment\treatmentDecisionMapper.ts
- scripts\scaffoldMedicationManagement.ts
- scripts\scaffoldMedicationManagement.ts

### Repository

- lib\journey\activeTreatment\lifecycleRepository.ts
- lib\journey\activeTreatment\lifecycleRepository.ts
- lib\journey\classification\classificationRepository.ts
- lib\journey\classification\classificationRepository.ts
- lib\journey\governance\governanceRepository.ts
- lib\journey\governance\governanceRepository.ts
- lib\journey\timeline\timelineEventRepository.ts
- lib\journey\timeline\timelineEventRepository.ts
- lib\journey\treatment\treatmentDecisionRepository.ts
- lib\journey\treatment\treatmentDecisionRepository.ts
- scripts\scaffoldMedicationManagement.ts
- scripts\scaffoldMedicationManagement.ts

### Storage

- lib\journey\activeTreatment\lifecycleStorage.ts
- lib\journey\activeTreatment\lifecycleStorage.ts
- lib\journey\classification\classificationStorage.ts
- lib\journey\classification\classificationStorage.ts
- lib\journey\governance\governanceStorage.ts
- lib\journey\governance\governanceStorage.ts
- lib\journey\timeline\timelineEventStorage.ts
- lib\journey\timeline\timelineEventStorage.ts
- lib\journey\treatment\treatmentDecisionStorage.ts
- lib\journey\treatment\treatmentDecisionStorage.ts
- scripts\scaffoldMedicationManagement.ts
- scripts\scaffoldMedicationManagement.ts

### Validator

- lib\journey\activeTreatment\lifecycleValidator.ts
- lib\journey\activeTreatment\lifecycleValidator.ts
- lib\journey\classification\classificationValidator.ts
- lib\journey\classification\classificationValidator.ts
- lib\journey\context\journeyContextValidator.ts
- lib\journey\context\journeyContextValidator.ts
- lib\journey\governance\governanceValidator.ts
- lib\journey\governance\governanceValidator.ts
- lib\journey\scenarios\scenarioValidator.ts
- lib\journey\scenarios\scenarioValidator.ts
- lib\journey\timeline\timelineEventValidator.ts
- lib\journey\timeline\timelineEventValidator.ts
- lib\journey\treatment\treatmentDecisionValidator.ts
- lib\journey\treatment\treatmentDecisionValidator.ts
- scripts\scaffoldMedicationManagement.ts
- scripts\scaffoldMedicationManagement.ts

### Model

- lib\journey\activeTreatment\models\lifecycleModel.ts
- lib\journey\activeTreatment\models\lifecycleModel.ts
- lib\journey\classification\models\classificationModel.ts
- lib\journey\classification\models\classificationModel.ts
- lib\journey\governance\models\governanceModel.ts
- lib\journey\governance\models\governanceModel.ts
- lib\journey\scenarios\models\scenarioModel.ts
- lib\journey\scenarios\models\scenarioModel.ts
- lib\journey\timeline\models\timelineEventModel.ts
- lib\journey\timeline\models\timelineEventModel.ts
- lib\journey\treatment\models\treatmentDecisionModel.ts
- lib\journey\treatment\models\treatmentDecisionModel.ts
- scripts\scaffoldMedicationManagement.ts
- scripts\scaffoldMedicationManagement.ts

### Classifier

- lib\journey\classification\consultationClassifier.ts
- lib\journey\classification\consultationClassifier.ts
- scripts\scaffoldMedicationManagement.ts
- scripts\scaffoldMedicationManagement.ts

### JourneyContext

- lib\journey\context\journeyContext.ts
- lib\journey\context\journeyContext.ts
- lib\journey\journeyModels.ts
- lib\journey\journeyModels.ts
- scripts\scaffoldMedicationManagement.ts
- scripts\scaffoldMedicationManagement.ts

### Builder

- lib\journey\context\journeyContextBuilder.ts
- lib\journey\context\journeyContextBuilder.ts
- lib\journey\timeline\timelineEventBuilder.ts
- lib\journey\timeline\timelineEventBuilder.ts
- scripts\scaffoldMedicationManagement.ts
- scripts\scaffoldMedicationManagement.ts

### JourneyAnalysisEngine

- lib\journey\JourneyAnalysisEngine.ts
- lib\journey\JourneyAnalysisEngine.ts

### JourneyMapper

- lib\journey\journeyMapper.ts
- lib\journey\journeyMapper.ts

### DetectedChange

- lib\journey\journeyModels.ts
- lib\journey\journeyModels.ts

### JourneyQuestionOption

- lib\journey\journeyModels.ts
- lib\journey\journeyModels.ts

### JourneyQuestion

- lib\journey\journeyModels.ts
- lib\journey\journeyModels.ts

### TreatmentDecision

- lib\journey\journeyModels.ts
- lib\journey\journeyModels.ts

### TreatmentMedicine

- lib\journey\journeyModels.ts
- lib\journey\journeyModels.ts

### ActiveTreatment

- lib\journey\journeyModels.ts
- lib\journey\journeyModels.ts

### JourneySummaryItem

- lib\journey\journeyModels.ts
- lib\journey\journeyModels.ts

### JourneySummary

- lib\journey\journeyModels.ts
- lib\journey\journeyModels.ts

### TimelineDraftEvent

- lib\journey\journeyModels.ts
- lib\journey\journeyModels.ts

### TimelineDraft

- lib\journey\journeyModels.ts
- lib\journey\journeyModels.ts

### JourneyAction

- lib\journey\journeyModels.ts
- lib\journey\journeyModels.ts

### JourneyAnalysisResult

- lib\journey\journeyModels.ts
- lib\journey\journeyModels.ts

### JourneyRepository

- lib\journey\journeyRepository.ts
- lib\journey\journeyRepository.ts

### JourneyRule

- lib\journey\journeyRules.ts
- lib\journey\journeyRules.ts

### JourneyStorage

- lib\journey\journeyStorage.ts
- lib\journey\journeyStorage.ts

### JourneyType

- lib\journey\journeyTypes.ts
- lib\journey\journeyTypes.ts

### JourneyStatus

- lib\journey\journeyTypes.ts
- lib\journey\journeyTypes.ts

### JourneyQuestionType

- lib\journey\journeyTypes.ts
- lib\journey\journeyTypes.ts

### JourneyQuestionCategory

- lib\journey\journeyTypes.ts
- lib\journey\journeyTypes.ts

### JourneyChangeType

- lib\journey\journeyTypes.ts
- lib\journey\journeyTypes.ts

### JourneyEventType

- lib\journey\journeyTypes.ts
- lib\journey\journeyTypes.ts

### TreatmentDecisionType

- lib\journey\journeyTypes.ts
- lib\journey\journeyTypes.ts

### EmergencyType

- lib\journey\journeyTypes.ts
- lib\journey\journeyTypes.ts

### ConsultationContext

- lib\journey\journeyTypes.ts
- lib\journey\journeyTypes.ts

### ConsultationSource

- lib\journey\journeyTypes.ts
- lib\journey\journeyTypes.ts
- lib\treatment\treatmentTypes.ts
- lib\treatment\treatmentTypes.ts

### JourneyUtils

- lib\journey\journeyUtils.ts
- lib\journey\journeyUtils.ts

### JourneyValidation

- lib\journey\journeyValidation.ts
- lib\journey\journeyValidation.ts

### QuestionBuilder

- lib\journey\questionBuilder.ts
- lib\journey\questionBuilder.ts

### Registry

- lib\journey\scenarios\scenarioRegistry.ts
- lib\journey\scenarios\scenarioRegistry.ts
- scripts\scaffoldMedicationManagement.ts
- scripts\scaffoldMedicationManagement.ts

### Resolver

- lib\journey\scenarios\scenarioResolver.ts
- lib\journey\scenarios\scenarioResolver.ts
- scripts\scaffoldMedicationManagement.ts
- scripts\scaffoldMedicationManagement.ts

### SummaryBuilder

- lib\journey\summaryBuilder.ts
- lib\journey\summaryBuilder.ts

### TimelineBuilder

- lib\journey\timelineBuilder.ts
- lib\journey\timelineBuilder.ts

### AssessmentMapper

- lib\mappers\assessmentMapper.ts
- lib\mappers\assessmentMapper.ts

### AssessmentRow

- lib\mappers\assessmentMapper.ts
- lib\mappers\assessmentMapper.ts
- lib\repositories\assessmentRepository.ts

### ClinicalEventMapper

- lib\mappers\clinicalEventMapper.ts
- lib\mappers\clinicalEventMapper.ts

### DailyCareMapper

- lib\mappers\DailyCareMapper.ts
- lib\mappers\DailyCareMapper.ts

### DailyCareRow

- lib\mappers\DailyCareMapper.ts
- lib\mappers\DailyCareMapper.ts
- lib\repositories\DailyCareRepository.ts

### PatientMapper

- lib\mappers\PatientMapper.ts
- lib\mappers\PatientMapper.ts

### SelfDailyCareMapper

- lib\mappers\SelfDailyCareMapper.ts
- lib\mappers\SelfDailyCareMapper.ts

### SelfDailyCareRow

- lib\mappers\SelfDailyCareMapper.ts
- lib\mappers\SelfDailyCareMapper.ts
- lib\repositories\SelfDailyCareRepository.ts

### SelfProfileMapper

- lib\mappers\SelfProfileMapper.ts
- lib\mappers\SelfProfileMapper.ts

### MedicalImageReadings

- lib\medical-image\medicalImageTypes.ts
- lib\medical-image\medicalImageTypes.ts

### MedicalImageProcessingResult

- lib\medical-image\medicalImageTypes.ts
- lib\medical-image\medicalImageTypes.ts

### MedicalVoiceDailyCareDraft

- lib\medical-voice\medicalVoiceTypes.ts
- lib\medical-voice\medicalVoiceTypes.ts

### MedicalVoiceProcessingData

- lib\medical-voice\medicalVoiceTypes.ts
- lib\medical-voice\medicalVoiceTypes.ts

### MedicalVoiceOverallObservation

- lib\medical-voice\medicalVoiceTypes.ts
- lib\medical-voice\medicalVoiceTypes.ts

### MedicalVoiceProcessingMode

- lib\medical-voice\medicalVoiceTypes.ts
- lib\medical-voice\medicalVoiceTypes.ts

### MedicalVoiceProcessingResult

- lib\medical-voice\medicalVoiceTypes.ts
- lib\medical-voice\medicalVoiceTypes.ts

### DailyCarePdfGenerator

- lib\pdf\DailyCarePdfGenerator.ts
- lib\pdf\DailyCarePdfGenerator.ts

### PdfFormatter

- lib\pdf\PdfFormatter.ts
- lib\pdf\PdfFormatter.ts

### DailyCarePdfRequest

- lib\pdf\PdfModels.ts
- lib\pdf\PdfModels.ts

### DailyCareReportType

- lib\pdf\PdfModels.ts
- lib\pdf\PdfModels.ts

### TrendReportPdf

- lib\pdf\trendReportPdf.ts
- lib\pdf\trendReportPdf.ts

### PendingPerformanceTransition

- lib\performance\performanceTypes.ts
- lib\performance\performanceTypes.ts

### PerformanceRecord

- lib\performance\performanceTypes.ts
- lib\performance\performanceTypes.ts

### PerformanceStatus

- lib\performance\performanceTypes.ts
- lib\performance\performanceTypes.ts

### PerformanceContext

- lib\performance\performanceTypes.ts
- lib\performance\performanceTypes.ts

### PerformanceDeviceType

- lib\performance\performanceTypes.ts
- lib\performance\performanceTypes.ts

### PerformancePlatform

- lib\performance\performanceTypes.ts
- lib\performance\performanceTypes.ts

### PrescriptionSaveContext

- lib\prescription\prescriptionStorage.ts
- lib\prescription\prescriptionStorage.ts

### PrescriptionMedicineInput

- lib\prescription\prescriptionTypes.ts
- lib\prescription\prescriptionTypes.ts

### PrescriptionVitalInput

- lib\prescription\prescriptionTypes.ts
- lib\prescription\prescriptionTypes.ts

### PrescriptionSymptomInput

- lib\prescription\prescriptionTypes.ts
- lib\prescription\prescriptionTypes.ts

### PrescriptionHistoryInput

- lib\prescription\prescriptionTypes.ts
- lib\prescription\prescriptionTypes.ts

### PrescriptionAssessmentInput

- lib\prescription\prescriptionTypes.ts
- lib\prescription\prescriptionTypes.ts

### PrescriptionInvestigationInput

- lib\prescription\prescriptionTypes.ts
- lib\prescription\prescriptionTypes.ts

### PrescriptionInstructionInput

- lib\prescription\prescriptionTypes.ts
- lib\prescription\prescriptionTypes.ts

### PrescriptionNoteInput

- lib\prescription\prescriptionTypes.ts
- lib\prescription\prescriptionTypes.ts

### PrescriptionSaveInput

- lib\prescription\prescriptionTypes.ts
- lib\prescription\prescriptionTypes.ts

### PrescriptionRecord

- lib\prescription\prescriptionTypes.ts
- lib\prescription\prescriptionTypes.ts

### PrescriptionMedicineRecord

- lib\prescription\prescriptionTypes.ts
- lib\prescription\prescriptionTypes.ts

### CompletePrescriptionRecord

- lib\prescription\prescriptionTypes.ts
- lib\prescription\prescriptionTypes.ts

### PrescriptionRecordContext

- lib\prescription\prescriptionTypes.ts
- lib\prescription\prescriptionTypes.ts

### PrescriptionConsultationMode

- lib\prescription\prescriptionTypes.ts
- lib\prescription\prescriptionTypes.ts

### PrescriptionValidationResult

- lib\prescription\prescriptionValidator.ts
- lib\prescription\prescriptionValidator.ts

### RoutedAssessment

- lib\prescription-ai\classification\clinicalRouter.ts
- lib\prescription-ai\classification\clinicalRouter.ts

### RoutedInvestigation

- lib\prescription-ai\classification\clinicalRouter.ts
- lib\prescription-ai\classification\clinicalRouter.ts

### RoutedInstruction

- lib\prescription-ai\classification\clinicalRouter.ts
- lib\prescription-ai\classification\clinicalRouter.ts

### RoutedPrescription

- lib\prescription-ai\classification\clinicalRouter.ts
- lib\prescription-ai\classification\clinicalRouter.ts

### PatientInfo

- lib\prescription-ai\models\consultationModel.ts
- lib\prescription-ai\models\consultationModel.ts

### ConsultationInfo

- lib\prescription-ai\models\consultationModel.ts
- lib\prescription-ai\models\consultationModel.ts

### ConsultationVitals

- lib\prescription-ai\models\consultationModel.ts
- lib\prescription-ai\models\consultationModel.ts

### Complaint

- lib\prescription-ai\models\consultationModel.ts
- lib\prescription-ai\models\consultationModel.ts

### History

- lib\prescription-ai\models\consultationModel.ts
- lib\prescription-ai\models\consultationModel.ts

### Assessment

- lib\prescription-ai\models\consultationModel.ts
- lib\prescription-ai\models\consultationModel.ts

### Investigation

- lib\prescription-ai\models\consultationModel.ts
- lib\prescription-ai\models\consultationModel.ts

### Medicine

- lib\prescription-ai\models\consultationModel.ts
- lib\prescription-ai\models\consultationModel.ts

### DoctorInstruction

- lib\prescription-ai\models\consultationModel.ts
- lib\prescription-ai\models\consultationModel.ts

### FollowUp

- lib\prescription-ai\models\consultationModel.ts
- lib\prescription-ai\models\consultationModel.ts

### ConsultationRecord

- lib\prescription-ai\models\consultationModel.ts
- lib\prescription-ai\models\consultationModel.ts

### HistoryCategory

- lib\prescription-ai\models\consultationModel.ts
- lib\prescription-ai\models\consultationModel.ts
- lib\prescription-image\prescriptionImageTypes.ts
- lib\prescription-image\prescriptionImageTypes.ts

### PrescriptionExample

- lib\prescription-ai\prescriptionExamples.ts
- lib\prescription-ai\prescriptionExamples.ts

### ExtractedPrescriptionMedicine

- lib\prescription-image\prescriptionImageTypes.ts
- lib\prescription-image\prescriptionImageTypes.ts

### ExtractedConsultationVital

- lib\prescription-image\prescriptionImageTypes.ts
- lib\prescription-image\prescriptionImageTypes.ts

### ExtractedComplaint

- lib\prescription-image\prescriptionImageTypes.ts
- lib\prescription-image\prescriptionImageTypes.ts

### ExtractedHistory

- lib\prescription-image\prescriptionImageTypes.ts
- lib\prescription-image\prescriptionImageTypes.ts

### ExtractedExaminationFinding

- lib\prescription-image\prescriptionImageTypes.ts
- lib\prescription-image\prescriptionImageTypes.ts

### ExtractedPrescription

- lib\prescription-image\prescriptionImageTypes.ts
- lib\prescription-image\prescriptionImageTypes.ts

### PrescriptionImageProcessingResult

- lib\prescription-image\prescriptionImageTypes.ts
- lib\prescription-image\prescriptionImageTypes.ts

### MedicalDocumentType

- lib\prescription-image\prescriptionImageTypes.ts
- lib\prescription-image\prescriptionImageTypes.ts

### AssessmentRecord

- lib\reportStorage.ts
- lib\reportStorage.ts
- lib\types\assessment.ts
- lib\types\assessment.ts

### AssessmentRepository

- lib\repositories\assessmentRepository.ts
- lib\repositories\assessmentRepository.ts

### ClinicalEventRepository

- lib\repositories\clinicalEventRepository.ts
- lib\repositories\clinicalEventRepository.ts

### DailyCareRepository

- lib\repositories\DailyCareRepository.ts
- lib\repositories\DailyCareRepository.ts

### PatientRepository

- lib\repositories\patientRepository.ts
- lib\repositories\patientRepository.ts

### ProfileRepository

- lib\repositories\profileRepository.ts
- lib\repositories\profileRepository.ts

### SelfDailyCareRepository

- lib\repositories\SelfDailyCareRepository.ts
- lib\repositories\SelfDailyCareRepository.ts

### SelfProfileRepository

- lib\repositories\SelfProfileRepository.ts
- lib\repositories\SelfProfileRepository.ts

### SelfTrendRepository

- lib\repositories\SelfTrendRepository.ts
- lib\repositories\SelfTrendRepository.ts

### TrendRepository

- lib\repositories\TrendRepository.ts
- lib\repositories\TrendRepository.ts

### SelfProfile

- lib\selfProfile.ts
- lib\selfProfile.ts

### AssessmentDraftStorage

- lib\storage\assessmentDraftStorage.ts
- lib\storage\assessmentDraftStorage.ts

### AssessmentStorage

- lib\storage\assessmentStorage.ts
- lib\storage\assessmentStorage.ts

### ClinicalEventStorage

- lib\storage\clinicalEventStorage.ts
- lib\storage\clinicalEventStorage.ts

### DailyCareStorage

- lib\storage\DailyCareStorage.ts
- lib\storage\DailyCareStorage.ts

### SelfDailyCareStorage

- lib\storage\SelfDailyCareStorage.ts
- lib\storage\SelfDailyCareStorage.ts

### SelfTrendStorage

- lib\storage\selfTrendStorage.ts
- lib\storage\selfTrendStorage.ts

### StorageResult

- lib\storage\storageResult.ts
- lib\storage\storageResult.ts

### TrendDraftStorage

- lib\storage\trendDraftStorage.ts
- lib\storage\trendDraftStorage.ts

### TrendStorage

- lib\storage\TrendStorage.ts
- lib\storage\TrendStorage.ts

### ContactInformation

- lib\treatment\treatmentModels.ts
- lib\treatment\treatmentModels.ts

### PostalAddress

- lib\treatment\treatmentModels.ts
- lib\treatment\treatmentModels.ts

### GeoLocation

- lib\treatment\treatmentModels.ts
- lib\treatment\treatmentModels.ts

### NameValuePair

- lib\treatment\treatmentModels.ts
- lib\treatment\treatmentModels.ts

### DoctorModel

- lib\treatment\treatmentModels.ts
- lib\treatment\treatmentModels.ts

### HospitalModel

- lib\treatment\treatmentModels.ts
- lib\treatment\treatmentModels.ts

### DiagnosisModel

- lib\treatment\treatmentModels.ts
- lib\treatment\treatmentModels.ts

### InvestigationModel

- lib\treatment\treatmentModels.ts
- lib\treatment\treatmentModels.ts

### FollowUpModel

- lib\treatment\treatmentModels.ts
- lib\treatment\treatmentModels.ts

### ConsultationReference

- lib\treatment\treatmentModels.ts
- lib\treatment\treatmentModels.ts

### MedicineDose

- lib\treatment\treatmentModels.ts
- lib\treatment\treatmentModels.ts

### MedicineSchedule

- lib\treatment\treatmentModels.ts
- lib\treatment\treatmentModels.ts

### MedicineModel

- lib\treatment\treatmentModels.ts
- lib\treatment\treatmentModels.ts

### TreatmentMedicineModel

- lib\treatment\treatmentModels.ts
- lib\treatment\treatmentModels.ts

### TreatmentClinicalContext

- lib\treatment\treatmentModels.ts
- lib\treatment\treatmentModels.ts

### TreatmentPlanModel

- lib\treatment\treatmentModels.ts
- lib\treatment\treatmentModels.ts

### MedicineComparisonModel

- lib\treatment\treatmentModels.ts
- lib\treatment\treatmentModels.ts

### TreatmentComparisonModel

- lib\treatment\treatmentModels.ts
- lib\treatment\treatmentModels.ts

### FollowUpQuestionModel

- lib\treatment\treatmentModels.ts
- lib\treatment\treatmentModels.ts

### ConsultationSummaryModel

- lib\treatment\treatmentModels.ts
- lib\treatment\treatmentModels.ts

### TreatmentSummaryModel

- lib\treatment\treatmentModels.ts
- lib\treatment\treatmentModels.ts

### TreatmentReviewModel

- lib\treatment\treatmentModels.ts
- lib\treatment\treatmentModels.ts

### PrescriptionExtractionModel

- lib\treatment\treatmentModels.ts
- lib\treatment\treatmentModels.ts

### TreatmentProcessingResultModel

- lib\treatment\treatmentModels.ts
- lib\treatment\treatmentModels.ts

### TreatmentAggregateModel

- lib\treatment\treatmentModels.ts
- lib\treatment\treatmentModels.ts

### ReadonlyTreatmentPlan

- lib\treatment\treatmentModels.ts
- lib\treatment\treatmentModels.ts

### ReadonlyTreatmentMedicine

- lib\treatment\treatmentModels.ts
- lib\treatment\treatmentModels.ts

### ReadonlyMedicine

- lib\treatment\treatmentModels.ts
- lib\treatment\treatmentModels.ts

### ReadonlyTreatmentComparison

- lib\treatment\treatmentModels.ts
- lib\treatment\treatmentModels.ts

### ReadonlyTreatmentReview

- lib\treatment\treatmentModels.ts
- lib\treatment\treatmentModels.ts

### ReadonlyTreatmentAggregate

- lib\treatment\treatmentModels.ts
- lib\treatment\treatmentModels.ts

### TreatmentRepository

- lib\treatment\treatmentRepository.ts
- lib\treatment\treatmentRepository.ts

### TreatmentStorage

- lib\treatment\treatmentStorage.ts
- lib\treatment\treatmentStorage.ts

### JsonObject

- lib\treatment\treatmentTypes.ts
- lib\treatment\treatmentTypes.ts

### JsonArray

- lib\treatment\treatmentTypes.ts
- lib\treatment\treatmentTypes.ts

### AuditMetadata

- lib\treatment\treatmentTypes.ts
- lib\treatment\treatmentTypes.ts

### ConfidenceScore

- lib\treatment\treatmentTypes.ts
- lib\treatment\treatmentTypes.ts

### UUID

- lib\treatment\treatmentTypes.ts
- lib\treatment\treatmentTypes.ts

### ISODate

- lib\treatment\treatmentTypes.ts
- lib\treatment\treatmentTypes.ts

### ISODateTime

- lib\treatment\treatmentTypes.ts
- lib\treatment\treatmentTypes.ts

### Nullable

- lib\treatment\treatmentTypes.ts
- lib\treatment\treatmentTypes.ts

### Optional

- lib\treatment\treatmentTypes.ts
- lib\treatment\treatmentTypes.ts

### ValueOf

- lib\treatment\treatmentTypes.ts
- lib\treatment\treatmentTypes.ts

### DeepReadonly

- lib\treatment\treatmentTypes.ts
- lib\treatment\treatmentTypes.ts

### JsonPrimitive

- lib\treatment\treatmentTypes.ts
- lib\treatment\treatmentTypes.ts

### JsonValue

- lib\treatment\treatmentTypes.ts
- lib\treatment\treatmentTypes.ts

### ActiveTreatmentStatus

- lib\treatment\treatmentTypes.ts
- lib\treatment\treatmentTypes.ts

### ActiveMedicineStatus

- lib\treatment\treatmentTypes.ts
- lib\treatment\treatmentTypes.ts

### TerminalTreatmentStatus

- lib\treatment\treatmentTypes.ts
- lib\treatment\treatmentTypes.ts

### AuditAction

- lib\treatment\treatmentTypes.ts
- lib\treatment\treatmentTypes.ts

### AuditActorType

- lib\treatment\treatmentTypes.ts
- lib\treatment\treatmentTypes.ts

### TreatmentStatus

- lib\treatment\treatmentTypes.ts
- lib\treatment\treatmentTypes.ts

### TreatmentOutcome

- lib\treatment\treatmentTypes.ts
- lib\treatment\treatmentTypes.ts

### TreatmentPriority

- lib\treatment\treatmentTypes.ts
- lib\treatment\treatmentTypes.ts

### TreatmentSource

- lib\treatment\treatmentTypes.ts
- lib\treatment\treatmentTypes.ts

### TreatmentChangeType

- lib\treatment\treatmentTypes.ts
- lib\treatment\treatmentTypes.ts

### DiagnosisStatus

- lib\treatment\treatmentTypes.ts
- lib\treatment\treatmentTypes.ts

### FollowUpStatus

- lib\treatment\treatmentTypes.ts
- lib\treatment\treatmentTypes.ts

### InvestigationStatus

- lib\treatment\treatmentTypes.ts
- lib\treatment\treatmentTypes.ts

### ConfidenceLevel

- lib\treatment\treatmentTypes.ts
- lib\treatment\treatmentTypes.ts

### MedicineStatus

- lib\treatment\treatmentTypes.ts
- lib\treatment\treatmentTypes.ts

### MedicineType

- lib\treatment\treatmentTypes.ts
- lib\treatment\treatmentTypes.ts

### MedicineForm

- lib\treatment\treatmentTypes.ts
- lib\treatment\treatmentTypes.ts

### MedicineRoute

- lib\treatment\treatmentTypes.ts
- lib\treatment\treatmentTypes.ts

### DosageUnit

- lib\treatment\treatmentTypes.ts
- lib\treatment\treatmentTypes.ts

### MedicineFrequency

- lib\treatment\treatmentTypes.ts
- lib\treatment\treatmentTypes.ts

### MedicineTiming

- lib\treatment\treatmentTypes.ts
- lib\treatment\treatmentTypes.ts

### PrnReason

- lib\treatment\treatmentTypes.ts
- lib\treatment\treatmentTypes.ts

### ScheduleType

- lib\treatment\treatmentTypes.ts
- lib\treatment\treatmentTypes.ts

### MedicineInstructionType

- lib\treatment\treatmentTypes.ts
- lib\treatment\treatmentTypes.ts

### TimelineEventType

- lib\treatment\treatmentTypes.ts
- lib\treatment\treatmentTypes.ts

### ReconciliationStatus

- lib\treatment\treatmentTypes.ts
- lib\treatment\treatmentTypes.ts

### MedicineMatchType

- lib\treatment\treatmentTypes.ts
- lib\treatment\treatmentTypes.ts

### ExtractionStatus

- lib\treatment\treatmentTypes.ts
- lib\treatment\treatmentTypes.ts

### ProcessingStage

- lib\treatment\treatmentTypes.ts
- lib\treatment\treatmentTypes.ts

### QuestionPriority

- lib\treatment\treatmentTypes.ts
- lib\treatment\treatmentTypes.ts

### QuestionReason

- lib\treatment\treatmentTypes.ts
- lib\treatment\treatmentTypes.ts

### ReminderStatus

- lib\treatment\treatmentTypes.ts
- lib\treatment\treatmentTypes.ts

### ReminderType

- lib\treatment\treatmentTypes.ts
- lib\treatment\treatmentTypes.ts

### AdherenceStatus

- lib\treatment\treatmentTypes.ts
- lib\treatment\treatmentTypes.ts

### InteractionSeverity

- lib\treatment\treatmentTypes.ts
- lib\treatment\treatmentTypes.ts

### OperationResult

- lib\treatment\treatmentTypes.ts
- lib\treatment\treatmentTypes.ts

### ValidationIssue

- lib\treatment\treatmentValidation.ts
- lib\treatment\treatmentValidation.ts

### ValidationResult

- lib\treatment\treatmentValidation.ts
- lib\treatment\treatmentValidation.ts

### ValidationErrorCode

- lib\treatment\treatmentValidation.ts
- lib\treatment\treatmentValidation.ts

### ValidationSeverity

- lib\treatment\treatmentValidation.ts
- lib\treatment\treatmentValidation.ts

### SelfTrendPdfGenerator

- lib\trends\selfTrendPdfGenerator.ts
- lib\trends\selfTrendPdfGenerator.ts

### TrendChartConfiguration

- lib\trends\trendChartConfig.ts
- lib\trends\trendChartConfig.ts

### TrendClinicalAnalyzer

- lib\trends\trendClinicalAnalyzer.ts
- lib\trends\trendClinicalAnalyzer.ts

### TrendPdfGenerator

- lib\trends\trendPdfGenerator.ts
- lib\trends\trendPdfGenerator.ts

### TrendReport

- lib\trends\trendReport.ts
- lib\trends\trendReport.ts

### TrendReportBuilder

- lib\trends\trendReportBuilder.ts
- lib\trends\trendReportBuilder.ts

### TrendParameters

- lib\trends\trendRequest.ts
- lib\trends\trendRequest.ts

### TrendPeriod

- lib\trends\trendRequest.ts
- lib\trends\trendRequest.ts

### TrendPoint

- lib\trends\trendResult.ts
- lib\trends\trendResult.ts

### TrendStatistics

- lib\trends\trendResult.ts
- lib\trends\trendResult.ts

### TrendAxis

- lib\trends\trendResult.ts
- lib\trends\trendResult.ts

### ParameterTrend

- lib\trends\trendResult.ts
- lib\trends\trendResult.ts

### TrendSummary

- lib\trends\trendResult.ts
- lib\trends\trendResult.ts

### TrendResult

- lib\trends\trendResult.ts
- lib\trends\trendResult.ts

### TrendParameterType

- lib\trends\trendResult.ts
- lib\trends\trendResult.ts

### AssessmentAnswers

- lib\types\assessment.ts
- lib\types\assessment.ts

### AssessmentInput

- lib\types\assessment.ts
- lib\types\assessment.ts

### AssessmentSummary

- lib\types\assessment.ts
- lib\types\assessment.ts

### AssessmentHistoryItem

- lib\types\assessment.ts
- lib\types\assessment.ts

### AssessmentType

- lib\types\assessment.ts
- lib\types\assessment.ts

### AssessmentStatus

- lib\types\assessment.ts
- lib\types\assessment.ts

### AssessmentRecommendation

- lib\types\assessment.ts
- lib\types\assessment.ts

### AssessmentDraft

- lib\types\assessmentDraft.ts
- lib\types\assessmentDraft.ts

### AssessmentScore

- lib\types\assessmentScore.ts
- lib\types\assessmentScore.ts

### ClinicalEvent

- lib\types\clinicalEvent.ts
- lib\types\clinicalEvent.ts

### CreateClinicalEventRequest

- lib\types\clinicalEvent.ts
- lib\types\clinicalEvent.ts

### ClinicalEventType

- lib\types\clinicalEvent.ts
- lib\types\clinicalEvent.ts

### DailyCare

- lib\types\dailyCare.ts
- lib\types\dailyCare.ts

### MedicationEntry

- lib\types\dailyCare.ts
- lib\types\dailyCare.ts

### CreateDailyCareRequest

- lib\types\dailyCare.ts
- lib\types\dailyCare.ts

### DailyCareOverallStatus

- lib\types\dailyCare.ts
- lib\types\dailyCare.ts

### DailyCareSymptom

- lib\types\dailyCare.ts
- lib\types\dailyCare.ts

### PainLocation

- lib\types\dailyCare.ts
- lib\types\dailyCare.ts

### Patient

- lib\types\patient.ts
- lib\types\patient.ts

### Profile

- lib\types\profile.ts
- lib\types\profile.ts

### AssessmentReport

- lib\types\report.ts
- lib\types\report.ts

### Result

- lib\types\result.ts
- lib\types\result.ts

### SelfDailyCare

- lib\types\selfDailyCare.ts
- lib\types\selfDailyCare.ts

### SelfMedicationEntry

- lib\types\selfDailyCare.ts
- lib\types\selfDailyCare.ts

### CreateSelfDailyCareRequest

- lib\types\selfDailyCare.ts
- lib\types\selfDailyCare.ts

### SelfDailyCareOverallStatus

- lib\types\selfDailyCare.ts
- lib\types\selfDailyCare.ts

### SelfDailyCareSymptom

- lib\types\selfDailyCare.ts
- lib\types\selfDailyCare.ts

### SelfPainLocation

- lib\types\selfDailyCare.ts
- lib\types\selfDailyCare.ts

### PatientValidator

- lib\validators\patientValidator.ts
- lib\validators\patientValidator.ts

### Props

- components\AssessmentLayout.tsx
- components\dashboard\prescription\PrescriptionTabs.tsx
- components\dashboard\prescription-review\ComplaintsCard.tsx
- components\dashboard\prescription-review\DoctorInstructionCard.tsx
- components\dashboard\prescription-review\OtherNotesCard.tsx
- components\dashboard\prescription-review\ReviewActions.tsx
- components\dashboard\prescription-review\VitalsCard.tsx
- Components\AssessmentLayout.tsx
- Components\dashboard\prescription\PrescriptionTabs.tsx
- Components\dashboard\prescription-review\ComplaintsCard.tsx
- Components\dashboard\prescription-review\DoctorInstructionCard.tsx
- Components\dashboard\prescription-review\OtherNotesCard.tsx
- Components\dashboard\prescription-review\ReviewActions.tsx
- Components\dashboard\prescription-review\VitalsCard.tsx

### VoiceRecorderProps

- components\daily-care\VoiceRecorder.tsx
- Components\daily-care\VoiceRecorder.tsx

### ActionOptionsProps

- components\dashboard\ActionOptions.tsx
- Components\dashboard\ActionOptions.tsx

### SupportedAction

- components\dashboard\ActionOptions.tsx
- Components\dashboard\ActionOptions.tsx

### ConsultationWorkspaceProps

- components\dashboard\ConsultationWorkspace.tsx
- Components\dashboard\ConsultationWorkspace.tsx

### ManualCareFormState

- components\dashboard\ManualCareWorkspace.tsx
- Components\dashboard\ManualCareWorkspace.tsx

### ManualCareWorkspaceProps

- components\dashboard\ManualCareWorkspace.tsx
- Components\dashboard\ManualCareWorkspace.tsx

### PrescriptionTab

- components\dashboard\prescription\PrescriptionTabs.tsx
- components\dashboard\prescription\PrescriptionTabs.tsx
- Components\dashboard\prescription\PrescriptionTabs.tsx
- Components\dashboard\prescription\PrescriptionTabs.tsx

### AssessmentCardProps

- components\dashboard\prescription-review\AssessmentCard.tsx
- Components\dashboard\prescription-review\AssessmentCard.tsx

### HistoryCardProps

- components\dashboard\prescription-review\HistoryCard.tsx
- Components\dashboard\prescription-review\HistoryCard.tsx

### InvestigationCardProps

- components\dashboard\prescription-review\InvestigationCard.tsx
- Components\dashboard\prescription-review\InvestigationCard.tsx

### PrescriptionHistoryWorkspaceProps

- components\dashboard\PrescriptionHistoryWorkspace.tsx
- Components\dashboard\PrescriptionHistoryWorkspace.tsx

### PrescriptionSummary

- components\dashboard\PrescriptionHistoryWorkspace.tsx
- Components\dashboard\PrescriptionHistoryWorkspace.tsx

### FilterMode

- components\dashboard\PrescriptionHistoryWorkspace.tsx
- Components\dashboard\PrescriptionHistoryWorkspace.tsx

### PrescriptionReviewProps

- components\dashboard\PrescriptionReview.tsx
- Components\dashboard\PrescriptionReview.tsx

### workspaceContainer

- components\dashboard\PrescriptionWorkspace.styles.ts
- Components\dashboard\PrescriptionWorkspace.styles.ts

### cameraContainer

- components\dashboard\PrescriptionWorkspace.styles.ts
- Components\dashboard\PrescriptionWorkspace.styles.ts

### cameraVideo

- components\dashboard\PrescriptionWorkspace.styles.ts
- Components\dashboard\PrescriptionWorkspace.styles.ts

### cameraActionRow

- components\dashboard\PrescriptionWorkspace.styles.ts
- Components\dashboard\PrescriptionWorkspace.styles.ts

### progressContainer

- components\dashboard\PrescriptionWorkspace.styles.ts
- Components\dashboard\PrescriptionWorkspace.styles.ts

### progressHeader

- components\dashboard\PrescriptionWorkspace.styles.ts
- Components\dashboard\PrescriptionWorkspace.styles.ts

### progressTrack

- components\dashboard\PrescriptionWorkspace.styles.ts
- Components\dashboard\PrescriptionWorkspace.styles.ts

### progressFill

- components\dashboard\PrescriptionWorkspace.styles.ts
- Components\dashboard\PrescriptionWorkspace.styles.ts

### errorBox

- components\dashboard\PrescriptionWorkspace.styles.ts
- Components\dashboard\PrescriptionWorkspace.styles.ts

### errorText

- components\dashboard\PrescriptionWorkspace.styles.ts
- Components\dashboard\PrescriptionWorkspace.styles.ts

### successBox

- components\dashboard\PrescriptionWorkspace.styles.ts
- Components\dashboard\PrescriptionWorkspace.styles.ts

### successText

- components\dashboard\PrescriptionWorkspace.styles.ts
- Components\dashboard\PrescriptionWorkspace.styles.ts

### PrescriptionWorkspaceProps

- components\dashboard\PrescriptionWorkspace.tsx
- Components\dashboard\PrescriptionWorkspace.tsx

### UploadCareWorkspaceProps

- components\dashboard\UploadCareWorkspace.tsx
- Components\dashboard\UploadCareWorkspace.tsx

### UploadReadingState

- components\dashboard\UploadCareWorkspace.tsx
- Components\dashboard\UploadCareWorkspace.tsx

### VoiceCareWorkspaceProps

- components\dashboard\VoiceCareWorkspace.tsx
- Components\dashboard\VoiceCareWorkspace.tsx

### HelpCardProps

- components\help\HelpCard.tsx
- Components\help\HelpCard.tsx

### LanguageContextValue

- components\language\LanguageProvider.tsx
- Components\language\LanguageProvider.tsx

### LanguageProviderProps

- components\language\LanguageProvider.tsx
- Components\language\LanguageProvider.tsx

### LanguageProvider

- components\language\LanguageProvider.tsx
- Components\language\LanguageProvider.tsx

### useLanguage

- components\language\LanguageProvider.tsx
- Components\language\LanguageProvider.tsx

### PersonSelectorProps

- components\patient\PersonSelector.tsx
- Components\patient\PersonSelector.tsx

### PersonMode

- components\patient\PersonSelector.tsx
- components\patient\PersonSelector.tsx
- Components\patient\PersonSelector.tsx
- Components\patient\PersonSelector.tsx

## Architecture Violations

No architecture violations detected.

## Governance Recommendations

## Keep

- app\components\TrendLineChart.tsx
- app\daily-care\components\ActionButtons.tsx
- app\daily-care\components\DailyCareForm.tsx
- app\daily-care\components\PainLocationCard.tsx
- app\daily-care\components\PatientCard.tsx
- app\daily-care\components\SymptomsCard.tsx
- app\daily-care\components\TemperatureCard.tsx
- app\daily-care\components\VitalsCard.tsx
- app\daily-care\styles.ts
- app\journey-review\ActiveTreatmentCard.tsx
- app\journey-review\ChangeCard.tsx
- app\journey-review\EmptyJourney.tsx
- app\journey-review\JourneyActions.tsx
- app\journey-review\JourneyConfidence.tsx
- app\journey-review\JourneyContext.tsx
- app\journey-review\JourneyDetectedChanges.tsx
- app\journey-review\JourneyHeader.tsx
- app\journey-review\JourneyQuestions.tsx
- app\journey-review\JourneySummaryCard.tsx
- app\journey-review\JourneyTimeline.tsx
- app\journey-review\LoadingJourney.tsx
- app\journey-review\QuestionCard.tsx
- app\journey-review\QuestionRenderer.tsx
- app\journey-review\SummaryCard.tsx
- app\journey-review\TimelinePreview.tsx
- app\journey-review\TreatmentDecisionCard.tsx
- lib\auth\authService.ts
- lib\clinical-intelligence\comparisonTypes.ts
- lib\clinical-summary\ClinicalSummaryTypes.ts
- lib\clinical-summary\PainAnalyzer.ts
- lib\clinical-summary\SymptomsAnalyzer.ts
- lib\clinical-summary\TemperatureAnalyzer.ts
- lib\clinical-summary\VitalsAnalyzer.ts
- lib\database.ts
- lib\i18n\translations\as.ts
- lib\i18n\translations\bn.ts
- lib\i18n\translations\en.ts
- lib\i18n\translations\gu.ts
- lib\i18n\translations\hi.ts
- lib\i18n\translations\kn.ts
- lib\i18n\translations\ml.ts
- lib\i18n\translations\mr.ts
- lib\i18n\translations\or.ts
- lib\i18n\translations\pa.ts
- lib\i18n\translations\ta.ts
- lib\i18n\translations\te.ts
- lib\i18n\types.ts
- lib\journey\journeyConstants.ts
- lib\journey\journeyMapper.ts
- lib\journey\journeyModels.ts
- lib\journey\journeyRules.ts
- lib\journey\journeyStorage.ts
- lib\journey\journeyTypes.ts
- lib\journey\journeyUtils.ts
- lib\journey\journeyValidation.ts
- lib\journey\questionBuilder.ts
- lib\journey\summaryBuilder.ts
- lib\journey\timelineBuilder.ts
- lib\mappers\PatientMapper.ts
- lib\mappers\SelfProfileMapper.ts
- lib\medical-image\medicalImageTypes.ts
- lib\medical-voice\medicalVoiceTypes.ts
- lib\pdf\PdfModels.ts
- lib\performance\performanceStorage.ts
- lib\performance\performanceTypes.ts
- lib\prescription-ai\consultation\assessmentRules.ts
- lib\prescription-ai\consultation\complaintsRules.ts
- lib\prescription-ai\consultation\consultationPromptBuilder.ts
- lib\prescription-ai\consultation\doctorInstructionRules.ts
- lib\prescription-ai\consultation\examinationRules.ts
- lib\prescription-ai\consultation\historyRules.ts
- lib\prescription-ai\consultation\investigationRules.ts
- lib\prescription-ai\consultation\vitalsRules.ts
- lib\prescription-ai\examples\consultationExamples.ts
- lib\prescription-ai\examples\generalMedicineExamples.ts
- lib\prescription-ai\examples\index.ts
- lib\prescription-ai\examples\oncologyExamples.ts
- lib\prescription-ai\prescriptionExamples.ts
- lib\prescription-ai\prescriptionKnowledge.ts
- lib\prescription-ai\prescriptionReadingRules.ts
- lib\prescription-ai\prescriptionRecognitionRules.ts
- lib\prescription-image\prescriptionImageTypes.ts
- lib\reportStorage.ts
- lib\repositories\BaseRepository.ts
- lib\repositories\patientRepository.ts
- lib\repositories\SelfProfileRepository.ts
- lib\selfProfile.ts
- lib\storage\storageResult.ts
- lib\supabase.ts
- lib\treatment\treatmentModels.ts
- lib\treatment\treatmentRepository.ts
- lib\treatment\treatmentTypes.ts
- lib\trends\trendChartConfig.ts
- lib\trends\trendReport.ts
- lib\trends\trendResult.ts
- lib\types\patient.ts
- lib\types\result.ts
- lib\validators\patientValidator.ts
- components\dashboard\prescription\PrescriptionTabs.tsx
- components\dashboard\prescription-review\AssessmentCard.tsx
- components\dashboard\prescription-review\ComplaintsCard.tsx
- components\dashboard\prescription-review\DoctorInstructionCard.tsx
- components\dashboard\prescription-review\HistoryCard.tsx
- components\dashboard\prescription-review\InvestigationCard.tsx
- components\dashboard\prescription-review\MedicineCard.tsx
- components\dashboard\prescription-review\OtherNotesCard.tsx
- components\dashboard\prescription-review\PatientCard.tsx
- components\dashboard\prescription-review\ReviewActions.tsx
- components\dashboard\prescription-review\VitalsCard.tsx
- components\dashboard\PrescriptionWorkspace.styles.ts
- components\language\LanguageProvider.tsx
- Components\dashboard\prescription\PrescriptionTabs.tsx
- Components\dashboard\prescription-review\AssessmentCard.tsx
- Components\dashboard\prescription-review\ComplaintsCard.tsx
- Components\dashboard\prescription-review\DoctorInstructionCard.tsx
- Components\dashboard\prescription-review\HistoryCard.tsx
- Components\dashboard\prescription-review\InvestigationCard.tsx
- Components\dashboard\prescription-review\MedicineCard.tsx
- Components\dashboard\prescription-review\OtherNotesCard.tsx
- Components\dashboard\prescription-review\PatientCard.tsx
- Components\dashboard\prescription-review\ReviewActions.tsx
- Components\dashboard\prescription-review\VitalsCard.tsx
- Components\dashboard\PrescriptionWorkspace.styles.ts
- Components\language\LanguageProvider.tsx

## Review

- app\add-patient\page.tsx
- app\admin\performance\page.tsx
- app\api\analytics\auth-session\login\route.ts
- app\api\analytics\auth-session\logout\route.ts
- app\api\analytics\event\route.ts
- app\api\medical-image\route.ts
- app\api\medical-voice\route.ts
- app\api\prescription-identity\route.ts
- app\api\prescription-image\route.ts
- app\auth\callback\route.ts
- app\care\page.tsx
- app\carevr-journey\page.tsx
- app\checkin\page.tsx
- app\components\AppBrand.tsx
- app\components\AppHeader.tsx
- app\components\common\ClinicalSummaryCard.tsx
- app\components\common\ReportNavigation.tsx
- app\components\dashboard\HelpWorkspace.tsx
- app\components\ReportTable.tsx
- app\components\TrendChart.tsx
- app\consent\page.tsx
- app\daily-care\page.tsx
- app\dashboard\page.tsx
- app\family\page.tsx
- app\family\page2\page.tsx
- app\family\page3\page.tsx
- app\family\page4\page.tsx
- app\family\page5\page.tsx
- app\forgot-password\page.tsx
- app\help\about\page.tsx
- app\help\assessments\page.tsx
- app\help\clinical-trends\page.tsx
- app\help\daily-care\page.tsx
- app\help\faq\page.tsx
- app\help\getting-started\page.tsx
- app\help\layout.tsx
- app\help\medication-management\page.tsx
- app\help\page.tsx
- app\help\pdf-reports\page.tsx
- app\help\privacy\page.tsx
- app\help\reports\page.tsx
- app\journey-review\JourneyReview.tsx
- app\journey-review\JourneyWizard.tsx
- app\layout.tsx
- app\login\page.tsx
- app\medications\consultation-mode\page.tsx
- app\medications\page.tsx
- app\medications\prescription\page.tsx
- app\page.tsx
- app\register\page.tsx
- app\report\page.tsx
- app\reports\assessment\family\page.tsx
- app\reports\assessment\family\[id]\page.tsx
- app\reports\assessment\page.tsx
- app\reports\assessment\self\page.tsx
- app\reports\assessment\self\[id]\page.tsx
- app\reports\daily-care\page.tsx
- app\reports\daily-care\select\page.tsx
- app\reports\daily-care\self\page.tsx
- app\reports\daily-care\self\[id]\page.tsx
- app\reports\daily-care\[id]\page.tsx
- app\reports\page.tsx
- app\reports\trends\page.tsx
- app\reports\trends\results\page.tsx
- app\reports\trends\selector\page.tsx
- app\reports\trends\self\page.tsx
- app\reports\trends\self\results\page.tsx
- app\reports\trends\trendRequest.ts
- app\reset-password\page.tsx
- app\self\page.tsx
- app\self\page2\page.tsx
- app\self\page3\page.tsx
- app\self\page4\page.tsx
- app\self\page5\page.tsx
- app\self-profile\page.tsx
- app\welcome\page.tsx
- lib\analytics\analyticsEvents.ts
- lib\analytics\analyticsIdentity.ts
- lib\analytics\analyticsService.ts
- lib\analytics\analyticsTypes.ts
- lib\analytics\authSessionService.ts
- lib\assessmentStorage.ts
- lib\builders\assessmentBuilder.ts
- lib\builders\clinicalEventBuilder.ts
- lib\builders\SelfTrendBuilder.ts
- lib\builders\TrendBuilder.ts
- lib\clinical-intelligence\ClinicalComparisonEngine.ts
- lib\clinical-summary\ClinicalSummaryEngine.ts
- lib\config\consent.ts
- lib\consent\mapper\consentMapper.ts
- lib\consent\models\Consent.ts
- lib\consent\repository\consentRepository.ts
- lib\consent\storage\consentStorage.ts
- lib\constants\consentVersions.ts
- lib\i18n\config.ts
- lib\i18n\index.ts
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
- lib\journey\classification\journeyClassificationEngine.ts
- lib\journey\classification\models\classificationModel.ts
- lib\journey\context\index.ts
- lib\journey\context\journeyContext.ts
- lib\journey\context\journeyContextBuilder.ts
- lib\journey\context\journeyContextValidator.ts
- lib\journey\governance\governanceEngine.ts
- lib\journey\governance\governanceRepository.ts
- lib\journey\governance\governanceRules.ts
- lib\journey\governance\governanceStorage.ts
- lib\journey\governance\governanceTypes.ts
- lib\journey\governance\governanceValidator.ts
- lib\journey\governance\index.ts
- lib\journey\governance\models\governanceModel.ts
- lib\journey\index.ts
- lib\journey\JourneyAnalysisEngine.ts
- lib\journey\journeyRepository.ts
- lib\journey\scenarios\index.ts
- lib\journey\scenarios\models\scenarioModel.ts
- lib\journey\scenarios\scenarioEngine.ts
- lib\journey\scenarios\scenarioRegistry.ts
- lib\journey\scenarios\scenarioResolver.ts
- lib\journey\scenarios\scenarioRules.ts
- lib\journey\scenarios\scenarioTypes.ts
- lib\journey\scenarios\scenarioValidator.ts
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
- lib\mappers\assessmentMapper.ts
- lib\mappers\clinicalEventMapper.ts
- lib\mappers\DailyCareMapper.ts
- lib\mappers\SelfDailyCareMapper.ts
- lib\medical-image\medicalImageParser.ts
- lib\medical-image\medicalImageService.ts
- lib\medical-voice\medicalVoiceService.ts
- lib\medicalFormatter.ts
- lib\pdf\DailyCarePdfGenerator.ts
- lib\pdf\PdfFormatter.ts
- lib\pdf\trendReportPdf.ts
- lib\performance\performanceTracker.ts
- lib\prescription\prescriptionMapper.ts
- lib\prescription\prescriptionRepository.ts
- lib\prescription\prescriptionReviewMapper.ts
- lib\prescription\prescriptionStorage.ts
- lib\prescription\prescriptionTypes.ts
- lib\prescription\prescriptionValidator.ts
- lib\prescription-ai\classification\clinicalRouter.ts
- lib\prescription-ai\examples\cardiologyExamples.ts
- lib\prescription-ai\examples\diabetesExamples.ts
- lib\prescription-ai\examples\pulmonologyExamples.ts
- lib\prescription-ai\extractionInstructions.ts
- lib\prescription-ai\identityExtractionInstructions.ts
- lib\prescription-ai\models\consultationModel.ts
- lib\prescription-image\prescriptionImageService.ts
- lib\repositories\assessmentRepository.ts
- lib\repositories\clinicalEventRepository.ts
- lib\repositories\DailyCareRepository.ts
- lib\repositories\profileRepository.ts
- lib\repositories\SelfDailyCareRepository.ts
- lib\repositories\SelfTrendRepository.ts
- lib\repositories\TrendRepository.ts
- lib\storage\assessmentDraftStorage.ts
- lib\storage\assessmentStorage.ts
- lib\storage\clinicalEventStorage.ts
- lib\storage\DailyCareStorage.ts
- lib\storage\patientStorage.ts
- lib\storage\SelfDailyCareStorage.ts
- lib\storage\SelfProfileStorage.ts
- lib\storage\selfTrendStorage.ts
- lib\storage\trendDraftStorage.ts
- lib\storage\TrendStorage.ts
- lib\supabase\server.ts
- lib\supabaseAdmin.ts
- lib\treatment\treatmentMapper.ts
- lib\treatment\treatmentRules.ts
- lib\treatment\treatmentStorage.ts
- lib\treatment\treatmentValidation.ts
- lib\trends\selfTrendPdfGenerator.ts
- lib\trends\trendClinicalAnalyzer.ts
- lib\trends\trendPdfGenerator.ts
- lib\trends\trendReportBuilder.ts
- lib\trends\trendRequest.ts
- lib\types\assessment.ts
- lib\types\assessmentDraft.ts
- lib\types\assessmentScore.ts
- lib\types\clinicalEvent.ts
- lib\types\dailyCare.ts
- lib\types\profile.ts
- lib\types\report.ts
- lib\types\selfDailyCare.ts
- lib\utils\appAlert.ts
- lib\utils\dateUtils.ts
- lib\utils\displayFormatter.ts
- lib\utils\pdf\assessmentPdf.ts
- components\AssessmentLayout.tsx
- components\daily-care\VoiceRecorder.tsx
- components\dashboard\ActionOptions.tsx
- components\dashboard\ConsultationWorkspace.tsx
- components\dashboard\ManualCareWorkspace.tsx
- components\dashboard\PrescriptionHistoryWorkspace.tsx
- components\dashboard\PrescriptionReview.tsx
- components\dashboard\PrescriptionWorkspace.tsx
- components\dashboard\UploadCareWorkspace.tsx
- components\dashboard\VoiceCareWorkspace.tsx
- components\Header.tsx
- components\help\HelpBackButton.tsx
- components\help\HelpCard.tsx
- components\language\LanguageSelector.tsx
- components\patient\PersonSelector.tsx
- Components\AssessmentLayout.tsx
- Components\daily-care\VoiceRecorder.tsx
- Components\dashboard\ActionOptions.tsx
- Components\dashboard\ConsultationWorkspace.tsx
- Components\dashboard\ManualCareWorkspace.tsx
- Components\dashboard\PrescriptionHistoryWorkspace.tsx
- Components\dashboard\PrescriptionReview.tsx
- Components\dashboard\PrescriptionWorkspace.tsx
- Components\dashboard\UploadCareWorkspace.tsx
- Components\dashboard\VoiceCareWorkspace.tsx
- Components\Header.tsx
- Components\help\HelpBackButton.tsx
- Components\help\HelpCard.tsx
- Components\language\LanguageSelector.tsx
- Components\patient\PersonSelector.tsx
- scripts\auditArchitecture.ts
- scripts\dependencyAudit.ts
- scripts\discoverProject.ts
- scripts\governArchitecture.ts
- scripts\scaffoldClinicalCore.ts
- scripts\scaffoldMedicationManagement.ts

## Delete

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
- components\common\ResponsiveTable.tsx
- components\dashboard\PrescriptionDetailsPanel.tsx
- Components\common\ResponsiveTable.tsx
- Components\dashboard\PrescriptionDetailsPanel.tsx
- scripts\analyzeArchitecture.ts
- scripts\benchmarkComparator.ts
- scripts\reviewArchitecture.ts


# Overall Assessment

|Category|Score|
|---|---:|
|Architecture Score|0.00 / 10|
|Maintainability|Excellent|
|Risk|Low|

Recommended Next Step:

Continue production development.
