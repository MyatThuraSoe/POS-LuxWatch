// Receipt Types

export interface ReceiptTemplate {
  id: number;
  name: string;
  isDefault: boolean;
  headerText?: string;
  footerText?: string;
  showLogo: boolean;
  logoUrl?: string;
  showBarcode: boolean;
  showQRCode: boolean;
  paperSize: '80mm' | '58mm' | 'a4';
  fontSize: 'small' | 'medium' | 'large';
  createdAt: string;
  updatedAt: string;
}

export interface ReceiptData {
  saleId: number;
  receiptNumber: string;
  shopName: string;
  shopAddress?: string;
  shopPhone?: string;
  shopEmail?: string;
  shopLogo?: string;
  customerName?: string;
  customerPhone?: string;
  items: ReceiptItem[];
  subtotal: number;
  discount: number;
  tax: number;
  taxRate: number;
  total: number;
  paymentMethod: string;
  amountPaid: number;
  change: number;
  createdAt: string;
  createdBy: string;
  notes?: string;
  barcodeData?: string;
}

export interface ReceiptItem {
  productName: string;
  productSku: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  tax: number;
  total: number;
}

export interface PrintLog {
  id: number;
  receiptNumber: string;
  saleId: number;
  printedAt: string;
  printedBy: number;
  printedByName: string;
  printerName?: string;
  status: 'success' | 'failed';
}
