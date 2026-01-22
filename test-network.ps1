# Network Connectivity Test Script
# Run as Administrator for full functionality
# Usage: .\test-network.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Network Connectivity Troubleshooter" -ForegroundColor Cyan
Write-Host "Repair Order System - Diagnostics" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Get local IP
$localIp = (Get-NetIPAddress -AddressFamily IPv4 -PrefixLength 24 | Where-Object {$_.InterfaceAlias -notmatch 'loopback'}).IPAddress | Select-Object -First 1
Write-Host "[INFO] Local IP Address: $localIp" -ForegroundColor Green
Write-Host ""

# Ask for server IP
$serverIp = Read-Host "Enter SERVER IP address (e.g., 192.168.1.100)"

if ([string]::IsNullOrWhiteSpace($serverIp)) {
    Write-Host "[ERROR] IP address required" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Starting Connectivity Tests..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Test 1: Ping
Write-Host "[TEST 1] Ping Server ($serverIp)" -ForegroundColor Yellow
try {
    $pingResult = Test-Connection -ComputerName $serverIp -Count 4 -ErrorAction Stop
    Write-Host "[PASS] Server is reachable" -ForegroundColor Green
    Write-Host "  Response time: $($pingResult.ResponseTime | Measure-Object -Average | Select-Object -ExpandProperty Average)ms" -ForegroundColor Green
} catch {
    Write-Host "[FAIL] Cannot ping server" -ForegroundColor Red
    Write-Host "  Issue: $_" -ForegroundColor Red
    Write-Host "  Solutions:" -ForegroundColor Yellow
    Write-Host "  - Verify server IP is correct (run 'ipconfig' on server)" -ForegroundColor Yellow
    Write-Host "  - Check both PCs on same WiFi/Network" -ForegroundColor Yellow
    Write-Host "  - Check router/network settings" -ForegroundColor Yellow
}
Write-Host ""

# Test 2: Backend Port 8000
Write-Host "[TEST 2] Backend Port 8000" -ForegroundColor Yellow
try {
    $portResult = Test-NetConnection -ComputerName $serverIp -Port 8000 -WarningAction SilentlyContinue
    if ($portResult.TcpTestSucceeded) {
        Write-Host "[PASS] Port 8000 is open and accessible" -ForegroundColor Green
    } else {
        Write-Host "[FAIL] Port 8000 is not accessible" -ForegroundColor Red
        Write-Host "  Solutions:" -ForegroundColor Yellow
        Write-Host "  - Ensure backend running: npm start" -ForegroundColor Yellow
        Write-Host "  - Check Windows Firewall allows port 8000" -ForegroundColor Yellow
        Write-Host "  - Check antivirus software" -ForegroundColor Yellow
    }
} catch {
    Write-Host "[ERROR] Cannot test port" -ForegroundColor Red
}
Write-Host ""

# Test 3: Backend API
Write-Host "[TEST 3] Backend API Health Check" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://$serverIp`:8000/api/health" -TimeoutSec 5 -ErrorAction Stop
    if ($response.StatusCode -eq 200) {
        Write-Host "[PASS] Backend API is responding" -ForegroundColor Green
        $data = $response.Content | ConvertFrom-Json
        Write-Host "  Status: $($data.status)" -ForegroundColor Green
        Write-Host "  Message: $($data.message)" -ForegroundColor Green
        Write-Host "  Database: $($data.database)" -ForegroundColor Green
    }
} catch {
    Write-Host "[FAIL] Cannot reach backend API" -ForegroundColor Red
    Write-Host "  Error: $_" -ForegroundColor Red
    Write-Host "  Solutions:" -ForegroundColor Yellow
    Write-Host "  - Start backend: npm start" -ForegroundColor Yellow
    Write-Host "  - Check backend is listening on port 8000" -ForegroundColor Yellow
    Write-Host "  - Check backend logs for errors" -ForegroundColor Yellow
    Write-Host "  - Verify database connection" -ForegroundColor Yellow
}
Write-Host ""

