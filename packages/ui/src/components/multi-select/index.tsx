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
import { type BaseInputProps, type BaseInputSize } from "../commons/input";
import { Popover } from "../popover";
import { useClickAway, useDebounce } from "react-use";
import { List, type RowComponentProps } from "react-window";
import { Typography } from "../typography";
import classNames from "classnames";
import { ChevronUp } from "../../assets/chevron-up";
import { ChevronDown } from "../../assets/chevron-down";
import { Check } from "../../assets/check";
import {
    LIST_ITEM_HEIGHT,
    MAX_VISIBLE_ITEMS,
    type SelectOption,
    type ValueType,
} from "../select";
import { TextInput } from "../text-input";

import styles from "./styles.module.css";

export type MultiSelectProps<V extends ValueType, O extends SelectOption<V>> = {
    id?: string;
    options: O[];
    values: O[];
    search?: boolean;
    onOpenChange?: (open: boolean) => void;
    onChange: (option: O[]) => void;
    renderOption?: (option: O) => ReactElement;
    loading?: boolean;
    portalContainer?: HTMLElement | null;
    messages: {
        noResults: string;
    };
    className?: string;
    dataTestIds?: {
        textInput?: string;
        option?: string;
    };
} & Omit<BaseInputProps<unknown>, "onChange" | "values" | "value" | "id">;

type ItemData<V extends ValueType, O extends SelectOption<V>> = Pick<
    MultiSelectProps<V, O>,
    "options" | "values" | "renderOption"
> & {
    onSelect: (option: O) => void;
    size?: BaseInputSize;
    className?: string;
    dataTestIds?: {
        option?: string;
    };
};

function Component<V extends ValueType, O extends SelectOption<V>>(
    {
        id,
        label,
        error,
        size = "base",
        options,
        values,
        search,
        onOpenChange,
        onChange,
        renderOption,
        disabled,
        loading,
        messages,
        portalContainer,
        className,
        dataTestIds,
        ...rest
    }: MultiSelectProps<V, O>,
    ref: ForwardedRef<HTMLDivElement>,
): ReactElement {
    const generatedId = useId();
    const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [debouncedQuery, setdebouncedQuery] = useState(query);
    const [filteredOptions, setFilteredOptions] = useState(options);
    const [selectedOptions, setSelectedOptions] = useState<O[]>([]);

    const resolvedId = id || generatedId;

    useEffect(() => {
        if (!inputRef.current || !search) return;
        if (!open) inputRef.current.blur();
        if (open) inputRef.current.focus();
        setQuery("");
    }, [open, search]);

    useEffect(() => {
        if (!onOpenChange) return;
        onOpenChange(open);
    }, [open, onOpenChange]);

    useEffect(() => {
        setSelectedOptions(values);
    }, [values]);

    useEffect(() => {
        setFilteredOptions(
            options.filter((option) =>
                option.label
                    .toLowerCase()
                    .includes(debouncedQuery.toLowerCase()),
            ),
        );
    }, [debouncedQuery, options]);

    useClickAway(dropdownRef, () => {
        setQuery("");
    });

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

    const handleSelect = useCallback(
        (item: O) => {
            const existing = values.find(({ value }) => value === item.value);

            let newValues: O[] = [];
            if (existing)
                newValues = options.filter(
                    (option) =>
                        values.find(({ value }) => value === option.value) &&
                        option.value !== item.value,
                );
            else
                newValues = options
                    .filter((option) =>
                        values.find(({ value }) => value === option.value),
                    )
                    .concat(item);

            if (inputRef.current && search) inputRef.current.focus();

            setQuery("");
            onChange(newValues);
        },
        [values, search, onChange],
    );

    const rowProps = useMemo(() => {
        const data: ItemData<V, O> = {
            options: filteredOptions,
            values,
            size,
            onSelect: handleSelect,
            renderOption,
            className,
            dataTestIds: {
                option: dataTestIds?.option,
            },
        };
        return data;
    }, [
        className,
        handleSelect,
        filteredOptions,
        renderOption,
        values,
        dataTestIds,
    ]);

    const listHeight = useMemo(() => {
        const visible = Math.min(filteredOptions.length, MAX_VISIBLE_ITEMS);
        return visible * LIST_ITEM_HEIGHT[size];
    }, [filteredOptions.length, size]);

    return (
        <div ref={dropdownRef} className={classNames(className, styles.root)}>
            <TextInput
                ref={(element) => {
                    if (ref) {
                        if (typeof ref === "function") ref(element);
                        else ref.current = element;
                    }
                    setAnchorEl(element);
                }}
                id={resolvedId}
                focused={open || selectedOptions.length > 0}
                size={size}
                label={label}
                readOnly={!search}
                icon={open ? ChevronUp : ChevronDown}
                loading={loading}
                prefixElement={
                    selectedOptions.length > 0 && (
                        <div className={styles.prefix}>
                            <Typography size={size} weight="medium">
                                {label}
                            </Typography>
                            <div
                                className={classNames(styles.counter, {
                                    [styles[size]]: true,
                                })}
                            >
                                <Typography
                                    weight="bold"
                                    className={classNames(styles.counterText, {
                                        [styles[size]]: true,
                                    })}
                                >
                                    {selectedOptions.length}
                                </Typography>
                            </div>
                        </div>
                    )
                }
                value={open && search ? query : ""}
                disabled={loading || disabled}
                error={error}
                {...rest}
                onChange={handleChange}
                onClick={handleClick}
                className={styles.readOnlyInput}
            />
            <Popover
                root={portalContainer}
                anchor={anchorEl}
                contained
                open={open}
                margin={4}
                onOpenChange={setOpen}
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
            </Popover>
        </div>
    );
}

const CHECKBOX_SIZE: Record<BaseInputSize, "base" | "sm"> = {
    xs: "sm",
    sm: "sm",
    base: "base",
    lg: "base",
};

function OptionRow<V extends ValueType, O extends SelectOption<V>>({
    ariaAttributes,
    index,
    style,
    options,
    values,
    size = "base",
    onSelect,
    renderOption,
    dataTestIds,
}: RowComponentProps<ItemData<ValueType, O>>) {
    const item = options[index];

    const handleClick = useCallback(() => {
        onSelect(item);
    }, [item, onSelect]);

    const selected = !!values.find(({ value }) => value === item.value);

    return (
        <div
            data-testid={
                dataTestIds?.option && `${dataTestIds.option}-${item.value}`
            }
            style={style}
            onClick={handleClick}
            className={classNames(styles.option, {
                [styles.pickedOption]: selected,
                [styles[size]]: true,
            })}
            {...ariaAttributes}
        >
            <div
                className={classNames(styles.checkboxWrapper, {
                    [styles[CHECKBOX_SIZE[size]]]: true,
                })}
            >
                <input
                    type="checkbox"
                    readOnly
                    checked={selected}
                    className={classNames(styles.checkbox, {
                        [styles[CHECKBOX_SIZE[size]]]: true,
                    })}
                />
                <Check
                    className={classNames(styles.checkIcon, {
                        [styles.checked]: selected,
                        [styles[CHECKBOX_SIZE[size]]]: true,
                    })}
                />
            </div>
            {renderOption ? (
                <div>{renderOption(item)}</div>
            ) : (
                <Typography size={size}>{item.label}</Typography>
            )}
        </div>
    );
}

export const MultiSelect = forwardRef(Component) as <
    V extends ValueType,
    O extends SelectOption<V>,
>(
    props: MultiSelectProps<V, O> & {
        ref?: React.ForwardedRef<HTMLSelectElement>;
    },
) => ReturnType<typeof Component>;
