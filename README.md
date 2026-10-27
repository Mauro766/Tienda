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

---

## 💸 Integración con Mercado Pago y WebSockets (Novedad)

- **Checkout y Preferencias de Pago**: Creación de preferencias de pago con la API de Mercado Pago al confirmar un pedido desde el carrito.
- **Notificaciones en Tiempo Real (WebSockets / STOMP)**: 
  - Comunicación bidireccional entre el backend (Spring Boot) y el Panel Admin (React).
  - Al completar un pago, Mercado Pago redirige al endpoint `/pagos/success`, el cual emite un aviso al instante al canal `/topic/pedidos`.
  - El Panel Admin recibe el evento por WebSocket y actualiza o inserta el pedido en la vista automáticamente sin necesidad de recargar la página.
- **Manejo de Transacciones**: Inicialización explícita de colecciones Lazy (productos y usuario) en Hibernate para asegurar la correcta serialización de objetos hacia JSON al enviarlos por el WebSocket.
