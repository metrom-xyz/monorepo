import { existsSync, writeFileSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { ADDRESS, SupportedChain } from "@metrom-xyz/contracts";
import { fileURLToPath } from "node:url";
import { exec } from "node:child_process";

const NETWORK_NAME: Record<SupportedChain, string> = {
    [SupportedChain.Holesky]: "holesky",
};

const [, , rawNetwork = ""] = process.argv;
const network = rawNetwork.toLowerCase();

const entry = Object.entries(NETWORK_NAME).find(([, name]) => {
    return name === rawNetwork;
});
if (!entry) {
    console.error(
        `"${network}" is not a valid network. Valid values are: ${Object.values(NETWORK_NAME).join(", ")}`,
    );
    process.exit(1);
}

const metrom =
    rawNetwork === "placeholder"
        ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ({} as any)
        : ADDRESS[parseInt(entry[0]) as SupportedChain];
if (!metrom) {
    console.error(
        `"${network}" is not a valid network. Valid values are: ${Object.values(NETWORK_NAME).join(", ")}`,
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

console.log(`Generating networks.ts file for network ${network}`);

try {
    const networksFileOut = join(
        fileURLToPath(dirname(import.meta.url)),
        "../networks.json",
    );
    if (existsSync(networksFileOut)) rmSync(networksFileOut);
    writeFileSync(
        networksFileOut,
        JSON.stringify(
            {
                [network]: {
                    Metrom: {
                        address: metrom.address,
                        startBlock: metrom.blockCreated,
                    },
                },
            },
            undefined,
            4,
        ),
    );
    console.log("Networks file successfully generated.");
} catch (error) {
    console.error("Error while generating networks file", error);
    process.exit(1);
}

exec("pnpm format");
