// Product Types

export type ProductStatus = "active" | "inactive" | "draft" | "archived";

export type ProductType = "classic" | "smart";

export type ProductVariant = {
  id: number;
  product_id: number;
  sku: string;
  name: string;
  attributes: Record<string, string>;
  price: number;
  cost_price?: number;
  quantity: number;
  stock?: number;
  low_stock_threshold?: number;
  is_default?: boolean;
  is_active?: boolean;
  position?: number;
  created_at?: string;
  updated_at?: string;
};

export type ProductImage = {
  id: number;
  product_id: number;
  url: string;
  alt_text?: string;
  position: number;
  is_primary: boolean;
  created_at?: string;
};

export type Product = {
  id: number;
  name: string;
  description?: string | null;
  type: ProductType;
  status: ProductStatus;
  brand_id?: number | null;
  brand_name?: string;
  category_id?: number | null;
  category_name?: string;
  base_price: number;
  cost_price?: number | null;
  tax_rate?: number | null;
  track_inventory: boolean;
  variants: ProductVariant[];
  images: ProductImage[];
  total_quantity: number;
  stock?: number;
  sku?: string;
  price?: number;
  low_stock_threshold?: number | null;
  // Classic watch specific fields
  model_number?: string | null;
  movement_type?: "quartz" | "mechanical" | "automatic" | "digital" | null;
  case_material?: string | null;
  case_diameter_mm?: number | null;
  case_thickness_mm?: number | null;
  band_material?: string | null;
  band_width_mm?: number | null;
  water_resistance_meters?: number | null;
  crystal_type?: string | null;
  warranty_months?: number | null;
  // Smart watch specific fields
  os?: string | null;
  display_type?: string | null;
  display_size_inches?: number | null;
  battery_life_days?: number | null;
  connectivity?: string[];
  sensors?: string[];
  compatible_with?: string[];
  heart_rate_monitor?: boolean;
  gps?: boolean;
  nfc?: boolean;
  created_at?: string;
  updated_at?: string;
};

export type CreateProductPayload = {
  name: string;
  description?: string | null;
  type: ProductType;
  brand_id?: number | null;
  category_id?: number | null;
  base_price: number;
  cost_price?: number | null;
  tax_rate?: number | null;
  track_inventory: boolean;
  is_active?: boolean;
  low_stock_threshold?: number | null;
  // Classic watch specific fields
  model_number?: string | null;
  movement_type?: "quartz" | "mechanical" | "automatic" | "digital" | null;
  case_material?: string | null;
  case_diameter_mm?: number | null;
  case_thickness_mm?: number | null;
  band_material?: string | null;
  band_width_mm?: number | null;
  water_resistance_meters?: number | null;
  crystal_type?: string | null;
  warranty_months?: number | null;
  // Smart watch specific fields
  os?: string | null;
  display_type?: string | null;
  display_size_inches?: number | null;
  battery_life_days?: number | null;
  connectivity?: string[];
  sensors?: string[];
  compatible_with?: string[];
  heart_rate_monitor?: boolean;
  gps?: boolean;
  nfc?: boolean;
  // Initial variant (required)
  initial_variant?: {
    sku: string;
    name: string;
    attributes: Record<string, string>;
    price: number;
    cost_price?: number;
    quantity: number;
    low_stock_threshold?: number;
  };
};

export type UpdateProductPayload = Partial<CreateProductPayload> & {
  status?: ProductStatus;
};

export type CreateVariantPayload = {
  sku: string;
  name: string;
  attributes: Record<string, string>;
  price: number;
  cost_price?: number;
  quantity: number;
  low_stock_threshold?: number;
  is_default?: boolean;
};

export type UpdateVariantPayload = Partial<CreateVariantPayload>;

export type ProductFilters = {
  search?: string;
  brand_id?: number | null;
  category_id?: number | null;
  type?: ProductType | null;
  status?: ProductStatus | null;
  min_price?: number | null;
  max_price?: number | null;
  in_stock?: boolean | null;
  low_stock?: boolean | null;
};

export type ProductListParams = {
  page?: number;
  per_page?: number;
  sort_by?: string;
  sort_order?: "asc" | "desc";
} & ProductFilters;

// Category Types

export type Category = {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  parent_id?: number | null;
  parent_name?: string | null;
  image_url?: string | null;
  position: number;
  is_active: boolean;
  children?: Category[];
  product_count?: number;
  created_at?: string;
  updated_at?: string;
};

export type CategoryTreeNode = Category & {
  level: number;
  has_children: boolean;
};

export type CreateCategoryPayload = {
  name: string;
  slug?: string;
  description?: string | null;
  parent_id?: number | null;
  image_url?: string | null;
  position?: number;
  is_active?: boolean;
};

export type UpdateCategoryPayload = Partial<CreateCategoryPayload>;

// Brand Types

export type Brand = {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  logo_url?: string | null;
  website_url?: string | null;
  country?: string | null;
  is_active: boolean;
  product_count?: number;
  created_at?: string;
  updated_at?: string;
};

export type CreateBrandPayload = {
  name: string;
  slug?: string;
  description?: string | null;
  logo_url?: string | null;
  website_url?: string | null;
  country?: string | null;
  is_active?: boolean;
};

export type UpdateBrandPayload = Partial<CreateBrandPayload>;

// Image Upload Types

export type ImageUploadResponse = {
  id: number;
  url: string;
  filename: string;
  size: number;
  mime_type: string;
};

export type ImageUploadPayload = {
  file: File;
  alt_text?: string;
  position?: number;
};
