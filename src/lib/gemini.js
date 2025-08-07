import RulesBenchmarkingEngine from './rulesBenchmarking.js';

export async function analyzeDocument(text, config = {}) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
  console.log('Starting document analysis with:', {
    textLength: text.length,
    industry: config.industry,
    frameworks: config.frameworks,
    hasApiKey: !!apiKey
  });
  
  if (!apiKey) {
    console.error('❌ Gemini API key not found');
    throw new Error('Gemini API key is not configured. Please add VITE_GEMINI_API_KEY to your .env file. The current key appears to be missing or invalid.');
  }

  // Validate API key format
  if (!apiKey.startsWith('AIza') || apiKey.length < 30) {
    console.error('❌ Invalid Gemini API key format');
    throw new Error('Gemini API key appears to be invalid. Please check your VITE_GEMINI_API_KEY in the .env file.');
  }

  // Extract configuration with defaults and ensure proper types
  let selectedFrameworks = config.frameworks;
  const industry = config.industry || 'Technology';
  
  // Ensure selectedFrameworks is always an array
  if (!selectedFrameworks) {
    selectedFrameworks = ['GDPR', 'HIPAA', 'SOX'];
  } else if (!Array.isArray(selectedFrameworks)) {
    selectedFrameworks = [selectedFrameworks];
  } else if (selectedFrameworks.length === 0) {
    selectedFrameworks = ['GDPR', 'HIPAA', 'SOX'];
  }
  
  console.log('✅ Configuration processed:', {
    frameworks: selectedFrameworks,
    industry: industry,
    textPreview: text.substring(0, 100) + '...'
  });

  // Ensure frameworksArray is definitely an array
  const frameworksArray = Array.isArray(selectedFrameworks) ? selectedFrameworks : [selectedFrameworks].filter(Boolean);

  // Initialize benchmarking engine and perform comprehensive analysis
  const benchmarkingEngine = new RulesBenchmarkingEngine();
  const benchmarkResults = benchmarkingEngine.performComprehensiveBenchmarking(text, frameworksArray, industry);

  console.log('Benchmarking completed. Average score:', benchmarkResults.overallResults.averageScore);

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
  
  console.log('Making request to:', url.replace(apiKey, 'HIDDEN_API_KEY'));

  const prompt = `
    You are an expert compliance analyst with rules benchmarking capabilities. Analyze this policy document against regulatory frameworks and provide enhanced gap analysis with benchmarking insights.

    BENCHMARKING RESULTS:
    - Overall Compliance Score: ${benchmarkResults.overallResults.averageScore}%
    - Industry Benchmark (${industry}): ${benchmarkResults.overallResults.industryBenchmark.average}%
    - Performance Level: ${benchmarkResults.overallResults.benchmarkComparison}
    - Critical Gaps: ${benchmarkResults.overallResults.criticalGaps}
    - High Priority Gaps: ${benchmarkResults.overallResults.highGaps}
    - Total Strengths Identified: ${benchmarkResults.overallResults.totalStrengths}

    FRAMEWORK SCORES:
    ${Object.entries(benchmarkResults.frameworkResults).map(([framework, results]) => 
      `- ${framework} (${results.frameworkFullName}): ${results.overallScore}% - ${results.maturityLevel} maturity`
    ).join('\n    ')}

    TOP PRIORITY RECOMMENDATIONS:
    ${benchmarkResults.prioritizedRecommendations.slice(0, 5).map(rec => 
      `- Priority ${rec.priority}: ${rec.title} (${rec.framework} - ${rec.criticality})`
    ).join('\n    ')}

    IMPORTANT: You MUST respond with ONLY valid JSON. Keep the response concise but complete:

{
  "summary": "Executive summary with key findings and benchmarking insights",
  "overallScore": ${benchmarkResults.overallResults.averageScore},
  "industryBenchmark": {
    "userScore": ${benchmarkResults.overallResults.averageScore},
    "industryAverage": ${benchmarkResults.overallResults.industryBenchmark.average},
    "comparison": "${benchmarkResults.overallResults.benchmarkComparison}",
    "industry": "${industry}"
  },
  "totalGaps": 5,
  "gaps": [
    {
      "issue": "Brief description of compliance gap",
      "severity": "Critical|High|Medium|Low",
      "framework": "Framework name",
      "currentScore": 0,
      "targetScore": 100,
      "businessImpact": "Impact description",
      "timeframe": "1-3 months",
      "effort": "Low|Medium|High",
      "remediation": "Recommended action"
    }
  ]
}

    Document text analyzed: "${text.substring(0, 2000)}..."
  `;

  try {
    console.log('🚀 Making API request to Gemini...');
    const response = await fetch(url, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.3,
          topK: 20,
          topP: 0.8,
          maxOutputTokens: 2048, // Increased for complete JSON responses
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_NONE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH", 
            threshold: "BLOCK_NONE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_NONE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_NONE"
          }
        ]
      }),
    });

    console.log('📡 API Response received:', {
      status: response.status,
      ok: response.ok,
      headers: Object.fromEntries(response.headers.entries())
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API Error Response:', errorText);
      
      // Provide specific error messages based on status code
      if (response.status === 400) {
        throw new Error('Bad request - please check your document content and try again');
      } else if (response.status === 403) {
        throw new Error('API key authentication failed - please check your Gemini API key');
      } else if (response.status === 429) {
        throw new Error('Rate limit exceeded - please wait a moment and try again');
      } else {
        throw new Error(`API request failed (${response.status}): ${errorText}`);
      }
    }

    const data = await response.json();
    console.log('📊 Raw API Response:', JSON.stringify(data, null, 2));

    // Validate response structure
    if (!data || !data.candidates) {
      console.error('❌ Invalid response structure - no candidates:', data);
      throw new Error('Invalid response format from Gemini API - no candidates found');
    }

    if (!Array.isArray(data.candidates) || data.candidates.length === 0) {
      console.error('❌ No candidates in response:', data);
      throw new Error('No analysis results returned from Gemini API');
    }

    const candidate = data.candidates[0];
    if (!candidate.content || !candidate.content.parts || !candidate.content.parts[0]) {
      console.error('❌ No content in candidate:', candidate);
      throw new Error('Empty response from Gemini API');
    }

    const responseText = candidate.content.parts[0].text;
    console.log('✅ Generated text received:', responseText.substring(0, 200) + '...');

    // Clean up the response text - remove markdown formatting if present
    let cleanedResponse = responseText.trim();
    console.log('🧹 Original response length:', responseText.length);
    
    // Remove markdown code blocks if they exist
    if (cleanedResponse.startsWith('```json')) {
      cleanedResponse = cleanedResponse.replace(/```json\s*/, '').replace(/```\s*$/, '');
      console.log('✂️ Removed JSON markdown blocks');
    } else if (cleanedResponse.startsWith('```')) {
      cleanedResponse = cleanedResponse.replace(/```\s*/, '').replace(/```\s*$/, '');
      console.log('✂️ Removed generic markdown blocks');
    }
    
    // Remove any leading/trailing text that's not JSON
    const jsonStart = cleanedResponse.indexOf('{');
    let jsonEnd = cleanedResponse.lastIndexOf('}');
    
    if (jsonStart === -1) {
      console.error('❌ No valid JSON structure found in response:', cleanedResponse.substring(0, 200));
      throw new Error('Response does not contain valid JSON structure');
    }
    
    // Find the proper JSON end by counting braces
    let braceCount = 0;
    let actualJsonEnd = -1;
    
    for (let i = jsonStart; i < cleanedResponse.length; i++) {
      if (cleanedResponse[i] === '{') {
        braceCount++;
      } else if (cleanedResponse[i] === '}') {
        braceCount--;
        if (braceCount === 0) {
          actualJsonEnd = i;
          break;
        }
      }
    }
    
    if (actualJsonEnd === -1) {
      console.warn('⚠️ Incomplete JSON detected, using last brace position');
      actualJsonEnd = jsonEnd;
    }
    
    cleanedResponse = cleanedResponse.substring(jsonStart, actualJsonEnd + 1);
    console.log('🎯 Extracted JSON length:', cleanedResponse.length);
    
    // Validate JSON structure before parsing
    if (!cleanedResponse.includes('"summary"') || !cleanedResponse.includes('"gaps"')) {
      console.warn('⚠️ JSON missing required fields, may be incomplete');
    }

    try {
      const result = JSON.parse(cleanedResponse);
      console.log('✅ Successfully parsed JSON response');
      
      // Validate and sanitize the response structure
      const sanitizedResult = {
        summary: result.summary || 'Gap analysis completed with benchmarking insights',
        overallScore: result.overallScore || benchmarkResults.overallResults.averageScore,
        industryBenchmark: {
          userScore: result.overallScore || benchmarkResults.overallResults.averageScore,
          industryAverage: benchmarkResults.overallResults.industryBenchmark.average,
          comparison: benchmarkResults.overallResults.benchmarkComparison,
          industry: industry || 'Technology',
          insights: `Based on comprehensive analysis across ${benchmarkResults.frameworkResults ? Object.keys(benchmarkResults.frameworkResults).length : 3} regulatory frameworks, your organization achieves a ${result.overallScore || benchmarkResults.overallResults.averageScore}% compliance score compared to the ${industry || 'Technology'} industry average of ${benchmarkResults.overallResults.industryBenchmark.average}%.`
        },
        benchmarkingResults: result.benchmarkingResults || benchmarkResults,
        totalGaps: 0,
        gaps: [],
        prioritizedActions: result.prioritizedActions || benchmarkResults.prioritizedRecommendations.slice(0, 5)
      };
      
      // Safely handle gaps array
      if (result.gaps && Array.isArray(result.gaps)) {
        sanitizedResult.gaps = result.gaps.map(gap => ({
          issue: gap.issue || 'Compliance gap identified',
          severity: (gap.severity || 'Medium').toLowerCase(),
          framework: gap.framework || 'General',
          currentScore: gap.currentScore || 0,
          targetScore: gap.targetScore || 100,
          businessImpact: gap.businessImpact || 'Moderate impact',
          timeframe: gap.timeframe || '3-6 months',
          effort: gap.effort || 'Medium',
          remediation: gap.remediation || 'Review and update policies'
        }));
        sanitizedResult.totalGaps = sanitizedResult.gaps.length;
      } else {
        // If no gaps found from API, use benchmarking results as fallback
        console.log('⚠️ No gaps from API, using benchmarking recommendations');
        sanitizedResult.gaps = benchmarkResults.prioritizedRecommendations.slice(0, 5).map(rec => ({
          issue: `${rec.framework}: ${rec.title}`,
          severity: (rec.criticality || 'Medium').toLowerCase(),
          framework: rec.framework,
          currentScore: rec.currentScore || 0,
          targetScore: rec.targetScore || 100,
          businessImpact: rec.businessImpact || 'Moderate impact',
          timeframe: rec.timeframe || '3-6 months',
          effort: rec.estimatedEffort || 'Medium',
          remediation: rec.recommendations ? rec.recommendations.join('; ') : 'Review compliance requirements'
        }));
        sanitizedResult.totalGaps = sanitizedResult.gaps.length;
      }
      
      console.log(`📊 Sanitized result with ${sanitizedResult.totalGaps} gaps`);
      return sanitizedResult;
      
    } catch (parseError) {
      console.error('💥 JSON Parse Error:', parseError.message);
      console.error('🔍 Failed to parse cleaned response:', cleanedResponse.substring(0, 500) + '...');
      
      // Try to extract partial information from the broken JSON
      let partialSummary = 'Analysis completed but response parsing failed';
      const summaryMatch = cleanedResponse.match(/"summary":\s*"([^"]*)/);
      if (summaryMatch) {
        partialSummary = summaryMatch[1].substring(0, 200) + '...';
      }
      
      // Create a robust fallback structured response
      const fallbackResult = {
        rawResponse: responseText,
        summary: partialSummary,
        overallScore: benchmarkResults.overallResults.averageScore,
        industryBenchmark: {
          userScore: benchmarkResults.overallResults.averageScore,
          industryAverage: benchmarkResults.overallResults.industryBenchmark.average,
          comparison: benchmarkResults.overallResults.benchmarkComparison,
          industry: industry || 'Technology',
          insights: `Automated compliance assessment completed. Your organization scores ${benchmarkResults.overallResults.averageScore}% against ${industry || 'Technology'} industry standards (average: ${benchmarkResults.overallResults.industryBenchmark.average}%). Analysis based on ${benchmarkResults.prioritizedRecommendations.length} regulatory checkpoints.`
        },
        benchmarkingResults: benchmarkResults,
        totalGaps: benchmarkResults.prioritizedRecommendations.length,
        gaps: benchmarkResults.prioritizedRecommendations.slice(0, 8).map(rec => ({
          issue: `${rec.framework}: ${rec.title}`,
          severity: (rec.criticality || 'Medium').toLowerCase(),
          framework: rec.framework,
          currentScore: rec.currentScore || 0,
          targetScore: rec.targetScore || 100,
          businessImpact: rec.businessImpact || 'Moderate impact',
          timeframe: rec.timeframe || '3-6 months',
          effort: rec.estimatedEffort || 'Medium',
          remediation: rec.recommendations ? rec.recommendations.join('; ') : 'Review compliance requirements'
        })),
        prioritizedActions: benchmarkResults.prioritizedRecommendations.slice(0, 5),
        parseError: parseError.message
      };
      
      console.log('🔄 Returning fallback result with benchmarking data');
      return fallbackResult;
    }
      
      // Add industry benchmark if missing
      if (!result.industryBenchmark) {
        result.industryBenchmark = {
          userScore: benchmarkResults.overallResults.averageScore,
          industryAverage: benchmarkResults.overallResults.industryBenchmark.average,
          comparison: benchmarkResults.overallResults.benchmarkComparison,
          industry: industry
        };
      }
      
      return result;
      
    } catch (parseError) {
      console.error('💥 JSON Parse Error:', parseError.message);
      console.error('🔍 Failed to parse cleaned response:', cleanedResponse.substring(0, 500) + '...');
      
      // Create a fallback structured response
      return {
        rawResponse: responseText,
        summary: `Analysis completed but returned in text format. Parse error: ${parseError.message}`,
        overallScore: benchmarkResults.overallResults.averageScore,
        industryBenchmark: {
          userScore: benchmarkResults.overallResults.averageScore,
          industryAverage: benchmarkResults.overallResults.industryBenchmark.average,
          comparison: benchmarkResults.overallResults.benchmarkComparison,
          industry: industry
        },
        benchmarkingResults: benchmarkResults,
        totalGaps: 0,
        gaps: [],
        prioritizedActions: benchmarkResults.prioritizedRecommendations.slice(0, 5)
      };
    }
}

