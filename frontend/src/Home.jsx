import React, { useEffect, useRef, useState } from 'react'
import { RiArrowRightLine } from '@remixicon/react'
import Chat from './Chat'
import logo from '/public/logo.jpg'

function Home() {

    const inputRef = useRef(null)

    const [user, setUser] = useState("")
    
    const [firstPage, setFirstPage] = useState(true)

    useEffect(()=>{
        inputRef.current.focus()
    },[])

  return firstPage ? (
    <div className='w-full h-screen p-4 flex max-sm:flex-col'>
        <div className='w-1/2 h-full flex justify-center items-center bg-cyan-800 rounded-l-xl 
        max-md:w-2/5  max-sm:w-full max-sm:h-1/3 max-sm:rounded-xl max-sm:bg-white'>
            
            <img src={logo} alt="" 
                className='w-64 aspect-auto rounded-xl max-md:w-40 max-sm:w-64'
            />
        </div>
        <div className='w-1/2 h-full flex flex-col pl-4 max-md:w-3/5 max-sm:w-full max-sm:h-2/3'>
            <div className='w-full h-1/2 flex justify-center items-end pb-4'>
                <input type="text" placeholder='Enter Your Name here'
                    className='outline-none border border-cyan-800 rounded-xl px-4 py-4 w-[450px]
                        font-bold max-[]:'
                    value={user}
                    onChange={(e)=>setUser(e.target.value)}

                    onKeyDown={(e)=>{
                        
                        if (user && e.key === 'Enter'){
                            setFirstPage(false)
                        }

                    }}
                    ref={inputRef}
                    
                />
            </div>
            <button className='w-full h-1/2 flex justify-end items-end p-4' onClick={()=>{
                if (user){
                    setFirstPage(false)
                }
            }}>
                <RiArrowRightLine
                size={72}
                    className='text-cyan-800 text-[70px]'
                />
            </button>
        </div>
    </div>
  )
  :
  (
    <div className='h-screen w-screen'>
        <Chat fn = {setFirstPage} currentUser={user}/>
    </div>
  )
}  

export default Home