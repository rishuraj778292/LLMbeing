// import React from 'react'

// const CtaBanner = () => {
//   return (
//     <section id="final-cta" className="final-cta-section">
//     <h1>Join the Platform Built Exclusively for AI Work</h1>
//     <p>Post your first project or apply for one today – with zero commission and full freedom.</p>
//     <div className="cta-buttons">
//       <button className="cta-primary">🔵 Post a Project</button>
//       <button className="cta-secondary">⚪ Find AI Work</button>
//     </div>
//     <p className="small-text">Free to join. Direct payments. 100% AI-focused.</p>
//   </section>
//   )
// }

// export default CtaBanner

import React from 'react';
import { Rocket, Gem, Bot, Users, Briefcase, ArrowRight, Sparkles, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CtaBanner = () => {
  const navigate = useNavigate()
  return (
    <section className='px-5 py-5' >
     <div className="relative min-h-screen py-24 px-5 bg-gradient-to-br from-slate-950 via-blue-900 to-purple-950 overflow-hidden flex items-center justify-center rounded-2xl">
        {/* Enhanced Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-900/50 to-slate-950"></div>
      
      {/* Animated Background Orbs */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-gradient-to-r from-cyan-500/10 to-violet-500/10 rounded-full blur-3xl animate-bounce delay-2000"></div>
      
      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,black_70%,transparent_110%)]"></div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          >
            <div className="w-2 h-2 bg-white rounded-full opacity-20"></div>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 lg:px-8">
        {/* Glassmorphism Card */}
        <div className="relative bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-12 md:p-16 transform hover:scale-[1.02] transition-all duration-700 hover:border-white/30 hover:bg-white/10 max-w-6xl mx-auto">
          
          {/* Animated Border Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-blue-500/20 rounded-3xl blur-xl opacity-50 animate-pulse -z-10"></div>
          
          <div className="relative text-center">
            {/* Enhanced Badge */}
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-md rounded-full px-6 py-3 mb-8 border border-white/20 shadow-lg">
              <Zap className="w-5 h-5 text-blue-400 animate-pulse" />
              <span className="text-white/90 text-sm font-semibold tracking-wide">PLATFORM LIVE</span>
            </div>

            {/* Enhanced Main Title */}
            <div className="mb-8">
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-8 leading-[0.9] tracking-tight">
                <span className="block bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
                  Join the Platform
                </span>
                <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-blue-500 bg-clip-text text-transparent mt-2 relative">
                  Built Exclusively for AI Work
                  <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                </span>
              </h1>
            </div>

            {/* Enhanced Description */}
            <p className="text-xl sm:text-2xl md:text-3xl text-white/70 max-w-4xl mx-auto leading-relaxed font-light mb-12 transform hover:text-white/90 transition-colors duration-300">
              Post your first project or apply for one today – with{' '}
              <span className="font-semibold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                zero commission
              </span>{' '}
              and{' '}
              <span className="font-semibold bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
                full freedom
              </span>
            </p>

            {/* Enhanced CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              {/* Primary Button */}
              <button className="group relative w-full sm:w-auto min-w-[280px] bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 text-white font-bold px-10 py-5 rounded-2xl shadow-2xl transition-all duration-500 transform hover:scale-110 hover:shadow-blue-500/30 border border-blue-400/30 overflow-hidden" onClick={()=>navigate('/login')}>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-purple-700 to-blue-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
                <span className="relative z-10 flex items-center justify-center gap-3 text-lg">
                  <Briefcase className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
                  Post a Project
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
                </span>
              </button>

              {/* Secondary Button */}
              <button className="group relative w-full sm:w-auto min-w-[280px] bg-white/10 backdrop-blur-sm text-white font-bold px-10 py-5 rounded-2xl border border-white/30 shadow-xl transition-all duration-500 transform hover:scale-110 hover:bg-white/20 hover:border-blue-300/50 overflow-hidden" onClick={()=>navigate('/login')}>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative z-10 flex items-center justify-center gap-3 text-lg group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
                  Find AI Work
                </span>
              </button>
            </div>

            {/* Enhanced Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              {[
                { icon: Rocket, text: 'Free to join', color: 'from-blue-400 to-purple-400', bgColor: 'from-blue-500/20 to-purple-500/20' },
                { icon: Gem, text: 'Direct payments', color: 'from-purple-400 to-blue-500', bgColor: 'from-purple-500/20 to-blue-500/20' },
                { icon: Bot, text: '100% AI-focused', color: 'from-blue-500 to-purple-600', bgColor: 'from-blue-500/20 to-purple-600/20' }
              ].map((feature, index) => (
                <div 
                  key={index}
                  className="group relative bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-xl hover:shadow-blue-500/10 transition-all duration-700 ease-out transform hover:scale-105 hover:border-white/30 hover:bg-white/10"
                >
                  {/* Animated Border Effect */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-all duration-700 -z-10`}></div>
                  
                  <div className="relative">
                    {/* Enhanced Icon */}
                    <div className="relative mb-6">
                      <div className={`w-16 h-16 bg-gradient-to-br ${feature.bgColor} backdrop-blur-sm border border-white/20 rounded-2xl flex items-center justify-center group-hover:scale-125 group-hover:rotate-6 transition-all duration-500 shadow-xl mx-auto`}>
                        <feature.icon className="w-8 h-8 text-white group-hover:scale-110 transition-transform duration-300" />
                      </div>
                      {/* Icon Glow */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} rounded-2xl blur-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-500 -z-10`}></div>
                    </div>

                    <span className={`font-bold text-xl bg-gradient-to-r ${feature.color} bg-clip-text text-transparent group-hover:text-white transition-all duration-300 block`}>
                      {feature.text}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Enhanced Bottom Stats */}
            <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-xl">
              {/* Stats Background Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-blue-500/10 rounded-2xl blur-xl"></div>
              
              <div className="relative flex flex-col sm:flex-row gap-8 justify-center items-center text-white/80">
                <div className="group flex items-center hover:scale-105 transition-transform duration-300">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center mr-4 shadow-lg group-hover:shadow-blue-500/25">
                    <Briefcase className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-black text-white">1,000+</div>
                    <div className="text-sm font-medium text-white/70">Active Projects</div>
                  </div>
                </div>
                
                <div className="w-px h-12 bg-white/20 hidden sm:block"></div>
                
                <div className="group flex items-center hover:scale-105 transition-transform duration-300">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-blue-500 rounded-full flex items-center justify-center mr-4 shadow-lg group-hover:shadow-purple-500/25">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-black text-white">5,000+</div>
                    <div className="text-sm font-medium text-white/70">AI Professionals</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS for floating animation */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-10px) rotate(120deg); }
          66% { transform: translateY(5px) rotate(240deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
     </div>
    </section>
  );
};

export default CtaBanner;
