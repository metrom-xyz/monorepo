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
const VALID_CHAIN_TYPES = new Set(Object.values(ChainType));

const ChainTypeContext = createContext<{
    chainType: ChainType;
    setChainType: (t: ChainType) => void;
} | null>(null);

export function ChainTypeProvider({ children }: { children: ReactNode }) {
    // The parent is dynamic (ssr:false), so window always exists here
    const [chainType, setChainTypeState] = useState<ChainType>(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        return VALID_CHAIN_TYPES.has(stored as ChainType)
            ? (stored as ChainType)
            : ChainType.Evm;
    });

    const setChainType = useCallback((t: ChainType) => {
        localStorage.setItem(STORAGE_KEY, t);
        setChainTypeState(t);
    }, []);

    return (
        <ChainTypeContext value={{ chainType, setChainType }}>
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
