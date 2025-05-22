import type { FunctionComponent } from "react";
import type { ChainContract, Chain } from "viem";
import type { SVGIcon } from "./common";
import type { Erc20Token } from "@metrom-xyz/sdk";
import type { Protocol } from "./protocol";
import { SupportedChain } from "@metrom-xyz/contracts";

export interface ChainData {
    testnet: boolean;
    name: string;
    metromContract: ChainContract;
    blockExplorers: Chain["blockExplorers"];
    icon: FunctionComponent<SVGIcon>;
    protocols: Protocol[];
    baseTokens: Erc20Token[];
}

export enum SupportedDevelopmentChain {
    Holesky = SupportedChain.Holesky,
    Sepolia = SupportedChain.Sepolia,
    BaseSepolia = SupportedChain.BaseSepolia,
    // TODO: this is temporary as we are testin, remove this as soon as that is done
    Sei = SupportedChain.Sei,
    // TODO: this is temporary as we are testin, remove this as soon as that is done
    Swell = SupportedChain.Swell,
}

export enum SupportedProductionChain {
    Mode = SupportedChain.Mode,
    Mantle = SupportedChain.Mantle,
    Base = SupportedChain.Base,
    Taiko = SupportedChain.Taiko,
    Scroll = SupportedChain.Scroll,
    Sonic = SupportedChain.Sonic,
    Form = SupportedChain.Form,
    Gnosis = SupportedChain.Gnosis,
    Telos = SupportedChain.Telos,
    LightLinkPhoenix = SupportedChain.LightLinkPhoenix,
    Sei = SupportedChain.Sei,
    Swell = SupportedChain.Swell,
}

export type SupportedChainData =
    | SupportedDevelopmentChain
    | SupportedProductionChain;
