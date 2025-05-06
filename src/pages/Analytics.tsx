import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatCurrency } from "@/lib/utils";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { BarChartIcon, PieChart as PieChartIcon, TrendingUp, DollarSign } from "lucide-react";
import Navbar from "@/components/Navbar";

// Mock data for analytics
const inventoryByShape = [
  { name: "Round", value: 42 },
  { name: "Princess", value: 23 },
  { name: "Cushion", value: 17 },
  { name: "Emerald", value: 12 },
  { name: "Oval", value: 22 },
  { name: "Other", value: 14 },
];

const inventoryByStatus = [
  { name: "Available", value: 82, color: "#22c55e" },
  { name: "Reserved", value: 14, color: "#3b82f6" },
  { name: "On Memo", value: 22, color: "#eab308" },
];

const salesData = [
  { month: "Jan", sales: 120000, count: 7 },
  { month: "Feb", sales: 150000, count: 9 },
  { month: "Mar", sales: 90000, count: 5 },
  { month: "Apr", sales: 170000, count: 10 },
  { month: "May", sales: 140000, count: 8 },
  { month: "Jun", sales: 190000, count: 12 },
];

const stockAgingData = [
  { age: "0-30 days", count: 35, value: 450000 },
  { age: "31-60 days", count: 28, value: 320000 },
  { age: "61-90 days", count: 22, value: 280000 },
  { age: "91-180 days", count: 15, value: 180000 },
  { age: "181+ days", count: 18, value: 220000 },
];

const Analytics = () => {
  const [timeRange, setTimeRange] = useState("6m");
  
  const totalInventoryValue = stockAgingData.reduce((sum, item) => sum + item.value, 0);
  const totalInventoryCount = stockAgingData.reduce((sum, item) => sum + item.count, 0);
  
  const totalSales = salesData.reduce((sum, item) => sum + item.sales, 0);
  const totalSalesCount = salesData.reduce((sum, item) => sum + item.count, 0);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto py-6 px-4 md:px-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Analytics & Reporting</h1>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1m">Last Month</SelectItem>
              <SelectItem value="3m">Last 3 Months</SelectItem>
              <SelectItem value="6m">Last 6 Months</SelectItem>
              <SelectItem value="1y">Last Year</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Inventory Value
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalInventoryValue)}</div>
              <p className="text-xs text-muted-foreground">{totalInventoryCount} diamonds</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Sales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalSales)}</div>
              <p className="text-xs text-muted-foreground">{totalSalesCount} diamonds sold</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Average Diamond Price
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(totalInventoryValue / totalInventoryCount)}
              </div>
              <p className="text-xs text-muted-foreground">Per diamond</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Days in Inventory (Avg)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">75 Days</div>
              <p className="text-xs text-muted-foreground">From procurement to sale</p>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="sales" className="space-y-6">
          <TabsList>
            <TabsTrigger value="sales" className="flex items-center">
              <TrendingUp className="mr-2 h-4 w-4" />
              Sales
            </TabsTrigger>
            <TabsTrigger value="inventory" className="flex items-center">
              <BarChartIcon className="mr-2 h-4 w-4" />
              Inventory 
            </TabsTrigger>
            <TabsTrigger value="aging" className="flex items-center">
              <PieChartIcon className="mr-2 h-4 w-4" />
              Stock Aging
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="sales" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Sales Performance</CardTitle>
                <CardDescription>Monthly sales revenue and volume</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={salesData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                      <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                      <Tooltip formatter={(value, name) => {
                        return name === "sales" ? formatCurrency(value as number) : value;
                      }} />
                      <Legend />
                      <Bar yAxisId="left" dataKey="sales" name="Sales Revenue" fill="#8884d8" />
                      <Bar yAxisId="right" dataKey="count" name="Diamonds Sold" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="inventory" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Inventory by Shape</CardTitle>
                  <CardDescription>Distribution of diamonds by shape</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={inventoryByShape}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" width={80} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" fill="#8884d8" name="Count" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Inventory by Status</CardTitle>
                  <CardDescription>Current status of diamonds in inventory</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={inventoryByStatus}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {inventoryByStatus.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [value, "Count"]} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="aging" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Inventory Aging Report</CardTitle>
                <CardDescription>Time in inventory and valuation by age group</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={stockAgingData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="age" />
                      <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                      <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                      <Tooltip formatter={(value, name) => {
                        return name === "value" ? formatCurrency(value as number) : value;
                      }} />
                      <Legend />
                      <Bar yAxisId="left" dataKey="value" name="Inventory Value" fill="#8884d8" />
                      <Bar yAxisId="right" dataKey="count" name="Diamond Count" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
              <CardFooter>
                <p className="text-sm text-muted-foreground">
                  Diamonds in inventory for longer periods may require price adjustments or special marketing efforts.
                </p>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Analytics;
