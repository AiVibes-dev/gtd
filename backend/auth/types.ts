import { ObjectId } from 'mongodb';

export interface User {
    _id?: ObjectId;
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

export interface UserResponse {
    _id: string;
    username: string;
    email: string;
    createdAt: string;
    updatedAt: string;
}

export interface AuthResponse {
    token: string;
    user: UserResponse;
} 