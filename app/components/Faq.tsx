import React, { useState, useRef } from 'react';
import { HiMiniChevronUp, HiMiniChevronDown } from "react-icons/hi2";

interface FaqItem {
    question: string;
    answer: string;
}

const faqData: FaqItem[] = [
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

export default function Faq() {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const contentRefs = useRef<HTMLDivElement[]>([]);

    const toggleFaq = (index: number) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <div className="p-4 lg:p-8 w-full">
            <h2 className='text-text font-bold text-center mb-10 text-3xl'>Veel gestelde vragen</h2>
            {faqData.map((item, index) => (
                <button key={index} className="w-full text-left faq-item mb-4 bg-accent text-text rounded-[25px]">
                    <div
                        className="faq-question flex justify-between items-center cursor-pointer p-8 font-bold text-xl"
                        onClick={() => toggleFaq(index)}
                    >
                        <span>{item.question}</span>
                        {activeIndex === index ? <HiMiniChevronUp size={30}/> : <HiMiniChevronDown size={30}/>}
                    </div>
                    <div
                        ref={(el) => { contentRefs.current[index] = el!; }}
                        className="faq-answer overflow-hidden transition-all duration-300"
                        style={{
                            height: activeIndex === index ? contentRefs.current[index]?.scrollHeight : 0,
                        }}
                    >
                        <div className="p-8 pt-0">{item.answer}</div>
                    </div>
                </button>
            ))}
        </div>
    );
}
