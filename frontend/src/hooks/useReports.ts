import { useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/services/api';
import type { SalesReport, InventoryReport, FinancialReport, EmployeeReport, ReportFilters } from '@/types/reports';

const REPORTS_QUERY_KEY = 'reports';

export function useReports(reportType?: string, dateRange?: string) {
  const queryClient = useQueryClient();
  
  const filters: ReportFilters | undefined = dateRange ? {
    dateFrom: new Date().toISOString().split('T')[0],
    dateTo: new Date().toISOString().split('T')[0],
  } : undefined;

  const { data: salesReport, isLoading: isSalesLoading } = useQuery<SalesReport, Error>({
    queryKey: [REPORTS_QUERY_KEY, 'sales', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.dateFrom) params.append('dateFrom', filters.dateFrom);
      if (filters?.dateTo) params.append('dateTo', filters.dateTo);
      if (filters?.categoryId) params.append('categoryId', filters.categoryId.toString());
      if (filters?.employeeId) params.append('employeeId', filters.employeeId.toString());
      if (filters?.paymentMethod) params.append('paymentMethod', filters.paymentMethod);
      
      const response = await apiClient.get(`/reports/sales?${params.toString()}`);
      return response.data;
    },
    enabled: reportType === 'sales',
  });

  const { data: inventoryReport, isLoading: isInventoryLoading } = useQuery<InventoryReport, Error>({
    queryKey: [REPORTS_QUERY_KEY, 'inventory', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.dateFrom) params.append('dateFrom', filters.dateFrom);
      if (filters?.dateTo) params.append('dateTo', filters.dateTo);
      
      const response = await apiClient.get(`/reports/inventory?${params.toString()}`);
      return response.data;
    },
    enabled: reportType === 'inventory',
  });

  const { data: financialReport, isLoading: isFinancialLoading } = useQuery<FinancialReport, Error>({
    queryKey: [REPORTS_QUERY_KEY, 'financial', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.dateFrom) params.append('dateFrom', filters.dateFrom);
      if (filters?.dateTo) params.append('dateTo', filters.dateTo);
      
      const response = await apiClient.get(`/reports/financial?${params.toString()}`);
      return response.data;
    },
    enabled: reportType === 'financial',
  });

  const { data: employeeReport, isLoading: isEmployeeLoading } = useQuery<EmployeeReport, Error>({
    queryKey: [REPORTS_QUERY_KEY, 'employee', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.dateFrom) params.append('dateFrom', filters.dateFrom);
      if (filters?.dateTo) params.append('dateTo', filters.dateTo);
      if (filters?.employeeId) params.append('employeeId', filters.employeeId.toString());
      
      const response = await apiClient.get(`/reports/employees?${params.toString()}`);
      return response.data;
    },
    enabled: reportType === 'employee',
  });

  const { data: productReport, isLoading: isProductLoading } = useQuery({
    queryKey: [REPORTS_QUERY_KEY, 'products', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.dateFrom) params.append('dateFrom', filters.dateFrom);
      if (filters?.dateTo) params.append('dateTo', filters.dateTo);
      if (filters?.categoryId) params.append('categoryId', filters.categoryId.toString());
      
      const response = await apiClient.get(`/reports/products?${params.toString()}`);
      return response.data;
    },
    enabled: reportType === 'products',
  });

  return {
    salesReport,
    inventoryReport,
    financialReport,
    employeeReport,
    productReport,
    isLoading: isSalesLoading || isInventoryLoading || isFinancialLoading || isEmployeeLoading || isProductLoading,
    refetchReports: () => queryClient.invalidateQueries({ queryKey: [REPORTS_QUERY_KEY] }),
  };
}
