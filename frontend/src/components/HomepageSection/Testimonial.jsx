// import React from 'react'

// const Testimonial = () => {
//   return (
//     <section id="testimonials" className="py-16 bg-gradient-to-r from-pink-100 to-pink-200 rounded-2xl shadow-lg">
//     <div className="container mx-auto px-6 lg:px-20">
//       <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">What Builders & Freelancers Say</h2>
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//         <div className="testimonial bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 text-center">
//           <blockquote className="italic text-gray-600 mb-4">“I built an AI sales assistant in a week with help from here.”</blockquote>
//           <p className="font-semibold text-gray-800">— Ritu G., SaaS Founder</p>
//         </div>
//         <div className="testimonial bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 text-center">
//           <blockquote className="italic text-gray-600 mb-4">“I love how I don’t lose 20% on each project anymore.”</blockquote>
//           <p className="font-semibold text-gray-800">— Tushar V., LangChain Dev</p>
//         </div>
//         <div className="testimonial bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 text-center">
//           <blockquote className="italic text-gray-600 mb-4">“It’s like Fiverr but only for AI — and commission-free!”</blockquote>
//           <p className="font-semibold text-gray-800">— Aryan M., GPT Automation Specialist</p>
//         </div>
//       </div>
//     </div>
//   </section>
//   )
// }

// export default Testimonial
import React from 'react';
import { motion } from 'framer-motion';

const Testimonial = () => {
  return (
    <section
      id="testimonials"
      className="py-16 bg-gradient-to-r from-pink-100 to-pink-200  shadow-lg"
    >
      <div className="container mx-auto px-6 lg:px-20">
        {/* Animated Title */}
        <motion.h2
          className="text-4xl font-bold text-center text-gray-800 mb-12"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          What Builders & Freelancers Say
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Testimonial 1 */}
          <motion.div
            className="testimonial bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 text-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <blockquote className="italic text-gray-600 mb-4">
              “I built an AI sales assistant in a week with help from here.”
            </blockquote>
            <p className="font-semibold text-gray-800">— Ritu G., SaaS Founder</p>
          </motion.div>

          {/* Testimonial 2 */}
          <motion.div
            className="testimonial bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 text-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <blockquote className="italic text-gray-600 mb-4">
              “I love how I don’t lose 20% on each project anymore.”
            </blockquote>
            <p className="font-semibold text-gray-800">— Tushar V., LangChain Dev</p>
          </motion.div>

          {/* Testimonial 3 */}
          <motion.div
            className="testimonial bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 text-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <blockquote className="italic text-gray-600 mb-4">
              “It’s like Fiverr but only for AI — and commission-free!”
            </blockquote>
            <p className="font-semibold text-gray-800">— Aryan M., GPT Automation Specialist</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Testimonial;
