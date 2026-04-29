import { io } from 'socket.io-client';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const initSocket = () => {
    const options = {
        forceNew: true,
        reconnectionAttempts: Infinity,
        timeout: 10000,
    };

    console.log("Connecting to:", backendUrl); // debug

    return io(backendUrl, {
    transports: ['polling', 'websocket'], // allow fallback
    withCredentials: true,
});
};