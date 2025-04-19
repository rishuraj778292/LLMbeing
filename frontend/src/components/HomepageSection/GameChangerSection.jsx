import React from 'react'

const GameChangerSection = () => {
  return (
    <section id="game-changer" className="h-screen mt-20 bg-gradient-to-r from-blue-500 to-purple-600 text-white flex flex-col items-center justify-center px-8 py-16 rounded-2xl shadow-lg">
    <h2 className="text-4xl font-bold mb-6 text-center">Keep What You Earn. Pay What You Agree.</h2>
    <p className="text-lg mb-8 text-center max-w-3xl">
      We don’t charge a single cent in commissions. Freelancers and clients settle directly — with zero interference.
    </p>
    <ul className="list-disc list-inside text-left space-y-4 max-w-2xl">
      <li className="text-lg">Freelancers keep 100% of what they earn</li>
      <li className="text-lg">Clients avoid platform cuts and hidden fees</li>
      <li className="text-lg">Use your own payment method (UPI, PayPal, Wire, etc.)</li>
      <li className="text-lg">Work transparently, without middlemen</li>
    </ul>
    <div className="testimonial-banner bg-white text-black mt-10 p-6 rounded-xl shadow-md max-w-2xl text-center">
      💬 <span className="italic">“I made ₹60,000 in a week and received 100% of it – no cuts, no delays.”</span> — <strong>Neha R., Prompt Engineer</strong>
    </div>
  </section>

  )
}

export default GameChangerSection