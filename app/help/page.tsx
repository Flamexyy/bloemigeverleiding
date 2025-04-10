"use client";
import { useState } from "react";
import Link from "next/link";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";
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
              <ol className="mt-2 list-decimal space-y-1 pl-5">
                <li>In te loggen op je account en naar "Mijn Bestellingen" te gaan</li>
                <li>De track & trace link te gebruiken in je bevestigingsmail</li>
                <li>Contact op te nemen met onze klantenservice met je bestelnummer</li>
              </ol>
            </div>
          ),
        },
        {
          question: "Wanneer wordt mijn bestelling verzonden?",
          answer: (
            <p>
              Bestellingen worden meestal binnen 3-5 werkdagen verzonden. Zodra je bestelling is verzonden, ontvang je een bevestigingsmail met track
              & trace informatie.
            </p>
          ),
        },
        {
          question: "Mijn bestelling is vertraagd. Wat nu?",
          answer: (
            <p>
              Als je bestelling langer duurt dan verwacht, neem dan contact op met onze klantenservice. Houd je bestelnummer bij de hand zodat we je
              bestelling snel kunnen opzoeken.
            </p>
          ),
        },
      ],
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
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li>Verzending binnen Nederland: €6,95</li>
                <li>Verzending binnen België: €11,95</li>
                <li>Gratis verzending bij bestellingen boven €150</li>
              </ul>
            </div>
          ),
        },
        {
          question: "Hoe lang duurt de levering?",
          answer: <p>Standaard leveringen worden meestal binnen 5-7 werkdagen bezorgd.</p>,
        },
        {
          question: "Leveren jullie ook internationaal?",
          answer: <p>Wij leveren in Nederland en België.</p>,
        },
      ],
    },
    {
      title: "Retourneren",
      id: "returns",
      faqs: [
        {
          question: "Wat is jullie retourbeleid?",
          answer: (
            <p>
              Je kunt producten binnen 14 dagen na ontvangst retourneren. De producten moeten ongebruikt zijn en in de originele verpakking zitten.
            </p>
          ),
        },
        {
          question: "Hoe kan ik een product retourneren?",
          answer: (
            <div>
              <p>Om een product te retourneren:</p>
              <ol className="mt-2 list-decimal space-y-1 pl-5">
                <li>Log in op je account en ga naar "Mijn Bestellingen"</li>
                <li>Selecteer de bestelling en klik op "Retourneren"</li>
                <li>Volg de instructies om je retourlabel te printen</li>
                <li>Verpak het product in de originele verpakking</li>
                <li>Breng het pakket naar een PostNL-punt</li>
              </ol>
            </div>
          ),
        },
        {
          question: "Wanneer krijg ik mijn geld terug na een retour?",
          answer: (
            <p>
              Nadat we je retour hebben ontvangen en gecontroleerd, verwerken we de terugbetaling binnen 5 werkdagen. Het kan nog 3-5 werkdagen duren
              voordat het bedrag op je rekening staat, afhankelijk van je bank.
            </p>
          ),
        },
      ],
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
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li>iDEAL</li>
                <li>Creditcard (Visa, Mastercard)</li>
                <li>PayPal</li>
                <li>Google Pay</li>
              </ul>
            </div>
          ),
        },
        {
          question: "Is betalen bij De Bloemige Verleiding veilig?",
          answer: (
            <p>
              Ja, alle betalingen worden verwerkt via beveiligde verbindingen. We voldoen aan alle moderne veiligheidsnormen en je gegevens worden
              nooit opgeslagen op onze servers.
            </p>
          ),
        },
        {
          question: "Kan ik achteraf betalen?",
          answer: (
            <p>Nee, we bieden momenteel geen optie voor achteraf betalen aan. Je moet de betaling voltooien voordat je bestelling wordt verzonden.</p>
          ),
        },
      ],
    },
  ];

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-12 md:py-16">
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-3xl font-bold text-text md:text-4xl">Hulp & Ondersteuning</h1>
        <p className="mx-auto max-w-2xl text-text/70">
          Vind antwoorden op veelgestelde vragen en krijg hulp bij bestellingen, verzending, retourneren en meer.
        </p>
      </div>

      {/* Help sections with independent heights */}
      <div className="mb-12 grid auto-rows-auto gap-3 md:grid-cols-2">
        {helpSections.map((section) => (
          <div
            key={section.id}
            className="h-auto overflow-hidden rounded-2xl border border-text/10 transition-colors hover:border-accent/50"
            style={{ alignSelf: "flex-start" }}
          >
            <button
              onClick={() => toggleSection(section.id)}
              className="flex w-full items-center justify-between bg-white p-5 text-left"
            >
              <span className="text-xl font-medium text-text">{section.title}</span>
              {expandedSection === section.id ? <IoChevronUp className="text-text/70" /> : <IoChevronDown className="text-text/70" />}
            </button>

            {expandedSection === section.id && (
              <div className="bg-white p-5 pt-0">
                <div className="space-y-3">
                  {section.faqs.map((faq) => (
                    <div
                      key={faq.question}
                      className="border-t border-text/10 pt-3"
                    >
                      <button
                        onClick={() => toggleFAQ(faq.question)}
                        className="flex w-full items-center justify-between text-left"
                      >
                        <span className="font-medium text-text">{faq.question}</span>
                        {expandedFAQ === faq.question ? (
                          <IoChevronUp className="ml-2 flex-shrink-0 text-text/70" />
                        ) : (
                          <IoChevronDown className="ml-2 flex-shrink-0 text-text/70" />
                        )}
                      </button>

                      {expandedFAQ === faq.question && <div className="mt-2 text-sm text-text/70">{faq.answer}</div>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Contact section */}
      <div className="rounded-2xl bg-accent/20 p-6 text-center md:p-8">
        <h2 className="mb-4 text-2xl font-bold text-text">Nog steeds hulp nodig?</h2>
        <p className="mx-auto mb-6 max-w-2xl text-text/70">
          Als je het antwoord op je vraag niet kunt vinden, neem dan rechtstreeks contact met ons op. Ons klantenserviceteam staat klaar om je te
          helpen.
        </p>
        <Link
          href="/contact"
          className="inline-block rounded-[25px] bg-accent px-6 py-3 font-medium text-text transition-colors hover:bg-accent/70"
        >
          Neem contact op
        </Link>
      </div>
    </div>
  );
}
