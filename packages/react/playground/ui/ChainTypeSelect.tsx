import { ChainType } from "@metrom-xyz/react";

interface ChainTypeSelectProps {
    value: ChainType;
    onChange: (chainType: ChainType) => void;
}

export function ChainTypeSelect({ value, onChange }: ChainTypeSelectProps) {
    return (
        <label>
            chainType:
            <select
                value={value}
                onChange={(event) => onChange(event.target.value as ChainType)}
            >
                {Object.values(ChainType).map((chainType) => (
                    <option key={chainType} value={chainType}>
                        {chainType}
                    </option>
                ))}
            </select>
        </label>
    );
}
