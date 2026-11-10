'use client';
import Link from 'next/link';
import { useCart } from './CartProvider';
import { logout } from '@/lib/actions';

export default function Navbar() {
  const { cart } = useCart();
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav className="bg-gray-900 text-white p-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold tracking-tight text-blue-400">MarFloTech</Link>
        <div className="flex gap-4 items-center text-sm font-medium">
          <Link href="/history" className="hover:text-blue-300 transition">Mis Órdenes</Link>
          <Link href="/cart" className="hover:text-blue-300 flex items-center gap-1 transition">
            Carrito <span className="bg-blue-600 px-2 py-0.5 rounded-full text-xs">{totalItems}</span>
          </Link>
          <Link href="/login" className="hover:text-blue-300 transition">Login</Link>
          <form action={logout}>
            <button type="submit" className="text-red-400 hover:text-red-300 transition">Salir</button>
          </form>
        </div>
      </div>
    </nav>
  );
}