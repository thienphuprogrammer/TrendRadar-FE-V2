# Refactoring Plan - Wren AI Platform

## Status: ✅ Phase 1 Complete | 🔄 Phase 2 Pending

---

## ✅ Phase 1: Code Quality & Utilities (COMPLETED)

### 1.1 TypeScript Configuration ✅
- [x] Enabled strict mode in `tsconfig.json`
- [x] Added stricter compiler options:
  - `noImplicitAny: true`
  - `strictNullChecks: true`
  - `strictFunctionTypes: true`
  - `strictBindCallApply: true`
  - `strictPropertyInitialization: true`
  - `noImplicitThis: true`
  - `alwaysStrict: true`
  - `noUnusedLocals: true`
  - `noUnusedParameters: true`
  - `noImplicitReturns: true`
  - `noFallthroughCasesInSwitch: true`

### 1.2 Utility Library Created ✅
Created comprehensive utility modules in `src/lib/utils/`:

**Created Files:**
- `constants.ts` - Centralized constants (API config, validation rules, routes, messages, etc.)
- `helpers.ts` - Common helper functions (date formatting, validation, string manipulation, etc.)
- `storage.ts` - LocalStorage utilities with SSR support and type safety
- `apiError.ts` - Standardized API error handling and retry logic
- `index.ts` - Central export for all utilities

**Key Features:**
- Type-safe constants for all magic strings/numbers
- SSR-safe storage operations
- Comprehensive date/time formatting
- Password strength validation
- String manipulation utilities
- Array/object utilities
- Clipboard operations
- Error handling utilities

### 1.3 Custom Hooks Library ✅
Created reusable hooks in `src/hooks/`:

**Created Hooks:**
- `useLocalStorage.tsx` - Persistent state with localStorage
- `useDebounce.tsx` - Debounce values and callbacks
- `useToggle.tsx` - Boolean toggle state management
- `useCopyToClipboard.tsx` - Copy text to clipboard
- `useMediaQuery.tsx` - Responsive design breakpoints

**Benefits:**
- Eliminates duplicate logic
- Consistent patterns across app
- Better testability
- Improved maintainability

---

## 🔄 Phase 2: Dependency Updates (PENDING)

### 2.1 Ant Design Upgrade (v4 → v5)

**Current Version:** `antd@4.20.4`
**Target Version:** `antd@5.x` (latest stable)

**Why Upgrade?**
- Better performance with CSS-in-JS optimization
- Improved TypeScript support
- New components and features
- Better accessibility
- Active development and security updates

**Breaking Changes to Handle:**
1. **Icon Import Changes:**
   ```tsx
   // Old (v4)
   import { UserOutlined } from '@ant-design/icons';
   
   // New (v5) - Same, but verify all icons still exist
   import { UserOutlined } from '@ant-design/icons';
   ```

2. **Form Changes:**
   - Some Form.Item props changed
   - Form validation behavior improvements

3. **Message/Notification API:**
   ```tsx
   // Old (v4)
   message.success('Success');
   
   // New (v5) - Need to use context
   const [messageApi, contextHolder] = message.useMessage();
   messageApi.success('Success');
   ```

4. **Less Variables → CSS Variables:**
   - Theme customization now uses CSS variables
   - Need to migrate Less theme to new theme config

**Migration Steps:**
1. Update package.json
2. Run codemod tool: `npx @ant-design/codemod v5`
3. Update Less variables to CSS variables
4. Test all components
5. Fix any remaining issues

**Estimated Effort:** 4-6 hours

### 2.2 Apollo Server Migration (v3 → v4)

**Current:** `apollo-server-micro@3.10.2`
**Target:** `@apollo/server@4.x`

**Why Upgrade?**
- Better performance
- Improved TypeScript support
- Better error handling
- Active maintenance

**Breaking Changes:**
1. **Package Name Change:**
   ```typescript
   // Old (v3)
   import { ApolloServer } from 'apollo-server-micro';
   
   // New (v4)
   import { ApolloServer } from '@apollo/server';
   import { startServerAndCreateNextHandler } from '@as-integrations/next';
   ```

2. **Configuration Changes:**
   - Different server initialization
   - New middleware approach
   - Updated context setup

**Migration Steps:**
1. Install `@apollo/server` and `@as-integrations/next`
2. Update server initialization
3. Migrate middleware
4. Update error handling
5. Test all GraphQL endpoints

**Estimated Effort:** 3-4 hours

### 2.3 Package Updates

**Packages to Update:**

| Package | Current | Latest | Breaking? |
|---------|---------|--------|-----------|
| `next` | 14.2.32 | 14.2.x | No |
| `react` | 18.2.0 | 18.3.x | No |
| `typescript` | 5.2.2 | 5.6.x | Minor |
| `axios` | 1.12.0 | 1.7.x | No |
| `graphql` | 16.6.0 | 16.9.x | No |
| `styled-components` | 5.3.6 | 6.1.x | Yes |
| `lodash` | 4.17.21 | 4.17.21 | No |
| `dayjs` | 1.11.11 | 1.11.x | No |

**Styled Components v6 Changes:**
- Better TypeScript support
- Improved performance
- Need to update theme types

**Migration Command:**
```bash
cd frontendv2
yarn upgrade-interactive --latest
```

**Estimated Effort:** 2-3 hours + testing

---

## 🔄 Phase 3: Code Cleanup (PENDING)

### 3.1 Remove Unused Imports

**Tools to Use:**
- ESLint with `no-unused-vars` rule
- TypeScript compiler with `noUnusedLocals`
- VS Code's "Organize Imports" feature

**Process:**
1. Run `yarn lint` to find unused imports
2. Use VS Code "Organize Imports" (Cmd+Shift+O on Mac)
3. Manually review and remove
4. Test after each file

