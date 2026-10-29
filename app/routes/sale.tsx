import { redirect, type LoaderFunctionArgs } from "@remix-run/cloudflare";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const search = url.search ? `${url.search}&filter=sale` : "?filter=sale";
  return redirect(`/sarees${search}`);
}

export default function SalePage() {
  return null;
}
