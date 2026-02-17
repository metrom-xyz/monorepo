import {
    EVM_CHAIN_DATA,
    MVM_CHAIN_DATA,
    ProtocolType,
    type ChainData,
} from "@metrom-xyz/chains";
import {
    Environment,
    SupportedAaveV3,
    SupportedDex,
    SupportedLiquityV2,
} from "@metrom-xyz/sdk";
import { writeFileSync } from "node:fs";
import { join } from "node:path";

const DEX_HOMEPAGE: Record<SupportedDex, string> = {
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
    [SupportedDex.Thala]: "https://www.thala.fi/",
};

const LIQUITY_V2_HOMEPAGES: Record<SupportedLiquityV2, string> = {
    [SupportedLiquityV2.Liquity]: "https://www.liquity.org/",
    [SupportedLiquityV2.Ebisu]: "https://ebisu.money/",
    [SupportedLiquityV2.Orki]: "https://www.orki.finance/",
    [SupportedLiquityV2.Quill]: "https://app.quill.finance/",
};

const AAVE_V3_HOMEPAGES: Record<SupportedAaveV3, string> = {
    [SupportedAaveV3.Aave]: "https://aave.com/",
    [SupportedAaveV3.Ploutos]: "https://app.ploutos.money/",
};

const PROTOCOL_CONFIGS = [
    {
        type: ProtocolType.Dex,
        filename: "SUPPORTED_DEXES.md",
        homepages: DEX_HOMEPAGE,
    },
    {
        type: ProtocolType.LiquityV2,
        filename: "SUPPORTED_LIQUITY_V2s.md",
        homepages: LIQUITY_V2_HOMEPAGES,
    },
    {
        type: ProtocolType.AaveV3,
        filename: "SUPPORTED_AAVE_V3s.md",
        homepages: AAVE_V3_HOMEPAGES,
    },
] as const;

interface Protocol {
    slug: string;
    name: string;
}

type Supported = Record<string, Record<string, boolean>>;

function getActiveChains() {
    return Object.values(EVM_CHAIN_DATA[Environment.Production])
        .concat(Object.values(MVM_CHAIN_DATA[Environment.Production]))
        .filter(({ protocols }) => protocols.some(({ active }) => active));
}

function extractProtocols(chains: ChainData[], type: ProtocolType) {
    const protocols: Protocol[] = [];
    const supported: Supported = {};

    for (const chain of chains) {
        for (const protocol of chain.protocols) {
            if (protocol.type !== type) continue;

            if (!protocols.some((item) => item.slug === protocol.slug))
                protocols.push({ slug: protocol.slug, name: protocol.name });

            if (!supported[protocol.name]) supported[protocol.name] = {};
            supported[protocol.name][chain.name] = true;
        }
    }

    return { protocols, supported };
}

function generateMarkdownTable(
    chains: ChainData[],
    protocols: Protocol[],
    supported: Supported,
    homepages: Record<string, string>,
) {
    const chainsWithActiveProtocols = chains.filter((chain) =>
        protocols.some((protocol) => supported[protocol.name]?.[chain.name]),
    );

    const chainNames = chainsWithActiveProtocols.map((chain) => chain.name);
    const displayNames = chainNames.map((name) => name.replace(/ /g, "\u00A0"));
    const rows: string[] = [];

    rows.push(`||${displayNames.join("|")}|`);
    rows.push(`|---|${displayNames.map(() => "---").join("|")}|`);

    for (const protocol of protocols) {
        const homepage = homepages[protocol.slug];
        const cells = chainNames.map((chainName) =>
            supported[protocol.name]?.[chainName] ? "●" : "○",
        );
        rows.push(
            `|[${protocol.name.replace(/ /g, "\u00A0")}](${homepage})|${cells.join("|")}|`,
        );
    }

    return rows.join("\n");
}

function main() {
    const outDir = join(import.meta.dirname, "../supported-protocols");
    const chains = getActiveChains();

    for (const { type, filename, homepages } of PROTOCOL_CONFIGS) {
        const { protocols, supported } = extractProtocols(chains, type);
        const markdown = generateMarkdownTable(
            chains,
            protocols,
            supported,
            homepages,
        );
        writeFileSync(join(outDir, filename), markdown);
    }
}

main();
