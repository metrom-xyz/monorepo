import { zeroAddress } from "viem";
import { KatanaLogo, type ChainData } from "..";
import { katana } from "viem/chains";

export const katanaData: ChainData = {
    active: false,
    name: katana.name,
    metromContract: {
        address: zeroAddress,
    },
    blockExplorers: null,
    icon: KatanaLogo,
    forms: [],
    protocols: [],
    baseTokens: [],
};
