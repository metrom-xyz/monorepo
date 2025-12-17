import { EVM_CHAIN_DATA, ProtocolType } from "@metrom-xyz/chains";
import { Environment, SupportedDex } from "@metrom-xyz/sdk";
import { exec } from "node:child_process";
import { writeFileSync } from "node:fs";
import { join } from "node:path";

const HOMEPAGES: Record<SupportedDex, string> = {
    [SupportedDex.Fibonacci]: "https://www.fibonacci-dex.xy",
    [SupportedDex.Panko]: "https://panko.finance/",
    [SupportedDex.Swapsicle]: "https://www.swapsicle.io/",
    [SupportedDex.TestIntegral]: "placeholder",
    [SupportedDex.ThirdTrade]: "https://third.trade/",
    [SupportedDex.Unagi]: "https://unagiswap.xyz/",
    [SupportedDex.UniswapV3]: "https://app.uniswap.org/",
    [SupportedDex.Carbon]: "https://carbondefi.xyz/",
    [SupportedDex.Velodrome]: "https://velo.drome.eth.limo/",
    [SupportedDex.Morphex]: "https://morphex.exchange/",
    [SupportedDex.Izumi]: "https://izumi.finance/",
    [SupportedDex.Hydrex]: "https://www.hydrex.fi/",
    [SupportedDex.BalancerV3]: "https://balancer.fi/",
    [SupportedDex.Curve]: "https://www.curve.finance/",
    [SupportedDex.Ambient]: "https://ambient.finance/",
    [SupportedDex.Honeypop]: "https://honeypop.app/",
    [SupportedDex.Lithos]: "https://lithos.to/",
    [SupportedDex.Quickswap]: "https://dapp.quickswap.exchange/",
    [SupportedDex.Hyperion]: "https://hyperion.xyz/",
};

// TODO: add support for MVM_CHAIN_DATA generation
const chains = Object.values(EVM_CHAIN_DATA[Environment.Production]).filter(
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

exec(`npm format ${outPath}`);
