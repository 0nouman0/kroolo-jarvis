import { useState } from 'react';

function AnalysisDetailsModal({ analysis, isOpen, onClose }) {
  if (!isOpen || !analysis) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const formatCompliance = (score) => {
    if (score >= 80) return { text: 'High', color: 'text-green-600' };
    if (score >= 60) return { text: 'Medium', color: 'text-yellow-600' };
    return { text: 'Low', color: 'text-red-600' };
  };

  // Get compliance score from multiple possible sources
  const complianceScore = analysis.compliance_score || 
                         analysis.analysis_results?.overallScore || 
                         analysis.analysis_results?.overallCompliance || 
                         0;
  
  const complianceInfo = formatCompliance(complianceScore);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-xl">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">Analysis Details</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Document Info */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold mb-3 text-gray-800">Document Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="font-medium text-gray-600">Document Name:</span>
                <p className="text-gray-800">{analysis.document_name}</p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Analysis Date:</span>
                <p className="text-gray-800">{formatDate(analysis.created_at)}</p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Document Type:</span>
                <p className="text-gray-800">{analysis.document_type || 'N/A'}</p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Industry:</span>
                <p className="text-gray-800">{analysis.industry || 'General'}</p>
              </div>
            </div>
          </div>

          {/* Compliance Score */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="text-lg font-semibold mb-3 text-gray-800">Compliance Overview</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="font-medium text-gray-600">Compliance Score:</span>
                <p className={`text-xl font-bold ${complianceInfo.color}`}>
                  {complianceScore}% ({complianceInfo.text})
                </p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Gaps Found:</span>
                <p className="text-xl font-bold text-red-600">{analysis.gaps_found || 0}</p>
              </div>
            </div>
          </div>

          {/* Analysis Results */}
          {analysis.analysis_results && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 text-gray-800">Analysis Results</h3>
              
              {/* Summary */}
              {analysis.analysis_results.summary && (
                <div className="mb-4 p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-gray-700 mb-2">Summary</h4>
                  <p className="text-gray-700 whitespace-pre-wrap">{analysis.analysis_results.summary}</p>
                </div>
              )}

              {/* Compliance Details */}
              {analysis.analysis_results.compliance && (
                <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-gray-700 mb-2">Compliance Assessment</h4>
                  <p className="text-gray-700 whitespace-pre-wrap">{analysis.analysis_results.compliance}</p>
                </div>
              )}

              {/* Gaps */}
              {analysis.analysis_results.gaps && analysis.analysis_results.gaps.length > 0 && (
                <div className="mb-4 p-4 bg-red-50 rounded-lg">
                  <h4 className="font-semibold text-gray-700 mb-2">Identified Gaps</h4>
                  <ul className="list-disc list-inside space-y-2">
                    {analysis.analysis_results.gaps.map((gap, index) => (
                      <li key={index} className="text-gray-700">
                        {typeof gap === 'object' ? (
                          <div className="space-y-1">
                            {gap.issue && <div><strong>Issue:</strong> {gap.issue}</div>}
                            {gap.severity && <div><strong>Severity:</strong> {gap.severity}</div>}
                            {gap.framework && <div><strong>Framework:</strong> {gap.framework}</div>}
                            {gap.effort && <div><strong>Effort:</strong> {gap.effort}</div>}
                            {gap.timeframe && <div><strong>Timeframe:</strong> {gap.timeframe}</div>}
                            {gap.remediation && <div><strong>Remediation:</strong> {gap.remediation}</div>}
                            {gap.currentScore && <div><strong>Current Score:</strong> {gap.currentScore}</div>}
                            {gap.targetScore && <div><strong>Target Score:</strong> {gap.targetScore}</div>}
                            {gap.businessImpact && <div><strong>Business Impact:</strong> {gap.businessImpact}</div>}
                          </div>
                        ) : (
                          gap
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Recommendations */}
              {analysis.analysis_results.recommendations && analysis.analysis_results.recommendations.length > 0 && (
                <div className="mb-4 p-4 bg-yellow-50 rounded-lg">
                  <h4 className="font-semibold text-gray-700 mb-2">Recommendations</h4>
                  <ul className="list-disc list-inside space-y-2">
                    {analysis.analysis_results.recommendations.map((rec, index) => (
                      <li key={index} className="text-gray-700">
                        {typeof rec === 'object' ? (
                          <div className="space-y-1">
                            {rec.issue && <div><strong>Issue:</strong> {rec.issue}</div>}
                            {rec.severity && <div><strong>Severity:</strong> {rec.severity}</div>}
                            {rec.framework && <div><strong>Framework:</strong> {rec.framework}</div>}
                            {rec.effort && <div><strong>Effort:</strong> {rec.effort}</div>}
                            {rec.timeframe && <div><strong>Timeframe:</strong> {rec.timeframe}</div>}
                            {rec.remediation && <div><strong>Remediation:</strong> {rec.remediation}</div>}
                            {rec.currentScore && <div><strong>Current Score:</strong> {rec.currentScore}</div>}
                            {rec.targetScore && <div><strong>Target Score:</strong> {rec.targetScore}</div>}
                            {rec.businessImpact && <div><strong>Business Impact:</strong> {rec.businessImpact}</div>}
                            {rec.recommendation && <div><strong>Recommendation:</strong> {rec.recommendation}</div>}
                            {rec.action && <div><strong>Action:</strong> {rec.action}</div>}
                          </div>
                        ) : (
                          rec
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Frameworks */}
              {analysis.frameworks && analysis.frameworks.length > 0 && (
                <div className="mb-4 p-4 bg-purple-50 rounded-lg">
                  <h4 className="font-semibold text-gray-700 mb-2">Applied Frameworks</h4>
                  <div className="flex flex-wrap gap-2">
                    {analysis.frameworks.map((framework, index) => (
                      <span key={index} className="bg-purple-200 text-purple-800 px-3 py-1 rounded-full text-sm">
                        {framework}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Raw Analysis Data (for debugging) */}
              <details className="mb-4">
                <summary className="cursor-pointer font-semibold text-gray-700 mb-2">
                  View Raw Analysis Data
                </summary>
                <div className="p-4 bg-gray-100 rounded-lg mt-2">
                  <pre className="text-xs text-gray-600 whitespace-pre-wrap overflow-x-auto">
                    {JSON.stringify(analysis.analysis_results, null, 2)}
                  </pre>
                </div>
              </details>
            </div>
          )}

          {/* Close button at bottom */}
          <div className="flex justify-end pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="bg-osmo-purple text-white px-6 py-2 rounded-osmo font-semibold hover:bg-purple-700 transition-all shadow-osmo"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnalysisDetailsModal;
