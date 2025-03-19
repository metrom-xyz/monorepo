import { Address, BigInt } from "@graphprotocol/graph-ts";
import {
    BasePoolAdded,
    LiquidityGaugeDeployed,
    MetaPoolDeployed,
    MetapoolFactory,
    PlainPoolDeployed,
} from "../../../generated/MetapoolFactory/MetapoolFactory";
import { ADDRESS_ZERO, createGauge, getOrCreatePool } from "../../commons";
import { METAPOOL_FACTORY_ADDRESS } from "../../constants";
import { LpToken, Pool } from "../../../generated/schema";

let MetapoolFactoryContract = MetapoolFactory.bind(METAPOOL_FACTORY_ADDRESS);

function getPoolAddressFromCoins(coins: Address[]): Address {
    let i = 0;
    while (true) {
        let poolAddress = MetapoolFactoryContract.find_pool_for_coins1(
            coins[0],
            coins[1],
            BigInt.fromI32(i++),
        );
        if (poolAddress == ADDRESS_ZERO)
            throw new Error(
                `Could not fetch pool address from coins ${coins[0].toHex()} and ${coins[1].toHex()} with index ${i - 1}`,
            );
        if (Pool.load(poolAddress) !== null) continue;

        let onChainPoolCoins = MetapoolFactoryContract.get_coins(poolAddress);
        let poolCoins: Address[] = [];
        for (let i = 0; i < onChainPoolCoins.length; i++)
            if (onChainPoolCoins[i] == ADDRESS_ZERO) {
                break;
            } else {
                poolCoins.push(onChainPoolCoins[i]);
            }

        if (poolCoins.length !== coins.length) continue;

        let shouldContinue = false;
        for (let i = 0; i < poolCoins.length; i++) {
            if (poolCoins[i] !== coins[i]) {
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

    let poolAddress = MetapoolFactoryContract.find_pool_for_coins(
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
