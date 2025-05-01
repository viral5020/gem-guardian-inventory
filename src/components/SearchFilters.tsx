
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CardHeader } from "@/components/ui/card";
import { Filter, Search, Plus } from "lucide-react";

interface SearchFiltersProps {
  onAddDiamond?: () => void;
}

const SearchFilters = ({ onAddDiamond }: SearchFiltersProps) => {
  return (
    <CardHeader className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
      <div className="space-y-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search SKU, cert #..."
            className="pl-8"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Shape" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="round">Round</SelectItem>
            <SelectItem value="princess">Princess</SelectItem>
            <SelectItem value="cushion">Cushion</SelectItem>
            <SelectItem value="emerald">Emerald</SelectItem>
            <SelectItem value="oval">Oval</SelectItem>
            <SelectItem value="radiant">Radiant</SelectItem>
            <SelectItem value="asscher">Asscher</SelectItem>
            <SelectItem value="marquise">Marquise</SelectItem>
            <SelectItem value="pear">Pear</SelectItem>
            <SelectItem value="heart">Heart</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="available">Available</SelectItem>
            <SelectItem value="reserved">Reserved</SelectItem>
            <SelectItem value="sold">Sold</SelectItem>
            <SelectItem value="on_memo">On Memo</SelectItem>
            <SelectItem value="returned">Returned</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex space-x-2">
        <Button variant="outline" className="flex-1">
          <Filter className="mr-2 h-4 w-4" />
          More Filters
        </Button>
        <Button className="flex-none" onClick={onAddDiamond}>
          <Plus className="mr-2 h-4 w-4" />
          Add Diamond
        </Button>
      </div>
    </CardHeader>
  );
};

export default SearchFilters;
