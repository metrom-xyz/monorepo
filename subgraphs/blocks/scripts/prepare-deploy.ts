import { existsSync, writeFileSync, rmSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { START_BLOCKS } from "../start-blocks";
import { fileURLToPath } from "node:url";
import { exec } from "node:child_process";
import Mustache from "mustache";

const [, , rawNetwork = ""] = process.argv;
const network = rawNetwork.toLowerCase();

const startBlock = START_BLOCKS[network];
if (!startBlock) {
    console.error(
        `"${network}" is not a valid network. Valid values are: ${Object.keys(START_BLOCKS).join(", ")}`,
    );
    process.exit(1);
}

console.log(`Generating subgraph file for network ${network}`);

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
                    "../subgraph.template.yaml",
                ),
            ).toString(),
            {
                network: resolvedNetwork,
                startBlock,
            },
        ),
    );
    console.log("Subgraph file successfully generated.");
} catch (error) {
    console.error("Error while generating subgraph file", error);
    process.exit(1);
}

exec("npm format");
