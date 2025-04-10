import React, { useState, useRef } from "react";
import { HiMiniChevronUp, HiMiniChevronDown } from "react-icons/hi2";
import { RiArrowRightUpLine } from "react-icons/ri";
import Link from "next/link";

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqProps {
  faqs?: FaqItem[];
  title?: string;
}

const defaultFaqs: FaqItem[] = [
  {
    question: "Wat is de levertijd van mijn bestelling?",
    answer:
      "De levertijd bedraagt doorgaans 3 tot 5 werkdagen. Dit kan variëren afhankelijk van de bestemming en de gekozen verzendmethode. Wij streven ernaar om je bestelling zo snel mogelijk te bezorgen.",
  },
  {
    question: "Wat zijn de kosten voor verzending?",
    answer:
      "Wij leveren binnen Nederland en België. De verzendkosten bedragen €6,95 binnen Nederland en €11,95 naar België. Bij bestellingen boven de €150 worden geen verzendkosten in rekening gebracht.",
  },
  {
    question: "Kan ik mijn bestelling retourneren?",
    answer:
      "Ja, je kunt je bestelling binnen 14 dagen na ontvangst retourneren, mits het product ongebruikt is en zich in de originele staat bevindt. Neem contact met ons op voor meer informatie over het retourproces.",
  },
];

export default function Faq({ faqs = defaultFaqs, title = "Veelgestelde vragen" }: FaqProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const contentRefs = useRef<HTMLDivElement[]>([]);

  const toggleFaq = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="w-full p-4 py-14 lg:p-8 lg:py-20">
      <div className="mx-auto mb-10 flex max-w-[1600px] flex-col items-start gap-6 text-text">
        <div className="flex w-full flex-col-reverse items-start justify-between gap-5 md:flex-row md:gap-10">
          <div className="max-w-[800px]">
            <h2 className="text-3xl font-bold sm:whitespace-nowrap">{title.toUpperCase()}</h2>
          </div>
          <div className="flex w-full justify-end">
            <Link
              href="/contact"
              className="group mt-2 flex min-w-fit items-center gap-2 transition-opacity"
            >
              Bekijk alle vragen
              <RiArrowRightUpLine className="text-xl transition-transform duration-300 group-hover:translate-x-[3px] group-hover:translate-y-[-3px]" />
            </Link>
          </div>
        </div>
        <p className="max-w-[800px] text-text/70">
          Hier vind je antwoorden op de meest gestelde vragen. Staat je vraag er niet tussen? Neem dan contact met ons op.
        </p>
      </div>

      <div className="mx-auto max-w-[1600px] space-y-3">
        {faqs.map((item, index) => (
          <div
            key={index}
            className={`overflow-hidden rounded-[25px] border-2 transition-all duration-300 ${
              activeIndex === index ? "border-accent bg-accent/10" : "border-accent/40 bg-accent/5"
            }`}
          >
            <button
              className={`flex w-full items-center justify-between p-6 text-left text-lg font-bold ${
                activeIndex === index ? "text-text" : "text-text/80"
              }`}
              onClick={() => toggleFaq(index)}
            >
              <span>{item.question}</span>
              <div
                className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full transition-colors ${
                  activeIndex === index ? "rounded-full bg-accent text-text" : "text-text/60"
                }`}
              >
                {activeIndex === index ? <HiMiniChevronUp className="text-xl" /> : <HiMiniChevronDown className="text-xl" />}
              </div>
            </button>
            <div
              ref={(el) => {
                contentRefs.current[index] = el!;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height: activeIndex === index ? contentRefs.current[index]?.scrollHeight : 0,
              }}
            >
              <div className="p-6 pt-0 text-text/70">{item.answer}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="mx-auto mt-10 flex max-w-[1600px] justify-center">
        <Link
          href="/contact"
          className="flex items-center justify-center rounded-[100px] border-2 border-accent bg-transparent p-3 px-10 text-text transition-all duration-300 hover:bg-accent"
        >
          Neem contact op
        </Link>
      </div>
    </div>
  );
}
