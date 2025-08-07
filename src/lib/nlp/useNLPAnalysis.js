/**
 * useNLPAnalysis Hook
 * Custom React hook for integrating NLP capabilities into Poligap components
 */

import { useState, useEffect, useCallback } from 'react';
import nlpIntegration from './nlpIntegration.js';

/**
 * Custom hook for NLP-powered document analysis
 * @param {Object} options - Configuration options
 * @returns {Object} - Hook state and methods
 */
export function useNLPAnalysis(options = {}) {
  const [state, setState] = useState({
    isProcessing: false,
    entities: null,
    frameworkSuggestions: null,
    insights: null,
    completenessScore: 0,
    error: null,
    lastAnalyzedText: null
  });

  /**
   * Analyze document text and extract entities
   * @param {string} documentText - Text to analyze
   * @param {Array} selectedFrameworks - Pre-selected frameworks
   * @returns {Promise<Object>} - Analysis results
   */
  const analyzeDocument = useCallback(async (documentText, selectedFrameworks = []) => {
    if (!documentText || documentText.trim().length === 0) {
      setState(prev => ({ ...prev, error: 'No document text provided' }));
      return null;
    }

    setState(prev => ({ 
      ...prev, 
      isProcessing: true, 
      error: null,
      lastAnalyzedText: documentText 
    }));

    try {
      // Run enhanced document analysis
      const enhancedAnalysis = await nlpIntegration.enhanceDocumentAnalysis(
        documentText, 
        selectedFrameworks
      );

      if (!enhancedAnalysis.success) {
        throw new Error(enhancedAnalysis.error || 'Analysis failed');
      }

      // Get document insights
      const insights = await nlpIntegration.getDocumentInsights(documentText);

      // Validate completeness
      const completeness = await nlpIntegration.validateDocumentCompleteness(
        documentText, 
        selectedFrameworks
      );

      const result = {
        entities: enhancedAnalysis.entities,
        enhancedData: enhancedAnalysis.enhancedData,
        frameworkSuggestions: enhancedAnalysis.frameworkSuggestions,
        validation: enhancedAnalysis.validation,
        insights: insights.success ? insights.insights : null,
        completenessScore: completeness.success ? completeness.score : 0,
        recommendations: completeness.success ? completeness.recommendations : []
      };

      setState(prev => ({
        ...prev,
        isProcessing: false,
        entities: result.entities,
        frameworkSuggestions: result.frameworkSuggestions,
        insights: result.insights,
        completenessScore: result.completenessScore,
        error: null
      }));

      return result;

    } catch (error) {
      console.error('NLP Analysis error:', error);
      setState(prev => ({
        ...prev,
        isProcessing: false,
        error: error.message
      }));
      return null;
    }
  }, []);

  /**
   * Extract frameworks from document text
   * @param {string} documentText - Text to analyze
   * @returns {Promise<Object>} - Framework detection results
   */
  const detectFrameworks = useCallback(async (documentText) => {
    try {
      const result = await nlpIntegration.detectFrameworks(documentText);
      
      setState(prev => ({
        ...prev,
        frameworkSuggestions: result.success ? {
          detectedFrameworks: result.detectedFrameworks,
          suggestedFrameworks: result.suggestedFrameworks,
          confidenceScores: result.confidenceScores,
          reasoning: result.reasoning
        } : null
      }));

      return result;
    } catch (error) {
      console.error('Framework detection error:', error);
      return { success: false, error: error.message };
    }
  }, []);

  /**
   * Extract compliance dates from document
   * @param {string} documentText - Text to analyze
   * @returns {Promise<Object>} - Date extraction results
   */
  const extractDates = useCallback(async (documentText) => {
    try {
      return await nlpIntegration.extractComplianceDates(documentText);
    } catch (error) {
      console.error('Date extraction error:', error);
      return { success: false, error: error.message };
    }
  }, []);

  /**
   * Analyze jurisdictions in document
   * @param {string} documentText - Text to analyze
   * @returns {Promise<Object>} - Jurisdiction analysis results
   */
  const analyzeJurisdictions = useCallback(async (documentText) => {
    try {
      return await nlpIntegration.analyzeJurisdictions(documentText);
    } catch (error) {
      console.error('Jurisdiction analysis error:', error);
      return { success: false, error: error.message };
    }
  }, []);

  /**
   * Clear analysis state
   */
  const clearAnalysis = useCallback(() => {
    setState({
      isProcessing: false,
      entities: null,
      frameworkSuggestions: null,
      insights: null,
      completenessScore: 0,
      error: null,
      lastAnalyzedText: null
    });
  }, []);

  return {
    // State
    isProcessing: state.isProcessing,
    entities: state.entities,
    frameworkSuggestions: state.frameworkSuggestions,
    insights: state.insights,
    completenessScore: state.completenessScore,
    error: state.error,
    hasResults: state.entities !== null,
    
    // Methods
    analyzeDocument,
    detectFrameworks,
    extractDates,
    analyzeJurisdictions,
    clearAnalysis
  };
}

