import { io } from 'socket.io-client';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const initSocket = () => {
    const options = {
        forceNew: true,
        reconnectionAttempts: Infinity,
        timeout: 10000,
        transports: ['websocket'],
    };

    console.log("Connecting to:", backendUrl); // debug

    return io(backendUrl, options);
};