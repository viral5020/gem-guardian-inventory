
import { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, Plus } from "lucide-react";
import { mockDiamonds } from "@/data/mockDiamonds";
import { formatCurrency, getStatusClass, formatDate } from "@/lib/utils";
import SearchFilters from "./SearchFilters";

interface DiamondListProps {
  showFilters?: boolean;
  limit?: number;
  onSelectDiamond?: (diamondId: string) => void;
  onAddDiamond?: () => void;
}

const DiamondList = ({ 
  showFilters = true, 
  limit,
  onSelectDiamond,
  onAddDiamond
}: DiamondListProps) => {
  const [selectedDiamond, setSelectedDiamond] = useState<string | null>(null);
  
  const displayDiamonds = limit ? mockDiamonds.slice(0, limit) : mockDiamonds;

  const handleViewDiamond = (diamondId: string) => {
    setSelectedDiamond(diamondId);
    if (onSelectDiamond) {
      onSelectDiamond(diamondId);
    }
  };
  
  return (
    <Card>
      {showFilters && (
        <SearchFilters onAddDiamond={onAddDiamond} />
      )}
      <CardContent className="p-0">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>SKU</TableHead>
                <TableHead>Carat</TableHead>
                <TableHead>Shape</TableHead>
                <TableHead>Color</TableHead>
                <TableHead>Clarity</TableHead>
                <TableHead>Cut</TableHead>
                <TableHead>Cert</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayDiamonds.map((diamond) => (
                <TableRow 
                  key={diamond.id}
                  className={selectedDiamond === diamond.id ? "bg-primary/5" : undefined}
                >
                  <TableCell className="font-medium">{diamond.sku}</TableCell>
                  <TableCell>{diamond.carat.toFixed(2)}</TableCell>
                  <TableCell>{diamond.shape}</TableCell>
                  <TableCell>{diamond.color}</TableCell>
                  <TableCell>{diamond.clarity}</TableCell>
                  <TableCell>{diamond.cut}</TableCell>
                  <TableCell>{diamond.certLab}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={getStatusClass(diamond.status)}>
                      {diamond.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatCurrency(diamond.retailPrice)}</TableCell>
                  <TableCell>{formatDate(diamond.lastModified)}</TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleViewDiamond(diamond.id)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        {!limit && (
          <div className="flex items-center justify-between px-6 py-4">
            <p className="text-sm text-muted-foreground">
              Showing <strong>1-{displayDiamonds.length}</strong> of <strong>{mockDiamonds.length}</strong> diamonds
            </p>
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                disabled
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DiamondList;
