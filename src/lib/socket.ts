import { io, Socket } from "socket.io-client";
import { supabase } from "@/lib/supabase";

let socket: Socket | null = null;

const SOCKET_SERVER_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

/**
 * Initializes and returns a singleton authenticated Socket.IO instance.
 * Reuses active socket or connects with the current Supabase session token.
 */
export async function getSocket(): Promise<Socket | null> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;

  if (!token) {
    if (socket) {
      socket.disconnect();
      socket = null;
    }
    return null;
  }

  if (socket && socket.connected) {
    return socket;
  }

  if (!socket) {
    socket = io(SOCKET_SERVER_URL, {
      auth: { token },
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socket.on("connect", () => {
      console.log("🟢 Connected to Socket.IO Chat server:", socket?.id);
    });

    socket.on("connect_error", (err) => {
      console.error("🔴 Socket connection error:", err.message);
    });

    socket.on("disconnect", (reason) => {
      console.log("⚪ Socket disconnected:", reason);
    });
  } else if (!socket.connected) {
    socket.auth = { token };
    socket.connect();
  }

  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
