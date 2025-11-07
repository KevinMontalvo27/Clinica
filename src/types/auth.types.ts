import type { RoleInfo } from "./user.types";

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface AuthResponse {
    accessToken: string;
    user: User;
}

export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string | RoleInfo;
    isActive: boolean;
    emailVerified: boolean;
}