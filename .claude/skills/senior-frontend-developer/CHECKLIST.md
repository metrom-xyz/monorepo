# Frontend Development Checklist

Use this checklist when implementing features, reviewing code, or preparing for deployment.

---

## Pre-Implementation Checklist

Before starting work:

- [ ] Read and understand the requirement thoroughly
- [ ] Check existing code for similar patterns
- [ ] Identify reusable components from `@metrom-xyz/ui`
- [ ] Plan component structure and data flow
- [ ] Identify potential edge cases
- [ ] Confirm design specifications (if UI work)

---

## Code Quality Checklist

### TypeScript

- [ ] All variables and functions have explicit types
- [ ] No `any` types used (use `unknown` if type is truly unknown)
- [ ] No type assertions (`as`) unless absolutely necessary
- [ ] Props interfaces are complete and well-documented
- [ ] Return types are explicitly defined
- [ ] Generics used appropriately for reusable components
- [ ] Enums or union types used for fixed sets of values
- [ ] Type imports use `import type` syntax

**Example:**
```typescript
// ✅ Good
import type { Campaign } from '@metrom-xyz/sdk';

interface Props {
  campaign: Campaign;
  onSelect: (id: string) => void;
}

export function Component({ campaign, onSelect }: Props): JSX.Element {
  // ...
}

// ❌ Bad
export function Component({ campaign, onSelect }: any) {
  // ...
}
```

### React Best Practices

- [ ] Server components by default (no `'use client'` unless necessary)
- [ ] Client components only when using hooks, event handlers, or browser APIs
- [ ] No unnecessary re-renders (check with React DevTools)
- [ ] `useCallback` used for event handlers passed to children
- [ ] `useMemo` used for expensive computations
- [ ] `React.memo` used for frequently re-rendering pure components
- [ ] Proper dependency arrays in `useEffect`, `useMemo`, `useCallback`
- [ ] No missing dependencies in hook arrays (fix ESLint warnings)
- [ ] Clean up side effects (event listeners, timers, subscriptions)

**Example:**
```typescript
// ✅ Good - Server component
export function CampaignList({ campaigns }: Props) {
  return <div>{campaigns.map(...)}</div>;
}

// ✅ Good - Client component when needed
'use client';
export function InteractiveCampaignList({ campaigns }: Props) {
  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = useCallback((id: string) => {
    setSelected(id);
  }, []);

  return <div>{campaigns.map(c => (
    <CampaignCard key={c.id} campaign={c} onSelect={handleSelect} />
  ))}</div>;
}
```

### Component Structure

- [ ] Single Responsibility Principle followed
- [ ] Component file is under 300 lines (split if larger)
- [ ] Props are destructured at function signature
- [ ] Default props use ES6 default parameters
- [ ] Complex logic extracted to custom hooks
- [ ] Reusable logic extracted to utility functions
- [ ] Component is properly exported (named export preferred)

### Styling

- [ ] Tailwind classes used (no inline styles)
- [ ] No arbitrary values (like `text-[14px]`) - use Tailwind scale
- [ ] Dark mode support with `dark:` prefix
- [ ] Responsive design with `sm:`, `md:`, `lg:`, `xl:` prefixes
- [ ] `cn()` utility used for conditional classes
- [ ] No hardcoded colors (use Tailwind theme colors)
- [ ] Consistent spacing using Tailwind scale (p-4, m-2, gap-4, etc.)

**Example:**
```typescript
import { cn } from '@/lib/utils';

<div
  className={cn(
    'rounded-lg border p-4',
    'bg-white dark:bg-gray-900',
    'hover:shadow-lg transition-shadow',
    isActive && 'border-primary',
    className
  )}
>
  {children}
</div>
```

---

## Accessibility Checklist

### Semantic HTML

- [ ] Proper HTML elements used (`<button>`, `<nav>`, `<main>`, `<article>`, etc.)
- [ ] Headings used in correct order (h1 → h2 → h3)
- [ ] Form labels associated with inputs
- [ ] Lists use `<ul>`, `<ol>`, or `<dl>` appropriately

### ARIA

- [ ] `aria-label` on icon-only buttons
- [ ] `aria-describedby` for additional context
- [ ] `aria-live` for dynamic content updates
- [ ] `aria-expanded` for collapsible sections
- [ ] `aria-selected` for tabs
- [ ] `aria-hidden="true"` for decorative elements
- [ ] `role` attribute only when semantic HTML isn't available

### Keyboard Navigation

