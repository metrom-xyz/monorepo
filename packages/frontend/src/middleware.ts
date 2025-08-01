import {
    createNEMO,
    type GlobalMiddlewareConfig,
    type MiddlewareConfig,
} from "@rescale/nemo";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextResponse } from "next/server";

const intlMiddleware = createMiddleware(routing);

const middlewares = {
    "/": [
        async (request) => {
            return intlMiddleware(request);
        },
    ],
} satisfies MiddlewareConfig;

const globalMiddlewares = {
    before: async (request) => {
        const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
        const cspHeader = `
                default-src 'self';
                connect-src 'self' https:;
                script-src 'self' https://cdn.usefathom.com 'nonce-${nonce}' 'strict-dynamic';
                style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
                img-src * data: blob:;
                font-src 'self' https://fonts.gstatic.com;
                object-src 'none';
                base-uri 'self';
                form-action 'self';
                frame-ancestors 'none';
                upgrade-insecure-requests;
            `;
        const contentSecurityPolicyHeaderValue = cspHeader
            .replace(/\s{2,}/g, " ")
            .trim();

        const requestHeaders = new Headers(request.headers);
        requestHeaders.set("x-nonce", nonce);
        requestHeaders.set(
            "Content-Security-Policy",
            contentSecurityPolicyHeaderValue,
        );

        const response = NextResponse.next({
            request: {
                headers: requestHeaders,
            },
        });
        response.headers.set(
            "Content-Security-Policy",
            contentSecurityPolicyHeaderValue,
        );
        response.headers.set("X-Frame-Options", "DENY");

        return response;
    },
} satisfies GlobalMiddlewareConfig;

export const config = {
    matcher: ["/((?!api|_next|.*\\..*).*)", "/(en)/:path*"],
};

export default createNEMO(middlewares, globalMiddlewares);
