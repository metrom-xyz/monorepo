# Security Review Guide for DeFi Applications

This guide focuses on security-specific code review for the Metrom DeFi platform, covering frontend, backend, and blockchain interactions.

---

## Security Review Priority

**🔴 CRITICAL** - Must be fixed before merge
**🟠 HIGH** - Should be fixed, can be tracked if urgent
**🟡 MEDIUM** - Should be fixed in follow-up
**🟢 LOW** - Nice to have, can be deferred

---

## Frontend Security

### 1. Cross-Site Scripting (XSS)

**🔴 CRITICAL**

```typescript
// ❌ CRITICAL: XSS vulnerability
function UserProfile({ bio }: { bio: string }) {
    return <div dangerouslySetInnerHTML={{ __html: bio }} />;
}

// ✅ SAFE: React escapes by default
function UserProfile({ bio }: { bio: string }) {
    return <div>{bio}</div>;
}

// ❌ CRITICAL: XSS via attribute
<a href={userProvidedUrl}>Link</a>

// ✅ SAFE: Validate URLs
import { isValidUrl } from '@/lib/utils';

<a href={isValidUrl(userProvidedUrl) ? userProvidedUrl : '#'}>Link</a>
```

**What to look for:**
- [ ] Any use of `dangerouslySetInnerHTML`
- [ ] User input in href, src, or other attributes
- [ ] JavaScript URLs (`javascript:`)
- [ ] Unvalidated external links

### 2. Secrets Exposure

**🔴 CRITICAL**

```typescript
// ❌ CRITICAL: API key in client code
const INFURA_KEY = "a1b2c3d4e5f6...";

// ❌ CRITICAL: Private key in code
const PRIVATE_KEY = "0x123456...";

// ✅ SAFE: Use environment variables
const INFURA_KEY = process.env.NEXT_PUBLIC_INFURA_KEY;

// ⚠️ WARNING: Anything NEXT_PUBLIC_ is exposed to client
// Never put secrets in NEXT_PUBLIC_ variables!
```

**What to look for:**
- [ ] Hardcoded API keys
- [ ] Private keys anywhere in code
- [ ] Mnemonics or seed phrases
- [ ] Database credentials
- [ ] JWT secrets
- [ ] Any secrets in `NEXT_PUBLIC_` env vars

### 3. Input Validation

**🟠 HIGH**

```typescript
// ❌ HIGH: No input validation
function claimReward(campaignId: string, amount: string) {
    return contract.claim(campaignId, amount);
}

// ✅ SAFE: Validate inputs
function claimReward(campaignId: string, amount: string) {
    // Validate campaign ID format
    if (!campaignId.startsWith('0x') || campaignId.length !== 66) {
        throw new Error('Invalid campaign ID');
    }

    // Validate amount
    const amountBN = BigInt(amount);
    if (amountBN <= 0n) {
        throw new Error('Amount must be positive');
    }

    return contract.claim(campaignId, amountBN);
}
```

**What to look for:**
- [ ] User input is validated
- [ ] Numeric inputs have min/max bounds
- [ ] String inputs have length limits
- [ ] Addresses are validated as addresses
- [ ] Enum values are validated

---

## Web3 Security

### 4. Token Approvals

**🔴 CRITICAL**

```typescript
// ❌ CRITICAL: Unlimited approval
import { ethers } from 'ethers';

await token.approve(
    CAMPAIGN_CONTRACT,
    ethers.constants.MaxUint256  // Unlimited!
);

// ✅ SAFE: Limited approval
await token.approve(
    CAMPAIGN_CONTRACT,
    exactAmountNeeded
);

// ✅ BETTER: Ask user for approval amount
const approvalAmount = userWantsUnlimited
    ? ethers.constants.MaxUint256
    : exactAmountNeeded;

await token.approve(CAMPAIGN_CONTRACT, approvalAmount);
```

**What to look for:**
- [ ] Token approvals are limited
- [ ] User is informed about approval amount
- [ ] Approval UI shows what's being approved
- [ ] Revoke functionality exists

