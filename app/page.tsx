"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import ProductCard from "./components/ProductCard";
import { getProducts } from "./utils/shopify";
import Image from "next/image";
import { RiArrowRightUpLine } from "react-icons/ri";
import Claims from "./components/Claims";
import Faq from "./components/Faq";
import SocialSection from "./components/SocialSection";
import { ProductCardSkeleton } from "./components/SkeletonLoader";
import Testimonials from "./components/Testimonials";
import { IoFlowerOutline, IoStar } from "react-icons/io5";

interface ShopifyProduct {
  id: string;
  handle: string;
  title: string;
  price: string;
  imageUrl: string;
  availableForSale: boolean;
  variantId: string;
  quantityAvailable?: number;
}

export default function Home() {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const data = await getProducts();
        const formattedProducts = data.map((product: ShopifyProduct) => ({
          ...product,
          quantityAvailable: product.quantityAvailable || 1,
        }));
        setProducts(formattedProducts);
      } catch (err) {
        console.error("Error:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch products");
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  return (
    <div>
      <div className="w-full pt-[80px]">
        {/* Hero Section */}
        <div className="mx-auto max-w-[1600px] px-4 py-10 md:py-16 lg:px-8">
          <div className="flex flex-col-reverse items-center gap-10 lg:flex-row lg:gap-16">
            {/* Text Content */}
            <div className="order-2 w-full space-y-6 text-center lg:order-1 lg:w-1/2 lg:text-left">
              {/* Use font-courgette class */}
              <h1 className="font-courgette text-4xl text-text md:text-5xl lg:text-6xl">De liefde voor bloemen die altijd bloeien</h1>

              <p className="mx-auto max-w-2xl text-lg text-text/70 md:text-xl lg:mx-0">
                Handgemaakte zijden boeketten voor elke gelegenheid, gemaakt met liefde en zorg
              </p>

              <div className="flex flex-col items-center justify-center gap-3 pt-4 sm:flex-row md:gap-4 lg:justify-start">
                <Link href="/shop">
                  <button className="group flex items-center justify-center rounded-[100px] bg-accent px-8 py-3 font-medium text-text transition-all duration-300 hover:bg-accent/70">
                    Zijden Boeketten
                    <RiArrowRightUpLine className="ml-2 text-xl transition-transform duration-300 group-hover:translate-x-[3px] group-hover:translate-y-[-3px]" />
                  </button>
                </Link>

                <Link href="/contact">
                  <button className="flex w-fit items-center justify-center rounded-[100px] border-2 border-accent bg-transparent px-8 py-3 font-medium text-text transition-all duration-300 hover:bg-accent">
                    Neem contact op
                  </button>
                </Link>
              </div>
            </div>

            {/* Image Section - Simplified */}
            <div className="relative order-1 w-full lg:order-2 lg:w-1/2">
              <div className="relative mx-auto aspect-square max-w-[500px]">
                {/* Main image with decorative shape */}
                <div className="absolute inset-0 overflow-hidden rounded-[100px]">
                  <Image
                    src="/top-view-beautiful-roses-bouquet-with-pink-ribbon.jpg"
                    alt="Prachtige boeketten"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>

                {/* Simple accent element */}
                <div className="absolute -bottom-4 -right-4 z-10 flex h-24 w-24 items-center justify-center rounded-full bg-accent font-bold text-text shadow-lg">
                  <div className="text-center">
                    <div className="text-lg md:text-xl">NIEUWE</div>
                    <div className="text-xs">COLLECTIE</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rest of Content - Constrained Width */}
      <div className="mx-auto max-w-[1600px]">
        {/* Featured Products */}
        <div className="p-4 py-14 lg:p-8 lg:py-20">
          <div className="mb-10 flex flex-col items-start gap-6 text-text">
            <div className="flex w-full flex-col-reverse items-start justify-between gap-5 md:flex-row md:gap-10">
              <div className="max-w-[800px]">
                <h2 className="whitespace-nowrap text-3xl font-bold">ZIJDEN BOEKETTEN</h2>
              </div>
              <div className="flex w-full justify-end">
                <Link
                  href="/shop"
                  className="group mt-2 flex min-w-fit items-center gap-2 transition-opacity"
                >
                  Bekijk alles
                  <RiArrowRightUpLine className="text-xl transition-transform duration-300 group-hover:translate-x-[3px] group-hover:translate-y-[-3px]" />
                </Link>
              </div>
            </div>
            <p className="max-w-[800px] text-text/70">
              Ontdek onze zijden boeketten, perfect voor elke gelegenheid. Elk boeket is met liefde en zorg samengesteld.
            </p>
          </div>

          {loading && (
            <div className="grid grid-cols-2 gap-3 gap-y-10 md:gap-4 md:gap-y-10 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <ProductCardSkeleton key={index} />
              ))}
            </div>
          )}

          {error && (
            <div className="py-10 text-center text-red-400">
              <p>Error loading products: {error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 rounded-lg bg-gray-200 px-4 py-2 hover:bg-gray-300"
              >
                Try Again
              </button>
            </div>
          )}

          {!loading && !error && products.length > 0 && (
            <>
              <div className="grid grid-cols-2 gap-3 gap-y-10 md:gap-4 md:gap-y-10 lg:grid-cols-4">
                {products.slice(0, 4).map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                  />
                ))}
              </div>
              <div className="mt-14 flex justify-center">
                <Link
                  href="/shop"
                  className="flex items-center justify-center rounded-[100px] border-2 border-accent bg-transparent p-3 px-10 text-text transition-all duration-300 hover:bg-accent"
                >
                  Bekijk alle producten
                </Link>
              </div>
            </>
          )}

          {!loading && !error && products.length === 0 && (
            <div className="py-10 text-center">
              <p>No products found</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 rounded-lg bg-gray-200 px-4 py-2 hover:bg-gray-300"
              >
                Refresh
              </button>
            </div>
          )}
        </div>
        <Claims />
        <SocialSection />
        <Faq />
        <Testimonials />
      </div>
    </div>
  );
}
