"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  FileText,
  BookOpen,
  Scale,
  Phone,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Users,
  Clock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import CardStat from "@/components/CardStat";
import NLPExtractionSteps from "@/components/NLPExtractionSteps";
import { Report } from "@/lib/types";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";
const RealtimeMap = dynamic(() => import("@/components/RealtimeMap"), {
  ssr: false,
});

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState<Report[]>([]);
  const [carousel, setCarousel] = useState<Report[]>([]);
  const [stats, setStats] = useState({
    totalReports: 0,
    activeIncidents: 0,
    verifiedReports: 0,
    responseTime: "0",
  });

  useEffect(() => {
    // Fetch initial data
    const fetchData = async () => {
      try {
        const reportsResponse = await fetch("/api/laporan");
        const reportsData = await reportsResponse.json();
        setReports(reportsData);
        setCarousel(
          reports.filter((r) => {
            r.fotoUrl !== undefined && r.fotoUrl !== null;
          })
        );

        // Calculate stats from reports
        setStats({
          totalReports: reportsData.length,
          activeIncidents: reportsData.filter(
            (r: Report) =>
              new Date().getTime() - new Date(r.createdAt).getTime() <
              24 * 60 * 60 * 1000
          ).length,
          verifiedReports: Math.floor(reportsData.length * 0.85), // 85% verified rate
          responseTime: "4.2",
        });
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % reports.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + reports.length) % reports.length);
  };

  useEffect(() => {
    if (reports.length > 0) {
      const timer = setInterval(() => {
        nextSlide();
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [reports.length, currentSlide]);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Hero Section */}
      <div className="relative w-full h-screen overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 bg-cover bg-no-repeat bg-center bg-[url('/bg.png')]">
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/10"></div>
        </div>

        {/* Content */}
        <div className="relative h-full flex flex-col items-center justify-center px-4">
          {/* Top Label */}
          <div className="mb-8">
            <p className="text-gray-900 text-lg md:text-xl font-medium tracking-wide">
              Sistem Pengaduan Online untuk Ular
            </p>
          </div>

          {/* Main Heading */}
          <div className="text-center mb-12">
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-black leading-tight mb-3">
              Bersama Lawan
            </h1>
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-black leading-tight">
              Ancaman Ular
            </h1>
          </div>

          {/* CTA Button */}
          <div className="mb-14">
            <button className="group inline-flex items-center space-x-2 bg-green-200/90 hover:bg-green-300/90 text-gray-800 font-semibold text-base md:text-lg px-10 py-3.5 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl">
              <span>Get Started</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Features */}
          <div className="flex items-center space-x-6 md:space-x-10 text-gray-900">
            <span className="text-base md:text-lg font-medium">Aman</span>
            <span className="text-gray-500">|</span>
            <span className="text-base md:text-lg font-medium">Cepat</span>
            <span className="text-gray-500">|</span>
            <span className="text-base md:text-lg font-medium">Lapor</span>
          </div>
        </div>
      </div>

      <div className="min-h-screen bg-gradient-to-br from-green-200/40 via-green-100/30 to-teal-100/40">
        <div className="max-w-5xl mx-auto px-6 py-16 md:py-20">
          {/* Info Section */}
          <div className="bg-white/90 backdrop-blur-sm rounded-[2.5rem] p-10 md:p-12 mb-16 shadow-md relative">
            <div className="absolute -top-5 -right-5 w-24 h-24 bg-green-300/30 rounded-full flex items-center justify-center text-5xl">
              🐍
            </div>
            <div>
              <p className="text-gray-700 leading-relaxed text-base md:text-lg">
                Aplikasi ini hadir sebagai solusi cerdas untuk melindungi
                lingkungan sekitar dari ancaman ular. Dengan fitur laporan cepat
                dari warga, setiap kemunculan ular dapat segera diketahui,
                ditangani, dan dicegah agar tidak membahayakan. Selain itu, Anda
                juga dapat memperoleh berita terbaru seputar ular, tips
                penanganan, serta informasi penting lainnya. Mari bersama-sama
                wujudkan lingkungan yang lebih aman dengan saling peduli melalui
                aplikasi ini.
              </p>
            </div>
          </div>

          {/* Report Section */}
          <div className="mb-16">
            <div className="flex flex-col md:flex-row items-center gap-8 bg-green-100/40 rounded-[2.5rem] p-10 md:p-12">
              {/* Illustration */}
              <div className="flex-shrink-0">
                <div className="relative w-44 h-44 md:w-48 md:h-48">
                  <div className="absolute inset-0 bg-green-300/40 rounded-full"></div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-36 h-36 md:w-40 md:h-40 bg-green-400/30 rounded-full"></div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 md:w-32 md:h-32 bg-green-500/20 rounded-full flex items-center justify-center">
                    <div className="text-5xl md:text-6xl">🔍</div>
                  </div>
                  <div className="absolute bottom-2 right-2 text-3xl md:text-4xl">🐍</div>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                  Anda melihat Ular?
                </h2>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
                  Laporkan kepada kami!
                </h3>
                <p className="text-gray-700 text-sm md:text-base mb-6 leading-relaxed">
                  Dengan melaporkan, anda bisa membantu mengamankan komunitas
                  sekitar dari ancaman yang berbahaya dan berbahaya menjadi yang
                  lebih baik.
                </p>
                <button className="bg-green-200/80 hover:bg-green-300/80 text-gray-800 font-medium px-8 py-3 rounded-lg transition-all duration-300 text-sm md:text-base">
                  Lapor Sekarang
                </button>
              </div>
            </div>
          </div>

          {/* News Carousel Section */}
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-10">
              Berita Ular
            </h2>

            {loading ? (
              <div className="bg-white/80 rounded-[2.5rem] p-16 text-center shadow-md">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
                <p className="mt-5 text-gray-600 text-base">Memuat berita...</p>
              </div>
            ) : carousel.length === 0 ? (
              <div className="bg-white/80 rounded-[2.5rem] p-16 text-center shadow-md">
                <p className="text-gray-600 text-base">Belum ada laporan dengan foto</p>
              </div>
            ) : (
              <div className="relative">
                {/* Carousel Container */}
                <div className="relative overflow-hidden rounded-[2.5rem] shadow-xl">
                  {/* Side Images with Blur Effect */}
                  <div className="absolute left-0 top-0 bottom-0 w-32 md:w-40 z-10 overflow-hidden rounded-l-[2.5rem]">
                    {reports[
                      (currentSlide - 1 + reports.length) % reports.length
                    ] && (
                      <img
                        src={
                          reports[
                            (currentSlide - 1 + reports.length) % reports.length
                          ].fotoUrl
                        }
                        alt="Previous"
                        className="w-full h-full object-cover blur-sm opacity-60 scale-110"
                      />
                    )}
                  </div>
                  <div className="absolute right-0 top-0 bottom-0 w-32 md:w-40 z-10 overflow-hidden rounded-r-[2.5rem]">
                    {reports[(currentSlide + 1) % reports.length] && (
                      <img
                        src={
                          reports[(currentSlide + 1) % reports.length].fotoUrl
                        }
                        alt="Next"
                        className="w-full h-full object-cover blur-sm opacity-60 scale-110"
                      />
                    )}
                  </div>

                  {/* Main Carousel */}
                  <div className="relative mx-16 md:mx-20">
                    <div
                      className="flex transition-transform duration-700 ease-out"
                      style={{
                        transform: `translateX(-${currentSlide * 100}%)`,
                      }}>
                      {carousel.map((report) => (
                        <div key={report.id} className="min-w-full">
                          <div className="relative aspect-video bg-gray-200">
                            <img
                              src={report.fotoUrl}
                              alt={`Laporan ${report.id}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Navigation Buttons */}
                  {carousel.length > 1 && (
                    <>
                      <button
                        onClick={prevSlide}
                        className="absolute left-20 md:left-24 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white text-gray-800 p-2.5 md:p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-20">
                        <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
                      </button>
                      <button
                        onClick={nextSlide}
                        className="absolute right-20 md:right-24 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white text-gray-800 p-2.5 md:p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-20">
                        <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
                      </button>
                    </>
                  )}
                </div>

                {/* Dots Indicator */}
                {carousel.length > 1 && (
                  <div className="flex justify-center mt-6 space-x-2.5">
                    {carousel.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`h-2.5 rounded-full transition-all duration-300 ${
                          index === currentSlide
                            ? "w-8 bg-blue-400"
                            : "w-2.5 bg-gray-400 hover:bg-gray-500"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
          
          <RealtimeMap />
        </div>
      </div>
    </div>
  );
}