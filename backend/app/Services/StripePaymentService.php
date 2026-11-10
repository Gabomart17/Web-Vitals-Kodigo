<?php

namespace App\Services;

use Stripe\Exception\ApiErrorException;
use Stripe\PaymentIntent;
use Stripe\StripeClient;

class StripePaymentService
{
    private StripeClient $client;

    public function __construct()
    {
        $this->client = new StripeClient(config('services.stripe.secret'));
    }

    /**
     * Crea y confirma un PaymentIntent en Stripe para el monto de una orden.
     *
     * @throws ApiErrorException
     */
    public function charge(float $amount, string $paymentMethod, string $orderNumber): PaymentIntent
    {
        return $this->client->paymentIntents->create([
            'amount' => (int) round($amount * 100), // Stripe trabaja en centavos
            'currency' => config('services.stripe.currency', 'usd'),
            'payment_method' => $paymentMethod,
            'confirm' => true,
            'description' => "Pago de orden {$orderNumber}",
            'automatic_payment_methods' => [
                'enabled' => true,
                'allow_redirects' => 'never',
            ],
        ]);
    }

    public function retrieve(string $paymentIntentId): PaymentIntent
    {
        return $this->client->paymentIntents->retrieve($paymentIntentId);
    }
}
