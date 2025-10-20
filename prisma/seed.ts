import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();

// Fungsi untuk generate report_number unik
function generateReportNumber(): string {
  const date = new Date().toISOString().replace(/[-:T.]/g, "").slice(0, 14);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, "0");
  return `RPT-${date}-${random}`;
}

// Function to read JSON data
function readJsonData() {
  try {
    const jsonPath = path.join(__dirname, 'backup-data.json'); // Adjust path as needed
    const jsonData = fs.readFileSync(jsonPath, 'utf8');
    return JSON.parse(jsonData);
  } catch (error) {
    console.log("⚠️ Could not read JSON file, continuing with default data only");
    return null;
  }
}

async function main() {
  console.log("🌱 Mulai seeding database...");

  // Read JSON backup data
  const backupData = readJsonData();

  // ==============================
  // Seed RegulationDocs
  // ==============================
  const regulations = [
    {
      title: "UU No. 24 Tahun 2007 tentang Penanggulangan Bencana",
      category: "Undang-Undang",
      excerpt:
        "Undang-undang yang mengatur tentang penyelenggaraan penanggulangan bencana yang bertujuan untuk memberikan perlindungan kepada masyarakat dari ancaman bencana.",
      url: "https://jdih.setkab.go.id/PUUdoc/7308/UU0242007.htm",
      content:
        "UU ini mengatur penyelenggaraan penanggulangan bencana dalam berbagai situasi, termasuk pencegahan, mitigasi, kesiapsiagaan, tanggap darurat, dan pemulihan.",
    },
    {
      title: "SOP Evakuasi Tsunami Pantai Selatan Jawa",
      category: "SOP",
      excerpt:
        "Prosedur standar evakuasi masyarakat pesisir pantai selatan Jawa saat peringatan tsunami dikeluarkan oleh BMKG.",
      url: "https://bnpb.go.id/sop/tsunami-jawa-selatan",
      content:
        "SOP ini mencakup tahap persiapan, tahap peringatan, dan tahap evakuasi dengan detail jalur evakuasi dan titik kumpul yang aman.",
    },
    {
      title: "Prosedur Pelaporan Bencana Via Digital",
      category: "Prosedur Laporan",
      excerpt:
        "Panduan lengkap pelaporan kejadian bencana melalui platform digital dan media sosial resmi.",
      url: "https://bnpb.go.id/prosedur/pelaporan-digital",
      content:
        "Prosedur ini mengatur format, channel, dan informasi wajib yang harus disertakan dalam setiap laporan bencana melalui platform digital.",
    },
  ];

  for (const regulation of regulations) {
    await prisma.regulation_docs.upsert({
      where: { title: regulation.title }, // title dijadikan unique
      update: {},
      create: {
        title: regulation.title,
        category: regulation.category,
        excerpt: regulation.excerpt,
        url: regulation.url,
        content: regulation.content,
      },
    });
  }

  console.log("✅ RegulationDocs selesai di-seed!");

  // ==============================
  // Seed emergency_reports (Default data + JSON import)
  // ==============================
  const defaultReports = [
    {
      caller_info: "Anonim",
      caller_phone: "08123456789",
      location: "Jakarta Pusat, DKI Jakarta",
      emergency_type: "Banjir",
      urgency_level: 3,
      description:
        "Banjir setinggi 1 meter di kawasan Jalan Sudirman akibat hujan deras. Beberapa ruas jalan tidak dapat dilalui kendaraan.",
      structured_data: { area: "Jalan Sudirman", water_level_m: 1 },
      ai_recommendations: { action: "Evakuasi", priority: "Tinggi" },
    },
    {
      caller_info: "Anonim",
      caller_phone: "08234567890",
      location: "Bandung Selatan, Jawa Barat",
      emergency_type: "Longsor",
      urgency_level: 2,
      description:
        "Tanah longsor menutup akses jalan di daerah Dago. Tidak ada korban jiwa, namun 2 rumah rusak.",
      structured_data: { affected_houses: 2 },
      ai_recommendations: { action: "Pantau", priority: "Sedang" },
    },
    {
      caller_info: "Anonim",
      caller_phone: "08345678901",
      location: "Surabaya Timur, Jawa Timur",
      emergency_type: "Angin Puting Beliung",
      urgency_level: 2,
      description:
        "Angin kencang merobohkan pohon dan merusak atap beberapa rumah. Tim BPBD sudah tiba di lokasi.",
      structured_data: { affected_houses: 3, damaged_trees: 5 },
      ai_recommendations: { action: "Pantau", priority: "Sedang" },
    },
  ];

  // Seed default reports
  for (const report of defaultReports) {
    await prisma.emergency_reports.create({
      data: {
        report_number: generateReportNumber(),
        caller_info: report.caller_info,
        caller_phone: report.caller_phone,
        location: report.location,
        emergency_type: report.emergency_type,
        urgency_level: report.urgency_level,
        description: report.description,
        structured_data: report.structured_data,
        ai_recommendations: report.ai_recommendations,
      },
    });
  }

  // Import reports from JSON if available
  if (backupData && backupData.reports) {
    console.log(`📥 Mengimport ${backupData.reports.length} laporan dari JSON...`);
    
    for (const jsonReport of backupData.reports) {
      try {
        await prisma.emergency_reports.upsert({
          where: { report_number: jsonReport.report_number },
          update: {
            caller_info: jsonReport.caller_info,
            caller_phone: jsonReport.caller_phone,
            location: jsonReport.location,
            emergency_type: jsonReport.emergency_type,
            urgency_level: jsonReport.urgency_level,
            description: jsonReport.description,
            structured_data: jsonReport.structured_data,
            ai_recommendations: jsonReport.ai_recommendations,
            status: jsonReport.status || "BARU",
            voice_file_path: jsonReport.voice_file_path,
            response_sent: jsonReport.response_sent,
            timestamp: new Date(jsonReport.timestamp),
            created_at: new Date(jsonReport.created_at),
            updated_at: new Date(jsonReport.updated_at),
          },
          create: {
            id: jsonReport.id,
            report_number: jsonReport.report_number,
            caller_info: jsonReport.caller_info,
            caller_phone: jsonReport.caller_phone,
            location: jsonReport.location,
            emergency_type: jsonReport.emergency_type,
            urgency_level: jsonReport.urgency_level,
            description: jsonReport.description,
            structured_data: jsonReport.structured_data,
            ai_recommendations: jsonReport.ai_recommendations,
            status: jsonReport.status || "BARU",
            voice_file_path: jsonReport.voice_file_path,
            response_sent: jsonReport.response_sent,
            timestamp: new Date(jsonReport.timestamp),
            created_at: new Date(jsonReport.created_at),
            updated_at: new Date(jsonReport.updated_at),
          },
        });
      } catch (error) {
        console.log(`⚠️ Gagal mengimport laporan ${jsonReport.report_number}:`, (error as Error).message);
      }
    }
    
    console.log("✅ Import laporan dari JSON selesai!");
  }

  // ==============================
  // Import WhatsApp Conversations if available
  // ==============================
  if (backupData && backupData.whatsappConversations) {
    console.log(`📥 Mengimport ${backupData.whatsappConversations.length} percakapan WhatsApp dari JSON...`);
    
    for (const conversation of backupData.whatsappConversations) {
      try {
        // Check if conversation already exists by id
        const existingConversation = await prisma.whatsapp_conversations.findUnique({
          where: { id: conversation.id }
        });

        if (!existingConversation) {
          // Create new conversation if doesn't exist
          await prisma.whatsapp_conversations.create({
            data: {
              id: conversation.id,
              phone_number: conversation.phone_number,
              message_sid: conversation.message_sid,
              message_body: conversation.message_body,
              message_type: conversation.message_type,
              media_url: conversation.media_url,
              timestamp: new Date(conversation.timestamp),
              report_id: conversation.report_id,
            },
          });
        } else {
          console.log(`⏭️ Percakapan ${conversation.id} sudah ada, dilewati`);
        }
      } catch (error) {
        console.log(`⚠️ Gagal mengimport percakapan ${conversation.id}:`, (error as Error).message);
      }
    }
    
    console.log("✅ Import percakapan WhatsApp dari JSON selesai!");
  }

  console.log("✅ emergency_reports selesai di-seed!");
  
  if (backupData) {
    console.log(`📊 Total data yang diimport:`);
    console.log(`   - ${backupData.reports?.length || 0} laporan darurat`);
    console.log(`   - ${backupData.whatsappConversations?.length || 0} percakapan WhatsApp`);
    console.log(`   - Backup dibuat pada: ${backupData.backup_at}`);
  }
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });