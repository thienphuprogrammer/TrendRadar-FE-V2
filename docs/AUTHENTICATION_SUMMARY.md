# Tóm tắt: Hệ thống Authentication với Access Token

## Những gì đã được cập nhật

### 1. **Types và Interfaces** (`src/types/auth.ts`)
- ✅ Cập nhật theo API specification v1.0.0
- ✅ Sử dụng snake_case cho các fields (theo API backend)
- ✅ Thêm các trường mới: `full_name`, `is_active`, `is_verified`, `phone`, `company`, `bio`, `avatar_url`
- ✅ Cập nhật `TokenResponse` với các trường: `access_token`, `refresh_token`, `token_type`, `expires_in`

### 2. **Auth Client** (`src/lib/api/authClient.ts`)
- ✅ **Tự động lưu tokens**: Khi đăng nhập thành công, `access_token` và `refresh_token` được tự động lưu vào `localStorage`
- ✅ **Tự động thêm token vào header**: Mọi request đều tự động có `Authorization: Bearer {access_token}`
- ✅ **Tự động refresh token**: Khi nhận 401, tự động gọi API refresh và thử lại request
- ✅ Cập nhật endpoints theo API spec:
  - `/register` - Đăng ký
  - `/login` - Đăng nhập (trả về tokens)
  - `/refresh` - Làm mới token
  - `/logout` - Đăng xuất
  - `/me` - Lấy thông tin user
  - `/change-password` - Đổi mật khẩu
  - `/forgot-password` - Quên mật khẩu
  - `/reset-password` - Reset mật khẩu
  - `/sessions` - Quản lý sessions
  - `/users` - Admin endpoints

### 3. **Auth Context** (`src/contexts/AuthContext.tsx`)
- ✅ Cập nhật để xử lý token response mới
- ✅ Tự động login sau khi register
- ✅ Lưu tokens vào state và localStorage
- ✅ Thông báo bằng tiếng Việt

### 4. **API Client mới** (`src/lib/api/apiClient.ts`)
- ✅ Client chung cho tất cả API calls
- ✅ Tự động inject access_token vào header
- ✅ Tự động xử lý token refresh
- ✅ Hỗ trợ GET, POST, PUT, PATCH, DELETE
- ✅ Type-safe với TypeScript

### 5. **Documentation**
- ✅ `docs/API_USAGE.md` - Hướng dẫn chi tiết cách sử dụng
- ✅ `docs/AUTHENTICATION_EXAMPLES.md` - Ví dụ thực tế
- ✅ `docs/AUTHENTICATION_SUMMARY.md` - Tóm tắt này

## Cách sử dụng nhanh

### Bước 1: Đăng nhập
```typescript
import { useAuth } from '@/contexts/AuthContext';

const { login } = useAuth();

await login({
  email: 'user@example.com',
  password: 'password123',
});

// ✅ access_token và refresh_token đã được lưu vào localStorage
// ✅ Sẵn sàng cho các API calls khác
```

### Bước 2: Gọi API với token
```typescript
import { apiClient } from '@/lib/api/apiClient';

// Token tự động được thêm vào header!
const data = await apiClient.get('/api/v1/products');
const newItem = await apiClient.post('/api/v1/products', { name: 'Product 1' });
```

### Bước 3: Lấy token để dùng ở nơi khác (nếu cần)
```typescript
import { authClient } from '@/lib/api/authClient';

const accessToken = authClient.getAccessToken();
const refreshToken = authClient.getRefreshToken();

// Sử dụng với fetch, axios, GraphQL, WebSocket, etc.
```

## Luồng hoạt động

### 1. Đăng nhập/Đăng ký
```
User nhập email + password
    ↓
POST /api/v1/auth/login
    ↓
Server trả về: { access_token, refresh_token, token_type, expires_in }
    ↓
Tokens được lưu vào localStorage
    ↓
GET /api/v1/auth/me để lấy thông tin user
    ↓
Lưu user vào context/state
```

### 2. Gọi API
```
User gọi API (qua apiClient)
    ↓
Interceptor tự động thêm: Authorization: Bearer {access_token}
    ↓
API xử lý request
    ↓
Trả về data
```

### 3. Token hết hạn
```
API trả về 401 Unauthorized
    ↓
Interceptor detect lỗi 401
    ↓
Tự động gọi POST /api/v1/auth/refresh
    ↓
Lưu access_token và refresh_token mới
    ↓
Retry request ban đầu với token mới
    ↓
Trả về data
```

### 4. Refresh token cũng hết hạn
```
POST /api/v1/auth/refresh thất bại
    ↓
Xóa tokens khỏi localStorage
    ↓
Redirect về /auth/login
    ↓
User phải đăng nhập lại
```

## Cấu trúc file

```
src/
├── types/
│   └── auth.ts                    # Type definitions
├── lib/
│   └── api/
│       ├── authClient.ts          # Auth API client (login, register, etc.)
│       └── apiClient.ts           # Generic API client (cho các API khác)
├── contexts/
│   └── AuthContext.tsx            # React Context cho authentication
└── hooks/
    └── useAuth.tsx                # Hook để sử dụng auth (đã có trong context)

docs/
├── API_USAGE.md                   # Hướng dẫn chi tiết
├── AUTHENTICATION_EXAMPLES.md     # Ví dụ code thực tế
└── AUTHENTICATION_SUMMARY.md      # File này
```

