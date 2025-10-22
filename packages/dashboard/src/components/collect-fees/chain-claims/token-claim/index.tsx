import {
    Button,
    Card,
    TextField,
    ToastNotification,
    Typography,
} from "@metrom-xyz/ui";
import { UsdPricedErc20TokenAmount } from "@metrom-xyz/sdk";
import { RemoteLogo } from "@/components/remote-logo";
import { formatAmount, formatUsdAmount } from "@/utils/format";
import { useTranslations } from "next-intl";
import { useAccount, useChainId, useSimulateContract } from "wagmi";
import { toast } from "sonner";
import { metromAbi } from "@metrom-xyz/contracts/abi";
import { useChainData } from "@/hooks/useChainData";
import { useCallback, useState } from "react";
import { SAFE_APP_SDK } from "@/commons";
import { encodeFunctionData } from "viem";
import classNames from "classnames";
import { ClaimReward } from "@/assets/claim-reward";

import styles from "./styles.module.css";

type TokenClaimProps = UsdPricedErc20TokenAmount;

export function TokenClaim({ amount, token }: TokenClaimProps) {
    const t = useTranslations("tokenClaim");
    const chainId = useChainId();
    const { address } = useAccount();
    const chainData = useChainData(chainId);

    const [claiming, setClaiming] = useState(false);

    const { error: simulateClaimError, isLoading: simulatingClaim } =
        useSimulateContract({
            chainId,
            abi: metromAbi,
            address: chainData?.metromContract.address,
            args: address
                ? [[{ receiver: address, token: token.address }]]
                : undefined,
            functionName: "claimFees",
            query: {
                refetchOnMount: false,
                enabled: !!address && !!chainData,
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
                                args: [
                                    [
                                        {
                                            // TODO: what should be the receiver?
                                            receiver: address,
                                            token: token.address,
                                        },
                                    ],
                                ],
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
                        {!!token && !!amount && (
                            <div className={styles.notification}>
                                <RemoteLogo
                                    size="sm"
                                    chain={chainId}
                                    address={token.address}
                                    defaultText={token.symbol}
                                />
                                <Typography size="lg" weight="medium">
                                    {token.symbol}
                                </Typography>
                                <Typography size="lg" weight="medium">
                                    {formatAmount({ amount: amount.formatted })}
                                </Typography>
                                <Typography weight="medium" size="sm" variant="tertiary">
                                    {formatUsdAmount({
                                        amount: amount.usdValue,
                                    })}
                                </Typography>
                            </div>
                        )}
                    </ToastNotification>
                ));
            } catch (error) {
                console.warn("Could not claim fees", error);
            } finally {
                setClaiming(false);
            }
        };

        void claim();
    }, [token, amount, address, chainData, chainId, t]);

    return (
        <Card key={token.address} className={styles.root}>
            <TextField
                label={t("token")}
                value={
                    <div className={styles.field}>
                        <RemoteLogo address={token.address} chain={chainId} />
                        <Typography weight="medium" size="lg">
                            {token.symbol}
                        </Typography>
                    </div>
                }
            />
            <TextField
                label={t("unclaimed")}
                value={
                    <div className={styles.field}>
                        <Typography weight="medium" size="lg">
                            {formatAmount({ amount: amount.formatted })}
                        </Typography>
                        <Typography weight="medium" size="sm" variant="tertiary">
                            {formatUsdAmount({
                                amount: amount.usdValue,
                            })}
                        </Typography>
                    </div>
                }
            />
            <Button
                disabled={!!simulateClaimError || !address}
                loading={simulatingClaim || claiming}
                size="sm"
                variant="secondary"
                onClick={handleClaimOnClick}
                className={{
                    root: classNames({ [styles.error]: !!simulateClaimError }),
                }}
            >
                {t("claim")}
            </Button>
        </Card>
    );
}