// Simple chat function for AI Expert chat
export async function analyzeWithGemini(prompt, config = {}) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
  if (!apiKey) {
    throw new Error('Gemini API key is not configured. Please add VITE_GEMINI_API_KEY to your .env file');
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: config.temperature || 0.7,
          topK: config.topK || 20,
          topP: config.topP || 0.8,
          maxOutputTokens: config.maxOutputTokens || 1000,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_NONE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH", 
            threshold: "BLOCK_NONE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_NONE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_NONE"
          }
        ]
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed: ${response.status} - ${errorText}`);
    }

    const data = await response.json();

    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      throw new Error('Invalid API response format');
    }

    return data.candidates[0].content.parts[0].text.trim();
  } catch (error) {
    console.error('Chat API error:', error);
    throw error;
  }
}

export async function searchCompliance(searchQuery, compliancesData) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
  console.log('Starting compliance search with query:', searchQuery);
  
  if (!apiKey) {
    throw new Error('Gemini API key is not configured');
  }

  if (!searchQuery || searchQuery.trim().length === 0) {
    throw new Error('Search query is required');
  }

  // Create a structured knowledge base from the compliances data
  const knowledgeBase = Object.entries(compliancesData).map(([key, compliance]) => ({
    id: key,
    title: compliance.title,
    region: compliance.region,
    year: compliance.year,
    description: compliance.description,
    keyPoints: compliance.keyPoints,
    whoNeedsIt: compliance.whoNeedsIt,
    simpleExample: compliance.simpleExample
  }));

  const prompt = `You are an expert compliance advisor with deep knowledge of regulatory frameworks. 

