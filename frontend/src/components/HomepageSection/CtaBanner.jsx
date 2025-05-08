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
import { motion } from 'framer-motion';

const CtaBanner = () => {
  return (
    <section
      id="final-cta"
      className="py-20 px-6 lg:px-20 bg-gradient-to-r from-indigo-200 via-purple-100 to-white  shadow-2xl text-center"
    >
      {/* Animated Title */}
      <motion.h1
        className="text-4xl lg:text-5xl font-bold text-gray-800 mb-6"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Join the Platform Built Exclusively for AI Work
      </motion.h1>

      {/* Animated Description */}
      <motion.p
        className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        Post your first project or apply for one today – with zero commission and full freedom.
      </motion.p>

      {/* Animated Buttons */}
      <motion.div
        className="flex flex-col sm:flex-row justify-center gap-6 mb-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.4 }}
      >
        <motion.button
          className="bg-indigo-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-indigo-700 transition-colors duration-300"
          whileHover={{ scale: 1.05 }}
        >
          🔵 Post a Project
        </motion.button>
        <motion.button
          className="bg-white border border-indigo-500 text-indigo-600 px-8 py-3 rounded-lg text-lg font-medium hover:bg-indigo-50 transition-colors duration-300"
          whileHover={{ scale: 1.05 }}
        >
          ⚪ Find AI Work
        </motion.button>
      </motion.div>

      {/* Animated Small Text */}
      <motion.p
        className="text-sm text-gray-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        Free to join. Direct payments. 100% AI-focused.
      </motion.p>
    </section>
  );
};

export default CtaBanner;
