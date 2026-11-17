import { io } from 'socket.io-client'

// Connexió amb el servidor Socket.IO (la URL ve del fitxer .env)
// autoConnect: false → ens connectem nosaltres des de GameBoardView
export const socket = io(
  import.meta.env.VITE_SOCKET_URL,
  { autoConnect: false }
)
