# 🚨 Comprehensive Network Troubleshooting - Cannot Connect to Other PC

Jika masih tidak bisa terhubung setelah semua langkah, follow checklist ini sangat detail.

---

## 📋 PRE-CHECK CHECKLIST (Lakukan dulu)

### ☐ Prerequisite Check:
- [ ] Server PC dan Client PC on same WiFi/Network
- [ ] Both PCs powered on and connected
- [ ] Internet/Network working on both PCs
- [ ] No antivirus blocking
- [ ] Administrator access on both PCs

---

## 🔍 DETAILED STEP-BY-STEP TROUBLESHOOTING

### STEP 1: Server PC Setup & Verification

#### 1.1 Get Correct Server IP Address
**On SERVER PC, open PowerShell:**

```powershell
ipconfig | findstr IPv4
```

**Expected output:**
```
IPv4 Address. . . . . . . . . . : 192.168.x.x
```

**CRITICAL NOTES:**
- ❌ Do NOT use `127.0.0.1` (loopback - local only)
- ❌ Do NOT use `localhost`
- ✅ Must be `192.168.x.x` or `10.0.x.x`
- ✅ Write down this IP: `_______._______._______._______`

#### 1.2 Verify Network Connection
**On SERVER PC:**

```powershell
# Get network adapter status
Get-NetAdapter | Where-Object {$_.Status -eq "Up"}
```

**Expected:**
- Should show connected adapter (WiFi or Ethernet)
- Status: Up

#### 1.3 Check Firewall Status
**On SERVER PC:**

```powershell
Get-NetFirewallProfile | Select-Object Name, Enabled
```

**Expected output:**
```
Name             Enabled
----             -------
Domain             True/False
Private            True/False
Public             True/False
```

---

### STEP 2: Backend Setup on Server

#### 2.1 Start Backend
**On SERVER PC, open PowerShell as ADMINISTRATOR:**

```powershell
cd d:\REPAIR-ORDER-SYSTEM\backend
npm start
```

**Expected output (look for this):**
```
✅ Server is running!
========================================
Local Access:  http://localhost:8000
Network Access: http://192.168.1.100:8000
========================================
```

**If you see ERROR:**

**Error 1: "Cannot find module"**
```powershell
npm install
npm start
```

**Error 2: "Port 8000 already in use"**
```powershell
# Find process using port 8000
netstat -ano | findstr ":8000"

# Kill it (replace PID with actual number)
taskkill /PID 1234 /F

# Try again
npm start
```

**Error 3: "Database connection failed"**
- Check MySQL running
- Verify .env credentials
- See Database section below

#### 2.2 Keep Terminal Open
⚠️ **IMPORTANT:** Keep this PowerShell window OPEN with backend running!
Do NOT close it!

---

### STEP 3: Firewall Configuration (Critical!)

**⚠️ This is likely your issue if ports are blocked!**

#### 3.1 Add Firewall Exceptions
**On SERVER PC, open PowerShell as ADMINISTRATOR:**

```powershell
# Add exception for port 8000 (Backend)
netsh advfirewall firewall add rule `
  name="Allow Node Backend Port 8000" `
  dir=in action=allow protocol=tcp `
  localport=8000 profile=private

# Add exception for port 3000 (Frontend)
netsh advfirewall firewall add rule `
  name="Allow Node Frontend Port 3000" `
  dir=in action=allow protocol=tcp `
  localport=3000 profile=private
```

**Verify rules were added:**
```powershell
netsh advfirewall firewall show rule name="Allow Node*"
```

#### 3.2 Alternative: GUI Method
If PowerShell method doesn't work:

1. Press `Win + I` → Search "Firewall"
2. Click "Windows Defender Firewall"
3. Click "Allow an app through firewall"
4. Click "Change settings" (Administrator)
5. Click "Allow another app"
6. Click "Browse"
7. Navigate to: `C:\Program Files\nodejs\node.exe`
8. Click "Add"
9. Make sure "Private" is checked (not just Public)
10. Click "OK"

---

### STEP 4: Test from Client PC

#### 4.1 Run Advanced Diagnostic Tool
**On CLIENT PC, open PowerShell:**

