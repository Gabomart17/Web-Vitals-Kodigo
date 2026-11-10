'use client';
import { useState } from 'react';
import { useCart } from '@/components/CartProvider';
import { createOrder } from '@/lib/actions';
import { useRouter } from 'next/navigation';

export default function Checkout() {
  const { cart, clearCart } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleCheckout = async () => {
    setLoading(true); setError('');
    try {
      await createOrder(cart);
      alert('¡Pago procesado y orden creada con éxito!');
      clearCart();
      router.push('/history');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-100">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Checkout Seguro</h1>
      {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm">{error}</div>}
      <div className="mb-6 bg-gray-50 p-4 rounded-lg">
        <h3 className="font-semibold text-gray-700 mb-3 border-b pb-2">Resumen de la orden</h3>
        {cart.map(item => (
          <div key={item.id} className="flex justify-between text-sm py-1 text-gray-600">
            <span>{item.name} <span className="text-gray-400">x{item.quantity}</span></span>
            <span className="font-medium text-gray-800">${(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
        <div className="border-t mt-3 pt-3 flex justify-between font-bold text-gray-900">
          <span>Total</span>
          <span className="text-blue-600">${total.toFixed(2)}</span>
        </div>
      </div>
      
      {/* Simulación del componente de tarjeta de Stripe */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Datos de Tarjeta (Simulado Stripe Elements)</label>
        <div className="h-10 border border-gray-300 rounded-lg bg-gray-50 flex items-center px-3 text-gray-400 text-sm">
          **** **** **** 4242
        </div>
      </div>

      <button onClick={handleCheckout} disabled={loading || cart.length === 0}
        className="w-full bg-gray-900 text-white py-3 rounded-lg font-bold hover:bg-gray-800 disabled:opacity-50 transition">
        {loading ? 'Procesando pago...' : `Pagar $${total.toFixed(2)}`}
      </button>
    </div>
  );
}