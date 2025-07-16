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

export enum SupportedDevelopmentMvmChain {
    // TODO: use the chain id from the SupportedChain once added
    AptosTestnet = 2,
    // FIXME: aptos devnet chain id can't be hardcoded because it changes weekly, when Aptos resets the chain.
    // It's probably better to skip this chain and use the testnet directly.
    AptosDevnet = 195,
    Aptos = 1,
}

export enum SupportedProductionMvmChain {
    // TODO: use the chain id from the SupportedChain once added
    Aptos = 1,
}

export enum SupportedDevelopmentEvmChain {
    Holesky = SupportedChain.Holesky,
    Sepolia = SupportedChain.Sepolia,
    BaseSepolia = SupportedChain.BaseSepolia,
    // TODO: this is temporary as we are testing, remove this as soon as that is done
    Sei = SupportedChain.Sei,
    // TODO: this is temporary as we are testing, remove this as soon as that is done
    Swell = SupportedChain.Swell,
}

export enum SupportedProductionEvmChain {
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
