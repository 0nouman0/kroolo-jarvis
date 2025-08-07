// Comprehensive regulatory rules database for benchmarking
export const regulatoryFrameworks = {
  GDPR: {
    name: "General Data Protection Regulation",
    jurisdiction: "European Union",
    rules: {
      lawful_basis: {
        title: "Lawful Basis for Processing",
        requirement: "Clear lawful basis must be established for all data processing activities",
        category: "Legal Foundation",
        criticality: "Critical",
        benchmarkCriteria: [
          "Lawful basis clearly identified and documented",
          "Basis communicated to data subjects",
          "Regular review of lawful basis validity"
        ],
        keywords: ["lawful basis", "consent", "legitimate interest", "contract", "legal obligation"]
      },
      data_minimization: {
        title: "Data Minimization Principle",
        requirement: "Process only data that is adequate, relevant and limited to what is necessary",
        category: "Data Processing",
        criticality: "High",
        benchmarkCriteria: [
          "Data collection limited to stated purposes",
          "Regular data audits conducted",
          "Data retention periods defined"
        ],
        keywords: ["data minimization", "adequate", "relevant", "necessary", "purpose limitation"]
      },
      data_subject_rights: {
        title: "Data Subject Rights",
        requirement: "Procedures for handling data subject requests",
        category: "Individual Rights",
        criticality: "Critical",
        benchmarkCriteria: [
          "Right to access procedures defined",
          "Right to rectification processes",
          "Right to erasure implementation",
          "Data portability mechanisms",
          "Response timeframes specified"
        ],
        keywords: ["data subject rights", "access", "rectification", "erasure", "portability", "right to be forgotten"]
      },
      privacy_by_design: {
        title: "Privacy by Design",
        requirement: "Privacy considerations integrated into system design",
        category: "Technical Measures",
        criticality: "High",
        benchmarkCriteria: [
          "Privacy impact assessments conducted",
          "Technical safeguards implemented",
          "Privacy-friendly default settings"
        ],
        keywords: ["privacy by design", "impact assessment", "technical safeguards", "default settings"]
      }
    }
  },
  HIPAA: {
    name: "Health Insurance Portability and Accountability Act",
    jurisdiction: "United States",
    rules: {
      administrative_safeguards: {
        title: "Administrative Safeguards",
        requirement: "Implement administrative actions and policies to manage security measures",
        category: "Administrative",
        criticality: "Critical",
        benchmarkCriteria: [
          "Security officer designated",
          "Workforce training program established",
          "Access management procedures documented",
          "Incident response procedures defined"
        ],
        keywords: ["security officer", "workforce training", "access management", "incident response"]
      },
      physical_safeguards: {
        title: "Physical Safeguards",
        requirement: "Physical measures to protect PHI and systems",
        category: "Physical Security",
        criticality: "High",
        benchmarkCriteria: [
          "Facility access controls implemented",
          "Workstation security measures",
          "Media controls established",
          "Equipment disposal procedures"
        ],
        keywords: ["facility access", "workstation security", "media controls", "equipment disposal"]
      },
      technical_safeguards: {
        title: "Technical Safeguards",
        requirement: "Technology controls to protect PHI",
        category: "Technical Security",
        criticality: "Critical",
        benchmarkCriteria: [
          "Access control systems implemented",
          "Audit logs maintained",
          "Data integrity controls",
          "Transmission security measures"
        ],
        keywords: ["access control", "audit logs", "data integrity", "transmission security", "encryption"]
      },
      breach_notification: {
        title: "Breach Notification",
        requirement: "Procedures for breach detection and notification",
        category: "Incident Management",
        criticality: "Critical",
        benchmarkCriteria: [
          "Breach detection procedures",
          "60-day notification timeline",
          "Risk assessment methodology",
          "Documentation requirements"
        ],
        keywords: ["breach notification", "60 days", "risk assessment", "documentation"]
      }
    }
  },
  SOX: {
    name: "Sarbanes-Oxley Act",
    jurisdiction: "United States",
    rules: {
      internal_controls: {
        title: "Internal Controls Over Financial Reporting",
        requirement: "Establish and maintain adequate internal control over financial reporting",
        category: "Financial Controls",
        criticality: "Critical",
        benchmarkCriteria: [
          "Control environment assessment documented",
          "Risk assessment procedures established",
          "Control activities documented",
          "Information systems controls",
          "Monitoring activities implemented"
        ],
        keywords: ["internal controls", "financial reporting", "control environment", "risk assessment"]
      },
      management_assessment: {
        title: "Management Assessment",
        requirement: "Annual assessment of internal controls effectiveness",
        category: "Management Oversight",
        criticality: "High",
        benchmarkCriteria: [
          "Annual assessment conducted",
          "Material weaknesses identified",
          "Remediation plans documented",
          "Executive certification"
        ],
        keywords: ["management assessment", "annual", "material weaknesses", "certification"]
      },
      auditor_independence: {
        title: "Auditor Independence",
        requirement: "Maintain auditor independence and objectivity",
        category: "Audit Governance",
        criticality: "High",
        benchmarkCriteria: [
          "Non-audit services restrictions",
          "Audit committee oversight",
          "Partner rotation requirements",
          "Conflicts of interest management"
        ],
        keywords: ["auditor independence", "audit committee", "partner rotation", "conflicts"]
      }
    }
  },
  CCPA: {
    name: "California Consumer Privacy Act",
    jurisdiction: "California, United States",
    rules: {
      consumer_rights: {
        title: "Consumer Privacy Rights",
        requirement: "Provide consumers with specific privacy rights",
        category: "Consumer Rights",
        criticality: "Critical",
        benchmarkCriteria: [
          "Right to know implementation",
          "Right to delete procedures",
          "Right to opt-out mechanisms",
          "Non-discrimination protections"
        ],
        keywords: ["right to know", "right to delete", "opt-out", "non-discrimination"]
      },
      privacy_notice: {
        title: "Privacy Notice Requirements",
        requirement: "Comprehensive privacy notice disclosure",
        category: "Transparency",
        criticality: "High",
        benchmarkCriteria: [
          "Categories of information collected",
          "Sources of information disclosed",
          "Business purposes explained",
          "Third-party sharing disclosed"
        ],
        keywords: ["privacy notice", "categories", "sources", "business purposes", "third parties"]
      }
    }
  },
  PCI_DSS: {
    name: "Payment Card Industry Data Security Standard",
    jurisdiction: "Global",
    rules: {
      network_security: {
        title: "Network Security Controls",
        requirement: "Build and maintain secure network infrastructure",
        category: "Network Security",
        criticality: "Critical",
        benchmarkCriteria: [
          "Firewall configuration maintained",
          "Default passwords changed",
          "Network segmentation implemented",
          "Wireless security controls"
        ],
        keywords: ["firewall", "default passwords", "network segmentation", "wireless security"]
      },
      cardholder_data: {
        title: "Cardholder Data Protection",
        requirement: "Protect stored cardholder data",
        category: "Data Protection",
        criticality: "Critical",
        benchmarkCriteria: [
          "Data encryption implemented",
          "Storage minimization practices",
          "Secure deletion procedures",
          "Key management processes"
        ],
        keywords: ["encryption", "cardholder data", "secure deletion", "key management"]
      }
    }
  },
  ISO_27001: {
    name: "ISO 27001 Information Security Management",
    jurisdiction: "International",
    rules: {
      information_security_policy: {
        title: "Information Security Policy",
        requirement: "Documented information security policy approved by management",
        category: "Governance",
        criticality: "Critical",
        benchmarkCriteria: [
          "Management commitment demonstrated",
          "Policy regularly reviewed and updated",
          "Communication to all personnel",
          "Compliance monitoring established"
        ],
        keywords: ["information security policy", "management approval", "policy review", "communication"]
      },
      risk_management: {
        title: "Information Security Risk Management",
        requirement: "Systematic approach to managing information security risks",
        category: "Risk Management",
        criticality: "Critical",
        benchmarkCriteria: [
          "Risk assessment methodology defined",
          "Risk treatment plans implemented",
          "Regular risk reviews conducted",
          "Risk acceptance criteria established"
        ],
        keywords: ["risk assessment", "risk treatment", "risk management", "risk criteria"]
      },
      access_control: {
        title: "Access Control Management",
        requirement: "Restrict access to information and information processing facilities",
        category: "Access Control",
        criticality: "High",
        benchmarkCriteria: [
          "Access control policy established",
          "User access provisioning procedures",
          "Regular access reviews conducted",
          "Privileged access management"
        ],
        keywords: ["access control", "user access", "privileged access", "access review"]
      }
    }
  },
  FERPA: {
    name: "Family Educational Rights and Privacy Act",
    jurisdiction: "United States",
    rules: {
      educational_records: {
        title: "Educational Records Protection",
        requirement: "Protect privacy of student educational records",
        category: "Privacy Protection",
        criticality: "Critical",
        benchmarkCriteria: [
          "Student records properly secured",
          "Access limited to authorized personnel",
          "Disclosure procedures documented",
          "Parent/student rights respected"
        ],
        keywords: ["educational records", "student privacy", "authorized access", "disclosure"]
      },
      directory_information: {
        title: "Directory Information Management",
        requirement: "Handle directory information according to FERPA requirements",
        category: "Information Management",
        criticality: "Medium",
        benchmarkCriteria: [
          "Directory information defined",
          "Opt-out procedures available",
          "Annual notification provided",
          "Release procedures documented"
        ],
        keywords: ["directory information", "opt-out", "annual notice", "release procedures"]
      }
    }
  },
  GLBA: {
    name: "Gramm-Leach-Bliley Act",
    jurisdiction: "United States",
    rules: {
      privacy_notices: {
        title: "Privacy Notices",
        requirement: "Provide clear privacy notices to customers",
        category: "Privacy Communication",
        criticality: "Critical",
        benchmarkCriteria: [
          "Initial privacy notice provided",
          "Annual privacy notice delivered",
          "Opt-out notice included",
          "Clear and conspicuous format"
        ],
        keywords: ["privacy notice", "annual notice", "opt-out", "customer notification"]
      },
      safeguards_rule: {
        title: "Safeguards Rule Compliance",
        requirement: "Implement comprehensive information security program",
        category: "Information Security",
        criticality: "Critical",
        benchmarkCriteria: [
          "Written information security program",
          "Designated security coordinator",
          "Regular security assessments",
          "Vendor management procedures"
        ],
        keywords: ["safeguards rule", "security program", "security coordinator", "vendor management"]
      }
    }
  },
  COPPA: {
    name: "Children's Online Privacy Protection Act",
    jurisdiction: "United States",
    rules: {
      parental_consent: {
        title: "Parental Consent Requirements",
        requirement: "Obtain verifiable parental consent before collecting children's information",
        category: "Consent Management",
        criticality: "Critical",
        benchmarkCriteria: [
          "Verifiable consent mechanisms",
          "Age verification procedures",
          "Consent documentation maintained",
          "Withdrawal procedures available"
        ],
        keywords: ["parental consent", "verifiable consent", "age verification", "children under 13"]
      },
      data_minimization: {
        title: "Children's Data Minimization",
        requirement: "Collect only information reasonably necessary for participation",
        category: "Data Protection",
        criticality: "High",
        benchmarkCriteria: [
          "Data collection limited to necessity",
          "Purpose clearly defined",
          "Retention periods specified",
          "Secure deletion procedures"
        ],
        keywords: ["data minimization", "reasonably necessary", "participation", "children's data"]
      }
    }
  },
  NIST_CSF: {
    name: "NIST Cybersecurity Framework",
    jurisdiction: "United States",
    rules: {
      identify_function: {
        title: "Identify Function",
        requirement: "Develop organizational understanding to manage cybersecurity risk",
        category: "Risk Identification",
        criticality: "High",
        benchmarkCriteria: [
          "Asset management processes",
          "Risk assessment procedures",
          "Risk management strategy",
          "Supply chain risk management"
        ],
        keywords: ["asset management", "risk assessment", "cybersecurity risk", "supply chain"]
      },
      protect_function: {
        title: "Protect Function",
        requirement: "Implement appropriate safeguards to ensure delivery of critical services",
        category: "Protective Measures",
        criticality: "Critical",
        benchmarkCriteria: [
          "Access control implementation",
          "Awareness and training programs",
          "Data security measures",
          "Protective technology deployed"
        ],
        keywords: ["access control", "awareness training", "data security", "protective technology"]
      },
      detect_function: {
        title: "Detect Function",
        requirement: "Implement activities to identify cybersecurity events",
        category: "Detection Capabilities",
        criticality: "High",
        benchmarkCriteria: [
          "Continuous monitoring implemented",
          "Detection processes established",
          "Anomaly detection capabilities",
          "Security event correlation"
        ],
        keywords: ["continuous monitoring", "detection processes", "anomaly detection", "security events"]
      }
    }
  },
  CAN_SPAM: {
    name: "CAN-SPAM Act",
    jurisdiction: "United States",
    rules: {
      header_accuracy: {
        title: "Header Information Accuracy",
        requirement: "Don't use false or misleading header information",
        category: "Message Integrity",
        criticality: "Critical",
        benchmarkCriteria: [
          "From field accuracy verified",
          "Reply-to addresses functional",
          "Subject line truthfulness",
          "Routing information accuracy"
        ],
        keywords: ["header information", "from field", "reply-to", "subject line"]
      },
      unsubscribe_mechanisms: {
        title: "Unsubscribe Mechanisms",
        requirement: "Provide clear and easy way to opt out",
        category: "Consent Management",
        criticality: "Critical",
        benchmarkCriteria: [
          "Clear unsubscribe option",
          "Working unsubscribe mechanism",
          "Prompt processing of requests",
          "No fee for unsubscribing"
        ],
        keywords: ["unsubscribe", "opt-out", "clear option", "no fee"]
      }
    }
  },
  FISMA: {
    name: "Federal Information Security Management Act",
    jurisdiction: "United States",
    rules: {
      security_program: {
        title: "Information Security Program",
        requirement: "Implement comprehensive information security program",
        category: "Security Management",
        criticality: "Critical",
        benchmarkCriteria: [
          "Security program documented",
          "Periodic assessments conducted",
          "Security plans maintained",
          "Continuous monitoring implemented"
        ],
        keywords: ["security program", "periodic assessments", "security plans", "continuous monitoring"]
      },
      incident_response: {
        title: "Incident Response Procedures",
        requirement: "Establish incident response and reporting procedures",
        category: "Incident Management",
        criticality: "High",
        benchmarkCriteria: [
          "Incident response plan documented",
          "Response team established",
          "Reporting procedures defined",
          "Recovery procedures documented"
        ],
        keywords: ["incident response", "response plan", "reporting procedures", "recovery"]
      }
    }
  }
};

