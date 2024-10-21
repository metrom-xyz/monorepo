import { existsSync, writeFileSync, rmSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { exec } from "node:child_process";
import { DEPLOYMENTS } from "../deployments";
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

const ammConfig = networkConfig.amms[amm];
if (!ammConfig) {
    console.error(
        `"${amm}" is not a valid AMM for the network ${network}. Valid values are: ${Object.keys(networkConfig).join(", ")}`,
    );
    process.exit(1);
}

console.log(
    `Generating addresses.ts file for network ${network} and AMM ${amm}`,
);

let addressesFile =
    '// this file is automatically generated by the /scripts/generate-addresses-file.ts\n// script, do not edit this manually\n\nimport { Address, BigInt } from "@graphprotocol/graph-ts";\n\n';
addressesFile += `export const FACTORY_ADDRESS = Address.fromString("${ammConfig.Factory.address}");\n`;
addressesFile += `export const NATIVE_TOKEN_ADDRESS = Address.fromString("${networkConfig.nativeToken.address}");\n`;
addressesFile += `export const NATIVE_TOKEN_SYMBOL = "${networkConfig.nativeToken.symbol}";\n`;
addressesFile += `export const NATIVE_TOKEN_NAME = "${networkConfig.nativeToken.name}";\n`;
addressesFile += `export const NATIVE_TOKEN_DECIMALS = BigInt.fromI32(${networkConfig.nativeToken.decimals});\n`;

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
                FactoryAddress: ammConfig.Factory.address,
                FactoryStartBlock: ammConfig.Factory.startBlock,
            },
        ),
    );
    console.log("Subgraph file successfully generated.");
} catch (error) {
    console.error("Error while generating subgraph file", error);
    process.exit(1);
}

exec("pnpm format");
