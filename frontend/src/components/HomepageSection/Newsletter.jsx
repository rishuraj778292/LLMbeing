import React from 'react'

const Newsletter = () => {
  return (
    <section id="newsletter" className="newsletter-section">
    <h2>Stay Ahead in AI Freelancing</h2>
    <form>
      <input type="email" placeholder="Enter email to get weekly insights" />
      <button type="submit">Subscribe</button>
    </form>
    <div className="latest-articles">
      <h3>Latest Blog Articles</h3>
      <ul>
        <li>“5 AI Jobs Trending in 2025”</li>
        <li>“How to Build a GPT Agent”</li>
      </ul>
    </div>
  </section>
  )
}

export default Newsletter