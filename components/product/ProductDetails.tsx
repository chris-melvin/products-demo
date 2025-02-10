import { getPublicUrl } from "@/utils/image-utils";
import { Product } from "./ProductTable";
import Image from "next/image";

interface ProductDetailsProps {
  product: Product;
}

export function ProductDetails({ product }: ProductDetailsProps) {
  const primaryImage = product.product_images?.find((img) => img.is_primary);
  const imageUrl = primaryImage
    ? getPublicUrl(primaryImage.storage_path)
    : "/api/placeholder/774/450";

  return (
    <section>
      <div className="relative mx-auto max-w-screen-xl px-4 py-8">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-4">
            <Image
              src={imageUrl}
              alt={product.name}
              width={500}
              height={500}
              className="h-[350px] w-full object-cover sm:h-[450px]"
            />

            <div className="grid grid-cols-2 gap-4 lg:mt-4">
              {product.product_images
                ?.filter((img) => !img.is_primary)
                .slice(0, 3)
                .map((image, index) => (
                  <div
                    key={index}
                    className={
                      index === 2
                        ? "lg:col-span-2 lg:col-start-2 lg:row-span-2"
                        : ""
                    }
                  >
                    <img
                      alt={`Product ${index + 2}`}
                      src={getPublicUrl(image.storage_path)}
                      className="aspect-square w-full rounded-xl object-cover"
                    />
                  </div>
                ))}
            </div>
          </div>

          <div className="sticky top-0">
            <div className="mt-8 flex justify-between">
              <div className="max-w-[35ch] space-y-2">
                <h1 className="text-2xl font-bold sm:text-3xl">
                  {product.name}
                </h1>

                <p className="text-sm text-gray-500">Category: Coming soon</p>
              </div>

              <p className="text-lg font-bold">
                ${product.base_price.toFixed(2)}
              </p>
            </div>

            <div className="mt-4">
              <div className="prose max-w-none">
                <p>{product.description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
