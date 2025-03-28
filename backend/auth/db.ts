import { MongoClient } from 'mongodb';
import { secret } from 'encore.dev/config';

// MongoDB connection string secret
const mongoURI = secret('MONGODB_URI');

let client: MongoClient | null = null;

export async function getMongoClient() {
    if (!client) {
        try {
            client = new MongoClient(mongoURI());
            await client.connect();
        } catch (error) {
            console.error('Failed to connect to MongoDB:', error);
            throw error;
        }
    }
    return client;
}

export async function closeMongoConnection() {
    if (client) {
        await client.close();
        client = null;
    }
}

export async function getCollection(name: string) {
    const client = await getMongoClient();
    return client.db('gtd').collection(name);
} 