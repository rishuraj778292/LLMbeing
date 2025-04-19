import React from 'react'

const HowItWork = () => {
  return (
    <section id="how-it-works" className="py-16 bg-gradient-to-r from-green-100 to-green-200 rounded-2xl shadow-lg">
    <div className="container mx-auto px-6 lg:px-20">
      <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">Get Started in 3 Steps</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="client-steps bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4 text-center">For Clients</h3>
          <ol className="list-decimal list-inside text-gray-600 space-y-2">
            <li>Post your AI project</li>
            <li>Receive proposals from expert freelancers</li>
            <li>Collaborate directly, pay how you want</li>
          </ol>
        </div>
        <div className="freelancer-steps bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4 text-center">For Freelancers</h3>
          <ol className="list-decimal list-inside text-gray-600 space-y-2">
            <li>Create your profile</li>
            <li>Browse AI-only projects</li>
            <li>Apply, work, and keep 100% of earnings</li>
          </ol>
        </div>
      </div>
      <p className="text-center text-gray-700 mt-8">🟢 No subscription. No fees. Just clean AI project collaboration.</p>
      <div className="text-center mt-6">
        <button className="bg-green-500 text-white px-8 py-3 rounded-lg hover:bg-green-600 transition-colors duration-300">
          Create Free Account
        </button>
      </div>
    </div>
  </section>
  )
}

export default HowItWork