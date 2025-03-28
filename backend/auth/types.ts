export interface User {
    _id?: string;
    username: string;
    password: string; // Hashed password
    email: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface RegisterRequest {
    username: string;
    password: string;
    email: string;
}

export interface LoginRequest {
    username: string;
    password: string;
}

export interface AuthResponse {
    token: string;
    user: Omit<User, 'password'>;
} 