SEARCH QUERY: "${searchQuery}"

AVAILABLE COMPLIANCE FRAMEWORKS:
${knowledgeBase.map(framework => `
${framework.title} (${framework.region}, ${framework.year}):
- Description: ${framework.description}
- Who needs it: ${framework.whoNeedsIt}
- Key points: ${framework.keyPoints.slice(0, 3).join('; ')}
`).join('\n')}

Based on the user's search query, please analyze which compliance frameworks are most relevant and provide a comprehensive response. 

REQUIREMENTS:
1. Provide a brief summary explaining what the user is looking for
2. Identify the most relevant compliance frameworks (ranked by relevance)
3. For each relevant framework, provide:
   - The framework name (exactly as provided)
   - The region it applies to
   - A relevance score (0.0 to 1.0)
   - A clear explanation of why it's relevant to the search query
   - 2-3 key points that specifically relate to the search terms

RESPONSE FORMAT (JSON):
{
  "summary": "Brief explanation of what the user is searching for and general guidance",
  "relevantCompliances": [
    {
      "name": "Exact framework title from the data",
      "region": "Framework region",
      "relevanceScore": 0.95,
      "explanation": "Clear explanation of why this framework matches the search query",
      "keyRelevantPoints": [
        "Specific point 1 related to search",
        "Specific point 2 related to search"
      ]
    }
  ]
}