// Rules Benchmarking Engine
export class RulesBenchmarkingEngine {
  constructor() {
    this.frameworks = regulatoryFrameworks;
  }

  // Evaluate policy text against specific regulatory framework
  evaluateAgainstFramework(policyText, frameworkName) {
    if (!this.frameworks[frameworkName]) {
      throw new Error(`Framework ${frameworkName} not supported`);
    }

    const framework = this.frameworks[frameworkName];
    const results = {
      frameworkName,
      frameworkFullName: framework.name,
      jurisdiction: framework.jurisdiction,
      overallScore: 0,
      maxScore: 100,
      maturityLevel: '',
      ruleEvaluations: {},
      recommendations: [],
      strengths: []
    };

    let totalScore = 0;
    let totalMaxScore = 0;

    // Evaluate each rule
    for (const [ruleId, rule] of Object.entries(framework.rules)) {
      const evaluation = this.evaluateRule(policyText, rule);
      results.ruleEvaluations[ruleId] = {
        ...evaluation,
        title: rule.title,
        category: rule.category,
        criticality: rule.criticality
      };
      
      totalScore += evaluation.score;
      totalMaxScore += evaluation.maxScore;
      
      if (evaluation.score < evaluation.maxScore * 0.7) {
        results.recommendations.push({
          ruleId,
          title: rule.title,
          category: rule.category,
          gaps: evaluation.gaps,
          criticality: rule.criticality,
          recommendations: evaluation.recommendations,
          currentScore: evaluation.percentage,
          targetScore: 90
        });
      } else if (evaluation.score >= evaluation.maxScore * 0.8) {
        results.strengths.push({
          ruleId,
          title: rule.title,
          score: evaluation.percentage
        });
      }
    }

    results.overallScore = Math.round((totalScore / totalMaxScore) * 100);
    results.maturityLevel = this.getMaturityLevel(results.overallScore);

    return results;
  }

