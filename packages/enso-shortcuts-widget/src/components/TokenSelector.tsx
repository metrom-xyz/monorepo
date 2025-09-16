import { useCallback, useEffect, useRef, useState } from "react";
import { useMemo } from "react";
import { Address, isAddress } from "viem";
import { useCurrentChainList } from "../util/common";
import { formatNumber, normalizeValue } from "../util";
import { useEnsoBalances, useEnsoToken } from "../util/enso";
import { SupportedChainId } from "../constants";
import { useClickAway } from "react-use";
import { ProjectFilter, Token } from "../types";
import {
    Button,
    Popover,
    Skeleton,
    TextInput,
    Typography,
} from "@metrom-xyz/ui";
import ChainSelector from "./ChainSelector";
import ProjectSelector from "./ProjectSelector";
import { List, RowComponentProps } from "react-window";
import { TokenIndicator } from "./TokenIndicator";

type TokenWithBalance = Token & {
    balance?: string;
    costUsd?: number;
    apy?: number;
    tvl?: number;
    type: string;
};

const TokenIndicatorSkeleton = () => (
    <div className="w-full flex items-center gap-2">
        <div className="h-7 w-7 theme-surface rounded-full animate-pulse" />
        <div className="h-6 w-14 theme-surface animate-pulse rounded-md" />
    </div>
);

const DetailedTokenIndicator = ({
    style,
    index,
    loading,
    value,
    tokens,
    onClick,
}: RowComponentProps<{
    loading: boolean;
    value: string;
    tokens: TokenWithBalance[];
    onClick: (tokens: string) => void;
}>) => {
    const token = tokens[index];

    const handleTokenOnClick = useCallback(() => {
        onClick(token.address);
    }, [onClick, token?.address]);

    if (loading)
        return (
            <div
                style={style}
                className="flex w-full px-4 items-center justify-center"
            >
                <div className="w-full flex gap-3 items-center">
                    <Skeleton circular width={36} />
                    <Skeleton width={80} />
                </div>
                <div className="w-full flex flex-col items-end gap-1">
                    <Skeleton width={36} size="sm" />
                    <Skeleton width={36} size="xs" />
                </div>
            </div>
        );

    if (!token) return null;

    return (
        <div
            style={style}
            className={`w-full flex items-center justify-between px-4 cursor-pointer theme-surface-hover transition-colors duration-200 ease-in-out ${value === token.address ? "theme-surface-active" : ""}`}
            onClick={handleTokenOnClick}
        >
            <TokenIndicator token={token} />
            <div className="w-full flex flex-col gap-1 items-end">
                <Typography size="sm" weight="medium">
                    {token.balance
                        ? formatNumber(
                              normalizeValue(token.balance, token.decimals),
                          )
                        : "-"}
                </Typography>
                <Typography size="xs" weight="medium" light>
                    {token.costUsd ? `$${token.costUsd.toFixed(2)}` : "-"}
                </Typography>
            </div>
        </div>
    );
};

const hasCoincidence = (tokens: Token[], address: Address) =>
    tokens.findIndex(
        (token) =>
            token.address?.toLocaleLowerCase() === address?.toLocaleLowerCase(),
    );

const filterTokensByAddressList = (
    tokens: Token[],
    addressList: Address[],
    include: boolean,
) => {
    const addressSet = new Set(addressList.map((a) => a.toLowerCase()));

    return tokens.filter((token) => {
        const tokenInSet = addressSet.has(token.address.toLowerCase());
        return include ? tokenInSet : !tokenInSet;
    });
};

