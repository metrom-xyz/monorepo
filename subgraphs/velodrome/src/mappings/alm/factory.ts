import { DataSourceContext } from "@graphprotocol/graph-ts";
import { StrategyCreated } from "../../../generated/AlmFactory/AlmFactory";
import { AlmLpWrapper as AlmLpWrapperContract } from "../../../generated/templates/AlmLpWrapper/AlmLpWrapper";
import { AlmStrategy } from "../../../generated/schema";
import { AlmLpWrapper as AlmLpWrapperTemplate } from "../../../generated/templates";
import {
    AlmCoreContract,
    BI_0,
    getConcentratedPositionOrThrow,
} from "../../commons";

export function handleStrategyCreated(event: StrategyCreated): void {
    let lpWrapper = new AlmStrategy(event.params.params.lpWrapper);
    lpWrapper.liquidity = BI_0;
    lpWrapper.pool = event.params.params.pool;
    lpWrapper.save();

    const contract = AlmLpWrapperContract.bind(event.params.params.lpWrapper);

    const result = AlmCoreContract.managedPositionAt(contract.positionId());

    for (let i = 0; i < result.ammPositionIds.length; i++) {
        const position = getConcentratedPositionOrThrow(
            result.ammPositionIds[i],
        );
        position.almStrategy = event.params.params.lpWrapper;
        position.save();
    }

    let context = new DataSourceContext();
    context.setBytes("pool", event.params.params.pool);

    AlmLpWrapperTemplate.createWithContext(
        event.params.params.lpWrapper,
        context,
    );
}
