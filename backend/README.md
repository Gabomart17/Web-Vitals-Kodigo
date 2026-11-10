# API de E-commerce Segura con Swagger Completo

API RESTful para un e-commerce básico construida con **Laravel 12**, autenticación **JWT**, pasarela de pago **Stripe**, documentación **Swagger/OpenAPI** y base de datos **MySQL**. Todo el entorno corre en **Docker**.

## Stack

- PHP 8.2 + Laravel 12
- MySQL 8.0
- Nginx (servidor web) + PHP-FPM
- `tymon/jwt-auth` (autenticación JWT)
- `stripe/stripe-php` (pagos)
- `darkaonline/l5-swagger` (documentación OpenAPI)
- Docker / Docker Compose

## Estructura de la base de datos

| Tabla         | Descripción                                    |
|---------------|-------------------------------------------------|
| `users`       | Clientes registrados (incluye rol `admin`/`customer`) |
| `products`    | Catálogo de productos                           |
| `orders`      | Órdenes de compra                               |
| `order_items` | Detalle de productos por orden                  |
| `payments`    | Registro de transacciones procesadas con Stripe |

## Requisitos previos

- Docker y Docker Compose instalados.
- Una cuenta de Stripe (modo test) para obtener las llaves `STRIPE_KEY` y `STRIPE_SECRET`: https://dashboard.stripe.com/test/apikeys

