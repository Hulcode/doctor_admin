import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminHeader from "./(layout)/Header";
import AdminFooter from "./(layout)/Footer";
import { Toaster } from "react-hot-toast";

import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "لوحة التحكم - د. أحمد حسن سليمان",
  description: "لوحة تحكم عيادة د. أحمد حسن سليمان",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check authentication
  const cookieStore = await cookies();
  const isAuthenticated =
    cookieStore.get("admin_authenticated")?.value === "true";

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    redirect("/login");
  }

  return (
    <html
      lang="ar"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {" "}
        <div className="min-h-screen bg-slate-50 flex flex-col">
          <AdminHeader isLoggedIn={true} />
          <main className="flex-1">{children}</main>
          <AdminFooter />
          <Toaster position="top-right" />
        </div>
      </body>
    </html>
  );
}
