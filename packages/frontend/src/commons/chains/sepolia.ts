import { EthLogo } from "../../assets/logos/chains/eth";
import { SupportedChain, ADDRESS } from "@metrom-xyz/contracts";
import { type ChainData } from "../index";
import { sepolia } from "viem/chains";
import { SupportedLiquityV2, TargetType } from "@metrom-xyz/sdk";
import { LiquityLogo } from "@/src/assets/logos/liquity-v2-platforms/liquity";
import { ProtocolType } from "@/src/types";
import { EbisuLogo } from "@/src/assets/logos/liquity-v2-platforms/ebisu";

export const sepoliaData: ChainData = {
    name: sepolia.name,
    metromContract: ADDRESS[SupportedChain.Sepolia],
    blockExplorers: sepolia.blockExplorers,
    icon: EthLogo,
    protocols: [
        {
            type: ProtocolType.LiquityV2,
            slug: SupportedLiquityV2.Liquity,
            logo: LiquityLogo,
            name: "Liquity",
            debtToken: {
                address: "0xb01d32c05f4aa066eef2bfd4d461833fddd56d0a",
                decimals: 18,
                name: "Bold Stablecoin",
                symbol: "BOLD",
            },
            actionUrls: {
                [TargetType.LiquityV2Debt]:
                    "https://liquity2-sepolia.vercel.app/borrow",
                [TargetType.LiquityV2Collateral]:
                    "https://liquity2-sepolia.vercel.app/leverage",
                [TargetType.LiquityV2StabilityPool]:
                    "https://liquity2-sepolia.vercel.app/earn",
            },
        },
        {
            type: ProtocolType.LiquityV2,
            slug: SupportedLiquityV2.Ebisu,
            logo: EbisuLogo,
            name: "Ebisu",
            debtToken: {
                address: "0xA4E721039da9e14332Fec14F98f463D92623149A",
                decimals: 18,
                name: "ebUSD",
                symbol: "ebUSD",
            },
            actionUrls: {
                // TODO: fix
                [TargetType.LiquityV2Debt]:
                    "https://liquity2-sepolia.vercel.app/borrow",
                [TargetType.LiquityV2Collateral]:
                    "https://liquity2-sepolia.vercel.app/leverage",
                [TargetType.LiquityV2StabilityPool]:
                    "https://liquity2-sepolia.vercel.app/earn",
            },
        },
    ],
    baseTokens: [],
};
