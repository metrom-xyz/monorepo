# Code Review Comment Templates

Ready-to-use templates for providing clear, constructive, and actionable code review feedback.

---

## How to Use These Templates

1. **Copy the template** that matches the issue
2. **Fill in the specifics** (file names, line numbers, code snippets)
3. **Adjust the tone** based on severity and relationship
4. **Always be kind** and assume positive intent

---

## Critical Issues (🔴)

### Security Vulnerability

```markdown
🔴 **CRITICAL - Security Issue**

**Location:** `packages/frontend/src/components/ClaimButton.tsx:42`

**Issue:** This code is vulnerable to [type of vulnerability].

**Current code:**
```typescript
[problematic code]
```

**Security risk:** [Explain the risk and potential impact]

**Fix:**
```typescript
[secure code]
```

**Why this matters:** [Explanation of the security principle]

**References:**
- [Link to security documentation]
- [Link to OWASP or similar]

❗ This must be fixed before merge.
```

### Data Loss Risk

```markdown
🔴 **CRITICAL - Data Loss Risk**

**Location:** `subgraphs/metrom/src/mappings/v3.ts:128`

**Issue:** This code could result in data loss because [reason].

**Scenario:** [Describe when this would happen]

**Current code:**
```typescript
[problematic code]
```

**Safe approach:**
```typescript
[safe code]
```

**Test case to verify:**
```typescript
[test that would catch this]
```

❗ This must be fixed before merge.
```

### Correctness Bug

```markdown
🔴 **CRITICAL - Logic Error**

**Location:** `packages/frontend/src/lib/utils/calculations.ts:56`

**Issue:** The calculation is incorrect and will produce wrong results.

**Expected behavior:** [What should happen]

**Actual behavior:** [What happens now]

**Example:**
```typescript
// Input: campaign with 1000 rewards
// Expected output: 1000
// Actual output: 10 (missing decimal places)
```

**Fix:**
```typescript
[corrected code]
```

**Test to add:**
```typescript
test('calculates total rewards correctly', () => {
  // ...
});
```

❗ This must be fixed before merge.
```

---

## Important Issues (🟠)

### Performance Problem

```markdown
🟠 **Performance Issue**

**Location:** `packages/frontend/src/components/CampaignList.tsx:78`

**Issue:** This will cause unnecessary re-renders on every state change.

**Impact:** Performance degradation with large lists (>100 items)

**Current approach:**
```typescript
[problematic code]
```

**Suggested optimization:**
```typescript
[optimized code]
```

**Why this helps:** [Explanation of performance improvement]

**Measurement:** [How to verify the improvement]

This should be fixed before merge, but won't block if there's urgency.
```

### Accessibility Issue

```markdown
🟠 **Accessibility Issue**

**Location:** `packages/frontend/src/components/Modal.tsx:34`

**Issue:** This component is not keyboard accessible.

**Problems:**
- Can't be focused with Tab key
- Can't be closed with Escape key
- No focus trap when open
- No aria-label for screen readers

**Current code:**
```typescript
[inaccessible code]
```

**Accessible version:**
```typescript
[accessible code]
```

**How to test:**
1. Navigate using only keyboard (Tab, Enter, Escape)
2. Test with screen reader (VoiceOver/NVDA)
3. Check focus indicators are visible

**Resources:**
- [Link to WAI-ARIA practices]
- [Our accessibility guidelines]

Please fix before merge to ensure all users can use this feature.
```

### Missing Error Handling

```markdown
🟠 **Missing Error Handling**

**Location:** `packages/frontend/src/hooks/useCampaignData.ts:45`

**Issue:** No error handling for failed API calls.

**User impact:** Users see blank screen instead of error message

**Current code:**
```typescript
const { data } = useQuery({
  queryKey: ['campaign', id],
  queryFn: () => fetchCampaign(id)
});
```

**With error handling:**
```typescript
const { data, error, isError } = useQuery({
  queryKey: ['campaign', id],
  queryFn: () => fetchCampaign(id)
});

if (isError) {
  return <ErrorState error={error} onRetry={refetch} />;
}
```

**Also needed:**
- User-friendly error message
- Retry functionality
- Logging for debugging

Please add error handling to improve user experience.
```

---

## Suggestions (🟡)

### Code Organization

```markdown
🟡 **Suggestion: Code Organization**

**Location:** `packages/frontend/src/components/Dashboard.tsx`

**Observation:** This file has grown quite large (450 lines) and handles multiple concerns.

**Suggestion:** Consider extracting into smaller, focused components:

```typescript
// Current structure
Dashboard.tsx (450 lines)

// Suggested structure
Dashboard.tsx (main component, ~100 lines)
  ├── DashboardHeader.tsx
  ├── DashboardMetrics.tsx
  ├── DashboardCharts.tsx
  └── DashboardActions.tsx
```

**Benefits:**
- Easier to test each component independently
- Better separation of concerns
- Improved reusability
- Simpler code reviews in future

This is optional but would improve maintainability. Feel free to address in a follow-up PR if you prefer.
```

