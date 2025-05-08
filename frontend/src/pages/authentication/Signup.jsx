
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { assets } from '../../assets/assets'
import { useForm } from "react-hook-form"
import { useSelector, useDispatch } from 'react-redux'
import { signup } from '../../../Redux/Slice/authSlice'
const Signup = () => {
  const [userType, setUserType] = useState("freelancer")
  const [isSuccessfull, setIsSuccessful] = useState(false);
  const { error, status } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  useEffect(() => {
    if (isSuccessfull) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    }
  }, [isSuccessfull])

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm()

  const accountType = watch("accountType")
  const password = watch("password")

  const dataFilter = (data) => {
    if (userType === "client") {
      if (accountType === "individual") {
        let temp = {
          role: "client",
          email: data.email,
          password: data.password,
          userName: data.userName,
          fullName: data.firstName + " " + data.lastName,
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
          fullName: data.firstName + data.lastName,
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
        fullName: data.firstName + data.lastName,
        country: data.country,
        skills: data.skills.split(',').map(skill => skill.trim()),
        bio: data.bio,
      }
      return temp;
    }
  }

  useEffect(() => {
    if (status === "succeeded") {
      setIsSuccessful(true);
    }
  }, [status, error])

  const onSubmit = async (data) => {
    try {
      const filteredData = dataFilter(data);
      console.log(filteredData)
      // const response = await axiosInstance.post("/api/v1/user/register", filteredData)
      // console.log(response)
      //setIsSuccessful(true);
      dispatch(signup(filteredData));
    }
    catch (error) {
      console.log(error)
      alert("An error occured while registering . Please try again")
    }
  }

  return (
    <div className='bg-gray-50 min-h-screen relative'>
      <AnimatePresence>
        {isSuccessfull && (
          <motion.div
            className='fixed inset-0 z-50 min-h-screen flex justify-center items-center bg-black/50 backdrop-blur-sm'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className='p-10 bg-white border rounded-lg shadow-lg flex flex-col gap-6 items-center text-center max-w-md w-full'
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <img
                src={assets.success_icon}
                alt="Success"
                className='h-16 w-16'
              />
              <h2 className='text-2xl font-bold text-gray-800'>Registration Successful!</h2>
              <p className='text-gray-600'>
                Your account has been created successfully. You can now log in to access your account.
              </p>
              <a
                href="/login"
                className='px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-all'
              >
                Go to Login
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className='flex flex-col justify-center items-center gap-5 mt-[64px] pb-10 px-4'>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className='font-bold text-2xl'
        >
          Create an account
        </motion.div>

        <motion.form
          className='flex flex-col w-full max-w-2xl p-5 px-10 gap-4 bg-white border border-gray-300 shadow-lg rounded-lg'
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          onSubmit={handleSubmit(onSubmit)}
        >


          {/* User Type Toggle */}
          <div className='flex gap-4 justify-center items-center'>
            <button
              type="button"
              onClick={() => setUserType("freelancer")}
              className={`px-5 py-2 rounded-full w-[50%] transition-all duration-300 ${userType === "freelancer" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
            >
              Freelancer
            </button>

            <button
              type="button"
              onClick={() => setUserType("client")}
              className={`px-5 py-2 rounded-full w-[50%] transition-all duration-300 ${userType === "client" ? "bg-green-500 text-white" : "bg-gray-200"}`}
            >
              Client
            </button>
          </div>

          {/* Basic Fields */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex flex-col gap-2"
          >
            <label className='text-sm font-medium'>Email</label>
            <input
              type='email'
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Invalid email address"
                }
              })}
              className='border p-2 rounded-md'
            />
            {errors.email && <p className='text-red-500 text-sm'>{errors.email.message}</p>}

            <label className='text-sm font-medium'>Password</label>
            <input
              type='password'
              placeholder='Password (6 or more characters)'
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters long"
                },
                validate: {
                  hasUpperCase: value =>
                    /[A-Z]/.test(value) || "Password must contain at least one uppercase letter",
                  hasLowerCase: value =>
                    /[a-z]/.test(value) || "Password must contain at least one lowercase letter",
                  hasNumber: value =>
                    /[0-9]/.test(value) || "Password must contain at least one number",
                  hasSpecialChar: value =>
                    /[@$!%*?&]/.test(value) || "Password must contain at least one special character (@$!%*?&)"
                }
              })}
              className='border p-2 rounded-md'
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}

            <label className='text-sm font-medium'>Confirm Password</label>
            <input
              type='password'
              placeholder='Re-enter your password'
              {...register("confirmPassword", {
                required: "Confirm Password is required",
                validate: value => value === password || "Passwords do not match"
              })}
              className='border p-2 rounded-md'
            />
            {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>}

            <label className='text-sm font-medium'>Username (unique)</label>
            <input
              type='text'
              {...register("userName", { required: "Username is required" })}
              className='border p-2 rounded-md'
            />
            {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}

            <div className="flex gap-2">
              <div className="w-1/2">
                <label className='text-sm font-medium'>First Name</label>
                <input
                  type='text'
                  {...register("firstName", {
                    required: "First name is required",
                    pattern: { value: /^[A-Za-z]+$/, message: "Only letters allowed" }
                  })}
                  className='border p-2 rounded-md w-full'
                />
                {errors.firstName && <p className='text-red-500 text-sm'>{errors.firstName.message}</p>}
              </div>
              <div className="w-1/2">
                <label className='text-sm font-medium'>Last Name</label>
                <input
                  type='text'
                  {...register("lastName")}
                  className='border p-2 rounded-md w-full'
                />
              </div>
            </div>

            <label className='text-sm font-medium'>Country</label>
            <input
              type='text'
              {...register("country")}
              className='border p-2 rounded-md'
            />
          </motion.div>

          {/* Conditional Section */}
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
                  {...register("skills")}
                  className='border p-2 rounded-md'
                />

                <label className='text-sm font-medium'>Short Bio / Description</label>
                <textarea
                  {...register("bio", { maxLength: { value: 100, message: "Bio must be under 100 characters" } })}
                  className='border p-2 rounded-md'
                />
                {errors.bio && <p className='text-red-500 text-sm'>{errors.bio.message}</p>}
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
                  {...register("accountType")}
                  className='border p-2 rounded-md'
                >
                  <option value='individual'>Individual</option>
                  <option value='company'>Company</option>
                </select>

                {accountType === "company" && (
                  <>
                    <label className='text-sm font-medium'>Company Name</label>
                    <input
                      type='text'
                      {...register("companyName", { required: "Company name is required" })}
                      className='border p-2 rounded-md'
                    />
                    {errors.companyName && <p className="text-red-500 text-sm">{errors.companyName.message}</p>}

                    <label className='text-sm font-medium'>Company Category / Industry</label>
                    <input
                      type='text'
                      {...register("companyCategory")}
                      className='border p-2 rounded-md'
                    />
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit Button */}
          <motion.button
            type="submit"
            className='bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-all'
            whileTap={{ scale: 0.95 }}
          >
            Sign Up
          </motion.button>

          <div className='text-center'><p>OR</p></div>

          {/* Social Signup Buttons */}
          <motion.div
            className='flex justify-center items-center gap-2 py-2 rounded-md bg-green-500 hover:bg-green-600 cursor-pointer'
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <img src={assets.google_icon} alt="google" className='h-5 w-5' />
            <button type='button' className='cursor-pointer'>Sign up with Google</button>
          </motion.div>

          <motion.div
            className='flex justify-center items-center gap-2 py-2 rounded-md border cursor-pointer'
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <img src={assets.apple_icon} alt="apple" className='h-5 w-5' />
            <button type='button' className='cursor-pointer'>Sign up with Apple</button>
          </motion.div>

          <div className='flex justify-center items-center gap-2'>
            <p>Already have an account?</p>
            <a href="/login" className='text-blue-500'>Login</a>
          </div>

        </motion.form>
      </div>
    </div>
  )
}

export default Signup
