// Reports Types
export interface SalesReport {
  period: string;
  totalSales: number;
  totalRevenue: number;
  totalItems: number;
  averageOrderValue: number;
  salesByDay: SalesByDay[];
  salesByCategory: SalesByCategory[];
  salesByPaymentMethod: SalesByPaymentMethod[];
  topProducts: TopProduct[];
  topCustomers: TopCustomer[];
}

export interface SalesByDay {
  date: string;
  sales: number;
  revenue: number;
  items: number;
}

export interface SalesByCategory {
  categoryId: number;
  categoryName: string;
  sales: number;
  revenue: number;
  percentage: number;
}

export interface SalesByPaymentMethod {
  method: string;
  count: number;
  total: number;
  percentage: number;
}

export interface TopProduct {
  productId: number;
  name: string;
  sku: string;
  quantitySold: number;
  revenue: number;
}

export interface TopCustomer {
  customerId: number;
  name: string;
  totalPurchases: number;
  totalSpent: number;
}

export interface InventoryReport {
  totalProducts: number;
  totalValue: number;
  lowStockItems: LowStockItem[];
  outOfStockItems: OutOfStockItem[];
  categoryBreakdown: CategoryBreakdown[];
  inventoryMovements: InventoryMovement[];
}

export interface LowStockItem {
  productId: number;
  name: string;
  sku: string;
  currentStock: number;
  minStock: number;
  reorderPoint: number;
}

export interface OutOfStockItem {
  productId: number;
  name: string;
  sku: string;
  lastRestocked?: string;
}

export interface CategoryBreakdown {
  categoryId: number;
  categoryName: string;
  productCount: number;
  totalValue: number;
  percentage: number;
}

export interface InventoryMovement {
  id: number;
  productId: number;
  productName: string;
  type: 'in' | 'out' | 'adjustment' | 'transfer';
  quantity: number;
  reason?: string;
  date: string;
  performedBy: string;
}

export interface FinancialReport {
  period: string;
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  profitMargin: number;
  revenueByCategory: RevenueByCategory[];
  expensesByCategory: ExpensesByCategory[];
  taxCollected: number;
  discountsGiven: number;
}

export interface RevenueByCategory {
  category: string;
  amount: number;
  percentage: number;
}

export interface ExpensesByCategory {
  category: string;
  amount: number;
  percentage: number;
}

export interface EmployeeReport {
  period: string;
  employees: EmployeePerformance[];
}

export interface EmployeePerformance {
  userId: number;
  name: string;
  role: string;
  salesCount: number;
  totalRevenue: number;
  averageOrderValue: number;
  refundsProcessed: number;
  hoursWorked?: number;
}

export interface ReportFilters {
  dateFrom: string;
  dateTo: string;
  categoryId?: number;
  employeeId?: number;
  paymentMethod?: string;
}
