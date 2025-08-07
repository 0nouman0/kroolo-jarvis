import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function LandingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      {/* Enhanced Animated Background Elements */}
      <div className="absolute inset-0 z-0">
        {/* Floating shapes with better animations */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-purple-300/40 to-pink-300/40 rounded-3xl opacity-60 animate-pulse shadow-2xl"></div>
        <div className="absolute top-60 right-20 w-24 h-24 bg-gradient-to-br from-cyan-300/40 to-blue-300/40 rounded-full opacity-50 animate-bounce shadow-xl"></div>
        <div className="absolute bottom-40 left-1/3 w-40 h-20 bg-gradient-to-r from-yellow-300/30 to-green-300/30 rounded-3xl opacity-40 animate-pulse shadow-lg"></div>
        <div className="absolute bottom-20 right-1/4 w-28 h-28 bg-gradient-to-br from-indigo-300/40 to-purple-300/40 rounded-full opacity-30 animate-bounce delay-1000 shadow-xl"></div>
        <div className="absolute top-1/3 left-1/2 w-16 h-16 bg-gradient-to-br from-rose-300/30 to-orange-300/30 rounded-full opacity-25 animate-pulse delay-500 shadow-lg"></div>
        
        {/* Gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-white/10 via-transparent to-purple-100/20"></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-20 max-w-7xl">
        {/* Enhanced Hero Section with improved typography */}
        <div className="text-center mb-24">
          <div className="mb-8">
            <h1 className="text-7xl md:text-9xl font-black mb-6 leading-none">
              <span className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-700 bg-clip-text text-transparent drop-shadow-sm">Poli</span>
              <span className="text-slate-800 drop-shadow-sm">gap</span>
            </h1>
            <div className="flex justify-center mb-6">
              <div className="h-1 w-24 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"></div>
            </div>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-700 via-indigo-700 to-purple-700 bg-clip-text text-transparent mb-8 leading-tight">
            Policy Analysis and Compliance Management Tool
          </h2>
          
          <p className="text-xl md:text-2xl text-gray-600 max-w-5xl mx-auto leading-relaxed mb-12 font-medium">
            Analyze policy documents, generate compliance reports, and manage regulatory requirements 
            for <span className="font-bold text-purple-700">GDPR, HIPAA, SOX, PCI DSS</span> and other 
            <span className="font-bold text-indigo-700"> regulatory frameworks</span>.
          </p>
          
          {/* Enhanced CTA Buttons with better styling */}
          <div className="flex flex-col sm:flex-row justify-center gap-6 mb-16">
            {user ? (
              <>
                <button
                  onClick={() => navigate('/analyzer')}
                  className="group relative bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white px-12 py-5 rounded-2xl font-bold text-xl shadow-2xl hover:shadow-purple-500/25 transform hover:-translate-y-2 transition-all duration-500 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-700 via-indigo-700 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative flex items-center justify-center space-x-3">
                    <span className="text-2xl">🚀</span>
                    <span>Start Analysis</span>
                  </span>
                </button>
                <button
                  onClick={() => navigate('/generator')}
                  className="group relative bg-white/90 backdrop-blur-sm text-slate-800 border-2 border-purple-200 px-12 py-5 rounded-2xl font-bold text-xl shadow-xl hover:shadow-purple-200/50 hover:border-purple-400 hover:bg-white transition-all duration-500 transform hover:-translate-y-2"
                >
                  <span className="flex items-center justify-center space-x-3">
                    <span className="text-2xl">✨</span>
                    <span>Generate Policy</span>
                  </span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate('/login')}
                  className="group relative bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white px-12 py-5 rounded-2xl font-bold text-xl shadow-2xl hover:shadow-purple-500/25 transform hover:-translate-y-2 transition-all duration-500 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-700 via-indigo-700 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative flex items-center justify-center space-x-3">
                    <span className="text-2xl">✨</span>
                    <span>Get Started Free</span>
                  </span>
                </button>
                <button
                  onClick={() => navigate('/pricing')}
                  className="group relative bg-gradient-to-r from-rose-500 to-pink-600 text-white px-12 py-5 rounded-2xl font-bold text-xl shadow-2xl hover:shadow-rose-500/25 transform hover:-translate-y-2 transition-all duration-500"
                >
                  <span className="flex items-center justify-center space-x-3">
                    <span className="text-2xl">💎</span>
                    <span>View Pricing</span>
                  </span>
                </button>
                <button
                  onClick={() => navigate('/compliances')}
                  className="group relative bg-white/90 backdrop-blur-sm text-slate-800 border-2 border-purple-200 px-12 py-5 rounded-2xl font-bold text-xl shadow-xl hover:shadow-purple-200/50 hover:border-purple-400 hover:bg-white transition-all duration-500 transform hover:-translate-y-2"
                >
                  <span className="flex items-center justify-center space-x-3">
                    <span className="text-2xl">📚</span>
                    <span>Learn More</span>
                  </span>
                </button>
              </>
            )}
          </div>

          {/* Trust indicators */}
          <div className="text-sm text-gray-500 space-x-6">
            <span className="inline-flex items-center space-x-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span>No credit card required</span>
            </span>
            <span className="inline-flex items-center space-x-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
              <span>Free forever plan</span>
            </span>
            <span className="inline-flex items-center space-x-2">
              <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span>
              <span>Setup in 30 seconds</span>
            </span>
          </div>
        </div>

        {/* Enhanced Feature Grid with better animations and styling */}
        <div className="mb-20">
          <h3 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-slate-800 via-indigo-700 to-purple-700 bg-clip-text text-transparent mb-4 text-center">
            Core Features
          </h3>
          <p className="text-xl text-gray-600 text-center mb-16 max-w-3xl mx-auto font-medium">
            Tools to help you analyze policies, generate documents, and manage compliance requirements
          </p>
          
          <div className="grid grid-cols-1 gap-8 max-w-5xl mx-auto">
            
            {/* Policy Gap Analyzer */}
            <div 
              onClick={() => navigate('/analyzer')}
              className="group cursor-pointer transform hover:scale-[1.02] transition-all duration-700 hover:z-10 relative"
            >
              <div className="relative bg-white/80 backdrop-blur-lg rounded-3xl p-10 shadow-xl hover:shadow-2xl border border-white/20 transition-all duration-700 group-hover:border-purple-300/50 overflow-hidden">
                {/* Animated background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-50/0 via-indigo-50/0 to-blue-50/0 group-hover:from-purple-50/80 group-hover:via-indigo-50/40 group-hover:to-blue-50/20 transition-all duration-700"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center mb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center mr-6 shadow-xl group-hover:shadow-purple-500/25 transform group-hover:rotate-3 transition-all duration-500">
                      <span className="text-3xl text-white">🔍</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-2xl font-black bg-gradient-to-r from-slate-800 to-indigo-700 bg-clip-text text-transparent mb-2">Gap Analyzer</h4>
                      <div className="w-12 h-1 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"></div>
                    </div>
                  </div>
                  <p className="text-gray-600 text-base mb-6 font-medium leading-relaxed text-left">
                    Upload policy documents to analyze compliance gaps against regulatory frameworks 
                    like <span className="font-bold text-purple-700">GDPR, HIPAA, SOX</span>, and others.
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="bg-gradient-to-r from-purple-600 to-indigo-700 bg-clip-text text-transparent font-bold text-lg group-hover:from-purple-700 group-hover:to-indigo-800 transition-all duration-300">
                      Analyze now →
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate('/history');
                      }}
                      className="text-sm text-gray-500 hover:text-purple-600 transition-colors font-medium bg-gray-100/80 hover:bg-purple-50 px-3 py-2 rounded-lg backdrop-blur-sm"
                    >
                      View History
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Policy Generator */}
            <div 
              onClick={() => navigate('/generator')}
              className="group cursor-pointer transform hover:scale-[1.02] transition-all duration-700 hover:z-10 relative"
            >
              <div className="relative bg-white/80 backdrop-blur-lg rounded-3xl p-10 shadow-xl hover:shadow-2xl border border-white/20 transition-all duration-700 group-hover:border-blue-300/50 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 via-cyan-50/0 to-indigo-50/0 group-hover:from-blue-50/80 group-hover:via-cyan-50/40 group-hover:to-indigo-50/20 transition-all duration-700"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center mb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center mr-6 shadow-xl group-hover:shadow-blue-500/25 transform group-hover:rotate-3 transition-all duration-500">
                      <span className="text-3xl text-white">⚡</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-2xl font-black bg-gradient-to-r from-slate-800 to-indigo-700 bg-clip-text text-transparent mb-2">Policy Generator</h4>
                      <div className="w-12 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"></div>
                    </div>
                  </div>
                  <p className="text-gray-600 text-base mb-6 font-medium leading-relaxed text-left">
                    Generate compliant policy templates instantly using AI. Choose your 
                    <span className="font-bold text-blue-700"> industry and regulations</span> for custom policies.
                  </p>
                  <div className="bg-gradient-to-r from-blue-600 to-cyan-700 bg-clip-text text-transparent font-bold text-lg group-hover:from-blue-700 group-hover:to-cyan-800 transition-all duration-300">
                    Create now →
                  </div>
                </div>
              </div>
            </div>

            {/* Know Compliances */}
            <div 
              onClick={() => navigate('/compliances')}
              className="group cursor-pointer transform hover:scale-[1.02] transition-all duration-700 hover:z-10 relative"
            >
              <div className="relative bg-white/80 backdrop-blur-lg rounded-3xl p-10 shadow-xl hover:shadow-2xl border border-white/20 transition-all duration-700 group-hover:border-emerald-300/50 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/0 via-teal-50/0 to-green-50/0 group-hover:from-emerald-50/80 group-hover:via-teal-50/40 group-hover:to-green-50/20 transition-all duration-700"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center mb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mr-6 shadow-xl group-hover:shadow-emerald-500/25 transform group-hover:rotate-3 transition-all duration-500">
                      <span className="text-3xl text-white">📚</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-2xl font-black bg-gradient-to-r from-slate-800 to-indigo-700 bg-clip-text text-transparent mb-2">Know Compliances</h4>
                      <div className="w-12 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"></div>
                    </div>
                  </div>
                  <p className="text-gray-600 text-base mb-6 font-medium leading-relaxed text-left">
                    Browse comprehensive information about regulatory frameworks and compliance requirements across industries.
                  </p>
                  <div className="bg-gradient-to-r from-emerald-600 to-teal-700 bg-clip-text text-transparent font-bold text-lg group-hover:from-emerald-700 group-hover:to-teal-800 transition-all duration-300">
                    Learn now →
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced What Sets Us Apart */}
        <div className="relative bg-white/80 backdrop-blur-lg rounded-3xl p-12 shadow-2xl border border-white/30 mb-20 overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-yellow-100/60 to-transparent rounded-full opacity-50"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-purple-100/60 to-transparent rounded-full opacity-40"></div>
          
          <div className="relative z-10">
            <h3 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-slate-800 via-indigo-700 to-purple-700 bg-clip-text text-transparent mb-4 text-center">
              Application Features
            </h3>
            <p className="text-xl text-gray-600 text-center mb-16 max-w-3xl mx-auto font-medium">
              Tools and utilities to help with compliance management
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
              <div className="text-center group cursor-pointer transform hover:scale-105 transition-all duration-500 h-full">
                <div className="w-24 h-24 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:shadow-yellow-500/25 group-hover:rotate-3 transition-all duration-500">
                  <span className="text-4xl">📊</span>
                </div>
                <h4 className="text-2xl font-black text-slate-800 mb-4 group-hover:text-orange-600 transition-colors min-h-[64px] flex items-center justify-center">Compliance Scoring</h4>
                <p className="text-gray-600 font-medium leading-relaxed min-h-[96px] flex items-center justify-center">
                  Numerical scores to evaluate compliance levels across regulatory frameworks.
                </p>
              </div>
              
              <div className="text-center group cursor-pointer transform hover:scale-105 transition-all duration-500 h-full">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:shadow-purple-500/25 group-hover:rotate-3 transition-all duration-500">
                  <span className="text-4xl">🎨</span>
                </div>
                <h4 className="text-2xl font-black text-slate-800 mb-4 group-hover:text-purple-600 transition-colors min-h-[64px] flex items-center justify-center">User Interface</h4>
                <p className="text-gray-600 font-medium leading-relaxed min-h-[96px] flex items-center justify-center">
                  Clean interface designed to make compliance management accessible.
                </p>
              </div>
              
              <div className="text-center group cursor-pointer transform hover:scale-105 transition-all duration-500 h-full">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:shadow-blue-500/25 group-hover:rotate-3 transition-all duration-500">
                  <span className="text-4xl">📄</span>
                </div>
                <h4 className="text-2xl font-black text-slate-800 mb-4 group-hover:text-blue-600 transition-colors min-h-[64px] flex items-center justify-center">Document Generation</h4>
                <p className="text-gray-600 font-medium leading-relaxed min-h-[96px] flex items-center justify-center">
                  Generate policy documents and compliance reports in PDF format.
                </p>
              </div>
              
              <div className="text-center group cursor-pointer transform hover:scale-105 transition-all duration-500 h-full">
                <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:shadow-emerald-500/25 group-hover:rotate-3 transition-all duration-500">
                  <span className="text-4xl">🎓</span>
                </div>
                <h4 className="text-2xl font-black text-slate-800 mb-4 group-hover:text-emerald-600 transition-colors min-h-[64px] flex items-center justify-center">Analysis & Reference</h4>
                <p className="text-gray-600 font-medium leading-relaxed min-h-[96px] flex items-center justify-center">
                  Policy analysis tools and regulatory framework reference materials.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Final Enhanced CTA Section */}
        <div className="relative">
          {/* Multi-layer background */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 rounded-3xl"></div>
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 via-purple-600/30 to-pink-600/20 rounded-3xl"></div>
          <div className="absolute inset-0 opacity-10">
            <div className="w-full h-full" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Cpath d='m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: '60px 60px'
            }}></div>
          </div>
          
          {/* Animated floating elements */}
          <div className="absolute top-12 left-12 w-32 h-32 bg-purple-400/10 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute bottom-12 right-12 w-24 h-24 bg-indigo-400/10 rounded-full blur-xl animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-blue-400/10 rounded-full blur-lg animate-pulse" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-1/4 right-1/4 w-20 h-20 bg-pink-400/10 rounded-full blur-lg animate-pulse" style={{animationDelay: '3s'}}></div>
          
          <div className="relative z-10 text-center py-20 px-8">
            <h3 className="text-4xl md:text-6xl lg:text-7xl font-black bg-gradient-to-r from-white via-purple-200 to-indigo-200 bg-clip-text text-transparent mb-6 leading-tight">
              Ready to start policy analysis?
            </h3>
            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto font-medium leading-relaxed">
              Use our policy analysis and compliance management tools to 
              <span className="text-purple-300 font-bold"> streamline compliance tasks</span> with 
              <span className="text-indigo-300 font-bold"> automated analysis</span>.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16">
              <button
                onClick={() => navigate('/analyzer')}
                className="group relative bg-gradient-to-r from-white via-purple-50 to-indigo-50 hover:from-purple-50 hover:via-white hover:to-purple-50 text-slate-800 font-black text-xl px-12 py-5 rounded-2xl shadow-2xl hover:shadow-white/25 transition-all duration-500 transform hover:scale-110 hover:-translate-y-2 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/10 to-purple-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                <span className="relative flex items-center">
                  Start free analysis
                  <span className="ml-3 text-2xl group-hover:translate-x-1 transition-transform duration-300">🚀</span>
                </span>
              </button>
              
              <button
                onClick={() => navigate('/compliances')}
                className="bg-white/10 hover:bg-white/20 backdrop-blur-lg text-white font-bold text-xl px-12 py-5 rounded-2xl border-2 border-white/30 hover:border-white/50 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-1"
              >
                Learn compliances
              </button>
            </div>
            
            {/* Application features */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto text-gray-400">
              <div className="flex flex-col items-center group cursor-pointer h-full">
                <div className="flex items-center mb-2 group-hover:text-purple-300 transition-colors min-h-[40px]">
                  <span className="text-3xl mr-2">🔒</span>
                  <span className="font-bold text-lg">Secure Access</span>
                </div>
                <span className="text-sm opacity-75">User Authentication</span>
              </div>
              
              <div className="flex flex-col items-center group cursor-pointer h-full">
                <div className="flex items-center mb-2 group-hover:text-indigo-300 transition-colors min-h-[40px]">
                  <span className="text-3xl mr-2">⚡</span>
                  <span className="font-bold text-lg">Quick Analysis</span>
                </div>
                <span className="text-sm opacity-75">AI-Powered Tools</span>
              </div>
              
              <div className="flex flex-col items-center group cursor-pointer h-full">
                <div className="flex items-center mb-2 group-hover:text-blue-300 transition-colors min-h-[40px]">
                  <span className="text-3xl mr-2">🎯</span>
                  <span className="font-bold text-lg">Policy Analysis</span>
                </div>
                <span className="text-sm opacity-75">Gap Identification</span>
              </div>
              
              <div className="flex flex-col items-center group cursor-pointer h-full">
                <div className="flex items-center mb-2 group-hover:text-emerald-300 transition-colors min-h-[40px]">
                  <span className="text-3xl mr-2">💎</span>
                  <span className="font-bold text-lg">Free to Use</span>
                </div>
                <span className="text-sm opacity-75">No Registration Required</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Enhanced Footer */}
      <footer className="relative bg-slate-900 text-white overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-purple-600/20 to-indigo-600/20 rounded-full blur-3xl"></div>
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-blue-600/20 to-cyan-600/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-64 h-64 bg-gradient-to-t from-pink-600/20 to-purple-600/20 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative z-10">
          {/* Main Footer Content */}
          <div className="container mx-auto px-6 py-16 max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
              
              {/* Company Info */}
              <div className="lg:col-span-1">
                <div className="mb-8">
                  <h3 className="text-4xl font-black mb-4">
                    <span className="bg-gradient-to-r from-purple-400 via-indigo-400 to-blue-400 bg-clip-text text-transparent">Poli</span>
                    <span className="text-white">gap</span>
                  </h3>
                  <p className="text-gray-300 leading-relaxed font-medium">
                    Advanced policy analysis and compliance management platform powered by AI. 
                    Simplifying regulatory compliance for organizations worldwide.
                  </p>
                </div>
                
                {/* Social Media Links */}
                <div className="flex items-center space-x-4 mb-8">
                  <a href="#" className="group w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-white/20 transition-all duration-300 transform hover:scale-110 hover:-translate-y-1">
                    <span className="text-xl group-hover:scale-110 transition-transform duration-300">📘</span>
                  </a>
                  <a href="#" className="group w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-white/20 transition-all duration-300 transform hover:scale-110 hover:-translate-y-1">
                    <span className="text-xl group-hover:scale-110 transition-transform duration-300">🐦</span>
                  </a>
                  <a href="#" className="group w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-white/20 transition-all duration-300 transform hover:scale-110 hover:-translate-y-1">
                    <span className="text-xl group-hover:scale-110 transition-transform duration-300">💼</span>
                  </a>
                  <a href="#" className="group w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-white/20 transition-all duration-300 transform hover:scale-110 hover:-translate-y-1">
                    <span className="text-xl group-hover:scale-110 transition-transform duration-300">📧</span>
                  </a>
                </div>
                
                {/* Contact Info */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-600/20 rounded-lg flex items-center justify-center">
                      <span className="text-purple-400">📧</span>
                    </div>
                    <span className="text-gray-300 font-medium">contact@poligap.com</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-600/20 rounded-lg flex items-center justify-center">
                      <span className="text-blue-400">🌐</span>
                    </div>
                    <span className="text-gray-300 font-medium">www.poligap.com</span>
                  </div>
                </div>
              </div>
              
              {/* Products & Services */}
              <div>
                <h4 className="text-xl font-black text-white mb-6 flex items-center">
                  <span className="w-2 h-6 bg-gradient-to-b from-purple-400 to-indigo-400 rounded-full mr-3"></span>
                  Products
                </h4>
                <ul className="space-y-4">
                  <li>
                    <button 
                      onClick={() => navigate('/analyzer')}
                      className="group text-gray-300 hover:text-white transition-colors duration-300 font-medium flex items-center space-x-2"
                    >
                      <span className="group-hover:translate-x-1 transition-transform duration-300">🔍</span>
                      <span>Policy Gap Analyzer</span>
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => navigate('/generator')}
                      className="group text-gray-300 hover:text-white transition-colors duration-300 font-medium flex items-center space-x-2"
                    >
                      <span className="group-hover:translate-x-1 transition-transform duration-300">⚡</span>
                      <span>Policy Generator</span>
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => navigate('/compliances')}
                      className="group text-gray-300 hover:text-white transition-colors duration-300 font-medium flex items-center space-x-2"
                    >
                      <span className="group-hover:translate-x-1 transition-transform duration-300">📚</span>
                      <span>Compliance Library</span>
                    </button>
                  </li>
                </ul>
              </div>
              
              {/* Resources */}
              <div>
                <h4 className="text-xl font-black text-white mb-6 flex items-center">
                  <span className="w-2 h-6 bg-gradient-to-b from-blue-400 to-cyan-400 rounded-full mr-3"></span>
                  Resources
                </h4>
                <ul className="space-y-4">
                  <li>
                    <a href="#" className="group text-gray-300 hover:text-white transition-colors duration-300 font-medium flex items-center space-x-2">
                      <span className="group-hover:translate-x-1 transition-transform duration-300">📖</span>
                      <span>Documentation</span>
                    </a>
                  </li>
                  <li>
                    <a href="#" className="group text-gray-300 hover:text-white transition-colors duration-300 font-medium flex items-center space-x-2">
                      <span className="group-hover:translate-x-1 transition-transform duration-300">🎓</span>
                      <span>Learning Center</span>
                    </a>
                  </li>
                  <li>
                    <a href="#" className="group text-gray-300 hover:text-white transition-colors duration-300 font-medium flex items-center space-x-2">
                      <span className="group-hover:translate-x-1 transition-transform duration-300">📝</span>
                      <span>Blog & Updates</span>
                    </a>
                  </li>
                  <li>
                    <a href="#" className="group text-gray-300 hover:text-white transition-colors duration-300 font-medium flex items-center space-x-2">
                      <span className="group-hover:translate-x-1 transition-transform duration-300">💬</span>
                      <span>Community Forum</span>
                    </a>
                  </li>
                  <li>
                    <a href="#" className="group text-gray-300 hover:text-white transition-colors duration-300 font-medium flex items-center space-x-2">
                      <span className="group-hover:translate-x-1 transition-transform duration-300">🆘</span>
                      <span>Help & Support</span>
                    </a>
                  </li>
                </ul>
              </div>
              
              {/* Company */}
              <div>
                <h4 className="text-xl font-black text-white mb-6 flex items-center">
                  <span className="w-2 h-6 bg-gradient-to-b from-emerald-400 to-teal-400 rounded-full mr-3"></span>
                  Company
                </h4>
                <ul className="space-y-4">
                  <li>
                    <a href="#" className="group text-gray-300 hover:text-white transition-colors duration-300 font-medium flex items-center space-x-2">
                      <span className="group-hover:translate-x-1 transition-transform duration-300">🏢</span>
                      <span>About Us</span>
                    </a>
                  </li>
                  <li>
                    <a href="#" className="group text-gray-300 hover:text-white transition-colors duration-300 font-medium flex items-center space-x-2">
                      <span className="group-hover:translate-x-1 transition-transform duration-300">💼</span>
                      <span>Careers</span>
                    </a>
                  </li>
                  <li>
                    <button 
                      onClick={() => navigate('/pricing')}
                      className="group text-gray-300 hover:text-white transition-colors duration-300 font-medium flex items-center space-x-2"
                    >
                      <span className="group-hover:translate-x-1 transition-transform duration-300">💎</span>
                      <span>Pricing</span>
                    </button>
                  </li>
                  <li>
                    <a href="#" className="group text-gray-300 hover:text-white transition-colors duration-300 font-medium flex items-center space-x-2">
                      <span className="group-hover:translate-x-1 transition-transform duration-300">📞</span>
                      <span>Contact</span>
                    </a>
                  </li>
                  <li>
                    <a href="#" className="group text-gray-300 hover:text-white transition-colors duration-300 font-medium flex items-center space-x-2">
                      <span className="group-hover:translate-x-1 transition-transform duration-300">🤝</span>
                      <span>Partners</span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
