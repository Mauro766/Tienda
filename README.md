Aplicación web de e-commerce enfocada en la gestión y visualización de productos de ropa.  
Incluye autenticación segura, administración de productos y funcionalidades completas de backend.

---

## 🚀 Tecnologías utilizadas

### Backend
- Java
- Spring Boot
- Spring Security
- JWT (Autenticación)
- JPA / Hibernate
- MySQL

### Frontend
- React (Vite)

---

## 🔐 Autenticación y Seguridad

- Registro de usuarios
- Login con JWT
- Roles de usuario (ADMIN / USER)
- Endpoint protegido `/me` para obtener datos del usuario autenticado

---

## 👕 Funcionalidades principales

- CRUD completo de productos de ropa
- Activar / desactivar productos
- Subida de imágenes
- Filtros de búsqueda
- Paginación de resultados

---

## 📦 Endpoints principales

### 🔑 Auth
- `POST /auth/register` → Registro
- `POST /auth/login` → Login

### 👤 Usuario
- `GET /me` → Datos del usuario autenticado

### 🛍️ Productos
- `GET /products` → Listar productos (con filtros y paginación)
- `POST /products` → Crear producto
- `PUT /products/{id}` → Actualizar producto
- `DELETE /products/{id}` → Eliminar producto
- `PATCH /products/{id}/active` → Activar/Desactivar producto

---

## 🖼️ Subida de imágenes

- Soporte para carga de imágenes de productos
- Almacenamiento configurado en el servidor

### Despliegue en Vercel y Render

- En Vercel, configurar `VITE_API_URL` con la URL HTTPS del servicio backend de Render.
- En Render, configurar `FRONTEND_URL` con el origen exacto del frontend y `BACKEND_URL` con el origen HTTPS del backend. `FRONTEND_URL` se usa para los retornos de pago; `BACKEND_URL` queda disponible como configuración de URL.
- Configurar `CORS_ALLOWED_ORIGINS` con el origen exacto de Vercel (sin rutas ni comodines). Para varios frontends, separar los orígenes con comas.
- Configurar `APP_AUTH_COOKIE_SECURE=true` y `APP_AUTH_COOKIE_SAME_SITE=None` en Render. `SameSite=None` exige `Secure`; localmente se mantienen los valores predeterminados compatibles con HTTP.
- Configurar `APP_AUTH_JWT_SECRET` en Render y en el `.env` local con una clave aleatoria de al menos 32 bytes. No reutilizar claves de ejemplo ni exponer este valor en el frontend. Cambiarla invalida los JWT emitidos anteriormente.
- La autenticación usa un JWT en cookie HttpOnly, no una sesión del servidor ni un token en `localStorage`. El navegador debe aceptar cookies de terceros para dominios Vercel/Render distintos. Si la política del navegador las bloquea, usar dominios propios del mismo sitio (por ejemplo, `tienda.example.com` y `api.example.com`); no guardar el JWT en almacenamiento accesible a JavaScript.
- Render usa almacenamiento efímero salvo que se conecte un disco persistente. Montar un disco y apuntar `UPLOADS_DIR` a su ruta de montaje para conservar las imágenes subidas entre reinicios y despliegues.

---

## 💸 Integración con Mercado Pago y WebSockets (Novedad)

- **Checkout y Preferencias de Pago**: Creación de preferencias de pago con la API de Mercado Pago al confirmar un pedido desde el carrito.
- **Notificaciones en Tiempo Real (WebSockets / STOMP)**: 
  - Comunicación bidireccional entre el backend (Spring Boot) y el Panel Admin (React).
  - Al completar un pago, Mercado Pago redirige al endpoint `/pagos/success`, el cual emite un aviso al instante al canal `/topic/pedidos`.
  - El Panel Admin recibe el evento por WebSocket y actualiza o inserta el pedido en la vista automáticamente sin necesidad de recargar la página.
- **Manejo de Transacciones**: Inicialización explícita de colecciones Lazy (productos y usuario) en Hibernate para asegurar la correcta serialización de objetos hacia JSON al enviarlos por el WebSocket.
