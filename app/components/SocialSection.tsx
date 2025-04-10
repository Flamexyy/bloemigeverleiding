"use client";
import Image from "next/image";
import Link from "next/link";
import { RiArrowRightUpLine } from "react-icons/ri";
import { IoFlowerOutline } from "react-icons/io5";

export default function SocialSection() {
  return (
    <div className="p-4 py-14 lg:p-8 lg:py-20">
      <div className="mb-10 flex flex-col items-start gap-6 text-text">
        <div className="flex w-full flex-col-reverse items-center justify-between gap-5 md:flex-row md:gap-10">
          <div className="h-full overflow-hidden rounded-[25px]">
            <Image
              src="/top-view-bouquet-with-white-color-roses-red-tulips-pink-hydrangea-greenery.jpg"
              alt="Bloemen arrangement"
              width={800}
              height={600}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex max-w-[800px] flex-col gap-3">
            <h2 className="whitespace-nowrap text-3xl font-bold">BOEKETTEN OP MAAT</h2>
            <p className="text-text/70">
              Wilt u zelf een boeket samenstellen? Neem dan contact met ons op! Wij helpen u graag verder met het maken van een boeket dat perfect bij
              u past.
            </p>
            <Link
              href="/contact"
              className="group mt-2 flex min-w-fit items-center gap-2 transition-opacity"
            >
              <button className="flex items-center justify-center rounded-[100px] border-2 border-accent bg-transparent px-8 py-3 font-medium text-text transition-all duration-300 hover:bg-accent">
                Neem contact op
                <RiArrowRightUpLine className="ml-2 text-xl transition-transform duration-300 group-hover:translate-x-[3px] group-hover:translate-y-[-3px]" />
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Instagram-style gallery */}
      <div className="mt-16">
        <div className="mb-8 flex w-full flex-col-reverse items-start justify-between gap-5 md:flex-row md:gap-10">
          <div className="flex items-center gap-3">
            <h3 className="text-2xl font-bold text-text sm:whitespace-nowrap">VOLG ONS OP INSTAGRAM</h3>
          </div>
          <div className="flex w-full justify-end">
            <Link
              href="https://www.instagram.com/bloemige_verleiding"
              target="_blank"
              className="group flex min-w-fit items-center justify-end gap-2 text-text transition-colors"
            >
              @bloemigeverleiding
              <RiArrowRightUpLine className="text-xl transition-transform duration-300 group-hover:translate-x-[3px] group-hover:translate-y-[-3px]" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {[1, 2, 3, 4].map((num) => (
            <Link
              key={num}
              href="https://www.instagram.com/bloemige_verleiding"
              target="_blank"
              className="group relative aspect-square overflow-hidden rounded-[25px]"
            >
              <Image
                src={
                  num % 2 === 0 ? "/top-view-bouquet-with-white-color-roses-red-tulips-pink-hydrangea-greenery.jpg" : "/flower-shop-collection.jpg"
                }
                alt={`Instagram post ${num}`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-300 group-hover:bg-black/20">
                <span className="rounded-[100px] bg-accent/80 px-4 py-2 text-text opacity-0 transition-opacity duration-300 group-hover:opacity-100">
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
