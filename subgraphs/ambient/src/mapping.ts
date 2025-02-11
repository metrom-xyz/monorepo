import { log } from "@graphprotocol/graph-ts";
import { Pool, PoolTemplate } from "../generated/schema";
import {
    CrocSwap as CrocSwapEvent,
    CrocHotCmd as CrocHotCmdEvent,
    CrocColdCmd as CrocColdCmdEvent,
    CrocColdProtocolCmd as CrocColdProtocolCmdEvent,
    CrocWarmCmd as CrocWarmCmdEvent,
    CrocMicroMintAmbient as CrocMicroMintAmbientEvent,
    CrocMicroMintRange as CrocMicroMintRangeEvent,
    CrocMicroBurnAmbient as CrocMicroBurnAmbientEvent,
    CrocMicroBurnRange as CrocMicroBurnRangeEvent,
    CrocMicroSwap as CrocMicroSwapEvent,
    CrocKnockoutCmd as CrocKnockoutCmdEvent,
} from "../generated/UnifiedCroc/UnifiedCroc";
import {
    BD_Q192,
    BI_0,
    decodeAbiOrThrow,
    exponentToBigDecimal,
    getOrCreateToken,
    getPoolId,
    getPoolOrThrow,
    getPoolTemplateId,
    getPoolTemplateOrThrow,
    handleLiquidityChange,
    handleSwap,
} from "./commons";

export function handleSwapEvent(event: CrocSwapEvent): void {
    handleSwap(
        event.block,
        getPoolId(event.params.base, event.params.quote, event.params.poolIdx),
        event.params.baseFlow,
        event.params.quoteFlow,
    );
}

export function handleHotCmdEvent(event: CrocHotCmdEvent): void {
    const params = decodeAbiOrThrow(
        "(address,address,uint256)",
        event.params.input,
    );

    const token0 = params[0].toAddress();
    const token1 = params[1].toAddress();
    const idx = params[2].toBigInt();

    handleSwap(
        event.block,
        getPoolId(token0, token1, idx),
        event.params.baseFlow,
        event.params.quoteFlow,
    );
}

const INIT_POOL_CODE = 71;
const POOL_TEMPLATE_CODE = 110;
const POOL_REVISE_CODE = 111;

export function handleColdCmdEvent(event: CrocColdCmdEvent): void {
    // we only care about pool creations here
    if (event.params.input[31] !== INIT_POOL_CODE) return;

    let decoded = decodeAbiOrThrow(
        "(uint8,address,address,uint256,uint128)",
        event.params.input,
    );

    let token0Address = decoded[1].toAddress();
    let token1Address = decoded[2].toAddress();
    let idx = decoded[3].toBigInt();
    let sqrtPriceX96 = decoded[4].toBigInt();

    let id = getPoolId(token0Address, token1Address, idx);
    let pool = Pool.load(id);
    if (pool != null) {
        log.warning("Tried to double-create pool for tokens {}/{} and idx {}", [
            token0Address.toHex(),
            token1Address.toHex(),
            idx.toHex(),
        ]);
        return;
    }

    let template = getPoolTemplateOrThrow(idx);

    let token0 = getOrCreateToken(token0Address);
    let token1 = getOrCreateToken(token1Address);

    let price = parseFloat(
        sqrtPriceX96
            .times(sqrtPriceX96)
            .toBigDecimal()
            .div(BD_Q192)
            .times(exponentToBigDecimal(token0.decimals))
            .div(exponentToBigDecimal(token1.decimals))
            .toString(),
    );

    pool = new Pool(id);
    pool.idx = idx;
    pool.token0 = token0.id;
    pool.token1 = token1.id;
    pool.token0Tvl = BI_0;
    pool.token1Tvl = BI_0;
    pool.tick = NativeMath.floor(
        NativeMath.log10(price) / NativeMath.log10(1.0001),
    ) as i32;
    pool.fee = template.fee;
    pool.save();
}

