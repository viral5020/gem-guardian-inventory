
import React from "react";
import { DiamondMovement } from "@/types/diamond";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Clock, ArrowRight, Pencil, Trash } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface DiamondMovementHistoryProps {
  movements: DiamondMovement[] | undefined;
  onEditMovement?: (movement: DiamondMovement) => void;
  onDeleteMovement?: (movementId: string) => void;
}

const DiamondMovementHistory = ({ 
  movements,
  onEditMovement,
  onDeleteMovement
}: DiamondMovementHistoryProps) => {
  if (!movements || movements.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">No movement history available.</p>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>From</TableHead>
          <TableHead>To</TableHead>
          <TableHead>Handler</TableHead>
          <TableHead>Notes</TableHead>
          {(onEditMovement || onDeleteMovement) && (
            <TableHead className="text-right">Actions</TableHead>
          )}
        </TableRow>
      </TableHeader>
      <TableBody>
        {movements.map((movement) => (
          <TableRow key={movement.id}>
            <TableCell className="whitespace-nowrap">
              <div className="flex items-center">
                <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                {formatDate(movement.date)}
              </div>
            </TableCell>
            <TableCell>
              <Badge variant="outline">{movement.fromLocation}</Badge>
            </TableCell>
            <TableCell>
              <div className="flex items-center">
                <ArrowRight className="mr-2 h-4 w-4 text-muted-foreground" />
                <Badge>{movement.toLocation}</Badge>
              </div>
            </TableCell>
            <TableCell>{movement.handledBy}</TableCell>
            <TableCell className="max-w-[200px] truncate">
              {movement.notes || '-'}
            </TableCell>
            {(onEditMovement || onDeleteMovement) && (
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  {onEditMovement && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => onEditMovement(movement)}
                    >
                      <Pencil className="h-3 w-3" />
                    </Button>
                  )}
                  {onDeleteMovement && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-destructive"
                      onClick={() => onDeleteMovement(movement.id)}
                    >
                      <Trash className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default DiamondMovementHistory;
