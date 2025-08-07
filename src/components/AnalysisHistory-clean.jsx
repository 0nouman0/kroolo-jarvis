import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../lib/neondb';
import { useAuth } from '../contexts/AuthContext';
import AnalysisDetailsModal from './AnalysisDetailsModal';

function AnalysisHistory({ onViewAnalysis }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterType, setFilterType] = useState('all'); // all, policy_analysis, policy_generation

  useEffect(() => {
    fetchHistory();
  }, [currentPage, filterType]);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const response = await authAPI.getAnalysisHistory(currentPage, 10);
      setHistory(response.history);
      setPagination(response.pagination);
    } catch (err) {
      setError('Failed to load analysis history');
      console.error('History fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAnalysis = async (id, documentName) => {
    if (!confirm(`Are you sure you want to delete the analysis for "${documentName}"?`)) {
      return;
    }

    try {
      await authAPI.deleteAnalysis(id);
      setHistory(history.filter(item => item.id !== id));
    } catch (err) {
      setError('Failed to delete analysis');
      console.error('Delete error:', err);
    }
  };

  const handleViewAnalysis = async (id) => {
    try {
      setLoading(true);
      const response = await authAPI.getAnalysisDetails(id);
      setSelectedAnalysis(response.analysis);
      setIsModalOpen(true);
    } catch (err) {
      setError('Failed to load analysis details');
      console.error('View analysis error:', err);
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAnalysis(null);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getComplianceScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-50';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getAnalysisTypeInfo = (item) => {
    const analysisType = item.analysis_type || 'policy_analysis';
    
    switch (analysisType) {
      case 'policy_generation':
        return {
          label: 'Policy Generation',
          icon: '⚡',
          color: 'bg-green-100 text-green-800',
          description: 'AI-generated policy document'
        };
      case 'policy_analysis':
      default:
        return {
          label: 'Policy Analysis',
          icon: '📋',
          color: 'bg-blue-100 text-blue-800',
          description: 'Document gap analysis'
        };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dashboard">
        <div className="content-max">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading your analysis history...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dashboard">
      <div className="content-max">
        {/* Clean Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">📊 Policy History</h1>
          <p className="text-gray-600">
            View and manage your policy analysis and generation history
          </p>
        </div>

        {/* Clean Filter Controls */}
        <div className="card-clean mb-8">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setFilterType('all')}
              className={filterType === 'all' ? 'btn-clean-primary' : 'btn-clean-secondary'}
            >
              All History ({history.length})
            </button>
            <button
              onClick={() => setFilterType('policy_analysis')}
              className={filterType === 'policy_analysis' ? 'btn-clean-primary' : 'btn-clean-secondary'}
            >
              📋 Policy Analysis ({history.filter(item => !item.analysis_type || item.analysis_type === 'policy_analysis').length})
            </button>
            <button
              onClick={() => setFilterType('policy_generation')}
              className={filterType === 'policy_generation' ? 'btn-clean-primary' : 'btn-clean-secondary'}
            >
              ⚡ Policy Generation ({history.filter(item => item.analysis_type === 'policy_generation').length})
            </button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            <div className="flex items-center space-x-2">
              <span className="text-xl">⚠️</span>
              <span className="font-medium">{error}</span>
            </div>
          </div>
        )}

        {(() => {
          const filteredHistory = history.filter(item => {
            if (filterType === 'all') return true;
            if (filterType === 'policy_analysis') return !item.analysis_type || item.analysis_type === 'policy_analysis';
            if (filterType === 'policy_generation') return item.analysis_type === 'policy_generation';
            return true;
          });

          if (filteredHistory.length === 0) {
            return (
              <div className="text-center py-16">
                <div className="card-clean max-w-lg mx-auto">
                  <div className="text-6xl mb-6">📋</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {filterType === 'all' ? 'No Analysis History' : 
                     filterType === 'policy_analysis' ? 'No Policy Analysis Found' :
                     'No Policy Generation Found'}
                  </h3>
                  <p className="text-gray-600 mb-8">
                    {filterType === 'all' ? "You haven't analyzed any policies or generated any documents yet. Start by analyzing your first document or generating a policy!" :
                     filterType === 'policy_analysis' ? "You haven't done any policy analysis yet." :
                     "You haven't generated any policies yet."}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                      onClick={() => navigate('/analyzer')}
                      className="btn-clean-primary"
                    >
                      📋 Start Analysis
                    </button>
                    <button
                      onClick={() => navigate('/generator')}
                      className="btn-clean-secondary"
                    >
                      ⚡ Generate Policy
                    </button>
                  </div>
                </div>
              </div>
            );
          }

          return (
            <>
              {/* Clean History Grid */}
              <div className="grid gap-6 mb-8">
                {filteredHistory.map((item) => (
                <div key={item.id} className="card-clean hover:shadow-lg transition-shadow duration-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-4">
                        <h3 className="text-xl font-bold text-gray-900">
                          {item.document_name}
                        </h3>
                        {(() => {
                          const typeInfo = getAnalysisTypeInfo(item);
                          return (
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${typeInfo.color} flex items-center gap-2`}>
                              <span>{typeInfo.icon}</span>
                              {typeInfo.label}
                            </span>
                          );
                        })()}
                        {item.compliance_score !== null && (
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getComplianceScoreColor(item.compliance_score)}`}>
                            {item.compliance_score}% Compliance
                          </span>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <span className="text-sm text-gray-500">Type</span>
                          <p className="font-medium text-gray-900">
                            {getAnalysisTypeInfo(item).label}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">Industry</span>
                          <p className="font-medium text-gray-900">{item.industry || 'Not specified'}</p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">
                            {item.analysis_type === 'policy_generation' ? 'Policy Type' : 'Gaps Found'}
                          </span>
                          <p className={`font-medium ${item.analysis_type === 'policy_generation' ? 'text-green-600' : 'text-red-600'}`}>
                            {item.analysis_type === 'policy_generation' ? 
                              (item.organization_details?.policy_type || item.document_type || 'Custom Policy') : 
                              `${item.gaps_found || 0} gaps`}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">
                            {item.analysis_type === 'policy_generation' ? 'Generated' : 'Analyzed'}
                          </span>
                          <p className="font-medium text-gray-900">{formatDate(item.created_at)}</p>
                        </div>
                      </div>

                      {/* Frameworks/Jurisdictions Section */}
                      {item.frameworks && item.frameworks.length > 0 && (
                        <div className="mb-4">
                          <span className="text-sm text-gray-500 block mb-2">
                            {item.analysis_type === 'policy_generation' ? 'Frameworks' : 'Frameworks'}
                          </span>
                          <div className="flex flex-wrap gap-2">
                            {item.frameworks.map((framework, index) => (
                              <span
                                key={index}
                                className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium border border-purple-200"
                              >
                                {framework}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Compliances Section for Policy Generation */}
                      {item.analysis_type === 'policy_generation' && item.organization_details?.compliances && item.organization_details.compliances.length > 0 && (
                        <div className="mb-4">
                          <span className="text-sm text-gray-500 block mb-2">
                            Compliance Standards
                          </span>
                          <div className="flex flex-wrap gap-2">
                            {item.organization_details.compliances.map((compliance, index) => (
                              <span
                                key={index}
                                className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium border border-green-200"
                              >
                                {compliance}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-3 ml-4">
                      <button
                        onClick={() => handleViewAnalysis(item.id)}
                        className="btn-clean-primary text-sm flex items-center space-x-2"
                      >
                        <span>📄</span>
                        <span>{item.analysis_type === 'policy_generation' ? 'View Content' : 'View Details'}</span>
                      </button>
                      <button
                        onClick={() => handleDeleteAnalysis(item.id, item.document_name)}
                        className="btn-clean-secondary text-sm flex items-center space-x-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                      >
                        <span>🗑️</span>
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Clean Pagination */}
            {pagination.pages > 1 && (
              <div className="card-clean">
                <div className="flex justify-center items-center gap-3">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="btn-clean-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    ← Previous
                  </button>
                  
                  <div className="flex gap-2">
                    {[...Array(pagination.pages)].map((_, index) => (
                      <button
                        key={index + 1}
                        onClick={() => setCurrentPage(index + 1)}
                        className={`px-3 py-2 rounded-lg font-medium transition-colors ${
                          currentPage === index + 1
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {index + 1}
                      </button>
                    ))}
                  </div>
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.pages))}
                    disabled={currentPage === pagination.pages}
                    className="btn-clean-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}
            </>
          );
        })()}
      </div>

      {/* Analysis Details Modal */}
      <AnalysisDetailsModal
        analysis={selectedAnalysis}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </div>
  );
}

export default AnalysisHistory;
