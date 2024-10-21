import styles from "./styles.module.css";
import { RemoteLogo, type RemoteLogoProps } from "../remote-logo";
import classNames from "classnames";

export interface PoolRemoteLogoProps {
    loading?: boolean;
    size?: "sm" | "md" | "lg" | "xl";
    chain?: number;
    tokens: Omit<RemoteLogoProps, "size" | "chain">[];
    className?: {
        root?: string;
    };
}

export function PoolRemoteLogo({
    loading,
    size,
    chain,
    tokens,
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
            {tokens.map((token) => {
                return (
                    <RemoteLogo
                        key={token.address}
                        loading={loading}
                        chain={chain}
                        size={size}
                        {...token}
                        defaultText={token?.defaultText}
                    />
                );
            })}
        </div>
    );
}
