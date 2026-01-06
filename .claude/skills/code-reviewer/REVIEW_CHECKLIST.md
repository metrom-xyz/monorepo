# Code Review Checklist

Use this checklist when reviewing pull requests to ensure thorough and consistent reviews.

---

## Pre-Review

- [ ] PR has a clear title and description
- [ ] PR is linked to an issue/ticket
- [ ] PR scope is reasonable (not too large)
- [ ] CI/CD checks are passing
- [ ] No merge conflicts

---

## Architecture & Design

### Overall Approach
- [ ] Solution fits the problem
- [ ] Approach is the simplest that works
- [ ] No over-engineering
- [ ] Follows existing patterns
- [ ] Doesn't reinvent existing solutions
- [ ] Breaking changes are justified and documented

### Code Organization
- [ ] Changes are focused and cohesive
- [ ] Files are in the correct directories
- [ ] New files follow naming conventions
- [ ] Code is properly modularized
- [ ] Single Responsibility Principle followed

---

## Security Review

### Frontend Security
- [ ] No XSS vulnerabilities (`dangerouslySetInnerHTML`)
- [ ] User input is validated and sanitized
- [ ] No secrets/API keys in client code
- [ ] API calls are authenticated
- [ ] Sensitive data is not logged
- [ ] External links have `rel="noopener noreferrer"`

### Web3 Security
- [ ] Token approvals are limited (not MaxUint256)
- [ ] Transaction parameters are validated
- [ ] User understands what they're signing
- [ ] Contract addresses are validated
- [ ] BigInt operations don't overflow
- [ ] Gas estimations are provided

### Backend Security
- [ ] No SQL injection risks
- [ ] Contract calls use `try_` pattern
- [ ] Access control is correct
- [ ] No reentrancy vulnerabilities (if applicable)
- [ ] Integer operations are safe
- [ ] Input validation on all external data

### DeFi-Specific
- [ ] No price manipulation vulnerabilities
- [ ] Flash loan attacks considered
- [ ] Oracle dependencies secured
- [ ] Slippage protection implemented
- [ ] Front-running mitigations in place
- [ ] Time-dependent logic is secure

---

## Frontend Review

### TypeScript
- [ ] No `any` types used
- [ ] All props have interfaces
- [ ] Return types are explicit
- [ ] Type imports use `import type`
- [ ] Null/undefined are handled properly
- [ ] Type assertions are justified with comments
- [ ] Generics used where appropriate
- [ ] No type errors in build

### React Components
- [ ] Server components by default
- [ ] `'use client'` only when necessary
- [ ] Props are destructured in signature
- [ ] useCallback for event handlers (in client components)
- [ ] useMemo for expensive computations
- [ ] Proper dependency arrays in hooks
- [ ] No missing dependencies warnings
- [ ] Components under 300 lines
- [ ] Clean up effects (listeners, timers, subscriptions)

### Next.js Patterns
- [ ] Async params handled correctly (Next.js 15)
- [ ] Suspense boundaries for async components
- [ ] Loading.tsx for route loading states
- [ ] Error.tsx for error boundaries
- [ ] Metadata functions for SEO
- [ ] Dynamic imports for heavy components
- [ ] Route handlers follow conventions

### Performance
- [ ] No unnecessary re-renders
- [ ] Images use Next.js `<Image>` component
- [ ] Large libraries dynamically imported
- [ ] Lists are virtualized if long (>100 items)
- [ ] Bundle size increase is acceptable (<20KB)
- [ ] No memory leaks
- [ ] Lazy loading for below-the-fold content
- [ ] Code splitting at route level

### Styling
- [ ] Tailwind classes used (no inline styles)
- [ ] No arbitrary values (e.g., `text-[14px]`)
- [ ] Dark mode supported (`dark:` prefix)
- [ ] Responsive breakpoints used
- [ ] Consistent spacing (Tailwind scale)
- [ ] Theme colors used (no hardcoded colors)
- [ ] `cn()` utility for conditional classes

### Accessibility
- [ ] Semantic HTML (`<button>`, `<nav>`, `<main>`)
- [ ] Headings in correct order (h1 → h2 → h3)
- [ ] ARIA labels on icon-only buttons
- [ ] Keyboard navigation works (Tab order)
- [ ] Focus indicators are visible
- [ ] Color contrast meets WCAG AA (4.5:1)
- [ ] Screen reader tested (or obvious it will work)
- [ ] Form labels associated with inputs
- [ ] Error messages are announced
- [ ] No information conveyed by color alone

### Internationalization
- [ ] All user-facing text uses `useTranslations()`
- [ ] Translation keys added to `messages/en.json`
- [ ] Pluralization handled correctly
- [ ] Date/number formatting is locale-aware
- [ ] No hardcoded strings in JSX