- [ ] All interactive elements are keyboard accessible
- [ ] Tab order is logical
- [ ] Focus states are visible
- [ ] Enter/Space activates buttons
- [ ] Escape closes modals/dropdowns
- [ ] Arrow keys navigate lists/menus (if applicable)

### Visual Accessibility

- [ ] Color contrast meets WCAG AA (4.5:1 for text, 3:1 for large text)
- [ ] Information not conveyed by color alone
- [ ] Focus indicators have 3:1 contrast ratio
- [ ] Text is resizable (no fixed pixel font sizes)
- [ ] Touch targets are at least 44x44px

**Tools to check:**
```bash
# Run accessibility tests
npm run test:a11y

# Manual check with browser extensions:
# - axe DevTools
# - WAVE
# - Lighthouse (Accessibility audit)
```

---

## Performance Checklist

### Bundle Size

- [ ] No unnecessary dependencies added
- [ ] Large libraries dynamically imported
- [ ] Tree-shaking working (check bundle analyzer)
- [ ] Bundle size increase < 20KB per feature

**Check bundle size:**
```bash
npm run build
npm run analyze # if bundle analyzer is configured
```

### React Performance

- [ ] No unnecessary re-renders (verified with React DevTools Profiler)
- [ ] Heavy computations memoized with `useMemo`
- [ ] Event handlers memoized with `useCallback`
- [ ] Large lists virtualized with `react-window`
- [ ] Code-splitting at route level
- [ ] Lazy loading for below-the-fold content

### Image Optimization

- [ ] Next.js `<Image>` component used
- [ ] `width` and `height` specified
- [ ] `alt` text provided
- [ ] `loading="lazy"` for below-the-fold images
- [ ] Appropriate `sizes` prop for responsive images
- [ ] WebP format used (Next.js handles this automatically)

**Example:**
```typescript
import Image from 'next/image';

<Image
  src="/images/campaign-hero.jpg"
  alt="Campaign hero image"
  width={800}
  height={400}
  sizes="(max-width: 768px) 100vw, 800px"
  loading="lazy"
  className="rounded-lg"
/>
```

### Data Fetching

- [ ] Server Components used for initial data fetch when possible
- [ ] React Query used for client-side data fetching
- [ ] Proper `staleTime` and `cacheTime` configured
- [ ] Loading states shown during fetch
- [ ] Error states handled gracefully
- [ ] Optimistic updates implemented where appropriate
- [ ] Polling only when necessary (use WebSockets if real-time needed)

---

## Web3 Specific Checklist

### Wallet Connection

- [ ] Wallet connection errors handled
- [ ] Loading states during connection
- [ ] Unsupported chains detected and user prompted to switch
- [ ] Disconnection handled gracefully
- [ ] Multiple wallet providers supported

### Blockchain Interactions

- [ ] Transaction errors caught and displayed to user
- [ ] Loading states during transaction submission
- [ ] Transaction confirmation waited for
- [ ] Success/failure feedback shown (toasts)
- [ ] Gas estimation provided (if applicable)
- [ ] Approval transactions handled (if needed)
- [ ] Proper error messages for common issues (insufficient funds, rejected tx, etc.)

### Data Display

- [ ] Token amounts formatted correctly (decimals handled)
- [ ] Addresses shortened (`0x1234...5678`)
- [ ] Chain-specific data displayed correctly
- [ ] Blockchain explorer links provided
- [ ] Transaction hashes formatted and linkable

**Example:**
```typescript
// ✅ Good
import { formatUnits } from 'viem';

const displayAmount = formatUnits(
  rawAmount, // bigint from contract
  tokenDecimals // 18 for most ERC20s
);

// ❌ Bad
const displayAmount = rawAmount / 1e18; // Loses precision!
```

---

## Testing Checklist

### Manual Testing

- [ ] Feature works as expected in Chrome
- [ ] Feature works in Safari (if applicable)
- [ ] Feature works in Firefox (if applicable)
- [ ] Mobile view tested (responsive design)
- [ ] Dark mode tested
- [ ] Wallet connection tested (MetaMask, WalletConnect, etc.)
- [ ] Transaction flow tested end-to-end
- [ ] Error states triggered and verified
- [ ] Loading states verified
- [ ] Edge cases tested (empty states, long text, large numbers, etc.)

### Automated Testing

- [ ] Unit tests written for utility functions
- [ ] Component tests written for complex components
- [ ] Integration tests for critical flows (if applicable)
- [ ] Tests pass locally
- [ ] Tests pass in CI

**Run tests:**
```bash
npm run test
npm run test:watch # for development
npm run test:coverage # check coverage
```

### Type Safety

