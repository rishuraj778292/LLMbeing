// /* eslint-disable no-unused-vars */

// import { motion } from 'framer-motion';
// import { assets } from '../../assets/assets';
// import { useForm } from 'react-hook-form';
// import { useDispatch, useSelector } from 'react-redux';
// import { login } from '../../../Redux/Slice/authSlice';

// import { useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';



// const fadeInUp = {
//   initial: { y: 40, opacity: 0 },
//   animate: { y: 0, opacity: 1 },
//   transition: { delay: 0.2, duration: 0.5 }
// };

// const Login = () => {
//   const {
//     register,
//     handleSubmit,
//     setError,
//     formState: { errors },
//   } = useForm();

//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { user, status, error } = useSelector((state) => state.auth);

//   // Handle login results
//   useEffect(() => {
//     if (status === "succeeded") {
//       console.log("Updated user:", user);
//       // Role-based navigation would go here
//     }

//     if (status === "failed") {
//       if (error === "Invalid Password") {
//         setError("password", {
//           type: "manual",
//           message: "Invalid Password",
//         });
//       } else if (error === "User not found") {
//         setError("emailOrUserName", {
//           type: "manual",
//           message: "User not found",
//         });
//       } else {
//         console.error("Unexpected error:", error);
//       }
//     }
//   }, [status, user, error, navigate, setError]);



//   const onsubmit = async (data) => {
//     console.log("this is data", data)
//     dispatch(login(data));


//   }


//   return (
//     <div className='min-h-screen bg-gray-50 flex flex-col'>
//       {/* Centered Login Box */}
//       <div className='flex-1 flex justify-center items-center mt-[64px] px-4'>
//         <motion.div
//           className='w-full max-w-md border border-gray-300 rounded-md px-6 py-10 sm:px-10 bg-white shadow-md'
//           {...fadeInUp}
//         >
//           <motion.div className='flex flex-col gap-8' {...fadeInUp}>
//             <div className='text-center'>
//               <p className='text-2xl font-bold'>Log in to LLMbeing</p>
//             </div>

//             <div className='flex flex-col gap-5'>

//               <form onSubmit={handleSubmit(onsubmit)} className='flex flex-col gap-5'>
//                 {/* Username */}
//                 <motion.div className={`flex gap-3 items-center border px-4 py-2 rounded-md ${errors.emailOrUserName ? "border-red-500" : ""}`} {...fadeInUp}>
//                   <img src={assets.login_icon} alt="login" className='h-5 w-5' />
//                   <input
//                     type="text"
//                     placeholder='Username or email'
//                     id='username'
//                     className='flex-1 border-none outline-none bg-transparent text-base'
//                     {...register("emailOrUserName", { required: "Enter email or user name" })}
//                   />
//                 </motion.div>
//                 {errors.emailOrUserName && <p className='text-sm text-red-500'>{errors.emailOrUserName.message}</p>}

//                 {/* Password */}
//                 <motion.div className={`flex gap-3 items-center border px-4 py-2 rounded-md ${errors.password ? "border-red-500" : ""}`}  {...fadeInUp}>
//                   <img src={assets.password_icon} alt="password" className='h-5 w-5' />
//                   <input
//                     type="password"
//                     id='password'
//                     placeholder='Password'
//                     className='flex-1 border-none outline-none bg-transparent text-base'
//                     {...register("password", { required: "enter the password" })}
//                   />
//                 </motion.div>
//                 {errors.password && <p className='text-sm text-red-500'>{errors.password.message}</p>}

//                 {/* Remember / Forgot */}
//                 <motion.div className='flex justify-between items-center text-sm flex-wrap gap-2' {...fadeInUp}>
//                   <div className='flex items-center gap-2'>
//                     <input type="checkbox" id='remember' className='cursor-pointer'  {...register("remember")} />
//                     <label htmlFor="remember">Remember me</label>
//                   </div>
//                   <a href="/forgotpassword" className='text-blue-500 hover:underline'>Forgot Password?</a>
//                 </motion.div>

