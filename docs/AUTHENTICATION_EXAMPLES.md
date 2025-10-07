# Ví dụ sử dụng Authentication

## 1. Trang đăng nhập (Login Page)

```typescript
// src/pages/auth/login.tsx
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Form, Input, Button, message } from 'antd';

export default function LoginPage() {
  const { login, isLoading } = useAuth();
  const [form] = Form.useForm();

  const handleSubmit = async (values: any) => {
    try {
      await login({
        email: values.email,
        password: values.password,
      });
      // Sau khi đăng nhập thành công:
      // - access_token và refresh_token được lưu vào localStorage
      // - Tự động chuyển hướng đến trang chủ
      // - Có thể sử dụng token cho các API khác
    } catch (error) {
      // Lỗi đã được xử lý trong AuthContext
      console.error('Login error:', error);
    }
  };

  return (
    <div>
      <h1>Đăng nhập</h1>
      <Form form={form} onFinish={handleSubmit}>
        <Form.Item
          name="email"
          rules={[{ required: true, type: 'email', message: 'Email không hợp lệ' }]}
        >
          <Input placeholder="Email" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
        >
          <Input.Password placeholder="Mật khẩu" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={isLoading}>
            Đăng nhập
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
```

## 2. Trang đăng ký (Register Page)

```typescript
// src/pages/auth/register.tsx
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Form, Input, Button, Select } from 'antd';

export default function RegisterPage() {
  const { register, isLoading } = useAuth();
  const [form] = Form.useForm();

  const handleSubmit = async (values: any) => {
    try {
      await register({
        email: values.email,
        password: values.password,
        first_name: values.firstName,
        last_name: values.lastName,
        role: values.role || 'seller',
      });
      // Sau khi đăng ký thành công:
      // - Tự động đăng nhập
      // - access_token và refresh_token được lưu vào localStorage
      // - Chuyển hướng đến trang chủ
    } catch (error) {
      console.error('Register error:', error);
    }
  };

  return (
    <div>
      <h1>Đăng ký</h1>
      <Form form={form} onFinish={handleSubmit}>
        <Form.Item
          name="email"
          rules={[{ required: true, type: 'email', message: 'Email không hợp lệ' }]}
        >
          <Input placeholder="Email" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[
            { required: true, message: 'Vui lòng nhập mật khẩu' },
            { min: 8, message: 'Mật khẩu phải có ít nhất 8 ký tự' },
          ]}
        >
          <Input.Password placeholder="Mật khẩu" />
        </Form.Item>
        <Form.Item name="firstName">
          <Input placeholder="Tên" />
        </Form.Item>
        <Form.Item name="lastName">
          <Input placeholder="Họ" />
        </Form.Item>
        <Form.Item name="role">
          <Select placeholder="Vai trò">
            <Select.Option value="seller">Seller</Select.Option>
            <Select.Option value="analyst">Analyst</Select.Option>
            <Select.Option value="viewer">Viewer</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={isLoading}>
            Đăng ký
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
```

## 3. Gọi API với access_token

### Ví dụ 1: Lấy danh sách sản phẩm

```typescript
// src/services/productService.ts
import { apiClient } from '@/lib/api/apiClient';

export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
}

export const productService = {
  // GET request - Lấy danh sách sản phẩm
  async getProducts(): Promise<Product[]> {
    // apiClient tự động thêm access_token vào header
    return await apiClient.get('/api/v1/products');
  },

  // GET request - Lấy chi tiết sản phẩm
  async getProduct(id: number): Promise<Product> {
    return await apiClient.get(`/api/v1/products/${id}`);
  },

  // POST request - Tạo sản phẩm mới
  async createProduct(data: Omit<Product, 'id'>): Promise<Product> {
    return await apiClient.post('/api/v1/products', data);
  },

  // PUT request - Cập nhật sản phẩm
  async updateProduct(id: number, data: Partial<Product>): Promise<Product> {
    return await apiClient.put(`/api/v1/products/${id}`, data);
  },

  // DELETE request - Xóa sản phẩm
  async deleteProduct(id: number): Promise<void> {
    return await apiClient.delete(`/api/v1/products/${id}`);
  },
};
```

### Ví dụ 2: Component hiển thị danh sách sản phẩm

```typescript
// src/components/ProductList.tsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { productService, Product } from '@/services/productService';
import { Table, Button, message } from 'antd';

export default function ProductList() {
  const { isAuthenticated, user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      loadProducts();
    }
  }, [isAuthenticated]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      // access_token tự động được thêm vào header
      const data = await productService.getProducts();
      setProducts(data);
    } catch (error: any) {
      message.error('Không thể tải danh sách sản phẩm');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await productService.deleteProduct(id);
      message.success('Đã xóa sản phẩm');
      loadProducts(); // Reload danh sách
    } catch (error: any) {
      message.error('Không thể xóa sản phẩm');
    }
  };

  if (!isAuthenticated) {
    return <div>Vui lòng đăng nhập để xem sản phẩm</div>;
  }

  return (
    <div>
      <h1>Danh sách sản phẩm</h1>
      <p>Xin chào, {user?.full_name}</p>
      <Table
        dataSource={products}
        loading={loading}
        rowKey="id"
        columns={[
          { title: 'ID', dataIndex: 'id' },
          { title: 'Tên', dataIndex: 'name' },
          { title: 'Giá', dataIndex: 'price' },
          {
            title: 'Hành động',
            render: (_, record) => (
              <Button danger onClick={() => handleDelete(record.id)}>
                Xóa
              </Button>
            ),
          },
        ]}
      />
    </div>
  );
}
```

