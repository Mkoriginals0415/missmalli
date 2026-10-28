import { json, type LoaderFunctionArgs } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { getAllProducts, getStoreSettings } from "~/db/d1.server";
import { SwipeFeed, type SareeItem } from "~/components/feed/SwipeFeed";

export async function loader({ request, context }: LoaderFunctionArgs) {
  const env = (context as any)?.cloudflare?.env;
  const url = new URL(request.url);
  const collectionFilter = url.searchParams.get("collection");

  let allProducts = await getAllProducts(env);

  if (collectionFilter && collectionFilter !== "all") {
    allProducts = allProducts.filter(
      (p) => p.collectionSlug.toLowerCase() === collectionFilter.toLowerCase()
    );
  }

  const settings = await getStoreSettings(env);

  const formattedSarees: SareeItem[] = allProducts.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: p.price,
    fabric: p.fabric,
    length: p.length,
    care: p.care,
    collectionSlug: p.collectionSlug,
    collectionName: p.collectionName,
    images: p.images,
    variants: p.variants,
  }));

  return json({
    sarees: formattedSarees,
    sellerPhone: settings.seller_whatsapp_number || "919876543210",
  });
}

export default function FeedPage() {
  const { sarees, sellerPhone } = useLoaderData<typeof loader>();

  return (
    <div className="h-[100dvh] w-full bg-black">
      <SwipeFeed sarees={sarees} sellerPhone={sellerPhone} />
    </div>
  );
}
