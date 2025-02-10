"use client";

import { createClient } from "@/utils/supabase/client";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductForm } from "./ProductForm";
import { getPublicUrl } from "@/utils/image-utils";

interface Product {
  id: string;
  name: string;
  description: string;
  base_price: number;
  category_id: string | null;
  created_at: string;
  updated_at: string;
}

interface ProductWithImage extends Product {
  product_images: {
    storage_path: string;
    is_primary: boolean;
  }[];
}

interface EditProductWrapperProps {
  productId: string;
}

export function EditProductWrapper({ productId }: EditProductWrapperProps) {
  const supabase = createClient();

  const {
    data: product,
    isLoading,
    error,
  } = useQuery(
    supabase
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
      .eq("id", productId)
      .single<ProductWithImage>(),
    {
      enabled: !!productId,
    },
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-10 w-1/2" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Error loading product: {error.message}
        </AlertDescription>
      </Alert>
    );
  }

  if (!product) {
    return (
      <Alert>
        <AlertDescription>Product not found</AlertDescription>
      </Alert>
    );
  }

  const primaryImage = product.product_images?.find((img) => img.is_primary);
  const imageUrl = primaryImage
    ? getPublicUrl(primaryImage.storage_path)
    : undefined;

  // Transform the data to match the ProductForm's expected format
  const formData = {
    id: product.id,
    name: product.name,
    description: product.description,
    base_price: product.base_price,
    category_id: product.category_id || undefined,
    imageUrl,
  };

  return <ProductForm initialData={formData} mode="edit" />;
}
