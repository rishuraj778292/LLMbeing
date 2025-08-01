
import Footer from "../components/Footer"
import Navbar from "../components/Navbar"
import { Outlet } from 'react-router-dom'
import { useSelector } from "react-redux"

const PublicLayout = () => {
    const { status } = useSelector((state) => state.auth)

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