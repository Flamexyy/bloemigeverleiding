'use client';
import { useState, useEffect } from 'react';
import { LuUser } from "react-icons/lu";
import CartMenu from './CartMenu';
import { MdOutlineShoppingBag } from "react-icons/md";
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { IoClose } from 'react-icons/io5';
import { RiHome5Line, RiShoppingBag3Line, RiInformationLine, RiCustomerService2Line } from 'react-icons/ri';
import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const { user, logout } = useAuth();
    const { itemCount } = useCart();

    const isActive = (path: string) => {
        if (path === '/' && pathname === '/') return true;
        if (path !== '/' && pathname.startsWith(path)) return true;
        return false;
    };

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                document.body.style.overflow = 'unset';
                setIsOpen(false);
            } else if (isOpen) {
                document.body.style.overflow = 'hidden';
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const handleProfileClick = () => {
        if (user) {
            router.push('/profile');
        } else {
            router.push('/login');
        }
    };

    const handleLogout = () => {
        logout();
        router.push('/');
    };

    return (
        <>
            <header className='bg-white text-text'>
                <div className='max-w-[1600px] mx-auto flex items-center justify-between p-4 lg:px-6'>
                    <Link href="/">
                            <Image 
                                src="/logo-wide.svg" 
                                alt="Logo" 
                                width={200} 
                                height={100} 
                                className="object-contain"
                            />
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:block">
                        <ul className='flex gap-6 lg:gap-10 font-bold'>
                            <li>
                                <Link href="/" className={`transition-opacity duration-200 ${isActive('/') ? 'opacity-100' : 'opacity-50 hover:opacity-75'}`}>
                                    HOME
                                </Link>
                            </li>
                            <li>
                                <Link href="/shop" className={`transition-opacity duration-200 ${isActive('/shop') ? 'opacity-100' : 'opacity-50 hover:opacity-75'}`}>
                                    SHOP
                                </Link>
                            </li>
                            <li>
                                <Link href="/about" className={`transition-opacity duration-200 ${isActive('/about') ? 'opacity-100' : 'opacity-50 hover:opacity-75'}`}>
                                    ABOUT
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className={`transition-opacity duration-200 ${isActive('/contact') ? 'opacity-100' : 'opacity-50 hover:opacity-75'}`}>
                                    CONTACT
                                </Link>
                            </li>
                        </ul>
                    </nav>

                    <div className='w-[200px] flex gap-1 items-center justify-end text-xl md:text-2xl'>
                        <button 
                            onClick={() => setIsCartOpen(true)}
                            className="p-2 hover:bg-accent rounded-full transition-colors relative"
                        >
                            <MdOutlineShoppingBag />
                            {itemCount > 0 && (
                                <span className="absolute -top-0 -right-0 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                                    {itemCount}
                                </span>
                            )}
                        </button>
                        <button 
                            onClick={handleProfileClick}
                            className="p-2 hover:bg-accent rounded-full transition-colors"
                        >
                            <LuUser />
                        </button>
                        {/* Menu Text + Hamburger */}
                        <div className="flex items-center gap-2 md:hidden">
                            <button 
                                onClick={() => setIsOpen(!isOpen)}
                                className="p-2 h-[36px] w-[36px] hover:bg-accent rounded-full transition-colors flex flex-col gap-[5px] justify-center items-center"
                            >
                                <span className={`block w-5 h-[2px] rounded-full bg-text transition-all duration-300 origin-center ${
                                    isOpen ? 'rotate-45 translate-y-[3.5px]' : ''
                                }`} />
                                <span className={`block w-5 h-[2px] rounded-full bg-text transition-all duration-300 origin-center ${
                                    isOpen ? '-rotate-45 -translate-y-[3.5px]' : ''
                                }`} />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            <div 
                onClick={() => setIsOpen(false)}
                className={`fixed inset-0 bg-black/50 transition-opacity duration-300 md:hidden ${
                    isOpen ? 'opacity-100 z-50' : 'opacity-0 pointer-events-none'
                }`}
            />

            {/* Mobile Menu */}
            <div className={`fixed inset-y-0 right-0 w-full md:w-[400px] bg-white shadow-xl transition-transform duration-300 transform z-50 ${
                isOpen ? 'translate-x-0' : 'translate-x-full'
            }`}>
                <div className="h-full flex flex-col">
                    {/* Header */}
                    <div className="flex justify-between items-center p-4 border-b">
                        <div className="flex items-center gap-2">
                            <h2 className="text-xl font-bold">Menu</h2>
                        </div>
                        <button 
                            onClick={() => setIsOpen(false)}
                            className="hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <IoClose className="text-4xl p-2" />
                        </button>
                    </div>

                    {/* Menu Content */}
                    <div className="flex-1 overflow-y-auto p-4">
                        <nav className="mb-8">
                            <div className="space-y-3">
                                <Link 
                                    href="/" 
                                    onClick={() => setIsOpen(false)}
                                    className={`flex items-center w-full p-4 rounded-xl border ${
                                        isActive('/') 
                                        ? 'bg-black text-white border-black' 
                                        : 'bg-gray-50 hover:bg-gray-100 border-gray-200'
                                    }`}
                                >
                                    <RiHome5Line className="text-xl mr-3" />
                                    <div>
                                        <span className="font-medium">Home</span>
                                    </div>
                                </Link>
                                <Link 
                                    href="/shop" 
                                    onClick={() => setIsOpen(false)}
                                    className={`flex items-center w-full p-4 rounded-xl border ${
                                        isActive('/shop') 
                                        ? 'bg-black text-white border-black' 
                                        : 'bg-gray-50 hover:bg-gray-100 border-gray-200'
                                    }`}
                                >
                                    <RiShoppingBag3Line className="text-xl mr-3" />
                                    <div>
                                        <span className="font-medium">Shop</span>
                                        <p className={`text-sm mt-0.5 ${isActive('/shop') ? 'text-white/70' : 'text-gray-500'}`}>
                                            Browse all products
                                        </p>
                                    </div>
                                </Link>
                                <Link 
                                    href="/about" 
                                    onClick={() => setIsOpen(false)}
                                    className={`flex items-center w-full p-4 rounded-xl border ${
                                        isActive('/about') 
                                        ? 'bg-black text-white border-black' 
                                        : 'bg-gray-50 hover:bg-gray-100 border-gray-200'
                                    }`}
                                >
                                    <RiInformationLine className="text-xl mr-3" />
                                    <div>
                                        <span className="font-medium">About</span>
                                        <p className={`text-sm mt-0.5 ${isActive('/about') ? 'text-white/70' : 'text-gray-500'}`}>
                                            Our story
                                        </p>
                                    </div>
                                </Link>
                                <Link 
                                    href="/contact" 
                                    onClick={() => setIsOpen(false)}
                                    className={`flex items-center w-full p-4 rounded-xl border ${
                                        isActive('/contact') 
                                        ? 'bg-black text-white border-black' 
                                        : 'bg-gray-50 hover:bg-gray-100 border-gray-200'
                                    }`}
                                >
                                    <RiCustomerService2Line className="text-xl mr-3" />
                                    <div>
                                        <span className="font-medium">Contact</span>
                                        <p className={`text-sm mt-0.5 ${isActive('/contact') ? 'text-white/70' : 'text-gray-500'}`}>
                                            Get in touch
                                        </p>
                                    </div>
                                </Link>
                            </div>
                        </nav>

                        {user ? (
                            <div className="mt-8">
                                <div className="px-4 mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="min-w-12 min-h-12 bg-black text-white rounded-full flex items-center justify-center shrink-0">
                                            <LuUser className="text-xl" />
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className="text-lg font-bold truncate">
                                                {user.firstName} {user.lastName}
                                            </h3>
                                            <p className="text-gray-600 truncate">
                                                {user.email}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="w-full py-4 px-4 bg-black text-white font-bold rounded-xl hover:bg-black/90 transition-colors text-center"
                                >
                                    Sign Out
                                </button>
                            </div>
                        ) : (
                            <div className="mt-8">
                                <div className="px-4 mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center">
                                            <LuUser className="text-xl" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold">Account</h3>
                                            <p className="text-gray-600">Sign in to your account</p>
                                        </div>
                                    </div>
                                </div>
                                <Link 
                                    href="/login"
                                    onClick={() => setIsOpen(false)}
                                    className="block w-full py-4 px-4 bg-black text-white font-bold rounded-xl hover:bg-black/90 transition-colors text-center"
                                >
                                    Sign In
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <CartMenu 
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
            />
        </>
    );
}
