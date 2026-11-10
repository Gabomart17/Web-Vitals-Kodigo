<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $products = [
            ['name' => 'Laptop Lenovo ThinkPad E14', 'price' => 899.99, 'stock' => 15, 'sku' => 'LT-LEN-E14'],
            ['name' => 'Mouse Inalámbrico Logitech M170', 'price' => 14.99, 'stock' => 120, 'sku' => 'MS-LOG-M170'],
            ['name' => 'Teclado Mecánico Redragon K552', 'price' => 34.50, 'stock' => 60, 'sku' => 'KB-RDG-K552'],
            ['name' => 'Monitor LG 24" Full HD', 'price' => 149.00, 'stock' => 40, 'sku' => 'MN-LG-24FHD'],
            ['name' => 'Audífonos Sony WH-CH520', 'price' => 49.99, 'stock' => 80, 'sku' => 'HP-SNY-CH520'],
            ['name' => 'Disco SSD Kingston 480GB', 'price' => 39.99, 'stock' => 100, 'sku' => 'SSD-KGT-480'],
            ['name' => 'Webcam Logitech C920', 'price' => 59.99, 'stock' => 35, 'sku' => 'WC-LOG-C920'],
            ['name' => 'Router TP-Link Archer C6', 'price' => 42.00, 'stock' => 25, 'sku' => 'RT-TPL-C6'],
            ['name' => 'Silla Ergonómica de Oficina', 'price' => 129.99, 'stock' => 10, 'sku' => 'CH-ERG-001'],
            ['name' => 'Impresora Multifuncional Epson L3250', 'price' => 219.00, 'stock' => 12, 'sku' => 'PR-EPS-L3250'],
        ];

        foreach ($products as $product) {
            Product::updateOrCreate(
                ['sku' => $product['sku']],
                [
                    'name' => $product['name'],
                    'slug' => Str::slug($product['name']) . '-' . Str::lower($product['sku']),
                    'description' => 'Producto de ejemplo generado por el seeder para pruebas de la API de e-commerce.',
                    'price' => $product['price'],
                    'stock' => $product['stock'],
                    'image_url' => null,
                    'is_active' => true,
                ]
            );
        }
    }
}
