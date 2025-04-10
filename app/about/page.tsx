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
            Ontdek het verhaal achter Bloemige verleiding, waar zorg en liefde voor bloemen en creativiteit samenkomen.
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
            <h2 className="text-2xl font-bold text-text">Onze zorg en liefde voor bloemen</h2>
            <p>
              Bij Bloemige Verleiding draait alles om de liefde voor bloemen die altijd bloeien. Onze handgemaakte zijden boeketten zijn met liefde en
              zorg samengesteld om sfeer te brengen en momenten een blijvende betekenis te geven.
            </p>
            <p>
              Of het nu gaat om een verjaardag, bruiloft, een cadeau voor jezelf of een stijlvol boeket voor op tafel met onze blijvend mooie bloemen
              maak je van elk moment iets bijzonders.
            </p>
            <div className="pt-4">
              <Link
                href="/shop"
                className="group inline-flex w-fit items-center gap-2 rounded-[100px] border-2 border-accent px-8 py-3 font-medium text-text transition-all duration-300 hover:bg-accent"
              >
                Bekijk onze collectie
                <RiArrowRightUpLine className="text-xl transition-transform duration-300 group-hover:translate-x-[3px] group-hover:translate-y-[-3px]" />
              </Link>
            </div>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="mb-16 rounded-[25px] border-2 border-accent/20 bg-accent/5 p-8">
          <h2 className="mb-6 text-2xl font-bold text-text">Waarom kiezen voor Bloemige verleiding?</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <ul className="space-y-4">
              {[
                "Handgemaakte zijden boeketten met kwaliteit bloemen",
                "Snelle bezorging in heel Nederland en België",
                "Persoonlijke service en advies",
                // "Seizoensgebonden collecties",
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
              {["Unieke ontwerpen voor elke gelegenheid", "Duurzaam en milieuvriendelijk", "Tevredenheidsgarantie"].map((item, index) => (
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
          <h2 className="mb-4 text-2xl font-bold text-text">Klaar om te bestellen?</h2>
          <p className="mx-auto mb-6 max-w-2xl text-text/70">
            Ontdek onze collectie handgemaakte zijden boeketten en laat ons uw dag opfleuren met de schoonheid van bloemen.
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
