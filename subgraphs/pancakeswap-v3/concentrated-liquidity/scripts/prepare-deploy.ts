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

let addressesFile =
    '// this file is automatically generated by the /scripts/generate-addresses-files.ts\n// script, do not edit this manually\n\nimport { Address } from "@graphprotocol/graph-ts";\n\n';
addressesFile += `export const FACTORY_ADDRESS = Address.fromString("${contracts.Factory.address}");\n`;
addressesFile += `export const NON_FUNGIBLE_POSITION_MANAGER_ADDRESS = Address.fromString("${contracts.NonFungiblePositionManager.address}");\n`;
addressesFile += `export const STAKING_CONTRACT_ADDRESSES: Address[] = [];\n`;
if (contracts.stakingContractAddresses)
    for (const address of contracts.stakingContractAddresses)
        addressesFile += `STAKING_CONTRACT_ADDRESSES.push(Address.fromString("${address}"));\n`;

try {
    const addressesFileOut = join(
        fileURLToPath(dirname(import.meta.url)),
        "../src/addresses.ts",
    );
    if (existsSync(addressesFileOut)) rmSync(addressesFileOut);
    writeFileSync(addressesFileOut, addressesFile);
    console.log("Addresses file successfully generated.");
} catch (error) {
    console.error("Error while generating addresses file", error);
    process.exit(1);
}

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
                    "../subgraph.template.yaml",
                ),
            ).toString(),
            {
                network,
                factoryAddress: contracts.Factory.address,
                factoryStartBlock: contracts.Factory.startBlock,
                nftPositionManagerAddress:
                    contracts.NonFungiblePositionManager.address,
                nftPositionManagerStartBlock:
                    contracts.NonFungiblePositionManager.startBlock,
            },
        ),
    );
    console.log("Subgraph file successfully generated.");
} catch (error) {
    console.error("Error while generating subgraph file", error);
    process.exit(1);
}

exec("pnpm format");
