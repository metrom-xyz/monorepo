import type { FunctionComponent } from "react";
import type { ChainContract, Chain } from "viem";
import type { SVGIcon } from "./common";
import type { ChainType, Erc20Token } from "@metrom-xyz/sdk";
import type { Protocol } from "./protocol";
import { SupportedChain as SupportedChainEvm } from "@metrom-xyz/contracts";
import { SupportedChain as SupportedChainMvm } from "@metrom-xyz/aptos-contracts";
import { SupportedChain as SupportedChainSvm } from "@metrom-xyz/programs-solana";
import { katana, linea } from "viem/chains";
import { Form } from "./forms";

export type BaseErc20Token = Omit<Erc20Token, "details">;

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
    baseTokens: BaseErc20Token[];
}

export enum SupportedDevelopmentMvmChain {
    AptosTestnet = SupportedChainMvm.Testnet,
}

export enum SupportedProductionMvmChain {
    Aptos = SupportedChainMvm.Mainnet,
}

export enum SupportedDevelopmentEvmChain {
    Sepolia = SupportedChainEvm.Sepolia,
    BaseSepolia = SupportedChainEvm.BaseSepolia,
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
    MegaEth = SupportedChainEvm.MegaEth,
    Bsc = SupportedChainEvm.Bsc,
    Mainnet = SupportedChainEvm.Mainnet,
    // These are required for Turtle campaigns
    Katana = katana.id,
    Linea = linea.id,
}

export enum SupportedDevelopmentSvmChain {
    Devnet = SupportedChainSvm.Devnet,
}

export enum SupportedProductionSvmChain {
    // FIXME: add mainnet id
    Mainnet = 103,
}
