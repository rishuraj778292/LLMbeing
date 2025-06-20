
// import { useState, useEffect } from 'react'
// import { motion, AnimatePresence } from 'framer-motion'
// import { assets } from '../../assets/assets'
// import { useForm } from "react-hook-form"
// import { useSelector, useDispatch } from 'react-redux'
// import { signup } from '../../../Redux/Slice/authSlice'
// const Signup = () => {
//   const [userType, setUserType] = useState("freelancer")
//   const [isSuccessfull, setIsSuccessful] = useState(false);
//   const { signupError, signupStatus } = useSelector(state => state.auth);
//   const dispatch = useDispatch();
//   useEffect(() => {
//     if (isSuccessfull) {
//       document.body.style.overflow = 'hidden';
//     } else {
//       document.body.style.overflow = '';
//     }
//     return () => {
//       document.body.style.overflow = '';
//     }
//   }, [isSuccessfull])

//   const {
//     register,
//     handleSubmit,
//     watch,
//     formState: { errors },
//   } = useForm()

//   const accountType = watch("accountType")
//   const password = watch("password")

//   const dataFilter = (data) => {
//     if (userType === "client") {
//       if (accountType === "individual") {
//         let temp = {
//           role: "client",
//           email: data.email,
//           password: data.password,
//           userName: data.userName,
//           fullName: data.firstName + " " + data.lastName,
//           country: data.country,
//           accountType: data.accountType,
//         }
//         return temp;
//       }
//       if (accountType === "company") {
//         let temp = {
//           role: "client",
//           email: data.email,
//           password: data.password,
//           userName: data.userName,
//           fullName: data.firstName + data.lastName,
//           country: data.country,
//           accountType: data.accountType,
//           companyName: data.companyName,
//           companyCategory: data.companyCategory,
//         }
//         return temp;
//       }
//     } else if (userType === "freelancer") {
//       let temp = {
//         role: "freelancer",
//         email: data.email,
//         password: data.password,
//         userName: data.userName,
//         fullName: data.firstName + data.lastName,
//         country: data.country,
//         skills: data.skills.split(',').map(skill => skill.trim()),
//         bio: data.bio,
//       }
//       return temp;
//     }
//   }

//   useEffect(() => {
//     if (signupStatus === "succeeded") {
//       setIsSuccessful(true);
//     }
//   }, [signupStatus, signupError])

//   const onSubmit = async (data) => {
//     try {
//       const filteredData = dataFilter(data);
//       console.log(filteredData)
//       // const response = await axiosInstance.post("/api/v1/user/register", filteredData)
//       // console.log(response)
//       //setIsSuccessful(true);
//       dispatch(signup(filteredData));
//     }
//     catch (signupError) {
//       console.log(signupError)
//       alert("An error occured while registering . Please try again")
//     }
//   }

//   return (
//     <div className='bg-gray-50 min-h-screen relative'>
//       <AnimatePresence>
//         {isSuccessfull && (
//           <motion.div
//             className='fixed inset-0 z-50 min-h-screen flex justify-center items-center bg-black/50 backdrop-blur-sm'
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             transition={{ duration: 0.3 }}
//           >
//             <motion.div
//               className='p-10 bg-white border rounded-lg shadow-lg flex flex-col gap-6 items-center text-center max-w-md w-full'
//               initial={{ opacity: 0, scale: 0.8 }}
//               animate={{ opacity: 1, scale: 1 }}
//               transition={{ duration: 0.3, ease: "easeOut" }}
//             >
//               <img
//                 src={assets.success_icon}
//                 alt="Success"
//                 className='h-16 w-16'
//               />
//               <h2 className='text-2xl font-bold text-gray-800'>Registration Successful!</h2>
//               <p className='text-gray-600'>
//                 Your account has been created successfully. You can now log in to access your account.
//               </p>
//               <a
//                 href="/login"
//                 className='px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-all'
//               >
//                 Go to Login
//               </a>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       <div className='flex flex-col justify-center items-center gap-5 mt-[64px] pb-10 px-4'>
//         <motion.div
//           initial={{ opacity: 0, y: 40 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.2, duration: 0.5 }}
//           className='font-bold text-2xl'
//         >
//           Create an account
//         </motion.div>

