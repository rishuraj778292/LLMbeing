// import React from 'react'

// const HowItWork = () => {
//   return (
//     <section id="how-it-works" className="py-16 bg-gradient-to-r from-green-100 to-green-200 rounded-2xl shadow-lg">
//     <div className="container mx-auto px-6 lg:px-20">
//       <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">Get Started in 3 Steps</h2>
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
//         <div className="client-steps bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
//           <h3 className="text-2xl font-semibold text-gray-800 mb-4 text-center">For Clients</h3>
//           <ol className="list-decimal list-inside text-gray-600 space-y-2">
//             <li>Post your AI project</li>
//             <li>Receive proposals from expert freelancers</li>
//             <li>Collaborate directly, pay how you want</li>
//           </ol>
//         </div>
//         <div className="freelancer-steps bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
//           <h3 className="text-2xl font-semibold text-gray-800 mb-4 text-center">For Freelancers</h3>
//           <ol className="list-decimal list-inside text-gray-600 space-y-2">
//             <li>Create your profile</li>
//             <li>Browse AI-only projects</li>
//             <li>Apply, work, and keep 100% of earnings</li>
//           </ol>
//         </div>
//       </div>
//       <p className="text-center text-gray-700 mt-8">🟢 No subscription. No fees. Just clean AI project collaboration.</p>
//       <div className="text-center mt-6">
//         <button className="bg-green-500 text-white px-8 py-3 rounded-lg hover:bg-green-600 transition-colors duration-300">
//           Create Free Account
//         </button>
//       </div>
//     </div>
//   </section>
//   )
// }

// export default HowItWork
import React from 'react';
import { motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.3, duration: 0.6, ease: 'easeOut' },
  }),
};

const HowItWork = () => {
  return (
    <section
      id="how-it-works"
      className="py-20 bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100  shadow-xl"
    >
      <div className="container mx-auto px-6 lg:px-20">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold text-center text-gray-800 mb-14"
        >
          Get Started in 3 Steps
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {[
            {
              title: 'For Clients',
              steps: ['Post your AI project', 'Receive proposals from expert freelancers', 'Collaborate directly, pay how you want'],
            },
            {
              title: 'For Freelancers',
              steps: ['Create your profile', 'Browse AI-only projects', 'Apply, work, and keep 100% of earnings'],
            },
          ].map((group, i) => (
            <motion.div
              key={i}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="bg-white p-6 rounded-2xl shadow-md hover:shadow-2xl transition duration-300 text-center"
            >
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">{group.title}</h3>
              <ol className="list-decimal list-inside text-gray-600 space-y-2 text-left">
                {group.steps.map((step, j) => (
                  <li key={j}>{step}</li>
                ))}
              </ol>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center text-gray-700 mt-10"
        >
           No subscription. No fees. Just clean AI project collaboration.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="text-center mt-6"
        >
          <button className="bg-black text-white px-8 py-3 rounded-lg hover:bg-white hover:text-black border border-black transition-all duration-300">
            Create Free Account
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWork;
