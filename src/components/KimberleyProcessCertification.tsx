
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Award, AlertTriangle, Check } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface KimberleyProcessCertificationProps {
  hasCertification: boolean;
  origin?: string;
  onRequestCertification?: () => void;
}

const KimberleyProcessCertification = ({ 
  hasCertification,
  origin,
  onRequestCertification
}: KimberleyProcessCertificationProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Award className="mr-2 h-5 w-5" />
          Kimberley Process Certification
        </CardTitle>
        <CardDescription>
          Validation of conflict-free diamond source
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Status</p>
            {hasCertification ? (
              <div className="flex items-center mt-1">
                <Check className="h-4 w-4 text-green-600 mr-1" />
                <Badge className="bg-green-100 text-green-800">
                  Certified
                </Badge>
              </div>
            ) : (
              <div className="flex items-center mt-1">
                <AlertTriangle className="h-4 w-4 text-amber-600 mr-1" />
                <Badge className="bg-amber-100 text-amber-800">
                  Not Certified
                </Badge>
              </div>
            )}
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground">Origin</p>
            <p className="font-medium">{origin || 'Unknown'}</p>
          </div>
        </div>
      </CardContent>
      {!hasCertification && (
        <CardFooter>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full"
            onClick={onRequestCertification}
          >
            Request Certification
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default KimberleyProcessCertification;
