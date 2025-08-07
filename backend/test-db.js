import { db, testConnection } from './db.js';
import { users, analysisHistory } from './schema.js';
import { eq } from 'drizzle-orm';

async function testDatabase() {
  try {
    console.log('🔍 Testing database schema and operations...');
    
    // Test connection
    const connectionResult = await testConnection();
    if (!connectionResult) {
      console.error('❌ Database connection failed');
      return;
    }
    
    // Test selecting from users table
    console.log('📋 Testing users table...');
    try {
      const userCount = await db.select().from(users).limit(1);
      console.log('✅ Users table accessible, found:', userCount.length, 'users');
    } catch (error) {
      console.error('❌ Users table error:', error.message);
    }
    
    // Test selecting from analysis_history table
    console.log('📋 Testing analysis_history table...');
    try {
      const historyCount = await db.select().from(analysisHistory).limit(1);
      console.log('✅ Analysis history table accessible, found:', historyCount.length, 'records');
    } catch (error) {
      console.error('❌ Analysis history table error:', error.message);
      console.error('Full error:', error);
    }
    
    // Test inserting a sample record
    console.log('📝 Testing insert operation...');
    try {
      const testData = {
        userId: 1, // Assuming user with ID 1 exists
        documentName: 'test-document.pdf',
        documentType: 'application/pdf',
        analysisType: 'policy_analysis',
        industry: 'technology',
        frameworks: ['GDPR', 'HIPAA'],
        organizationDetails: { company: 'Test Corp' },
        analysisResults: { 
          overallScore: 85,
          gaps: [
            { issue: 'Test gap', severity: 'medium', framework: 'GDPR' }
          ]
        },
        gapsFound: 1,
        complianceScore: 85
      };
      
      const result = await db.insert(analysisHistory).values(testData).returning({
        id: analysisHistory.id,
        documentName: analysisHistory.documentName
      });
      
      console.log('✅ Insert test successful:', result[0]);
      
      // Clean up test record
      await db.delete(analysisHistory).where(eq(analysisHistory.id, result[0].id));
      console.log('🧹 Test record cleaned up');
      
    } catch (error) {
      console.error('❌ Insert test failed:', error.message);
      console.error('Full error:', error);
    }
    
  } catch (error) {
    console.error('❌ Database test failed:', error);
  }
}

testDatabase().then(() => {
  console.log('🏁 Database test completed');
  process.exit(0);
}).catch(error => {
  console.error('💥 Test script error:', error);
  process.exit(1);
});
