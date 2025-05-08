// import React from 'react';
// import { assets } from '../assets/assets';

// const ContactUs = () => {
//     return (
//         <div className="min-h-screen  flex flex-col items-center justify-center px-4 py-10">
//             <h1 className="text-3xl font-bold text-gray-800 mb-10 text-center">Contact Us</h1>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl w-full">
//                 {/* Admin Section */}
//                 <div className="flex flex-col items-center bg-white shadow-lg rounded-lg p-6">
//                     <img src={assets.admin_icon} alt="Admin Icon" className="h-20 w-20 mb-4" />
//                     <h2 className="text-xl font-semibold text-gray-800 mb-2">Admin</h2>
//                     <p className="text-gray-600 text-center mb-2">For administrative inquiries, please contact us at:</p>
//                     <p className="text-blue-600 font-medium">admin@example.com</p>
//                 </div>

//                 {/* Developer Section */}
//                 <div className="flex flex-col items-center bg-white shadow-lg rounded-lg p-6">
//                     <img src={assets.devloper_icon} alt="Developer Icon" className="h-20 w-20 mb-4" />
//                     <h2 className="text-xl font-semibold text-gray-800 mb-2">Developer</h2>
//                     <p className="text-gray-600 text-center mb-2">For technical support or development-related queries, reach out to:</p>
//                     <p className="text-blue-600 font-medium">developer@example.com</p>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default ContactUs;

import React from 'react';
import { assets } from '../assets/assets';

const ContactUs = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 flex flex-col items-center justify-center px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-10 text-center">Contact Us</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl w-full">
        {/* Admin Section */}
        <div className="flex flex-col items-center bg-blue-100 shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow">
          <img src={assets.admin_icon} alt="Admin Icon" className="h-20 w-20 mb-4" />
          <h2 className="text-xl font-semibold text-blue-800 mb-2">Admin</h2>
          <p className="text-gray-700 text-center mb-4">For administrative inquiries, please contact us at:</p>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
            admin@example.com
          </button>
        </div>

        {/* Developer Section */}
        <div className="flex flex-col items-center bg-blue-100 shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow">
          <img src={assets.devloper_icon} alt="Developer Icon" className="h-20 w-20 mb-4" />
          <h2 className="text-xl font-semibold text-blue-800 mb-2">Developer</h2>
          <p className="text-gray-700 text-center mb-4">For technical support or development-related queries, reach out to:</p>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
            developer@example.com
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;