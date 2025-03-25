import React, { useState, useRef } from 'react';
import { HiMiniChevronUp, HiMiniChevronDown } from "react-icons/hi2";

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
        <div className="p-4 lg:p-8 w-full lg:py-20 py-20">
            {title && <h2 className='text-text font-bold text-center mb-10 text-3xl'>{title}</h2>}
            <div className="space-y-3">
                {faqs.map((item, index) => (
                    <div key={index} className="border-2 border-accent/80 bg-accent/20 rounded-[25px] overflow-hidden transition-all duration-300">
                        <button 
                            className={`w-full text-left flex justify-between items-center p-6 font-bold text-lg ${activeIndex === index ? 'text-red-400' : 'text-text'}`}
                            onClick={() => toggleFaq(index)}
                        >
                            <span>{item.question}</span>
                            <div className={`w-8 h-8 flex items-center justify-center flex-shrink-0 transition-colors ${activeIndex === index ? 'text-red-400' : 'text-text'}`}>
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
                            <div className="p-6 pt-0 text-text">
                                {item.answer}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
