# Advanced Network Diagnostic Script
# Save as: advanced-diagnostic.ps1
# Run as Administrator for full functionality

param(
    [string]$ServerIP = ""
)

Write-Host ""
Write-Host "======================================================" -ForegroundColor Cyan
Write-Host "   Advanced Network Diagnostic - Repair Order System    " -ForegroundColor Cyan
Write-Host "                                                        " -ForegroundColor Cyan
Write-Host "         For Detailed Troubleshooting & Debug           " -ForegroundColor Cyan
Write-Host "======================================================" -ForegroundColor Cyan
Write-Host ""

# Function to write section header
function Write-Section {
    param([string]$Title)
    Write-Host ""
    Write-Host "======================================================" -ForegroundColor Cyan
    Write-Host "  $Title" -ForegroundColor Yellow
    Write-Host "======================================================" -ForegroundColor Cyan
}

function Write-Success {
    param([string]$Message)
    Write-Host "  [OK] $Message" -ForegroundColor Green
}

function Write-Failed {
    param([string]$Message)
    Write-Host "  [FAIL] $Message" -ForegroundColor Red
}

function Write-Warning {
    param([string]$Message)
    Write-Host "  [WARN] $Message" -ForegroundColor Yellow
}

function Write-Info {
    param([string]$Message)
    Write-Host "  [INFO] $Message" -ForegroundColor Blue
}

# ===== SECTION 1: CLIENT INFORMATION =====
Write-Section "1. CLIENT COMPUTER INFORMATION"

$localIP = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object {$_.InterfaceAlias -notmatch 'loopback' -and $_.IPAddress -match '192\.168'}).IPAddress | Select-Object -First 1
if ($localIP) {
    Write-Success "Local IP Address: $localIP"
} else {
    Write-Failed "Could not determine local IP"
    Write-Warning "Make sure you're connected to network (not loopback)"
}

$dnsServers = (Get-DnsClientServerAddress -AddressFamily IPv4 | Where-Object {$_.ServerAddresses}).ServerAddresses
Write-Info "DNS Servers: $($dnsServers -join ', ')"

$networkAdapters = Get-NetAdapter -Physical | Where-Object {$_.Status -eq 'Up'}
Write-Info "Network Adapters:"
foreach ($adapter in $networkAdapters) {
    Write-Host "    - $($adapter.Name) ($($adapter.InterfaceDescription))" -ForegroundColor Gray
}

# Get server IP from user if not provided
if ([string]::IsNullOrWhiteSpace($ServerIP)) {
    Write-Host ""
    $ServerIP = Read-Host "  Enter SERVER IP address (e.g., 192.168.1.100)"
    if ([string]::IsNullOrWhiteSpace($ServerIP)) {
        Write-Failed "Server IP required"
        exit 1
    }
}

# ===== SECTION 2: NETWORK CONNECTIVITY =====
Write-Section "2. NETWORK CONNECTIVITY TESTS"

# Test 2.1: Ping
Write-Host ""
Write-Info "Testing: Ping $ServerIP"
$pingResult = $null
try {
    $pingResult = Test-Connection -ComputerName $ServerIP -Count 4 -ErrorAction Stop
    Write-Success "Server is reachable"
    $avgTime = ($pingResult | Measure-Object -Property ResponseTime -Average).Average
    Write-Info "Average response time: ${avgTime}ms"
} catch {
    Write-Failed "Cannot ping server"
    Write-Warning "Possible causes:"
    Write-Host "    - Incorrect server IP address" -ForegroundColor Yellow
    Write-Host "    - Server offline or unreachable" -ForegroundColor Yellow
    Write-Host "    - Not on same network/WiFi" -ForegroundColor Yellow
    Write-Host "    - ICMP blocked by firewall" -ForegroundColor Yellow
}

