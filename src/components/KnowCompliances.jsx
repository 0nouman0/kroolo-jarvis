import { useState } from 'react';
import { searchCompliance } from '../lib/gemini.js';
import SearchLoadingAnimation from './SearchLoadingAnimation.jsx';

function KnowCompliances({ onNavigate }) {
  const [selectedCompliance, setSelectedCompliance] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [showAllCompliances, setShowAllCompliances] = useState(true);

  const compliances = {
    GDPR: {
      title: "GDPR - General Data Protection Regulation",
      region: "European Union",
      year: "2018",
      description: "The GDPR is Europe's privacy law that protects how companies handle personal data of EU citizens.",
      keyPoints: [
        "Applies to any company that processes EU citizens' personal data",
        "Requires explicit consent before collecting personal information",
        "Gives people the right to see, correct, or delete their data",
        "Companies must report data breaches within 72 hours",
        "Fines can be up to 4% of global annual revenue or €20 million",
        "Must appoint a Data Protection Officer (DPO) for high-risk processing"
      ],
      whoNeedsIt: "Any business that collects data from EU residents, regardless of where the business is located.",
      simpleExample: "If you run an online store and someone from Germany buys from you, you need to follow GDPR rules for their personal information."
    },
    HIPAA: {
      title: "HIPAA - Health Insurance Portability and Accountability Act",
      region: "United States",
      year: "1996",
      description: "HIPAA protects sensitive patient health information in the United States healthcare system.",
      keyPoints: [
        "Protects all medical records and health information",
        "Patients have the right to access their own health records",
        "Healthcare providers must get patient consent before sharing information",
        "Requires secure storage and transmission of health data",
        "Staff must be trained on privacy and security procedures",
        "Penalties range from $100 to $50,000 per violation"
      ],
      whoNeedsIt: "Hospitals, doctors, health insurance companies, and any business that handles health information.",
      simpleExample: "When you visit a doctor, they can't share your medical information with anyone else without your written permission."
    },
    SOX: {
      title: "SOX - Sarbanes-Oxley Act",
      region: "United States",
      year: "2002",
      description: "SOX ensures that public companies provide accurate financial information to investors and the public.",
      keyPoints: [
        "CEOs and CFOs must personally certify financial reports are accurate",
        "Companies must have strong internal controls over financial reporting",
        "External auditors must be independent from the company",
        "Whistleblower protections for employees reporting fraud",
        "Severe criminal penalties for executives who knowingly certify false financials",
        "Regular testing and documentation of financial controls required"
      ],
      whoNeedsIt: "All publicly traded companies in the US and their subsidiaries.",
      simpleExample: "If you own stock in a company, SOX helps ensure the financial reports you see are truthful and accurate."
    },
    CCPA: {
      title: "CCPA - California Consumer Privacy Act",
      region: "California, USA",
      year: "2020",
      description: "CCPA gives California residents control over how businesses collect and use their personal information.",
      keyPoints: [
        "California residents can know what personal info is collected about them",
        "Right to delete personal information held by businesses",
        "Right to opt-out of the sale of personal information",
        "Right to non-discriminatory treatment when exercising privacy rights",
        "Businesses must provide clear privacy notices",
        "Fines up to $7,500 per intentional violation"
      ],
      whoNeedsIt: "Businesses that serve California residents and meet certain size/revenue thresholds.",
      simpleExample: "If you live in California, you can ask companies what information they have about you and tell them to delete it."
    },
    PCI_DSS: {
      title: "PCI DSS - Payment Card Industry Data Security Standard",
      region: "Global",
      year: "2004",
      description: "PCI DSS ensures that companies that accept credit cards protect cardholder data from theft and fraud.",
      keyPoints: [
        "Secure storage of cardholder data with encryption",
        "Regular security testing and monitoring of networks",
        "Strong access controls - only authorized people can access card data",
        "Regular software updates and security patches",
        "Maintain secure networks with firewalls",
        "Four compliance levels based on transaction volume"
      ],
      whoNeedsIt: "Any business that accepts, processes, stores, or transmits credit card information.",
      simpleExample: "When you buy something online with a credit card, PCI DSS ensures the store keeps your card number safe from hackers."
    },
    ISO_27001: {
      title: "ISO 27001 - Information Security Management",
      region: "International",
      year: "2005",
      description: "ISO 27001 is an international standard that helps organizations manage and protect their information assets.",
      keyPoints: [
        "Systematic approach to managing sensitive company and customer information",
        "Risk assessment and management processes for information security",
        "Regular security audits and continuous improvement",
        "Employee training and awareness programs",
        "Incident response and business continuity planning",
        "Certification available through accredited bodies"
      ],
      whoNeedsIt: "Any organization that wants to demonstrate strong information security practices, especially those handling sensitive data.",
      simpleExample: "A company gets ISO 27001 certified to show customers they take information security seriously and follow international best practices."
    },
    NIST_CSF: {
      title: "NIST Cybersecurity Framework",
      region: "United States",
      year: "2014",
      description: "NIST CSF provides a flexible framework for organizations to manage and improve their cybersecurity posture.",
      keyPoints: [
        "Five core functions: Identify, Protect, Detect, Respond, Recover",
        "Voluntary framework that can be adapted to any organization",
        "Risk-based approach to cybersecurity management",
        "Promotes communication between technical and business teams",
        "Regular updates to address evolving cyber threats",
        "Widely adopted across government and private sectors"
      ],
      whoNeedsIt: "Any organization looking to improve their cybersecurity practices, especially critical infrastructure providers.",
      simpleExample: "A power company uses NIST CSF to create a plan for protecting their systems from cyber attacks and recovering if something goes wrong."
    },
    CAN_SPAM: {
      title: "CAN-SPAM Act",
      region: "United States",
      year: "2003",
      description: "CAN-SPAM establishes rules for commercial email and gives recipients the right to stop unwanted emails.",
      keyPoints: [
        "Don't use false or misleading header information or subject lines",
        "Identify the message as an advertisement if it's promotional",
        "Tell recipients where you're located with a valid physical address",
        "Provide a clear and easy way to opt out of future emails",
        "Honor opt-out requests promptly (within 10 business days)",
        "Monitor what others do on your behalf for email marketing"
      ],
      whoNeedsIt: "Any business that sends commercial emails or marketing messages to customers.",
      simpleExample: "When a store sends you promotional emails, CAN-SPAM ensures they include an unsubscribe link and honor your request to stop."
    },
    FISMA: {
      title: "FISMA - Federal Information Security Management Act",
      region: "United States",
      year: "2002",
      description: "FISMA requires federal agencies and contractors to secure their information systems and data.",
      keyPoints: [
        "Mandatory for federal agencies and government contractors",
        "Risk-based approach to information security",
        "Annual security assessments and continuous monitoring",
        "Incident reporting requirements to appropriate authorities",
        "Security controls based on NIST standards",
        "Certification and accreditation of information systems"
      ],
      whoNeedsIt: "Federal agencies, government contractors, and organizations that handle federal information.",
      simpleExample: "A company working on a government contract must follow FISMA rules to protect any government data they handle."
    }
  };

  const handleComplianceClick = (complianceKey) => {
    setSelectedCompliance(selectedCompliance === complianceKey ? null : complianceKey);
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults(null);
      setShowAllCompliances(true);
      return;
    }

    setIsSearching(true);
    setShowAllCompliances(false);
    
    try {
      const results = await searchCompliance(searchQuery, compliances);
      setSearchResults(results);
    } catch (error) {
      console.error('Search failed:', error);
      setSearchResults({
        error: 'Search failed. Please try again.',
        relevantCompliances: []
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
    if (!e.target.value.trim()) {
      setSearchResults(null);
      setShowAllCompliances(true);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults(null);
    setShowAllCompliances(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-50">
      {/* Enhanced Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 p-6 shadow-lg sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button
            onClick={() => onNavigate('home')}
            className="group bg-gradient-to-r from-slate-700 to-slate-800 text-white px-6 py-3 rounded-xl font-bold hover:from-slate-800 hover:to-slate-900 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <span className="flex items-center space-x-2">
              <span className="group-hover:-translate-x-1 transition-transform duration-300">←</span>
              <span>Back to home</span>
            </span>
          </button>
          <div className="text-center">
            <h1 className="text-4xl font-black bg-gradient-to-r from-slate-800 via-emerald-700 to-teal-700 bg-clip-text text-transparent">
              Know Your Compliances
            </h1>
            <p className="text-gray-600 mt-1 font-medium">Understanding regulatory frameworks made simple</p>
          </div>
          <div className="w-24"></div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <div className="max-w-6xl mx-auto">
          
          {/* Enhanced Introduction */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-10 shadow-xl border border-white/20 mb-10 text-center">
            <h2 className="text-3xl font-black bg-gradient-to-r from-slate-800 to-emerald-700 bg-clip-text text-transparent mb-6">Regulatory frameworks made simple</h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto font-medium leading-relaxed mb-8">
              Understanding compliance doesn't have to be complicated. Learn about major regulatory requirements 
              in clear, simple language that anyone can understand.
            </p>

            {/* Smart Search Box */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <div className="flex items-center bg-gradient-to-r from-gray-50 to-emerald-50 rounded-xl border-2 border-gray-200 focus-within:border-emerald-500 transition-all duration-300 shadow-lg">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchInputChange}
                    onKeyPress={handleKeyPress}
                    placeholder="Search compliance topics... (e.g., 'data protection', 'healthcare privacy', 'financial reporting')"
                    className="flex-1 px-6 py-4 bg-transparent text-gray-800 placeholder-gray-500 focus:outline-none font-medium text-lg"
                  />
                  {searchQuery && (
                    <button
                      onClick={clearSearch}
                      className="p-2 mr-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                      title="Clear search"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                  <button
                    onClick={handleSearch}
                    disabled={!searchQuery.trim() || isSearching}
                    className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-8 py-4 rounded-xl font-bold hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
                  >
                    {isSearching ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Searching...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <span>Search</span>
                      </div>
                    )}
                  </button>
                </div>
              </div>
              
              {/* Search suggestions */}
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                <span className="text-sm text-gray-500 mr-2">Try:</span>
                {['data privacy', 'healthcare compliance', 'financial reporting', 'email marketing', 'cybersecurity', 'payment processing', 'breach notification'].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => {
                      setSearchQuery(suggestion);
                      setTimeout(() => handleSearch(), 100);
                    }}
                    className="text-sm text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1 rounded-lg transition-colors duration-200 font-medium"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Search Results Section */}
          {isSearching && (
            <SearchLoadingAnimation isLoading={isSearching} searchQuery={searchQuery} />
          )}

          {searchResults && !isSearching && (
            <div className="mb-10">
              {searchResults.error ? (
                <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                  <div className="text-red-600 font-semibold mb-2">Search Error</div>
                  <div className="text-red-500">{searchResults.error}</div>
                </div>
              ) : (
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 shadow-xl border border-blue-200">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-black bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent mb-4">
                      🤖 AI Search Results
                    </h3>
                    <p className="text-blue-700 font-medium">
                      Found {searchResults.relevantCompliances?.length || 0} relevant compliance framework{(searchResults.relevantCompliances?.length || 0) !== 1 ? 's' : ''} for "{searchQuery}"
                    </p>
                    <button
                      onClick={clearSearch}
                      className="mt-2 text-sm text-blue-600 hover:text-blue-700 underline"
                    >
                      ← Back to all frameworks
                    </button>
                  </div>

                  {searchResults.summary && (
                    <div className="bg-white/80 rounded-xl p-6 mb-6 border border-blue-200 shadow-sm">
                      <h4 className="font-bold text-blue-800 mb-3 flex items-center">
                        <span className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white text-sm mr-3">💡</span>
                        Summary
                      </h4>
                      <p className="text-gray-700 font-medium leading-relaxed">{searchResults.summary}</p>
                    </div>
                  )}

                  {searchResults.relevantCompliances && searchResults.relevantCompliances.length > 0 ? (
                    <div className="space-y-4">
                      {searchResults.relevantCompliances.map((result, index) => (
                        <div key={index} className="bg-white/80 rounded-xl p-6 border border-blue-200 shadow-sm">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <h4 className="font-bold text-blue-800 text-lg mb-2">{result.name}</h4>
                              <div className="flex items-center gap-3 mb-3">
                                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-sm font-semibold">
                                  {result.region}
                                </span>
                                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-lg text-sm font-semibold">
                                  {Math.round(result.relevanceScore * 100)}% match
                                </span>
                              </div>
                            </div>
                          </div>
                          <p className="text-gray-700 font-medium mb-4 leading-relaxed">{result.explanation}</p>
                          {result.keyRelevantPoints && result.keyRelevantPoints.length > 0 && (
                            <div>
                              <h5 className="font-semibold text-gray-800 mb-2">Key relevant points:</h5>
                              <ul className="space-y-1">
                                {result.keyRelevantPoints.map((point, pointIndex) => (
                                  <li key={pointIndex} className="text-gray-600 text-sm flex items-start">
                                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 mr-3 flex-shrink-0"></span>
                                    <span>{point}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          <button
                            onClick={() => {
                              setShowAllCompliances(true);
                              setSearchResults(null);
                              const complianceKey = Object.keys(compliances).find(
                                key => compliances[key].title === result.name
                              );
                              if (complianceKey) {
                                setSelectedCompliance(complianceKey);
                                // Scroll to the compliance section
                                setTimeout(() => {
                                  const element = document.getElementById(`compliance-${complianceKey}`);
                                  if (element) {
                                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                  }
                                }, 100);
                              }
                            }}
                            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
                          >
                            View Full Details →
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="text-gray-500 mb-4">
                        <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.469-.937-6.042-2.458L5.036 11.543c-.137-.139-.373-.139-.51 0L3.458 12.611c-.137.139-.137.373 0 .51L4.526 14.19C6.531 16.063 9.166 17 12 17s5.469-.937 7.474-2.81l1.068-1.069c.137-.137.137-.371 0-.508l-1.068-1.069c-.137-.137-.373-.137-.51 0L18.042 12.542A7.962 7.962 0 0112 15z" />
                        </svg>
                      </div>
                      <p className="text-gray-600 font-medium">No specific matches found for your search query.</p>
                      <p className="text-gray-500 text-sm mt-2">Try different keywords or browse all compliance frameworks below.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Enhanced Compliance Cards Grid */}
          {showAllCompliances && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
              {Object.entries(compliances).map(([key, compliance]) => (
                <div key={key} className="group" id={`compliance-${key}`}>
                  <div 
                    onClick={() => handleComplianceClick(key)}
                    className="cursor-pointer bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl hover:shadow-2xl border border-white/20 transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex-1">
                        <h3 className="text-2xl font-black bg-gradient-to-r from-slate-800 to-emerald-700 bg-clip-text text-transparent mb-4">{compliance.title}</h3>
                        <div className="flex items-center gap-4 mb-4">
                          <span className="bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 px-4 py-2 rounded-xl text-sm font-bold border border-emerald-200 shadow-sm">
                            📍 {compliance.region}
                          </span>
                          <span className="bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 px-4 py-2 rounded-xl text-sm font-bold border border-blue-200 shadow-sm">
                            📅 Since {compliance.year}
                          </span>
                        </div>
                      </div>
                      <div className="ml-6">
                        <div className="w-12 h-12 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl flex items-center justify-center text-white shadow-lg group-hover:shadow-xl transition-all duration-300">
                          <span className="text-xl font-bold group-hover:scale-110 transition-transform duration-300">
                            {selectedCompliance === key ? '−' : '+'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 font-medium mb-6 leading-relaxed">{compliance.description}</p>
                    
                    <div className="flex items-center text-emerald-700 font-bold">
                      {selectedCompliance === key ? 'Hide details' : 'Show details'} →
                    </div>
                  </div>
                  
                  {/* Enhanced Expanded Details */}
                  {selectedCompliance === key && (
                    <div className="mt-8 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-8 border border-emerald-100 shadow-inner">
                      <div className="space-y-8">
                        {/* Who Needs It */}
                        <div>
                          <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
                            <span className="w-10 h-10 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl flex items-center justify-center text-white text-lg mr-4 shadow-lg">👥</span>
                            Who needs to follow this?
                          </h4>
                          <p className="text-gray-700 font-medium bg-white/80 p-6 rounded-xl border border-emerald-200 shadow-sm">{compliance.whoNeedsIt}</p>
                        </div>
                        
                        {/* Simple Example */}
                        <div>
                          <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
                            <span className="w-10 h-10 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center text-white text-lg mr-4 shadow-lg">💡</span>
                            Simple example
                          </h4>
                          <p className="text-gray-700 font-medium bg-white/80 p-6 rounded-xl border border-blue-200 shadow-sm">{compliance.simpleExample}</p>
                        </div>
                        
                        {/* Key Points */}
                        <div>
                          <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
                            <span className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center text-white text-lg mr-4 shadow-lg">✓</span>
                            Key requirements
                          </h4>
                          <div className="bg-white/80 rounded-xl border border-purple-200 p-6 shadow-sm">
                            <ul className="space-y-4">
                              {compliance.keyPoints.map((point, index) => (
                                <li key={index} className="flex items-start p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-100">
                                  <span className="w-3 h-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full mt-1.5 mr-4 flex-shrink-0 shadow-sm"></span>
                                  <span className="text-gray-700 font-medium">{point}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Enhanced CTA Section */}
          <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-10 text-white text-center shadow-xl">
            <h3 className="text-3xl font-black mb-6">Ready to analyze your policies?</h3>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto text-lg font-medium leading-relaxed">
              Now that you understand the compliance requirements, let our AI analyze your existing policies 
              to identify any gaps and help you stay compliant.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <button
                onClick={() => onNavigate('analyzer')}
                className="bg-white text-slate-800 px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <span className="flex items-center justify-center space-x-2">
                  <span>🔍</span>
                  <span>Start policy analysis</span>
                </span>
              </button>
              <button
                onClick={() => onNavigate('generator')}
                className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-bold hover:bg-white hover:text-slate-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <span className="flex items-center justify-center space-x-2">
                  <span>📝</span>
                  <span>Generate new policy</span>
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default KnowCompliances;
