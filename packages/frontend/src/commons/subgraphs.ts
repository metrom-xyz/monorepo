import { Environment, SupportedChain } from "@metrom-xyz/contracts";

// TODO: move the subgraph integration to the backend
export const METROM_SUBGRAPHS: Record<
    Environment,
    Record<SupportedChain, string>
> = {
    [Environment.Development]: {
        [SupportedChain.CeloAlfajores]:
            "https://api.studio.thegraph.com/query/68570/metrom-celo-alfajores-dev/version/latest",
        [SupportedChain.Holesky]:
            "https://api.studio.thegraph.com/query/68570/metrom-holesky-dev/version/latest",
        // FIXME: latest mantle subgraph verions?
        [SupportedChain.MantleSepolia]:
            "https://subgraph-api.mantle.xyz/api/public/33d97dee-2622-4f8a-a8e8-2692ce1a49b6/subgraphs/metrom-mantle-sepolia-dev/0.0.4/gn",
    },
    [Environment.Staging]: {
        [SupportedChain.CeloAlfajores]:
            "https://api.studio.thegraph.com/query/68570/metrom-celo-alfajores-staging/version/latest",
        [SupportedChain.Holesky]:
            "https://api.studio.thegraph.com/query/68570/metrom-holesky-staging/version/latest",
        [SupportedChain.MantleSepolia]:
            "https://subgraph-api.mantle.xyz/api/public/33d97dee-2622-4f8a-a8e8-2692ce1a49b6/subgraphs/metrom-mantle-sepolia-staging/0.0.4/gn",
    },
    [Environment.Production]: {
        [SupportedChain.Mode]:
            "https://api.studio.thegraph.com/query/68570/metrom-mode/version/latest",
    },
};
