import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bedankt voor je bestelling",
};

export default function ThankYouPage() {
  return (
    <div className="mx-auto max-w-[1600px] px-4 py-12 md:py-20 lg:px-8">
      <div className="space-y-6 py-16 text-center">
        <div className="flex justify-center">
          <Image
            src="/logo.svg"
            alt="Bloemige Verleiding Logo"
            width={120}
            height={120}
            className="mb-4"
          />
        </div>
        <h1 className="mb-4 text-3xl font-bold text-text md:text-4xl">Bedankt voor je bestelling!</h1>
        <p className="mx-auto max-w-md text-text/70">
          We hebben je bestelling ontvangen en zullen deze zo snel mogelijk verwerken. Je ontvangt binnenkort een bevestigingsmail met de details van
          je bestelling.
        </p>
        <Link
          href="/shop"
          className="mt-4 inline-block rounded-[50px] bg-accent px-8 py-3 text-text transition-colors hover:bg-accent/70"
        >
          Terug naar de winkel
        </Link>
      </div>
    </div>
  );
}
