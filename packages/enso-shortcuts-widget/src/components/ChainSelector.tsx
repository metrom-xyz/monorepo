import { useCallback, useMemo } from "react";
import { useChains } from "wagmi";
import { STARGATE_CHAIN_NAMES, SupportedChainId } from "../constants";
import { Select, SelectOption, Typography } from "@metrom-xyz/ui";

// Define chain type with required properties
type Chain = {
    id: number;
    name: string;
    iconUrl?: string;
};

// Chain icon component
const ChainIcon = ({ chainId }: { chainId: SupportedChainId }) => {
    const chains = useChains() as unknown as Chain[];
    const chain = chains.find((c) => c.id === chainId);
    const iconUrl = `https://icons-ckg.pages.dev/stargate-light/networks/${STARGATE_CHAIN_NAMES[chainId]}.svg`;

    return (
        <div className="overflow-hidden min-w-7 min-h-7 rounded-[50%]">
            <img
                src={iconUrl}
                title={chain?.name || "Unknown Chain"}
                alt={chain?.name || "Unknown Chain"}
                width={"28px"}
                height={"28px"}
            />
        </div>
    );
};

// Chain indicator component to display in the dropdown
const ChainIndicator = ({ value, label }) => (
    <div className="flex items-center gap-2 rounded-lg">
        <ChainIcon chainId={value} />
        <Typography weight="medium">{label || "Unknown Chain"}</Typography>
    </div>
);

// Chain selector component
const ChainSelector = ({
    value,
    onChange,
    disabled,
}: {
    value: SupportedChainId;
    onChange: (value: SupportedChainId) => void;
    disabled?: boolean;
}) => {
    const chains = useChains();

    const chainOptions = useMemo(() => {
        // Create collection of available chains
        return chains
            .filter((chain) =>
                Object.values(SupportedChainId).includes(
                    chain.id as SupportedChainId,
                ),
            )
            .map((chain) => ({
                value: chain.id as SupportedChainId,
                label: chain.name,
            }));
    }, [chains]);

    const onSelectChange = useCallback(
        (chain: SelectOption<SupportedChainId>) => {
            onChange(Number(chain.value) as SupportedChainId);
        },
        [onChange],
    );

    return (
        <Select
            messages={{ noResults: "Nothing here" }}
            options={chainOptions}
            value={value}
            search
            disabled={disabled}
            onChange={onSelectChange}
            renderOption={ChainIndicator}
            className="[&>.root>.inputWrapper>input]:bg-gray-200! dark:[&>.root>.inputWrapper>input]:surface-secondary!"
        />
    );
};

export default ChainSelector;
