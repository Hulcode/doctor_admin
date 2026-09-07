import { LucideIcon } from "lucide-react";
import React from "react";
type HeaderProps = {
  isOpen: boolean;
  adminNavLinks: {
    label: string;
    href: string;
    icon: LucideIcon;
  }[];
  closeMenu: () => void;
};
import { LogOut, ShieldCheck } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import Link from "next/link";
import { logout } from "@/app/actions/auth";
import router from "next/router";
import NotifyButton from "../(componants)/NotifyButton";
const MobileHeader = ({ isOpen, adminNavLinks, closeMenu }: HeaderProps) => {
  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="lg:hidden overflow-hidden border-t border-red-900/50 bg-gradient-to-b from-[#991b1b] to-[#7f1d1d]"
        >
          <nav className="flex flex-col gap-1 px-4 py-4 sm:px-6">
            {adminNavLinks.map((link, index) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  href={link.href}
                  onClick={closeMenu}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-red-50 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <link.icon className="h-4 w-4 text-[#fbbf24]" />
                  {link.label}
                </Link>
              </motion.div>
            ))}

            {/* Mobile Divider */}
            <div className="my-2 border-t border-red-800/50" />
            <NotifyButton show={true} />
            <Link
              href="/"
              onClick={closeMenu}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-red-50 transition-colors hover:bg-white/10 hover:text-white"
            >
              <ShieldCheck className="h-4 w-4 text-[#fbbf24]" />
              العودة للموقع
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-red-400 transition-colors hover:bg-red-900/30 hover:text-red-300"
            >
              <LogOut className="h-4 w-4" />
              تسجيل الخروج
            </button>
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MobileHeader;
