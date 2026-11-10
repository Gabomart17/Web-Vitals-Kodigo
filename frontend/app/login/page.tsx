'use client';
import { login } from '@/lib/actions';
import Link from 'next/link';

export default function Login() {
  return (
    <div className="max-w-md mx-auto mt-16 bg-white p-8 rounded-xl shadow-sm border border-gray-100">
      <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">Iniciar Sesión</h1>
      <form action={login} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
          <input type="email" name="email" required className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" placeholder="admin@example.com" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
          <input type="password" name="password" required className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" placeholder="••••••••" />
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition">
          Ingresar
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-gray-600">
        ¿No tienes cuenta? <Link href="/register" className="text-blue-600 font-semibold hover:underline">Regístrate</Link>
      </p>
    </div>
  );
}