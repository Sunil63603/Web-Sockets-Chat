import { io, Socket } from "socket.io-client";
//Socket is TS type and 'io' is a method.

//getting frontend URL from environment variables.
const URL = import.meta.env.VITE_BACKEND_URL as string;

//create a socket and export it.
const socket: Socket = io(URL);

export default socket;
