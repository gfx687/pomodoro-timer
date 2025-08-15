import { useCallback } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import type { IncomingMessage, OutgoingMessage } from "./types";

const WEBSOCKET_URL = "ws://localhost:5170/ws";

export function useWebSocketConnection() {
  const { sendJsonMessage, lastJsonMessage, readyState } =
    useWebSocket<IncomingMessage>(WEBSOCKET_URL, {
      shouldReconnect: (closeEvent) => {
        console.log("WebSocket closed:", closeEvent);
        return true;
      },
      share: true,
      retryOnError: true,
      reconnectAttempts: Infinity,
      reconnectInterval: (attemptNumber) =>
        Math.min(Math.pow(2, attemptNumber) * 1000, 10000),
      onError: (event) => {
        console.error("WebSocket error:", event);
      },
      onClose: (event) => {
        console.log("WebSocket connection closed:", event.code, event.reason);
      },
      onReconnectStop: (numAttempts) => {
        console.error(
          "WebSocket reconnection stopped after",
          numAttempts,
          "attempts"
        );
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
