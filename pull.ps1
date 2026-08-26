# ORCA Automatic GitHub Pull Script (PowerShell)
# Usage: .\pull.ps1

Write-Host "🔄 Fetching latest changes from GitHub..." -ForegroundColor Cyan
$branch = git branch --show-current
if (-not $branch) { $branch = "main" }

git pull origin $branch
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Local project is up to date with GitHub!" -ForegroundColor Green
} else {
    Write-Host "❌ Pull encountered an issue. Check for local conflicts." -ForegroundColor Red
}
