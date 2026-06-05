import { ArrowRightIcon } from "@/src/assets/arrow-right-icon";
import { useChainWithType } from "@/src/hooks/useChainWithType";
import { useChainData } from "@/src/hooks/useChainData";
import { Button } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import type { ApproveAndLaunchProps } from ".";
import { useCallback, useEffect, useMemo, useState } from "react";
import { DistributablesType } from "@metrom-xyz/sdk";
import { zeroHash } from "viem";
import { buildCampaignDataBundleSvm } from "@/src/utils/campaign-bundle";
import { useAccount } from "@/src/hooks/useAccount";
import { WalletIcon } from "@/src/assets/wallet-icon";
import {
    useLatestBlockhash,
    useSimulateTransaction,
    useSolanaClient,
    useWalletConnection,
} from "@solana/react-hooks";
import {
    getBase64EncodedWireTransaction,
    getBase16Codec,
    type Address,
    pipe,
    createTransactionMessage,
    setTransactionMessageFeePayerSigner,
    setTransactionMessageLifetimeUsingBlockhash,
    appendTransactionMessageInstruction,
    type Base64EncodedWireTransaction,
    compileTransaction,
    getAddressEncoder,
    getU64Encoder,
    getU32Encoder,
    getProgramDerivedAddress,
    signTransactionMessageWithSigners,
} from "@solana/kit";
import {
    TOKEN_PROGRAM_ADDRESS,
    createWalletTransactionSigner,
} from "@solana/client";
import { trackUmamiEvent } from "@/src/utils/umami";
import { getCreateRewardsCampaignInstructionAsync } from "@metrom-xyz/programs-solana/client";
import type { SolanaTxMessage } from "@/src/types/solana";
import { useSolanaTransactionSignature } from "@/src/hooks/useSolanaTransactionSignature";
import { ConnectButtonSvm } from "@/src/components/connect-button/svm";

import styles from "./styles.module.css";

