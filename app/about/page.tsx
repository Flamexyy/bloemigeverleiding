'use client';
import Image from 'next/image';
import Link from 'next/link';
import { RiArrowRightUpLine } from "react-icons/ri";
import { IoCheckmark } from "react-icons/io5";

export default function AboutPage() {
  return (
    <div className="max-w-[1600px] mx-auto px-4 lg:px-8 py-12 md:py-20">
      {/* Hero Section */}
      <div className="flex flex-col gap-6 items-start mb-10 text-text">
        <div className='w-full flex flex-col-reverse md:flex-row justify-between items-start gap-5 md:gap-10'>
          <div className='max-w-[800px]'>
            <h1 className="text-3xl md:text-4xl font-bold">OVER ONS</h1>
          </div>
        </div>
        <p className='max-w-[800px] text-text/70'>
          Ontdek het verhaal achter Bloemigeverleiding, waar passie voor bloemen en creativiteit samenkomen.
        </p>
      </div>

      {/* About Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-16">
        <div className="relative aspect-square rounded-[25px] overflow-hidden">
          <Image 
            src="/view-beautiful-blooming-roses.jpg" 
            alt="Onze bloemenwinkel" 
            fill 
            className="object-cover"
          />
        </div>
        <div className="flex flex-col justify-center space-y-6 text-text/70">
          <h2 className="text-2xl font-bold text-text">Onze Passie voor Bloemen</h2>
          <p>
            Bloemigeverleiding is ontstaan uit een diepe liefde voor de schoonheid van bloemen en de vreugde die ze brengen in het leven van mensen. Wat begon als een kleine droom is uitgegroeid tot een bloeiende onderneming met een missie: het creëren van prachtige bloemstukken die emoties overbrengen en momenten onvergetelijk maken.
          </p>
          <p>
            Ons team van gepassioneerde bloemisten werkt elke dag met toewijding om de mooiste en verste bloemen te selecteren en deze om te toveren tot kunstwerken die spreken tot het hart. We geloven dat bloemen meer zijn dan decoratie – ze vertellen verhalen, drukken gevoelens uit en verbinden mensen.
          </p>
          <div className="pt-4">
            <Link 
              href="/shop" 
              className="group inline-flex items-center gap-2 text-text font-medium w-fit"
            >
              Bekijk onze collectie
              <RiArrowRightUpLine className="text-xl group-hover:translate-x-[3px] group-hover:translate-y-[-3px] transition-transform duration-300" />
            </Link>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold mb-8 text-text">Onze Waarden</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-accent/5 p-6 rounded-[25px] border-2 border-accent/20 hover:border-accent/40 transition-colors">
            <h3 className="font-bold text-lg mb-4 text-text">Kwaliteit</h3>
            <p className="text-text/70">
              We selecteren alleen de verste en mooiste bloemen voor onze arrangementen, zodat u zo lang mogelijk kunt genieten van uw boeket.
            </p>
          </div>
          <div className="bg-accent/5 p-6 rounded-[25px] border-2 border-accent/20 hover:border-accent/40 transition-colors">
            <h3 className="font-bold text-lg mb-4 text-text">Creativiteit</h3>
            <p className="text-text/70">
              Elk bloemstuk is een uniek kunstwerk, zorgvuldig samengesteld met oog voor kleur, textuur en compositie.
            </p>
          </div>
          <div className="bg-accent/5 p-6 rounded-[25px] border-2 border-accent/20 hover:border-accent/40 transition-colors">
            <h3 className="font-bold text-lg mb-4 text-text">Duurzaamheid</h3>
            <p className="text-text/70">
              We streven naar milieuvriendelijke praktijken, van het inkopen van lokale bloemen tot het gebruik van duurzame verpakkingen.
            </p>
          </div>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="bg-accent/5 p-8 rounded-[25px] border-2 border-accent/20 mb-16">
        <h2 className="text-2xl font-bold mb-6 text-text">Waarom Kiezen voor Bloemigeverleiding?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ul className="space-y-4">
            {[
              "Handgemaakte boeketten met verse bloemen",
              "Snelle bezorging in heel Nederland",
              "Persoonlijke service en advies",
              "Seizoensgebonden collecties"
            ].map((item, index) => (
              <li key={index} className="flex items-start gap-3 text-text/70">
                <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <IoCheckmark className="text-text text-sm" />
                </div>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <ul className="space-y-4">
            {[
              "Unieke ontwerpen voor elke gelegenheid",
              "Duurzame en milieuvriendelijke praktijken",
              "Tevredenheidsgarantie",
              "Abonnementsopties beschikbaar"
            ].map((item, index) => (
              <li key={index} className="flex items-start gap-3 text-text/70">
                <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <IoCheckmark className="text-text text-sm" />
                </div>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold mb-4 text-text">Klaar om te Bestellen?</h2>
        <p className="text-text/70 max-w-2xl mx-auto mb-6">
          Ontdek onze collectie handgemaakte boeketten en laat ons uw dag opfleuren met de schoonheid van verse bloemen.
        </p>
        <Link 
          href="/shop" 
          className="group inline-flex items-center gap-2 bg-accent text-text rounded-[100px] px-8 py-3 hover:bg-accent/70 transition-colors"
        >
          <span>Bekijk onze collectie</span>
          <RiArrowRightUpLine className="text-xl transition-transform group-hover:translate-x-[3px] group-hover:translate-y-[-3px] duration-300" />
        </Link>
      </div>
    </div>
  );
} 