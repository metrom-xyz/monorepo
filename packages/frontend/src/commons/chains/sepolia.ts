import { EthLogo } from "../../assets/logos/chains/eth";
import { SupportedChain, ADDRESS } from "@metrom-xyz/contracts";
import { type ChainData } from "../index";
import { sepolia } from "viem/chains";
import { SupportedDex, SupportedLiquityV2, TargetType } from "@metrom-xyz/sdk";
import { LiquityLogo } from "@/src/assets/logos/liquity-v2-platforms/liquity";
import { ProtocolType, DepositUrlType } from "@/src/types/protocol";
import { EbisuLogo } from "@/src/assets/logos/liquity-v2-platforms/ebisu";
import { CarbonLogo } from "@/src/assets/logos/dexes/carbon";

export const sepoliaData: ChainData = {
    testnet: true,
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
                [TargetType.LiquityV2Debt]:
                    "https://liquity2-sepolia.vercel.app/borrow",
                [TargetType.LiquityV2StabilityPool]:
                    "https://liquity2-sepolia.vercel.app/earn",
            },
        },
        {
            type: ProtocolType.Dex,
            slug: SupportedDex.Carbon,
            logo: CarbonLogo,
            name: "Carbon DeFi",
            depositUrl: {
                type: DepositUrlType.QueryTokenAddresses,
                template:
                    "https://app.carbondefi.xyz/trade/disposable?base={token0}&quote={token1}",
            },
            supportsFetchAllPools: true,
        },
    ],
    baseTokens: [],
};
