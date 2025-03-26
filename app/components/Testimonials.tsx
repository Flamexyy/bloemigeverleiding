'use client';
import { useState } from 'react';
import Image from 'next/image';
import { IoStar, IoStarHalf } from "react-icons/io5";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { RiArrowRightUpLine } from "react-icons/ri";
import Link from 'next/link';

// Sample testimonial data
const testimonials = [
  {
    id: 1,
    name: "Emma de Vries",
    role: "Tevreden klant",
    image: "/flower-shop-collection.jpg",
    rating: 5,
    text: "De bloemen waren prachtig en precies wat ik zocht. De bezorging was snel en de bloemen waren vers. Ik zal zeker weer bestellen!"
  },
  {
    id: 2,
    name: "Thomas Bakker",
    role: "Vaste klant",
    image: "/top-view-bouquet-with-white-color-roses-red-tulips-pink-hydrangea-greenery.jpg",
    rating: 4.5,
    text: "Al jaren bestel ik hier bloemen voor speciale gelegenheden. De kwaliteit is altijd uitstekend en de service is top. Echt een aanrader!"
  },
  {
    id: 3,
    name: "Sophie Jansen",
    role: "Bruid",
    image: "/flower-shop-collection.jpg",
    rating: 5,
    text: "Mijn bruiloftsbloemen waren adembenemend. Precies zoals ik me had voorgesteld. Iedereen vroeg waar ik ze had besteld. Dank jullie wel!"
  }
];

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);

  const nextTestimonial = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
  };

  // Generate star rating
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<IoStar key={`star-${i}`} className="text-accent" />);
    }

    if (hasHalfStar) {
      stars.push(<IoStarHalf key="half-star" className="text-accent" />);
    }

    return stars;
  };

  return (
    <div className="p-4 lg:p-8 py-14 lg:py-20">
      <div className="max-w-[1600px] mx-auto">
        {/* Header with "View All" link like in other sections */}
        <div className="flex flex-col gap-6 items-start mb-10 text-text">
          <div className='w-full flex flex-col-reverse md:flex-row justify-between items-start gap-5 md:gap-10'>
            <div className='max-w-[800px]'>
              <h2 className="text-3xl font-bold">KLANTERVARINGEN</h2>
            </div>
                {/* <div className='w-full justify-end flex '>
                <Link 
                    href="/faq"
                    className="min-w-fit flex items-center gap-2 transition-opacity mt-2 group"
                >
                    Bekijk alle reviews
                    <RiArrowRightUpLine className="text-xl group-hover:translate-x-[3px] group-hover:translate-y-[-3px] transition-transform duration-300" />
                    </Link>
                </div> */}
          </div>
          <p className='max-w-[800px] text-text/70'>
            Ontdek waarom onze klanten steeds terugkomen voor onze prachtige boeketten en uitzonderlijke service.
          </p>
        </div>

        {/* Testimonial Cards in a grid like your Claims component */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={testimonial.id}
              className={`bg-accent text-text rounded-[25px] p-8 flex flex-col ${
                index === activeIndex ? 'ring-4 ring-[#fecde2]' : 'opacity-80'
              } cursor-pointer transition-all duration-300`}
              onClick={() => setActiveIndex(index)}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#fecde2]">
                  <Image 
                    src={testimonial.image}
                    alt={testimonial.name}
                    width={100}
                    height={100}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-text">{testimonial.name}</h4>
                  <p className="text-text/70 text-sm">{testimonial.role}</p>
                </div>
              </div>
              
              <div className="flex mb-3">
                {renderStars(testimonial.rating)}
              </div>
              
              <p className="text-text/90 italic flex-grow">
                "{testimonial.text}"
              </p>
              
              {index === activeIndex && (
                <div className="mt-4 text-right">
                  <span className="inline-block bg-[#fecde2] text-text px-3 py-1 rounded-full text-sm">
                    Geverifieerde aankoop
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
        
        {/* Navigation and CTA */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Pagination Dots */}
          <div className="flex gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === activeIndex ? 'bg-accent' : 'bg-text/20'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
          
          {/* CTA Button */}
          <Link 
            href="/shop" 
            className="flex items-center justify-center px-10 p-3 bg-transparent text-text border-2 border-accent hover:bg-accent rounded-[100px] transition-all duration-300"
          >
            Bekijk onze producten
          </Link>
        </div>
      </div>
    </div>
  );
} 