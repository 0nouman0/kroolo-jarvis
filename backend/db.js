import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';
import * as schema from './schema.js';

// Load environment variables from parent directory
dotenv.config({ path: '../.env' });

// Create the database connection with retry configuration
const createConnection = () => {
  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    throw new Error('DATABASE_URL environment variable is not set');
  }
  
  console.log('Initializing database connection...');
  
  // Configure Neon with connection options
  const sql = neon(databaseUrl, {
    // Add connection options for better reliability
    fetchConnectionCache: true,
    fullResults: false,
    arrayMode: false,
  });
  
  return drizzle(sql, { 
    schema,
    logger: process.env.NODE_ENV === 'development' ? true : false
  });
};

export const db = createConnection();

// Export the raw sql connection for migration purposes
export const sql = neon(process.env.DATABASE_URL);

// Test database connection
export const testConnection = async () => {
  try {
    console.log('🔌 Testing database connection...');
    
    // Simple test query
    await sql`SELECT 1 as test`;
    
    console.log('✅ Database connection successful');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', {
      message: error.message,
      code: error.code,
      cause: error.cause?.message
    });
    return false;
  }
};
