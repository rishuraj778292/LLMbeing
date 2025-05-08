// import React from 'react'

// const Hero = () => {
//     return (
//         <section id="hero" className=" h-screen relative overflow-hidden rounded-2xl">

//             <div className="relative z-10 text-center text-black p-8">
//                 <p className='text-6xl font-bold mb-4 mt-30'>Build the Future with AI  </p>
//                 <p className='text-6xl  font-bold py-5'>Hire or Work on Cutting-Edge AI Projects</p>
//                 <p className='text-2xl mt-20'>AI Agents, Automation, LLM Apps, and More – Trusted by Innovators and AI Freelancers Worldwide.</p>
//                 <div className='flex flex-col md:flex-row lg:flex-row justify-center gap-10 mt-20'>
//                     <button className='border-1 text-white bg-black text-sm rounded-xl px-10 py-4  cursor-pointer hover:bg-white hover:text-black   '>Post a Project</button>
//                     <button className='border-1 text-white bg-black text-sm rounded-xl px-10 py-4  cursor-pointer hover:bg-white hover:text-black   '>Find AI work</button>
//                 </div>
//             </div>
//         </section>
//     )
// }

// export default Hero
import React from 'react'
import { motion } from 'framer-motion'


const Hero = () => {
    return (
        <section id="hero" className="h-screen relative overflow-hidden  bg-white text-black">
            {/* Top-left animated SVG */}
            <svg
                className="absolute top-0 left-0 w-1/2 h-1/2 z-0 opacity-10"
                viewBox="0 0 400 300"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <defs>
                    <linearGradient id="topLines" x1="0" y1="0" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#000000" />
                        <stop offset="100%" stopColor="#666666" />
                    </linearGradient>
                </defs>
                <path 
                    d="M0,50 C100,150 200,-50 400,100" 
                    stroke="url(#topLines)" 
                    strokeWidth="1.5" 
                    fill="none" 
                    className="draw-on-load hover:animate-thread"
                />
                <path 
                    d="M0,100 C120,180 250,0 400,150" 
                    stroke="url(#topLines)" 
                    strokeWidth="1" 
                    fill="none" 
                    className="draw-on-load hover:animate-thread"
                />
            </svg>

            {/* Bottom-right animated SVG */}
            <svg
                className="absolute bottom-0 right-0 w-2/3 h-1/2 z-0 opacity-10"
                viewBox="0 0 600 400"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <defs>
                    <linearGradient id="bottomLines" x1="0" y1="0" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#000000" />
                        <stop offset="100%" stopColor="#666666" />
                    </linearGradient>
                </defs>
                <path 
                    d="M0,300 C150,350 450,200 600,300" 
                    stroke="url(#bottomLines)" 
                    strokeWidth="1.5" 
                    fill="none"
                    className="draw-on-load hover:animate-thread"
                />
                <path 
                    d="M0,350 C200,400 400,250 600,350" 
                    stroke="url(#bottomLines)" 
                    strokeWidth="1" 
                    fill="none"
                    className="draw-on-load hover:animate-thread"
                />
            </svg>

            {/* Hero content with Framer Motion animations */}
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                className="relative z-10 flex flex-col items-center justify-center text-center h-full px-6 md:px-16"
            >
                <motion.p
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                    className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 mt-15 md:mt-25"
                >
                    Build the Future with AI
                </motion.p>
                <motion.p
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                    className="text-3xl sm:text-4xl md:text-6xl font-bold py-4"
                >
                    Hire or Work on Cutting-Edge AI Projects
                </motion.p>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.8 }}
                    className="text-lg sm:text-xl md:text-2xl mt-10 max-w-3xl"
                >
                    AI Agents, Automation, LLM Apps, and More – Trusted by Innovators and AI Freelancers Worldwide.
                </motion.p>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1, duration: 0.8 }}
                    className="flex flex-col sm:flex-row justify-center gap-6 mt-12"
                >
                    <button className="border border-black text-white bg-black text-sm rounded-xl px-8 py-3 hover:bg-white hover:text-black transition">
                        Post a Project
                    </button>
                    <button className="border border-black text-white bg-black text-sm rounded-xl px-8 py-3 hover:bg-white hover:text-black transition">
                        Find AI Work
                    </button>
                </motion.div>
            </motion.div>

            {/* Animation styles */}
            <style jsx>{`
                @keyframes draw {
                    from {
                        stroke-dashoffset: 800;
                    }
                    to {
                        stroke-dashoffset: 0;
                    }
                }

                .draw-on-load {
                    stroke-dasharray: 800;
                    stroke-dashoffset: 800;
                    animation: draw 2s ease-out forwards;
                }

                @keyframes threadMove {
                    0% {
                        transform: translateY(0);
                    }
                    100% {
                        transform: translateY(2px);
                    }
                }

                .animate-thread {
                    animation: threadMove 0.2s ease-in-out infinite alternate;
                }
            `}</style>
        </section>
    )
}

export default Hero

