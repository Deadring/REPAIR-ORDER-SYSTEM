@echo off
REM =============================================
REM Network Connectivity Troubleshooting Script
REM Repair Order System - Network Diagnostics
REM =============================================

setlocal enabledelayedexpansion

echo.
echo ========================================
echo Network Connection Troubleshooting
echo ========================================
echo.

REM Get local IP
for /f "tokens=2 delims=:" %%i in ('ipconfig ^| findstr /R "IPv4"') do set IP=%%i
set IP=%IP: =%

echo [1/5] Local IP Address: %IP%
echo.

REM Ask for server IP
set /p SERVER_IP="Enter SERVER IP address (e.g., 192.168.1.100): "

if "%SERVER_IP%"=="" (
    echo Error: IP address required
    pause
    exit /b 1
)

echo.
echo ========================================
echo Starting Connectivity Tests...
echo ========================================
echo.

REM Test 1: Ping Server
echo [TEST 1] Ping Server (%SERVER_IP%)
echo Command: ping %SERVER_IP% -n 4
ping %SERVER_IP% -n 4
if errorlevel 1 (
    echo [FAILED] Cannot ping server IP
    echo Solution: 
    echo - Check if server IP is correct
    echo - Check if both PCs on same network
    echo - Check firewall settings
) else (
    echo [OK] Server is reachable
)
echo.

REM Test 2: Check Port 8000
echo [TEST 2] Check Backend Port (8000)
echo Command: netstat
netstat -an | findstr "8000"
if errorlevel 1 (
    echo [INFO] Checking if port accessible...
    powershell -Command "Test-NetConnection -ComputerName %SERVER_IP% -Port 8000 -InformationLevel Detailed"
) else (
    echo [OK] Port 8000 is listening
)
echo.

REM Test 3: Test Backend API
echo [TEST 3] Test Backend API Health Check
echo Command: curl http://%SERVER_IP%:8000/api/health
echo.
curl -v http://%SERVER_IP%:8000/api/health
if errorlevel 1 (
    echo.
    echo [FAILED] Cannot reach backend API
    echo Solution:
    echo - Ensure backend is running on server: npm start
    echo - Check backend logs for errors
    echo - Check firewall allows port 8000
) else (
    echo.
    echo [OK] Backend is accessible
)
echo.

REM Test 4: Check Frontend Port
echo [TEST 4] Check Frontend Port (3000)
echo Command: Checking port 3000...
powershell -Command "Test-NetConnection -ComputerName %SERVER_IP% -Port 3000 -InformationLevel Detailed"
echo.

REM Test 5: Browser Test Instructions
echo [TEST 5] Browser Access Test
echo.
echo Open browser and try:
echo - http://%SERVER_IP%:3000
echo - http://%SERVER_IP%:8000/api/health
echo.

REM Summary
echo ========================================
echo Troubleshooting Summary
echo ========================================
echo.
echo If tests failed:
echo.
echo 1. Backend Not Running
echo    Solution: npm start in backend folder
echo.
echo 2. Port 8000 Blocked
echo    Solution: Allow in Windows Firewall
echo.
echo 3. Cannot Ping
echo    Solution: Check network connection
echo.
echo 4. CORS Error
echo    Solution: Clear browser cache (Ctrl+Shift+Del)
echo.
echo 5. API Response Error
echo    Solution: Check backend logs
echo.
echo ========================================
echo.

pause
