import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string;
  change?: string;
  icon: LucideIcon;
  trend?: "up" | "down" | "neutral";
}

const StatsCard = ({ title, value, change, icon: Icon, trend = "neutral" }: StatsCardProps) => {
  const trendColors = {
    up: "text-accent",
    down: "text-destructive",
    neutral: "text-muted-foreground",
  };

  return (
    <Card className="relative overflow-hidden group hover:shadow-glow transition-smooth">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold">{value}</p>
            {change && (
              <p className={`text-sm ${trendColors[trend]}`}>
                {change}
              </p>
            )}
          </div>
          <div className="p-3 rounded-lg bg-accent/10">
            <Icon className="w-6 h-6 text-accent" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
