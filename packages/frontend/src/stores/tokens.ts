import { TOKEN_LISTS } from "@/commons";
import type { TokenInfo, TokenList } from "@uniswap/token-lists";
import { useStorage } from "@vueuse/core";
import { defineStore } from "pinia";

const TOKEN_STORE_NAME = "tokens";

export const useTokens = defineStore(TOKEN_STORE_NAME, {
    state: () => ({
        tokens: useStorage(TOKEN_STORE_NAME, new Map<string, TokenInfo>()),
    }),
    getters: {
        getToken: (state) => {
            return (address: string) => state.tokens.get(address.toLowerCase());
        },
    },
    actions: {
        async fetchTokensLists() {
            // FIXME: improve token fetching
            if (this.tokens.size > 0) return;
            const tokenLists = await Promise.all(
                TOKEN_LISTS.map(async (url) => {
                    try {
                        const resp = await fetch(url);
                        return (await resp.json()) as TokenList;
                    } catch (error) {
                        console.warn("Could not load token list", url, error);
                    }
                }),
            );

            tokenLists
                .filter((list) => !!list)
                .forEach((list) => {
                    if (list && list.tokens.length > 0) {
                        list.tokens.forEach((token) => {
                            if (token.address && token.logoURI) {
                                this.tokens.set(
                                    token.address.toLowerCase(),
                                    token,
                                );
                            }
                        });
                    }
                });
        },
    },
});
