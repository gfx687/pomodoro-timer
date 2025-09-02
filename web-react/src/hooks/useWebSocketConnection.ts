import { useCallback } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import type {
  IncomingMessage,
  OutgoingMessage,
} from "../other/types.websocket";

export function useWebSocketConnection() {
  const { sendJsonMessage, lastJsonMessage, readyState } =
    useWebSocket<IncomingMessage>(import.meta.env.VITE_WEBSOCKET_URL, {
      share: true,
      retryOnError: true,
      reconnectAttempts: Infinity,
      reconnectInterval: (attemptNumber) =>
        Math.min(Math.pow(2, attemptNumber) * 1000, 10000),
      onError: (event) => {
        console.warn("WebSocket error:", event);
      },
      shouldReconnect: () => true,
      heartbeat: {
        message: '{"type":"Ping"}',
      },
    });

  const sendMessage = useCallback(
    (message: OutgoingMessage) => {
      if (readyState !== ReadyState.OPEN) {
        console.warn(
          "WebSocket is not open. Current state:",
          ReadyState[readyState]
        );
        return;
      }

      try {
        sendJsonMessage(message);
      } catch (error) {
        console.error("Failed to send WebSocket message:", error);
      }
    },
    [sendJsonMessage, readyState]
  );

  const isConnected = readyState === ReadyState.OPEN;
  const isConnecting = readyState === ReadyState.CONNECTING;

  return {
    sendMessage,
    lastMessage: lastJsonMessage,
    connectionState: readyState,
    isConnected,
    isConnecting,
  };
}
