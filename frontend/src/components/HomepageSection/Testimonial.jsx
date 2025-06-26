// import React from 'react'

// const Testimonial = () => {
//   return (
//     <section id="testimonials" className="py-16 bg-gradient-to-r from-pink-100 to-pink-200 rounded-2xl shadow-lg">
//     <div className="container mx-auto px-6 lg:px-20">
//       <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">What Builders & Freelancers Say</h2>
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//         <div className="testimonial bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 text-center">
//           <blockquote className="italic text-gray-600 mb-4">“I built an AI sales assistant in a week with help from here.”</blockquote>
//           <p className="font-semibold text-gray-800">— Ritu G., SaaS Founder</p>
//         </div>
//         <div className="testimonial bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 text-center">
//           <blockquote className="italic text-gray-600 mb-4">“I love how I don’t lose 20% on each project anymore.”</blockquote>
//           <p className="font-semibold text-gray-800">— Tushar V., LangChain Dev</p>
//         </div>
//         <div className="testimonial bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 text-center">
//           <blockquote className="italic text-gray-600 mb-4">“It’s like Fiverr but only for AI — and commission-free!”</blockquote>
//           <p className="font-semibold text-gray-800">— Aryan M., GPT Automation Specialist</p>
//         </div>
//       </div>
//     </div>
//   </section>
//   )
// }

// export default Testimonial
import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Testimonial = () => {
  const navigate = useNavigate()
  const [visibleCards, setVisibleCards] = useState([]);
  
  useEffect(() => {
    // Stagger the animation of cards
    const timer1 = setTimeout(() => setVisibleCards([0]), 200);
    const timer2 = setTimeout(() => setVisibleCards([0, 1]), 600);
    const timer3 = setTimeout(() => setVisibleCards([0, 1, 2]), 1000);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  const testimonials = [
    {
      quote: "This platform transformed my freelance business. I went from struggling to find quality AI projects to having a steady stream of high-paying clients. The commission-free model means I keep 100% of what I earn!",
      author: "Sarah Chen",
      title: "AI Developer & Consultant",
      company: "TechFlow Solutions",
      rating: 5,
      avatar: "SC",
      project: "Built 12+ AI automation tools"
    },
    {
      quote: "Finally, a marketplace that understands AI talent! The quality of projects here is exceptional, and clients actually appreciate the value of AI expertise. My income has doubled in just 6 months.",
      author: "Marcus Rodriguez",
      title: "Machine Learning Engineer",
      company: "DataCraft AI",
      rating: 5,
      avatar: "MR",
      project: "Delivered 8 ML models successfully"
    },
    {
      quote: "As a business owner, finding skilled AI developers was always a challenge. This platform connected me with top-tier talent who delivered a chatbot that increased our customer satisfaction by 40%.",
      author: "Emily Johnson",
      title: "CEO & Founder",
      company: "InnovateTech",
      rating: 5,
      avatar: "EJ",
      project: "AI Chatbot Implementation"
    }
  ];

  const StarRating = ({ rating }) => {
    return (
      <div className="flex space-x-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-5 h-5 ${i < rating ? 'text-blue-500' : 'text-gray-300'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-white py-20 px-4 relative overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-600 rounded-full filter blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold tracking-wide uppercase">
              Testimonials
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            What Our Community Says
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Join thousands of AI professionals and businesses who are building the future together
          </p>
          <div className="w-24 h-1 bg-blue-500 mx-auto mt-8 rounded-full"></div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={`transform transition-all duration-700 ${
                visibleCards.includes(index) 
                  ? 'translate-y-0 opacity-100' 
                  : 'translate-y-20 opacity-0'
              }`}
              style={{transitionDelay: `${index * 200}ms`}}
            >
              <div className="group relative h-full">
                {/* Card */}
                <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 group-hover:-translate-y-2 h-full flex flex-col">
                  
                  {/* Quote Icon */}
                  <div className="mb-6">
                    <svg className="w-12 h-12 text-blue-500 opacity-20" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z"/>
                    </svg>
                  </div>

                  {/* Rating */}
                  <StarRating rating={testimonial.rating} />
                  
                  {/* Quote */}
                  <blockquote className="text-gray-700 text-lg leading-relaxed mb-6 flex-grow font-medium">
                    "{testimonial.quote}"
                  </blockquote>
                  
                  {/* Project Tag */}
                  <div className="mb-6">
                    <span className="inline-block bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                      {testimonial.project}
                    </span>
                  </div>
                  
                  {/* Author Section */}
                  <div className="flex items-center pt-6 border-t border-gray-100">
                    {/* Avatar */}
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg mr-4 flex-shrink-0">
                      {testimonial.avatar}
                    </div>
                    
                    {/* Author Info */}
                    <div className="flex-grow">
                      <div className="font-bold text-gray-900 text-lg">
                        {testimonial.author}
                      </div>
                      <div className="text-blue-600 font-semibold text-sm">
                        {testimonial.title}
                      </div>
                      <div className="text-gray-500 text-sm">
                        {testimonial.company}
                      </div>
                    </div>
                  </div>
                  
                  {/* Verification Badge */}
                  <div className="absolute top-4 right-4">
                    <div className="bg-blue-500 text-white p-2 rounded-full">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-20 bg-gradient-to-r from-blue-600 to-blue-700 rounded-3xl p-12 text-white text-center">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="text-4xl font-bold mb-2">2,500+</div>
              <div className="text-blue-100">AI Professionals</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">$2M+</div>
              <div className="text-blue-100">Earned by Freelancers</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">98%</div>
              <div className="text-blue-100">Client Satisfaction</div>
            </div>
          </div>
          
          {/* CTA */}
          <div className="mt-12">
            <button className="bg-white text-blue-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 shadow-lg" onClick={()=>navigate('/login')}>
              Join Our Community Today
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonial;