# Authentication System Documentation

## Overview

The Wren AI frontend now includes a comprehensive authentication system that integrates with the TrendRadar API Gateway and Auth Service. This system provides user registration, login, password management, session tracking, and role-based access control.

## Architecture

### Components

1. **Auth Client** (`src/lib/api/authClient.ts`)
   - Handles all API calls to the authentication service via API Gateway
   - Manages JWT token storage and refresh
   - Automatic token refresh on 401 errors
   - HTTP-only cookie support for enhanced security

2. **Auth Context** (`src/contexts/AuthContext.tsx`)
   - Global authentication state management
   - Provides auth methods to the entire application
   - Handles user session lifecycle

3. **Route Guards**
   - `ProtectedRoute` - Wraps pages requiring authentication
   - `GuestRoute` - Wraps auth pages (login, register)
   - Support for role-based access control

4. **User Menu** (`src/components/UserMenu.tsx`)
   - Dropdown menu in the header
   - Quick access to profile, security, and admin pages
   - Logout functionality

## Authentication Flow

### Registration

1. User fills registration form with email, password, name, and role
2. Frontend calls `/api/v1/auth/register` endpoint via API Gateway
3. User is automatically logged in after successful registration
4. JWT tokens are stored in localStorage
5. User is redirected to the home page

### Login

1. User provides email and password
2. Frontend calls `/api/v1/auth/login` endpoint
3. On success, receives access token (15 min) and refresh token (7 days)
4. Tokens are stored in localStorage
5. User info is fetched and stored in auth context
6. User is redirected to the home page or the page they tried to access

### Token Refresh

- Access tokens expire after 15 minutes
- When a 401 error is received, the system automatically:
  1. Attempts to refresh using the refresh token
  2. Retries the original request with the new access token
  3. If refresh fails, redirects to login page

### Logout

1. User clicks logout from the user menu
2. Frontend calls `/api/v1/auth/logout` endpoint
3. Tokens are cleared from localStorage
4. User is redirected to the login page

## User Roles

The system supports the following roles:

- **Admin** - Full access including user management
- **Developer** - Access to development features
- **Analyst** - Access to analytics and reporting
- **Viewer** - Read-only access
- **Seller** - Sales-specific features

## Protected Routes

### Implementation

Wrap any page component with `ProtectedRoute`:

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

### Role-Based Protection

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

## Guest Routes

For pages that should only be accessible to non-authenticated users:

```tsx
import GuestRoute from '@/components/auth/GuestRoute';

export default function LoginPage() {
  return (
    <GuestRoute>
      {/* Login form */}
    </GuestRoute>
  );
}
```

## Using the Auth Hook

Access authentication state and methods anywhere in the app:

```tsx
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();

  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }

  return (
    <div>
      <h1>Welcome, {user.firstName}!</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

## API Gateway Configuration

The frontend connects to the API Gateway using the `NEXT_PUBLIC_API_GATEWAY_URL` environment variable.

Create a `.env.local` file in the frontend root:

```env
NEXT_PUBLIC_API_GATEWAY_URL=http://localhost:8000
```

For production, set this to your production API Gateway URL.

## Available Pages

### Authentication Pages

- `/auth/login` - User login
- `/auth/register` - New user registration
- `/auth/forgot-password` - Request password reset
- `/auth/reset-password` - Reset password with token

### User Pages

- `/profile` - User profile management
- `/profile/security` - Password change and session management

### Admin Pages

- `/admin/users` - User management (admin only)

## Session Management

Users can view and manage their active sessions from `/profile/security`:

- View all active sessions with device info and last activity
- Revoke individual sessions
- Revoke all sessions except the current one

## Security Features

1. **JWT Tokens**
   - Short-lived access tokens (15 minutes)
   - Long-lived refresh tokens (7 days)
   - Automatic token refresh

2. **Password Requirements**
   - Minimum 8 characters
   - Complexity validation on the backend

3. **Session Tracking**
   - IP address and user agent tracking
   - Session expiration
   - Multi-device support

4. **CSRF Protection**
   - Implemented at the API Gateway level

5. **Rate Limiting**
   - Applied to all auth endpoints at the gateway

## Error Handling

All authentication errors are handled gracefully:

- Network errors show user-friendly messages
- Invalid credentials provide clear feedback
- Token expiration triggers automatic refresh
- Failed refresh redirects to login

## Next Steps

### TODO: Integrate with Existing Features

Currently, the authentication system is in place but existing features (threads, dashboards, etc.) are not yet associated with users. Next steps:

1. Add `userId` to threads, responses, dashboards
2. Filter data by current user
3. Implement sharing and collaboration features
4. Add audit logging for user actions

### TODO: Email Verification

- Implement email verification flow
- Send verification emails on registration
- Add email verification status to user profile

### TODO: Two-Factor Authentication

- Add TOTP-based 2FA support
- QR code generation for authenticator apps
- Backup codes

### TODO: Social Login

- Google OAuth integration
- GitHub OAuth integration
- Microsoft OAuth integration

## Troubleshooting

### "Invalid or expired token" error

1. Check that API Gateway is running
2. Verify JWT secret keys match between gateway and auth service
3. Clear localStorage and log in again

### "Connection refused" error

1. Verify API Gateway is running on the correct port
2. Check `NEXT_PUBLIC_API_GATEWAY_URL` environment variable
3. Ensure CORS is configured correctly on the gateway

### User menu not showing

1. Ensure AuthProvider is wrapped around the app in `_app.tsx`
2. Check that user data is loading correctly
3. Verify HeaderBar imports UserMenu component

## API Endpoints

All endpoints are proxied through the API Gateway at `/api/v1/auth/`:

- `POST /register` - User registration
- `POST /login` - User login
- `POST /logout` - User logout
- `POST /refresh` - Refresh access token
- `GET /me` - Get current user
- `PUT /me` - Update user profile
- `POST /password/change` - Change password
- `POST /password/reset` - Request password reset
- `POST /password/reset/confirm` - Confirm password reset
- `GET /sessions` - Get user sessions
- `DELETE /sessions/:id` - Revoke specific session
- `DELETE /sessions` - Revoke all sessions

### Admin Endpoints

- `GET /users` - List all users
- `PUT /users/:id/status` - Update user status
- `PUT /users/:id/role` - Update user role
- `DELETE /users/:id` - Delete user

## Contributing

When adding new protected pages:

1. Wrap the page with `ProtectedRoute`
2. Specify required roles if needed
3. Use the `useAuth` hook to access user data
4. Update this documentation

