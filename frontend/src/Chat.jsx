import React, { useEffect, useRef, useState } from 'react'
import { RiArrowUpLine, RiBarChartHorizontalFill,RiCloseLargeLine } from '@remixicon/react'
import { v4 as uuidv4 } from 'uuid'
import './App.css'
import { io } from 'socket.io-client'
import logo from '/public/logo.jpg'



function Chat({setFirstPage, currentUser}) {

    const [barState, setBarState] = useState(false)
    
    const socketRef = useRef(null)

    const [currentId, setCurrentId]  = useState(null)

    const [allTimeUsers,setAllTimeUsers] = useState([])

    const [users, setUsers] = useState([])
    const [message, setMessage] = useState("")

    const [allMessages, setAllMessages] = useState([])

    const divRef = useRef(null)

    const chatInputRef = useRef(null)


    useEffect(()=>{
        if (divRef.current){
            divRef.current.scrollIntoView({behavior : "smooth"})
        }
    },[allMessages])


    useEffect(()=>{

        if(!currentUser){
            setFirstPage(true)
        }else{

            socketRef.current =  io(import.meta.env.VITE_API,{
                withCredentials : true
                })
            socketRef.current.on("connect",()=>{
                setCurrentId(socketRef.current.id)
                socketRef.current.emit("client-newUser",currentUser)
            })
            chatInputRef.current.focus()
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

            socketRef.current.on("server-newUser",(obj)=>{
                setUsers(obj.users)
                setAllTimeUsers(obj.allTimeUsers)
                setAllMessages(prev => [...prev,obj.connectedUserData])
            })

            socketRef.current.on("user-disconnected",(obj)=>{
                setUsers(obj.users)
                setAllMessages(prev => [...prev, obj.disconnectedUserData])                
            })
        }

    },[currentId])

    const manageBar = (e)=>{
        setBarState(prev => !prev)
    }

  return (
    <div className='w-screen h-screen flex p-2 max-lg:flex-col'>
        <div className='h-[10%] flex justify-between items-center px-4 lg:hidden'>
            <img src={logo} className='h-14 aspect-auto top-0 left-0 hidden max-lg:inline-block'/>
            <button className='top-0 right-0 hidden max-lg:inline-block' onClick={manageBar}>
                {
                    barState ? <RiCloseLargeLine size={32} className='mx-auto'/> : <RiBarChartHorizontalFill size={32} className='mx-auto'/>
                }
            </button>
        </div>
        <div className={`h-full w-1/4 flex flex-col gap-0 border-r-2 max-lg:h-[90%] ${barState ? 'max-lg:w-full max-lg:border-none' : 'max-lg:hidden'}`}>
            <div className='w-full h-4/5 overflow-y-auto custom-scroll p-4 flex flex-col gap-4'>
                {
                    users.map((eachUser)=>(
                        <h1 key={uuidv4()} className={`text-2xl px-8 py-2 rounded-xl text-gray-600 font-mono font-semibold
                         border-green-400 border-2 ${eachUser.username === currentUser ?'bg-green-300' : ''}`}>
                           {eachUser.username}
                        </h1>
                    ))
                }
            </div>
            <div className='w-full h-1/5 px-4 flex items-end justify-center max-lg:hidden'>
                <div className='w-full h-4/6 flex items-center font-bold bg-cyan-700 text-white rounded-lg justify-center gap-6'>
                    <img src={logo} alt="" 
                        className='h-14  aspect-auto rounded-lg max-xl:h-10'/>
                    <h1 className='inline-block text-3xl max-xl:text-2xl'>Chats...</h1>
                </div>
            </div>
        </div>
        <div className={`h-full w-3/4 max-lg:h-[90%] ${barState ? 'max-lg:hidden' : 'max-lg:w-full'}`}>
            <div className='w-full text-xl overflow-y-auto custom-scroll h-[90%] p-4'>
            {

                allMessages.map((eachMsg)=>(
                    eachMsg.type === "message" ? (
                        <div key={uuidv4()} className={`flex w-full ${eachMsg.id === currentId ? 'justify-start':'justify-end'} mb-8`}>
                            <div className={`${eachMsg.id === currentId ? 'bg-gray-400':'bg-cyan-600'} inline-block py-2 px-4 rounded-lg text-white font-bold font-mono text-wrap w-1/2 max-sm:w-full`}>
                                <h2 className={`text-sm font-normal mb-1 border-b-[2px] pb-1 ${currentId === eachMsg.id ? 'border-gray-600':'border-cyan-800'}`}>
                                    {
                                        (()=>{
                                            const user = allTimeUsers.find(user => user?.id === eachMsg?.id)
                                            return user?.id === currentId ? <span>~You</span> : <span>~{user?.username}</span>
                                        })()
                                    }
                                </h2>
                                <h2 className='w-full text-wrap'>{eachMsg.message}</h2>
                            </div>
                        </div>
                    ):
                    (
                        <div key={uuidv4()} className={`text-white font-mono px-8 rounded-lg py-1 w-full mb-8 text-sm hidden max-lg:block ${eachMsg.type === "joined" ? 'bg-green-400' : 'bg-red-300'}`}>
                            {`${
                                (()=>{
                                    const user = allTimeUsers.find(user => user.id === eachMsg.id)
                                    return user.id === currentId ? 'You':user.username
                                })()
                            } ${eachMsg.type} the chat`}
                        </div>
                    )
                ))

            }
            <div ref={divRef} />
            </div>
            <div className='h-[10%] w-full px-8 flex items-center'>
                <div className='relative w-full'>
                <input type="text" placeholder='Enter Message here...' className='px-8 py-2 text-lg w-full rounded-full
                    font-bold outline-none border-cyan-700 border-2 pr-12' value={message} onChange={(e)=>setMessage(e.target.value)} onKeyDown={handleKeyDown} ref={chatInputRef}/>
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