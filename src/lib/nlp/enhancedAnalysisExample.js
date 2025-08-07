/**
 * Enhanced PolicyAnalyzer Component Integration Example
 * Shows how to integrate NLP entity extraction with existing analysis
 */

import React, { useState } from 'react';
import { enhanceDocumentAnalysis, getDocumentInsights } from '../lib/nlp/nlpIntegration.js';

// Example of how to enhance your existing PolicyAnalyzer component
export function useEnhancedAnalysis() {
  const [nlpResults, setNlpResults] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const analyzeWithNLP = async (documentText, selectedFrameworks) => {
    setIsProcessing(true);
    
    try {
      // Run NLP analysis
      const nlpAnalysis = await enhanceDocumentAnalysis(documentText, selectedFrameworks);
      
      if (nlpAnalysis.success) {
        setNlpResults(nlpAnalysis);
        
        // Return enhanced data for your existing Gemini analysis
        return {
          originalText: documentText,
          enhancedData: nlpAnalysis.enhancedData,
          entities: nlpAnalysis.entities,
          frameworkSuggestions: nlpAnalysis.frameworkSuggestions,
          validation: nlpAnalysis.validation
        };
      } else {
        console.error('NLP Analysis failed:', nlpAnalysis.error);
        return { originalText: documentText, enhancedData: null };
      }
    } catch (error) {
      console.error('Error in NLP analysis:', error);
      return { originalText: documentText, enhancedData: null };
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    analyzeWithNLP,
    nlpResults,
    isProcessing
  };
}

// Enhanced analysis data structure for Gemini API
export function createEnhancedAnalysisPrompt(documentText, enhancedData) {
  if (!enhancedData) {
    return documentText; // Fallback to original text
  }

  const prompt = `
Please analyze this compliance document with the following extracted information:

DOCUMENT TEXT:
${documentText}

EXTRACTED ENTITIES:
- Effective Dates: ${enhancedData.extractedDates.map(d => `${d.text} (${d.type})`).join(', ')}
- Jurisdictions: ${enhancedData.applicableJurisdictions.map(j => j.text).join(', ')}
- Detected Frameworks: ${enhancedData.detectedFrameworks.map(f => f.text).join(', ')}
- Key Responsibilities: ${enhancedData.keyResponsibilities.map(r => r.role).join(', ')}
- Compliance Timelines: ${enhancedData.complianceTimelines.map(t => t.text).join(', ')}

SUGGESTED FRAMEWORKS:
${enhancedData.suggestedFrameworks.join(', ')}

DOCUMENT METADATA:
- Type: ${enhancedData.documentMetadata.documentType}
- Urgency: ${enhancedData.documentMetadata.urgencyLevel}
- Complexity: ${enhancedData.documentMetadata.complexityScore}%
- Word Count: ${enhancedData.documentMetadata.wordCount}

Please provide a comprehensive compliance gap analysis considering the extracted entities and suggested frameworks.
`;

  return prompt;
}

// React component example showing integration
export function EnhancedPolicyAnalyzer() {
  const { analyzeWithNLP, nlpResults, isProcessing } = useEnhancedAnalysis();
  const [analysisResults, setAnalysisResults] = useState(null);

  const handleDocumentAnalysis = async (file, selectedFrameworks) => {
    try {
      // Extract text from PDF (your existing logic)
      const documentText = await extractTextFromPDF(file);
      
      // Run enhanced NLP analysis
      const enhancedAnalysis = await analyzeWithNLP(documentText, selectedFrameworks);
      
      // Create enhanced prompt for Gemini
      const enhancedPrompt = createEnhancedAnalysisPrompt(
        documentText, 
        enhancedAnalysis.enhancedData
      );
      
      // Send to your existing Gemini analysis
      const geminiResults = await analyzeDocument(enhancedPrompt, selectedFrameworks);
      
      // Combine results
      setAnalysisResults({
        geminiAnalysis: geminiResults,
        nlpAnalysis: enhancedAnalysis,
        enhancedInsights: nlpResults
      });
      
    } catch (error) {
      console.error('Enhanced analysis failed:', error);
    }
  };

  return (
    <div className="enhanced-policy-analyzer">
      {/* Your existing UI components */}
      
      {/* NLP Processing Indicator */}
      {isProcessing && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
            <span className="text-blue-700">Extracting entities and analyzing document structure...</span>
          </div>
        </div>
      )}
      
      {/* Enhanced Results Display */}
      {analysisResults && (
        <div className="space-y-6">
          {/* Extracted Entities Section */}
          <EntityDisplaySection entities={nlpResults?.entities} />
          
          {/* Framework Suggestions */}
          <FrameworkSuggestionsSection 
            suggestions={nlpResults?.frameworkSuggestions} 
          />
          
          {/* Your existing analysis results */}
          <AnalysisResultsSection results={analysisResults.geminiAnalysis} />
        </div>
      )}
    </div>
  );
}

