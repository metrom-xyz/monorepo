import { createRouter, createWebHistory } from "vue-router";
import AllCampaignsView from "../views/all-campaigns-view/AllCampaignsView.vue";
import CreateCampaignView from "../views/create-campaign-view/CreateCampaignView.vue";

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

// preserve the chain query param
router.beforeEach((to, from, next) => {
    if (!Object.keys(to.query).length && !!Object.keys(from).length)
        next({ name: to.name!, query: from.query });
    else next();
});
