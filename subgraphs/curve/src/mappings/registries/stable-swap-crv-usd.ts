import { Address, BigInt } from "@graphprotocol/graph-ts";
import {
    BasePoolAdded,
    PlainPoolDeployed,
    MetaPoolDeployed,
    LiquidityGaugeDeployed,
    StableSwapCrvUsdFactory,
} from "../../../generated/StableSwapCrvUsdFactory/StableSwapCrvUsdFactory";
import { ADDRESS_ZERO, createGauge, getOrCreatePool } from "../../commons";
import { STABLE_SWAP_CRV_USD_FACTORY_ADDRESS } from "../../constants";
import { LpToken } from "../../../generated/schema";

let StableSwapCrvUsdFactoryContract = StableSwapCrvUsdFactory.bind(
    STABLE_SWAP_CRV_USD_FACTORY_ADDRESS,
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
        let poolAddress = StableSwapCrvUsdFactoryContract.find_pool_for_coins(
            resolvedCoins[0],
            resolvedCoins[1],
            BigInt.fromI32(i),
        );
        if (poolAddress == ADDRESS_ZERO)
            throw new Error(
                `Could not fetch pool address from coins ${resolvedCoins[0].toHex()} and ${resolvedCoins[1].toHex()} with index ${i}`,
            );

        let onChainPoolCoins =
            StableSwapCrvUsdFactoryContract.get_coins(poolAddress);
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

export function handleBasePoolAdded(event: BasePoolAdded): void {
    getOrCreatePool(event.params.base_pool, event.params.base_pool, null);
}

export function handlePlainPoolDeployed(event: PlainPoolDeployed): void {
    let poolAddress = getPoolAddressFromCoins(event.params.coins);
    getOrCreatePool(poolAddress, poolAddress, null);
}

export function handleMetaPoolDeployed(event: MetaPoolDeployed): void {
    let lpToken = LpToken.load(event.params.base_pool);
    if (lpToken === null)
        throw new Error(
            `Tried to create metapool with non-existent base pool ${event.params.base_pool.toHex()}`,
        );

    let poolAddress = StableSwapCrvUsdFactoryContract.find_pool_for_coins1(
        event.params.coin,
        changetype<Address>(lpToken.pool),
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
