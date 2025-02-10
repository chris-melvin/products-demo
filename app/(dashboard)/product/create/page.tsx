import { ProductForm } from "@/components/product/ProductForm"

export default function CreateProductPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-8">Create New Product</h1>
      <ProductForm mode="create" />
    </div>
  )
}