import { redirect, type LoaderFunctionArgs } from "@remix-run/cloudflare";

export async function loader({ request }: LoaderFunctionArgs) {
  return redirect("/wishlist");
}

export default function SavedRedirect() {
  return null;
}
