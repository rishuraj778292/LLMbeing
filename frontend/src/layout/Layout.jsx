
import Footer from "../components/Footer"
import Navbar from "../components/Navbar"
import { Outlet } from 'react-router-dom'

const Layout = () => {
    
    return (
        <div>
            <Navbar  />
            <main className='pt-13' >
                {/* Content goes here */}
                <Outlet />  {/* This will render the child routes */}
            </main>
            <Footer />
        </div>
    )
}

export default Layout