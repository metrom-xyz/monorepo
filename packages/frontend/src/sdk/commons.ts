import CeloIcon from "@/icons/CeloIcon.vue";
import UniswapLogoIcon from "@/icons/UniswapLogoIcon.vue";
import type { ChainData } from "@/types";
import {
    ADDRESS,
    SupportedChain as MetromChainId,
} from "@metrom-xyz/contracts";
import { markRaw } from "vue";

export const CHAIN_DATA: Record<MetromChainId, ChainData> = {
    [MetromChainId.CeloAlfajores]: {
        icon: {
            // FIXME: use better icon
            logo: markRaw(CeloIcon),
            backgroundColor: "#213147",
        },
        contracts: {
            factory: ADDRESS[MetromChainId.CeloAlfajores],
        },
        subgraphUrl:
            "https://api.studio.thegraph.com/query/68570/metrom-celo-alfajores/version/latest",
        amms: [
            {
                slug: "univ3",
                // FIXME: use better icon
                logo: markRaw(UniswapLogoIcon),
                name: "Uniswap v3",
                subgraphUrl:
                    "https://api.studio.thegraph.com/query/68570/metrom-uni-v3-celo-alfajores/version/latest",
            },
        ],
    },
};
