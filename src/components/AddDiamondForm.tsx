import { useState, useRef } from "react";
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
import { toast } from "@/components/ui/use-toast";
import { Diamond, DiamondShape, CutGrade, ClarityGrade, ColorGrade, CertificationLab } from "@/types/diamond";
import { Barcode, Printer } from "lucide-react";
import { useReactToPrint } from "react-to-print";

interface AddDiamondFormProps {
  onCancel?: () => void;
  onSuccess?: (diamond: Diamond) => void;
  initialData?: Diamond;
}

const AddDiamondForm = ({ onCancel, onSuccess, initialData }: AddDiamondFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sku, setSku] = useState(initialData?.sku || "");
  const [shape, setShape] = useState<DiamondShape>(initialData?.shape || "Round");
  const [carat, setCarat] = useState(initialData?.carat?.toString() || "");
  const [cut, setCut] = useState<CutGrade>(initialData?.cut || "Excellent");
  const [clarity, setClarity] = useState<ClarityGrade>(initialData?.clarity || "FL");
  const [color, setColor] = useState<ColorGrade>(initialData?.color || "D");
  const [barcodeData, setBarcodeData] = useState("");
  const [certNumber, setCertNumber] = useState(initialData?.certNumber || "");
  const [certLab, setCertLab] = useState<CertificationLab>(initialData?.certLab || "GIA");
  const [costPrice, setCostPrice] = useState(initialData?.costPrice?.toString() || "");
  const [retailPrice, setRetailPrice] = useState(initialData?.retailPrice?.toString() || "");
  const [notes, setNotes] = useState(initialData?.notes || "");
  const printRef = useRef<HTMLDivElement>(null);

  // Generate barcode based on diamond details
  const generateBarcode = () => {
    if (sku && shape && carat && cut && clarity && color) {
      const data = `${sku}-${shape.substring(0, 2)}-${carat}-${cut.substring(0, 1)}-${clarity}-${color}`;
      setBarcodeData(data);
      toast({
        title: "Barcode Generated",
        description: `Barcode data: ${data}`,
      });
      return data;
    }
    return "";
  };
  
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Generate barcode if not already generated
    if (!barcodeData) {
      generateBarcode();
    }
    
    // Create updated diamond object
    const updatedDiamond: Diamond = {
      ...initialData,
      id: initialData?.id || '',
      sku,
      shape,
      carat: parseFloat(carat),
      cut,
      clarity,
      color,
      certNumber,
      certLab,
      costPrice: parseFloat(costPrice),
      retailPrice: parseFloat(retailPrice),
      notes,
      lastModified: new Date().toISOString().split('T')[0],
      // Keep other required fields with default values if not present in initialData
      fluorescence: initialData?.fluorescence || 'None',
      polish: initialData?.polish || 'Excellent',
      symmetry: initialData?.symmetry || 'Excellent',
      location: initialData?.location || 'Safe',
      status: initialData?.status || 'Available',
      procurementType: initialData?.procurementType || 'Direct Purchase',
      procurementDate: initialData?.procurementDate || new Date().toISOString().split('T')[0],
      measurements: initialData?.measurements || '0 x 0 x 0',
      depthPercentage: initialData?.depthPercentage || 0,
      tablePercentage: initialData?.tablePercentage || 0,
      memos: initialData?.memos || []
    };
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: initialData ? "Diamond Updated" : "Diamond Added",
        description: initialData ? "The diamond has been successfully updated." : "The diamond has been successfully added to inventory.",
      });
      
      if (onSuccess) {
        onSuccess(updatedDiamond);
      }
      
      if (onCancel && !onSuccess) {
        onCancel(); // Return to previous view if no success handler
      }
    }, 1000);
  };
  
  const handleCancel = () => {
    if (onCancel) onCancel();
  };

  // Auto-generate barcode on field changes
  const handleFieldChange = (field: string, value: string) => {
    switch (field) {
      case "sku":
        setSku(value);
        break;
      case "shape":
        setShape(value as DiamondShape);
        break;
      case "carat":
        setCarat(value);
        break;
      case "cut":
        setCut(value as CutGrade);
        break;
      case "clarity":
        setClarity(value as ClarityGrade);
        break;
      case "color":
        setColor(value as ColorGrade);
        break;
      case "certNumber":
        setCertNumber(value);
        break;
      case "certLab":
        setCertLab(value as CertificationLab);
        break;
      case "costPrice":
        setCostPrice(value);
        break;
      case "retailPrice":
        setRetailPrice(value);
        break;
      case "notes":
        setNotes(value);
        break;
      default:
        break;
    }
    
    // Auto-generate barcode only if we have enough info
    setTimeout(() => {
      if (sku && shape && carat && cut && clarity && color) {
        generateBarcode();
      }
    }, 100);
  };
  
  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>{initialData ? "Edit Diamond" : "Add New Diamond"}</CardTitle>
        <CardDescription>
          {initialData ? "Update the details of this diamond." : "Enter the details of the new diamond to add to inventory."}
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
                <Input 
                  id="sku" 
                  placeholder="e.g. DM-RD-101" 
                  value={sku}
                  onChange={(e) => handleFieldChange("sku", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="shape">Shape</Label>
                <Select value={shape} onValueChange={(value) => handleFieldChange("shape", value)}>
                  <SelectTrigger id="shape">
                    <SelectValue placeholder="Select shape" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Round">Round</SelectItem>
                    <SelectItem value="Princess">Princess</SelectItem>
                    <SelectItem value="Cushion">Cushion</SelectItem>
                    <SelectItem value="Emerald">Emerald</SelectItem>
                    <SelectItem value="Oval">Oval</SelectItem>
                    <SelectItem value="Radiant">Radiant</SelectItem>
                    <SelectItem value="Asscher">Asscher</SelectItem>
                    <SelectItem value="Marquise">Marquise</SelectItem>
                    <SelectItem value="Pear">Pear</SelectItem>
                    <SelectItem value="Heart">Heart</SelectItem>
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
                <Input 
                  id="carat" 
                  type="number" 
                  step="0.01" 
                  placeholder="0.00" 
                  value={carat}
                  onChange={(e) => handleFieldChange("carat", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cut">Cut</Label>
                <Select value={cut} onValueChange={(value) => handleFieldChange("cut", value)}>
                  <SelectTrigger id="cut">
                    <SelectValue placeholder="Select cut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Excellent">Excellent</SelectItem>
                    <SelectItem value="Very Good">Very Good</SelectItem>
                    <SelectItem value="Good">Good</SelectItem>
                    <SelectItem value="Fair">Fair</SelectItem>
                    <SelectItem value="Poor">Poor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="clarity">Clarity</Label>
                <Select value={clarity} onValueChange={(value) => handleFieldChange("clarity", value)}>
                  <SelectTrigger id="clarity">
                    <SelectValue placeholder="Select clarity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FL">FL</SelectItem>
                    <SelectItem value="IF">IF</SelectItem>
                    <SelectItem value="VVS1">VVS1</SelectItem>
                    <SelectItem value="VVS2">VVS2</SelectItem>
                    <SelectItem value="VS1">VS1</SelectItem>
                    <SelectItem value="VS2">VS2</SelectItem>
                    <SelectItem value="SI1">SI1</SelectItem>
                    <SelectItem value="SI2">SI2</SelectItem>
                    <SelectItem value="I1">I1</SelectItem>
                    <SelectItem value="I2">I2</SelectItem>
                    <SelectItem value="I3">I3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="color">Color</Label>
                <Select value={color} onValueChange={(value) => handleFieldChange("color", value)}>
                  <SelectTrigger id="color">
                    <SelectValue placeholder="Select color" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="D">D</SelectItem>
                    <SelectItem value="E">E</SelectItem>
                    <SelectItem value="F">F</SelectItem>
                    <SelectItem value="G">G</SelectItem>
                    <SelectItem value="H">H</SelectItem>
                    <SelectItem value="I">I</SelectItem>
                    <SelectItem value="J">J</SelectItem>
                    <SelectItem value="K">K</SelectItem>
                    <SelectItem value="L">L</SelectItem>
                    <SelectItem value="M">M</SelectItem>
                    <SelectItem value="Z+">Z+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          {/* Barcode Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Diamond Barcode</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="barcode">Barcode</Label>
                  <Button 
                    type="button" 
                    size="sm" 
                    variant="outline"
                    onClick={generateBarcode}
                  >
                    <Barcode className="mr-2 h-4 w-4" />
                    Generate
                  </Button>
                </div>
                <div className="p-4 bg-gray-50 border rounded-md min-h-[100px] flex flex-col items-center justify-center">
                  {barcodeData ? (
                    <div ref={printRef} className="text-center">
                      <div className="font-mono text-sm mb-2">{barcodeData}</div>
                      <div className="h-16 bg-gray-800 flex items-center justify-center text-white font-mono text-xs px-4">
                        {Array.from(barcodeData).map((char, index) => (
                          <div key={index} className="mx-[0.5px] h-full" style={{
                            width: Math.floor(Math.random() * 3) + 1 + 'px', 
                            backgroundColor: Math.random() > 0.5 ? 'white' : 'black'
                          }}></div>
                        ))}
                      </div>
                      <div className="mt-2 text-xs">{sku}</div>
                    </div>
                  ) : (
                    <span className="text-muted-foreground text-sm">
                      Complete the diamond details to generate a barcode
                    </span>
                  )}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full"
                  disabled={!barcodeData}
                  onClick={handlePrint}
                >
                  <Printer className="mr-2 h-4 w-4" />
                  Print Barcode
                </Button>
              </div>
            </div>
          </div>
          
          {/* Certification */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Certification</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="certNumber">Certificate Number</Label>
                <Input 
                  id="certNumber" 
                  placeholder="e.g. 2141957190" 
                  value={certNumber}
                  onChange={(e) => handleFieldChange("certNumber", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="certLab">Certification Lab</Label>
                <Select value={certLab} onValueChange={(value) => handleFieldChange("certLab", value)}>
                  <SelectTrigger id="certLab">
                    <SelectValue placeholder="Select lab" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GIA">GIA</SelectItem>
                    <SelectItem value="IGI">IGI</SelectItem>
                    <SelectItem value="AGS">AGS</SelectItem>
                    <SelectItem value="HRD">HRD</SelectItem>
                    <SelectItem value="None">None</SelectItem>
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
                  <Input 
                    id="costPrice" 
                    type="number" 
                    className="pl-7" 
                    placeholder="0" 
                    value={costPrice}
                    onChange={(e) => handleFieldChange("costPrice", e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="retailPrice">Retail Price</Label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                    $
                  </span>
                  <Input 
                    id="retailPrice" 
                    type="number" 
                    className="pl-7" 
                    placeholder="0" 
                    value={retailPrice}
                    onChange={(e) => handleFieldChange("retailPrice", e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Additional Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Additional Information</h3>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea 
                id="notes" 
                placeholder="Add any additional information here..." 
                value={notes}
                onChange={(e) => handleFieldChange("notes", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" type="button" onClick={handleCancel}>Cancel</Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (initialData ? "Updating..." : "Adding...") : (initialData ? "Update Diamond" : "Add Diamond")}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default AddDiamondForm;
