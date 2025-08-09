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
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const decoded = verifyToken(req);
    const userId = decoded.userId;

    if (req.method === 'POST') {
      // Save analysis
      const analysisData = req.body;
      
      const insertQuery = `
        INSERT INTO analysis_history (user_id, title, analysis_data, compliance_score, gaps_found, created_at)
        VALUES ($1, $2, $3, $4, $5, NOW())
        RETURNING id, title, compliance_score, gaps_found, created_at
      `;
      
      const result = await pool.query(insertQuery, [
        userId,
        analysisData.title || 'Policy Analysis',
        JSON.stringify(analysisData),
        analysisData.complianceScore || 0,
        analysisData.gapsFound || 0
      ]);

      res.status(201).json({
        message: 'Analysis saved successfully',
        analysis: result.rows[0]
      });

    } else if (req.method === 'GET') {
      // Get analysis history
      const page = parseInt(req.query.page || '1');
      const limit = parseInt(req.query.limit || '10');
      const offset = (page - 1) * limit;

      const historyQuery = `
        SELECT id, title, compliance_score, gaps_found, created_at
        FROM analysis_history 
        WHERE user_id = $1 
        ORDER BY created_at DESC 
        LIMIT $2 OFFSET $3
      `;
      
      const result = await pool.query(historyQuery, [userId, limit, offset]);

      res.status(200).json({
        analyses: result.rows,
        page,
        limit,
        total: result.rowCount
      });

    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }

  } catch (error) {
    console.error('Analysis API error:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
}
