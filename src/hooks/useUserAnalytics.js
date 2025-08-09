import { useState, useEffect } from 'react';
import { authAPI } from '../lib/neondb';
import { useAuth } from '../contexts/AuthContext';

export const useUserAnalytics = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState({
    documentsAnalyzed: 0,
    policiesGenerated: 0,
    totalDocuments: 0,
    gapsFound: 0,
    averageComplianceScore: 0,
    recentActivity: [],
    trendData: {
      documentsThisWeek: 0,
      policiesGeneratedThisWeek: 0,
      gapsResolved: 0,
      improvementPercentage: 0
    },
    complianceDistribution: {
      high: 0,
      medium: 0,
      low: 0
    },
    topFrameworks: [],
    accountAge: 0,
    planUsage: {
      current: 0,
      limit: 10,
      planType: 'Free'
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAnalytics = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Fetch user's analysis history for analytics
      const historyResponse = await authAPI.getAnalysisHistory(1, 100); // Get more data for analytics
      const history = historyResponse.data || [];

      // Calculate analytics
      const documentsAnalyzed = history.filter(item => 
        !item.analysis_type || item.analysis_type === 'policy_analysis'
      ).length;

      const policiesGenerated = history.filter(item => 
        item.analysis_type === 'policy_generation'
      ).length;

      const totalDocuments = documentsAnalyzed + policiesGenerated;

      const totalGaps = history.reduce((sum, item) => sum + (item.gaps_found || 0), 0);

      const scoresWithValues = history.filter(item => 
        item.compliance_score !== null && item.compliance_score !== undefined
      );
      
      const averageScore = scoresWithValues.length > 0 
        ? Math.round(scoresWithValues.reduce((sum, item) => sum + item.compliance_score, 0) / scoresWithValues.length)
        : 0;

      // Calculate recent activity (last 7 days)
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      
      const recentAnalyses = history.filter(item => 
        new Date(item.created_at) >= weekAgo
      );

      const recentPolicyGenerations = recentAnalyses.filter(item => 
        item.analysis_type === 'policy_generation'
      );

      const recentDocumentAnalyses = recentAnalyses.filter(item => 
        !item.analysis_type || item.analysis_type === 'policy_analysis'
      );

      // Calculate compliance score distribution
      const complianceDistribution = {
        high: scoresWithValues.filter(item => item.compliance_score >= 80).length,
        medium: scoresWithValues.filter(item => item.compliance_score >= 60 && item.compliance_score < 80).length,
        low: scoresWithValues.filter(item => item.compliance_score < 60).length
      };

      // Get top frameworks
      const frameworkCounts = {};
      history.forEach(item => {
        if (item.frameworks && Array.isArray(item.frameworks)) {
          item.frameworks.forEach(framework => {
            frameworkCounts[framework] = (frameworkCounts[framework] || 0) + 1;
          });
        }
      });

      const topFrameworks = Object.entries(frameworkCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([framework, count]) => ({ framework, count }));

      // Calculate account age
      const accountCreated = new Date(user.created_at);
      const now = new Date();
      const accountAge = Math.floor((now - accountCreated) / (1000 * 60 * 60 * 24));

      // Generate recent activity with real data
      const recentActivity = history
        .slice(0, 5)
        .map(item => {
          if (item.analysis_type === 'policy_generation') {
            return {
              id: item.id,
              type: 'policy_generation',
              title: `${item.organization_details?.policy_type || item.document_type || 'Policy'} generated`,
              description: `Created for ${item.organization_details?.company_name || 'company'}`,
              timestamp: item.created_at,
              status: 'success',
              score: null
            };
          } else {
            return {
              id: item.id,
              type: 'policy_analysis',
              title: `${item.document_name} analyzed`,
              description: `Found ${item.gaps_found || 0} compliance gaps`,
              timestamp: item.created_at,
              status: item.compliance_score >= 80 ? 'success' : 
                     item.compliance_score >= 60 ? 'warning' : 'error',
              score: item.compliance_score
            };
          }
        });

      // Calculate trends
      const trendData = {
        documentsThisWeek: recentDocumentAnalyses.length,
        policiesGeneratedThisWeek: recentPolicyGenerations.length,
        gapsResolved: Math.max(0, totalGaps - recentDocumentAnalyses.reduce((sum, item) => sum + (item.gaps_found || 0), 0)),
        improvementPercentage: calculateImprovementTrend(history)
      };

      setAnalytics({
        documentsAnalyzed,
        policiesGenerated,
        totalDocuments,
        gapsFound: totalGaps,
        averageComplianceScore: averageScore,
        recentActivity,
        trendData,
        complianceDistribution,
        topFrameworks,
        accountAge,
        planUsage: {
          current: totalDocuments, // Include both analysis and generation in usage
          limit: 10, // Free plan limit
          planType: 'Free'
        }
      });

    } catch (err) {
      console.error('Error fetching user analytics:', err);
      setError('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const calculateImprovementTrend = (history) => {
    if (history.length < 2) return 0;
    
    const sortedHistory = history
      .filter(item => item.compliance_score !== null)
      .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    
    if (sortedHistory.length < 2) return 0;
    
    const firstScore = sortedHistory[0].compliance_score;
    const lastScore = sortedHistory[sortedHistory.length - 1].compliance_score;
    
    return Math.round(((lastScore - firstScore) / firstScore) * 100);
  };

  const refreshAnalytics = () => {
    fetchAnalytics();
  };

  useEffect(() => {
    fetchAnalytics();
  }, [user]);

  return {
    analytics,
    loading,
    error,
    refreshAnalytics
  };
};
