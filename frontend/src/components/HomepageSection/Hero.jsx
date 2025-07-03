
import { assets } from "../../assets/assets";
import { useNavigate } from "react-router-dom";
const Hero = () => {
   const navigate = useNavigate();
  return (
    <section className="relative h-screen w-full overflow-hidden px-5">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 top-2  left-5 right-5 bottom-5 rounded-2xl overflow-hidden">
        <img 
          src={assets.hero_img} 
          alt="AI Future Background" 
          className="h-full w-full object-fit"
        />
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40"></div>
        {/* Gradient overlay for modern look */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/30 via-transparent to-blue-900/30"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 flex h-full items-center justify-center px-4 sm:px-6 lg:px-8 ">
        <div className="max-w-7xl mx-auto text-center">
          {/* Main Headlines */}
          <div className="space-y-4 mb-8">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white leading-tight">
              <span className="block bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                Build the Future
              </span>
              <span className="block bg-gradient-to-r from-purple-200 via-blue-200 to-white bg-clip-text text-transparent">
                with AI
              </span>
            </h1>
            
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white/90 leading-tight px-4">
              Hire or Work on Cutting-Edge AI Projects
            </h2>
          </div>
          
          {/* Subtitle */}
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/80 max-w-4xl mx-auto mb-12 px-4 leading-relaxed">
            AI Agents, Automation, LLM Apps, and More – Trusted by Innovators and AI Freelancers Worldwide.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center px-4">
            <button className="group relative w-full sm:w-auto min-w-[200px] bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold px-8 py-4 rounded-xl shadow-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-purple-500/25 border border-purple-400/30" onClick={()=>navigate('/login')}>
              <span className="relative z-10">Post a Project</span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-blue-700 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
            
            <button className="group relative w-full sm:w-auto min-w-[200px] bg-white/10 backdrop-blur-sm text-white font-semibold px-8 py-4 rounded-xl border border-white/30 shadow-2xl transition-all duration-300 transform hover:scale-105 hover:bg-white hover:text-gray-900" onClick={()=>navigate('/login')}>
              <span className="relative z-10">Find AI Work</span>
            </button>
          </div>
          
          {/* Floating Elements for Visual Appeal */}
          <div className="absolute top-1/4 left-10 w-20 h-20 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full blur-xl animate-pulse hidden lg:block"></div>
          <div className="absolute bottom-1/4 right-10 w-32 h-32 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-xl animate-pulse hidden lg:block"></div>
          <div className="absolute top-1/3 right-1/4 w-16 h-16 bg-gradient-to-r from-white/10 to-purple-500/20 rounded-full blur-lg animate-bounce hidden xl:block"></div>
        </div>
      </div>
      

    </section>
  );
};

export default Hero;