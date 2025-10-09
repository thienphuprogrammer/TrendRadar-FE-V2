# Error Handling & Graceful Degradation Guide

This document explains how the application handles errors gracefully to ensure the UI never crashes when API calls fail.

## Overview

The application implements multiple layers of error handling to ensure:
1. **No UI crashes** - Even when APIs fail completely
2. **Default fallback data** - Users always see something useful
3. **Graceful degradation** - Features degrade gracefully
4. **User-friendly messages** - Clear error communication
5. **Safe image loading** - Images never break the layout

---

## 1. Components

### 1.1 SafeImage Component

**Location**: `/app/src/components/SafeImage.tsx`

Handles image loading errors gracefully with automatic fallbacks.

**Features**:
- Automatic fallback to placeholder images
- Custom fallback components
- Loading states
- Error callbacks
- Never breaks layout

**Usage**:
```tsx
import SafeImage from '@/components/SafeImage';

// Basic usage
<SafeImage
  src="/api/user/avatar.jpg"
  alt="User avatar"
/>

// With fallback
<SafeImage
  src="/api/user/avatar.jpg"
  alt="User avatar"
  fallbackSrc="/images/default-avatar.png"
/>

// With custom fallback component
<SafeImage
  src="/api/photo.jpg"
  alt="Photo"
  fallbackComponent={<div>Image not available</div>}
  onErrorCallback={(error) => console.log('Image failed:', error)}
/>
```

---

### 1.2 QueryErrorBoundary Component

**Location**: `/app/src/components/QueryErrorBoundary.tsx`

Wraps GraphQL queries to handle errors and empty states.

**Features**:
- Error state handling
- Empty state handling
- Retry functionality
- Custom fallbacks
- User-friendly error messages

**Usage**:
```tsx
import QueryErrorBoundary from '@/components/QueryErrorBoundary';

const { data, loading, error, refetch } = useQuery(GET_ITEMS_QUERY);

return (
  <QueryErrorBoundary
    error={error}
    loading={loading}
    hasData={data?.items?.length > 0}
    retry={refetch}
    emptyMessage="No items found"
    errorMessage="Failed to load items"
  >
    <ItemsList items={data.items} />
  </QueryErrorBoundary>
);
```

---

### 1.3 ErrorBoundary Component

**Location**: `/app/src/components/ErrorBoundary.tsx`

React Error Boundary that catches JavaScript errors anywhere in the component tree.

**Features**:
- Catches all React errors
- Prevents app crashes
- Shows user-friendly error page
- Reload and navigate options
- Development mode error details

**Usage**:
Already implemented in `_app.tsx` - wraps entire application.

```tsx
<ErrorBoundary>
  <YourApp />
</ErrorBoundary>
```

---

### 1.4 SilentErrorBoundary

**Location**: `/app/src/components/QueryErrorBoundary.tsx`

Catches errors silently and continues rendering with fallback data.

**Usage**:
```tsx
import { SilentErrorBoundary } from '@/components/QueryErrorBoundary';

<SilentErrorBoundary
  error={error}
  fallbackContent={<DefaultContent />}
>
  <DynamicContent />
</SilentErrorBoundary>
```

---

## 2. Utilities

### 2.1 API Error Handler

**Location**: `/app/src/utils/apiErrorHandler.ts`

Comprehensive utilities for safe API calls.

**Functions**:

#### safeApiCall()
Safely execute any async API call with error handling.

```tsx
import { safeApiCall } from '@/utils/apiErrorHandler';

const { data, error, success } = await safeApiCall(
  () => fetchUserData(userId),
  {
    showErrorToUser: true,
    errorMessage: 'Failed to load user data',
    defaultValue: { name: 'Guest', email: '' },
    silentError: false,
  }
);

if (success) {
  console.log('Data loaded:', data);
} else {
  console.log('Using default data:', data);
}
```

#### retryApiCall()
Automatically retry failed API calls with exponential backoff.

```tsx
import { retryApiCall } from '@/utils/apiErrorHandler';

const { data, success } = await retryApiCall(
  () => fetchData(),
  3,  // max retries
  1000,  // initial delay (ms)
  { showErrorToUser: true }
);
```

