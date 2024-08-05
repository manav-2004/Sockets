import React, { useState } from 'react'
import { RiArrowRightLine } from '@remixicon/react'
import { useDispatch } from 'react-redux'
import {logUser} from './features/userSlice'
import Chat from './Chat'

function Home() {


    const dispatch = useDispatch()

    const [user, setUser] = useState("")
    
    const [firstPage, setFirstPage] = useState(true)

  return firstPage ? (
    <div className='w-full h-screen p-4 flex'>
        <div className='w-1/2 h-full flex justify-center items-center bg-cyan-800 rounded-l-xl'>
            <img src="https://logowik.com/content/uploads/images/chat3893.logowik.com.webp" alt="" 
                className='w-64 aspect-auto rounded-xl'
            />
        </div>
        <div className='w-1/2 h-full flex flex-col'>
            <div className='w-full h-1/2 flex justify-center items-end pb-4'>
                <input type="text" placeholder='Enter Your Name here'
                    className='outline-none border border-cyan-800 rounded-xl px-4 py-4 w-[450px]
                        font-bold'
                    value={user}
                    onChange={(e)=>setUser(e.target.value)}
                />
            </div>
            <button className='w-full h-1/2 flex justify-end items-end p-4' onClick={()=>{
                if (user){
                    dispatch(logUser({user}))
                    setFirstPage(false)
                }
            }}>
                <RiArrowRightLine
                    size={72}
                    className='text-cyan-800'
                />
            </button>
        </div>
    </div>
  )
  :
  (
    <div className='h-screen w-screen'>
        <Chat fn = {setFirstPage}/>
    </div>
  )
}  

export default Home