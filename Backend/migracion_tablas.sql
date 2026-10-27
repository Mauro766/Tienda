-- ============================================================
-- MIGRACIÓN SEGURA: ropa_tallas y ropa_imagenes
-- Compatible con Aiven Cloud (sql_require_primary_key = ON)
-- ============================================================
--
-- INSTRUCCIONES:
-- 1. Ejecutá primero las consultas de VERIFICACIÓN PREVIA (sección 1).
-- 2. Si las tablas NO tienen columna "id", ejecutá la MIGRACIÓN (sección 2).
-- 3. Ejecutá la VALIDACIÓN POSTERIOR (sección 3) para confirmar.
-- 4. Recién después desplegá el código Java corregido.
--
-- ⚠️  NO se eliminan tablas, NO se borran datos, NO se recrean índices.
--
-- Esquema esperado por las entidades Java:
--
--   RopaTalla (@Entity, @Table(name = "ropa_tallas"))
--     - id       BIGINT  AUTO_INCREMENT  PRIMARY KEY
--     - ropa_id  BIGINT  NOT NULL        FK → ropa(id)
--     - talla    VARCHAR(255)  NOT NULL
--
--   RopaImagen (@Entity, @Table(name = "ropa_imagenes"))
--     - id         BIGINT  AUTO_INCREMENT  PRIMARY KEY
--     - ropa_id    BIGINT  NOT NULL        FK → ropa(id)
--     - imagen_url VARCHAR(255)  NOT NULL
--
-- ============================================================


-- ────────────────────────────────────────────────────────────
-- SECCIÓN 1: VERIFICACIÓN PREVIA (solo lectura)
-- ────────────────────────────────────────────────────────────

-- Verificar estructura actual
DESCRIBE ropa_tallas;
DESCRIBE ropa_imagenes;

-- Verificar si ya existe PK (debería estar vacío si no hay)
SHOW INDEX FROM ropa_tallas WHERE Key_name = 'PRIMARY';
SHOW INDEX FROM ropa_imagenes WHERE Key_name = 'PRIMARY';

-- Contar registros existentes (para validar después)
SELECT COUNT(*) AS total_tallas FROM ropa_tallas;
SELECT COUNT(*) AS total_imagenes FROM ropa_imagenes;


-- ────────────────────────────────────────────────────────────
-- SECCIÓN 2: MIGRACIÓN (ejecutar solo si no existe columna id)
-- ────────────────────────────────────────────────────────────

-- 2a. Migrar ropa_tallas
--     Agrega columna id como PK auto-increment.
--     Los registros existentes reciben ids secuenciales automáticamente.
ALTER TABLE ropa_tallas
    ADD COLUMN id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY FIRST;

-- 2b. Asegurar NOT NULL en la columna talla
ALTER TABLE ropa_tallas
    MODIFY COLUMN talla VARCHAR(255) NOT NULL;

-- 2c. Migrar ropa_imagenes
ALTER TABLE ropa_imagenes
    ADD COLUMN id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY FIRST;

-- 2d. Asegurar NOT NULL en imagen_url
ALTER TABLE ropa_imagenes
    MODIFY COLUMN imagen_url VARCHAR(255) NOT NULL;


-- ────────────────────────────────────────────────────────────
-- SECCIÓN 3: VALIDACIÓN POSTERIOR (solo lectura)
-- ────────────────────────────────────────────────────────────

-- Confirmar que la PK existe ahora
SHOW INDEX FROM ropa_tallas WHERE Key_name = 'PRIMARY';
SHOW INDEX FROM ropa_imagenes WHERE Key_name = 'PRIMARY';

-- Confirmar que la estructura es correcta
DESCRIBE ropa_tallas;
-- Esperado: id BIGINT PK AUTO_INCREMENT, ropa_id BIGINT NOT NULL, talla VARCHAR(255) NOT NULL
DESCRIBE ropa_imagenes;
-- Esperado: id BIGINT PK AUTO_INCREMENT, ropa_id BIGINT NOT NULL, imagen_url VARCHAR(255) NOT NULL

-- Confirmar que no se perdieron datos
SELECT COUNT(*) AS total_tallas FROM ropa_tallas;
SELECT COUNT(*) AS total_imagenes FROM ropa_imagenes;

-- Ver algunos registros de ejemplo
SELECT * FROM ropa_tallas LIMIT 5;
SELECT * FROM ropa_imagenes LIMIT 5;
