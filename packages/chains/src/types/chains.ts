import type { FunctionComponent } from "react";
import type { ChainContract, Chain } from "viem";
import type { SVGIcon } from "./common";
import type { ChainType, Erc20Token } from "@metrom-xyz/sdk";
import type { Protocol } from "./protocol";
import { SupportedChain as SupportedChainEvm } from "@metrom-xyz/contracts";
import { SupportedChain as SupportedChainMvm } from "@metrom-xyz/aptos-contracts";
import { katana, linea, mainnet } from "viem/chains";
import { Form } from "./forms";

export interface ChainData {
    id: number;
    type: ChainType;
    active: boolean;
    name: string;
    slug: string;
    metromContract: ChainContract;
    blockExplorers: Chain["blockExplorers"] | null;
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
    Sepolia = SupportedChainEvm.Sepolia,
    BaseSepolia = SupportedChainEvm.BaseSepolia,
    // TODO: this is temporary as we are testing, remove this as soon as that is done
    Sei = SupportedChainEvm.Sei,
    // TODO: this is temporary as we are testing, remove this as soon as that is done
    Swell = SupportedChainEvm.Swell,
    // TODO: this is required for the Katana vault campaigns testing, remove this as soon as that is done
    Katana = katana.id,
}

export enum SupportedProductionEvmChain {
    ArbitrumOne = SupportedChainEvm.ArbitrumOne,
    Base = SupportedChainEvm.Base,
    Taiko = SupportedChainEvm.Taiko,
    Scroll = SupportedChainEvm.Scroll,
    Sonic = SupportedChainEvm.Sonic,
    Gnosis = SupportedChainEvm.Gnosis,
    Telos = SupportedChainEvm.Telos,
    Lens = SupportedChainEvm.Lens,
    LightLinkPhoenix = SupportedChainEvm.LightLinkPhoenix,
    Lumia = SupportedChainEvm.Lumia,
    Sei = SupportedChainEvm.Sei,
    Swell = SupportedChainEvm.Swell,
    Hemi = SupportedChainEvm.Hemi,
    Plasma = SupportedChainEvm.Plasma,
    Saga = SupportedChainEvm.Saga,
    // This is required for the Turtle integration
    Mainnet = mainnet.id,
    // These are required for Turtle campaigns
    Katana = katana.id,
    Linea = linea.id,
}
