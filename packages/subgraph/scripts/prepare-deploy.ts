import { existsSync, writeFileSync, rmSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { ADDRESS, SupportedChain, Environment } from "@metrom-xyz/contracts";
import { fileURLToPath } from "node:url";
import { exec } from "node:child_process";
import Mustache from "mustache";

const ENVIRONMENT_NAME: Record<Environment, string> = {
    [Environment.Development]: "development",
    [Environment.Staging]: "staging",
    [Environment.Production]: "production",
};

const NETWORK_NAME: Record<SupportedChain, string> = {
    [SupportedChain.Holesky]: "holesky",
    [SupportedChain.CeloAlfajores]: "celo-alfajores",
    [SupportedChain.MantleSepolia]: "mantle-sepolia",
    [SupportedChain.Mode]: "mode-mainnet",
    [SupportedChain.Mantle]: "mantle",
};

const [, , rawEnvironment, rawNetwork = ""] = process.argv;
const environment = rawEnvironment.toLowerCase();
const network = rawNetwork.toLowerCase();

const environmentExists = !!Object.values(ENVIRONMENT_NAME).find(
    (name) => name === environment,
);
if (!environmentExists) {
    console.error(
        `"${environment}" is not a valid environment. Valid values are: ${Object.values(ENVIRONMENT_NAME).join(", ")}`,
    );
    process.exit(1);
}

const resolvedNetwork = Object.entries(NETWORK_NAME).find(([, name]) => {
    return name === network;
});
if (!resolvedNetwork) {
    console.error(
        `"${network}" is not a valid network. Valid values are: ${Object.values(NETWORK_NAME).join(", ")}`,
    );
    process.exit(1);
}

const metrom =
    ADDRESS[environment as Environment][
        parseInt(resolvedNetwork[0]) as SupportedChain
    ];
if (!metrom) {
    console.error(
        `"${environment}/${network}" is not a valid environment/network combination. Valid values are:\n\n${Object.entries(
            ADDRESS,
        )
            .map(([validEnvironment, deployments]) => {
                return `${validEnvironment}: ${Object.keys(deployments)
                    .map(
                        (chainId) =>
                            NETWORK_NAME[parseInt(chainId) as SupportedChain],
                    )
                    .join(", ")}`;
            })
            .join("\n")}`,
    );
    process.exit(1);
}

console.log(`Generating addresses.ts file for network ${network}`);

let addressesFile =
    '// this file is automatically generated by the /scripts/generate-addresses-files.ts\n// script, do not edit this manually\n\nimport { Address } from "@graphprotocol/graph-ts";\n\n';
addressesFile += `export const METROM_ADDRESS = Address.fromString("${metrom.address}");\n`;

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

console.log(`Generating subgrpah.yaml file for network ${network}`);

try {
    const pathOut = join(
        fileURLToPath(dirname(import.meta.url)),
        "../subgraph.yaml",
    );
    if (existsSync(pathOut)) rmSync(pathOut);
    writeFileSync(
        pathOut,
        Mustache.render(
            readFileSync(
                join(
                    fileURLToPath(dirname(import.meta.url)),
                    "../subgraph.template.yaml",
                ),
            ).toString(),
            {
                network: resolvedNetwork[1],
                address: metrom.address,
                startBlock: metrom.blockCreated,
            },
        ),
    );
    console.log("subgraph.yaml file successfully generated.");
} catch (error) {
    console.error("Error while generating subgraph.yaml file", error);
    process.exit(1);
}

exec("pnpm format");
