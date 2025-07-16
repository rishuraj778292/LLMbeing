
import Footer from "../components/Footer"
import Navbar from "../components/Navbar"
import { Outlet, Navigate } from 'react-router-dom'
import { useSelector } from "react-redux"

const PublicLayout = () => {
    const { isAuthenticated, status, user } = useSelector((state) => state.auth)

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

    if (status === "loading") return <div>Loading...</div>
    return (
        <div>
            <Navbar />
            <main >
                {/* Content goes here */}
                <Outlet />  {/* This will render the child routes */}
            </main>
            <Footer />
        </div>
    )
}

export default PublicLayout