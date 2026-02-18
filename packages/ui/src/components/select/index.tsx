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
    type ReactNode,
} from "react";
import type { BaseInputProps, BaseInputSize } from "../commons/input";
import { Popover } from "../popover";
import { TextInput } from "../text-input";
import { useClickAway, useDebounce } from "react-use";
import { List, type RowComponentProps } from "react-window";
import { Typography } from "../typography";
import classNames from "classnames";
import { ChevronUp } from "../../assets/chevron-up";
import { ChevronDown } from "../../assets/chevron-down";
import { matchesSearch } from "../../utils/search";

import styles from "./styles.module.css";

export type ValueType = string | number | null | undefined;

export interface SelectOption<V extends ValueType, D = unknown> {
    label: string;
    color?: string;
    value: V;
    data?: D;
    disabled?: boolean;
}

export type SelectProps<V extends ValueType, O extends SelectOption<V>> = {
    id?: string;
    options: O[];
    value: V;
    search?: boolean;
    loading?: boolean;
    listHeader?: ReactNode;
    listFooter?: ReactNode;
    messages: {
        noResults: string;
    };
    dataTestIds?: {
        textInput?: string;
        option?: string;
    };
    className?: string;
    onChange: (option: O) => void;
    renderOption?: (option: O) => ReactElement;
    renderSelectedPrefix?: (selected: O | null | undefined) => ReactElement;
} & Omit<BaseInputProps<unknown>, "onChange" | "value" | "id">;

type ItemData<
    V extends ValueType,
    O extends SelectOption<V, D>,
    D = unknown,
> = Pick<
    SelectProps<V, O>,
    "options" | "value" | "onChange" | "renderOption"
> & {
    data?: D;
    size?: BaseInputSize;
    dataTestIds?: {
        option?: string;
    };
    className?: string;
};

export const LIST_ITEM_HEIGHT: Record<BaseInputSize, number> = {
    xs: 40,
    sm: 44,
    base: 48,
    lg: 50,
};

export const MAX_VISIBLE_ITEMS = 6;

function Component<
    V extends ValueType,
    O extends SelectOption<V, D>,
    D = unknown,
>(
    {
        id,
        options,
        value,
        size = "base",
        search,
        className,
        disabled,
        loading,
        listHeader,
        listFooter,
        messages,
        dataTestIds,
        onChange,
        renderOption,
        renderSelectedPrefix,
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
        setQuery("");
    });

    useEffect(() => {
        setSelectedOption(options.find((option) => option.value === value));
    }, [debouncedQuery, options, value]);

    useEffect(() => {
        const searchParts = debouncedQuery.toLowerCase().split(" ");

        setFilteredOptions(
            options.filter(
                (option) =>
                    matchesSearch(option.label, searchParts) ||
                    matchesSearch(option.value?.toString() || "", searchParts),
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
        if (disabled || loading) return;
        if (!open) setOpen(true);
    }, [disabled, loading, open]);

    const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
    }, []);

    const handleInnerChange = useCallback(
        (item: O) => {
            onChange(item);
            // Add small timeout before closing the popover to avoid floating label issue
            setTimeout(() => {
                setQuery("");
                setOpen(false);
            }, 10);
        },
        [onChange],
    );

    const rowProps = useMemo(() => {
        const data: ItemData<V, O, D> = {
            options: filteredOptions,
            value,
            size,
            onChange: handleInnerChange,
            renderOption,
            className,
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

    const listHeight = useMemo(() => {
        const visible = Math.min(filteredOptions.length, MAX_VISIBLE_ITEMS);
        return visible * LIST_ITEM_HEIGHT[size];
    }, [filteredOptions.length, size]);

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
                focused={open}
                readOnly={!search}
                icon={open ? ChevronUp : ChevronDown}
                prefixElement={
                    open && search
                        ? null
                        : renderSelectedPrefix
                          ? renderSelectedPrefix(selectedOption)
                          : null
                }
                value={
                    open && search
                        ? query
                        : selectedOption
                          ? selectedOption.label
                          : ""
                }
                disabled={disabled}
                loading={loading}
                size={size}
                {...rest}
                onChange={handleChange}
                onClick={handleClick}
                className={styles.input}
            />
            <Popover
                anchor={anchorEl}
                contained
                open={open}
                margin={4}
                onOpenChange={setOpen}
                placement="bottom-start"
                className={styles.dropdownRoot}
            >
                {listHeader}
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
                    <div
                        style={{
                            height: `${listHeight}px`,
                            overflow: "hidden",
                        }}
                    >
                        <List
                            rowHeight={LIST_ITEM_HEIGHT[size]}
                            rowCount={filteredOptions.length}
                            rowProps={rowProps}
                            rowComponent={OptionRow}
                            style={{
                                height: `${listHeight}px`,
                                width:
                                    anchorEl?.parentElement?.clientWidth ||
                                    "auto",
                            }}
                        />
                    </div>
                )}
                {listFooter}
            </Popover>
        </div>
    );
}

function OptionRow<V extends ValueType, O extends SelectOption<V>>({
    ariaAttributes,
    index,
    style,
    options,
    value,
    size = "base",
    onChange,
    renderOption,
    dataTestIds,
}: RowComponentProps<ItemData<ValueType, O>>) {
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
            onClick={handleClick}
            className={classNames(styles.option, {
                [styles.pickedOption]: value === item.value,
                [styles[size]]: true,
            })}
            {...ariaAttributes}
        >
            {renderOption ? (
                renderOption(item)
            ) : (
                <Typography size={size}>{item.label}</Typography>
            )}
        </div>
    );
}

export const Select = forwardRef(Component) as <
    V extends ValueType,
    O extends SelectOption<V>,
>(
    props: SelectProps<V, O> & { ref?: React.ForwardedRef<HTMLSelectElement> },
) => ReturnType<typeof Component>;
