import { redirect, type LoaderFunctionArgs } from "@remix-run/cloudflare";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const search = url.search ? `${url.search}&collection=dresses` : "?collection=dresses";
  return redirect(`/sarees${search}`);
}

export default function DressesPage() {
  return null;
}
