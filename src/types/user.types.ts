import type { User } from "./auth.types";

export type UserRole = 'ADMIN' | 'DOCTOR' | 'PATIENT';

export interface RoleInfo {
    id: string;
    name: UserRole;
}

export interface UserDetails extends Omit<User, 'role'> {
    phone?: string;
    dateOfBirth?: Date;
    gender?: string;
    address?: string;
    role: RoleInfo;
    createdAt: Date;
    updatedAt: Date;
    }