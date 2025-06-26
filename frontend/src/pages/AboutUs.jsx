import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Zap, Users, Target, Heart, Shield, Star, Award, Globe, Bot, Lightbulb, CheckCircle } from 'lucide-react';

const AboutUs = () => {
  const [expandedSections, setExpandedSections] = useState({});

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const features = [
    {
      icon: <Users className="w-8 h-8" />,
      title: "Specialized Talent",
      description: "Our freelancers are rigorously vetted and possess proven expertise in various AI disciplines, ensuring quality and reliability.",
      details: [
        "Expert screening process with technical assessments",
        "Proven track record in AI/ML projects",
        "Continuous skill verification and updates",
        "Specialized in cutting-edge AI technologies"
      ]
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Zero Commission Platform",
      description: "We stand apart from traditional platforms by facilitating direct client-freelancer engagements without commission fees.",
      details: [
        "No hidden fees or commission charges",
        "Direct payment between clients and freelancers",
        "Transparent pricing structure",
        "Maximum value for both parties"
      ]
    },
    {
      icon: <Star className="w-8 h-8" />,
      title: "User-Friendly Experience",
      description: "Our intuitive interface makes it easy to post projects, communicate clearly, and manage collaborations effortlessly.",
      details: [
        "Streamlined project posting process",
        "Built-in communication tools",
        "Project management dashboard",
        "Mobile-responsive design"
      ]
    }
  ];

  const values = [
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Trust & Transparency",
      description: "We uphold transparency at every step, from project posting to project completion.",
      color: "blue"
    },
    {
      icon: <Lightbulb className="w-6 h-6" />,
      title: "Innovation & Quality",
      description: "We foster an environment of continuous learning, creativity, and high standards.",
      color: "purple"
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: "Client-Focused Service",
      description: "Your success is our success. We prioritize your satisfaction and actively support your journey through responsive customer care.",
      color: "green"
    }
  ];

  const stats = [
    { number: "10,000+", label: "AI Experts", icon: <Users className="w-6 h-6" /> },
    { number: "50,000+", label: "Projects Completed", icon: <CheckCircle className="w-6 h-6" /> },
    { number: "95%", label: "Client Satisfaction", icon: <Star className="w-6 h-6" /> },
    { number: "100+", label: "Countries", icon: <Globe className="w-6 h-6" /> }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
                <Bot className="w-12 h-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">About LLMBeing</h1>
            <p className="text-xl text-blue-100 mb-2">The Leading AI Freelance Platform</p>
            <p className="text-blue-200 max-w-2xl mx-auto">
              Connecting visionary clients with top-tier AI talent from around the globe
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Introduction */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12 border border-blue-100">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Welcome to LLMBeing</h2>
            <p className="text-lg text-gray-700 max-w-4xl mx-auto leading-relaxed">
              Welcome to LLMBeing, the leading freelance platform dedicated exclusively to AI projects and solutions. 
              At LLMBeing, we connect visionary clients with top-tier AI talent from around the globe. Whether you're 
              looking to build an intelligent chatbot, automate business processes, or explore cutting-edge AI solutions, 
              our platform is designed to help you achieve your goals seamlessly.
            </p>
          </div>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center p-4 bg-blue-50 rounded-xl border border-blue-200">
                <div className="flex justify-center mb-2 text-blue-600">
                  {stat.icon}
                </div>
                <div className="text-2xl font-bold text-blue-700">{stat.number}</div>
                <div className="text-sm text-blue-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Mission Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-blue-100">
          <div className="flex items-center mb-6">
            <div className="bg-blue-100 rounded-full p-3 mr-4">
              <Target className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Our Mission</h2>
          </div>
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              Our mission is simple yet powerful: <span className="font-semibold text-blue-700">to democratize access to artificial intelligence expertise</span>. 
              We believe that innovative AI-driven solutions shouldn't be limited to those with deep technical knowledge.
            </p>
            <p className="text-gray-700">
              At LLMBeing, everyone—from startups to large enterprises—can find the right AI freelancer to bring their vision to life.
            </p>
          </div>
        </div>

        {/* Why Choose LLMBeing */}
        <div className="mb-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Why Choose LLMBeing?</h2>
            <p className="text-gray-600">Discover what makes us the preferred platform for AI projects</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg border border-blue-100 overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="p-6">
                  <div className="bg-blue-100 rounded-full p-3 w-16 h-16 flex items-center justify-center mb-4 text-blue-600">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">{feature.title}</h3>
                  <p className="text-gray-700 mb-4">{feature.description}</p>
                  
                  <button
                    onClick={() => toggleSection(`feature-${index}`)}
                    className="flex items-center text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Learn More
                    {expandedSections[`feature-${index}`] ? 
                      <ChevronUp className="w-4 h-4 ml-1" /> : 
                      <ChevronDown className="w-4 h-4 ml-1" />
                    }
                  </button>
                  
                  {expandedSections[`feature-${index}`] && (
                    <div className="mt-4 pt-4 border-t border-blue-100">
                      <ul className="space-y-2">
                        {feature.details.map((detail, detailIndex) => (
                          <li key={detailIndex} className="flex items-start">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-700">{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Values Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-blue-100">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="bg-blue-100 rounded-full p-3">
                <Heart className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Our Values</h2>
            <p className="text-gray-600">The principles that guide everything we do</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {values.map((value, index) => {
              const colorClasses = {
                blue: 'bg-blue-50 border-blue-200 text-blue-800',
                purple: 'bg-purple-50 border-purple-200 text-purple-800',
                green: 'bg-green-50 border-green-200 text-green-800'
              };
              
              const iconColorClasses = {
                blue: 'text-blue-600 bg-blue-100',
                purple: 'text-purple-600 bg-purple-100',
                green: 'text-green-600 bg-green-100'
              };
              
              return (
                <div key={index} className={`${colorClasses[value.color]} rounded-xl p-6 border`}>
                  <div className={`${iconColorClasses[value.color]} rounded-full p-2 w-10 h-10 flex items-center justify-center mb-4`}>
                    {value.icon}
                  </div>
                  <h3 className="text-lg font-semibold mb-3">{value.title}</h3>
                  <p className="text-sm opacity-90">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Join Community Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl shadow-xl p-8 text-white mb-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
                <Users className="w-12 h-12 text-white" />
              </div>
            </div>
            <h2 className="text-3xl font-bold mb-4">Join Our Community</h2>
            <p className="text-xl text-blue-100 mb-6 max-w-3xl mx-auto">
              Whether you're an AI enthusiast, a seasoned expert, or someone eager to discover what AI can do for you, 
              LLMBeing welcomes you. Let's build the future together, one intelligent solution at a time.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 mt-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <Bot className="w-10 h-10 text-white mx-auto mb-3" />
                <h3 className="font-semibold mb-2">AI Enthusiasts</h3>
                <p className="text-blue-100 text-sm">Discover the limitless possibilities of artificial intelligence</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <Award className="w-10 h-10 text-white mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Seasoned Experts</h3>
                <p className="text-blue-100 text-sm">Share your expertise and work on cutting-edge projects</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <Lightbulb className="w-10 h-10 text-white mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Innovation Seekers</h3>
                <p className="text-blue-100 text-sm">Transform your business with AI-powered solutions</p>
              </div>
            </div>
            
            <div className="mt-8">
              <button className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-blue-50 transition-colors duration-200 mr-4">
                Get Started Today
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white/10 transition-colors duration-200">
                Learn More
              </button>
            </div>
          </div>
        </div>

        {/* Thank You Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-blue-100">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-full p-3">
                <Heart className="w-8 h-8 text-white" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Thank You for Choosing LLMBeing</h2>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              Where AI innovation meets human ingenuity. Together, we're shaping the future of intelligent solutions.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 py-6 border-t border-blue-200">
          <p className="text-gray-600 text-sm">
            © 2024 LLMBeing. All rights reserved. | 
            <a href="#" className="text-blue-600 hover:text-blue-700 ml-1">Privacy Policy</a> | 
            <a href="#" className="text-blue-600 hover:text-blue-700 ml-1">Terms of Service</a> |
            <a href="#" className="text-blue-600 hover:text-blue-700 ml-1">Contact Us</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;