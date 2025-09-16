import { create } from "zustand";
import { NotifyType } from "./types";

type Notification = {
    message: string;
    variant: NotifyType;
    link?: string;
};

type Store = {
    obligatedChainId?: number | undefined;
    setObligatedChainId: (chainId: number) => void;

    tokenOutChainId?: number | undefined;
    setTokenOutChainId: (chainId: number) => void;

    tokenOutAddress?: string | undefined;
    setTokenOutAddress: (address: string) => void;

    notification?: Notification;
    setNotification: (notification: Notification) => void;
};

export const useStore = create<Store>((set) => ({
    // used if parent app has chain id context
    obligatedChainId: undefined,
    setObligatedChainId: (chainId: number) =>
        set({ obligatedChainId: chainId }),

    tokenOutChainId: undefined,
    setTokenOutChainId: (chainId: number) => set({ tokenOutChainId: chainId }),

    tokenOutAddress: undefined,
    setTokenOutAddress: (address: string) => set({ tokenOutAddress: address }),

    // notification
    notification: undefined,
    setNotification: (notification: Notification) => set({ notification }),
}));
