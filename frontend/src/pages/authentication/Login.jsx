/* eslint-disable no-unused-vars */
// import React from 'react'
// import { assets } from '../assets/assets'

// const Login = () => {
//     return (
//         <div className='min-h-screen bg-gray-50'>
//             {/* Navbar */}
//             <div className='fixed top-0 left-0 right-0 z-50  text-black flex items-center justify-between px-4 sm:px-8 py-4 '>
//                 <a href='/' className='font-bold text-xl sm:text-2xl'>LLMbeing</a>
//             </div>

//             {/* Login Form Container */}
//             <div className='flex justify-center items-center pt-24 pb-12 px-4 sm:px-6 lg:px-8 text-black'>
//                 <div className='w-full max-w-md border border-gray-300 rounded-md px-6 py-10 sm:px-10 bg-white shadow-md'>
//                     <form className='flex flex-col gap-8'>
//                         <div className='text-center'>
//                             <p className='text-2xl font-bold'>Log in to LLMbeing</p>
//                         </div>

//                         <div className='flex flex-col gap-5'>

//                             <div className='flex gap-3 items-center border px-4 py-2 rounded-md'>
//                                 <img src={assets.login_icon} alt="" className='h-5 w-5' />
//                                 <input
//                                     type="text"
//                                     placeholder='Username or email'
//                                     id='username'
//                                     className='flex-1 border-none outline-none bg-transparent text-base'
//                                 />
//                             </div>

//                             <div className='flex gap-3 items-center border px-4 py-2 rounded-md'>
//                                 <img src={assets.password_icon} alt="" className='h-5 w-5' />
//                                 <input
//                                     type="password"
//                                     id='password'
//                                     placeholder='Password'
//                                     className='flex-1 border-none outline-none bg-transparent text-base'
//                                 />
//                             </div>

//                             <div className='flex justify-between items-center text-sm flex-wrap gap-2'>
//                                 <div className='flex items-center gap-2'>
//                                     <input type="checkbox" id='remember' className='cursor-pointer' />
//                                     <label htmlFor="remember">Remember me</label>
//                                 </div>
//                                 <a href="#" className='text-blue-500 hover:underline'>Forgot Password?</a>
//                             </div>

//                             <button className='bg-blue-500 text-white rounded-md py-2 hover:bg-blue-400 transition'>
//                                 Continue
//                             </button>

//                             <div className='text-center text-sm text-gray-500'>
//                                 <p>OR</p>
//                             </div>

//                             <div className='bg-green-500 text-white py-2 rounded-md hover:bg-green-400 flex items-center justify-center gap-2 transition'>
//                                 <img src={assets.google_icon} alt="" className='h-5 w-5' />
//                                 <button type="button">Continue with Google</button>
//                             </div>

//                             <div className='border py-2 rounded-md flex items-center justify-center gap-2'>
//                                 <img src={assets.apple_icon} alt="" className='h-5 w-5' />
//                                 <button type="button">Continue with Apple</button>
//                             </div>

//                             <div className='text-center text-sm pt-4'>
//                                 <p>Don't have an account?</p>
//                                 <a href='/signup' className='text-blue-500 hover:underline'>Sign up</a>
//                             </div>
//                         </div>
//                     </form>
//                 </div>
//             </div>

//             {/* Footer */}
//             <div className='w-full text-center py-4 text-xs text-gray-500'>
//                 <p>© 2025 LLMbeing. All rights reserved.</p>
//             </div>
//         </div>
//     )
// }

// export default Login

import { motion } from 'framer-motion';
import { assets } from '../../assets/assets';

const fadeInUp = {
  initial: { y: 40, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  transition: { delay: 0.2, duration: 0.5 }
};

const Login = () => {


  return (
    <div className='min-h-screen bg-gray-50 flex flex-col'>
     

      {/* Centered Login Box */}
      <div className='flex-1 flex justify-center items-center mt-[64px] px-4'>
        <motion.div
          className='w-full max-w-md border border-gray-300 rounded-md px-6 py-10 sm:px-10 bg-white shadow-md'
          {...fadeInUp}
        >
          <motion.form className='flex flex-col gap-8' {...fadeInUp}>
            <div className='text-center'>
              <p className='text-2xl font-bold'>Log in to LLMbeing</p>
            </div>

            <div className='flex flex-col gap-5'>

              {/* Username */}
              <motion.div className='flex gap-3 items-center border px-4 py-2 rounded-md' {...fadeInUp}>
                <img src={assets.login_icon} alt="login" className='h-5 w-5' />
                <input
                  type="text"
                  placeholder='Username or email'
                  id='username'
                  className='flex-1 border-none outline-none bg-transparent text-base'
                />
              </motion.div>

              {/* Password */}
              <motion.div className='flex gap-3 items-center border px-4 py-2 rounded-md'  {...fadeInUp}>
                <img src={assets.password_icon} alt="password" className='h-5 w-5' />
                <input
                  type="password"
                  id='password'
                  placeholder='Password'
                  className='flex-1 border-none outline-none bg-transparent text-base'
                />
              </motion.div>

              {/* Remember / Forgot */}
              <motion.div className='flex justify-between items-center text-sm flex-wrap gap-2' {...fadeInUp}>
                <div className='flex items-center gap-2'>
                  <input type="checkbox" id='remember' className='cursor-pointer' />
                  <label htmlFor="remember">Remember me</label>
                </div>
                <a href="/forgotpassword" className='text-blue-500 hover:underline'>Forgot Password?</a>
              </motion.div>

              {/* Continue Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                {...fadeInUp}
                className='bg-blue-500 text-white rounded-md py-2 hover:bg-blue-600 w-full'
              >
                Continue
              </motion.button>

              <motion.div className='text-center text-sm text-gray-500' {...fadeInUp}>
                <p>OR</p>
              </motion.div>

              {/* Google */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                {...fadeInUp}
                className='bg-green-500 text-white py-2 rounded-md hover:bg-green-600 flex items-center justify-center gap-2 w-full'
              >
                <img src={assets.google_icon} alt="google" className='h-5 w-5' />
                <button type="button">Continue with Google</button>
              </motion.div>

              {/* Apple */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                {...fadeInUp}
                className='border py-2 rounded-md flex items-center justify-center gap-2 w-full'
              >
                <img src={assets.apple_icon} alt="apple" className='h-5 w-5' />
                <button type="button">Continue with Apple</button>
              </motion.div>

              {/* Sign up */}
              <motion.div className='text-center text-sm pt-4'  {...fadeInUp}>
                <p >Don't have an account?</p>
                <a href='/signup' className='text-blue-500 hover:underline'>Sign up</a>
              </motion.div>
            </div>
          </motion.form>
        </motion.div>
      </div>

      {/* Footer */}
      <motion.div
        className='w-full text-center py-4 text-xs text-gray-500'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <p>© 2025 LLMbeing. All rights reserved.</p>
      </motion.div>
    </div>
  );
};

export default Login;
