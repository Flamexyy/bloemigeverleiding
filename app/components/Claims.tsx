import React from "react";
import { FaShippingFast } from "react-icons/fa";
import { HiOutlinePercentBadge } from "react-icons/hi2";
import { RiArrowRightUpLine } from "react-icons/ri";
import { LuClock4 } from "react-icons/lu";
import Link from "next/link";

export default function Claims() {
  return (
    <div className="grid w-full grid-cols-1 gap-3 p-4 md:grid-cols-3 lg:p-8">
      <div className="flex w-full flex-col items-start rounded-[25px] bg-accent p-8 pb-5 text-text">
        <h2 className="mb-4 text-2xl font-bold">
          Gratis verzending <br />
          vanaf €150
        </h2>
        <p className="max-w-[90%]">Wij bieden gratis verzending aan bij bestellingen vanaf €150.</p>
        <div className="flex w-full justify-end">
          <FaShippingFast className="text-[7rem] text-[#fecde2]" />
        </div>
      </div>
      <div className="flex w-full flex-col items-start rounded-[25px] bg-accent p-8 pb-5 text-text">
        <h2 className="mb-4 text-2xl font-bold">
          Binnen 3 tot 5
          <br />
          werkdagen verzonden
        </h2>
        <p className="max-w-[90%]">Wij doen ons uiterste best om de bestellingen zo snel mogelijk te verzenden.</p>
        <div className="flex w-full justify-end">
          <LuClock4 className="text-[7rem] text-[#fecde2]" />
        </div>
      </div>
      <div
        className="flex w-full flex-col items-start justify-between gap-10 rounded-[25px] bg-cover bg-center p-8 pb-5 text-text"
        style={{ backgroundImage: "url('/joanna-kosinska-ToV0rS9nTYs-unsplash.jpg')" }}
      >
        <h2 className="mb-4 text-2xl font-bold">Bekijk onze collectie</h2>
        <div className="flex-end flex w-full items-end justify-end">
          <Link
            href="/shop"
            passHref
          >
            <button className="flex items-center justify-center rounded-[100px] bg-accent p-3 px-5 text-text transition-all duration-300 hover:bg-accent/80">
              Bekijk het assortiment
              <RiArrowRightUpLine className="ml-2 text-xl" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
