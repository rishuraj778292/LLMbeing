import React from 'react'

const ChooseUs = () => {
  return (
    <section id="why-choose-us" className="py-16 bg-gradient-to-r from-yellow-100 to-yellow-200 rounded-2xl shadow-lg">
    <div className="container mx-auto px-6 lg:px-20">
      <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">Built for the Future of Freelancing</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="feature-card bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 text-center">
          <div className="text-5xl mb-4">🧠</div>
          <h3 className="text-2xl font-semibold text-gray-800 mb-2">AI-Only Focus</h3>
          <p className="text-gray-600">No distractions — just AI, ML, and automation.</p>
        </div>
        <div className="feature-card bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 text-center">
          <div className="text-5xl mb-4">💸</div>
          <h3 className="text-2xl font-semibold text-gray-800 mb-2">0% Commission</h3>
          <p className="text-gray-600">Work freely. Get paid fully. No interference.</p>
        </div>
        <div className="feature-card bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 text-center">
          <div className="text-5xl mb-4">💬</div>
          <h3 className="text-2xl font-semibold text-gray-800 mb-2">Real-Time Chat</h3>
          <p className="text-gray-600">Direct messaging to move fast & clear.</p>
        </div>
        <div className="feature-card bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 text-center">
          <div className="text-5xl mb-4">🧑‍💻</div>
          <h3 className="text-2xl font-semibold text-gray-800 mb-2">Curated Talent</h3>
          <p className="text-gray-600">Skilled AI freelancers only — no generic gigs.</p>
        </div>
      </div>
    </div>
  </section>
  )
}

export default ChooseUs