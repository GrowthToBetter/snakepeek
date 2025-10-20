"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, AlertTriangle, LogOut, LogIn } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { signIn, signOut, useSession } from "next-auth/react";

const navigation = [
  { name: "Beranda", href: "/" },
  { name: "Laporan Darurat", href: "/laporan" },
  { name: "Edukasi Kedaruratan", href: "/edukasi" },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const router = useRouter();

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="p-2 bg-secondary rounded-lg">
                <Image src={"/logo.svg"} alt="logo" width={40} height={40} />
              </div>
              <div className="hidden sm:block">
                <span className="text-xl font-bold text-dark">SnakePeek</span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 whitespace-nowrap",
                    isActive
                      ? "bg-secondary text-white"
                      : "text-gray-700 hover:bg-gray-100 hover:text-secondary"
                  )}>
                  {item.name}
                </Link>
              );
            })}
          </div>

          <div className="hidden md:flex items-center">
            {status === "loading" ? (
              <div className="animate-pulse text-gray-400 text-sm px-4 py-2">
                Memuat...
              </div>
            ) : session ? (
              <button
                onClick={()=>{router.push("/auth/signout")}}
                className="flex items-center space-x-2 bg-secondary text-white px-4 py-2 rounded-lg hover:bg-secondary/90 transition-colors duration-200 whitespace-nowrap">
                <LogOut className="h-4 w-4" />
                <span className="text-sm font-medium">Keluar</span>
              </button>
            ) : (
              <button
                onClick={() => {router.push("/auth/signin")}}
                className="flex items-center space-x-2 bg-secondary text-white px-4 py-2 rounded-lg hover:bg-secondary/90 transition-colors duration-200 whitespace-nowrap">
                <LogIn className="h-4 w-4" />
                <span className="text-sm font-medium">Masuk</span>
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-gray-700 hover:text-secondary hover:bg-gray-100"
              aria-label="Toggle navigation">
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200">
          <div className="px-4 py-2 space-y-1 bg-white">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200",
                    isActive
                      ? "bg-secondary text-white"
                      : "text-gray-700 hover:bg-gray-100 hover:text-secondary"
                  )}
                  onClick={() => setMobileMenuOpen(false)}>
                  {item.name}
                </Link>
              );
            })}
          </div>
          <div className="px-4 pb-3 pt-2">
            {status === "loading" ? (
              <div className="px-4 py-2.5 text-sm text-gray-500">Memuat...</div>
            ) : session ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  router.push("/auth/signout");
                }}
                className="flex w-full items-center space-x-2 px-4 py-2.5 rounded-lg text-sm font-medium text-secondary hover:bg-secondary/10 transition-colors">
                <LogOut className="h-4 w-4" />
                <span>Keluar</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  router.push("/auth/signin");
                }}
                className="flex w-full items-center space-x-2 px-4 py-2.5 rounded-lg text-sm font-medium text-secondary hover:bg-secondary/10 transition-colors">
                <LogIn className="h-4 w-4" />
                <span>Masuk</span>
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}