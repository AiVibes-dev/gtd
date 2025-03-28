import { api } from 'encore.dev/api';
import { getCollection } from './db';
import { RegisterRequest, LoginRequest, AuthResponse, User } from './types';
import { APIError } from 'encore.dev/api';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { secret } from 'encore.dev/config';

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
        const user: User = {
            username: req.username,
            password: hashedPassword,
            email: req.email,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const result = await users.insertOne(user);
        const token = generateToken(result.insertedId.toString());

        // Return user without password
        const { password, ...userWithoutPassword } = user;
        return {
            token,
            user: userWithoutPassword
        };
    }
);

// Login endpoint
export const login = api(
    { method: 'POST', path: '/auth/login' },
    async (req: LoginRequest): Promise<AuthResponse> => {
        const users = await getCollection('users');
        
        // Find user by username
        const user = await users.findOne({ username: req.username });
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

        // Return user without password
        const { password, ...userWithoutPassword } = user;
        return {
            token,
            user: userWithoutPassword
        };
    }
); 