  // Evaluate a single rule against policy text
  evaluateRule(policyText, rule) {
    const policyTextLower = policyText.toLowerCase();
    let score = 0;
    const maxScore = 100; // 100 points per rule
    const gaps = [];
    const recommendations = [];

    // Check for keyword presence (40% of score)
    const keywordMatches = rule.keywords.filter(keyword => 
      policyTextLower.includes(keyword.toLowerCase())
    );
    const keywordScore = (keywordMatches.length / rule.keywords.length) * 40;
    score += keywordScore;

    // Detailed criteria evaluation (60% of score)
    const criteriaScore = (60 / rule.benchmarkCriteria.length);
    rule.benchmarkCriteria.forEach((criterion, index) => {
      const criterionMet = this.evaluateCriterion(policyTextLower, criterion);
      if (criterionMet) {
        score += criteriaScore;
      } else {
        gaps.push(criterion);
        recommendations.push(`Implement: ${criterion}`);
      }
    });

    // Ensure score doesn't exceed maxScore
    score = Math.min(score, maxScore);

    return {
      score: Math.round(score),
      maxScore,
      percentage: Math.round(score),
      gaps,
      recommendations,
      keywordMatches: keywordMatches.length,
      totalKeywords: rule.keywords.length,
      keywordCoverage: Math.round((keywordMatches.length / rule.keywords.length) * 100)
    };
  }

