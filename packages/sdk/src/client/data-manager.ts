import type { DistributionData } from "src";
import type { Hex } from "viem";
import type { FetchDistributionDataResponse } from "./types";

export interface FetchDistributionDataParams {
    hash: Hex;
}

export class DataManagerClient {
    constructor(public readonly baseUrl: string) {}

    async fetchDistributionData(
        params: FetchDistributionDataParams,
    ): Promise<DistributionData[]> {
        const url = new URL("data", this.baseUrl);

        const sanitizedHash = params.hash.startsWith("0x")
            ? params.hash.substring(2)
            : params.hash;
        url.searchParams.set("hash", sanitizedHash);

        const response = await fetch(url);
        if (!response.ok)
            throw new Error(
                `response not ok while fetching distribution data for hash ${params.hash}: ${await response.text()}`,
            );

        const rawDistributionData =
            (await response.json()) as FetchDistributionDataResponse;

        return rawDistributionData.map(
            ({ account, amount, token_address }) => ({
                account,
                amount,
                tokenAddress: token_address,
            }),
        );
    }
}
