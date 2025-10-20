import Link from 'next/link';
import { Shield, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-dark text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="p-2 bg-secondary rounded-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold">SiRANA</span>
                <p className="text-sm text-gray-300">Siaga - Insan - Rana</p>
              </div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Platform terintegrasi untuk otomatisasi regulasi dan edukasi Kedaruratan 
              menggunakan teknologi Natural Language Processing (NLP) yang membantu 
              masyarakat dalam pelaporan dan pemahaman prosedur Kedaruratan.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Menu Utama</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white transition-colors duration-200">
                  Beranda
                </Link>
              </li>
              <li>
                <Link href="/laporan" className="text-gray-300 hover:text-white transition-colors duration-200">
                  Laporan Darurat
                </Link>
              </li>
              <li>
                <Link href="/edukasi" className="text-gray-300 hover:text-white transition-colors duration-200">
                  Edukasi Kedaruratan
                </Link>
              </li>
              <li>
                <Link href="/regulasi" className="text-gray-300 hover:text-white transition-colors duration-200">
                  Regulasi
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Kontak</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-gray-300">
                <Phone className="h-4 w-4" />
                <span className="text-sm">119 (Darurat)</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-300">
                <Mail className="h-4 w-4" />
                <span className="text-sm">info@sirana.go.id</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-300">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">Jakarta, Indonesia</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 SiRANA. Dikembangkan untuk keselamatan masyarakat Indonesia.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="#" className="text-gray-400 hover:text-white text-sm transition-colors duration-200">
                Kebijakan Privasi
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white text-sm transition-colors duration-200">
                Syarat & Ketentuan
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}