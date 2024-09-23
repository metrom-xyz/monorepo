import { useMemo } from "react";
import { QueryClient, useQuery } from "@tanstack/react-query";
import { persistQueryClient } from "@tanstack/react-query-persist-client";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";

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
    const response = await fetch(url);
    const data = await response.json();
    return data.tokens;
};

export const useTokenLogoStorage = () => {
    const { data: tokenLists } = useQuery({
        queryKey: ["tokenLists"],
        queryFn: async () => {
            const allTokens: Token[] = [];
            for (const url of TOKEN_LIST_URLS) {
                const tokens = await fetchTokenList(url);
                allTokens.push(...tokens);
            }
            return allTokens;
        },
        staleTime: 24 * 60 * 60 * 1000,
    });

    const tokenLogoMap = useMemo(() => {
        if (tokenLists) {
            const tokenMap: Record<string, string> = {};
            tokenLists.forEach((token) => {
                const key = `${token.address.toLowerCase()}-${token.chainId}`;
                tokenMap[key] = token.logoURI;
            });
            return tokenMap;
        }
    }, [tokenLists]);

    return tokenLogoMap;
};

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            gcTime: 24 * 60 * 60 * 1000,
        },
    },
});

const localStoragePersistor = createSyncStoragePersister({
    storage: typeof window !== "undefined" ? window.localStorage : null,
});

persistQueryClient({
    queryClient: queryClient,
    persistor: localStoragePersistor,
    dehydrateOptions: {
        shouldDehydrateQuery: (query) => {
            return query.queryKey[0] === "tokenLists";
        },
    },
});
