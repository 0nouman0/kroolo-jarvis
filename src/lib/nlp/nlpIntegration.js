/**
 * NLP Integration Helper for Poligap
 * Provides easy-to-use functions for integrating NLP capabilities with existing components
 */

import { EntityExtractor, FrameworkSuggester } from './frameworkSuggester.js';

/**
 * Singleton instances for performance
 */
let entityExtractorInstance = null;
let frameworkSuggesterInstance = null;

/**
 * Get or create entity extractor instance
 * @returns {EntityExtractor} - Entity extractor instance
 */
function getEntityExtractor() {
  if (!entityExtractorInstance) {
    entityExtractorInstance = new EntityExtractor();
  }
  return entityExtractorInstance;
}

/**
 * Get or create framework suggester instance
 * @returns {FrameworkSuggester} - Framework suggester instance
 */
function getFrameworkSuggester() {
  if (!frameworkSuggesterInstance) {
    frameworkSuggesterInstance = new FrameworkSuggester();
  }
  return frameworkSuggesterInstance;
}

/**
 * Enhanced document analysis for PolicyAnalyzer component
 * @param {string} documentText - Extracted document text
 * @param {Array} selectedFrameworks - User-selected frameworks
 * @returns {Object} - Enhanced analysis data
 */
export async function enhanceDocumentAnalysis(documentText, selectedFrameworks = []) {
  try {
    const extractor = getEntityExtractor();
    const suggester = getFrameworkSuggester();

    // Extract entities from document
    const entities = extractor.extractEntities(documentText);

    // Get framework suggestions
    const frameworkSuggestions = suggester.suggestFrameworks(documentText);

    // Combine user-selected and suggested frameworks
    const allFrameworks = [
      ...new Set([...selectedFrameworks, ...frameworkSuggestions.suggestedFrameworks])
    ];

    // Validate frameworks against document content
    const validation = suggester.validateFrameworks(allFrameworks, documentText);

    return {
      success: true,
      entities,
      frameworkSuggestions,
      validation,
      enhancedData: {
        extractedDates: entities.effectiveDates,
        applicableJurisdictions: entities.jurisdictions,
        detectedFrameworks: entities.frameworks,
        keyResponsibilities: entities.responsibilities,
        complianceTimelines: entities.timelines,
        contactInformation: entities.contactInfo,
        documentMetadata: entities.metadata,
        suggestedFrameworks: frameworkSuggestions.suggestedFrameworks,
        confidenceScores: frameworkSuggestions.confidenceScores
      }
    };
  } catch (error) {
    console.error('Error in enhanced document analysis:', error);
    return {
      success: false,
      error: error.message,
      entities: null,
      enhancedData: null
    };
  }
}

/**
 * Smart framework detection for DocumentUpload component
 * @param {string} documentText - Document text (can be partial/preview)
 * @returns {Object} - Framework detection results
 */
export async function detectFrameworks(documentText) {
  try {
    const suggester = getFrameworkSuggester();
    const suggestions = suggester.suggestFrameworks(documentText);

    return {
      success: true,
      detectedFrameworks: suggestions.detectedFrameworks,
      suggestedFrameworks: suggestions.suggestedFrameworks,
      confidenceScores: suggestions.confidenceScores,
      reasoning: suggestions.reasoning
    };
  } catch (error) {
    console.error('Error in framework detection:', error);
    return {
      success: false,
      error: error.message,
      detectedFrameworks: [],
      suggestedFrameworks: []
    };
  }
}

/**
 * Extract key dates for compliance tracking
 * @param {string} documentText - Document text
 * @returns {Object} - Extracted dates with classification
 */
export async function extractComplianceDates(documentText) {
  try {
    const extractor = getEntityExtractor();
    const entities = extractor.extractEntities(documentText);

    const dates = entities.effectiveDates.map(date => ({
      date: date.text,
      type: date.type,
      confidence: date.confidence,
      context: date.context,
      isCompliance: date.type.includes('effective') || date.type.includes('deadline')
    }));

    return {
      success: true,
      dates,
      effectiveDates: dates.filter(d => d.type === 'effective_date'),
      deadlines: dates.filter(d => d.type === 'deadline'),
      reviewDates: dates.filter(d => d.type === 'review_date')
    };
  } catch (error) {
    console.error('Error extracting compliance dates:', error);
    return {
      success: false,
      error: error.message,
      dates: []
    };
  }
}

/**
 * Extract jurisdiction information for compliance scope
 * @param {string} documentText - Document text
 * @returns {Object} - Jurisdiction analysis
 */
export async function analyzeJurisdictions(documentText) {
  try {
    const extractor = getEntityExtractor();
    const entities = extractor.extractEntities(documentText);

    const jurisdictions = entities.jurisdictions.map(jurisdiction => ({
      name: jurisdiction.jurisdiction,
      displayText: jurisdiction.text,
      confidence: jurisdiction.confidence,
      context: jurisdiction.context
    }));

    return {
      success: true,
      jurisdictions,
      primaryJurisdictions: jurisdictions.filter(j => j.confidence > 0.7),
      applicableRegions: [...new Set(jurisdictions.map(j => j.name))]
    };
  } catch (error) {
    console.error('Error analyzing jurisdictions:', error);
    return {
      success: false,
      error: error.message,
      jurisdictions: []
    };
  }
}

