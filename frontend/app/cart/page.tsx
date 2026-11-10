'use client';
import { useCart } from '@/components/CartProvider';
import Link from 'next/link';

export default function Cart() {
  const { cart, removeFromCart } = useCart();
  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  if (cart.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-700 mb-4">Tu carrito está vacío</h2>
        <Link href="/" className="text-blue-600 hover:text-blue-800 font-medium">Volver al catálogo</Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-100">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Tu Carrito</h1>
      <div className="space-y-6">
        {cart.map((item) => (
          <div key={item.id} className="flex justify-between items-center border-b pb-6">
            <div>
              <h3 className="font-semibold text-lg text-gray-800">{item.name}</h3>
              <p className="text-sm text-gray-500 mt-1">Cantidad: {item.quantity} x ${item.price.toFixed(2)}</p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <p className="font-bold text-xl text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
              <button onClick={() => removeFromCart(item.id)} className="text-red-500 text-sm hover:text-red-700 transition">
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 flex justify-between items-center text-2xl font-bold text-gray-900 bg-gray-50 p-6 rounded-lg">
        <p>Total a Pagar:</p>
        <p className="text-blue-600">${total.toFixed(2)}</p>
      </div>
      <Link href="/checkout" className="mt-6 block w-full text-center bg-blue-600 text-white py-4 rounded-lg font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200">
        Proceder al Pago
      </Link>
    </div>
  );
}