### 5. Transaction Validation

**🟠 HIGH**

```typescript
// ❌ HIGH: No validation
async function createCampaign(data: CampaignData) {
    return metrom.createCampaign(
        data.pool,
        data.rewards,
        data.startTime,
        data.endTime
    );
}

// ✅ SAFE: Comprehensive validation
async function createCampaign(data: CampaignData) {
    // Validate pool address
    if (!ethers.utils.isAddress(data.pool)) {
        throw new Error('Invalid pool address');
    }

    // Validate rewards
    if (data.rewards.length === 0) {
        throw new Error('At least one reward required');
    }

    for (const reward of data.rewards) {
        if (!ethers.utils.isAddress(reward.token)) {
            throw new Error(`Invalid token address: ${reward.token}`);
        }
        if (reward.amount <= 0) {
            throw new Error('Reward amount must be positive');
        }
    }

    // Validate time bounds
    const now = Date.now() / 1000;
    if (data.startTime < now) {
        throw new Error('Start time must be in the future');
    }
    if (data.endTime <= data.startTime) {
        throw new Error('End time must be after start time');
    }

    // Validate duration
    const duration = data.endTime - data.startTime;
    const MIN_DURATION = 3600; // 1 hour
    const MAX_DURATION = 86400 * 365; // 1 year
    if (duration < MIN_DURATION || duration > MAX_DURATION) {
        throw new Error('Invalid campaign duration');
    }

    return metrom.createCampaign(
        data.pool,
        data.rewards,
        data.startTime,
        data.endTime
    );
}
```

**What to look for:**
- [ ] All contract parameters validated
- [ ] Addresses checked with `isAddress()`
- [ ] Amounts are positive
- [ ] Time bounds make sense
- [ ] Array lengths validated
- [ ] Gas limits reasonable

### 6. Signature Verification

**🟠 HIGH**

```typescript
// ❌ HIGH: User doesn't see what they're signing
const signature = await signer.signMessage("Sign to claim");

// ✅ SAFE: Clear message
const message = `
Claim Rewards

Campaign: ${campaignId}
Amount: ${formatUnits(amount, 18)} tokens
Address: ${userAddress}
Nonce: ${nonce}
`;

const signature = await signer.signMessage(message);

// ✅ BETTER: Use EIP-712 for structured data
const domain = {
    name: 'Metrom',
    version: '1',
    chainId: await signer.getChainId(),
    verifyingContract: METROM_ADDRESS
};

const types = {
    Claim: [
        { name: 'campaignId', type: 'bytes32' },
        { name: 'amount', type: 'uint256' },
        { name: 'recipient', type: 'address' },
        { name: 'nonce', type: 'uint256' }
    ]
};

const value = {
    campaignId,
    amount,
    recipient: userAddress,
    nonce
};

const signature = await signer._signTypedData(domain, types, value);
```

**What to look for:**
- [ ] User sees what they're signing
- [ ] Message includes relevant details
- [ ] Nonce prevents replay attacks
- [ ] Domain separator used (EIP-712)
- [ ] Signature verified on-chain

---

## Smart Contract Interaction

### 7. Reentrancy Protection

**🔴 CRITICAL** (if contract code is being reviewed)

```solidity
// ❌ CRITICAL: Reentrancy vulnerability
function withdraw(uint amount) external {
    require(balances[msg.sender] >= amount);
    (bool success, ) = msg.sender.call{value: amount}("");  // External call first!
    require(success);
    balances[msg.sender] -= amount;  // State update after!
}

// ✅ SAFE: Checks-Effects-Interactions pattern
function withdraw(uint amount) external nonReentrant {
    require(balances[msg.sender] >= amount);
    balances[msg.sender] -= amount;  // Update state first!
    (bool success, ) = msg.sender.call{value: amount}("");  // Then interact
    require(success);
}
```

