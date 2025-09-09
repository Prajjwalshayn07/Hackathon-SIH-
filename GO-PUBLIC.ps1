# 🌐 MAKE YOUR APP PUBLIC TO THE WORLD!

Write-Host "`n================================================" -ForegroundColor Cyan
Write-Host "   🚀 MAKING YOUR APP PUBLIC TO THE WORLD! 🚀" -ForegroundColor Yellow
Write-Host "================================================`n" -ForegroundColor Cyan

# Check if server is running
Write-Host "Checking if your server is running..." -ForegroundColor White
$serverCheck = Test-NetConnection -ComputerName localhost -Port 3001 -InformationLevel Quiet

if ($serverCheck) {
    Write-Host "✅ Server is running on port 3001!`n" -ForegroundColor Green
    
    Write-Host "Choose a method to make your app public:" -ForegroundColor Yellow
    Write-Host "========================================" -ForegroundColor Gray
    Write-Host "1. Serveo (Recommended - Works immediately)" -ForegroundColor Green
    Write-Host "2. Telebit (Alternative option)" -ForegroundColor Cyan
    Write-Host "3. Localtunnel (npm based)" -ForegroundColor Blue
    Write-Host "========================================`n" -ForegroundColor Gray
    
    $choice = Read-Host "Enter your choice (1, 2, or 3)"
    
    switch ($choice) {
        "1" {
            Write-Host "`n🌍 Creating worldwide tunnel with Serveo..." -ForegroundColor Green
            Write-Host "Your public URL will appear below:" -ForegroundColor Yellow
            Write-Host "Look for: https://xxxxx.serveo.net" -ForegroundColor Cyan
            Write-Host "`nKeep this window open to maintain the tunnel!" -ForegroundColor Red
            Write-Host "Press Ctrl+C to stop the tunnel`n" -ForegroundColor Yellow
            
            # Use serveo with keep-alive
            ssh -o StrictHostKeyChecking=no -o ServerAliveInterval=60 -R 80:localhost:3001 serveo.net
        }
        "2" {
            Write-Host "`nInstalling Telebit..." -ForegroundColor Green
            npm install -g telebit
            Write-Host "`nStarting Telebit tunnel..." -ForegroundColor Yellow
            telebit http 3001
        }
        "3" {
            Write-Host "`nInstalling Localtunnel..." -ForegroundColor Green
            npm install -g localtunnel
            Write-Host "`nStarting Localtunnel..." -ForegroundColor Yellow
            Write-Host "Your public URL will appear below:`n" -ForegroundColor Cyan
            npx localtunnel --port 3001
        }
        default {
            Write-Host "Invalid choice. Using Serveo by default..." -ForegroundColor Yellow
            ssh -o StrictHostKeyChecking=no -o ServerAliveInterval=60 -R 80:localhost:3001 serveo.net
        }
    }
} else {
    Write-Host "❌ Server is NOT running!" -ForegroundColor Red
    Write-Host "`nPlease start your server first:" -ForegroundColor Yellow
    Write-Host "1. Open a new PowerShell window" -ForegroundColor White
    Write-Host "2. Navigate to: C:\Users\Prajjwal\civic-issue-reporter" -ForegroundColor White
    Write-Host "3. Run: npm start" -ForegroundColor Green
    Write-Host "4. Then run this script again`n" -ForegroundColor White
}
