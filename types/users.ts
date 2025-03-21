// types/user.ts
import { User } from "@prisma/client";

export type UserRole = "ADMIN" | "CUSTOMER";

export type UserFormData = {
  name?: string;
  email: string;
  password: string;
  role: UserRole;
};

export type UserResponse = Omit<User, "password">;

export type UserUpdateData = {
  name?: string;
  email?: string;
  password?: string;
  role?: UserRole;
};

export type UsersResponse = {
  users: UserResponse[];
  totalCount: number;
  page: number;
  limit: number;
};

export type UserFilters = {
  search?: string;
  role?: UserRole;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};