### Data Fetching
- [ ] React Query used for client-side fetching
- [ ] Proper `queryKey` structure
- [ ] `staleTime` and `cacheTime` configured
- [ ] Loading states shown
- [ ] Error states handled gracefully
- [ ] Empty states handled
- [ ] Optimistic updates where appropriate

---

## Backend (Subgraph) Review

### GraphQL Schema
- [ ] Entity immutability flags are correct
- [ ] Field types are appropriate (BigInt, Bytes, Int)
- [ ] Relationships properly defined
- [ ] IDs are unique and deterministic
- [ ] @derivedFrom used for relationships
- [ ] No redundant fields
- [ ] Field names are descriptive

### AssemblyScript
- [ ] BigInt operations use methods (`.plus`, `.minus`, `.times`)
- [ ] No JavaScript operators on BigInt (`+`, `-`, `*`, `/`)
- [ ] Comparisons use methods (`.gt`, `.lt`, `.equals`)
- [ ] Contract calls use `try_` pattern
- [ ] Null checks before entity usage
- [ ] Entities are saved after modifications
- [ ] No array methods (`map`, `filter`, `reduce`)
- [ ] String concatenation uses `.concat()`

### Event Handlers
- [ ] Transaction entity created/reused
- [ ] Event IDs are unique (block.number + logIndex)
- [ ] Aggregate counters updated correctly
- [ ] Related entities updated
- [ ] Event entities created for history
- [ ] Error cases handled gracefully
- [ ] Logging added for debugging

### Helper Functions
- [ ] getOrCreate pattern followed
- [ ] getOrThrow pattern for required entities
- [ ] ID generation is consistent
- [ ] Functions are reusable
- [ ] No duplicate code
- [ ] Clear function names

### Performance
- [ ] Minimal entity saves (batch updates)
- [ ] No unnecessary entity loads
- [ ] @derivedFrom used instead of arrays
- [ ] No expensive operations in loops
- [ ] Conditional logic before saves
- [ ] Efficient ID generation

### Configuration
- [ ] subgraph.yaml is correct
- [ ] Network name matches The Graph spec
- [ ] Contract address is correct
- [ ] Start block is deployment block
- [ ] ABIs are up to date
- [ ] Event signatures match ABI

---

## Testing Review

### Test Presence
- [ ] Tests exist for new functionality
- [ ] Tests exist for bug fixes
- [ ] Edge cases are tested
- [ ] Error cases are tested
- [ ] Integration tests where appropriate

### Test Quality
- [ ] Tests are readable and well-named
- [ ] Tests test behavior, not implementation
- [ ] No flaky tests
- [ ] Async code is properly awaited
- [ ] Mocks are used appropriately
- [ ] Test data is realistic
- [ ] Tests are isolated (no shared state)

### Coverage
- [ ] Happy path covered
- [ ] Error paths covered
- [ ] Edge cases covered
- [ ] Null/undefined cases covered
- [ ] Coverage metrics acceptable (>80%)

### Frontend Tests
- [ ] Component renders without errors
- [ ] User interactions tested
- [ ] Loading states tested
- [ ] Error states tested
- [ ] Async behavior tested
- [ ] Accessibility tested (roles, labels)

### Backend Tests
- [ ] Event handlers tested
- [ ] Entity creation verified
- [ ] Field values correct
- [ ] Relationships tested
- [ ] Edge cases covered
- [ ] Store cleared between tests

---

## Code Quality Review

### Naming
- [ ] Variables: camelCase, descriptive
- [ ] Functions: camelCase, verb-prefixed
- [ ] Components: PascalCase
- [ ] Constants: UPPER_SNAKE_CASE
- [ ] Types/Interfaces: PascalCase
- [ ] No single-letter variables (except loops)
- [ ] Boolean variables prefixed (`is`, `has`, `should`)

### Error Handling
- [ ] Errors are caught and handled
- [ ] Error messages are user-friendly
- [ ] Errors are logged for debugging
- [ ] Recovery paths provided
- [ ] No swallowed errors (`catch {}`)
- [ ] Appropriate error types thrown
- [ ] Error boundaries in place

### Code Complexity
- [ ] Functions under 50 lines
- [ ] Files under 300 lines
- [ ] Cyclomatic complexity reasonable
- [ ] No deeply nested code (>3 levels)
- [ ] Complex logic is extracted to helpers
- [ ] No code duplication

### Comments & Documentation
- [ ] Comments explain "why" not "what"
- [ ] Complex logic has comments
- [ ] No commented-out code
- [ ] TODOs have context and owner
- [ ] JSDoc for exported functions
- [ ] Inline comments are helpful

---

## Documentation Review

### Code Documentation
- [ ] README updated if needed
- [ ] API changes documented
- [ ] Breaking changes highlighted
- [ ] Migration guide provided (if breaking)
- [ ] Examples added for new features
- [ ] Inline documentation for complex logic

