import { useEffect } from "react";

interface Token {
    chainId: string;
    address: string;
    logoURI: string;
}

const TOKEN_LIST_URLS = [
    "https://raw.githubusercontent.com/mode-network/superchain-tokenlist/refs/heads/master/optimism.tokenlist.json",
    "https://raw.githubusercontent.com/mode-network/superbridge-token-lists/main/superchain.tokenlist.json",
    "https://raw.githubusercontent.com/mantlenetworkio/mantle-token-lists/refs/heads/main/mantle.tokenlist.json",
];

const fetchTokenList = async (url: string): Promise<Token[]> => {
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data.tokens;
    } catch (error) {
        console.error("Error fetching token list:", error);
        return [];
    }
};

const storeTokenLogos = (tokens: Token[]) => {
    const tokenLogoMap = JSON.parse(localStorage.getItem("tokenLogos") || "{}");

    tokens.forEach((token) => {
        const key = `${token.address.toLowerCase()}-${token.chainId}`;
        tokenLogoMap[key] = token.logoURI;
    });
    localStorage.setItem("tokenLogos", JSON.stringify(tokenLogoMap));
};

export const useTokenLogoStorage = () => {
    useEffect(() => {
        const fetchAndStoreLogos = async () => {
            const allTokens = [];

            for (const url of TOKEN_LIST_URLS) {
                const tokens = await fetchTokenList(url);
                allTokens.push(...tokens);
            }
            storeTokenLogos(allTokens);
        };

        fetchAndStoreLogos();
    }, []);
};