- [ ] TypeScript compilation succeeds (`npm run typecheck`)
- [ ] No type errors in IDE
- [ ] Strict mode enabled in tsconfig.json

---

## Internationalization (i18n) Checklist

- [ ] All user-facing text uses `useTranslations()` hook
- [ ] Translation keys added to `messages/en.json`
- [ ] Pluralization handled correctly
- [ ] Date/number formatting locale-aware
- [ ] No hardcoded strings in JSX

**Example:**
```typescript
// ✅ Good
const t = useTranslations('campaigns');
<h1>{t('title')}</h1>
<p>{t('description', { count: campaigns.length })}</p>

// ❌ Bad
<h1>Campaigns</h1>
<p>You have {campaigns.length} campaigns</p>
```

---

## Security Checklist

### Input Validation

- [ ] User input validated and sanitized
- [ ] Form validation on client and server
- [ ] XSS prevention (React handles this, but check `dangerouslySetInnerHTML`)
- [ ] SQL injection not possible (if using database)
- [ ] API endpoints authenticated/authorized

### Sensitive Data

- [ ] No API keys or secrets in client code
- [ ] Environment variables used for configuration
- [ ] Private keys never exposed
- [ ] User addresses handled securely

### Web3 Security

- [ ] Contract addresses validated
- [ ] Transaction parameters validated before signing
- [ ] Token approvals limited (not unlimited if avoidable)
- [ ] Signature requests clearly explained to user

---

## Git & Deployment Checklist

### Before Committing

- [ ] Code linted (`npm run lint`)
- [ ] Code formatted (`npm run format`)
- [ ] TypeScript compiles (`npm run typecheck`)
- [ ] Tests pass (`npm run test`)
- [ ] Build succeeds (`npm run build`)
- [ ] No console.log or debug code left in
- [ ] No commented-out code (remove it)

### Commit Message

- [ ] Follows conventional commits format
- [ ] Describes what and why, not how
- [ ] References issue/ticket number if applicable

**Example:**
```
feat(campaigns): add filter by TVL range

Allows users to filter campaigns by minimum and maximum TVL.
Fixes #123
```

### Pull Request

- [ ] PR title is clear and descriptive
- [ ] PR description explains changes and reasoning
- [ ] Screenshots included for UI changes
- [ ] Breaking changes highlighted
- [ ] Documentation updated (if applicable)
- [ ] Reviewers assigned

---

## Deployment Checklist

### Pre-Deployment

- [ ] All tests pass in CI
- [ ] Build succeeds in production mode
- [ ] Bundle size is acceptable
- [ ] Environment variables configured
- [ ] Database migrations run (if applicable)

### Post-Deployment

- [ ] Application loads successfully
- [ ] Core features work (create campaign, view campaign, claim rewards)
- [ ] Wallet connection works
- [ ] Transactions work on live network
- [ ] No console errors
- [ ] Analytics tracking works (if applicable)
- [ ] Error monitoring configured (Sentry, etc.)

---

## Code Review Checklist

When reviewing others' code:

### Functionality

- [ ] Code solves the problem correctly
- [ ] Edge cases are handled
- [ ] Error handling is appropriate

### Code Quality

- [ ] Code is readable and maintainable
- [ ] Naming is clear and consistent
- [ ] No code duplication
- [ ] Functions are small and focused
- [ ] Comments explain "why", not "what"

### Testing

- [ ] Sufficient test coverage
- [ ] Tests are meaningful (not just for coverage)
- [ ] Tests follow best practices

### Performance

- [ ] No obvious performance issues
- [ ] No memory leaks
- [ ] Bundle size impact is reasonable

### Security

- [ ] No security vulnerabilities
- [ ] Input validation present
- [ ] Authentication/authorization correct

### Consistency

- [ ] Follows project conventions
- [ ] Matches existing code style
- [ ] Uses established patterns

---

## Quick Reference Commands

```bash
# Development
npm run dev                    # Start dev server
npm run build                  # Build for production
npm run start                  # Start production server

# Code Quality
npm run lint                   # Run ESLint
npm run lint:fix               # Auto-fix linting issues
npm run format                 # Format with Prettier
npm run typecheck              # Check TypeScript types

# Testing
npm run test                   # Run all tests
npm run test:watch             # Run tests in watch mode
npm run test:coverage          # Generate coverage report

# Monorepo
npm run build --workspace=@metrom-xyz/sdk     # Build specific package
npm run test --workspace=@metrom-xyz/react    # Test specific package
```

---

This checklist ensures high-quality, maintainable, accessible, and performant code. Use it as a guide, not a rigid rulebook. Context matters, and sometimes trade-offs are necessary.