  // Simple criterion evaluation (enhanced with better keyword matching)
  evaluateCriterion(policyText, criterion) {
    const criterionKeywords = this.extractKeywords(criterion);
    const matchedKeywords = criterionKeywords.filter(keyword => 
      policyText.includes(keyword.toLowerCase())
    );
    
    // Consider criterion met if at least 50% of keywords are present
    return matchedKeywords.length / criterionKeywords.length >= 0.5;
  }

  // Extract meaningful keywords from criterion text
  extractKeywords(text) {
    const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should']);
    
    return text.toLowerCase()
      .replace(/[^\w\s]/g, ' ') // Remove punctuation
      .split(/\s+/)
      .filter(word => word.length > 2 && !stopWords.has(word))
      .slice(0, 6); // Take first 6 meaningful words
  }

  // Calculate approximate percentile based on industry benchmarks
  calculatePercentile(score, benchmark) {
    if (score >= benchmark.top10) return 95;
    if (score >= benchmark.average + 8) return 80;
    if (score >= benchmark.average + 4) return 70;
    if (score >= benchmark.average) return 60;
    if (score >= benchmark.median) return 45;
    if (score >= benchmark.bottom25) return 30;
    if (score >= benchmark.bottom25 - 10) return 15;
    return 5;
  }

  // Determine maturity level based on score
  getMaturityLevel(score) {
    if (score >= 90) return 'Advanced';
    if (score >= 75) return 'Intermediate';
    if (score >= 60) return 'Developing';
    if (score >= 40) return 'Basic';
    return 'Initial';
  }

