import { DataSourceContext } from "@graphprotocol/graph-ts";
import { StrategyCreated } from "../../../generated/AlmFactory/AlmFactory";
import { AlmLpWrapper as AlmLpWrapperContract } from "../../../generated/templates/AlmLpWrapper/AlmLpWrapper";
import { AlmLpWrapper } from "../../../generated/schema";
import { AlmLpWrapper as AlmLpWrapperTemplate } from "../../../generated/templates";
import {
    AlmCoreContract,
    BI_0,
    getConcentratedPositionOrThrow,
} from "../../commons";

export function handleStrategyCreated(event: StrategyCreated): void {
    let lpWrapper = new AlmLpWrapper(event.params.params.lpWrapper);
    lpWrapper.liquidity = BI_0;
    lpWrapper.pool = event.params.params.pool;
    lpWrapper.save();

    const contract = AlmLpWrapperContract.bind(event.params.params.lpWrapper);

    const result = AlmCoreContract.managedPositionAt(contract.positionId());

    for (let i = 0; i < result.ammPositionIds.length; i++) {
        const position = getConcentratedPositionOrThrow(
            result.ammPositionIds[i],
        );
        position.alm = true;
        position.save();
    }

    let context = new DataSourceContext();
    context.setBytes("pool", event.params.params.pool);

    AlmLpWrapperTemplate.createWithContext(
        event.params.params.lpWrapper,
        context,
    );
}
