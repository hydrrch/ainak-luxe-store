@echo off
set "PATH=C:\Program Files\GitHub CLI;C:\Program Files\Git\cmd;C:\Users\ZSK Hub\nodejs;%PATH%"
echo ========================================================
echo   Ainak Luxe - 1-Click GitHub Repository Creator & Pusher
echo ========================================================
echo.
echo Step 1: Checking GitHub authentication...
gh auth status >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo Please authenticate with GitHub:
    echo 1. Copy the 8-character code shown on screen.
    echo 2. Press Enter to open your browser at github.com/login/device.
    echo 3. Paste the code and click Authorize.
    echo.
    gh auth login --web -p https
)

echo.
echo Step 2: Creating public GitHub repository 'ainak-luxe-store' and pushing...
gh repo create ainak-luxe-store --public --source=. --push --remote=origin

echo.
echo ========================================================
echo   SUCCESS! Your repository has been created and pushed!
echo ========================================================
gh repo view --web
pause
