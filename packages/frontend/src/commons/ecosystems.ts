import { ChainType, Environment } from "@metrom-xyz/sdk";
import type { FunctionComponent } from "react";
import { AptosLogo, EthLogo, SolanaLogo, SuiLogo } from "@metrom-xyz/chains";
import type { SVGIcon } from "@/src/types/common";
import { ENVIRONMENT } from "./env";

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
    // TODO: enable Solana and Sui in production once they are supported
    ...(ENVIRONMENT === Environment.Production
        ? []
        : [
              {
                  name: "Solana",
                  type: ChainType.Svm,
                  icon: SolanaLogo,
              },
              {
                  name: "Sui",
                  type: ChainType.Sui,
                  icon: SuiLogo,
              },
          ]),
];
