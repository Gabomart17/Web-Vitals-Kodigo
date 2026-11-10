import { cookies } from 'next/headers';
import { getOrders } from '@/lib/api';
import { redirect } from 'next/navigation';

export default async function History() {
  const token = cookies().get('token')?.value;
  if (!token) redirect('/login');

  const orders = await getOrders(token);

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Historial de Órdenes</h1>
      
      {!orders || orders.length === 0 ? (
        <div className="bg-white p-8 rounded-xl text-center border border-gray-100 text-gray-500">
          Aún no has realizado ninguna compra.
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order: any) => (
            <div key={order.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex justify-between items-center border-b pb-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500">Orden #{order.id}</p>
                  <p className="font-semibold text-gray-900">{new Date(order.created_at).toLocaleDateString('es-ES', { dateStyle: 'long' })}</p>
                </div>
                <div className="text-right">
                  <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-bold uppercase tracking-wider mb-1">
                    {order.status || 'Completado'}
                  </span>
                  <p className="font-bold text-xl text-blue-600">${Number(order.total).toFixed(2)}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-gray-700">Productos:</h4>
                {order.items?.map((item: any) => (
                  <div key={item.id} className="flex justify-between text-sm text-gray-600 bg-gray-50 p-2 rounded">
                    <span>{item.product?.name || 'Producto'} (x{item.quantity})</span>
                    <span>${(Number(item.price) * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}