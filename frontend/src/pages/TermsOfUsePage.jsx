import React, { useState } from 'react';
import { ChevronDown, ChevronUp, FileText, User, Shield, CreditCard, Copyright, Ban, AlertTriangle, Scale, RefreshCcw, Gavel } from 'lucide-react';

const TermsOfUsePage = () => {
  const [expandedSections, setExpandedSections] = useState({});

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const sections = [
    {
      id: 'acceptance',
      title: 'Acceptance of Terms',
      icon: <FileText className="w-6 h-6" />,
      content: (
        <div className="space-y-4">
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
            <p className="text-blue-800 font-medium mb-2">By using LLMBeing, you agree to:</p>
            <ul className="text-blue-700 space-y-2">
              <li>• Comply with these Terms of Use in their entirety</li>
              <li>• Follow our Privacy Policy and data handling practices</li>
              <li>• Adhere to any additional guidelines we provide</li>
              <li>• Accept updates and modifications to these terms</li>
            </ul>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-yellow-800 mb-1">Important Notice</h4>
                <p className="text-yellow-700 text-sm">
                  If you do not agree with any part of these terms, you must discontinue use of our platform immediately.
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'user-accounts',
      title: 'User Accounts',
      icon: <User className="w-6 h-6" />,
      content: (
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-semibold text-green-800 mb-2">Account Creation Requirements</h4>
              <ul className="text-green-700 space-y-1 text-sm">
                <li>• Provide accurate and complete information</li>
                <li>• Use your real name and valid contact details</li>
                <li>• Verify your email address</li>
                <li>• Meet minimum age requirements (18+)</li>
                <li>• Maintain only one active account</li>
              </ul>
            </div>
            
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <h4 className="font-semibold text-orange-800 mb-2">Account Security</h4>
              <ul className="text-orange-700 space-y-1 text-sm">
                <li>• Keep login credentials confidential</li>
                <li>• Use strong, unique passwords</li>
                <li>• Enable two-factor authentication</li>
                <li>• Monitor account activity regularly</li>
                <li>• Report suspicious activity immediately</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Shield className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-red-800 mb-1">Your Responsibility</h4>
                <p className="text-red-700 text-sm">
                  You are fully responsible for all activities that occur under your account. 
                  Notify us immediately at <strong>security@llmbeing.com</strong> if you suspect unauthorized access.
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'platform-use',
      title: 'Use of Platform',
      icon: <Shield className="w-6 h-6" />,
      content: (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-2">Platform Purpose</h4>
            <p className="text-blue-700 text-sm mb-3">
              LLMBeing serves as a marketplace that facilitates connections between clients seeking AI solutions and freelancers offering AI expertise.
            </p>
            <div className="bg-blue-100 rounded-lg p-3">
              <p className="text-blue-800 text-sm font-medium">
                Important: We do not directly participate in the negotiation, execution, or fulfillment of agreements between users.
              </p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-semibold text-green-800 mb-2">Expected Conduct</h4>
              <ul className="text-green-700 space-y-1 text-sm">
                <li>• Maintain professional communication</li>
                <li>• Respect other users' time and expertise</li>
                <li>• Provide honest project descriptions</li>
                <li>• Deliver work as agreed upon</li>
                <li>• Resolve disputes amicably</li>
              </ul>
            </div>
            
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h4 className="font-semibold text-purple-800 mb-2">Platform Guidelines</h4>
              <ul className="text-purple-700 space-y-1 text-sm">
                <li>• Use appropriate language in all communications</li>
                <li>• Respect intellectual property rights</li>
                <li>• Follow project posting guidelines</li>
                <li>• Maintain confidentiality when required</li>
                <li>• Comply with applicable laws and regulations</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'payments',
      title: 'Payments',
      icon: <CreditCard className="w-6 h-6" />,
      content: (
        <div className="space-y-4">
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
            <h4 className="font-semibold text-yellow-800 mb-2">Payment Independence</h4>
            <p className="text-yellow-700 mb-3">
              LLMBeing operates as a <strong>zero-commission platform</strong>. Clients and freelancers manage all payment transactions independently.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-2">What This Means</h4>
              <ul className="text-blue-700 space-y-1 text-sm">
                <li>• No platform fees or commissions</li>
                <li>• Direct payment arrangements between parties</li>
                <li>• Users choose their preferred payment methods</li>
                <li>• Complete control over payment terms</li>
              </ul>
            </div>
            
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-2">Platform Role</h4>
              <ul className="text-gray-700 space-y-1 text-sm">
                <li>• We do not process payments</li>
                <li>• We do not hold funds in escrow</li>
                <li>• We do not mediate payment disputes</li>
                <li>• We do not guarantee payment completion</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-orange-800 mb-1">User Responsibility</h4>
                <p className="text-orange-700 text-sm">
                  Users are responsible for establishing secure payment methods, agreeing on payment terms, 
                  and ensuring compliance with applicable financial regulations.
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'intellectual-property',
      title: 'Intellectual Property',
      icon: <Copyright className="w-6 h-6" />,
      content: (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-2">Your Content Ownership</h4>
            <p className="text-blue-700 text-sm mb-3">
              You retain full ownership of all content you create, upload, or share on LLMBeing, including:
            </p>
            <ul className="text-blue-700 space-y-1 text-sm">
              <li>• Project descriptions and requirements</li>
              <li>• Portfolio items and work samples</li>
              <li>• Communications and messages</li>
              <li>• Deliverables and final work products</li>
            </ul>
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-semibold text-green-800 mb-2">License Granted to LLMBeing</h4>
            <p className="text-green-700 text-sm mb-3">
              By posting content on our platform, you grant LLMBeing a limited, non-exclusive license to:
            </p>
            <ul className="text-green-700 space-y-1 text-sm">
              <li>• Display your content within the platform</li>
              <li>• Promote and market platform services using your content</li>
              <li>• Make necessary technical modifications for platform functionality</li>
              <li>• Create aggregated, anonymized analytics</li>
            </ul>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h4 className="font-semibold text-purple-800 mb-2">Respect Others' IP</h4>
              <ul className="text-purple-700 space-y-1 text-sm">
                <li>• Don't upload copyrighted material without permission</li>
                <li>• Respect trademarks and proprietary information</li>
                <li>• Acknowledge sources and attributions</li>
                <li>• Report IP violations to our team</li>
              </ul>
            </div>
            
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h4 className="font-semibold text-red-800 mb-2">Platform Rights</h4>
              <ul className="text-red-700 space-y-1 text-sm">
                <li>• LLMBeing name, logo, and branding</li>
                <li>• Platform design and functionality</li>
                <li>• Proprietary algorithms and systems</li>
                <li>• All platform-generated content</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'prohibited-activities',
      title: 'Prohibited Activities',
      icon: <Ban className="w-6 h-6" />,
      content: (
        <div className="space-y-4">
          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg">
            <p className="text-red-800 font-medium mb-2">
              The following activities are strictly prohibited and may result in immediate account termination:
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h4 className="font-semibold text-red-800 mb-2">Fraudulent Activities</h4>
              <ul className="text-red-700 space-y-1 text-sm">
                <li>• Creating fake accounts or profiles</li>
                <li>• Misrepresenting skills or experience</li>
                <li>• Submitting false project requirements</li>
                <li>• Payment fraud or chargebacks</li>
                <li>• Identity theft or impersonation</li>
              </ul>
            </div>
            
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <h4 className="font-semibold text-orange-800 mb-2">Abusive Behavior</h4>
              <ul className="text-orange-700 space-y-1 text-sm">
                <li>• Harassment or intimidation of users</li>
                <li>• Discriminatory language or conduct</li>
                <li>• Spam or unsolicited communications</li>
                <li>• Threats or violent language</li>
                <li>• Doxxing or sharing private information</li>
              </ul>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-800 mb-2">Platform Misuse</h4>
              <ul className="text-yellow-700 space-y-1 text-sm">
                <li>• Attempting to circumvent platform systems</li>
                <li>• Scraping or unauthorized data collection</li>
                <li>• Interfering with platform functionality</li>
                <li>• Creating multiple accounts to evade restrictions</li>
                <li>• Reverse engineering platform code</li>
              </ul>
            </div>
            
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h4 className="font-semibold text-purple-800 mb-2">Illegal Activities</h4>
              <ul className="text-purple-700 space-y-1 text-sm">
                <li>• Any activity that violates local, state, or federal laws</li>
                <li>• Money laundering or financial crimes</li>
                <li>• Copyright or trademark infringement</li>
                <li>• Malware distribution or hacking</li>
                <li>• Adult content or inappropriate material</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-gray-800 text-white rounded-lg p-4">
            <h4 className="font-semibold mb-2">Enforcement Actions</h4>
            <p className="text-gray-300 text-sm">
              Violations may result in warnings, account suspension, permanent bans, or legal action. 
              We reserve the right to investigate suspected violations and cooperate with law enforcement when necessary.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'termination',
      title: 'Termination',
      icon: <AlertTriangle className="w-6 h-6" />,
      content: (
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-2">Your Right to Terminate</h4>
              <ul className="text-blue-700 space-y-1 text-sm">
                <li>• Delete your account at any time</li>
                <li>• Stop using platform services</li>
                <li>• Request data removal (subject to legal requirements)</li>
                <li>• Cancel active projects (with proper notice)</li>
              </ul>
            </div>
            
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h4 className="font-semibold text-red-800 mb-2">Our Right to Terminate</h4>
              <ul className="text-red-700 space-y-1 text-sm">
                <li>• Suspend accounts for Terms violations</li>
                <li>• Terminate accounts without prior notice</li>
                <li>• Remove content that violates policies</li>
                <li>• Discontinue platform services</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-semibold text-yellow-800 mb-2">Grounds for Termination</h4>
            <div className="grid md:grid-cols-2 gap-3">
              <ul className="text-yellow-700 space-y-1 text-sm">
                <li>• Violation of Terms of Use</li>
                <li>• Fraudulent or illegal activities</li>
                <li>• Abusive behavior toward other users</li>
                <li>• Multiple policy violations</li>
              </ul>
              <ul className="text-yellow-700 space-y-1 text-sm">
                <li>• Platform security threats</li>
                <li>• Failure to respond to support inquiries</li>
                <li>• Inactive accounts (after extended periods)</li>
                <li>• Business or legal requirements</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-800 mb-2">Effects of Termination</h4>
            <ul className="text-gray-700 space-y-1 text-sm">
              <li>• Immediate loss of platform access</li>
              <li>• Removal of profile and posted content</li>
              <li>• Forfeiture of any platform benefits or credits</li>
              <li>• Continued obligation to fulfill existing contractual commitments with other users</li>
              <li>• Certain provisions of these Terms may survive termination</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'disclaimer',
      title: 'Disclaimer of Liability',
      icon: <Scale className="w-6 h-6" />,
      content: (
        <div className="space-y-4">
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
            <h4 className="font-semibold text-yellow-800 mb-2">"As-Is" Service Provision</h4>
            <p className="text-yellow-700 text-sm">
              LLMBeing is provided on an "as-is" and "as-available" basis without warranties of any kind, 
              either express or implied, including but not limited to merchantability, fitness for a particular purpose, or non-infringement.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h4 className="font-semibold text-red-800 mb-2">No Liability For</h4>
              <ul className="text-red-700 space-y-1 text-sm">
                <li>• Disputes between users</li>
                <li>• Quality of work or services provided by freelancers</li>
                <li>• Payment issues or defaults</li>
                <li>• Loss of data or business opportunities</li>
                <li>• Platform downtime or technical issues</li>
                <li>• Third-party actions or services</li>
              </ul>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-2">User Responsibility</h4>
              <ul className="text-blue-700 space-y-1 text-sm">
                <li>• Verify credentials and qualifications</li>
                <li>• Conduct due diligence on potential partners</li>
                <li>• Maintain appropriate insurance coverage</li>
                <li>• Backup important data regularly</li>
                <li>• Use platform at your own risk</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-gray-800 text-white rounded-lg p-4">
            <h4 className="font-semibold text-white mb-2">Limitation of Damages</h4>
            <p className="text-gray-300 text-sm">
              In no event shall LLMBeing be liable for any indirect, incidental, special, consequential, or punitive damages, 
              including but not limited to loss of profits, data, use, goodwill, or other intangible losses, 
              resulting from your use of the platform.
            </p>
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
                <Gavel className="w-12 h-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms of Use</h1>
            <p className="text-xl text-blue-100 mb-2">LLMBeing</p>
            <p className="text-blue-200">Last Updated: December 21, 2024</p>
          </div>
        </div>
      </div>

      {/* Introduction */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-blue-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Welcome to LLMBeing</h2>
          <p className="text-gray-700 text-lg leading-relaxed mb-4">
            By accessing and using our platform, you agree to comply with the following Terms of Use. 
            These terms constitute a legally binding agreement between you and LLMBeing.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-800 font-medium">
              📖 Please read these terms carefully before using our platform. 
              Your continued use indicates your acceptance of all terms and conditions outlined below.
            </p>
          </div>
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

        {/* Additional Important Sections */}
        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-blue-100">
            <div className="flex items-center mb-4">
              <RefreshCcw className="w-6 h-6 text-blue-600 mr-3" />
              <h3 className="text-xl font-semibold text-gray-800">Amendments</h3>
            </div>
            <p className="text-gray-700 mb-3">
              These Terms of Use may be updated from time to time to reflect changes in our services, 
              legal requirements, or business practices.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-blue-700 text-sm">
                We will notify you of significant changes through platform notifications or email. 
                Continued use after changes indicates acceptance of the new terms.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-blue-100">
            <div className="flex items-center mb-4">
              <Scale className="w-6 h-6 text-blue-600 mr-3" />
              <h3 className="text-xl font-semibold text-gray-800">Governing Law</h3>
            </div>
            <p className="text-gray-700 mb-3">
              These Terms of Use are governed by and construed in accordance with the laws of 
              the State of Delaware, United States.
            </p>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
              <p className="text-gray-600 text-sm">
                Any disputes arising from these terms will be resolved through binding arbitration 
                in accordance with the rules of the American Arbitration Association.
              </p>
            </div>
          </div>
        </div>

        {/* Contact and Support */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl shadow-xl p-8 mt-8 text-white">
          <h3 className="text-2xl font-semibold mb-6 text-center">Questions About These Terms?</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="text-center">
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                <FileText className="w-6 h-6" />
              </div>
              <h4 className="font-semibold mb-2">Legal Team</h4>
              <p className="text-blue-100 text-sm mb-2">legal@llmbeing.com</p>
              <p className="text-blue-200 text-xs">For legal questions and clarifications</p>
            </div>
            <div className="text-center">
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                <Shield className="w-6 h-6" />
              </div>
              <h4 className="font-semibold mb-2">Support Team</h4>
              <p className="text-blue-100 text-sm mb-2">support@llmbeing.com</p>
              <p className="text-blue-200 text-xs">For general inquiries and assistance</p>
            </div>
          </div>
          <div className="text-center mt-6">
            <p className="text-blue-100 text-sm">
              We're here to help you understand and comply with these terms.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 py-6 border-t border-blue-200">
          <p className="text-gray-600 text-sm">
            © 2024 LLMBeing. All rights reserved. | 
            <a href="#" className="text-blue-600 hover:text-blue-700 ml-1">Privacy Policy</a> | 
            <a href="#" className="text-blue-600 hover:text-blue-700 ml-1">About Us</a> | 
            <a href="#" className="text-blue-600 hover:text-blue-700 ml-1">Contact Us</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsOfUsePage;