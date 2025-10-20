'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, Clock, Brain, MapPin, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Step {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  status: 'pending' | 'processing' | 'completed';
}

interface NLPExtractionStepsProps {
  isProcessing?: boolean;
  onComplete?: () => void;
}

export default function NLPExtractionSteps({ 
  isProcessing = false, 
  onComplete 
}: NLPExtractionStepsProps) {
  const [steps, setSteps] = useState<Step[]>([
    {
      id: 1,
      title: 'Deteksi Entitas Lokasi',
      description: 'Mengidentifikasi nama tempat, koordinat, dan landmark dari teks laporan',
      icon: <MapPin className="h-5 w-5" />,
      status: 'pending',
    },
    {
      id: 2,
      title: 'Klasifikasi Jenis keadaan darurat',
      description: 'Menganalisis teks untuk menentukan kategori dan tingkat keparahan keadaan darurat',
      icon: <Brain className="h-5 w-5" />,
      status: 'pending',
    },
    {
      id: 3,
      title: 'Validasi Teks Input',
      description: 'Memverifikasi kelengkapan informasi dan konsistensi data laporan',
      icon: <FileText className="h-5 w-5" />,
      status: 'pending',
    },
  ]);

  useEffect(() => {
    if (!isProcessing) return;

    const processSteps = async () => {
      for (let i = 0; i < steps.length; i++) {
        // Set current step to processing
        setSteps(prev => prev.map((step, index) => 
          index === i 
            ? { ...step, status: 'processing' }
            : step
        ));

        // Simulate processing time
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Complete current step
        setSteps(prev => prev.map((step, index) => 
          index === i 
            ? { ...step, status: 'completed' }
            : step
        ));
      }

      // Call onComplete after all steps are done
      setTimeout(() => {
        onComplete?.();
      }, 500);
    };

    processSteps();
  }, [isProcessing, onComplete]);

  const getStatusIcon = (status: Step['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-success" />;
      case 'processing':
        return <Clock className="h-5 w-5 text-warning animate-spin" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: Step['status']) => {
    switch (status) {
      case 'completed':
        return 'border-success bg-success/5';
      case 'processing':
        return 'border-warning bg-warning/5';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-dark mb-2">
          Proses Ekstraksi NLP
        </h3>
        <p className="text-sm text-gray-600">
          Sistem sedang menganalisis laporan Anda menggunakan Natural Language Processing
        </p>
      </div>

      <div className="space-y-4">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={cn(
              'p-4 rounded-lg border-2 transition-all duration-500',
              getStatusColor(step.status)
            )}
          >
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 flex items-center justify-center">
                {getStatusIcon(step.status)}
              </div>
              
              <div className="flex-grow">
                <div className="flex items-center space-x-2 mb-1">
                  <div className="p-1 rounded bg-secondary/10">
                    {step.icon}
                  </div>
                  <h4 className={cn(
                    'font-medium transition-colors duration-300',
                    step.status === 'completed' ? 'text-success' :
                    step.status === 'processing' ? 'text-warning' :
                    'text-gray-700'
                  )}>
                    {step.title}
                  </h4>
                </div>
                <p className="text-sm text-gray-600">{step.description}</p>
                
                {step.status === 'processing' && (
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-1">
                      <div className="bg-warning h-1 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {isProcessing && (
        <div className="text-center pt-4">
          <div className="inline-flex items-center space-x-2 text-sm text-gray-600">
            <Clock className="h-4 w-4 animate-spin" />
            <span>Memproses laporan...</span>
          </div>
        </div>
      )}
    </div>
  );
}