import { existsSync, writeFileSync, rmSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { exec } from "node:child_process";
import { DEPLOYMENTS } from "../deployments";
import Mustache from "mustache";

const [, , rawNetwork = ""] = process.argv;
const network = rawNetwork.toLowerCase();

const contracts = DEPLOYMENTS[network];
if (!contracts) {
    console.error(
        `"${network}" is not a valid network. Valid values are: ${Object.keys(DEPLOYMENTS).join(", ")}`,
    );
    process.exit(1);
}

let resolvedNetwork = network === "lightlink-phoenix" ? "mainnet" : network;

try {
    const subgraphFileOut = join(
        fileURLToPath(dirname(import.meta.url)),
        "../subgraph.yaml",
    );
    if (existsSync(subgraphFileOut)) rmSync(subgraphFileOut);
    writeFileSync(
        subgraphFileOut,
        Mustache.render(
            readFileSync(
                join(
                    fileURLToPath(dirname(import.meta.url)),
                    "../subgraph.template.mustache",
                ),
            ).toString(),
            {
                network: resolvedNetwork,
                vaultAddress: contracts.Vault.address,
                vaultStartBlock: contracts.Vault.startBlock,
                glpManagerAddress: contracts.GlpManager.address,
                glpManagerStartBlock: contracts.GlpManager.startBlock,
            },
        ),
    );
    console.log("Subgraph file successfully generated.");
} catch (error) {
    console.error("Error while generating subgraph file", error);
    process.exit(1);
}

exec("pnpm format");
