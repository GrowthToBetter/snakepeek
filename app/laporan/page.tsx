"use client";

import DisasterForm from "@/components/DisasterForm";
import NLPExtractionSteps from "@/components/NLPExtractionSteps";
import { Button } from "@/components/ui/button";
import VerificationResult from "@/components/VerificationResult";
import { createReport } from "@/lib/serverAction/getLaporan";
import { VerificationResult as VerificationResultType } from "@/lib/types";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

type ProcessStage = "form" | "processing" | "verification";

export type LaporanFormData = {
  lokasi: string;
  jenisBencana: string;
  deskripsi: string;
  fotoUrl?: string;
  sumber?: string; // bisa otomatis diisi nanti
  lat?: number;
  lng?: number;
};

export default function LaporanPage() {
  const [stage, setStage] = useState<ProcessStage>("form");
  const [verificationResult, setVerificationResult] =
    useState<VerificationResultType | null>(null);
  const [isNLPProcessing, setIsNLPProcessing] = useState(false);

  const handleFormSubmit = async (data: LaporanFormData) => {
    setStage("processing");
    setIsNLPProcessing(true);
    try {
      await createReport(data);
    } catch (error) {
      throw new Error((error as Error).message);  
    }
  };

  const handleNLPProcessingComplete = () => {
    setStage("verification");
    setIsNLPProcessing(false);
  };

  const handleRetry = () => {
    setStage("form");
    setVerificationResult(null);
  };

  const handleNewReport = () => {
    setStage("form");
    setVerificationResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-dark mb-4">
            Pelaporan Darurat Cerdas
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Sistem otomatis dengan teknologi NLP untuk memproses laporan darurat
            dan mengirim notifikasi ke instansi terkait
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-12">
          <div className="flex items-center justify-center space-x-4 mb-4">
            {["Form", "Analisis NLP", "Verifikasi"].map((step, index) => {
              const isActive =
                (stage === "form" && index === 0) ||
                (stage === "processing" && index === 1) ||
                (stage === "verification" && index === 2);
              const isCompleted =
                (stage === "processing" && index === 0) ||
                (stage === "verification" && index <= 1);

              return (
                <div key={step} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors duration-200 ${
                      isCompleted
                        ? "bg-success text-white"
                        : isActive
                        ? "bg-secondary text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}>
                    {index + 1}
                  </div>
                  <span
                    className={`ml-2 text-sm font-medium ${
                      isActive ? "text-secondary" : "text-gray-600"
                    }`}>
                    {step}
                  </span>
                  {index < 2 && (
                    <div
                      className={`ml-4 w-8 h-px ${
                        isCompleted ? "bg-success" : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Content based on stage */}
        <div className="space-y-8">
          {stage === "form" && <DisasterForm onSubmit={handleFormSubmit} />}

          {stage === "processing" && (
            <div className="disaster-card">
              <NLPExtractionSteps
                isProcessing={isNLPProcessing}
                onComplete={handleNLPProcessingComplete}
              />
            </div>
          )}

          {stage === "verification" && verificationResult && (
            <div className="disaster-card">
              <VerificationResult
                result={verificationResult}
                onRetry={handleRetry}
                onNewReport={handleNewReport}
              />
            </div>
          )}
        </div>

        {/* Emergency Contact CTA */}
        <div className="mt-16 text-center">
          <div className="bg-error/10 border border-error/20 rounded-lg p-6 max-w-md mx-auto">
            <h3 className="font-semibold text-dark mb-2 flex items-center justify-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-error" />
              <span>Situasi Darurat?</span>
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Untuk keadaan darurat yang memerlukan bantuan segera
            </p>
            <Link href="/kontak-darurat">
              <Button className="bg-error hover:bg-error/90 text-white">
                Hubungi 119
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
