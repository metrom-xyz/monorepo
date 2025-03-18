import { existsSync, writeFileSync, rmSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { DEPLOYMENTS } from "../deployments";
import { fileURLToPath } from "node:url";
import { exec } from "node:child_process";
import Mustache from "mustache";

const [, , rawNetwork = "", rawDex = ""] = process.argv;
const network = rawNetwork.toLowerCase();
const dex = rawDex.toLowerCase();

const chainConfig = DEPLOYMENTS[network];
if (!chainConfig) {
    console.error(
        `"${network}" is not a valid network. Valid values are: ${Object.keys(DEPLOYMENTS).join(", ")}`,
    );
    process.exit(1);
}

console.log(
    `Generating constants.ts file for network ${network} and dex ${dex}`,
);

let constantsFile =
    '// this file is automatically generated by the prepare deploy script,\n// do not edit this manually\n\nimport { Address, BigInt, TypedMap } from "@graphprotocol/graph-ts";\n\n';
constantsFile += `export const METAPOOL_FACTORY_ADDRESS = Address.fromString("${chainConfig.contracts.MetapoolFactory.address}");\n`;
constantsFile += `export const TWO_CRYPTO_FACTORY_ADDRESS = Address.fromString("${chainConfig.contracts.TwoCryptoFactory.address}");\n`;
constantsFile += `export const STABLE_SWAP_CRV_USD_FACTORY_ADDRESS = Address.fromString("${chainConfig.contracts.StableSwapCrvUsdFactory.address}");\n`;
constantsFile += `export const TRI_CRYPTO_NG_FACTORY_ADDRESS = Address.fromString("${chainConfig.contracts.TriCryptoNGFactory.address}");\n`;
constantsFile += `export const STABLE_SWAP_NG_FACTORY_ADDRESS = Address.fromString("${chainConfig.contracts.StableSwapNGFactory.address}");\n`;
constantsFile += `export const TWO_CRYPTO_NG_FACTORY_ADDRESS = Address.fromString("${chainConfig.contracts.TwoCryptoNGFactory.address}");\n`;
constantsFile += `export const NATIVE_TOKEN_ADDRESS = Address.fromString("${chainConfig.nativeToken.address}");\n`;
constantsFile += `export const NATIVE_TOKEN_SYMBOL = "${chainConfig.nativeToken.symbol}";\n`;
constantsFile += `export const NATIVE_TOKEN_NAME = "${chainConfig.nativeToken.name}";\n`;
constantsFile += `export const NATIVE_TOKEN_DECIMALS = BigInt.fromI32(${chainConfig.nativeToken.decimals});\n`;
constantsFile += `export const LEGACY_POOL_LP_TOKEN = new TypedMap<Address, Address>();\n`;
for (const LegacyPool of chainConfig.contracts.LegacyPools)
    constantsFile += `LEGACY_POOL_LP_TOKEN.set(Address.fromString("${LegacyPool.address}"), Address.fromString("${LegacyPool.lpToken}"));\n`;

try {
    const constantsFileOut = join(
        fileURLToPath(dirname(import.meta.url)),
        "../src/constants.ts",
    );
    if (existsSync(constantsFileOut)) rmSync(constantsFileOut);
    writeFileSync(constantsFileOut, constantsFile);
    console.log("Constants file successfully generated.");
} catch (error) {
    console.error("Error while generating constants file", error);
    process.exit(1);
}

console.log(`Generating subgraph file for network ${network} and dex ${dex}`);

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
                grafting: chainConfig.grafting,
                network,
                LegacyPools: chainConfig.contracts.LegacyPools,
                MetapoolFactoryAddress:
                    chainConfig.contracts.MetapoolFactory.address,
                MetapoolFactoryStartBlock:
                    chainConfig.contracts.MetapoolFactory.startBlock,
                TwoCryptoFactoryAddress:
                    chainConfig.contracts.TwoCryptoFactory.address,
                TwoCryptoFactoryStartBlock:
                    chainConfig.contracts.TwoCryptoFactory.startBlock,
                StableSwapCrvUsdFactoryAddress:
                    chainConfig.contracts.StableSwapCrvUsdFactory.address,
                StableSwapCrvUsdFactoryStartBlock:
                    chainConfig.contracts.StableSwapCrvUsdFactory.startBlock,
                TriCryptoNGFactoryAddress:
                    chainConfig.contracts.TriCryptoNGFactory.address,
                TriCryptoNGFactoryStartBlock:
                    chainConfig.contracts.TriCryptoNGFactory.startBlock,
                StableSwapNGFactoryAddress:
                    chainConfig.contracts.StableSwapNGFactory.address,
                StableSwapNGFactoryStartBlock:
                    chainConfig.contracts.StableSwapNGFactory.startBlock,
                TwoCryptoNGFactoryAddress:
                    chainConfig.contracts.TwoCryptoNGFactory.address,
                TwoCryptoNGFactoryStartBlock:
                    chainConfig.contracts.TwoCryptoNGFactory.startBlock,
                GaugeControllerAddress:
                    chainConfig.contracts.GaugeController.address,
                GaugeControllerStartBlock:
                    chainConfig.contracts.GaugeController.startBlock,
            },
        ),
    );
    console.log("Subgraph file successfully generated.");
} catch (error) {
    console.error("Error while generating subgraph file", error);
    process.exit(1);
}

exec("pnpm format");
