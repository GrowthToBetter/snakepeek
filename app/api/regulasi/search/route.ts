import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Mock data untuk fallback
const mockRegulations = [
  {
    id: '1',
    title: 'UU No. 24 Tahun 2007 tentang Penanggulangan Bencana',
    category: 'Undang-Undang',
    excerpt: 'Undang-undang yang mengatur tentang penyelenggaraan penanggulangan bencana yang bertujuan untuk memberikan perlindungan kepada masyarakat dari ancaman bencana.',
    url: 'https://example.com/uu-24-2007',
    content: `Undang-Undang Nomor 24 Tahun 2007 tentang Penanggulangan Bencana merupakan landasan hukum utama dalam penyelenggaraan penanggulangan bencana di Indonesia. 

UU ini mengatur:
1. Penyelenggaraan penanggulangan bencana dalam situasi tidak terjadi bencana
2. Penyelenggaraan penanggulangan bencana dalam situasi terdapat potensi terjadi bencana  
3. Penyelenggaraan penanggulangan bencana dalam situasi tanggap darurat bencana
4. Penyelenggaraan penanggulangan bencana dalam situasi pasca bencana

Tujuan penyelenggaraan penanggulangan bencana:
- Memberikan perlindungan kepada masyarakat dari ancaman bencana
- Menyelaraskan peraturan perundang-undangan yang sudah ada
- Menjamin terselenggaranya penanggulangan bencana secara terencana, terpadu, terkoordinasi, dan menyeluruh`,
    createdAt: new Date('2007-04-26'),
  },
  {
    id: '2',
    title: 'SOP Evakuasi Tsunami Pantai Selatan Jawa',
    category: 'SOP',
    excerpt: 'Prosedur standar evakuasi masyarakat pesisir pantai selatan Jawa saat peringatan tsunami dikeluarkan oleh BMKG.',
    url: 'https://example.com/sop-tsunami',
    content: `Standard Operating Procedure Evakuasi Tsunami untuk wilayah pantai selatan Pulau Jawa.

TAHAP PERSIAPAN:
1. Identifikasi jalur evakuasi terdekat ke tempat tinggi minimal 30 meter dari permukaan laut
2. Siapkan tas siaga bencana berisi dokumen penting, makanan, air, obat-obatan
3. Kenali titik kumpul evakuasi dan shelter sementara yang telah ditetapkan

TAHAP PERINGATAN:
1. Dengar sirene peringatan tsunami atau pengumuman dari aparat
2. SEGERA tinggalkan pantai dan bergerak ke tempat tinggi
3. Gunakan kendaraan hanya jika tidak macet, jika tidak - berjalan kaki
4. Jangan kembali ke pesisir sampai ada pengumuman all-clear resmi

TITIK KUMPUL:
- Gunakan bangunan tinggi (lantai 3 ke atas) jika tersedia
- Bukit atau dataran tinggi minimal 30m dpl
- Hindari jembatan, muara sungai, dan lembah`,
    createdAt: new Date('2023-08-15'),
  },
  {
    id: '3',
    title: 'Prosedur Pelaporan Bencana Via Digital',
    category: 'Prosedur Laporan',
    excerpt: 'Panduan lengkap pelaporan kejadian bencana melalui platform digital dan media sosial resmi.',
    url: 'https://example.com/prosedur-digital',
    content: `Prosedur Pelaporan Bencana melalui Platform Digital dan Media Sosial.

INFORMASI WAJIB DALAM LAPORAN:
1. Lokasi kejadian yang spesifik (alamat lengkap atau koordinat GPS)
2. Jenis bencana yang terjadi
3. Waktu kejadian (tanggal dan jam)
4. Deskripsi kondisi terkini
5. Perkiraan jumlah korban dan kerusakan
6. Foto/video dokumentasi (jika memungkinkan dan aman)

CHANNEL PELAPORAN RESMI:
- Website: lapor.bnpb.go.id
- WhatsApp: 0811-9119-119  
- Twitter: @InfoBNPB dengan hashtag #LaporBencana
- Mobile App: InaRISK untuk masyarakat umum

FORMAT PELAPORAN:
[JENIS BENCANA] [LOKASI] [WAKTU]
Deskripsi: [detail kondisi]
Korban: [jumlah dan kondisi]
Akses: [kondisi jalan/transportasi]
Kontak: [nomor yang bisa dihubungi]`,
    createdAt: new Date('2023-12-01'),
  },
  {
    id: '4',
    title: 'SOP Tanggap Darurat Gempa Bumi',
    category: 'SOP',
    excerpt: 'Prosedur standar operasional untuk respons cepat saat terjadi gempa bumi dengan magnitude di atas 5.0 SR.',
    url: 'https://example.com/sop-gempa',
    content: `Standard Operating Procedure Tanggap Darurat Gempa Bumi.

FASE IMMEDIATE RESPONSE (0-3 jam):
1. Aktivasi tim tanggap darurat
2. Assessment kerusakan dan korban secara cepat
3. Koordinasi dengan PMI untuk medical response
4. Buka jalur komunikasi darurat
5. Atur titik pengumpulan korban dan pengungsian

FASE SHORT TERM (3-72 jam):  
1. Search and Rescue (SAR) untuk korban tertimbun
2. Setup posko darurat dan distribusi bantuan
3. Penilaian kerusakan infrastruktur kritis
4. Koordinasi dengan TNI/Polri untuk keamanan
5. Assessment kebutuhan logistik dan medis

FASE LONG TERM (>72 jam):
1. Rehabilitasi infrastruktur vital
2. Penyediaan hunian sementara
3. Dukungan psikososial untuk korban
4. Pemulihan ekonomi dan mata pencaharian`,
    createdAt: new Date('2023-10-20'),
  },
  {
    id: '5',
    title: 'Peraturan BPBD No. 15/2023 Mitigasi Banjir',
    category: 'Undang-Undang',
    excerpt: 'Peraturan daerah tentang mitigasi struktural dan non-struktural untuk pengurangan risiko bencana banjir.',
    url: 'https://example.com/perda-banjir',
    content: `Peraturan BPBD No. 15 Tahun 2023 tentang Mitigasi Bencana Banjir.

MITIGASI STRUKTURAL:
1. Pembangunan tanggul, bendungan, dan waduk penampung air
2. Normalisasi dan pengerukan sungai serta saluran drainase
3. Pembangunan rumah panggung di daerah rawan banjir
4. Sistem peringatan dini berbasis sensor dan teknologi

MITIGASI NON-STRUKTURAL:  
1. Tata ruang dan zonasi daerah rawan banjir
2. Sistem peringatan dini berbasis komunitas
3. Edukasi dan pelatihan masyarakat
4. Asuransi bencana dan skema perlindungan sosial

PERAN MASYARAKAT:
- Menjaga kebersihan saluran air dan tidak membuang sampah sembarangan
- Melaporkan kondisi infrastruktur yang rusak
- Mengikuti pelatihan dan simulasi penanggulangan banjir
- Menyiapkan rencana evakuasi keluarga`,
    createdAt: new Date('2023-11-10'),
  },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query') || '';
  const category = searchParams.get('category') || '';

  try {
    let results;
    
    if (!query.trim()) {
      // Jika tidak ada query, return semua dokumen
      results = await prisma.regulation_docs.findMany({
        where: category ? { category } : {},
        orderBy: { created_at: 'desc' },
        take: 20,
      });
    } else {
      // Pencarian berdasarkan query
      const whereClause: any = {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { excerpt: { contains: query, mode: 'insensitive' } },
          { content: { contains: query, mode: 'insensitive' } },
        ],
      };

      if (category) {
        whereClause.category = category;
      }

      results = await prisma.regulation_docs.findMany({
        where: whereClause,
        orderBy: { created_at: 'desc' },
        take: 20,
      });
    }

    return NextResponse.json(results);
  } catch (error) {
    console.error('Database search error, using mock data:', error);
    
    // Fallback ke mock data dengan filtering
    let filteredResults = mockRegulations;
    
    if (category) {
      filteredResults = filteredResults.filter(doc => doc.category === category);
    }
    
    if (query.trim()) {
      const lowerQuery = query.toLowerCase();
      filteredResults = filteredResults.filter(doc =>
        doc.title.toLowerCase().includes(lowerQuery) ||
        doc.excerpt?.toLowerCase().includes(lowerQuery) ||
        doc.content?.toLowerCase().includes(lowerQuery)
      );
    }

    return NextResponse.json(filteredResults);
  }
}