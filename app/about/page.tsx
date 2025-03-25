'use client';
import Image from 'next/image';
import Link from 'next/link';
import { IoMdHeart } from "react-icons/io";

export default function AboutPage() {
  return (
    <div className="max-w-[1200px] mx-auto px-4 lg:px-8">
      <div className="py-12 lg:py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-text">Ons Verhaal</h1>
          <div className="max-w-3xl mx-auto">
            <p className="text-text text-lg mb-6">
              Bij [Merk Naam] geloven we dat mode meer is dan alleen kleding - het is een manier om jezelf uit te drukken en je goed te voelen.
            </p>
            <p className="text-text text-lg">
              Opgericht in 2023, zijn we toegewijd aan het creëren van stijlvolle, duurzame en betaalbare mode voor iedereen.
            </p>
          </div>
        </div>

        {/* Brand Values */}
        <div className="mb-24">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-cream rounded-[25px] p-8 text-center">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-6">
                <IoMdHeart className="text-3xl text-text" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-text">Kwaliteit</h3>
              <p className="text-text">
                We selecteren zorgvuldig de beste materialen en werken met ervaren ambachtslieden om producten te maken die lang meegaan.
              </p>
            </div>
            
            <div className="bg-cream rounded-[25px] p-8 text-center">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-6">
                <IoMdHeart className="text-3xl text-text" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-text">Duurzaamheid</h3>
              <p className="text-text">
                Onze producten worden ethisch geproduceerd met respect voor mensen en de planeet, met minimale milieu-impact.
              </p>
            </div>
            
            <div className="bg-cream rounded-[25px] p-8 text-center">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-6">
                <IoMdHeart className="text-3xl text-text" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-text">Inclusiviteit</h3>
              <p className="text-text">
                We ontwerpen voor iedereen, ongeacht leeftijd, maat of stijl, zodat iedereen zich mooi en zelfverzekerd kan voelen.
              </p>
            </div>
          </div>
        </div>

        {/* Our Team */}
        <div className="mb-24">
          <h2 className="text-3xl font-bold mb-12 text-center text-text">Ons Team</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="text-center">
                <div className="aspect-square bg-accent/30 rounded-[25px] mb-4 relative overflow-hidden">
                  {/* Placeholder for team member photos */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-text font-medium">Foto</span>
                  </div>
                </div>
                <h3 className="font-bold text-lg text-text">Naam Achternaam</h3>
                <p className="text-text">Functietitel</p>
              </div>
            ))}
          </div>
        </div>

        {/* Our Story Timeline */}
        <div className="mb-24">
          <h2 className="text-3xl font-bold mb-12 text-center text-text">Onze Reis</h2>
          <div className="space-y-12">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="md:w-1/2">
                <div className="bg-accent/30 rounded-[25px] aspect-video"></div>
              </div>
              <div className="md:w-1/2">
                <h3 className="text-xl font-bold mb-2 text-text">2023: Het Begin</h3>
                <p className="text-text mb-4">
                  Onze oprichter begon met een eenvoudige missie: betaalbare, stijlvolle en duurzame mode creëren die iedereen kan dragen.
                </p>
                <p className="text-text">
                  Met slechts een kleine collectie en een online winkel, begonnen we onze reis in de modewereld.
                </p>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row-reverse gap-8 items-center">
              <div className="md:w-1/2">
                <div className="bg-accent/30 rounded-[25px] aspect-video"></div>
              </div>
              <div className="md:w-1/2">
                <h3 className="text-xl font-bold mb-2 text-text">2024: Groei & Innovatie</h3>
                <p className="text-text mb-4">
                  Na een succesvol eerste jaar breidden we ons team uit en lanceerden nieuwe collecties die onze toewijding aan kwaliteit en stijl weerspiegelen.
                </p>
                <p className="text-text">
                  We blijven innoveren en luisteren naar onze klanten om betere producten en ervaringen te creëren.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-accent/30 rounded-[25px] p-8 md:p-12 text-center">
          <h2 className="text-2xl font-bold mb-6 text-text">Word Deel van Ons Verhaal</h2>
          <p className="text-text max-w-2xl mx-auto mb-8">
            Ontdek onze nieuwste collecties en ervaar zelf het verschil dat kwaliteit, stijl en duurzaamheid kunnen maken.
          </p>
          <Link href="/shop" className="inline-block bg-accent text-text py-3 px-8 rounded-[50px] font-medium hover:bg-accent/80 transition-colors">
            Bekijk Onze Collectie
          </Link>
        </div>
      </div>
    </div>
  );
} 