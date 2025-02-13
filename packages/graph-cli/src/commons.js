import { Environment } from "@metrom-xyz/sdk";
import { readFile, writeFile } from "node:fs/promises";
import { homedir } from "node:os";
import { join } from "node:path";

const AUTH_TOKENS_PATH = join(homedir(), "/.metrom-graph-cli.json");

export async function readAuthTokens() {
    try {
        return JSON.parse((await readFile(AUTH_TOKENS_PATH)).toString());
    } catch {
        return {};
    }
}

export async function writeAuthTokens(tokens) {
    await writeFile(AUTH_TOKENS_PATH, JSON.stringify(tokens));
}

export const SERVICE_URLS = {
    [Environment.Development]: {
        ipfs: "https://api.dev.metrom.xyz/ipfs",
        graphNode: {
            rpc: "https://api.dev.metrom.xyz/graph-rpc",
            queries: "https://api.dev.metrom.xyz/subgraphs",
        },
    },
    [Environment.Production]: {
        ipfs: "https://api.metrom.xyz/ipfs",
        graphNode: {
            rpc: "https://api.metrom.xyz/graph-rpc",
            queries: "https://api.metrom.xyz/subgraphs",
        },
    },
};
