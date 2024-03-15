import { createRouter, createWebHistory } from "vue-router";
import CampaignsView from "../views/CampaignsView.vue";

export const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            name: "campaigns",
            component: CampaignsView,
        },
        {
            path: "/create",
            name: "create",
            // route level code-splitting
            // this generates a separate chunk (About.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () => import("../views/CreateCampaignView.vue"),
        },
    ],
});
