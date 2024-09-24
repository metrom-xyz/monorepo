"use client";

import { createContext, type ReactNode } from "react";
import { type Address } from "viem";
import { useQuery } from "@tanstack/react-query";
import { TOKEN_ICONS_URL } from "../commons";

type TokenIcons = Record<number, Record<Address, string>>;

interface TokenIconsContext {
    loading: boolean;
    icons?: TokenIcons;
}

export const TokenIconsContext = createContext<TokenIconsContext>({
    loading: false,
    icons: {},
});

interface TokenIconsProviderProps {
    children: ReactNode;
}

export function TokenIconsProvider({ children }: TokenIconsProviderProps) {
    const { data: icons, isPending: loading } = useQuery({
        queryKey: ["tokenIcons"],
        queryFn: async () => {
            let response;
            try {
                response = await fetch(TOKEN_ICONS_URL);
                if (!response.ok) throw new Error(await response.text());
                return (await response.json()) as TokenIcons;
            } catch (error) {
                console.warn(`Could not fetch token icons: ${error}`);
            }
        },
        staleTime: 86400000, // 1 day
    });

    return (
        <TokenIconsContext.Provider value={{ icons, loading }}>
            {children}
        </TokenIconsContext.Provider>
    );
}