/**
 * Get document insights for AnalysisResults component
 * @param {string} documentText - Document text
 * @param {Object} analysisResults - Existing analysis results
 * @returns {Object} - Enhanced insights
 */
export async function getDocumentInsights(documentText, analysisResults = {}) {
  try {
    const extractor = getEntityExtractor();
    const entities = extractor.extractEntities(documentText);

    const insights = {
      documentType: entities.metadata.documentType,
      urgencyLevel: entities.metadata.urgencyLevel,
      complexity: entities.metadata.complexityScore,
      readability: entities.metadata.readabilityScore,
      wordCount: entities.metadata.wordCount,
      
      // Key findings
      keyDates: entities.effectiveDates.slice(0, 3), // Top 3 most confident dates
      primaryJurisdictions: entities.jurisdictions.filter(j => j.confidence > 0.7),
      detectedFrameworks: entities.frameworks,
      keyResponsibilities: entities.responsibilities.slice(0, 5),
      criticalTimelines: entities.timelines.filter(t => 
        t.text.includes('72 hours') || t.text.includes('immediate') || t.text.includes('24 hours')
      ),
      
      // Contact information
      hasContactInfo: entities.contactInfo.emails.length > 0 || 
                     entities.contactInfo.phones.length > 0,
      contactDetails: entities.contactInfo
    };

    return {
      success: true,
      insights,
      enhancementSuggestions: generateEnhancementSuggestions(insights)
    };
  } catch (error) {
    console.error('Error getting document insights:', error);
    return {
      success: false,
      error: error.message,
      insights: null
    };
  }
}

/**
 * Generate enhancement suggestions based on document analysis
 * @param {Object} insights - Document insights
 * @returns {Array} - Array of suggestions
 */
function generateEnhancementSuggestions(insights) {
  const suggestions = [];

  if (insights.keyDates.length === 0) {
    suggestions.push({
      type: 'warning',
      message: 'No effective dates found. Consider adding implementation timelines.',
      priority: 'medium'
    });
  }

  if (insights.primaryJurisdictions.length === 0) {
    suggestions.push({
      type: 'warning',
      message: 'No clear jurisdictional scope identified. Specify applicable regions.',
      priority: 'high'
    });
  }

  if (!insights.hasContactInfo) {
    suggestions.push({
      type: 'info',
      message: 'Consider adding contact information for compliance inquiries.',
      priority: 'low'
    });
  }

  if (insights.complexity > 70) {
    suggestions.push({
      type: 'warning',
      message: 'Document complexity is high. Consider simplifying language for better understanding.',
      priority: 'medium'
    });
  }

  if (insights.urgencyLevel === 'high') {
    suggestions.push({
      type: 'alert',
      message: 'High urgency indicators detected. Review implementation timelines.',
      priority: 'high'
    });
  }

  return suggestions;
}

/**
 * Validate document completeness for compliance
 * @param {string} documentText - Document text
 * @param {Array} requiredFrameworks - Required compliance frameworks
 * @returns {Object} - Validation results
 */
export async function validateDocumentCompleteness(documentText, requiredFrameworks = []) {
  try {
    const extractor = getEntityExtractor();
    const suggester = getFrameworkSuggester();
    
    const entities = extractor.extractEntities(documentText);
    const validation = suggester.validateFrameworks(requiredFrameworks, documentText);

    const completeness = {
      hasEffectiveDates: entities.effectiveDates.length > 0,
      hasJurisdictions: entities.jurisdictions.length > 0,
      hasResponsibilities: entities.responsibilities.length > 0,
      hasTimelines: entities.timelines.length > 0,
      hasContactInfo: entities.contactInfo.emails.length > 0 || entities.contactInfo.phones.length > 0,
      
      frameworkCoverage: validation.validFrameworks.length / requiredFrameworks.length,
      missingElements: validation.missingElements,
      warnings: validation.warnings
    };

    const score = calculateCompletenessScore(completeness);

    return {
      success: true,
      completeness,
      score,
      recommendations: generateComplianceRecommendations(completeness)
    };
  } catch (error) {
    console.error('Error validating document completeness:', error);
    return {
      success: false,
      error: error.message,
      completeness: null,
      score: 0
    };
  }
}

/**
 * Calculate completeness score
 * @param {Object} completeness - Completeness data
 * @returns {number} - Score from 0-100
 */
function calculateCompletenessScore(completeness) {
  const weights = {
    hasEffectiveDates: 20,
    hasJurisdictions: 15,
    hasResponsibilities: 15,
    hasTimelines: 10,
    hasContactInfo: 5,
    frameworkCoverage: 35
  };

  let score = 0;
  
  Object.keys(weights).forEach(key => {
    if (key === 'frameworkCoverage') {
      score += completeness[key] * weights[key];
    } else if (completeness[key]) {
      score += weights[key];
    }
  });

  return Math.round(score);
}

