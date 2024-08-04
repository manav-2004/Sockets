import React, { useEffect, useState } from 'react'
import Home from './Home'
import { Outlet } from 'react-router-dom'


function App() {

  return (
    <div className='w-scren h-screen'>
      <Outlet/>
    </div>
  )
}

export default App