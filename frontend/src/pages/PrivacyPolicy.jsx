import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Shield, Eye, Lock, Users, FileText, Mail, Phone, MapPin } from 'lucide-react';

const PrivacyPolicy = () => {
  const [expandedSections, setExpandedSections] = useState({});

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const sections = [
    {
      id: 'information-collection',
      title: 'Information We Collect',
      icon: <Eye className="w-6 h-6" />,
      content: (
        <div className="space-y-4">
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
            <h4 className="font-semibold text-blue-800 mb-2">When you sign up:</h4>
            <ul className="text-blue-700 space-y-1">
              <li>• Your name, username, email address, and password</li>
              <li>• Additional information for freelancers: your skills, experience, and portfolio details</li>
              <li>• Additional information for clients: your company information (if applicable), including company name and category</li>
            </ul>
          </div>
          
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
            <h4 className="font-semibold text-blue-800 mb-2">When you use our platform:</h4>
            <ul className="text-blue-700 space-y-1">
              <li>• Project details and requirements you post</li>
              <li>• Messages exchanged between freelancers and clients</li>
              <li>• Payment details and transaction history (note: we don't handle direct payment processing - clients and freelancers settle payments directly)</li>
            </ul>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
            <h4 className="font-semibold text-blue-800 mb-2">Automatically collected data:</h4>
            <ul className="text-blue-700 space-y-1">
              <li>• Technical details like IP addresses, browser type, and device information</li>
              <li>• Usage patterns and interactions with our website</li>
              <li>• Location data (approximate, based on IP address)</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'data-usage',
      title: 'How We Use Your Information',
      icon: <FileText className="w-6 h-6" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-700 mb-4">We use your data responsibly and transparently, primarily to:</p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white border border-blue-200 rounded-lg p-4 shadow-sm">
              <h4 className="font-semibold text-blue-800 mb-2">Core Services</h4>
              <ul className="text-gray-700 space-y-1 text-sm">
                <li>• Match freelancers with clients effectively</li>
                <li>• Provide secure communication channels</li>
                <li>• Facilitate project management</li>
              </ul>
            </div>
            <div className="bg-white border border-blue-200 rounded-lg p-4 shadow-sm">
              <h4 className="font-semibold text-blue-800 mb-2">Platform Improvement</h4>
              <ul className="text-gray-700 space-y-1 text-sm">
                <li>• Improve and personalize your experience</li>
                <li>• Analyze usage patterns to enhance functionality</li>
                <li>• Develop new features and services</li>
              </ul>
            </div>
            <div className="bg-white border border-blue-200 rounded-lg p-4 shadow-sm">
              <h4 className="font-semibold text-blue-800 mb-2">Support & Safety</h4>
              <ul className="text-gray-700 space-y-1 text-sm">
                <li>• Offer customer support and resolve issues</li>
                <li>• Prevent fraud and ensure platform security</li>
                <li>• Maintain account integrity</li>
              </ul>
            </div>
            <div className="bg-white border border-blue-200 rounded-lg p-4 shadow-sm">
              <h4 className="font-semibold text-blue-800 mb-2">Communication</h4>
              <ul className="text-gray-700 space-y-1 text-sm">
                <li>• Send important platform updates</li>
                <li>• Notify about relevant opportunities</li>
                <li>• Provide marketing communications (with consent)</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'data-sharing',
      title: 'Data Sharing and Disclosure',
      icon: <Users className="w-6 h-6" />,
      content: (
        <div className="space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800 font-semibold">⚠️ We do not sell your data to third parties.</p>
          </div>
          
          <p className="text-gray-700">Your information may only be shared under these specific conditions:</p>
          
          <div className="space-y-3">
            <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <h4 className="font-semibold text-green-800">With your explicit consent</h4>
                <p className="text-green-700 text-sm">We will always ask for your permission before sharing your data for purposes beyond our core services.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <h4 className="font-semibold text-yellow-800">Legal compliance</h4>
                <p className="text-yellow-700 text-sm">When required by law, court order, or to protect rights and safety of our users and the public.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <h4 className="font-semibold text-blue-800">Trusted service providers</h4>
                <p className="text-blue-700 text-sm">With carefully vetted third-party services essential for running our platform (e.g., hosting providers, analytics services), all bound by strict privacy agreements.</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'data-security',
      title: 'Data Security',
      icon: <Lock className="w-6 h-6" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">We implement comprehensive security measures to protect your data:</p>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">Technical Safeguards</h4>
                <ul className="text-blue-700 space-y-1 text-sm">
                  <li>• SSL/TLS encryption for data transmission</li>
                  <li>• Encrypted data storage</li>
                  <li>• Regular security audits and updates</li>
                  <li>• Secure backup systems</li>
                </ul>
              </div>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-semibold text-green-800 mb-2">Access Controls</h4>
                <ul className="text-green-700 space-y-1 text-sm">
                  <li>• Multi-factor authentication options</li>
                  <li>• Limited employee access on need-to-know basis</li>
                  <li>• Regular access reviews and monitoring</li>
                </ul>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <h4 className="font-semibold text-orange-800 mb-2">Your Role in Security</h4>
                <ul className="text-orange-700 space-y-1 text-sm">
                  <li>• Use strong, unique passwords</li>
                  <li>• Enable two-factor authentication</li>
                  <li>• Keep your account information updated</li>
                  <li>• Report suspicious activity immediately</li>
                </ul>
              </div>
              
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-gray-700 text-sm">
                  <strong>Important:</strong> While we implement industry-standard security measures, no online service can guarantee 100% security. We continuously work to enhance our security protocols.
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'cookies',
      title: 'Cookies and Tracking Technologies',
      icon: <Eye className="w-6 h-6" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">We use cookies and similar technologies to enhance your experience:</p>
          
          <div className="grid gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-2">Essential Cookies</h4>
              <p className="text-blue-700 text-sm">Required for basic platform functionality, security, and user authentication. These cannot be disabled.</p>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-semibold text-green-800 mb-2">Functional Cookies</h4>
              <p className="text-green-700 text-sm">Remember your preferences, settings, and personalization choices to improve your experience.</p>
            </div>
            
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h4 className="font-semibold text-purple-800 mb-2">Analytics Cookies</h4>
              <p className="text-purple-700 text-sm">Help us understand how you use our platform to improve performance and user experience.</p>
            </div>
          </div>
          
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-800 mb-2">Your Cookie Controls</h4>
            <p className="text-gray-700 text-sm mb-2">You can manage cookies through:</p>
            <ul className="text-gray-700 space-y-1 text-sm">
              <li>• Your browser settings (to block or delete cookies)</li>
              <li>• Our cookie preference center (accessible from any page)</li>
              <li>• Third-party opt-out tools for analytics services</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'user-rights',
      title: 'Your Privacy Rights',
      icon: <Shield className="w-6 h-6" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">You have comprehensive rights regarding your personal data:</p>
          
          <div className="grid gap-3">
            <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <Eye className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-blue-800">Right to Access</h4>
                <p className="text-blue-700 text-sm">Access and review all personal information we hold about you, including data sources and processing purposes.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-4 bg-green-50 rounded-lg border border-green-200">
              <FileText className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-green-800">Right to Rectification</h4>
                <p className="text-green-700 text-sm">Request corrections to any inaccurate, incomplete, or outdated information in your profile.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-4 bg-red-50 rounded-lg border border-red-200">
              <Lock className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-red-800">Right to Erasure</h4>
                <p className="text-red-700 text-sm">Ask us to delete your account and associated data, subject to legal and operational requirements.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-4 bg-purple-50 rounded-lg border border-purple-200">
              <Users className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-purple-800">Right to Portability</h4>
                <p className="text-purple-700 text-sm">Receive your data in a structured, machine-readable format to transfer to another service.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <Shield className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-yellow-800">Right to Object</h4>
                <p className="text-yellow-700 text-sm">Object to or limit the processing of your data for marketing, analytics, or other non-essential purposes.</p>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-600 text-white rounded-lg p-4">
            <h4 className="font-semibold mb-2">How to Exercise Your Rights</h4>
            <p className="text-blue-100 text-sm">Contact our privacy team at privacy@llmbeing.com or use the data controls in your account settings. We will respond within 30 days.</p>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
                <Shield className="w-12 h-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-xl text-blue-100 mb-2">LLMBeing</p>
            <p className="text-blue-200">Last Updated: December 21, 2024</p>
          </div>
        </div>
      </div>

      {/* Introduction */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-blue-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Welcome to LLMBeing!</h2>
          <p className="text-gray-700 text-lg leading-relaxed">
            Your privacy and trust matter deeply to us. This Privacy Policy explains clearly and simply what data we collect, 
            why we collect it, and how we use it when you interact with our freelancing platform. We believe in transparency 
            and giving you control over your personal information.
          </p>
        </div>

        {/* Expandable Sections */}
        <div className="space-y-4">
          {sections.map((section, index) => (
            <div key={section.id} className="bg-white rounded-xl shadow-lg border border-blue-100 overflow-hidden">
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-blue-50 transition-colors duration-200"
              >
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-100 rounded-full p-2 text-blue-600">
                    {section.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">{index + 1}. {section.title}</h3>
                  </div>
                </div>
                <div className="text-blue-600">
                  {expandedSections[section.id] ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
                </div>
              </button>
              
              {expandedSections[section.id] && (
                <div className="px-6 pb-6 border-t border-blue-100">
                  <div className="pt-4">
                    {section.content}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Additional Sections */}
        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-blue-100">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Children's Privacy</h3>
            <p className="text-gray-700 mb-3">
              LLMBeing is not intended for users under 18 years old. We do not knowingly collect data from children under 18.
            </p>
            <p className="text-gray-600 text-sm">
              If we become aware that we have collected personal information from a child under 18, we will take steps to delete such information promptly.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-blue-100">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Policy Updates</h3>
            <p className="text-gray-700 mb-3">
              We may occasionally update our Privacy Policy to reflect changes in our practices or legal requirements.
            </p>
            <p className="text-gray-600 text-sm">
              When significant changes occur, we will notify you clearly on our platform or via email before the changes take effect.
            </p>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl shadow-xl p-8 mt-8 text-white">
          <h3 className="text-2xl font-semibold mb-6 text-center">Contact Our Privacy Team</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                <Mail className="w-6 h-6" />
              </div>
              <h4 className="font-semibold mb-1">Email Us</h4>
              <p className="text-blue-100 text-sm">privacy@llmbeing.com</p>
            </div>
            <div className="text-center">
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                <Phone className="w-6 h-6" />
              </div>
              <h4 className="font-semibold mb-1">Call Us</h4>
              <p className="text-blue-100 text-sm">+1 (555) 123-4567</p>
            </div>
            <div className="text-center">
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                <MapPin className="w-6 h-6" />
              </div>
              <h4 className="font-semibold mb-1">Visit Us</h4>
              <p className="text-blue-100 text-sm">123 Privacy Street<br />Data City, DC 12345</p>
            </div>
          </div>
          <div className="text-center mt-6">
            <p className="text-blue-100 text-sm">
              We're committed to addressing your privacy concerns promptly and transparently.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 py-6 border-t border-blue-200">
          <p className="text-gray-600 text-sm">
            © 2024 LLMBeing. All rights reserved. | 
            <a href="#" className="text-blue-600 hover:text-blue-700 ml-1">Terms of Service</a> | 
            <a href="#" className="text-blue-600 hover:text-blue-700 ml-1">Cookie Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;