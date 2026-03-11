import { ReactNode, useEffect, useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface PremiumStatsCardProps {
  title: string;
  value: number;
  prefix?: string;
  suffix?: string;
  description?: string;
  icon: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'success' | 'warning' | 'destructive' | 'gold';
  delay?: number;
}

function useCountUp(target: number, duration: number = 1500, delay: number = 0) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      let start = 0;
      const startTime = performance.now();

      const tick = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
        setCount(Math.round(eased * target));

        if (progress < 1) {
          requestAnimationFrame(tick);
        }
      };

      requestAnimationFrame(tick);
    }, delay);

    return () => clearTimeout(timeout);
  }, [target, duration, delay]);

  return count;
}

export function PremiumStatsCard({
  title,
  value,
  prefix = '',
  suffix = '',
  description,
  icon,
  trend,
  variant = 'default',
  delay = 0,
}: PremiumStatsCardProps) {
  const animatedValue = useCountUp(value, 1500, delay);

  const accentColors = {
    default: 'from-primary/20 to-primary/5 text-primary border-primary/20',
    success: 'from-success/20 to-success/5 text-success border-success/20',
    warning: 'from-warning/20 to-warning/5 text-warning border-warning/20',
    destructive: 'from-destructive/20 to-destructive/5 text-destructive border-destructive/20',
    gold: 'from-accent/20 to-accent/5 text-accent border-accent/20',
  };

  const glowColors = {
    default: 'hsl(217, 91%, 60%, 0.08)',
    success: 'hsl(142, 72%, 45%, 0.08)',
    warning: 'hsl(38, 92%, 50%, 0.08)',
    destructive: 'hsl(0, 72%, 51%, 0.08)',
    gold: 'hsl(45, 93%, 53%, 0.08)',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay / 1000 }}
      className="premium-card p-5 hover:border-primary/30 transition-all duration-300 group"
      style={{ boxShadow: `0 0 40px ${glowColors[variant]}` }}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-3 flex-1">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {title}
          </p>
          <div className="flex items-baseline gap-1">
            {prefix && <span className="text-lg font-medium text-muted-foreground">{prefix}</span>}
            <span className="text-3xl font-bold tracking-tight font-mono">
              {animatedValue.toLocaleString('pt-BR')}
            </span>
            {suffix && <span className="text-lg font-medium text-muted-foreground">{suffix}</span>}
          </div>
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
          {trend && (
            <div className={cn(
              'inline-flex items-center gap-1 text-xs font-medium rounded-full px-2 py-0.5',
              trend.isPositive ? 'text-success bg-success/10' : 'text-destructive bg-destructive/10'
            )}>
              {trend.isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {Math.abs(trend.value)}% vs mês anterior
            </div>
          )}
        </div>
        <div className={cn(
          'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br border',
          accentColors[variant]
        )}>
          {icon}
        </div>
      </div>
    </motion.div>
  );
}
