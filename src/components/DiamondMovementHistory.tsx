
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
import { Clock, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DiamondMovementHistoryProps {
  movements: DiamondMovement[] | undefined;
}

const DiamondMovementHistory = ({ movements }: DiamondMovementHistoryProps) => {
  if (!movements || movements.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Movement History</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">No movement history available.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Movement History</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>From</TableHead>
              <TableHead>To</TableHead>
              <TableHead>Handler</TableHead>
              <TableHead>Notes</TableHead>
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
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default DiamondMovementHistory;
