"use client";
import { useState, useEffect } from "react";
import { useLiked } from "../context/LikedContext";
import ProductCard from "../components/ProductCard";
import { IoMdHeartEmpty } from "react-icons/io";
import Link from "next/link";
import Head from "next/head";

export default function LikedPage() {
  const { likedItems } = useLiked();
  const [itemsReady, setItemsReady] = useState(false);

  useEffect(() => {
    if (likedItems.length >= 0) {
      const timer = setTimeout(() => {
        setItemsReady(true);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [likedItems]);

  return (
    <>
      <Head>
        <title>Favorieten | Bloemigeverleiding</title>
      </Head>
      <div className="mx-auto max-w-[1600px] px-4 py-12 md:py-20 lg:px-8">
        <div className="mb-10 flex flex-col items-start gap-6 text-text">
          <h1 className="text-3xl font-bold md:text-4xl">FAVORIETEN</h1>
          {likedItems.length > 0 && (
            <p className="max-w-3xl text-text/70">
              Hier vind je de producten die je hebt opgeslagen als favoriet. Klik op het hartje om ze weer te verwijderen.
            </p>
          )}
        </div>

        {likedItems.length === 0 ? (
          <div className={`text-center transition-opacity duration-300 ease-in-out ${itemsReady ? "opacity-100" : "opacity-0"}`}>
            <div className="mb-4 flex justify-center">
              <IoMdHeartEmpty className="text-6xl text-text/30" />
            </div>
            <h2 className="text-xl font-bold text-text">Je hebt nog geen favorieten</h2>
            <p className="mx-auto mb-6 max-w-md text-text/70">Klik op het hartje bij een product om het hier op te slaan.</p>
            <Link
              href="/shop"
              className="mt-4 inline-block rounded-[50px] bg-accent px-8 py-3 text-text transition-colors hover:bg-accent/70"
            >
              Bekijk onze producten
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 gap-y-10 md:grid-cols-3 md:gap-4 md:gap-y-10 lg:grid-cols-4">
            {likedItems.map((item) => (
              <div
                key={item.id}
                className={`transition-opacity duration-300 ease-in-out ${itemsReady ? "opacity-100" : "opacity-0"}`}
              >
                <ProductCard product={item} />
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
