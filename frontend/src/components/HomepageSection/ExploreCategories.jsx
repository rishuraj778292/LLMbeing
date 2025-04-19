import React from 'react'

const ExploreCategories = () => {
  return (
    <section id="categories" className="categories-section py-16 bg-gradient-to-b from-gray-100 to-gray-200 rounded-2xl shadow-lg">
    <div className="container mx-auto px-6 lg:px-20">
      <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">What You Can Build or Work On</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="category-card bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 text-center">
          <div className="text-5xl mb-4">🤖</div>
          <h3 className="text-2xl font-semibold text-gray-800 mb-2">AI Agents</h3>
          <p className="text-gray-600 mb-4">Chatbots, GPT bots</p>
          <button className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-300">Explore Work</button>
        </div>
        <div className="category-card bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 text-center">
          <div className="text-5xl mb-4">🔄</div>
          <h3 className="text-2xl font-semibold text-gray-800 mb-2">Automation</h3>
          <p className="text-gray-600 mb-4">Make.com, Zapier</p>
          <button className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-300">Explore Work</button>
        </div>
        <div className="category-card bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 text-center">
          <div className="text-5xl mb-4">🧠</div>
          <h3 className="text-2xl font-semibold text-gray-800 mb-2">LLM Apps</h3>
          <p className="text-gray-600 mb-4">OpenAI, Claude, Gemini</p>
          <button className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-300">Explore Work</button>
        </div>
        <div className="category-card bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 text-center">
          <div className="text-5xl mb-4">🧩</div>
          <h3 className="text-2xl font-semibold text-gray-800 mb-2">API Integrations</h3>
          <p className="text-gray-600 mb-4">Custom API solutions</p>
          <button className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-300">Explore Work</button>
        </div>
        <div className="category-card bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 text-center">
          <div className="text-5xl mb-4">🔍</div>
          <h3 className="text-2xl font-semibold text-gray-800 mb-2">Prompt Engineering</h3>
          <p className="text-gray-600 mb-4">Optimized AI prompts</p>
          <button className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-300">Explore Work</button>
        </div>
        <div className="category-card bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 text-center">
          <div className="text-5xl mb-4">📊</div>
          <h3 className="text-2xl font-semibold text-gray-800 mb-2">Data Labeling & Analytics</h3>
          <p className="text-gray-600 mb-4">Data preparation & insights</p>
          <button className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-300">Explore Work</button>
        </div>
      </div>
    </div>
  </section>
  )
}

export default ExploreCategories