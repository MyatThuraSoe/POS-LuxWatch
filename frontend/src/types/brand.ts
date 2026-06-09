export type Brand = {
  id: number | string;
  name: string;
  slug?: string;
  is_active?: boolean;
};

export type CreateBrandPayload = {
  name: string;
  is_active?: boolean;
};

export type UpdateBrandPayload = Partial<CreateBrandPayload>;

export default Brand;