  // Get industry benchmark data with more comprehensive scoring
  getIndustryBenchmarks(industry = 'Technology') {
    const benchmarks = {
      'Technology': { 
        average: 78, 
        top10: 92, 
        median: 75,
        bottom25: 65,
        description: 'Technology companies typically excel in data security but may lag in governance documentation'
      },
      'Healthcare': { 
        average: 85, 
        top10: 95, 
        median: 83,
        bottom25: 75,
        description: 'Healthcare organizations generally have strong compliance due to HIPAA requirements'
      },
      'Financial Services': { 
        average: 88, 
        top10: 96, 
        median: 86,
        bottom25: 78,
        description: 'Financial sector leads in compliance due to strict regulatory oversight'
      },
      'Financial': { 
        average: 88, 
        top10: 96, 
        median: 86,
        bottom25: 78,
        description: 'Financial sector leads in compliance due to strict regulatory oversight'
      },
      'Manufacturing': { 
        average: 72, 
        top10: 89, 
        median: 70,
        bottom25: 58,
        description: 'Manufacturing focuses on operational compliance but may need privacy improvements'
      },
      'Retail': { 
        average: 70, 
        top10: 87, 
        median: 68,
        bottom25: 55,
        description: 'Retail sector varies widely in compliance maturity'
      },
      'Education': { 
        average: 74, 
        top10: 88, 
        median: 72,
        bottom25: 62,
        description: 'Educational institutions balance accessibility with privacy requirements'
      },
      'Government': { 
        average: 82, 
        top10: 94, 
        median: 80,
        bottom25: 70,
        description: 'Government entities have strong framework compliance but implementation varies'
      },
      'Non-Profit': { 
        average: 68, 
        top10: 85, 
        median: 65,
        bottom25: 52,
        description: 'Non-profits often have limited resources for comprehensive compliance programs'
      },
      'Default': { 
        average: 75, 
        top10: 90, 
        median: 73,
        bottom25: 60,
        description: 'General industry baseline with room for improvement across most areas'
      }
    };
    
    return benchmarks[industry] || benchmarks['Default'];
  }