//                 {/* Continue Button */}
//                 <motion.button
//                   whileHover={{ scale: 1.02 }}
//                   whileTap={{ scale: 0.98 }}
//                   transition={{ type: 'spring', stiffness: 300, damping: 20 }}
//                   {...fadeInUp}
//                   className='bg-blue-500 text-white rounded-md py-2 hover:bg-blue-600 w-full'
//                   type='submit'
//                 >
//                   {status === "loading" ? "Logging in..." : "Continue"}
//                 </motion.button>
//               </form>

//               <motion.div className='text-center text-sm text-gray-500' {...fadeInUp}>
//                 <p>OR</p>
//               </motion.div>

//               {/* Google */}
//               <motion.div
//                 whileHover={{ scale: 1.02 }}
//                 whileTap={{ scale: 0.98 }}
//                 transition={{ type: 'spring', stiffness: 300, damping: 20 }}
//                 {...fadeInUp}
//                 className='bg-green-500 text-white py-2 rounded-md hover:bg-green-600 flex items-center justify-center gap-2 w-full'
//               >
//                 <img src={assets.google_icon} alt="google" className='h-5 w-5' />
//                 <button type="button">Continue with Google</button>
//               </motion.div>

//               {/* Apple */}
//               <motion.div
//                 whileHover={{ scale: 1.02 }}
//                 whileTap={{ scale: 0.98 }}
//                 transition={{ type: 'spring', stiffness: 300, damping: 20 }}
//                 {...fadeInUp}
//                 className='border py-2 rounded-md flex items-center justify-center gap-2 w-full'
//               >
//                 <img src={assets.apple_icon} alt="apple" className='h-5 w-5' />
//                 <button type="button">Continue with Apple</button>
//               </motion.div>

//               {/* Sign up */}
//               <motion.div className='text-center text-sm pt-4'  {...fadeInUp}>
//                 <p >Don't have an account?</p>
//                 <a href='/signup' className='text-blue-500 hover:underline'>Sign up</a>
//               </motion.div>
//             </div>
//           </motion.div>
//         </motion.div>
//       </div>

//       {/* Footer */}
//       <motion.div
//         className='w-full text-center py-4 text-xs text-gray-500'
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ duration: 1 }}
//       >
//         <p>© 2025 LLMbeing. All rights reserved.</p>
//       </motion.div>
//     </div>
//   );
// };

// export default Login;


/* eslint-disable no-unused-vars */

import { motion } from 'framer-motion';
import { assets } from '../../assets/assets';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../../Redux/Slice/authSlice';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const fadeInUp = {
  initial: { y: 40, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  transition: { delay: 0.2, duration: 0.5 }
};

