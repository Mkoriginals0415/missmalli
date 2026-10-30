import { redirect, type LoaderFunctionArgs } from "@remix-run/cloudflare";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  return redirect(`/my-requests${url.search}`);
}

export default function MyOrdersRedirect() {
  return null;
}