  // Comprehensive benchmarking across multiple frameworks
  performComprehensiveBenchmarking(policyText, selectedFrameworks = ['GDPR', 'HIPAA', 'SOX'], industry = 'Technology') {
    const results = {
      overallResults: {
        averageScore: 0,
        maturityDistribution: {},
        criticalGaps: 0,
        highGaps: 0,
        mediumGaps: 0,
        totalStrengths: 0,
        industryBenchmark: this.getIndustryBenchmarks(industry),
        benchmarkComparison: ''
      },
      frameworkResults: {},
      prioritizedRecommendations: [],
      topStrengths: [],
      complianceMatrix: []
    };

    const frameworkScores = [];
    const allRecommendations = [];
    const allStrengths = [];

    // Ensure selectedFrameworks is always an array with proper validation
    let frameworksArray;
    if (!selectedFrameworks) {
      frameworksArray = ['GDPR', 'HIPAA', 'SOX'];
    } else if (Array.isArray(selectedFrameworks)) {
      frameworksArray = selectedFrameworks.length > 0 ? selectedFrameworks : ['GDPR', 'HIPAA', 'SOX'];
    } else {
      frameworksArray = [selectedFrameworks];
    }

    console.log('Processing frameworks:', frameworksArray);

    // Evaluate against each framework
    frameworksArray.forEach(framework => {
      try {
        const frameworkResult = this.evaluateAgainstFramework(policyText, framework);
        results.frameworkResults[framework] = frameworkResult;
        frameworkScores.push(frameworkResult.overallScore);
        
        // Collect recommendations with framework context
        frameworkResult.recommendations.forEach(rec => {
          allRecommendations.push({
            ...rec,
            framework: framework,
            frameworkName: frameworkResult.frameworkFullName,
            jurisdiction: frameworkResult.jurisdiction
          });
        });

        // Collect strengths
        frameworkResult.strengths.forEach(strength => {
          allStrengths.push({
            ...strength,
            framework: framework,
            frameworkName: frameworkResult.frameworkFullName
          });
        });

        // Add to compliance matrix
        results.complianceMatrix.push({
          framework: framework,
          name: frameworkResult.frameworkFullName,
          score: frameworkResult.overallScore,
          maturity: frameworkResult.maturityLevel,
          criticalIssues: frameworkResult.recommendations.filter(r => r.criticality === 'Critical').length,
          highIssues: frameworkResult.recommendations.filter(r => r.criticality === 'High').length
        });

      } catch (error) {
        console.warn(`Could not evaluate framework ${framework}:`, error.message);
      }
    });

    // Calculate overall metrics
    results.overallResults.averageScore = frameworkScores.length > 0 
      ? Math.round(frameworkScores.reduce((sum, score) => sum + score, 0) / frameworkScores.length)
      : 0;

    // Count gaps by criticality
    allRecommendations.forEach(rec => {
      if (rec.criticality === 'Critical') results.overallResults.criticalGaps++;
      else if (rec.criticality === 'High') results.overallResults.highGaps++;
      else results.overallResults.mediumGaps++;
    });

    results.overallResults.totalStrengths = allStrengths.length;

    // Enhanced industry benchmark comparison
    const industryBenchmark = results.overallResults.industryBenchmark;
    const userScore = results.overallResults.averageScore;
    const scoreDifference = userScore - industryBenchmark.average;
    
    // More nuanced benchmark categorization
    if (userScore >= industryBenchmark.top10) {
      results.overallResults.benchmarkComparison = 'Top 10% performer';
      results.overallResults.benchmarkStatus = 'excellent';
      results.overallResults.benchmarkMessage = `Outstanding compliance performance - you're in the top 10% of ${industry} organizations`;
    } else if (userScore >= industryBenchmark.average + 5) {
      results.overallResults.benchmarkComparison = 'Above average';
      results.overallResults.benchmarkStatus = 'good';
      results.overallResults.benchmarkMessage = `Strong compliance performance - significantly above ${industry} industry average`;
    } else if (userScore >= industryBenchmark.average) {
      results.overallResults.benchmarkComparison = 'At industry average';
      results.overallResults.benchmarkStatus = 'average';
      results.overallResults.benchmarkMessage = `Solid compliance foundation - meets ${industry} industry standards`;
    } else if (userScore >= industryBenchmark.median) {
      results.overallResults.benchmarkComparison = 'Below average';
      results.overallResults.benchmarkStatus = 'below-average';
      results.overallResults.benchmarkMessage = `Room for improvement - below ${industry} industry average but above median`;
    } else if (userScore >= industryBenchmark.bottom25) {
      results.overallResults.benchmarkComparison = 'Needs improvement';
      results.overallResults.benchmarkStatus = 'poor';
      results.overallResults.benchmarkMessage = `Significant gaps identified - below ${industry} industry median`;
    } else {
      results.overallResults.benchmarkComparison = 'Requires immediate attention';
      results.overallResults.benchmarkStatus = 'critical';
      results.overallResults.benchmarkMessage = `Critical compliance gaps - urgent improvements needed to meet industry standards`;
    }
    
    // Add detailed benchmark metrics
    results.overallResults.benchmarkDifference = scoreDifference;
    results.overallResults.benchmarkPercentile = this.calculatePercentile(userScore, industryBenchmark);
    results.overallResults.improvementTarget = Math.max(industryBenchmark.average, userScore + 10);
    results.overallResults.industryContext = industryBenchmark.description;

    // Prioritize recommendations
    results.prioritizedRecommendations = this.prioritizeRecommendations(allRecommendations);

    // Top strengths
    results.topStrengths = allStrengths
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    return results;
  }

