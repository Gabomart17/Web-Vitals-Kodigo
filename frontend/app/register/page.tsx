'use client';
import { register } from '@/lib/actions';
import Link from 'next/link';

export default function Register() {
  return (
    <div className="max-w-md mx-auto mt-12 bg-white p-8 rounded-xl shadow-sm border border-gray-100">
      <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">Crear Cuenta</h1>
      <form action={register} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
          <input type="text" name="name" required className="w-full border border-gray-300 rounded-lg p-3 focus:border-blue-500 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
          <input type="email" name="email" required className="w-full border border-gray-300 rounded-lg p-3 focus:border-blue-500 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
          <input type="password" name="password" required className="w-full border border-gray-300 rounded-lg p-3 focus:border-blue-500 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar Contraseña</label>
          <input type="password" name="password_confirmation" required className="w-full border border-gray-300 rounded-lg p-3 focus:border-blue-500 outline-none" />
        </div>
        <button type="submit" className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition mt-2">
          Registrarse
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-gray-600">
        ¿Ya tienes cuenta? <Link href="/login" className="text-blue-600 font-semibold hover:underline">Inicia sesión</Link>
      </p>
    </div>
  );
}