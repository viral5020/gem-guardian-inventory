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
import { Diamond as DiamondType, DiamondMovement, DiamondMemo, LocationStatus } from "@/types/diamond";
import { 
  formatCurrency, 
  formatDate, 
  getColorClass,
  getClarityClass,
  getCutClass,
  getStatusClass 
} from "@/lib/utils";
import { ArrowLeft, Edit, Package, Award, DollarSign, Plus, Trash, Calendar, ArrowRight } from "lucide-react";
import DiamondMovementHistory from "./DiamondMovementHistory";
import KimberleyProcessCertification from "./KimberleyProcessCertification";
import { useState } from "react";
import AddDiamondForm from "./AddDiamondForm";
import DiamondMemoManagement from "./DiamondMemoManagement";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog, 
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DiamondDetailProps {
  diamond: DiamondType;
  onBack: () => void;
}

const DiamondDetail = ({ diamond, onBack }: DiamondDetailProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentDiamond, setCurrentDiamond] = useState<DiamondType>(diamond);
  const [isAddingMemo, setIsAddingMemo] = useState(false);
  const [isEditingMemo, setIsEditingMemo] = useState(false);
  const [selectedMemo, setSelectedMemo] = useState<DiamondMemo | null>(null);
  const [memos, setMemos] = useState<DiamondMemo[]>(diamond.memos || []);
  
  // Movement history states
  const [movements, setMovements] = useState<DiamondMovement[]>(diamond.movementHistory || []);
  const [isAddingMovement, setIsAddingMovement] = useState(false);
  const [isEditingMovement, setIsEditingMovement] = useState(false);
  const [selectedMovement, setSelectedMovement] = useState<DiamondMovement | null>(null);
  
  // Movement form states
  const [moveDate, setMoveDate] = useState("");
  const [moveFromLocation, setMoveFromLocation] = useState<LocationStatus>("Safe");
  const [moveToLocation, setMoveToLocation] = useState<LocationStatus>("Safe");
  const [moveHandledBy, setMoveHandledBy] = useState("");
  const [moveNotes, setMoveNotes] = useState("");
  
  // Memo form states
  const [memoCustomerId, setMemoCustomerId] = useState("");
  const [memoStartDate, setMemoStartDate] = useState("");
  const [memoExpectedEndDate, setMemoExpectedEndDate] = useState("");
  const [memoNotes, setMemoNotes] = useState("");

  // Mock customers for demo purposes
  const mockCustomers = [
    { id: "1", name: "Jane Smith" },
    { id: "2", name: "Robert Johnson" },
    { id: "3", name: "Sarah Williams" },
    { id: "4", name: "Michael Brown" }
  ];
  
  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleEditCancel = () => {
    setIsEditing(false);
  };

  const handleEditSuccess = (updatedDiamond: DiamondType) => {
    const updatedWithMemosAndMovements = {
      ...updatedDiamond, 
      id: diamond.id,
      memos: memos,
      movementHistory: movements
    };
    setCurrentDiamond(updatedWithMemosAndMovements);
    setIsEditing(false);
  };

  const handleAddMemo = () => {
    setMemoCustomerId("");
    setMemoStartDate(new Date().toISOString().split("T")[0]);
    setMemoExpectedEndDate("");
    setMemoNotes("");
    setIsAddingMemo(true);
  };

  const handleEditMemo = (memo: DiamondMemo) => {
    setSelectedMemo(memo);
    setMemoCustomerId(memo.customerId);
    setMemoStartDate(memo.startDate);
    setMemoExpectedEndDate(memo.expectedEndDate);
    setMemoNotes(memo.notes || "");
    setIsEditingMemo(true);
  };

  const handleDeleteMemo = (memoId: string) => {
    setMemos(memos.filter(memo => memo.id !== memoId));
    toast({
      title: "Memo Deleted",
      description: "The memo has been successfully deleted."
    });
  };

  const handleSubmitMemo = () => {
    if (!memoCustomerId || !memoStartDate || !memoExpectedEndDate) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    if (isEditingMemo && selectedMemo) {
      // Update existing memo
      const updatedMemos = memos.map(memo => 
        memo.id === selectedMemo.id 
          ? { 
              ...memo, 
              customerId: memoCustomerId,
              startDate: memoStartDate,
              expectedEndDate: memoExpectedEndDate,
              notes: memoNotes
            } 
          : memo
      );
      setMemos(updatedMemos);
      toast({
        title: "Memo Updated",
        description: "The memo has been successfully updated."
      });
    } else {
      // Add new memo
      const newMemo: DiamondMemo = {
        id: `memo-${Date.now()}`,
        diamondId: currentDiamond.id,
        customerId: memoCustomerId,
        startDate: memoStartDate,
        expectedEndDate: memoExpectedEndDate,
        status: "Active",
        notes: memoNotes
      };
      setMemos([...memos, newMemo]);
      toast({
        title: "Memo Created",
        description: "A new memo has been successfully created."
      });
    }

    setIsAddingMemo(false);
    setIsEditingMemo(false);
    setSelectedMemo(null);
  };

  const handleMarkReturned = (memoId: string) => {
    setMemos(memos.map(memo => 
      memo.id === memoId 
        ? { 
            ...memo, 
            status: "Returned",
            actualReturnDate: new Date().toISOString().split("T")[0]
          } 
        : memo
    ));
    toast({
      title: "Memo Updated",
      description: "Memo marked as returned."
    });
  };
  
  const handleMarkSold = (memoId: string) => {
    setMemos(memos.map(memo => 
      memo.id === memoId 
        ? { ...memo, status: "Sold" } 
        : memo
    ));
    toast({
      title: "Memo Updated",
      description: "Memo marked as sold."
    });
  };
  
  const handleAddMovement = () => {
    setMoveDate(new Date().toISOString().split("T")[0]);
    setMoveFromLocation(currentDiamond.location);
    setMoveToLocation("Safe");
    setMoveHandledBy("");
    setMoveNotes("");
    setIsAddingMovement(true);
  };

  const handleEditMovement = (movement: DiamondMovement) => {
    setSelectedMovement(movement);
    setMoveDate(movement.date);
    setMoveFromLocation(movement.fromLocation);
    setMoveToLocation(movement.toLocation);
    setMoveHandledBy(movement.handledBy);
    setMoveNotes(movement.notes || "");
    setIsEditingMovement(true);
  };

  const handleDeleteMovement = (movementId: string) => {
    setMovements(movements.filter(movement => movement.id !== movementId));
    toast({
      title: "Movement Deleted",
      description: "The movement record has been successfully deleted."
    });
  };

  const handleSubmitMovement = () => {
    if (!moveDate || !moveFromLocation || !moveToLocation || !moveHandledBy) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    if (isEditingMovement && selectedMovement) {
      // Update existing movement
      const updatedMovements = movements.map(movement => 
        movement.id === selectedMovement.id 
          ? { 
              ...movement, 
              date: moveDate,
              fromLocation: moveFromLocation,
              toLocation: moveToLocation,
              handledBy: moveHandledBy,
              notes: moveNotes
            } 
          : movement
      );
      setMovements(updatedMovements);
      toast({
        title: "Movement Updated",
        description: "The movement record has been successfully updated."
      });
    } else {
      // Add new movement
      const newMovement: DiamondMovement = {
        id: `movement-${Date.now()}`,
        date: moveDate,
        fromLocation: moveFromLocation,
        toLocation: moveToLocation,
        handledBy: moveHandledBy,
        notes: moveNotes
      };
      
      // Update diamond location to match the new movement's destination
      setCurrentDiamond({
        ...currentDiamond,
        location: moveToLocation
      });
      
      setMovements([...movements, newMovement]);
      toast({
        title: "Movement Added",
        description: "A new movement record has been added and the diamond location has been updated."
      });
    }

    setIsAddingMovement(false);
    setIsEditingMovement(false);
    setSelectedMovement(null);
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
            initialData={currentDiamond} 
            onCancel={handleEditCancel}
            onSuccess={handleEditSuccess}
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
                  <Badge variant="outline" className={getStatusClass(currentDiamond.status)}>
                    {currentDiamond.status}
                  </Badge>
                </div>
              </CardFooter>
            </Card>
            
            {/* Diamond details */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl font-bold">{currentDiamond.sku}</CardTitle>
                    <CardDescription>
                      {currentDiamond.shape} {currentDiamond.carat} ct {currentDiamond.color} {currentDiamond.clarity}
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">
                      {formatCurrency(currentDiamond.retailPrice)}
                    </div>
                    <CardDescription>
                      Cost: {formatCurrency(currentDiamond.costPrice)}
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
                      <p className="text-lg font-medium">{currentDiamond.carat}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Color</p>
                      <div className="flex items-center">
                        <Badge variant="outline" className={getColorClass(currentDiamond.color)}>
                          {currentDiamond.color}
                        </Badge>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Clarity</p>
                      <div className="flex items-center">
                        <Badge variant="outline" className={getClarityClass(currentDiamond.clarity)}>
                          {currentDiamond.clarity}
                        </Badge>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Cut</p>
                      <div className="flex items-center">
                        <Badge variant="outline" className={getCutClass(currentDiamond.cut)}>
                          {currentDiamond.cut}
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
                      <p className="text-lg font-medium">{currentDiamond.measurements} mm</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Depth %</p>
                      <p className="text-lg font-medium">{currentDiamond.depthPercentage}%</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Table %</p>
                      <p className="text-lg font-medium">{currentDiamond.tablePercentage}%</p>
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
                      <p className="text-lg font-medium">{currentDiamond.certNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Lab</p>
                      <p className="text-lg font-medium">{currentDiamond.certLab}</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Award className="mr-2 h-4 w-4" />
                      View Certificate
                    </Button>
                  </div>
                </div>

                {/* Laser Inscription */}
                {currentDiamond.laserInscription && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Laser Inscription</h3>
                      <p className="text-lg font-medium font-mono tracking-widest">
                        {currentDiamond.laserInscription}
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
                      <p>{currentDiamond.location}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-sm text-muted-foreground">Status</p>
                      <Badge variant="outline" className={getStatusClass(currentDiamond.status)}>
                        {currentDiamond.status}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-sm text-muted-foreground">Last Updated</p>
                      <p>{formatDate(currentDiamond.lastModified)}</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-medium">Procurement</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <p className="text-sm text-muted-foreground">Type</p>
                      <p>{currentDiamond.procurementType}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-sm text-muted-foreground">Date</p>
                      <p>{formatDate(currentDiamond.procurementDate)}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-sm text-muted-foreground">Origin</p>
                      <p>{currentDiamond.origin || "Unknown"}</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-medium">Notes</h3>
                  <p className="text-sm">{currentDiamond.notes || "No notes available for this diamond."}</p>
                </div>
              </CardContent>
            </Card>

            {/* Kimberley Process */}
            <div className="lg:col-span-1">
              <KimberleyProcessCertification 
                hasCertification={currentDiamond.kimberleyProcess || false}
                origin={currentDiamond.origin}
              />
            </div>

            {/* Movement History */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Movement History</CardTitle>
                  <Button size="sm" onClick={handleAddMovement}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Movement
                  </Button>
                </CardHeader>
                <CardContent>
                  <DiamondMovementHistory 
                    movements={movements}
                    onEditMovement={handleEditMovement}
                    onDeleteMovement={handleDeleteMovement}
                  />
                </CardContent>
              </Card>
            </div>
            
            {/* Diamond Memos */}
            <div className="lg:col-span-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Memo History</CardTitle>
                  <Button size="sm" onClick={handleAddMemo}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Memo
                  </Button>
                </CardHeader>
                <CardContent>
                  <DiamondMemoManagement 
                    memos={memos}
                    customers={mockCustomers}
                    onMarkReturned={handleMarkReturned}
                    onMarkSold={handleMarkSold}
                    onEditMemo={handleEditMemo}
                    onDeleteMemo={handleDeleteMemo}
                    diamondView={true}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}

      {/* Add Movement Dialog */}
      <Dialog open={isAddingMovement} onOpenChange={setIsAddingMovement}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Movement Record</DialogTitle>
            <DialogDescription>
              Record a new location change for this diamond.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="moveDate" className="text-sm font-medium">Date</label>
              <Input 
                id="moveDate"
                type="date"
                value={moveDate}
                onChange={e => setMoveDate(e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="fromLocation" className="text-sm font-medium">From Location</label>
                <Select 
                  value={moveFromLocation}
                  onValueChange={(value) => setMoveFromLocation(value as LocationStatus)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Safe">Safe</SelectItem>
                    <SelectItem value="Showroom">Showroom</SelectItem>
                    <SelectItem value="In Transit">In Transit</SelectItem>
                    <SelectItem value="Customer Viewing">Customer Viewing</SelectItem>
                    <SelectItem value="Workshop">Workshop</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="toLocation" className="text-sm font-medium">To Location</label>
                <Select 
                  value={moveToLocation}
                  onValueChange={(value) => setMoveToLocation(value as LocationStatus)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Safe">Safe</SelectItem>
                    <SelectItem value="Showroom">Showroom</SelectItem>
                    <SelectItem value="In Transit">In Transit</SelectItem>
                    <SelectItem value="Customer Viewing">Customer Viewing</SelectItem>
                    <SelectItem value="Workshop">Workshop</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="handledBy" className="text-sm font-medium">Handled By</label>
              <Input 
                id="handledBy"
                type="text"
                placeholder="Enter staff name"
                value={moveHandledBy}
                onChange={e => setMoveHandledBy(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="notes" className="text-sm font-medium">Notes</label>
              <Textarea 
                id="notes"
                placeholder="Add notes about this movement..."
                value={moveNotes}
                onChange={e => setMoveNotes(e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddingMovement(false)}>Cancel</Button>
            <Button onClick={handleSubmitMovement}>
              {isEditingMovement ? "Update Movement" : "Add Movement"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Movement Dialog */}
      <Dialog open={isEditingMovement} onOpenChange={setIsEditingMovement}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Movement Record</DialogTitle>
            <DialogDescription>
              Update this movement record.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="moveDate" className="text-sm font-medium">Date</label>
              <Input 
                id="moveDate"
                type="date"
                value={moveDate}
                onChange={e => setMoveDate(e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="fromLocation" className="text-sm font-medium">From Location</label>
                <Select 
                  value={moveFromLocation}
                  onValueChange={(value) => setMoveFromLocation(value as LocationStatus)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Safe">Safe</SelectItem>
                    <SelectItem value="Showroom">Showroom</SelectItem>
                    <SelectItem value="In Transit">In Transit</SelectItem>
                    <SelectItem value="Customer Viewing">Customer Viewing</SelectItem>
                    <SelectItem value="Workshop">Workshop</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="toLocation" className="text-sm font-medium">To Location</label>
                <Select 
                  value={moveToLocation}
                  onValueChange={(value) => setMoveToLocation(value as LocationStatus)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Safe">Safe</SelectItem>
                    <SelectItem value="Showroom">Showroom</SelectItem>
                    <SelectItem value="In Transit">In Transit</SelectItem>
                    <SelectItem value="Customer Viewing">Customer Viewing</SelectItem>
                    <SelectItem value="Workshop">Workshop</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="handledBy" className="text-sm font-medium">Handled By</label>
              <Input 
                id="handledBy"
                type="text"
                placeholder="Enter staff name"
                value={moveHandledBy}
                onChange={e => setMoveHandledBy(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="notes" className="text-sm font-medium">Notes</label>
              <Textarea 
                id="notes"
                placeholder="Add notes about this movement..."
                value={moveNotes}
                onChange={e => setMoveNotes(e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditingMovement(false)}>Cancel</Button>
            <Button onClick={handleSubmitMovement}>Update Movement</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Add/Edit Memo Dialogs */}
      <Dialog open={isAddingMemo} onOpenChange={setIsAddingMemo}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Memo</DialogTitle>
            <DialogDescription>
              Create a new memo for this diamond.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="customer" className="text-sm font-medium">Customer</label>
              <Select 
                value={memoCustomerId}
                onValueChange={setMemoCustomerId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a customer" />
                </SelectTrigger>
                <SelectContent>
                  {mockCustomers.map(customer => (
                    <SelectItem key={customer.id} value={customer.id}>
                      {customer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="startDate" className="text-sm font-medium">Start Date</label>
                <Input 
                  id="startDate"
                  type="date"
                  value={memoStartDate}
                  onChange={e => setMemoStartDate(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="endDate" className="text-sm font-medium">Expected Return Date</label>
                <Input 
                  id="endDate"
                  type="date"
                  value={memoExpectedEndDate}
                  onChange={e => setMemoExpectedEndDate(e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="notes" className="text-sm font-medium">Notes</label>
              <Textarea 
                id="notes"
                placeholder="Add notes about this memo..."
                value={memoNotes}
                onChange={e => setMemoNotes(e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddingMemo(false)}>Cancel</Button>
            <Button onClick={handleSubmitMemo}>
              {isEditingMemo ? "Update Memo" : "Create Memo"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Memo Dialog - Reusing the Add Memo Dialog */}
      <Dialog open={isEditingMemo} onOpenChange={setIsEditingMemo}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Memo</DialogTitle>
            <DialogDescription>
              Update memo information.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="customer" className="text-sm font-medium">Customer</label>
              <Select 
                value={memoCustomerId}
                onValueChange={setMemoCustomerId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a customer" />
                </SelectTrigger>
                <SelectContent>
                  {mockCustomers.map(customer => (
                    <SelectItem key={customer.id} value={customer.id}>
                      {customer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="startDate" className="text-sm font-medium">Start Date</label>
                <Input 
                  id="startDate"
                  type="date"
                  value={memoStartDate}
                  onChange={e => setMemoStartDate(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="endDate" className="text-sm font-medium">Expected Return Date</label>
                <Input 
                  id="endDate"
                  type="date"
                  value={memoExpectedEndDate}
                  onChange={e => setMemoExpectedEndDate(e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="notes" className="text-sm font-medium">Notes</label>
              <Textarea 
                id="notes"
                placeholder="Add notes about this memo..."
                value={memoNotes}
                onChange={e => setMemoNotes(e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditingMemo(false)}>Cancel</Button>
            <Button onClick={handleSubmitMemo}>Update Memo</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DiamondDetail;