### Naming Improvement

```markdown
🟡 **Suggestion: Naming**

**Location:** `packages/frontend/src/utils/helpers.ts:89`

**Observation:** The function name `processData` is quite generic.

**Current:**
```typescript
function processData(data: CampaignData[]): ProcessedData {
  // ...
}
```

**Suggestion:**
```typescript
function calculateCampaignMetrics(campaigns: CampaignData[]): CampaignMetrics {
  // ...
}
```

**Why:** More descriptive names make code self-documenting and easier to understand.

Feel free to keep the current name if you have a strong preference, but consider more specific naming for better code clarity.
```

### Performance Optimization (Optional)

```markdown
🟡 **Optional Optimization**

**Location:** `packages/frontend/src/components/TokenList.tsx:67`

**Observation:** Could benefit from memoization, though not critical for current data size.

**Current:**
```typescript
const sortedTokens = tokens.sort((a, b) => b.balance - a.balance);
```

**Optimized:**
```typescript
const sortedTokens = useMemo(
  () => tokens.sort((a, b) => b.balance - a.balance),
  [tokens]
);
```

**When this matters:** If token list grows beyond 50-100 items, this would prevent unnecessary sorting on every render.

Not urgent for now, but something to keep in mind if performance becomes an issue later.
```

### Documentation

```markdown
🟡 **Documentation Suggestion**

**Location:** `packages/sdk/src/client/backend.ts:123`

**Observation:** This function has complex logic that could benefit from JSDoc comments.

**Suggestion:**
```typescript
/**
 * Fetches campaign data with rewards and claim information
 *
 * @param campaignId - The campaign identifier (bytes32)
 * @param options - Optional filters and pagination
 * @returns Campaign data with nested rewards array
 * @throws {CampaignNotFoundError} If campaign doesn't exist
 *
 * @example
 * ```typescript
 * const campaign = await client.getCampaign('0x123...', {
 *   includeExpired: false
 * });
 * ```
 */
export async function getCampaign(
  campaignId: string,
  options?: FetchOptions
): Promise<Campaign> {
  // ...
}
```

This would help other developers (and future you!) understand the function better.

Optional but recommended for exported functions.
```

---

## Praise (🟢)

### Excellent Implementation

```markdown
🟢 **Excellent Work!**

**Location:** `packages/frontend/src/hooks/useOptimisticClaim.ts`

**What I love about this:**
- ✅ Implements optimistic updates correctly
- ✅ Handles rollback on error
- ✅ Clear error messages for users
- ✅ Comprehensive test coverage
- ✅ Well-documented with JSDoc comments

This is a great example of how to handle optimistic updates in our codebase. The error handling is particularly thorough!

**Especially good:**
```typescript
// This rollback pattern is perfect
catch (error) {
  queryClient.setQueryData(queryKey, previousData);
  toast.error('Claim failed. Please try again.');
}
```

Thank you for the high-quality implementation! 🎉
```

### Clever Solution

```markdown
🟢 **Clever Solution!**

**Location:** `packages/backend/src/mappings/helpers.ts:234`

**What's great here:** Your approach to handling decimal conversions is really elegant:

```typescript
const decimals = token.decimals.toI32();
const amount = rawAmount.div(BigInt.fromI32(10).pow(decimals));
```

**Why this is excellent:**
- Avoids floating point errors
- Works with any decimal precision
- Clear and readable
- Reusable pattern

This is now the pattern we should follow across the codebase. Great work! 👏
```

### Thorough Testing

```markdown
🟢 **Excellent Test Coverage!**

**Location:** `packages/frontend/src/components/__tests__/CampaignCard.test.tsx`

**What stands out:**
- ✅ Tests happy path, error cases, and edge cases
- ✅ Accessibility tests included (keyboard navigation, screen reader)
- ✅ Tests are well-organized and readable
- ✅ Good use of test helpers
- ✅ Mock data is realistic

**Particularly impressive:**
```typescript
describe('accessibility', () => {
  test('keyboard navigation works', () => {
    // ...
  });

  test('screen reader announces status', () => {
    // ...
  });
});
```

This level of test quality makes the codebase more maintainable and gives us confidence in changes. Thank you! 🙌
```

---

## Combined Review Summary Template

