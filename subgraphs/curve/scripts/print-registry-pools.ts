import {
    createPublicClient,
    http,
    type Address,
    parseAbi,
    type Chain,
} from "viem";

export async function printRegistryPools(
    chain: Chain,
    registryAddress: Address,
) {
    const client = createPublicClient({
        chain,
        transport: http(),
    });

    const poolsCount = await client.readContract({
        address: registryAddress,
        abi: parseAbi([`function pool_count() view returns (uint256)`]),
        functionName: "pool_count",
    });

    const poolAddressCalls = [];
    for (let i = 0; i < poolsCount; i++) {
        poolAddressCalls.push({
            abi: parseAbi([
                `function pool_list(uint256) view returns (address)`,
            ]),
            functionName: "pool_list",
            args: [i],
            address: registryAddress,
        });
    }

    const addresses = await client.multicall({
        contracts: poolAddressCalls,
        allowFailure: false,
    });

    const lpTokenCalls = [];
    for (const address of addresses) {
        lpTokenCalls.push({
            abi: parseAbi([
                `function get_lp_token(address) view returns (address)`,
            ]),
            functionName: "get_lp_token",
            args: [address],
            address: registryAddress,
        });
    }

    const lpTokenAddresses = await client.multicall({
        contracts: lpTokenCalls,
        allowFailure: false,
    });

    const lpTokenSymbolCalls = [];
    for (const lpTokenAddress of lpTokenAddresses) {
        lpTokenSymbolCalls.push({
            abi: parseAbi([`function symbol() view returns (string)`]),
            functionName: "symbol",
            args: [],
            address: lpTokenAddress,
        });
    }

    const lpTokenSymbols = await client.multicall({
        contracts: lpTokenSymbolCalls,
        allowFailure: false,
    });

    const pools = [];
    for (let i = 0; i < addresses.length; i++) {
        pools.push({
            name: lpTokenSymbols[i],
            lpToken: lpTokenAddresses[i],
            address: addresses[i],
        });
    }

    console.log(JSON.stringify(pools, null, 4));
}
