<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\OrderRequest;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

/**
 * @OA\Tag(name="Orders", description="Creación de órdenes y consulta del historial de compras")
 */
class OrderController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/orders",
     *     tags={"Orders"},
     *     summary="Historial de compras del cliente autenticado",
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(response=200, description="Listado de órdenes del usuario"),
     *     @OA\Response(response=401, description="No autenticado")
     * )
     */
    public function index()
    {
        $orders = Order::with(['items.product', 'payment'])
            ->where('user_id', Auth::guard('api')->id())
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return response()->json([
            'success' => true,
            'data' => $orders,
        ]);
    }

    /**
     * @OA\Get(
     *     path="/api/orders/{id}",
     *     tags={"Orders"},
     *     summary="Ver el detalle de una orden propia",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Detalle de la orden"),
     *     @OA\Response(response=403, description="No autorizado"),
     *     @OA\Response(response=404, description="Orden no encontrada")
     * )
     */
    public function show(Order $order)
    {
        if ($order->user_id !== Auth::guard('api')->id()) {
            return response()->json([
                'success' => false,
                'message' => 'No tiene permiso para ver esta orden.',
            ], 403);
        }

        $order->load(['items.product', 'payment']);

        return response()->json([
            'success' => true,
            'data' => $order,
        ]);
    }

    /**
     * @OA\Post(
     *     path="/api/orders",
     *     tags={"Orders"},
     *     summary="Crear una nueva orden de compra",
     *     security={{"bearerAuth":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"shipping_address","items"},
     *             @OA\Property(property="shipping_address", type="string", example="Col. Escalon, San Salvador"),
     *             @OA\Property(
     *                 property="items",
     *                 type="array",
     *                 @OA\Items(
     *                     @OA\Property(property="product_id", type="integer", example=1),
     *                     @OA\Property(property="quantity", type="integer", example=2)
     *                 )
     *             )
     *         )
     *     ),
     *     @OA\Response(response=201, description="Orden creada correctamente"),
     *     @OA\Response(response=422, description="Error de validación o stock insuficiente")
     * )
     */
    public function store(OrderRequest $request)
    {
        try {
            $order = DB::transaction(function () use ($request) {
                $total = 0;
                $itemsData = [];

                foreach ($request->items as $item) {
                    $product = Product::lockForUpdate()->findOrFail($item['product_id']);

                    if (! $product->is_active) {
                        throw new \RuntimeException("El producto '{$product->name}' no está disponible.");
                    }

                    if ($product->stock < $item['quantity']) {
                        throw new \RuntimeException("Stock insuficiente para el producto '{$product->name}'.");
                    }

                    $subtotal = $product->price * $item['quantity'];
                    $total += $subtotal;

                    $itemsData[] = [
                        'product' => $product,
                        'quantity' => $item['quantity'],
                        'unit_price' => $product->price,
                        'subtotal' => $subtotal,
                    ];
                }

                $order = Order::create([
                    'user_id' => Auth::guard('api')->id(),
                    'total' => $total,
                    'status' => 'pending',
                    'shipping_address' => $request->shipping_address,
                ]);

                foreach ($itemsData as $data) {
                    $order->items()->create([
                        'product_id' => $data['product']->id,
                        'quantity' => $data['quantity'],
                        'unit_price' => $data['unit_price'],
                        'subtotal' => $data['subtotal'],
                    ]);

                    $data['product']->decrement('stock', $data['quantity']);
                }

                return $order->load('items.product');
            });

            return response()->json([
                'success' => true,
                'message' => 'Orden creada correctamente. Proceda al pago.',
                'data' => $order,
            ], 201);
        } catch (\RuntimeException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 422);
        }
    }
}
