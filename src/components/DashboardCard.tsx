
import { cn } from "@/lib/utils";

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<React.SVGAttributes<SVGElement>>;
  change?: number;
  className?: string;
}

const DashboardCard = ({ title, value, icon: Icon, change, className }: DashboardCardProps) => {
  const isPositiveChange = change && change > 0;
  const isNegativeChange = change && change < 0;
  
  return (
    <div className={cn(
      "bg-white rounded-lg shadow-md p-6 border border-gem-silver/20 diamond-card",
      className
    )}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-bold mt-1">{value}</h3>
          
          {change !== undefined && (
            <div className="flex items-center mt-2">
              <span
                className={cn(
                  "text-xs font-medium",
                  isPositiveChange && "text-green-500",
                  isNegativeChange && "text-red-500",
                  !isPositiveChange && !isNegativeChange && "text-muted-foreground"
                )}
              >
                {isPositiveChange && "+"}
                {change}%
              </span>
              <span className="text-xs text-muted-foreground ml-1">from last month</span>
            </div>
          )}
        </div>
        
        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
          <Icon className="h-6 w-6 text-primary" />
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;
