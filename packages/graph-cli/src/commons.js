import { Environment } from "@metrom-xyz/sdk";
import { readFile, writeFile } from "node:fs/promises";
import { homedir } from "node:os";
import { join } from "node:path";

const AUTH_TOKENS_PATH = join(homedir(), "/.metrom-graph-cli.json");

export async function readAuthTokens() {
    try {
        return JSON.parse(await readFile(AUTH_TOKENS_PATH).toString());
    } catch {
        return {};
    }
}

export async function writeAuthTokens(tokens) {
    await writeFile(AUTH_TOKENS_PATH, JSON.stringify(tokens));
}

export const SERVICE_URLS = {
    [Environment.Development]: {
        ipfs: "https://ipfs.dev.metrom.xyz",
        graphNode: "https://graph-node.dev.metrom.xyz",
    },
    [Environment.Production]: {
        ipfs: "https://ipfs.metrom.xyz",
        graphNode: "https://graph-node.metrom.xyz",
    },
};
