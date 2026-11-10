const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export async function getProducts() {
  try {
    const res = await fetch(`${API_URL}/products`, { next: { revalidate: 60, tags: ['products'] } });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || data;
  } catch (error) {
    return [];
  }
}

export async function getProduct(id: string) {
  const res = await fetch(`${API_URL}/products/${id}`, { next: { revalidate: 60 } });
  if (!res.ok) throw new Error('Producto no encontrado');
  const data = await res.json();
  return data.data || data;
}

export async function getOrders(token: string) {
  const res = await fetch(`${API_URL}/orders`, {
    headers: { 'Authorization': `Bearer ${token}` },
    next: { tags: ['orders'] }
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data.data || data;
}