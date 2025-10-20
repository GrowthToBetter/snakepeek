import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CardStatProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export default function CardStat({
  title,
  value,
  description,
  icon: Icon,
  trend,
  className,
}: CardStatProps) {
  return (
    <div className={cn('disaster-card group', className)}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-dark mb-1">{value}</p>
          {description && (
            <p className="text-sm text-gray-500">{description}</p>
          )}
          {trend && (
            <div className="flex items-center mt-2">
              <span
                className={cn(
                  'text-xs font-medium',
                  trend.isPositive ? 'text-success' : 'text-error'
                )}
              >
                {trend.isPositive ? '+' : ''}{trend.value}%
              </span>
              <span className="text-xs text-gray-500 ml-1">dari bulan lalu</span>
            </div>
          )}
        </div>
        <div className="p-3 bg-secondary/10 rounded-lg group-hover:bg-secondary/20 transition-colors duration-200">
          <Icon className="h-6 w-6 text-secondary" />
        </div>
      </div>
    </div>
  );
}