export function ApproveAndDeploySvm({
    payload,
    specificationHash,
    uploadingSpecification,
    disabled,
    onAllTokensApproved,
    onLaunch,
}: ApproveAndLaunchProps) {
    const [deploying, setDeploying] = useState(false);
    const [txMessage, setTxMessage] = useState<SolanaTxMessage>();
    const [base64Wire, setBase64Wire] =
        useState<Base64EncodedWireTransaction>();

    const t = useTranslations("newCampaign.form.approveLaunch");
    const { id: chainId } = useChainWithType();
    const chainData = useChainData({ chainId });
    const payloadChainData = useChainData({ chainId: payload.chainId });
    const { address } = useAccount();
    const { connected, wallet } = useWalletConnection();
    const client = useSolanaClient();
    const { data: latestBlockhash } = useLatestBlockhash();
    const { waitForConfirmationAsync } = useSolanaTransactionSignature();

    // No token approval needed for Solana
    useEffect(() => {
        onAllTokensApproved(true);
    }, [onAllTokensApproved]);

    const {
        data: simulatedCreate,
        isLoading: simulatingCreate,
        isError: simulateCreateErrored,
        error: simulateCreateError,
    } = useSimulateTransaction(base64Wire, { config: { encoding: "base64" } });

    const signer = useMemo(
        () =>
            wallet ? createWalletTransactionSigner(wallet).signer : undefined,
        [wallet],
    );

    useEffect(() => {
        const buildTransaction = async () => {
            if (
                !chainData ||
                !address ||
                !wallet ||
                !latestBlockhash?.value ||
                !wallet ||
                !signer
            )
                return null;

            const data = buildCampaignDataBundleSvm(payload);
            if (data === null) return null;

            const specHash =
                specificationHash === zeroHash
                    ? new Uint8Array(32)
                    : getBase16Codec().encode(specificationHash.slice(2));

            if (payload.isDistributing(DistributablesType.Tokens)) {
                if (payload.distributables.tokens.length > 1) {
                    console.error(
                        "Multiple reward tokens not supported on Solana",
                    );
                    return null;
                }

                const rewardToken =
                    payload.distributables.tokens[0].token.address;
                const rewardAmount: bigint =
                    payload.distributables.tokens[0].amount.raw;

                const senderTokenAccount = await client
                    .splToken({
                        mint: rewardToken,
                    })
                    .deriveAssociatedTokenAddress(address);

                const [campaignPda] = await getProgramDerivedAddress({
                    programAddress: chainData.metromContract.address as Address,
                    seeds: [
                        "campaign",
                        getAddressEncoder().encode(address as Address),
                        getU64Encoder().encode(
                            BigInt(payload.startDate.unix()),
                        ),
                        getU64Encoder().encode(BigInt(payload.endDate.unix())),
                        getU32Encoder().encode(payload.kind),
                        data,
                        specHash,
                        getAddressEncoder().encode(rewardToken as Address),
                        getU64Encoder().encode(rewardAmount),
                    ],
                });

                const instruction =
                    await getCreateRewardsCampaignInstructionAsync({
                        from: BigInt(payload.startDate.unix()),
                        to: BigInt(payload.endDate.unix()),
                        kind: payload.kind,
                        data,
                        specificationHash: specHash,
                        rewardAmount,
                        mint: rewardToken as Address,
                        senderTokenAccount,
                        tokenProgram: TOKEN_PROGRAM_ADDRESS,
                        signer,
                        // The campaign account derived by the client is wrong because it encodes the data adding a size prefix
                        // while the program expects the raw data, so we manually derive the PDA and override it here
                        campaign: campaignPda,
                    });

                const txMessage = pipe(
                    createTransactionMessage({ version: 0 }),
                    (tx) => setTransactionMessageFeePayerSigner(signer, tx),
                    (tx) =>
                        setTransactionMessageLifetimeUsingBlockhash(
                            latestBlockhash.value,
                            tx,
                        ),
                    (tx) =>
                        appendTransactionMessageInstruction(instruction, tx),
                );

                const tx = compileTransaction(txMessage);
                const base64Wire = getBase64EncodedWireTransaction(tx);

                setTxMessage(txMessage);
                setBase64Wire(base64Wire);
            }

            // TODO: implement Points distribution
            // if (payload.isDistributing(DistributablesType.FixedPoints)) {
            //     setTxArgs({
            //         function: `${chainData.metromContract.address}::metrom::create_points_campaign`,
            //         functionArguments: [
            //             new U64(payload.startDate.unix()),
            //             new U64(payload.endDate.unix()),
            //             new U32(payload.kind),
            //             data,
            //             specHash,
            //             new U64(payload.distributables.points),
            //             payload.distributables.fee.token.address,
            //         ],
            //     });
            // }
        };

        buildTransaction();
    }, [
        signer,
        payload,
        specificationHash,
        latestBlockhash,
        address,
        chainData,
        wallet,
        client,
    ]);

    const handleOnStandardDeploy = useCallback(() => {
        if (
            simulateCreateErrored ||
            !simulatedCreate?.value ||
            !!simulatedCreate.value.err
        ) {
            console.warn(
                `Could not deploy the campaign: ${simulateCreateError}`,
            );
            return;
        }

        if (!txMessage || !base64Wire || !wallet) return;

        const create = async () => {
            setDeploying(true);
            try {
                const signedTx =
                    await signTransactionMessageWithSigners(txMessage);
                const signature = await client.runtime.rpc
                    .sendTransaction(
                        getBase64EncodedWireTransaction(signedTx),
                        { encoding: "base64" },
                    )
                    .send();

                await waitForConfirmationAsync(signature);

                onLaunch();
                trackUmamiEvent("click-deploy-campaign");
            } catch (error) {
                console.warn("Could not create campaign", error);
            } finally {
                setDeploying(false);
            }
        };

        void create();
    }, [
        simulateCreateErrored,
        simulatedCreate,
        wallet,
        txMessage,
        base64Wire,
        simulateCreateError,
        client.runtime.rpc,
        onLaunch,
        waitForConfirmationAsync,
    ]);

    if (payload.chainId !== chainId) {
        return (
            <div className={styles.buttonsWrapper}>
                <Button className={{ root: styles.button }}>
                    {t("switchChain", { chain: payloadChainData?.name || "" })}
                </Button>
            </div>
        );
    }

    if (!connected)
        return (
            <div className={styles.buttonsWrapper}>
                <ConnectButtonSvm
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

    return (
        <div className={styles.buttonsWrapper}>
            <Button
                icon={ArrowRightIcon}
                iconPlacement="right"
                disabled={
                    disabled ||
                    simulateCreateErrored ||
                    !simulatedCreate?.value ||
                    !!simulatedCreate.value.err
                }
                loading={
                    uploadingSpecification || simulatingCreate || deploying
                }
                onClick={handleOnStandardDeploy}
                className={{ root: styles.button }}
            >
                {t("deploy")}
            </Button>
        </div>
    );
}
