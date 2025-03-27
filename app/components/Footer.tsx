import Image from 'next/image';
import Link from 'next/link';
import { FaInstagram, FaTiktok, FaFacebook } from 'react-icons/fa';
import { RiArrowRightUpLine } from "react-icons/ri";

export default function Footer() {
    return (
        <footer className="mt-auto">
            {/* Newsletter Section */}
            {/* <div className="bg-accent/20 border-t border-accent/30">
                <div className="max-w-[1600px] mx-auto px-4 lg:px-8 py-12 md:py-16">
                    <div className="flex flex-col md:flex-row gap-10 justify-between items-center">
                        <div className="max-w-xl text-center md:text-left">
                            <h2 className="text-2xl md:text-3xl font-bold text-text mb-4">SLUIT AAN BIJ ONZE NIEUWSBRIEF</h2>
                            <p className="text-text/70 text-sm md:text-base">
                                Schrijf je in voor onze nieuwsbrief en ontvang speciale aanbiedingen, gratis giveaways en updates over nieuwe producten.
                            </p>
                        </div>
                        
                        <div className="w-full flex justify-end">
                            <form className="w-full flex flex-col sm:flex-row gap-3 max-w-md mx-auto md:mx-0">
                                <input 
                                    type="email" 
                                    placeholder="Vul uw email in" 
                                    className="flex-1 bg-white rounded-[25px] px-6 py-3 text-sm md:text-base placeholder:text-text/50 border border-text/10 focus:outline-none focus:border-text/30 valid:border-green-500/50"
                                    required
                                />
                                <button 
                                    type="submit"
                                    className="bg-text text-cream px-6 py-3 rounded-[25px] hover:bg-text/70 transition-colors text-sm md:text-base whitespace-nowrap font-medium"
                                >
                                    Abonneer
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div> */}
            
            {/* Main Footer */}
            <div className="bg-cream text-text">
                <div className="max-w-[1600px] mx-auto px-4 lg:px-8 pt-16 pb-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-4">
                        {/* Logo and Description */}
                        <div className="space-y-6 lg:col-span-2">
                            <Image src="/logo-footer.svg" alt="Bloemige Verleiding Logo" width={120} height={120} />
                            <p className="text-text/70 text-sm leading-loose max-w-md">
                                Wij leveren innovatieve producten, ervaringen en diensten 
                                om onze klanten te inspireren. Gratis verzending voor leden.
                            </p>
                            
                            {/* Social Media Icons */}
                            <div className="flex gap-4">
                                <a 
                                    href="https://www.instagram.com/bloemigeverleiding" 
                                    target="_blank" 
                                    className="w-10 h-10 rounded-full bg-[#f0e8e0] flex items-center justify-center text-text hover:bg-text hover:text-cream transition-colors"
                                >
                                    <FaInstagram className="text-xl" />
                                </a>
                                <a 
                                    href="https://www.tiktok.com/bloemigeverleiding" 
                                    target="_blank" 
                                    className="w-10 h-10 rounded-full bg-[#f0e8e0] flex items-center justify-center text-text hover:bg-text hover:text-cream transition-colors"
                                >
                                    <FaTiktok className="text-lg" />
                                </a>
                                <a 
                                    href="https://www.facebook.com/bloemigeverleiding" 
                                    target="_blank" 
                                    className="w-10 h-10 rounded-full bg-[#f0e8e0] flex items-center justify-center text-text hover:bg-text hover:text-cream transition-colors"
                                >
                                    <FaFacebook className="text-xl" />
                                </a>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h3 className="text-lg mb-6 font-bold">ONTVANG HULP</h3>
                            <ul className="space-y-3 text-text/70 text-sm">
                                <li>
                                    <Link href="/help" className="hover:text-text transition-colors inline-flex items-center gap-1 group">
                                        Bestelstatus
                                        <RiArrowRightUpLine className="opacity-0 group-hover:opacity-100 group-hover:translate-x-[3px] group-hover:translate-y-[-3px] transition-all duration-300" />
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/help" className="hover:text-text transition-colors inline-flex items-center gap-1 group">
                                        Verzending & Levering
                                        <RiArrowRightUpLine className="opacity-0 group-hover:opacity-100 group-hover:translate-x-[3px] group-hover:translate-y-[-3px] transition-all duration-300" />
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/help" className="hover:text-text transition-colors inline-flex items-center gap-1 group">
                                        Retourneren
                                        <RiArrowRightUpLine className="opacity-0 group-hover:opacity-100 group-hover:translate-x-[3px] group-hover:translate-y-[-3px] transition-all duration-300" />
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/help" className="hover:text-text transition-colors inline-flex items-center gap-1 group">
                                        Betaalmethoden
                                        <RiArrowRightUpLine className="opacity-0 group-hover:opacity-100 group-hover:translate-x-[3px] group-hover:translate-y-[-3px] transition-all duration-300" />
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/contact" className="hover:text-text transition-colors inline-flex items-center gap-1 group">
                                        Contact
                                        <RiArrowRightUpLine className="opacity-0 group-hover:opacity-100 group-hover:translate-x-[3px] group-hover:translate-y-[-3px] transition-all duration-300" />
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* About */}
                        <div>
                            <h3 className="text-lg mb-6 font-bold">OVER ONS</h3>
                            <ul className="space-y-3 text-text/70 text-sm">
                                <li>
                                    <Link href="/about" className="hover:text-text transition-colors inline-flex items-center gap-1 group">
                                        Over
                                        <RiArrowRightUpLine className="opacity-0 group-hover:opacity-100 group-hover:translate-x-[3px] group-hover:translate-y-[-3px] transition-all duration-300" />
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/news" className="hover:text-text transition-colors inline-flex items-center gap-1 group">
                                        Nieuws
                                        <RiArrowRightUpLine className="opacity-0 group-hover:opacity-100 group-hover:translate-x-[3px] group-hover:translate-y-[-3px] transition-all duration-300" />
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Legal */}
                        <div>
                            <h3 className="text-lg mb-6 font-bold">RECHTELIJK</h3>
                            <ul className="space-y-3 text-text/70 text-sm">
                                <li>
                                    <Link href="/terms-of-service" className="hover:text-text transition-colors inline-flex items-center gap-1 group">
                                        Servicevoorwaarden
                                        <RiArrowRightUpLine className="opacity-0 group-hover:opacity-100 group-hover:translate-x-[3px] group-hover:translate-y-[-3px] transition-all duration-300" />
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/terms-of-use" className="hover:text-text transition-colors inline-flex items-center gap-1 group">
                                        Gebruiksvoorwaarden
                                        <RiArrowRightUpLine className="opacity-0 group-hover:opacity-100 group-hover:translate-x-[3px] group-hover:translate-y-[-3px] transition-all duration-300" />
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/privacy-policy" className="hover:text-text transition-colors inline-flex items-center gap-1 group">
                                        Privacybeleid
                                        <RiArrowRightUpLine className="opacity-0 group-hover:opacity-100 group-hover:translate-x-[3px] group-hover:translate-y-[-3px] transition-all duration-300" />
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                    
                    {/* Payment Methods */}
                    <div className="mt-16 pt-10 border-t border-text/10">
                        <div className="flex flex-col items-center">
                            <p className="text-sm text-text/70 font-medium mb-6">Veilig betalen met</p>
                            <div className="flex flex-wrap justify-center gap-3">
                                <Image src="/Ideal.svg" alt="iDEAL" width={40} height={24} className="h-8 w-auto opacity-80 hover:opacity-100 transition-opacity" />
                                <Image src="/Visa.svg" alt="Visa" width={40} height={24} className="h-8 w-auto opacity-80 hover:opacity-100 transition-opacity" />
                                <Image src="/Mastercard.svg" alt="Mastercard" width={40} height={24} className="h-8 w-auto opacity-80 hover:opacity-100 transition-opacity" />
                                <Image src="/PayPal.svg" alt="PayPal" width={40} height={24} className="h-8 w-auto opacity-80 hover:opacity-100 transition-opacity" />
                                <Image src="/Maestro.svg" alt="Maestro" width={40} height={24} className="h-8 w-auto opacity-80 hover:opacity-100 transition-opacity" />
                                <Image src="/Klarna.svg" alt="Klarna" width={40} height={24} className="h-8 w-auto opacity-80 hover:opacity-100 transition-opacity" />
                                <Image src="/GooglePay.svg" alt="Google Pay" width={40} height={24} className="h-8 w-auto opacity-80 hover:opacity-100 transition-opacity" />
                                <Image src="/ShopPay.svg" alt="Shop Pay" width={40} height={24} className="h-8 w-auto opacity-80 hover:opacity-100 transition-opacity" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="border-t bg-text border-text text-cream text-sm">
                    <div className="w-full flex flex-col text-center md:text-left md:flex-row justify-between gap-2 md:gap-20 mx-auto max-w-[1600px] p-4 lg:px-8 px-4">
                        <p>© {new Date().getFullYear()} Bloemigeverleiding. Alle Rechten Voorbehouden</p>
                        <span>
                            Developed and designed by{' '}
                            <a 
                                href="https://enhancedigital.nl" 
                                target="_blank" 
                                className="hover:underline"
                            >
                                Enhancedigital.nl
                            </a>
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
} 