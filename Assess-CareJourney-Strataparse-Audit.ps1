param(
    [string]$ProjectRoot = (Get-Location).Path,
    [string]$OutputFile = ".\CareJourney_Strataparse_Audit_Assessment.md"
)

$ErrorActionPreference = "Stop"

$project = (Resolve-Path $ProjectRoot).Path

$strataparse = Join-Path $project "Strataparse"
$recordHealth = Join-Path $project "app\record-health\page.tsx"
$wow = Join-Path $project "Components\dashboard\CareJourneyProcessingWorkspaceWOW.tsx"
$auditUi = Join-Path $project "app\admin\Audit"

function Get-SourceFiles {
    param([string]$Root)

    if (-not (Test-Path -LiteralPath $Root -PathType Container)) {
        return @()
    }

    return @(
        Get-ChildItem -LiteralPath $Root -Recurse -File |
        Where-Object {
            $_.FullName -notmatch '\\(node_modules|\.next|\.git|dist|build|coverage)\\' -and
            $_.Extension -in @(".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs", ".json")
        }
    )
}

function Find-Pattern {
    param(
        [string]$Pattern,
        [string[]]$Targets
    )

    $results = @()

    foreach ($target in $Targets) {

        if (Test-Path -LiteralPath $target -PathType Leaf) {

            $results += @(
                Select-String `
                    -LiteralPath $target `
                    -Pattern $Pattern `
                    -CaseSensitive:$false `
                    -ErrorAction SilentlyContinue
            )

        }
        elseif (Test-Path -LiteralPath $target -PathType Container) {

            foreach ($file in Get-SourceFiles $target) {

                $results += @(
                    Select-String `
                        -LiteralPath $file.FullName `
                        -Pattern $Pattern `
                        -CaseSensitive:$false `
                        -ErrorAction SilentlyContinue
                )
            }
        }
    }

    return @($results)
}