export function handleColdProtocolCmdEvent(
    event: CrocColdProtocolCmdEvent,
): void {
    const commandCode = event.params.input[31];
    if (commandCode === POOL_REVISE_CODE) {
        const decoded = decodeAbiOrThrow(
            "(uint8,address,address,uint256,uint16,uint16,uint8,uint8)",
            event.params.input,
        );

        const token0 = decoded[1].toAddress();
        const token1 = decoded[2].toAddress();
        const idx = decoded[3].toBigInt();
        const fee = decoded[4].toI32();

        let pool = getPoolOrThrow(getPoolId(token0, token1, idx));
        pool.fee = fee;
        pool.save();
    } else if (commandCode == POOL_TEMPLATE_CODE) {
        const params = decodeAbiOrThrow(
            "(uint8,uint256,uint16,uint16,uint8,uint8,uint8)",
            event.params.input,
        );
        const idx = params[1].toBigInt();
        const fee = params[2].toI32();

        let id = getPoolTemplateId(idx);
        let template = PoolTemplate.load(id);
        if (template != null) {
            log.warning("Tried to double-create a pool template with idx {}", [
                idx.toHex(),
            ]);
            return;
        }

        template = new PoolTemplate(id);
        template.fee = fee;
        template.save();
    }
}

const MINT_CONCENTRATED_LIQUIDITY_CODE = 1;
const MINT_CONCENTRATED_TOKEN0_CODE = 11;
const MINT_CONCENTRATED_TOKEN1_CODE = 12;

const BURN_CONCENTRATED_LIQUIDITY_CODE = 2;
const BURN_CONCENTRATED_TOKEN0_CODE = 21;
const BURN_CONCENTRATED_TOKEN1_CODE = 22;

const MINT_AMBIENT_LIQUIDITY_CODE = 3;
const MINT_AMBIENT_TOKEN0_CODE = 31;
const MINT_AMBIENT_TOKEN1_CODE = 32;

const BURN_AMBIENT_LIQUIDITY_CODE = 4;
const BURN_AMBIENT_TOKEN0_CODE = 41;
const BURN_AMBIENT_TOKEN1_CODE = 42;

const HARVEST_ACCUMULATED_FEES_CODE = 5;

const AMBIENT_CODES = [
    MINT_AMBIENT_LIQUIDITY_CODE,
    MINT_AMBIENT_TOKEN0_CODE,
    MINT_AMBIENT_TOKEN1_CODE,
    BURN_AMBIENT_LIQUIDITY_CODE,
    BURN_AMBIENT_TOKEN0_CODE,
    BURN_AMBIENT_TOKEN1_CODE,
];

const LIQUIDITY_CODES = [
    MINT_AMBIENT_LIQUIDITY_CODE,
    MINT_AMBIENT_TOKEN0_CODE,
    MINT_AMBIENT_TOKEN1_CODE,
    BURN_AMBIENT_LIQUIDITY_CODE,
    BURN_AMBIENT_TOKEN0_CODE,
    BURN_AMBIENT_TOKEN1_CODE,
    MINT_CONCENTRATED_LIQUIDITY_CODE,
    MINT_CONCENTRATED_TOKEN0_CODE,
    MINT_CONCENTRATED_TOKEN1_CODE,
    BURN_CONCENTRATED_LIQUIDITY_CODE,
    BURN_CONCENTRATED_TOKEN0_CODE,
    BURN_CONCENTRATED_TOKEN1_CODE,
    HARVEST_ACCUMULATED_FEES_CODE,
];

export function handleWarmCmdEvent(event: CrocWarmCmdEvent): void {
    let commandCode = event.params.input[31];
    if (LIQUIDITY_CODES.indexOf(commandCode) === -1) return;

    let decoded = decodeAbiOrThrow(
        "(uint8,address,address,uint256,int24,int24)",
        event.params.input,
    );

    let token0 = decoded[1].toAddress();
    let token1 = decoded[2].toAddress();
    let idx = decoded[3].toBigInt();
    let lowerTick = decoded[4].toI32();
    let upperTick = decoded[5].toI32();

    handleLiquidityChange(
        event.block,
        event.transaction,
        getPoolId(token0, token1, idx),
        lowerTick,
        upperTick,
        AMBIENT_CODES.includes(commandCode),
        event.params.baseFlow,
        event.params.quoteFlow,
    );
}

export function handleMicroMintAmbientEvent(
    event: CrocMicroMintAmbientEvent,
): void {
    const decodedInputs = decodeAbiOrThrow(
        "(uint128,uint128,uint128,uint64,uint64,uint128,bytes32)",
        event.params.input,
    );
    const poolHash = decodedInputs[6].toBytes();

    const decodedOutputs = decodeAbiOrThrow(
        "(int128,int128,uint128)",
        event.params.output,
    );
    const token0Delta = decodedOutputs[0].toBigInt();
    const token1Delta = decodedOutputs[1].toBigInt();

    handleLiquidityChange(
        event.block,
        event.transaction,
        poolHash,
        0,
        0,
        true,
        token0Delta,
        token1Delta,
    );
}

