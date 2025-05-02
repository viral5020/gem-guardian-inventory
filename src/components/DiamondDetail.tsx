
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Diamond as DiamondType } from "@/types/diamond";
import { 
  formatCurrency, 
  formatDate, 
  getColorClass,
  getClarityClass,
  getCutClass,
  getStatusClass 
} from "@/lib/utils";
import { ArrowLeft, Edit, Package, Award, DollarSign } from "lucide-react";
import DiamondMovementHistory from "./DiamondMovementHistory";
import KimberleyProcessCertification from "./KimberleyProcessCertification";
import { useState } from "react";
import AddDiamondForm from "./AddDiamondForm";

interface DiamondDetailProps {
  diamond: DiamondType;
  onBack: () => void;
}

const DiamondDetail = ({ diamond, onBack }: DiamondDetailProps) => {
  const [isEditing, setIsEditing] = useState(false);
  
  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleEditCancel = () => {
    setIsEditing(false);
  };
  
  return (
    <>
      {isEditing ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <Button variant="outline" size="sm" onClick={handleEditCancel}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Details
            </Button>
          </div>
          <AddDiamondForm 
            initialData={diamond} 
            onCancel={handleEditCancel}
          />
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <Button variant="outline" size="sm" onClick={onBack}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Inventory
            </Button>
            <Button size="sm" onClick={handleEdit}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Diamond
            </Button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main image and details */}
            <Card className="lg:col-span-1">
              <CardHeader className="pb-2">
                <CardTitle>Diamond Image</CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center">
                <div className="w-full aspect-square bg-slate-100 rounded-md flex items-center justify-center border">
                  <Package className="h-24 w-24 text-slate-300" />
                </div>
              </CardContent>
              <CardFooter>
                <div className="w-full text-center">
                  <Badge variant="outline" className={getStatusClass(diamond.status)}>
                    {diamond.status}
                  </Badge>
                </div>
              </CardFooter>
            </Card>
            
            {/* Diamond details */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl font-bold">{diamond.sku}</CardTitle>
                    <CardDescription>
                      {diamond.shape} {diamond.carat} ct {diamond.color} {diamond.clarity}
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">
                      {formatCurrency(diamond.retailPrice)}
                    </div>
                    <CardDescription>
                      Cost: {formatCurrency(diamond.costPrice)}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* 4Cs */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">4Cs</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Carat</p>
                      <p className="text-lg font-medium">{diamond.carat}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Color</p>
                      <div className="flex items-center">
                        <Badge variant="outline" className={getColorClass(diamond.color)}>
                          {diamond.color}
                        </Badge>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Clarity</p>
                      <div className="flex items-center">
                        <Badge variant="outline" className={getClarityClass(diamond.clarity)}>
                          {diamond.clarity}
                        </Badge>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Cut</p>
                      <div className="flex items-center">
                        <Badge variant="outline" className={getCutClass(diamond.cut)}>
                          {diamond.cut}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                {/* Measurements */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Measurements</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Dimensions</p>
                      <p className="text-lg font-medium">{diamond.measurements} mm</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Depth %</p>
                      <p className="text-lg font-medium">{diamond.depthPercentage}%</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Table %</p>
                      <p className="text-lg font-medium">{diamond.tablePercentage}%</p>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                {/* Certificate */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Certificate</h3>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-muted-foreground">Cert Number</p>
                      <p className="text-lg font-medium">{diamond.certNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Lab</p>
                      <p className="text-lg font-medium">{diamond.certLab}</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Award className="mr-2 h-4 w-4" />
                      View Certificate
                    </Button>
                  </div>
                </div>

                {/* Laser Inscription */}
                {diamond.laserInscription && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Laser Inscription</h3>
                      <p className="text-lg font-medium font-mono tracking-widest">
                        {diamond.laserInscription}
                      </p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
            
            {/* Additional information */}
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Additional Information</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <h3 className="font-medium">Location & Status</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <p className="text-sm text-muted-foreground">Current Location</p>
                      <p>{diamond.location}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-sm text-muted-foreground">Status</p>
                      <Badge variant="outline" className={getStatusClass(diamond.status)}>
                        {diamond.status}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-sm text-muted-foreground">Last Updated</p>
                      <p>{formatDate(diamond.lastModified)}</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-medium">Procurement</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <p className="text-sm text-muted-foreground">Type</p>
                      <p>{diamond.procurementType}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-sm text-muted-foreground">Date</p>
                      <p>{formatDate(diamond.procurementDate)}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-sm text-muted-foreground">Origin</p>
                      <p>{diamond.origin || "Unknown"}</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-medium">Notes</h3>
                  <p className="text-sm">{diamond.notes || "No notes available for this diamond."}</p>
                </div>
              </CardContent>
            </Card>

            {/* Kimberley Process */}
            <div className="lg:col-span-1">
              <KimberleyProcessCertification 
                hasCertification={diamond.kimberleyProcess || false}
                origin={diamond.origin}
              />
            </div>

            {/* Movement History */}
            <div className="lg:col-span-2">
              <DiamondMovementHistory movements={diamond.movementHistory} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DiamondDetail;
