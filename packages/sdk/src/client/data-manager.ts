import type { Snapshot } from "src";
import type { Hex } from "viem";
import type { BackendLeaf } from "./types";

export interface FetchSnapshotParams {
    hash: Hex;
}

export class DataManagerClient {
    constructor(public readonly baseUrl: string) {}

    async fetchSnapshot(params: FetchSnapshotParams): Promise<Snapshot> {
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

        const json = (await response.json()) as {
            timestamp: number;
            leaves: BackendLeaf[];
        };

        if (json instanceof Array)
            throw new Error(
                `the fetched snapshot data with hash ${params.hash} uses an unsupported format, skipping`,
            );

        return {
            ...json,
            leaves: json.leaves.map((leaf) => ({
                ...leaf,
                amount: BigInt(leaf.amount),
            })),
        };
    }
}
