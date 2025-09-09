# Civic Issue Reporter - Make Public Script

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "   CIVIC ISSUE REPORTER - PUBLIC ACCESS" -ForegroundColor Yellow
Write-Host "========================================`n" -ForegroundColor Cyan

# Start the Node.js server in a new window
Write-Host "Starting local server on port 3001..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot'; npm start"

# Wait for server to start
Write-Host "Waiting for server to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

# Get local IP
$localIP = (Get-NetIPAddress -AddressFamily IPv4 -InterfaceAlias Ethernet*,Wi-Fi* | Where-Object {$_.IPAddress -notlike "127.*" -and $_.IPAddress -notlike "169.*"} | Select-Object -First 1).IPAddress

Write-Host "`n✅ Server is running!" -ForegroundColor Green
Write-Host "`n📱 ACCESS YOUR APP:" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor DarkGray

Write-Host "`n1️⃣ LOCAL NETWORK ACCESS:" -ForegroundColor Yellow
Write-Host "   Share these URLs with people on your WiFi/Network:" -ForegroundColor Gray
Write-Host "   • Citizens Portal: " -NoNewline -ForegroundColor White
Write-Host "http://$localIP:3001" -ForegroundColor Green
Write-Host "   • Admin Dashboard: " -NoNewline -ForegroundColor White
Write-Host "http://$localIP:3001/admin.html" -ForegroundColor Green

Write-Host "`n2️⃣ INTERNET ACCESS (Using ngrok):" -ForegroundColor Yellow
Write-Host "   Starting ngrok tunnel..." -ForegroundColor Gray
Write-Host "   This will create a public URL accessible from anywhere!`n" -ForegroundColor Gray

# Check if ngrok exists
if (Test-Path ".\ngrok.exe") {
    Write-Host "Press Enter to create public tunnel..." -ForegroundColor Magenta
    Read-Host
    
    # Start ngrok
    Write-Host "`n🌐 Creating public tunnel with ngrok..." -ForegroundColor Cyan
    Write-Host "Look for the 'Forwarding' URL (https://xxxxx.ngrok.io)" -ForegroundColor Yellow
    Write-Host "Share that URL with anyone in the world!`n" -ForegroundColor Green
    
    .\ngrok.exe http 3001
} else {
    Write-Host "⚠️ ngrok.exe not found in current directory" -ForegroundColor Red
    Write-Host "Download it from: https://ngrok.com/download" -ForegroundColor Yellow
}
