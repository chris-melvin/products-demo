import { EditProductWrapper } from "@/components/product/EditProductWrapper";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-8">Create New Product</h1>
      <EditProductWrapper productId={id} />
    </div>
  );
}
