import { db } from './db.js';
import { users, analysisHistory } from './schema.js';
import { eq } from 'drizzle-orm';

async function checkUsers() {
  try {
    console.log('🔍 Checking existing users...');
    
    const existingUsers = await db.select({
      id: users.id,
      email: users.email,
      firstName: users.firstName,
      lastName: users.lastName
    }).from(users);
    
    console.log('Found users:', existingUsers);
    
    if (existingUsers.length > 0) {
      const testUserId = existingUsers[0].id;
      console.log(`\n📝 Testing with user ID: ${testUserId}`);
      
      const testData = {
        userId: testUserId,
        documentName: 'test-document.pdf',
        documentType: 'application/pdf',
        analysisType: 'policy_analysis',
        industry: 'technology',
        frameworks: ['GDPR', 'HIPAA'], // This should now work as jsonb
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
        documentName: analysisHistory.documentName,
        frameworks: analysisHistory.frameworks
      });
      
      console.log('✅ Insert test successful:', result[0]);
      console.log('Frameworks stored as:', result[0].frameworks);
      
      // Clean up test record
      await db.delete(analysisHistory).where(eq(analysisHistory.id, result[0].id));
      console.log('🧹 Test record cleaned up');
    } else {
      console.log('❌ No users found in database');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Full error:', error);
  }
}

checkUsers().then(() => {
  console.log('🏁 User check completed');
  process.exit(0);
}).catch(error => {
  console.error('💥 Test script error:', error);
  process.exit(1);
});
