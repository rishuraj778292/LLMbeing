import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Eye, EyeOff, User, Mail, Lock, ArrowRight, CheckCircle, Building } from 'lucide-react';
import { signup } from '../../../Redux/Slice/authSlice';

const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, signupStatus, signupError } = useSelector(state => state.auth);
  const loading = signupStatus === 'loading';
  const error = signupError;

  const [showPassword, setShowPassword] = useState(false);
  const [userType, setUserType] = useState('freelancer');
  const [showSuccess, setShowSuccess] = useState(false);
  const [accountType, setAccountType] = useState('individual');
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState('');

  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const password = watch('password', '');

  useEffect(() => {
    if (user && !loading && !error) {
      setShowSuccess(true);
      setTimeout(() => {
        // Redirect based on user role
        if (user?.role === 'client') {
          navigate('/post-project');
        } else if (user?.role === 'freelancer') {
          navigate('/projects');
        } else {
          navigate('/projects');
        }
      }, 2000);
    }
  }, [user, loading, error, navigate]);

  useEffect(() => {
    // Cleanup on unmount - no clearError action available
  }, [dispatch]);

  const onSubmit = async (data) => {
    // Prepare final data based on user type
    const finalData = {
      ...data,
      role: userType,
      fullName: `${data.firstName} ${data.lastName}` // Combine first and last name
    };

    // Add user type specific fields
    if (userType === 'freelancer') {
      finalData.skills = skills;
    } else if (userType === 'client') {
      finalData.accountType = accountType;
      if (accountType === 'company') {
        finalData.companyName = data.companyName;
        finalData.companyCategory = data.companyCategory;
      }
    }

    dispatch(signup(finalData));
  };

  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: '', color: '' };

    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    const labels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
    const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];

    return {
      strength: (strength / 5) * 100,
      label: labels[strength - 1] || '',
      color: colors[strength - 1] || 'bg-gray-200'
    };
  };

  const passwordStrength = getPasswordStrength(password);

  // Skills handling functions
  const addSkill = (e) => {
    e.preventDefault();
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const handleSkillKeyPress = (e) => {
    if (e.key === 'Enter') {
      addSkill(e);
    }
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md w-full mx-4"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          </motion.div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to LLMbeing!</h2>
          <p className="text-gray-600 mb-4">Your account has been created successfully.</p>
          <div className="w-full bg-blue-600 h-1 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-blue-400"
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 2 }}
            />
          </div>
          <p className="text-sm text-gray-500 mt-2">Redirecting to your workspace...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen min-w-screen md:px-10 md:flex md:items-center md:justify-center pt-20 md:pt-10">
      <div className="h-full w-full flex flex-col md:flex-row bg-gray-50 font-sans border rounded-2xl mt-4 md:mt-0 mb-8">
        {/* Left Side - Welcome Section */}
        <div className="md:w-5/12 bg-gradient-to-br from-blue-600 to-purple-700 text-white flex flex-col justify-center p-8 md:p-12 pt-8 md:pt-20 md:rounded-l-2xl">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-md mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Join Our Community</h1>
            <p className="text-lg mb-8 text-blue-100">
              Connect with talented freelancers or find your next big project. Start your journey today!
            </p>
            <div className="space-y-4 mb-12">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 rounded-full p-2">
                  <CheckCircle className="w-6 h-6 text-blue-700" />
                </div>
                <span className="text-blue-100">Access to thousands of projects</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 rounded-full p-2">
                  <CheckCircle className="w-6 h-6 text-blue-700" />
                </div>
                <span className="text-blue-100">Secure payment system</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 rounded-full p-2">
                  <CheckCircle className="w-6 h-6 text-blue-700" />
                </div>
                <span className="text-blue-100">24/7 customer support</span>
              </div>
            </div>
            <div className="text-sm text-blue-200">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-white font-medium hover:text-blue-100 transition-colors"
              >
                Sign in here
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Right Side - Signup Form */}
        <div className="md:w-7/12 bg-white p-8 md:p-12 md:rounded-r-2xl overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full max-w-md mx-auto py-4"
          >
            <div className="text-center md:text-left mb-8">
              <h2 className="text-2xl font-bold text-gray-800">Create Account</h2>
              <p className="text-gray-600 mt-1">Join thousands of satisfied users</p>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6"
              >
                {error}
              </motion.div>
            )}

            {/* User Type Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">I want to:</label>
              <div className="grid grid-cols-2 gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => setUserType('freelancer')}
                  className={`p-4 rounded-lg border-2 text-center transition-all ${userType === 'freelancer'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                    }`}
                >
                  <User className="w-6 h-6 mx-auto mb-2" />
                  <div className="font-medium">Find Work</div>
                  <div className="text-xs">I'm a freelancer</div>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => setUserType('client')}
                  className={`p-4 rounded-lg border-2 text-center transition-all ${userType === 'client'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                    }`}
                >
                  <User className="w-6 h-6 mx-auto mb-2" />
                  <div className="font-medium">Hire Talent</div>
                  <div className="text-xs">I'm a client</div>
                </motion.button>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address'
                      }
                    })}
                    className={`w-full pl-10 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none ${errors.email ? 'border-red-300' : 'border-gray-300'
                      }`}
                    placeholder="Enter your email"
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    {...register('password', {
                      required: 'Password is required',
                      minLength: {
                        value: 8,
                        message: 'Password must be at least 8 characters'
                      }
                    })}
                    className={`w-full pl-10 pr-12 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none ${errors.password ? 'border-red-300' : 'border-gray-300'
                      }`}
                    placeholder="Create a strong password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {password && (
                  <div className="mt-2">
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>Password strength</span>
                      <span>{passwordStrength.label}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                        style={{ width: `${passwordStrength.strength}%` }}
                      />
                    </div>
                  </div>
                )}
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                )}
              </div>

              {/* Username */}
              <div>
                <label htmlFor="userName" className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="userName"
                    {...register('userName', {
                      required: 'Username is required',
                      minLength: {
                        value: 3,
                        message: 'Username must be at least 3 characters'
                      },
                      pattern: {
                        value: /^[a-zA-Z0-9_]+$/,
                        message: 'Username can only contain letters, numbers, and underscores'
                      }
                    })}
                    className={`w-full pl-10 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none ${errors.userName ? 'border-red-300' : 'border-gray-300'
                      }`}
                    placeholder="Choose a unique username"
                  />
                </div>
                {errors.userName && (
                  <p className="text-red-500 text-sm mt-1">{errors.userName.message}</p>
                )}
              </div>

              {/* Full Name */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    {...register('firstName', { required: 'First name is required' })}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none ${errors.firstName ? 'border-red-300' : 'border-gray-300'
                      }`}
                    placeholder="Enter first name"
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    {...register('lastName', { required: 'Last name is required' })}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none ${errors.lastName ? 'border-red-300' : 'border-gray-300'
                      }`}
                    placeholder="Enter last name"
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>
                  )}
                </div>
              </div>

              {/* Role-specific fields */}
              {userType === 'freelancer' && (
                <>
                  {/* Skills */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Skills
                    </label>
                    <div className="space-y-2">
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={skillInput}
                          onChange={(e) => setSkillInput(e.target.value)}
                          onKeyPress={handleSkillKeyPress}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                          placeholder="Enter a skill and press Enter"
                        />
                        <button
                          type="button"
                          onClick={addSkill}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Add
                        </button>
                      </div>
                      {skills.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {skills.map((skill, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                            >
                              {skill}
                              <button
                                type="button"
                                onClick={() => removeSkill(skill)}
                                className="ml-2 text-blue-500 hover:text-blue-700"
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Add skills that showcase your expertise</p>
                  </div>

                  {/* Bio */}
                  <div>
                    <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                      Short Bio/Description
                    </label>
                    <textarea
                      id="bio"
                      {...register('bio', {
                        required: 'Bio is required for freelancers',
                        minLength: {
                          value: 50,
                          message: 'Bio must be at least 50 characters'
                        },
                        maxLength: {
                          value: 500,
                          message: 'Bio cannot exceed 500 characters'
                        }
                      })}
                      rows={4}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none resize-none ${errors.bio ? 'border-red-300' : 'border-gray-300'
                        }`}
                      placeholder="Tell potential clients about yourself, your experience, and what makes you unique..."
                    />
                    {errors.bio && (
                      <p className="text-red-500 text-sm mt-1">{errors.bio.message}</p>
                    )}
                  </div>
                </>
              )}

              {userType === 'client' && (
                <>
                  {/* Account Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Account Type</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setAccountType('individual')}
                        className={`p-3 rounded-lg border-2 text-center transition-all ${accountType === 'individual'
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                          }`}
                      >
                        <User className="w-5 h-5 mx-auto mb-1" />
                        <div className="font-medium text-sm">Individual</div>
                        <div className="text-xs">Personal account</div>
                      </button>
                      <button
                        type="button"
                        onClick={() => setAccountType('company')}
                        className={`p-3 rounded-lg border-2 text-center transition-all ${accountType === 'company'
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                          }`}
                      >
                        <Building className="w-5 h-5 mx-auto mb-1" />
                        <div className="font-medium text-sm">Company</div>
                        <div className="text-xs">Business account</div>
                      </button>
                    </div>
                  </div>

                  {/* Company fields - only show if company account type */}
                  {accountType === 'company' && (
                    <>
                      <div>
                        <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">
                          Company Name
                        </label>
                        <input
                          type="text"
                          id="companyName"
                          {...register('companyName', {
                            required: accountType === 'company' ? 'Company name is required' : false
                          })}
                          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none ${errors.companyName ? 'border-red-300' : 'border-gray-300'
                            }`}
                          placeholder="Enter your company name"
                        />
                        {errors.companyName && (
                          <p className="text-red-500 text-sm mt-1">{errors.companyName.message}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="companyCategory" className="block text-sm font-medium text-gray-700 mb-1">
                          Company Category/Industry
                        </label>
                        <select
                          id="companyCategory"
                          {...register('companyCategory', {
                            required: accountType === 'company' ? 'Company category is required' : false
                          })}
                          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none ${errors.companyCategory ? 'border-red-300' : 'border-gray-300'
                            }`}
                        >
                          <option value="">Select category</option>
                          <option value="technology">Technology</option>
                          <option value="healthcare">Healthcare</option>
                          <option value="finance">Finance</option>
                          <option value="education">Education</option>
                          <option value="retail">Retail</option>
                          <option value="manufacturing">Manufacturing</option>
                          <option value="consulting">Consulting</option>
                          <option value="marketing">Marketing</option>
                          <option value="real-estate">Real Estate</option>
                          <option value="other">Other</option>
                        </select>
                        {errors.companyCategory && (
                          <p className="text-red-500 text-sm mt-1">{errors.companyCategory.message}</p>
                        )}
                      </div>
                    </>
                  )}
                </>
              )}

              {/* Submit Button */}
              <div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2.5 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                  ) : (
                    <>
                      <span>Create Account</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
