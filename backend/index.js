import {createServer} from 'http'
import {Server} from 'socket.io'
import dotenv from 'dotenv'

dotenv.config({
    path : '.env'
})

const httpServer = createServer()

const io = new Server(httpServer,{
    cors : {
        origin : process.env.ORIGIN,
        credentials : true
    }
})

let users = [] 

io.on('connection',(socket)=>{

    socket.on("client-newUser",(user)=>{

        users.push({
            username : user,
            id : socket.id
        })

        io.emit("server-newUser",users)
    })

    socket.on("client-message",(message)=>{
        
        io.emit("server-message",{
            message,
            id : socket.id
        })
    })

    socket.on("disconnect",()=>{

        users = users.filter((user)=>user.id !== socket.id)

        io.emit("user-disconnected",users)
    })
})

io.listen(process.env.PORT)