import {io} from 'socket.io-client'
const backendUrl=import.meta.env.VITE_BACKEND_URL
export const initSocket=()=>{
    const options={
        forceNew:true,
        reconnectionAttempts:'infinity',
        timeout:10000,
        transports:['websocket'],
    }
    return io(backendUrl,options)
}