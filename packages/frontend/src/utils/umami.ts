export type RegisteredEvents =
    | "pick-reward"
    | "click-campaign-preview"
    | "click-deploy-campaign"
    | "click-dex-explore"
    | "no-rewards-claim"
    | "click-claim-all"
    | "click-claim-single"
    | "click-recover-all"
    | "click-recover-single"
    | "click-pool-deposit"
    | "open-sidebar"
    | "click-activity"
    | "click-documentation-link"
    | "click-telegram-link"
    | "click-x-link"
    | "click-github-link"
    | "click-discord-link"
    | "click-fungible-asset-explore";

export function trackUmamiEvent(event: RegisteredEvents, data?: object): void {
    if (!window.umami) {
        console.error("Umami not found, tracking disabled");
        return;
    }
    window.umami.track(event, data);
}
