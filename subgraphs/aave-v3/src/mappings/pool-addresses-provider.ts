import { DataSourceContext } from "@graphprotocol/graph-ts";
import { LendingPool, PoolConfigurator } from "../../generated/templates";
import { ProxyCreated } from "../../generated/templates/PoolAddressesProvider/PoolAddressesProvider";
import { DATA_SOURCE_CONTEXT_KEY_POOL } from "../commons";

export function handleProxyCreated(event: ProxyCreated): void {
    const newProxyAddress = event.params.proxyAddress;
    const contractId =  event.params.id.toString();

    if (contractId == "POOL_CONFIGURATOR") {
        const context = new DataSourceContext();
        context.setBytes(DATA_SOURCE_CONTEXT_KEY_POOL, event.address);
        PoolConfigurator.createWithContext(newProxyAddress, context);
    } else if (contractId == "POOL") {
        const context = new DataSourceContext();
        context.setBytes(DATA_SOURCE_CONTEXT_KEY_POOL, event.address);
        LendingPool.createWithContext(newProxyAddress, context);
    }
}
