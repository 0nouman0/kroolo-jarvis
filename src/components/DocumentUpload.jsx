import { useState } from 'react';
import { analyzeDocument } from '../lib/gemini';

function DocumentUpload({ onUpload, uploading, progress, error, batchProgress, supportsBatch = false }) {
  const [files, setFiles] = useState([]);
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [selectedFrameworks, setSelectedFrameworks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const availableFrameworks = [
    { 
      id: 'GDPR', 
      name: 'GDPR', 
      fullName: 'General Data Protection Regulation',
      region: 'EU', 
      category: 'Privacy',
      description: 'European data protection and privacy regulation',
      icon: '🇪🇺',
      color: 'blue'
    },
    { 
      id: 'HIPAA', 
      name: 'HIPAA', 
      fullName: 'Health Insurance Portability and Accountability Act',
      region: 'US', 
      category: 'Healthcare',
      description: 'US healthcare data protection standards',
      icon: '🏥',
      color: 'green'
    },
    { 
      id: 'SOX', 
      name: 'SOX', 
      fullName: 'Sarbanes-Oxley Act',
      region: 'US', 
      category: 'Financial',
      description: 'Financial reporting and corporate governance',
      icon: '💼',
      color: 'purple'
    },
    { 
      id: 'CCPA', 
      name: 'CCPA', 
      fullName: 'California Consumer Privacy Act',
      region: 'California', 
      category: 'Privacy',
      description: 'California consumer privacy rights',
      icon: '🏛️',
      color: 'orange'
    },
    { 
      id: 'PCI_DSS', 
      name: 'PCI DSS', 
      fullName: 'Payment Card Industry Data Security Standard',
      region: 'Global', 
      category: 'Payment',
      description: 'Credit card data security requirements',
      icon: '💳',
      color: 'red'
    },
    { 
      id: 'ISO_27001', 
      name: 'ISO 27001', 
      fullName: 'Information Security Management Systems',
      region: 'International', 
      category: 'Security',
      description: 'Information security management standard',
      icon: '🔒',
      color: 'indigo'
    },
    { 
      id: 'FERPA', 
      name: 'FERPA', 
      fullName: 'Family Educational Rights and Privacy Act',
      region: 'US', 
      category: 'Education',
      description: 'Student educational record privacy',
      icon: '🎓',
      color: 'teal'
    },
    { 
      id: 'GLBA', 
      name: 'GLBA', 
      fullName: 'Gramm-Leach-Bliley Act',
      region: 'US', 
      category: 'Financial',
      description: 'Financial institution privacy requirements',
      icon: '🏦',
      color: 'cyan'
    },
    { 
      id: 'COPPA', 
      name: 'COPPA', 
      fullName: 'Children\'s Online Privacy Protection Act',
      region: 'US', 
      category: 'Privacy',
      description: 'Children\'s online privacy protection',
      icon: '👶',
      color: 'pink'
    },
    { 
      id: 'NIST_CSF', 
      name: 'NIST CSF', 
      fullName: 'NIST Cybersecurity Framework',
      region: 'US', 
      category: 'Security',
      description: 'Cybersecurity risk management framework',
      icon: '🛡️',
      color: 'gray'
    },
    { 
      id: 'CAN_SPAM', 
      name: 'CAN-SPAM', 
      fullName: 'Controlling the Assault of Non-Solicited Pornography and Marketing Act',
      region: 'US', 
      category: 'Marketing',
      description: 'Email marketing compliance requirements',
      icon: '📧',
      color: 'yellow'
    },
    { 
      id: 'FISMA', 
      name: 'FISMA', 
      fullName: 'Federal Information Security Modernization Act',
      region: 'US', 
      category: 'Government',
      description: 'Federal information security standards',
      icon: '🏛️',
      color: 'emerald'
    }
  ];

  const industries = [
    'Technology', 'Healthcare', 'Financial', 'Manufacturing', 
    'Retail', 'Education', 'Government', 'Energy'
  ];

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles(droppedFiles);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragActive(false);
  };

  const removeFile = (indexToRemove) => {
    setFiles(files.filter((_, index) => index !== indexToRemove));
  };

  const handleFrameworkChange = (frameworkId) => {
    setSelectedFrameworks(prev => {
      // Ensure prev is always an array
      const currentFrameworks = Array.isArray(prev) ? prev : [];
      
      return currentFrameworks.includes(frameworkId) 
        ? currentFrameworks.filter(id => id !== frameworkId)
        : [...currentFrameworks, frameworkId];
    });
  };

  const extractTextFromPDF = async (file) => {
    setProgress('Extracting text from PDF...');
    const pdfjsLib = window['pdfjs-dist/build/pdf'];
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';
    
    try {
      const pdf = await pdfjsLib.getDocument(URL.createObjectURL(file)).promise;
      let text = '';
      
      for (let i = 1; i <= pdf.numPages; i++) {
        setProgress(`Processing page ${i} of ${pdf.numPages}...`);
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        text += content.items.map(item => item.str).join(' ') + ' ';
      }
      
      console.log('Extracted text length:', text.length);
      console.log('First 200 characters:', text.substring(0, 200));
      
      return text.trim();
    } catch (pdfError) {
      console.error('PDF extraction error:', pdfError);
      throw new Error(`Failed to extract text from PDF: ${pdfError.message}`);
    }
  };

  const handleUpload = async () => {
    if (!files || files.length === 0) {
      alert('Please select at least one file to upload');
      return;
    }

    if (!selectedIndustry) {
      alert('Please select your industry sector');
      return;
    }

    // Ensure selectedFrameworks is an array and has at least one element
    const frameworksToUse = Array.isArray(selectedFrameworks) ? selectedFrameworks : [];
    if (frameworksToUse.length === 0) {
      alert('Please select at least one regulatory framework');
      return;
    }

    // Validate file types and sizes
    const allowedTypes = [
      'application/pdf', 
      'text/plain', 
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    for (let file of files) {
      if (!allowedTypes.includes(file.type)) {
        alert(`File "${file.name}" has an unsupported format. Please upload PDF, Word, or text files only.`);
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        alert(`File "${file.name}" is too large. Maximum file size is 10MB.`);
        return;
      }
    }

    try {
      console.log('Uploading files:', files.map(f => f.name));
      console.log('Selected Industry:', selectedIndustry);
      console.log('Selected Frameworks (validated):', frameworksToUse);

      // Pass the configuration to parent with validated data
      await onUpload({
        files: supportsBatch ? files : [files[0]], // Support both single and batch
        industry: selectedIndustry,
        frameworks: frameworksToUse
      });
      
      // Reset form
      setFiles([]);
      setSelectedIndustry('');
      setSelectedFrameworks([]);
      
      // Reset file input
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = '';
      
    } catch (err) {
      console.error('Upload error:', err);
      // Error handling is managed by parent
    }
  };

  return (
    <div className="w-full bg-white/90 backdrop-blur-sm p-10 rounded-3xl shadow-2xl border border-white/30">
      <div className="flex items-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center mr-6 shadow-xl">
          <span className="text-3xl text-white">📁</span>
        </div>
        <div>
          <h2 className="text-4xl font-black bg-gradient-to-r from-slate-800 to-purple-700 bg-clip-text text-transparent">Upload Document</h2>
          <p className="text-gray-600 font-medium mt-1">Upload your policy for AI-powered analysis</p>
        </div>
      </div>
      
      {/* Enhanced Regulatory Framework Selection */}
      <div className="mb-8">
        <label className="block text-xl font-black mb-6 bg-gradient-to-r from-slate-800 to-purple-700 bg-clip-text text-transparent">
          🎯 Select Regulatory Frameworks to Benchmark Against:
        </label>
        
        {/* Selected frameworks count */}
        {selectedFrameworks.length > 0 && (
          <div className="mb-4 p-3 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-200">
            <div className="flex items-center text-purple-700 font-semibold">
              <span className="text-lg mr-2">✅</span>
              {selectedFrameworks.length} framework{selectedFrameworks.length !== 1 ? 's' : ''} selected
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {availableFrameworks.map((framework) => {
            const isSelected = selectedFrameworks.includes(framework.id);
            const colorClasses = {
              blue: 'border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100 text-blue-700',
              green: 'border-green-500 bg-gradient-to-br from-green-50 to-green-100 text-green-700',
              purple: 'border-purple-500 bg-gradient-to-br from-purple-50 to-purple-100 text-purple-700',
              orange: 'border-orange-500 bg-gradient-to-br from-orange-50 to-orange-100 text-orange-700',
              red: 'border-red-500 bg-gradient-to-br from-red-50 to-red-100 text-red-700',
              indigo: 'border-indigo-500 bg-gradient-to-br from-indigo-50 to-indigo-100 text-indigo-700',
              teal: 'border-teal-500 bg-gradient-to-br from-teal-50 to-teal-100 text-teal-700',
              cyan: 'border-cyan-500 bg-gradient-to-br from-cyan-50 to-cyan-100 text-cyan-700',
              pink: 'border-pink-500 bg-gradient-to-br from-pink-50 to-pink-100 text-pink-700',
              gray: 'border-gray-500 bg-gradient-to-br from-gray-50 to-gray-100 text-gray-700',
              yellow: 'border-yellow-500 bg-gradient-to-br from-yellow-50 to-yellow-100 text-yellow-700',
              emerald: 'border-emerald-500 bg-gradient-to-br from-emerald-50 to-emerald-100 text-emerald-700'
            };
            
            return (
              <label 
                key={framework.id} 
                className={`group relative flex flex-col p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-xl ${
                  isSelected
                    ? `${colorClasses[framework.color]} shadow-lg ring-2 ring-${framework.color}-200`
                    : 'border-gray-200 bg-white/80 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => handleFrameworkChange(framework.id)}
                  className="absolute top-3 right-3 w-5 h-5 text-purple-600 bg-white border-gray-300 rounded focus:ring-purple-500 focus:ring-2"
                />
                
                {/* Framework Header */}
                <div className="flex items-center mb-3">
                  <span className="text-2xl mr-3">{framework.icon}</span>
                  <div className="flex-1">
                    <div className="font-bold text-lg text-slate-800">{framework.name}</div>
                    <div className={`text-xs px-2 py-1 rounded-full inline-block mt-1 ${
                      isSelected 
                        ? `bg-${framework.color}-200 text-${framework.color}-800` 
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {framework.category}
                    </div>
                  </div>
                </div>
                
                {/* Framework Details */}
                <div className="space-y-2 flex-1">
                  <div className="text-sm text-gray-700 leading-relaxed">
                    {framework.description}
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-gray-600">
                      📍 {framework.region}
                    </span>
                    {isSelected && (
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold">
                        ✓ Selected
                      </span>
                    )}
                  </div>
                </div>
              </label>
            );
          })}
        </div>
        
        {/* Quick selection buttons */}
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setSelectedFrameworks(['GDPR', 'CCPA', 'HIPAA'])}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg text-sm font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            🏃‍♂️ Quick Start: Privacy Pack
          </button>
          <button
            type="button"
            onClick={() => setSelectedFrameworks(['SOX', 'GLBA', 'PCI_DSS'])}
            className="px-4 py-2 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-lg text-sm font-semibold hover:from-green-600 hover:to-teal-700 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            💼 Financial Services Pack
          </button>
          <button
            type="button"
            onClick={() => setSelectedFrameworks(['ISO_27001', 'NIST_CSF', 'FISMA'])}
            className="px-4 py-2 bg-gradient-to-r from-gray-500 to-slate-600 text-white rounded-lg text-sm font-semibold hover:from-gray-600 hover:to-slate-700 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            🛡️ Security Standards Pack
          </button>
          <button
            type="button"
            onClick={() => setSelectedFrameworks([])}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-300 transition-all duration-300"
          >
            🗑️ Clear All
          </button>
        </div>
      </div>

      {/* Enhanced Industry Selection */}
      <div className="mb-8">
        <label className="block text-xl font-black mb-4 bg-gradient-to-r from-slate-800 to-purple-700 bg-clip-text text-transparent">
          Select Your Industry Sector:
        </label>
        <select
          value={selectedIndustry}
          onChange={(e) => setSelectedIndustry(e.target.value)}
          className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl bg-white/80 backdrop-blur-sm text-slate-800 font-bold text-lg focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          <option value="">Choose your industry...</option>
          {industries.map((industry) => (
            <option key={industry} value={industry}>{industry}</option>
          ))}
        </select>
      </div>
      
      {/* Enhanced File Upload */}
      <div className="mb-8">
        <label className="block text-xl font-black mb-4 bg-gradient-to-r from-slate-800 to-purple-700 bg-clip-text text-transparent">
          Upload Policy Document{supportsBatch ? 's' : ''}:
          {supportsBatch && (
            <span className="text-sm font-medium text-purple-600 ml-2">
              (Multiple files supported for batch analysis)
            </span>
          )}
        </label>
        <div className="relative group">
          <div 
            className={`bg-gradient-to-br from-gray-50 to-blue-50 p-8 rounded-2xl border-2 border-dashed transition-all duration-300 shadow-lg hover:shadow-xl ${
              dragActive 
                ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-indigo-50' 
                : 'border-gray-300 group-hover:border-purple-400'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <input
              type="file"
              accept="application/pdf,.txt,.doc,.docx"
              multiple={supportsBatch}
              onChange={handleFileChange}
              className="w-full text-gray-700 bg-white border-2 border-gray-200 p-4 rounded-xl file:mr-4 file:py-3 file:px-6 file:bg-gradient-to-r file:from-purple-600 file:to-indigo-700 file:text-white file:font-bold file:border-0 file:rounded-xl file:shadow-lg hover:file:from-purple-700 hover:file:to-indigo-800 file:transition-all file:duration-300 transition-all font-medium"
            />
            
            {supportsBatch && (
              <div className="mt-4 text-center">
                <p className="text-gray-600 font-medium">
                  Or drag and drop multiple files here for batch analysis
                </p>
              </div>
            )}
            
            {files.length > 0 && (
              <div className="mt-6 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-bold text-slate-800">
                    Selected Files ({files.length})
                  </h4>
                  {files.length > 1 && (
                    <button
                      onClick={() => setFiles([])}
                      className="text-red-600 hover:text-red-800 font-medium text-sm"
                    >
                      Clear All
                    </button>
                  )}
                </div>
                
                <div className="grid gap-3 max-h-60 overflow-y-auto">
                  {files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border-2 border-emerald-200 shadow-sm">
                      <div className="flex items-center flex-1 min-w-0">
                        <span className="text-2xl mr-3">📄</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-emerald-700 font-bold text-sm truncate">
                            {file.name}
                          </p>
                          <p className="text-emerald-600 text-xs">
                            {(file.size / 1024).toFixed(1)} KB • {file.type}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFile(index)}
                        className="ml-2 text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100 transition-all duration-200"
                        title="Remove file"
                      >
                        <span className="text-sm">❌</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced Upload Button */}
      <button
        onClick={handleUpload}
        disabled={uploading || files.length === 0}
        className="w-full bg-gradient-to-r from-purple-600 to-indigo-700 text-white text-xl font-black px-8 py-6 rounded-2xl shadow-2xl hover:from-purple-700 hover:to-indigo-800 hover:shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02]"
      >
        {uploading ? (
          <span className="flex items-center justify-center space-x-3">
            <div className="animate-spin w-6 h-6 border-2 border-white border-t-transparent rounded-full"></div>
            <span>🤖 AI Processing{files.length > 1 ? ` (${batchProgress.current}/${batchProgress.total})` : ''}...</span>
          </span>
        ) : (
          <span className="flex items-center justify-center space-x-3">
            <span>⚡</span>
            <span>Analyze {files.length > 1 ? `${files.length} Documents` : 'Policy'} with AI</span>
            <span>🚀</span>
          </span>
        )}
      </button>

      {/* Enhanced Progress Display with Batch Support */}
      {progress && (
        <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-2xl shadow-xl">
          <div className="flex items-center">
            <div className="animate-spin text-3xl mr-4">⚙️</div>
            <div className="flex-1">
              <p className="text-blue-700 font-black text-xl">{progress}</p>
              <p className="text-blue-600 text-sm font-medium mt-1">
                Please wait while we process your document{files.length > 1 ? 's' : ''}...
              </p>
              {batchProgress.total > 0 && (
                <div className="mt-3">
                  <div className="flex items-center justify-between text-sm text-blue-600 mb-2">
                    <span>Progress</span>
                    <span>{batchProgress.current} of {batchProgress.total}</span>
                  </div>
                  <div className="w-full bg-blue-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(batchProgress.current / batchProgress.total) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Error Display */}
      {error && (
        <div className="mt-8 p-6 bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-2xl shadow-xl">
          <div className="flex items-start">
            <span className="text-3xl mr-4 mt-1">⚠️</span>
            <div className="flex-1">
              <p className="text-red-700 font-black text-xl mb-2">Analysis Error</p>
              <p className="text-red-600 mb-4 font-medium leading-relaxed">{error}</p>
              <div className="bg-red-100 p-4 rounded-xl border border-red-200">
                <p className="text-red-700 text-sm font-medium flex items-center">
                  <span className="mr-2">💡</span>
                  Check the browser console (F12) for detailed error information.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DocumentUpload;
