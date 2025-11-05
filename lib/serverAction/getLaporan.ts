"use server";

import { LaporanFormData } from "@/app/laporan/page";
import { prisma } from "@/lib/prisma";

export interface Report {
  id: string;
  lokasi: string;
  lat: number;
  lng: number;
  jenisBencana: string;
  deskripsi: string;
  urgency: number;
  reporters: number;
}

async function geocodeLocationAdvanced(lokasi: string) {
  try {
    const cleanLocation = lokasi.trim().toLowerCase();

    const searchQueries = [
      lokasi,
      `${lokasi}, Indonesia`,
      lokasi.replace(/\b(kab|kabupaten|kota|desa|kelurahan|kecamatan)\b/gi, ""),
      lokasi.split(",")[0].trim(),
    ];

    let bestResult = null;

    for (const query of searchQueries) {
      if (!query.trim()) continue;

      try {
        const url = `https://nominatim.openstreetmap.org/search?format=json&limit=5&q=${encodeURIComponent(
          query
        )}&countrycodes=id&addressdetails=1`;
        const res = await fetch(url, {
          headers: { "User-Agent": "snakepeek-disaster-app/1.0" },
        });

        if (res.ok) {
          const data = await res.json();
          if (data.length > 0) {
            bestResult = data[0];
            break;
          }
        }
      } catch (err) {
        console.warn(`Geocode query failed for: ${query}`, err);
      }

      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    if (bestResult) {
      return {
        found: true,
        confidence: "high",
        lat: parseFloat(bestResult.lat),
        lng: parseFloat(bestResult.lon),
        label: bestResult.display_name,
      };
    }
  } catch (err) {
    console.error("Advanced geocode error:", err);
  }

  return {
    found: false,
    confidence: "none",
    lat: -2.5,
    lng: 118,
    label: `${lokasi} (lokasi tidak ditemukan)`,
  };
}

// async function geocodeLocation(lokasi: string) {
//   try {
//     const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
//       lokasi
//     )}`;
//     const res = await fetch(url, {
//       headers: { "User-Agent": "sirana-app/1.0" }, // Nominatim wajib
//     });
//     const data = await res.json();

//     if (data.length > 0) {
//       return {
//         lat: parseFloat(data[0].lat),
//         lng: parseFloat(data[0].lon),
//       };
//     }
//   } catch (err) {
//     console.error("Geocode error:", err);
//   }
//   return { lat: 0, lng: 0 }; // fallback
// }

export async function getLaporan(): Promise<Report[]> {
  const reports = await prisma.emergency_reports.findMany({
    orderBy: { timestamp: "desc" },
    take: 50,
  });

  const result: Report[] = [];

  for (const r of reports) {
    if (!r.location) continue;

    const { lat, lng } = await geocodeLocationAdvanced(r.location);

    result.push({
      id: r.id,
      lokasi: r.location,
      lat,
      lng,
      jenisBencana: r.emergency_type ?? "Tidak diketahui",
      deskripsi: r.description ?? "",
      urgency: r.urgency_level ?? 0,
      reporters: 1,
    });
  }

  return result;
}






import { revalidatePath } from "next/cache";

/**
 * Generate nomor laporan unik dengan format: RPT-YYYYMMDD-XXXX
 */
async function generateReportNumber(): Promise<string> {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, "");
  
  // Hitung jumlah laporan hari ini
  const startOfDay = new Date(date.setHours(0, 0, 0, 0));
  const endOfDay = new Date(date.setHours(23, 59, 59, 999));
  
  const todayCount = await prisma.emergency_reports.count({
    where: {
      created_at: {
        gte: startOfDay,
        lte: endOfDay,
      },
    },
  });

  const sequence = String(todayCount + 1).padStart(4, "0");
  return `RPT-${dateStr}-${sequence}`;
}

/**
 * Tentukan tingkat urgensi berdasarkan jenis dan deskripsi
 * 1 = Rendah, 2 = Sedang, 3 = Tinggi
 */
function calculateUrgencyLevel(jenisBencana: string, deskripsi: string): number {
  const text = `${jenisBencana} ${deskripsi}`.toLowerCase();
  
  const highUrgencyKeywords = ["darurat", "menggigit", "berbisa", "cobra", "viper", "menyerang"];
  const highUrgencyTypes = ["kobra", "viper", "berbisa"];
  
  // Cek kata kunci darurat
  if (highUrgencyKeywords.some(keyword => text.includes(keyword))) {
    return 3;
  }
  
  // Cek jenis ular berbahaya
  if (highUrgencyTypes.some(type => text.includes(type))) {
    return 3;
  }
  
  // Default sedang
  return 2;
}

/**
 * Generate AI recommendations
 */
function generateAIRecommendations(urgencyLevel: number) {
  if (urgencyLevel === 3) {
    return {
      safety_tips: [
        "JANGAN mendekati ular",
        "Amankan area, jauhkan anak-anak dan hewan peliharaan",
        "Jika ada yang tergigit, segera hubungi 119"
      ],
      next_steps: [
        "Tim respons darurat akan segera dikirim",
        "Tetap di lokasi aman"
      ],
      emergency_contacts: [
        { name: "Damkar", number: "113" },
        { name: "Ambulans", number: "119" }
      ]
    };
  }
  
  return {
    safety_tips: [
      "Jaga jarak aman dari ular",
      "Hindari gerakan mendadak",
      "Amankan hewan peliharaan"
    ],
    next_steps: [
      "Tim akan melakukan survei lokasi",
      "Pantau ular dan laporkan jika bergerak"
    ],
    emergency_contacts: [
      { name: "Damkar", number: "113" }
    ]
  };
}

/**
 * Create emergency report
 */
export async function createReport(data: LaporanFormData) {
  try {
    const reportNumber = await generateReportNumber();
    const urgencyLevel = calculateUrgencyLevel(data.jenisBencana, data.deskripsi);
    const aiRecommendations = generateAIRecommendations(urgencyLevel);

    const report = await prisma.emergency_reports.create({
      data: {
        report_number: reportNumber,
        timestamp: new Date(),
        caller_info: data.sumber || "Web Form",
        location: data.lokasi,
        emergency_type: data.jenisBencana,
        urgency_level: urgencyLevel,
        description: data.deskripsi,
        fotoUrl: data.fotoUrl,
        ai_recommendations: aiRecommendations,
        status: "BARU",
        response_sent: false,
        created_at: new Date(),
        updated_at: new Date(),
      },
    });

    revalidatePath("/");
    revalidatePath("/laporan");

    return {
      success: true,
      reportId: report.id,
      reportNumber: report.report_number,
    };
  } catch (error) {
    console.error("Error creating report:", error);
    return {
      success: false,
      error: "Gagal membuat laporan. Silakan coba lagi.",
    };
  }
}