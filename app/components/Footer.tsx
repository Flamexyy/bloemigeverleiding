import Image from 'next/image';
import logo from '../../public/Logo_NIKE.svg';

export default function Footer() {
    return (
        <footer className="mt-auto">
            {/* Newsletter Section */}
            {/* <div className="bg-gray-100">
                <div className="max-w-[1600px] mx-auto px-4 lg:px-8 py-12 md:py-20">
                    <div className="max-w-2xl mx-auto text-center space-y-4 md:space-y-6">
                        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold">Join Our Newsletter</h2>
                        <p className="text-gray-600 text-sm md:text-base">
                            Subscribe to get special offers, free giveaways, and updates on new releases.
                        </p>
                        <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                            <input 
                                type="email" 
                                placeholder="Enter your email" 
                                className="flex-1 bg-white rounded-xl px-4 py-3 text-sm md:text-base placeholder:text-gray-500 border border-transparent focus:border-black/10 focus:outline-none"
                            />
                            <button 
                                type="submit"
                                className="bg-zinc-900 text-white px-6 py-3 rounded-xl hover:bg-zinc-800 transition-colors text-sm md:text-base whitespace-nowrap"
                            >
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>
            </div> */}
            
            {/* Main Footer */}
            <div className="bg-cream text-[#6E4B3A]">
                <div className="max-w-[1600px] mx-auto px-4 lg:px-8 pt-20 pb-10">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
                        {/* Logo and Description */}
                        <div className="space-y-6">
                            <Image src="/logo-footer.svg" alt="Bloemige Verleiding Logo" width={150} height={50} />
                            <p className="text-[#6E4B3A] text-sm leading-loose">
                                We deliver innovative products, experiences and services 
                                to inspire our customers. Free shipping for Members.
                            </p>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h3 className="text-lg mb-6 font-bold">GET HELP</h3>
                            <ul className="space-y-4 text-[#6E4B3A] text-sm">
                                <li><a href="#" className="hover:text-white">Order Status</a></li>
                                <li><a href="#" className="hover:text-white">Shipping & Delivery</a></li>
                                <li><a href="#" className="hover:text-white">Returns</a></li>
                                <li><a href="#" className="hover:text-white">Payment Options</a></li>
                                <li><a href="#" className="hover:text-white">Contact Us</a></li>
                            </ul>
                        </div>

                        {/* About */}
                        <div>
                            <h3 className="text-lg mb-6 font-bold">ABOUT US</h3>
                            <ul className="space-y-4 text-[#6E4B3A] text-sm">
                                <li><a href="#" className="hover:text-white">News</a></li>
                                <li><a href="#" className="hover:text-white">Careers</a></li>
                                <li><a href="#" className="hover:text-white">Investors</a></li>
                                <li><a href="#" className="hover:text-white">Sustainability</a></li>
                            </ul>
                        </div>

                        {/* Join Us */}
                        <div>
                            <h3 className="text-lg mb-6 font-bold">JOIN US</h3>
                            <ul className="space-y-4 text-[#6E4B3A] text-sm">
                                <li><a href="#" className="hover:text-white">Mobile App</a></li>
                                <li><a href="#" className="hover:text-white">Membership</a></li>
                                <li><a href="#" className="hover:text-white">Newsletter</a></li>
                                <li><a href="#" className="hover:text-white">Student Discount</a></li>
                            </ul>
                        </div>
                    </div>

                    {/* Bottom Section */}
                    <div className="border-t border-[#6E4B3A] mt-20 pt-10 flex flex-col md:flex-row justify-between items-center text-[#6E4B3A] text-sm">
                        <div className="flex flex-col sm:flex-row text-center gap-4 mb-4 md:mb-0">
                            <a href="/terms-of-service" className="hover:text-white">Servicevoorwaarden</a>
                            <a href="/terms-of-use" className="hover:text-white">Gebruiksvoorwaarden</a>
                            <a href="/privacy-policy" className="hover:text-white">Privacybeleid</a>
                        </div>
                        <p>© {new Date().getFullYear()} Bloemigeverleiding. Alle Rechten Voorbehouden</p>
                    </div>
                </div>
            </div>
        </footer>
    );
} 