//         <motion.form
//           className='flex flex-col w-full max-w-2xl p-5 px-10 gap-4 bg-white border border-gray-300 shadow-lg rounded-lg'
//           initial={{ opacity: 0, y: 50 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6 }}
//           onSubmit={handleSubmit(onSubmit)}
//         >


//           {/* User Type Toggle */}
//           <div className='flex gap-4 justify-center items-center'>
//             <button
//               type="button"
//               onClick={() => setUserType("freelancer")}
//               className={`px-5 py-2 rounded-full w-[50%] transition-all duration-300 ${userType === "freelancer" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
//             >
//               Freelancer
//             </button>

//             <button
//               type="button"
//               onClick={() => setUserType("client")}
//               className={`px-5 py-2 rounded-full w-[50%] transition-all duration-300 ${userType === "client" ? "bg-green-500 text-white" : "bg-gray-200"}`}
//             >
//               Client
//             </button>
//           </div>

//           {/* Basic Fields */}
//           <motion.div
//             initial={{ opacity: 0, y: 40 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.2, duration: 0.5 }}
//             className="flex flex-col gap-2"
//           >
//             <label className='text-sm font-medium'>Email</label>
//             <input
//               type='email'
//               {...register("email", {
//                 required: "Email is required",
//                 pattern: {
//                   value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
//                   message: "Invalid email address"
//                 }
//               })}
//               className='border p-2 rounded-md'
//             />
//             {errors.email && <p className='text-red-500 text-sm'>{errors.email.message}</p>}

//             <label className='text-sm font-medium'>Password</label>
//             <input
//               type='password'
//               placeholder='Password (6 or more characters)'
//               {...register("password", {
//                 required: "Password is required",
//                 minLength: {
//                   value: 6,
//                   message: "Password must be at least 6 characters long"
//                 },
//                 validate: {
//                   hasUpperCase: value =>
//                     /[A-Z]/.test(value) || "Password must contain at least one uppercase letter",
//                   hasLowerCase: value =>
//                     /[a-z]/.test(value) || "Password must contain at least one lowercase letter",
//                   hasNumber: value =>
//                     /[0-9]/.test(value) || "Password must contain at least one number",
//                   hasSpecialChar: value =>
//                     /[@$!%*?&]/.test(value) || "Password must contain at least one special character (@$!%*?&)"
//                 }
//               })}
//               className='border p-2 rounded-md'
//             />
//             {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}

//             <label className='text-sm font-medium'>Confirm Password</label>
//             <input
//               type='password'
//               placeholder='Re-enter your password'
//               {...register("confirmPassword", {
//                 required: "Confirm Password is required",
//                 validate: value => value === password || "Passwords do not match"
//               })}
//               className='border p-2 rounded-md'
//             />
//             {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>}

//             <label className='text-sm font-medium'>Username (unique)</label>
//             <input
//               type='text'
//               {...register("userName", { required: "Username is required" })}
//               className='border p-2 rounded-md'
//             />
//             {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}

//             <div className="flex gap-2">
//               <div className="w-1/2">
//                 <label className='text-sm font-medium'>First Name</label>
//                 <input
//                   type='text'
//                   {...register("firstName", {
//                     required: "First name is required",
//                     pattern: { value: /^[A-Za-z]+$/, message: "Only letters allowed" }
//                   })}
//                   className='border p-2 rounded-md w-full'
//                 />
//                 {errors.firstName && <p className='text-red-500 text-sm'>{errors.firstName.message}</p>}
//               </div>
//               <div className="w-1/2">
//                 <label className='text-sm font-medium'>Last Name</label>
//                 <input
//                   type='text'
//                   {...register("lastName")}
//                   className='border p-2 rounded-md w-full'
//                 />
//               </div>
//             </div>

