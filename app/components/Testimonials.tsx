"use client";
import { useState } from "react";
import Image from "next/image";
import { IoStar, IoStarHalf } from "react-icons/io5";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { RiArrowRightUpLine } from "react-icons/ri";
import Link from "next/link";

// Sample testimonial data
const testimonials = [
  {
    id: 1,
    name: "Emma de Vries",
    role: "Tevreden klant",
    image: "/flower-shop-collection.jpg",
    rating: 5,
    text: "De bloemen waren prachtig en precies wat ik zocht en de bezorging was snel. Ik zal zeker weer bestellen!",
  },
  {
    id: 2,
    name: "Thomas Bakker",
    role: "Vaste klant",
    image: "/top-view-bouquet-with-white-color-roses-red-tulips-pink-hydrangea-greenery.jpg",
    rating: 4.5,
    text: "Ik heb een boeket besteld voor mijn vriendin en ze was er dol op! De kwaliteit was geweldig en de kleuren waren zo levendig. Ik ben zeer tevreden met mijn aankoop.",
  },
  {
    id: 3,
    name: "Sophie Jansen",
    role: "Bruid",
    image: "/flower-shop-collection.jpg",
    rating: 5,
    text: "Mijn bruiloftsbloemen waren adembenemend. Precies zoals ik me had voorgesteld. Iedereen vroeg waar ik ze had besteld. Dank jullie wel!",
  },
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
      stars.push(
        <IoStar
          key={`star-${i}`}
          className="text-accent"
        />,
      );
    }

    if (hasHalfStar) {
      stars.push(
        <IoStarHalf
          key="half-star"
          className="text-accent"
        />,
      );
    }

    return stars;
  };

  return (
    <div className="p-4 py-14 lg:p-8 lg:py-20">
      <div className="mx-auto max-w-[1600px]">
        {/* Header with "View All" link like in other sections */}
        <div className="mb-10 flex flex-col items-start gap-6 text-text">
          <div className="flex w-full flex-col-reverse items-start justify-between gap-5 md:flex-row md:gap-10">
            <div className="max-w-[800px]">
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
          <p className="max-w-[800px] text-text/70">Ontdek waarom onze klanten steeds terugkomen voor onze prachtige boeketten.</p>
        </div>

        {/* Testimonial Cards in a grid like your Claims component */}
        <div className="mb-8 grid grid-cols-1 gap-3 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className={`flex flex-col rounded-[25px] bg-accent p-8 text-text ${
                index === activeIndex ? "ring-4 ring-[#fecde2]" : "opacity-80"
              } cursor-pointer transition-all duration-300`}
              onClick={() => setActiveIndex(index)}
            >
              <div className="mb-4 flex items-center gap-4">
                <div className="h-16 w-16 overflow-hidden rounded-full border-2 border-[#fecde2]">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    width={100}
                    height={100}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-text">{testimonial.name}</h4>
                  <p className="text-sm text-text/70">{testimonial.role}</p>
                </div>
              </div>

              <div className="mb-3 flex">{renderStars(testimonial.rating)}</div>

              <p className="flex-grow italic text-text/90">"{testimonial.text}"</p>

              {index === activeIndex && (
                <div className="mt-4 text-right">
                  <span className="inline-block rounded-full bg-[#fecde2] px-3 py-1 text-sm text-text">Geverifieerde aankoop</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Navigation and CTA */}
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          {/* Pagination Dots */}
          <div className="flex gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`h-3 w-3 rounded-full transition-colors ${index === activeIndex ? "bg-accent" : "bg-text/20"}`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>

          {/* CTA Button */}
          <Link
            href="/shop"
            className="flex items-center justify-center rounded-[100px] border-2 border-accent bg-transparent p-3 px-10 text-text transition-all duration-300 hover:bg-accent"
          >
            Bekijk onze producten
          </Link>
        </div>
      </div>
    </div>
  );
}
