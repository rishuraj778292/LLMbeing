// import React from 'react'

// const ExploreCategories = () => {
//   return (
//     <section id="categories" className="categories-section py-16 bg-gradient-to-b from-gray-100 to-gray-200 rounded-2xl shadow-lg">
//     <div className="container mx-auto px-6 lg:px-20">
//       <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">What You Can Build or Work On</h2>
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
//         <div className="category-card bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 text-center">
//           <div className="text-5xl mb-4">🤖</div>
//           <h3 className="text-2xl font-semibold text-gray-800 mb-2">AI Agents</h3>
//           <p className="text-gray-600 mb-4">Chatbots, GPT bots</p>
//           <button className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-300">Explore Work</button>
//         </div>
//         <div className="category-card bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 text-center">
//           <div className="text-5xl mb-4">🔄</div>
//           <h3 className="text-2xl font-semibold text-gray-800 mb-2">Automation</h3>
//           <p className="text-gray-600 mb-4">Make.com, Zapier</p>
//           <button className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-300">Explore Work</button>
//         </div>
//         <div className="category-card bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 text-center">
//           <div className="text-5xl mb-4">🧠</div>
//           <h3 className="text-2xl font-semibold text-gray-800 mb-2">LLM Apps</h3>
//           <p className="text-gray-600 mb-4">OpenAI, Claude, Gemini</p>
//           <button className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-300">Explore Work</button>
//         </div>
//         <div className="category-card bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 text-center">
//           <div className="text-5xl mb-4">🧩</div>
//           <h3 className="text-2xl font-semibold text-gray-800 mb-2">API Integrations</h3>
//           <p className="text-gray-600 mb-4">Custom API solutions</p>
//           <button className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-300">Explore Work</button>
//         </div>
//         <div className="category-card bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 text-center">
//           <div className="text-5xl mb-4">🔍</div>
//           <h3 className="text-2xl font-semibold text-gray-800 mb-2">Prompt Engineering</h3>
//           <p className="text-gray-600 mb-4">Optimized AI prompts</p>
//           <button className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-300">Explore Work</button>
//         </div>
//         <div className="category-card bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 text-center">
//           <div className="text-5xl mb-4">📊</div>
//           <h3 className="text-2xl font-semibold text-gray-800 mb-2">Data Labeling & Analytics</h3>
//           <p className="text-gray-600 mb-4">Data preparation & insights</p>
//           <button className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-300">Explore Work</button>
//         </div>
//       </div>
//     </div>
//   </section>
//   )
// }

// export default ExploreCategories

import React from 'react';
import { motion } from 'framer-motion';

const categories = [
  { icon: '🤖', title: 'AI Agents', desc: 'Chatbots, GPT bots' },
  { icon: '🔄', title: 'Automation', desc: 'Make.com, Zapier' },
  { icon: '🧠', title: 'LLM Apps', desc: 'OpenAI, Claude, Gemini' },
  { icon: '🧩', title: 'API Integrations', desc: 'Custom API solutions' },
  { icon: '🔍', title: 'Prompt Engineering', desc: 'Optimized AI prompts' },
  { icon: '📊', title: 'Data Labeling & Analytics', desc: 'Data preparation & insights' },
];

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.2, duration: 0.6, ease: 'easeOut' },
  }),
};

const ExploreCategories = () => {
  return (
    <section id="categories" className="py-20 bg-gradient-to-b from-gray-100 to-gray-200  shadow-inner">
      <div className="container mx-auto px-6 lg:px-20">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold text-center text-gray-800 mb-14"
        >
          What You Can Build or Work On
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {categories.map((cat, i) => (
            <motion.div
              key={i}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={cardVariants}
              className="bg-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transition duration-300 ease-in-out transform hover:-translate-y-1"
            >
              <div className="text-5xl mb-4">{cat.icon}</div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-2">{cat.title}</h3>
              <p className="text-gray-600 mb-6">{cat.desc}</p>
              <button className="bg-black text-white px-6 py-2 rounded-lg hover:bg-white hover:text-black border border-black transition-all duration-300">
                Explore Work
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExploreCategories;
