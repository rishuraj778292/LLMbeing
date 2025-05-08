// import React from 'react'

// const LiveProject = () => {
//   return (
//     <section id="live-projects" className="py-16 bg-gradient-to-r from-indigo-100 to-indigo-200 rounded-2xl shadow-lg">
//     <div className="container mx-auto px-6 lg:px-20">
//       <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">Real AI Projects. Real AI Freelancers.</h2>
//       <div className="tabs flex justify-center gap-6 mb-8">
//         <button className="bg-indigo-500 text-white px-6 py-2 rounded-lg hover:bg-indigo-600 transition-colors duration-300">
//           Live Projects
//         </button>
//         <button className="bg-indigo-500 text-white px-6 py-2 rounded-lg hover:bg-indigo-600 transition-colors duration-300">
//           Top Freelancers
//         </button>
//       </div>
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//         <div className="project-card bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
//           <h3 className="text-2xl font-semibold text-gray-800 mb-4">Train a GPT-4 agent for HR automation</h3>
//           <p className="text-gray-600 mb-2">Skills: LangChain, GPT API</p>
//           <p className="text-gray-600 mb-4">Budget: Flexible</p>
//           <button className="bg-indigo-500 text-white px-6 py-2 rounded-lg hover:bg-indigo-600 transition-colors duration-300">
//             View & Apply
//           </button>
//         </div>
//         <div className="freelancer-card bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
//           <h3 className="text-2xl font-semibold text-gray-800 mb-4">Dhruv J. – AI Workflow Architect</h3>
//           <p className="text-gray-600 mb-2">Skills: OpenAI, RPA, LLMs</p>
//           <p className="text-green-600 font-semibold mb-4">✅ Available</p>
//           <button className="bg-indigo-500 text-white px-6 py-2 rounded-lg hover:bg-indigo-600 transition-colors duration-300">
//             Invite to Project
//           </button>
//         </div>
//       </div>
//     </div>
//   </section>


//   )
// }

// export default LiveProject

import React from 'react';
import { motion } from 'framer-motion';

const LiveProject = () => {
  return (
    <section
      id="live-projects"
      className="py-20 bg-gradient-to-br from-indigo-100 via-purple-100 to-blue-100  shadow-xl"
    >
      <div className="container mx-auto px-6 lg:px-20">
        <motion.h2
          className="text-4xl font-bold text-center text-gray-800 mb-14"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          Real AI Projects. Real AI Freelancers.
        </motion.h2>

        <div className="flex justify-center gap-4 mb-12 flex-wrap">
          <motion.button
            className="bg-indigo-500 text-white px-6 py-2 rounded-full hover:bg-indigo-600 transition-colors duration-300"
            whileHover={{ scale: 1.05 }}
          >
            Live Projects
          </motion.button>
          <motion.button
            className="bg-indigo-500 text-white px-6 py-2 rounded-full hover:bg-indigo-600 transition-colors duration-300"
            whileHover={{ scale: 1.05 }}
          >
            Top Freelancers
          </motion.button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Project Card */}
          <motion.div
            className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition duration-300 border border-gray-100"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">🚀 Train a GPT-4 Agent for HR Automation</h3>
            <p className="text-gray-600 mb-1">Skills: LangChain, GPT API</p>
            <p className="text-gray-600 mb-4">💸 Budget: Flexible</p>
            <button className="bg-indigo-500 text-white px-5 py-2 rounded-lg hover:bg-indigo-600 transition-colors duration-300">
              View & Apply
            </button>
          </motion.div>

          {/* Freelancer Card */}
          <motion.div
            className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition duration-300 border border-gray-100"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">🧠 Dhruv J. – AI Workflow Architect</h3>
            <p className="text-gray-600 mb-1">Skills: OpenAI, RPA, LLMs</p>
            <p className="text-green-600 font-semibold mb-4">✅ Available for projects</p>
            <button className="bg-indigo-500 text-white px-5 py-2 rounded-lg hover:bg-indigo-600 transition-colors duration-300">
              Invite to Project
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default LiveProject;
