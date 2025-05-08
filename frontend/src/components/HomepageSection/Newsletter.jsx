// import React from 'react'

// const Newsletter = () => {
//   return (
//     <section id="newsletter" className="newsletter-section">
//     <h2>Stay Ahead in AI Freelancing</h2>
//     <form>
//       <input type="email" placeholder="Enter email to get weekly insights" />
//       <button type="submit">Subscribe</button>
//     </form>
//     <div className="latest-articles">
//       <h3>Latest Blog Articles</h3>
//       <ul>
//         <li>“5 AI Jobs Trending in 2025”</li>
//         <li>“How to Build a GPT Agent”</li>
//       </ul>
//     </div>
//   </section>
//   )
// }

// export default Newsletter
import React from 'react';
import { motion } from 'framer-motion';

const Newsletter = () => {
  return (
    <section
      id="newsletter"
      className="py-16 px-6 lg:px-20 bg-gradient-to-r from-blue-100 to-blue-200  shadow-lg"
    >
      {/* Animated Title */}
      <motion.h2
        className="text-3xl lg:text-4xl font-bold text-gray-800 text-center mb-10"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Stay Ahead in AI Freelancing
      </motion.h2>

      {/* Animated Form */}
      <motion.form
        className="flex flex-col sm:flex-row justify-center gap-4 mb-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <input
          type="email"
          placeholder="Enter email to get weekly insights"
          className="p-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <motion.button
          type="submit"
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg text-lg font-medium hover:bg-indigo-700 transition-colors duration-300"
          whileHover={{ scale: 1.05 }}
        >
          Subscribe
        </motion.button>
      </motion.form>

      {/* Animated Latest Articles */}
      <motion.div
        className="latest-articles"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">Latest Blog Articles</h3>
        <ul className="list-disc pl-5 text-gray-700 space-y-2">
          <li>“5 AI Jobs Trending in 2025”</li>
          <li>“How to Build a GPT Agent”</li>
        </ul>
      </motion.div>
    </section>
  );
};

export default Newsletter;
