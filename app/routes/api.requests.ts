import { json, type ActionFunctionArgs } from "@remix-run/cloudflare";
import { createNewRequest, updateRequestStatus } from "~/db/d1.server";

export async function action({ request, context }: ActionFunctionArgs) {
  const env = (context as any)?.cloudflare?.env;

  if (request.method === "POST") {
    try {
      const body = await request.json() as any;
      if (!body.items || body.items.length === 0) {
        return json({ error: "No items provided" }, { status: 400 });
      }

      const result = await createNewRequest(
        {
          source: body.source || "buy_now",
          totalAmount: body.totalAmount,
          customerPhone: body.customerPhone,
          items: body.items,
        },
        env
      );

      // Construct absolute requestUrl if host is available
      const url = new URL(request.url);
      const fullUrl = `${url.origin}${result.requestUrl}`;

      return json({
        ...result,
        requestUrl: fullUrl,
      });
    } catch (err: any) {
      return json({ error: err.message || "Failed to create request" }, { status: 500 });
    }
  }

  if (request.method === "PATCH") {
    try {
      const body = await request.json() as any;
      if (!body.requestId) {
        return json({ error: "Missing requestId" }, { status: 400 });
      }

      const updated = await updateRequestStatus(
        body.requestId,
        {
          status: body.status,
          internalNote: body.internalNote,
          trackingNote: body.trackingNote,
          isPaymentReceived: body.isPaymentReceived,
        },
        env
      );

      return json({ success: true, request: updated });
    } catch (err: any) {
      return json({ error: err.message || "Failed to update request" }, { status: 500 });
    }
  }

  return json({ error: "Method not allowed" }, { status: 405 });
}
