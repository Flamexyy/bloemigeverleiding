import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function ThankYouPage() {
  return (
    <div className="max-w-[1600px] mx-auto px-4 lg:px-8 py-12 md:py-20">
      <div className="text-center py-16 space-y-6">
        <div className="flex justify-center">
          <Image 
            src="/logo.svg" 
            alt="Bloemige Verleiding Logo" 
            width={120} 
            height={120} 
            className="mb-4"
          />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-text mb-4">Bedankt voor je bestelling!</h1>
        <p className="text-text/70 max-w-md mx-auto">
          We hebben je bestelling ontvangen en zullen deze zo snel mogelijk verwerken.
          Je ontvangt binnenkort een bevestigingsmail met de details van je bestelling.
        </p>
        <Link 
          href="/shop" 
          className="inline-block bg-accent text-text rounded-[50px] px-8 py-3 mt-4 hover:bg-accent/70 transition-colors"
        >
          Terug naar de winkel
        </Link>
      </div>
    </div>
  );
} 