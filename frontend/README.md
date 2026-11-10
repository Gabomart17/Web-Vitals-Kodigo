# E-Commerce Frontend - Next.js (App Router)

Este proyecto es la resolución a la actividad de **Optimización Avanzada de Rendimiento**. Consume la API REST desarrollada en Laravel 12.

## Características Implementadas
- **Next.js 16+ (App Router)** y TypeScript.
- **Server Components** para el catálogo y detalle de productos (optimizando Web Vitals).
- **Server Actions** para login, registro, creación de órdenes y procesamiento.
- **Seguridad**: JWT almacenado en `httpOnly` cookie nativo.
- **Rendimiento**: Uso de `loading.tsx`, `error.tsx` en segmentos críticos y `<Suspense>`.
- **Revalidación**: Uso de `revalidatePath`.

## Configuración y Ejecución
1. `npm install`
2. Copia `.env.example` a `.env.local` y configura tu `NEXT_PUBLIC_API_URL`.
3. `npm run dev`

## Rutas
- `/` - Catálogo
- `/products/[id]` - Detalle
- `/login` y `/register` - Auth
- `/cart` - Carrito
- `/checkout` - Pago (Stripe)
- `/history` - Órdenes
