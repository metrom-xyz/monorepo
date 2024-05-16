import { SupportedChain } from "@metrom-xyz/contracts";
import { Cacher } from "./cacher";

export const SUPPORTED_CHAIN_NAMES: Record<SupportedChain, string> = {
    [SupportedChain.Holesky]: "holesky",
};

export const CACHER = new Cacher("metrom-sdk");

export enum SupportedAmm {
    Univ3 = "uni-v3",
    TestIntegral = "test-integral",
}
