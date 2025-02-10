import { ProductTable } from "@/components/product/ProductTable";

export default function ProductsPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Products</h2>
        <p className="text-sm text-muted-foreground">
          Manage your product listing
        </p>
      </div>
      <ProductTable />
    </div>
  );
}
