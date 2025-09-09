# Alternative Public Tunnel (No Downloads Required!)

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "   PUBLIC TUNNEL - NO DOWNLOADS NEEDED!" -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "Since Windows Defender is blocking ngrok, let's use localhost.run instead!" -ForegroundColor Yellow
Write-Host "This works through SSH and doesn't require any downloads.`n" -ForegroundColor Green

Write-Host "REQUIREMENTS:" -ForegroundColor Yellow
Write-Host "- Your server must be running on port 3001" -ForegroundColor White
Write-Host "- You need SSH client (built into Windows 10/11)`n" -ForegroundColor White

Write-Host "Checking if your server is running..." -ForegroundColor Cyan
$serverCheck = Test-NetConnection -ComputerName localhost -Port 3001 -InformationLevel Quiet

if ($serverCheck) {
    Write-Host "✅ Server is running on port 3001!" -ForegroundColor Green
    
    Write-Host "`nCreating public tunnel...`n" -ForegroundColor Yellow
    Write-Host "========================================" -ForegroundColor Gray
    Write-Host "After running the command below, you'll see:" -ForegroundColor Cyan
    Write-Host "  'Connect to http://xxxxx.localhost.run'" -ForegroundColor Green
    Write-Host "That's your public URL! Share it with anyone!" -ForegroundColor Green
    Write-Host "========================================`n" -ForegroundColor Gray
    
    Write-Host "Run this command:" -ForegroundColor Yellow
    Write-Host "ssh -R 80:localhost:3001 localhost.run" -ForegroundColor Green -BackgroundColor Black
    
    Write-Host "`nCopying command to clipboard..." -ForegroundColor Cyan
    "ssh -R 80:localhost:3001 localhost.run" | Set-Clipboard
    Write-Host "✅ Command copied! Just paste and press Enter.`n" -ForegroundColor Green
    
    Write-Host "Press Enter to run the command..." -ForegroundColor Magenta
    Read-Host
    
    # Run the SSH tunnel
    ssh -R 80:localhost:3001 localhost.run
} else {
    Write-Host "❌ Server is not running on port 3001!" -ForegroundColor Red
    Write-Host "`nPlease start the server first:" -ForegroundColor Yellow
    Write-Host "  npm start" -ForegroundColor Green
    Write-Host "`nThen run this script again." -ForegroundColor White
}
