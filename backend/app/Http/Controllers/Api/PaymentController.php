<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\PaymentRequest;
use App\Models\Order;
use App\Services\StripePaymentService;
use Illuminate\Support\Facades\Auth;
use Stripe\Exception\ApiErrorException;

/**
 * @OA\Tag(name="Payments", description="Procesamiento de pagos mediante Stripe")
 */
class PaymentController extends Controller
{
    public function __construct(private readonly StripePaymentService $stripe)
    {
    }

    /**
     * @OA\Post(
     *     path="/api/payments/charge",
     *     tags={"Payments"},
     *     summary="Procesar el pago de una orden mediante Stripe",
     *     security={{"bearerAuth":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"order_id","payment_method"},
     *             @OA\Property(property="order_id", type="integer", example=1),
     *             @OA\Property(property="payment_method", type="string", example="pm_card_visa", description="Token/ID de método de pago generado por Stripe.js o Stripe CLI de pruebas")
     *         )
     *     ),
     *     @OA\Response(response=200, description="Pago procesado correctamente"),
     *     @OA\Response(response=402, description="El pago fue rechazado por Stripe"),
     *     @OA\Response(response=403, description="No autorizado"),
     *     @OA\Response(response=422, description="Error de validación")
     * )
     */
    public function charge(PaymentRequest $request)
    {
        $order = Order::with('payment')->findOrFail($request->order_id);

        if ($order->user_id !== Auth::guard('api')->id()) {
            return response()->json([
                'success' => false,
                'message' => 'No tiene permiso para pagar esta orden.',
            ], 403);
        }

        if ($order->status === 'paid') {
            return response()->json([
                'success' => false,
                'message' => 'Esta orden ya fue pagada.',
            ], 422);
        }

        try {
            $intent = $this->stripe->charge(
                amount: (float) $order->total,
                paymentMethod: $request->payment_method,
                orderNumber: $order->order_number,
            );

            $status = $intent->status === 'succeeded' ? 'succeeded' : 'failed';

            $payment = $order->payment()->updateOrCreate(
                ['order_id' => $order->id],
                [
                    'stripe_payment_intent_id' => $intent->id,
                    'stripe_charge_id' => $intent->latest_charge,
                    'amount' => $order->total,
                    'currency' => $intent->currency,
                    'status' => $status,
                    'raw_response' => $intent->toArray(),
                ]
            );

            $order->update([
                'status' => $status === 'succeeded' ? 'paid' : 'failed',
            ]);

            if ($status !== 'succeeded') {
                return response()->json([
                    'success' => false,
                    'message' => 'El pago no pudo ser procesado por Stripe.',
                    'data' => $payment,
                ], 402);
            }

            return response()->json([
                'success' => true,
                'message' => 'Pago procesado correctamente.',
                'data' => [
                    'order' => $order->fresh(['items.product', 'payment']),
                    'payment' => $payment,
                ],
            ]);
        } catch (ApiErrorException $e) {
            $order->payment()->updateOrCreate(
                ['order_id' => $order->id],
                [
                    'stripe_payment_intent_id' => $e->getStripeCode() ?? 'error_' . uniqid(),
                    'amount' => $order->total,
                    'currency' => config('services.stripe.currency', 'usd'),
                    'status' => 'failed',
                    'raw_response' => ['error' => $e->getMessage()],
                ]
            );

            $order->update(['status' => 'failed']);

            return response()->json([
                'success' => false,
                'message' => 'Error al procesar el pago: ' . $e->getMessage(),
            ], 402);
        }
    }

    /**
     * @OA\Get(
     *     path="/api/payments/{orderId}",
     *     tags={"Payments"},
     *     summary="Consultar el estado del pago de una orden",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(name="orderId", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Estado del pago"),
     *     @OA\Response(response=404, description="No se encontró un pago para esta orden")
     * )
     */
    public function show(int $orderId)
    {
        $order = Order::with('payment')->findOrFail($orderId);

        if ($order->user_id !== Auth::guard('api')->id()) {
            return response()->json([
                'success' => false,
                'message' => 'No tiene permiso para ver este pago.',
            ], 403);
        }

        if (! $order->payment) {
            return response()->json([
                'success' => false,
                'message' => 'No se encontró un pago para esta orden.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $order->payment,
        ]);
    }
}
