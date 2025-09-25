import { useCallback, useEffect, useState } from "react";
import { useWaitForTransactionReceipt } from "wagmi";
import { create } from "zustand";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { useChainEtherscanUrl } from "./common";
import { SupportedChainId } from "../constants";
import { ErrorNotification } from "../components/notifications/error";
import { Button } from "@metrom-xyz/ui";
import { SuccessNotification } from "../components/notifications/success";
import { LoadingNotification } from "../components/notifications/loading";

type TrackParams = {
    hash: `0x${string}` | undefined;
    chainId: SupportedChainId;
    crosschain: boolean;
    message: string;
    onConfirmed: (
        receipt: ReturnType<typeof useWaitForTransactionReceipt>["data"],
    ) => void;
};

const useTrackingStore = create<{
    txs: TrackParams[];
    addTx: (tx: TrackParams) => void;
    removeTx: (hash: `0x${string}`) => void;
}>((set) => ({
    txs: [],
    addTx: (tx: TrackParams) => set((state) => ({ txs: [...state.txs, tx] })),
    removeTx: (hash: `0x${string}`) =>
        set((state) => ({ txs: state.txs.filter((tx) => tx.hash !== hash) })),
}));

export const TxTracker = () => {
    const { txs } = useTrackingStore();

    return (
        <>
            {txs.map((tx) => (
                <Tracker key={tx.hash} {...tx} />
            ))}
        </>
    );
};

export const useTxTracker = () => {
    const { addTx } = useTrackingStore();

    const track = useCallback((args: TrackParams) => {
        if (!args.hash) return;
        addTx(args);
    }, []);

    return { track };
};

enum LayerZeroStatus {
    Pending = "PENDING",
    Success = "SUCCEEDED",
    Failed = "FAILED",
    Inflight = "INFLIGHT",
    Confirming = "CONFIRMING",
    Delivered = "DELIVERED",
}

const useLayerZeroUrl = (hash?: `0x${string}`, reset?: () => void) => {
    const [loadingToastId, setLoadingToastId] = useState<string>();

    const { data } = useQuery({
        queryKey: ["layerZeroUrl", hash || "none", !!reset],
        queryFn: async () => {
            if (!hash) return null;
            return fetch(
                `https://scan.layerzero-api.com/v1/messages/tx/${hash}`,
            )
                .then((res) => res.json())
                .then((res) => res.data[0]);
        },
        refetchInterval: 2000,
        enabled: !!(reset && hash),
    });

    useEffect(() => {
        if (!hash) return;

        const action = (
            <Button
                href={`https://layerzeroscan.com/tx/${hash}`}
                target="_blank"
                rel="noopener noreferrer"
                size="xs"
                className={{
                    contentWrapper: "w-7!",
                }}
            >
                View
            </Button>
        );

        if (!loadingToastId) {
            setLoadingToastId(hash);
            toast.custom(
                () => (
                    <LoadingNotification
                        toastId={hash}
                        title="Pending (0/4)"
                        description="Waiting for source transaction completion"
                        action={action}
                    />
                ),
                { id: hash },
            );
        } else if (
            data?.source?.status &&
            data.source.status !== LayerZeroStatus.Success
        ) {
            toast.custom(
                () => (
                    <LoadingNotification
                        toastId={loadingToastId}
                        title="Pending (1/4)"
                        description="Waiting for funds to be sent on destination"
                        action={action}
                    />
                ),
                { id: loadingToastId },
            );
        } else if (data?.status?.name === LayerZeroStatus.Delivered) {
            reset?.();
            toast.custom(
                () => (
                    <SuccessNotification
                        toastId={loadingToastId}
                        title="Success (4/4)"
                        description="Bridging is complete"
                        action={action}
                    />
                ),
                { id: loadingToastId },
            );
            setLoadingToastId(undefined);
        } else if (data?.status?.name === LayerZeroStatus.Confirming) {
            toast.custom(
                () => (
                    <LoadingNotification
                        toastId={loadingToastId}
                        title="Pending (3/4)"
                        description="Waiting for destination execution"
                        action={action}
                    />
                ),
                { id: loadingToastId },
            );
        } else if (data?.status?.name === LayerZeroStatus.Inflight) {
            toast.custom(
                () => (
                    <LoadingNotification
                        toastId={loadingToastId}
                        title="Pending (2/4)"
                        description="Waiting for funds to be delivered on destination"
                        action={action}
                    />
                ),
                { id: loadingToastId },
            );
        }
    }, [data, hash]);
};

const useSingleChainTransactionTracking = (
    hash: `0x${string}` | undefined,
    chainId: SupportedChainId,
    description: string,
    waitForTransaction: ReturnType<typeof useWaitForTransactionReceipt>,
    reset?: () => void,
) => {
    const [loadingToastId, setLoadingToastId] = useState<string | undefined>();
    const link = useChainEtherscanUrl({ hash, chainId });

    const action = (
        <Button
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            size="xs"
            className={{
                contentWrapper: "w-7!",
            }}
        >
            View
        </Button>
    );

    // toast error if tx failed to be mined and success if it is having confirmation
    useEffect(() => {
        if (!reset) return;

        if (waitForTransaction.error) {
            toast.custom(
                () => (
                    <ErrorNotification
                        toastId={hash}
                        title="Error"
                        description={waitForTransaction.error.message}
                        action={action}
                    />
                ),
                { id: hash },
            );
        } else if (waitForTransaction.data) {
            // Close loading toast if it exists
            setLoadingToastId(undefined);
            // reset tx hash to eliminate recurring notifications
            reset?.();

            toast.custom(
                () => (
                    <SuccessNotification
                        toastId={loadingToastId}
                        title="Success"
                        description={description}
                        action={action}
                    />
                ),
                { id: loadingToastId },
            );
        } else if (waitForTransaction.isLoading) {
            if (!loadingToastId) {
                toast.custom(
                    () => (
                        <LoadingNotification
                            toastId={hash}
                            title="Transaction Pending"
                            description={description}
                            action={action}
                        />
                    ),
                    { id: hash },
                );
                setLoadingToastId(hash);
            }
        }
    }, [
        waitForTransaction.data,
        waitForTransaction.error,
        waitForTransaction.isLoading,
        description,
        link,
        reset,
    ]);
};

const SingleChainTracker = ({
    hash,
    chainId,
    message = "Transaction confirmed",
    onConfirmed,
}: Omit<TrackParams, "crosschain">) => {
    const { removeTx } = useTrackingStore();
    const receipt = useWaitForTransactionReceipt({
        hash,
        chainId,
    });

    useEffect(() => {
        if (receipt.data) {
            onConfirmed?.(receipt.data);
        }
    }, [receipt.data, onConfirmed]);

    useSingleChainTransactionTracking(hash, chainId, message, receipt, () =>
        removeTx(hash),
    );

    return null;
};

const CrosschainTracker = ({
    hash,
    chainId,
    onConfirmed,
}: Omit<TrackParams, "crosschain" | "message">) => {
    const { removeTx } = useTrackingStore();
    const receipt = useWaitForTransactionReceipt({
        hash,
        chainId,
    });

    const reset = () => removeTx(hash);

    useEffect(() => {
        if (receipt.data) {
            onConfirmed?.(receipt.data);
        }
    }, [receipt.data, onConfirmed]);

    useLayerZeroUrl(receipt.data ? hash : undefined, reset);

    return null;
};

const Tracker = (props: TrackParams) => {
    if (props.crosschain) {
        return <CrosschainTracker {...props} />;
    }
    return <SingleChainTracker {...props} />;
};
