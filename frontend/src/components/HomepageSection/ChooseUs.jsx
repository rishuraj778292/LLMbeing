import React from 'react';
import { Brain, DollarSign, MessageCircle, Users, Sparkles, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ChooseUs = () => {
  const navigate = useNavigate()
  const features = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: 'AI-Only Focus',
      description: 'No distractions — just AI, ML, and automation excellence.',
      color: 'from-purple-500 to-indigo-600',
      bgGradient: 'from-purple-50 to-indigo-50',
      borderColor: 'border-purple-200',
      shadowColor: 'hover:shadow-purple-200/50',
    },
    {
      icon: <DollarSign className="w-8 h-8" />,
      title: '0% Commission',
      description: 'Work freely. Get paid fully. Zero interference guaranteed.',
      color: 'from-emerald-500 to-teal-600',
      bgGradient: 'from-emerald-50 to-teal-50',
      borderColor: 'border-emerald-200',
      shadowColor: 'hover:shadow-emerald-200/50',
    },
    {
      icon: <MessageCircle className="w-8 h-8" />,
      title: 'Real-Time Chat',
      description: 'Direct messaging to move fast, communicate clearly.',
      color: 'from-blue-500 to-cyan-600',
      bgGradient: 'from-blue-50 to-cyan-50',
      borderColor: 'border-blue-200',
      shadowColor: 'hover:shadow-blue-200/50',
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Curated Talent',
      description: 'Elite AI freelancers only — no generic, low-quality gigs.',
      color: 'from-amber-500 to-orange-600',
      bgGradient: 'from-amber-50 to-orange-50',
      borderColor: 'border-amber-200',
      shadowColor: 'hover:shadow-amber-200/50',
    },
  ];

  return (
    <section
      id="why-choose-us"
      className="relative py-24 bg-gradient-to-br from-slate-50 via-white to-blue-50 overflow-hidden"
    >
      {/* Subtle Background Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-purple-200/30 to-blue-200/30 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-cyan-200/30 to-purple-200/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-gradient-to-r from-pink-200/20 to-violet-200/20 rounded-full blur-3xl animate-bounce delay-2000"></div>
      
      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,black_40%,transparent_100%)]"></div>

      <div className="relative z-10 container mx-auto px-6 lg:px-20">
        {/* Enhanced Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-white/80 to-slate-50/80 backdrop-blur-sm rounded-full px-6 py-3 mb-8 border border-slate-200 shadow-lg">
            <Sparkles className="w-5 h-5 text-purple-500 animate-pulse" />
            <span className="text-slate-600 text-sm font-bold tracking-wide uppercase">Why Choose Us</span>
            <Zap className="w-4 h-4 text-blue-500" />
          </div>

          <h2 className="text-5xl sm:text-6xl md:text-7xl font-black mb-6 leading-tight">
            <span className="block bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Built for the Future
            </span>
            <span className="block bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent mt-2 relative">
              of AI Freelancing
              <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-40 h-1 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full"></div>
            </span>
          </h2>

          <p className="text-xl sm:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-light">
            Experience the next generation of freelance collaboration designed specifically for AI professionals.
          </p>
        </div>

        {/* Enhanced Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, i) => (
            <div
              key={i}
              className="group relative"
              style={{
                animation: `fadeInUp 0.8s ease-out ${i * 0.2}s both`
              }}
            >
              {/* Card */}
              <div className={`relative bg-gradient-to-br ${feature.bgGradient} backdrop-blur-sm p-8 rounded-3xl text-center shadow-lg ${feature.shadowColor} hover:shadow-2xl ${feature.borderColor} border-2 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 overflow-hidden`}>
                
                {/* Animated Background Effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-3xl`}></div>
                
                {/* Shimmer Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
                
                <div className="relative">
                  {/* Enhanced Icon Container */}
                  <div className="relative mb-6 flex justify-center">
                    <div className={`w-20 h-20 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                      <div className="text-white group-hover:scale-110 transition-transform duration-300">
                        {feature.icon}
                      </div>
                    </div>
                    
                    {/* Icon Glow */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500 -z-10`}></div>
                  </div>

                  {/* Enhanced Content */}
                  <h3 className="text-2xl sm:text-3xl font-black mb-4 text-slate-800 group-hover:bg-gradient-to-r group-hover:from-slate-800 group-hover:to-slate-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                    {feature.title}
                  </h3>
                  
                  <p className="text-slate-600 text-base leading-relaxed group-hover:text-slate-700 transition-colors duration-300 font-medium">
                    {feature.description}
                  </p>

                  {/* Hover Indicator */}
                  <div className="mt-6 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <div className={`w-12 h-1 bg-gradient-to-r ${feature.color} rounded-full mx-auto`}></div>
                  </div>
                </div>

                {/* Corner Accent */}
              
              </div>

              {/* Card Reflection */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.bgGradient} rounded-3xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 -z-10 transform scale-95`}></div>
            </div>
          ))}
        </div>

        {/* Enhanced Bottom Section */}
        <div className="mt-20 text-center">
          <div className="relative bg-gradient-to-r from-white/80 to-slate-50/80 backdrop-blur-xl border-2 border-slate-200 rounded-3xl p-10 shadow-xl max-w-4xl mx-auto">
            {/* Background Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-100/50 via-blue-100/50 to-cyan-100/50 rounded-3xl blur-2xl opacity-50"></div>
            
            <div className="relative">
              <h3 className="text-3xl sm:text-4xl font-black mb-4">
                <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  Ready to Experience the Difference?
                </span>
              </h3>
              <p className="text-slate-600 text-lg mb-8 leading-relaxed max-w-2xl mx-auto">
                Join the AI freelancing revolution where talent meets opportunity without barriers.
              </p>
              
                <button className="group relative bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 text-white font-bold px-10 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 overflow-hidden" onClick={()=>navigate('/login')}>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-700 via-blue-700 to-cyan-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Get Started Today
                  <Sparkles className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
};

export default ChooseUs;