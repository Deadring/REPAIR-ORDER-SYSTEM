# 🚀 Network Connection Troubleshooting - COMPLETE TOOLKIT

Ketika tidak bisa terhubung ke komputer lain, gunakan toolkit ini untuk diagnosa dan fix masalah.

---

## 📦 What You Have Now

### 1. Diagnostic Tools

**`advanced-diagnostic.ps1`** (RECOMMENDED)
- Most comprehensive diagnostic tool
- Tests ping, ports, API, frontend
- Provides specific recommendations
- Shows system information

**`start-network-test.bat`**
- Interactive menu
- Run as Administrator
- Options to:
  - Run diagnostic
  - Add firewall exceptions
  - Manual tests
  - Check backend status

**`test-network.ps1`**
- PowerShell diagnostic
- Similar to advanced version

### 2. Documentation Files

**`NETWORK_CANNOT_CONNECT_DETAILED.md`**
- ✅ MOST COMPREHENSIVE GUIDE
- Step-by-step troubleshooting
- All common issues covered
- Solutions for each problem

**`NETWORK_QUICK_FIX.md`**
- Quick reference guide
- Fast solutions
- 5-minute fixes

**`NETWORK_TROUBLESHOOTING.md`**
- Detailed technical guide
- Advanced configuration
- Error message reference

**`NETWORK_SETUP_GUIDE.md`**
- Initial setup documentation
- Architecture explanation

---

## ⚡ IMMEDIATE ACTION PLAN

### If Cannot Connect from Other PC:

#### Step 1: Diagnose (5 minutes)
```powershell
# On any PC with admin access
cd d:\REPAIR-ORDER-SYSTEM

# Run this:
.\advanced-diagnostic.ps1

# Enter server IP when prompted
```

#### Step 2: Add Firewall Exceptions
```powershell
# Run as Administrator
netsh advfirewall firewall add rule name="Allow Node Backend" dir=in action=allow protocol=tcp localport=8000
netsh advfirewall firewall add rule name="Allow Node Frontend" dir=in action=allow protocol=tcp localport=3000
```

#### Step 3: Restart Backend
```powershell
# On server
cd d:\REPAIR-ORDER-SYSTEM\backend
npm start
```

#### Step 4: Test from Client
```
http://192.168.x.x:3000
```

---

## 🔍 Diagnostic Results Interpretation

### Result 1: "Ping Successful"
✅ **Good:** Network connectivity OK  
❌ **Bad:** Check IP address

### Result 2: "Port 8000 Accessible"
✅ **Good:** Backend reachable  
❌ **Bad:** Check firewall, backend running

### Result 3: "Backend API Responding"
✅ **Good:** API working  
❌ **Bad:** Backend crashed or database issue

### Result 4: "Port 3000 Accessible"
✅ **Good:** Frontend reachable  
❌ **Bad:** Check firewall, frontend running

### Result 5: "Frontend Loading"
✅ **Good:** App accessible  
❌ **Bad:** Try clearing cache

---

## 🔧 Most Likely Issues & Quick Fixes

### #1: Firewall Blocking (60% of cases)
```powershell
# Add exceptions for both ports
netsh advfirewall firewall add rule name="Allow Node Backend" dir=in action=allow protocol=tcp localport=8000
netsh advfirewall firewall add rule name="Allow Node Frontend" dir=in action=allow protocol=tcp localport=3000
```

### #2: Backend Not Running (20% of cases)
```powershell
cd d:\REPAIR-ORDER-SYSTEM\backend
npm start
```

### #3: Wrong IP Address (10% of cases)
```powershell
# Get correct IP
ipconfig | findstr IPv4
# Use 192.168.x.x format
```

### #4: Both Not Running (5% of cases)
```powershell
# Terminal 1 - Backend
cd d:\REPAIR-ORDER-SYSTEM\backend
npm start

# Terminal 2 - Frontend
cd d:\REPAIR-ORDER-SYSTEM\frontend
npm start
```

### #5: Browser Cache (5% of cases)
```
Ctrl+Shift+Del → Clear all
Ctrl+F5 → Hard refresh
```

---

## 📊 Decision Tree

```
Can you ping server?
├─ NO
│  ├─ Wrong IP? → Get correct IP: ipconfig | findstr IPv4
│  ├─ Server offline? → Restart server PC
│  └─ Not on same network? → Check WiFi connection
│
└─ YES
   ├─ Port 8000 accessible?
   │  ├─ NO → Add firewall exception (see above)
   │  └─ YES
   │     ├─ Backend responding?
   │     │  ├─ NO → Start backend: npm start
   │     │  └─ YES
   │     │     ├─ Port 3000 accessible?
   │     │     │  ├─ NO → Add firewall exception
   │     │     │  └─ YES
   │     │     │     ├─ Frontend loading?
   │     │     │     │  ├─ NO → Start frontend: npm start
   │     │     │     │  └─ YES ✅ WORKING!
```

---

## 🎯 Run Diagnostic Tool (EASIEST)

### Method 1: Batch Script (RECOMMENDED)
```
Right-click on run-diagnostic.bat
Select "Run as Administrator"
Enter your server IP when prompted
```

### Method 2: PowerShell Direct
```powershell
cd d:\REPAIR-ORDER-SYSTEM
.\advanced-diagnostic.ps1
# Enter server IP when prompted
```

