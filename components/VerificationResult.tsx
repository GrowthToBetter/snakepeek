'use client';

import { CheckCircle, AlertTriangle, Users, MapPin, Clock } from 'lucide-react';
import { VerificationResult as VerificationResultType } from '@/lib/types';

interface VerificationResultProps {
  result: VerificationResultType;
  onRetry?: () => void;
  onNewReport?: () => void;
}

export default function VerificationResult({
  result,
  onRetry,
  onNewReport,
}: VerificationResultProps) {
  if (result.verified) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="h-8 w-8 text-success" />
          </div>
          <h3 className="text-xl font-semibold text-dark mb-2">
            Laporan Berhasil Terverifikasi!
          </h3>
          <p className="text-gray-600">
            {result.message}
          </p>
        </div>

        {result.isDuplicate && (
          <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Users className="h-5 w-5 text-warning mt-0.5" />
              <div>
                <h4 className="font-medium text-dark mb-1">
                  Laporan Duplikat Terdeteksi
                </h4>
                <p className="text-sm text-gray-600 mb-2">
                  Lokasi ini sudah dilaporkan sebelumnya. Laporan Anda telah ditambahkan 
                  sebagai konfirmasi tambahan.
                </p>
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-secondary" />
                  <span className="text-sm font-medium text-secondary">
                    Total: {result.reporters} pelapor
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="bg-gradient-to-r from-success/10 to-blue-50 rounded-lg p-6 border border-success/20">
          <h4 className="font-semibold text-dark mb-3 flex items-center space-x-2">
            <Clock className="h-5 w-5 text-success" />
            <span>Notifikasi Telah Dikirim</span>
          </h4>
          <div className="space-y-2 text-sm text-gray-700">
            <p>✓ BPBD (Badan Penanggulangan Bencana Daerah)</p>
            <p>✓ Dinas Pemadam Kebakaran</p>
            <p>✓ Badan SAR Nasional</p>
            <p>✓ Pemetaan Real-time Diperbarui</p>
          </div>
        </div>

        <div className="flex justify-center space-x-4">
          <button
            onClick={onNewReport}
            className="disaster-button-secondary"
          >
            Laporan Baru
          </button>
          <button
            onClick={() => window.location.href = '/'}
            className="disaster-button-primary"
          >
            Kembali ke Beranda
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="mx-auto w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mb-4">
          <AlertTriangle className="h-8 w-8 text-error" />
        </div>
        <h3 className="text-xl font-semibold text-dark mb-2">
          Verifikasi Gagal
        </h3>
        <p className="text-gray-600">
          {result.message}
        </p>
      </div>

      <div className="bg-error/10 border border-error/20 rounded-lg p-4">
        <h4 className="font-medium text-dark mb-2">Kemungkinan Masalah:</h4>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>• Lokasi tidak dapat diverifikasi dengan database BPBD</li>
          <li>• Informasi laporan kurang lengkap</li>
          <li>• Koordinat tidak sesuai dengan lokasi yang disebutkan</li>
        </ul>
      </div>

      <div className="flex justify-center space-x-4">
        <button
          onClick={onRetry}
          className="disaster-button-primary"
        >
          Perbaiki & Kirim Ulang
        </button>
        <button
          onClick={() => window.location.href = '/kontak-darurat'}
          className="disaster-button-secondary"
        >
          Hubungi Darurat
        </button>
      </div>
    </div>
  );
}