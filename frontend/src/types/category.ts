export type Category = {
  id: number | string;
  name: string;
  slug?: string;
  description?: string;
  is_active?: boolean;
};

export type CreateCategoryPayload = {
  name: string;
  description?: string | null;
  is_active?: boolean;
};

export type UpdateCategoryPayload = Partial<CreateCategoryPayload>;

export default Category;
