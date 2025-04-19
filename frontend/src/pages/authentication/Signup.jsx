/* eslint-disable no-unused-vars */

// import { useState } from 'react'

// const Signup = () => {
//   const [userType, setUserType] = useState("client")

//   return (
//     <div className='bg-gray-50 h-screen '>
//       {/* Navbar */}
//       <div
//         className='fixed top-0 left-0 right-0 z-50 bg-gray-50  text-black flex items-center justify-between px-4 sm:px-8 py-4 shadow-sm '
//       >
//         <a href='/' className='font-bold text-xl sm:text-2xl'>LLMbeing</a>


//       </div>


//       <div className='flex   justify-center items-center  z-40 h-[100%]'>

//         <div className='flex flex-col border rounded-md  w-[40%] p-2'>

//           {/*selection */}
//           <div className='flex gap-5 justify-center items-center'>
//             <button onClick={() => { setUserType("client") }}
//               className={userType === "client" ? 'bg-green-500 px-5 py-2 rounded-md w-[50%]' : 'w-[50%]'}

//             >Client</button>
//             <button onClick={() => { setUserType("freelancer") }}
//               className={userType === "freelancer" ? 'bg-green-500 px-5 py-2 rounded-md w-[50%]' : 'w-[50%]'}

//             >Freelancer</button>
//           </div>


//           {/*client signup*/}

//           <div>
//             {userType === "client" ?
//               <div>
//                 <h1>Client</h1>
//               </div>




//               : userType === 'freelancer' &&
//               <div >
//                 <h1>Freelancer</h1>
//               </div>
//             }

//           </div>

//         </div>

//       </div>

//     </div >
//   )
// }

// export default Signup

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { assets } from '../../assets/assets'

const Signup = () => {
  const [userType, setUserType] = useState("client")
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
    firstName: "",
    lastName: "",
    country: "",
    accountType: "individual",
    companyName: "",
    companyCategory: "",
    skills: [],
    bio: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSkillChange = (e) => {
    const skillsArray = e.target.value.split(",").map(skill => skill.trim());
    setFormData(prev => ({ ...prev, skills: skillsArray }));
  };

  return (
    <div className='bg-gray-50 min-h-screen'>
     

      {/* Main Section */}
      <div className='flex flex-col justify-center items-center gap-5 mt-[64px] pb-10 px-4 '>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}

          className='font-bold text-2xl'
        >Sign up as</motion.div>
        <motion.div
          className='flex flex-col w-full max-w-lg p-5 px-10 gap-4 bg-white border border-gray-300 shadow-lg rounded-lg'
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* User Type Toggle Buttons */}
          <div className='flex gap-4 justify-center items-center'>
            <button
              onClick={() => setUserType("client")}
              className={`px-5 py-2 rounded-full w-[50%] transition-all duration-300 ${userType === "client" ? "bg-green-500 text-white" : "bg-gray-200"}`}
            >
              Client
            </button>
            <button
              onClick={() => setUserType("freelancer")}
              className={`px-5 py-2 rounded-full w-[50%] transition-all duration-300 ${userType === "freelancer" ? "bg-green-500 text-white" : "bg-gray-200"}`}
            >
              Freelancer
            </button>
          </div>

          {/* Static Form Fields */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex flex-col gap-2"
          >
            <label className='text-sm font-medium'>Email</label>
            <input
              type='email'
              name='email'
              value={formData.email}
              onChange={handleChange}
              className='border p-2 rounded-md'
            />

            <label className='text-sm font-medium'>Password</label>
            <input
              type='password'
              name='password'
              value={formData.password}
              onChange={handleChange}
              className='border p-2 rounded-md'
              placeholder='Password (8 or more characters)'
            />

            <label className='text-sm font-medium'>Username (unique)</label>
            <input
              type='text'
              name='username'
              value={formData.username}
              onChange={handleChange}
              className='border p-2 rounded-md'
            />

            <div className="flex gap-2">
              <div className="w-1/2">
                <label className='text-sm font-medium'>First Name</label>
                <input
                  type='text'
                  name='firstName'
                  value={formData.firstName}
                  onChange={handleChange}
                  className='border p-2 rounded-md w-full'
                />
              </div>
              <div className="w-1/2">
                <label className='text-sm font-medium'>Last Name</label>
                <input
                  type='text'
                  name='lastName'
                  value={formData.lastName}
                  onChange={handleChange}
                  className='border p-2 rounded-md w-full'
                />
              </div>
            </div>

            <label className='text-sm font-medium'>Country</label>
            <input
              type='text'
              name='country'
              value={formData.country}
              onChange={handleChange}
              className='border p-2 rounded-md'
            />
          </motion.div>

          {/* Conditional Section (Animated on Toggle) */}
          <AnimatePresence mode="wait">
            {userType === "freelancer" && (
              <motion.div
                key="freelancer"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -40 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col gap-2"
              >
                <label className='text-sm font-medium'>Skills <span className='text-xs'>(comma separated)</span></label>
                <input
                  type='text'
                  name='skills'
                  onChange={handleSkillChange}
                  className='border p-2 rounded-md'
                />

                <label className='text-sm font-medium'>Short Bio / Description</label>
                <textarea
                  name='bio'
                  value={formData.bio}
                  onChange={handleChange}
                  className='border p-2 rounded-md'
                />
              </motion.div>
            )}

            {userType === "client" && (
              <motion.div
                key="client"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col gap-2"
              >
                <label className='text-sm font-medium'>Account Type</label>
                <select
                  name='accountType'
                  value={formData.accountType}
                  onChange={handleChange}
                  className='border p-2 rounded-md'
                >
                  <option value='individual'>Individual</option>
                  <option value='company'>Company</option>
                </select>

                {formData.accountType === "company" && (
                  <>
                    <label className='text-sm font-medium'>Company Name</label>
                    <input
                      type='text'
                      name='companyName'
                      value={formData.companyName}
                      onChange={handleChange}
                      className='border p-2 rounded-md'
                    />

                    <label className='text-sm font-medium'>Company Category / Industry</label>
                    <input
                      type='text'
                      name='companyCategory'
                      value={formData.companyCategory}
                      onChange={handleChange}
                      className='border p-2 rounded-md'
                    />
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Signup Button */}
          <motion.button
            className='bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-all'
            whileTap={{ scale: 0.95 }}
          >
            Sign Up
          </motion.button>

          <div className='text-center'><p>OR</p></div>

          <motion.div className='flex justify-center items-center gap-2 py-2 rounded-md bg-green-500 hover:bg-green-600 cursor-pointer'
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
            <img src={assets.google_icon} alt="google" className='h-5 w-5' />
            <button className='cursor-pointer'>Sign up with Google</button>
          </motion.div>
          <motion.div 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className='flex justify-center items-center gap-2 py-2 rounded-md border cursor-pointer'>
            <img src={assets.apple_icon} alt="apple" className='h-5 w-5' />
            <button className='cursor-pointer'>Sign up with Apple</button>
          </motion.div>

          <div className='flex justify-center items-center gap-2'>
            <p>Already have an account?</p>
            <a href="/login" className='text-blue-500'>Login</a>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Signup
