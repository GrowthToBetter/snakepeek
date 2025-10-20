import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
}

export function extractLocation(text: string): string | null {
  const patterns = [
    /di\s+([A-Za-z\s]+)(?:\s|$|,|\.)/gi,
    /daerah\s+([A-Za-z\s]+)(?:\s|$|,|\.)/gi,
    /wilayah\s+([A-Za-z\s]+)(?:\s|$|,|\.)/gi,
    /kota\s+([A-Za-z\s]+)(?:\s|$|,|\.)/gi,
    /kabupaten\s+([A-Za-z\s]+)(?:\s|$|,|\.)/gi,
  ];

  for (const pattern of patterns) {
    const match = pattern.exec(text);
    if (match) {
      return match[1].trim();
    }
  }
  
  return null;
}


export const REGULATION_CATEGORIES = [
  'Undang-Undang',
  'SOP',
  'Prosedur Laporan'
];