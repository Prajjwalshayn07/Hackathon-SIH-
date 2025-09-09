# This script helps add ngrok to Windows Defender exceptions
# Run as Administrator for best results

Write-Host "`n========================================" -ForegroundColor Yellow
Write-Host "   FIXING WINDOWS DEFENDER FOR NGROK" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Yellow

Write-Host "Windows Defender is blocking ngrok (false positive)." -ForegroundColor Red
Write-Host "ngrok is safe - it's used by millions of developers worldwide.`n" -ForegroundColor Green

Write-Host "MANUAL STEPS TO FIX:" -ForegroundColor Yellow
Write-Host "--------------------" -ForegroundColor Gray
Write-Host "1. Open Windows Security (Windows Defender)" -ForegroundColor White
Write-Host "2. Go to 'Virus & threat protection'" -ForegroundColor White
Write-Host "3. Click 'Protection history'" -ForegroundColor White
Write-Host "4. Find the blocked ngrok.exe item" -ForegroundColor White
Write-Host "5. Click on it and select 'Allow on device'" -ForegroundColor White
Write-Host "`nOR`n" -ForegroundColor Yellow
Write-Host "1. Open Windows Security" -ForegroundColor White
Write-Host "2. Go to 'Virus & threat protection'" -ForegroundColor White
Write-Host "3. Under 'Virus & threat protection settings', click 'Manage settings'" -ForegroundColor White
Write-Host "4. Scroll to 'Exclusions' and click 'Add or remove exclusions'" -ForegroundColor White
Write-Host "5. Click 'Add an exclusion' > 'File'" -ForegroundColor White
Write-Host "6. Browse to: $PSScriptRoot\ngrok.exe" -ForegroundColor Green
Write-Host "`n========================================`n" -ForegroundColor Yellow

# Try to open Windows Security
Write-Host "Press Enter to open Windows Security..." -ForegroundColor Magenta
Read-Host
Start-Process "windowsdefender://threat/"

Write-Host "`nAfter allowing ngrok in Windows Defender, run:" -ForegroundColor Green
Write-Host ".\ngrok.exe http 3001" -ForegroundColor Yellow
Write-Host "`nThis will create a public URL for your app!" -ForegroundColor Cyan
