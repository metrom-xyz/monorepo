import { SERVICE_URLS } from "@metrom-xyz/sdk";
import { useMutation } from "@tanstack/react-query";
import type { CampaignPreviewPayload } from "../types/campaign/common";
import { buildSpecificationBundle } from "../utils/campaign-bundle";
import { ENVIRONMENT } from "../commons/env";
import { zeroHash, type Hex } from "viem";

export function useUploadSpecification() {
    const {
        data: hash,
        isPending: loading,
        mutateAsync: uploadSpecification,
    } = useMutation({
        mutationKey: ["specification-hash"],
        mutationFn: async (payload: CampaignPreviewPayload) => {
            if (!payload) return zeroHash;

            const specification = buildSpecificationBundle(payload);
            if (Object.keys(specification).length === 0) return zeroHash;

            try {
                const response = await fetch(
                    `${SERVICE_URLS[ENVIRONMENT].dataManager}/data/temporary`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(specification),
                    },
                );

                if (!response.ok) throw new Error(await response.text());

                const { hash } = (await response.json()) as { hash: Hex };
                return `0x${hash}`;
            } catch (error) {
                console.error(
                    `Could not upload specification to data-manager: ${JSON.stringify(specification)}`,
                    error,
                );
                throw error;
            }
        },
    });

    return { loading, hash: (hash as Hex) || undefined, uploadSpecification };
}
