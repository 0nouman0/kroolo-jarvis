# NLP Entity Extraction Integration Guide

## Overview

This guide shows how to integrate the NLP entity extraction components into your existing Poligap React application. The NLP system extracts key entities like effective dates, jurisdictions, compliance frameworks, and responsibilities from policy documents.

## Quick Start

### 1. Basic Integration in PolicyAnalyzer Component

```javascript
// In your existing PolicyAnalyzer.jsx
import { useNLPAnalysis } from '../lib/nlp/useNLPAnalysis.js';

function PolicyAnalyzer() {
  const { 
    analyzeDocument, 
    entities, 
    frameworkSuggestions, 
    isProcessing,
    completenessScore 
  } = useNLPAnalysis();

  const handleAnalysis = async (file, selectedFrameworks) => {
    // Your existing PDF text extraction
    const documentText = await extractTextFromPDF(file);
    
    // NEW: Run NLP analysis
    const nlpResults = await analyzeDocument(documentText, selectedFrameworks);
    
    // Enhanced data for Gemini API
    const enhancedPrompt = createEnhancedPrompt(documentText, nlpResults);
    
    // Your existing Gemini analysis
    const analysisResults = await analyzeDocument(enhancedPrompt, selectedFrameworks);
    
    // Now you have both NLP entities and Gemini analysis
    setResults({ analysisResults, entities, frameworkSuggestions });
  };

  return (
    <div>
      {/* Your existing UI */}
      
      {/* NEW: NLP Processing indicator */}
      {isProcessing && (
        <div className="bg-blue-50 p-4 rounded">
          <span>🧠 Extracting entities and analyzing structure...</span>
        </div>
      )}
      
      {/* NEW: Extracted entities display */}
      {entities && <EntitiesDisplay entities={entities} />}
      
      {/* Your existing results display */}
    </div>
  );
}
```

### 2. Smart Framework Detection in DocumentUpload

```javascript
// In your DocumentUpload.jsx
import { useFrameworkSuggestions } from '../lib/nlp/useNLPAnalysis.js';

function DocumentUpload() {
  const [documentPreview, setDocumentPreview] = useState('');
  const { suggestions, isLoading } = useFrameworkSuggestions(documentPreview);

  return (
    <div>
      {/* Your existing upload UI */}
      
      {/* NEW: AI Framework Suggestions */}
      {suggestions && (
        <div className="bg-green-50 p-4 rounded mt-4">
          <h4>🤖 AI Detected Frameworks:</h4>
          {suggestions.suggested.map(framework => (
            <span key={framework} className="badge">
              {framework.toUpperCase()}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
```

### 3. Enhanced Results Display

```javascript
// In your AnalysisResults.jsx
import { useFormattedEntities } from '../lib/nlp/useNLPAnalysis.js';

function AnalysisResults({ results, entities }) {
  const { formattedEntities } = useFormattedEntities(entities);

  return (
    <div>
      {/* Your existing results */}
      
      {/* NEW: Extracted Information Section */}
      {formattedEntities && (
        <div className="bg-gray-50 p-6 rounded-lg mb-6">
          <h3>📋 Extracted Information</h3>
          
          {/* Key Dates */}
          {formattedEntities.effectiveDates.length > 0 && (
            <div className="mb-4">
              <h4>📅 Important Dates</h4>
              {formattedEntities.effectiveDates.map((date, i) => (
                <div key={i} className="bg-white p-3 rounded border mb-2">
                  <span className="font-semibold">{date.text}</span>
                  <span className="text-gray-500 ml-2">({date.type})</span>
                  <div className="text-sm text-gray-400">
                    Confidence: {date.confidence}
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Jurisdictions */}
          {formattedEntities.jurisdictions.length > 0 && (
            <div className="mb-4">
              <h4>🌍 Applicable Jurisdictions</h4>
              {formattedEntities.jurisdictions.map((jurisdiction, i) => (
                <span key={i} className="badge mr-2">
                  {jurisdiction.name}
                </span>
              ))}
            </div>
          )}
          
          {/* Responsibilities */}
          {formattedEntities.responsibilities.length > 0 && (
            <div>
              <h4>👥 Key Responsibilities</h4>
              {formattedEntities.responsibilities.map((resp, i) => (
                <div key={i} className="bg-white p-2 rounded border mb-1">
                  {resp.role}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
```

## Available Hooks and Functions

### Hooks

1. **useNLPAnalysis()** - Main analysis hook
   - `analyzeDocument(text, frameworks)` - Full entity extraction
   - `entities` - Extracted entities
   - `frameworkSuggestions` - AI framework suggestions
   - `isProcessing` - Loading state

2. **useFrameworkSuggestions(text)** - Real-time framework detection
   - `suggestions` - Detected/suggested frameworks
   - `isLoading` - Processing state

3. **useComplianceValidation(text, frameworks)** - Document completeness
   - `validation` - Completeness score and recommendations
   - `isValidating` - Validation state

