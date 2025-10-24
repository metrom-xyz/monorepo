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
import {
    BaseInputWrapper,
    type BaseInputProps,
    type BaseInputSize,
} from "../commons/input";
import { Popover } from "../popover";
import { useDebounce } from "react-use";
import { List, type RowComponentProps } from "react-window";
import { Typography } from "../typography";
import classNames from "classnames";
import { ChevronUp } from "../../assets/chevron-up";
import { ChevronDown } from "../../assets/chevron-down";
import { Check } from "../../assets/check";
import { LIST_ITEM_HEIGHT, type SelectOption, type ValueType } from "../select";

import styles from "./styles.module.css";
import commonStyles from "../commons/styles.module.css";

export type MultiSelectProps<V extends ValueType, O extends SelectOption<V>> = {
    id?: string;
    options: O[];
    values: O[];
    search?: boolean;
    onChange: (option: O[]) => void;
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
} & Omit<BaseInputProps<unknown>, "onChange" | "values" | "value" | "id">;

type ItemData<V extends ValueType, O extends SelectOption<V>> = Pick<
    MultiSelectProps<V, O>,
    "options" | "values" | "renderOption"
> & {
    onSelect: (option: O) => void;
    size?: BaseInputSize;
    dataTestIds?: {
        option?: string;
    };
    className?: string;
};

function Component<V extends ValueType, O extends SelectOption<V>>(
    {
        id,
        label,
        hideLabel,
        placeholder,
        error,
        size = "base",
        options,
        values,
        search,
        onChange,
        renderOption,
        disabled,
        loading,
        messages,
        dataTestIds,
        className,
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

            let newValues = [];
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

    return (
        <div ref={dropdownRef} className={className}>
            <BaseInputWrapper
                data-testid={dataTestIds?.textInput}
                id={resolvedId}
                size={size}
                label={label}
                hideLabel={hideLabel}
                readOnly={!search}
                icon={open ? ChevronUp : ChevronDown}
                loading={loading}
                error={error}
                {...rest}
                className={styles.baseInputWrapper}
            >
                <div
                    ref={(element) => {
                        if (ref) {
                            if (typeof ref === "function") ref(element);
                            else ref.current = element;
                        }
                        setAnchorEl(element);
                    }}
                    onClick={handleClick}
                    className={classNames(
                        "inputWrapper",
                        commonStyles.input,
                        styles.inputWrapper,
                        {
                            [styles[size]]: true,
                            [styles.active]: open,
                            [styles.error]: error,
                        },
                    )}
                >
                    {selectedOptions.length > 0 && (
                        <>
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
                        </>
                    )}
                    <input
                        id={resolvedId}
                        ref={inputRef}
                        type="text"
                        tabIndex={!search ? -1 : 0}
                        readOnly={!search}
                        autoFocus={open && search}
                        placeholder={values.length === 0 ? placeholder : ""}
                        value={open && search ? query : ""}
                        disabled={loading || disabled}
                        {...rest}
                        onChange={handleChange}
                        className={classNames("input", styles.input, {
                            [styles.visible]: search,
                        })}
                    />
                </div>
            </BaseInputWrapper>
            <Popover
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
                    <List
                        rowHeight={LIST_ITEM_HEIGHT[size]}
                        rowCount={filteredOptions.length}
                        rowProps={rowProps}
                        rowComponent={OptionRow}
                        style={{
                            width:
                                anchorEl?.parentElement?.clientWidth || "auto",
                        }}
                        className={styles.list}
                    />
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
