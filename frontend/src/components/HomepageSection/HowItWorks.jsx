
import { useState } from 'react';
import { ArrowRight, Users, Briefcase, Zap, CheckCircle, Star, TrendingUp, Sparkles, ArrowDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
const HowItWorks = () => {
  const [activeTab, setActiveTab] = useState('clients');
  const navigate = useNavigate();

  const clientSteps = [
    {
      number: '01',
      title: 'Post Your AI Project',
      description: 'Describe your vision with our intelligent project builder. Get matched with verified AI specialists instantly.',
      icon: <Briefcase className="w-8 h-8" />,
      color: 'from-emerald-500 to-teal-500',
      bgColor: 'from-emerald-500/20 to-teal-500/20',
    },
    {
      number: '02',
      title: 'Receive Expert Proposals',
      description: 'Review proposals from pre-vetted AI freelancers. Compare expertise, portfolios, and direct communication.',
      icon: <Users className="w-8 h-8" />,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'from-blue-500/20 to-cyan-500/20',
    },
    {
      number: '03',
      title: 'Collaborate & Pay Direct',
      description: 'Work together seamlessly and pay however you prefer - no platform fees or hidden charges.',
      icon: <TrendingUp className="w-8 h-8" />,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'from-purple-500/20 to-pink-500/20',
    }
  ];

  const freelancerSteps = [
    {
      number: '01',
      title: 'Create Your AI Profile',
      description: 'Showcase your AI expertise with portfolio examples. Our algorithm surfaces your skills to ideal clients.',
      icon: <Star className="w-8 h-8" />,
      color: 'from-amber-500 to-orange-500',
      bgColor: 'from-amber-500/20 to-orange-500/20',
    },
    {
      number: '02',
      title: 'Browse Premium Projects',
      description: 'Access exclusive AI-only projects from serious clients. No more competing on generic platforms.',
      icon: <Zap className="w-8 h-8" />,
      color: 'from-violet-500 to-purple-500',
      bgColor: 'from-violet-500/20 to-purple-500/20',
    },
    {
      number: '03',
      title: 'Keep 100% of Earnings',
      description: 'Work directly with clients and receive full payment. Build long-term relationships without interference.',
      icon: <CheckCircle className="w-8 h-8" />,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'from-green-500/20 to-emerald-500/20',
    }
  ];

  return (
    <section className="relative py-24 px-5 bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950 overflow-hidden" id='howitworks'>
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-slate-900/50 to-slate-950"></div>
      
      {/* Animated Background Orbs */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-gradient-to-r from-pink-500/10 to-violet-500/10 rounded-full blur-3xl animate-bounce delay-2000"></div>
      
      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,black_70%,transparent_110%)]"></div>

      <div className="relative z-10 container mx-auto px-4 lg:px-8">
        {/* Enhanced Section Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-md rounded-full px-6 py-3 mb-8 border border-white/20 shadow-lg">
            <Sparkles className="w-5 h-5 text-cyan-400 animate-pulse" />
            <span className="text-white/90 text-sm font-semibold tracking-wide">SIMPLE PROCESS</span>
          </div>
          
          <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-8 leading-[0.9] tracking-tight">
            <span className="block bg-gradient-to-r from-white via-cyan-200 to-purple-200 bg-clip-text text-transparent">
              Get Started in
            </span>
            <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent mt-2 relative">
              3 Simple Steps
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full"></div>
            </span>
          </h2>
          
          <p className="text-xl sm:text-2xl md:text-3xl text-white/70 max-w-4xl mx-auto leading-relaxed font-light">
            Whether you're hiring AI talent or offering expertise, our streamlined process connects you in minutes.
          </p>
        </div>

        {/* Enhanced Tab Switcher */}
        <div className="flex justify-center mb-20">
          <div className="relative bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-2 shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-2xl blur-xl"></div>
            <div className="relative flex">
              <button
                onClick={() => setActiveTab('clients')}
                className={`relative px-10 py-5 rounded-xl font-bold text-lg transition-all duration-500 ${
                  activeTab === 'clients'
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-2xl shadow-purple-500/30 scale-105'
                    : 'text-white/70 hover:text-white hover:bg-white/10 hover:scale-102'
                }`}
              >
                For Clients
                {activeTab === 'clients' && (
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-400/30 to-blue-400/30 rounded-xl blur-lg"></div>
                )}
              </button>
              <button
                onClick={() => setActiveTab('freelancers')}
                className={`relative px-10 py-5 rounded-xl font-bold text-lg transition-all duration-500 ${
                  activeTab === 'freelancers'
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-2xl shadow-purple-500/30 scale-105'
                    : 'text-white/70 hover:text-white hover:bg-white/10 hover:scale-102'
                }`}
              >
                For Freelancers
                {activeTab === 'freelancers' && (
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-400/30 to-blue-400/30 rounded-xl blur-lg"></div>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Steps with Flow Indicators */}
        <div className="relative max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
            {(activeTab === 'clients' ? clientSteps : freelancerSteps).map((step, index) => (
              <div key={`${activeTab}-${index}`} className="group relative">
                {/* Step Card */}
                <div className="relative bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 p-10 rounded-3xl shadow-2xl hover:shadow-purple-500/10 transition-all duration-700 ease-out transform hover:scale-105 hover:border-white/30 hover:bg-white/10">
                  {/* Animated Border Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-cyan-500/20 to-purple-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-700 -z-10 animate-pulse"></div>
                  
                  <div className="relative">
                    {/* Enhanced Step Number */}
                    <div className="absolute -top-6 -left-6 w-16 h-16 bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-white/20 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-2xl group-hover:scale-110 transition-transform duration-500">
                      <div className={`absolute inset-0 bg-gradient-to-br ${step.color} rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500`}></div>
                      <span className="relative z-10">{step.number}</span>
                    </div>

                    {/* Enhanced Icon */}
                    <div className="relative mb-8">
                      <div className={`w-20 h-20 bg-gradient-to-br ${step.bgColor} backdrop-blur-sm border border-white/20 rounded-3xl flex items-center justify-center group-hover:scale-125 group-hover:rotate-6 transition-all duration-500 shadow-xl`}>
                        <div className={`text-white group-hover:scale-110 transition-transform duration-300`}>
                          {step.icon}
                        </div>
                      </div>
                      {/* Icon Glow */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${step.color} rounded-3xl blur-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-500 -z-10`}></div>
                    </div>

                    {/* Enhanced Content */}
                    <h3 className="text-3xl sm:text-4xl font-black mb-6 text-white group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-cyan-300 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-500">
                      {step.title}
                    </h3>
                    <p className="text-white/60 text-lg mb-8 leading-relaxed group-hover:text-white/80 transition-colors duration-500 min-h-[5rem] font-light">
                      {step.description}
                    </p>

                    {/* Enhanced Action Indicator */}
                    <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:translate-x-2">
                      <span className="text-cyan-400 font-semibold">Learn More</span>
                      <ArrowRight className="w-5 h-5 text-cyan-400 group-hover:translate-x-2 transition-transform duration-300" />
                    </div>
                  </div>
                </div>

                {/* Flow Arrow */}
                {index < 2 && (
                  <div className="hidden lg:flex absolute top-1/2 -right-8 transform -translate-y-1/2 z-20">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 backdrop-blur-sm border border-white/10 rounded-full flex items-center justify-center shadow-lg">
                      <ArrowRight className="w-6 h-6 text-cyan-400" />
                    </div>
                  </div>
                )}

                {/* Mobile Flow Arrow */}
                {index < 2 && (
                  <div className="lg:hidden flex justify-center my-8">
                    <div className="w-12 h-12 bg-gradient-to-b from-purple-500/20 to-cyan-500/20 backdrop-blur-sm border border-white/10 rounded-full flex items-center justify-center shadow-lg">
                      <ArrowDown className="w-5 h-5 text-cyan-400" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Enhanced Bottom CTA Section */}
        <div className="text-center mt-24">
          <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-12 shadow-2xl max-w-4xl mx-auto">
            {/* CTA Background Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-cyan-500/10 to-purple-500/10 rounded-3xl blur-2xl"></div>
            
            <div className="relative">
              <h3 className="text-4xl sm:text-5xl font-black mb-6">
                <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Ready to Transform Your
                </span>
                <br />
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                  AI Journey?
                </span>
              </h3>
              <p className="text-white/70 text-xl mb-10 leading-relaxed max-w-2xl mx-auto font-light">
                Join thousands of AI professionals and companies building the future together. Zero fees, maximum results.
              </p>
              
              {/* Enhanced CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <button className="group relative w-full sm:w-auto min-w-[250px] bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 text-white font-bold px-10 py-5 rounded-2xl shadow-2xl transition-all duration-500 transform hover:scale-110 hover:shadow-purple-500/30 border border-purple-400/30 overflow-hidden" onClick={()=>navigate('/login')}>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-700 via-blue-700 to-cyan-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
                  <span className="relative z-10 flex items-center justify-center gap-3 text-lg">
                    Start Building Today
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
                  </span>
                </button>
                
                <button className="group relative w-full sm:w-auto min-w-[250px] bg-white/10 backdrop-blur-sm text-white font-bold px-10 py-5 rounded-2xl border border-white/30 shadow-xl transition-all duration-500 transform hover:scale-110 hover:bg-white/20 hover:border-white/50 overflow-hidden" onClick={()=>navigate('/login')}>
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative z-10 text-lg group-hover:bg-gradient-to-r group-hover:from-cyan-400 group-hover:to-purple-400 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                    Explore Projects
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;