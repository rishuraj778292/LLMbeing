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

import React from 'react';
import { motion } from 'framer-motion';
import { assets } from '../../assets/assets';

const textVariant = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.3,
      duration: 0.8,
    },
  }),
};

const GameChangerSection = () => {
  return (
    <section
      id="game-changer"
      className="relative h-auto min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 text-white flex flex-col items-center justify-center px-6 md:px-16 py-20  shadow-lg overflow-hidden"
    >
      {/* Background Image */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 0.2, scale: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
        className="absolute top-0 right-0 w-1/2 md:w-1/3 lg:w-1/4 pointer-events-none"
      >
        <img
          src={assets.freelanceillustration}
          alt="Freelance Illustration"
          className="w-full h-auto"
        />
      </motion.div>

      {/* Content */}
      <motion.div
        className="relative z-10 flex flex-col items-center text-center max-w-4xl"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={textVariant}
      >
        <motion.h2 variants={textVariant} className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 leading-tight">
          Keep What You Earn. Pay What You Agree.
        </motion.h2>
        <motion.p
          custom={1}
          variants={textVariant}
          className="text-base sm:text-lg md:text-xl mb-10 max-w-3xl"
        >
          We don’t charge a single cent in commissions. Freelancers and clients settle directly — with zero interference.
        </motion.p>

        <motion.ul
          custom={2}
          variants={textVariant}
          className="list-disc text-left pl-5 space-y-4 text-base sm:text-lg max-w-2xl"
        >
          <li>Freelancers keep 100% of what they earn</li>
          <li>Clients avoid platform cuts and hidden fees</li>
          <li>Use your own payment method (UPI, PayPal, Wire, etc.)</li>
          <li>Work transparently, without middlemen</li>
        </motion.ul>

        <motion.div
          custom={3}
          variants={textVariant}
          className="bg-white text-black mt-10 p-6 rounded-xl shadow-md max-w-2xl text-center text-base sm:text-lg"
        >
          💬 <span className="italic">“I made ₹60,000 in a week and received 100% of it – no cuts, no delays.”</span> — <strong>Neha R., Prompt Engineer</strong>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default GameChangerSection;

