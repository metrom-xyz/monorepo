import { useState } from "react";
import type { Address, Hex } from "viem";
import { ChainType, useLeaderboard } from "@metrom-xyz/react";
import { ChainTypeSelect } from "../ui/ChainTypeSelect";
import { preStyle, inputsStyle, sectionStyle } from "../ui/styles";
import { stringify } from "../utils/stringify";

export function Leaderboard() {
    const [chainId, setChainId] = useState(8453);
    const [chainType, setChainType] = useState(ChainType.Evm);
    const [campaignId, setCampaignId] = useState<Hex | undefined>();
    const [address, setAddress] = useState<Address | undefined>();

    const leaderboard = useLeaderboard({
        chainId,
        chainType,
        campaignId,
        address,
    });

    return (
        <div style={sectionStyle}>
            <h2>useLeaderboard</h2>
            <div style={inputsStyle}>
                <label>
                    chainId:
                    <input
                        type="number"
                        value={chainId}
                        onChange={(event) =>
                            setChainId(Number(event.target.value))
                        }
                    />
                </label>
                <ChainTypeSelect value={chainType} onChange={setChainType} />
                <label>
                    campaignId:
                    <input
                        type="text"
                        placeholder="0x…"
                        size={44}
                        value={campaignId ?? ""}
                        onChange={(event) =>
                            setCampaignId(
                                (event.target.value as Hex) || undefined,
                            )
                        }
                    />
                </label>
                <label>
                    address:
                    <input
                        type="text"
                        placeholder="0x…"
                        size={44}
                        value={address ?? ""}
                        onChange={(event) =>
                            setAddress(
                                (event.target.value as Address) || undefined,
                            )
                        }
                    />
                </label>
            </div>
            {leaderboard.isLoading && <p>Loading...</p>}
            {leaderboard.data && (
                <pre style={preStyle}>{stringify(leaderboard.data)}</pre>
            )}
        </div>
    );
}
