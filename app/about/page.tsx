"use client";
import Image from "next/image";
import Link from "next/link";
import { RiArrowRightUpLine } from "react-icons/ri";
import { IoCheckmark } from "react-icons/io5";
import Head from "next/head";

export default function AboutPage() {
  return (
    <>
      <Head>
        <title>Over ons | Bloemigeverleiding</title>
      </Head>
      <div className="mx-auto max-w-[1600px] px-4 py-12 md:py-20 lg:px-8">
        {/* Hero Section */}
        <div className="mb-10 flex flex-col items-start gap-6 text-text">
          <div className="flex w-full flex-col-reverse items-start justify-between gap-5 md:flex-row md:gap-10">
            <div className="max-w-[800px]">
              <h1 className="text-3xl font-bold md:text-4xl">OVER ONS</h1>
            </div>
          </div>
          <p className="max-w-[800px] text-text/70">
            Ontdek het verhaal achter Bloemigeverleiding, waar passie voor bloemen en creativiteit samenkomen.
          </p>
        </div>

        {/* About Content */}
        <div className="mb-16 grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12">
          <div className="relative aspect-square overflow-hidden rounded-[25px]">
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
              Bloemigeverleiding is ontstaan uit een diepe liefde voor de schoonheid van bloemen en de vreugde die ze brengen in het leven van mensen.
              Wat begon als een kleine droom is uitgegroeid tot een bloeiende onderneming met een missie: het creëren van prachtige bloemstukken die
              emoties overbrengen en momenten onvergetelijk maken.
            </p>
            <p>
              Ons team van gepassioneerde bloemisten werkt elke dag met toewijding om de mooiste en verste bloemen te selecteren en deze om te toveren
              tot kunstwerken die spreken tot het hart. We geloven dat bloemen meer zijn dan decoratie – ze vertellen verhalen, drukken gevoelens uit
              en verbinden mensen.
            </p>
            <div className="pt-4">
              <Link
                href="/shop"
                className="group inline-flex w-fit items-center gap-2 font-medium text-text"
              >
                Bekijk onze collectie
                <RiArrowRightUpLine className="text-xl transition-transform duration-300 group-hover:translate-x-[3px] group-hover:translate-y-[-3px]" />
              </Link>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <h2 className="mb-8 text-2xl font-bold text-text">Onze Waarden</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="rounded-[25px] border-2 border-accent/20 bg-accent/5 p-6 transition-colors hover:border-accent/40">
              <h3 className="mb-4 text-lg font-bold text-text">Kwaliteit</h3>
              <p className="text-text/70">
                We selecteren alleen de verste en mooiste bloemen voor onze arrangementen, zodat u zo lang mogelijk kunt genieten van uw boeket.
              </p>
            </div>
            <div className="rounded-[25px] border-2 border-accent/20 bg-accent/5 p-6 transition-colors hover:border-accent/40">
              <h3 className="mb-4 text-lg font-bold text-text">Creativiteit</h3>
              <p className="text-text/70">Elk bloemstuk is een uniek kunstwerk, zorgvuldig samengesteld met oog voor kleur, textuur en compositie.</p>
            </div>
            <div className="rounded-[25px] border-2 border-accent/20 bg-accent/5 p-6 transition-colors hover:border-accent/40">
              <h3 className="mb-4 text-lg font-bold text-text">Duurzaamheid</h3>
              <p className="text-text/70">
                We streven naar milieuvriendelijke praktijken, van het inkopen van lokale bloemen tot het gebruik van duurzame verpakkingen.
              </p>
            </div>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="mb-16 rounded-[25px] border-2 border-accent/20 bg-accent/5 p-8">
          <h2 className="mb-6 text-2xl font-bold text-text">Waarom Kiezen voor Bloemigeverleiding?</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <ul className="space-y-4">
              {[
                "Handgemaakte boeketten met verse bloemen",
                "Snelle bezorging in heel Nederland",
                "Persoonlijke service en advies",
                "Seizoensgebonden collecties",
              ].map((item, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3 text-text/70"
                >
                  <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-accent/20">
                    <IoCheckmark className="text-sm text-text" />
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
                "Abonnementsopties beschikbaar",
              ].map((item, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3 text-text/70"
                >
                  <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-accent/20">
                    <IoCheckmark className="text-sm text-text" />
                  </div>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* CTA Section */}
        <div className="py-10 text-center">
          <h2 className="mb-4 text-2xl font-bold text-text">Klaar om te Bestellen?</h2>
          <p className="mx-auto mb-6 max-w-2xl text-text/70">
            Ontdek onze collectie handgemaakte boeketten en laat ons uw dag opfleuren met de schoonheid van verse bloemen.
          </p>
          <Link
            href="/shop"
            className="group inline-flex items-center gap-2 rounded-[100px] bg-accent px-8 py-3 text-text transition-colors hover:bg-accent/70"
          >
            <span>Bekijk onze collectie</span>
            <RiArrowRightUpLine className="text-xl transition-transform duration-300 group-hover:translate-x-[3px] group-hover:translate-y-[-3px]" />
          </Link>
        </div>
      </div>
    </>
  );
}
