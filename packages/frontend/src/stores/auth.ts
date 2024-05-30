import { METROM_DATA_MANAGER_JWT_ISSUER } from "@/commons";
import { useStorage, type RemovableRef } from "@vueuse/core";
import { jwtDecode } from "jwt-decode";
import { defineStore } from "pinia";

const JWT_AUTH_TOKEN = "jwt-auth-token";

export const useLogin = defineStore(JWT_AUTH_TOKEN, {
    state: (): { jwtToken: RemovableRef<string | undefined> } => ({
        jwtToken: useStorage<string | undefined>(
            "auth.jwtToken",
            undefined,
            localStorage,
            {
                mergeDefaults: true,
            },
        ),
    }),
    getters: {
        isJwtTokenValid(state) {
            const jwt = state.jwtToken;
            if (!jwt) return false;
            const decoded = jwtDecode(jwt, { header: false });
            return (
                !!decoded &&
                decoded.iss === METROM_DATA_MANAGER_JWT_ISSUER &&
                !!decoded.exp &&
                decoded.exp > Math.floor(Date.now() / 1000)
            );
        },
    },
    actions: {
        setJwtToken(jwtToken: string) {
            this.jwtToken = jwtToken;
        },
    },
});
