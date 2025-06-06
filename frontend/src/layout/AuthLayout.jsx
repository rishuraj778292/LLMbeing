import React from 'react'
import Navbar from '../components/Navbar'
import { Navigate,Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'

const AuthLayout = () => {
    const {isAuthenticated,loading} = useSelector((state)=>state.auth)
    
    if(isAuthenticated) return <Navigate to="/dashboard"/>
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