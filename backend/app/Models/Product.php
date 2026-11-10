<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

/**
 * @OA\Schema(
 *     schema="Product",
 *     type="object",
 *     title="Product",
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="name", type="string", example="Laptop Lenovo ThinkPad"),
 *     @OA\Property(property="slug", type="string", example="laptop-lenovo-thinkpad"),
 *     @OA\Property(property="description", type="string", example="Laptop empresarial de 14 pulgadas"),
 *     @OA\Property(property="price", type="number", format="float", example=899.99),
 *     @OA\Property(property="stock", type="integer", example=25),
 *     @OA\Property(property="sku", type="string", example="LT-LEN-001"),
 *     @OA\Property(property="image_url", type="string", example="https://example.com/img.jpg"),
 *     @OA\Property(property="is_active", type="boolean", example=true)
 * )
 */
class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'price',
        'stock',
        'sku',
        'image_url',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'is_active' => 'boolean',
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (Product $product) {
            if (empty($product->slug)) {
                $product->slug = Str::slug($product->name) . '-' . Str::random(6);
            }
        });
    }

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