#### safeBatchApiCalls()
Execute multiple API calls safely in parallel.

```tsx
import { safeBatchApiCalls } from '@/utils/apiErrorHandler';

const results = await safeBatchApiCalls([
  () => fetchUsers(),
  () => fetchPosts(),
  () => fetchComments(),
], { defaultValue: [] });

// All results are guaranteed to be non-null
results.forEach(({ data, success }) => {
  if (success) {
    console.log('Data:', data);
  } else {
    console.log('Using default data');
  }
});
```

---

### 2.2 Image Helper

**Location**: `/app/src/utils/imageHelper.ts`

Utilities for safe image handling.

**Functions**:

```tsx
import {
  getSafeImageUrl,
  preloadImage,
  checkImageExists,
  getImageWithFallback,
  generatePlaceholder,
} from '@/utils/imageHelper';

// Get safe URL with fallback
const imageUrl = getSafeImageUrl(user.avatar);

// Check if image exists before using
const exists = await checkImageExists('/api/image.jpg');

// Get image with automatic fallback chain
const finalUrl = await getImageWithFallback(
  '/api/image.jpg',
  ['/images/fallback.jpg', '/images/placeholder.png']
);

// Generate placeholder
const placeholder = generatePlaceholder(400, 300, 'Profile Photo');
```

---

### 2.3 Error Handling Utilities

**Location**: `/app/src/utils/errorHandling.ts`

Core error handling utilities with default data.

**Features**:
- Default data for all major queries
- GraphQL error handler
- Safe JSON parsing
- Retry with backoff
- Safe object access

**Default Data**:
```tsx
import { DEFAULT_DATA } from '@/utils/errorHandling';

// Available default data:
DEFAULT_DATA.threads
DEFAULT_DATA.suggestedQuestions
DEFAULT_DATA.models
DEFAULT_DATA.relationships
DEFAULT_DATA.settings
DEFAULT_DATA.instructions
DEFAULT_DATA.questionSqlPairs
DEFAULT_DATA.apiHistory
```

**Functions**:
```tsx
import {
  handleGraphQLError,
  withFallback,
  safelyParseJSON,
  retryWithBackoff,
  safeGet,
} from '@/utils/errorHandling';

// Handle GraphQL errors
const errorInfo = handleGraphQLError(error);
console.log(errorInfo.message, errorInfo.canRetry);

// Wrap promises with fallback
const data = await withFallback(
  fetchData(),
  DEFAULT_DATA.threads
);

// Safe JSON parsing
const config = safelyParseJSON(jsonString, { theme: 'light' });

// Safe nested property access
const userName = safeGet(user, 'profile.name', 'Anonymous');
```

---

## 3. Best Practices

### 3.1 Query Error Handling Pattern

**Always use this pattern for GraphQL queries**:

```tsx
import { DEFAULT_DATA, handleGraphQLError } from '@/utils/errorHandling';

const { data, error } = useQuery(GET_ITEMS_QUERY, {
  fetchPolicy: 'cache-and-network',
  onError: (error) => {
    const errorInfo = handleGraphQLError(error);
    console.error('Query error:', errorInfo.message);
    // Don't show error to user - use default data
  },
});

// Always provide fallback
const items = useMemo(
  () => {
    try {
      return data?.items || DEFAULT_DATA.items;
    } catch (error) {
      console.error('Error accessing data:', error);
      return DEFAULT_DATA.items;
    }
  },
  [data]
);
```

---

### 3.2 Mutation Error Handling Pattern

```tsx
const [updateUser] = useMutation(UPDATE_USER_MUTATION, {
  onError: (error) => {
    const errorInfo = handleGraphQLError(error);
    console.error('Update error:', errorInfo.message);
    message.error(errorInfo.message);
  },
  onCompleted: (data) => {
    message.success('Updated successfully');
  },
});

// Safe mutation execution
const handleUpdate = async (userId: string, updates: any) => {
  try {
    const response = await updateUser({
      variables: { id: userId, data: updates }
    });
    
    if (!response || !response.data) {
      throw new Error('Invalid response');
    }
    
    return response.data;
  } catch (error) {
    console.error('Mutation failed:', error);
    return null;
  }
};
```

