export interface ShopSettings {
  name: string;
  address: string;
  phone: string;
  email: string;
  logo?: string;
  currency: string;
  timezone: string;
  locale: string;
}

export interface TaxSettings {
  enabled: boolean;
  rate: number;
  type: 'inclusive' | 'exclusive';
  label: string;
  taxId?: string;
}

export interface ReceiptSettings {
  header: string;
  footer: string;
  showTax: boolean;
  showDiscount: boolean;
  showCustomer: boolean;
  showCashier: boolean;
  copies: number;
  paperSize: '80mm' | '58mm';
}

export interface PrinterSettings {
  enabled: boolean;
  type: 'thermal' | 'laser' | 'inkjet';
  name?: string;
  ip?: string;
  port?: number;
  autoPrint: boolean;
  printReceipt: boolean;
  printInvoice: boolean;
}

export interface BarcodeSettings {
  enabled: boolean;
  prefix: string;
  suffix: string;
  generator: 'ean13' | 'code128' | 'upc';
  printOnCreate: boolean;
}

export interface PreferenceSettings {
  darkMode: boolean;
  language: string;
  dateFormat: string;
  timeFormat: '12h' | '24h';
  itemsPerPage: number;
  confirmDelete: boolean;
  soundEnabled: boolean;
}

export interface SystemSettings {
  version: string;
  lastBackup?: string;
  autoUpdate: boolean;
  maintenanceMode: boolean;
  apiEndpoint: string;
}

export interface AllSettings {
  shop: ShopSettings;
  tax: TaxSettings;
  receipt: ReceiptSettings;
  printer: PrinterSettings;
  barcode: BarcodeSettings;
  preferences: PreferenceSettings;
  system: SystemSettings;
}

export type SettingsCategory = keyof AllSettings;
