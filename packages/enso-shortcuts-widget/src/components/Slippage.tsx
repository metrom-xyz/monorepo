import { Chip, NumberInput, Popover, Typography } from "@metrom-xyz/ui";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useClickAway } from "react-use";

const SLIPPAGE_OPTIONS = [
    { value: 10, label: "0.1%" },
    { value: 25, label: "0.25%" },
    { value: 50, label: "0.5%" },
    { value: 100, label: "1%" },
];

const Slippage = ({
    slippage,
    setSlippage,
}: {
    slippage: number;
    setSlippage: (value: number) => void;
}) => {
    const [customValue, setCustomValue] = useState("");
    const [popoverOpen, setPopoverOpen] = useState(false);
    const [popoverAnchor, setPopoverAnchor] = useState<HTMLDivElement | null>(
        null,
    );
    const chainNamePopoverRef = useRef<HTMLDivElement>(null);
    const rootRef = useRef<HTMLDivElement>(null);

    const numericCustomValue = useMemo(() => {
        const numericValue = parseFloat(customValue);
        const valueValid =
            !isNaN(numericValue) && numericValue > 0 && numericValue <= 100;

        if (valueValid) return numericValue;
    }, [customValue]);

    useEffect(() => {
        if (numericCustomValue)
            setSlippage(Math.round(numericCustomValue * 100));
    }, [numericCustomValue]);

    useClickAway(rootRef, () => {
        setPopoverOpen(false);
    });

    const handleCustomInput = (value: string) => {
        // Remove any non-numeric characters except decimal point
        const sanitizedValue = value.replace(/[^\d.]/g, "");
        setCustomValue(sanitizedValue);
    };

    function handlePopoverToggle() {
        setPopoverOpen((prev) => !prev);
    }

    const setDefaultSlippage = (value: number) => {
        setSlippage(value);
        setCustomValue("");
    };

    const getSlippageOnClickHandler = useCallback((value: number) => {
        return () => {
            setDefaultSlippage(value);
        };
    }, []);

    return (
        <div ref={rootRef}>
            <div className="flex items-center gap-1">
                <Typography uppercase light size="xs" weight="medium">
                    Slippage tolerance:
                </Typography>
                <div ref={setPopoverAnchor}>
                    <Chip
                        size="xs"
                        clickable
                        active={popoverOpen}
                        onClick={handlePopoverToggle}
                        className={{ root: "w-12! py-0! px-1! rounded-sm!" }}
                    >
                        <Typography
                            size="xs"
                            weight="medium"
                            className="text-[11px]!"
                        >
                            {slippage / 100} %
                        </Typography>
                    </Chip>
                </div>
            </div>
            <Popover
                open={popoverOpen}
                anchor={popoverAnchor}
                ref={chainNamePopoverRef}
                placement="right-start"
            >
                <div className="w-full flex flex-col gap-2.5 max-w-72 p-4">
                    <div className="flex gap-2.5">
                        {SLIPPAGE_OPTIONS.map(({ value, label }) => (
                            <Chip
                                key={value}
                                clickable
                                active={slippage === value}
                                onClick={getSlippageOnClickHandler(value)}
                                className={{ root: "rounded-md!" }}
                            >
                                <Typography weight="medium">{label}</Typography>
                            </Chip>
                        ))}
                    </div>

                    <div className="flex flex-col gap-2.5">
                        <NumberInput
                            value={customValue}
                            suffix="%"
                            onChange={(e) => handleCustomInput(e.target.value)}
                            placeholder="Custom"
                        />
                        {numericCustomValue && numericCustomValue > 1 && (
                            <Typography
                                uppercase
                                size="xs"
                                weight="medium"
                                className="text-orange-400!"
                            >
                                Slippage tolerance above 1% could lead to an
                                unfavorable rate
                            </Typography>
                        )}
                    </div>
                </div>
            </Popover>
        </div>
    );
};

export default Slippage;
