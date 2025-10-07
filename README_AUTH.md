# Wren AI - Authentication System

## 🎉 Authentication System Successfully Implemented!

Your Wren AI platform now has a complete, production-ready authentication system integrated with your existing API Gateway and Auth Service.

## ✅ What's Been Implemented

### Core Authentication Features
- ✅ User registration with email/password
- ✅ User login with JWT tokens
- ✅ Automatic token refresh (15-min access, 7-day refresh)
- ✅ Secure logout with token cleanup
- ✅ Password reset flow (request + confirm)
- ✅ Session management (view, revoke sessions)
- ✅ Profile management (update name, email)
- ✅ Password change functionality

### Security Features
- ✅ JWT-based authentication
- ✅ Automatic token refresh on expiration
- ✅ Protected routes with authentication guards
- ✅ Role-based access control (5 roles)
- ✅ Session tracking (IP, user agent, last activity)
- ✅ Secure token storage (localStorage with automatic cleanup)
- ✅ CSRF protection (gateway level)
- ✅ Rate limiting (gateway level)

### User Interface
- ✅ Beautiful modern login page
- ✅ Registration page with role selection
- ✅ Forgot password flow
- ✅ Reset password page
- ✅ User profile page
- ✅ Security settings page
- ✅ User menu in header (avatar dropdown)
- ✅ Unauthorized (403) page
- ✅ Responsive design for mobile

### Admin Features
- ✅ Admin dashboard for user management
- ✅ List all users with filters
- ✅ Update user roles
- ✅ Update user status (active, inactive, pending, suspended)
- ✅ Delete users
- ✅ Search users by email/name

### Protected Routes
All main application routes now require authentication:
- ✅ `/` - Home page
- ✅ `/home/*` - All home routes
- ✅ `/modeling` - Data modeling
- ✅ `/knowledge/*` - Instructions and SQL pairs
- ✅ `/api-management/*` - API history
- ✅ `/profile/*` - User profile and settings
- ✅ `/admin/*` - Admin pages (admin only)

## 📁 New Files Created

### Core Files
```
frontendv2/src/
├── types/
│   └── auth.ts                           # TypeScript types for authentication
├── lib/api/
│   └── authClient.ts                     # API client with auto token refresh
├── contexts/
│   └── AuthContext.tsx                   # Global auth state management
└── components/
    ├── auth/
    │   ├── ProtectedRoute.tsx            # Wrapper for authenticated pages
    │   └── GuestRoute.tsx                # Wrapper for auth pages
    └── UserMenu.tsx                      # User avatar dropdown menu
```

### Pages
```
frontendv2/src/pages/
├── auth/
│   ├── login.tsx                         # Login page
│   ├── register.tsx                      # Registration page
│   ├── forgot-password.tsx               # Request password reset
│   └── reset-password.tsx                # Confirm password reset
├── profile/
│   ├── index.tsx                         # User profile page
│   └── security.tsx                      # Security settings
├── admin/
│   └── users.tsx                         # User management dashboard
└── unauthorized.tsx                      # 403 error page
```

### Documentation
```
frontendv2/docs/
└── AUTHENTICATION.md                     # Complete authentication docs

Root directory:
├── IMPLEMENTATION_SUMMARY.md             # Comprehensive implementation guide
└── QUICKSTART_AUTH.md                    # Quick start testing guide
```

## 🚀 Quick Start

### 1. Set Environment Variable

Create `.env.local` in `frontendv2/` directory:

```env
NEXT_PUBLIC_API_GATEWAY_URL=http://localhost:8000
```

### 2. Start Services

```bash
# Terminal 1: API Gateway
cd microservices/api-gateway
uv run uvicorn src.main:app --reload --port 8000

# Terminal 2: Auth Service  
cd microservices/services/auth-service
python main.py

# Terminal 3: Frontend
cd frontendv2
yarn dev
```

### 3. Test Authentication

1. Open `http://localhost:3000`
2. You'll be redirected to `/auth/login`
3. Click "Sign up" and create an account
4. You'll be automatically logged in!

## 📖 Usage Examples

### Using Auth in Components

```tsx
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { UserRole } from '@/types/auth';

function MyComponent() {
  const { user, isAuthenticated, logout } = useAuth();
  
  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }

  return (
    <div>
      <h1>Welcome, {user.firstName}!</h1>
      <p>Email: {user.email}</p>
      <p>Role: {user.role}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Protecting Pages

```tsx
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function MyPage() {
  return (
    <ProtectedRoute>
      {/* Your page content */}
    </ProtectedRoute>
  );
}
```

### Admin-Only Pages

```tsx
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { UserRole } from '@/types/auth';

