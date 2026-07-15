import { useState } from "react";
import type { Hex } from "viem";
import { ChainType, useCampaign } from "@metrom-xyz/react";
import { ChainTypeSelect } from "../ui/ChainTypeSelect";
import { inputsStyle, preStyle, sectionStyle } from "../ui/styles";
import { stringify } from "../utils/stringify";

export function CampaignDetails() {
    const [chainId, setChainId] = useState(8453);
    const [chainType, setChainType] = useState(ChainType.Evm);
    const [id, setId] = useState<Hex | undefined>();

    const campaign = useCampaign({
        chainId,
        chainType,
        id,
    });

    return (
        <div style={sectionStyle}>
            <h2>useCampaign</h2>
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
                    id:
                    <input
                        type="text"
                        placeholder="0x…"
                        size={44}
                        value={id ?? ""}
                        onChange={(event) =>
                            setId((event.target.value as Hex) || undefined)
                        }
                    />
                </label>
            </div>
            {campaign.isLoading && <p>Loading...</p>}
            {campaign.data && (
                <pre style={preStyle}>{stringify(campaign.data)}</pre>
            )}
        </div>
    );
}
