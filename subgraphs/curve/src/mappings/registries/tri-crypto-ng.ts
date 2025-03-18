import {
    TricryptoPoolDeployed,
    LiquidityGaugeDeployed,
} from "../../../generated/TriCryptoNGFactory/TriCryptoNGFactory";
import { createGauge, getOrCreatePool } from "../../commons";

export function handleTricryptoPoolDeployed(
    event: TricryptoPoolDeployed,
): void {
    getOrCreatePool(event.params.pool, event.params.pool, null);
}

export function handleLiquidityGaugeDeployed(
    event: LiquidityGaugeDeployed,
): void {
    createGauge(event.params.gauge);
}