//             <label className='text-sm font-medium'>Country</label>
//             <input
//               type='text'
//               {...register("country")}
//               className='border p-2 rounded-md'
//             />
//           </motion.div>

//           {/* Conditional Section */}
//           <AnimatePresence mode="wait">
//             {userType === "freelancer" && (
//               <motion.div
//                 key="freelancer"
//                 initial={{ opacity: 0, y: 40 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: -40 }}
//                 transition={{ duration: 0.4 }}
//                 className="flex flex-col gap-2"
//               >
//                 <label className='text-sm font-medium'>Skills <span className='text-xs'>(comma separated)</span></label>
//                 <input
//                   type='text'
//                   {...register("skills")}
//                   className='border p-2 rounded-md'
//                 />

//                 <label className='text-sm font-medium'>Short Bio / Description</label>
//                 <textarea
//                   {...register("bio", { maxLength: { value: 100, message: "Bio must be under 100 characters" } })}
//                   className='border p-2 rounded-md'
//                 />
//                 {errors.bio && <p className='text-red-500 text-sm'>{errors.bio.message}</p>}
//               </motion.div>
//             )}

//             {userType === "client" && (
//               <motion.div
//                 key="client"
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: -20 }}
//                 transition={{ duration: 0.4 }}
//                 className="flex flex-col gap-2"
//               >
//                 <label className='text-sm font-medium'>Account Type</label>
//                 <select
//                   {...register("accountType")}
//                   className='border p-2 rounded-md'
//                 >
//                   <option value='individual'>Individual</option>
//                   <option value='company'>Company</option>
//                 </select>

//                 {accountType === "company" && (
//                   <>
//                     <label className='text-sm font-medium'>Company Name</label>
//                     <input
//                       type='text'
//                       {...register("companyName", { required: "Company name is required" })}
//                       className='border p-2 rounded-md'
//                     />
//                     {errors.companyName && <p className="text-red-500 text-sm">{errors.companyName.message}</p>}

//                     <label className='text-sm font-medium'>Company Category / Industry</label>
//                     <input
//                       type='text'
//                       {...register("companyCategory")}
//                       className='border p-2 rounded-md'
//                     />
//                   </>
//                 )}
//               </motion.div>
//             )}
//           </AnimatePresence>

//           {/* Submit Button */}
//           <motion.button
//             type="submit"
//             className='bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-all'
//             whileTap={{ scale: 0.95 }}
//           >
//             Sign Up
//           </motion.button>

//           <div className='text-center'><p>OR</p></div>

//           {/* Social Signup Buttons */}
//           <motion.div
//             className='flex justify-center items-center gap-2 py-2 rounded-md bg-green-500 hover:bg-green-600 cursor-pointer'
//             whileHover={{ scale: 1.02 }}
//             whileTap={{ scale: 0.98 }}
//             transition={{ type: 'spring', stiffness: 300, damping: 20 }}
//           >
//             <img src={assets.google_icon} alt="google" className='h-5 w-5' />
//             <button type='button' className='cursor-pointer'>Sign up with Google</button>
//           </motion.div>

//           <motion.div
//             className='flex justify-center items-center gap-2 py-2 rounded-md border cursor-pointer'
//             whileHover={{ scale: 1.02 }}
//             whileTap={{ scale: 0.98 }}
//             transition={{ type: 'spring', stiffness: 300, damping: 20 }}
//           >
//             <img src={assets.apple_icon} alt="apple" className='h-5 w-5' />
//             <button type='button' className='cursor-pointer'>Sign up with Apple</button>
//           </motion.div>

//           <div className='flex justify-center items-center gap-2'>
//             <p>Already have an account?</p>
//             <a href="/login" className='text-blue-500'>Login</a>
//           </div>

