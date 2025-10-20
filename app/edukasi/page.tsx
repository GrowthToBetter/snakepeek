'use client';

import { useState } from 'react';
import EduChatbot from '@/components/EduChatbot';
import { Book, Video, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface EducationSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  content: {
    title: string;
    description: string;
    details: string[];
  }[];
}

const educationSections: EducationSection[] = [
  {
    id: 'mitigasi',
    title: 'Materi Mitigasi Kedaruratan',
    icon: <Book className="h-5 w-5" />,
    content: [
      {
        title: 'Persiapan Menghadapi Gempa Bumi',
        description: 'Langkah-langkah preventif sebelum, saat, dan setelah gempa bumi',
        details: [
          'Persiapkan tas siaga kedaruratan dengan makanan, air, obat-obatan, dan dokumen penting',
          'Kenali jalur evakuasi terdekat dari rumah, kantor, dan sekolah',
          'Latihan rutin drop, cover, dan hold on dengan keluarga',
          'Pastikan struktur bangunan rumah tahan gempa dan perbaiki yang retak',
        ],
      },
      {
        title: 'Mitigasi Banjir',
        description: 'Tindakan pencegahan dan persiapan menghadapi kedaruratan banjir',
        details: [
          'Bersihkan saluran air dan drainase secara berkala',
          'Siapkan pompa air dan peralatan untuk mengalirkan air',
          'Pindahkan barang berharga ke tempat yang lebih tinggi',
          'Kenali daerah rawan banjir dan jalur evakuasi',
        ],
      },
    ],
  },
  {
    id: 'faq',
    title: 'Frequently Asked Questions',
    icon: <HelpCircle className="h-5 w-5" />,
    content: [
      {
        title: 'Apa yang harus dilakukan saat gempa?',
        description: 'Prosedur standar saat terjadi gempa bumi',
        details: [
          'Jika di dalam ruangan: DROP (jatuhkan diri), COVER (lindungi kepala), HOLD ON (pegangan)',
          'Jangan berlari ke luar saat gempa masih berlangsung',
          'Hindari benda yang dapat jatuh seperti lemari, kaca, atau lampu gantung',
          'Jika di luar ruangan: menjauh dari bangunan, pohon, dan tiang listrik',
        ],
      },
      {
        title: 'Bagaimana cara melaporkan kedaruratan?',
        description: 'Panduan lengkap pelaporan kejadian kedaruratan',
        details: [
          'Gunakan form pelaporan di website ini untuk laporan terstruktur',
          'Sertakan lokasi yang jelas dan koordinat jika memungkinkan',
          'Deskripsikan kondisi dengan detail: korban, kerusakan, akses jalan',
          'Upload foto atau video jika aman untuk dokumentasi',
        ],
      },
    ],
  },
  {
    id: 'simulasi',
    title: 'Video Simulasi Kedaruratan',
    icon: <Video className="h-5 w-5" />,
    content: [
      {
        title: 'Simulasi Evakuasi Tsunami',
        description: 'Video panduan evakuasi saat peringatan tsunami',
        details: [
          'Pengenalan tanda-tanda alam tsunami (air laut surut mendadak)',
          'Rute evakuasi ke tempat tinggi terdekat dalam 5-10 menit',
          'Prosedur berkumpul di titik evakuasi dan menunggu all-clear',
          'Komunikasi darurat dan koordinasi dengan petugas',
        ],
      },
      {
        title: 'Simulasi Tanggap Darurat Kebakaran',
        description: 'Prosedur pemadaman dan evakuasi saat kebakaran',
        details: [
          'Identifikasi sumber api dan jenis kebakaran (listrik, gas, atau bahan kimia)',
          'Gunakan APAR dengan teknik PASS (Pull, Aim, Squeeze, Sweep)',
          'Evakuasi dengan posisi merangkak jika asap tebal',
          'Titik kumpul aman dan prosedur memanggil damkar',
        ],
      },
    ],
  },
];

export default function EdukasiPage() {
  const [detectedLocations, setDetectedLocations] = useState<Array<{
    location: string;
    lat: number;
    lng: number;
  }>>([]);

  const handleLocationDetected = (location: string, lat: number, lng: number) => {
    setDetectedLocations(prev => [...prev, { location, lat, lng }]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-dark mb-4">
            Edukasi Kedaruratan
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Pelajari mitigasi kedaruratan, prosedur darurat, dan dapatkan panduan 
            dari asisten AI yang selalu siap membantu Anda 24/7
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Education Content */}
          <div className="space-y-8">
            {educationSections.map((section) => (
              <div key={section.id} className="disaster-card">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-secondary/10 rounded-lg">
                    {section.icon}
                  </div>
                  <h2 className="text-xl font-bold text-dark">{section.title}</h2>
                </div>
                
                <Accordion type="multiple" className="space-y-4">
                  {section.content.map((item, index) => (
                    <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg">
                      <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-gray-50">
                        <div className="text-left">
                          <h3 className="font-semibold text-dark">{item.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pb-4">
                        <ul className="space-y-2">
                          {item.details.map((detail, detailIndex) => (
                            <li key={detailIndex} className="text-sm text-gray-700 flex items-start">
                              <span className="text-secondary mr-2">•</span>
                              <span>{detail}</span>
                            </li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>

          {/* Chatbot */}
          <div className="lg:sticky lg:top-8">
            <div className="mb-4">
              <h2 className="text-xl font-bold text-dark mb-2">
                Asisten AI Kedaruratan
              </h2>
              <p className="text-gray-600 text-sm">
                Tanyakan apa saja tentang mitigasi dan tanggap darurat daruraratan
              </p>
            </div>
            
            <EduChatbot onLocationDetected={handleLocationDetected} />
            
            {detectedLocations.length > 0 && (
              <div className="mt-4 p-4 bg-success/10 border border-success/20 rounded-lg">
                <h4 className="text-sm font-semibold text-dark mb-2">
                  Lokasi Terdeteksi dari Chat:
                </h4>
                <div className="space-y-1">
                  {detectedLocations.map((loc, index) => (
                    <p key={index} className="text-xs text-success">
                      📍 {loc.location}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}