GUIDELINES:
- Only include frameworks with relevance score > 0.3
- Prioritize frameworks that directly address the search terms
- Be specific about how each framework relates to the query
- If searching for general terms like "data protection", include multiple relevant frameworks
- If searching for specific terms like "healthcare" or "financial", focus on those domains
- Provide practical, actionable information
- Keep explanations clear and concise

Please respond with valid JSON only.`;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.3,
          topK: 40,
          topP: 0.8,
          maxOutputTokens: 2048,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_NONE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH", 
            threshold: "BLOCK_NONE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_NONE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_NONE"
          }
        ]
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Search API error:', errorText);
      throw new Error(`Search API request failed: ${response.status}`);
    }

    const data = await response.json();

    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      throw new Error('Invalid search API response format');
    }

    const responseText = data.candidates[0].content.parts[0].text.trim();
    console.log('Raw API response:', responseText);

    // Parse the JSON response
    try {
      // Clean the response to extract JSON
      let cleanedResponse = responseText;
      
      // Remove any markdown code blocks
      cleanedResponse = cleanedResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      
      // Remove any leading/trailing text that might not be JSON
      const jsonStart = cleanedResponse.indexOf('{');
      const jsonEnd = cleanedResponse.lastIndexOf('}');
      
      if (jsonStart !== -1 && jsonEnd !== -1) {
        cleanedResponse = cleanedResponse.substring(jsonStart, jsonEnd + 1);
      }
      
      const parsedResult = JSON.parse(cleanedResponse);
      
      // Validate the response structure
      if (!parsedResult.summary || !parsedResult.relevantCompliances) {
        throw new Error('Invalid response structure');
      }

      // Sort by relevance score
      parsedResult.relevantCompliances.sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0));

      console.log('Parsed search results:', parsedResult);
      return parsedResult;

    } catch (parseError) {
      console.error('Failed to parse search response:', parseError);
      console.error('Response text:', responseText);
      
      // Fallback: create a simple text-based search
      return createFallbackSearchResults(searchQuery, compliancesData);
    }

  } catch (error) {
    console.error('Compliance search error:', error);
    
    // Fallback to simple text matching
    return createFallbackSearchResults(searchQuery, compliancesData);
  }
}

function createFallbackSearchResults(searchQuery, compliancesData) {
  console.log('Using fallback search for:', searchQuery);
  
  const queryLower = searchQuery.toLowerCase();
  const relevantCompliances = [];

  Object.entries(compliancesData).forEach(([key, compliance]) => {
    let relevanceScore = 0;
    const relevantPoints = [];

    // Check title, description, and key points for matches
    const searchableText = [
      compliance.title,
      compliance.description,
      compliance.whoNeedsIt,
      compliance.simpleExample,
      ...compliance.keyPoints
    ].join(' ').toLowerCase();

    // Simple keyword matching
    const queryWords = queryLower.split(' ').filter(word => word.length > 2);
    
    queryWords.forEach(word => {
      if (searchableText.includes(word)) {
        relevanceScore += 0.2;
      }
    });

    // Check for specific domain matches
    if (queryLower.includes('data') || queryLower.includes('privacy')) {
      if (key === 'GDPR' || key === 'CCPA') relevanceScore += 0.4;
    }
    
    if (queryLower.includes('health') || queryLower.includes('medical')) {
      if (key === 'HIPAA') relevanceScore += 0.5;
    }
    
    if (queryLower.includes('financial') || queryLower.includes('accounting')) {
      if (key === 'SOX') relevanceScore += 0.5;
    }
    
    if (queryLower.includes('payment') || queryLower.includes('credit')) {
      if (key === 'PCI_DSS') relevanceScore += 0.5;
    }
    
    if (queryLower.includes('security') || queryLower.includes('cyber')) {
      if (key === 'ISO_27001' || key === 'NIST_CSF') relevanceScore += 0.4;
    }
    
    if (queryLower.includes('email') || queryLower.includes('marketing')) {
      if (key === 'CAN_SPAM') relevanceScore += 0.5;
    }

    // Add relevant key points
    compliance.keyPoints.forEach(point => {
      queryWords.forEach(word => {
        if (point.toLowerCase().includes(word)) {
          relevantPoints.push(point);
        }
      });
    });

    if (relevanceScore > 0.3) {
      relevantCompliances.push({
        name: compliance.title,
        region: compliance.region,
        relevanceScore: Math.min(relevanceScore, 1.0),
        explanation: `This framework is relevant to "${searchQuery}" based on keyword matching and domain analysis.`,
        keyRelevantPoints: relevantPoints.slice(0, 3)
      });
    }
  });

  // Sort by relevance
  relevantCompliances.sort((a, b) => b.relevanceScore - a.relevanceScore);

  return {
    summary: `Found ${relevantCompliances.length} compliance frameworks related to "${searchQuery}". These frameworks contain requirements or guidelines that may apply to your search query.`,
    relevantCompliances: relevantCompliances.slice(0, 5) // Limit to top 5 results
  };
}
