/**
 * Framework Suggester and Entity Extractor for Poligap
 * Provides NLP capabilities to extract key entities from compliance documents
 */

// Date patterns for various formats
const DATE_PATTERNS = [
  // Standard formats: MM/DD/YYYY, DD/MM/YYYY, YYYY-MM-DD
  /\b(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{4})\b/g,
  /\b(\d{4}[\/\-\.]\d{1,2}[\/\-\.]\d{1,2})\b/g,
  
  // Month names: January 1, 2024 or 1st January 2024
  /\b(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2}(?:st|nd|rd|th)?,?\s+\d{4}\b/gi,
  /\b\d{1,2}(?:st|nd|rd|th)?\s+(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4}\b/gi,
  
  // Contextual date patterns
  /\b(?:effective|implementation|compliance)\s+date[:]\s*([^.\n]{1,50})\b/gi,
  /\b(?:by|before|after|on|from)\s+([A-Za-z]+\s+\d{1,2},?\s+\d{4})\b/gi,
  
  // Relative dates
  /\b(?:within|in)\s+(\d+)\s+(days?|weeks?|months?|years?)\b/gi
];

// Jurisdiction patterns and mappings
const JURISDICTION_PATTERNS = {
  'european_union': [
    /\b(?:european\s+union|eu|gdpr|eea|european\s+economic\s+area)\b/gi,
    /\b(?:regulation\s+\(eu\)\s+2016\/679)\b/gi
  ],
  'united_states': [
    /\b(?:united\s+states|usa|us|america|federal)\b/gi,
    /\b(?:hipaa|sox|sarbanes[\-\s]?oxley|cfr)\b/gi
  ],
  'california': [
    /\b(?:california|ca|ccpa|cpra|calif\.?)\b/gi,
    /\b(?:california\s+consumer\s+privacy\s+act)\b/gi
  ],
  'new_york': [
    /\b(?:new\s+york|ny|nydfs|nycrr)\b/gi,
    /\b(?:new\s+york\s+state)\b/gi
  ],
  'united_kingdom': [
    /\b(?:united\s+kingdom|uk|britain|british|ico)\b/gi,
    /\b(?:data\s+protection\s+act|dpa)\b/gi
  ],
  'canada': [
    /\b(?:canada|canadian|pipeda|provincial)\b/gi,
    /\b(?:personal\s+information\s+protection)\b/gi
  ],
  'australia': [
    /\b(?:australia|australian|privacy\s+act|oaic)\b/gi
  ],
  'singapore': [
    /\b(?:singapore|singaporean|pdpa)\b/gi,
    /\b(?:personal\s+data\s+protection\s+act)\b/gi
  ],
  'international': [
    /\b(?:international|global|worldwide|cross[\-\s]?border)\b/gi,
    /\b(?:iso\s+\d+|international\s+organization)\b/gi
  ]
};

