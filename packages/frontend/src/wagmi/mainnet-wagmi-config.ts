import { createConfig, http } from "wagmi";
import { mainnet } from "viem/chains";

export const MAINNET_RPC = "https://ethereum-rpc.publicnode.com";

// Required for ENS resolution hooks, since the dapp doesn't support mainnet,
// we provide a separate client config specifically for querying ens on mainnet.
// Kept in its own module (no wallet connectors) so it can be imported
// statically anywhere without pulling in `@base-org/account`'s heavy Node
// dependency chain (see context/evm-wallet-provider.tsx).
export const mainnetWagmiConfig = createConfig({
    chains: [mainnet],
    transports: { [mainnet.id]: http(MAINNET_RPC) },
});
