import styles from "./styles.module.css";
import { RemoteLogo, type RemoteLogoProps } from "../remote-logo";
import classNames from "classnames";

export interface PoolRemoteLogoProps {
    loading?: boolean;
    size?: "sm" | "md" | "lg" | "xl";
    chain?: number;
    token0?: Omit<RemoteLogoProps, "size" | "chain">;
    token1?: Omit<RemoteLogoProps, "size" | "chain">;
    className?: {
        root?: string;
    };
}

export function PoolRemoteLogo({
    loading,
    size,
    chain,
    token0,
    token1,
    className,
}: PoolRemoteLogoProps) {
    return (
        <div
            className={classNames(
                styles.root,
                size ? styles[size] : styles.selfAdjust,
                className?.root,
            )}
        >
            <RemoteLogo
                loading={loading}
                chain={chain}
                size={size}
                {...token0}
                defaultText={token0?.defaultText}
            />
            <RemoteLogo
                loading={loading}
                chain={chain}
                size={size}
                {...token1}
                defaultText={token1?.defaultText}
            />
        </div>
    );
}
