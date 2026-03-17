module.exports = [
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[project]/lib/admin-auth.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ADMIN_SESSION_COOKIE",
    ()=>ADMIN_SESSION_COOKIE,
    "createAdminSessionValue",
    ()=>createAdminSessionValue,
    "getAdminSessionCookieOptions",
    ()=>getAdminSessionCookieOptions,
    "isAdminSessionValid",
    ()=>isAdminSessionValid,
    "verifyAdminCredentials",
    ()=>verifyAdminCredentials
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/crypto [external] (crypto, cjs)");
;
const ADMIN_SESSION_COOKIE = "citnurse_admin_session";
const DEFAULT_ADMIN_USERNAME = "admin";
const DEFAULT_ADMIN_PASSWORD = "admin12345";
const SESSION_DURATION_SECONDS = 60 * 60 * 8;
const getConfiguredValue = (value, fallback)=>{
    if (!value) {
        return fallback;
    }
    const trimmedValue = value.trim();
    return trimmedValue.length > 0 ? trimmedValue : fallback;
};
const getAdminUsername = ()=>getConfiguredValue(process.env.ADMIN_USERNAME, DEFAULT_ADMIN_USERNAME);
const getAdminPassword = ()=>getConfiguredValue(process.env.ADMIN_PASSWORD, DEFAULT_ADMIN_PASSWORD);
const getSessionSecret = ()=>getConfiguredValue(process.env.ADMIN_SESSION_SECRET, `${getAdminUsername()}-${getAdminPassword()}-session-secret`);
const safeEqual = (value, expectedValue)=>{
    const valueBuffer = Buffer.from(value);
    const expectedBuffer = Buffer.from(expectedValue);
    if (valueBuffer.length !== expectedBuffer.length) {
        return false;
    }
    return (0, __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["timingSafeEqual"])(valueBuffer, expectedBuffer);
};
const createSessionSignature = (payload)=>(0, __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["createHmac"])("sha256", getSessionSecret()).update(payload).digest("hex");
const verifyAdminCredentials = (username, password)=>{
    return safeEqual(username, getAdminUsername()) && safeEqual(password, getAdminPassword());
};
const createAdminSessionValue = (now = Date.now())=>{
    const expiresAtUnixSeconds = Math.floor(now / 1000) + SESSION_DURATION_SECONDS;
    const payload = `${expiresAtUnixSeconds}`;
    const signature = createSessionSignature(payload);
    return `${payload}.${signature}`;
};
const isAdminSessionValid = (sessionValue, now = Date.now())=>{
    if (!sessionValue) {
        return false;
    }
    const [expiresAtUnixSeconds, providedSignature] = sessionValue.split(".");
    if (!expiresAtUnixSeconds || !providedSignature) {
        return false;
    }
    const expectedSignature = createSessionSignature(expiresAtUnixSeconds);
    if (!safeEqual(providedSignature, expectedSignature)) {
        return false;
    }
    const expiresAt = Number.parseInt(expiresAtUnixSeconds, 10);
    if (Number.isNaN(expiresAt)) {
        return false;
    }
    return expiresAt > Math.floor(now / 1000);
};
const getAdminSessionCookieOptions = ()=>({
        httpOnly: true,
        sameSite: "lax",
        secure: ("TURBOPACK compile-time value", "development") === "production",
        path: "/",
        maxAge: SESSION_DURATION_SECONDS
    });
}),
"[project]/app/admin/login/actions.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"602ce255e82ab8ea0c52a657cc59543e54a7e9762a":"loginAdminAction","7fcf42faa1b4ff883345bac4066f6d6eb2aeba1392":"initialAdminLoginState"},"",""] */ __turbopack_context__.s([
    "initialAdminLoginState",
    ()=>initialAdminLoginState,
    "loginAdminAction",
    ()=>loginAdminAction
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/headers.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$api$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/api/navigation.react-server.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/client/components/navigation.react-server.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$admin$2d$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/admin-auth.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
;
const initialAdminLoginState = {
    error: null
};
async function loginAdminAction(_previousState, formData) {
    const username = formData.get("username")?.toString().trim() ?? "";
    const password = formData.get("password")?.toString() ?? "";
    if (!username || !password) {
        return {
            error: "Username and password are required."
        };
    }
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$admin$2d$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["verifyAdminCredentials"])(username, password)) {
        return {
            error: "Invalid username or password."
        };
    }
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cookies"])();
    cookieStore.set(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$admin$2d$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ADMIN_SESSION_COOKIE"], (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$admin$2d$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createAdminSessionValue"])(), (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$admin$2d$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getAdminSessionCookieOptions"])());
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"])("/admin");
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    initialAdminLoginState,
    loginAdminAction
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(initialAdminLoginState, "7fcf42faa1b4ff883345bac4066f6d6eb2aeba1392", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(loginAdminAction, "602ce255e82ab8ea0c52a657cc59543e54a7e9762a", null);
}),
"[project]/.next-internal/server/app/admin/login/page/actions.js { ACTIONS_MODULE0 => \"[project]/app/admin/login/actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$login$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/admin/login/actions.ts [app-rsc] (ecmascript)");
;
;
}),
"[project]/.next-internal/server/app/admin/login/page/actions.js { ACTIONS_MODULE0 => \"[project]/app/admin/login/actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "602ce255e82ab8ea0c52a657cc59543e54a7e9762a",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$login$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["loginAdminAction"],
    "7fcf42faa1b4ff883345bac4066f6d6eb2aeba1392",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$login$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["initialAdminLoginState"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$admin$2f$login$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$app$2f$admin$2f$login$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/admin/login/page/actions.js { ACTIONS_MODULE0 => "[project]/app/admin/login/actions.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$admin$2f$login$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/admin/login/actions.ts [app-rsc] (ecmascript)");
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__b859d422._.js.map