/**
 * Hook for real-time framework suggestions during document upload
 * @param {string} documentText - Document text to analyze
 * @param {number} debounceMs - Debounce delay in milliseconds
 * @returns {Object} - Framework suggestions state
 */
export function useFrameworkSuggestions(documentText, debounceMs = 500) {
  const [suggestions, setSuggestions] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!documentText || documentText.trim().length < 100) {
      setSuggestions(null);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setIsLoading(true);
      try {
        const result = await nlpIntegration.detectFrameworks(documentText);
        if (result.success) {
          setSuggestions({
            detected: result.detectedFrameworks,
            suggested: result.suggestedFrameworks,
            confidence: result.confidenceScores,
            reasoning: result.reasoning
          });
        }
      } catch (error) {
        console.error('Framework suggestion error:', error);
      } finally {
        setIsLoading(false);
      }
    }, debounceMs);

    return () => clearTimeout(timeoutId);
  }, [documentText, debounceMs]);

  return {
    suggestions,
    isLoading,
    hasSuggestions: suggestions !== null
  };
}

/**
 * Hook for document compliance validation
 * @param {string} documentText - Document text
 * @param {Array} requiredFrameworks - Required compliance frameworks
 * @returns {Object} - Validation state and results
 */
export function useComplianceValidation(documentText, requiredFrameworks = []) {
  const [validation, setValidation] = useState(null);
  const [isValidating, setIsValidating] = useState(false);

  const validateCompliance = useCallback(async () => {
    if (!documentText || requiredFrameworks.length === 0) {
      setValidation(null);
      return;
    }

    setIsValidating(true);
    try {
      const result = await nlpIntegration.validateDocumentCompleteness(
        documentText, 
        requiredFrameworks
      );
      
      if (result.success) {
        setValidation({
          score: result.score,
          completeness: result.completeness,
          recommendations: result.recommendations,
          isComplete: result.score >= 80 // 80% completeness threshold
        });
      }
    } catch (error) {
      console.error('Compliance validation error:', error);
    } finally {
      setIsValidating(false);
    }
  }, [documentText, requiredFrameworks]);

  useEffect(() => {
    validateCompliance();
  }, [validateCompliance]);

  return {
    validation,
    isValidating,
    hasValidation: validation !== null,
    revalidate: validateCompliance
  };
}

/**
 * Hook for entity extraction with formatting for UI display
 * @param {Object} entities - Raw entities from analysis
 * @returns {Object} - Formatted entities for display
 */
export function useFormattedEntities(entities) {
  const [formattedEntities, setFormattedEntities] = useState(null);

  useEffect(() => {
    if (entities) {
      const formatted = nlpIntegration.formatEntitiesForDisplay(entities);
      setFormattedEntities(formatted);
    } else {
      setFormattedEntities(null);
    }
  }, [entities]);

  return {
    formattedEntities,
    hasEntities: formattedEntities !== null
  };
}

/**
 * Hook for document insights with caching
 * @param {string} documentText - Document text
 * @returns {Object} - Document insights
 */
export function useDocumentInsights(documentText) {
  const [insights, setInsights] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!documentText || documentText.trim().length === 0) {
      setInsights(null);
      return;
    }

    const getInsights = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const result = await nlpIntegration.getDocumentInsights(documentText);
        if (result.success) {
          setInsights(result.insights);
        } else {
          setError(result.error);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    // Debounce insights calculation for large documents
    const timeoutId = setTimeout(getInsights, 1000);
    return () => clearTimeout(timeoutId);
  }, [documentText]);

  return {
    insights,
    isLoading,
    error,
    hasInsights: insights !== null
  };
}

// Export all hooks
export default {
  useNLPAnalysis,
  useFrameworkSuggestions,
  useComplianceValidation,
  useFormattedEntities,
  useDocumentInsights
};
