import { EthLogo } from "../../assets/logos/chains/eth";
import { SupportedChain, ADDRESS } from "@metrom-xyz/contracts";
import { type ChainData } from "../index";
import { sepolia } from "viem/chains";
import { SupportedLiquityV2, TargetType } from "@metrom-xyz/sdk";
import { LiquityLogo } from "@/src/assets/logos/liquity-v2-platforms/liquity";
import { ProtocolType } from "@/src/types";

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
            actionUrls: {
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