# Test 2.2: Port 8000 (Backend)
Write-Host ""
Write-Info "Testing: Port 8000 (Backend)"
$port8000 = $null
try {
    $port8000 = Test-NetConnection -ComputerName $ServerIP -Port 8000 -WarningAction SilentlyContinue
    if ($port8000.TcpTestSucceeded) {
        Write-Success "Port 8000 is accessible"
    } else {
        Write-Failed "Port 8000 is not accessible"
        Write-Warning "Possible causes:"
        Write-Host "    - Backend not running" -ForegroundColor Yellow
        Write-Host "    - Firewall blocking port 8000" -ForegroundColor Yellow
        Write-Host "    - Backend not listening on all interfaces" -ForegroundColor Yellow
    }
} catch {
    Write-Failed "Cannot test port 8000: $_"
}

# Test 2.3: Port 3000 (Frontend)
Write-Host ""
Write-Info "Testing: Port 3000 (Frontend)"
$port3000 = $null
try {
    $port3000 = Test-NetConnection -ComputerName $ServerIP -Port 3000 -WarningAction SilentlyContinue
    if ($port3000.TcpTestSucceeded) {
        Write-Success "Port 3000 is accessible"
    } else {
        Write-Failed "Port 3000 is not accessible"
        Write-Warning "Possible causes:"
        Write-Host "    - Frontend not running" -ForegroundColor Yellow
        Write-Host "    - Firewall blocking port 3000" -ForegroundColor Yellow
    }
} catch {
    Write-Failed "Cannot test port 3000: $_"
}

# Test 2.4: Port 3306 (MySQL)
Write-Host ""
Write-Info "Testing: Port 3306 (MySQL - for info only)"
try {
    $port3306 = Test-NetConnection -ComputerName $ServerIP -Port 3306 -WarningAction SilentlyContinue -ErrorAction SilentlyContinue
    if ($port3306.TcpTestSucceeded) {
        Write-Success "MySQL port is accessible (OK for network, but should be restricted)"
    } else {
        Write-Info "MySQL port not accessible (expected for security)"
    }
} catch {
    Write-Info "MySQL port test skipped"
}

# ===== SECTION 3: API TESTING =====
Write-Section "3. BACKEND API TESTS"

# Test 3.1: Health Check
Write-Host ""
Write-Info "Testing: Health Check Endpoint"
try {
    $response = Invoke-WebRequest -Uri "http://$ServerIP`:8000/api/health" -TimeoutSec 5 -ErrorAction Stop
    Write-Success "Backend is responding (HTTP 200)"
    $data = $response.Content | ConvertFrom-Json
    Write-Host ""
    Write-Host "    Response Data:" -ForegroundColor Gray
    Write-Host "    • Status: $($data.status)" -ForegroundColor Gray
    Write-Host "    • Message: $($data.message)" -ForegroundColor Gray
    Write-Host "    • Database: $($data.database)" -ForegroundColor Gray
    
    if ($data.database -ne "connected") {
        Write-Failed "Database not connected"
        Write-Warning "Backend cannot reach database - possible causes:"
        Write-Host "    • MySQL not running on server" -ForegroundColor Yellow
        Write-Host "    • Wrong database credentials in .env" -ForegroundColor Yellow
        Write-Host "    • Database doesn't exist" -ForegroundColor Yellow
    }
} catch [System.Net.WebException] {
    Write-Failed "Backend API not responding"
    Write-Warning "Error details: $($_.Exception.Message)"
    Write-Warning "Possible causes:"
    Write-Host "    • Backend crashed or not running" -ForegroundColor Yellow
    Write-Host "    • Port 8000 blocked by firewall" -ForegroundColor Yellow
    Write-Host "    • CORS configuration issue" -ForegroundColor Yellow
} catch {
    Write-Failed "Cannot test API: $($_.Exception.Message)"
}

