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
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-6 py-12">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-osmo-purple mx-auto mb-4"></div>
              <p className="text-gray-600">Loading your analysis history...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <div className="container mx-auto px-6 py-12 max-w-7xl">
        {/* Enhanced Header */}
        <div className="mb-10">
          <h1 className="text-5xl font-black bg-gradient-to-r from-slate-800 via-blue-700 to-purple-700 bg-clip-text text-transparent mb-6 text-center">
            📊 Policy History
          </h1>
          <p className="text-xl text-gray-600 text-center font-medium">
            View and manage your policy analysis and generation history
          </p>
        </div>

        {/* Enhanced Filter Controls */}
        <div className="mb-8">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={() => setFilterType('all')}
                className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ${
                  filterType === 'all'
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All History ({history.length})
              </button>
              <button
                onClick={() => setFilterType('policy_analysis')}
                className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2 ${
                  filterType === 'policy_analysis'
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span>📋</span>
                Policy Analysis ({history.filter(item => !item.analysis_type || item.analysis_type === 'policy_analysis').length})
              </button>
              <button
                onClick={() => setFilterType('policy_generation')}
                className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2 ${
                  filterType === 'policy_generation'
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span>⚡</span>
                Policy Generation ({history.filter(item => item.analysis_type === 'policy_generation').length})
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Error Display */}
        {error && (
          <div className="mb-8 p-6 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-2xl text-red-700 shadow-lg">
            <div className="flex items-center space-x-2">
              <span className="text-xl">⚠️</span>
              <span className="font-bold">{error}</span>
            </div>
          </div>
        )}        {(() => {
          const filteredHistory = history.filter(item => {
            if (filterType === 'all') return true;
            if (filterType === 'policy_analysis') return !item.analysis_type || item.analysis_type === 'policy_analysis';
            if (filterType === 'policy_generation') return item.analysis_type === 'policy_generation';
            return true;
          });

          if (filteredHistory.length === 0) {
            return (
              <div className="text-center py-16">
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-12 shadow-xl border border-white/20 max-w-lg mx-auto">
                  <div className="text-8xl mb-6">📋</div>
                  <h3 className="text-3xl font-black bg-gradient-to-r from-slate-800 to-purple-700 bg-clip-text text-transparent mb-4">
                    {filterType === 'all' ? 'No Analysis History' : 
                     filterType === 'policy_analysis' ? 'No Policy Analysis Found' :
                     'No Policy Generation Found'}
                  </h3>
                  <p className="text-gray-600 mb-8 text-lg font-medium leading-relaxed">
                    {filterType === 'all' ? "You haven't analyzed any policies or generated any documents yet. Start by analyzing your first document or generating a policy!" :
                     filterType === 'policy_analysis' ? "You haven't done any policy analysis yet." :
                     "You haven't generated any policies yet."}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                      onClick={() => navigate('/analyzer')}
                      className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      <span className="flex items-center space-x-2">
                        <span>📋</span>
                        <span>Start Analysis</span>
                      </span>
                    </button>
                    <button
                      onClick={() => navigate('/generator')}
                      className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-xl font-bold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      <span className="flex items-center space-x-2">
                        <span>⚡</span>
                        <span>Generate Policy</span>
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            );
          }

          return (
            <>
              {/* Enhanced History Grid */}
              <div className="grid gap-8 mb-10">
                {filteredHistory.map((item) => (
                <div key={item.id} className="bg-white/90 backdrop-blur-sm rounded-2xl border border-white/20 p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-4">
                        <h3 className="text-2xl font-black bg-gradient-to-r from-slate-800 to-blue-700 bg-clip-text text-transparent">
                          {item.document_name}
                        </h3>
                        {(() => {
                          const typeInfo = getAnalysisTypeInfo(item);
                          return (
                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${typeInfo.color} flex items-center gap-2`}>
                              <span>{typeInfo.icon}</span>
                              {typeInfo.label}
                            </span>
                          );
                        })()}
                        {item.compliance_score !== null && (
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getComplianceScoreColor(item.compliance_score)}`}>
                            {item.compliance_score}% Compliance
                          </span>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <span className="text-sm text-gray-500">Type</span>
                          <p className="font-semibold text-gray-800">
                            {getAnalysisTypeInfo(item).label}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">Industry</span>
                          <p className="font-semibold text-gray-800">{item.industry || 'Not specified'}</p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">
                            {item.analysis_type === 'policy_generation' ? 'Policy Type' : 'Gaps Found'}
                          </span>
                          <p className={`font-semibold ${item.analysis_type === 'policy_generation' ? 'text-green-600' : 'text-red-600'}`}>
                            {item.analysis_type === 'policy_generation' ? 
                              (item.organization_details?.policy_type || item.document_type || 'Custom Policy') : 
                              `${item.gaps_found || 0} gaps`}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">
                            {item.analysis_type === 'policy_generation' ? 'Generated' : 'Analyzed'}
                          </span>
                          <p className="font-semibold text-gray-800">{formatDate(item.created_at)}</p>
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
                                className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium"
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
                                className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium"
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
                        className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm"
                      >
                        <span className="flex items-center space-x-2">
                          <span>{item.analysis_type === 'policy_generation' ? '�' : '�👁️'}</span>
                          <span>{item.analysis_type === 'policy_generation' ? 'View Content' : 'View Details'}</span>
                        </span>
                      </button>
                      <button
                        onClick={() => handleDeleteAnalysis(item.id, item.document_name)}
                        className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-xl font-bold hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm"
                      >
                        <span className="flex items-center space-x-2">
                          <span>🗑️</span>
                          <span>Delete</span>
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Enhanced Pagination */}
            {pagination.pages > 1 && (
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
                <div className="flex justify-center items-center gap-3">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-6 py-3 bg-gradient-to-r from-slate-600 to-slate-700 text-white rounded-xl font-bold hover:from-slate-700 hover:to-slate-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    ← Previous
                  </button>
                  
                  <div className="flex gap-2">
                    {[...Array(pagination.pages)].map((_, index) => (
                      <button
                        key={index + 1}
                        onClick={() => setCurrentPage(index + 1)}
                        className={`px-4 py-3 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ${
                          currentPage === index + 1
                            ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
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
                    className="px-6 py-3 bg-gradient-to-r from-slate-600 to-slate-700 text-white rounded-xl font-bold hover:from-slate-700 hover:to-slate-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
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
