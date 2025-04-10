import Image from "next/image";
import Link from "next/link";
import { FaInstagram, FaTiktok, FaFacebook } from "react-icons/fa";
import { RiArrowRightUpLine } from "react-icons/ri";

export default function Footer() {
  return (
    <footer className="mt-auto bg-cream text-text">
      <div className="mx-auto max-w-[1600px] px-4 py-12 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          {/* Left Section: Logo, Description, Social */}
          <div className="md:col-span-4 lg:col-span-5">
            <div className="mb-6 inline-block">
              <Image
                src="/logo-footer.svg"
                alt="Bloemige Verleiding Logo"
                width={100}
                height={100}
              />
            </div>
            <p className="mb-6 max-w-[70%] text-sm leading-relaxed text-text/70">
              Handgemaakte zijden boeketten, met liefde en zorg samengesteld voor elke speciale gelegenheid.
            </p>
            <div className="flex gap-4">
              <a
                href="https://www.instagram.com/bloemige_verleiding"
                target="_blank"
                className="text-text/70 transition-colors hover:text-text"
                aria-label="Instagram"
              >
                <FaInstagram className="text-2xl" />
              </a>
              <a
                href="https://www.tiktok.com/@selina_christina?_t=ZN-8vQ3MtDsYTq&_r=1"
                target="_blank"
                className="text-text/70 transition-colors hover:text-text"
                aria-label="TikTok"
              >
                <FaTiktok className="text-xl" />
              </a>
              <a
                href="https://www.facebook.com/bloemigeverleiding"
                target="_blank"
                className="text-text/70 transition-colors hover:text-text"
                aria-label="Facebook"
              >
                <FaFacebook className="text-xl" />
              </a>
            </div>
          </div>

          {/* Right Section: Links */}
          <div className="grid grid-cols-2 gap-8 md:col-span-8 md:grid-cols-3 lg:col-span-7">
            <div>
              <h3 className="mb-4 font-bold uppercase tracking-wider text-text">Hulp</h3>
              <ul className="space-y-3 text-sm text-text/70">
                <li>
                  <Link
                    href="/help"
                    className="group inline-flex items-center transition-colors hover:text-text"
                  >
                    Bestelstatus
                    <RiArrowRightUpLine className="ml-1 opacity-0 transition-all duration-300 group-hover:translate-x-[3px] group-hover:translate-y-[-3px] group-hover:opacity-100" />
                  </Link>
                </li>
                <li>
                  <Link
                    href="/help"
                    className="group inline-flex items-center transition-colors hover:text-text"
                  >
                    Verzending & Levering
                    <RiArrowRightUpLine className="ml-1 opacity-0 transition-all duration-300 group-hover:translate-x-[3px] group-hover:translate-y-[-3px] group-hover:opacity-100" />
                  </Link>
                </li>
                <li>
                  <Link
                    href="/help"
                    className="group inline-flex items-center transition-colors hover:text-text"
                  >
                    Retourneren
                    <RiArrowRightUpLine className="ml-1 opacity-0 transition-all duration-300 group-hover:translate-x-[3px] group-hover:translate-y-[-3px] group-hover:opacity-100" />
                  </Link>
                </li>
                <li>
                  <Link
                    href="/help"
                    className="group inline-flex items-center transition-colors hover:text-text"
                  >
                    Betaalmethoden
                    <RiArrowRightUpLine className="ml-1 opacity-0 transition-all duration-300 group-hover:translate-x-[3px] group-hover:translate-y-[-3px] group-hover:opacity-100" />
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="group inline-flex items-center transition-colors hover:text-text"
                  >
                    Contact
                    <RiArrowRightUpLine className="ml-1 opacity-0 transition-all duration-300 group-hover:translate-x-[3px] group-hover:translate-y-[-3px] group-hover:opacity-100" />
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 font-bold uppercase tracking-wider text-text">Over Ons</h3>
              <ul className="space-y-3 text-sm text-text/70">
                <li>
                  <Link
                    href="/about"
                    className="group inline-flex items-center transition-colors hover:text-text"
                  >
                    Over Ons
                    <RiArrowRightUpLine className="ml-1 opacity-0 transition-all duration-300 group-hover:translate-x-[3px] group-hover:translate-y-[-3px] group-hover:opacity-100" />
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://www.instagram.com/bloemige_verleiding"
                    target="_blank"
                    className="group inline-flex items-center transition-colors hover:text-text"
                  >
                    Instagram
                    <RiArrowRightUpLine className="ml-1 opacity-0 transition-all duration-300 group-hover:translate-x-[3px] group-hover:translate-y-[-3px] group-hover:opacity-100" />
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://www.tiktok.com/@selina_christina?_t=ZN-8vQ3MtDsYTq&_r=1"
                    target="_blank"
                    className="group inline-flex items-center transition-colors hover:text-text"
                  >
                    Tiktok
                    <RiArrowRightUpLine className="ml-1 opacity-0 transition-all duration-300 group-hover:translate-x-[3px] group-hover:translate-y-[-3px] group-hover:opacity-100" />
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://www.instagram.com/bloemige_verleiding"
                    target="_blank"
                    className="group inline-flex items-center transition-colors hover:text-text"
                  >
                    Facebook
                    <RiArrowRightUpLine className="ml-1 opacity-0 transition-all duration-300 group-hover:translate-x-[3px] group-hover:translate-y-[-3px] group-hover:opacity-100" />
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 font-bold uppercase tracking-wider text-text">Rechtelijk</h3>
              <ul className="space-y-3 text-sm text-text/70">
                <li>
                  <Link
                    href="/terms-of-service"
                    className="group inline-flex items-center transition-colors hover:text-text"
                  >
                    Servicevoorwaarden
                    <RiArrowRightUpLine className="ml-1 opacity-0 transition-all duration-300 group-hover:translate-x-[3px] group-hover:translate-y-[-3px] group-hover:opacity-100" />
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms-of-use"
                    className="group inline-flex items-center transition-colors hover:text-text"
                  >
                    Gebruiksvoorwaarden
                    <RiArrowRightUpLine className="ml-1 opacity-0 transition-all duration-300 group-hover:translate-x-[3px] group-hover:translate-y-[-3px] group-hover:opacity-100" />
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy-policy"
                    className="group inline-flex items-center transition-colors hover:text-text"
                  >
                    Privacybeleid
                    <RiArrowRightUpLine className="ml-1 opacity-0 transition-all duration-300 group-hover:translate-x-[3px] group-hover:translate-y-[-3px] group-hover:opacity-100" />
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Payment Methods - Centered */}
        <div className="mt-12 border-t border-text/10 pt-8 text-center">
          <p className="mb-4 text-sm font-medium text-text/70">Veilig betalen met</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Image
              src="/Ideal.svg"
              alt="iDEAL"
              width={35}
              height={21}
              className="h-6 w-auto opacity-70"
            />
            <Image
              src="/Visa.svg"
              alt="Visa"
              width={35}
              height={21}
              className="h-6 w-auto opacity-70"
            />
            <Image
              src="/Mastercard.svg"
              alt="Mastercard"
              width={35}
              height={21}
              className="h-6 w-auto opacity-70"
            />
            <Image
              src="/PayPal.svg"
              alt="PayPal"
              width={35}
              height={21}
              className="h-6 w-auto opacity-70"
            />
            <Image
              src="/Maestro.svg"
              alt="Maestro"
              width={35}
              height={21}
              className="h-6 w-auto opacity-70"
            />
            <Image
              src="/GooglePay.svg"
              alt="Google Pay"
              width={35}
              height={21}
              className="h-6 w-auto opacity-70"
            />
          </div>
        </div>
      </div>

      {/* Final Bar */}
      <div className="bg-text py-3 text-center text-xs text-cream/70">
        <div className="mx-auto max-w-[1600px] px-4 lg:px-8">
          <span>
            © {new Date().getFullYear()} Bloemigeverleiding. Alle Rechten Voorbehouden | Developed by{" "}
            <a
              href="https://enhancedigital.nl"
              target="_blank"
              className="underline hover:text-cream"
            >
              Enhancedigital.nl
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
