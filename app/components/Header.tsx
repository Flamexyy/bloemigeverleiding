'use client';
import { useState, useEffect } from 'react';
import CartMenu from './CartMenu';
import { MdOutlineShoppingBag } from "react-icons/md";
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { IoClose } from 'react-icons/io5';
import { RiHome5Line, RiShoppingBag3Line, RiInformationLine, RiCustomerService2Line } from 'react-icons/ri';
import Link from 'next/link';
import Image from 'next/image';
import { HiMiniChevronRight } from "react-icons/hi2";
import { useLiked } from '../context/LikedContext';
import { AiOutlineHeart } from "react-icons/ai";
import { LuUser } from "react-icons/lu";

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const { user } = useAuth();
    const { itemCount, setIsOpen: setCartIsOpen } = useCart();
    const { likedItems } = useLiked();

    const likedCount = likedItems.length;

    // Check if current path is shop-related (includes /shop or /products/)
    const isShopActive = pathname === '/shop' || pathname.startsWith('/products/');
    const isLikedActive = pathname === '/liked';

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

    const handleCartClick = () => {
        setCartIsOpen(true);
    };

    return (
        <>
            <header className='bg-white text-text'>
                <div className='max-w-[1600px] mx-auto flex items-center justify-between p-4 lg:px-6'>
                    <Link href="/">
                        <Image 
                            src="/logo-wide.svg" 
                            alt="Logo" 
                            width={150} 
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
                                <Link href="/shop" className={`transition-opacity duration-200 ${isShopActive ? 'opacity-100' : 'opacity-50 hover:opacity-75'}`}>
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

                    <div className='sm:w-[150px] flex gap-1 items-center justify-end text-2xl'>
                        <div className="relative">
                            <Link
                                href="/liked"
                                className={`p-2 rounded-full flex items-center justify-center hover:bg-accent transition-colors group ${isLikedActive ? 'bg-accent' : ''}`}
                            >
                                <AiOutlineHeart className="text-2xl text-text" />
                                {likedCount > 0 && (
                                    <span className={`absolute  -top-0 -right-0 w-5 h-5 rounded-full text-xs flex items-center justify-center transition-colors ${
                                        isLikedActive ? 'bg-text text-cream' : 'bg-accent group-hover:bg-text text-text group-hover:text-cream'
                                    }`}>
                                        {likedCount}
                                    </span>
                                )}
                            </Link>
                        </div>
                        <div className="relative">
                            <button
                                onClick={() => setCartIsOpen(true)}
                                className={`p-2 rounded-full flex items-center justify-center hover:bg-accent transition-colors group ${
                                    isCartOpen ? 'bg-accent' : ''
                                }`}
                                aria-label="Open cart"
                            >
                                <MdOutlineShoppingBag className="text-2xl text-text" />
                                {itemCount > 0 && (
                                    <span className={`absolute  -top-0 -right-0 w-5 h-5 rounded-full text-xs flex items-center justify-center transition-colors ${
                                        isCartOpen ? 'bg-text text-cream' : 'bg-accent group-hover:bg-text text-text group-hover:text-cream'
                                    }`}>
                                        {itemCount}
                                    </span>
                                )}
                            </button>
                        </div>
                        {/* Account Icon - Desktop Only */}
                        <Link 
                            href={user ? "/profile" : "/login"}
                            className={`hidden md:block p-2 rounded-full transition-colors ${
                                isActive('/profile') || isActive('/login') ? 'bg-accent' : 'hover:bg-accent'
                            }`}
                        >
                            <LuUser />
                        </Link>
                        {/* Menu Hamburger */}
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
                    <div className="w-full flex items-center justify-between p-4 border-b border-text/20 text-text">
                        <span className='text-xl font-bold'>Menu</span>
                        <button 
                            onClick={() => setIsOpen(false)}
                            className="p-2 hover:bg-accent rounded-full transition-colors"
                        >
                            <IoClose className="text-2xl" />
                        </button>
                    </div>

                    {/* Navigation */}
                    <div className="flex-1 overflow-y-auto">
                        <nav className="p-4">
                            <ul className="space-y-2">
                                <li>
                                    <Link 
                                        href="/"
                                        onClick={() => setIsOpen(false)}
                                        className={`flex items-center justify-between p-3 rounded-xl transition-colors text-text ${
                                            isActive('/') ? 'bg-accent' : 'hover:bg-accent'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <RiHome5Line className="text-xl" />
                                            <span className="font-medium">Home</span>
                                        </div>
                                        <HiMiniChevronRight className="text-xl opacity-50" />
                                    </Link>
                                </li>
                                <li>
                                    <Link 
                                        href="/shop"
                                        onClick={() => setIsOpen(false)}
                                        className={`flex items-center justify-between p-3 rounded-xl transition-colors text-text ${
                                            isShopActive ? 'bg-accent' : 'hover:bg-accent'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <RiShoppingBag3Line className="text-xl" />
                                            <span className="font-medium">Shop</span>
                                        </div>
                                        <HiMiniChevronRight className="text-xl opacity-50" />
                                    </Link>
                                </li>
                                <li>
                                    <Link 
                                        href="/liked"
                                        onClick={() => setIsOpen(false)}
                                        className={`flex items-center justify-between p-3 rounded-xl transition-colors text-text ${
                                            isLikedActive ? 'bg-accent' : 'hover:bg-accent'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <AiOutlineHeart className="text-xl" />
                                            <span className="font-medium">Favorieten</span>
                                        </div>
                                        <HiMiniChevronRight className="text-xl opacity-50" />
                                    </Link>
                                </li>
                                <li>
                                    <Link 
                                        href="/about"
                                        onClick={() => setIsOpen(false)}
                                        className={`flex items-center justify-between p-3 rounded-xl transition-colors text-text ${
                                            isActive('/about') ? 'bg-accent' : 'hover:bg-accent'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <RiInformationLine className="text-xl" />
                                            <span className="font-medium">About</span>
                                        </div>
                                        <HiMiniChevronRight className="text-xl opacity-50" />
                                    </Link>
                                </li>
                                <li>
                                    <Link 
                                        href="/contact"
                                        onClick={() => setIsOpen(false)}
                                        className={`flex items-center justify-between p-3 rounded-xl transition-colors text-text ${
                                            isActive('/contact') ? 'bg-accent' : 'hover:bg-accent'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <RiCustomerService2Line className="text-xl" />
                                            <span className="font-medium">Contact</span>
                                        </div>
                                        <HiMiniChevronRight className="text-xl opacity-50" />
                                    </Link>
                                </li>
                            </ul>
                        </nav>
                    </div>

                    {/* Footer */}
                    <div className="p-4 border-t border-[#EBEBEB]">
                        <Link 
                            href={user ? "/profile" : "/login"}
                            onClick={() => setIsOpen(false)}
                            className="flex items-center justify-between p-3"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-accent text-text rounded-full flex items-center justify-center">
                                        <LuUser className="text-xl" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-text">
                                        {user ? (user.firstName || 'Account') : 'Account'}
                                    </h3>
                                    <p className="text-text/50">
                                        {user ? 'Bekijk je profiel' : 'Log in op je account'}
                                    </p>
                                </div>
                            </div>
                            <HiMiniChevronRight className="text-xl opacity-50" />
                        </Link>
                    </div>
                </div>
            </div>

            <CartMenu />
        </>
    );
}
