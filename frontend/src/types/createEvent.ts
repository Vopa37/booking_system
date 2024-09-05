import { UseFormWatch } from "react-hook-form";

export interface CategoryCheckboxProps {
  category: CategoriesData;
  checkedCategories: number[];
  categories: CategoriesData[];
  onCheckedChange(id: number): (checked: boolean) => void;
}

export interface VenuesData {
  id: number;
  name: string;
}

export interface CategoriesData {
  id: number;
  name: string;
  parent_category_id?: number;
}

export interface Admission {
  price: number;
  currency: any;
  type: string;
}

export interface FormValues {
  name: string;
  event_start: Date | undefined;
  event_end: Date | undefined;
  venue_id: string;
  image: File | null;
  created_by_id: number;
  capacity: number;
  admissions: Admission[];
  categories: number[];
}
