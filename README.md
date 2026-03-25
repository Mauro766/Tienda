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
