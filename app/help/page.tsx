'use client';
import { useState } from 'react';
import Link from 'next/link';
import { IoChevronDown, IoChevronUp } from 'react-icons/io5';
import { IoFlowerOutline } from "react-icons/io5";

// FAQ item interface
interface FAQItem {
  question: string;
  answer: React.ReactNode;
}

// Help section interface
interface HelpSection {
  title: string;
  icon?: React.ReactNode;
  faqs: FAQItem[];
  id: string;
}

export default function HelpPage() {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);

  // Toggle section expansion
  const toggleSection = (id: string) => {
    if (expandedSection === id) {
      setExpandedSection(null);
    } else {
      setExpandedSection(id);
      setExpandedFAQ(null); // Close any open FAQs when changing sections
    }
  };

  // Toggle FAQ expansion
  const toggleFAQ = (question: string) => {
    if (expandedFAQ === question) {
      setExpandedFAQ(null);
    } else {
      setExpandedFAQ(question);
    }
  };

  // Help sections data
  const helpSections: HelpSection[] = [
    {
      title: "Bestelstatus",
      id: "order-status",
      faqs: [
        {
          question: "Hoe kan ik mijn bestelling volgen?",
          answer: (
            <div>
              <p>Je kunt je bestelling volgen door:</p>
              <ol className="list-decimal pl-5 mt-2 space-y-1">
                <li>In te loggen op je account en naar "Mijn Bestellingen" te gaan</li>
                <li>De track & trace link te gebruiken in je bevestigingsmail</li>
                <li>Contact op te nemen met onze klantenservice met je bestelnummer</li>
              </ol>
            </div>
          )
        },
        {
          question: "Wanneer wordt mijn bestelling verzonden?",
          answer: (
            <p>
              Bestellingen worden meestal binnen 1-2 werkdagen verzonden. Zodra je bestelling is verzonden, 
              ontvang je een bevestigingsmail met track & trace informatie.
            </p>
          )
        },
        {
          question: "Mijn bestelling is vertraagd. Wat nu?",
          answer: (
            <p>
              Als je bestelling langer duurt dan verwacht, neem dan contact op met onze klantenservice. 
              Houd je bestelnummer bij de hand zodat we je bestelling snel kunnen opzoeken.
            </p>
          )
        }
      ]
    },
    {
      title: "Verzending & Levering",
      id: "shipping",
      faqs: [
        {
          question: "Wat zijn de verzendkosten?",
          answer: (
            <div>
              <p>Onze verzendkosten zijn als volgt:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Standaard verzending: €4,95</li>
                <li>Gratis verzending bij bestellingen boven €50</li>
                <li>Express verzending: €7,95</li>
              </ul>
            </div>
          )
        },
        {
          question: "Hoe lang duurt de levering?",
          answer: (
            <p>
              Standaard leveringen worden meestal binnen 2-3 werkdagen bezorgd. Express leveringen 
              worden de volgende werkdag bezorgd als de bestelling vóór 15:00 uur is geplaatst.
            </p>
          )
        },
        {
          question: "Leveren jullie ook internationaal?",
          answer: (
            <p>
              Ja, we leveren in heel Europa. Verzendkosten en levertijden variëren per land. 
              Bekijk de specifieke informatie tijdens het afrekenen.
            </p>
          )
        }
      ]
    },
    {
      title: "Retourneren",
      id: "returns",
      faqs: [
        {
          question: "Wat is jullie retourbeleid?",
          answer: (
            <p>
              Je kunt producten binnen 14 dagen na ontvangst retourneren. De producten moeten 
              ongebruikt zijn en in de originele verpakking zitten.
            </p>
          )
        },
        {
          question: "Hoe kan ik een product retourneren?",
          answer: (
            <div>
              <p>Om een product te retourneren:</p>
              <ol className="list-decimal pl-5 mt-2 space-y-1">
                <li>Log in op je account en ga naar "Mijn Bestellingen"</li>
                <li>Selecteer de bestelling en klik op "Retourneren"</li>
                <li>Volg de instructies om je retourlabel te printen</li>
                <li>Verpak het product in de originele verpakking</li>
                <li>Breng het pakket naar een PostNL-punt</li>
              </ol>
            </div>
          )
        },
        {
          question: "Wanneer krijg ik mijn geld terug na een retour?",
          answer: (
            <p>
              Nadat we je retour hebben ontvangen en gecontroleerd, verwerken we de terugbetaling 
              binnen 5 werkdagen. Het kan nog 3-5 werkdagen duren voordat het bedrag op je rekening staat, 
              afhankelijk van je bank.
            </p>
          )
        }
      ]
    },
    {
      title: "Betaling",
      id: "payment",
      faqs: [
        {
          question: "Welke betaalmethoden accepteren jullie?",
          answer: (
            <div>
              <p>We accepteren de volgende betaalmethoden:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>iDEAL</li>
                <li>Creditcard (Visa, Mastercard)</li>
                <li>PayPal</li>
                <li>Bankoverschrijving</li>
                <li>Afterpay</li>
              </ul>
            </div>
          )
        },
        {
          question: "Is betalen bij De Bloemige Verleiding veilig?",
          answer: (
            <p>
              Ja, alle betalingen worden verwerkt via beveiligde verbindingen. We voldoen aan alle 
              moderne veiligheidsnormen en je gegevens worden nooit opgeslagen op onze servers.
            </p>
          )
        },
        {
          question: "Kan ik achteraf betalen?",
          answer: (
            <p>
              Ja, je kunt achteraf betalen via Afterpay. Hiervoor moet je wel aan bepaalde voorwaarden 
              voldoen en er kan een kredietcheck worden uitgevoerd.
            </p>
          )
        }
      ]
    }
  ];

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-12 md:py-16">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-text mb-4">Hulp & Ondersteuning</h1>
        <p className="text-text/70 max-w-2xl mx-auto">
          Vind antwoorden op veelgestelde vragen en krijg hulp bij bestellingen, verzending, retourneren en meer.
        </p>
      </div>

      {/* Help sections with independent heights */}
      <div className="grid md:grid-cols-2 gap-6 mb-12 auto-rows-auto">
        {helpSections.map((section) => (
          <div 
            key={section.id}
            className="border border-text/10 rounded-2xl overflow-hidden hover:border-accent/50 transition-colors h-auto"
            style={{ alignSelf: 'flex-start' }}
          >
            <button
              onClick={() => toggleSection(section.id)}
              className="w-full p-5 flex items-center justify-between bg-white text-left"
            >
              <span className="text-xl font-medium text-text">{section.title}</span>
              {expandedSection === section.id ? (
                <IoChevronUp className="text-text/70" />
              ) : (
                <IoChevronDown className="text-text/70" />
              )}
            </button>
            
            {expandedSection === section.id && (
              <div className="p-5 pt-0 bg-white">
                <div className="space-y-3">
                  {section.faqs.map((faq) => (
                    <div key={faq.question} className="border-t border-text/10 pt-3">
                      <button
                        onClick={() => toggleFAQ(faq.question)}
                        className="w-full flex items-center justify-between text-left"
                      >
                        <span className="font-medium text-text">{faq.question}</span>
                        {expandedFAQ === faq.question ? (
                          <IoChevronUp className="text-text/70 flex-shrink-0 ml-2" />
                        ) : (
                          <IoChevronDown className="text-text/70 flex-shrink-0 ml-2" />
                        )}
                      </button>
                      
                      {expandedFAQ === faq.question && (
                        <div className="mt-2 text-text/70 text-sm">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Contact section */}
      <div className="bg-accent/20 rounded-2xl p-6 md:p-8 text-center">
        <h2 className="text-2xl font-bold text-text mb-4">Nog steeds hulp nodig?</h2>
        <p className="text-text/70 mb-6 max-w-2xl mx-auto">
          Als je het antwoord op je vraag niet kunt vinden, neem dan rechtstreeks contact met ons op. 
          Ons klantenserviceteam staat klaar om je te helpen.
        </p>
        <Link 
          href="/contact" 
          className="inline-block bg-accent text-text px-6 py-3 rounded-[25px] font-medium hover:bg-accent/70 transition-colors"
        >
          Neem contact op
        </Link>
      </div>
    </div>
  );
} 