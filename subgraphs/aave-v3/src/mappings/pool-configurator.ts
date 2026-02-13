import { dataSource, DataSourceContext } from "@graphprotocol/graph-ts";
import {
    ReserveActive,
    ReserveInitialized,
} from "../../generated/templates/PoolConfigurator/PoolConfigurator";
import {
    DATA_SOURCE_CONTEXT_KEY_POOL,
    DATA_SOURCE_CONTEXT_KEY_ASSET,
    getOrCreateReserve,
    getReserveOrThrow,
} from "../commons";
import { AToken } from "../../generated/templates";

export function handleReserveInitialized(event: ReserveInitialized): void {
    const context = dataSource.context();
    const pool = context.getBytes(DATA_SOURCE_CONTEXT_KEY_POOL);

    const reserve = getOrCreateReserve(
        pool,
        event.params.asset,
        event.params.aToken,
        event.params.variableDebtToken,
        event.params.stableDebtToken,
    );

    const tokenContext = new DataSourceContext();
    tokenContext.setBytes(DATA_SOURCE_CONTEXT_KEY_POOL, pool);
    tokenContext.setBytes(DATA_SOURCE_CONTEXT_KEY_ASSET, event.params.asset);

    AToken.createWithContext(event.params.aToken, tokenContext);
    AToken.createWithContext(event.params.variableDebtToken, tokenContext);
    if (reserve.sToken !== null)
        AToken.createWithContext(event.params.stableDebtToken, tokenContext);
}

export function handleReserveActive(event: ReserveActive): void {
    const reserve = getReserveOrThrow(
        dataSource.context().getBytes(DATA_SOURCE_CONTEXT_KEY_POOL),
        event.params.asset,
    );
    reserve.active = event.params.active;
    reserve.save();
}
