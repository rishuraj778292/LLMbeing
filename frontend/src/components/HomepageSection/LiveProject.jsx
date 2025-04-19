import React from 'react'

const LiveProject = () => {
  return (
    <section id="live-projects" className="py-16 bg-gradient-to-r from-indigo-100 to-indigo-200 rounded-2xl shadow-lg">
    <div className="container mx-auto px-6 lg:px-20">
      <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">Real AI Projects. Real AI Freelancers.</h2>
      <div className="tabs flex justify-center gap-6 mb-8">
        <button className="bg-indigo-500 text-white px-6 py-2 rounded-lg hover:bg-indigo-600 transition-colors duration-300">
          Live Projects
        </button>
        <button className="bg-indigo-500 text-white px-6 py-2 rounded-lg hover:bg-indigo-600 transition-colors duration-300">
          Top Freelancers
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="project-card bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">Train a GPT-4 agent for HR automation</h3>
          <p className="text-gray-600 mb-2">Skills: LangChain, GPT API</p>
          <p className="text-gray-600 mb-4">Budget: Flexible</p>
          <button className="bg-indigo-500 text-white px-6 py-2 rounded-lg hover:bg-indigo-600 transition-colors duration-300">
            View & Apply
          </button>
        </div>
        <div className="freelancer-card bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">Dhruv J. – AI Workflow Architect</h3>
          <p className="text-gray-600 mb-2">Skills: OpenAI, RPA, LLMs</p>
          <p className="text-green-600 font-semibold mb-4">✅ Available</p>
          <button className="bg-indigo-500 text-white px-6 py-2 rounded-lg hover:bg-indigo-600 transition-colors duration-300">
            Invite to Project
          </button>
        </div>
      </div>
    </div>
  </section>


  )
}

export default LiveProject