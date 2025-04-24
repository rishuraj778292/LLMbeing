/* eslint-disable no-unused-vars */

import { motion } from 'framer-motion';
import { assets } from '../../assets/assets';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../../feature/auth/authSlice';
import axios from 'axios';
import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';

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
  const user = useSelector((state) => state.auth.user);

  // Log the updated user whenever it changes
  useEffect(() => {
    if (user) {
      console.log("Updated user:", user);
    }
  }, [user]);

  const setData = (response) => {
    if (response.data.success) {
      const userData = response.data.data.response;
      dispatch(login(userData)); // Update Redux state
    } else {
      console.log("Login failed", response.data);
    }
  };

  const onsubmit = async (data) => {
    try {
      const response = await axios.post("/api/v1/user/login", data);
      console.log("response ", response);
      setData(response);
      <Navigate to="/dashboard"/>
    } catch (error) {
      console.log("err", error);
      if (error.response?.data?.message === "Invalid Password") {
        setError("password", {
          type: "manual",
          message: "Invalid Password",
        });
      } else if (error.response?.data?.message === "User not found") {
        setError("emailOrUserName", {
          type: "manual",
          message: "User not found",
        });
      } else {
        console.error("Unexpected error:", error.response?.data || error.message);
      }
    }
  };

  return (
    <div className='min-h-screen bg-gray-50 flex flex-col'>
      {/* Centered Login Box */}
      <div className='flex-1 flex justify-center items-center mt-[64px] px-4'>
        <motion.div
          className='w-full max-w-md border border-gray-300 rounded-md px-6 py-10 sm:px-10 bg-white shadow-md'
          {...fadeInUp}
        >
          <motion.div className='flex flex-col gap-8' {...fadeInUp}>
            <div className='text-center'>
              <p className='text-2xl font-bold'>Log in to LLMbeing</p>
            </div>

            <div className='flex flex-col gap-5'>

              <form onSubmit={handleSubmit(onsubmit)} className='flex flex-col gap-5'>
                {/* Username */}
                <motion.div className={`flex gap-3 items-center border px-4 py-2 rounded-md ${errors.emailOrUserName ? "border-red-500" : ""}`} {...fadeInUp}>
                  <img src={assets.login_icon} alt="login" className='h-5 w-5' />
                  <input
                    type="text"
                    placeholder='Username or email'
                    id='username'
                    className='flex-1 border-none outline-none bg-transparent text-base'
                    {...register("emailOrUserName", { required: "Enter email or user name" })}
                  />
                </motion.div>
                {errors.emailOrUserName && <p className='text-sm text-red-500'>{errors.emailOrUserName.message}</p>}

                {/* Password */}
                <motion.div className={`flex gap-3 items-center border px-4 py-2 rounded-md ${errors.password ? "border-red-500" : ""}`}  {...fadeInUp}>
                  <img src={assets.password_icon} alt="password" className='h-5 w-5' />
                  <input
                    type="password"
                    id='password'
                    placeholder='Password'
                    className='flex-1 border-none outline-none bg-transparent text-base'
                    {...register("password", { required: "enter the password" })}
                  />
                </motion.div>
                {errors.password && <p className='text-sm text-red-500'>{errors.password.message}</p>}

                {/* Remember / Forgot */}
                <motion.div className='flex justify-between items-center text-sm flex-wrap gap-2' {...fadeInUp}>
                  <div className='flex items-center gap-2'>
                    <input type="checkbox" id='remember' className='cursor-pointer'  {...register("remember")} />
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
              </form>

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
          </motion.div>
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