## Instalación paso a paso

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/ecommerce-api.git
cd ecommerce-api
```

### 2. Configurar variables de entorno

```bash
cp .env.example .env
```

Edita `.env` y coloca tus llaves de prueba de Stripe:

```
STRIPE_KEY=pk_test_xxxxxxxxxxxx
STRIPE_SECRET=sk_test_xxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxx
```

Las credenciales de MySQL ya están preconfiguradas para trabajar con `docker-compose.yml` (host `mysql`, base `ecommerce`, usuario `ecommerce_user`, password `secret`). Puedes cambiarlas siempre que actualices también el `docker-compose.yml`.

### 3. Levantar los contenedores

```bash
docker compose up -d --build
```

Esto levanta 4 servicios:

| Servicio     | Puerto host | Descripción                    |
|--------------|-------------|---------------------------------|
| `nginx`      | 8000        | Punto de entrada HTTP de la API |
| `app`        | -           | PHP-FPM (Laravel)               |
| `mysql`      | 3306        | Base de datos                   |
| `phpmyadmin` | 8080        | Administrador visual de MySQL   |

### 4. Instalar dependencias de Composer

```bash
docker compose exec app composer install
```

### 5. Generar la APP_KEY y el JWT_SECRET

```bash
docker compose exec app php artisan key:generate
docker compose exec app php artisan jwt:secret
```

### 6. Ejecutar migraciones y seeders

```bash
docker compose exec app php artisan migrate --seed
```

Esto crea las tablas y pobla:
- Un usuario **administrador**: `admin@ecommerce.test` / `admin12345`
- Un usuario **cliente de prueba**: `cliente@ecommerce.test` / `cliente12345`
- 10 productos de ejemplo.

### 7. Generar la documentación Swagger

```bash
docker compose exec app php artisan l5-swagger:generate
```

### 8. ¡Listo!

- API base: http://localhost:8000
- Documentación Swagger UI: **http://localhost:8000/api/documentation**
- phpMyAdmin: http://localhost:8080

## Flujo típico de uso de la API

1. `POST /api/auth/register` — el cliente se registra.
2. `POST /api/auth/login` — obtiene un `access_token` (JWT).
3. `GET /api/products` — navega el catálogo público (no requiere token).
4. `POST /api/orders` — crea una orden con los productos y cantidades deseadas (requiere token). Esto valida stock y calcula el total automáticamente.
5. `POST /api/payments/charge` — paga la orden indicando `order_id` y un `payment_method` de Stripe (por ejemplo, en modo test puedes usar el método `pm_card_visa` o generar uno con Stripe.js/Stripe CLI).
6. `GET /api/orders` — consulta su historial de compras.

## Endpoints principales

| Método | Ruta                       | Auth | Descripción                          |
|--------|----------------------------|------|---------------------------------------|
| POST   | `/api/auth/register`       | No   | Registro de cliente                   |
| POST   | `/api/auth/login`          | No   | Login y obtención de token JWT        |
| GET    | `/api/auth/me`             | Sí   | Usuario autenticado                   |
| POST   | `/api/auth/refresh`        | Sí   | Refrescar token                       |
| POST   | `/api/auth/logout`         | Sí   | Cerrar sesión                         |
| GET    | `/api/products`            | No   | Listar productos (público)            |
| GET    | `/api/products/{id}`       | No   | Detalle de producto                   |
| POST   | `/api/products`            | Sí (admin) | Crear producto                  |
| PUT    | `/api/products/{id}`       | Sí (admin) | Editar producto                 |
| DELETE | `/api/products/{id}`       | Sí (admin) | Eliminar producto               |
| GET    | `/api/orders`               | Sí   | Historial de compras del cliente      |
| GET    | `/api/orders/{id}`          | Sí   | Detalle de una orden propia           |
| POST   | `/api/orders`               | Sí   | Crear orden de compra                 |
| POST   | `/api/payments/charge`      | Sí   | Procesar pago con Stripe              |
| GET    | `/api/payments/{orderId}`   | Sí   | Consultar estado del pago             |

Todas las rutas están documentadas con ejemplos de request/response en Swagger UI.

## Autenticación en Swagger UI

1. Ejecuta `POST /api/auth/login` desde Swagger UI.
2. Copia el `access_token` de la respuesta.
3. Haz clic en **Authorize** (arriba a la derecha) e ingresa: `Bearer {tu_token}`.
4. Ahora puedes probar los endpoints protegidos directamente desde la interfaz.

## Manejo de errores

Todas las respuestas de error siguen un formato JSON consistente:

```json
{
  "success": false,
  "message": "Descripción del error",
  "errors": { "campo": ["detalle de validación"] }
}
```

Códigos usados: `401` (no autenticado), `403` (sin permiso), `404` (no encontrado), `422` (validación / stock insuficiente), `402` (pago rechazado por Stripe), `500` (error interno).

## Probar pagos con Stripe (modo test)

Usa las [tarjetas de prueba de Stripe](https://docs.stripe.com/testing). Para generar un `payment_method` de prueba puedes usar la Stripe CLI:

```bash
stripe payment_methods create --type=card --card[number]=4242424242424242 --card[exp_month]=12 --card[exp_year]=2030 --card[cvc]=123
```

O directamente usar el ID de prueba `pm_card_visa` en el campo `payment_method` del endpoint `/api/payments/charge`.

## Comandos útiles de Docker

```bash
# Ver logs de la app
docker compose logs -f app

# Entrar al contenedor de la app
docker compose exec app bash

# Ejecutar tinker
docker compose exec app php artisan tinker

# Detener todo
docker compose down

# Detener y borrar volumen de MySQL (reinicia la base de datos)
docker compose down -v
```

## Notas de arquitectura

- **Separación de responsabilidades**: la lógica de Stripe está aislada en `app/Services/StripePaymentService.php`, no dentro del controlador.
- **Validación**: se usan Form Requests (`RegisterRequest`, `LoginRequest`, `ProductRequest`, `OrderRequest`, `PaymentRequest`) para separar la validación de la lógica de negocio.
- **Transacciones**: la creación de órdenes usa `DB::transaction` con bloqueo de fila (`lockForUpdate`) para evitar condiciones de carrera sobre el stock.
- **Errores consistentes**: el manejo centralizado de excepciones está en `bootstrap/app.php` (patrón de Laravel 12) y siempre responde JSON para rutas `/api/*`.
- **Roles**: por simplicidad se maneja un campo `role` (`admin`/`customer`) en la tabla `users` en lugar de un sistema de permisos completo, suficiente para el alcance del caso de estudio.

## Licencia

MIT
