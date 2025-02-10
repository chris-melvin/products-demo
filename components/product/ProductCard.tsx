import { getPublicUrl } from "@/utils/image-utils";
import Link from "next/link";
import { Product } from "./ProductTable";
import Image from "next/image";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const primaryImage = product.product_images?.find((img) => img.is_primary);
  const imageUrl = primaryImage
    ? getPublicUrl(primaryImage.storage_path)
    : "/No_Image_Available.jpg";

  return (
    <Link href={`/store/products/${product.id}`} className="group block">
      <Image
        src={imageUrl}
        alt={product.name}
        width={500}
        height={500}
        className="h-[350px] w-full object-cover sm:h-[450px]"
      />
      <div className="mt-3 flex justify-between text-sm">
        <div>
          <h3 className="text-gray-900 group-hover:underline group-hover:underline-offset-4">
            {product.name}
          </h3>
          <p className="mt-1.5 max-w-prose text-pretty text-xs text-gray-500">
            {product.description}
          </p>
        </div>
        <p className="text-gray-900">${product.base_price.toFixed(2)}</p>
      </div>
    </Link>
  );
}
