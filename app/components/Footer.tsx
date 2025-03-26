import Image from 'next/image';
import { FaInstagram, FaTiktok, FaFacebook } from 'react-icons/fa';

export default function Footer() {
    return (
        <footer className="mt-auto">
            {/* Newsletter Section */}
            <div className="bg-gray-100">
                <div className="max-w-[1600px] mx-auto px-4 lg:px-8 py-12 md:py-20">
                    <div className="max-w-2xl mx-auto text-center space-y-4 md:space-y-6">
                        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold">Sluit aan bij onze nieuwsbrief</h2>
                        <p className="text-gray-text/50 text-sm md:text-base">
                            Schrijf je in voor onze nieuwsbrief en ontvang speciale aanbiedingen, gratis giveaways en updates over nieuwe producten.
                        </p>
                        <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                            <input 
                                type="email" 
                                placeholder="Vul uw email in" 
                                className="flex-1 bg-white rounded-xl px-4 py-3 text-sm md:text-base placeholder:text-text/50 border border-transparent focus:border-black/10 focus:outline-none"
                            />
                            <button 
                                type="submit"
                                className="bg-zinc-900 text-white px-6 py-3 rounded-xl hover:bg-zinc-800 transition-colors text-sm md:text-base whitespace-nowrap"
                            >
                                Abonneer
                            </button>
                        </form>
                    </div>
                </div>
            </div>
            
            {/* Main Footer */}
            <div className="bg-cream text-text">
                <div className="max-w-[1600px] mx-auto px-4 lg:px-8 pt-20 pb-12">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
                        {/* Logo and Description */}
                        <div className="space-y-6">
                            <Image src="/logo-footer.svg" alt="Bloemige Verleiding Logo" width={120} height={120} />
                            <p className="text-text text-sm leading-loose">
                                Wij leveren innovatieve producten, ervaringen en diensten 
                                om onze klanten te inspireren. Gratis verzending voor leden.
                            </p>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h3 className="text-lg mb-6 font-bold">ONTVANG HULP</h3>
                            <ul className="space-y-4 text-text text-sm">
                                <li><a href="#" className="hover:text-red-400">Bestelstatus</a></li>
                                <li><a href="#" className="hover:text-red-400">Verzending & Levering</a></li>
                                <li><a href="#" className="hover:text-red-400">Retourneren</a></li>
                                <li><a href="#" className="hover:text-red-400">Betaalmethoden</a></li>
                                <li><a href="#" className="hover:text-red-400">Contact</a></li>
                            </ul>
                        </div>

                        {/* About */}
                        <div>
                            <h3 className="text-lg mb-6 font-bold">OVER ONS</h3>
                            <ul className="space-y-4 text-text text-sm">
                                <li><a href="#" className="hover:text-red-400">Nieuws</a></li>
                                <li><a href="#" className="hover:text-red-400">Vacatures</a></li>
                                <li><a href="#" className="hover:text-red-400">Investeerders</a></li>
                                <li><a href="#" className="hover:text-red-400">Duurzaamheid</a></li>
                            </ul>
                        </div>

                        {/* Join Us */}
                        <div>
                            <h3 className="text-lg mb-6 font-bold">VOLG ONS</h3>
                            <ul className="space-y-4 text-text text-sm">
                                <li className='flex items-center gap-2 hover:text-red-400'><FaInstagram /><a href="https://www.instagram.com/bloemigeverleiding" target="_blank">Instagram</a></li>
                                <li className='flex items-center gap-2 hover:text-red-400'><FaTiktok /><a href="https://www.instagram.com/bloemigeverleiding" target="_blank">Tiktok</a></li>
                                <li className='flex items-center gap-2 hover:text-red-400'><FaFacebook /><a href="https://www.instagram.com/bloemigeverleiding" target="_blank">Facebook</a></li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-lg mb-6 font-bold">RECHTELIJK</h3>
                            <ul className="space-y-4 text-text text-sm">
                                <li><a href="/terms-of-service" className="hover:text-red-400">Servicevoorwaarden</a></li>
                                <li><a href="/terms-of-use" className="hover:text-red-400">Gebruiksvoorwaarden</a></li>
                                <li><a href="/privacy-policy" className="hover:text-red-400">Privacybeleid</a></li>
                            </ul>
                        </div>
                    </div>
                    
                    {/* Payment Methods - Now inside the cream footer */}
                    <div className="mt-16 pt-10 border-t border-text/10">
                        <div className="flex flex-col items-center">
                            <p className="text-sm text-text font-medium mb-6">Veilig betalen met</p>
                            <div className="flex flex-wrap justify-center gap-4">
                                <Image src="/Ideal.svg" alt="iDEAL" width={40} height={24} className="h-8 w-auto" />
                                <Image src="/Visa.svg" alt="Visa" width={40} height={24} className="h-8 w-auto" />
                                <Image src="/Mastercard.svg" alt="Mastercard" width={40} height={24} className="h-8 w-auto" />
                                <Image src="/PayPal.svg" alt="PayPal" width={40} height={24} className="h-8 w-auto" />
                                <Image src="/Maestro.svg" alt="Maestro" width={40} height={24} className="h-8 w-auto" />
                                <Image src="/Klarna.svg" alt="Klarna" width={40} height={24} className="h-8 w-auto" />
                                <Image src="/GooglePay.svg" alt="Google Pay" width={40} height={24} className="h-8 w-auto" />
                                <Image src="/ShopPay.svg" alt="Shop Pay" width={40} height={24} className="h-8 w-auto" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="border-t bg-text border-text flex flex-col md:flex-row justify-between items-center text-cream text-sm">
                    <div className='w-full flex flex-col text-center md:text-left md:flex-row justify-between gap-2 md:gap-20 mx-auto max-w-[1600px] p-4 lg:px-8 px-4'>
                        <p>© {new Date().getFullYear()} Bloemigeverleiding. Alle Rechten Voorbehouden</p>
                        <span>Developed and designed by <a href='https://enhancedigital.nl' target='_blank' className='hover:underline'>Enhancedigital.nl</a></span>
                    </div>
                </div>
            </div>
        </footer>
    );
} 