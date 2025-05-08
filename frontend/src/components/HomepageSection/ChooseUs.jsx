// import React from 'react'

// const ChooseUs = () => {
//   return (
//     <section id="why-choose-us" className="py-16 bg-gradient-to-r from-yellow-100 to-yellow-200 rounded-2xl shadow-lg">
//     <div className="container mx-auto px-6 lg:px-20">
//       <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">Built for the Future of Freelancing</h2>
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
//         <div className="feature-card bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 text-center">
//           <div className="text-5xl mb-4">🧠</div>
//           <h3 className="text-2xl font-semibold text-gray-800 mb-2">AI-Only Focus</h3>
//           <p className="text-gray-600">No distractions — just AI, ML, and automation.</p>
//         </div>
//         <div className="feature-card bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 text-center">
//           <div className="text-5xl mb-4">💸</div>
//           <h3 className="text-2xl font-semibold text-gray-800 mb-2">0% Commission</h3>
//           <p className="text-gray-600">Work freely. Get paid fully. No interference.</p>
//         </div>
//         <div className="feature-card bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 text-center">
//           <div className="text-5xl mb-4">💬</div>
//           <h3 className="text-2xl font-semibold text-gray-800 mb-2">Real-Time Chat</h3>
//           <p className="text-gray-600">Direct messaging to move fast & clear.</p>
//         </div>
//         <div className="feature-card bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 text-center">
//           <div className="text-5xl mb-4">🧑‍💻</div>
//           <h3 className="text-2xl font-semibold text-gray-800 mb-2">Curated Talent</h3>
//           <p className="text-gray-600">Skilled AI freelancers only — no generic gigs.</p>
//         </div>
//       </div>
//     </div>
//   </section>
//   )
// }

// export default ChooseUs

import React from 'react';
import { motion } from 'framer-motion';

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.2, duration: 0.6 },
  }),
};

const ChooseUs = () => {
  const features = [
    {
      icon: '🧠',
      title: 'AI-Only Focus',
      description: 'No distractions — just AI, ML, and automation.',
    },
    {
      icon: '💸',
      title: '0% Commission',
      description: 'Work freely. Get paid fully. No interference.',
    },
    {
      icon: '💬',
      title: 'Real-Time Chat',
      description: 'Direct messaging to move fast & clear.',
    },
    {
      icon: '🧑‍💻',
      title: 'Curated Talent',
      description: 'Skilled AI freelancers only — no generic gigs.',
    },
  ];

  return (
    // <section
    //   id="why-choose-us"
    //   className="py-20 bg-gradient-to-br from-yellow-100 via-orange-100 to-yellow-200 rounded-2xl shadow-xl"
    // >
    // <section
    //   id="why-choose-us"
    //   className="py-20 bg-gradient-to-br from-indigo-100 via-purple-50 to-white rounded-2xl shadow-xl"
    // >
    <section
  id="why-choose-us"
  className="py-20 bg-gradient-to-br from-green-50 via-white to-green-100  shadow-xl"
>


      <div className="container mx-auto px-6 lg:px-20">
        <motion.h2
          className="text-4xl font-bold text-center text-gray-800 mb-14"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          Built for the Future of Freelancing
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              custom={i}
              initial="hidden"
              whileInView="visible"
              variants={cardVariants}
              className="bg-white p-6 rounded-2xl text-center shadow-md hover:shadow-lg border border-yellow-200 transition-shadow duration-300"
            >
              <div className="text-5xl mb-4">{feature.icon}</div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ChooseUs;
