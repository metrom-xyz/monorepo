import { type TokenList } from "@uniswap/token-lists";
import { type Address } from "viem";
import { writeFileSync } from "node:fs";
import { SupportedChain } from "@metrom-xyz/contracts";

enum SupportedTestnet {
    Holesky = SupportedChain.Holesky,
    CeloAlfajores = SupportedChain.CeloAlfajores,
    MantleSepolia = SupportedChain.MantleSepolia,
    SonicTestnet = SupportedChain.SonicTestnet,
}

enum SupportedMainnet {
    Mode = SupportedChain.Mode,
    Mantle = SupportedChain.Mantle,
}

type TokenIcons = Record<number, Record<Address, string>>;

const TOKEN_LIST_URLS = [
    "https://raw.githubusercontent.com/ethereum-optimism/ethereum-optimism.github.io/refs/heads/master/optimism.tokenlist.json",
    "https://tokens.coingecko.com/uniswap/all.json",
];

const testnetIcons: TokenIcons = {
    [SupportedTestnet.CeloAlfajores]: {
        ["0xf194afdf50b03e69bd7d057c1aa9e10c9954e4c9".toLowerCase()]:
            "https://assets.coingecko.com/coins/images/11090/standard/InjXBNx9_400x400.jpg?1696511031",
        ["0x10c892a6ec43a53e45d0b916b4b7d383b1b78c0f".toLowerCase()]:
            "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/celo/assets/0xD8763CBa276a3738E6DE85b4b3bF5FDed6D6cA73/logo.png",
        ["0x2043d9aa54e333c52db22a8afbfcbdce35958f42".toLowerCase()]:
            "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png",
        ["0x22d8655b405f6a8d6bb7c5838aaf187a32158b07".toLowerCase()]:
            "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png",
    },
    [SupportedTestnet.Holesky]: {
        ["0x94373a4919b3240d86ea41593d5eba789fef3848".toLowerCase()]:
            "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png",
        ["0x0fe5a93b63accf31679321dd0daf341c037a1187".toLowerCase()]:
            "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png",
        ["0xa5ba8636a78bbf1910430d0368c0175ef5a1845b".toLowerCase()]:
            "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png",
    },
    [SupportedTestnet.MantleSepolia]: {
        ["0xb1eda18c1b730a973dac2ec37cfd5685d7de10dd".toLowerCase()]:
            "https://assets.coingecko.com/coins/images/30980/standard/token-logo.png?1696529819",
        ["0xc8e265d4c037b0e0641c84b440ab260f4fdafd24".toLowerCase()]:
            "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png",
        ["0xd1d3cf05ef211c71056f0af1a7fd1df989e109c3".toLowerCase()]:
            "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png",
    },
};

const mainnetIcons: TokenIcons = {
    [SupportedMainnet.Mode]: {
        ["0x4200000000000000000000000000000000000006".toLowerCase()]:
            "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png",
    },
    [SupportedMainnet.Mantle]: {
        ["0x78c1b0c915c4faa5fffa6cabf0219da63d7f4cb8".toLowerCase()]:
            "https://assets.coingecko.com/coins/images/30980/standard/token-logo.png?1696529819",
        ["0xdeaddeaddeaddeaddeaddeaddeaddeaddead1111".toLowerCase()]:
            "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png",
        ["0x09bc4e0d864854c6afb6eb9a9cdf58ac190d0df9".toLowerCase()]:
            "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png",
        ["0x201eba5cc46d216ce6dc03f6a759e8e766e956ae".toLowerCase()]:
            "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png",
    },
};

const promises = TOKEN_LIST_URLS.map(async (url) => {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`${url}: ${await response.text()}`);
    return (await response.json()) as TokenList;
});

const results = await Promise.allSettled(promises);

for (const result of results) {
    if (result.status === "rejected") {
        console.warn(`Could not fetch token list: ${result.reason}`);
    } else {
        for (const token of result.value.tokens) {
            if (!token.logoURI) continue;

            let list;
            if (token.chainId in SupportedTestnet) list = testnetIcons;
            else if (token.chainId in SupportedMainnet) list = mainnetIcons;
            else continue;

            const tokenKey = token.address.toLowerCase() as Address;
            if (!list[token.chainId]) list[token.chainId] = {};

            list[token.chainId][tokenKey] = token.logoURI;
        }
    }
}

writeFileSync("./testnet-icons.json", JSON.stringify(testnetIcons));
writeFileSync("./mainnet-icons.json", JSON.stringify(mainnetIcons));
