'use client';
import Image from 'next/image';
import Link from 'next/link';
import { RiArrowRightUpLine } from "react-icons/ri";

export default function SocialSection() {
  return (
    <div className="p-4 lg:p-8 py-14 lg:py-20">
      <div className="flex flex-col gap-6 items-start mb-10 text-text">
        <div className='w-full flex justify-between items-start gap-10'>
          <div className='max-w-[800px]'>
            <h2 className="text-3xl font-bold">BOEKETTEN OP MAAT</h2>
          </div>
          <Link 
            href="/contact"
            className="min-w-fit flex items-center gap-2 transition-opacity mt-2 group"
          >
            Neem contact op
            <RiArrowRightUpLine className="text-xl group-hover:translate-x-[3px] group-hover:translate-y-[-3px] transition-transform duration-300" />
          </Link>
        </div>
        <p className='max-w-[800px]'>
          In onze catalogus kunt u een boeket kiezen dat perfect past bij uw wensen en budget. 
          Wij stellen zorgvuldig elk arrangement samen met uw voorkeuren in gedachten.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Left side: Image */}
        <div className="rounded-[25px] overflow-hidden">
          <Image 
            src="/top-view-bouquet-with-white-color-roses-red-tulips-pink-hydrangea-greenery.jpg" 
            alt="Bloemen arrangement" 
            width={800}
            height={600}
            className="w-full h-auto object-cover"
          />
        </div>
        
        {/* Right side: Content */}
        <div className="space-y-8">
          <div className="bg-cream p-8 rounded-[25px] shadow-sm space-y-6">
            <h3 className="text-2xl font-bold text-text">
              PERSOONLIJKE BOEKETTEN
            </h3>
            
            <p className="text-text/70">
              Wij maken boeketten die perfect passen bij elke gelegenheid. Of het nu gaat om een verjaardag, 
              jubileum of gewoon om iemand te laten weten dat je aan ze denkt, wij hebben het perfecte boeket.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Link 
                href="/shop" 
                className="bg-accent text-text px-6 py-3 rounded-[25px] hover:bg-accent/70 transition-colors font-medium"
              >
                Bekijk collectie
              </Link>
              
              <Link 
                href="/contact" 
                className="border border-text/20 text-text px-6 py-3 rounded-[25px] hover:bg-accent/20 transition-colors font-medium"
              >
                Neem contact op
              </Link>
            </div>
          </div>
          
          {/* Small flower image with text */}
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-accent flex-shrink-0">
              <Image 
                src="/flower-shop-collection.jpg" 
                alt="Enkele bloem" 
                width={100}
                height={100}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h4 className="font-bold text-text">VERSE BLOEMEN</h4>
              <p className="text-text/70 text-sm">
                Wij gebruiken alleen de meest verse bloemen voor onze boeketten, 
                zodat ze langer mooi blijven.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Instagram-style gallery */}
      <div className="mt-16">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-2xl font-bold text-text">VOLG ONS OP INSTAGRAM</h3>
          <Link 
            href="https://instagram.com" 
            target="_blank"
            className="flex items-center gap-2 text-text hover:text-text/70 transition-colors"
          >
            @bloemigeverleidingen
            <RiArrowRightUpLine />
          </Link>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((num) => (
            <Link 
              key={num}
              href="https://instagram.com" 
              target="_blank"
              className="rounded-[25px] overflow-hidden aspect-square relative group"
            >
              <Image 
                src={num % 2 === 0 
                  ? "/top-view-bouquet-with-white-color-roses-red-tulips-pink-hydrangea-greenery.jpg"
                  : "/flower-shop-collection.jpg"
                }
                alt={`Instagram post ${num}`} 
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Bekijk op Instagram
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
