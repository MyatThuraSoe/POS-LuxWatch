import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Calendar, Download, TrendingUp, DollarSign, ShoppingCart, Users } from 'lucide-react';

const ReportsPage: React.FC = () => {
  const [dateRange, setDateRange] = useState('30');

  // Mock data for charts
  const salesData = [
    { date: 'Jan', sales: 45000 },
    { date: 'Feb', sales: 52000 },
    { date: 'Mar', sales: 48000 },
    { date: 'Apr', sales: 61000 },
    { date: 'May', sales: 55000 },
    { date: 'Jun', sales: 67000 },
  ];

  const productCategoryData = [
    { name: 'Classic Watches', value: 45, color: '#1e40af' },
    { name: 'Smart Watches', value: 30, color: '#10b981' },
    { name: 'Accessories', value: 15, color: '#f59e0b' },
    { name: 'Repairs', value: 10, color: '#f43f5e' },
  ];

  const topProductsData = [
    { name: 'Rolex Submariner', sales: 25 },
    { name: 'Apple Watch Ultra', sales: 42 },
    { name: 'Omega Seamaster', sales: 18 },
    { name: 'Samsung Galaxy Watch', sales: 35 },
    { name: 'TAG Heuer Carrera', sales: 12 },
  ];

  const inventoryData = [
    { category: 'Classic', inStock: 120, lowStock: 8, outOfStock: 2 },
    { category: 'Smart', inStock: 85, lowStock: 12, outOfStock: 3 },
    { category: 'Accessories', inStock: 200, lowStock: 15, outOfStock: 5 },
  ];

  const kpiCards = [
    { title: 'Total Sales', value: '$328,000', change: '+12.5%', icon: DollarSign, color: 'text-green-500' },
    { title: 'Orders', value: '1,247', change: '+8.3%', icon: ShoppingCart, color: 'text-blue-500' },
    { title: 'Customers', value: '856', change: '+15.2%', icon: Users, color: 'text-purple-500' },
    { title: 'Avg Order Value', value: '$263', change: '+4.1%', icon: TrendingUp, color: 'text-orange-500' },
  ];

  return (
    <div className="container mx-auto py-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Reports Dashboard</h1>
        <div className="flex gap-2">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="p-2 border rounded-md"
          >
            <option value="7">Last 7 Days</option>
            <option value="30">Last 30 Days</option>
            <option value="90">Last 90 Days</option>
            <option value="365">Last Year</option>
            <option value="custom">Custom Range</option>
          </select>
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" /> Date Range
          </Button>
          <Button>
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {kpiCards.map((kpi, index) => (
          <Card key={index}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{kpi.title}</p>
                  <p className="text-2xl font-bold">{kpi.value}</p>
                  <p className={`text-xs ${kpi.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                    {kpi.change} from last period
                  </p>
                </div>
                <kpi.icon className={`h-8 w-8 ${kpi.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <Tabs defaultValue="sales" className="space-y-4">
        <TabsList>
          <TabsTrigger value="sales">Sales Report</TabsTrigger>
          <TabsTrigger value="products">Product Performance</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
        </TabsList>

        <TabsContent value="sales">
          <Card>
            <CardHeader>
              <CardTitle>Sales Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="sales" stroke="#1e40af" strokeWidth={2} name="Sales ($)" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Sales by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={productCategoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {productCategoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Top Products</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={topProductsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="sales" fill="#10b981" name="Units Sold" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="inventory">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Status by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={inventoryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="inStock" fill="#10b981" name="In Stock" />
                  <Bar dataKey="lowStock" fill="#f59e0b" name="Low Stock" />
                  <Bar dataKey="outOfStock" fill="#f43f5e" name="Out of Stock" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="financial">
          <Card>
            <CardHeader>
              <CardTitle>Financial Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between p-4 bg-muted rounded-lg">
                  <span className="font-medium">Total Revenue</span>
                  <span className="font-bold text-green-500">$328,000</span>
                </div>
                <div className="flex justify-between p-4 bg-muted rounded-lg">
                  <span className="font-medium">Cost of Goods Sold</span>
                  <span className="font-bold">$197,000</span>
                </div>
                <div className="flex justify-between p-4 bg-muted rounded-lg">
                  <span className="font-medium">Gross Profit</span>
                  <span className="font-bold text-green-500">$131,000</span>
                </div>
                <div className="flex justify-between p-4 bg-primary text-primary-foreground rounded-lg">
                  <span className="font-medium">Profit Margin</span>
                  <span className="font-bold">40.0%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportsPage;