export default function AdminPage() {
  return (
    <ProtectedRoute requiredRoles={[UserRole.ADMIN]}>
      {/* Admin-only content */}
    </ProtectedRoute>
  );
}
```

## 🎨 User Roles

The system supports 5 user roles:

- **Admin** - Full access including user management
- **Developer** - Technical users building data models
- **Analyst** - Business analysts using the platform
- **Viewer** - Read-only access
- **Seller** - Sales team members

## 🔒 Security Best Practices

### Implemented
- Short-lived access tokens (15 minutes)
- Long-lived refresh tokens (7 days)
- Automatic token refresh
- Secure token storage
- Session tracking with IP and user agent
- Password hashing with bcrypt
- Role-based access control
- Protected routes

### Recommendations for Production
- Use HTTPS only
- Set secure cookie flags
- Configure CORS properly
- Use environment variables for secrets
- Enable rate limiting
- Set up monitoring and alerts
- Implement audit logging

## 📊 API Endpoints

All endpoints are proxied through API Gateway at `/api/v1/auth/`:

### Public Endpoints
- `POST /register` - User registration
- `POST /login` - User login
- `POST /password/reset` - Request password reset
- `POST /password/reset/confirm` - Confirm password reset

### Authenticated Endpoints
- `POST /logout` - User logout
- `POST /refresh` - Refresh access token
- `GET /me` - Get current user
- `PUT /me` - Update user profile
- `POST /password/change` - Change password
- `GET /sessions` - Get user sessions
- `DELETE /sessions/:id` - Revoke specific session
- `DELETE /sessions` - Revoke all sessions

### Admin Endpoints
- `GET /users` - List all users
- `PUT /users/:id/status` - Update user status
- `PUT /users/:id/role` - Update user role
- `DELETE /users/:id` - Delete user

## 🎯 What's Next?

### Immediate Next Steps
1. **Test the authentication system** using the Quick Start guide
2. **Integrate with existing features** - associate threads/dashboards with users
3. **Configure email** - set up SMTP for password reset emails

### Future Enhancements
- Email verification for new registrations
- Two-factor authentication (TOTP)
- Social login (Google, GitHub, Microsoft)
- SSO integration (SAML, OAuth)
- Audit logging for security events
- Advanced password policies

## 📚 Documentation

- `AUTHENTICATION.md` - Detailed authentication documentation
- `IMPLEMENTATION_SUMMARY.md` - Complete implementation overview
- `QUICKSTART_AUTH.md` - Testing guide with step-by-step instructions

## 🐛 Troubleshooting

### "Network Error"
- Ensure API Gateway is running on port 8000
- Check `NEXT_PUBLIC_API_GATEWAY_URL` environment variable
- Verify CORS configuration

### "Invalid Token"
- Clear localStorage and login again
- Check JWT secret matches between services
- Verify token hasn't expired

### User Menu Not Showing
- Ensure AuthProvider is in `_app.tsx`
- Check browser console for errors
- Verify user data is loading

### More Help
See `QUICKSTART_AUTH.md` for detailed troubleshooting steps.

## 🎨 Customization

### Changing Colors
The authentication pages use purple gradient (#667eea, #764ba2). To change:

Edit the styled-components in:
- `src/pages/auth/login.tsx`
- `src/pages/auth/register.tsx`
- `src/pages/auth/forgot-password.tsx`
- `src/pages/auth/reset-password.tsx`

### Adding More Roles
1. Update `UserRole` enum in `src/types/auth.ts`
2. Update backend role enum
3. Update role dropdowns in registration and admin pages

### Customizing Session Timeout
Edit token expiration in auth service configuration:
- Access token: 15 minutes (default)
- Refresh token: 7 days (default)

## 🙏 Support

If you encounter issues:
1. Check the documentation files
2. Review browser console for errors
3. Check API Gateway logs
4. Verify all services are running
5. Ensure database is properly initialized

## ✨ Summary

Your Wren AI platform now has a **complete, production-ready authentication system**! 

**What you can do now:**
- ✅ Users can register and login
- ✅ All routes are protected
- ✅ Admins can manage users
- ✅ Users can manage their profiles and sessions
- ✅ Secure token-based authentication with auto-refresh
- ✅ Role-based access control

**Ready to use in production** with proper security configuration!

---

**Questions?** See the detailed documentation files or reach out for support.

**Happy building! 🚀**

