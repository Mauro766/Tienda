// hooks/usePedidosSocket.js
import { useEffect, useRef } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { API_URL } from "../config";

export function usePedidosSocket(onNuevoPedido) {
  // Guardamos la última versión del callback en un ref
  // para evitar re-conectar el socket cuando el componente re-renderiza
  const callbackRef = useRef(onNuevoPedido);

  useEffect(() => {
    callbackRef.current = onNuevoPedido;
  }, [onNuevoPedido]);

  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS(`${API_URL}/ws`), reconnectDelay: 5000, // reconecta automáticamente si se cae
      onConnect: () => {
        console.log("[WS] Conectado al topic /topic/pedidos");
        client.subscribe("/topic/pedidos", (msg) => {
          try {
            const pedido = JSON.parse(msg.body);
            callbackRef.current?.(pedido);
          } catch (e) {
            console.error("[WS] Error parseando pedido:", e);
          }
        });
      },
      onDisconnect: () => {
        console.log("[WS] Desconectado");
      },
      onStompError: (frame) => {
        console.error("[WS] Error STOMP:", frame);
      },
    });

    client.activate();
    return () => client.deactivate();
  }, []); // Solo se monta/desmonta una vez — el callback se accede por ref
}