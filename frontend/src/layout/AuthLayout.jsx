import React from 'react'
import Navbar from '../components/Navbar'
import { Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'

const AuthLayout = () => {
   const { isAuthenticated } = useSelector((state) => state.auth)

   // Redirect to dashboard when authenticated
   if (isAuthenticated) {
      return <Navigate to="/dashboard" />
   }

   const isAuthPage = true;
   return (
      <div>
         <Navbar isAuthPage={isAuthPage} />
         <main >
            <Outlet />
         </main>
      </div>
   )
}

export default AuthLayout