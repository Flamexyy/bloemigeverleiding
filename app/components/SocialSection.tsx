'use client';
import Image from 'next/image';
import Link from 'next/link';
import { RiArrowRightUpLine } from "react-icons/ri";
import { IoFlowerOutline } from "react-icons/io5";

export default function SocialSection() {
  return (
    <div className="p-4 lg:p-8 py-14 lg:py-20">
      <div className="flex flex-col gap-6 items-start mb-10 text-text">
        <div className='w-full flex flex-col-reverse md:flex-row justify-between items-start gap-5 md:gap-10'>
          <div className='max-w-[800px]'>
            <h2 className="text-3xl font-bold whitespace-nowrap">BOEKETTEN OP MAAT</h2>
          </div>
            <div className='w-full justify-end flex'>
                <Link 
                    href="/contact"
                    className="min-w-fit flex items-center gap-2 transition-opacity mt-2 group"
                >
                    Contact opnemen
                    <RiArrowRightUpLine className="text-xl group-hover:translate-x-[3px] group-hover:translate-y-[-3px] transition-transform duration-300" />
                </Link>
            </div>
        </div>
        <p className='max-w-[800px] text-text/70'>
          In onze catalogus kunt u een boeket kiezen dat perfect past bij uw wensen en budget. 
          Wij stellen zorgvuldig elk arrangement samen met uw voorkeuren in gedachten.
        </p>
      </div>

      {/* Main content section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Left card */}
        <div className="bg-accent text-text rounded-[25px] p-8 pb-5 flex flex-col items-start h-full">
          <h3 className="text-2xl mb-4 font-bold">PERSOONLIJKE<br />BOEKETTEN</h3>
          <p className="max-w-[90%] text-text/80">
            Wij maken boeketten die perfect passen bij elke gelegenheid. Of het nu gaat om een verjaardag, 
            jubileum of gewoon om iemand te laten weten dat je aan ze denkt.
          </p>
          <div className="flex justify-end w-full mt-auto">
            <IoFlowerOutline className="text-[7rem] text-[#fecde2]" />
          </div>
        </div>
        
        {/* Middle card - Image */}
        <div className="rounded-[25px] overflow-hidden h-full">
          <Image 
            src="/top-view-bouquet-with-white-color-roses-red-tulips-pink-hydrangea-greenery.jpg" 
            alt="Bloemen arrangement" 
            width={800}
            height={600}
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Right card - Call to action */}
        <div 
          className="bg-cover bg-center text-text rounded-[25px] p-8 pb-5 flex flex-col items-start justify-between gap-10 h-full"
          style={{ backgroundImage: "url('/flower-shop-collection.jpg')" }}
        >
          <h3 className="text-2xl mb-4 font-bold text-white drop-shadow-md">VERSE BLOEMEN<br />ELKE DAG</h3>
          <div className="w-full flex justify-end items-end">
            <Link href="/shop" passHref>
              <button 
                className="flex items-center justify-center px-5 p-3 bg-accent text-text hover:bg-accent/80 rounded-[100px] transition-all duration-300"
              >
                Bekijk collectie
                <RiArrowRightUpLine className="text-xl ml-2" />
              </button>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Instagram-style gallery */}
      {/* <div className="mt-16">
        <div className="w-full flex flex-col-reverse md:flex-row justify-between items-start gap-5 md:gap-10 mb-8">
          <div className="flex items-center gap-3">
            <h3 className="text-2xl font-bold text-text sm:whitespace-nowrap">VOLG ONS OP INSTAGRAM</h3>
          </div>
          <div className='w-full justify-end flex'>
            <Link 
                href="https://instagram.com" 
                target="_blank"
                className="min-w-fit justify-end flex items-center gap-2 text-text transition-colors group"
            >
                @bloemigeverleidingen
                <RiArrowRightUpLine className="text-xl group-hover:translate-x-[3px] group-hover:translate-y-[-3px] transition-transform duration-300" />
            </Link>
            </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
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
                <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-accent/80 px-4 py-2 rounded-[100px]">
                  Bekijk op Instagram
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div> */}
    </div>
  );
}
