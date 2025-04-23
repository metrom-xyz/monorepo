import React, {
    type ReactElement,
    type ForwardedRef,
    useCallback,
    useState,
    useRef,
    forwardRef,
    useId,
    type ChangeEvent,
    useEffect,
    useMemo,
} from "react";
import type { BaseInputProps } from "../commons/input";
import { Popover } from "../popover";
import { TextInput } from "../text-input";
import { useClickAway, useDebounce } from "react-use";
import { FixedSizeList, type ListChildComponentProps } from "react-window";
import { Typography } from "../typography";
import classNames from "classnames";
import { ChevronUp } from "../../assets/chevron-up";
import { ChevronDown } from "../../assets/chevron-down";

import styles from "./styles.module.css";

export type ValueType = string | number | null;

export interface SelectOption<V extends ValueType> {
    label: string;
    color?: string;
    value: V;
    disabled?: boolean;
}

export type SelectProps<V extends ValueType, O extends SelectOption<V>> = {
    id?: string;
    options: O[];
    value: V;
    search?: boolean;
    onChange: (option: O) => void;
    renderOption?: (option: O) => ReactElement;
    loading?: boolean;
    messages: {
        noResults: string;
    };
    dataTestIds?: {
        textInput?: string;
        option?: string;
    };
    className?: string;
} & Omit<BaseInputProps<unknown>, "onChange" | "value" | "id">;

type ItemData<V extends ValueType, O extends SelectOption<V>> = Pick<
    SelectProps<V, O>,
    "options" | "value" | "onChange" | "renderOption"
> & {
    dataTestIds?: {
        option?: string;
    };
    className?: string;
};

function Component<V extends ValueType, O extends SelectOption<V>>(
    {
        id,
        options,
        value,
        search,
        onChange,
        className,
        renderOption,
        disabled,
        loading,
        messages,
        dataTestIds,
        ...rest
    }: SelectProps<V, O>,
    ref: ForwardedRef<HTMLInputElement>,
): ReactElement {
    const generatedId = useId();
    const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [debouncedQuery, setdebouncedQuery] = useState(query);
    const [filteredOptions, setFilteredOptions] = useState(options);
    const [selectedOption, setSelectedOption] = useState<O | null>();

    const resolvedId = id || generatedId;

    useClickAway(dropdownRef, () => {
        setOpen(false);
        setQuery("");
    });

    useEffect(() => {
        setSelectedOption(options.find((option) => option.value === value));
    }, [debouncedQuery, options, value]);

    useEffect(() => {
        setFilteredOptions(
            options.filter((option) =>
                option.label
                    .toLowerCase()
                    .includes(debouncedQuery.toLowerCase()),
            ),
        );
    }, [debouncedQuery, options]);

    useDebounce(
        () => {
            setdebouncedQuery(query);
        },
        200,
        [query],
    );

    const handleClick = useCallback(() => {
        if (!open && (disabled || loading)) return;
        setOpen(!open);
    }, [disabled, loading, open]);

    const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
    }, []);

    const handleInnerChange = useCallback(
        (item: O) => {
            setOpen(false);
            onChange(item);
        },
        [onChange],
    );

    const itemData = useMemo(() => {
        const data: ItemData<V, O> = {
            options: filteredOptions,
            onChange: handleInnerChange,
            value,
            className,
            renderOption,
            dataTestIds: {
                option: dataTestIds?.option,
            },
        };
        return data;
    }, [
        className,
        handleInnerChange,
        filteredOptions,
        renderOption,
        value,
        dataTestIds,
    ]);

    return (
        <div className={className} ref={dropdownRef}>
            <TextInput
                data-testid={dataTestIds?.textInput}
                ref={(element) => {
                    if (ref) {
                        if (typeof ref === "function") ref(element);
                        else ref.current = element;
                    }
                    setAnchorEl(element);
                }}
                id={resolvedId}
                readOnly={!search}
                icon={open ? ChevronUp : ChevronDown}
                value={
                    open && search
                        ? query
                        : selectedOption
                          ? selectedOption.label
                          : ""
                }
                disabled={disabled}
                loading={loading}
                {...rest}
                className={styles.input}
                onChange={handleChange}
                onClick={handleClick}
            />
            <Popover
                anchor={anchorEl}
                open={open}
                placement="bottom-start"
                className={styles.dropdownRoot}
            >
                {filteredOptions.length === 0 ? (
                    <div
                        style={{
                            width: anchorEl?.parentElement?.clientWidth,
                        }}
                        className={styles.emptyOptionList}
                    >
                        <Typography>{messages.noResults}</Typography>
                    </div>
                ) : (
                    <FixedSizeList<ItemData<V, O>>
                        height={Math.min(filteredOptions.length, 6) * 48}
                        width={anchorEl?.parentElement?.clientWidth || "auto"}
                        itemCount={filteredOptions.length}
                        itemData={itemData}
                        itemSize={48}
                    >
                        {OptionRow}
                    </FixedSizeList>
                )}
            </Popover>
        </div>
    );
}

function OptionRow<V extends ValueType, O extends SelectOption<V>>({
    index,
    style,
    data: { onChange, options, value, renderOption, dataTestIds },
}: ListChildComponentProps<ItemData<ValueType, O>>) {
    const item = options[index];

    const handleClick = useCallback(() => {
        onChange(item);
    }, [item, onChange]);

    return (
        <div
            data-testid={
                dataTestIds?.option && `${dataTestIds.option}-${item.value}`
            }
            style={style}
            className={classNames(styles.option, {
                [styles.pickedOption]: value === item.value,
            })}
            onClick={handleClick}
        >
            {renderOption ? <div>{renderOption(item)}</div> : item.label}
        </div>
    );
}

export const Select = forwardRef(Component) as <
    V extends ValueType,
    O extends SelectOption<V>,
>(
    props: SelectProps<V, O> & { ref?: React.ForwardedRef<HTMLSelectElement> },
) => ReturnType<typeof Component>;
