import {
    TwocryptoPoolDeployed,
    LiquidityGaugeDeployed,
} from "../../../generated/TwoCryptoNGFactory/TwoCryptoNGFactory";
import { createGauge, getOrCreatePool } from "../../commons";

export function handleTwocryptoPoolDeployed(
    event: TwocryptoPoolDeployed,
): void {
    getOrCreatePool(event.params.pool, event.params.pool, null);
}

export function handleLiquidityGaugeDeployed(
    event: LiquidityGaugeDeployed,
): void {
    createGauge(event.params.gauge);
}
