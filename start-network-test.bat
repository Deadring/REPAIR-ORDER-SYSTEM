@echo off
REM =========================================
REM Start Network Testing Script
REM =========================================

setlocal enabledelayedexpansion

cls
echo.
echo ===============================================
echo    Network Testing for Repair Order System
echo ===============================================
echo.

REM Check if running as Administrator
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo ERROR: This script must run as Administrator
    echo.
    echo Please:
    echo 1. Right-click on Command Prompt or PowerShell
    echo 2. Select "Run as Administrator"
    echo 3. Run this script again
    echo.
    pause
    exit /b 1
)

echo Administrator privileges: OK
echo.

REM Menu
:menu
cls
echo.
echo ===============================================
echo    Choose an Option
echo ===============================================
echo.
echo [1] Run Advanced Diagnostic (Recommended)
echo [2] Add Firewall Exceptions
echo [3] Test Connection Manually
echo [4] Check Backend Status
echo [5] Exit
echo.
set /p choice="Enter choice (1-5): "

if "%choice%"=="1" goto diagnostic
if "%choice%"=="2" goto firewall
if "%choice%"=="3" goto manual_test
if "%choice%"=="4" goto backend_test
if "%choice%"=="5" exit /b 0

echo Invalid choice. Please try again.
pause
goto menu

REM =========================================
REM Option 1: Advanced Diagnostic
REM =========================================
:diagnostic
cls
echo.
echo Running Advanced Diagnostic...
echo.

powershell -NoProfile -ExecutionPolicy Bypass -File ".\advanced-diagnostic.ps1"

pause
goto menu

REM =========================================
REM Option 2: Add Firewall Exceptions
REM =========================================
:firewall
cls
echo.
echo ===============================================
echo    Adding Firewall Exceptions
echo ===============================================
echo.

echo Adding port 8000 (Backend)...
netsh advfirewall firewall add rule ^
  name="Allow Node Backend Port 8000" ^
  dir=in action=allow protocol=tcp localport=8000 profile=private ^
  >nul 2>&1

if %errorLevel% equ 0 (
    echo [OK] Port 8000 exception added
) else (
    echo [WARNING] Could not add port 8000 exception
)

echo.
echo Adding port 3000 (Frontend)...
netsh advfirewall firewall add rule ^
  name="Allow Node Frontend Port 3000" ^
  dir=in action=allow protocol=tcp localport=3000 profile=private ^
  >nul 2>&1

if %errorLevel% equ 0 (
    echo [OK] Port 3000 exception added
) else (
    echo [WARNING] Could not add port 3000 exception
)

echo.
echo Verifying rules...
netsh advfirewall firewall show rule name="Allow Node*"

echo.
echo Firewall exceptions added. Please try accessing from other PC.
echo.
pause
goto menu

REM =========================================
REM Option 3: Manual Connection Test
REM =========================================
:manual_test
cls
echo.
echo ===============================================
echo    Manual Connection Tests
echo ===============================================
echo.

set /p serverip="Enter Server IP (e.g., 192.168.1.100): "

if "%serverip%"=="" (
    echo Error: IP address required
    pause
    goto menu
)

echo.
echo Test 1: Ping Server
echo Command: ping %serverip% -n 4
ping %serverip% -n 4
echo.

echo Test 2: Port 8000
echo Command: Test-NetConnection...
powershell -Command "Test-NetConnection -ComputerName %serverip% -Port 8000 -InformationLevel Detailed"
echo.

echo Test 3: API Health Check
echo Command: curl http://%serverip%:8000/api/health
echo.
curl -v http://%serverip%:8000/api/health
echo.

echo Test 4: Frontend Access
echo Command: curl http://%serverip%:3000
echo.
curl -v http://%serverip%:3000 | findstr "<title>"
echo.

pause
goto menu

REM =========================================
REM Option 4: Backend Status
REM =========================================
:backend_test
cls
echo.
echo ===============================================
echo    Backend Status Check
echo ===============================================
echo.

echo Checking what's listening on port 8000...
netstat -ano | findstr ":8000"

if %errorLevel% equ 0 (
    echo.
    echo [OK] Something is listening on port 8000
) else (
    echo.
    echo [WARNING] Nothing listening on port 8000
    echo Backend may not be running
)

echo.
echo Checking what's listening on port 3000...
netstat -ano | findstr ":3000"

if %errorLevel% equ 0 (
    echo.
    echo [OK] Something is listening on port 3000
) else (
    echo.
    echo [WARNING] Nothing listening on port 3000
    echo Frontend may not be running
)

echo.
echo ===== NEXT STEPS =====
echo.
echo If ports not listening:
echo.
echo 1. Make sure backend is running:
echo    cd d:\REPAIR-ORDER-SYSTEM\backend
echo    npm start
echo.
echo 2. In another terminal, start frontend:
echo    cd d:\REPAIR-ORDER-SYSTEM\frontend
echo    npm start
echo.
echo Then try accessing from client PC:
echo    http://192.168.x.x:3000
echo.

pause
goto menu