const Login = () => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loginStatus, loginError, isAuthenticated } = useSelector((state) => state.auth);

  // Handle login results
  useEffect(() => {
    if (isAuthenticated) {
      console.log("Updated user:", user);
      // Redirect to dashboard for all authenticated users
      navigate('/dashboard');
    }

    if (loginStatus === "failed") {
      console.log(loginError)
      if (loginError === "Invalid Password") {
        setError("password", {
          type: "manual",
          message: "Invalid Password",
        });
      } else if (loginError === "User not found") {
        setError("emailOrUserName", {
          type: "manual",
          message: "User not found",
        });
      } else {
        console.error("Unexpected error:", loginError);
      }
    }
  }, [loginStatus, user, loginError, navigate, setError, isAuthenticated]);

  const onsubmit = async (data) => {
    console.log("this is data", data);
    dispatch(login(data));
  };

  return (
    <div className='min-h-screen min-w-screen md:px-10 md:flex md:items-center md:justify-center pt-20 md:pt-10' >
      <div className="h-full w-full flex flex-col md:flex-row bg-gray-50 font-sans border rounded-2xl mt-4 md:mt-0 mb-8">
        {/* Left side - Image and intro text */}
        <div className="md:w-5/12 bg-gradient-to-br from-blue-600 to-purple-700 text-white flex flex-col justify-center p-8 md:p-12 pt-8 md:pt-20 md:rounded-l-2xl">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-md mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Welcome back to LLMbeing</h1>
            <p className="text-lg mb-8 text-blue-100">Connect with your freelance community and manage your projects.</p>

            <div className="mb-12">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 rounded-full p-2 mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-blue-100">Access your projects and clients</span>
              </div>
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 rounded-full p-2 mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-blue-100">Track your earnings and growth</span>
              </div>
              <div className="flex items-center">
                <div className="bg-blue-100 rounded-full p-2 mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-blue-100">Connect with your network</span>
              </div>
            </div>

            <div className="text-sm text-blue-200">
              Don't have an account?{" "}
              <a href="/signup" className="text-white font-medium hover:text-blue-100 cursor-pointer">Sign up</a>
            </div>
          </motion.div>
        </div>

        {/* Right side - Login form */}
        <div className="md:w-7/12 bg-white p-8 md:p-12 flex items-center md:rounded-r-2xl">
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full max-w-md mx-auto"
          >
            <div className="text-center md:text-left mb-8">
              <h2 className="text-2xl font-bold text-gray-800">Log in to your account</h2>
              <p className="text-gray-600 mt-1">Welcome back! Please enter your details</p>
            </div>

            <form onSubmit={handleSubmit(onsubmit)} className="space-y-5">
              {/* Email/Username */}
              <div>
                <label htmlFor="emailOrUserName" className="block text-sm font-medium text-gray-700 mb-1">
                  Email or Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <img src={assets.login_icon} alt="login" className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="emailOrUserName"
                    className="w-full pl-10 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                    placeholder="Enter your email or username"
                    {...register("emailOrUserName", { required: "Email or username is required" })}
                  />
                </div>
                {errors.emailOrUserName && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="text-red-500 text-sm mt-1"
                  >
                    {errors.emailOrUserName.message}
                  </motion.p>
                )}
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <img src={assets.password_icon} alt="password" className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    id="password"
                    className="w-full pl-10 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                    placeholder="Enter your password"
                    {...register("password", { required: "Password is required" })}
                  />
                </div>
                {errors.password && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="text-red-500 text-sm mt-1"
                  >
                    {errors.password.message}
                  </motion.p>
                )}
              </div>

              {/* Remember me & Forgot password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                    {...register("remember")}
                  />
                  <label htmlFor="remember" className="ml-2 block text-sm text-gray-700 cursor-pointer">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <a href="/forgotpassword" className="font-medium text-blue-600 hover:text-blue-500 cursor-pointer">
                    Forgot password?
                  </a>
                </div>
              </div>

              {/* Login button */}
              <div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2.5 px-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
                >
                  {loginStatus === "loading" ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Logging in...
                    </span>
                  ) : (
                    "Log in"
                  )}
                </motion.button>
              </div>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            {/* Social login buttons */}
            <div>
              {/* Google Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                className="w-full py-2.5 px-4 border rounded-lg text-gray-700 hover:bg-gray-50 flex justify-center items-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 cursor-pointer"
              >
                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.85 0-5.26-1.92-6.12-4.51H2.18v2.83C3.99 20.55 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.88 14.12a7.05 7.05 0 010-4.24V7.05H2.18a11.96 11.96 0 000 9.9l3.7-2.83z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 4.5c1.61 0 3.05.55 4.18 1.63l3.12-3.12C17.45 1.01 14.97 0 12 0 7.7 0 3.99 2.45 2.18 6.05l3.7 2.83C6.74 6.42 9.15 4.5 12 4.5z"
                    fill="#EA4335"
                  />
                </svg>
                Google
              </motion.button>


            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Login;