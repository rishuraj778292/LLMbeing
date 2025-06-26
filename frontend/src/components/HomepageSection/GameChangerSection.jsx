// import React from 'react'

// const GameChangerSection = () => {
//   return (
//     <section id="game-changer" className="h-screen mt-20 bg-gradient-to-r from-blue-500 to-purple-600 text-white flex flex-col items-center justify-center px-8 py-16 rounded-2xl shadow-lg">
//     <h2 className="text-4xl font-bold mb-6 text-center">Keep What You Earn. Pay What You Agree.</h2>
//     <p className="text-lg mb-8 text-center max-w-3xl">
//       We don’t charge a single cent in commissions. Freelancers and clients settle directly — with zero interference.
//     </p>
//     <ul className="list-disc list-inside text-left space-y-4 max-w-2xl">
//       <li className="text-lg">Freelancers keep 100% of what they earn</li>
//       <li className="text-lg">Clients avoid platform cuts and hidden fees</li>
//       <li className="text-lg">Use your own payment method (UPI, PayPal, Wire, etc.)</li>
//       <li className="text-lg">Work transparently, without middlemen</li>
//     </ul>
//     <div className="testimonial-banner bg-white text-black mt-10 p-6 rounded-xl shadow-md max-w-2xl text-center">
//       💬 <span className="italic">“I made ₹60,000 in a week and received 100% of it – no cuts, no delays.”</span> — <strong>Neha R., Prompt Engineer</strong>
//     </div>
//   </section>

//   )
// }

// export default GameChangerSection


import { motion } from 'framer-motion';
import { assets } from '../../assets/assets';
import { useNavigate } from 'react-router-dom';

const textVariant = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.3,
      duration: 0.8,
      ease: "easeOut",
    },
  }),
};

const GameChangerSection = () => {
  const navigate = useNavigate();
  return (
    <section
      id="game-changer"
      className="min-h-screen px-5 py-5"
    >
      <div className="relative  bg-black text-white flex flex-col items-center justify-center  overflow-hidden rounded-2xl py-10">
        {/* Background Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 via-black to-blue-900/40"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/10 to-transparent"></div>
      
      {/* Animated Background Elements */}
      <div className="absolute top-1/4 left-10 w-32 h-32 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full blur-2xl animate-pulse hidden lg:block"></div>
      <div className="absolute bottom-1/3 right-16 w-24 h-24 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-xl animate-bounce hidden xl:block"></div>
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-gradient-to-r from-white/10 to-purple-500/20 rounded-full blur-lg animate-pulse hidden lg:block"></div>

      {/* Background Illustration */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
        whileInView={{ opacity: 0.15, scale: 1, rotate: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        viewport={{ once: true }}
        className="absolute top-10 right-5 w-1/2 md:w-1/3 lg:w-1/4 pointer-events-none"
      >
        <img
          src={assets.freelanceillustration}
          alt="Freelance Illustration"
          className="w-full h-auto filter drop-shadow-2xl"
        />
      </motion.div>

      {/* Content Container */}
      <motion.div
        className="relative z-10 flex flex-col items-center text-center max-w-6xl mx-auto"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={textVariant}
      >
        {/* Main Heading */}
        <motion.h2 
          variants={textVariant} 
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight"
        >
          <span className="block bg-gradient-to-r from-white via-purple-100 to-blue-100 bg-clip-text text-transparent">
            Keep What You Earn.
          </span>
          <span className="block bg-gradient-to-r from-blue-200 via-purple-200 to-white bg-clip-text text-transparent mt-2">
            Pay What You Agree.
          </span>
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          custom={1}
          variants={textVariant}
          className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-white/80 mb-12 max-w-4xl leading-relaxed"
        >
          We don't charge a single cent in commissions. Freelancers and clients settle directly — with zero interference.
        </motion.p>

        {/* Features Grid */}
        <motion.div
          custom={2}
          variants={textVariant}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 max-w-4xl w-full"
        >
          {[
            { icon: "💰", text: "Freelancers keep 100% of what they earn" },
            { icon: "🚫", text: "Clients avoid platform cuts and hidden fees" },
            { icon: "💳", text: "Use your own payment method (UPI, PayPal, Wire, etc.)" },
            { icon: "🤝", text: "Work transparently, without middlemen" }
          ].map((feature, index) => (
            <div 
              key={index}
              className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 transition-all duration-300 hover:bg-white/10 hover:border-purple-400/30 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20"
            >
              <div className="flex items-center space-x-4">
                <p className="text-base sm:text-lg text-white/90 leading-relaxed">
                  {feature.text}
                </p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Testimonial Card */}
        <motion.div
          custom={3}
          variants={textVariant}
          className="group relative bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-2xl max-w-3xl text-center transition-all duration-300 hover:bg-white/15 hover:border-purple-400/40 hover:scale-105"
        >
          {/* Gradient Border Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-purple-500/20 rounded-2xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
          
          <div className="relative">
           
            <blockquote className="text-lg sm:text-xl md:text-2xl text-white/90 italic mb-4 leading-relaxed">
              "I made ₹60,000 in a week and received 100% of it – no cuts, no delays."
            </blockquote>
            <cite className="text-base sm:text-lg text-purple-200 font-semibold">
              — Neha R., Prompt Engineer
            </cite>
          </div>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          custom={4}
          variants={textVariant}
          className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mt-12"
        >
          <button className="group relative w-full sm:w-auto min-w-[200px] bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold px-8 py-4 rounded-xl shadow-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-purple-500/25 border border-purple-400/30" onClick={()=>navigate('/login')}>
            <span className="relative z-10">Start Earning 100%</span>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-blue-700 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
          
          <button className="group relative w-full sm:w-auto min-w-[200px] bg-white/10 backdrop-blur-sm text-white font-semibold px-8 py-4 rounded-xl border border-white/30 shadow-2xl transition-all duration-300 transform hover:scale-105 hover:bg-white hover:text-gray-900" onClick={()=>navigate('/about-us')}>
            <span className="relative z-10">Learn More</span>
          </button>
        </motion.div>
      </motion.div>
      
      {/* Bottom Fade Effect */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/50 to-transparent pointer-events-none"></div>
      </div>
    </section>
  );
};

export default GameChangerSection;