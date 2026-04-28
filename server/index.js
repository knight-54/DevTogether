require('dotenv').config()
const mongoose = require('mongoose')
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));
const Room=require('./models/Room')
const axios=require('axios')
const express=require("express")
const app=express()
app.use(express.json());
const cors = require("cors");
app.use(cors({
    origin: process.env.CLIENT_URL || "*"
}));
const http=require('http')
const {Server} = require('socket.io')
const server =http.createServer(app)
const io=new Server(server,{
    cors:{
        origin: process.env.CLIENT_URL || "*",
        methods:['GET','POST']
    }
})
const userSocketMap={}


function getLanguageId(language){
    switch (language){
        case 'javascript': return 93;
        case 'cpp': return 54;
        case 'java': return 91;
        default: return 93;
    }
}
const getAllConnectedClients=(roomId)=>{
    return Array.from(io.sockets.adapter.rooms.get(roomId)|| []).map(
        (socketId)=>{
            return {
                socketId,
                username:userSocketMap[socketId]
            }
                }
        )
}

io.on('connection',(socket)=>{
    console.log(`User connected: ${socket.id}`)
    socket.on('join',async({roomId,username})=>{
        try{
            userSocketMap[socket.id]=username
            socket.join(roomId)

            const room=await Room.findOne({roomId})
            if(room){
                 io.to(socket.id).emit('code-change',{code: room.code})
            }

            const clients = getAllConnectedClients(roomId);
            io.in(roomId).emit('joined', {
            clients,
            username,
            socketId: socket.id,
            })

        }catch(error){
            console.error('Error in join handler:', error)
        }
    })
    socket.on('code-change',async ({ roomId, code }) => {
        try{
            await Room.findOneAndUpdate(
                {roomId},
                {code},
                {upsert:true}
            )
              socket.to(roomId).emit('code-change', { code });
        }catch(error){
            console.error('Error in code-change handler:', error);
        }
    });

    socket.on('run-code',async({roomId,language,sourceCode,stdin})=>{
        try{
            const encodedSourceCode = Buffer.from(sourceCode).toString('base64')
            const encodedStdin = Buffer.from(stdin || "").toString('base64')
            const response=await axios.post(
                 'https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=true&wait=true',
                 {
                 source_code:encodedSourceCode,
                 language_id:getLanguageId(language),
                 stdin: encodedStdin
                 },
                 {
                    headers:{
                        'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
                        'x-rapidapi-key': process.env.JUDGE0_API_KEY,
                        'content-type': 'application/json',
                    }
                 }
            )
            const output=response.data.stdout || response.data.stderr || response.data.compile_output || 'Execution finished.'
             io.in(roomId).emit('run-output',{ output })
        } catch(error){
            const errorMessage=error.response?.data?.error || 'Error executing code.'
            console.error(error)
            io.in(roomId).emit('run-output',{output:errorMessage})
        }
    })

    socket.on('disconnecting',()=>{
    const rooms=[...socket.rooms]
    rooms.forEach((roomId)=>{
        socket.in(roomId).emit("disconnected",{
        socketId:socket.id,
        username: userSocketMap[socket.id]
        })
    })
        delete userSocketMap[socket.id]
        socket.leave();
})
})
app.get("/", (req, res) => {
    res.send("Server is running 🚀");
});
const PORT=process.env.PORT || 5000
server.listen(PORT,()=> console.log("Server is running"))
