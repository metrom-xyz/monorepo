import { isAddress, type Address, getAddress } from "viem";
import { enforce } from "../utils/invariant";
import type { Token } from "./token";

export class Pair {
    public readonly address: Address;

    public constructor(
        address: Address,
        public readonly token0: Token,
        public readonly token1: Token,
    ) {
        enforce(isAddress(address), `${address} is not a valid address.`);
        this.address = getAddress(address);
    }
}