**What to look for (in contract interactions):**
- [ ] No untrusted external calls before state changes
- [ ] Reentrancy guards where needed
- [ ] State updated before external calls

### 8. Integer Overflow/Underflow

**🟠 HIGH**

```typescript
// Frontend: Use BigInt correctly

// ❌ HIGH: JavaScript number overflow
const totalRewards = reward1 + reward2;  // Loses precision!

// ✅ SAFE: Use BigInt
const totalRewards = BigInt(reward1) + BigInt(reward2);

// ❌ HIGH: Underflow in calculation
const remaining = claimed - total;  // Could be negative!

// ✅ SAFE: Check before subtraction
if (claimed < total) {
    throw new Error('Invalid state: claimed exceeds total');
}
const remaining = total - claimed;
```

**What to look for:**
- [ ] BigInt used for token amounts
- [ ] No mixing of number and BigInt
- [ ] Overflow checked in arithmetic
- [ ] Division by zero checked
- [ ] Negative results impossible

### 9. Access Control

**🟠 HIGH**

```typescript
// ❌ HIGH: No ownership check
async function pauseCampaign(campaignId: string) {
    await metrom.pause(campaignId);
}

// ✅ SAFE: Verify ownership
async function pauseCampaign(campaignId: string) {
    const campaign = await getCampaign(campaignId);
    const userAddress = await signer.getAddress();

    if (campaign.owner.toLowerCase() !== userAddress.toLowerCase()) {
        throw new Error('Only campaign owner can pause');
    }

    await metrom.pause(campaignId);
}
```

**What to look for:**
- [ ] Ownership verified before actions
- [ ] Admin functions protected
- [ ] Role-based access correct
- [ ] Contract-level permissions checked

---

## DeFi-Specific Security

### 10. Price Manipulation

**🔴 CRITICAL**

```typescript
// ❌ CRITICAL: Using spot price
const price = await pool.getPrice();  // Can be manipulated!
const value = amount * price;

// ✅ SAFE: Use TWAP (Time-Weighted Average Price)
const twapPrice = await oracle.getTWAP(pool, 3600);  // 1 hour TWAP
const value = amount * twapPrice;

// ✅ BETTER: Multiple oracle sources
const chainlinkPrice = await chainlink.getPrice(token);
const uniswapTWAP = await uniswapOracle.getTWAP(token);

// Verify prices are within acceptable range
const priceDiff = Math.abs(chainlinkPrice - uniswapTWAP) / chainlinkPrice;
if (priceDiff > 0.05) {  // 5% tolerance
    throw new Error('Oracle price mismatch');
}
```

**What to look for:**
- [ ] No spot price usage for critical calculations
- [ ] TWAP used with reasonable time window
- [ ] Multiple oracle sources when possible
- [ ] Oracle staleness checks
- [ ] Price deviation alerts

### 11. Slippage Protection

**🟠 HIGH**

```typescript
// ❌ HIGH: No slippage protection
await router.swap(
    tokenIn,
    tokenOut,
    amountIn,
    0  // Accept any amount out - dangerous!
);

// ✅ SAFE: Slippage protection
const quote = await router.getQuote(tokenIn, tokenOut, amountIn);
const minAmountOut = quote * (1 - SLIPPAGE_TOLERANCE);  // e.g., 1% slippage

await router.swap(
    tokenIn,
    tokenOut,
    amountIn,
    minAmountOut
);

// ✅ BETTER: User-configurable slippage
<SlippageSettings onChange={setSlippage} />

const minAmountOut = expectedAmount * (1 - userSlippage / 100);
```

**What to look for:**
- [ ] Slippage protection on swaps
- [ ] Deadline parameter set
- [ ] User can configure slippage
- [ ] Default slippage is reasonable (0.5-1%)
- [ ] Warning for high slippage

### 12. Flash Loan Attacks

**🔴 CRITICAL** (contract level, but frontend should be aware)

