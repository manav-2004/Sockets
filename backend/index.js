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
let allTimeUsers = [] 

io.on('connection',(socket)=>{

    socket.on("client-newUser",(user)=>{

        users.push({
            username : user,
            id : socket.id
        })

        allTimeUsers.push({
            username : user,
            id : socket.id
        })

        io.emit("server-newUser",{
            users,
            allTimeUsers,
            connectedUserData : {
                type : "joined",
                id : socket.id
            }
        })
    })

    socket.on("client-message",(message)=>{
        
        io.emit("server-message",{
            type : "message",
            message,
            id : socket.id
        })
    })

    socket.on("disconnect",()=>{

        users = users.filter((user)=>user.id !== socket.id)

        io.emit("user-disconnected",{ 
            users,
            disconnectedUserData : {
                type : "left",
                id : socket.id
            }
        })
    })
})

io.listen(process.env.PORT)