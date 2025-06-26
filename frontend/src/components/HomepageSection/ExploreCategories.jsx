

import React from 'react';
import { motion } from 'framer-motion';
import { Bot, Workflow, Brain, Zap, MessageSquare, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
const categories = [
  { 
    icon: 'Bot', 
    title: 'AI Agents', 
    desc: 'Intelligent conversational AI, customer service bots, and autonomous task executors'
  },
  { 
    icon: 'Workflow', 
    title: 'Process Automation', 
    desc: 'End-to-end workflow optimization, integration platforms, and business process automation'
  },
  { 
    icon: 'Brain', 
    title: 'LLM Applications', 
    desc: 'Custom language model implementations, fine-tuning, and enterprise AI solutions'
  },
  { 
    icon: 'Zap', 
    title: 'API Development', 
    desc: 'RESTful APIs, GraphQL endpoints, microservices architecture, and system integrations'
  },
  { 
    icon: 'MessageSquare', 
    title: 'Prompt Engineering', 
    desc: 'Advanced prompt optimization, chain-of-thought reasoning, and AI performance tuning'
  },
  { 
    icon: 'BarChart3', 
    title: 'AI Analytics & ML', 
    desc: 'Machine learning pipelines, data modeling, predictive analytics, and business intelligence'
  },
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
  const navigate = useNavigate();
  return (
    <section id="categories" className="relative py-5 px-5 bg-white overflow-hidden">
      {/* Subtle Background Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-purple-100/30 to-blue-100/30 rounded-full blur-3xl animate-pulse hidden lg:block"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-r from-blue-100/30 to-purple-100/30 rounded-full blur-3xl animate-pulse hidden lg:block"></div>
      <div className="absolute top-1/2 left-1/4 w-20 h-20 bg-gradient-to-r from-gray-100/50 to-purple-100/30 rounded-full blur-2xl animate-bounce hidden xl:block"></div>
      
      <div className="relative z-10 container mx-auto px-4 lg:px-8 py-16">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            <span className="block bg-gradient-to-r from-gray-800 via-purple-600 to-blue-600 bg-clip-text text-transparent">
              What You Can Build
            </span>
            <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-gray-800 bg-clip-text text-transparent mt-2">
              or Work On
            </span>
          </h2>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover endless opportunities in the AI ecosystem
          </p>
        </motion.div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {categories.map((cat, i) => (
            <motion.div
              key={i}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={cardVariants}
              className="group relative bg-white border border-gray-100 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 ease-out transform hover:scale-105 hover:border-purple-200"
            >
              {/* Subtle gradient border effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-purple-500/10 rounded-2xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
              
              <div className="relative">
                {/* Professional Icon with enhanced hover effect */}
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-blue-100 rounded-2xl flex items-center justify-center group-hover:from-purple-200 group-hover:to-blue-200 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-lg group-hover:shadow-xl">
                    {(() => {
                      const IconComponent = {
                        Bot,
                        Workflow,
                        Brain,
                        Zap,
                        MessageSquare,
                        BarChart3
                      }[cat.icon];
                      return <IconComponent className="w-8 h-8 text-purple-600 group-hover:text-blue-600 transition-colors duration-300" />;
                    })()}
                  </div>
                  {/* Subtle glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-blue-400/20 rounded-2xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                </div>
                
                {/* Title with gradient effect */}
                <h3 className="text-2xl sm:text-3xl font-bold mb-4 group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-blue-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                  {cat.title}
                </h3>
                
                {/* Description */}
                <p className="text-gray-600 text-sm sm:text-base mb-8 leading-relaxed group-hover:text-gray-700 transition-colors duration-300 min-h-[3rem]">
                  {cat.desc}
                </p>
                
                {/* Professional CTA Button */}
                <button className="group/btn relative w-full bg-gradient-to-r from-gray-900 to-gray-800 hover:from-purple-600 hover:to-blue-600 text-white font-semibold px-6 py-3 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl border border-gray-700 hover:border-purple-400/50 overflow-hidden">
                  <span className="relative z-10 flex items-center justify-center gap-2" onClick={()=>navigate('/login')}>
                    Explore Opportunities
                    <Zap className="w-4 h-4 group-hover/btn:animate-pulse" />
                  </span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 0.8, ease: 'easeOut' }}
          className="text-center mt-16"
        >
          <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Don't see your specialty? We support all AI-related projects and services.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
            <button className="group relative w-full sm:w-auto min-w-[200px] bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold px-8 py-4 rounded-xl shadow-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-purple-500/25 border border-purple-400/30" onClick={()=>navigate('/login')}>
              <span className="relative z-10">Browse All Categories</span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-blue-700 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
            
            <button className="group relative w-full sm:w-auto min-w-[200px] bg-white text-gray-800 font-semibold px-8 py-4 rounded-xl border-2 border-gray-200 shadow-lg transition-all duration-300 transform hover:scale-105 hover:border-purple-300 hover:shadow-xl" onClick={()=>navigate('/login')}>
              <span className="relative z-10 group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-blue-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                Post Your Project
              </span>
            </button>
          </div>
        </motion.div>
      </div>
      
      {/* Subtle top and bottom fade effects */}
      <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-white/80 to-transparent pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white/80 to-transparent pointer-events-none"></div>
    </section>
  );
};

export default ExploreCategories;
