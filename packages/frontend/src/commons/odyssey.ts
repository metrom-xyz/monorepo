import { SupportedOdysseyStrategy } from "@metrom-xyz/sdk";

export const ODYSSEY_STRATEGIES_NAME: Record<SupportedOdysseyStrategy, string> =
    {
        [SupportedOdysseyStrategy.AaveV3BorrowStrategy]: "Aave V3 borrow",
        [SupportedOdysseyStrategy.AjnaBorrowStrategy]: "Ajna borrow",
        [SupportedOdysseyStrategy.CompoundV2BorrowStrategy]:
            "Compound V2 borrow",
        [SupportedOdysseyStrategy.CompoundV2VesperStrategy]:
            "Compound V2 vesper",
        [SupportedOdysseyStrategy.CompoundV3BorrowStrategy]:
            "Compound V3 borrow",
        [SupportedOdysseyStrategy.CompoundV3VesperStrategy]:
            "Compound V3 vesper",
        [SupportedOdysseyStrategy.SynthStrategy]: "Synth",
        [SupportedOdysseyStrategy.ERC4626Strategy]: "ERC4626",
        [SupportedOdysseyStrategy.EulerV2BorrowStrategy]: "Euler V2 borrow",
        [SupportedOdysseyStrategy.MorphoBorrowStrategy]: "Morpho borrow",
    };
