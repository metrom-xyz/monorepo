import { SupportedChain, SupportedAmm } from "@metrom-xyz/sdk";
import { EthLogo } from "../../assets/logos/chains/eth";
import { AlgebraIntegralLogo } from "../../assets/logos/amms/algebra-integral";
import { ADDRESS } from "@metrom-xyz/contracts";
import { type ChainData } from "../index";
import { ENVIRONMENT } from "../env";

export const holeskyData: ChainData = {
    metromContract: ADDRESS[ENVIRONMENT][SupportedChain.Holesky]!,
    icon: EthLogo,
    amms: [
        {
            slug: SupportedAmm.TestIntegral,
            logo: AlgebraIntegralLogo,
            name: "Algebra integral",
            addLiquidityUrl:
                "https://integral.algebra.finance/pool/{target_pool}/new-position",
            poolExplorerUrl:
                "https://integral.algebra.finance/pool/{target_pool}",
        },
    ],
    baseTokens: [
        {
            address: "0x94373a4919b3240d86ea41593d5eba789fef3848",
            decimals: 18,
            name: "Wrapped Ether",
            symbol: "WETH",
        },
        {
            address: "0x7d98346b3b000c55904918e3d9e2fc3f94683b01",
            decimals: 18,
            name: "USDT",
            symbol: "USDT",
        },
    ],
};