# Test 3.2: Auth Endpoint
Write-Host ""
Write-Info "Testing: Auth Endpoint (Login)"
try {
    $response = Invoke-WebRequest -Uri "http://$ServerIP`:8000/api/auth/login" `
        -Method POST `
        -Headers @{"Content-Type"="application/json"} `
        -Body '{"username":"test","password":"test"}' `
        -TimeoutSec 5 `
        -ErrorAction Stop
    Write-Success "Auth endpoint responding"
} catch [System.Net.WebException] {
    if ($_.Exception.Response.StatusCode -in @(400, 401, 403)) {
        Write-Success "Auth endpoint responding (authentication rejected as expected for invalid credentials)"
    } else {
        Write-Failed "Auth endpoint error: $($_.Exception.Response.StatusCode)"
    }
} catch {
    Write-Failed "Cannot reach auth endpoint: $($_.Exception.Message)"
}

# ===== SECTION 4: FRONTEND TESTING =====
Write-Section "4. FRONTEND TESTS"

Write-Host ""
Write-Info "Testing: Frontend URL (http://$ServerIP`:3000)"
try {
    $response = Invoke-WebRequest -Uri "http://$ServerIP`:3000" -TimeoutSec 5 -ErrorAction Stop
    if ($response.StatusCode -eq 200) {
        Write-Success "Frontend is serving content (HTTP 200)"
        if ($response.Content -match '<title>') {
            Write-Success "HTML page detected"
        }
    }
} catch [System.Net.WebException] {
    if ($_.Exception.Response.StatusCode -eq 404) {
        Write-Failed "Frontend returned 404 (page not found)"
    } else {
        Write-Failed "Frontend not responding: $($_.Exception.Response.StatusCode)"
    }
} catch {
    Write-Failed "Cannot reach frontend: $($_.Exception.Message)"
}

# ===== SECTION 5: FIREWALL ANALYSIS =====
Write-Section "5. FIREWALL & SECURITY ANALYSIS"

Write-Host ""
Write-Info "Checking Windows Firewall Rules..."
$rules8000 = Get-NetFirewallRule -DisplayName "*8000*" -ErrorAction SilentlyContinue
$rules3000 = Get-NetFirewallRule -DisplayName "*3000*" -ErrorAction SilentlyContinue
$rulesNode = Get-NetFirewallRule -DisplayName "*node*" -ErrorAction SilentlyContinue

if ($rules8000 -or $rules3000 -or $rulesNode) {
    Write-Success "Firewall rules found:"
    foreach ($rule in @($rules8000, $rules3000, $rulesNode)) {
        if ($rule) {
            Write-Host "    - $($rule.DisplayName) - Enabled: $($rule.Enabled)" -ForegroundColor Gray
        }
    }
} else {
    Write-Warning "No firewall rules for Node.js or ports 8000/3000 found"
    Write-Info "You may need to add firewall exceptions"
}

Write-Host ""
Write-Info "Checking Firewall Status..."
$firewall = Get-NetFirewallProfile -ErrorAction SilentlyContinue
foreach ($profile in $firewall) {
    $status = if ($profile.Enabled) { "Enabled" } else { "Disabled" }
    Write-Host "    - $($profile.Name): $status" -ForegroundColor Gray
}

# ===== SECTION 6: RECOMMENDATIONS =====
Write-Section "6. RECOMMENDATIONS & FIXES"

Write-Host ""

# Determine issues and provide fixes
$hasIssues = $false

if (-not $pingResult) {
    $hasIssues = $true
    Write-Host "🔧 FIX #1: Server not reachable (Ping Failed)" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "  Step 1: Verify server IP on server PC:" -ForegroundColor White
    Write-Host "    ipconfig | findstr IPv4" -ForegroundColor Gray
    Write-Host ""
    Write-Host "  Step 2: Make sure you're using the correct IP address" -ForegroundColor White
    Write-Host "    Expected format: 192.168.x.x" -ForegroundColor Gray
    Write-Host ""
    Write-Host "  Step 3: Check both PCs on same network:" -ForegroundColor White
    Write-Host "    WiFi name or network should be the same" -ForegroundColor Gray
    Write-Host ""
}

