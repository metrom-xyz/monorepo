import { SupportedOdysseyStrategy } from "@metrom-xyz/sdk";
import type { FunctionComponent } from "react";
import type { SVGIcon } from "../types/common";

export interface OdysseyStrategyData {
    id: SupportedOdysseyStrategy;
    name: string;
    icon?: FunctionComponent<SVGIcon>;
    docs?: string;
}

export const ODYSSEY_STRATEGIES: Record<
    SupportedOdysseyStrategy,
    OdysseyStrategyData
> = {
    [SupportedOdysseyStrategy.AaveV3BorrowStrategy]: {
        id: SupportedOdysseyStrategy.AaveV3BorrowStrategy,
        name: "Aave V3 borrow",
    },
    [SupportedOdysseyStrategy.AjnaBorrowStrategy]: {
        id: SupportedOdysseyStrategy.AjnaBorrowStrategy,
        name: "Ajna borrow",
    },
    [SupportedOdysseyStrategy.CompoundV2BorrowStrategy]: {
        id: SupportedOdysseyStrategy.CompoundV2BorrowStrategy,
        name: "Compound V2 borrow",
    },
    [SupportedOdysseyStrategy.CompoundV2VesperStrategy]: {
        id: SupportedOdysseyStrategy.CompoundV2VesperStrategy,
        name: "Compound V2 vesper",
    },
    [SupportedOdysseyStrategy.CompoundV3BorrowStrategy]: {
        id: SupportedOdysseyStrategy.CompoundV3BorrowStrategy,
        name: "Compound V3 borrow",
    },
    [SupportedOdysseyStrategy.CompoundV3VesperStrategy]: {
        id: SupportedOdysseyStrategy.CompoundV3VesperStrategy,
        name: "Compound V3 vesper",
    },
    [SupportedOdysseyStrategy.SynthStrategy]: {
        id: SupportedOdysseyStrategy.SynthStrategy,
        name: "Metronome Synth",
    },
    [SupportedOdysseyStrategy.ERC4626Strategy]: {
        id: SupportedOdysseyStrategy.ERC4626Strategy,
        name: "ERC4626",
    },
    [SupportedOdysseyStrategy.EulerV2BorrowStrategy]: {
        id: SupportedOdysseyStrategy.EulerV2BorrowStrategy,
        name: "Euler V2 borrow",
    },
    [SupportedOdysseyStrategy.MorphoBorrowStrategy]: {
        id: SupportedOdysseyStrategy.MorphoBorrowStrategy,
        name: "Morpho borrow",
    },
};

export const ODYSSEY_BORROW_STRATEGIES: SupportedOdysseyStrategy[] = [
    SupportedOdysseyStrategy.AaveV3BorrowStrategy,
    SupportedOdysseyStrategy.AjnaBorrowStrategy,
    SupportedOdysseyStrategy.CompoundV2BorrowStrategy,
    SupportedOdysseyStrategy.CompoundV3BorrowStrategy,
    SupportedOdysseyStrategy.EulerV2BorrowStrategy,
    SupportedOdysseyStrategy.MorphoBorrowStrategy,
];