  // Prioritize recommendations based on criticality and impact
  prioritizeRecommendations(recommendations) {
    const priorityOrder = { 'Critical': 1, 'High': 2, 'Medium': 3, 'Low': 4 };
    
    return recommendations
      .sort((a, b) => {
        const priorityDiff = priorityOrder[a.criticality] - priorityOrder[b.criticality];
        if (priorityDiff !== 0) return priorityDiff;
        
        // If same priority, sort by gap count and current score
        const gapDiff = b.gaps.length - a.gaps.length;
        if (gapDiff !== 0) return gapDiff;
        
        return a.currentScore - b.currentScore; // Lower scores first
      })
      .map((rec, index) => ({
        priority: index + 1,
        ...rec,
        estimatedEffort: this.estimateImplementationEffort(rec),
        timeframe: this.getImplementationTimeframe(rec.criticality),
        businessImpact: this.getBusinessImpact(rec.criticality)
      }));
  }

  // Estimate implementation effort
  estimateImplementationEffort(recommendation) {
    const gapCount = recommendation.gaps.length;
    const currentScore = recommendation.currentScore;
    
    if (currentScore < 30 || gapCount >= 4) return 'High';
    if (currentScore < 60 || gapCount >= 2) return 'Medium';
    return 'Low';
  }

  // Get implementation timeframe based on criticality
  getImplementationTimeframe(criticality) {
    const timeframes = {
      'Critical': 'Immediate (0-30 days)',
      'High': 'Short-term (30-90 days)',
      'Medium': 'Medium-term (90-180 days)',
      'Low': 'Long-term (180+ days)'
    };
    return timeframes[criticality] || 'Medium-term (90-180 days)';
  }

  // Get business impact description
  getBusinessImpact(criticality) {
    const impacts = {
      'Critical': 'High regulatory and financial risk',
      'High': 'Moderate compliance and operational risk', 
      'Medium': 'Low to moderate process risk',
      'Low': 'Minor operational efficiency impact'
    };
    return impacts[criticality] || 'Moderate impact';
  }
}

export default RulesBenchmarkingEngine;
