import { EthLogo } from "../../assets/logos/chains/eth";
import { SupportedChain, ADDRESS } from "@metrom-xyz/contracts";
import { type ChainData } from "../index";
import { sepolia } from "viem/chains";
import { SupportedLiquityV2Brand } from "@metrom-xyz/sdk";
import { LiquityLogo } from "@/src/assets/logos/liquity-v2-platforms/liquity";
import { ProtocolType } from "@/src/types";

export const sepoliaData: ChainData = {
    name: sepolia.name,
    metromContract: ADDRESS[SupportedChain.Sepolia],
    blockExplorers: sepolia.blockExplorers,
    icon: EthLogo,
    protocols: {
        [ProtocolType.Dex]: [],
        [ProtocolType.LiquityV2Brand]: [
            {
                slug: SupportedLiquityV2Brand.Liquity,
                logo: LiquityLogo,
                name: "Liquity",
            },
        ],
    },
    baseTokens: [],
};
