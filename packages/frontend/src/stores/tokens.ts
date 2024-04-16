import { TOKEN_LISTS } from "@/commons";
import type { TokenInfo, TokenList } from "@uniswap/token-lists";
import { useStorage, type RemovableRef } from "@vueuse/core";
import dayjs from "dayjs";
import { defineStore } from "pinia";

interface TokensState {
    expiration: number;
    list: Record<string, TokenInfo>;
}

const TOKEN_STORE_NAME = "tokens";

export const useTokens = defineStore(TOKEN_STORE_NAME, {
    state: (): { tokens: RemovableRef<TokensState> } => ({
        tokens: useStorage<TokensState>(
            "tokens.state",
            {
                expiration: 0,
                list: {},
            },
            localStorage,
            { mergeDefaults: true },
        ),
    }),
    getters: {
        getToken: (state) => {
            return (address: string) =>
                state.tokens.list[address.toLowerCase()];
        },
        getTokens: (state) => {
            return (chainId: number) =>
                Object.values(state.tokens.list).filter(
                    (token) => token.chainId === chainId,
                );
        },
    },
    actions: {
        async fetchTokensLists() {
            if (
                this.tokens.expiration &&
                dayjs.unix(this.tokens.expiration).isAfter(dayjs())
            )
                return;

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
                                this.tokens.list[token.address.toLowerCase()] =
                                    token;
                            }
                        });
                    }
                });

            this.tokens.expiration = dayjs().add(1, "hour").unix();
        },
    },
});
