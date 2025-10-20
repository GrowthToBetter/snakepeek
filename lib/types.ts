export interface Report {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  lokasi: string;
  jenisBencana: string;
  deskripsi: string;
  fotoUrl?: string;
  sumber?: string;
  lat?: number;
  lng?: number;
  duplicateOfId?: string;
  reporters: number;
}

export interface RegulationDoc {
  id: string;
  title: string;
  category: string;
  excerpt?: string;
  url?: string;
  content?: string;
  createdAt: Date;
}

export interface ChatMessage {
  id: string;
  message: string;
  isBot: boolean;
  timestamp: Date;
  detectedLocation?: string;
}

export interface VerificationResult {
  verified: boolean;
  isDuplicate: boolean;
  duplicateOf?: string;
  reporters: number;
  message: string;
}

export interface NLPExtraction {
  entities: {
    location: string[];
    disasterType: string;
    severity: string;
  };
  confidence: number;
  extractedData: {
    coordinates?: { lat: number; lng: number };
    processedText: string;
  };
}