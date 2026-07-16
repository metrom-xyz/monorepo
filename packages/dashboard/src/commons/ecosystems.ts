import { ChainType } from "@metrom-xyz/sdk";
import type { FunctionComponent } from "react";
import { AptosLogo, EthLogo, type SVGIcon } from "@metrom-xyz/chains";

export interface Ecosystem {
    name: string;
    type: ChainType;
    icon: FunctionComponent<SVGIcon>;
}

export const ECOSYSTEMS: Ecosystem[] = [
    {
        name: "EVM",
        type: ChainType.Evm,
        icon: EthLogo,
    },
    {
        name: "Aptos",
        type: ChainType.Aptos,
        icon: AptosLogo,
    },
];
