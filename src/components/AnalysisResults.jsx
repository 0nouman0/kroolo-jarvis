import { useState } from 'react';
import DetailedPlan from './DetailedPlan';

function AnalysisResults({ analysis, onNavigate, isHistoryView = false, documentName, analysisDate, isBatchView = false, batchInfo }) {
  const [showDetailedPlan, setShowDetailedPlan] = useState(false);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);

  const handleGeneratePlan = () => {
    setIsGeneratingPlan(true);
    // Simulate plan generation time
    setTimeout(() => {
      setIsGeneratingPlan(false);
      setShowDetailedPlan(true);
    }, 2000); // 2 second loading animation
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header with Back Button for History View */}
      {isHistoryView && (
        <div className="bg-white border-b border-gray-200 p-6 shadow-osmo">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <button
              onClick={() => onNavigate('history')}
              className="bg-osmo-dark text-white px-6 py-3 rounded-osmo font-bold hover:bg-gray-700 transition-all shadow-osmo"
            >
              ← Back to History
            </button>
            <div className="text-center">
              <h1 className="text-3xl font-black text-osmo-dark">{documentName}</h1>
              <p className="text-gray-600">Analyzed on {formatDate(analysisDate)}</p>
            </div>
            <div></div>
          </div>
        </div>
      )}

      {/* Batch Navigation Header */}
      {isBatchView && batchInfo && (
        <div className="bg-white border-b border-gray-200 p-4 mb-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <button
              onClick={() => batchInfo.onPrevious()}
              disabled={batchInfo.current === 1}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                batchInfo.current === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200 hover:shadow-md transform hover:-translate-y-0.5'
              }`}
            >
              <span>←</span>
              <span>Previous Document</span>
            </button>
            
            <div className="text-center">
              <p className="text-lg font-bold text-slate-800">
                Document {batchInfo.current} of {batchInfo.total}
              </p>
              <p className="text-sm text-gray-600">
                Batch Analysis Results
              </p>
            </div>
            
            <button
              onClick={() => batchInfo.onNext()}
              disabled={batchInfo.current === batchInfo.total}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                batchInfo.current === batchInfo.total
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200 hover:shadow-md transform hover:-translate-y-0.5'
              }`}
            >
              <span>Next Document</span>
              <span>→</span>
            </button>
          </div>
        </div>
      )}

      <div className={`${isHistoryView ? 'container mx-auto px-6 py-12' : ''}`}>
        <div className={`w-full bg-white rounded-osmo shadow-osmo p-8 space-y-6 ${!isHistoryView ? '' : 'max-w-6xl mx-auto'}`}>
      
      {/* Frameworks Overview Section */}
      {analysis.benchmarkingResults?.frameworks && (
        <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 rounded-xl p-6 border border-indigo-200">
          <div className="flex items-center mb-4">
            <span className="text-2xl mr-3">🎯</span>
            <h2 className="text-2xl font-semibold text-gray-900">Regulatory Frameworks Analyzed</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(analysis.benchmarkingResults.frameworks).map(([frameworkKey, frameworkData]) => {
              const frameworkInfo = {
                'GDPR': { icon: '🇪🇺', color: 'blue', fullName: 'General Data Protection Regulation' },
                'HIPAA': { icon: '🏥', color: 'green', fullName: 'Health Insurance Portability Act' },
                'SOX': { icon: '💼', color: 'purple', fullName: 'Sarbanes-Oxley Act' },
                'CCPA': { icon: '🏛️', color: 'orange', fullName: 'California Consumer Privacy Act' },
                'PCI_DSS': { icon: '💳', color: 'red', fullName: 'Payment Card Industry Standard' },
                'ISO_27001': { icon: '🔒', color: 'indigo', fullName: 'Information Security Management' },
                'FERPA': { icon: '🎓', color: 'teal', fullName: 'Family Educational Rights Act' },
                'GLBA': { icon: '🏦', color: 'cyan', fullName: 'Gramm-Leach-Bliley Act' },
                'COPPA': { icon: '👶', color: 'pink', fullName: 'Children\'s Online Privacy Act' },
                'NIST_CSF': { icon: '🛡️', color: 'gray', fullName: 'NIST Cybersecurity Framework' },
                'CAN_SPAM': { icon: '📧', color: 'yellow', fullName: 'CAN-SPAM Act' },
                'FISMA': { icon: '🏛️', color: 'emerald', fullName: 'Federal Information Security Act' }
              };
              
              const framework = frameworkInfo[frameworkKey] || { 
                icon: '📋', 
                color: 'gray', 
                fullName: frameworkData.frameworkFullName || frameworkKey 
              };
              
              const score = frameworkData.overallScore || 0;
              const maturity = frameworkData.maturityLevel || 'Basic';
              
              return (
                <div 
                  key={frameworkKey} 
                  className={`bg-white rounded-lg p-4 border-2 border-${framework.color}-200 shadow-sm hover:shadow-md transition-all duration-300`}
                >
                  <div className="flex items-center mb-3">
                    <span className="text-2xl mr-2">{framework.icon}</span>
                    <div className="flex-1">
                      <div className="font-bold text-gray-800">{frameworkKey}</div>
                      <div className="text-xs text-gray-600">{framework.fullName}</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-600">Score</span>
                      <span className={`font-bold ${
                        score >= 80 ? 'text-green-600' : 
                        score >= 60 ? 'text-yellow-600' : 
                        'text-red-600'
                      }`}>
                        {score}%
                      </span>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full bg-gradient-to-r ${
                          score >= 80 ? 'from-green-400 to-green-600' : 
                          score >= 60 ? 'from-yellow-400 to-yellow-600' : 
                          'from-red-400 to-red-600'
                        }`}
                        style={{ width: `${Math.min(score, 100)}%` }}
                      ></div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-600">Maturity</span>
                      <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                        maturity === 'Advanced' ? 'bg-green-100 text-green-800' :
                        maturity === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {maturity}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      
      {/* Header */}
      <div className="w-full bg-gradient-to-r from-osmo-blue to-osmo-purple rounded-osmo p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-osmo-green rounded-lg flex items-center justify-center mr-4">
              <span className="text-2xl">📊</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Analysis Results</h1>
              <p className="text-white opacity-90">Comprehensive compliance gap assessment</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-4xl font-bold text-white">
                {analysis.totalGaps || analysis.gaps?.length || 0} 
              </div>
              <div className="text-white opacity-80 text-sm">Gaps Identified</div>
            </div>
            {analysis.overallScore && (
              <div className="bg-white bg-opacity-20 text-white px-4 py-2 rounded-lg font-semibold">
                Overall Score: {analysis.overallScore}%
              </div>
            )}
            {analysis.industryBenchmark && (
              <div className="bg-osmo-green text-white px-4 py-2 rounded-lg font-semibold">
                {analysis.industryBenchmark.comparison}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* High Priority Items */}
      {analysis.gaps && analysis.gaps.some(gap => gap.severity === 'high') && (
        <div className="bg-red-50 border border-red-200 rounded-osmo p-6">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center mr-3">
              <span className="text-white font-bold text-sm">!</span>
            </div>
            <h2 className="text-xl font-semibold text-red-800">High Priority Items</h2>
          </div>
          <div className="space-y-3">
            {analysis.gaps.filter(gap => gap.severity === 'high').map((gap, index) => (
              <div key={index} className="bg-white rounded-lg p-4 border border-red-200">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-900">{gap.title || gap.issue}</h3>
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-semibold">
                    High Risk
                  </span>
                </div>
                <p className="text-gray-600 mb-3">{gap.description || gap.issue}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-sm text-gray-500">
                      Impact: <span className="font-semibold text-red-600">{gap.impact || gap.businessImpact}</span>
                    </div>
                    <div className="text-sm text-gray-500">
                      Timeline: <span className="font-semibold">{gap.timeline || gap.timeframe}</span>
                    </div>
                  </div>
                  <button className="text-osmo-blue hover:text-osmo-purple text-sm font-semibold">
                    View Details →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Gaps Grid */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900">All Identified Gaps</h2>
        <div className="grid gap-4">
          {analysis.gaps && analysis.gaps.map((gap, index) => {
            const severityColors = {
              high: 'border-red-200 bg-red-50',
              medium: 'border-yellow-200 bg-yellow-50', 
              low: 'border-blue-200 bg-blue-50'
            };
            
            const severityBadges = {
              high: 'bg-red-100 text-red-800',
              medium: 'bg-yellow-100 text-yellow-800',
              low: 'bg-blue-100 text-blue-800'
            };

            return (
              <div key={index} className={`bg-white rounded-osmo border p-6 ${severityColors[gap.severity] || 'border-gray-200'}`}>
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{gap.title || gap.issue}</h3>
                    <p className="text-gray-600">{gap.description || gap.issue}</p>
                  </div>
                  <div className="ml-4 flex flex-col items-end space-y-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${severityBadges[gap.severity] || 'bg-gray-100 text-gray-800'}`}>
                      {gap.severity ? gap.severity.charAt(0).toUpperCase() + gap.severity.slice(1) : 'Medium'} Priority
                    </span>
                    {gap.score && (
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">{gap.score}%</div>
                        <div className="text-xs text-gray-500">Compliance Score</div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4 mt-4">
                  <div className="space-y-2">
                    <div className="text-sm font-semibold text-gray-700">💥 Impact</div>
                    <div className="text-sm text-gray-600">{gap.impact || gap.businessImpact || 'Not specified'}</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-semibold text-gray-700">⏰ Timeline</div>
                    <div className="text-sm text-gray-600">{gap.timeline || gap.timeframe || 'Not specified'}</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-semibold text-gray-700">🎯 Framework</div>
                    <div className="flex items-center">
                      {(() => {
                        const frameworkName = gap.framework || gap.category || 'General';
                        const frameworkInfo = {
                          'GDPR': { icon: '🇪🇺', color: 'blue', name: 'GDPR' },
                          'HIPAA': { icon: '🏥', color: 'green', name: 'HIPAA' },
                          'SOX': { icon: '💼', color: 'purple', name: 'SOX' },
                          'CCPA': { icon: '🏛️', color: 'orange', name: 'CCPA' },
                          'PCI_DSS': { icon: '💳', color: 'red', name: 'PCI DSS' },
                          'PCI DSS': { icon: '💳', color: 'red', name: 'PCI DSS' },
                          'ISO_27001': { icon: '🔒', color: 'indigo', name: 'ISO 27001' },
                          'ISO 27001': { icon: '🔒', color: 'indigo', name: 'ISO 27001' },
                          'FERPA': { icon: '🎓', color: 'teal', name: 'FERPA' },
                          'GLBA': { icon: '🏦', color: 'cyan', name: 'GLBA' },
                          'COPPA': { icon: '👶', color: 'pink', name: 'COPPA' },
                          'NIST_CSF': { icon: '🛡️', color: 'gray', name: 'NIST CSF' },
                          'NIST CSF': { icon: '🛡️', color: 'gray', name: 'NIST CSF' },
                          'CAN_SPAM': { icon: '📧', color: 'yellow', name: 'CAN-SPAM' },
                          'FISMA': { icon: '🏛️', color: 'emerald', name: 'FISMA' }
                        };
                        
                        const framework = frameworkInfo[frameworkName] || frameworkInfo[frameworkName.toUpperCase()] || { 
                          icon: '📋', 
                          color: 'gray', 
                          name: frameworkName 
                        };
                        
                        return (
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-${framework.color}-100 text-${framework.color}-800 border border-${framework.color}-200`}>
                            <span className="mr-1">{framework.icon}</span>
                            {framework.name}
                          </span>
                        );
                      })()}
                    </div>
                  </div>
                </div>

                {(gap.recommendation || gap.remediation) && (
                  <div className="mt-4 p-4 bg-osmo-blue bg-opacity-10 rounded-lg">
                    <div className="text-sm font-semibold text-osmo-blue mb-1">Recommendation</div>
                    <div className="text-sm text-gray-700">{gap.recommendation || gap.remediation}</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Industry Benchmark */}
      {analysis.industryBenchmark && (
        <div className="bg-white rounded-osmo shadow-osmo border p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">📊 Industry Benchmark</h2>
          
          {/* Enhanced Summary Card with Status */}
          <div className={`p-5 rounded-lg border-l-4 mb-6 ${
            analysis.industryBenchmark.status === 'excellent' ? 'border-emerald-500 bg-emerald-50' :
            analysis.industryBenchmark.status === 'good' ? 'border-green-500 bg-green-50' :
            analysis.industryBenchmark.status === 'average' ? 'border-blue-500 bg-blue-50' :
            analysis.industryBenchmark.status === 'below-average' ? 'border-yellow-500 bg-yellow-50' :
            analysis.industryBenchmark.status === 'poor' ? 'border-orange-500 bg-orange-50' :
            analysis.industryBenchmark.status === 'critical' ? 'border-red-500 bg-red-50' :
            'border-gray-500 bg-gray-50'
          }`}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`font-semibold text-lg ${
                    analysis.industryBenchmark.status === 'excellent' ? 'text-emerald-700' :
                    analysis.industryBenchmark.status === 'good' ? 'text-green-700' :
                    analysis.industryBenchmark.status === 'average' ? 'text-blue-700' :
                    analysis.industryBenchmark.status === 'below-average' ? 'text-yellow-700' :
                    analysis.industryBenchmark.status === 'poor' ? 'text-orange-700' :
                    analysis.industryBenchmark.status === 'critical' ? 'text-red-700' :
                    'text-gray-700'
                  }`}>
                    {analysis.industryBenchmark.status === 'excellent' ? '🌟 Industry Leader' :
                     analysis.industryBenchmark.status === 'good' ? '🎯 Above Industry Standard' :
                     analysis.industryBenchmark.status === 'average' ? '📊 Industry Average' :
                     analysis.industryBenchmark.status === 'below-average' ? '📈 Room for Improvement' :
                     analysis.industryBenchmark.status === 'poor' ? '⚠️ Below Industry Standard' :
                     analysis.industryBenchmark.status === 'critical' ? '🚨 Critical Attention Needed' :
                     '📊 Industry Analysis'}
                  </div>
                  {analysis.industryBenchmark.percentile && (
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      analysis.industryBenchmark.percentile >= 90 ? 'bg-emerald-100 text-emerald-700' :
                      analysis.industryBenchmark.percentile >= 75 ? 'bg-green-100 text-green-700' :
                      analysis.industryBenchmark.percentile >= 50 ? 'bg-blue-100 text-blue-700' :
                      analysis.industryBenchmark.percentile >= 25 ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {analysis.industryBenchmark.percentile}th percentile
                    </div>
                  )}
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  {analysis.industryBenchmark.message || (() => {
                    const userScore = analysis.industryBenchmark.userScore || analysis.overallScore || 0;
                    const industryAvg = analysis.industryBenchmark.industryAverage || 75;
                    const difference = Math.abs(userScore - industryAvg);
                    
                    return userScore >= industryAvg
                      ? `You're ${difference.toFixed(1)} points ahead of the ${analysis.industryBenchmark.industry || 'industry'} average`
                      : `You're ${difference.toFixed(1)} points behind the ${analysis.industryBenchmark.industry || 'industry'} average`;
                  })()}
                </div>
                {analysis.industryBenchmark.industryDescription && (
                  <div className="text-xs text-gray-500 italic">
                    {analysis.industryBenchmark.industryDescription}
                  </div>
                )}
              </div>
              <div className="text-right ml-4">
                <div className="text-2xl font-bold text-gray-800">
                  {analysis.industryBenchmark.difference !== undefined ? 
                    (analysis.industryBenchmark.difference >= 0 ? '+' : '') + analysis.industryBenchmark.difference.toFixed(1) :
                    ((analysis.industryBenchmark.userScore || analysis.overallScore || 0) >= (analysis.industryBenchmark.industryAverage || 75) ? '+' : '-') +
                    Math.abs((analysis.industryBenchmark.userScore || analysis.overallScore || 0) - (analysis.industryBenchmark.industryAverage || 75)).toFixed(1)
                  }
                </div>
                <div className="text-xs text-gray-500">percentage points</div>
              </div>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                <span className="font-semibold text-gray-700">Your Score</span>
                <span className="text-3xl font-bold text-blue-600">
                  {analysis.industryBenchmark.userScore || analysis.industryBenchmark.yourScore || analysis.overallScore || 0}%
                </span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg border border-gray-200">
                <span className="font-semibold text-gray-700">Industry Average</span>
                <span className="text-3xl font-bold text-gray-600">
                  {analysis.industryBenchmark.industryAverage || 75}%
                </span>
              </div>

              {/* Enhanced Industry Context */}
              {analysis.industryBenchmark.industry && (
                <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-600">Industry Sector</span>
                    <span className="font-semibold text-purple-700">{analysis.industryBenchmark.industry}</span>
                  </div>
                  {analysis.industryBenchmark.industryDescription && (
                    <div className="text-xs text-gray-600 italic">
                      {analysis.industryBenchmark.industryDescription}
                    </div>
                  )}
                </div>
              )}

              {/* Enhanced Performance Ranges */}
              {analysis.industryBenchmark.bottom25 && (
                <div className="p-4 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg border border-amber-100">
                  <div className="font-medium text-gray-700 mb-2">📊 Industry Performance Range</div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Bottom 25%:</span>
                      <span className="font-medium text-red-600">Below {analysis.industryBenchmark.bottom25}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Industry Average:</span>
                      <span className="font-medium text-gray-700">{analysis.industryBenchmark.industryAverage}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Top Performers:</span>
                      <span className="font-medium text-green-600">Above {Math.round((analysis.industryBenchmark.industryAverage || 75) * 1.1)}%</span>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Visual Progress Comparison */}
              <div className="p-4 bg-white rounded-lg border border-gray-200">
                <div className="font-semibold text-gray-700 mb-3">📊 Performance Comparison</div>
                <div className="space-y-3">
                  {/* Your Score Bar */}
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-blue-600 font-medium">Your Score</span>
                      <span className="text-blue-600 font-bold">
                        {analysis.industryBenchmark.userScore || analysis.overallScore || 0}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className={`h-3 rounded-full transition-all duration-500 ${
                          analysis.industryBenchmark.status === 'excellent' ? 'bg-gradient-to-r from-emerald-500 to-emerald-600' :
                          analysis.industryBenchmark.status === 'good' ? 'bg-gradient-to-r from-green-500 to-green-600' :
                          analysis.industryBenchmark.status === 'average' ? 'bg-gradient-to-r from-blue-500 to-blue-600' :
                          analysis.industryBenchmark.status === 'below-average' ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' :
                          analysis.industryBenchmark.status === 'poor' ? 'bg-gradient-to-r from-orange-500 to-orange-600' :
                          'bg-gradient-to-r from-red-500 to-red-600'
                        }`}
                        style={{ width: `${Math.min(analysis.industryBenchmark.userScore || analysis.overallScore || 0, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  {/* Industry Average Bar */}
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600 font-medium">Industry Average</span>
                      <span className="text-gray-600 font-bold">
                        {analysis.industryBenchmark.industryAverage || 75}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-gray-400 to-gray-500 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(analysis.industryBenchmark.industryAverage || 75, 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Industry Bottom 25% Reference Line */}
                  {analysis.industryBenchmark.bottom25 && (
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-red-500 font-medium">Bottom 25% Threshold</span>
                        <span className="text-red-500 font-bold">
                          {analysis.industryBenchmark.bottom25}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-red-300 to-red-400 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(analysis.industryBenchmark.bottom25, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="space-y-4">
              {/* Enhanced Performance Status */}
              <div className={`p-4 rounded-lg border ${
                analysis.industryBenchmark.status === 'excellent' ? 'bg-emerald-50 border-emerald-200' :
                analysis.industryBenchmark.status === 'good' ? 'bg-green-50 border-green-200' :
                analysis.industryBenchmark.status === 'average' ? 'bg-blue-50 border-blue-200' :
                analysis.industryBenchmark.status === 'below-average' ? 'bg-yellow-50 border-yellow-200' :
                analysis.industryBenchmark.status === 'poor' ? 'bg-orange-50 border-orange-200' :
                analysis.industryBenchmark.status === 'critical' ? 'bg-red-50 border-red-200' :
                'bg-gray-50 border-gray-200'
              }`}>
                <div className={`font-semibold mb-2 ${
                  analysis.industryBenchmark.status === 'excellent' ? 'text-emerald-700' :
                  analysis.industryBenchmark.status === 'good' ? 'text-green-700' :
                  analysis.industryBenchmark.status === 'average' ? 'text-blue-700' :
                  analysis.industryBenchmark.status === 'below-average' ? 'text-yellow-700' :
                  analysis.industryBenchmark.status === 'poor' ? 'text-orange-700' :
                  analysis.industryBenchmark.status === 'critical' ? 'text-red-700' :
                  'text-gray-700'
                }`}>
                  Performance Status
                </div>
                <div className="text-gray-700 text-sm leading-relaxed">
                  {analysis.industryBenchmark.comparison || analysis.industryBenchmark.message || (() => {
                    const status = analysis.industryBenchmark.status;
                    switch(status) {
                      case 'excellent':
                        return 'Outstanding performance - You are among the industry leaders in compliance. Your practices set a benchmark for others.';
                      case 'good':
                        return 'Strong compliance posture - You exceed industry standards and demonstrate best practices in most areas.';
                      case 'average':
                        return 'Meeting industry expectations - Your compliance is on par with most organizations in your sector.';
                      case 'below-average':
                        return 'Room for improvement - Your compliance falls short of industry standards in several key areas.';
                      case 'poor':
                        return 'Significant improvements needed - Your compliance significantly lags behind industry peers and requires immediate attention.';
                      case 'critical':
                        return 'Critical action required - Your compliance position poses substantial risks and demands urgent remediation.';
                      default:
                        return 'Performance analysis complete - Review detailed recommendations for improvement opportunities.';
                    }
                  })()}
                </div>
              </div>
              
              {/* Enhanced Key Insights */}
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="font-semibold text-blue-700 mb-2">📈 Key Insights</div>
                <div className="text-gray-700 text-sm leading-relaxed">
                  {analysis.industryBenchmark.insights || (() => {
                    const userScore = analysis.industryBenchmark.userScore || analysis.overallScore || 0;
                    const industryAvg = analysis.industryBenchmark.industryAverage || 75;
                    const percentile = analysis.industryBenchmark.percentile;
                    
                    let insight = `Your compliance score of ${userScore}% `;
                    
                    if (userScore >= industryAvg) {
                      insight += `exceeds the ${analysis.industryBenchmark.industry || 'industry'} average of ${industryAvg}%.`;
                      if (percentile >= 90) {
                        insight += ' You are performing in the top 10% of organizations. Continue these exemplary practices and consider sharing your expertise.';
                      } else if (percentile >= 75) {
                        insight += ' You are in the top quartile of performers. Look for opportunities to achieve industry leadership status.';
                      } else {
                        insight += ' Continue maintaining these strong practices while identifying areas for further enhancement.';
                      }
                    } else {
                      insight += `is below the ${analysis.industryBenchmark.industry || 'industry'} average of ${industryAvg}%.`;
                      if (percentile <= 25) {
                        insight += ' You are in the bottom quartile. Immediate comprehensive action is recommended to address critical compliance gaps.';
                      } else if (percentile <= 50) {
                        insight += ' Focus on systematic improvements to reach industry standard levels of compliance.';
                      } else {
                        insight += ' Target specific improvement areas to align with industry best practices.';
                      }
                    }
                    
                    return insight;
                  })()}
                </div>
              </div>
              
              {/* Enhanced Gap Analysis */}
              <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                <div className="font-semibold text-indigo-700 mb-2">📊 Gap Analysis</div>
                <div className="text-sm text-gray-700 leading-relaxed">
                  {(() => {
                    const userScore = analysis.industryBenchmark.userScore || analysis.overallScore || 0;
                    const industryAvg = analysis.industryBenchmark.industryAverage || 75;
                    const difference = userScore - industryAvg;
                    const bottom25 = analysis.industryBenchmark.bottom25;
                    
                    let gapAnalysis = '';
                    
                    if (difference > 0) {
                      gapAnalysis = `You are ${difference.toFixed(1)} percentage points above industry average. `;
                      if (difference > 15) {
                        gapAnalysis += 'Exceptional performance! You are setting industry standards.';
                      } else if (difference > 5) {
                        gapAnalysis += 'Excellent work! You are clearly outperforming most peers.';
                      } else {
                        gapAnalysis += 'Good progress! Continue building on this solid foundation.';
                      }
                    } else if (difference === 0) {
                      gapAnalysis = 'You are exactly at the industry average. Consider targeted improvements to excel above your peers.';
                    } else {
                      gapAnalysis = `You are ${Math.abs(difference).toFixed(1)} percentage points below industry average. `;
                      
                      if (bottom25 && userScore < bottom25) {
                        gapAnalysis += 'You are in the bottom 25% of performers. Comprehensive remediation is urgently needed.';
                      } else if (Math.abs(difference) > 20) {
                        gapAnalysis += 'Significant improvements are needed across multiple areas. Prioritize high-impact changes.';
                      } else if (Math.abs(difference) > 10) {
                        gapAnalysis += 'Moderate improvements needed. Focus on addressing key compliance gaps.';
                      } else {
                        gapAnalysis += 'Minor adjustments needed to reach industry standards.';
                      }
                    }
                    
                    return gapAnalysis;
                  })()}
                </div>
              </div>

              {/* Improvement Recommendations */}
              {analysis.industryBenchmark.status && ['below-average', 'poor', 'critical'].includes(analysis.industryBenchmark.status) && (
                <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <div className="font-semibold text-amber-700 mb-2">🎯 Priority Actions</div>
                  <div className="text-sm text-gray-700">
                    <div className="space-y-2">
                      {analysis.industryBenchmark.status === 'critical' && (
                        <div className="text-red-600 font-medium">• Immediate risk assessment and remediation required</div>
                      )}
                      <div>• Review and update compliance policies and procedures</div>
                      <div>• Implement regular compliance monitoring and reporting</div>
                      <div>• Consider engaging compliance experts for gap assessment</div>
                      <div>• Establish clear timelines for improvement initiatives</div>
                      {analysis.industryBenchmark.status !== 'critical' && (
                        <div>• Benchmark against industry leaders for best practices</div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 pt-6">
        <button
          onClick={handleGeneratePlan}
          disabled={isGeneratingPlan}
          className="flex-1 bg-osmo-purple hover:bg-purple-700 disabled:bg-gray-400 text-white font-semibold py-4 px-8 rounded-osmo transition-colors duration-200 flex items-center justify-center"
        >
          {isGeneratingPlan ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
              Generating Detailed Plan...
            </>
          ) : (
            <>
              <span className="mr-2">📋</span>
              Generate Detailed Implementation Plan
            </>
          )}
        </button>
        <button className="flex-1 bg-white border-2 border-osmo-blue text-osmo-blue hover:bg-osmo-blue hover:text-white font-semibold py-4 px-8 rounded-osmo transition-colors duration-200">
          <span className="mr-2">💾</span>
          Export Report
        </button>
      </div>

      {/* Detailed Plan Modal/Section */}
      {showDetailedPlan && (
        <DetailedPlan 
          analysis={analysis} 
          onClose={() => setShowDetailedPlan(false)}
        />
      )}
        </div>
      </div>
    </div>
  );
}

export default AnalysisResults;
