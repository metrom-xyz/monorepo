import { Button } from "@/src/ui/button";
import type { CampaignPayload } from "@/src/types";
import { usePublicClient, useSimulateContract, useWriteContract } from "wagmi";
import Confetti from "react-confetti";
import numeral from "numeral";
import { useWindowSize } from "react-use";
import { parseUnits } from "viem";
import { metromAbi } from "@metrom-xyz/contracts/abi";
import { useCallback, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Typography } from "@/src/ui/typography";
import { MetromLightLogo } from "@/src/assets/metrom-light-logo";
import { useRouter } from "@/src/i18n/routing";
import { TextField } from "@/src/ui/text-field";
import { Rewards } from "./rewards";
import { Header } from "./header";
import { useChainData } from "@/src/hooks/useChainData";
import { ApproveRewardsButton } from "../approve-rewards-button";

import styles from "./styles.module.css";

interface CampaignPreviewProps {
    malformedPayload: boolean;
    payload: CampaignPayload;
    onBack: () => void;
}

export function CampaignPreview({
    malformedPayload,
    payload,
    onBack,
}: CampaignPreviewProps) {
    const t = useTranslations("campaignPreview");
    const [creating, setCreating] = useState(false);
    const [created, setCreated] = useState(false);

    const feedback = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const { width, height } = useWindowSize();
    const chainData = useChainData();
    const publicClient = usePublicClient();
    const { writeContractAsync } = useWriteContract();

    const secondsDuration = useMemo(() => {
        if (!payload.endDate) return 0;
        return payload.endDate.diff(payload.startDate, "seconds", false);
    }, [payload.endDate, payload.startDate]);

    const {
        data: simulatedCreate,
        isLoading: simulatingCreate,
        isError: simulateCreateErrored,
        error: simulateCreateError,
    } = useSimulateContract({
        abi: metromAbi,
        address: chainData.metromContract.address,
        functionName: "createCampaigns",
        args: [
            payload.pool &&
            payload.startDate &&
            payload.endDate &&
            payload.rewards &&
            payload.rewards.length > 0
                ? [
                      {
                          pool: payload.pool.address,
                          from: payload.startDate.unix(),
                          to: payload.endDate.unix(),
                          // TODO: add specification
                          specification:
                              "0x0000000000000000000000000000000000000000000000000000000000000000",
                          rewards: payload.rewards.map((reward) => ({
                              token: reward.token.address,
                              amount: parseUnits(
                                  reward.amount.toString(),
                                  reward.token.decimals,
                              ),
                          })),
                      },
                  ]
                : [],
        ],
        query: {
            enabled:
                !malformedPayload &&
                !!payload.pool &&
                !!payload.startDate &&
                !!payload.endDate &&
                !!payload.rewards &&
                payload.rewards.length > 0,
        },
    });

    const handleOnDeploy = useCallback(() => {
        if (simulateCreateErrored) {
            console.warn(
                `Could not deploy the campaign: ${simulateCreateError}`,
            );
            return;
        }

        if (!writeContractAsync || !publicClient || !simulatedCreate?.request)
            return;

        const create = async () => {
            setCreating(true);
            try {
                const tx = await writeContractAsync(simulatedCreate.request);
                const receipt = await publicClient.waitForTransactionReceipt({
                    hash: tx,
                });

                if (receipt.status === "reverted") {
                    console.warn("creation transaction reverted");
                    return;
                }

                setCreated(true);
            } catch (error) {
                console.warn("could not create kpi token", error);
            } finally {
                setCreating(false);
            }
        };
        void create();
    }, [
        publicClient,
        simulateCreateError,
        simulateCreateErrored,
        simulatedCreate,
        writeContractAsync,
    ]);

    function handleGoToAllCampaigns() {
        router.push("/");
    }

    // TODO: add notification toast in case of errors
    if (!created) {
        return (
            <div ref={feedback} className={styles.root}>
                <Header
                    backDisabled={simulatingCreate || creating}
                    payload={payload}
                    onBack={onBack}
                />
                <div className={styles.content}>
                    <div className={styles.contentGrid}>
                        <TextField
                            boxed
                            label={t("tvl")}
                            value={numeral(payload.pool?.tvl).format(
                                "($ 0.00 a)",
                            )}
                        />
                        {/* TODO: add apr */}
                        <TextField boxed label={t("apr")} value={"-"} />
                    </div>
                    <Rewards
                        rewards={payload.rewards}
                        campaignDurationSeconds={secondsDuration}
                    />
                    <div className={styles.createButtonContainer}>
                        <ApproveRewardsButton
                            malformedPayload={malformedPayload}
                            payload={payload}
                            disabled={malformedPayload || simulateCreateErrored}
                            deploying={simulatingCreate || creating}
                            onDeploy={handleOnDeploy}
                        />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.feedback}>
            <MetromLightLogo className={styles.metromLogo} />
            <Typography uppercase weight="medium">
                {t("congratulations")}
            </Typography>
            <Typography variant="xl2" weight="medium">
                {t("launched")}
            </Typography>
            <div className={styles.feedbackActionsContainer}>
                <Button
                    onClick={handleGoToAllCampaigns}
                    variant="secondary"
                    className={{ root: styles.feedbackButton }}
                >
                    {t("allCampaigns")}
                </Button>
                <Button
                    onClick={onBack}
                    className={{ root: styles.feedbackButton }}
                >
                    {t("newCampaign")}
                </Button>
            </div>
            <Confetti
                numberOfPieces={600}
                confettiSource={{
                    x: 0,
                    y: 0,
                    w: width,
                    h: height,
                }}
                run={true}
                width={width}
                height={height}
                recycle={false}
                initialVelocityY={30}
                colors={["#163A5F", "#45EBA5", "#21ABA5", "#1D566E", "#163A5F"]}
            />
        </div>
    );
}
