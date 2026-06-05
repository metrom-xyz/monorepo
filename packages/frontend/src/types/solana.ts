import type {
    ReadonlyUint8Array,
    TransactionMessage,
    TransactionMessageWithFeePayer,
    TransactionMessageWithSigners,
} from "@solana/kit";

export type Seed = ReadonlyUint8Array | string;

export type SolanaTxMessage = TransactionMessage &
    TransactionMessageWithFeePayer &
    TransactionMessageWithSigners;
