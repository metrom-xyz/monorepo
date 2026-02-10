import { Curve as CurveTemplate } from "../../generated/templates";
import { NewCurve as NewCurveEvent } from "../../generated/CurveFactoryV2/CurveFactoryV2";
import { Curve as CurveContract } from "../../generated/templates/Curve/Curve";
import { BD_0, BI_0, BI_1, BI_2, getOrCreateToken } from "../commons";
import { log } from "@graphprotocol/graph-ts";
import { Pool } from "../../generated/schema";

export function handleNewCurve(event: NewCurveEvent): void {
    const contract = CurveContract.bind(event.params.curve);

    const token0 = getOrCreateToken(contract.numeraires(BI_0));
    if (token0 === null) {
        log.warning(
            "Could not resolve token 0 for curve with address {}, skipping",
            [event.address.toHex()],
        );
        return;
    }

    const token1 = getOrCreateToken(contract.numeraires(BI_1));
    if (token1 === null) {
        log.warning(
            "Could not resolve token 1 for curve with address {}, skipping",
            [event.address.toHex()],
        );
        return;
    }

    if (!contract.try_numeraires(BI_2).reverted) {
        log.warning("Curve with address {} has more than 2 tokens, skipping", [
            event.address.toHex(),
        ]);
        return;
    }

    const pool = new Pool(event.params.curve);
    pool.token0 = token0.id;
    pool.token1 = token1.id;
    pool.token0Tvl = BI_0;
    pool.token1Tvl = BI_0;
    pool.price = BD_0;
    pool.liquidity = BI_0;
    pool._tvlsUpdatedAtBlock = BI_0;
    pool.save();

    CurveTemplate.create(event.params.curve);
}
