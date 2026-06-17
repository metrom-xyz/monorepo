"use client";

import { Typography, Button, Card } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { formatAmount, formatUsdAmount } from "@/src/utils/format";
import { trackUmamiEvent } from "@/src/utils/umami";
import { RemoteLogo } from "@/src/components/remote-logo";
import { ClaimSuccess } from "../../notification/claim-success";
import { ClaimFail } from "../../notification/claim-fail";
import { useChainData } from "@/src/hooks/useChainData";
import type { TokenClaimProps } from ".";
import {
    useCurrentAccount,
    useCurrentClient,
    useDAppKit,
} from "@mysten/dapp-kit-react";
import { Transaction } from "@mysten/sui/transactions";
import { claimRewards } from "@metrom-xyz/sui-contracts/client";
import { fromHex } from "@mysten/sui/utils";

import styles from "./styles.module.css";

export function TokenClaimSui({
    onClaim,
    chainId,
    tokenClaims,
    claimingAll,
}: TokenClaimProps) {
    const [claiming, setClaiming] = useState(false);
    const [claimed, setClaimed] = useState(false);
    const [loading, setLoading] = useState(false);
    const [transaction, setTransaction] = useState<Transaction>();

    const t = useTranslations("rewards.claims");
    const chainData = useChainData({ chainId });
    const account = useCurrentAccount();
    const client = useCurrentClient();
    const dAppKit = useDAppKit();

    useEffect(() => {
        const build = async () => {
            setTransaction(undefined);

            if (!chainData || !account || !chainData.metromContract.stateAddress)
                return;

            const tx = new Transaction();
            tx.setSender(account.address);

            for (const claim of tokenClaims.claims) {
                claimRewards({
                    package: chainData.metromContract.address,
                    typeArguments: [claim.token.address],
                    arguments: {
                        state: chainData.metromContract.stateAddress,
                        campaignId: Array.from(fromHex(claim.campaignId)),
                        proof: claim.proof.map((p) => Array.from(fromHex(p))),
                        amount: claim.amount.raw,
                        receiver: account.address,
                    },
                })(tx);
            }

            setLoading(true);

            try {
                const result = await client.simulateTransaction({
                    transaction: tx,
                    checksEnabled: false,
                    include: { effects: true },
                });

                if (result.$kind === "FailedTransaction") {
                    console.warn("Claim simulation failed");
                    return;
                }

                setTransaction(tx);
            } catch (error) {
                console.warn("Could not simulate claim", error);
            } finally {
                setLoading(false);
            }
        };

        void build();
    }, [account, chainData, client, tokenClaims.claims]);

    const handleClaim = useCallback(() => {
        if (!transaction || !account) return;

        const claim = async () => {
            setClaiming(true);
            try {
                const result = await dAppKit.signAndExecuteTransaction({
                    transaction,
                });

                if (result.$kind === "FailedTransaction") {
                    console.warn("Claim transaction failed");
                    toast.custom((toastId) => <ClaimFail toastId={toastId} />);
                    return;
                }

                await client.waitForTransaction({
                    digest: result.Transaction.digest,
                });

                toast.custom((toastId) => (
                    <ClaimSuccess
                        toastId={toastId}
                        chain={chainId}
                        token={tokenClaims.token}
                        amount={tokenClaims.totalAmount}
                    />
                ));
                setClaimed(true);
                onClaim(tokenClaims.token);
                trackUmamiEvent("click-claim-single");
            } catch (error) {
                toast.custom((toastId) => <ClaimFail toastId={toastId} />);
                console.warn("Could not claim", error);
            } finally {
                setClaiming(false);
            }
        };

        void claim();
    }, [
        transaction,
        account,
        dAppKit,
        client,
        chainId,
        tokenClaims.token,
        tokenClaims.totalAmount,
        onClaim,
    ]);

    return (
        <Card className={styles.root}>
            <div className={styles.leftWrapper}>
                <RemoteLogo
                    chain={chainId}
                    address={tokenClaims.token.address}
                    defaultText={tokenClaims.token.symbol}
                />
                <Typography size="lg" weight="medium">
                    {tokenClaims.token.symbol}
                </Typography>
                <div className={styles.amountWrapper}>
                    <Typography size="lg" weight="medium">
                        {formatAmount({ amount: tokenClaims.totalAmount })}
                    </Typography>
                    <Typography size="sm" weight="medium" variant="tertiary">
                        {formatUsdAmount({
                            amount:
                                tokenClaims.totalAmount *
                                tokenClaims.token.usdPrice,
                        })}
                    </Typography>
                </div>
            </div>
            <Button
                variant="secondary"
                size="sm"
                disabled={!transaction || claimed || claimingAll}
                loading={loading || claiming || claimingAll}
                iconPlacement="right"
                onClick={handleClaim}
            >
                {loading
                    ? t("loading")
                    : claiming || claimingAll
                      ? t("claimingByToken")
                      : t("claimByToken")}
            </Button>
        </Card>
    );
}
