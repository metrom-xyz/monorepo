import { existsSync, writeFileSync, rmSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { DEPLOYMENTS } from "../deployments";
import { fileURLToPath } from "node:url";
import { exec } from "node:child_process";
import Mustache from "mustache";

const [, , rawNetwork = "", rawAmm = ""] = process.argv;
const network = rawNetwork.toLowerCase();
const amm = rawAmm.toLowerCase();

const networkConfig = DEPLOYMENTS[network];
if (!networkConfig) {
    console.error(
        `"${network}" is not a valid network. Valid values are: ${Object.keys(DEPLOYMENTS).join(", ")}`,
    );
    process.exit(1);
}

const contracts = networkConfig[amm];
if (!contracts) {
    console.error(
        `"${amm}" is not a valid amm for the network ${network}. Valid values are: ${Object.keys(networkConfig).join(", ")}`,
    );
    process.exit(1);
}

console.log(
    `Generating addresses.ts file for network ${network} and AMM ${amm}`,
);

console.log(`Generating subgraph file for network ${network} and AMM ${amm}`);

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
                factoryAddress: contracts.Factory.address,
                factoryStartBlock: contracts.Factory.startBlock,
                gaugesFactoryAddress: contracts.GaugesFactory?.address,
                gaugesFactoryStartBlock: contracts.GaugesFactory?.startBlock,
            },
        ),
    );
    console.log("Subgraph file successfully generated.");
} catch (error) {
    console.error("Error while generating subgraph file", error);
    process.exit(1);
}

exec("npm run format");
