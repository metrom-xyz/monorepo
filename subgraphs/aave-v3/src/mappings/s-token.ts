import { Burn, Mint } from "../../generated/templates/SToken/SToken";
import { processRebasingTokenBalanceChange } from "../commons";

export function handleMint(event: Mint): void {
    processRebasingTokenBalanceChange(
        event.params.onBehalfOf,
        event.params.amount,
        event.params.balanceIncrease,
        null,
        event,
    );
}

export function handleBurn(event: Burn): void {
    processRebasingTokenBalanceChange(
        event.params.from,
        event.params.amount.neg(),
        event.params.balanceIncrease,
        null,
        event,
    );
}
