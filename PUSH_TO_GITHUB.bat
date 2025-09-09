@echo off
echo ========================================
echo    PUSHING CODE TO GITHUB
echo ========================================
echo.

echo Your GitHub Repository:
echo https://github.com/Prajjwalshyan07/Hackathon-SIH
echo.

echo Attempting to push...
git push -u origin main

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ========================================
    echo If push failed, try these:
    echo ========================================
    echo.
    echo 1. Make sure you created the repository on GitHub
    echo 2. Check if you're logged in to GitHub in your browser
    echo 3. Try running this command manually:
    echo    git push -u origin main
    echo.
    echo 4. If asked for credentials:
    echo    Username: Prajjwalshyan07
    echo    Password: Use a Personal Access Token (not your password)
    echo.
    echo To create a Personal Access Token:
    echo 1. Go to: https://github.com/settings/tokens
    echo 2. Click "Generate new token"
    echo 3. Give it a name
    echo 4. Select "repo" scope
    echo 5. Generate and copy the token
    echo.
) else (
    echo.
    echo ========================================
    echo SUCCESS! Your code is now on GitHub!
    echo ========================================
    echo.
    echo View your repository:
    echo https://github.com/Prajjwalshyan07/Hackathon-SIH
    echo.
)

pause
