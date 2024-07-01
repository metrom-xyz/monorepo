import { createRouter, createWebHistory } from "vue-router";
import AllCampaignsView from "../views/all-campaigns-view/AllCampaignsView.vue";
import CreateCampaignView from "@/views/create-campaign-view/CreateCampaignView.vue";
import { hasQueryParams } from "@/utils/router";

export const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: "/",
            name: "campaigns",
            component: AllCampaignsView,
            props: (route) => ({ selectedChain: Number(route.query.chain) }),
        },
        {
            path: "/create",
            name: "create",
            component: CreateCampaignView,
            props: (route) => ({ selectedChain: Number(route.query.chain) }),
        },
    ],
});

router.beforeEach((to, from, next) => {
    if (!hasQueryParams(to) && hasQueryParams(from))
        next({ path: to.path, query: from.query });
    else next();
});