// Component to display extracted entities
function EntityDisplaySection({ entities }) {
  if (!entities) return null;

  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Extracted Information</h3>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* Effective Dates */}
        {entities.effectiveDates.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-700 mb-2">📅 Key Dates</h4>
            <div className="space-y-2">
              {entities.effectiveDates.slice(0, 3).map((date, index) => (
                <div key={index} className="bg-white p-3 rounded border">
                  <span className="font-medium">{date.text}</span>
                  <span className="text-sm text-gray-500 ml-2">({date.type})</span>
                  <div className="text-xs text-gray-400 mt-1">
                    Confidence: {Math.round(date.confidence * 100)}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Jurisdictions */}
        {entities.jurisdictions.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-700 mb-2">🌍 Jurisdictions</h4>
            <div className="space-y-2">
              {entities.jurisdictions.slice(0, 3).map((jurisdiction, index) => (
                <div key={index} className="bg-white p-3 rounded border">
                  <span className="font-medium">{jurisdiction.text}</span>
                  <div className="text-xs text-gray-400 mt-1">
                    Confidence: {Math.round(jurisdiction.confidence * 100)}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Detected Frameworks */}
        {entities.frameworks.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-700 mb-2">📋 Detected Frameworks</h4>
            <div className="space-y-2">
              {entities.frameworks.map((framework, index) => (
                <div key={index} className="bg-white p-3 rounded border">
                  <span className="font-medium">{framework.text}</span>
                  <div className="text-xs text-gray-400 mt-1">
                    Confidence: {Math.round(framework.confidence * 100)}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Key Responsibilities */}
        {entities.responsibilities.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-700 mb-2">👥 Key Responsibilities</h4>
            <div className="space-y-2">
              {entities.responsibilities.slice(0, 3).map((resp, index) => (
                <div key={index} className="bg-white p-3 rounded border">
                  <span className="font-medium">{resp.role}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Component to display framework suggestions
function FrameworkSuggestionsSection({ suggestions }) {
  if (!suggestions || suggestions.suggestedFrameworks.length === 0) return null;

  return (
    <div className="bg-blue-50 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-blue-900 mb-4">🤖 AI Framework Suggestions</h3>
      
      <div className="space-y-3">
        {suggestions.suggestedFrameworks.slice(0, 5).map((framework, index) => (
          <div key={index} className="bg-white p-4 rounded border border-blue-200">
            <div className="flex justify-between items-center">
              <span className="font-medium text-blue-900">
                {framework.toUpperCase()}
              </span>
              <span className="text-sm text-blue-600">
                {Math.round((suggestions.confidenceScores[framework] || 0) * 100)}% confidence
              </span>
            </div>
            {suggestions.reasoning[index] && (
              <div className="text-sm text-blue-700 mt-1">
                {suggestions.reasoning[index]}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default EnhancedPolicyAnalyzer;
