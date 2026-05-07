import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KpiCardProps {
  title: string;
  value: string;
  Icon: LucideIcon;
  change?: string;
  changeText?: string;
  variant?: 'default' | 'destructive';
}

export function KpiCard({ title, value, Icon, change, changeText, variant = 'default' }: KpiCardProps) {
  return (
    <Card className={cn(
      "transition-transform duration-300 ease-in-out hover:scale-[1.03] hover:shadow-lg",
      variant === 'destructive' && "border-destructive/50 bg-destructive/5 shadow-destructive/10"
    )}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className={cn(
          "text-sm font-medium",
          variant === 'destructive' ? "text-destructive" : "text-muted-foreground"
        )}>
          {title}
        </CardTitle>
        <Icon className={cn(
          "h-5 w-5",
          variant === 'destructive' ? "text-destructive" : "text-muted-foreground"
        )} />
      </CardHeader>
      <CardContent>
        <div className={cn(
          "text-2xl font-bold",
          variant === 'destructive' && "text-destructive"
        )}>{value}</div>
        {(change || changeText) && (
          <p className="text-xs text-muted-foreground">{change} {changeText}</p>
        )}
      </CardContent>
    </Card>
  );
}
