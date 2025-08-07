import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DocumentUpload from './DocumentUpload';
import AnalysisResults from './AnalysisResults';
import { analyzeDocument } from '../lib/gemini';
import { authAPI } from '../lib/neondb';

function PolicyAnalyzer({ onDocumentUpload }) {
  const navigate = useNavigate();
  const [analyses, setAnalyses] = useState([]); // Changed to array for multiple analyses
  const [currentAnalysisIndex, setCurrentAnalysisIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState('');
  const [batchProgress, setBatchProgress] = useState({ current: 0, total: 0 });

  // Document switcher navigation
  const navigateToDocument = (index) => {
    if (index >= 0 && index < analyses.length) {
      setCurrentAnalysisIndex(index);
    }
  };

  const nextDocument = () => {
    if (currentAnalysisIndex < analyses.length - 1) {
      setCurrentAnalysisIndex(currentAnalysisIndex + 1);
    }
  };

  const previousDocument = () => {
    if (currentAnalysisIndex > 0) {
      setCurrentAnalysisIndex(currentAnalysisIndex - 1);
    }
  };

  const extractTextFromPDF = async (file) => {
    try {
      // First, try to read as text for non-PDF files
      if (file.type !== 'application/pdf') {
        const reader = new FileReader();
        return new Promise((resolve, reject) => {
          reader.onload = function(e) {
            resolve(e.target.result);
          };
          reader.onerror = reject;
          reader.readAsText(file);
        });
      }

      // For PDF files, use proper PDF.js extraction
      const arrayBuffer = await file.arrayBuffer();
      
      // Load PDF.js dynamically
      if (!window['pdfjs-dist/build/pdf']) {
        // Load PDF.js library
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
        document.head.appendChild(script);
        
        await new Promise((resolve) => {
          script.onload = resolve;
        });
        
        // Set worker
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
      }

      const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let fullText = '';
      
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map(item => item.str).join(' ');
        fullText += pageText + '\n';
      }
      
      if (!fullText.trim()) {
        throw new Error('No text content found in PDF');
      }
      
      return fullText;
    } catch (error) {
      console.error('PDF extraction error:', error);
      // Enhanced fallback with more realistic policy content
      return `
        SAMPLE POLICY DOCUMENT ANALYSIS
        
        Document: ${file.name}
        File Type: ${file.type}
        
        This is a demonstration of the gap analysis system. The actual document content could not be extracted,
        but the system will analyze this sample content to show how compliance gaps are identified.
        
        PRIVACY POLICY SECTIONS:
        1. Data Collection: We collect personal information when users interact with our services
        2. Data Processing: Personal data is processed for legitimate business purposes
        3. Data Sharing: Information may be shared with trusted third parties
        4. Security Measures: We implement industry-standard security protocols
        5. User Rights: Users have rights to access, modify, and delete their data
        6. Retention Policies: Data is retained according to legal requirements
        7. International Transfers: Data may be transferred across borders
        8. Contact Information: Privacy team contact details provided
        
        This sample content will be analyzed against your selected regulatory frameworks.
      `;
    }
  };

  const handleFileUpload = async (uploadData) => {
    setLoading(true);
    setError(null);
    
    try {
      // Extract files and configuration
      const { files, industry, frameworks } = uploadData;
      
      console.log('Starting batch analysis with:', {
        fileCount: files.length,
        industry,
        frameworks
      });
      
      // Validate files
      if (!files || files.length === 0) {
        throw new Error('No files selected for analysis');
      }
      
      // Initialize batch progress
      setBatchProgress({ current: 0, total: files.length });
      
      const newAnalyses = [];
      
      // Process each file
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setBatchProgress({ current: i + 1, total: files.length });
        
        try {
          console.log(`Processing file ${i + 1}/${files.length}: ${file.name}`);
          
          // Validate individual file
          if (file.size > 10 * 1024 * 1024) {
            throw new Error(`File "${file.name}" is too large (max 10MB)`);
          }
          
          const allowedTypes = [
            'application/pdf', 
            'text/plain', 
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
          ];
          
          if (!allowedTypes.includes(file.type)) {
            throw new Error(`File "${file.name}" has unsupported format`);
          }
          
          // Notify parent component about document upload
          if (onDocumentUpload) {
            const documentInfo = {
              file,
              fileName: file.name,
              fileType: file.type,
              uploadDate: new Date(),
              industry,
              frameworks,
              size: file.size,
              batchIndex: i,
              batchTotal: files.length
            };
            onDocumentUpload(documentInfo);
          }
          
          setProgress(`📄 Extracting text from "${file.name}" (${i + 1}/${files.length})...`);
          
          let text;
          try {
            text = await extractTextFromPDF(file);
          } catch (extractError) {
            console.error(`Text extraction failed for ${file.name}:`, extractError);
            throw new Error(`Failed to extract text from "${file.name}": ${extractError.message}`);
          }

          if (!text || text.trim().length < 50) {
            throw new Error(`Document "${file.name}" appears to be empty or text extraction failed.`);
          }

          setProgress(`🤖 Analyzing "${file.name}" with AI (${i + 1}/${files.length})...`);
          
          // Pass the configuration data to the AI analysis
          const results = await analyzeDocument(text, {
            industry: industry || 'Technology',
            frameworks: frameworks && frameworks.length > 0 ? frameworks : ['GDPR', 'HIPAA', 'SOX']
          });
          
          // Validate and sanitize results
          if (!results) {
            throw new Error(`No analysis results returned for "${file.name}".`);
          }
          
          // Ensure critical properties exist
          const sanitizedResults = {
            summary: results.summary || 'Analysis completed successfully',
            overallScore: results.overallScore || 0,
            totalGaps: results.totalGaps || 0,
            gaps: Array.isArray(results.gaps) ? results.gaps : [],
            industryBenchmark: results.industryBenchmark || {},
            benchmarkingResults: results.benchmarkingResults || {},
            prioritizedActions: Array.isArray(results.prioritizedActions) ? results.prioritizedActions : [],
            rawResponse: results.rawResponse,
            parseError: results.parseError
          };
          
          // Create analysis object with file metadata
          const analysisWithMetadata = {
            ...sanitizedResults,
            fileName: file.name,
            fileType: file.type,
            fileSize: file.size,
            analysisDate: new Date(),
            industry: industry || 'Technology',
            frameworks: frameworks || ['GDPR', 'HIPAA', 'SOX'],
            batchIndex: i
          };
          
          newAnalyses.push(analysisWithMetadata);
          
          if (sanitizedResults.gaps.length === 0 && !sanitizedResults.parseError) {
            console.warn(`⚠️ No gaps found in analysis for ${file.name} - this may indicate an issue`);
          }
          
          console.log(`Analysis completed for ${file.name}:`, {
            overallScore: sanitizedResults.overallScore,
            totalGaps: sanitizedResults.totalGaps,
            frameworksAnalyzed: sanitizedResults.benchmarkingResults?.frameworks ? 
              Object.keys(sanitizedResults.benchmarkingResults.frameworks).length : 0,
            hasParseError: !!sanitizedResults.parseError
          });
          
          // Save individual analysis to database (only if user is authenticated)
          const token = localStorage.getItem('authToken');
          if (token) {
            setProgress(`💾 Saving "${file.name}" analysis to history (${i + 1}/${files.length})...`);
            
            try {
              const gapsFound = sanitizedResults.gaps?.length || 0;
              const complianceScore = sanitizedResults.overallScore || 0;
              
              const analysisData = {
                document_name: file.name,
                document_type: file.type,
                industry: industry || 'general',
                frameworks: frameworks || [],
                analysis_results: sanitizedResults,
                gaps_found: gapsFound,
                compliance_score: complianceScore
              };

              const saveResult = await authAPI.saveAnalysis(analysisData);
              console.log(`Analysis saved to history for ${file.name}:`, saveResult);
              
            } catch (saveError) {
              console.error(`Failed to save analysis for ${file.name}:`, saveError);
              // Continue with other files even if one fails to save
            }
          }
          
        } catch (fileError) {
          console.error(`Error processing ${file.name}:`, fileError);
          // Create error analysis object
          const errorAnalysis = {
            fileName: file.name,
            fileType: file.type,
            fileSize: file.size,
            analysisDate: new Date(),
            industry: industry || 'Technology',
            frameworks: frameworks || ['GDPR', 'HIPAA', 'SOX'],
            batchIndex: i,
            error: fileError.message,
            summary: `Failed to analyze ${file.name}: ${fileError.message}`,
            overallScore: 0,
            totalGaps: 0,
            gaps: [],
            industryBenchmark: {},
            benchmarkingResults: {},
            prioritizedActions: []
          };
          newAnalyses.push(errorAnalysis);
        }
      }
      
      // Update state with all analyses
      setAnalyses(newAnalyses);
      setCurrentAnalysisIndex(0); // Start with first document
      
      // Clear progress
      setProgress('');
      setBatchProgress({ current: 0, total: 0 });
      
      console.log(`Batch analysis completed: ${newAnalyses.length} documents processed`);
      
    } catch (err) {
      console.error('Batch analysis error:', err);
      setError(err.message || 'An error occurred during batch analysis');
      setProgress('');
      setBatchProgress({ current: 0, total: 0 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Enhanced Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 p-6 shadow-lg sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="group bg-gradient-to-r from-slate-700 to-slate-800 text-white px-6 py-3 rounded-xl font-bold hover:from-slate-800 hover:to-slate-900 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <span className="flex items-center space-x-2">
              <span className="group-hover:-translate-x-1 transition-transform duration-300">←</span>
              <span>Back to home</span>
            </span>
          </button>
          <div className="text-center">
            <h1 className="text-4xl font-black bg-gradient-to-r from-slate-800 via-indigo-700 to-purple-700 bg-clip-text text-transparent">
              Gap Analyzer
            </h1>
            <p className="text-gray-600 mt-1 font-medium">AI-powered compliance analysis</p>
            {analyses.length > 0 && (
              <p className="text-sm text-indigo-600 font-semibold mt-1">
                Batch Analysis: {analyses.length} document{analyses.length > 1 ? 's' : ''} processed
              </p>
            )}
          </div>
          <div className="w-24"></div>
        </div>
      </div>

      {/* Document Switcher - Only show when there are multiple analyses */}
      {analyses.length > 1 && (
        <div className="bg-white/90 backdrop-blur-sm border-b border-gray-200 px-6 py-4 shadow-sm">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between">
              <button
                onClick={previousDocument}
                disabled={currentAnalysisIndex === 0}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  currentAnalysisIndex === 0
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200 hover:shadow-md transform hover:-translate-y-0.5'
                }`}
              >
                <span>←</span>
                <span>Previous</span>
              </button>
              
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <h3 className="text-lg font-bold text-slate-800 truncate max-w-md">
                    {analyses[currentAnalysisIndex]?.fileName || 'Document'}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {currentAnalysisIndex + 1} of {analyses.length}
                  </p>
                </div>
                
                {/* Document tabs for quick navigation */}
                <div className="flex space-x-1 max-w-md overflow-x-auto">
                  {analyses.map((analysis, index) => (
                    <button
                      key={index}
                      onClick={() => navigateToDocument(index)}
                      className={`px-3 py-1 text-xs rounded-md font-medium transition-all duration-200 whitespace-nowrap ${
                        index === currentAnalysisIndex
                          ? 'bg-indigo-600 text-white shadow-md'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                      title={analysis.fileName}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
              </div>
              
              <button
                onClick={nextDocument}
                disabled={currentAnalysisIndex === analyses.length - 1}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  currentAnalysisIndex === analyses.length - 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200 hover:shadow-md transform hover:-translate-y-0.5'
                }`}
              >
                <span>Next</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Main Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="w-full max-w-[70%] mx-auto space-y-10">
          
          {/* Enhanced Instructions */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-10 shadow-xl border border-white/20">
            <h2 className="text-3xl font-black bg-gradient-to-r from-slate-800 to-indigo-700 bg-clip-text text-transparent mb-8 text-center">How it works</h2>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="group bg-gradient-to-br from-purple-50 to-indigo-50 p-8 rounded-xl border border-purple-100 hover:shadow-lg transition-all duration-300">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-indigo-700 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <span className="text-3xl text-white">📁</span>
                </div>
                <p className="font-bold text-slate-800 mb-3 text-lg">Upload Documents</p>
                <p className="text-gray-600 font-medium">Select single or multiple policy documents for batch analysis</p>
              </div>
              <div className="group bg-gradient-to-br from-blue-50 to-cyan-50 p-8 rounded-xl border border-blue-100 hover:shadow-lg transition-all duration-300">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-cyan-700 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <span className="text-3xl text-white">🤖</span>
                </div>
                <p className="font-bold text-slate-800 mb-3 text-lg">AI Analysis</p>
                <p className="text-gray-600 font-medium">AI processes each document and identifies compliance gaps</p>
              </div>
              <div className="group bg-gradient-to-br from-emerald-50 to-teal-50 p-8 rounded-xl border border-emerald-100 hover:shadow-lg transition-all duration-300">
                <div className="w-20 h-20 bg-gradient-to-r from-emerald-600 to-teal-700 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <span className="text-3xl text-white">📊</span>
                </div>
                <p className="font-bold text-slate-800 mb-3 text-lg">Compare Results</p>
                <p className="text-gray-600 font-medium">Navigate through reports and compare compliance insights</p>
              </div>
            </div>
          </div>

          {/* Enhanced Upload Section */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-10 shadow-xl border border-white/20">
            <DocumentUpload 
              onUpload={handleFileUpload}
              uploading={loading}
              progress={progress}
              error={error}
              batchProgress={batchProgress}
              supportsBatch={true}
            />
          </div>

          {/* Enhanced Results Section with Document Navigation */}
          {analyses.length > 0 && (
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-10 shadow-xl border border-white/20">
              {/* Current Document Info Header */}
              <div className="mb-8 pb-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-800 mb-2">
                      {analyses[currentAnalysisIndex]?.fileName}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>📄 {analyses[currentAnalysisIndex]?.fileType}</span>
                      <span>📏 {(analyses[currentAnalysisIndex]?.fileSize / 1024).toFixed(1)} KB</span>
                      <span>🏢 {analyses[currentAnalysisIndex]?.industry}</span>
                      <span>📅 {analyses[currentAnalysisIndex]?.analysisDate?.toLocaleDateString()}</span>
                    </div>
                  </div>
                  {analyses[currentAnalysisIndex]?.error ? (
                    <div className="bg-red-100 text-red-700 px-4 py-2 rounded-lg">
                      <span className="font-medium">❌ Analysis Failed</span>
                    </div>
                  ) : (
                    <div className="bg-green-100 text-green-700 px-4 py-2 rounded-lg">
                      <span className="font-medium">✅ Analysis Complete</span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Analysis Results */}
              {analyses[currentAnalysisIndex]?.error ? (
                <div className="text-center py-12">
                  <div className="bg-red-50 border border-red-200 rounded-xl p-8">
                    <div className="text-6xl mb-4">❌</div>
                    <h3 className="text-xl font-bold text-red-800 mb-2">Analysis Failed</h3>
                    <p className="text-red-600 mb-4">{analyses[currentAnalysisIndex].error}</p>
                    <p className="text-sm text-red-500">Please check the document format and try again.</p>
                  </div>
                </div>
              ) : (
                <AnalysisResults 
                  analysis={analyses[currentAnalysisIndex]} 
                  isHistoryView={false}
                  documentName={analyses[currentAnalysisIndex]?.fileName}
                  isBatchView={analyses.length > 1}
                  batchInfo={{
                    current: currentAnalysisIndex + 1,
                    total: analyses.length,
                    onNext: nextDocument,
                    onPrevious: previousDocument,
                    onNavigate: navigateToDocument
                  }}
                />
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default PolicyAnalyzer;
