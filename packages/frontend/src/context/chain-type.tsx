"use client";

import { ChainType } from "@metrom-xyz/sdk";
import {
    createContext,
    useCallback,
    useContext,
    useState,
    type ReactNode,
} from "react";

const STORAGE_KEY = "metrom.chainType";
const LAST_WALLET_STORAGE_KEY_PREFIX = "metrom.lastWallet.";
const VALID_CHAIN_TYPES = new Set(Object.values(ChainType));

const ChainTypeContext = createContext<{
    chainType: ChainType;
    setChainType: (t: ChainType) => void;
    getLastWallet: (t: ChainType) => string | null;
    setLastWallet: (t: ChainType, id: string) => void;
    clearLastWallet: (t: ChainType) => void;
    autoConnecting: boolean;
    setAutoConnecting: (autoConnecting: boolean) => void;
} | null>(null);

export function ChainTypeProvider({ children }: { children: ReactNode }) {
    // The parent is dynamic (ssr:false), so window always exists here
    const [chainType, setChainTypeState] = useState<ChainType>(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        return VALID_CHAIN_TYPES.has(stored as ChainType)
            ? (stored as ChainType)
            : ChainType.Evm;
    });

    const [autoConnecting, setAutoConnecting] = useState(false);

    // The last connected wallet identity per ecosystem, so
    // it can be silently reconnected when switching back to that ecosystem.
    const getLastWallet = useCallback((type: ChainType) => {
        return localStorage.getItem(`${LAST_WALLET_STORAGE_KEY_PREFIX}${type}`);
    }, []);

    const setChainType = useCallback(
        (type: ChainType) => {
            if (type === chainType) return;

            localStorage.setItem(STORAGE_KEY, type);

            setAutoConnecting(!!getLastWallet(type));
            setChainTypeState(type);
        },
        [chainType, getLastWallet],
    );

    const setLastWallet = useCallback((t: ChainType, id: string) => {
        localStorage.setItem(`${LAST_WALLET_STORAGE_KEY_PREFIX}${t}`, id);
    }, []);

    const clearLastWallet = useCallback((t: ChainType) => {
        localStorage.removeItem(`${LAST_WALLET_STORAGE_KEY_PREFIX}${t}`);
    }, []);

    return (
        <ChainTypeContext
            value={{
                chainType,
                setChainType,
                getLastWallet,
                setLastWallet,
                clearLastWallet,
                autoConnecting,
                setAutoConnecting,
            }}
        >
            {children}
        </ChainTypeContext>
    );
}

export function useChainType() {
    const context = useContext(ChainTypeContext);
    if (!context)
        throw new Error("useChainType must be used within ChainTypeProvider");
    return context;
}