### User Documentation
- [ ] User-facing changes documented
- [ ] Feature flags documented
- [ ] Configuration changes documented
- [ ] Troubleshooting guide updated

---

## Git & CI/CD Review

### Commits
- [ ] Commit messages follow conventions
- [ ] Commits are logical and atomic
- [ ] No "WIP" or "fix" commits (should be squashed)
- [ ] No merge commits (should be rebased)
- [ ] Commit history is clean

### CI/CD
- [ ] All CI checks pass
- [ ] Build succeeds
- [ ] Tests pass
- [ ] Linting passes
- [ ] Type checking passes
- [ ] No console warnings
- [ ] Bundle size check passes

---

## Specific File Types

### Configuration Files
- [ ] Changes are intentional
- [ ] No accidental commits (.env, etc.)
- [ ] Dependencies are necessary
- [ ] Version numbers are correct
- [ ] Lock files updated

### Package.json Changes
- [ ] New dependencies are justified
- [ ] Versions are pinned or ranged appropriately
- [ ] No unused dependencies
- [ ] Scripts are documented
- [ ] License is compatible

### Migration Files
- [ ] Migration is reversible
- [ ] Data migration is safe
- [ ] Tested on staging
- [ ] Rollback plan exists
- [ ] Breaking changes documented

---

## DeFi-Specific Review

### Campaign Logic
- [ ] Reward calculations are correct
- [ ] Time bounds are validated
- [ ] Distribution logic is fair
- [ ] No rounding errors
- [ ] Edge cases handled (0 amounts, etc.)

### Token Handling
- [ ] Token decimals handled correctly
- [ ] Amount formatting correct
- [ ] Approval flow is secure
- [ ] Transfer errors handled
- [ ] Token metadata fetched safely

### Chain-Specific
- [ ] Works across all supported chains
- [ ] Chain IDs validated
- [ ] Contract addresses correct per chain
- [ ] Block time differences considered
- [ ] Gas estimation accurate

---

## Multi-Chain Considerations

- [ ] Code works on all target chains
- [ ] Chain-specific logic is isolated
- [ ] Network selection is clear
- [ ] RPC endpoints configured
- [ ] Contract addresses per chain correct
- [ ] Testnet support included

---

## Performance Metrics

### Bundle Size
- [ ] Overall bundle size acceptable
- [ ] Page-specific bundles reasonable
- [ ] Code splitting effective
- [ ] Tree-shaking working
- [ ] No duplicate dependencies

### Runtime Performance
- [ ] No excessive re-renders
- [ ] No memory leaks
- [ ] Efficient algorithms used
- [ ] Database queries optimized
- [ ] API calls minimized

---

## Deployment Readiness

### Environment
- [ ] Works in all environments (dev/staging/prod)
- [ ] Environment variables documented
- [ ] Feature flags configured
- [ ] Monitoring/logging in place
- [ ] Error tracking configured

### Rollout Plan
- [ ] Deployment steps documented
- [ ] Rollback plan exists
- [ ] Database migrations tested
- [ ] Zero-downtime deployment possible
- [ ] Stakeholders notified

---

## Final Checks

- [ ] All review comments addressed
- [ ] No unresolved threads
- [ ] Author has responded to feedback
- [ ] Required approvals obtained
- [ ] PR is up to date with base branch
- [ ] Ready to merge

---

## Review Decision

After completing the checklist, choose one:

### ✅ Approve
- No security issues
- No correctness bugs
- Code quality acceptable
- Tests present and passing
- Minor issues only

### 🔄 Request Changes
- Security vulnerabilities found
- Correctness issues present
- Major maintainability concerns
- Missing critical tests
- Performance problems

### 💬 Comment
- Code is acceptable as-is
- Suggestions are optional
- Teaching opportunities
- Discussion needed

---

## Priority Guidelines

**🔴 Must Fix (Block merge):**
- Security vulnerabilities
- Correctness bugs
- Data loss risks
- Breaking changes without notice
- Missing critical tests

**🟠 Should Fix (Request changes):**
- Performance issues
- Accessibility problems
- Major maintainability concerns
- Significant code quality issues
- Important missing tests

**🟡 Nice to Have (Optional):**
- Code style improvements
- Minor refactoring
- Documentation enhancements
- Better naming
- Additional test coverage

**🟢 Praise (Always do this!):**
- Excellent implementations
- Clever solutions
- Good practices
- Thorough testing
- Clear documentation

---

## Time Estimates

- **Small PR (<100 lines):** 10-15 minutes
- **Medium PR (100-500 lines):** 30-45 minutes
- **Large PR (>500 lines):** 60+ minutes (or request splitting)

---

Remember: The goal is to improve code quality and help the team grow, not to be a gatekeeper. Be thorough but also be kind and constructive!
