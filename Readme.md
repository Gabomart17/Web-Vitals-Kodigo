# E-Commerce Full Stack (Laravel + Next.js)

Este proyecto contiene tanto el **Backend (Laravel)** como el **Frontend (Next.js)** unificados en un solo lugar.

## Estructura
- `/backend` -> API REST en Laravel 12.
- `/frontend` -> Aplicación Next.js 16 (App Router).

## 🚀 Cómo ejecutar el proyecto (Guía Rápida)

Para que la tienda funcione, necesitas iniciar ambos proyectos. Aquí tienes los pasos exactos:

### 1. Iniciar el Backend (Laravel)
1. Abre una terminal y navega a la carpeta backend: `cd backend`
2. Instala las dependencias de PHP (si no lo has hecho): `composer install`
3. Inicia el servidor: `php artisan serve`
   *(El backend ahora escucha en http://localhost:8000)*

### 2. Iniciar el Frontend (Next.js)
1. Abre **otra pestaña/ventana nueva de terminal** y navega a la carpeta frontend: `cd frontend`
2. Copia el entorno de ejemplo: `cp .env.example .env.local`
3. Instala las dependencias de Node: `npm install`
4. Inicia la interfaz: `npm run dev`
   *(El frontend ahora está visible en http://localhost:3000)*

---

### Si quieres hacer el Build y sacar el reporte Lighthouse (Para la evaluación):
En lugar de `npm run dev` en el paso 2.4, ejecuta:
```bash
npm run build
npm run start
```
Y saca tu captura/PDF desde `http://localhost:3000` con la herramienta de Google Chrome DevTools.
