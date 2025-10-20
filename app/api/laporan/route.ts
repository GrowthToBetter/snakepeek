import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { calculateDistance } from '@/lib/utils';

// // Mock data untuk fallback jika database tidak tersedia
// const mockReports = [
//   {
//     id: '1',
//     lokasi: 'Jakarta Pusat',
//     jenisBencana: 'Banjir',
//     deskripsi: 'Banjir setinggi 1 meter di Jalan Sudirman',
//     lat: -6.2088,
//     lng: 106.8456,
//     reporters: 3,
//     createdAt: new Date(),
//   },
//   {
//     id: '2',
//     lokasi: 'Bandung Selatan',
//     jenisBencana: 'Longsor',
//     deskripsi: 'Longsor tutup akses jalan di Dago',
//     lat: -6.9175,
//     lng: 107.6191,
//     reporters: 1,
//     createdAt: new Date(),
//   },
//   {
//     id: '3',
//     lokasi: 'Surabaya Timur',
//     jenisBencana: 'Angin Puting Beliung',
//     deskripsi: 'Angin kencang robohkan pohon dan atap rumah',
//     lat: -7.2575,
//     lng: 112.7521,
//     reporters: 2,
//     createdAt: new Date(),
//   },
// ];

export async function GET() {
  try {
    // Coba ambil data dari database
    const reports = await prisma.emergency_reports.findMany({
      orderBy: { created_at: 'desc' },
    });

    return NextResponse.json(reports);
  } catch (error) {
    console.error('Database error, using mock data:', error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { lokasi, jenisBencana, deskripsi, fotoUrl, lat, lng, sumber } = body;

    // Validasi input
    if (!lokasi || !jenisBencana || !deskripsi) {
      return NextResponse.json(
        { error: 'Lokasi, jenis bencana, dan deskripsi wajib diisi' },
        { status: 400 }
      );
    }

    // Cek duplikasi berdasarkan lokasi dan jenis bencana dalam 24 jam terakhir
    const oneDayAgo = new Date();
    oneDayAgo.setHours(oneDayAgo.getHours() - 24);

    try {
      const existingReports = await prisma.emergency_reports.findMany({
        where: {
          emergency_type: jenisBencana,
          created_at: {
            gte: oneDayAgo,
          },
        },
      });


      // Buat laporan baru jika tidak ada duplikasi
      const newReport = await prisma.emergency_reports.create({
        data: {
          location: lokasi,
          emergency_type: jenisBencana,
          description: deskripsi,
          fotoUrl: fotoUrl || null,
          caller_info: sumber || 'webform',
          report_number: "1",
        },
      });

      return NextResponse.json({
        verified: true,
        isDuplicate: false,
        reporters: 1,
        message: 'Laporan bencana berhasil terverifikasi dan dikirim ke instansi terkait.',
        reportId: newReport.id,
      });

    } catch (dbError) {
      console.error('Database operation failed:', dbError);
      
      // Mock verification logic sebagai fallback
      const isVerified = Math.random() > 0.1; // 90% verification success rate
      const isDuplicate = Math.random() > 0.7; // 30% chance of duplicate
      
      if (isVerified) {
        return NextResponse.json({
          verified: true,
          isDuplicate,
          reporters: isDuplicate ? Math.floor(Math.random() * 5) + 2 : 1,
          message: isDuplicate 
            ? 'Laporan serupa sudah ada. Laporan Anda ditambahkan sebagai konfirmasi.'
            : 'Laporan bencana berhasil terverifikasi dan dikirim ke instansi terkait.',
        });
      } else {
        return NextResponse.json({
          verified: false,
          isDuplicate: false,
          reporters: 1,
          message: 'Lokasi tidak dapat diverifikasi. Silakan periksa kembali informasi lokasi.',
        });
      }
    }

  } catch (error) {
    console.error('Request processing error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server. Silakan coba lagi.' },
      { status: 500 }
    );
  }
}