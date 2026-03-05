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
import { useCallback, useMemo, useState } from "react";
import { SAFE_APP_SDK } from "@/commons";
import { encodeFunctionData } from "viem";
import classNames from "classnames";
import { ClaimReward } from "@/assets/claim-reward";
import { APTOS } from "@/commons/env";
import {
    Hex,
    InputEntryFunctionData,
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

type TokenClaimProps = UsdPricedErc20TokenAmount;

export function TokenClaim({ amount, token }: TokenClaimProps) {
    const t = useTranslations("tokenClaim");
    const chainId = useChainId();
    const { address: evmAddress } = useAccount();
    const mvmAddress = useMvmAccount();
    const { aptos } = useClients();
    const chainData = useChainData(chainId);
    const { signAndSubmitTransactionAsync } = useSignAndSubmitTransaction();

    const [claiming, setClaiming] = useState(false);

    const address = evmAddress || mvmAddress?.address.toString();

    const { error: simulateEvmClaimError, isLoading: simulatingEvmClaim } =
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
                enabled: !!address && !!chainData && !APTOS,
            },
        });

    const claimMvmTxPayload = useMemo(() => {
        if (!address || !chainData || !APTOS) return undefined;

        const { metromContract: metrom } = chainData;
        const moveFunction: MoveFunctionId = `${metrom.address}::metrom::claim_fees`;

        return {
            function: moveFunction,
            functionArguments: [token.address, Hex.fromHexInput(address)],
        } as InputEntryFunctionData;
    }, [chainData, address, token]);

    const {
        data: simulatedMvmClaim,
        isLoading: simulatingMvmClaim,
        isError: simulateMvmClaimError,
    } = useSimulateTransaction({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data: claimMvmTxPayload as any,
        transactionOptions: {
            expireTimestamp: dayjs().add(1, "minute").unix(),
        },
        options: {
            estimateGasUnitPrice: true,
            estimateMaxGasAmount: true,
        },
        enabled: APTOS,
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
                if (APTOS) {
                    const tx = await signAndSubmitTransactionAsync({
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        data: simulatedMvmClaim as any,
                    });
                    const receipt = await aptos.waitForTransaction({
                        transactionHash: tx.hash,
                    });

                    if (!receipt.success) {
                        console.warn("Claim transaction reverted");
                        throw new Error("Transaction reverted");
                    }
                } else {
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
        simulatedMvmClaim,
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
                    !!simulateEvmClaimError || simulateMvmClaimError || !address
                }
                loading={simulatingEvmClaim || simulatingMvmClaim || claiming}
                size="sm"
                variant="secondary"
                onClick={handleClaimOnClick}
                className={{
                    root: classNames({
                        [styles.error]:
                            !!simulateEvmClaimError || simulateMvmClaimError,
                    }),
                }}
            >
                {t("claim")}
            </Button>
        </Card>
    );
}
