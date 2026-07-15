import { useState } from "react";
import type { Address } from "viem";
import { ChainType, useClaims } from "@metrom-xyz/react";
import { inputsStyle, preStyle, sectionStyle } from "../ui/styles";
import { stringify } from "../utils/stringify";
import { ChainTypeSelect } from "../ui/ChainTypeSelect";

export function Claims() {
    const [address, setAddress] = useState<Address | undefined>();
    const [chainType, setChainType] = useState<ChainType>(ChainType.Evm);

    const claims = useClaims({ address });

    return (
        <div style={sectionStyle}>
            <h2>useClaims</h2>
            <div style={inputsStyle}>
                <ChainTypeSelect value={chainType} onChange={setChainType} />
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
            {claims.isLoading && <p>Loading...</p>}
            {claims.data && (
                <pre style={preStyle}>{stringify(claims.data)}</pre>
            )}
        </div>
    );
}
