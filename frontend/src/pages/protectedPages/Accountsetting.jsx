import React, { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Lock,
  Shield,
  CreditCard,
  Bell,
  Eye,
  EyeOff,
  Camera,
  Save,
  X
} from 'lucide-react';

const AccountSettings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: true,
    marketing: false
  });

  const [profile, setProfile] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    location: 'New York, NY',
    bio: 'Full-stack developer with 5+ years of experience in React, Node.js, and Python.',
    avatar: null
  });

  const [security, setSecurity] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'billing', label: 'Billing', icon: CreditCard }
  ];

  const handleProfileUpdate = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleSecurityUpdate = (field, value) => {
    setSecurity(prev => ({ ...prev, [field]: value }));
  };

  const handleNotificationUpdate = (field) => {
    setNotifications(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-6">
            {/* Avatar Section */}
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
                  {profile.avatar ? (
                    <img
                      src={profile.avatar}
                      alt="Profile"
                      className="w-24 h-24 rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-12 h-12 text-blue-600" />
                  )}
                </div>
                <button className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors">
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              <div>
                <h3 className="text-lg font-medium text-slate-900">Profile Picture</h3>
                <p className="text-sm text-slate-600">Upload a profile picture that represents you professionally</p>
                <div className="mt-2 flex space-x-2">
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">Upload new</button>
                  <button className="text-red-600 hover:text-red-700 text-sm font-medium">Remove</button>
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">First Name</label>
                <input
                  type="text"
                  value={profile.firstName}
                  onChange={(e) => handleProfileUpdate('firstName', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Last Name</label>
                <input
                  type="text"
                  value={profile.lastName}
                  onChange={(e) => handleProfileUpdate('lastName', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => handleProfileUpdate('email', e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Phone</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => handleProfileUpdate('phone', e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-2">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    type="text"
                    value={profile.location}
                    onChange={(e) => handleProfileUpdate('location', e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-2">Bio</label>
                <textarea
                  rows={4}
                  value={profile.bio}
                  onChange={(e) => handleProfileUpdate('bio', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Tell us about yourself and your skills..."
                />
              </div>
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-blue-600" />
                <h3 className="text-sm font-medium text-blue-900">Security Settings</h3>
              </div>
              <p className="text-sm text-blue-700 mt-1">Keep your account secure with a strong password and two-factor authentication.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Current Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={security.currentPassword}
                    onChange={(e) => handleSecurityUpdate('currentPassword', e.target.value)}
                    className="w-full pl-9 pr-10 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={security.newPassword}
                    onChange={(e) => handleSecurityUpdate('newPassword', e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Confirm New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={security.confirmPassword}
                    onChange={(e) => handleSecurityUpdate('confirmPassword', e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-6">
              <h3 className="text-lg font-medium text-slate-900 mb-4">Two-Factor Authentication</h3>
              <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                <div>
                  <h4 className="text-sm font-medium text-slate-900">Enable 2FA</h4>
                  <p className="text-sm text-slate-600">Add an extra layer of security to your account</p>
                </div>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                  Enable
                </button>
              </div>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-slate-900 mb-4">Notification Preferences</h3>
              <p className="text-sm text-slate-600 mb-6">Choose how you want to be notified about activity on your account.</p>
            </div>

            <div className="space-y-4">
              {Object.entries(notifications).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                  <div>
                    <h4 className="text-sm font-medium text-slate-900 capitalize">
                      {key === 'sms' ? 'SMS' : key} Notifications
                    </h4>
                    <p className="text-sm text-slate-600">
                      {key === 'email' && 'Receive notifications via email'}
                      {key === 'push' && 'Receive push notifications in your browser'}
                      {key === 'sms' && 'Receive notifications via text message'}
                      {key === 'marketing' && 'Receive marketing and promotional emails'}
                    </p>
                  </div>
                  <button
                    onClick={() => handleNotificationUpdate(key)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${value ? 'bg-blue-600' : 'bg-slate-200'
                      }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${value ? 'translate-x-6' : 'translate-x-1'
                        }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
        );

      case 'billing':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-slate-900 mb-4">Billing Information</h3>
              <p className="text-sm text-slate-600 mb-6">Manage your payment methods and billing history.</p>
            </div>

            <div className="border border-slate-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-base font-medium text-slate-900">Payment Methods</h4>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                  Add Payment Method
                </button>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CreditCard className="w-8 h-8 text-slate-400" />
                    <div>
                      <p className="text-sm font-medium text-slate-900">•••• •••• •••• 4242</p>
                      <p className="text-sm text-slate-600">Expires 12/25</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">Edit</button>
                    <button className="text-red-600 hover:text-red-700 text-sm font-medium">Remove</button>
                  </div>
                </div>
              </div>
            </div>

            <div className="border border-slate-200 rounded-lg p-6">
              <h4 className="text-base font-medium text-slate-900 mb-4">Billing History</h4>
              <div className="space-y-3">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-b-0">
                    <div>
                      <p className="text-sm font-medium text-slate-900">Pro Plan - Monthly</p>
                      <p className="text-sm text-slate-600">Dec 1, 2024</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-slate-900">$29.00</p>
                      <button className="text-blue-600 hover:text-blue-700 text-sm">Download</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Account Settings</h1>
          <p className="text-slate-600 mt-1">Manage your account preferences and settings</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-64">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-colors ${activeTab === tab.id
                        ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-700'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white border border-slate-200 rounded-lg p-6">
              {renderTabContent()}

              {/* Save Button */}
              <div className="flex justify-end pt-6 border-t border-slate-200 mt-8">
                <div className="flex space-x-3">
                  <button className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors">
                    Cancel
                  </button>
                  <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;