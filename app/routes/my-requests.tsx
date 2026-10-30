import { redirect } from "@remix-run/cloudflare";

export async function loader() {
  return redirect("/track");
}

export default function MyRequestsRedirect() {
  return null;
}
