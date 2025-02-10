import { ProductCard } from "./ProductCard";
import { Product } from "./ProductTable";

interface ProductGridProps {
  products: Product[];
}

export function ProductGrid({ products }: ProductGridProps) {
  return (
    <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <header className="text-center">
        <h2 className="text-xl font-bold text-gray-900 sm:text-3xl">
          Product Collection
        </h2>
        <p className="mx-auto mt-4 max-w-md text-gray-500">
          Discover our curated collection of premium products
        </p>
      </header>
      <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
