import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Mail, RefreshCw, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import axiosInstance from '../../../UTILS/axiosInstance';

const OTPVerification = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { email, type = 'registration' } = location.state || {};

    // Redirect if no email provided
    useEffect(() => {
        if (!email) {
            navigate('/signup');
        }
    }, [email, navigate]);

    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [resendLoading, setResendLoading] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(0);
    const [success, setSuccess] = useState(false);

    const inputRefs = useRef([]);

    // Auto-focus first input on mount
    useEffect(() => {
        if (inputRefs.current[0]) {
            inputRefs.current[0].focus();
        }
    }, []);

    // Cooldown timer effect
    useEffect(() => {
        if (resendCooldown > 0) {
            const timer = setTimeout(() => {
                setResendCooldown(resendCooldown - 1);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [resendCooldown]);

    const handleOTPChange = (index, value) => {
        if (!/^\d*$/.test(value)) return; // Only allow digits

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        setError(''); // Clear error when user types

        // Auto-focus next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        } else if (e.key === 'Enter') {
            handleVerifyOTP();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').replace(/\D/g, ''); // Remove non-digits

        if (pastedData.length === 6) {
            const newOtp = pastedData.split('');
            setOtp(newOtp);
            setError('');
            // Focus last input
            inputRefs.current[5]?.focus();
        }
    };

    const handleVerifyOTP = async () => {
        const otpString = otp.join('');
        if (otpString.length !== 6) {
            setError('Please enter complete 6-digit OTP');
            return;
        }

        setLoading(true);
        setError('');

        try {
            let endpoint = '';
            let successMessage = '';
            let redirectPath = '';

            if (type === 'registration') {
                endpoint = '/api/v1/user/verify-email';
                successMessage = 'Email verified successfully! You can now login.';
                redirectPath = '/login';
            } else if (type === 'password-reset') {
                endpoint = '/api/v1/user/verify-reset-otp';
                successMessage = 'OTP verified! You can now reset your password.';
                // For password reset, we'll pass the reset token to the next step
            }

            const response = await axiosInstance.post(endpoint, {
                email,
                otp: otpString
            });

            if (response.data.success) {
                setSuccess(true);

                setTimeout(() => {
                    if (type === 'registration') {
                        navigate(redirectPath, {
                            state: {
                                message: successMessage,
                                email
                            }
                        });
                    } else if (type === 'password-reset') {
                        navigate('/reset-password', {
                            state: {
                                email
                            }
                        });
                    }
                }, 3500); // Increased from 2000ms to 3500ms for better user experience
            }
        } catch (error) {
            console.error('OTP verification error:', error);
            setError(error.response?.data?.message || 'Invalid OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleResendOTP = async () => {
        if (resendCooldown > 0) return;

        setResendLoading(true);
        setError('');

        try {
            let endpoint = '';

            if (type === 'registration') {
                endpoint = '/api/v1/user/resend-otp';
            } else if (type === 'password-reset') {
                endpoint = '/api/v1/user/forgot-password';
            }

            const response = await axiosInstance.post(endpoint, { email });

            if (response.data.success) {
                // Start cooldown
                setResendCooldown(60);

                // Clear current OTP
                setOtp(['', '', '', '', '', '']);

                // Focus first input
                inputRefs.current[0]?.focus();
            }
        } catch (error) {
            console.error('Resend OTP error:', error);
            setError(error.response?.data?.message || 'Failed to resend OTP. Please try again.');
        } finally {
            setResendLoading(false);
        }
    };

    const getTitle = () => {
        return type === 'registration' ? 'Verify Your Email' : 'Verify OTP for Password Reset';
    };

    const getDescription = () => {
        return type === 'registration'
            ? 'We\'ve sent a 6-digit verification code to your email address. Please enter it below to complete your registration.'
            : 'We\'ve sent a 6-digit verification code to your email address. Please enter it below to verify your identity.';
    };

    const getBackPath = () => {
        return type === 'registration' ? '/signup' : '/forgot-password';
    };

    if (success) {
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
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        {type === 'registration' ? 'Welcome to LLMbeing!' : 'OTP Verified!'}
                    </h2>
                    <p className="text-gray-600 mb-4">
                        {type === 'registration'
                            ? 'Your email has been verified successfully! Your account is now active and you can start exploring the platform.'
                            : 'Your identity has been verified. You can now reset your password.'
                        }
                    </p>
                    <div className="w-full bg-blue-600 h-1 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-blue-400"
                            initial={{ width: 0 }}
                            animate={{ width: '100%' }}
                            transition={{ duration: 3.5 }}
                        />
                    </div>
                    <p className="text-sm text-gray-500 mt-2">Redirecting...</p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md"
            >
                {/* Header */}
                <div className="text-center mb-8">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="bg-blue-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center"
                    >
                        <Mail className="w-8 h-8 text-blue-600" />
                    </motion.div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">{getTitle()}</h1>
                    <p className="text-gray-600 text-sm leading-relaxed">
                        {getDescription()}
                    </p>
                    {email && (
                        <p className="text-blue-600 font-medium mt-2 text-sm">
                            {email}
                        </p>
                    )}
                </div>

                {/* Error Message */}
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center space-x-2"
                    >
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        <span className="text-sm">{error}</span>
                    </motion.div>
                )}

                {/* OTP Input */}
                <div className="mb-8">
                    <label className="block text-sm font-medium text-gray-700 mb-4 text-center">
                        Enter 6-digit verification code
                    </label>
                    <div className="flex justify-center space-x-3">
                        {otp.map((digit, index) => (
                            <motion.input
                                key={index}
                                ref={(el) => (inputRefs.current[index] = el)}
                                type="text"
                                maxLength="1"
                                value={digit}
                                onChange={(e) => handleOTPChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                onPaste={handlePaste}
                                className="w-12 h-12 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all"
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: index * 0.1 }}
                            />
                        ))}
                    </div>
                </div>

                {/* Verify Button */}
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleVerifyOTP}
                    disabled={loading || otp.join('').length !== 6}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 mb-6"
                >
                    {loading ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                    ) : (
                        <span>Verify OTP</span>
                    )}
                </motion.button>

                {/* Resend OTP */}
                <div className="text-center">
                    <p className="text-gray-600 text-sm mb-3">
                        Didn't receive the code?
                    </p>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleResendOTP}
                        disabled={resendLoading || resendCooldown > 0}
                        className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <RefreshCw className={`w-4 h-4 ${resendLoading ? 'animate-spin' : ''}`} />
                        <span>
                            {resendCooldown > 0
                                ? `Resend in ${resendCooldown}s`
                                : resendLoading
                                    ? 'Sending...'
                                    : 'Resend OTP'
                            }
                        </span>
                    </motion.button>
                </div>

                {/* Back Link */}
                <div className="text-center mt-6 pt-6 border-t border-gray-200">
                    <Link
                        to={getBackPath()}
                        className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back to {type === 'registration' ? 'Sign Up' : 'Password Reset'}</span>
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default OTPVerification;
