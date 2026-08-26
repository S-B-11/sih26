# ORCA Automatic GitHub Push Script (PowerShell)
# Usage: .\push.ps1 "your message here"  OR just: .\push.ps1

param(
    [string]$message = ""
)

if (-not (Test-Path ".git")) {
    Write-Host "📦 Initializing git repository..." -ForegroundColor Cyan
    git init
    git branch -M main
}

Write-Host "📝 Staging all files..." -ForegroundColor Cyan
git add .

$status = git status --porcelain
if (-not $status) {
    Write-Host "✨ No changes to commit. Working tree is clean." -ForegroundColor Green
} else {
    if (-not $message) {
        $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
        $message = "Auto-update: $timestamp"
    }
    Write-Host "💾 Committing: $message" -ForegroundColor Cyan
    git commit -m "$message"
}

$remotes = git remote
if (-not $remotes) {
    Write-Host "`n⚠️  No GitHub remote configured yet!" -ForegroundColor Yellow
    Write-Host "👉 Run this once to link your repo:" -ForegroundColor White
    Write-Host "   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git" -ForegroundColor Gray
    Write-Host "   git push -u origin main`n" -ForegroundColor Gray
} else {
    $branch = git branch --show-current
    if (-not $branch) { $branch = "main" }
    Write-Host "🚀 Pushing to origin/$branch..." -ForegroundColor Cyan
    git push -u origin $branch
    Write-Host "✅ Successfully pushed all changes to GitHub!" -ForegroundColor Green
}
