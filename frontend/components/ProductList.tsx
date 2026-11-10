import Link from 'next/link';
import { getProducts } from '@/lib/api';

export default async function ProductList() {
  const products = await getProducts();
  
  if (!products || products.length === 0) {
      return <div className="text-gray-500">No hay productos disponibles por el momento.</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product: any) => (
        <Link href={`/products/${product.id}`} key={product.id}>
          <div className="border border-gray-200 rounded-xl p-4 hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col h-full bg-white group">
            <div className="aspect-square bg-gray-50 rounded-lg mb-4 flex items-center justify-center overflow-hidden border border-gray-100">
               <span className="text-gray-400 group-hover:scale-110 transition-transform">📷 Sin imagen</span>
            </div>
            <h2 className="font-semibold text-lg text-gray-800 line-clamp-1">{product.name}</h2>
            <p className="text-gray-500 text-sm flex-grow line-clamp-2 mt-1">{product.description}</p>
            <p className="font-bold text-xl text-blue-600 mt-3">${Number(product.price).toFixed(2)}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}