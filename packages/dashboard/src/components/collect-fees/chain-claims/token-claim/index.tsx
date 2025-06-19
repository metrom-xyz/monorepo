import { Button, Card, TextField, Typography } from "@metrom-xyz/ui";
import { UsdPricedErc20TokenAmount } from "@metrom-xyz/sdk";
import { RemoteLogo } from "@/components/remote-logo";
import { formatAmount, formatUsdAmount } from "@/utils/format";
import { useTranslations } from "next-intl";
import { useAccount, useChainId, useSimulateContract } from "wagmi";
import { metromAbi } from "@metrom-xyz/contracts/abi";
import { useChainData } from "@/hooks/useChainData";

import styles from "./styles.module.css";

type TokenClaimProps = UsdPricedErc20TokenAmount;

// TODO: add loading state
export function TokenClaim({ amount, token }: TokenClaimProps) {
    const t = useTranslations("tokenClaim");
    const chainId = useChainId();
    const { address } = useAccount();
    const chainData = useChainData(chainId);
    // const { writeContractAsync } = useWriteContract();

    const {
        // data: simulatedClaim,
        error: simulateClaimError,
        isLoading: simulatingClaim,
    } = useSimulateContract({
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
                        <Typography weight="medium" size="sm" light>
                            {formatUsdAmount({
                                amount: amount.usdValue,
                            })}
                        </Typography>
                    </div>
                }
            />
            <Button
                disabled={!!simulateClaimError || !address}
                loading={simulatingClaim}
                size="sm"
                variant="secondary"
            >
                {t("claim")}
            </Button>
        </Card>
    );
}