```markdown
## Code Review Summary

### Overall Assessment

[2-3 sentence summary of the PR]

### What's Working Well ✅

- [Positive point 1]
- [Positive point 2]
- [Positive point 3]

### Issues to Address

#### 🔴 Critical (Must Fix)
- [ ] [Critical issue 1 with file:line]
- [ ] [Critical issue 2 with file:line]

#### 🟠 Important (Should Fix)
- [ ] [Important issue 1 with file:line]
- [ ] [Important issue 2 with file:line]

#### 🟡 Suggestions (Optional)
- [ ] [Suggestion 1 with file:line]
- [ ] [Suggestion 2 with file:line]

### Testing

**Test Coverage:** [Adequate / Needs Improvement / Excellent]

[Comments on test quality and coverage]

### Security Review

**Security Status:** [No Issues / Minor Issues / Critical Issues]

[Comments on security aspects]

### Documentation

**Documentation:** [Complete / Needs Minor Updates / Missing]

[Comments on documentation]

---

## Decision

- [ ] ✅ **Approve** - Looks great, ready to merge!
- [ ] 🔄 **Request Changes** - Please address critical/important issues
- [ ] 💬 **Comment** - Suggestions provided, but approval is up to you

## Next Steps

[Clear action items for the author]

---

**Great work on this PR!** [Encouraging closing statement]
```

---

## Teaching Moments

### Explaining Why

```markdown
**Why we do it this way:**

The pattern you used (`[current pattern]`) works, but there's a more idiomatic approach in our codebase:

```typescript
[better pattern]
```

**Advantages of this approach:**
1. [Benefit 1]
2. [Benefit 2]
3. [Benefit 3]

**When to use each:**
- Use `[current pattern]` when [scenario]
- Use `[recommended pattern]` when [scenario]

**Further reading:**
- [Link to internal docs]
- [Link to external resource]

This is a teaching moment - feel free to ask questions!
```

### Pattern Explanation

```markdown
**About this pattern:**

I see you're implementing [feature]. In our codebase, we have an established pattern for this:

**Our pattern:**
```typescript
[established pattern]
```

**Why we use this pattern:**
- [Reason 1]
- [Reason 2]

**Where to find more examples:**
- `packages/frontend/src/components/CampaignCard.tsx`
- `packages/frontend/src/hooks/useCampaigns.ts`

**Benefits:**
- Consistency across codebase
- Easier for team members to understand
- Tested and proven pattern

Would you mind updating to follow this pattern? Happy to pair on this if helpful!
```

---

## Responding to Pushback

### When Author Disagrees

```markdown
**I understand your perspective!**

You make a good point about [their reasoning]. Let me clarify my concern:

**My concern:** [Explain the concern]

**Your approach:** [Acknowledge their approach]

**Trade-offs:**
- Your approach: [Pros and cons]
- My suggestion: [Pros and cons]

**Questions:**
- [Question to understand their reasoning better]
- [Question about specific scenario]

Let's discuss this - I'm open to your approach if there's a good reason I'm missing. The goal is the best solution, not just my suggestion!
```

### When It's Actually Fine

```markdown
**You know what, you're right!**

I initially thought [my concern], but after your explanation I see that [their reasoning] makes sense.

Your approach is actually better because [reasons].

Thanks for the explanation - I learned something today! Approving this now.
```

---

## Tone Guidelines

### 🟢 Encouraging Tone

```markdown
Great job on [specific thing]!

Nice use of [pattern/technique]!

I really like how you [specific action].

This is exactly the right approach for [scenario].

Thank you for the thorough [tests/documentation/implementation]!
```

### 🤝 Collaborative Tone

```markdown
What do you think about [alternative]?

Have you considered [approach]?

I'm curious about your reasoning for [decision].

Would it make sense to [suggestion]?

Let's discuss [topic] - I want to understand your thinking.
```

### 💡 Teaching Tone

```markdown
Here's an interesting pattern we use:

Did you know that [information]?

FYI, there's a helper function for this:

For future reference:

Pro tip:
```

### ⚠️ Cautious Tone (for potentially controversial feedback)

```markdown
I might be missing something, but...

Just to make sure we've considered...

Quick question about [aspect]:

Wanted to flag [potential issue] in case it wasn't intentional.

Not sure if you're aware, but...
```

---

## Anti-Patterns to Avoid

### ❌ Don't: Be Vague

```markdown
❌ This doesn't look right.
❌ There's a better way to do this.
❌ Fix this.
```

### ❌ Don't: Be Dismissive

```markdown
❌ This is wrong.
❌ Everyone knows you should...
❌ Obviously, this won't work.
❌ Just use [pattern] instead.
```

### ❌ Don't: Nitpick Without Priority

```markdown
❌ Change this variable name.
[No explanation of why or how important it is]

❌ Move this to a separate file.
[No explanation of benefits]
```

### ❌ Don't: Pile On

```markdown
❌ [20 different comments, all marked as critical]
[Overwhelming the author]
```

---

## Quick Reference

**Use this severity guide:**

- 🔴 **CRITICAL** - Security, correctness, data loss (must fix)
- 🟠 **IMPORTANT** - Performance, accessibility, maintainability (should fix)
- 🟡 **SUGGESTION** - Style, organization, documentation (optional)
- 🟢 **PRAISE** - Call out excellent work (always do this!)

**Remember:**
- Be specific with file:line references
- Provide code examples
- Explain the "why"
- Link to documentation
- Be kind and constructive
- Recognize good work

---

These templates are starting points - adapt them to your style and relationship with the team. The goal is to help ship better code while helping everyone grow!