---

### 3.3 Image Loading Pattern

**Always use SafeImage for dynamic images**:

```tsx
import SafeImage from '@/components/SafeImage';

// ❌ DON'T DO THIS (can crash)
<img src={user.avatar} alt="Avatar" />

// ✅ DO THIS (safe)
<SafeImage 
  src={user.avatar}
  alt="Avatar"
  fallbackSrc="/images/default-avatar.png"
/>
```

---

### 3.4 Async Operation Pattern

**Always wrap async operations**:

```tsx
import { safeApiCall } from '@/utils/apiErrorHandler';

// ❌ DON'T DO THIS (can crash)
const data = await fetchData();
setData(data);

// ✅ DO THIS (safe)
const { data, success } = await safeApiCall(
  () => fetchData(),
  {
    defaultValue: [],
    showErrorToUser: true,
    errorMessage: 'Failed to load data',
  }
);

setData(data); // Always non-null
```

---

## 4. Testing Error Handling

### 4.1 Simulate Network Errors

```tsx
// In development, you can test error handling:

// Mock API error
const { data } = await safeApiCall(
  () => Promise.reject(new Error('Network error')),
  { defaultValue: [], showErrorToUser: true }
);
```

### 4.2 Test Image Loading Errors

```tsx
// Test with invalid image URL
<SafeImage
  src="https://invalid-url.com/image.jpg"
  alt="Test"
  fallbackSrc="/images/placeholder.png"
/>
```

---

## 5. Common Scenarios

### 5.1 Loading User Profile

```tsx
function UserProfile({ userId }: { userId: string }) {
  const { data, loading, error, refetch } = useQuery(GET_USER_QUERY, {
    variables: { id: userId },
    onError: (error) => {
      const errorInfo = handleGraphQLError(error);
      console.error('Failed to load user:', errorInfo.message);
    },
  });

  const user = data?.user || {
    name: 'User',
    email: '',
    avatar: '/images/default-avatar.png',
  };

  return (
    <QueryErrorBoundary
      error={error}
      loading={loading}
      hasData={!!user}
      retry={refetch}
    >
      <div>
        <SafeImage
          src={user.avatar}
          alt={user.name}
          fallbackSrc="/images/default-avatar.png"
        />
        <h2>{user.name}</h2>
        <p>{user.email}</p>
      </div>
    </QueryErrorBoundary>
  );
}
```

### 5.2 Handling File Uploads

```tsx
import { safeApiCall } from '@/utils/apiErrorHandler';
import { imageToBase64, createSafeBlobUrl } from '@/utils/imageHelper';

async function handleFileUpload(file: File) {
  // Safe file validation
  if (!file.type.startsWith('image/')) {
    message.error('Please upload an image file');
    return;
  }

  // Safe preview generation
  const previewUrl = createSafeBlobUrl(file);
  if (previewUrl) {
    setPreview(previewUrl);
  }

  // Safe upload
  const { data, success } = await safeApiCall(
    () => uploadFile(file),
    {
      showErrorToUser: true,
      errorMessage: 'Failed to upload file',
    }
  );

  if (success) {
    message.success('File uploaded successfully');
  }
}
```

---

## 6. Debugging

### Enable Detailed Error Logging

```tsx
// In development
if (process.env.NODE_ENV === 'development') {
  // All errors are logged to console
  // Check browser console for detailed error info
}
```

### Check Error Boundaries

1. Open React DevTools
2. Look for ErrorBoundary in component tree
3. Check if errors are being caught

---

## 7. Summary

✅ **The app is now safe from API failures**:
- All queries have default fallback data
- Images use SafeImage with fallbacks
- Errors are handled gracefully at multiple levels
- Users always see something useful
- No crashes, no blank screens

✅ **Key Components**:
- `SafeImage` - Safe image loading
- `QueryErrorBoundary` - Query error handling
- `ErrorBoundary` - React error catching
- `safeApiCall` - Safe API calls
- Default data for all queries

✅ **Remember**:
- Always use SafeImage for dynamic images
- Always provide default/fallback data
- Wrap queries with error handling
- Test error scenarios during development
