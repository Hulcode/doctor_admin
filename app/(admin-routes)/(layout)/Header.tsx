"use client";

import Image from "next/image";
import Link from "next/link";
import {
  CalendarDays,
  Users,
  Settings,
  Menu,
  X,
  ChevronDown,
  User2,
} from "lucide-react";
import logo from "../../../public/noBg.png";
import { useState } from "react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import MobileHeader from "./MobileHeader";
import ProfileOnOpen from "../(componants)/ProfileOnOpen";
import NotifyButton from "../(componants)/NotifyButton";

// Add button:

const adminNavLinks = [
  {
    label: "المرضى",
    href: "/",
    icon: Users,
  },
  {
    label: "المواعيد",
    href: "/appointments",
    icon: CalendarDays,
  },

  {
    label: "الإعدادات",
    href: "/settings",
    icon: Settings,
  },
  {
    label: "التقييمات",
    href: "/AcceptReviews",
    icon: User2,
  },
];

const AdminHeader = ({ isLoggedIn }: { isLoggedIn: boolean }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);
  if (!isLoggedIn) {
    return null;
  }
  return (
    <header
      dir="rtl"
      className="sticky top-0 z-50 border-b border-red-900/50 bg-gradient-to-l from-[#7f1d1d] via-[#991b1b] to-[#b91c1c] backdrop-blur-xl shadow-lg shadow-red-900/20"
    >
      {/* Subtle Red Glow Effect */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.1),transparent_50%)]" />

      <div className="relative mx-auto flex h-16 md:h-20 max-w-[1600px] items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo - Responsive size */}
        <Link
          href="/"
          className="transition-opacity hover:opacity-85 flex-shrink-0"
          onClick={closeMenu}
        >
          <Image
            src={logo}
            alt="د. أحمد حسن سليمان"
            width={430}
            height={130}
            priority
            className="h-auto w-[140px] object-contain sm:w-[180px] md:w-[220px] lg:w-[260px] drop-shadow-lg"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 lg:flex xl:gap-2">
          {adminNavLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group relative flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-red-50 transition-all duration-300 hover:bg-white/10 hover:text-white"
            >
              <link.icon className="h-4 w-4 text-[#fbbf24]" />
              {link.label}
              {/* Gold underline on hover */}
              <span className="absolute bottom-0 right-4 left-4 h-0.5 w-0 bg-gradient-to-l from-[#fbbf24] to-[#fcd34d] transition-all duration-300 group-hover:w-auto" />
            </Link>
          ))}
        </nav>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Push Notification Toggle */}
          <NotifyButton show={false} />

          {/* Admin Profile Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setIsProfileOpen(!isProfileOpen);
              }}
              className="flex items-center gap-2 rounded-full border border-red-700/50 bg-red-800/30 py-1.5 pl-3 pr-1.5 transition-colors hover:bg-red-800/60"
            >
              <Avatar className="h-8 w-8 border-2 border-[#fbbf24]/60">
                <AvatarFallback className="bg-gradient-to-br from-[#b91c1c] to-[#7f1d1d] text-white text-sm font-bold">
                  د
                </AvatarFallback>
              </Avatar>
              <div className="hidden text-right sm:block">
                <p className="text-xs font-bold text-white">د. أحمد حسن</p>
                <p className="text-[10px] text-red-200">مدير النظام</p>
              </div>
              <ChevronDown
                className={`h-4 w-4 text-red-200 transition-transform duration-300 ${isProfileOpen ? "rotate-180" : ""}`}
              />
            </button>{" "}
            <ProfileOnOpen isProfileOpen={isProfileOpen} />
          </div>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            aria-label="فتح القائمة"
            onClick={() => setIsOpen(!isOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-red-700/50 bg-red-800/30 text-red-50 transition-colors hover:bg-red-800/60 hover:text-white lg:hidden"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <MobileHeader
        isOpen={isOpen}
        adminNavLinks={adminNavLinks}
        closeMenu={closeMenu}
      />
    </header>
  );
};

export default AdminHeader;
