// import { SupportedChain, ADDRESS } from "@metrom-xyz/contracts";
// import { ArtheraLogo } from "@/src/assets/logos/chains/arthera";
// import { type ChainData } from "..";
// import { defineChain } from "viem";
// import { SupportedDex } from "@metrom-xyz/sdk";
// import { ThirdTradeLogo } from "@/src/assets/logos/dexes/thirdtrade";
// import { ProtocolType } from "@/src/types";

// export const arthera = defineChain({
//     id: 10_242,
//     name: "Arthera",
//     nativeCurrency: {
//         decimals: 18,
//         name: "AA",
//         symbol: "AA",
//     },
//     rpcUrls: {
//         default: {
//             http: ["https://rpc.arthera.net"],
//         },
//     },
//     blockExplorers: {
//         default: {
//             name: "Arthera",
//             url: "https://explorer.arthera.net",
//         },
//     },
//     contracts: {
//         multicall3: {
//             address: "0xcA11bde05977b3631167028862bE2a173976CA11",
//             blockCreated: 4_502_791,
//         },
//     },
// });

// export const artheraData: ChainData = {
//     name: arthera.name,
//     metromContract: ADDRESS[SupportedChain.Arthera],
//     blockExplorers: {
//         default: {
//             name: "Arthera",
//             url: "https://explorer.arthera.net",
//         },
//     },
//     icon: ArtheraLogo,
//     protocols: {
//         [ProtocolType.Dex]: [
//             {
//                 slug: SupportedDex.ThirdTrade,
//                 logo: ThirdTradeLogo,
//                 name: "Third Trade",
//                 addLiquidityUrl: "https://third.trade/pool/{target_pool}",
//                 supportsFetchAllPools: true,
//             },
//         ],
//         [ProtocolType.LiquityV2Brand]: [],
//     },
//     baseTokens: [
//         {
//             address: "0x69D349E2009Af35206EFc3937BaD6817424729F7",
//             decimals: 18,
//             name: "Wrapped Arthera",
//             symbol: "WAA",
//         },
//         {
//             address: "0x6C45E28A76977a96e263f84F95912B47F927B687",
//             decimals: 6,
//             name: "Tether USD",
//             symbol: "USDT",
//         },
//         {
//             address: "0x8C4aCd74Ff4385f3B7911432FA6787Aa14406f8B",
//             decimals: 6,
//             name: "USDC",
//             symbol: "USDC",
//         },
//     ],
// };
