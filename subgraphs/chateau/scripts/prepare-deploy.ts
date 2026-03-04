import { existsSync, writeFileSync, rmSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { DEPLOYMENTS } from "../deployments";
import { fileURLToPath } from "node:url";
import { exec } from "node:child_process";
import Mustache from "mustache";

const [, , rawNetwork = "", rawPool = ""] = process.argv;
const network = rawNetwork.toLowerCase();
const pool = rawPool.toLowerCase();

const chainConfig = DEPLOYMENTS[network];
if (!chainConfig) {
    console.error(
        `"${network}" is not a valid network. Valid values are: ${Object.keys(DEPLOYMENTS).join(", ")}`,
    );
    process.exit(1);
}

console.log(`Generating subgraph file for network ${network} and pool ${pool}`);

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
                network,
                address: chainConfig.chUsd.address,
                startBlock: chainConfig.chUsd.startBlock,
            },
        ),
    );
    console.log("Subgraph file successfully generated.");
} catch (error) {
    console.error("Error while generating subgraph file", error);
    process.exit(1);
}

exec("npm run format");