```typescript
// Frontend: Display warnings for suspicious activity

// ✅ Monitor for flash loan patterns
async function detectFlashLoan(txHash: string) {
    const tx = await provider.getTransaction(txHash);
    const receipt = await tx.wait();

    // Check for multiple borrow/repay in same transaction
    const flashLoanEvents = receipt.logs.filter(log =>
        log.topics[0] === FLASH_LOAN_EVENT_SIGNATURE
    );

    if (flashLoanEvents.length > 0) {
        // Show warning to user
        toast.warning('Flash loan detected in this transaction');
    }
}
```

**What to look for:**
- [ ] Flash loan awareness in UI
- [ ] Warnings for unusual patterns
- [ ] Transaction analysis before execution
- [ ] Rate limiting on critical actions

---

## Backend (Subgraph) Security

### 13. Data Integrity

**🟠 HIGH**

```typescript
// ❌ HIGH: No validation of event data
export function handleClaimReward(event: ClaimReward): void {
    let campaign = Campaign.load(event.params.campaignId);
    campaign.totalClaimed = campaign.totalClaimed.plus(event.params.amount);
    campaign.save();
}

// ✅ SAFE: Validate and handle errors
export function handleClaimReward(event: ClaimReward): void {
    // Validate campaign exists
    let campaign = Campaign.load(event.params.campaignId);
    if (campaign === null) {
        log.warning('Claim for non-existent campaign: {}', [
            event.params.campaignId.toHex()
        ]);
        return;
    }

    // Validate amount
    if (event.params.amount.equals(BI_0)) {
        log.warning('Zero amount claim detected: {}', [
            event.transaction.hash.toHex()
        ]);
        return;
    }

    // Check for overflow
    let newTotal = campaign.totalClaimed.plus(event.params.amount);
    if (newTotal.lt(campaign.totalClaimed)) {
        log.error('Overflow detected in claim: {}', [
            event.transaction.hash.toHex()
        ]);
        return;
    }

    campaign.totalClaimed = newTotal;
    campaign.save();
}
```

**What to look for:**
- [ ] Entity existence verified
- [ ] Numeric values validated
- [ ] Overflow/underflow checked
- [ ] Invalid data logged
- [ ] Graceful error handling

### 14. Access to Sensitive Data

**🟡 MEDIUM**

```typescript
// ⚠️ Be careful with sensitive data in subgraphs

// ❌ Don't store sensitive data
type User @entity {
    id: Bytes!
    email: String!  // Don't store PII!
    ipAddress: String!  // Don't store this!
}

// ✅ Only store public blockchain data
type User @entity {
    id: Bytes!  // Wallet address
    totalClaimed: BigInt!
    claimCount: BigInt!
}
```

**What to look for:**
- [ ] No PII (email, names, etc.)
- [ ] No off-chain sensitive data
- [ ] Only on-chain public data indexed

---

## Authentication & Authorization

### 15. Wallet Connection Security

**🟠 HIGH**

```typescript
// ❌ HIGH: Trusting client-side address
const userAddress = localStorage.getItem('address');
await contract.claim(userAddress, amount);

// ✅ SAFE: Always get from signer
const signer = await provider.getSigner();
const userAddress = await signer.getAddress();
await contract.claim(amount);  // msg.sender on chain

// ✅ Verify wallet connection
async function verifyConnection() {
    const accounts = await provider.listAccounts();
    if (accounts.length === 0) {
        throw new Error('No wallet connected');
    }

    const chainId = await signer.getChainId();
    if (chainId !== EXPECTED_CHAIN_ID) {
        throw new Error('Wrong network');
    }
}
```

**What to look for:**
- [ ] Address always from signer, not storage
- [ ] Chain ID verified
- [ ] Wallet connection state accurate
- [ ] No trust in client-provided addresses

---

## API Security

### 16. Rate Limiting

**🟡 MEDIUM**

