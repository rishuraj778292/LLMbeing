import React from 'react'
import Navbar from '../components/Navbar'
import { Outlet } from 'react-router-dom'

const AuthLayout = () => {
    const isAuthPage = true;
  return (
       <div>
          <Navbar isAuthPage={isAuthPage}/>
      <main>
         <Outlet/>
      </main>
       </div>
  )
}

export default AuthLayout