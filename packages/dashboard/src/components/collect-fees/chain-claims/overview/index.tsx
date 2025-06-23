import {
    Button,
    Card,
    TextField,
    ToastNotification,
    Typography,
} from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import { FunctionComponent, useCallback, useMemo, useState } from "react";
import { SVGIcon } from "@/types/common";
import { formatUsdAmount } from "@/utils/format";
import { useAccount, useChainId, useSimulateContract } from "wagmi";
import { useChainData } from "@/hooks/useChainData";
import { metromAbi } from "@metrom-xyz/contracts/abi";
import { UsdPricedErc20TokenAmount } from "@metrom-xyz/sdk";
import { toast } from "sonner";
import { ClaimReward } from "@/assets/claim-reward";
import { RemoteLogo } from "@/components/remote-logo";
import { SAFE_APP_SDK } from "@/commons";
import { encodeFunctionData } from "viem";

import styles from "./styles.module.css";

interface OverviewProps {
    loading: boolean;
    chain?: string;
    icon?: FunctionComponent<SVGIcon>;
    totalUsd?: number;
    tokens?: UsdPricedErc20TokenAmount[];
}

export function Overview({
    loading,
    chain,
    icon: Icon,
    totalUsd,
    tokens,
}: OverviewProps) {
    const t = useTranslations("overview");
    const chainId = useChainId();
    const { address } = useAccount();
    const chainData = useChainData(chainId);
    const [claiming, setClaiming] = useState(false);

    const claimArgs = useMemo(() => {
        if (!tokens || !address) return [];

        return tokens.map(({ token }) => ({
            receiver: address,
            token: token.address,
        }));
    }, [address, tokens]);

    const { error: simulateClaimError, isLoading: simulatingClaim } =
        useSimulateContract({
            chainId,
            abi: metromAbi,
            address: chainData?.metromContract.address,
            args: [claimArgs],
            functionName: "claimFees",
            query: {
                refetchOnMount: false,
                enabled: claimArgs.length > 0 && !!address && !!chainData,
            },
        });

    const handleClaimOnClick = useCallback(() => {
        if (!chainData || !address) {
            console.warn(
                "Missing parameters to claim fees through Safe: aborting",
            );
            return;
        }

        const claim = async () => {
            setClaiming(true);
            try {
                await SAFE_APP_SDK.txs.send({
                    txs: [
                        {
                            to: chainData.metromContract.address,
                            data: encodeFunctionData({
                                abi: metromAbi,
                                functionName: "claimFees",
                                args: [claimArgs],
                            }),
                            value: "0",
                        },
                    ],
                });

                toast.custom((toastId) => (
                    <ToastNotification
                        toastId={toastId}
                        title={t("txSubmitted")}
                        icon={ClaimReward}
                    >
                        {
                            <div className={styles.notification}>
                                <div className={styles.tokens}>
                                    {tokens?.map(({ token }) => (
                                        <RemoteLogo
                                            key={token.address}
                                            size="sm"
                                            chain={chainId}
                                            address={token.address}
                                            defaultText={token.symbol}
                                            className={styles.token}
                                        />
                                    ))}
                                </div>
                                <Typography weight="medium" size="sm" light>
                                    {formatUsdAmount({
                                        amount: totalUsd,
                                    })}
                                </Typography>
                            </div>
                        }
                    </ToastNotification>
                ));
            } catch (error) {
                console.warn("Could not claim fees", error);
            } finally {
                setClaiming(false);
            }
        };

        void claim();
    }, [claimArgs, tokens, totalUsd, address, chainData, chainId, t]);

    return (
        <Card className={styles.root}>
            <TextField
                label={t("chain")}
                loading={loading}
                size="xl4"
                value={
                    <div className={styles.field}>
                        {Icon && <Icon className={styles.icon} />}
                        <Typography size="xl4" weight="medium">
                            {chain}
                        </Typography>
                    </div>
                }
            />
            <TextField
                label={t("unclaimed")}
                loading={loading}
                size="xl4"
                value={
                    <Typography size="xl4" weight="medium">
                        {formatUsdAmount({ amount: totalUsd })}
                    </Typography>
                }
            />
            <Button
                disabled={!!simulateClaimError || !address}
                loading={loading || simulatingClaim || claiming}
                size="sm"
                onClick={handleClaimOnClick}
            >
                {t("claimAll")}
            </Button>
        </Card>
    );
}
