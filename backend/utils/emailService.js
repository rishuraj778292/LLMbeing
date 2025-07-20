import nodemailer from 'nodemailer';

// Email utility with actual email sending using Nodemailer
const sendEmail = async (options) => {
    try {
        // Create transporter based on environment
        let transporter;

        if (process.env.NODE_ENV === 'development') {
            // For development - log email content and optionally send via Gmail
            console.log('📧 EMAIL CONTENT:');
            console.log('To:', options.to);
            console.log('Subject:', options.subject);
            console.log('Message:', options.message);
            console.log('-------------------');

            // If email credentials are provided in development, send actual email
            if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
                transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: process.env.EMAIL_USER,
                        pass: process.env.EMAIL_PASS // Use App Password for Gmail
                    }
                });
            } else {
                // Use Ethereal Email for testing (creates test account automatically)
                const testAccount = await nodemailer.createTestAccount();
                transporter = nodemailer.createTransport({
                    host: 'smtp.ethereal.email',
                    port: 587,
                    secure: false,
                    auth: {
                        user: testAccount.user,
                        pass: testAccount.pass
                    }
                });
                console.log('🔧 Using Ethereal Email for testing');
                // Store the test account email for use as sender
                options.testSender = testAccount.user;
            }
        } else {
            // Production configuration
            if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
                throw new Error('Email credentials not configured for production');
            }

            // Configure based on email service
            const emailService = process.env.EMAIL_SERVICE || 'gmail';

            if (emailService.toLowerCase() === 'sendgrid') {
                // SendGrid configuration
                transporter = nodemailer.createTransport({
                    host: 'smtp.sendgrid.net',
                    port: 587,
                    secure: false,
                    auth: {
                        user: 'apikey',
                        pass: process.env.EMAIL_PASS // SendGrid API key
                    }
                });
            } else if (emailService.toLowerCase() === 'ses') {
                // AWS SES configuration
                transporter = nodemailer.createTransport({
                    host: `email-smtp.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com`,
                    port: 587,
                    secure: false,
                    auth: {
                        user: process.env.EMAIL_USER,
                        pass: process.env.EMAIL_PASS
                    }
                });
            } else if (process.env.SMTP_HOST) {
                // Custom SMTP configuration
                transporter = nodemailer.createTransport({
                    host: process.env.SMTP_HOST,
                    port: parseInt(process.env.SMTP_PORT) || 587,
                    secure: process.env.SMTP_SECURE === 'true',
                    auth: {
                        user: process.env.EMAIL_USER,
                        pass: process.env.EMAIL_PASS
                    }
                });
            } else {
                // Default to Gmail/Google Workspace
                transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: process.env.EMAIL_USER,
                        pass: process.env.EMAIL_PASS
                    }
                });
            }
        }

        // Determine sender address
        let fromAddress;
        if (options.testSender) {
            // Using Ethereal test account
            fromAddress = `"LLMbeing Team" <${options.testSender}>`;
        } else {
            // Using configured email
            fromAddress = process.env.EMAIL_FROM || `"LLMbeing Team" <${process.env.EMAIL_USER}>`;
        }

        // Send email
        const info = await transporter.sendMail({
            from: fromAddress,
            to: options.to,
            subject: options.subject,
            text: options.message,
            html: options.html
        });

        if (process.env.NODE_ENV === 'development') {
            console.log('✅ Email sent successfully!');
            console.log('Message ID:', info.messageId);

            // If using Ethereal, show preview URL
            if (info.messageId && nodemailer.getTestMessageUrl(info)) {
                console.log('📧 Preview URL:', nodemailer.getTestMessageUrl(info));
            }
        }

        return {
            success: true,
            message: 'Email sent successfully',
            messageId: info.messageId,
            previewUrl: process.env.NODE_ENV === 'development' ? nodemailer.getTestMessageUrl(info) : null
        };

    } catch (error) {
        console.error('❌ Email sending failed:', error.message);

        // In development, still log the email content even if sending fails
        if (process.env.NODE_ENV === 'development') {
            console.log('📧 EMAIL CONTENT (Failed to send):');
            console.log('To:', options.to);
            console.log('Subject:', options.subject);
            console.log('Message:', options.message);
            console.log('-------------------');
        }

        throw new Error(`Failed to send email: ${error.message}`);
    }
};// Create password reset email template
const createPasswordResetEmail = (resetUrl, fullName) => {
    const message = `Hi ${fullName},

You recently requested to reset your password for your account. Click the link below to reset it:

${resetUrl}

If you did not request a password reset, please ignore this email.

This link will expire in 10 minutes for security reasons.

Best regards,
The LLMbeing Team`;

    const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #007bff; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9f9f9; }
            .button { display: inline-block; background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Password Reset Request</h1>
            </div>
            <div class="content">
                <h2>Hi ${fullName},</h2>
                <p>You recently requested to reset your password for your LLMbeing account.</p>
                <p>Click the button below to reset your password:</p>
                <a href="${resetUrl}" class="button">Reset Password</a>
                <p>Or copy and paste this link into your browser:</p>
                <p style="word-break: break-all; color: #007bff;">${resetUrl}</p>
                <p><strong>Important:</strong> This link will expire in 10 minutes for security reasons.</p>
                <p>If you did not request a password reset, please ignore this email and your password will remain unchanged.</p>
            </div>
            <div class="footer">
                <p>© 2025 LLMbeing. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>`;

    return { message, html };
};

// Create email verification OTP email template
const createEmailVerificationOTP = (otp, fullName) => {
    const message = `Hi ${fullName},

Welcome to LLMbeing! To complete your registration, please verify your email address with the OTP below:

Your OTP: ${otp}

This OTP will expire in 10 minutes for security reasons.

If you did not create an account with us, please ignore this email.

Best regards,
The LLMbeing Team`;

    const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #28a745; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9f9f9; }
            .otp-code { display: inline-block; background: #007bff; color: white; padding: 15px 30px; font-size: 24px; font-weight: bold; letter-spacing: 3px; border-radius: 5px; margin: 20px 0; }
            .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Email Verification</h1>
            </div>
            <div class="content">
                <h2>Hi ${fullName},</h2>
                <p>Welcome to LLMbeing! To complete your registration, please verify your email address with the OTP below:</p>
                <div style="text-align: center;">
                    <div class="otp-code">${otp}</div>
                </div>
                <p><strong>Important:</strong> This OTP will expire in 10 minutes for security reasons.</p>
                <p>If you did not create an account with us, please ignore this email.</p>
            </div>
            <div class="footer">
                <p>© 2025 LLMbeing. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>`;

    return { message, html };
};

// Create password reset OTP email template
const createPasswordResetOTP = (otp, fullName) => {
    const message = `Hi ${fullName},

You recently requested to reset your password for your LLMbeing account. Please use the OTP below to verify your identity:

Your OTP: ${otp}

This OTP will expire in 10 minutes for security reasons.

If you did not request a password reset, please ignore this email and your password will remain unchanged.

Best regards,
The LLMbeing Team`;

    const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #dc3545; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9f9f9; }
            .otp-code { display: inline-block; background: #007bff; color: white; padding: 15px 30px; font-size: 24px; font-weight: bold; letter-spacing: 3px; border-radius: 5px; margin: 20px 0; }
            .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Password Reset Verification</h1>
            </div>
            <div class="content">
                <h2>Hi ${fullName},</h2>
                <p>You recently requested to reset your password for your LLMbeing account. Please use the OTP below to verify your identity:</p>
                <div style="text-align: center;">
                    <div class="otp-code">${otp}</div>
                </div>
                <p><strong>Important:</strong> This OTP will expire in 10 minutes for security reasons.</p>
                <p>If you did not request a password reset, please ignore this email and your password will remain unchanged.</p>
            </div>
            <div class="footer">
                <p>© 2025 LLMbeing. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>`;

    return { message, html };
};

export { sendEmail, createPasswordResetEmail, createEmailVerificationOTP, createPasswordResetOTP };
