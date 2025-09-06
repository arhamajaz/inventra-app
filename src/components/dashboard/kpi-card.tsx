
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { LucideIcon } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: string;
  Icon: LucideIcon;
  change?: string;
  changeText?: string;
}

export function KpiCard({ title, value, Icon, change, changeText }: KpiCardProps) {
  return (
    <Card className="transition-transform duration-300 ease-in-out hover:scale-[1.03] hover:shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change && (
          <p className="text-xs text-muted-foreground">{change} {changeText}</p>
        )}
      </CardContent>
    </Card>
  );
}
