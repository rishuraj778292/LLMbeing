// import React from 'react'

// const Newsletter = () => {
//   return (
//     <section id="newsletter" className="newsletter-section">
//     <h2>Stay Ahead in AI Freelancing</h2>
//     <form>
//       <input type="email" placeholder="Enter email to get weekly insights" />
//       <button type="submit">Subscribe</button>
//     </form>
//     <div className="latest-articles">
//       <h3>Latest Blog Articles</h3>
//       <ul>
//         <li>“5 AI Jobs Trending in 2025”</li>
//         <li>“How to Build a GPT Agent”</li>
//       </ul>
//     </div>
//   </section>
//   )
// }

// export default Newsletter
import React, { useState } from 'react';
import { Zap, Lightbulb, Target, FileText, Sparkles } from 'lucide-react';

const Newsletter = () => {
  const [blogs, setBlogs] = useState([]);
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail('');
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  const benefitsData = [
    {
      title: 'Weekly Insights', 
      desc: 'Latest AI trends and opportunities',
      icon: (
        <div className="relative w-12 h-12 mx-auto">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full transform rotate-6"></div>
          <div className="absolute inset-1 bg-white rounded-full border-2 border-blue-300 flex items-center justify-center">
            <Zap className="w-6 h-6 text-blue-600" />
          </div>
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full border border-yellow-500"></div>
        </div>
      )
    },
    {
      title: 'Expert Tips', 
      desc: 'Proven strategies from top freelancers',
      icon: (
        <div className="relative w-12 h-12 mx-auto">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full transform -rotate-6"></div>
          <div className="absolute inset-1 bg-white rounded-full border-2 border-purple-300 flex items-center justify-center">
            <Lightbulb className="w-6 h-6 text-purple-600" />
          </div>
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-300 rounded-full"></div>
        </div>
      )
    },
    {
      title: 'Job Alerts', 
      desc: 'High-paying AI gigs delivered first',
      icon: (
        <div className="relative w-12 h-12 mx-auto">
          <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-green-200 rounded-full transform rotate-12"></div>
          <div className="absolute inset-1 bg-white rounded-full border-2 border-green-300 flex items-center justify-center">
            <Target className="w-6 h-6 text-green-600" />
          </div>
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-400 rounded-full"></div>
        </div>
      )
    }
  ];

  return (
    <section
      id="newsletter"
      className="py-20 px-6 lg:px-20 bg-gradient-to-br from-white via-blue-50 to-purple-100 relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-48 h-48 bg-gradient-to-br from-purple-200/30 to-blue-200/30 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-white/50 to-blue-100/50 rounded-full blur-2xl"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent mb-4">
            Stay Ahead in AI Freelancing
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get exclusive insights, trending opportunities, and expert tips delivered weekly
          </p>
        </div>

        <div className="mb-16">
          <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-lg mx-auto">
            <div className="flex-1">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full p-4 rounded-xl border-2 border-gray-200 bg-white/80 backdrop-blur-sm focus:outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-100 transition-all duration-300 text-gray-700 placeholder-gray-400"
                required
              />
            </div>
            <button
              onClick={handleSubmit}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
              disabled={isSubscribed}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10">
                {isSubscribed ? '✓ Subscribed!' : 'Subscribe'}
              </span>
            </button>
          </div>

          {isSubscribed && (
            <p className="text-center mt-4 text-green-600 font-medium">
              Thank you for subscribing! Check your email for confirmation.
            </p>
          )}
        </div>

        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Latest Blog Articles
            </h3>
            <div className="w-12 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"></div>
          </div>

          {blogs && blogs.length > 0 ? (
            <div className="space-y-4">
              {blogs.map((blog, index) => (
                <div
                  key={blog.id}
                  className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100 hover:shadow-md transition-all duration-300 cursor-pointer group"
                >
                  <h4 className="font-semibold text-gray-800 group-hover:text-purple-600 transition-colors duration-300">
                    {blog.title}
                  </h4>
                  <p className="text-gray-600 text-sm mt-1">{blog.excerpt}</p>
                  <span className="text-xs text-blue-500 font-medium">{blog.date}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-20 h-20 mx-auto mb-6 relative">
                <div className="absolute inset-0 border-2 border-dashed border-gray-300 rounded-lg transform rotate-2 opacity-60"></div>
                <div className="absolute inset-1 bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-gray-200 rounded-lg flex items-center justify-center">
                  <div className="relative">
                    <FileText className="w-8 h-8 text-gray-400" />
                    <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-orange-400" />
                  </div>
                </div>
              </div>
              <p className="text-gray-500 text-lg font-medium">No blogs available right now</p>
              <p className="text-gray-400 text-sm mt-2">
                We're cooking up some amazing content for you!
              </p>
              <div className="mt-6 flex justify-center space-x-1">
                <div className="w-2 h-2 bg-blue-300 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-purple-300 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-blue-300 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {benefitsData.map((benefit, index) => (
            <div
              key={index}
              className="text-center p-6 rounded-xl bg-white/40 backdrop-blur-sm border border-white/30 hover:bg-white/60 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-lg"
            >
              <div className="mb-4">{benefit.icon}</div>
              <h4 className="font-semibold text-gray-800 mb-2">{benefit.title}</h4>
              <p className="text-gray-600 text-sm">{benefit.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Newsletter;