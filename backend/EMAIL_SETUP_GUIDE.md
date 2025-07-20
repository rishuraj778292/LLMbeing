# Email Configuration Guide

## 📧 **Email Service Setup for LLMbeing Platform**

### **Development Environment**

#### **Option 1: Gmail (Recommended for Development)**
1. Create a Gmail account or use existing one
2. Enable 2-Factor Authentication
3. Generate App Password:
   - Go to Google Account Settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"

```env
# Development with Gmail
NODE_ENV=development
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password-here
EMAIL_FROM="LLMbeing Platform <your-email@gmail.com>"
```

#### **Option 2: Ethereal Email (Testing Only)**
No configuration needed! Ethereal Email automatically creates test accounts.
- Emails won't be delivered to real recipients
- Preview URLs provided in console for testing
- Perfect for development and testing

```env
# Development with Ethereal (automatic)
NODE_ENV=development
# EMAIL_USER and EMAIL_PASS not required - auto-generated
EMAIL_FROM="LLMbeing Platform <noreply@llmbeing.com>"
```

---

### **Production Environment**

#### **Option 1: Gmail (Small Scale)**
```env
NODE_ENV=production
EMAIL_SERVICE=gmail
EMAIL_USER=noreply@yourdomain.com
EMAIL_PASS=your-app-password
EMAIL_FROM="LLMbeing Platform <noreply@yourdomain.com>"
```

#### **Option 2: SendGrid (Recommended for Production)**
```env
NODE_ENV=production
EMAIL_SERVICE=SendGrid
EMAIL_USER=apikey
EMAIL_PASS=your-sendgrid-api-key
EMAIL_FROM="LLMbeing Platform <noreply@yourdomain.com>"
```

#### **Option 3: AWS SES**
```env
NODE_ENV=production
EMAIL_SERVICE=SES
EMAIL_USER=your-access-key-id
EMAIL_PASS=your-secret-access-key
EMAIL_FROM="LLMbeing Platform <noreply@yourdomain.com>"
AWS_REGION=us-east-1
```

#### **Option 4: Custom SMTP**
```env
NODE_ENV=production
SMTP_HOST=smtp.yourmailserver.com
SMTP_PORT=587
SMTP_SECURE=false
EMAIL_USER=your-smtp-username
EMAIL_PASS=your-smtp-password
EMAIL_FROM="LLMbeing Platform <noreply@yourdomain.com>"
```

---

### **Environment Variables Required**

#### **Minimal Setup (Development):**
```env
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
EMAIL_FROM="LLMbeing Platform <noreply@llmbeing.com>"
```

#### **Gmail Setup:**
```env
NODE_ENV=development
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-char-app-password
EMAIL_FROM="LLMbeing Platform <your-email@gmail.com>"
FRONTEND_URL=http://localhost:3000
```

#### **Production Setup:**
```env
NODE_ENV=production
EMAIL_SERVICE=gmail
EMAIL_USER=noreply@yourdomain.com
EMAIL_PASS=your-production-email-password
EMAIL_FROM="LLMbeing Platform <noreply@yourdomain.com>"
FRONTEND_URL=https://yourdomain.com
```

---

### **Email Service Features**

#### **Development Mode:**
- ✅ Console logging of email content
- ✅ Ethereal Email test accounts (automatic)
- ✅ Preview URLs for email testing
- ✅ Gmail integration with app passwords
- ✅ Graceful fallback if email fails

#### **Production Mode:**
- ✅ Multiple email service providers
- ✅ Secure credential handling
- ✅ Error handling and retry logic
- ✅ Professional email templates
- ✅ Delivery tracking (messageId)

---

### **Security Best Practices**

#### **Gmail App Passwords:**
1. Never use your main Gmail password
2. Always use App Passwords for applications
3. Enable 2-Factor Authentication first
4. Rotate passwords regularly

#### **Production Security:**
1. Use dedicated email service (SendGrid, SES)
2. Implement rate limiting for email sending
3. Use environment variables for all credentials
4. Monitor email delivery and bounces
5. Implement unsubscribe functionality

---

### **Testing Email Functionality**

#### **1. Test with Ethereal Email (No Setup Required):**
```bash
# Just start the server - emails will be logged with preview URLs
npm run dev
```

#### **2. Test with Gmail:**
```bash
# Set up Gmail credentials in .env
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Test forgot password endpoint
curl -X POST http://localhost:3300/api/v1/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'
```

#### **3. Check Console Output:**
```
📧 EMAIL CONTENT:
To: test@example.com
Subject: Password Reset Request - LLMbeing
Message: Hi John Developer, You recently requested...
-------------------
✅ Email sent successfully!
Message ID: <random-message-id>
📧 Preview URL: https://ethereal.email/message/xyz123
```

---

### **Common Issues & Solutions**

#### **Gmail "Less Secure Apps" Error:**
- **Solution:** Use App Passwords instead of main password
- **Setup:** Google Account → Security → App Passwords

#### **SMTP Connection Timeout:**
- **Check:** Firewall settings
- **Try:** Different SMTP ports (25, 587, 465)
- **Verify:** SMTP server settings

#### **Authentication Failed:**
- **Verify:** Email and password credentials
- **Check:** App Password format (16 characters)
- **Ensure:** 2FA is enabled for Gmail

#### **Email Not Received:**
- **Check:** Spam/Junk folder
- **Verify:** Email address spelling
- **Test:** With Ethereal Email first

---

### **Deployment Checklist**

#### **Before Production:**
- [ ] Set up professional email service (SendGrid/SES)
- [ ] Configure custom domain for FROM address
- [ ] Test email delivery thoroughly
- [ ] Set up email monitoring/analytics
- [ ] Configure rate limiting
- [ ] Implement email templates

#### **Environment Variables to Set:**
- [ ] `NODE_ENV=production`
- [ ] `EMAIL_SERVICE=your-service`
- [ ] `EMAIL_USER=your-user`
- [ ] `EMAIL_PASS=your-password`
- [ ] `EMAIL_FROM=your-from-address`
- [ ] `FRONTEND_URL=your-domain`

---

**📚 For more details, check the API documentation at:** `api-documentation/auth-api.md`