## Token Storage

Tokens được lưu trong `localStorage`:
- Key: `accessToken` → Giá trị: access_token từ API
- Key: `refreshToken` → Giá trị: refresh_token từ API

**Lưu ý về bảo mật:**
- localStorage dễ bị XSS attack
- Nếu cần bảo mật cao hơn, xem xét dùng httpOnly cookies
- Không expose tokens ra ngoài (console.log, analytics, etc.)

## Các methods có sẵn

### AuthClient (`authClient`)
```typescript
authClient.getAccessToken()           // Lấy access token
authClient.getRefreshToken()          // Lấy refresh token
authClient.setTokens(access, refresh) // Lưu tokens
authClient.clearTokens()              // Xóa tokens
authClient.login(credentials)         // Đăng nhập
authClient.register(data)             // Đăng ký
authClient.logout()                   // Đăng xuất
authClient.getCurrentUser()           // Lấy thông tin user hiện tại
authClient.updateProfile(data)        // Cập nhật profile
authClient.changePassword(data)       // Đổi mật khẩu
authClient.getSessions()              // Lấy danh sách sessions
// ... và nhiều methods khác
```

### APIClient (`apiClient`)
```typescript
apiClient.get(url, config)            // GET request
apiClient.post(url, data, config)     // POST request
apiClient.put(url, data, config)      // PUT request
apiClient.patch(url, data, config)    // PATCH request
apiClient.delete(url, config)         // DELETE request
apiClient.getInstance()               // Lấy Axios instance
```

### Auth Context (`useAuth`)
```typescript
const {
  user,              // User object
  accessToken,       // Access token
  refreshToken,      // Refresh token
  isAuthenticated,   // Boolean
  isLoading,         // Boolean
  error,             // Error message
  login,             // Function
  register,          // Function
  logout,            // Function
  updateProfile,     // Function
  changePassword,    // Function
  refreshUser,       // Function
  clearError,        // Function
} = useAuth();
```

## Environment Variables

Thêm vào `.env.local`:
```env
NEXT_PUBLIC_API_GATEWAY_URL=http://localhost:8000
```

Production:
```env
NEXT_PUBLIC_API_GATEWAY_URL=https://api.trendradar.com
```

## Testing

### Test đăng nhập
```typescript
// 1. Mở browser console
// 2. Sau khi đăng nhập thành công, check localStorage
localStorage.getItem('accessToken')   // Phải có giá trị
localStorage.getItem('refreshToken')  // Phải có giá trị
```

### Test API call
```typescript
import { apiClient } from '@/lib/api/apiClient';

// Trong component hoặc console
const test = async () => {
  try {
    const result = await apiClient.get('/api/v1/auth/me');
    console.log('User info:', result);
  } catch (error) {
    console.error('Error:', error);
  }
};

test();
```

## Troubleshooting

### 1. Token không được lưu
**Nguyên nhân:** localStorage bị disabled hoặc đăng nhập thất bại  
**Giải pháp:** 
- Check network tab xem API có trả về tokens không
- Check browser console có error không
- Thử clear localStorage: `localStorage.clear()`

### 2. API luôn trả về 401
**Nguyên nhân:** Token đã hết hạn hoặc không hợp lệ  
**Giải pháp:**
- Đăng xuất và đăng nhập lại
- Check token trong localStorage có đúng format không
- Verify backend API đang hoạt động

### 3. CORS errors
**Nguyên nhân:** Backend chưa config CORS đúng  
**Giải pháp:**
- Backend phải cho phép origin của frontend
- Backend phải cho phép `Authorization` header
- Backend phải enable `credentials: true`

### 4. Token refresh loop
**Nguyên nhân:** Refresh token cũng hết hạn nhưng không redirect  
**Giải pháp:**
- Check logic trong interceptor
- Đảm bảo khi refresh fail thì clear tokens và redirect

## Checklist

Trước khi deploy, đảm bảo:
- [ ] Environment variables đã được set
- [ ] API Gateway URL đúng
- [ ] Backend API đang chạy
- [ ] CORS đã được config
- [ ] Test đăng nhập thành công
- [ ] Test đăng xuất thành công
- [ ] Test gọi API protected endpoints
- [ ] Test token refresh tự động
- [ ] Test redirect về login khi unauthorized

## Tài liệu tham khảo

1. **API Specification**: OpenAPI 3.1.0 schema (đã cung cấp)
2. **API Usage Guide**: `docs/API_USAGE.md`
3. **Code Examples**: `docs/AUTHENTICATION_EXAMPLES.md`
4. **Original Auth Docs**: `docs/AUTHENTICATION.md`

## Hỗ trợ

Nếu gặp vấn đề:
1. Đọc `docs/API_USAGE.md` để hiểu cách hoạt động
2. Xem `docs/AUTHENTICATION_EXAMPLES.md` để có code mẫu
3. Check browser console và network tab
4. Verify backend API response format

## Tóm tắt

✨ **Đã hoàn thành:**
- ✅ Tích hợp hoàn chỉnh authentication theo API spec v1.0.0
- ✅ Tự động lưu và sử dụng access_token
- ✅ Tự động refresh token khi hết hạn
- ✅ Dễ dàng sử dụng cho developers
- ✅ Type-safe với TypeScript
- ✅ Documentation đầy đủ

🚀 **Sẵn sàng sử dụng!**

