import { cacheERC20Token, getCachedERC20Token } from "../utils/cache";
import type { Erc20Token } from "../entities";
import {
    erc20Abi,
    type Address,
    type PublicClient,
    erc20Abi_bytes32,
} from "viem";

export type FetchErc20TokensParams = {
    publicClient: PublicClient;
    addresses: Address[];
};

export class CoreClient {
    constructor() {}

    public async fetchErc20Tokens({
        publicClient,
        addresses,
    }: FetchErc20TokensParams): Promise<{ [address: Address]: Erc20Token }> {
        const chain = publicClient.chain;

        if (!chain) {
            throw new Error("missing chain");
        }

        const { cachedTokens, missingTokens } = addresses.reduce(
            (
                accumulator: {
                    cachedTokens: { [address: Address]: Erc20Token };
                    missingTokens: Address[];
                },
                address,
            ) => {
                const cachedToken = getCachedERC20Token(chain.id, address);
                if (!!cachedToken)
                    accumulator.cachedTokens[address] = cachedToken;
                else accumulator.missingTokens.push(address);
                return accumulator;
            },
            { cachedTokens: {}, missingTokens: [] },
        );
        if (missingTokens.length === 0) return cachedTokens;

        const result = await publicClient.multicall({
            multicallAddress: chain.contracts?.multicall3?.address,
            contracts: addresses.flatMap((address) => [
                { address, abi: erc20Abi, functionName: "name" },
                {
                    address,
                    abi: erc20Abi,
                    functionName: "symbol",
                },
                {
                    address,
                    abi: erc20Abi,
                    functionName: "decimals",
                },
                {
                    address,
                    abi: erc20Abi_bytes32,
                    functionName: "name",
                },
                {
                    address,
                    abi: erc20Abi_bytes32,
                    functionName: "symbol",
                },
            ]),
            allowFailure: true,
        });
        const fetchedTokens = missingTokens.reduce(
            (
                accumulator: { [address: string]: Erc20Token },
                missingToken,
                index,
            ) => {
                const rawName = result[index * 5];
                const rawSymbol = result[index * 5 + 1];
                const rawDecimals = result[index * 5 + 2];
                const rawBytesName = result[index * 5 + 3];
                const rawBytesSymbol = result[index * 5 + 4];
                if (
                    (!rawSymbol.result && !rawBytesSymbol.result) ||
                    (!rawName.result && rawBytesName.result) ||
                    !rawDecimals.result
                ) {
                    console.warn(
                        `could not fetch erc20 data for address ${missingToken}`,
                    );
                    return accumulator;
                }

                let name: string;
                try {
                    if (!rawName.result)
                        throw new Error("wrapped name result is undefined");
                    name = rawName.result as string;
                } catch (error) {
                    try {
                        if (!rawBytesName.result)
                            throw new Error(
                                "wrapped bytes name result is undefined",
                            );
                        name = rawBytesName.result as string;
                    } catch (error) {
                        console.warn(
                            `could not decode erc20 token name for address ${missingToken}`,
                        );
                        return accumulator;
                    }
                }

                let symbol: string;
                try {
                    if (!rawSymbol.result)
                        throw new Error("wrapped symbol result is undefined");
                    symbol = rawSymbol.result as string;
                } catch (error) {
                    try {
                        if (!rawBytesSymbol.result)
                            throw new Error(
                                "wrapped bytes symbol result is undefined",
                            );
                        symbol = rawBytesSymbol.result as string;
                    } catch (error) {
                        console.warn(
                            `could not decode erc20 token symbol for address ${missingToken}`,
                        );
                        return accumulator;
                    }
                }

                try {
                    if (!rawDecimals.result)
                        throw new Error("wrapped decimals result is undefined");
                    const token: Erc20Token = {
                        chainId: chain.id,
                        address: missingToken,
                        decimals: rawDecimals.result as number,
                        symbol,
                        name,
                    };
                    cacheERC20Token(token);
                    accumulator[missingToken] = token;
                } catch (error) {
                    console.error(
                        `error decoding erc20 data for address ${missingToken}`,
                    );
                    throw error;
                }
                return accumulator;
            },
            {},
        );

        return { ...cachedTokens, ...fetchedTokens };
    }
}