## 4. Gọi API trong React Hook

```typescript
// src/hooks/useProducts.tsx
import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api/apiClient';
import { message } from 'antd';

interface Product {
  id: number;
  name: string;
  price: number;
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      // access_token tự động được thêm vào header
      const data = await apiClient.get<Product[]>('/api/v1/products');
      setProducts(data);
    } catch (err: any) {
      const errorMsg = err.response?.data?.detail || 'Không thể tải sản phẩm';
      setError(errorMsg);
      message.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const createProduct = async (product: Omit<Product, 'id'>) => {
    try {
      setLoading(true);
      const newProduct = await apiClient.post<Product>('/api/v1/products', product);
      setProducts([...products, newProduct]);
      message.success('Tạo sản phẩm thành công');
      return newProduct;
    } catch (err: any) {
      message.error('Không thể tạo sản phẩm');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    loading,
    error,
    fetchProducts,
    createProduct,
  };
}

// Sử dụng hook
function MyComponent() {
  const { products, loading, createProduct } = useProducts();

  const handleCreate = async () => {
    await createProduct({
      name: 'Sản phẩm mới',
      price: 100000,
    });
  };

  if (loading) return <div>Đang tải...</div>;

  return (
    <div>
      <button onClick={handleCreate}>Tạo sản phẩm</button>
      {products.map(p => <div key={p.id}>{p.name}</div>)}
    </div>
  );
}
```

## 5. Protected Route (Route yêu cầu đăng nhập)

```typescript
// src/components/ProtectedRoute.tsx
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { Spin } from 'antd';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string[];
}

export default function ProtectedRoute({ 
  children, 
  requiredRole 
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, isLoading, router]);

  // Kiểm tra role nếu cần
  useEffect(() => {
    if (!isLoading && isAuthenticated && requiredRole && user) {
      if (!requiredRole.includes(user.role)) {
        router.push('/403'); // Không có quyền
      }
    }
  }, [isAuthenticated, isLoading, user, requiredRole, router]);

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (requiredRole && user && !requiredRole.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
}

// Sử dụng
import ProtectedRoute from '@/components/ProtectedRoute';

function DashboardPage() {
  return (
    <ProtectedRoute requiredRole={['admin', 'analyst']}>
      <div>Dashboard chỉ dành cho Admin và Analyst</div>
    </ProtectedRoute>
  );
}
```

## 6. Lấy access_token để sử dụng với GraphQL hoặc WebSocket

```typescript
// src/lib/graphql/client.ts
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { authClient } from '@/lib/api/authClient';

const httpLink = createHttpLink({
  uri: 'http://localhost:8000/graphql',
});

// Thêm access_token vào header của GraphQL requests
const authLink = setContext((_, { headers }) => {
  const token = authClient.getAccessToken();
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

export const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});
```

```typescript
// src/lib/websocket/client.ts
import { authClient } from '@/lib/api/authClient';

export function createWebSocketConnection() {
  const token = authClient.getAccessToken();
  
  const ws = new WebSocket(
    `ws://localhost:8000/ws?token=${token}`
  );
  
  ws.onopen = () => {
    console.log('WebSocket connected');
  };
  
  ws.onerror = (error) => {
    console.error('WebSocket error:', error);
  };
  
  return ws;
}
```

## 7. Middleware kiểm tra authentication

```typescript
// src/middleware.ts (Next.js middleware)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('accessToken');
  const { pathname } = request.nextUrl;

  // Các route công khai
  const publicPaths = ['/auth/login', '/auth/register', '/'];

  // Nếu đang ở route cần authentication mà không có token
  if (!publicPaths.includes(pathname) && !token) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
```

## 8. Refresh token thủ công

```typescript
import { authClient } from '@/lib/api/authClient';

async function manualRefreshToken() {
  try {
    const refreshToken = authClient.getRefreshToken();
    
    if (!refreshToken) {
      throw new Error('Không có refresh token');
    }
    
    // Gọi API refresh
    const response = await authClient.refreshToken(refreshToken);
    
    // Lưu tokens mới
    authClient.setTokens(response.access_token, response.refresh_token);
    
    console.log('Token đã được làm mới');
  } catch (error) {
    console.error('Không thể làm mới token:', error);
    // Chuyển đến trang đăng nhập
    window.location.href = '/auth/login';
  }
}
```

## 9. Kiểm tra token còn hạn không

```typescript
import { authClient } from '@/lib/api/authClient';

function checkTokenExpiry() {
  const token = authClient.getAccessToken();
  
  if (!token) {
    return false;
  }
  
  try {
    // Decode JWT token (cần cài jwt-decode: npm install jwt-decode)
    const decoded = jwt_decode<{ exp: number }>(token);
    const currentTime = Date.now() / 1000;
    
    // Kiểm tra token có hết hạn không
    return decoded.exp > currentTime;
  } catch (error) {
    return false;
  }
}
```

## Tổng kết

Hệ thống authentication đã được tích hợp hoàn chỉnh với các tính năng:

✅ Tự động lưu `access_token` và `refresh_token` khi đăng nhập/đăng ký  
✅ Tự động thêm token vào header của mọi API request  
✅ Tự động refresh token khi hết hạn  
✅ Redirect về login khi token không hợp lệ  
✅ Support cho REST API, GraphQL, WebSocket  
✅ Type-safe với TypeScript  
✅ Dễ dàng sử dụng với hooks và components  

Bạn chỉ cần:
1. Đăng nhập/đăng ký qua `useAuth()`
2. Sử dụng `apiClient` cho các API calls
3. Token sẽ được tự động xử lý!

