import jwt from 'jsonwebtoken';
import { Pool } from '@neondatabase/serverless';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Middleware to verify JWT token
function verifyToken(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('No token provided');
  }

  const token = authHeader.substring(7);
  return jwt.verify(token, process.env.JWT_SECRET);
}

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const decoded = verifyToken(req);
    const userId = decoded.userId;

    if (req.method === 'GET') {
      // Get user profile - updated to match actual database schema
      const userQuery = 'SELECT id, email, first_name, last_name, company, created_at FROM users WHERE id = $1';
      const userResult = await pool.query(userQuery, [userId]);

      if (userResult.rows.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }

      const user = userResult.rows[0];
      res.status(200).json({
        user: {
          id: user.id,
          email: user.email,
          first_name: user.first_name || '',
          last_name: user.last_name || '',
          company: user.company || '',
          created_at: user.created_at
        }
      });

    } else if (req.method === 'PUT') {
      // Update user profile - updated to match actual database schema
      const { first_name, last_name, company } = req.body;
      
      const updateQuery = `
        UPDATE users 
        SET first_name = $1, last_name = $2, company = $3, updated_at = NOW()
        WHERE id = $4
        RETURNING id, email, first_name, last_name, company, created_at
      `;
      
      const result = await pool.query(updateQuery, [first_name, last_name, company, userId]);
      
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }

      const user = result.rows[0];
      res.status(200).json({
        message: 'Profile updated successfully',
        user: {
          id: user.id,
          email: user.email,
          first_name: user.first_name || '',
          last_name: user.last_name || '',
          company: user.company || '',
          created_at: user.created_at
        }
      });

    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }

  } catch (error) {
    console.error('Profile error:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
}
