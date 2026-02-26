"use client";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  iconBg?: string;
  iconColor?: string;
  trend?: number;
  trendLabel?: string;
  subtitle?: string;
  onClick?: () => void;
}

export default function StatCard({
  title,
  value,
  icon: Icon,
  iconBg = "bg-primary/10",
  iconColor = "text-primary",
  trend,
  trendLabel,
  subtitle,
  onClick,
}: StatCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "bg-card rounded-xl p-4 border border-border flex flex-col gap-3",
        onClick && "cursor-pointer hover:shadow-md transition-shadow"
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">{title}</p>
          <p className="text-2xl font-bold text-foreground mt-1">{value}</p>
          {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
        </div>
        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", iconBg)}>
          <Icon className={cn("w-5 h-5", iconColor)} />
        </div>
      </div>
      {trend !== undefined && (
        <div className="flex items-center gap-1">
          {trend > 0 ? (
            <TrendingUp className="w-3.5 h-3.5 text-green-600" />
          ) : trend < 0 ? (
            <TrendingDown className="w-3.5 h-3.5 text-red-500" />
          ) : (
            <Minus className="w-3.5 h-3.5 text-muted-foreground" />
          )}
          <span className={cn("text-xs font-semibold",
            trend > 0 ? "text-green-600" : trend < 0 ? "text-red-500" : "text-muted-foreground"
          )}>
            {trend > 0 ? "+" : ""}{trend}%
          </span>
          {trendLabel && <span className="text-xs text-muted-foreground">{trendLabel}</span>}
        </div>
      )}
    </div>
  );
}