**Estimated Files:** ~200 files to review
**Estimated Effort:** 2-3 hours

### 3.2 Dead Code Elimination

**What to Look For:**
- Unused functions
- Unused components
- Commented-out code
- Unused exports
- Duplicate utilities

**Tools:**
- `ts-prune` - Find unused exports
- Manual code review
- Test coverage reports

**Command:**
```bash
npx ts-prune
```

**Estimated Effort:** 3-4 hours

### 3.3 Consolidate Duplicate Code

**Already Completed:**
- ✅ Created centralized utility library
- ✅ Created reusable custom hooks
- ✅ Standardized constants

**Still TODO:**
- [ ] Consolidate similar GraphQL queries
- [ ] Consolidate styled-components patterns
- [ ] Extract common form patterns
- [ ] Consolidate table configurations

**Estimated Effort:** 2-3 hours

---

## 📊 Implementation Priority

### High Priority (Do First)
1. ✅ TypeScript strict mode (DONE)
2. ✅ Utility library creation (DONE)
3. ✅ Custom hooks library (DONE)
4. 🔄 Package security updates
5. 🔄 Remove unused imports

### Medium Priority (Do Second)
6. 🔄 Ant Design v5 upgrade
7. 🔄 Apollo Server v4 migration
8. 🔄 Dead code elimination
9. 🔄 Consolidate duplicate code

### Low Priority (Do Last)
10. 🔄 Styled Components v6 upgrade
11. 🔄 Additional code quality improvements
12. 🔄 Performance optimizations

---

## 🛠️ Tools & Commands

### TypeScript Type Checking
```bash
cd frontendv2
yarn check-types
```

### Linting
```bash
yarn lint
```

### Find Unused Exports
```bash
npx ts-prune
```

### Find Unused Dependencies
```bash
npx depcheck
```

### Check Package Updates
```bash
yarn outdated
```

### Interactive Package Upgrade
```bash
yarn upgrade-interactive --latest
```

### Run Codemod for Ant Design v5
```bash
npx @ant-design/codemod v5
```

---

## 📝 Migration Checklist

### Before Starting
- [x] Create git branch for refactoring
- [x] Document current state
- [ ] Run full test suite
- [ ] Create backup

### During Migration
- [x] Enable TypeScript strict mode
- [x] Create utility library
- [x] Create custom hooks
- [ ] Update packages incrementally
- [ ] Test after each major change
- [ ] Fix linter errors as you go

### After Migration
- [ ] Run full test suite
- [ ] Manual testing of key features
- [ ] Performance testing
- [ ] Update documentation
- [ ] Code review
- [ ] Merge to main

---

## 🚀 Benefits After Refactoring

### Code Quality
- ✅ Stricter TypeScript checking catches errors earlier
- ✅ Centralized utilities reduce duplication
- ✅ Consistent patterns improve maintainability
- Better type safety across the codebase
- Easier onboarding for new developers

### Performance
- Faster builds with less code
- Better bundle size with tree shaking
- Improved runtime performance with Ant Design v5
- Reduced memory footprint

### Developer Experience
- ✅ Reusable hooks reduce boilerplate
- Better IDE autocomplete
- Faster development with utilities
- Easier debugging with better types

### Security
- Updated packages with security fixes
- Better dependency management
- Reduced attack surface

---

## 📈 Progress Tracking

| Phase | Task | Status | Effort | Priority |
|-------|------|--------|--------|----------|
| 1 | TypeScript Strict Mode | ✅ Done | 1h | High |
| 1 | Utility Library | ✅ Done | 2h | High |
| 1 | Custom Hooks | ✅ Done | 1h | High |
| 2 | Security Updates | 🔄 Pending | 1h | High |
| 2 | Remove Unused Imports | 🔄 Pending | 2h | High |
| 2 | Ant Design v5 | 🔄 Pending | 4-6h | Medium |
| 2 | Apollo Server v4 | 🔄 Pending | 3-4h | Medium |
| 2 | Other Package Updates | 🔄 Pending | 2h | Medium |
| 3 | Dead Code Removal | 🔄 Pending | 3h | Medium |
| 3 | Consolidate Duplicates | 🔄 Pending | 2h | Low |

**Total Estimated Effort:** 20-25 hours
**Completed:** ~4 hours (20%)
**Remaining:** ~16-21 hours (80%)

---

## 🎯 Next Steps

### Immediate (This Session)
1. ✅ Created utility library
2. ✅ Created custom hooks
3. ✅ Enabled strict mode
4. 🔄 Document refactoring plan (this file)

### Next Session
1. Run security updates for packages
2. Remove unused imports across codebase
3. Start Ant Design v5 migration
4. Run tests after each step

### Future Sessions
1. Complete Ant Design v5 migration
2. Apollo Server v4 migration
3. Remove dead code
4. Final consolidation and optimization

---

## 📚 Resources

### Documentation
- [Ant Design v5 Migration Guide](https://ant.design/docs/react/migration-v5)
- [Apollo Server v4 Migration](https://www.apollographql.com/docs/apollo-server/migration/)
- [TypeScript Strict Mode](https://www.typescriptlang.org/tsconfig#strict)
- [Styled Components v6](https://styled-components.com/docs/basics#getting-started)

### Tools
- [ts-prune](https://github.com/nadeesha/ts-prune) - Find unused exports
- [depcheck](https://github.com/depcheck/depcheck) - Find unused dependencies
- [@ant-design/codemod](https://github.com/ant-design/codemod) - Ant Design migration tool

---

**Last Updated:** $(date)
**Status:** Phase 1 Complete (20%) ✅