```powershell
cd d:\REPAIR-ORDER-SYSTEM

# Run the advanced diagnostic
.\advanced-diagnostic.ps1

# When prompted, enter server IP
# Example: 192.168.1.100
```

**This tool will:**
- ✅ Show your client IP
- ✅ Ping server
- ✅ Test port 8000
- ✅ Test port 3000
- ✅ Test backend API
- ✅ Test frontend
- ✅ Show recommendations

**Screenshot the results and save!**

#### 4.2 Manual Tests
If diagnostic tool doesn't work:

**Test 4.2.1: Ping**
```powershell
ping 192.168.1.100
```

Expected: `Reply from 192.168.1.100`
Failed: Check server IP, restart server

**Test 4.2.2: Port 8000**
```powershell
Test-NetConnection -ComputerName 192.168.1.100 -Port 8000
```

Expected: `TcpTestSucceeded : True`
Failed: Check firewall exceptions

**Test 4.2.3: Backend API**
```powershell
curl http://192.168.1.100:8000/api/health
```

Expected: JSON response with status OK
Failed: Backend not running or port blocked

**Test 4.2.4: Frontend**
```powershell
curl http://192.168.1.100:3000
```

Expected: HTML page content
Failed: Frontend not running or port blocked

---

### STEP 5: Database Verification

#### 5.1 Check MySQL is Running
**On SERVER PC:**

```powershell
# Check MySQL service status
Get-Service MySQL* | Select-Object Name, Status

# Or check MySQL daemon
mysql --version
```

#### 5.2 Verify Credentials
**On SERVER PC, open backend folder:**

```powershell
# Check .env file
cd d:\REPAIR-ORDER-SYSTEM\backend
cat .env
```

**Expected .env file:**
```
DB_HOST=localhost
DB_USER=root
DB_PASS=password
DB_NAME=repair_order_db
DB_PORT=3306
JWT_SECRET=your_jwt_secret
PORT=8000
```

#### 5.3 Test Connection
**On SERVER PC:**

```powershell
# Try to login to MySQL
mysql -u root -p

# Enter password when prompted
# If successful, type: exit
```

---

### STEP 6: Frontend on Server

#### 6.1 Start Frontend
**On SERVER PC, open ANOTHER PowerShell as ADMINISTRATOR:**

```powershell
cd d:\REPAIR-ORDER-SYSTEM\frontend
npm start
```

**Expected:**
```
Compiled successfully!
On Your Network: http://192.168.1.100:3000
```

**Keep this terminal open too!**

---

### STEP 7: Browser Access

#### 7.1 Access from Client Browser
**On CLIENT PC, open browser (Chrome/Firefox/Edge):**

Go to address bar and type:
```
http://192.168.1.100:3000
```

(Replace 192.168.1.100 with your server IP)

