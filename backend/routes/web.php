<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'success' => true,
        'message' => 'API E-commerce Segura funcionando correctamente.',
        'documentation' => url('/api/documentation'),
    ]);
});