/**
 * Generate compliance recommendations
 * @param {Object} completeness - Completeness data
 * @returns {Array} - Array of recommendations
 */
function generateComplianceRecommendations(completeness) {
  const recommendations = [];

  if (!completeness.hasEffectiveDates) {
    recommendations.push({
      priority: 'high',
      category: 'dates',
      message: 'Add clear effective dates and implementation timelines',
      action: 'Include specific dates when the policy takes effect'
    });
  }

  if (!completeness.hasJurisdictions) {
    recommendations.push({
      priority: 'high',
      category: 'scope',
      message: 'Specify jurisdictional scope and applicable regions',
      action: 'Clearly state which countries, states, or regions this policy applies to'
    });
  }

  if (!completeness.hasResponsibilities) {
    recommendations.push({
      priority: 'medium',
      category: 'governance',
      message: 'Define roles and responsibilities',
      action: 'Specify who is responsible for implementing and maintaining compliance'
    });
  }

  if (!completeness.hasTimelines) {
    recommendations.push({
      priority: 'medium',
      category: 'timelines',
      message: 'Include compliance timelines and deadlines',
      action: 'Add specific timeframes for various compliance activities'
    });
  }

  if (!completeness.hasContactInfo) {
    recommendations.push({
      priority: 'low',
      category: 'contact',
      message: 'Provide contact information for compliance questions',
      action: 'Include email addresses or phone numbers for compliance inquiries'
    });
  }

  if (completeness.frameworkCoverage < 1) {
    recommendations.push({
      priority: 'high',
      category: 'frameworks',
      message: 'Address missing framework requirements',
      action: 'Review and include requirements for all applicable compliance frameworks'
    });
  }

  return recommendations;
}

/**
 * Format entities for display in UI components
 * @param {Object} entities - Raw entities from extraction
 * @returns {Object} - Formatted entities for UI
 */
export function formatEntitiesForDisplay(entities) {
  return {
    effectiveDates: entities.effectiveDates.map(date => ({
      text: date.text,
      type: formatDateType(date.type),
      confidence: Math.round(date.confidence * 100) + '%',
      context: truncateContext(date.context)
    })),
    
    jurisdictions: entities.jurisdictions.map(jurisdiction => ({
      name: formatJurisdictionName(jurisdiction.jurisdiction),
      text: jurisdiction.text,
      confidence: Math.round(jurisdiction.confidence * 100) + '%'
    })),
    
    frameworks: entities.frameworks.map(framework => ({
      name: formatFrameworkName(framework.framework),
      text: framework.text,
      confidence: Math.round(framework.confidence * 100) + '%'
    })),
    
    responsibilities: entities.responsibilities.map(resp => ({
      role: resp.role,
      context: truncateContext(resp.context)
    })),
    
    timelines: entities.timelines.map(timeline => ({
      text: timeline.text,
      type: formatTimelineType(timeline.type),
      context: truncateContext(timeline.context)
    }))
  };
}

// Helper functions for formatting

function formatDateType(type) {
  const typeMap = {
    'effective_date': 'Effective Date',
    'deadline': 'Deadline',
    'review_date': 'Review Date',
    'training_date': 'Training Date',
    'general_date': 'General Date'
  };
  return typeMap[type] || type;
}

function formatJurisdictionName(jurisdiction) {
  const nameMap = {
    'european_union': 'European Union',
    'united_states': 'United States',
    'california': 'California',
    'new_york': 'New York',
    'united_kingdom': 'United Kingdom',
    'canada': 'Canada',
    'australia': 'Australia',
    'singapore': 'Singapore',
    'international': 'International'
  };
  return nameMap[jurisdiction] || jurisdiction.replace('_', ' ');
}

function formatFrameworkName(framework) {
  const nameMap = {
    'gdpr': 'GDPR',
    'hipaa': 'HIPAA',
    'sox': 'SOX',
    'pci_dss': 'PCI DSS',
    'iso_27001': 'ISO 27001',
    'nist': 'NIST',
    'ccpa': 'CCPA',
    'coppa': 'COPPA',
    'ferpa': 'FERPA',
    'glba': 'GLBA'
  };
  return nameMap[framework] || framework.toUpperCase();
}

function formatTimelineType(type) {
  const typeMap = {
    'immediate': 'Immediate',
    'notification_timeline': 'Notification',
    'review_timeline': 'Review',
    'training_timeline': 'Training',
    'general_timeline': 'General'
  };
  return typeMap[type] || type;
}

function truncateContext(context, maxLength = 100) {
  if (context.length <= maxLength) return context;
  return context.substring(0, maxLength) + '...';
}

// Export all functions
export default {
  enhanceDocumentAnalysis,
  detectFrameworks,
  extractComplianceDates,
  analyzeJurisdictions,
  getDocumentInsights,
  validateDocumentCompleteness,
  formatEntitiesForDisplay
};
