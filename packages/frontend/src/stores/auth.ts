import { METROM_BACKEND_JWT_ISSUER } from "@/commons";
import { useStorage, type RemovableRef } from "@vueuse/core";
import { jwtDecode } from "jwt-decode";
import { defineStore } from "pinia";

const JWT_AUTH_TOKEN = "jwt-auth-token";

export const useAuth = defineStore(JWT_AUTH_TOKEN, {
    state: (): { jwtAuthToken: RemovableRef<string | undefined> } => ({
        jwtAuthToken: useStorage<string | undefined>(
            "auth.jwtAuthToken",
            undefined,
            localStorage,
            {
                mergeDefaults: true,
            },
        ),
    }),
    getters: {
        isJwtAuthTokenValid(state) {
            const jwt = state.jwtAuthToken;
            if (!jwt) return false;
            const decoded = jwtDecode(jwt, { header: false });
            return (
                !!decoded &&
                decoded.iss === METROM_BACKEND_JWT_ISSUER &&
                !!decoded.exp &&
                decoded.exp > Math.floor(Date.now() / 1000)
            );
        },
    },
    actions: {
        setJwtAuthToken(jwtAuthToken: string) {
            this.jwtAuthToken = jwtAuthToken;
        },
    },
});