4. **useFormattedEntities(entities)** - UI-ready entity formatting
   - `formattedEntities` - Formatted for display

### Utility Functions

```javascript
import nlpIntegration from '../lib/nlp/nlpIntegration.js';

// Extract specific entity types
const dates = await nlpIntegration.extractComplianceDates(text);
const jurisdictions = await nlpIntegration.analyzeJurisdictions(text);
const insights = await nlpIntegration.getDocumentInsights(text);

// Framework detection
const frameworks = await nlpIntegration.detectFrameworks(text);

// Document validation
const validation = await nlpIntegration.validateDocumentCompleteness(text, frameworks);
```

## Enhanced Gemini Integration

Create enhanced prompts with extracted entities:

```javascript
function createEnhancedPrompt(originalText, nlpResults) {
  if (!nlpResults?.enhancedData) return originalText;

  const { enhancedData } = nlpResults;
  
  return `
Analyze this compliance document with extracted context:

DOCUMENT: ${originalText}

EXTRACTED ENTITIES:
- Effective Dates: ${enhancedData.extractedDates.map(d => d.text).join(', ')}
- Jurisdictions: ${enhancedData.applicableJurisdictions.map(j => j.text).join(', ')}
- Frameworks: ${enhancedData.detectedFrameworks.map(f => f.text).join(', ')}
- Key Roles: ${enhancedData.keyResponsibilities.map(r => r.role).join(', ')}

SUGGESTED FRAMEWORKS: ${enhancedData.suggestedFrameworks.join(', ')}

Please analyze compliance gaps considering the extracted entities.
`;
}
```

## UI Components

### Entity Display Component

```javascript
function EntitiesDisplay({ entities }) {
  if (!entities) return null;

  return (
    <div className="grid md:grid-cols-2 gap-4 mb-6">
      {/* Dates */}
      <div className="bg-blue-50 p-4 rounded">
        <h4 className="font-semibold mb-2">📅 Key Dates</h4>
        {entities.effectiveDates.slice(0, 3).map((date, i) => (
          <div key={i} className="mb-2">
            <span className="font-medium">{date.text}</span>
            <span className="text-sm text-gray-500 ml-2">({date.type})</span>
          </div>
        ))}
      </div>

      {/* Jurisdictions */}
      <div className="bg-green-50 p-4 rounded">
        <h4 className="font-semibold mb-2">🌍 Jurisdictions</h4>
        {entities.jurisdictions.map((jurisdiction, i) => (
          <span key={i} className="inline-block bg-green-200 px-2 py-1 rounded text-sm mr-2 mb-1">
            {jurisdiction.text}
          </span>
        ))}
      </div>

      {/* Frameworks */}
      <div className="bg-purple-50 p-4 rounded">
        <h4 className="font-semibold mb-2">📋 Detected Frameworks</h4>
        {entities.frameworks.map((framework, i) => (
          <span key={i} className="inline-block bg-purple-200 px-2 py-1 rounded text-sm mr-2 mb-1">
            {framework.text}
          </span>
        ))}
      </div>

      {/* Responsibilities */}
      <div className="bg-orange-50 p-4 rounded">
        <h4 className="font-semibold mb-2">👥 Key Roles</h4>
        {entities.responsibilities.slice(0, 3).map((resp, i) => (
          <div key={i} className="text-sm mb-1">
            {resp.role}
          </div>
        ))}
      </div>
    </div>
  );
}
```

## Migration Strategy

### Phase 1: Add to Existing Analysis
1. Import NLP hooks into PolicyAnalyzer
2. Run NLP analysis alongside existing Gemini analysis
3. Display extracted entities below current results

### Phase 2: Enhance Framework Selection
1. Add framework suggestions to DocumentUpload
2. Show detected frameworks with confidence scores
3. Allow users to accept/modify suggestions

### Phase 3: Full Integration
1. Use extracted entities to enhance Gemini prompts
2. Add document completeness validation
3. Show insights and recommendations

## Performance Notes

- Entity extraction is cached automatically
- Framework detection is debounced for real-time suggestions
- Large documents (>50KB) may take 2-3 seconds to process
- Consider showing loading indicators during processing

## Error Handling

```javascript
const { analyzeDocument, error } = useNLPAnalysis();

// Handle errors gracefully
if (error) {
  console.warn('NLP analysis failed, falling back to basic analysis:', error);
  // Continue with your existing analysis
}
```

## Benefits

✅ **More Accurate Analysis**: AI gets better context with extracted entities  
✅ **Better User Experience**: Auto-detect frameworks, show key dates  
✅ **Richer Results**: Display specific entities alongside gap analysis  
✅ **Smart Suggestions**: Recommend relevant frameworks based on content  
✅ **Validation**: Check document completeness and provide recommendations  

The NLP components are designed to enhance your existing functionality without breaking current workflows. You can implement them incrementally and see immediate benefits!
