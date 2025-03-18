import { Address, BigInt } from "@graphprotocol/graph-ts";
import {
    CryptoPoolDeployed,
    LiquidityGaugeDeployed,
    TwoCryptoFactory,
} from "../../../generated/TwoCryptoFactory/TwoCryptoFactory";
import { ADDRESS_ZERO, createGauge, getOrCreatePool } from "../../commons";
import { TWO_CRYPTO_FACTORY_ADDRESS } from "../../constants";
import { Pool } from "../../../generated/schema";

let TwoCryptoRegistryContract = TwoCryptoFactory.bind(
    TWO_CRYPTO_FACTORY_ADDRESS,
);

function getPoolAddressFromCoins(coins: Address[]): Address {
    let i = 0;
    while (true) {
        let poolAddress = TwoCryptoRegistryContract.find_pool_for_coins(
            coins[0],
            coins[1],
            BigInt.fromI32(i++),
        );
        if (poolAddress == ADDRESS_ZERO)
            throw new Error(`Could not fetch pool address from coins`);
        if (Pool.load(poolAddress) !== null) continue;

        let poolCoins = TwoCryptoRegistryContract.get_coins(poolAddress);
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

export function handleCryptoPoolDeployed(event: CryptoPoolDeployed): void {
    getOrCreatePool(
        getPoolAddressFromCoins(event.params.coins),
        event.params.token,
        null,
    );
}

export function handleLiquidityGaugeDeployed(
    event: LiquidityGaugeDeployed,
): void {
    createGauge(event.params.gauge);
}
