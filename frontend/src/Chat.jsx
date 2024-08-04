import React, { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { RiArrowUpLine } from '@remixicon/react'
import {v4 as uuidv4} from 'uuid'
import './App.css'
import {io} from 'socket.io-client'

function Chat() {
    
    const socketRef = useRef(null)

    const location = useLocation()
    const navigate = useNavigate()

    const [currentId, setCurrentId]  = useState(null)

    const [users, setUsers] = useState([])
    const [message, setMessage] = useState("")

    const [allMessages, setAllMessages] = useState([])



    useEffect(()=>{

        if(!location?.state?.user){
            navigate("/")
            return ()=>{
                socketRef.current.disconnect()
            }
        }else{
            socketRef.current =  io(import.meta.env.VITE_API,{
                withCredentials : true
             })
            socketRef.current.on("connect",()=>{
                setCurrentId(socketRef.current.id)
                socketRef.current.emit("client-newUser",location?.state?.user)
            })
        }
    },[])


    

    const handleMessage = ()=>{
        socketRef.current.emit("client-message",message)
        setMessage("")
    }

    const handleKeyDown = (e)=>{
        if (e.key === 'Enter'){
            e.preventDefault()
            if (message.trim()){
                socketRef.current.emit("client-message",message)
                setMessage("")
            }
        }
    }

    useEffect(()=>{

 
        if (currentId){

            socketRef.current.on("server-message",(msgObj)=>{
                setAllMessages(prev => [...prev,msgObj])
            })

            socketRef.current.on("server-newUser",(array)=>{
                setUsers(array) 
            })

            socketRef.current.on("user-disconnected",(array)=>{
                setUsers(array)
            })
        }

    },[currentId])

  return (
    <div className='w-screen h-screen flex p-2'>
        <div className='h-full w-1/3 flex flex-col gap-0 border-r-2'>

            <div className='w-full h-4/5 overflow-y-auto custom-scroll p-4 flex flex-col gap-4'>
                {
                    users.map((user)=>(
                        <h1 key={user.id} className='text-2xl px-8 py-2 rounded-xl text-gray-600 font-mono font-semibold border-green-400 border-2'>
                           {user.username}
                        </h1>
                    ))
                }
            </div>
            <div className='w-full h-1/5 px-4 flex items-end justify-center'>
                <div className='w-full h-4/6 flex items-center font-bold bg-cyan-700 text-white rounded-lg justify-center gap-6'>
                    <img src="https://logowik.com/content/uploads/images/chat3893.logowik.com.webp" alt="" 
                        className='h-14  aspect-auto rounded-lg'/>
                    <h1 className='inline-block text-3xl'>Chats...</h1>
                </div>
            </div>

        </div>
        <div className='h-full w-2/3'>
            <div className='w-full text-xl overflow-y-auto custom-scroll h-[90%] p-4'>
            {

                allMessages.map((eachMsg)=>(
                    <div key={uuidv4()} className={`flex w-full ${eachMsg.id === currentId ? 'justify-start':'justify-end'} mb-8`}>
                        <div className={`${eachMsg.id === currentId ? 'bg-gray-500':'bg-cyan-600'} inline-block py-2 px-4 rounded-lg text-white font-bold font-mono text-wrap w-1/2`}>
                            <h2 className={`text-sm font-normal mb-1 border-b-[2px] pb-1 ${currentId === eachMsg.id ? 'border-gray-600':'border-cyan-800'}`}>
                                {
                                    (()=>{
                                        const user = users.find(user => user?.id === eachMsg?.id)
                                        return user?.id === currentId ? <span>~You</span> : <span>~{user?.username}</span>
                                    })()
                                }
                            </h2>
                            <h2 className='w-full text-wrap'>{eachMsg.message}</h2>
                        </div>
                    </div>
                ))

            }            
            </div>
            <div className='h-[10%] w-full px-8 flex items-center'>
                <div className='relative w-full'>
                <input type="text" placeholder='Enter Message here...' className='px-8 py-2 text-lg w-full rounded-full
                    font-bold outline-none border-cyan-700 border-2 pr-12' value={message} onChange={(e)=>setMessage(e.target.value)} onKeyDown={handleKeyDown}/>
                <button className='absolute z-10 right-4 top-3' onClick={handleMessage}>
                    <RiArrowUpLine
                        className=''
                    />
                </button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Chat