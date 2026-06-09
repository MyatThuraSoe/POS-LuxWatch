export type SelectOption<TValue extends string | number = string> = {
  label: string;
  value: TValue;
};

export type StatusVariant = "default" | "success" | "warning" | "danger";
