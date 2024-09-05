export interface Venue {
  id: number;
  name: string;
  city: string;
  street: string;
  postal_code: string;
  country: string;
  image: string | null;
  description: string;
  is_confirmed: boolean;
  created_by_id: number;
}

export enum UserRole {
  ADMIN = "ADMIN",
  MODERATOR = "MODERATOR",
  AUTH_USER = "AUTH_USER",
}

export interface User {
  id: number;
  username: string;
  password: string;
  firstname: string;
  lastname: string;
  email: string;
  birthday: string;
  role: UserRole;
}

export interface Category {
  id: number;
  name: string;
  is_confirmed: boolean;
  parent_category_id: number | null;
}

export interface Event {
  id: number;
  event_start: Date;
  event_end: Date;
  capacity: number;
  image: string;
  name: string;
  is_confirmed: boolean;
  venue_id: number;
  created_by_id: number;
  admission_id: number;
}
