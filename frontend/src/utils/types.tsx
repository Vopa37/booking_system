export interface CreateVenueType {
  name: string;
  city: string;
  street: string;
  postal_code: string;
  country: string;
  description: string;
  image: File | null;
}

export interface CreateUserType {
  firstname: string;
  lastname: string;
  email: string;
  birthday: Date | undefined;
  username: string;
  password: string;
  role: string;
}
