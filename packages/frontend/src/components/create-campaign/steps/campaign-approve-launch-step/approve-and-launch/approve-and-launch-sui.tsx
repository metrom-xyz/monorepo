"use client";

import { ArrowRightIcon } from "@/src/assets/arrow-right-icon";
import { useChainWithType } from "@/src/hooks/useChainWithType";
import { useChainData } from "@/src/hooks/useChainData";
import { Button } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import type { ApproveAndLaunchProps } from ".";
import { useCallback, useEffect, useState } from "react";
import { DistributablesType } from "@metrom-xyz/sdk";
import { zeroHash } from "viem";
import { buildCampaignDataBundleSui } from "@/src/utils/campaign-bundle";
import { WalletIcon } from "@/src/assets/wallet-icon";
import {
    useCurrentAccount,
    useCurrentClient,
    useDAppKit,
} from "@mysten/dapp-kit-react";
import { Transaction } from "@mysten/sui/transactions";
import {
    createRewardsCampaign,
    createPointsCampaign,
} from "@metrom-xyz/sui-contracts/client";
import { trackUmamiEvent } from "@/src/utils/umami";
import { ConnectButtonSui } from "@/src/components/connect-button/sui";
import styles from "./styles.module.css";
import { fromHex } from "@mysten/sui/utils";

export function ApproveAndDeploySui({
    payload,
    specificationHash,
    uploadingSpecification,
    disabled,
    onAllTokensApproved,
    onLaunch,
}: ApproveAndLaunchProps) {
    const [deploying, setDeploying] = useState(false);
    const [transaction, setTransaction] = useState<Transaction>();

    const t = useTranslations("newCampaign.form.approveLaunch");
    const { id: chainId } = useChainWithType();
    const chainData = useChainData({ chainId });
    const payloadChainData = useChainData({ chainId: payload.chainId });
    const account = useCurrentAccount();
    const client = useCurrentClient();
    const dAppKit = useDAppKit();

    // No token approval step needed on Sui
    useEffect(() => {
        onAllTokensApproved(true);
    }, [onAllTokensApproved]);

    useEffect(() => {
        const build = async () => {
            setTransaction(undefined);

            if (
                !chainData ||
                !account ||
                !chainData.metromContract.stateAddress
            )
                return;

            const data = buildCampaignDataBundleSui(payload);
            if (data === null) return;

            const specHashBytes =
                specificationHash === zeroHash
                    ? null
                    : Array.from(fromHex(specificationHash));

            let transaction: Transaction | undefined;

            if (payload.isDistributing(DistributablesType.Tokens)) {
                if (payload.distributables.tokens.length > 1) {
                    console.error(
                        "Multiple reward tokens not supported on Sui",
                    );
                    return;
                }

                const { token, amount } = payload.distributables.tokens[0];

                transaction = new Transaction();
                transaction.setSender(account.address);

                const rewardCoin = transaction.coin({
                    balance: amount.raw,
                    type: token.address,
                });

                createRewardsCampaign({
                    package: chainData.metromContract.address,
                    typeArguments: [token.address],
                    arguments: {
                        state: chainData.metromContract.stateAddress,
                        from: BigInt(payload.startDate.unix()),
                        to: BigInt(payload.endDate.unix()),
                        kind: payload.kind,
                        data: Array.from(data),
                        specificationHash: specHashBytes,
                        rewardCoin,
                    },
                })(transaction);
            } else if (payload.isDistributing(DistributablesType.FixedPoints)) {
                const { points, fee } = payload.distributables;

                transaction = new Transaction();
                transaction.setSender(account.address);

                const feeCoin = transaction.coin({
                    balance: fee.amount.raw,
                    type: fee.token.address,
                });

                createPointsCampaign({
                    package: chainData.metromContract.address,
                    typeArguments: [fee.token.address],
                    arguments: {
                        state: chainData.metromContract.stateAddress,
                        from: BigInt(payload.startDate.unix()),
                        to: BigInt(payload.endDate.unix()),
                        kind: payload.kind,
                        data: Array.from(data),
                        specificationHash: specHashBytes,
                        points: BigInt(points),
                        feeCoin,
                    },
                })(transaction);
            }

            if (!transaction) return;

            try {
                const simulation = await client.simulateTransaction({
                    transaction,
                    include: {
                        effects: true,
                        balanceChanges: true,
                        commandResults: true,
                    },
                });

                if (simulation.$kind === "FailedTransaction") {
                    console.warn("Campaign creation simulation failed");
                    return;
                }

                setTransaction(transaction);
            } catch (error) {
                console.warn("Could not simulate campaign creation", error);
            }
        };

        void build();
    }, [payload, specificationHash, account, chainData, client]);

    const handleOnDeploy = useCallback(() => {
        if (!transaction || !account) return;

        const deploy = async () => {
            setDeploying(true);
            try {
                const result = await dAppKit.signAndExecuteTransaction({
                    transaction,
                });

                if (result.$kind === "FailedTransaction") {
                    console.warn("Campaign creation transaction failed");
                    return;
                }

                await client.waitForTransaction({
                    digest: result.Transaction.digest,
                });

                onLaunch();
                trackUmamiEvent("click-deploy-campaign");
            } catch (error) {
                console.warn("Could not create campaign", error);
            } finally {
                setDeploying(false);
            }
        };

        void deploy();
    }, [transaction, account, dAppKit, client, onLaunch]);

    if (payload.chainId !== chainId) {
        return (
            <div className={styles.buttonsWrapper}>
                <Button className={{ root: styles.button }}>
                    {t("switchChain", { chain: payloadChainData?.name || "" })}
                </Button>
            </div>
        );
    }

    if (!account) {
        return (
            <div className={styles.buttonsWrapper}>
                <ConnectButtonSui
                    customComponent={
                        <Button
                            icon={WalletIcon}
                            iconPlacement="right"
                            className={{ root: styles.button }}
                        >
                            {t("connectWallet")}
                        </Button>
                    }
                />
            </div>
        );
    }

    return (
        <div className={styles.buttonsWrapper}>
            <Button
                icon={ArrowRightIcon}
                iconPlacement="right"
                disabled={disabled || !transaction}
                loading={uploadingSpecification || deploying}
                onClick={handleOnDeploy}
                className={{ root: styles.button }}
            >
                {t("deploy")}
            </Button>
        </div>
    );
}
