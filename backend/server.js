import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { eq, desc, count, and } from 'drizzle-orm';
import { db, testConnection } from './db.js';
import { users, analysisHistory } from './schema.js';

// Load environment variables
dotenv.config({ path: '../.env' });

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Routes

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Poligap API is running' });
});

// Sign up
app.post('/auth/signup', async (req, res) => {
  try {
    console.log('🔵 Signup request received:', { email: req.body.email, hasPassword: !!req.body.password });
    
    const { email, password, first_name, last_name, company } = req.body;

    if (!email || !password) {
      console.log('❌ Validation failed: missing email or password');
      return res.status(400).json({ message: 'Email and password are required' });
    }

    console.log('🔍 Checking if user exists:', email);
    // Check if user already exists
    const existingUser = await db.select().from(users).where(eq(users.email, email));

    if (existingUser.length > 0) {
      console.log('❌ User already exists:', email);
      return res.status(400).json({ message: 'User with this email already exists' });
    }
    console.log('✅ User doesn\'t exist, proceeding with creation');

    // Hash password
    console.log('🔐 Hashing password...');
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    console.log('✅ Password hashed successfully');

    // Create user
    console.log('💾 Inserting user into database...');
    const newUser = await db.insert(users).values({
      email,
      passwordHash,
      firstName: first_name || null,
      lastName: last_name || null,
      company: company || null
    }).returning({
      id: users.id,
      email: users.email,
      firstName: users.firstName,
      lastName: users.lastName,
      company: users.company,
      createdAt: users.createdAt
    });
    
    console.log('✅ User inserted successfully:', { id: newUser[0].id, email: newUser[0].email });

    const user = newUser[0];

    // Generate JWT token
    console.log('🎫 Generating JWT token...');
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    console.log('✅ JWT token generated successfully');

    console.log('🎉 Signup completed successfully for:', user.email);
    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user.id,
        email: user.email,
        first_name: user.firstName,
        last_name: user.lastName,
        company: user.company,
        created_at: user.createdAt
      }
    });
  } catch (error) {
    console.error('❌ Signup error:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      detail: error.detail
    });
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Sign in
app.post('/auth/signin', async (req, res) => {
  try {
    console.log('🔵 Signin request received:', { email: req.body.email, hasPassword: !!req.body.password });
    
    const { email, password } = req.body;

    if (!email || !password) {
      console.log('❌ Validation failed: missing email or password');
      return res.status(400).json({ message: 'Email and password are required' });
    }

    console.log('🔍 Looking for user:', email);
    // Find user
    const userResult = await db.select().from(users).where(eq(users.email, email));

    if (userResult.length === 0) {
      console.log('❌ User not found:', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = userResult[0];
    console.log('✅ User found:', { id: user.id, email: user.email });

    // Verify password
    console.log('🔐 Verifying password...');
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);

    if (!isValidPassword) {
      console.log('❌ Invalid password for user:', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log('✅ Password verified successfully');

    // Generate JWT token
    console.log('🎫 Generating JWT token...');
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    console.log('✅ JWT token generated successfully');

    console.log('🎉 Signin completed successfully for:', user.email);
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        first_name: user.firstName,
        last_name: user.lastName,
        company: user.company,
        created_at: user.createdAt
      }
    });
  } catch (error) {
    console.error('❌ Signin error:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      detail: error.detail
    });
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get user profile
app.get('/auth/profile', authenticateToken, async (req, res) => {
  try {
    const userResult = await db.select().from(users).where(eq(users.id, req.user.userId));

    if (userResult.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = userResult[0];
    res.json({
      user: {
        id: user.id,
        email: user.email,
        first_name: user.firstName,
        last_name: user.lastName,
        company: user.company,
        created_at: user.createdAt,
        updated_at: user.updatedAt
      }
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update user profile
app.put('/auth/profile', authenticateToken, async (req, res) => {
  try {
    const { first_name, last_name, company } = req.body;
    
    const updatedUser = await db.update(users)
      .set({
        firstName: first_name || null,
        lastName: last_name || null,
        company: company || null,
        updatedAt: new Date()
      })
      .where(eq(users.id, req.user.userId))
      .returning();

    if (updatedUser.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = updatedUser[0];
    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user.id,
        email: user.email,
        first_name: user.firstName,
        last_name: user.lastName,
        company: user.company,
        created_at: user.createdAt,
        updated_at: user.updatedAt
      }
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Sign out (client-side token removal is sufficient, but this endpoint can be used for logging)
app.post('/auth/signout', authenticateToken, (req, res) => {
  res.json({ message: 'Signed out successfully' });
});

// Password reset (basic implementation)
app.post('/auth/reset-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Check if user exists
    const userResult = await db.select({ id: users.id }).from(users).where(eq(users.email, email));

    if (userResult.length === 0) {
      // Don't reveal if email exists for security
      return res.json({ message: 'If an account with this email exists, you will receive password reset instructions.' });
    }

    // TODO: Implement actual email sending logic here
    // For now, just return success message
    res.json({ message: 'If an account with this email exists, you will receive password reset instructions.' });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Save policy analysis to history
app.post('/api/analysis/save', authenticateToken, async (req, res) => {
  try {
    console.log('Received analysis save request:', {
      body_keys: Object.keys(req.body),
      document_name: req.body.document_name,
      document_type: req.body.document_type,
      analysis_results_present: !!req.body.analysis_results,
      user_id: req.user.userId
    });

    const { 
      document_name, 
      document_type, 
      analysis_type,
      industry, 
      frameworks, 
      organization_details,
      analysis_results, 
      gaps_found, 
      compliance_score 
    } = req.body;

    console.log('Extracted request data:', {
      document_name,
      document_type,
      analysis_type,
      industry,
      frameworks: frameworks?.length || 0,
      organization_details: !!organization_details,
      analysis_results: !!analysis_results,
      gaps_found,
      compliance_score
    });

    if (!document_name || !analysis_results) {
      console.log('Validation failed:', {
        document_name_missing: !document_name,
        document_name_value: document_name,
        document_name_type: typeof document_name,
        document_name_length: document_name ? document_name.length : 0,
        analysis_results_missing: !analysis_results,
        analysis_results_type: typeof analysis_results,
        analysis_results_value: analysis_results,
        analysis_results_keys: analysis_results ? Object.keys(analysis_results) : 'N/A'
      });
      return res.status(400).json({ 
        message: 'Document name and analysis results are required',
        details: {
          document_name_provided: !!document_name,
          analysis_results_provided: !!analysis_results
        }
      });
    }

    // Retry database operation with exponential backoff
    let savedAnalysis;
    let retryCount = 0;
    const maxRetries = 3;
    
    while (retryCount < maxRetries) {
      try {
        console.log(`Attempting database insert (attempt ${retryCount + 1}/${maxRetries})`);
        
        savedAnalysis = await db.insert(analysisHistory).values({
          userId: req.user.userId,
          documentName: document_name,
          documentType: document_type || null,
          analysisType: analysis_type || 'policy_analysis',
          industry: industry || null,
          frameworks: frameworks || [],
          organizationDetails: organization_details || {},
          analysisResults: analysis_results,
          gapsFound: gaps_found || 0,
          complianceScore: compliance_score || 0
        }).returning({
          id: analysisHistory.id,
          documentName: analysisHistory.documentName,
          createdAt: analysisHistory.createdAt
        });
        
        console.log('Database insert successful:', savedAnalysis[0]);
        break; // Success, exit retry loop
        
      } catch (dbError) {
        retryCount++;
        console.error(`Database operation failed (attempt ${retryCount}/${maxRetries}):`, {
          error: dbError.message,
          code: dbError.code,
          cause: dbError.cause?.message,
          stack: dbError.stack?.split('\n').slice(0, 3)
        });
        
        if (retryCount >= maxRetries) {
          throw dbError; // Re-throw after max retries
        }
        
        // Wait before retry (exponential backoff)
        const delay = Math.pow(2, retryCount) * 1000; // 2s, 4s, 8s
        console.log(`Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    res.status(201).json({
      message: 'Analysis saved to history successfully',
      analysis: {
        id: savedAnalysis[0].id,
        document_name: savedAnalysis[0].documentName,
        created_at: savedAnalysis[0].createdAt
      }
    });
  } catch (error) {
    console.error('Save analysis error:', {
      message: error.message,
      code: error.code,
      cause: error.cause?.message,
      stack: error.stack?.split('\n').slice(0, 5)
    });
    res.status(500).json({ 
      message: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? {
        error: error.message,
        code: error.code
      } : undefined
    });
  }
});

// Get user's analysis history
app.get('/api/analysis/history', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const history = await db.select({
      id: analysisHistory.id,
      documentName: analysisHistory.documentName,
      documentType: analysisHistory.documentType,
      analysisType: analysisHistory.analysisType,
      industry: analysisHistory.industry,
      frameworks: analysisHistory.frameworks,
      organizationDetails: analysisHistory.organizationDetails,
      gapsFound: analysisHistory.gapsFound,
      complianceScore: analysisHistory.complianceScore,
      createdAt: analysisHistory.createdAt
    })
    .from(analysisHistory)
    .where(eq(analysisHistory.userId, req.user.userId))
    .orderBy(desc(analysisHistory.createdAt))
    .limit(parseInt(limit))
    .offset(parseInt(offset));

    const totalCountResult = await db.select({ count: count() })
      .from(analysisHistory)
      .where(eq(analysisHistory.userId, req.user.userId));

    // Convert snake_case to match frontend expectations
    const formattedHistory = history.map(item => ({
      id: item.id,
      document_name: item.documentName,
      document_type: item.documentType,
      analysis_type: item.analysisType,
      industry: item.industry,
      frameworks: item.frameworks,
      organization_details: item.organizationDetails,
      gaps_found: item.gapsFound,
      compliance_score: item.complianceScore,
      created_at: item.createdAt
    }));

    res.json({
      history: formattedHistory,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalCountResult[0].count,
        pages: Math.ceil(totalCountResult[0].count / limit)
      }
    });
  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get specific analysis details
app.get('/api/analysis/history/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const analysisResult = await db.select()
      .from(analysisHistory)
      .where(and(eq(analysisHistory.id, parseInt(id)), eq(analysisHistory.userId, req.user.userId)));

    if (analysisResult.length === 0) {
      return res.status(404).json({ message: 'Analysis not found' });
    }

    const analysis = analysisResult[0];
    res.json({
      analysis: {
        id: analysis.id,
        user_id: analysis.userId,
        document_name: analysis.documentName,
        document_type: analysis.documentType,
        analysis_type: analysis.analysisType,
        industry: analysis.industry,
        frameworks: analysis.frameworks,
        organization_details: analysis.organizationDetails,
        analysis_results: analysis.analysisResults,
        gaps_found: analysis.gapsFound,
        compliance_score: analysis.complianceScore,
        created_at: analysis.createdAt
      }
    });
  } catch (error) {
    console.error('Get analysis details error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete analysis from history
app.delete('/api/analysis/history/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const deletedAnalysis = await db.delete(analysisHistory)
      .where(and(eq(analysisHistory.id, parseInt(id)), eq(analysisHistory.userId, req.user.userId)))
      .returning({
        id: analysisHistory.id,
        documentName: analysisHistory.documentName
      });

    if (deletedAnalysis.length === 0) {
      return res.status(404).json({ message: 'Analysis not found' });
    }

    res.json({
      message: 'Analysis deleted successfully',
      analysis: {
        id: deletedAnalysis[0].id,
        document_name: deletedAnalysis[0].documentName
      }
    });
  } catch (error) {
    console.error('Delete analysis error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
const startServer = async () => {
  try {
    // Test database connection with retry logic
    let connectionEstablished = false;
    const maxRetries = 3;
    
    for (let i = 0; i < maxRetries; i++) {
      const isConnected = await testConnection();
      if (isConnected) {
        connectionEstablished = true;
        break;
      }
      
      if (i < maxRetries - 1) {
        console.log(`Retrying connection in 2 seconds... (${i + 1}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
    
    if (!connectionEstablished) {
      throw new Error('Failed to establish database connection after retries');
    }
    
    app.listen(PORT, () => {
      console.log(`🚀 Poligap API server running on http://localhost:${PORT}`);
      console.log(`📊 Database: Connected to Neon with Drizzle ORM`);
      console.log(`🔧 Using Drizzle ORM for type-safe database operations`);
    });
  } catch (error) {
    console.error('❌ Server startup failed:', {
      message: error.message,
      stack: error.stack?.split('\n').slice(0, 3)
    });
    process.exit(1);
  }
};

startServer().catch(console.error);