export function handleMicroMintRangeEvent(
    event: CrocMicroMintRangeEvent,
): void {
    const decodedInputs = decodeAbiOrThrow(
        "(uint128,int24,uint128,uint128,uint64,uint64,int24,int24,uint128,bytes32)",
        event.params.input,
    );
    const lowerTick = decodedInputs[6].toI32();
    const upperTick = decodedInputs[7].toI32();
    const poolHash = decodedInputs[9].toBytes();

    const decodedOutputs = decodeAbiOrThrow(
        "(int128,int128)",
        event.params.output,
    );
    let token0Delta = decodedOutputs[0].toBigInt();
    let token1Delta = decodedOutputs[1].toBigInt();

    handleLiquidityChange(
        event.block,
        event.transaction,
        poolHash,
        lowerTick,
        upperTick,
        false,
        token0Delta,
        token1Delta,
    );
}

export function handleMicroBurnAmbientEvent(
    event: CrocMicroBurnAmbientEvent,
): void {
    const decodedInputs = decodeAbiOrThrow(
        "(uint128,uint128,uint128,uint64,uint64,uint128,bytes32)",
        event.params.input,
    );
    const poolHash = decodedInputs[6].toBytes();

    const decodedOutputs = decodeAbiOrThrow(
        "(int128,int128,uint128)",
        event.params.output,
    );
    const token0Delta = decodedOutputs[0].toBigInt();
    const token1Delta = decodedOutputs[1].toBigInt();

    handleLiquidityChange(
        event.block,
        event.transaction,
        poolHash,
        0,
        0,
        true,
        token0Delta,
        token1Delta,
    );
}

export function handleMicroBurnRangeEvent(
    event: CrocMicroBurnRangeEvent,
): void {
    const decodedInputs = decodeAbiOrThrow(
        "(uint128,int24,uint128,uint128,uint64,uint64,int24,int24,uint128,bytes32)",
        event.params.input,
    );
    const lowerTick = decodedInputs[6].toI32();
    const upperTick = decodedInputs[7].toI32();
    const poolHash = decodedInputs[9].toBytes();

    const decodedOutputs = decodeAbiOrThrow(
        "(int128,int128,uint128,uint128)",
        event.params.output,
    );
    const token0Delta = decodedOutputs[0].toBigInt();
    const token1Delta = decodedOutputs[1].toBigInt();

    handleLiquidityChange(
        event.block,
        event.transaction,
        poolHash,
        lowerTick,
        upperTick,
        false,
        token0Delta,
        token1Delta,
    );
}

export function handleMicroSwapEvent(event: CrocMicroSwapEvent): void {
    const decodedInputs = decodeAbiOrThrow(
        "(uint128,uint128,uint128,uint64,uint64,int24,bool,bool,uint8,uint128,uint128,uint8,uint16,uint8,uint16,uint8,uint8,uint8,bytes32,address)",
        event.params.input,
    );
    const poolHash = decodedInputs[18].toBytes();

    const decodedOutputs = decodeAbiOrThrow(
        "(int128,int128,uint128,uint128,uint128,uint128,uint128,uint64,uint64)",
        event.params.output,
    );
    const token0Delta = decodedOutputs[0].toBigInt();
    const token1Delta = decodedOutputs[1].toBigInt();

    handleSwap(event.block, poolHash, token0Delta, token1Delta);
}

const SUPPORTED_KNOCKOUT_CMD_CODES = [
    91, // mint
    92, // burn
    93, // claim
    94, // recover
];

export function handleKnockoutCmdEvent(event: CrocKnockoutCmdEvent): void {
    const commandCode = event.params.input[31];
    if (SUPPORTED_KNOCKOUT_CMD_CODES.indexOf(commandCode) === -1) return;

    let params = decodeAbiOrThrow(
        "(uint8,address,address,uint256,int24,int24)",
        event.params.input,
    );

    const token0 = params[1].toAddress();
    const token1 = params[2].toAddress();
    const idx = params[3].toBigInt();
    const lowerTick = params[4].toI32();
    const upperTick = params[5].toI32();

    handleLiquidityChange(
        event.block,
        event.transaction,
        getPoolId(token0, token1, idx),
        lowerTick,
        upperTick,
        false,
        event.params.baseFlow,
        event.params.quoteFlow,
    );
}
