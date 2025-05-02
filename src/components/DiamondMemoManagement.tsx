
import React from "react";
import { DiamondMemo, Customer } from "@/types/diamond";
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
import { Button } from "@/components/ui/button";
import { ShoppingBag, Check, AlertTriangle, Pencil, Trash } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DiamondMemoManagementProps {
  memos: DiamondMemo[];
  customers: Customer[] | { id: string; name: string }[];
  onMarkReturned?: (memoId: string) => void;
  onMarkSold?: (memoId: string) => void;
  onEditMemo?: (memo: DiamondMemo) => void;
  onDeleteMemo?: (memoId: string) => void;
  diamondView?: boolean;
}

const DiamondMemoManagement = ({ 
  memos, 
  customers,
  onMarkReturned,
  onMarkSold,
  onEditMemo,
  onDeleteMemo,
  diamondView = false
}: DiamondMemoManagementProps) => {
  const getMemoStatusClass = (status: string) => {
    switch(status) {
      case 'Active':
        return 'bg-blue-100 text-blue-800';
      case 'Returned':
        return 'bg-green-100 text-green-800';
      case 'Sold':
        return 'bg-purple-100 text-purple-800';
      case 'Overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCustomerName = (customerId: string) => {
    const customer = customers.find(c => c.id === customerId);
    return customer ? customer.name : 'Unknown';
  };
  
  const isOverdue = (memo: DiamondMemo) => {
    if (memo.status !== 'Active') return false;
    
    const today = new Date();
    const endDate = new Date(memo.expectedEndDate);
    return today > endDate;
  };

  return (
    diamondView ? (
      <>
        {memos.length === 0 ? (
          <p className="text-muted-foreground text-sm">No memos available.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>Expected Return</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {memos.map((memo) => (
                <TableRow key={memo.id}>
                  <TableCell>{getCustomerName(memo.customerId)}</TableCell>
                  <TableCell>{formatDate(memo.startDate)}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {formatDate(memo.expectedEndDate)}
                      {isOverdue(memo) && (
                        <AlertTriangle className="ml-2 h-4 w-4 text-destructive" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getMemoStatusClass(memo.status)}>
                      {memo.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      {memo.status === 'Active' && (
                        <>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => onMarkReturned && onMarkReturned(memo.id)}
                          >
                            <Check className="mr-1 h-3 w-3" />
                            Return
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => onMarkSold && onMarkSold(memo.id)}
                          >
                            Sold
                          </Button>
                        </>
                      )}
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => onEditMemo && onEditMemo(memo)}
                      >
                        <Pencil className="h-3 w-3" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-destructive"
                        onClick={() => onDeleteMemo && onDeleteMemo(memo.id)}
                      >
                        <Trash className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </>
    ) : (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>
            <div className="flex items-center">
              <ShoppingBag className="mr-2 h-5 w-5" />
              Memo Management
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {memos.length === 0 ? (
            <p className="text-muted-foreground text-sm">No memos available.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>Expected Return</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {memos.map((memo) => (
                  <TableRow key={memo.id}>
                    <TableCell>{getCustomerName(memo.customerId)}</TableCell>
                    <TableCell>{formatDate(memo.startDate)}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {formatDate(memo.expectedEndDate)}
                        {isOverdue(memo) && (
                          <AlertTriangle className="ml-2 h-4 w-4 text-destructive" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getMemoStatusClass(memo.status)}>
                        {memo.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        {memo.status === 'Active' && (
                          <>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => onMarkReturned && onMarkReturned(memo.id)}
                            >
                              <Check className="mr-1 h-3 w-3" />
                              Return
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => onMarkSold && onMarkSold(memo.id)}
                            >
                              Sold
                            </Button>
                          </>
                        )}
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => onEditMemo && onEditMemo(memo)}
                        >
                          <Pencil className="h-3 w-3" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-destructive"
                          onClick={() => onDeleteMemo && onDeleteMemo(memo.id)}
                        >
                          <Trash className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    )
  );
};

export default DiamondMemoManagement;
