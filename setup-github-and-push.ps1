$env:PATH = "C:\Program Files\GitHub CLI;C:\Program Files\Git\cmd;C:\Users\ZSK Hub\nodejs;" + $env:PATH

Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "   Ainak Luxe - GitHub Repository Creator & Pusher      " -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Step 1: Checking GitHub authentication..." -ForegroundColor Yellow
$authStatus = & gh auth status 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "`nOpening GitHub authentication in browser..." -ForegroundColor Green
    Write-Host "1. Copy the 8-character code shown below." -ForegroundColor White
    Write-Host "2. Press Enter to open github.com/login/device in your default browser." -ForegroundColor White
    Write-Host "3. Paste code & click Authorize.`n" -ForegroundColor White
    & gh auth login --web -p https
}

Write-Host "`nStep 2: Creating public GitHub repository 'ainak-luxe-store' and pushing code..." -ForegroundColor Yellow
& gh repo create ainak-luxe-store --public --source=. --push --remote=origin

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n========================================================" -ForegroundColor Green
    Write-Host "  SUCCESS! Code pushed to your GitHub repository!       " -ForegroundColor Green
    Write-Host "========================================================" -ForegroundColor Green
    & gh repo view --web
} else {
    Write-Host "`nPush encountered an issue. You can also push manually via:" -ForegroundColor Red
    Write-Host "git push -u origin main" -ForegroundColor White
}
