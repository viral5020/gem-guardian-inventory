
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const AddDiamondForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      // Handle success or error here
    }, 1000);
  };
  
  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Add New Diamond</CardTitle>
        <CardDescription>
          Enter the details of the new diamond to add to inventory.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-8">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sku">SKU</Label>
                <Input id="sku" placeholder="e.g. DM-RD-101" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="shape">Shape</Label>
                <Select>
                  <SelectTrigger id="shape">
                    <SelectValue placeholder="Select shape" />
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
            </div>
          </div>
          
          {/* 4Cs */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">4Cs</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="carat">Carat Weight</Label>
                <Input id="carat" type="number" step="0.01" placeholder="0.00" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cut">Cut</Label>
                <Select>
                  <SelectTrigger id="cut">
                    <SelectValue placeholder="Select cut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="excellent">Excellent</SelectItem>
                    <SelectItem value="very-good">Very Good</SelectItem>
                    <SelectItem value="good">Good</SelectItem>
                    <SelectItem value="fair">Fair</SelectItem>
                    <SelectItem value="poor">Poor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="clarity">Clarity</Label>
                <Select>
                  <SelectTrigger id="clarity">
                    <SelectValue placeholder="Select clarity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fl">FL</SelectItem>
                    <SelectItem value="if">IF</SelectItem>
                    <SelectItem value="vvs1">VVS1</SelectItem>
                    <SelectItem value="vvs2">VVS2</SelectItem>
                    <SelectItem value="vs1">VS1</SelectItem>
                    <SelectItem value="vs2">VS2</SelectItem>
                    <SelectItem value="si1">SI1</SelectItem>
                    <SelectItem value="si2">SI2</SelectItem>
                    <SelectItem value="i1">I1</SelectItem>
                    <SelectItem value="i2">I2</SelectItem>
                    <SelectItem value="i3">I3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="color">Color</Label>
                <Select>
                  <SelectTrigger id="color">
                    <SelectValue placeholder="Select color" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="d">D</SelectItem>
                    <SelectItem value="e">E</SelectItem>
                    <SelectItem value="f">F</SelectItem>
                    <SelectItem value="g">G</SelectItem>
                    <SelectItem value="h">H</SelectItem>
                    <SelectItem value="i">I</SelectItem>
                    <SelectItem value="j">J</SelectItem>
                    <SelectItem value="k">K</SelectItem>
                    <SelectItem value="l">L</SelectItem>
                    <SelectItem value="m">M</SelectItem>
                    <SelectItem value="z+">Z+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          {/* Certification */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Certification</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="certNumber">Certificate Number</Label>
                <Input id="certNumber" placeholder="e.g. 2141957190" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="certLab">Certification Lab</Label>
                <Select>
                  <SelectTrigger id="certLab">
                    <SelectValue placeholder="Select lab" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gia">GIA</SelectItem>
                    <SelectItem value="igi">IGI</SelectItem>
                    <SelectItem value="ags">AGS</SelectItem>
                    <SelectItem value="hrd">HRD</SelectItem>
                    <SelectItem value="none">None</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          {/* Pricing */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Pricing</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="costPrice">Cost Price</Label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                    $
                  </span>
                  <Input id="costPrice" type="number" className="pl-7" placeholder="0" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="retailPrice">Retail Price</Label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                    $
                  </span>
                  <Input id="retailPrice" type="number" className="pl-7" placeholder="0" />
                </div>
              </div>
            </div>
          </div>
          
          {/* Additional Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Additional Information</h3>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea id="notes" placeholder="Add any additional information here..." />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">Cancel</Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Adding..." : "Add Diamond"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default AddDiamondForm;
