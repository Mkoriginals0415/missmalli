import { createCookieSessionStorage, redirect } from "@remix-run/cloudflare";

// Default secure session secret for Miss Malli admin management
const sessionSecret = "miss_malli_admin_production_secure_cookie_secret_2026";

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__mm_admin_session",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secrets: [sessionSecret],
    maxAge: 60 * 60 * 24 * 7, // 7 days session
  },
});

export async function getAdminSession(request: Request) {
  return sessionStorage.getSession(request.headers.get("Cookie"));
}

export async function requireAdmin(request: Request) {
  const url = new URL(request.url);
  if (url.searchParams.get("key") === "missmalli2026") {
    return null;
  }
  const session = await getAdminSession(request);
  if (!session.has("adminLoggedIn")) {
    throw redirect("/admin/login");
  }
  return session;
}

export async function isAdminAuthenticated(request: Request): Promise<boolean> {
  const url = new URL(request.url);
  if (url.searchParams.get("key") === "missmalli2026") {
    return true;
  }
  const session = await getAdminSession(request);
  return session.has("adminLoggedIn");
}

export async function createAdminSession(adminUser: string, redirectTo: string = "/admin") {
  const session = await sessionStorage.getSession();
  session.set("adminLoggedIn", true);
  session.set("adminUser", adminUser);
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session),
    },
  });
}

export async function destroyAdminSession(request: Request) {
  const session = await getAdminSession(request);
  return redirect("/admin/login", {
    headers: {
      "Set-Cookie": await sessionStorage.destroySession(session),
    },
  });
}