# Test 4: Frontend Port 3000
Write-Host "[TEST 4] Frontend Port 3000" -ForegroundColor Yellow
try {
    $portResult = Test-NetConnection -ComputerName $serverIp -Port 3000 -WarningAction SilentlyContinue
    if ($portResult.TcpTestSucceeded) {
        Write-Host "[PASS] Port 3000 is open and accessible" -ForegroundColor Green
    } else {
        Write-Host "[FAIL] Port 3000 is not accessible" -ForegroundColor Red
        Write-Host "  Solutions:" -ForegroundColor Yellow
        Write-Host "  - Ensure frontend running: npm start (in frontend folder)" -ForegroundColor Yellow
        Write-Host "  - Check Windows Firewall allows port 3000" -ForegroundColor Yellow
    }
} catch {
    Write-Host "[ERROR] Cannot test port" -ForegroundColor Red
}
Write-Host ""

# Test 5: Try accessing frontend
Write-Host "[TEST 5] Frontend HTTP Response" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://$serverIp`:3000" -TimeoutSec 5 -ErrorAction Stop
    if ($response.StatusCode -eq 200) {
        Write-Host "[PASS] Frontend is accessible" -ForegroundColor Green
    }
} catch {
    Write-Host "[INFO] Frontend may need manual browser access" -ForegroundColor Yellow
    Write-Host "  Try opening: http://$serverIp`:3000" -ForegroundColor Yellow
}
Write-Host ""

# Test 6: Database Connection (if backend running)
Write-Host "[TEST 6] Database Connection Status" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://$serverIp`:8000/api/health" -TimeoutSec 5 -ErrorAction Stop
    $data = $response.Content | ConvertFrom-Json
    if ($data.database -eq "connected") {
        Write-Host "[PASS] Database is connected" -ForegroundColor Green
    } else {
        Write-Host "[FAIL] Database not connected" -ForegroundColor Red
        Write-Host "  Check MySQL is running" -ForegroundColor Yellow
        Write-Host "  Check .env credentials" -ForegroundColor Yellow
    }
} catch {
    Write-Host "[INFO] Cannot verify database (backend not accessible)" -ForegroundColor Yellow
}
Write-Host ""

# Summary
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Test Summary & Next Steps" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "If All Tests Passed:" -ForegroundColor Green
Write-Host "  Open browser: http://$serverIp`:3000" -ForegroundColor Green
Write-Host "  Login with credentials" -ForegroundColor Green
Write-Host ""
Write-Host "If Tests Failed:" -ForegroundColor Red
Write-Host ""
Write-Host "1. Ping Failed" -ForegroundColor Yellow
Write-Host "   - Incorrect server IP address" -ForegroundColor Yellow
Write-Host "   - Not connected to same network" -ForegroundColor Yellow
Write-Host "   - Server offline" -ForegroundColor Yellow
Write-Host ""
Write-Host "2. Port 8000 Not Accessible" -ForegroundColor Yellow
Write-Host "   - Backend not running (npm start)" -ForegroundColor Yellow
Write-Host "   - Windows Firewall blocking" -ForegroundColor Yellow
Write-Host "   - Antivirus blocking" -ForegroundColor Yellow
Write-Host ""
Write-Host "3. API Not Responding" -ForegroundColor Yellow
Write-Host "   - Backend crashed or not started" -ForegroundColor Yellow
Write-Host "   - Check backend terminal for errors" -ForegroundColor Yellow
Write-Host "   - Database connection failed" -ForegroundColor Yellow
Write-Host ""
Write-Host "4. CORS/Browser Issues" -ForegroundColor Yellow
Write-Host "   - Clear browser cache: Ctrl+Shift+Del" -ForegroundColor Yellow
Write-Host "   - Try incognito/private window" -ForegroundColor Yellow
Write-Host "   - Check browser console (F12)" -ForegroundColor Yellow
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Quick Fixes to Try:" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Restart Backend" -ForegroundColor Green
Write-Host "   In server, backend folder: npm start" -ForegroundColor Green
Write-Host ""
Write-Host "2. Allow Firewall Port 8000" -ForegroundColor Green
Write-Host "   Windows Defender Firewall → Allow app through" -ForegroundColor Green
Write-Host "   Add: Node.js or your backend" -ForegroundColor Green
Write-Host ""
Write-Host "3. Clear Browser Cache" -ForegroundColor Green
Write-Host "   Ctrl+Shift+Del → Clear all data" -ForegroundColor Green
Write-Host ""
Write-Host "4. Verify IPs" -ForegroundColor Green
Write-Host "   Server: ipconfig | findstr IPv4" -ForegroundColor Green
Write-Host "   Both on 192.168.x.x range?" -ForegroundColor Green
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Read-Host "Press Enter to exit"
