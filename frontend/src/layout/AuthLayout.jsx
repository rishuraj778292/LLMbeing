import React from 'react'
import Navbar from '../components/Navbar'
import { Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'

const AuthLayout = () => {
   const { isAuthenticated, user } = useSelector((state) => state.auth)

   // Redirect based on user role when authenticated
   if (isAuthenticated) {
      if (user?.role === 'client') {
         return <Navigate to="/post-project" />
      } else if (user?.role === 'freelancer') {
         return <Navigate to="/projects" />
      } else {
         return <Navigate to="/projects" />
      }
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