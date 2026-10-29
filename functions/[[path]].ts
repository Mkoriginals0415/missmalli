import { createRequestHandler } from "@remix-run/cloudflare";
// @ts-ignore
import * as build from "../build/server";

const handleRequest = createRequestHandler(build as any);

export const onRequest: PagesFunction<{ ASSETS?: { fetch: (req: Request) => Promise<Response> } }> = async (context) => {
  const url = new URL(context.request.url);

  // Static assets pass-through: ONLY for GET requests on static asset paths
  // NEVER intercept Single Fetch .data or POST requests to avoid consuming request.body!
  const isStaticAsset =
    context.request.method === "GET" &&
    !url.pathname.endsWith(".data") &&
    (url.pathname.startsWith("/assets/") ||
     url.pathname.startsWith("/brand/") ||
     url.pathname.startsWith("/images/") ||
     url.pathname === "/favicon.ico");

  if (isStaticAsset && context.env.ASSETS) {
    const assetResponse = await context.env.ASSETS.fetch(context.request);
    if (assetResponse.status < 400) {
      return assetResponse;
    }
  }

  return handleRequest(context.request, {
    cloudflare: {
      env: context.env,
      cf: (context.request as any).cf,
      ctx: {
        waitUntil: context.waitUntil.bind(context),
        passThroughOnException: context.passThroughOnException.bind(context),
      },
    },
  });
};
