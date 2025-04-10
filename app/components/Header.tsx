"use client";
import { useState, useEffect } from "react";
import CartMenu from "./CartMenu";
import { MdOutlineShoppingBag } from "react-icons/md";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { IoClose } from "react-icons/io5";
import { RiHome5Line, RiShoppingBag3Line, RiInformationLine, RiCustomerService2Line } from "react-icons/ri";
import Link from "next/link";
import Image from "next/image";
import { HiMiniChevronRight } from "react-icons/hi2";
import { useLiked } from "../context/LikedContext";
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
  const isShopActive = pathname === "/shop" || pathname.startsWith("/products/");
  const isLikedActive = pathname === "/liked";

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true;
    if (path !== "/" && pathname.startsWith(path)) return true;
    return false;
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        document.body.style.overflow = "unset";
        setIsOpen(false);
      } else if (isOpen) {
        document.body.style.overflow = "hidden";
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleCartClick = () => {
    setCartIsOpen(true);
  };

  return (
    <>
      <header className="bg-white text-text">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between p-4 lg:px-6">
          <Link href="/">
            <Image
              src="/logo-wide.svg"
              alt="Logo"
              width={150}
              height={100}
              className="h-full object-contain"
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:block">
            <ul className="flex gap-6 font-bold lg:gap-10">
              <li>
                <Link
                  href="/"
                  className={`transition-opacity duration-200 ${isActive("/") ? "opacity-100" : "opacity-50 hover:opacity-75"}`}
                >
                  HOME
                </Link>
              </li>
              <li>
                <Link
                  href="/shop"
                  className={`transition-opacity duration-200 ${isShopActive ? "opacity-100" : "opacity-50 hover:opacity-75"}`}
                >
                  SHOP
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className={`transition-opacity duration-200 ${isActive("/about") ? "opacity-100" : "opacity-50 hover:opacity-75"}`}
                >
                  ABOUT
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className={`transition-opacity duration-200 ${isActive("/contact") ? "opacity-100" : "opacity-50 hover:opacity-75"}`}
                >
                  CONTACT
                </Link>
              </li>
            </ul>
          </nav>

          <div className="flex items-center justify-end gap-1 text-2xl sm:w-[150px]">
            <div className="relative">
              <Link
                href="/liked"
                className={`group flex items-center justify-center rounded-full p-2 transition-colors hover:bg-accent ${isLikedActive ? "bg-accent" : ""}`}
              >
                <AiOutlineHeart className="text-2xl text-text" />
                {likedCount > 0 && (
                  <span
                    className={`absolute -right-0 -top-0 flex h-5 w-5 items-center justify-center rounded-full text-xs transition-colors ${
                      isLikedActive ? "bg-text text-cream" : "bg-accent text-text group-hover:bg-text group-hover:text-cream"
                    }`}
                  >
                    {likedCount}
                  </span>
                )}
              </Link>
            </div>
            <div className="relative">
              <button
                onClick={() => setCartIsOpen(true)}
                className={`group flex items-center justify-center rounded-full p-2 transition-colors hover:bg-accent ${
                  isCartOpen ? "bg-accent" : ""
                }`}
                aria-label="Open cart"
              >
                <MdOutlineShoppingBag className="text-2xl text-text" />
                {itemCount > 0 && (
                  <span
                    className={`absolute -right-0 -top-0 flex h-5 w-5 items-center justify-center rounded-full text-xs transition-colors ${
                      isCartOpen ? "bg-text text-cream" : "bg-accent text-text group-hover:bg-text group-hover:text-cream"
                    }`}
                  >
                    {itemCount}
                  </span>
                )}
              </button>
            </div>
            {/* Account Icon - Desktop Only */}
            <Link
              href={user ? "/account" : "/login"}
              className={`hidden rounded-full p-2 transition-colors md:block ${
                isActive("/account") || isActive("/login") ? "bg-accent" : "hover:bg-accent"
              }`}
            >
              <LuUser />
            </Link>
            {/* Menu Hamburger */}
            <div className="flex items-center gap-2 md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex h-[36px] w-[36px] flex-col items-center justify-center gap-[5px] rounded-full p-2 transition-colors hover:bg-accent"
              >
                <span
                  className={`block h-[2px] w-5 origin-center rounded-full bg-text transition-all duration-300 ${
                    isOpen ? "translate-y-[3.5px] rotate-45" : ""
                  }`}
                />
                <span
                  className={`block h-[2px] w-5 origin-center rounded-full bg-text transition-all duration-300 ${
                    isOpen ? "-translate-y-[3.5px] -rotate-45" : ""
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        onClick={() => setIsOpen(false)}
        className={`fixed inset-0 bg-black/50 transition-opacity duration-300 md:hidden ${
          isOpen ? "z-50 opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Mobile Menu */}
      <div
        className={`fixed inset-y-0 right-0 z-50 w-full transform bg-white shadow-xl transition-transform duration-300 md:w-[400px] ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex w-full items-center justify-between border-b border-text/20 p-4 text-text">
            <span className="text-xl font-bold">Menu</span>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-full p-2 transition-colors hover:bg-accent"
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
                    className={`flex items-center justify-between rounded-xl p-3 text-text transition-colors ${
                      isActive("/") ? "bg-accent" : "hover:bg-accent"
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
                    className={`flex items-center justify-between rounded-xl p-3 text-text transition-colors ${
                      isShopActive ? "bg-accent" : "hover:bg-accent"
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
                    className={`flex items-center justify-between rounded-xl p-3 text-text transition-colors ${
                      isLikedActive ? "bg-accent" : "hover:bg-accent"
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
                    className={`flex items-center justify-between rounded-xl p-3 text-text transition-colors ${
                      isActive("/about") ? "bg-accent" : "hover:bg-accent"
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
                    className={`flex items-center justify-between rounded-xl p-3 text-text transition-colors ${
                      isActive("/contact") ? "bg-accent" : "hover:bg-accent"
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
          <div className="border-t border-[#EBEBEB] p-4">
            <Link
              href={user ? "/account" : "/login"}
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-between p-3"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-text">
                  <LuUser className="text-xl" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-text">{user ? user.firstName || "Account" : "Account"}</h3>
                  <p className="text-text/50">{user ? "Bekijk je profiel" : "Log in op je account"}</p>
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
