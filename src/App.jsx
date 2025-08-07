import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ToastContainer } from 'react-toastify';
import LandingPage from './components/LandingPage';
import PolicyAnalyzer from './components/PolicyAnalyzer';
import PolicyGenerator from './components/PolicyGenerator';
import KnowCompliances from './components/KnowCompliances';
import ChatButton from './components/ChatButton';
import ChatExpert from './components/ChatExpert';
import LoginPage from './components/LoginPage';
import UserProfile from './components/UserProfile';
import AnalysisHistory from './components/AnalysisHistory';
import AnalysisResults from './components/AnalysisResults';
import PricingPage from './components/PricingPage';
import NavigationHeader from './components/NavigationHeader';
import ProtectedRoute from './components/ProtectedRoute';

function AppContent() {
  const [uploadedDocument, setUploadedDocument] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);
  const { user, loading } = useAuth();

  const handleDocumentUpload = (document) => {
    setUploadedDocument(document);
  };

  const handleViewAnalysis = (analysis) => {
    setSelectedAnalysis(analysis);
  };

  return (
    <div className="App bg-white min-h-screen">
      {/* Navigation Header */}
      <NavigationHeader />
      
      {/* Main Content with Routes */}
      <main>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/home" element={<LandingPage />} />
          <Route path="/login" element={
            user ? <Navigate to="/profile" replace /> : <LoginPage />
          } />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/compliances" element={<KnowCompliances />} />
          
          {/* Protected Routes */}
          <Route path="/profile" element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          } />
          <Route path="/analyzer" element={
            <ProtectedRoute>
              <PolicyAnalyzer onDocumentUpload={handleDocumentUpload} />
            </ProtectedRoute>
          } />
          <Route path="/generator" element={
            <ProtectedRoute>
              <PolicyGenerator />
            </ProtectedRoute>
          } />
          <Route path="/history" element={
            <ProtectedRoute>
              <AnalysisHistory onViewAnalysis={handleViewAnalysis} />
            </ProtectedRoute>
          } />
          <Route path="/analysis/:id" element={
            <ProtectedRoute>
              <AnalysisResults 
                analysis={selectedAnalysis?.analysis_results} 
                isHistoryView={true}
                documentName={selectedAnalysis?.document_name}
                analysisDate={selectedAnalysis?.created_at}
              />
            </ProtectedRoute>
          } />
          
          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      
      {/* Chat Button - only show when document is uploaded */}
      <ChatButton 
        hasDocument={!!uploadedDocument}
        onClick={() => setIsChatOpen(true)}
      />
      
      {/* Chat Expert Modal */}
      <ChatExpert
        policyDocument={uploadedDocument}
        isOpen={isChatOpen}
        onToggle={() => setIsChatOpen(!isChatOpen)}
        onClose={() => setIsChatOpen(false)}
      />
      
      {/* Toast Notifications */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
