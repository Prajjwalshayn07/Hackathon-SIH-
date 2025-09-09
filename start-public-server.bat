@echo off
echo ========================================
echo    CIVIC ISSUE REPORTER - PUBLIC SERVER
echo ========================================
echo.

:: Start the Node.js server in a new window
echo Starting local server on port 3001...
start cmd /k "npm start"

:: Wait for server to start
timeout /t 5 /nobreak > nul

:: Get local IP address
echo.
echo Your Local Network IP addresses:
echo --------------------------------
ipconfig | findstr /i "ipv4"

echo.
echo ========================================
echo    MAKING SERVER PUBLIC WITH NGROK
echo ========================================
echo.
echo Starting ngrok tunnel (this will make your app accessible from anywhere)...
echo.

:: Start ngrok (this will create a public URL)
ngrok.exe http 3001

pause
