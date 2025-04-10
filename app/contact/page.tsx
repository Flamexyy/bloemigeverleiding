"use client";
import { IoLocationOutline, IoCallOutline, IoMailOutline, IoTimeOutline } from "react-icons/io5";
import Link from "next/link";
import Head from "next/head";

export default function ContactPage() {
  return (
    <>
      <Head>
        <title>Contact | Bloemigeverleiding</title>
      </Head>
      <div className="mx-auto max-w-[1600px] px-4 py-12 md:py-20 lg:px-8">
        {/* Hero Section */}
        <div className="mb-10 flex flex-col items-start gap-6 text-text">
          <div className="flex w-full flex-col-reverse items-start justify-between gap-5 md:flex-row md:gap-10">
            <div className="max-w-[800px]">
              <h1 className="text-3xl font-bold md:text-4xl">CONTACT</h1>
            </div>
          </div>
          <p className="max-w-[800px] text-text/70">Heeft u vragen of opmerkingen? Neem gerust contact met ons op. We staan voor u klaar!</p>
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Contact Information */}
          <div>
            <h2 className="mb-6 text-2xl font-bold text-text">Contactgegevens</h2>

            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-accent/20">
                  <IoLocationOutline className="text-xl text-text" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-text">Adres</h3>
                  <p className="text-text/70">Klaproos 52</p>
                  <p className="text-text/70">5803 HD Venray</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-accent/20">
                  <IoCallOutline className="text-xl text-text" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-text">Telefoon</h3>
                  <p className="text-text/70">+31 6 48973086</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-accent/20">
                  <IoMailOutline className="text-xl text-text" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-text">E-mail</h3>
                  <p className="text-text/70">info@bloemigeverleiding.nl</p>
                </div>
              </div>
            </div>
          </div>

          {/* Map */}
          <div>
            <h2 className="mb-6 text-2xl font-bold text-text">Locatie</h2>
            <div className="relative mb-8 aspect-video overflow-hidden rounded-[25px] border-2 border-text/10">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2478.1118514139726!2d5.9698863!3d51.5904247!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c74b3a8c2c9c7d%3A0x396d16e8b2d4e4a5!2sKlaproos%2052%2C%205803%20HD%20Venray!5e0!3m2!1sen!2snl!4v1651234567890!5m2!1sen!2snl"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>

        {/* Alternative Contact Methods */}
        <div className="mt-16">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="rounded-[25px] border-2 border-accent/20 bg-accent/5 p-6">
              <h3 className="mb-2 text-lg font-bold text-text">Volg ons op social media</h3>
              <p className="mb-4 text-text/70">
                Blijf op de hoogte van onze nieuwste collecties, aanbiedingen en inspiratie door ons te volgen op social media.
              </p>
              <div className="flex gap-4">
                <a
                  href="#"
                  className="text-text transition-colors hover:text-accent"
                >
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-text transition-colors hover:text-accent"
                >
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-text transition-colors hover:text-accent"
                >
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"></path>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
