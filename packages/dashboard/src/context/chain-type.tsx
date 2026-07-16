"use client";

import { ECOSYSTEMS } from "@/commons/ecosystems";
import { ChainType } from "@metrom-xyz/sdk";
import {
    createContext,
    useCallback,
    useContext,
    useState,
    type ReactNode,
} from "react";

const STORAGE_KEY = "metrom.chainType";
const VALID_CHAIN_TYPES = new Set(ECOSYSTEMS.map(({ type }) => type));

const ChainTypeContext = createContext<{
    chainType: ChainType;
    setChainType: (t: ChainType) => void;
} | null>(null);

export function ChainTypeProvider({ children }: { children: ReactNode }) {
    const [chainType, setChainTypeState] = useState<ChainType>(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        return VALID_CHAIN_TYPES.has(stored as ChainType)
            ? (stored as ChainType)
            : ChainType.Evm;
    });

    const setChainType = useCallback(
        (type: ChainType) => {
            if (type === chainType) return;

            localStorage.setItem(STORAGE_KEY, type);
            setChainTypeState(type);
        },
        [chainType],
    );

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
