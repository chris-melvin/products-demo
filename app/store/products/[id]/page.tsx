import { createClient } from "@/utils/supabase/server";
import { ProductDetails } from "@/components/product/ProductDetails";
import { notFound } from "next/navigation";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export const revalidate = 3600; // Revalidate every hour

export default async function ProductPage({ params }: ProductPageProps) {
  const supabase = await createClient();

  const id = (await params).id;

  const { data: product, error } = await supabase
    .from("products")
    .select(
      `
      *,
      product_images (
        storage_path,
        is_primary
      ),
      product_variants (
        id,
        name,
        sku,
        price_adjustment,
        stock_quantity
      )
    `,
    )
    .eq("id", id)
    .single();

  if (error || !product) {
    notFound();
  }

  return (
    <main className="bg-white">
      <ProductDetails product={product} />
    </main>
  );
}
