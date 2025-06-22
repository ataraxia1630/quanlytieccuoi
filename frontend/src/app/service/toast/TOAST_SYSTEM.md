# Toast System Documentation

## Overview

The toast system has been refactored to prevent toast spam by integrating the `showToast` component with the main `toastService`. This ensures that duplicate or redundant notifications are automatically handled.

## How It Works

### 1. Smart Toast Component (`SmartToast`)
- **Location**: `src/app/components/SmartToast.js`
- **Purpose**: Prevents duplicate toasts by maintaining a cache of active toasts
- **Mechanism**: 
  - Each toast has a unique ID
  - Before showing a new toast, it dismisses any existing toast with the same ID
  - Caches the toast ID to track active toasts
- **Features**:
  - Configurable toast options (autoClose, position, etc.)
  - Cache management utilities
  - Type-specific default settings

### 2. Enhanced Toast Service
- **Location**: `src/app/service/toast/toast.service.js`
- **Integration**: Now uses `SmartToast` for all toast operations
- **Benefits**:
  - Automatic toast spam prevention
  - Consistent toast behavior across the application
  - Unique IDs for different types of operations

## Toast ID Strategy

### Automatic ID Generation
- **CRUD Operations**: `crud-{operation}-{type}` (e.g., `crud-create-success`, `crud-update-error`)
- **Search Operations**: `search-{type}-{entityType}` (e.g., `search-success-monan`, `search-no-results-dichvu`)
- **Validation**: `validation-{type}` (e.g., `validation-required-fields`, `validation-invalid-data`)
- **Page-specific**: `{page}-{action}` (e.g., `hoadon-service-added`, `user-login-success`)

### Filter Operations
- **Applied Filter**: `filter-applied-{filterType}` 
- **Reset Filter**: `filter-reset-{filterType}`

## Usage Examples

### Basic Operations
```javascript
// These will replace each other (same ID)
toastService.crud.success.create('Món ăn');
toastService.crud.success.create('Món ăn'); // Replaces previous

// These will all be visible (different IDs)
toastService.crud.success.create('Món ăn');    // ID: crud-create-success
toastService.crud.success.update('Dịch vụ');   // ID: crud-update-success
toastService.crud.success.delete('Sảnh');      // ID: crud-delete-success
```

### Search Operations
```javascript
// These will replace each other within same entity type
toastService.search.success(5, 'món ăn');      // ID: search-success-món ăn
toastService.search.success(3, 'món ăn');      // Replaces previous
toastService.search.noResults('món ăn');       // ID: search-no-results-món ăn

// Different entity types won't interfere with each other
toastService.search.success(2, 'dịch vụ');     // ID: search-success-dịch vụ
```

### Filter Operations
```javascript
// Filter toasts for same entity will replace each other
toastService.search.appliedFilter('món ăn');   // ID: filter-applied-món ăn
toastService.search.appliedFilter('món ăn');   // Replaces previous

toastService.search.resetFilter('món ăn');     // ID: filter-reset-món ăn
```

### Page-specific Operations
```javascript
// Each page has unique IDs
toastService.hoaDon.serviceAdded();             // ID: hoadon-service-added
toastService.hoaDon.dishAdded();                // ID: hoadon-dish-added
toastService.user.loginSuccess();               // ID: user-login-success
```

## Key Features

### 1. No More Toast Spam
- Duplicate toasts are automatically prevented
- Users won't see multiple identical notifications
- Cleaner, less cluttered UI

### 2. Smart Categorization
- Different types of operations have different IDs
- Related operations can replace each other when appropriate
- Unrelated operations can coexist

### 3. Consistent Behavior
- All pages using `toastService` benefit from anti-spam logic
- Centralized toast management
- Easy to maintain and extend

### 4. Debug Support
```javascript
// Check current toast cache status
console.log(toastService.getCacheStatus());

// Clear all cached toasts
toastService.clearCache();
```

## Migration Notes

### For Existing Pages
- Replace direct `toast` calls with `toastService` methods
- No need to worry about toast spam - it's handled automatically
- Keep existing logic, just change the toast calls

### Search Logic Pattern
```javascript
// Recommended pattern for search
const handleSearch = (keyword) => {
  if (!keyword.trim()) {
    // Reset to full list - no toast needed
    setFilteredData(originalData);
    return;
  }
  
  const results = performSearch(keyword);
  if (results.length > 0) {
    toastService.search.success(results.length, 'món ăn');
  } else {
    toastService.search.noResults('món ăn');
  }
  setFilteredData(results);
};
```

### Filter Logic Pattern
```javascript
// Recommended pattern for filters
const applyFilter = (filterCriteria) => {
  const filteredData = performFilter(filterCriteria);
  toastService.search.appliedFilter('món ăn');
  setFilteredData(filteredData);
};

const resetFilter = () => {
  toastService.search.resetFilter('món ăn');
  setFilteredData(originalData);
};
```

## Testing

Use the test functions in `src/app/test/toastTest.js` to verify:
- Toast spam prevention works correctly
- Different toast types are properly displayed
- Page-specific toasts work as expected

## Benefits

1. **Better UX**: No more annoying toast spam
2. **Cleaner Code**: Centralized toast management
3. **Consistency**: Same behavior across all pages
4. **Maintainability**: Easy to add new toast types
5. **Debugging**: Built-in cache inspection tools
