import React, { useState } from 'react'
const Navbar = ({isAuthPage}) => {
    const [menuOpen,setMenuOpen] = useState(false)
    return (
        <div className='fixed top-0 left-0 right-0 z-50 bg-white text-black flex items-cente py-2   '>
            <div className='cursor-pointer px-5'>
                <a  href="/" className='font-bold text-lg '>LLMbeing</a>
            </div>
            
          {!isAuthPage &&
            <div className='flex  justify-between items-center w-[100%]  text-xs'>
            <div className='flex gap-3 items-center'>
                    <a href="">Find talent</a>
                    <a href="">Find Work</a>
                    <a href="">Why LLMbeing</a>
                    <a href="">What's new</a>
                    <a href="">Enterprise</a>
                    <a href="">Pricing</a>
            </div>
            <div className='px-5 flex gap-5 justify-center items-center'>
                <a href='/login' className='cursor-pointer'>
                    Log in
                </a>

                <a href='/signup' className='cursor-pointer px-5 bg-green-600 hover:bg-green-500 rounded-md py-2'>
                    Sign up
                </a>
            </div>
        </div>}

        </div>
    )
}

export default Navbar