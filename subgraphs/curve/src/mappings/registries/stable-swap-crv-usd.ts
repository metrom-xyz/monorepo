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
import { LpToken, Pool } from "../../../generated/schema";

let StableSwapCrvUsdFactoryContract = StableSwapCrvUsdFactory.bind(
    STABLE_SWAP_CRV_USD_FACTORY_ADDRESS,
);

function getPoolAddressFromCoins(coins: Address[]): Address {
    let i = 0;
    while (true) {
        let poolAddress = StableSwapCrvUsdFactoryContract.find_pool_for_coins(
            coins[0],
            coins[1],
            BigInt.fromI32(i++),
        );
        if (poolAddress == ADDRESS_ZERO)
            throw new Error(`Could not fetch pool address from coins`);
        if (Pool.load(poolAddress) !== null) continue;

        let poolCoins = StableSwapCrvUsdFactoryContract.get_coins(poolAddress);
        if (poolCoins.length !== coins.length) continue;

        let shouldContinue = false;
        for (let i = 0; i < poolCoins.length; i++)
            if (poolCoins[i] !== coins[i]) {
                shouldContinue = true;
                break;
            }

        if (shouldContinue) continue;

        return poolAddress;
    }
}

// function fetchTokenAddresses(poolAddress: Address): Address[] {
//     let onChainTokens = StableSwapCrvUsdFactoryContract.get_coins(poolAddress);
//     let tokenAddresses: Address[] = [];
//     for (let i = 0; i < onChainTokens.length; i++)
//         if (onChainTokens[i] != ADDRESS_ZERO)
//             tokenAddresses.push(onChainTokens[i]);
//         else break;
//     return tokenAddresses;
// }

// function fetchTokenTvls(poolAddress: Address): BigInt[] {
//     let onChainTokenTvls =
//         StableSwapCrvUsdFactoryContract.get_balances(poolAddress);
//     let tokenTvls: BigInt[] = [];
//     for (let i = 0; i < onChainTokenTvls.length; i++)
//         if (!onChainTokenTvls[i].isZero()) tokenTvls.push(onChainTokenTvls[i]);
//         else break;
//     return tokenTvls;
// }

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