//         </motion.form>
//       </div>
//     </div>
//   )
// }

// export default Signup

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from 'react-redux';
import { signup } from '../../../Redux/Slice/authSlice';

const Signup = () => {
  const [userType, setUserType] = useState("freelancer");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    text: "None",
    color: "bg-gray-300"
  });
  const [isSuccessful, setIsSuccessful] = useState(false);
  const { signupError, signupStatus } = useSelector(state => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (isSuccessful) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    }
  }, [isSuccessful]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const accountType = watch("accountType");
  const password = watch("password", "");

  // Check password strength
  useEffect(() => {
    if (!password) {
      setPasswordStrength({ score: 0, text: "None", color: "bg-gray-300" });
      return;
    }

    let strength = 0;

    if (password.length >= 6) strength += 20;
    if (password.length >= 10) strength += 20;
    if (/[A-Z]/.test(password)) strength += 20;
    if (/[0-9]/.test(password)) strength += 20;
    if (/[^A-Za-z0-9]/.test(password)) strength += 20;

    let text, color;
    if (strength <= 20) {
      text = "Very Weak";
      color = "bg-red-500";
    } else if (strength <= 40) {
      text = "Weak";
      color = "bg-orange-500";
    } else if (strength <= 60) {
      text = "Fair";
      color = "bg-yellow-500";
    } else if (strength <= 80) {
      text = "Good";
      color = "bg-blue-500";
    } else {
      text = "Strong";
      color = "bg-green-500";
    }

    setPasswordStrength({ score: strength, text, color });
  }, [password]);

  const dataFilter = (data) => {
    if (userType === "client") {
      if (accountType === "individual") {
        let temp = {
          role: "client",
          email: data.email,
          password: data.password,
          userName: data.userName,
          fullName: data.fullName,
          country: data.country,
          accountType: data.accountType,
        }
        return temp;
      }
      if (accountType === "company") {
        let temp = {
          role: "client",
          email: data.email,
          password: data.password,
          userName: data.userName,
          fullName: data.fullName,
          country: data.country,
          accountType: data.accountType,
          companyName: data.companyName,
          companyCategory: data.companyCategory,
        }
        return temp;
      }
    } else if (userType === "freelancer") {
      let temp = {
        role: "freelancer",
        email: data.email,
        password: data.password,
        userName: data.userName,
        fullName: data.fullName,
        country: data.country,
        skills: data.skills ? data.skills.split(',').map(skill => skill.trim()) : [],
        bio: data.bio,
      }
      return temp;
    }
  }

  useEffect(() => {
    if (signupStatus === "succeeded") {
      setIsSuccessful(true);
    }
  }, [signupStatus, signupError]);

  const onSubmit = async (data) => {
    try {
      const filteredData = dataFilter(data);
      console.log(filteredData);
      dispatch(signup(filteredData));
    }
    catch (signupError) {
      console.log(signupError);
      alert("An error occurred while registering. Please try again");
    }
  };

  const togglePassword = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50 font-sans ">
      {/* Success Modal */}
      <AnimatePresence>
        {isSuccessful && (
          <motion.div
            className="fixed inset-0 z-50 min-h-screen flex justify-center items-center bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="p-10 bg-white border rounded-lg shadow-lg flex flex-col gap-6 items-center text-center max-w-md w-full"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h2 className="text-2xl font-bold text-gray-800">Registration Successful!</h2>
              <p className="text-gray-600">
                Your account has been created successfully. You can now log in to access your account.
              </p>
              <a
                href="/login"
                className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-all"
              >
                Go to Login
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Left side - Image and intro text */}
      <div className="md:w-5/12 h-screen bg-indigo-900 bg-gradient-to-br from-indigo-800 to-indigo-900 text-white flex flex-col justify-center p-8 md:pt-20">
        <div className="max-w-md mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Join  LLMbeing</h1>
          <p className="text-lg mb-8 text-indigo-100">Connect with clients, showcase your skills, and grow your freelance career - all without needing to upload a resume.</p>

          <div className="mb-12">
            <div className="flex items-center mb-4">
              <div className="bg-indigo-100 rounded-full p-2 mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-indigo-100">Connect with quality clients</span>
            </div>
            <div className="flex items-center mb-4">
              <div className="bg-indigo-100 rounded-full p-2 mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-indigo-100">Showcase your skills and experience</span>
            </div>
            <div className="flex items-center mb-4">
              <div className="bg-indigo-100 rounded-full p-2 mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-indigo-100">Get paid securely for your work</span>
            </div>
            <div className="flex items-center">
              <div className="bg-indigo-100 rounded-full p-2 mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-indigo-100">No platform charges</span>
            </div>
          </div>

          <div className="text-sm text-indigo-200">
            Already have an account?{" "}
            <a href="/login" className="text-white font-medium hover:text-indigo-100">Log in</a>
          </div>
        </div>
      </div>

      {/* Right side - Sign up form */}
      <div className="md:w-7/12 bg-white p-8 md:pt-160 flex items-center  overflow-y-auto  md:h-screen ">
        <div className="w-full max-w-lg mx-auto">
          <div className="text-center md:text-left mb-8">
            <h2 className="text-2xl font-bold text-gray-800">Create your account</h2>
            <p className="text-gray-600 mt-1">We just need a few details to get started</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Account type selection */}
            <div className="grid grid-cols-2 gap-4 mb-2">
              <div>
                <input
                  type="radio"
                  id="freelancer"
                  value="freelancer"
                  className="hidden peer"
                  checked={userType === "freelancer"}
                  onChange={() => setUserType("freelancer")}
                />
                <label
                  htmlFor="freelancer"
                  className={`block cursor-pointer text-center p-4 border rounded-lg hover:border-indigo-300 
                  ${userType === "freelancer" ? "border-indigo-500 text-indigo-600 bg-indigo-50" : "border-gray-200"}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="block font-medium">Freelancer</span>
                  <span className="text-sm text-gray-500">Find work and clients</span>
                </label>
              </div>
              <div>
                <input
                  type="radio"
                  id="client"
                  value="client"
                  className="hidden peer"
                  checked={userType === "client"}
                  onChange={() => setUserType("client")}
                />
                <label
                  htmlFor="client"
                  className={`block cursor-pointer text-center p-4 border rounded-lg hover:border-indigo-300 
                  ${userType === "client" ? "border-indigo-500 text-indigo-600 bg-indigo-50" : "border-gray-200"}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <span className="block font-medium">Client</span>
                  <span className="text-sm text-gray-500">Hire skilled freelancers</span>
                </label>
              </div>
            </div>

            {/* Basic info */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                id="fullName"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none"
                {...register("fullName", { required: "Full name is required" })}
              />
              {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>}
            </div>

            <div>
              <label htmlFor="userName" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <input
                type="text"
                id="userName"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none"
                {...register("userName", { required: "Username is required" })}
              />
              {errors.userName && <p className="text-red-500 text-sm mt-1">{errors.userName.message}</p>}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
              <input
                type="email"
                id="email"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: "Invalid email address"
                  }
                })}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <input
                  type={passwordVisible ? "text" : "password"}
                  id="password"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters long"
                    }
                  })}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                  onClick={togglePassword}
                >
                  {passwordVisible ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                      <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}

              <div className="mt-1.5">
                <div className="flex justify-between mb-1">
                  <span className="text-xs text-gray-500">Password strength:</span>
                  <span className={`text-xs font-medium ${passwordStrength.text === "Strong" ? "text-green-500" :
                    passwordStrength.text === "Good" ? "text-blue-500" :
                      passwordStrength.text === "Fair" ? "text-yellow-500" :
                        passwordStrength.text === "Weak" ? "text-orange-500" :
                          passwordStrength.text === "Very Weak" ? "text-red-500" : "text-gray-500"
                    }`}>{passwordStrength.text}</span>
                </div>
                <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div className={`${passwordStrength.color}`} style={{ width: `${passwordStrength.score}%`, height: '100%', transition: 'width 0.3s ease' }}></div>
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none"
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: value => value === password || "Passwords do not match"
                })}
              />
              {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>}
            </div>

            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">Country</label>
              <input
                type="text"
                id="country"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none"
                {...register("country")}
              />
            </div>

            {/* Conditional fields based on role */}
            <AnimatePresence mode="wait">
              {userType === "freelancer" && (
                <motion.div
                  key="freelancer-fields"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <div>
                    <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-1">Skills <span className="text-xs text-gray-500">(comma separated)</span></label>
                    <input
                      type="text"
                      id="skills"
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none"
                      placeholder="e.g. Web Design, JavaScript, Marketing"
                      {...register("skills")}
                    />
                  </div>

                  <div>
                    <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">Short Bio / Description</label>
                    <textarea
                      id="bio"
                      rows="3"
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none"
                      placeholder="Brief description about yourself and your expertise"
                      {...register("bio", { maxLength: { value: 500, message: "Bio must be under 500 characters" } })}
                    />
                    {errors.bio && <p className="text-red-500 text-sm mt-1">{errors.bio.message}</p>}
                  </div>
                </motion.div>
              )}

              {userType === "client" && (
                <motion.div
                  key="client-fields"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Account Type</label>
                    <div className="flex space-x-4">
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="individual"
                          value="individual"
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                          {...register("accountType")}
                          defaultChecked
                        />
                        <label htmlFor="individual" className="ml-2 text-sm text-gray-700">Individual</label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="company"
                          value="company"
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                          {...register("accountType")}
                        />
                        <label htmlFor="company" className="ml-2 text-sm text-gray-700">Company</label>
                      </div>
                    </div>
                  </div>

                  {accountType === "company" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4"
                    >
                      <div>
                        <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                        <input
                          type="text"
                          id="companyName"
                          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none"
                          {...register("companyName", { required: accountType === "company" && "Company name is required" })}
                        />
                        {errors.companyName && <p className="text-red-500 text-sm mt-1">{errors.companyName.message}</p>}
                      </div>

                      <div>
                        <label htmlFor="companyCategory" className="block text-sm font-medium text-gray-700 mb-1">Company Category</label>
                        <select
                          id="companyCategory"
                          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none"
                          {...register("companyCategory")}
                        >
                          <option value="">Select category</option>
                          <option value="technology">Technology</option>
                          <option value="marketing">Marketing</option>
                          <option value="education">Education</option>
                          <option value="healthcare">Healthcare</option>
                          <option value="finance">Finance</option>
                          <option value="retail">Retail</option>
                          <option value="manufacturing">Manufacturing</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Terms and conditions */}
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  {...register("terms", { required: "You must agree to the terms and conditions" })}
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="terms" className="font-medium text-gray-700">
                  I agree to the{" "}
                  <a href="#" className="text-indigo-600 hover:text-indigo-500">Terms of Service</a> and{" "}
                  <a href="#" className="text-indigo-600 hover:text-indigo-500">Privacy Policy</a>
                </label>
                {errors.terms && <p className="text-red-500 text-sm mt-1">{errors.terms.message}</p>}
              </div>
            </div>

            {/* Signup button */}
            <div>
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-2.5 px-4 rounded-lg hover:bg-indigo-700 transition duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Create Account
              </button>
            </div>
          </form>

          {/* Social signup options */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">Or sign up with</span>
            </div>
          </div>

          <div >
            {/* Google Button */}
            <button
              type="button"
              className="w-full py-2.5 px-4 border rounded-lg text-gray-700 hover:bg-gray-50 flex justify-center items-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
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
            </button>

            {/* Add other social buttons (e.g., Facebook, GitHub) as needed */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;