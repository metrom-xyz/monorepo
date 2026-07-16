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
import { toast } from "sonner";
import { useChainData } from "@/hooks/useChainData";
import { useChainWithType } from "@/hooks/useChainWithType";
import { useCallback, useEffect, useMemo, useState } from "react";
import classNames from "classnames";
import { ClaimReward } from "@/assets/claim-reward";
import {
    Hex,
    InputEntryFunctionData,
    InputGenerateTransactionPayloadData,
    MoveFunctionId,
} from "@aptos-labs/ts-sdk";
import {
    useClients,
    useSignAndSubmitTransaction,
    useSimulateTransaction,
    useAccount as useMvmAccount,
} from "@aptos-labs/react";
import dayjs from "dayjs";

import styles from "./styles.module.css";

type TokenClaimMvmProps = UsdPricedErc20TokenAmount;

export function TokenClaimMvm({ amount, token }: TokenClaimMvmProps) {
    const t = useTranslations("tokenClaim");
    const { id: chainId } = useChainWithType();
    const mvmAccount = useMvmAccount();
    const { aptos } = useClients();
    const chainData = useChainData(chainId);
    const { signAndSubmitTransactionAsync } = useSignAndSubmitTransaction();

    const [claiming, setClaiming] = useState(false);

    const address = mvmAccount?.address.toString();

    const claimTxPayload: InputGenerateTransactionPayloadData | undefined =
        useMemo(() => {
            if (!address || !chainData) return undefined;

            const { metromContract: metrom } = chainData;
            const moveFunction: MoveFunctionId = `${metrom.address}::metrom::claim_fees`;

            return {
                function: moveFunction,
                functionArguments: [token.address, Hex.fromHexInput(address)],
            } as InputEntryFunctionData;
        }, [chainData, address, token]);

    const {
        data: simulatedClaim,
        isLoading: simulatingClaim,
        isError: simulateClaimError,
    } = useSimulateTransaction({
        data: claimTxPayload,
        transactionOptions: {
            expireTimestamp: dayjs().add(1, "minute").unix(),
        },
        options: {
            estimateGasUnitPrice: true,
            estimateMaxGasAmount: true,
        },
        enabled: !!claimTxPayload,
    });

    useEffect(() => {
        if (simulatingClaim || (simulatedClaim && simulatedClaim.success))
            return;

        console.warn(
            `Claim simulation failed with error ${simulatedClaim?.vm_status}`,
            simulatedClaim,
        );
    }, [simulatingClaim, simulatedClaim]);

    const handleClaimOnClick = useCallback(() => {
        if (!chainData || !address || !claimTxPayload) {
            console.warn("Missing parameters to claim fees: aborting");
            return;
        }

        const claim = async () => {
            setClaiming(true);
            try {
                const tx = await signAndSubmitTransactionAsync({
                    data: claimTxPayload,
                });
                const receipt = await aptos.waitForTransaction({
                    transactionHash: tx.hash,
                });

                if (!receipt.success) {
                    console.warn("Claim transaction reverted");
                    throw new Error("Transaction reverted");
                }

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
                                <Typography
                                    weight="medium"
                                    size="sm"
                                    variant="tertiary"
                                >
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
    }, [
        chainData,
        address,
        signAndSubmitTransactionAsync,
        claimTxPayload,
        aptos,
        token,
        t,
        amount,
        chainId,
    ]);

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
                        <Typography
                            weight="medium"
                            size="sm"
                            variant="tertiary"
                        >
                            {formatUsdAmount({
                                amount: amount.usdValue,
                            })}
                        </Typography>
                    </div>
                }
            />
            <Button
                disabled={
                    simulateClaimError || !simulatedClaim?.success || !address
                }
                loading={simulatingClaim || claiming}
                size="sm"
                variant="secondary"
                onClick={handleClaimOnClick}
                className={{
                    root: classNames({
                        [styles.error]: simulateClaimError,
                    }),
                }}
            >
                {t("claim")}
            </Button>
        </Card>
    );
}