**Expected:**
- Page loads (don't worry if it takes 10-30 seconds first time)
- Login page appears
- Input field for username/password

#### 7.2 If Page Doesn't Load

**Check 1: URL format**
- Make sure you're using IP, not hostname
- Format: `http://192.168.1.100:3000`
- NOT: `http://localhost:3000`

**Check 2: Frontend running**
- Check second PowerShell window on server
- Should show "Compiled successfully"

**Check 3: Clear browser cache**
- Press: `Ctrl+Shift+Del`
- Check "All time"
- Click "Clear data"
- Reload page: `F5`

**Check 4: Try different browser**
- Try Firefox, Chrome, Edge
- Or try incognito: `Ctrl+Shift+N`

---

### STEP 8: Login & Test

#### 8.1 Login
**On CLIENT PC browser:**

```
Username: admin
Password: (your password)
```

#### 8.2 Perform Tests
- [ ] View repair orders
- [ ] Create new order
- [ ] Edit order
- [ ] Delete order
- [ ] Export to Excel

If all these work, **NETWORK IS WORKING!** ✅

---

## 🔧 Common Issues & Solutions

### Issue 1: "Connection refused" or "Cannot connect"

**Most Likely:** Firewall or backend not running

**Steps to fix:**
1. Verify backend running (Step 2.1)
2. Add firewall exceptions (Step 3)
3. Check port 8000 accessible (Step 4.2.2)

### Issue 2: "Connection timeout"

**Most Likely:** Port blocked by firewall

**Steps to fix:**
1. Add firewall exceptions (Step 3)
2. Disable firewall temporarily for testing:
   ```powershell
   # Run as Administrator
   Set-NetFirewallProfile -Profile Domain,Public,Private -Enabled False
   
   # Test
   # Then re-enable:
   Set-NetFirewallProfile -Profile Domain,Public,Private -Enabled True
   ```

### Issue 3: "Server offline or unreachable"

**Most Likely:** Not on same network

**Steps to fix:**
1. Check both on same WiFi: Settings → Network
2. Both should show same WiFi name
3. Verify network name on both PCs

### Issue 4: "Cannot ping server"

**Most Likely:** Wrong IP or network issue

**Steps to fix:**
1. Get correct server IP: `ipconfig | findstr IPv4`
2. Verify IP format: `192.168.x.x`
3. Restart server network adapter

### Issue 5: "API returns 500 error"

**Most Likely:** Database connection failed

**Steps to fix:**
1. Verify MySQL running (Step 5.1)
2. Check .env credentials (Step 5.2)
3. Restart backend with: `npm start`

### Issue 6: "CORS error" in browser console

**Most Likely:** Browser cache or API URL wrong

**Steps to fix:**
1. Clear cache: `Ctrl+Shift+Del`
2. Hard refresh: `Ctrl+F5`
3. Try incognito: `Ctrl+Shift+N`

---

## 📊 Diagnostic Information to Collect

If still stuck, collect this info:

### On SERVER PC:
```powershell
# 1. Get IP
ipconfig | findstr IPv4 > server-info.txt

# 2. Check backend listening
netstat -ano | findstr ":8000" >> server-info.txt

# 3. Get firewall rules
netsh advfirewall firewall show rule name="Allow Node*" >> server-info.txt

# 4. Copy backend terminal output (screenshot)
```

### On CLIENT PC:
```powershell
# 1. Run diagnostic
.\advanced-diagnostic.ps1 > diagnostic-output.txt

# 2. Test API manually
curl http://192.168.1.100:8000/api/health >> diagnostic-output.txt

# 3. Check browser console (F12 - Console tab) (screenshot)
```

**Share these files for support!**

---

## ✅ Verification Checklist

- [ ] Server IP identified (192.168.x.x)
- [ ] Backend running on server
- [ ] Firewall exceptions added for ports 8000, 3000
- [ ] Client can ping server
- [ ] Port 8000 accessible from client
- [ ] Backend API health check works
- [ ] Port 3000 accessible from client
- [ ] Frontend loads in browser
- [ ] Can login
- [ ] Can view data
- [ ] Can perform CRUD
- [ ] Export Excel works

If all checked ✅, network access is working!

---

## 🆘 Still Not Working?

### Option 1: Disable Firewall (Testing)
```powershell
# Run as Administrator
netsh advfirewall set allprofiles state off

# Test connection
# Then re-enable:
netsh advfirewall set allprofiles state on
```

### Option 2: Check Antivirus
- Temporarily disable antivirus (for testing only)
- Add Node.js/backend to antivirus whitelist
- Check if blocking ports

### Option 3: Restart Everything
```powershell
# Server
# 1. Close all terminals
# 2. Restart PC
# 3. Start backend: npm start
# 4. Start frontend: npm start (other terminal)

# Client
# 1. Clear browser cache
# 2. Close browser
# 3. Restart network: ipconfig /release; ipconfig /renew
# 4. Open browser again
```

### Option 4: Check VPN/Proxy
- If on VPN, may need different setup
- Check VPN not interfering with local network
- Try disconnecting VPN temporarily

---

## 📞 For Support

Provide:
1. Output from `advanced-diagnostic.ps1`
2. Backend terminal screenshot
3. Browser console screenshot (F12)
4. Server IP address (can blur last 2 numbers)
5. Error messages (exact text)
6. Windows version: `winver`

---

**Last Resort: YouTube Search**

If all fails, try search YouTube for:
- "Windows Firewall allow port 8000"
- "Node.js server network access"
- "Can't connect to local server from another PC"

Many have same issue with solutions!

---

**Created:** January 21, 2026  
**Version:** 2.0 - Comprehensive
