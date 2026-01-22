@echo off
REM Simple wrapper to run diagnostic with proper settings
REM Right-click and select "Run as Administrator" for best results

cls
echo.
echo ======================================================
echo   Repair Order System - Network Diagnostic Tool
echo ======================================================
echo.
echo This tool will test your network connection to verify:
echo   - Ping to server
echo   - Port 8000 (Backend)
echo   - Port 3000 (Frontend)
echo   - API endpoints
echo   - Firewall rules
echo.

setlocal enabledelayedexpansion

if "%1"=="" (
    echo Enter the SERVER IP address (e.g., 192.168.1.100):
    set /p serverIP="IP Address: "
    if "!serverIP!"=="" (
        echo ERROR: Server IP is required
        echo.
        pause
        exit /b 1
    )
) else (
    set serverIP=%1
)

echo.
echo Running diagnostic for server: !serverIP!
echo.
echo ======================================================
echo.

REM Run the PowerShell diagnostic script
powershell -NoProfile -ExecutionPolicy Bypass -Command "& {. '%~dp0advanced-diagnostic.ps1' -ServerIP '!serverIP!'}"

echo.
echo ======================================================
echo Diagnostic Complete
echo ======================================================
echo.
pause