const TokenSelector = ({
    value,
    onChange,
    // portalRef,
    obligatedToken,
    limitTokens,
    excludeTokens,
    chainId,
    setChainId,
    project,
    projectsFilter,
}: {
    setChainId?: (chainId: SupportedChainId) => void;
    chainId?: SupportedChainId;
    value: Address;
    onChange: (value: string) => void;
    portalRef?: React.RefObject<HTMLDivElement>;
    obligatedToken?: boolean;
    limitTokens?: Address[];
    excludeTokens?: Address[];
    project?: string;
    projectsFilter?: ProjectFilter;
}) => {
    const [searchText, setSearchText] = useState("");
    const [selectionChainId, setSelectionChainId] = useState(chainId);
    const [composedSelectedProject, setComposedSelectedProject] = useState(
        project || "",
    );
    const [popoverOpen, setPopoverOpen] = useState(false);
    const [popoverAnchor, setPopoverAnchor] = useState<HTMLDivElement | null>(
        null,
    );
    const chainNamePopoverRef = useRef<HTMLDivElement>(null);
    const rootRef = useRef<HTMLDivElement>(null);

    const selectedProject = useMemo(() => {
        // Extract the slug from the composed option value slug_logoUri
        if (!composedSelectedProject) return;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const [projectId, _] = composedSelectedProject.split("_");
        return projectId;
    }, [composedSelectedProject]);

    const { data: balances, isLoading: balancesLoading } =
        useEnsoBalances(selectionChainId);
    const {
        data: currentChainTokenList,
        isLoading: tokensLoading,
        isFetched: tokensFetched,
    } = useCurrentChainList(selectionChainId);
    const { tokens: projectTokens, isLoading: projectTokensLoading } =
        useEnsoToken({
            priorityChainId: selectionChainId,
            project: selectedProject,
            enabled: !!selectedProject,
        });

    useClickAway(rootRef, () => {
        setPopoverOpen(false);
    });

    useEffect(() => {
        setSelectionChainId(chainId);
    }, [chainId]);

    const balanceDefiAddresses = useMemo(
        () =>
            balances
                ?.filter(
                    (balance) =>
                        !currentChainTokenList?.find(
                            (token) => token.address === balance.token,
                        ) && +balance.price > 0,
                )
                .map((b) => b.token),
        [currentChainTokenList, balances],
    );

    const { tokens: balanceDefiTokens } = useEnsoToken({
        address: balanceDefiAddresses,
        priorityChainId: selectionChainId,
        enabled: balanceDefiAddresses?.length > 0,
    });

    const currentTokenList = useMemo(
        () =>
            selectedProject
                ? projectTokens
                : [
                      ...(balanceDefiTokens ?? []),
                      ...(currentChainTokenList ?? []),
                  ],
        [
            selectedProject,
            projectTokens,
            currentChainTokenList,
            balanceDefiTokens,
        ],
    );

    const searchAddress =
        currentTokenList?.length &&
        hasCoincidence(currentTokenList, searchText as Address) === -1 &&
        !limitTokens
            ? (searchText as Address)
            : undefined;
    const {
        tokens: [searchedToken],
        isLoading: searchedTokenLoading,
    } = useEnsoToken({
        address: searchAddress,
        priorityChainId: selectionChainId,
        enabled: isAddress(searchAddress),
    });
    const {
        tokens: [valueToken],
        isLoading: valueTokenLoading,
    } = useEnsoToken({
        address: value,
        priorityChainId: selectionChainId,
        enabled: isAddress(value),
    });

    const tokenList = useMemo(() => {
        let tokens = currentTokenList ? currentTokenList.slice() : [];

        if (searchedToken) {
            tokens = [...tokens, searchedToken];
        }

        if (valueToken) {
            const valueTokenIndex = hasCoincidence(tokens, valueToken.address);
            if (valueTokenIndex !== -1) tokens.splice(valueTokenIndex, 1);
            tokens.unshift(valueToken);
        }
        if (limitTokens) {
            tokens = filterTokensByAddressList(tokens, limitTokens, true);
        }

        if (excludeTokens) {
            tokens = filterTokensByAddressList(tokens, excludeTokens, false);
        }

        const balancesWithTotals = tokens.map((token) => {
            const balanceValue = balances?.find?.(
                (b) => b.token === token.address,
            );

            // cut scientific notation
            const balance = Number(balanceValue?.amount).toLocaleString(
                "fullwide",
                {
                    useGrouping: false,
                },
            );

            return balanceValue
                ? {
                      ...token,
                      balance,
                      costUsd:
                          +normalizeValue(balance, balanceValue?.decimals) *
                          +balanceValue?.price,
                  }
                : token;
        });

        //sort by costUsd
        balancesWithTotals.sort((a: TokenWithBalance, b: TokenWithBalance) => {
            return (b.costUsd ?? 0) - (a.costUsd ?? 0);
        });

        return balancesWithTotals;
    }, [
        balances,
        balanceDefiTokens,
        currentTokenList,
        searchedToken,
        valueToken,
        limitTokens,
        excludeTokens,
    ]);

    const tokenOptions = useMemo(() => {
        let items = tokenList;

        if (searchText) {
            const search = searchText.toLocaleLowerCase();

            items = tokenList.filter((token) =>
                [token.symbol, token.name, token.address].some((val) =>
                    val?.toLocaleLowerCase().includes(search),
                ),
            );
        }

        return items;
    }, [tokenList, searchText]);

    const onValueChange = useCallback(
        (tokenAddress: string) => {
            onChange(tokenAddress);
            setChainId(selectionChainId);
            setSelectionChainId(selectionChainId);
            setPopoverOpen(false);
        },
        [onChange, selectionChainId, setChainId],
    );

    const selectValue = useMemo(
        () => (chainId === selectionChainId ? value : ""),
        [value, chainId, selectionChainId],
    );

    // FIXME: not optimal, have the token in the state
    const selectValueToken = useMemo(() => {
        if (!selectValue) return undefined;
        return tokenOptions.find(({ address }) => address === selectValue);
    }, [selectValue, tokenOptions]);

    const handlePopoverToggle = useCallback(() => {
        if (popoverOpen || obligatedToken || searchedToken) setSearchText("");
        setSelectionChainId(chainId);
        setPopoverOpen((prev) => !prev);
    }, [popoverOpen]);

    const loading =
        balancesLoading ||
        projectTokensLoading ||
        tokensLoading ||
        searchedTokenLoading ||
        valueTokenLoading ||
        !tokensFetched;

    const itemCount = useMemo(
        () => Math.max(loading ? 7 : tokenOptions.length, 1),
        [loading, tokenOptions.length],
    );

    return (
        <div ref={rootRef}>
            <Popover
                open={popoverOpen}
                anchor={popoverAnchor}
                ref={chainNamePopoverRef}
                placement="right-start"
            >
                <div className="w-full max-w-[450px] h-[500px]">
                    <div className="flex flex-col w-full h-full gap-2.5">
                        <div className="flex justify-between gap-2 px-4 pt-4">
                            <ChainSelector
                                disabled={!!project}
                                value={selectionChainId}
                                onChange={setSelectionChainId}
                            />
                            <ProjectSelector
                                disabled={!!project}
                                value={composedSelectedProject}
                                onChange={setComposedSelectedProject}
                                chainId={selectionChainId}
                                projectsFilter={projectsFilter}
                            />
                        </div>
                        <TextInput
                            autoFocus
                            size="sm"
                            placeholder="Search by name or paste address"
                            value={searchText}
                            onChange={(e) =>
                                obligatedToken || setSearchText(e.target.value)
                            }
                            className="px-4"
                        />
                        <div className="flex justify-between items-center px-4">
                            <Typography
                                uppercase
                                size="xs"
                                weight="medium"
                                light
                            >
                                Token
                            </Typography>
                            <Typography
                                uppercase
                                size="xs"
                                weight="medium"
                                light
                            >
                                Balance
                            </Typography>
                        </div>
                        <List
                            rowCount={itemCount}
                            rowHeight={48}
                            rowProps={{
                                loading,
                                tokens: loading
                                    ? new Array(7).fill(null)
                                    : (tokenOptions as TokenWithBalance[]),
                                value: selectValue,
                                onClick: onValueChange,
                            }}
                            rowComponent={DetailedTokenIndicator}
                            className="h-[350px]"
                        />
                    </div>
                </div>
            </Popover>
            <div ref={setPopoverAnchor} className="h-full">
                <Button
                    variant="secondary"
                    size="sm"
                    onClick={handlePopoverToggle}
                    className={{ root: "min-h-16! min-w-32! py-2! px-3!" }}
                >
                    {loading ? (
                        <TokenIndicatorSkeleton />
                    ) : selectValueToken ? (
                        <TokenIndicator
                            chainId={selectionChainId}
                            token={selectValueToken || undefined}
                            size="short"
                        />
                    ) : (
                        <Typography size="sm" weight="medium" uppercase>
                            Select token
                        </Typography>
                    )}
                </Button>
            </div>
        </div>
    );
};

export default TokenSelector;
