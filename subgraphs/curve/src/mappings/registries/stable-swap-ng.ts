import { Address, BigInt } from "@graphprotocol/graph-ts";
import {
    PlainPoolDeployed,
    MetaPoolDeployed,
    LiquidityGaugeDeployed,
    StableSwapNGFactory,
} from "../../../generated/StableSwapNGFactory/StableSwapNGFactory";
import {
    ADDRESS_ZERO,
    createGauge,
    getOrCreatePool,
    getPoolLpTokenAddressOrThrow,
} from "../../commons";
import { STABLE_SWAP_NG_FACTORY_ADDRESS } from "../../constants";

let StableSwapNgFactoryContract = StableSwapNGFactory.bind(
    STABLE_SWAP_NG_FACTORY_ADDRESS,
);

function getPoolAddressFromCoins(coins: Address[]): Address {
    let resolvedCoins: Address[] = [];
    for (let i = 0; i < coins.length; i++)
        if (coins[i] == ADDRESS_ZERO) {
            break;
        } else {
            resolvedCoins.push(coins[i]);
        }

    let i = -1;
    while (true) {
        i++;
        let poolAddress = StableSwapNgFactoryContract.find_pool_for_coins(
            resolvedCoins[0],
            resolvedCoins[1],
            BigInt.fromI32(i),
        );
        if (poolAddress == ADDRESS_ZERO)
            throw new Error(
                `Could not fetch pool address from coins ${resolvedCoins[0].toHex()} and ${resolvedCoins[1].toHex()} with index ${i}`,
            );

        let onChainPoolCoins =
            StableSwapNgFactoryContract.get_coins(poolAddress);
        let poolCoins: Address[] = [];
        for (let i = 0; i < onChainPoolCoins.length; i++)
            if (onChainPoolCoins[i] == ADDRESS_ZERO) {
                break;
            } else {
                poolCoins.push(onChainPoolCoins[i]);
            }

        if (poolCoins.length != resolvedCoins.length) continue;

        let shouldContinue = false;
        for (let i = 0; i < poolCoins.length; i++) {
            if (poolCoins[i] != resolvedCoins[i]) {
                shouldContinue = true;
                break;
            }
        }

        if (shouldContinue) continue;

        return poolAddress;
    }
}

// export function handleBasePoolAdded(event: BasePoolAdded): void {
//     getOrCreatePool(event.params.base_pool, null, null);
// }

export function handlePlainPoolDeployed(event: PlainPoolDeployed): void {
    let poolAddress = getPoolAddressFromCoins(event.params.coins);
    getOrCreatePool(poolAddress, poolAddress, null);
}

export function handleMetaPoolDeployed(event: MetaPoolDeployed): void {
    let lpTokenAddress = getPoolLpTokenAddressOrThrow(event.params.base_pool);
    let poolAddress = StableSwapNgFactoryContract.find_pool_for_coins1(
        event.params.coin,
        lpTokenAddress,
    );
    if (poolAddress == ADDRESS_ZERO)
        throw new Error(
            `Could not find metapool with token ${event.params.coin.toHex()} and base pool ${event.params.base_pool.toHex()}`,
        );

    getOrCreatePool(poolAddress, poolAddress, event.params.base_pool);
}

export function handleLiquidityGaugeDeployed(
    event: LiquidityGaugeDeployed,
): void {
    createGauge(event.params.gauge);
}
