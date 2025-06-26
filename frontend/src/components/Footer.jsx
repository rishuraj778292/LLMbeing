import { section } from 'motion/react-client'
import React from 'react'


const Footer = () => {
    return (
      <section className='px-5 py-5'>
                <div className='bg-black text-white flex flex-col  px-30 py-10  rounded-2xl '>
            <div className='mb-2'>
                <p >LLMbeing</p>
            </div>


            <div className='flex flex-wrap justify-between  gap-4 py-4'>
                < div className='flex flex-col gap-0.5'>
                    <p className='text-[#333333]  mb-1  '>Company</p>

                    <a href='/about-us'>About Us</a>
                    <a>Blog</a>
                    <a>Careers</a>
                    <a href="/contactus">Contact us</a>

                </div>
                <div className='flex flex-col gap-0.5'>
                    <p className='text-[#333333] mb-1'>Resources</p>

                    <a href='/contactus'>Help Center</a>
                    <a href='/term-of-usage'>Terms of Use</a>
                    <a href='/privacy-policy'>Privacy Policy</a>

                </div>
                <div className='flex flex-col gap-0.5'>
                    <p className='text-[#333333] mb-1 '>Connect</p>

                    <a>Twitter</a>
                    <a>LinkedIn</a>

                </div>
            </div>


        </div >
      </section>
    )
}

export default Footer