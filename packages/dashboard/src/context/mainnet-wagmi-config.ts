import { createConfig, http } from "wagmi";
import { mainnet } from "viem/chains";

// Required for ENS resolution hooks, since the dapp doesn't support mainnet,
// we provide a separate client config specifically for querying ens on mainnet.
// Kept in its own module (no wallet connectors, no AppKit) so it can be
// imported statically anywhere without pulling in reown AppKit's full wallet
// bundle (which drags in `@base-org/account`'s heavy Node dependency chain
// even though this dapp only configures the Safe connector — see
// components/reown-app-kit-provider.tsx).
export const mainnetWagmiConfig = createConfig({
    chains: [mainnet],
    transports: {
        [mainnet.id]: http(mainnet.rpcUrls.default.http[0]),
    },
});
