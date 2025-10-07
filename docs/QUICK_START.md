# Quick Start - Authentication với Access Token

## 🚀 Bắt đầu nhanh trong 3 bước

### Bước 1: Setup Environment

Tạo file `.env.local` (nếu chưa có):
```env
NEXT_PUBLIC_API_GATEWAY_URL=http://localhost:8000
```

### Bước 2: Wrap App với AuthProvider

File `_app.tsx` đã có `AuthProvider`, đảm bảo nó đang wrap toàn bộ app:
```typescript
import { AuthProvider } from '@/contexts/AuthContext';

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}
```

### Bước 3: Sử dụng trong Component

```typescript
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/lib/api/apiClient';

function MyComponent() {
  const { login, user, isAuthenticated } = useAuth();

  // Đăng nhập
  const handleLogin = async () => {
    await login({
      email: 'user@example.com',
      password: 'password123',
    });
    // ✅ Token đã được lưu tự động!
  };

  // Gọi API với token
  const fetchData = async () => {
    const data = await apiClient.get('/api/v1/your-endpoint');
    // ✅ Token tự động được thêm vào header!
    console.log(data);
  };

  if (!isAuthenticated) {
    return <button onClick={handleLogin}>Đăng nhập</button>;
  }

  return (
    <div>
      <h1>Xin chào {user?.full_name}</h1>
      <button onClick={fetchData}>Lấy dữ liệu</button>
    </div>
  );
}
```

## ✨ Tính năng tự động

### 1. Lưu token tự động
```typescript
await login({ email, password });
// ✅ access_token và refresh_token đã được lưu vào localStorage
```

### 2. Thêm token vào header tự động
```typescript
await apiClient.get('/api/v1/products');
// ✅ Header tự động có: Authorization: Bearer {access_token}
```

### 3. Refresh token tự động
```typescript
// Khi API trả về 401:
// ✅ Tự động gọi /api/v1/auth/refresh
// ✅ Lưu token mới
// ✅ Retry request ban đầu
```

### 4. Redirect về login tự động
```typescript
// Khi refresh token cũng hết hạn:
// ✅ Xóa tokens
// ✅ Redirect về /auth/login
```

## 📦 Các file quan trọng

| File | Mục đích |
|------|----------|
| `src/types/auth.ts` | Type definitions |
| `src/lib/api/authClient.ts` | Authentication API (login, register, logout) |
| `src/lib/api/apiClient.ts` | Generic API client (cho các API khác) |
| `src/contexts/AuthContext.tsx` | React Context & hooks |

## 🎯 Các API endpoints có sẵn

```typescript
import { authClient } from '@/lib/api/authClient';

// Authentication
authClient.login({ email, password })
authClient.register({ email, password, first_name, last_name })
authClient.logout()
authClient.refreshToken(refreshToken)

// User Management
authClient.getCurrentUser()
authClient.updateProfile({ first_name, last_name, phone, company, bio })
authClient.changePassword({ old_password, new_password })

// Password Reset
authClient.requestPasswordReset({ email })
authClient.confirmPasswordReset({ token, new_password })

// Sessions
authClient.getSessions()
authClient.revokeSession(sessionId)
authClient.revokeAllSessions()

// Admin (requires admin role)
authClient.getUsers({ skip, limit, role, status, search })
authClient.updateUserStatus(userId, newStatus)
```

## 🎨 Templates sẵn dùng

### Template 1: Login Page
```typescript
import { useAuth } from '@/contexts/AuthContext';
import { Form, Input, Button } from 'antd';

export default function LoginPage() {
  const { login, isLoading } = useAuth();

  const onFinish = async (values) => {
    await login(values);
  };

  return (
    <Form onFinish={onFinish}>
      <Form.Item name="email" rules={[{ required: true, type: 'email' }]}>
        <Input placeholder="Email" />
      </Form.Item>
      <Form.Item name="password" rules={[{ required: true }]}>
        <Input.Password placeholder="Mật khẩu" />
      </Form.Item>
      <Button type="primary" htmlType="submit" loading={isLoading}>
        Đăng nhập
      </Button>
    </Form>
  );
}
```

### Template 2: Protected Page
```typescript
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/lib/api/apiClient';
import { useEffect, useState } from 'react';

export default function ProtectedPage() {
  const { user, isAuthenticated } = useAuth();
  const [data, setData] = useState([]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  const fetchData = async () => {
    const result = await apiClient.get('/api/v1/data');
    setData(result);
  };

  if (!isAuthenticated) {
    return <div>Vui lòng đăng nhập</div>;
  }

  return (
    <div>
      <h1>Xin chào {user?.full_name}</h1>
      <div>{JSON.stringify(data)}</div>
    </div>
  );
}
```

### Template 3: API Service
```typescript
import { apiClient } from '@/lib/api/apiClient';

export const myService = {
  getAll: () => apiClient.get('/api/v1/items'),
  getById: (id) => apiClient.get(`/api/v1/items/${id}`),
  create: (data) => apiClient.post('/api/v1/items', data),
  update: (id, data) => apiClient.put(`/api/v1/items/${id}`, data),
  delete: (id) => apiClient.delete(`/api/v1/items/${id}`),
};
```

## 🔍 Debug & Testing

### Check token trong console
```javascript
localStorage.getItem('accessToken')
localStorage.getItem('refreshToken')
```

### Test API call
```javascript
import { apiClient } from '@/lib/api/apiClient';

const test = async () => {
  const user = await apiClient.get('/api/v1/auth/me');
  console.log('Current user:', user);
};

test();
```

### Check authentication state
```typescript
const { user, isAuthenticated, accessToken } = useAuth();
console.log({ user, isAuthenticated, accessToken });
```

## 📚 Đọc thêm

- **Chi tiết đầy đủ**: `docs/API_USAGE.md`
- **Ví dụ thực tế**: `docs/AUTHENTICATION_EXAMPLES.md`
- **Tổng quan**: `docs/AUTHENTICATION_SUMMARY.md`

## ⚡ Tips & Tricks

### 1. Luôn dùng `apiClient` cho API calls
```typescript
// ✅ Đúng
import { apiClient } from '@/lib/api/apiClient';
const data = await apiClient.get('/api/v1/items');

// ❌ Sai - Token không được tự động thêm
const data = await axios.get('/api/v1/items');
```

### 2. Check authentication trước khi gọi API
```typescript
const { isAuthenticated } = useAuth();

if (isAuthenticated) {
  await apiClient.get('/api/v1/protected');
}
```

### 3. Sử dụng try-catch để xử lý lỗi
```typescript
try {
  const data = await apiClient.get('/api/v1/items');
} catch (error) {
  console.error('API Error:', error.response?.data);
}
```

### 4. Lấy token để dùng với GraphQL hoặc WebSocket
```typescript
import { authClient } from '@/lib/api/authClient';

const token = authClient.getAccessToken();
// Dùng với GraphQL, WebSocket, etc.
```

## 🎉 Xong!

Bây giờ bạn có thể:
- ✅ Đăng nhập và token tự động được lưu
- ✅ Gọi API và token tự động được thêm vào header
- ✅ Token tự động refresh khi hết hạn
- ✅ Tự động redirect về login khi cần

Chúc bạn code vui vẻ! 🚀