// Compliance framework patterns
const FRAMEWORK_PATTERNS = {
  'gdpr': [
    /\b(?:gdpr|general\s+data\s+protection\s+regulation)\b/gi,
    /\b(?:regulation\s+\(eu\)\s+2016\/679)\b/gi,
    /\b(?:data\s+protection\s+directive)\b/gi
  ],
  'hipaa': [
    /\b(?:hipaa|health\s+insurance\s+portability)\b/gi,
    /\b(?:accountability\s+act|covered\s+entities)\b/gi,
    /\b(?:protected\s+health\s+information|phi)\b/gi
  ],
  'sox': [
    /\b(?:sox|sarbanes[\-\s]?oxley)\b/gi,
    /\b(?:public\s+company\s+accounting\s+reform)\b/gi,
    /\b(?:section\s+404|internal\s+controls)\b/gi
  ],
  'pci_dss': [
    /\b(?:pci\s+dss|payment\s+card\s+industry)\b/gi,
    /\b(?:data\s+security\s+standard|cardholder\s+data)\b/gi
  ],
  'iso_27001': [
    /\b(?:iso\s+27001|iso\/iec\s+27001)\b/gi,
    /\b(?:information\s+security\s+management\s+system|isms)\b/gi
  ],
  'nist': [
    /\b(?:nist|national\s+institute\s+of\s+standards)\b/gi,
    /\b(?:cybersecurity\s+framework|csf)\b/gi,
    /\b(?:sp\s+800[\-\s]?\d+)\b/gi
  ],
  'ccpa': [
    /\b(?:ccpa|california\s+consumer\s+privacy\s+act)\b/gi,
    /\b(?:cpra|california\s+privacy\s+rights\s+act)\b/gi
  ],
  'coppa': [
    /\b(?:coppa|children[''']?s\s+online\s+privacy)\b/gi,
    /\b(?:protection\s+act|under\s+13)\b/gi
  ],
  'ferpa': [
    /\b(?:ferpa|family\s+educational\s+rights)\b/gi,
    /\b(?:privacy\s+act|educational\s+records)\b/gi
  ],
  'glba': [
    /\b(?:glba|gramm[\-\s]?leach[\-\s]?bliley)\b/gi,
    /\b(?:financial\s+services\s+modernization)\b/gi
  ]
};

// Responsibility and role patterns
const RESPONSIBILITY_PATTERNS = [
  /\b(?:data\s+protection\s+officer|dpo)\b/gi,
  /\b(?:chief\s+information\s+security\s+officer|ciso)\b/gi,
  /\b(?:chief\s+privacy\s+officer|cpo)\b/gi,
  /\b(?:compliance\s+officer|compliance\s+team)\b/gi,
  /\b(?:data\s+controller|controller)\b/gi,
  /\b(?:data\s+processor|processor)\b/gi,
  /\b(?:information\s+security\s+team|security\s+team)\b/gi,
  /\b(?:legal\s+department|legal\s+team)\b/gi,
  /\b(?:hr\s+department|human\s+resources)\b/gi,
  /\b(?:it\s+department|information\s+technology)\b/gi
];

// Timeline and deadline patterns
const TIMELINE_PATTERNS = [
  /\b(?:within|in)\s+(\d+)\s+(days?|weeks?|months?|years?)\b/gi,
  /\b(?:no\s+later\s+than|by|before)\s+([^.\n]{1,50})\b/gi,
  /\b(?:immediately|promptly|without\s+delay|forthwith)\b/gi,
  /\b(?:annually|quarterly|monthly|weekly|daily)\b/gi,
  /\b(?:72\s+hours?|24\s+hours?|30\s+days?)\b/gi
];

// Contact information patterns
const CONTACT_PATTERNS = {
  email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
  phone: /\b(?:\+?1[-.\s]?)?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}\b/g,
  website: /\bhttps?:\/\/[^\s]+\b/g
};

/**
 * Main Entity Extractor Class
 */
class EntityExtractor {
  constructor() {
    this.extractionCache = new Map();
  }

  /**
   * Extract all entities from text
   * @param {string} text - Document text to analyze
   * @param {Object} options - Extraction options
   * @returns {Object} - Extracted entities
   */
  extractEntities(text, options = {}) {
    const cacheKey = this._generateCacheKey(text, options);
    
    if (this.extractionCache.has(cacheKey)) {
      return this.extractionCache.get(cacheKey);
    }

    const entities = {
      timestamp: new Date().toISOString(),
      effectiveDates: this.extractDates(text),
      jurisdictions: this.extractJurisdictions(text),
      frameworks: this.extractFrameworks(text),
      responsibilities: this.extractResponsibilities(text),
      timelines: this.extractTimelines(text),
      contactInfo: this.extractContactInfo(text),
      requirements: this.extractRequirements(text),
      metadata: this.extractMetadata(text)
    };

    // Cache the results
    this.extractionCache.set(cacheKey, entities);
    
    return entities;
  }

  /**
   * Extract dates from text
   * @param {string} text - Text to analyze
   * @returns {Array} - Array of date objects
   */
  extractDates(text) {
    const dates = [];
    const foundDates = new Set(); // Prevent duplicates

    DATE_PATTERNS.forEach((pattern, index) => {
      const matches = [...text.matchAll(pattern)];
      
      matches.forEach(match => {
        const dateText = match[1] || match[0];
        const cleanDate = dateText.trim();
        
        if (!foundDates.has(cleanDate.toLowerCase())) {
          foundDates.add(cleanDate.toLowerCase());
          
          const context = this._getContext(text, match.index, 100);
          const dateType = this._classifyDateType(context);
          
          dates.push({
            text: cleanDate,
            type: dateType,
            context: context,
            confidence: this._calculateDateConfidence(cleanDate, context),
            position: match.index
          });
        }
      });
    });

    return dates.sort((a, b) => b.confidence - a.confidence);
  }

  /**
   * Extract jurisdictions from text
   * @param {string} text - Text to analyze
   * @returns {Array} - Array of jurisdiction objects
   */
  extractJurisdictions(text) {
    const jurisdictions = [];
    const foundJurisdictions = new Set();

    Object.entries(JURISDICTION_PATTERNS).forEach(([jurisdiction, patterns]) => {
      patterns.forEach(pattern => {
        const matches = [...text.matchAll(pattern)];
        
        matches.forEach(match => {
          const matchText = match[0];
          const key = `${jurisdiction}:${matchText.toLowerCase()}`;
          
          if (!foundJurisdictions.has(key)) {
            foundJurisdictions.add(key);
            
            const context = this._getContext(text, match.index, 150);
            
            jurisdictions.push({
              jurisdiction: jurisdiction,
              text: matchText,
              context: context,
              confidence: this._calculateJurisdictionConfidence(matchText, jurisdiction),
              position: match.index
            });
          }
        });
      });
    });

    return jurisdictions.sort((a, b) => b.confidence - a.confidence);
  }

  /**
   * Extract compliance frameworks from text
   * @param {string} text - Text to analyze
   * @returns {Array} - Array of framework objects
   */
  extractFrameworks(text) {
    const frameworks = [];
    const foundFrameworks = new Set();

    Object.entries(FRAMEWORK_PATTERNS).forEach(([framework, patterns]) => {
      patterns.forEach(pattern => {
        const matches = [...text.matchAll(pattern)];
        
        matches.forEach(match => {
          const matchText = match[0];
          const key = `${framework}:${matchText.toLowerCase()}`;
          
          if (!foundFrameworks.has(key)) {
            foundFrameworks.add(key);
            
            const context = this._getContext(text, match.index, 150);
            
            frameworks.push({
              framework: framework,
              text: matchText,
              context: context,
              confidence: this._calculateFrameworkConfidence(matchText, framework),
              position: match.index
            });
          }
        });
      });
    });

    return frameworks.sort((a, b) => b.confidence - a.confidence);
  }

  /**
   * Extract responsibilities and roles from text
   * @param {string} text - Text to analyze
   * @returns {Array} - Array of responsibility objects
   */
  extractResponsibilities(text) {
    const responsibilities = [];
    const foundResponsibilities = new Set();

    RESPONSIBILITY_PATTERNS.forEach(pattern => {
      const matches = [...text.matchAll(pattern)];
      
      matches.forEach(match => {
        const matchText = match[0];
        
        if (!foundResponsibilities.has(matchText.toLowerCase())) {
          foundResponsibilities.add(matchText.toLowerCase());
          
          const context = this._getContext(text, match.index, 120);
          
          responsibilities.push({
            role: matchText,
            context: context,
            confidence: 0.8,
            position: match.index
          });
        }
      });
    });

    return responsibilities.sort((a, b) => b.confidence - a.confidence);
  }

  /**
   * Extract timelines and deadlines from text
   * @param {string} text - Text to analyze
   * @returns {Array} - Array of timeline objects
   */
  extractTimelines(text) {
    const timelines = [];
    const foundTimelines = new Set();

    TIMELINE_PATTERNS.forEach(pattern => {
      const matches = [...text.matchAll(pattern)];
      
      matches.forEach(match => {
        const matchText = match[0];
        
        if (!foundTimelines.has(matchText.toLowerCase())) {
          foundTimelines.add(matchText.toLowerCase());
          
          const context = this._getContext(text, match.index, 120);
          const timelineType = this._classifyTimelineType(matchText, context);
          
          timelines.push({
            text: matchText,
            type: timelineType,
            context: context,
            confidence: this._calculateTimelineConfidence(matchText, context),
            position: match.index
          });
        }
      });
    });

    return timelines.sort((a, b) => b.confidence - a.confidence);
  }

  /**
   * Extract contact information from text
   * @param {string} text - Text to analyze
   * @returns {Object} - Object containing different types of contact info
   */
  extractContactInfo(text) {
    const contactInfo = {
      emails: [],
      phones: [],
      websites: []
    };

    // Extract emails
    const emailMatches = [...text.matchAll(CONTACT_PATTERNS.email)];
    emailMatches.forEach(match => {
      const context = this._getContext(text, match.index, 80);
      contactInfo.emails.push({
        email: match[0],
        context: context,
        position: match.index
      });
    });

    // Extract phone numbers
    const phoneMatches = [...text.matchAll(CONTACT_PATTERNS.phone)];
    phoneMatches.forEach(match => {
      const context = this._getContext(text, match.index, 80);
      contactInfo.phones.push({
        phone: match[0],
        context: context,
        position: match.index
      });
    });

    // Extract websites
    const websiteMatches = [...text.matchAll(CONTACT_PATTERNS.website)];
    websiteMatches.forEach(match => {
      const context = this._getContext(text, match.index, 80);
      contactInfo.websites.push({
        website: match[0],
        context: context,
        position: match.index
      });
    });

    return contactInfo;
  }

  /**
   * Extract requirements and obligations from text
   * @param {string} text - Text to analyze
   * @returns {Array} - Array of requirement objects
   */
  extractRequirements(text) {
    const requirements = [];
    const requirementPatterns = [
      /\b(?:must|shall|required\s+to|obligated\s+to|mandated)\s+[\w\s]{10,100}\b/gi,
      /\b(?:prohibited\s+from|forbidden\s+to|not\s+permitted)\s+[\w\s]{10,100}\b/gi,
      /\b(?:ensure\s+that|verify\s+that|confirm\s+that)\s+[\w\s]{10,100}\b/gi
    ];

    requirementPatterns.forEach(pattern => {
      const matches = [...text.matchAll(pattern)];
      
      matches.forEach(match => {
        const context = this._getContext(text, match.index, 200);
        const requirementType = this._classifyRequirementType(match[0]);
        
        requirements.push({
          text: match[0],
          type: requirementType,
          context: context,
          confidence: 0.75,
          position: match.index
        });
      });
    });

    return requirements;
  }

  /**
   * Extract document metadata
   * @param {string} text - Text to analyze
   * @returns {Object} - Metadata object
   */
  extractMetadata(text) {
    const words = text.split(/\s+/).filter(word => word.length > 0);
    const sentences = text.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0);
    const paragraphs = text.split(/\n\s*\n/).filter(para => para.trim().length > 0);

    return {
      wordCount: words.length,
      sentenceCount: sentences.length,
      paragraphCount: paragraphs.length,
      averageWordsPerSentence: sentences.length > 0 ? Math.round(words.length / sentences.length * 100) / 100 : 0,
      readabilityScore: this._calculateReadabilityScore(words, sentences),
      complexityScore: this._calculateComplexityScore(words),
      documentType: this._classifyDocumentType(text),
      urgencyLevel: this._assessUrgency(text)
    };
  }

  // Helper methods

  /**
   * Get surrounding context for a match
   * @param {string} text - Full text
   * @param {number} position - Position of match
   * @param {number} windowSize - Size of context window
   * @returns {string} - Context string
   */
  _getContext(text, position, windowSize = 100) {
    const start = Math.max(0, position - windowSize);
    const end = Math.min(text.length, position + windowSize);
    return text.substring(start, end).trim();
  }

  /**
   * Classify date type based on context
   * @param {string} context - Context around the date
   * @returns {string} - Date type
   */
  _classifyDateType(context) {
    const contextLower = context.toLowerCase();
    
    if (contextLower.includes('effective') || contextLower.includes('implementation')) {
      return 'effective_date';
    }
    if (contextLower.includes('deadline') || contextLower.includes('due') || contextLower.includes('expire')) {
      return 'deadline';
    }
    if (contextLower.includes('review') || contextLower.includes('audit')) {
      return 'review_date';
    }
    if (contextLower.includes('training') || contextLower.includes('certification')) {
      return 'training_date';
    }
    
    return 'general_date';
  }

  /**
   * Classify timeline type
   * @param {string} text - Timeline text
   * @param {string} context - Context around timeline
   * @returns {string} - Timeline type
   */
  _classifyTimelineType(text, context) {
    const textLower = text.toLowerCase();
    const contextLower = context.toLowerCase();
    
    if (textLower.includes('immediate') || textLower.includes('prompt')) {
      return 'immediate';
    }
    if (contextLower.includes('report') || contextLower.includes('notify')) {
      return 'notification_timeline';
    }
    if (contextLower.includes('review') || contextLower.includes('audit')) {
      return 'review_timeline';
    }
    if (contextLower.includes('training') || contextLower.includes('education')) {
      return 'training_timeline';
    }
    
    return 'general_timeline';
  }

  /**
   * Classify requirement type
   * @param {string} text - Requirement text
   * @returns {string} - Requirement type
   */
  _classifyRequirementType(text) {
    const textLower = text.toLowerCase();
    
    if (textLower.includes('must') || textLower.includes('shall')) {
      return 'mandatory';
    }
    if (textLower.includes('prohibited') || textLower.includes('forbidden')) {
      return 'prohibition';
    }
    if (textLower.includes('ensure') || textLower.includes('verify')) {
      return 'verification';
    }
    
    return 'general_requirement';
  }

  /**
   * Classify document type
   * @param {string} text - Document text
   * @returns {string} - Document type
   */
  _classifyDocumentType(text) {
    const textLower = text.toLowerCase();
    
    if (textLower.includes('data protection') || textLower.includes('privacy') || textLower.includes('gdpr')) {
      return 'data_protection';
    }
    if (textLower.includes('security') || textLower.includes('cybersecurity')) {
      return 'security';
    }
    if (textLower.includes('financial') || textLower.includes('sox') || textLower.includes('accounting')) {
      return 'financial';
    }
    if (textLower.includes('health') || textLower.includes('hipaa') || textLower.includes('medical')) {
      return 'healthcare';
    }
    
    return 'general_compliance';
  }

  /**
   * Assess urgency level
   * @param {string} text - Document text
   * @returns {string} - Urgency level
   */
  _assessUrgency(text) {
    const textLower = text.toLowerCase();
    
    if (textLower.includes('immediate') || textLower.includes('urgent') || textLower.includes('critical')) {
      return 'high';
    }
    if (textLower.includes('soon') || textLower.includes('prompt') || textLower.includes('timely')) {
      return 'medium';
    }
    
    return 'normal';
  }

  /**
   * Calculate confidence scores
   */
  _calculateDateConfidence(dateText, context) {
    let confidence = 0.6;
    
    // Higher confidence for specific date formats
    if (/\d{4}-\d{2}-\d{2}/.test(dateText)) confidence += 0.2;
    if (/\d{1,2}\/\d{1,2}\/\d{4}/.test(dateText)) confidence += 0.15;
    
    // Context-based confidence boost
    if (context.toLowerCase().includes('effective')) confidence += 0.15;
    if (context.toLowerCase().includes('implementation')) confidence += 0.1;
    
    return Math.min(0.95, confidence);
  }

  _calculateJurisdictionConfidence(text, jurisdiction) {
    let confidence = 0.7;
    
    // Exact matches get higher confidence
    if (text.toLowerCase() === jurisdiction.replace('_', ' ')) confidence += 0.2;
    
    // Known abbreviations
    if ((jurisdiction === 'european_union' && text.toLowerCase() === 'eu') ||
        (jurisdiction === 'united_states' && text.toLowerCase() === 'us')) {
      confidence += 0.15;
    }
    
    return Math.min(0.95, confidence);
  }

  _calculateFrameworkConfidence(text, framework) {
    let confidence = 0.8;
    
    // Exact framework names get higher confidence
    if (text.toLowerCase() === framework.replace('_', ' ')) confidence += 0.15;
    
    // Known abbreviations
    if (text.toLowerCase() === framework.toUpperCase()) confidence += 0.1;
    
    return Math.min(0.95, confidence);
  }

  _calculateTimelineConfidence(text, context) {
    let confidence = 0.6;
    
    // Specific time periods get higher confidence
    if (/\d+\s+(days?|weeks?|months?|years?)/.test(text)) confidence += 0.2;
    if (text.toLowerCase().includes('72 hours') || text.toLowerCase().includes('24 hours')) {
      confidence += 0.25;
    }
    
    return Math.min(0.9, confidence);
  }

  /**
   * Calculate readability score (simplified)
   * @param {Array} words - Array of words
   * @param {Array} sentences - Array of sentences
   * @returns {number} - Readability score
   */
  _calculateReadabilityScore(words, sentences) {
    if (sentences.length === 0) return 0;
    
    const avgWordsPerSentence = words.length / sentences.length;
    const readability = Math.max(0, Math.min(100, 100 - (avgWordsPerSentence * 2)));
    
    return Math.round(readability * 100) / 100;
  }

  /**
   * Calculate complexity score
   * @param {Array} words - Array of words
   * @returns {number} - Complexity score
   */
  _calculateComplexityScore(words) {
    if (words.length === 0) return 0;
    
    const complexWords = words.filter(word => word.length > 6 && /^[a-zA-Z]+$/.test(word));
    const complexity = (complexWords.length / words.length) * 100;
    
    return Math.round(complexity * 100) / 100;
  }

  /**
   * Generate cache key for extraction results
   * @param {string} text - Text to analyze
   * @param {Object} options - Options object
   * @returns {string} - Cache key
   */
  _generateCacheKey(text, options) {
    const textHash = this._simpleHash(text);
    const optionsHash = this._simpleHash(JSON.stringify(options));
    return `${textHash}_${optionsHash}`;
  }

  /**
   * Simple hash function
   * @param {string} str - String to hash
   * @returns {number} - Hash value
   */
  _simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
  }
}

/**
 * Framework Suggester Class
 * Suggests appropriate compliance frameworks based on document content
 */
class FrameworkSuggester {
  constructor() {
    this.entityExtractor = new EntityExtractor();
  }

  /**
   * Suggest frameworks based on document analysis
   * @param {string} text - Document text
   * @param {Object} options - Suggestion options
   * @returns {Object} - Suggested frameworks with confidence scores
   */
  suggestFrameworks(text, options = {}) {
    const entities = this.entityExtractor.extractEntities(text);
    const suggestions = {
      timestamp: new Date().toISOString(),
      detectedFrameworks: entities.frameworks,
      detectedJurisdictions: entities.jurisdictions,
      suggestedFrameworks: [],
      confidenceScores: {},
      reasoning: []
    };

    // Base suggestions from detected frameworks
    entities.frameworks.forEach(framework => {
      suggestions.suggestedFrameworks.push(framework.framework);
      suggestions.confidenceScores[framework.framework] = framework.confidence;
      suggestions.reasoning.push(`Detected explicit mention: "${framework.text}"`);
    });

    // Jurisdiction-based suggestions
    entities.jurisdictions.forEach(jurisdiction => {
      const frameworkSuggestions = this._getFrameworksForJurisdiction(jurisdiction.jurisdiction);
      frameworkSuggestions.forEach(fw => {
        if (!suggestions.suggestedFrameworks.includes(fw)) {
          suggestions.suggestedFrameworks.push(fw);
          suggestions.confidenceScores[fw] = jurisdiction.confidence * 0.8;
          suggestions.reasoning.push(`Jurisdiction "${jurisdiction.text}" suggests ${fw}`);
        }
      });
    });

    // Content-based suggestions
    const contentSuggestions = this._analyzeContentForFrameworks(text);
    contentSuggestions.forEach(suggestion => {
      if (!suggestions.suggestedFrameworks.includes(suggestion.framework)) {
        suggestions.suggestedFrameworks.push(suggestion.framework);
        suggestions.confidenceScores[suggestion.framework] = suggestion.confidence;
        suggestions.reasoning.push(suggestion.reason);
      }
    });

    // Sort by confidence
    suggestions.suggestedFrameworks.sort((a, b) => 
      (suggestions.confidenceScores[b] || 0) - (suggestions.confidenceScores[a] || 0)
    );

    return suggestions;
  }

  /**
   * Get frameworks typically associated with a jurisdiction
   * @param {string} jurisdiction - Jurisdiction identifier
   * @returns {Array} - Array of framework identifiers
   */
  _getFrameworksForJurisdiction(jurisdiction) {
    const jurisdictionFrameworks = {
      'european_union': ['gdpr'],
      'united_states': ['hipaa', 'sox', 'glba'],
      'california': ['ccpa'],
      'international': ['iso_27001', 'nist']
    };

    return jurisdictionFrameworks[jurisdiction] || [];
  }

  /**
   * Analyze content for implicit framework indicators
   * @param {string} text - Document text
   * @returns {Array} - Array of framework suggestions
   */
  _analyzeContentForFrameworks(text) {
    const suggestions = [];
    const textLower = text.toLowerCase();

    // Health-related content
    if (textLower.includes('health') || textLower.includes('medical') || 
        textLower.includes('patient') || textLower.includes('healthcare')) {
      suggestions.push({
        framework: 'hipaa',
        confidence: 0.7,
        reason: 'Healthcare-related content detected'
      });
    }

    // Financial content
    if (textLower.includes('financial') || textLower.includes('accounting') || 
        textLower.includes('audit') || textLower.includes('investor')) {
      suggestions.push({
        framework: 'sox',
        confidence: 0.6,
        reason: 'Financial/accounting content detected'
      });
    }

    // Payment processing
    if (textLower.includes('payment') || textLower.includes('credit card') || 
        textLower.includes('cardholder') || textLower.includes('transaction')) {
      suggestions.push({
        framework: 'pci_dss',
        confidence: 0.8,
        reason: 'Payment processing content detected'
      });
    }

    // Data protection/privacy
    if (textLower.includes('personal data') || textLower.includes('privacy') || 
        textLower.includes('data subject') || textLower.includes('consent')) {
      suggestions.push({
        framework: 'gdpr',
        confidence: 0.7,
        reason: 'Data protection/privacy content detected'
      });
    }

    // Information security
    if (textLower.includes('information security') || textLower.includes('cybersecurity') || 
        textLower.includes('security controls') || textLower.includes('risk management')) {
      suggestions.push({
        framework: 'iso_27001',
        confidence: 0.6,
        reason: 'Information security content detected'
      });
    }

    // Children's data
    if (textLower.includes('children') || textLower.includes('minor') || 
        textLower.includes('under 13') || textLower.includes('parental consent')) {
      suggestions.push({
        framework: 'coppa',
        confidence: 0.8,
        reason: 'Children\'s data protection content detected'
      });
    }

    return suggestions;
  }

  /**
   * Validate if suggested frameworks are appropriate
   * @param {Array} frameworks - Array of framework identifiers
   * @param {string} text - Document text
   * @returns {Object} - Validation results
   */
  validateFrameworks(frameworks, text) {
    const entities = this.entityExtractor.extractEntities(text);
    const validation = {
      validFrameworks: [],
      invalidFrameworks: [],
      missingElements: {},
      warnings: []
    };

    frameworks.forEach(framework => {
      const isValid = this._validateFramework(framework, entities, text);
      
      if (isValid.valid) {
        validation.validFrameworks.push(framework);
      } else {
        validation.invalidFrameworks.push(framework);
        validation.missingElements[framework] = isValid.missingElements;
        validation.warnings = validation.warnings.concat(isValid.warnings);
      }
    });

    return validation;
  }

  /**
   * Validate a specific framework against document content
   * @param {string} framework - Framework identifier
   * @param {Object} entities - Extracted entities
   * @param {string} text - Document text
   * @returns {Object} - Validation result
   */
  _validateFramework(framework, entities, text) {
    const validation = {
      valid: true,
      missingElements: [],
      warnings: []
    };

    // Framework-specific validation rules
    switch (framework) {
      case 'gdpr':
        if (!entities.jurisdictions.some(j => j.jurisdiction === 'european_union')) {
          validation.warnings.push('GDPR typically applies to EU jurisdiction');
        }
        if (!text.toLowerCase().includes('personal data')) {
          validation.missingElements.push('personal data definition');
        }
        break;

      case 'hipaa':
        if (!text.toLowerCase().includes('health') && !text.toLowerCase().includes('medical')) {
          validation.valid = false;
          validation.missingElements.push('healthcare context');
        }
        break;

      case 'pci_dss':
        if (!text.toLowerCase().includes('payment') && !text.toLowerCase().includes('card')) {
          validation.valid = false;
          validation.missingElements.push('payment processing context');
        }
        break;

      case 'sox':
        if (!text.toLowerCase().includes('financial') && !text.toLowerCase().includes('audit')) {
          validation.valid = false;
          validation.missingElements.push('financial/audit context');
        }
        break;
    }

    return validation;
  }
}

// Export classes for use in other modules
export { EntityExtractor, FrameworkSuggester };

// Default export for convenience
export default {
  EntityExtractor,
  FrameworkSuggester,
  
  // Utility function for quick entity extraction
  extractEntities: (text, options = {}) => {
    const extractor = new EntityExtractor();
    return extractor.extractEntities(text, options);
  },
  
  // Utility function for framework suggestions
  suggestFrameworks: (text, options = {}) => {
    const suggester = new FrameworkSuggester();
    return suggester.suggestFrameworks(text, options);
  }
};