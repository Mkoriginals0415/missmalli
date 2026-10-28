import { createRequestHandler } from "@remix-run/cloudflare";
// @ts-ignore
import * as build from "../build/server";

const handleRequest = createRequestHandler(build as any);

export const onRequest: PagesFunction = async (context) => {
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
