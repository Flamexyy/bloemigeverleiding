'use client';
import { useState } from 'react';
import { MdEmail, MdPhone, MdLocationOn, MdAccessTime } from "react-icons/md";
import { FaInstagram, FaFacebook, FaTiktok } from "react-icons/fa";
import Faq from '../components/Faq';

export default function ContactPage() {
  const [activeTab, setActiveTab] = useState('contact');
  
  const faqItems = [
    {
      question: "Wat zijn jullie verzendkosten?",
      answer: "Wij bieden gratis verzending aan op alle bestellingen boven €50. Voor bestellingen onder €50 rekenen wij €4,95 verzendkosten binnen Nederland."
    },
    {
      question: "Hoe lang duurt de levering?",
      answer: "Bestellingen worden doorgaans binnen 1-2 werkdagen verwerkt. De levertijd is 1-3 werkdagen binnen Nederland en 3-5 werkdagen binnen de EU."
    },
    {
      question: "Kan ik mijn bestelling retourneren?",
      answer: "Ja, je kunt je bestelling binnen 30 dagen na ontvangst retourneren. De artikelen moeten ongebruikt zijn en in de originele verpakking zitten."
    },
    {
      question: "Hoe kan ik de status van mijn bestelling volgen?",
      answer: "Na verzending ontvang je een e-mail met een track & trace code waarmee je je bestelling kunt volgen."
    },
    {
      question: "Welke betaalmethoden accepteren jullie?",
      answer: "Wij accepteren iDEAL, PayPal, Mastercard, Visa, American Express en Bancontact."
    },
    {
      question: "Kan ik mijn bestelling wijzigen of annuleren?",
      answer: "Je kunt je bestelling wijzigen of annuleren binnen 1 uur na het plaatsen. Neem hiervoor contact op met onze klantenservice."
    }
  ];
  
  return (
    <div className="max-w-[1200px] mx-auto px-4 lg:px-8">
      <div className="py-12 lg:py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-text">Contact</h1>
          <p className="text-text max-w-2xl mx-auto text-lg">
            We staan voor je klaar! Heb je vragen of opmerkingen? Neem gerust contact met ons op.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex bg-cream rounded-[50px] p-1">
            <button 
              onClick={() => setActiveTab('contact')}
              className={`py-2 px-6 rounded-[50px] text-sm font-medium transition-colors ${
                activeTab === 'contact' ? 'bg-accent text-text' : 'text-text hover:bg-accent/20'
              }`}
            >
              Contact Info
            </button>
            <button 
              onClick={() => setActiveTab('faq')}
              className={`py-2 px-6 rounded-[50px] text-sm font-medium transition-colors ${
                activeTab === 'faq' ? 'bg-accent text-text' : 'text-text hover:bg-accent/20'
              }`}
            >
              Veelgestelde Vragen
            </button>
          </div>
        </div>

        {/* Contact Info Tab */}
        {activeTab === 'contact' && (
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="bg-cream rounded-[25px] p-8">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center flex-shrink-0">
                    <MdEmail className="text-xl text-text" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2 text-text">E-mail</h3>
                    <p className="text-text mb-1">Klantenservice:</p>
                    <p className="text-text font-medium">klantenservice@example.nl</p>
                    <p className="text-text mt-3 mb-1">Zakelijke vragen:</p>
                    <p className="text-text font-medium">info@example.nl</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-cream rounded-[25px] p-8">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center flex-shrink-0">
                    <MdPhone className="text-xl text-text" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2 text-text">Telefoon</h3>
                    <p className="text-text mb-1">Klantenservice:</p>
                    <p className="text-text font-medium">+31 (0)20 123 4567</p>
                    <p className="text-text text-sm mt-1">Maandag t/m vrijdag: 9:00 - 17:00</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-cream rounded-[25px] p-8">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center flex-shrink-0">
                    <MdLocationOn className="text-xl text-text" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2 text-text">Adres</h3>
                    <p className="text-text">
                      Winkelstraat 123<br />
                      1234 AB Amsterdam<br />
                      Nederland
                    </p>
                  </div>
                </div>
              </div>
              
              
            </div>
            
            <div className="space-y-8">
              
              <div className="bg-cream rounded-[25px] p-8">
                <h3 className="font-bold text-lg mb-4 text-text">Volg Ons</h3>
                <div className="flex gap-4">
                  <a href="#" className="w-12 h-12 bg-accent rounded-full flex items-center justify-center hover:bg-accent/80 transition-colors">
                    <FaInstagram className="text-xl text-text" />
                  </a>
                  <a href="#" className="w-12 h-12 bg-accent rounded-full flex items-center justify-center hover:bg-accent/80 transition-colors">
                    <FaFacebook className="text-xl text-text" />
                  </a>
                  <a href="#" className="w-12 h-12 bg-accent rounded-full flex items-center justify-center hover:bg-accent/80 transition-colors">
                    <FaTiktok className="text-xl text-text" />
                  </a>
                </div>
                <p className="mt-4 text-text">
                  Volg ons op social media voor de nieuwste updates, achter-de-schermen content en exclusieve aanbiedingen!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* FAQ Tab */}
        {activeTab === 'faq' && (
          <div className="max-w-3xl mx-auto">
            <div className="space-y-6">
              {faqItems.map((faq, index) => (
                <div key={index} className="bg-cream rounded-[25px] p-6">
                  <h3 className="font-bold text-lg mb-2 text-text">{faq.question}</h3>
                  <p className="text-text">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 