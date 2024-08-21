import styles from "./styles.module.css";
import { RemoteLogo, type RemoteLogoProps } from "../remote-logo";

interface PoolRemoteLogoProps {
    size?: "sm" | "md" | "lg";
    chain?: number | string;
    token0?: Omit<RemoteLogoProps, "size" | "chain">;
    token1?: Omit<RemoteLogoProps, "size" | "chain">;
    className?: {
        root?: string;
    };
}

export function PoolRemoteLogo({
    size = "md",
    chain,
    token0,
    token1,
    className,
}: PoolRemoteLogoProps) {
    return (
        <div className={`${styles.root} ${styles[size]} ${className?.root}`}>
            <RemoteLogo
                chain={chain}
                size={size}
                {...token0}
                defaultText={token0?.defaultText}
            />
            <RemoteLogo
                chain={chain}
                size={size}
                {...token1}
                defaultText={token1?.defaultText}
            />
        </div>
    );
}
