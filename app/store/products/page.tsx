import { createClient } from "@/utils/supabase/server";
import { ProductGrid } from "@/components/product/ProductGrid";

export const revalidate = 3600; // Revalidate every hour

export default async function ProductsPage() {
  const supabase = await createClient();

  const { data: products } = await supabase
    .from("products")
    .select(
      `
      *,
      product_images (
        storage_path,
        is_primary
      )
    `,
    )
    .order("created_at", { ascending: false });

  return (
    <main className="bg-white">
      <ProductGrid products={products || []} />
    </main>
  );
}
