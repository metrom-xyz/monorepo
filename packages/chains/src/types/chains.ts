import type { FunctionComponent } from "react";
import type { ChainContract, Chain } from "viem";
import type { SVGIcon } from "./common";
import type { Erc20Token } from "@metrom-xyz/sdk";
import type { Protocol } from "./protocol";
import { SupportedChain } from "@metrom-xyz/contracts";
import { mainnet } from "viem/chains";

export interface ChainData {
    active: boolean;
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
    // TODO: this is temporary as we are testing, remove this as soon as that is done
    Sei = SupportedChain.Sei,
    // TODO: this is temporary as we are testing, remove this as soon as that is done
    Swell = SupportedChain.Swell,
}

export enum SupportedProductionChain {
    Base = SupportedChain.Base,
    Taiko = SupportedChain.Taiko,
    Scroll = SupportedChain.Scroll,
    Sonic = SupportedChain.Sonic,
    Gnosis = SupportedChain.Gnosis,
    Telos = SupportedChain.Telos,
    Lens = SupportedChain.Lens,
    LightLinkPhoenix = SupportedChain.LightLinkPhoenix,
    Lumia = SupportedChain.Lumia,
    // This is required for the Turtle integration
    Mainnet = mainnet.id,
    Sei = SupportedChain.Sei,
    Swell = SupportedChain.Swell,
    Hemi = SupportedChain.Hemi,
}
