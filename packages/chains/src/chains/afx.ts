import { ChainType, SupportedAfxVault } from "@metrom-xyz/sdk";
import { AfxLogo } from "../assets";
import { ChainData } from "../types/chains";
import { zeroAddress } from "viem";
import { ProtocolType } from "../types/protocol";

export const afxData: ChainData = {
    active: true,
    id: 9999,
    type: ChainType.Evm,
    name: "Afx",
    slug: "afx",
    metromContract: {
        address: zeroAddress,
    },
    blockExplorers: {
        default: {
            name: "Aptos Explorer",
            url: "https://explorer.aptoslabs.com",
        },
    },
    icon: AfxLogo,
    forms: [],
    protocols: [
        {
            active: true,
            type: ProtocolType.AfxVault,
            slug: SupportedAfxVault.Afx,
            logo: AfxLogo,
            name: "AFX Vault",
        },
    ],
    baseTokens: [],
};
