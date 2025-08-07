import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import { analyzeWithGemini } from '../lib/gemini';
import { authAPI } from '../lib/neondb';

function PolicyGenerator() {
  const [companyName, setCompanyName] = useState('');
  const [industry, setIndustry] = useState('');
  const [policyType, setPolicyType] = useState('');
  const [generating, setGenerating] = useState(false);
  const [generatedPolicy, setGeneratedPolicy] = useState('');
  const [error, setError] = useState('');
  const [progress, setProgress] = useState('');
  const [selectedFrameworks, setSelectedFrameworks] = useState([]);
  const [selectedCompliances, setSelectedCompliances] = useState([]);
  
  const navigate = useNavigate();

  const industries = [
    'Technology', 'Healthcare', 'Financial Services', 'Education', 
    'Manufacturing', 'Retail', 'Government', 'Non-Profit', 'Other'
  ];

  const policyTypes = [
    'Privacy Policy', 'Data Protection Policy', 'Security Policy',
    'Employee Handbook', 'Code of Conduct', 'IT Policy',
    'Remote Work Policy', 'Incident Response Policy'
  ];

  const frameworks = [
    { 
      id: 'iso27001', 
      name: 'ISO 27001', 
      description: 'Information Security Management System', 
      icon: '🔒', 
      color: 'indigo',
      category: 'Security'
    },
    { 
      id: 'nist', 
      name: 'NIST CSF', 
      description: 'Cybersecurity Framework', 
      icon: '🛡️', 
      color: 'gray',
      category: 'Security'
    },
    { 
      id: 'cobit', 
      name: 'COBIT', 
      description: 'Control Objectives for IT', 
      icon: '⚙️', 
      color: 'purple',
      category: 'Governance'
    },
    { 
      id: 'itil', 
      name: 'ITIL', 
      description: 'IT Service Management', 
      icon: '🔧', 
      color: 'blue',
      category: 'IT Management'
    },
    { 
      id: 'sox', 
      name: 'SOX', 
      description: 'Sarbanes-Oxley Act', 
      icon: '💼', 
      color: 'orange',
      category: 'Financial'
    },
    { 
      id: 'coso', 
      name: 'COSO', 
      description: 'Enterprise Risk Management', 
      icon: '📊', 
      color: 'green',
      category: 'Risk Management'
    },
    { 
      id: 'fair', 
      name: 'FAIR', 
      description: 'Factor Analysis of Information Risk', 
      icon: '🎯', 
      color: 'red',
      category: 'Risk Assessment'
    },
    { 
      id: 'octave', 
      name: 'OCTAVE', 
      description: 'Operationally Critical Threat Assessment', 
      icon: '🔍', 
      color: 'teal',
      category: 'Threat Assessment'
    }
  ];

  const compliances = [
    { 
      id: 'gdpr', 
      name: 'GDPR', 
      description: 'General Data Protection Regulation (EU)', 
      icon: '🇪🇺', 
      color: 'blue',
      category: 'Privacy'
    },
    { 
      id: 'ccpa', 
      name: 'CCPA', 
      description: 'California Consumer Privacy Act', 
      icon: '🏛️', 
      color: 'orange',
      category: 'Privacy'
    },
    { 
      id: 'hipaa', 
      name: 'HIPAA', 
      description: 'Health Insurance Portability Act', 
      icon: '🏥', 
      color: 'green',
      category: 'Healthcare'
    },
    { 
      id: 'ferpa', 
      name: 'FERPA', 
      description: 'Family Educational Rights and Privacy Act', 
      icon: '🎓', 
      color: 'teal',
      category: 'Education'
    },
    { 
      id: 'pci-dss', 
      name: 'PCI DSS', 
      description: 'Payment Card Industry Data Security Standard', 
      icon: '💳', 
      color: 'red',
      category: 'Financial'
    },
    { 
      id: 'fisma', 
      name: 'FISMA', 
      description: 'Federal Information Security Management Act', 
      icon: '🏛️', 
      color: 'emerald',
      category: 'Government'
    },
    { 
      id: 'glba', 
      name: 'GLBA', 
      description: 'Gramm-Leach-Bliley Act', 
      icon: '🏦', 
      color: 'cyan',
      category: 'Financial'
    },
    { 
      id: 'coppa', 
      name: 'COPPA', 
      description: 'Children\'s Online Privacy Protection Act', 
      icon: '👶', 
      color: 'pink',
      category: 'Privacy'
    },
    { id: 'pipeda', name: 'PIPEDA', description: 'Personal Information Protection (Canada)' },
    { id: 'lgpd', name: 'LGPD', description: 'Lei Geral de Proteção de Dados (Brazil)' }
  ];

  const handleFrameworkChange = (frameworkId) => {
    setSelectedFrameworks(prev => 
      prev.includes(frameworkId)
        ? prev.filter(id => id !== frameworkId)
        : [...prev, frameworkId]
    );
  };

  const handleComplianceChange = (complianceId) => {
    setSelectedCompliances(prev => 
      prev.includes(complianceId)
        ? prev.filter(id => id !== complianceId)
        : [...prev, complianceId]
    );
  };

  const clearAllFrameworks = () => setSelectedFrameworks([]);
  const clearAllCompliances = () => setSelectedCompliances([]);

  const generatePolicyPDF = async (policyContent, metadata) => {
    const doc = new jsPDF();
    const margin = 20;
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    let yPosition = 40;

    // Header
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 58, 138);
    doc.text(metadata.title, margin, yPosition);
    yPosition += 15;

    // Company info
    doc.setFontSize(16);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(75, 85, 99);
    doc.text(metadata.companyName, margin, yPosition);
    yPosition += 10;

    // Metadata
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, margin, yPosition);
    doc.text(`Document Type: ${metadata.policyType}`, margin, yPosition + 5);
    doc.text(`Version: 1.0`, margin, yPosition + 10);
    
    yPosition += 25;
    doc.setTextColor(0, 0, 0);
    
    // Process content
    const lines = policyContent.split('\n');
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    
    for (let line of lines) {
      if (line.trim() === '') {
        yPosition += 5;
        continue;
      }
      
      // Check for headers (lines starting with #)
      if (line.startsWith('# ')) {
        if (yPosition > pageHeight - 40) {
          doc.addPage();
          yPosition = 40;
        }
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(30, 58, 138);
        const headerText = line.substring(2);
        doc.text(headerText, margin, yPosition);
        yPosition += 15;
        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(0, 0, 0);
        continue;
      }
      
      // Check for subheaders (lines starting with ##)
      if (line.startsWith('## ')) {
        if (yPosition > pageHeight - 35) {
          doc.addPage();
          yPosition = 40;
        }
        doc.setFontSize(13);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(51, 51, 51);
        const subheaderText = line.substring(3);
        doc.text(subheaderText, margin, yPosition);
        yPosition += 12;
        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(0, 0, 0);
        continue;
      }
      
      // Regular text
      const textWidth = pageWidth - 2 * margin;
      const splitText = doc.splitTextToSize(line, textWidth);
      
      for (let splitLine of splitText) {
        if (yPosition > pageHeight - 30) {
          doc.addPage();
          yPosition = 40;
        }
        doc.text(splitLine, margin, yPosition);
        yPosition += 6;
      }
      yPosition += 2;
    }

    return doc;
  };

  const handleGeneratePolicy = async () => {
    if (!companyName || !industry || !policyType) {
      setError('Please fill in all required fields');
      return;
    }

    setGenerating(true);
    setError('');
    setProgress('');
    
    try {
      setProgress('Analyzing requirements and preferences...');
      
      let prompt = `Generate a comprehensive ${policyType} for ${companyName}, a company in the ${industry} industry.

The policy should be professional, legally sound, and include:
1. Clear objectives and scope
2. Detailed procedures and guidelines
3. Roles and responsibilities
4. Compliance requirements
5. Implementation guidelines
6. Review and update procedures

`;

      if (selectedFrameworks.length > 0) {
        const frameworkNames = selectedFrameworks.map(id => frameworks.find(f => f.id === id)?.name).join(', ');
        prompt += `Please ensure the policy aligns with these frameworks: ${frameworkNames}.\n`;
      }

      if (selectedCompliances.length > 0) {
        const complianceNames = selectedCompliances.map(id => compliances.find(c => c.id === id)?.name).join(', ');
        prompt += `The policy must comply with these standards: ${complianceNames}.\n`;
      }

      prompt += `
Make it specific to ${companyName} and relevant to the ${industry} industry.`;

      setProgress('Generating comprehensive policy content...');
      
      const policyContent = await analyzeWithGemini(prompt);
      
      if (!policyContent || policyContent.trim() === '') {
        throw new Error('Failed to generate policy content');
      }

      setGeneratedPolicy(policyContent);
      
      // Save the generated policy to database
      setProgress('Saving policy to your history...');
      
      try {
        const frameworkNames = selectedFrameworks.map(id => frameworks.find(f => f.id === id)?.name);
        const complianceNames = selectedCompliances.map(id => compliances.find(c => c.id === id)?.name);
        
        const policyData = {
          document_name: `${policyType} - ${companyName}`,
          document_type: policyType,
          analysis_type: 'policy_generation',
          industry: industry,
          frameworks: frameworkNames,
          organization_details: {
            company_name: companyName,
            policy_type: policyType,
            industry: industry,
            frameworks: frameworkNames,
            compliances: complianceNames,
            generated_at: new Date().toISOString(),
            content_length: policyContent.length
          },
          analysis_results: {
            generated_content: policyContent,
            policy_metadata: {
              company_name: companyName,
              policy_type: policyType,
              industry: industry,
              frameworks: frameworkNames,
              compliances: complianceNames,
              generated_at: new Date().toISOString()
            }
          },
          gaps_found: 0, // Policy generation doesn't have gaps
          compliance_score: 100 // Generated policies are considered 100% compliant with selected standards
        };

        await authAPI.saveAnalysis(policyData);
        setProgress('Policy generated and saved successfully!');
      } catch (saveError) {
        console.error('Error saving policy:', saveError);
        // Don't fail the entire operation if saving fails
        setProgress('Policy generated successfully! (Note: Could not save to history)');
      }
      
    } catch (error) {
      console.error('Error generating policy:', error);
      setError('Failed to generate policy. Please try again.');
      setProgress('');
    } finally {
      setGenerating(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!generatedPolicy) {
      setError('No policy to download. Please generate a policy first.');
      return;
    }

    try {
      setProgress('Preparing professional PDF document...');
      
      const metadata = {
        title: policyType,
        companyName,
        industry,
        policyType
      };

      const doc = await generatePolicyPDF(generatedPolicy, metadata);
      
      const fileName = `${companyName}_${policyType.replace(/\s+/g, '_')}_${new Date().getFullYear()}.pdf`;
      doc.save(fileName);
      
      setProgress('PDF downloaded successfully!');
      setTimeout(() => setProgress(''), 3000);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      setError('Failed to generate PDF. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50">
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
            <h1 className="text-4xl font-black bg-gradient-to-r from-slate-800 via-purple-700 to-pink-700 bg-clip-text text-transparent">
              Policy Generator
            </h1>
            <p className="text-gray-600 mt-1 font-medium">Generate professional policies instantly</p>
          </div>
          <div className="w-24"></div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          
          {/* Enhanced Instructions */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-10 shadow-xl border border-white/20 mb-10">
            <h2 className="text-3xl font-black bg-gradient-to-r from-slate-800 to-purple-700 bg-clip-text text-transparent mb-8 text-center">How it works</h2>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="group bg-gradient-to-br from-purple-50 to-pink-50 p-8 rounded-xl border border-purple-100 hover:shadow-lg transition-all duration-300">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-pink-700 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <span className="text-3xl text-white">📝</span>
                </div>
                <p className="font-bold text-slate-800 mb-3 text-lg">Fill Details</p>
                <p className="text-gray-600 font-medium">Enter company info and select policy type</p>
              </div>
              <div className="group bg-gradient-to-br from-blue-50 to-cyan-50 p-8 rounded-xl border border-blue-100 hover:shadow-lg transition-all duration-300">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-cyan-700 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <span className="text-3xl text-white">🤖</span>
                </div>
                <p className="font-bold text-slate-800 mb-3 text-lg">AI Generation</p>
                <p className="text-gray-600 font-medium">AI creates customized policy document</p>
              </div>
              <div className="group bg-gradient-to-br from-emerald-50 to-teal-50 p-8 rounded-xl border border-emerald-100 hover:shadow-lg transition-all duration-300">
                <div className="w-20 h-20 bg-gradient-to-r from-emerald-600 to-teal-700 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <span className="text-3xl text-white">📄</span>
                </div>
                <p className="font-bold text-slate-800 mb-3 text-lg">Download PDF</p>
                <p className="text-gray-600 font-medium">Get professional formatted document</p>
              </div>
            </div>
          </div>

          {/* Enhanced Form */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-10 shadow-xl border border-white/20 mb-10">
            <h2 className="text-3xl font-black bg-gradient-to-r from-slate-800 to-purple-700 bg-clip-text text-transparent mb-8">Policy Details</h2>
            
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div>
                <label className="block text-slate-800 font-bold mb-3 text-lg">Company Name</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl text-slate-800 placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-300 shadow-sm hover:shadow-md"
                  placeholder="Enter your company name"
                />
              </div>

              <div>
                <label className="block text-slate-800 font-bold mb-3 text-lg">Industry</label>
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl text-slate-800 focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  <option value="">Select Industry</option>
                  {industries.map(ind => (
                    <option key={ind} value={ind}>{ind}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-800 font-bold mb-3 text-lg">Policy Type</label>
                <select
                  value={policyType}
                  onChange={(e) => setPolicyType(e.target.value)}
                  className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl text-slate-800 focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  <option value="">Select Policy Type</option>
                  {policyTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Enhanced Frameworks and Compliances Selection */}
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              {/* Enhanced Frameworks Section */}
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-8 border border-purple-100 shadow-lg">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold bg-gradient-to-r from-purple-700 to-indigo-700 bg-clip-text text-transparent flex items-center">
                    🏗️ Frameworks
                    <span className="text-sm font-normal text-gray-500 ml-2">(Optional)</span>
                  </h3>
                  {selectedFrameworks.length > 0 && (
                    <button
                      onClick={clearAllFrameworks}
                      className="text-xs text-red-500 hover:text-red-700 underline font-medium"
                    >
                      Clear All
                    </button>
                  )}
                </div>
                <p className="text-gray-600 text-sm mb-6 font-medium">Select frameworks to align your policy with:</p>
                
                {/* Quick Selection Buttons */}
                <div className="flex flex-wrap gap-2 mb-6">
                  <button
                    onClick={() => {
                      const securityFrameworks = ['iso27001', 'nist'];
                      setSelectedFrameworks(prev => {
                        const newSelection = [...new Set([...prev, ...securityFrameworks])];
                        return newSelection;
                      });
                    }}
                    className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium hover:bg-purple-200 transition-colors"
                  >
                    + Security Pack
                  </button>
                  <button
                    onClick={() => {
                      const governanceFrameworks = ['cobit', 'sox', 'coso'];
                      setSelectedFrameworks(prev => {
                        const newSelection = [...new Set([...prev, ...governanceFrameworks])];
                        return newSelection;
                      });
                    }}
                    className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium hover:bg-indigo-200 transition-colors"
                  >
                    + Governance Pack
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-3 max-h-64 overflow-y-auto">
                  {frameworks.map(framework => (
                    <div 
                      key={framework.id} 
                      className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                        selectedFrameworks.includes(framework.id)
                          ? `border-${framework.color}-300 bg-${framework.color}-50 shadow-md`
                          : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                      }`}
                      onClick={() => handleFrameworkChange(framework.id)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg ${
                          selectedFrameworks.includes(framework.id)
                            ? `bg-${framework.color}-200`
                            : 'bg-gray-100'
                        }`}>
                          {framework.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div className="font-bold text-slate-800">{framework.name}</div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              selectedFrameworks.includes(framework.id)
                                ? `bg-${framework.color}-200 text-${framework.color}-800`
                                : 'bg-gray-100 text-gray-600'
                            }`}>
                              {framework.category}
                            </span>
                          </div>
                          <div className="text-gray-600 text-sm mt-1">{framework.description}</div>
                        </div>
                        <input
                          type="checkbox"
                          checked={selectedFrameworks.includes(framework.id)}
                          onChange={() => handleFrameworkChange(framework.id)}
                          className={`w-5 h-5 rounded focus:ring-2 focus:ring-${framework.color}-500`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                
                {selectedFrameworks.length > 0 && (
                  <div className="mt-6 p-4 bg-purple-100 border border-purple-200 rounded-lg">
                    <div className="text-purple-700 text-sm font-bold mb-2">
                      Selected Frameworks ({selectedFrameworks.length}):
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {selectedFrameworks.map(id => {
                        const framework = frameworks.find(f => f.id === id);
                        return framework ? (
                          <span key={id} className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-${framework.color}-100 text-${framework.color}-800`}>
                            <span className="mr-1">{framework.icon}</span>
                            {framework.name}
                          </span>
                        ) : null;
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Enhanced Compliances Section */}
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-8 border border-emerald-100 shadow-lg">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold bg-gradient-to-r from-emerald-700 to-teal-700 bg-clip-text text-transparent flex items-center">
                    📋 Compliance Standards
                    <span className="text-sm font-normal text-gray-500 ml-2">(Optional)</span>
                  </h3>
                  {selectedCompliances.length > 0 && (
                    <button
                      onClick={clearAllCompliances}
                      className="text-xs text-red-500 hover:text-red-700 underline font-medium"
                    >
                      Clear All
                    </button>
                  )}
                </div>
                <p className="text-gray-600 text-sm mb-6 font-medium">Select compliance standards to include:</p>
                
                {/* Quick Selection Buttons */}
                <div className="flex flex-wrap gap-2 mb-6">
                  <button
                    onClick={() => {
                      const privacyCompliances = ['gdpr', 'ccpa', 'coppa'];
                      setSelectedCompliances(prev => {
                        const newSelection = [...new Set([...prev, ...privacyCompliances])];
                        return newSelection;
                      });
                    }}
                    className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium hover:bg-emerald-200 transition-colors"
                  >
                    + Privacy Pack
                  </button>
                  <button
                    onClick={() => {
                      const financialCompliances = ['pci-dss', 'glba'];
                      setSelectedCompliances(prev => {
                        const newSelection = [...new Set([...prev, ...financialCompliances])];
                        return newSelection;
                      });
                    }}
                    className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-xs font-medium hover:bg-teal-200 transition-colors"
                  >
                    + Financial Pack
                  </button>
                  <button
                    onClick={() => {
                      const sectorCompliances = ['hipaa', 'ferpa', 'fisma'];
                      setSelectedCompliances(prev => {
                        const newSelection = [...new Set([...prev, ...sectorCompliances])];
                        return newSelection;
                      });
                    }}
                    className="px-3 py-1 bg-cyan-100 text-cyan-700 rounded-full text-xs font-medium hover:bg-cyan-200 transition-colors"
                  >
                    + Sector Pack
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-3 max-h-64 overflow-y-auto">
                  {compliances.map(compliance => (
                    <div 
                      key={compliance.id} 
                      className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                        selectedCompliances.includes(compliance.id)
                          ? `border-${compliance.color}-300 bg-${compliance.color}-50 shadow-md`
                          : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                      }`}
                      onClick={() => handleComplianceChange(compliance.id)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg ${
                          selectedCompliances.includes(compliance.id)
                            ? `bg-${compliance.color}-200`
                            : 'bg-gray-100'
                        }`}>
                          {compliance.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div className="font-bold text-slate-800">{compliance.name}</div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              selectedCompliances.includes(compliance.id)
                                ? `bg-${compliance.color}-200 text-${compliance.color}-800`
                                : 'bg-gray-100 text-gray-600'
                            }`}>
                              {compliance.category}
                            </span>
                          </div>
                          <div className="text-gray-600 text-sm mt-1">{compliance.description}</div>
                        </div>
                        <input
                          type="checkbox"
                          checked={selectedCompliances.includes(compliance.id)}
                          onChange={() => handleComplianceChange(compliance.id)}
                          className={`w-5 h-5 rounded focus:ring-2 focus:ring-${compliance.color}-500`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                
                {selectedCompliances.length > 0 && (
                  <div className="mt-6 p-4 bg-emerald-100 border border-emerald-200 rounded-lg">
                    <div className="text-emerald-700 text-sm font-bold mb-2">
                      Selected Standards ({selectedCompliances.length}):
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {selectedCompliances.map(id => {
                        const compliance = compliances.find(c => c.id === id);
                        return compliance ? (
                          <span key={id} className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-${compliance.color}-100 text-${compliance.color}-800`}>
                            <span className="mr-1">{compliance.icon}</span>
                            {compliance.name}
                          </span>
                        ) : null;
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={handleGeneratePolicy}
                disabled={generating || !companyName || !industry || !policyType}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-12 py-4 rounded-xl font-bold text-lg shadow-xl hover:from-purple-700 hover:to-pink-700 hover:shadow-2xl hover:transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {generating ? (
                  <span className="flex items-center space-x-2">
                    <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                    <span>Generating...</span>
                  </span>
                ) : (
                  <span className="flex items-center space-x-2">
                    <span>🚀</span>
                    <span>Generate Policy</span>
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Enhanced Progress */}
          {progress && (
            <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl shadow-lg">
              <p className="text-blue-700 text-center font-bold text-lg">{progress}</p>
            </div>
          )}

          {/* Enhanced Error */}
          {error && (
            <div className="mb-8 p-6 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl shadow-lg">
              <p className="text-red-600 text-center font-bold text-lg">{error}</p>
            </div>
          )}

          {/* Enhanced Results */}
          {generatedPolicy && (
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-10 shadow-xl border border-white/20">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-3xl font-black bg-gradient-to-r from-slate-800 to-purple-700 bg-clip-text text-transparent">Generated Policy Preview</h3>
                  <p className="text-gray-600 mt-1 font-medium">Professional policy ready for download</p>
                </div>
                <div className="flex items-center gap-6">
                  <div className="bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 px-6 py-3 rounded-xl text-sm font-bold border border-emerald-200 shadow-sm">
                    📄 PDF Ready
                  </div>
                  <button
                    onClick={handleDownloadPDF}
                    className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-8 py-3 rounded-xl font-bold hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    <span className="flex items-center space-x-2">
                      <span>📄</span>
                      <span>Download PDF</span>
                    </span>
                  </button>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl p-8 max-h-96 overflow-y-auto border border-gray-200 shadow-inner">
                <pre className="text-slate-800 whitespace-pre-wrap font-mono text-sm leading-relaxed">
                  {generatedPolicy}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PolicyGenerator;
