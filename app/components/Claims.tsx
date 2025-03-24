import React from 'react';
import { FaShippingFast } from "react-icons/fa";
import { HiOutlinePercentBadge } from "react-icons/hi2";
import { RiArrowRightUpLine } from "react-icons/ri";
import { LuClock4 } from "react-icons/lu";
import Link from 'next/link';

export default function Claims() {
    return (
        <div className='grid grid-cols-1 md:grid-cols-3 gap-3 p-4 lg:p-8 w-full'>
           <div className='bg-accent text-text w-full rounded-[25px] p-8 pb-5 flex flex-col items-start'>
                <h2 className='text-2xl mb-4 font-bold'>Gratis verzending <br />vanaf €150</h2>
                <p className='max-w-[90%]'>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
                <div className='flex justify-end w-full'>
                    <FaShippingFast className='text-[7rem] text-[#fecde2]' />
                </div>
           </div>
           <div className='bg-accent text-text w-full rounded-[25px] p-8 pb-5 flex flex-col items-start'>
                <h2 className='text-2xl mb-4 font-bold'>Binnen 24<br />uur verzonden</h2>
                <p className='max-w-[90%]'>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
                <div className='flex justify-end w-full'>
                    <LuClock4 className='text-[7rem] text-[#fecde2]' />
                </div>
           </div>
           <div 
                className='bg-cover justify-between bg-center text-text w-full rounded-[25px] p-8 pb-5 flex flex-col items-start gap-10' 
                style={{ backgroundImage: "url('/joanna-kosinska-ToV0rS9nTYs-unsplash.jpg')" }}
           >
                <h2 className='text-2xl mb-4 font-bold'>Begin met shoppen</h2>
                <div className='w-full flex justify-end items-end flex-end'>
                    <Link href="/shop" passHref>
                        <button 
                            className='flex items-center justify-center px-5 p-3 bg-accent text-text hover:bg-gray-100 rounded-[100px] transition-all duration-300'
                        >
                            Bekijk het assortiment
                            <RiArrowRightUpLine className="text-xl ml-2" />
                        </button>
                    </Link>
                </div>
           </div>
        </div>
    );
};
