import type { FunctionComponent } from "react";
import type { ChainContract, Chain } from "viem";
import type { SVGIcon } from "./common";
import type { Erc20Token } from "@metrom-xyz/sdk";
import type { Protocol } from "./protocol";
import { SupportedChain as SupportedChainEvm } from "@metrom-xyz/contracts";
import { SupportedChain as SupportedChainMvm } from "@metrom-xyz/aptos-contracts";
import { mainnet } from "viem/chains";
import { Form } from "./forms";

export interface ChainData {
    active: boolean;
    name: string;
    metromContract: ChainContract;
    blockExplorers: Chain["blockExplorers"];
    icon: FunctionComponent<SVGIcon>;
    forms: Form[];
    protocols: Protocol[];
    baseTokens: Erc20Token[];
}

export enum SupportedDevelopmentMvmChain {
    AptosMainnet = SupportedChainMvm.Mainnet,
    AptosTestnet = SupportedChainMvm.Testnet,
}

export enum SupportedProductionMvmChain {
    Aptos = SupportedChainMvm.Mainnet,
}

export enum SupportedDevelopmentEvmChain {
    Holesky = SupportedChainEvm.Holesky,
    Sepolia = SupportedChainEvm.Sepolia,
    BaseSepolia = SupportedChainEvm.BaseSepolia,
    // TODO: this is temporary as we are testing, remove this as soon as that is done
    Sei = SupportedChainEvm.Sei,
    // TODO: this is temporary as we are testing, remove this as soon as that is done
    Swell = SupportedChainEvm.Swell,
}

export enum SupportedProductionEvmChain {
    Base = SupportedChainEvm.Base,
    Taiko = SupportedChainEvm.Taiko,
    Scroll = SupportedChainEvm.Scroll,
    Sonic = SupportedChainEvm.Sonic,
    Gnosis = SupportedChainEvm.Gnosis,
    Telos = SupportedChainEvm.Telos,
    Lens = SupportedChainEvm.Lens,
    LightLinkPhoenix = SupportedChainEvm.LightLinkPhoenix,
    Lumia = SupportedChainEvm.Lumia,
    // This is required for the Turtle integration
    Mainnet = mainnet.id,
    Sei = SupportedChainEvm.Sei,
    Swell = SupportedChainEvm.Swell,
    Hemi = SupportedChainEvm.Hemi,
}
