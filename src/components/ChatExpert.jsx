import { useState, useRef, useEffect } from 'react';
import { analyzeWithGemini } from '../lib/gemini';

function ChatExpert({ policyDocument, isOpen, onToggle, onClose }) {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Initialize welcome message based on document context
  useEffect(() => {
    if (policyDocument && messages.length === 0) {
      const welcomeMessage = {
        type: 'assistant',
        content: `👋 Hello! I'm your AI Policy Expert. I can see you've uploaded "${policyDocument.fileName}" for analysis.\n\n🎯 **I can help you with:**\n• Compliance gap analysis\n• Regulatory framework guidance\n• Best practice recommendations\n• Implementation strategies\n\n💡 **Try asking me:**\n• "What are the main compliance risks in my document?"\n• "How can I improve GDPR compliance?"\n• "What security controls should I implement?"\n\nHow can I assist you today?`,
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    } else if (!policyDocument && messages.length === 0) {
      const genericWelcome = {
        type: 'assistant',
        content: '👋 Hello! I\'m your AI Policy Expert. Please upload a policy document first using the Policy Analyzer, and then I can provide specific guidance based on your document. I\'m here to help with compliance questions and best practices!',
        timestamp: new Date()
      };
      setMessages([genericWelcome]);
    }
  }, [policyDocument, messages.length]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      type: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Create context for the AI based on available document
      const context = policyDocument ? 
        `User has uploaded a policy document: "${policyDocument.fileName}". Content: ${policyDocument.content?.substring(0, 2000) || 'Document content not available'}...` :
        'User has not uploaded any policy document yet.';

      const prompt = `You are a compliance and policy expert assistant. ${context}\n\nUser question: ${userMessage.content}\n\nProvide helpful, accurate advice about compliance, regulations, and policy best practices. Keep responses clear and actionable.`;

      const response = await analyzeWithGemini(prompt);
      
      const assistantMessage = {
        type: 'assistant',
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        type: 'assistant',
        content: '❌ I apologize, but I encountered an error while processing your request. Please try again or contact support if the issue persists.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatMessage = (content) => {
    // Simple markdown-like formatting
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br/>');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-osmo shadow-osmo w-full max-w-4xl h-5/6 flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-osmo-blue to-osmo-purple p-6 rounded-t-osmo">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                <span className="text-2xl">🤖</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">AI Policy Expert</h2>
                <p className="text-white opacity-90">
                  {policyDocument ? `Analyzing: ${policyDocument.fileName}` : 'Ready to help with compliance questions'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center text-white hover:bg-opacity-30 transition-all"
            >
              <span className="text-xl">×</span>
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-3xl rounded-osmo p-4 ${
                  message.type === 'user'
                    ? 'bg-osmo-blue text-white'
                    : 'bg-gray-50 text-gray-800 border'
                }`}
              >
                {message.type === 'assistant' && (
                  <div className="flex items-center mb-2">
                    <div className="w-6 h-6 bg-osmo-purple rounded-full flex items-center justify-center mr-2">
                      <span className="text-white text-xs">AI</span>
                    </div>
                    <span className="text-sm font-semibold text-osmo-purple">Policy Expert</span>
                  </div>
                )}
                <div
                  className={`whitespace-pre-wrap ${message.type === 'assistant' ? 'text-gray-700' : ''}`}
                  dangerouslySetInnerHTML={{
                    __html: formatMessage(message.content)
                  }}
                />
                <div className={`text-xs mt-2 opacity-70 ${message.type === 'user' ? 'text-white' : 'text-gray-500'}`}>
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-3xl rounded-osmo p-4 bg-gray-50 border">
                <div className="flex items-center mb-2">
                  <div className="w-6 h-6 bg-osmo-purple rounded-full flex items-center justify-center mr-2">
                    <span className="text-white text-xs">AI</span>
                  </div>
                  <span className="text-sm font-semibold text-osmo-purple">Policy Expert</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-osmo-blue rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-osmo-blue rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-osmo-blue rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                  <span className="text-gray-500">Thinking...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex space-x-4">
            <div className="flex-1">
              <textarea
                ref={inputRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me about compliance, regulations, or policy best practices..."
                className="w-full p-4 border border-gray-300 rounded-osmo resize-none focus:outline-none focus:ring-2 focus:ring-osmo-blue focus:border-transparent"
                rows="3"
                disabled={isLoading}
              />
            </div>
            <div className="flex flex-col space-y-2">
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="bg-osmo-blue hover:bg-blue-600 disabled:bg-gray-300 text-white px-6 py-4 rounded-osmo font-semibold transition-colors duration-200 flex items-center justify-center"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                ) : (
                  <>
                    <span className="mr-2">💬</span>
                    Send
                  </>
                )}
              </button>
              <button
                onClick={() => setMessages([])}
                className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-2 rounded-osmo text-sm transition-colors duration-200"
                title="Clear conversation"
              >
                🗑️
              </button>
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className="flex flex-wrap gap-2 mt-4">
            <button
              onClick={() => setInputMessage('What are the main compliance gaps in my document?')}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-full text-sm transition-colors"
            >
              🔍 Analyze gaps
            </button>
            <button
              onClick={() => setInputMessage('What GDPR requirements should I focus on?')}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-full text-sm transition-colors"
            >
              🛡️ GDPR guidance
            </button>
            <button
              onClick={() => setInputMessage('How can I improve my security posture?')}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-full text-sm transition-colors"
            >
              🔐 Security tips
            </button>
            <button
              onClick={() => setInputMessage('What are industry best practices for my sector?')}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-full text-sm transition-colors"
            >
              ⭐ Best practices
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatExpert;