### Method 3: With Server IP Parameter
```powershell
.\advanced-diagnostic.ps1 -ServerIP "192.168.1.100"
```

### Method 4: Manual Commands
```powershell
# Ping
ping 192.168.1.100

# Port 8000
Test-NetConnection -ComputerName 192.168.1.100 -Port 8000

# API
curl http://192.168.1.100:8000/api/health

# Browser
# Open: http://192.168.1.100:3000
```

---

## 📋 CHECKLIST - Follow This Order

- [ ] Get server IP: `ipconfig | findstr IPv4`
- [ ] Backend running: `npm start` (backend folder)
- [ ] Add firewall exceptions (ports 8000, 3000)
- [ ] Frontend running: `npm start` (frontend folder)
- [ ] Run diagnostic: `.\advanced-diagnostic.ps1`
- [ ] Test in browser: `http://SERVER_IP:3000`
- [ ] Try login
- [ ] Test CRUD operations

---

## 🔐 Firewall Configurations

### Add Rules via PowerShell (Recommended)
```powershell
# Run as Administrator

# Port 8000
netsh advfirewall firewall add rule `
  name="Allow Node Backend" `
  dir=in action=allow protocol=tcp `
  localport=8000 profile=private

# Port 3000
netsh advfirewall firewall add rule `
  name="Allow Node Frontend" `
  dir=in action=allow protocol=tcp `
  localport=3000 profile=private
```

### Add Rules via GUI
1. Settings → Windows Defender Firewall
2. "Allow an app through firewall"
3. "Change settings"
4. "Allow another app"
5. Select `node.exe`
6. Check "Private"
7. "OK"

### Verify Rules Added
```powershell
netsh advfirewall firewall show rule name="Allow Node*"
```

---

## 📊 Expected Outputs

### Successful Ping
```
Reply from 192.168.1.100: bytes=32 time=1ms TTL=64
```

### Successful Port Test
```
TcpTestSucceeded : True
```

### Successful API Test
```json
{"status":"OK","message":"Server is running","database":"connected"}
```

### Successful Frontend Load
```html
<html>
  <head>
    <title>Repair Order System</title>
```

---

## 🆘 If All Else Fails

### Option A: Temporary Firewall Disable (Testing Only)
```powershell
# Run as Administrator
netsh advfirewall set allprofiles state off

# Test
# Then re-enable:
netsh advfirewall set allprofiles state on
```

### Option B: Check Antivirus
- Disable temporarily (testing only)
- Add Node.js to whitelist
- Check if blocking ports

### Option C: Restart Everything
1. Close all terminals
2. Restart server PC
3. Restart client PC
4. Start backend: `npm start`
5. Start frontend: `npm start`
6. Try accessing again

### Option D: Different Network Test
- Try ethernet instead of WiFi
- Try connecting to hotspot
- Verify both getting IP addresses

---

## 📞 Support Information

If problem persists, collect:

1. **Diagnostic Output**
   ```powershell
   .\advanced-diagnostic.ps1 > output.txt
   ```

2. **Backend Console Screenshot**
   - Shows backend startup logs
   - Any error messages

3. **Browser Console Output** (F12)
   - Network errors
   - API errors

4. **System Info**
   - Windows version: `winver`
   - Node version: `node --version`
   - Network adapter status

5. **Server IP** (can blur last 2 numbers)

Share these with support team.

---

## 📚 Full Documentation Reference

| Document | Purpose | Read When |
|----------|---------|-----------|
| `NETWORK_CANNOT_CONNECT_DETAILED.md` | Comprehensive guide | Not working, need detailed steps |
| `NETWORK_QUICK_FIX.md` | Fast solutions | Need quick fix |
| `NETWORK_TROUBLESHOOTING.md` | Technical details | Need deep understanding |
| `NETWORK_SETUP_GUIDE.md` | Initial setup | Setting up first time |
| `NETWORK_IMPLEMENTATION.md` | Technical implementation | Want to know how it works |
| `NETWORK_QUICK_START.md` | 30-second overview | Just need quick summary |

---

## ✅ Success Indicators

Network is working when:
- ✅ Can ping server from client
- ✅ Port 8000 accessible from client
- ✅ Backend API responding
- ✅ Port 3000 accessible from client
- ✅ Frontend page loads in browser
- ✅ Can login
- ✅ Can view repair orders
- ✅ Can perform CRUD operations
- ✅ Can export to Excel

---

## 🎯 Next Steps

1. **Run Diagnostic Tool First**
   ```powershell
   .\advanced-diagnostic.ps1
   ```

2. **Follow Recommendations**
   - Tool will tell you what to fix

3. **Read Detailed Guide if Needed**
   - `NETWORK_CANNOT_CONNECT_DETAILED.md`

4. **Add Firewall Exceptions**
   - Ports 8000 and 3000

5. **Verify Both Running**
   - Backend: `npm start` (port 8000)
   - Frontend: `npm start` (port 3000)

6. **Test in Browser**
   - `http://192.168.1.100:3000`

---

## 📞 Quick Support

**Still stuck?**

1. Run diagnostic: `.\advanced-diagnostic.ps1`
2. Screenshot results
3. Screenshot backend terminal
4. Screenshot browser console (F12)
5. Share with support team

**Most common fix:** Firewall exceptions + restarting backend

---

**Created:** January 21, 2026  
**Last Updated:** January 21, 2026  
**Status:** Complete Troubleshooting Toolkit  
**Version:** 1.0
