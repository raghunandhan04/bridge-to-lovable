# Testing Guide for Hibiz.ai

This project uses **Vitest** with React Testing Library for comprehensive testing coverage.

## Quick Start

```bash
# Run tests in watch mode
npm run test

# Run tests once with coverage
npm run test:coverage

# Run tests with UI
npm run test:ui

# Run integration tests
npm run test:integration
```

## Testing Stack

- **Vitest**: Fast test runner with native TypeScript support
- **@testing-library/react**: Component testing utilities
- **@testing-library/user-event**: User interaction simulation
- **MSW (Mock Service Worker)**: API/Network request mocking
- **@faker-js/faker**: Mock data generation
- **jsdom**: Browser environment simulation

## Test Structure

```
src/
├── test/
│   ├── setupTests.ts          # Global test setup
│   ├── testServer.ts          # MSW server configuration
│   └── mocks/
│       └── blogData.ts        # Mock data generators
├── components/
│   └── __tests__/             # Component tests
├── pages/
│   └── __tests__/             # Integration tests
└── utils/
    └── __tests__/             # Unit tests
```

## Test Types

### 1. Unit Tests
Test individual functions and utilities:

```typescript
// src/utils/__tests__/dateUtils.test.ts
import { formatDate } from '../dateUtils';

it('should format date correctly', () => {
  expect(formatDate('2024-01-15')).toBe('Jan 15, 2024');
});
```

### 2. Component Tests
Test React components in isolation:

```typescript
// src/components/ui/__tests__/button.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '../button';

it('should handle click events', async () => {
  const user = userEvent.setup();
  const handleClick = vi.fn();
  
  render(<Button onClick={handleClick}>Click me</Button>);
  await user.click(screen.getByRole('button'));
  
  expect(handleClick).toHaveBeenCalled();
});
```

### 3. Integration Tests
Test complete page functionality with mocked APIs:

```typescript
// src/pages/__tests__/Blog.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import Blog from '../Blog';

it('should display featured articles', async () => {
  render(<TestWrapper><Blog /></TestWrapper>);
  
  await waitFor(() => {
    expect(screen.getByText(/Featured Articles/i)).toBeInTheDocument();
  });
});
```

## Mock Data

The test suite uses MSW to intercept Supabase API calls:

```typescript
// src/test/testServer.ts
export const testServer = setupServer(
  http.get('*/rest/v1/blogs', () => {
    return HttpResponse.json(mockBlogs);
  })
);
```

Mock data is generated using Faker.js for consistency:

```typescript
// src/test/mocks/blogData.ts
export const mockBlogs = Array.from({ length: 15 }, () => ({
  id: faker.string.uuid(),
  title: faker.lorem.sentence(),
  category: faker.helpers.arrayElement(['ai-technology', 'business-insights']),
  // ...
}));
```

## Coverage Reports

Generate coverage reports:

```bash
npm run test:coverage
```

Coverage files are generated in `coverage/` directory:
- `coverage/index.html` - Visual coverage report
- `coverage/lcov.info` - Machine-readable coverage data

## CI/CD Integration

Tests run automatically on GitHub Actions:

```yaml
# .github/workflows/test.yml
- name: Run unit tests
  run: npm run test:coverage

- name: Upload coverage
  uses: codecov/codecov-action@v4
```

## Writing New Tests

### 1. Unit Test Template

```typescript
import { describe, it, expect } from 'vitest';

describe('YourFunction', () => {
  it('should do what it says', () => {
    // Arrange
    const input = 'test';
    
    // Act
    const result = yourFunction(input);
    
    // Assert
    expect(result).toBe('expected');
  });
});
```

### 2. Component Test Template

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import YourComponent from '../YourComponent';

describe('YourComponent', () => {
  it('should render correctly', () => {
    render(<YourComponent />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});
```

### 3. Integration Test Template

```typescript
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import YourPage from '../YourPage';

const TestWrapper = ({ children }) => (
  <QueryClientProvider client={new QueryClient()}>
    {children}
  </QueryClientProvider>
);

describe('YourPage Integration', () => {
  it('should load data from API', async () => {
    render(<TestWrapper><YourPage /></TestWrapper>);
    
    await waitFor(() => {
      expect(screen.getByText(/expected content/i)).toBeInTheDocument();
    });
  });
});
```

## Best Practices

1. **Test Behavior, Not Implementation**: Focus on what the user sees and does
2. **Use Semantic Queries**: Prefer `getByRole`, `getByLabelText` over `getByTestId`
3. **Mock External Dependencies**: Use MSW for API calls, mock third-party libraries
4. **Keep Tests Fast**: Unit tests should run in milliseconds
5. **Write Descriptive Test Names**: `should display error when API fails` vs `test error`
6. **Use AAA Pattern**: Arrange, Act, Assert for clear test structure

## Debugging Tests

```bash
# Run tests in debug mode
npm run test -- --inspect-brk

# Run specific test file
npm run test -- Button.test.tsx

# Run tests matching pattern
npm run test -- --grep "should render"
```

## Common Patterns

### Testing Async Components
```typescript
await waitFor(() => {
  expect(screen.getByText('Loaded')).toBeInTheDocument();
});
```

### Testing User Interactions
```typescript
const user = userEvent.setup();
await user.click(screen.getByRole('button'));
await user.type(screen.getByRole('textbox'), 'Hello');
```

### Testing Error States
```typescript
// Mock console.error to avoid noise
const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
// ... test error scenario
consoleSpy.mockRestore();
```

## Performance Tips

1. Use `vi.mock()` for heavy modules
2. Reuse test wrappers with providers
3. Use `beforeEach` for common setup
4. Consider `describe.skip()` for temporarily disabled tests
5. Use `it.only()` for focused testing during development

This testing setup provides comprehensive coverage for Hibiz.ai with minimal maintenance overhead.