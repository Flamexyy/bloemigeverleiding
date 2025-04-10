"use client";
import { IoLocationOutline, IoCallOutline, IoMailOutline, IoTimeOutline } from "react-icons/io5";
import { FaInstagram, FaFacebook } from "react-icons/fa";
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
                <Link
                  href="https://www.instagram.com/bloemige_verleiding"
                  target="_blank"
                  className="flex items-center gap-2 text-text/70 hover:text-accent"
                >
                  <FaInstagram className="text-xl" />
                  Instagram
                </Link>
                <Link
                  href="https://www.facebook.com/bloemige_verleiding"
                  target="_blank"
                  className="flex items-center gap-2 text-text/70 hover:text-accent"
                >
                  <FaFacebook className="text-xl" />
                  Facebook
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
