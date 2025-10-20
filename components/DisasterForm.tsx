'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { MapPin, Upload, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

const reportSchema = z.object({
  lokasi: z.string().min(3, 'Lokasi minimal 3 karakter'),
  jenisBencana: z.string().min(1, 'Pilih jenis keadaan darurat'),
  deskripsi: z.string().min(10, 'Deskripsi minimal 10 karakter'),
  fotoUrl: z.string().url().optional().or(z.literal('')),
  lat: z.number().optional(),
  lng: z.number().optional(),
  sumber: z.string().optional(),
});

type ReportForm = z.infer<typeof reportSchema>;

interface DisasterFormProps {
  onSubmit: (data: ReportForm) => void;
  isLoading?: boolean;
}

export default function DisasterForm({ onSubmit, isLoading }: DisasterFormProps) {
  const [showCoordinates, setShowCoordinates] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    watch,
    reset,
  } = useForm<ReportForm>({
    resolver: zodResolver(reportSchema),
    mode: 'onChange',
  });


  const handleLocationPick = () => {
    // Mock location picker - in real app, this would open a map modal
    const mockLat = -6.2 + (Math.random() - 0.5) * 0.1;
    const mockLng = 106.8 + (Math.random() - 0.5) * 0.1;
    
    setValue('lat', mockLat);
    setValue('lng', mockLng);
    setShowCoordinates(true);
  };

  const onFormSubmit = (data: ReportForm) => {
    onSubmit({
      ...data,
      sumber: 'webform',
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="disaster-card">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-dark mb-2">
            Formulir Laporan Darurat
          </h2>
          <p className="text-gray-600">
            Laporkan kejadian darurat untuk mendapatkan bantuan segera
          </p>
        </div>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
          {/* Location Input */}
          <div className="space-y-2">
            <Label htmlFor="lokasi" className="text-sm font-medium text-dark">
              Lokasi Kejadian *
            </Label>
            <div className="flex space-x-2">
              <Input
                id="lokasi"
                placeholder="Contoh: Jalan Sudirman, Jakarta Pusat"
                {...register('lokasi')}
                className="flex-grow"
                aria-describedby="lokasi-error"
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleLocationPick}
                className="px-4"
                title="Pilih dari peta"
              >
                <MapPin className="h-4 w-4" />
              </Button>
            </div>
            {errors.lokasi && (
              <p id="lokasi-error" className="text-xs text-error">{errors.lokasi.message}</p>
            )}
            
            {showCoordinates && (
              <div className="flex space-x-4 text-xs text-gray-600">
                <span>Lat: {watch('lat')?.toFixed(6)}</span>
                <span>Lng: {watch('lng')?.toFixed(6)}</span>
              </div>
            )}
          </div>

          {/* Disaster Type */}
          <div className="space-y-2">
            <Label htmlFor="jenisBencana" className="text-sm font-medium text-dark">
              Jenis Keadaan Darurat *
            </Label>
            <Input
                id="jenisBencana"
                type="text"
                placeholder="kebakaran, banjir, gempa bumi, dll."
                {...register('jenisBencana')}
                className="flex-grow"
                aria-describedby="jenisBencana-error"
              />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="deskripsi" className="text-sm font-medium text-dark">
              Deskripsi Kejadian *
            </Label>
            <Textarea
              id="deskripsi"
              placeholder="Jelaskan detail kejadian, kondisi korban, kerusakan yang terjadi..."
              rows={4}
              {...register('deskripsi')}
              className="resize-none"
              aria-describedby="deskripsi-error"
            />
            {errors.deskripsi && (
              <p id="deskripsi-error" className="text-xs text-error">{errors.deskripsi.message}</p>
            )}
          </div>

          {/* Photo Upload */}
          <div className="space-y-2">
            <Label htmlFor="fotoUrl" className="text-sm font-medium text-dark">
              Foto Kejadian (Opsional)
            </Label>
            <div className="flex space-x-2">
              <Input
                id="fotoUrl"
                type="url"
                placeholder="https://example.com/foto-bencana.jpg"
                {...register('fotoUrl')}
                className="flex-grow"
                aria-describedby="fotoUrl-error"
              />
              <Button type="button" variant="outline" className="px-4" title="Upload foto">
                <Upload className="h-4 w-4" />
              </Button>
            </div>
            {errors.fotoUrl && (
              <p id="fotoUrl-error" className="text-xs text-error">{errors.fotoUrl.message}</p>
            )}
            <p className="text-xs text-gray-500">
              Format: JPG, PNG. Maksimal 5MB. URL atau upload file.
            </p>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <Button
              type="submit"
              disabled={!isValid || isLoading}
              className="w-full disaster-button-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Send className="h-4 w-4" />
              )}
              <span>{isLoading ? 'Memproses...' : 'Kirim Laporan'}</span>
            </Button>
          </div>

          <div className="text-center text-xs text-gray-500 pt-2">
            Dengan mengirim laporan, Anda menyetujui bahwa data akan diproses 
            untuk koordinasi bantuan bencana
          </div>
        </form>
      </div>
    </div>
  );
}