import { trackEvent, type EventOptions } from "fathom-client";

type RegisteredEvents =
    | "PICK_REWARD"
    | "CLICK_CAMPAIGN_PREVIEW"
    | "CLICK_DEPLOY_CAMPAIGN"
    | "CLICK_DEX_EXPLORE"
    | "NO_REWARDS_CLAIM"
    | "CLICK_CLAIM_ALL"
    | "CLICK_CLAIM_SINGLE"
    | "CLICK_RECOVER_ALL"
    | "CLICK_RECOVER_SINGLE"
    | "CLICK_POOL_DEPOSIT"
    | "OPEN_SIDEBAR"
    | "CLICK_ACTIVITY"
    | "CLICK_DOCUMENTATION_LINK"
    | "CLICK_TELEGRAM_LINK"
    | "CLICK_X_LINK"
    | "CLICK_GITHUB_LINK"
    | "CLICK_DISCORD_LINK"
    | "ENSO_WIDGET_TX_SUCCESS";

export function trackFathomEvent(event: RegisteredEvents, opts?: EventOptions) {
    trackEvent(event, opts);
}
