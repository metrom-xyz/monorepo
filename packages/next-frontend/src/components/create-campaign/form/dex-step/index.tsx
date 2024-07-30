import { useMemo, type MouseEvent } from "react";
import { useTranslations } from "next-intl";
import classNames from "classnames";
import { Step } from "@/src/components/step";
import { StepPreview } from "@/src/components/step/preview";
import { StepContent } from "@/src/components/step/content";
import { useAvailableAmms } from "@/src/hooks/useAvailableAmms";
import { animated, useSpring } from "@react-spring/web";
import { Typography } from "@/src/ui/typography";
import type { CreateCampaignFormProps } from "..";

import styles from "./styles.module.css";

interface AmmStepProps extends CreateCampaignFormProps {}

export function AmmStep({
    payload,
    payloadIndex,
    onPayloadChange,
}: AmmStepProps) {
    const t = useTranslations("new_campaign.form.dex");
    const amms = useAvailableAmms();
    const [spring, api] = useSpring(() => ({
        from: { opacity: 0 },
        to: { opacity: 1 },
        config: { duration: 200 },
    }));

    const selectedAmm = useMemo(() => {
        if (!payload || !payload.amm) return null;

        return amms.find((amm) => amm.slug === payload.amm);
    }, [amms, payload]);

    function handleDexOnClick(event: MouseEvent<HTMLDivElement>) {
        const dexSlug = (event.target as HTMLLIElement).getAttribute(
            "data-slug",
        );

        if (!dexSlug) {
            console.warn("missing dex slug data attribute");
            return;
        }

        if (selectedAmm?.slug === dexSlug) return;

        api.start({
            from: { opacity: 0 },
            to: { opacity: 1 },
            config: { duration: 200 },
        });
        onPayloadChange({ ...payload, amm: dexSlug }, payloadIndex);
    }

    return (
        <Step closeBehavior="innerClick">
            <StepPreview completed={!!selectedAmm}>
                {/* TODO: find a way to embed this behavior inside the step component? */}
                {selectedAmm ? (
                    <div>
                        <Typography
                            uppercase
                            variant="sm"
                            weight="medium"
                            className={{
                                root: "transition-opacity duration-200 ease-out opacity-40",
                            }}
                        >
                            {t("title")}
                        </Typography>
                        <animated.div
                            style={spring}
                            className={styles.amm_step__dex__preview}
                        >
                            <div className={styles.amm_step__logo}>
                                <selectedAmm.logo />
                            </div>
                            <Typography variant="lg" weight="medium">
                                {selectedAmm.name}
                            </Typography>
                        </animated.div>
                    </div>
                ) : (
                    <Typography uppercase variant="lg" weight="medium">
                        {t("title")}
                    </Typography>
                )}
            </StepPreview>
            <StepContent>
                <div className={styles.amm_step__dex__wrapper}>
                    {amms.map(({ slug, name, logo: Logo }) => (
                        <div
                            key={slug}
                            data-slug={slug}
                            className={classNames(styles.amm_step__dex__row, {
                                [styles.amm_step__dex__row_selected]:
                                    selectedAmm?.slug === slug,
                            })}
                            onClick={handleDexOnClick}
                        >
                            <div className={styles.amm_step__logo}>
                                <Logo />
                            </div>
                            <Typography variant="lg" weight="medium">
                                {name}
                            </Typography>
                        </div>
                    ))}
                </div>
            </StepContent>
        </Step>
    );
}
