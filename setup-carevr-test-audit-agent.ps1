# CareVRTestAuditAgent folder structure
# Creates the structural boundary for the Audit Agent.
# No application logic is added at this stage.

$root = Join-Path $PSScriptRoot "CareVRTestAuditAgent"

$folders = @(
    "config",
    "contracts",
    "core",
    "monitor",

    "audit",
    "audit\accuracy",
    "audit\scope",
    "audit\efficiency",
    "audit\timing",
    "audit\completeness",
    "audit\model",
    "audit\cost",

    "records",
    "records\active",
    "records\completed",
    "records\interrupted",
    "records\failed",

    "analysis",

    "reports",

    "ui",
    "ui\founder",
    "ui\summary",
    "ui\detail"
)

foreach ($folder in $folders) {
    $path = Join-Path $root $folder

    if (-not (Test-Path $path)) {
        New-Item -ItemType Directory -Path $path -Force | Out-Null
        Write-Host "Created: $path"
    }
    else {
        Write-Host "Exists:  $path"
    }
}

Write-Host ""
Write-Host "CareVRTestAuditAgent structure created successfully."
Write-Host "Location: $root"