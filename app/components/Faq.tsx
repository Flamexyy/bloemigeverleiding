import React, { useState, useRef } from 'react';
import { HiMiniChevronUp, HiMiniChevronDown } from "react-icons/hi2";
import { RiArrowRightUpLine } from "react-icons/ri";
import Link from 'next/link';

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
        question: 'Hoelang duurt het verzenden?',
        answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    },
    {
        question: 'Wat zijn de verzendkosten?',
        answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    },
    {
        question: 'Kan ik mijn bestelling retourneren?',
        answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    },
];

export default function Faq({ faqs = defaultFaqs, title = "Veel gestelde vragen" }: FaqProps) {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const contentRefs = useRef<HTMLDivElement[]>([]);

    const toggleFaq = (index: number) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <div className="p-4 lg:p-8 w-full py-14 lg:py-20">
            <div className="flex flex-col gap-6 items-start mb-10 text-text max-w-[1600px] mx-auto">
                <div className='w-full flex flex-col-reverse md:flex-row justify-between items-start gap-5 md:gap-10'>
                    <div className='max-w-[800px]'>
                        <h2 className="text-3xl font-bold sm:whitespace-nowrap">{title.toUpperCase()}</h2>
                    </div>
                    <Link 
                        href="/faq"
                        className="w-full justify-end min-w-fit flex items-center gap-2 transition-opacity mt-2 group"
                    >
                        Bekijk alle vragen
                        <RiArrowRightUpLine className="text-xl group-hover:translate-x-[3px] group-hover:translate-y-[-3px] transition-transform duration-300" />
                    </Link>
                </div>
                <p className='max-w-[800px] text-text/70'>
                    Hier vind je antwoorden op de meest gestelde vragen. Staat je vraag er niet tussen? Neem dan contact met ons op.
                </p>
            </div>

            <div className="space-y-3 max-w-[1600px] mx-auto">
                {faqs.map((item, index) => (
                    <div 
                        key={index} 
                        className={`border-2 rounded-[25px] overflow-hidden transition-all duration-300 ${
                            activeIndex === index 
                                ? 'border-accent bg-accent/10' 
                                : 'border-accent/40 bg-accent/5'
                        }`}
                    >
                        <button 
                            className={`w-full text-left flex justify-between items-center p-6 font-bold text-lg ${
                                activeIndex === index ? 'text-text' : 'text-text/80'
                            }`}
                            onClick={() => toggleFaq(index)}
                        >
                            <span>{item.question}</span>
                            <div className={`w-8 h-8 flex items-center justify-center flex-shrink-0 transition-colors rounded-full ${
                                activeIndex === index ? 'bg-accent text-text rounded-full' : 'text-text/60'
                            }`}>
                                {activeIndex === index ? 
                                    <HiMiniChevronUp className="text-xl" /> : 
                                    <HiMiniChevronDown className="text-xl" />
                                }
                            </div>
                        </button>
                        <div
                            ref={(el) => { contentRefs.current[index] = el!; }}
                            className="overflow-hidden transition-all duration-300"
                            style={{
                                height: activeIndex === index ? contentRefs.current[index]?.scrollHeight : 0,
                            }}
                        >
                            <div className="p-6 pt-0 text-text/70">
                                {item.answer}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex justify-center mt-10 max-w-[1600px] mx-auto">
                <Link 
                    href="/contact" 
                    className="flex items-center justify-center px-10 p-3 bg-transparent text-text border-2 border-accent hover:bg-accent rounded-[100px] transition-all duration-300"
                >
                    Neem contact op
                </Link>
            </div>
        </div>
    );
}
