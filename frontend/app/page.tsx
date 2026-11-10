import { Suspense } from "react";
import ProductList from "@/components/ProductList";
import ProductSkeleton from "@/components/ProductSkeleton";

export default function Home() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Catálogo de Productos - MarFloTech</h1>
      <Suspense fallback={<ProductSkeleton />}>
        <ProductList />
      </Suspense>
    </div>
  );
}