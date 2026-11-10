'use client';
import { useCart } from './CartProvider';

export default function AddToCartButton({ product }: { product: any }) {
  const { addToCart } = useCart();
  return (
    <button 
      onClick={() => addToCart({ id: product.id, name: product.name, price: Number(product.price), quantity: 1 })}
      className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition w-full md:w-auto"
    >
      Agregar al Carrito
    </button>
  );
}