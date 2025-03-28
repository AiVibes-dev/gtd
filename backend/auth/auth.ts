import { api } from 'encore.dev/api';
import { getCollection } from './db';
import { RegisterRequest, LoginRequest, AuthResponse, User, UserResponse } from './types';
import { APIError } from 'encore.dev/api';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { secret } from 'encore.dev/config';
import { WithId } from 'mongodb';

const JWT_SECRET = secret('JWT_SECRET');

// Helper function to hash passwords
async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
}

// Helper function to compare passwords
async function comparePasswords(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
}

// Helper function to generate JWT token
function generateToken(userId: string): string {
    return jwt.sign({ userId }, JWT_SECRET(), { expiresIn: '24h' });
}

// Helper function to convert MongoDB user to response format
function userToResponse(user: WithId<User>): UserResponse {
    return {
        _id: user._id.toString(),
        username: user.username,
        email: user.email,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString()
    };
}

// Register endpoint
export const register = api(
    { method: 'POST', path: '/auth/register' },
    async (req: RegisterRequest): Promise<AuthResponse> => {
        const users = await getCollection('users');
        
        // Check if username already exists
        const existingUser = await users.findOne({ username: req.username });
        if (existingUser) {
            throw APIError.alreadyExists('Username already exists');
        }

        // Hash password
        const hashedPassword = await hashPassword(req.password);

        // Create new user
        const user: Omit<User, '_id'> = {
            username: req.username,
            password: hashedPassword,
            email: req.email,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const result = await users.insertOne(user as any);
        const token = generateToken(result.insertedId.toString());

        // Get the created user
        const createdUser = await users.findOne({ _id: result.insertedId }) as WithId<User> | null;
        if (!createdUser) {
            throw APIError.internal('Failed to retrieve created user');
        }

        return {
            token,
            user: userToResponse(createdUser)
        };
    }
);

// Login endpoint
export const login = api(
    { method: 'POST', path: '/auth/login' },
    async (req: LoginRequest): Promise<AuthResponse> => {
        const users = await getCollection('users');
        
        // Find user by username
        const user = await users.findOne({ username: req.username }) as WithId<User> | null;
        if (!user) {
            throw APIError.notFound('User not found');
        }

        // Verify password
        const isValidPassword = await comparePasswords(req.password, user.password);
        if (!isValidPassword) {
            throw APIError.permissionDenied('Invalid password');
        }

        // Generate token
        const token = generateToken(user._id.toString());

        return {
            token,
            user: userToResponse(user)
        };
    }
); 