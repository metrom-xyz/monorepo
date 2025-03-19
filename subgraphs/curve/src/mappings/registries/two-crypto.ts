import { Address, BigInt } from "@graphprotocol/graph-ts";
import {
    CryptoPoolDeployed,
    LiquidityGaugeDeployed,
    TwoCryptoFactory,
} from "../../../generated/TwoCryptoFactory/TwoCryptoFactory";
import { ADDRESS_ZERO, createGauge, getOrCreatePool } from "../../commons";
import { TWO_CRYPTO_FACTORY_ADDRESS } from "../../constants";

let TwoCryptoRegistryContract = TwoCryptoFactory.bind(
    TWO_CRYPTO_FACTORY_ADDRESS,
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
        let poolAddress = TwoCryptoRegistryContract.find_pool_for_coins(
            resolvedCoins[0],
            resolvedCoins[1],
            BigInt.fromI32(i),
        );
        if (poolAddress == ADDRESS_ZERO)
            throw new Error(
                `Could not fetch pool address from coins ${resolvedCoins[0].toHex()} and ${resolvedCoins[1].toHex()} with index ${i}`,
            );

        let onChainPoolCoins = TwoCryptoRegistryContract.get_coins(poolAddress);
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
