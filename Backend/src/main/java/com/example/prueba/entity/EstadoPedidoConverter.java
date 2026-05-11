package com.example.prueba.entity;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter
public class EstadoPedidoConverter implements AttributeConverter<EstadoPedido, String> {

    @Override
    public String convertToDatabaseColumn(EstadoPedido estado) {
        if (estado == null) {
            return null;
        }

        // Compatibilidad con esquemas viejos donde "ARCHIVADO" se guardaba como "PAGADO".
        if (estado == EstadoPedido.ARCHIVADO) {
            return "PAGADO";
        }

        return estado.name();
    }

    @Override
    public EstadoPedido convertToEntityAttribute(String dbValue) {
        if (dbValue == null || dbValue.isBlank()) {
            return null;
        }

        if ("PAGADO".equalsIgnoreCase(dbValue) || "ARCHIVADO".equalsIgnoreCase(dbValue)) {
            return EstadoPedido.ARCHIVADO;
        }

        return EstadoPedido.valueOf(dbValue.toUpperCase());
    }
}