if ($port8000 -and -not $port8000.TcpTestSucceeded) {
    $hasIssues = $true
    Write-Host "🔧 FIX #2: Port 8000 blocked or backend not running" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "  Step 1: Verify backend is running on server:" -ForegroundColor White
    Write-Host "    cd d:\REPAIR-ORDER-SYSTEM\backend" -ForegroundColor Gray
    Write-Host "    npm start" -ForegroundColor Gray
    Write-Host ""
    Write-Host "  Step 2: Add firewall exception (Run as Administrator):" -ForegroundColor White
    Write-Host "    netsh advfirewall firewall add rule name=`"Allow Backend`" " -ForegroundColor Gray
    Write-Host "      dir=in action=allow protocol=tcp localport=8000" -ForegroundColor Gray
    Write-Host ""
}

if ($port3000 -and -not $port3000.TcpTestSucceeded) {
    $hasIssues = $true
    Write-Host "🔧 FIX #3: Port 3000 blocked or frontend not running" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "  Step 1: Verify frontend is running on server:" -ForegroundColor White
    Write-Host "    cd d:\REPAIR-ORDER-SYSTEM\frontend" -ForegroundColor Gray
    Write-Host "    npm start" -ForegroundColor Gray
    Write-Host ""
    Write-Host "  Step 2: Add firewall exception:" -ForegroundColor White
    Write-Host "    netsh advfirewall firewall add rule name=`"Allow Frontend`" " -ForegroundColor Gray
    Write-Host "      dir=in action=allow protocol=tcp localport=3000" -ForegroundColor Gray
    Write-Host ""
}

if (-not $hasIssues) {
    Write-Host "✅ NO MAJOR ISSUES DETECTED" -ForegroundColor Green
    Write-Host ""
    Write-Host "  Your network should be working!" -ForegroundColor Green
    Write-Host "  Try accessing: http://$ServerIP`:3000" -ForegroundColor Green
    Write-Host ""
}

# ===== SECTION 7: QUICK REFERENCE =====
Write-Section "7. QUICK REFERENCE - COMMON FIXES"

Write-Host ""
Write-Host "Add Firewall Exceptions (Run as Administrator):" -ForegroundColor Yellow
Write-Host ""
Write-Host "  # Port 8000 (Backend)" -ForegroundColor Gray
Write-Host "  netsh advfirewall firewall add rule name=`"Allow Node Backend`" dir=in action=allow protocol=tcp localport=8000" -ForegroundColor Cyan
Write-Host ""
Write-Host "  # Port 3000 (Frontend)" -ForegroundColor Gray
Write-Host "  netsh advfirewall firewall add rule name=`"Allow Node Frontend`" dir=in action=allow protocol=tcp localport=3000" -ForegroundColor Cyan
Write-Host ""

Write-Host "Restart Backend & Frontend:" -ForegroundColor Yellow
Write-Host ""
Write-Host "  # Terminal 1 - Backend" -ForegroundColor Gray
Write-Host "  cd d:\REPAIR-ORDER-SYSTEM\backend" -ForegroundColor Cyan
Write-Host "  npm start" -ForegroundColor Cyan
Write-Host ""
Write-Host "  # Terminal 2 - Frontend" -ForegroundColor Gray
Write-Host "  cd d:\REPAIR-ORDER-SYSTEM\frontend" -ForegroundColor Cyan
Write-Host "  npm start" -ForegroundColor Cyan
Write-Host ""

Write-Host "Browser Access:" -ForegroundColor Yellow
Write-Host ""
Write-Host "  • Frontend: http://$ServerIP`:3000" -ForegroundColor Cyan
Write-Host "  • API Health: http://$ServerIP`:8000/api/health" -ForegroundColor Cyan
Write-Host ""

# ===== SECTION 8: SYSTEM INFO =====
Write-Section "8. SYSTEM INFORMATION (for support)"

Write-Host ""
Write-Host "Client OS:" -ForegroundColor Gray
Write-Host "  $([System.Environment]::OSVersion.VersionString)" -ForegroundColor Gray

Write-Host ""
Write-Host "Node.js Version:" -ForegroundColor Gray
try {
    $nodeVersion = node --version 2>&1
    Write-Host "  $nodeVersion" -ForegroundColor Gray
} catch {
    Write-Host "  (Not installed or not in PATH)" -ForegroundColor Gray
}

Write-Host ""
Write-Host "npm Version:" -ForegroundColor Gray
try {
    $npmVersion = npm --version 2>&1
    Write-Host "  $npmVersion" -ForegroundColor Gray
} catch {
    Write-Host "  (Not installed or not in PATH)" -ForegroundColor Gray
}

Write-Host ""
Write-Host "======================================================" -ForegroundColor Cyan
Write-Host "Diagnostic complete!" -ForegroundColor Green
Write-Host "======================================================" -ForegroundColor Cyan
Write-Host ""
