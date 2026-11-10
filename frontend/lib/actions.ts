'use server';
import { cookies } from 'next/headers';
import { revalidatePath, revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export async function login(formData: FormData) {
  const email = formData.get('email');
  const password = formData.get('password');

  const res = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  
  if (!res.ok) throw new Error('Credenciales inválidas');
  const data = await res.json();

  cookies().set('token', data.access_token || data.token, {
    httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', maxAge: 60 * 60 * 24 * 7
  });

  revalidatePath('/');
  redirect('/history');
}

export async function register(formData: FormData) {
  const name = formData.get('name');
  const email = formData.get('email');
  const password = formData.get('password');
  const password_confirmation = formData.get('password_confirmation');

  const res = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password, password_confirmation }),
  });
  if (!res.ok) throw new Error('Error al registrar usuario');
  redirect('/login');
}

export async function logout() {
  cookies().delete('token');
  redirect('/login');
}

export async function createOrder(cart: any[]) {
  const token = cookies().get('token')?.value;
  if (!token) throw new Error('Debes iniciar sesión para comprar');

  const items = cart.map(item => ({ product_id: item.id, quantity: item.quantity }));

  const res = await fetch(`${API_URL}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({ items }),
  });

  if (!res.ok) throw new Error('Error al crear la orden en el servidor');
  
  revalidateTag('orders');
  revalidatePath('/history');
  return await res.json();
}