function Render-Matches {
    param($Matches)

    if (-not $Matches -or $Matches.Count -eq 0) {
        return "_No matches found._"
    }

    $lines = @()

    foreach ($match in $Matches) {

        $relative = $match.Path

        if ($relative.StartsWith(
            $project,
            [System.StringComparison]::OrdinalIgnoreCase
        )) {
            $relative = $relative.Substring($project.Length).TrimStart('\')
        }

        $lines += "- ``$relative`` line $($match.LineNumber): ``$($match.Line.Trim())``"
    }

    return ($lines -join "`r`n")
}

Write-Host ""
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "CARE JOURNEY / STRATAPARSE / AUDIT SCAN" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""

# --------------------------------------------------
# FILE EXISTENCE
# --------------------------------------------------

Write-Host "Checking target locations..." -ForegroundColor Yellow

Write-Host "Strataparse folder : $(Test-Path $strataparse)"
Write-Host "record-health page  : $(Test-Path $recordHealth)"
Write-Host "WOW component       : $(Test-Path $wow)"
Write-Host "Audit UI             : $(Test-Path $auditUi)"
Write-Host ""

# --------------------------------------------------
# A - STRATAPARSE CAPABILITY
# --------------------------------------------------

Write-Host "Scanning Strataparse..." -ForegroundColor Yellow

$processor = Find-Pattern `
    -Pattern "processStrataparseDocument" `
    -Targets @($strataparse)

$assessment = Find-Pattern `
    -Pattern "assessDocument" `
    -Targets @($strataparse)

$extraction = Find-Pattern `
    -Pattern "extractPage" `
    -Targets @($strataparse)

$assembly = Find-Pattern `
    -Pattern "assembleDocument" `
    -Targets @($strataparse)

$routing = Find-Pattern `
    -Pattern "resolveStrataparseModel" `
    -Targets @($strataparse)

$classify = Find-Pattern `
    -Pattern "documentType" `
    -Targets @($strataparse)

# --------------------------------------------------
# B - STRATAPARSE INVOCATION
# --------------------------------------------------

Write-Host "Scanning Care Journey invocation..." -ForegroundColor Yellow

$wowStrataparse = Find-Pattern `
    -Pattern "Strataparse" `
    -Targets @($wow)

$pageStrataparse = Find-Pattern `
    -Pattern "Strataparse" `
    -Targets @($recordHealth)

$wowProcess = Find-Pattern `
    -Pattern "processStrataparseDocument" `
    -Targets @($wow)

$pageProcess = Find-Pattern `
    -Pattern "processStrataparseDocument" `
    -Targets @($recordHealth)

$wowApi = Find-Pattern `
    -Pattern "fetch" `
    -Targets @($wow)

$pageApi = Find-Pattern `
    -Pattern "fetch" `
    -Targets @($recordHealth)

# --------------------------------------------------
# C - AUDIT
# --------------------------------------------------

Write-Host "Scanning Audit..." -ForegroundColor Yellow

$wowAudit = Find-Pattern `
    -Pattern "startAuditAgent" `
    -Targets @($wow)

$pageAudit = Find-Pattern `
    -Pattern "startAuditAgent" `
    -Targets @($recordHealth)

$wowAuditEvents = Find-Pattern `
    -Pattern "recordAuditEvent" `
    -Targets @($wow)

$pageAuditEvents = Find-Pattern `
    -Pattern "recordAuditEvent" `
    -Targets @($recordHealth)

$wowAuditComplete = Find-Pattern `
    -Pattern "completeAuditAgent" `
    -Targets @($wow)

$pageAuditComplete = Find-Pattern `
    -Pattern "completeAuditAgent" `
    -Targets @($recordHealth)

$auditUiRefs = Find-Pattern `
    -Pattern "Audit" `
    -Targets @($auditUi)

# --------------------------------------------------
# BASIC FLAGS
# --------------------------------------------------

$strataparseCapability =
    ($processor.Count -gt 0) -or
    ($assessment.Count -gt 0) -or
    ($extraction.Count -gt 0)

$strataparseInvocation =
    ($wowProcess.Count -gt 0) -or
    ($pageProcess.Count -gt 0)

$auditInvocation =
    ($wowAudit.Count -gt 0) -or
    ($pageAudit.Count -gt 0)

$auditEvents =
    ($wowAuditEvents.Count -gt 0) -or
    ($pageAuditEvents.Count -gt 0)

# --------------------------------------------------
# BUILD REPORT
# --------------------------------------------------

$report = New-Object System.Collections.Generic.List[string]

$report.Add("# CareVR Care Journey - Strataparse and Audit Assessment")
$report.Add("")
$report.Add("Generated: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss zzz')")
$report.Add("")
$report.Add("This report is generated from the current files on disk.")
$report.Add("")

$report.Add("## Executive assessment")
$report.Add("")

if ($strataparseCapability) {
    $report.Add("### A - Strataparse capability: EVIDENCE FOUND")
}
else {
    $report.Add("### A - Strataparse capability: NOT PROVEN")
}

if ($strataparseInvocation) {
    $report.Add("### B - Care Journey invokes Strataparse: EVIDENCE FOUND")
}
else {
    $report.Add("### B - Care Journey invokes Strataparse: NOT FOUND")
}

if ($auditInvocation) {
    $report.Add("### C - Audit Agent invocation: EVIDENCE FOUND")
}
else {
    $report.Add("### C - Audit Agent invocation: NOT FOUND")
}

if ($auditEvents) {
    $report.Add("### C2 - Audit events: EVIDENCE FOUND")
}
else {
    $report.Add("### C2 - Audit events: NOT FOUND")
}

$report.Add("")
$report.Add("## A - Strataparse capability")
$report.Add("")
$report.Add("### processStrataparseDocument")
$report.Add((Render-Matches $processor))
$report.Add("")
$report.Add("### assessDocument")
$report.Add((Render-Matches $assessment))
$report.Add("")
$report.Add("### extractPage")
$report.Add((Render-Matches $extraction))
$report.Add("")
$report.Add("### assembleDocument")
$report.Add((Render-Matches $assembly))
$report.Add("")
$report.Add("### resolveStrataparseModel")
$report.Add((Render-Matches $routing))
$report.Add("")
$report.Add("### documentType")
$report.Add((Render-Matches $classify))
$report.Add("")

$report.Add("## B - Care Journey to Strataparse")
$report.Add("")
$report.Add("### WOW - Strataparse references")
$report.Add((Render-Matches $wowStrataparse))
$report.Add("")
$report.Add("### record-health - Strataparse references")
$report.Add((Render-Matches $pageStrataparse))
$report.Add("")
$report.Add("### WOW - processStrataparseDocument")
$report.Add((Render-Matches $wowProcess))
$report.Add("")
$report.Add("### record-health - processStrataparseDocument")
$report.Add((Render-Matches $pageProcess))
$report.Add("")
$report.Add("### WOW - fetch calls")
$report.Add((Render-Matches $wowApi))
$report.Add("")
$report.Add("### record-health - fetch calls")
$report.Add((Render-Matches $pageApi))
$report.Add("")

$report.Add("## C - Audit")
$report.Add("")
$report.Add("### WOW - startAuditAgent")
$report.Add((Render-Matches $wowAudit))
$report.Add("")
$report.Add("### record-health - startAuditAgent")
$report.Add((Render-Matches $pageAudit))
$report.Add("")
$report.Add("### WOW - recordAuditEvent")
$report.Add((Render-Matches $wowAuditEvents))
$report.Add("")
$report.Add("### record-health - recordAuditEvent")
$report.Add((Render-Matches $pageAuditEvents))
$report.Add("")
$report.Add("### WOW - completeAuditAgent")
$report.Add((Render-Matches $wowAuditComplete))
$report.Add("")
$report.Add("### record-health - completeAuditAgent")
$report.Add((Render-Matches $pageAuditComplete))
$report.Add("")
$report.Add("### Audit UI")
$report.Add((Render-Matches $auditUiRefs))
$report.Add("")

$report.Add("## Important")
$report.Add("")
$report.Add("A text match does NOT prove execution.")
$report.Add("")
$report.Add("The next investigation step is to trace the actual function call chain.")
$report.Add("")

$outPath = if (
    [IO.Path]::IsPathRooted($OutputFile)
) {
    $OutputFile
}
else {
    Join-Path $project $OutputFile
}

$report -join "`r`n" |
    Set-Content `
        -LiteralPath $outPath `
        -Encoding UTF8

Write-Host ""
Write-Host "==================================================" -ForegroundColor Green
Write-Host "SCAN COMPLETE" -ForegroundColor Green
Write-Host "==================================================" -ForegroundColor Green
Write-Host ""
Write-Host "A - Strataparse capability : $(if($strataparseCapability){'EVIDENCE FOUND'}else{'NOT PROVEN'})"
Write-Host "B - Strataparse invocation  : $(if($strataparseInvocation){'EVIDENCE FOUND'}else{'NOT FOUND'})"
Write-Host "C - Audit invocation        : $(if($auditInvocation){'EVIDENCE FOUND'}else{'NOT FOUND'})"
Write-Host "C2 - Audit events           : $(if($auditEvents){'EVIDENCE FOUND'}else{'NOT FOUND'})"
Write-Host ""
Write-Host "REPORT:" -ForegroundColor Yellow
Write-Host $outPath
Write-Host ""