```typescript
// ✅ Implement rate limiting
import { Ratelimit } from "@upstash/ratelimit";

const ratelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(10, "10 s"),
});

export async function POST(request: Request) {
    const ip = request.headers.get("x-forwarded-for") ?? "127.0.0.1";

    const { success } = await ratelimit.limit(ip);
    if (!success) {
        return new Response("Too many requests", { status: 429 });
    }

    // Process request
}
```

**What to look for:**
- [ ] Rate limiting on public endpoints
- [ ] DDOS protection
- [ ] Brute force prevention
- [ ] IP-based or address-based limits

### 17. CORS Configuration

**🟠 HIGH**

```typescript
// ❌ HIGH: Open CORS
res.setHeader('Access-Control-Allow-Origin', '*');

// ✅ SAFE: Restricted CORS
const ALLOWED_ORIGINS = [
    'https://metrom.xyz',
    'https://app.metrom.xyz'
];

const origin = req.headers.origin;
if (ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
}
```

**What to look for:**
- [ ] CORS not set to `*`
- [ ] Whitelist of allowed origins
- [ ] Credentials handled securely
- [ ] Preflight requests handled

---

## Data Privacy

### 18. Logging Sensitive Data

**🟠 HIGH**

```typescript
// ❌ HIGH: Logging sensitive data
console.log('User signature:', signature);
console.log('API key:', process.env.API_KEY);

// ✅ SAFE: Safe logging
console.log('Transaction hash:', txHash);
console.log('Campaign ID:', campaignId);

// ✅ Redact sensitive parts
console.log('Address:', address.slice(0, 6) + '...' + address.slice(-4));
```

**What to look for:**
- [ ] No signatures in logs
- [ ] No private keys in logs
- [ ] No API keys in logs
- [ ] PII redacted if logged
- [ ] Production logs cleaned

---

## Security Testing

### 19. Security Test Coverage

```typescript
// ✅ Test security scenarios

describe('Security', () => {
    test('rejects invalid addresses', async () => {
        await expect(
            claimReward('not-an-address', '1000')
        ).rejects.toThrow('Invalid address');
    });

    test('rejects negative amounts', async () => {
        await expect(
            claimReward(validAddress, '-1000')
        ).rejects.toThrow('Amount must be positive');
    });

    test('prevents overflow', async () => {
        const maxUint = (2n ** 256n) - 1n;
        await expect(
            addRewards(maxUint, 1n)
        ).rejects.toThrow('Overflow');
    });

    test('requires ownership', async () => {
        await expect(
            pauseCampaign(campaignId, attacker)
        ).rejects.toThrow('Only owner');
    });
});
```

**What to look for:**
- [ ] Security tests present
- [ ] Invalid input tested
- [ ] Overflow/underflow tested
- [ ] Access control tested
- [ ] Edge cases covered

---

## Security Checklist Summary

Use this quick checklist during code review:

### Frontend
- [ ] No XSS vulnerabilities
- [ ] No exposed secrets
- [ ] Input validation present
- [ ] Safe URL handling

### Web3
- [ ] Limited token approvals
- [ ] Transaction validation
- [ ] Clear signature messages
- [ ] Ownership verification

### DeFi
- [ ] No price manipulation risks
- [ ] Slippage protection
- [ ] Flash loan awareness
- [ ] Oracle validation

### Backend
- [ ] Data integrity checks
- [ ] No sensitive data indexed
- [ ] Overflow protection
- [ ] Error handling

### General
- [ ] Rate limiting
- [ ] CORS configured
- [ ] Safe logging
- [ ] Security tests

---

## When to Escalate

**Immediately escalate to security team if you find:**

1. 🔴 Any way to steal user funds
2. 🔴 Private keys or mnemonics in code
3. 🔴 SQL injection or XSS vulnerabilities
4. 🔴 Reentrancy vulnerabilities
5. 🔴 Price oracle manipulation
6. 🔴 Access control bypass
7. 🔴 Flash loan attack vectors
8. 🔴 Signature replay attacks

**Do not approve PRs with critical security issues!**

---

Remember: In DeFi, security bugs can result in loss of funds. When in doubt, escalate to the security team or request an audit.
