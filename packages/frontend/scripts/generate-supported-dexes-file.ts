import { CHAIN_DATA, ProtocolType } from "@metrom-xyz/chains";
import { Environment, SupportedDex } from "@metrom-xyz/sdk";
import { exec } from "node:child_process";
import { writeFileSync } from "node:fs";
import { join } from "node:path";

const HOMEPAGES: Record<SupportedDex, string> = {
    [SupportedDex.BaseSwap]: "https://baseswap.fi/",
    [SupportedDex.Fibonacci]: "https://www.fibonacci-dex.xyz",
    [SupportedDex.Kim]: "https://www.kim.exchange",
    [SupportedDex.Panko]: "https://panko.finance/",
    [SupportedDex.Scribe]: "https://scribe.exchange",
    [SupportedDex.SilverSwap]: "https://silverswap.io/",
    [SupportedDex.Swapr]: "https://swapr.eth.link/",
    [SupportedDex.Swapsicle]: "https://www.swapsicle.io/",
    [SupportedDex.TestIntegral]: "placeholder",
    [SupportedDex.ThirdTrade]: "https://third.trade/",
    [SupportedDex.Unagi]: "https://unagiswap.xyz/",
    [SupportedDex.UniswapV3]: "https://app.uniswap.org/",
    [SupportedDex.Carbon]: "https://carbondefi.xyz/",
    [SupportedDex.Velodrome]: "https://velodrome.finance/",
};

const chains = Object.values(CHAIN_DATA[Environment.Production]).filter(
    ({ protocols }) => protocols.some(({ active }) => active),
);
const chainNames = chains.map((chain) => chain.name);

const protocols: { slug: string; name: string }[] = [];
const supportedProtocolsMap: Record<string, Record<string, boolean>> = {};
for (const chain of chains) {
    for (const protocol of chain.protocols) {
        if (protocol.type !== ProtocolType.Dex) continue;

        const toInsert = { slug: protocol.slug, name: protocol.name };
        if (
            !protocols.find(
                (item) =>
                    item.name === toInsert.name && item.slug === toInsert.slug,
            )
        )
            protocols.push(toInsert);

        if (!supportedProtocolsMap[protocol.name])
            supportedProtocolsMap[protocol.name] = {};
        supportedProtocolsMap[protocol.name][chain.name] = true;
    }
}

let out = `||${chainNames.join("|")}|\n`;
out += `|---|${chains.map(() => "---").join("|")}\n`;

for (const protocol of protocols) {
    out += `|[${protocol.name}](${HOMEPAGES[protocol.slug as SupportedDex]})|`;
    const chainSupportMap = [];
    for (const chainName of chainNames) {
        chainSupportMap.push(
            supportedProtocolsMap[protocol.name][chainName] ? "✅" : "-",
        );
    }
    out += `${chainSupportMap.join("|")}|\n`;
}

const outPath = join(import.meta.dirname, "../SUPPORTED_PROTOCOLS.md");
writeFileSync(outPath, out);

exec(`pnpm format ${outPath}`);
