# 🚀 QUICK START - ROLE-BASED ACCESS CONTROL

## System Overview

```
┌─────────────────────────────────────────────────────────┐
│                   REPAIR ORDER SYSTEM                    │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  LOGIN PAGE                                              │
│  ├─ Admin  (admin/admin123)                              │
│  └─ User   (user/user123)                                │
│                                                           │
│  DASHBOARD (After Login)                                 │
│  ├─ View Repair Orders (All Users)                       │
│  ├─ Create Repair Order (All Users)                      │
│  ├─ Edit/Update Button (Admin Only) ✅                   │
│  └─ Delete Button (Admin Only) ✅                        │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

## Quick Setup (5 minutes)

### Terminal 1: Database
```bash
cd backend
mysql -u root -p < database.sql
```

### Terminal 2: Backend Server
```bash
cd backend
npm install
npm start
# Running at http://localhost:8000
```

### Terminal 3: Frontend App
```bash
cd frontend
npm install
npm start
# Running at http://localhost:3000
```

## Test Users

| Role | Username | Password | Create | Read | Update | Delete |
|------|----------|----------|--------|------|--------|--------|
| ADMIN | admin | admin123 | ✅ | ✅ | ✅ | ✅ |
| USER | user | user123 | ✅ | ✅ | ❌ | ❌ |

## Key Features

### ✅ Admin Features
```
- Create new repair orders
- View all repair orders
- EDIT existing repair orders
- DELETE repair orders
- Full control over system
```

### ✅ User Features
```
- Create new repair orders
- View all repair orders
- CANNOT edit repair orders (button disabled)
- CANNOT delete repair orders (button disabled)
- Read-only for updates
```

## File Structure

```
├── backend/
│   ├── middleware/auth.js ..................... Authentication & Authorization
│   ├── controllers/authController.js ......... Login & Register
│   ├── routes/authRoutes.js .................. Auth endpoints
│   ├── database.sql .......................... Users & Roles tables
│   └── server.js ............................ Updated with auth routes
│
├── frontend/
│   ├── components/Auth.js ................... Login/Register form (NEW)
│   ├── components/RepairOrderTable.js ....... Role-based UI (UPDATED)
│   ├── services/api.js ..................... JWT interceptor (UPDATED)
│   └── App.js .............................. Auth logic (UPDATED)
│
└── Documentation/
    ├── RBAC_DOCUMENTATION.md ................ Full documentation
    ├── SETUP_GUIDE.md ....................... Step-by-step setup
    ├── IMPLEMENTATION_SUMMARY.md ............ What's new
    └── QUICK_START.md ....................... This file
```

## API Endpoints Quick Reference

### Auth
```
POST   /api/auth/login           → Get JWT Token
POST   /api/auth/register        → Create new user
GET    /api/auth/me              → Get current user
```

### Repair Orders (All require JWT token)
```
GET    /api/repair-orders        → View all
GET    /api/repair-orders/:id    → View detail
POST   /api/repair-orders        → Create (All users)
PUT    /api/repair-orders/:id    → Update (Admin only)
DELETE /api/repair-orders/:id    → Delete (Admin only)
```

## JWT Token Info

- **Format**: `Bearer <token>`
- **Duration**: 24 hours
- **Storage**: localStorage
- **Verification**: Server-side JWT validation

## How It Works

### 1. Login Flow
```
User enters credentials
        ↓
POST /api/auth/login
        ↓
Server generates JWT token
        ↓
Token stored in localStorage
        ↓
Frontend ready for API calls
```

### 2. API Request Flow
```
User clicks "Create" / "Edit" / "Delete"
        ↓
Axios interceptor adds token to header
        ↓
Backend receives request with token
        ↓
Middleware verifies token
        ↓
Middleware checks user role
        ↓
Allow or Deny action
```

### 3. Edit/Delete Protection
```
USER Role:
Edit button → DISABLED (gray, non-clickable)
Delete button → DISABLED (gray, non-clickable)
If user tries to access API directly → 403 Forbidden

ADMIN Role:
Edit button → ENABLED (green, clickable)
Delete button → ENABLED (red, clickable)
Full API access granted
```

## Environment Setup

Create `backend/.env`:
```
PORT=8000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=repair_order_db
JWT_SECRET=repair_order_system_secret_key_2024
```

## Testing Workflow

### Test as User
```
1. Open http://localhost:3000
2. Login: user / user123
3. Click "Tambah Repair Order Baru" → ✅ Works
4. Try to EDIT → ❌ Button disabled
5. Try to DELETE → ❌ Button disabled
```

### Test as Admin
```
1. Logout first
2. Login: admin / admin123
3. Click "Tambah Repair Order Baru" → ✅ Works
4. Click EDIT button → ✅ Works
5. Click DELETE button → ✅ Works
```

## Permissions Matrix

| Operation | User | Admin | Backend Check |
|-----------|------|-------|---------------|
| View List | ✅ | ✅ | authenticateToken |
| View Detail | ✅ | ✅ | authenticateToken |
| Create | ✅ | ✅ | checkPermission('can_create') |
| Update | ❌ | ✅ | authorizeRole(['admin']) |
| Delete | ❌ | ✅ | authorizeRole(['admin']) |

## Common Issues

### Issue: "Access token required"
**Solution**: Refresh page and login again

### Issue: "You do not have permission"
**Solution**: This role doesn't have permission for that action

### Issue: Edit/Delete buttons disabled
**Solution**: Normal for USER role. Login as ADMIN to test.

### Issue: CORS Error
**Solution**: Backend CORS already configured, check console

### Issue: Database connection failed
**Solution**: Check MySQL is running and DB credentials in `.env`

## Important Notes

⚠️ **Development Only**
- Demo passwords are for testing
- In production, change JWT_SECRET
- Use HTTPS for production
- Use environment variables for sensitive data

🔐 **Security Checklist**
- [x] Password hashing with bcrypt
- [x] JWT token verification
- [x] Role-based access control
- [x] Token expiration (24h)
- [x] Authorization middleware
- [ ] HTTPS (for production)
- [ ] Rate limiting (for production)
- [ ] Input sanitization enhancement (for production)

## Next Enhancement Ideas

1. **Email Verification** - Verify email on registration
2. **Password Reset** - Forgot password functionality
3. **User Management Panel** - Admin can manage users
4. **Activity Logging** - Track who did what
5. **Two-Factor Auth** - Additional security layer
6. **Custom Roles** - Create custom role definitions
7. **Audit Trail** - Complete history of changes

## Support & Debug

Check logs:
```bash
# Backend logs
npm start    # Shows request logs

# Frontend console
F12 → Console tab  # JavaScript errors

# Database
mysql -u root -p repair_order_db
SELECT * FROM users;
SELECT * FROM repair_orders;
```

## Success Indicators ✅

- [x] Login page appears before accessing app
- [x] User info displays with role in header
- [x] Admin: Can click Edit & Delete buttons
- [x] User: Edit & Delete buttons are disabled
- [x] Logout button works and clears session
- [x] Token refreshed on each login
- [x] 401 error triggers auto-logout

---

**Ready to go!** Start the servers and test the system. 🎉

For detailed info, see:
- 📖 `RBAC_DOCUMENTATION.md` - Full documentation
- 🛠️ `SETUP_GUIDE.md` - Setup instructions
- 📋 `IMPLEMENTATION_SUMMARY.md` - What changed
