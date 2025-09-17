import { ConnectButton, useConnectModal } from "@rainbow-me/rainbowkit";
import { Widget } from ".";

const ENSO_FINANCE_API_KEY = import.meta.env.VITE_ENSO_FINANCE_API_KEY ?? "";

export function App() {
    const { openConnectModal } = useConnectModal();

    return (
        <div style={{ padding: 16 }}>
            <div style={{ placeSelf: "self-end" }}>
                <ConnectButton />
            </div>
            <div
                style={{
                    marginTop: "10%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Widget
                    apiKey={ENSO_FINANCE_API_KEY}
                    tokenIn="0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
                    chainId={1}
                    tokenOut="0x2b4b2a06c0fdebd8de1545abdffa64ec26416796"
                    outChainId={1}
                    onConnectWallet={openConnectModal}
                />
            </div>
        </div>
    );
}
