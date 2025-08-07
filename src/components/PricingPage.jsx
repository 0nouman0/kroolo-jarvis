import { useState, useEffect } from 'react';
import { Check, X, Star, Shield, Zap, Users, Crown, Sparkles, Calculator, TrendingUp, DollarSign } from 'lucide-react';

function PricingPage({ onNavigate }) {
  const [billingPeriod, setBillingPeriod] = useState('monthly');
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [hoveredPlan, setHoveredPlan] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [showCalculator, setShowCalculator] = useState(false);
  const [calculatorInputs, setCalculatorInputs] = useState({
    employees: 10,
    documents: 50,
    complianceFrameworks: 3
  });
  const [animatedPrices, setAnimatedPrices] = useState({});
  const [showComparison, setShowComparison] = useState(false);
  const [calculatorResults, setCalculatorResults] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [openFAQ, setOpenFAQ] = useState(null);

  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      description: 'Perfect for small businesses getting started with compliance',
      icon: Shield,
      color: 'blue',
      monthly: 49,
      yearly: 490,
      yearlyDiscount: 20,
      recommendedFor: 'Small teams (1-5 people)',
      estimatedROI: '200%',
      setupTime: '1 day',
      features: [
        '5 Policy Analyses per month',
        'Basic compliance frameworks (GDPR, HIPAA)',
        'PDF document upload',
        'Standard gap analysis',
        'Email support',
        '30-day analysis history',
        'Basic reporting'
      ],
      limitations: [
        'No custom frameworks',
        'Limited integrations',
        'No priority support'
      ],
      popular: false,
      trending: false
    },
    {
      id: 'professional',
      name: 'Professional',
      description: 'Comprehensive solution for growing organizations',
      icon: Zap,
      color: 'purple',
      monthly: 149,
      yearly: 1490,
      yearlyDiscount: 25,
      recommendedFor: 'Growing companies (5-50 people)',
      estimatedROI: '400%',
      setupTime: '2-3 days',
      features: [
        '25 Policy Analyses per month',
        'All compliance frameworks',
        'Multiple file format support',
        'Advanced AI-powered analysis',
        'Priority email & chat support',
        '1-year analysis history',
        'Detailed compliance reports',
        'Team collaboration (up to 5 users)',
        'Custom framework creation',
        'API access',
        'Scheduled analysis'
      ],
      limitations: [
        'Limited white-label options'
      ],
      popular: true,
      trending: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      description: 'Scalable solution for large organizations',
      icon: Crown,
      color: 'gold',
      monthly: 399,
      yearly: 3990,
      yearlyDiscount: 30,
      recommendedFor: 'Large enterprises (50+ people)',
      estimatedROI: '600%',
      setupTime: '1 week',
      features: [
        'Unlimited Policy Analyses',
        'All frameworks + custom development',
        'Enterprise file processing',
        'Advanced AI with custom models',
        '24/7 dedicated support',
        'Unlimited analysis history',
        'White-label reporting',
        'Unlimited team members',
        'Advanced API & webhooks',
        'SSO integration',
        'Compliance dashboard',
        'Custom integrations',
        'Dedicated account manager',
        'On-premise deployment option'
      ],
      limitations: [],
      popular: false,
      trending: false
    }
  ];

  const faqData = [
    {
      id: 1,
      question: "Can I switch plans anytime?",
      answer: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate any billing differences."
    },
    {
      id: 2,
      question: "Do you offer a free trial?",
      answer: "Yes! All plans come with a 14-day free trial. No credit card required to get started."
    },
    {
      id: 3,
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, PayPal, and wire transfers for Enterprise plans."
    },
    {
      id: 4,
      question: "Is my data secure?",
      answer: "Absolutely. We use enterprise-grade security with end-to-end encryption and are SOC 2 Type II certified."
    }
  ];

  const toggleFAQ = (faqId) => {
    setOpenFAQ(openFAQ === faqId ? null : faqId);
  };

  // Price animation effect
  useEffect(() => {
    const timer = setTimeout(() => {
      const newPrices = {};
      plans.forEach(plan => {
        newPrices[plan.id] = getPrice(plan);
      });
      setAnimatedPrices(newPrices);
    }, 300);

    return () => clearTimeout(timer);
  }, [billingPeriod]);

  // Auto-step progression for demo
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep(prev => (prev + 1) % 4);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Real-time calculator updates
  useEffect(() => {
    setIsCalculating(true);
    const timer = setTimeout(() => {
      const results = calculateROI(calculatorInputs);
      setCalculatorResults(results);
      setIsCalculating(false);
    }, 300); // Small delay for smooth UX

    return () => clearTimeout(timer);
  }, [calculatorInputs, billingPeriod]);

  const getPrice = (plan) => {
    return billingPeriod === 'monthly' ? plan.monthly : plan.yearly;
  };

  const getSavings = (plan) => {
    const monthlyCost = plan.monthly * 12;
    const yearlyCost = plan.yearly;
    const savings = monthlyCost - yearlyCost;
    const percentage = Math.round((savings / monthlyCost) * 100);
    return { amount: savings, percentage };
  };

  const calculateROI = (inputs) => {
    // More realistic cost savings calculation
    const manualComplianceHours = inputs.employees * 40; // 40 hours per employee annually
    const documentProcessingCost = inputs.documents * 25; // $25 per document manually
    const frameworkImplementationCost = inputs.complianceFrameworks * 5000; // $5000 per framework
    const totalManualCost = (manualComplianceHours * 50) + documentProcessingCost + frameworkImplementationCost;
    
    const recommendedPlan = getRecommendedPlan(inputs);
    const plan = plans.find(p => p.id === recommendedPlan);
    const annualCost = billingPeriod === 'monthly' ? plan.monthly * 12 : plan.yearly;
    
    const netSavings = totalManualCost - annualCost;
    const roi = annualCost > 0 ? Math.round((netSavings / annualCost) * 100) : 0;
    
    return { 
      savings: Math.max(netSavings, 0), 
      roi: Math.max(roi, 0),
      manualCost: totalManualCost,
      planCost: annualCost,
      plan: plan
    };
  };

  const getRecommendedPlan = (inputs) => {
    const totalDocuments = inputs.documents;
    const teamSize = inputs.employees;
    const frameworks = inputs.complianceFrameworks;
    
    // Sophisticated recommendation logic
    if (teamSize <= 5 && totalDocuments <= 15 && frameworks <= 2) {
      return 'starter';
    } else if (teamSize <= 25 && totalDocuments <= 75 && frameworks <= 5) {
      return 'professional';
    } else {
      return 'enterprise';
    }
  };

  const handleGetStarted = (planId) => {
    setSelectedPlan(planId);
    // Add animation class
    setTimeout(() => {
      console.log(`Starting with ${planId} plan`);
      // Here you would typically navigate to a signup/checkout page
    }, 500);
  };

  const handleInputChange = (field, value) => {
    const numValue = parseInt(value) || 0;
    const validatedValue = Math.max(1, Math.min(numValue, 
      field === 'employees' ? 1000 : 
      field === 'documents' ? 1000 : 20
    ));
    
    setCalculatorInputs(prev => ({ 
      ...prev, 
      [field]: validatedValue 
    }));
  };

  const getInputFeedback = (field, value) => {
    if (field === 'employees') {
      if (value <= 3) return { 
        color: 'text-blue-600', 
        message: 'Perfect for startups - Starter plan ideal',
        progress: 25,
        recommendation: 'starter'
      };
      if (value <= 10) return { 
        color: 'text-green-600', 
        message: 'Small team - Starter plan recommended',
        progress: 40,
        recommendation: 'starter'
      };
      if (value <= 25) return { 
        color: 'text-purple-600', 
        message: 'Growing team - Professional plan recommended',
        progress: 65,
        recommendation: 'professional'
      };
      if (value <= 50) return { 
        color: 'text-orange-600', 
        message: 'Medium company - Professional or Enterprise',
        progress: 80,
        recommendation: 'professional'
      };
      return { 
        color: 'text-red-600', 
        message: 'Large enterprise - Enterprise plan recommended',
        progress: 100,
        recommendation: 'enterprise'
      };
    }
    
    if (field === 'documents') {
      if (value <= 10) return { 
        color: 'text-green-600', 
        message: 'Light usage - Perfect for getting started',
        progress: 20,
        efficiency: 'Low volume, high accuracy'
      };
      if (value <= 30) return { 
        color: 'text-blue-600', 
        message: 'Moderate usage - Good workflow',
        progress: 40,
        efficiency: 'Balanced processing'
      };
      if (value <= 75) return { 
        color: 'text-orange-600', 
        message: 'Heavy usage - Professional features needed',
        progress: 70,
        efficiency: 'High volume processing'
      };
      if (value <= 150) return { 
        color: 'text-red-600', 
        message: 'Enterprise level - Advanced features required',
        progress: 90,
        efficiency: 'Enterprise-scale processing'
      };
      return { 
        color: 'text-purple-600', 
        message: 'Maximum capacity - Full enterprise solution',
        progress: 100,
        efficiency: 'Ultra-high volume'
      };
    }
    
    if (field === 'complianceFrameworks') {
      if (value <= 2) return { 
        color: 'text-blue-600', 
        message: 'Basic compliance - Standard frameworks',
        progress: 30,
        complexity: 'Simple setup'
      };
      if (value <= 5) return { 
        color: 'text-purple-600', 
        message: 'Multi-framework - Professional features',
        progress: 60,
        complexity: 'Moderate complexity'
      };
      if (value <= 10) return { 
        color: 'text-orange-600', 
        message: 'Complex compliance - Enterprise needed',
        progress: 85,
        complexity: 'High complexity'
      };
      return { 
        color: 'text-red-600', 
        message: 'Maximum compliance - Full enterprise',
        progress: 100,
        complexity: 'Very complex'
      };
    }
    
    return { color: 'text-gray-600', message: '', progress: 0 };
  };

  const toggleBillingPeriod = () => {
    setBillingPeriod(prev => prev === 'monthly' ? 'yearly' : 'monthly');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50">
      {/* Enhanced Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 shadow-lg sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-6">
              <button
                onClick={() => onNavigate('home')}
                className="group bg-gradient-to-r from-slate-700 to-slate-800 text-white px-6 py-3 rounded-xl font-bold hover:from-slate-800 hover:to-slate-900 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <span className="flex items-center space-x-2">
                  <span className="group-hover:-translate-x-1 transition-transform duration-300">←</span>
                  <span>Back to Home</span>
                </span>
              </button>
              <div className="h-8 w-px bg-gradient-to-b from-purple-300 to-pink-300"></div>
              <h1 className="text-3xl font-black bg-gradient-to-r from-slate-800 via-purple-700 to-pink-700 bg-clip-text text-transparent">Pricing Plans</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Enhanced Hero Section */}
        <div className="text-center mb-20">
          <h2 className="text-6xl font-black bg-gradient-to-r from-slate-800 via-purple-700 to-pink-700 bg-clip-text text-transparent mb-6">
            Choose Your <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Compliance Journey</span>
          </h2>
          <p className="text-xl text-gray-600 mb-12 max-w-4xl mx-auto font-medium leading-relaxed">
            From startups to enterprises, we have the perfect plan to help you achieve compliance excellence with AI-powered policy analysis.
          </p>
          
          {/* Enhanced Billing Toggle */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20 inline-block mb-12">
            <div className="flex items-center justify-center space-x-6">
              <span className={`font-bold text-lg transition-all duration-300 ${billingPeriod === 'monthly' ? 'text-slate-800' : 'text-gray-500'}`}>
                Monthly
              </span>
              <button
                onClick={toggleBillingPeriod}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-purple-100 transform hover:scale-105 shadow-lg ${
                  billingPeriod === 'yearly' ? 'bg-gradient-to-r from-purple-600 to-pink-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform duration-300 shadow-lg ${
                    billingPeriod === 'yearly' ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className={`font-bold text-lg transition-all duration-300 ${billingPeriod === 'yearly' ? 'text-slate-800' : 'text-gray-500'}`}>
                Yearly
              </span>
              {billingPeriod === 'yearly' && (
                <div className="bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 px-4 py-2 rounded-xl text-sm font-bold border border-emerald-200 shadow-sm animate-pulse">
                  Save 20%! 🎉
                </div>
              )}
            </div>
          </div>

          {/* Enhanced Interactive Calculator Toggle */}
          <div className="flex justify-center mb-12">
            <button
              onClick={() => setShowCalculator(!showCalculator)}
              className="bg-gradient-to-r from-blue-100 to-cyan-100 hover:from-blue-200 hover:to-cyan-200 text-blue-700 px-8 py-4 rounded-xl font-bold transition-all duration-300 flex items-center space-x-3 transform hover:scale-105 shadow-lg hover:shadow-xl border border-blue-200"
            >
              <Calculator className="w-6 h-6" />
              <span>{showCalculator ? 'Hide' : 'Show'} Cost Calculator</span>
            </button>
          </div>

          {/* Enhanced Dynamic Cost Calculator */}
          {showCalculator && (
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-10 mb-12 max-w-5xl mx-auto transform transition-all duration-500 animate-in border border-white/20">
              <h3 className="text-3xl font-black bg-gradient-to-r from-slate-800 to-blue-700 bg-clip-text text-transparent mb-8 flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-green-500 mr-3" />
                Calculate Your Savings & Get Personalized Recommendations
              </h3>
              
              {/* Input Section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {/* Team Size Input */}
                <div className="bg-gray-50 p-4 rounded-lg transition-all duration-300 hover:bg-gray-100 border-l-4 border-blue-400">
                  <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center justify-between">
                    <span className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      Team Size
                    </span>
                    <span className="text-2xl font-bold text-blue-600">{calculatorInputs.employees}</span>
                  </label>
                  
                  {/* Range Slider */}
                  <div className="mb-3">
                    <input
                      type="range"
                      min="1"
                      max="100"
                      value={calculatorInputs.employees}
                      onChange={(e) => handleInputChange('employees', e.target.value)}
                      className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer slider"
                      style={{
                        background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(calculatorInputs.employees / 100) * 100}%, #e5e7eb ${(calculatorInputs.employees / 100) * 100}%, #e5e7eb 100%)`
                      }}
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>1</span>
                      <span>50</span>
                      <span>100+</span>
                    </div>
                  </div>
                  
                  {/* Number Input */}
                  <input
                    type="number"
                    value={calculatorInputs.employees}
                    onChange={(e) => handleInputChange('employees', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-center font-semibold"
                    min="1"
                    max="1000"
                    placeholder="Enter team size"
                  />
                  
                  <div className="mt-2 p-2 rounded-lg bg-blue-50">
                    <p className={`text-xs font-medium ${getInputFeedback('employees', calculatorInputs.employees).color}`}>
                      <span className="inline-block w-2 h-2 bg-current rounded-full mr-1"></span>
                      {getInputFeedback('employees', calculatorInputs.employees).message}
                    </p>
                  </div>
                </div>

                {/* Documents Input */}
                <div className="bg-gray-50 p-4 rounded-lg transition-all duration-300 hover:bg-gray-100 border-l-4 border-green-400">
                  <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center justify-between">
                    <span className="flex items-center">
                      <DollarSign className="w-4 h-4 mr-1" />
                      Documents/Month
                    </span>
                    <span className="text-2xl font-bold text-green-600">{calculatorInputs.documents}</span>
                  </label>
                  
                  {/* Range Slider */}
                  <div className="mb-3">
                    <input
                      type="range"
                      min="1"
                      max="200"
                      value={calculatorInputs.documents}
                      onChange={(e) => handleInputChange('documents', e.target.value)}
                      className="w-full h-2 bg-green-200 rounded-lg appearance-none cursor-pointer slider"
                      style={{
                        background: `linear-gradient(to right, #10b981 0%, #10b981 ${(calculatorInputs.documents / 200) * 100}%, #e5e7eb ${(calculatorInputs.documents / 200) * 100}%, #e5e7eb 100%)`
                      }}
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>1</span>
                      <span>100</span>
                      <span>200+</span>
                    </div>
                  </div>
                  
                  {/* Number Input */}
                  <input
                    type="number"
                    value={calculatorInputs.documents}
                    onChange={(e) => handleInputChange('documents', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-center font-semibold"
                    min="1"
                    max="1000"
                    placeholder="Enter documents count"
                  />
                  
                  <div className="mt-2 p-2 rounded-lg bg-green-50">
                    <p className={`text-xs font-medium ${getInputFeedback('documents', calculatorInputs.documents).color}`}>
                      <span className="inline-block w-2 h-2 bg-current rounded-full mr-1"></span>
                      {getInputFeedback('documents', calculatorInputs.documents).message}
                    </p>
                  </div>
                </div>

                {/* Frameworks Input */}
                <div className="bg-gray-50 p-4 rounded-lg transition-all duration-300 hover:bg-gray-100 border-l-4 border-purple-400">
                  <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center justify-between">
                    <span className="flex items-center">
                      <Shield className="w-4 h-4 mr-1" />
                      Compliance Frameworks
                    </span>
                    <span className="text-2xl font-bold text-purple-600">{calculatorInputs.complianceFrameworks}</span>
                  </label>
                  
                  {/* Range Slider */}
                  <div className="mb-3">
                    <input
                      type="range"
                      min="1"
                      max="15"
                      value={calculatorInputs.complianceFrameworks}
                      onChange={(e) => handleInputChange('complianceFrameworks', e.target.value)}
                      className="w-full h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer slider"
                      style={{
                        background: `linear-gradient(to right, #8b5cf6 0%, #8b5cf6 ${(calculatorInputs.complianceFrameworks / 15) * 100}%, #e5e7eb ${(calculatorInputs.complianceFrameworks / 15) * 100}%, #e5e7eb 100%)`
                      }}
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>1</span>
                      <span>7</span>
                      <span>15+</span>
                    </div>
                  </div>
                  
                  {/* Number Input */}
                  <input
                    type="number"
                    value={calculatorInputs.complianceFrameworks}
                    onChange={(e) => handleInputChange('complianceFrameworks', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-center font-semibold"
                    min="1"
                    max="20"
                    placeholder="Enter frameworks count"
                  />
                  
                  <div className="mt-2 p-2 rounded-lg bg-purple-50">
                    <p className={`text-xs font-medium ${getInputFeedback('complianceFrameworks', calculatorInputs.complianceFrameworks).color}`}>
                      <span className="inline-block w-2 h-2 bg-current rounded-full mr-1"></span>
                      {getInputFeedback('complianceFrameworks', calculatorInputs.complianceFrameworks).message}
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Preset Buttons */}
              <div className="mb-6 p-4 bg-gray-100 rounded-lg">
                <h4 className="text-sm font-semibold text-gray-700 mb-3 text-center">Quick Presets</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <button
                    onClick={() => setCalculatorInputs({ employees: 3, documents: 10, complianceFrameworks: 2 })}
                    className="p-3 bg-blue-100 hover:bg-blue-200 rounded-lg text-sm font-medium text-blue-800 transition-all duration-300 transform hover:scale-105"
                  >
                    🚀 Startup<br />
                    <span className="text-xs">3 people, 10 docs, 2 frameworks</span>
                  </button>
                  <button
                    onClick={() => setCalculatorInputs({ employees: 15, documents: 50, complianceFrameworks: 4 })}
                    className="p-3 bg-purple-100 hover:bg-purple-200 rounded-lg text-sm font-medium text-purple-800 transition-all duration-300 transform hover:scale-105"
                  >
                    📈 Growing<br />
                    <span className="text-xs">15 people, 50 docs, 4 frameworks</span>
                  </button>
                  <button
                    onClick={() => setCalculatorInputs({ employees: 50, documents: 150, complianceFrameworks: 8 })}
                    className="p-3 bg-yellow-100 hover:bg-yellow-200 rounded-lg text-sm font-medium text-yellow-800 transition-all duration-300 transform hover:scale-105"
                  >
                    🏢 Enterprise<br />
                    <span className="text-xs">50 people, 150 docs, 8 frameworks</span>
                  </button>
                </div>
              </div>

              {/* Real-time Impact Visualization */}
              <div className="mb-6 p-4 bg-gradient-to-r from-indigo-50 to-cyan-50 rounded-lg border border-indigo-200">
                <h4 className="text-sm font-semibold text-indigo-900 mb-3 flex items-center">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Real-time Impact Analysis
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-indigo-700">
                      {Math.round(calculatorInputs.employees * 40 / 12)} hours
                    </div>
                    <div className="text-xs text-indigo-600">Monthly time investment</div>
                    <div className="w-full bg-indigo-200 rounded-full h-2 mt-1">
                      <div 
                        className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min((calculatorInputs.employees * 40 / 12) / 200 * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-cyan-700">
                      ${Math.round(calculatorInputs.documents * 25).toLocaleString()}
                    </div>
                    <div className="text-xs text-cyan-600">Monthly processing cost</div>
                    <div className="w-full bg-cyan-200 rounded-full h-2 mt-1">
                      <div 
                        className="bg-cyan-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min((calculatorInputs.documents * 25) / 5000 * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-purple-700">
                      ${Math.round(calculatorInputs.complianceFrameworks * 416).toLocaleString()}
                    </div>
                    <div className="text-xs text-purple-600">Framework maintenance/month</div>
                    <div className="w-full bg-purple-200 rounded-full h-2 mt-1">
                      <div 
                        className="bg-purple-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min((calculatorInputs.complianceFrameworks * 416) / 3000 * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Results Section */}
              <div className={`bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-200 transition-all duration-300 ${isCalculating ? 'opacity-50' : 'opacity-100'}`}>
                {isCalculating && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50 rounded-xl">
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-osmo-purple"></div>
                      <span className="text-sm text-gray-600">Calculating...</span>
                    </div>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {/* Recommended Plan */}
                  <div className="bg-white p-4 rounded-lg shadow-sm transform transition-all duration-300 hover:scale-105">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-gray-700 flex items-center">
                        <Star className="w-5 h-5 text-yellow-500 mr-2" />
                        Recommended Plan
                      </h4>
                      <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full animate-pulse">
                        Best Fit
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-osmo-purple capitalize mb-2 transition-all duration-300">
                      {calculatorResults ? calculatorResults.plan.name : getRecommendedPlan(calculatorInputs)}
                    </p>
                    <p className="text-sm text-gray-600">
                      ${calculatorResults ? calculatorResults.plan.monthly : '...'}/month or ${calculatorResults ? calculatorResults.plan.yearly : '...'}/year
                    </p>
                  </div>

                  {/* Cost Breakdown */}
                  <div className="bg-white p-4 rounded-lg shadow-sm transform transition-all duration-300 hover:scale-105">
                    <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
                      <Calculator className="w-5 h-5 text-blue-500 mr-2" />
                      Cost Analysis
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Manual Process Cost:</span>
                        <span className="font-semibold text-red-600">
                          ${calculatorResults ? calculatorResults.manualCost.toLocaleString() : '...'}/year
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Poligap Plan Cost:</span>
                        <span className="font-semibold text-osmo-purple">
                          ${calculatorResults ? calculatorResults.planCost.toLocaleString() : '...'}/year
                        </span>
                      </div>
                      <div className="border-t pt-2 flex justify-between">
                        <span className="font-semibold text-gray-700">Net Savings:</span>
                        <span className="font-bold text-green-600 text-lg">
                          ${calculatorResults ? calculatorResults.savings.toLocaleString() : '...'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ROI and Benefits */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center bg-white p-4 rounded-lg shadow-sm transform transition-all duration-300 hover:scale-105">
                    <div className="text-3xl font-bold text-green-600 mb-1 transition-all duration-500">
                      {calculatorResults ? calculatorResults.roi : '...'}%
                    </div>
                    <div className="text-sm text-gray-600">ROI in Year 1</div>
                  </div>
                  <div className="text-center bg-white p-4 rounded-lg shadow-sm transform transition-all duration-300 hover:scale-105">
                    <div className="text-3xl font-bold text-blue-600 mb-1 transition-all duration-500">
                      ${calculatorResults ? Math.round(calculatorResults.savings / calculatorInputs.employees).toLocaleString() : '...'}
                    </div>
                    <div className="text-sm text-gray-600">Savings per Employee</div>
                  </div>
                  <div className="text-center bg-white p-4 rounded-lg shadow-sm transform transition-all duration-300 hover:scale-105">
                    <div className="text-3xl font-bold text-purple-600 mb-1">
                      {Math.round(calculatorInputs.employees * 40 / 52)}h
                    </div>
                    <div className="text-sm text-gray-600">Time Saved Weekly</div>
                  </div>
                </div>

                {/* Action Button */}
                <div className="mt-6 text-center">
                  <div className="mb-4 p-3 bg-white rounded-lg shadow-sm">
                    <div className="flex items-center justify-center space-x-4 mb-2">
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${
                          getRecommendedPlan(calculatorInputs) === 'starter' ? 'bg-blue-500 animate-pulse' : 'bg-gray-300'
                        }`}></div>
                        <span className="text-sm">Starter</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${
                          getRecommendedPlan(calculatorInputs) === 'professional' ? 'bg-purple-500 animate-pulse' : 'bg-gray-300'
                        }`}></div>
                        <span className="text-sm">Professional</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${
                          getRecommendedPlan(calculatorInputs) === 'enterprise' ? 'bg-yellow-500 animate-pulse' : 'bg-gray-300'
                        }`}></div>
                        <span className="text-sm">Enterprise</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600">Recommendation changes based on your inputs</p>
                  </div>
                  
                  <button
                    onClick={() => {
                      setSelectedPlan(getRecommendedPlan(calculatorInputs));
                      // Scroll to pricing cards
                      document.querySelector('.grid.grid-cols-1.md\\:grid-cols-3').scrollIntoView({
                        behavior: 'smooth',
                        block: 'center'
                      });
                    }}
                    className="bg-osmo-purple text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center mx-auto animate-pulse"
                  >
                    <TrendingUp className="w-5 h-5 mr-2" />
                    Select {getRecommendedPlan(calculatorInputs)} Plan
                  </button>
                </div>
              </div>

              {/* Additional Benefits */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-3 flex items-center">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Why Choose Poligap?
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-start">
                    <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-blue-800">Reduce compliance workload by 80%</span>
                  </div>
                  <div className="flex items-start">
                    <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-blue-800">AI-powered gap analysis in minutes</span>
                  </div>
                  <div className="flex items-start">
                    <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-blue-800">Continuous monitoring & alerts</span>
                  </div>
                  <div className="flex items-start">
                    <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-blue-800">Enterprise-grade security & compliance</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => {
            const IconComponent = plan.icon;
            const savings = getSavings(plan);
            const isRecommended = getRecommendedPlan(calculatorInputs) === plan.id;
            const isHovered = hoveredPlan === plan.id;
            const isSelected = selectedPlan === plan.id;
            
            return (
              <div
                key={plan.id}
                onMouseEnter={() => setHoveredPlan(plan.id)}
                onMouseLeave={() => setHoveredPlan(null)}
                className={`relative bg-white rounded-2xl shadow-lg border-2 transition-all duration-500 transform hover:shadow-xl hover:-translate-y-2 ${
                  plan.popular 
                    ? 'border-osmo-purple ring-2 ring-osmo-purple ring-opacity-20 scale-105' 
                    : isRecommended
                    ? 'border-green-400 ring-2 ring-green-400 ring-opacity-20'
                    : isSelected
                    ? 'border-blue-400 ring-2 ring-blue-400 ring-opacity-20'
                    : 'border-gray-200 hover:border-osmo-purple'
                } ${isHovered ? 'scale-105' : ''}`}
                style={{
                  animationDelay: `${index * 200}ms`
                }}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-osmo-purple text-white px-4 py-1 rounded-full text-sm font-medium flex items-center space-x-1 animate-bounce">
                      <Star className="w-4 h-4" />
                      <span>Most Popular</span>
                    </div>
                  </div>
                )}

                {plan.trending && (
                  <div className="absolute -top-2 -right-2">
                    <div className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium animate-pulse">
                      🔥 Trending
                    </div>
                  </div>
                )}

                {isRecommended && showCalculator && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                      <TrendingUp className="w-4 h-4" />
                      <span>Recommended</span>
                    </div>
                  </div>
                )}

                <div className="p-8">
                  {/* Plan Header */}
                  <div className="text-center mb-8">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 transition-all duration-300 ${
                      plan.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                      plan.color === 'purple' ? 'bg-purple-100 text-osmo-purple' :
                      'bg-yellow-100 text-yellow-600'
                    } ${isHovered ? 'scale-110 shadow-lg' : ''}`}>
                      <IconComponent className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                    <p className="text-gray-600 mb-4">{plan.description}</p>
                    
                    {/* Additional plan info */}
                    <div className="space-y-2 mb-6">
                      <div className="flex items-center justify-center text-sm text-gray-500">
                        <Users className="w-4 h-4 mr-1" />
                        {plan.recommendedFor}
                      </div>
                      <div className="flex items-center justify-center text-sm text-green-600">
                        <TrendingUp className="w-4 h-4 mr-1" />
                        {plan.estimatedROI} ROI
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <div className="flex items-baseline justify-center">
                        <span className={`text-5xl font-bold text-gray-900 transition-all duration-300 ${
                          animatedPrices[plan.id] !== undefined ? 'transform scale-110' : ''
                        }`}>
                          ${animatedPrices[plan.id] ?? getPrice(plan)}
                        </span>
                        <span className="text-gray-500 ml-1">/{billingPeriod === 'monthly' ? 'month' : 'year'}</span>
                      </div>
                      {billingPeriod === 'yearly' && (
                        <div className="space-y-1">
                          <p className="text-sm text-green-600">
                            Save ${savings.amount} ({plan.yearlyDiscount}%) per year
                          </p>
                          <p className="text-xs text-gray-500">Setup time: {plan.setupTime}</p>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => handleGetStarted(plan.id)}
                      className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 ${
                        plan.popular
                          ? 'bg-osmo-purple text-white hover:bg-purple-700 shadow-lg hover:shadow-xl'
                          : isRecommended
                          ? 'bg-green-500 text-white hover:bg-green-600 shadow-lg'
                          : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                      } ${isSelected ? 'ring-2 ring-blue-400' : ''}`}
                    >
                      {isSelected ? '✓ Selected' : 'Get Started'}
                    </button>
                  </div>

                  {/* Features */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900 flex items-center">
                      <Check className="w-5 h-5 text-green-500 mr-2" />
                      Included Features
                    </h4>
                    <ul className="space-y-3">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <Check className="w-4 h-4 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-600 text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {plan.limitations.length > 0 && (
                      <div className="pt-4 border-t border-gray-100">
                        <h4 className="font-semibold text-gray-900 flex items-center mb-3">
                          <X className="w-5 h-5 text-gray-400 mr-2" />
                          Not Included
                        </h4>
                        <ul className="space-y-2">
                          {plan.limitations.map((limitation, index) => (
                            <li key={index} className="flex items-start">
                              <X className="w-4 h-4 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-500 text-sm">{limitation}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Plan Comparison Toggle */}
        <div className="text-center mb-8">
          <button
            onClick={() => setShowComparison(!showComparison)}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center space-x-2 mx-auto transform hover:scale-105"
          >
            <span>{showComparison ? 'Hide' : 'Show'} Feature Comparison</span>
          </button>
        </div>

        {/* Feature Comparison Table */}
        {showComparison && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-16 transform transition-all duration-500">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Features</th>
                    {plans.map(plan => (
                      <th key={plan.id} className="px-6 py-4 text-center text-sm font-medium text-gray-500">
                        {plan.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {[
                    { feature: 'Monthly Analyses', values: ['5', '25', 'Unlimited'] },
                    { feature: 'Compliance Frameworks', values: ['Basic', 'All + Custom', 'All + Development'] },
                    { feature: 'Team Members', values: ['1', '5', 'Unlimited'] },
                    { feature: 'API Access', values: ['❌', '✅', '✅ Advanced'] },
                    { feature: 'Support', values: ['Email', 'Priority', '24/7 Dedicated'] },
                    { feature: 'Custom Integrations', values: ['❌', 'Limited', 'Full'] }
                  ].map((row, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{row.feature}</td>
                      {row.values.map((value, valueIndex) => (
                        <td key={valueIndex} className="px-6 py-4 text-sm text-center text-gray-600">
                          {value}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* FAQ Section */}
        <div className="text-center mb-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">Frequently Asked Questions</h3>
          <div className="max-w-3xl mx-auto space-y-4">
            {faqData.map((faq) => (
              <div key={faq.id} className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                <button
                  onClick={() => toggleFAQ(faq.id)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:bg-gray-50"
                >
                  <span className="font-semibold text-gray-900">{faq.question}</span>
                  <div className={`transform transition-transform duration-200 ${openFAQ === faq.id ? 'rotate-180' : ''}`}>
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>
                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openFAQ === faq.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}>
                  <div className="px-6 pb-4 pt-0">
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-osmo-purple to-purple-700 rounded-2xl p-8 text-center text-white relative overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-4 left-4 w-16 h-16 bg-white opacity-10 rounded-full animate-bounce"></div>
            <div className="absolute top-8 right-8 w-12 h-12 bg-white opacity-10 rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>
            <div className="absolute bottom-4 left-1/3 w-8 h-8 bg-white opacity-10 rounded-full animate-bounce" style={{ animationDelay: '2s' }}></div>
          </div>
          
          <div className="relative z-10">
            <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
            <p className="text-purple-100 mb-6 max-w-2xl mx-auto">
              Join thousands of organizations already using Poligap to streamline their compliance processes and reduce risk.
            </p>
            
            {/* Dynamic stats */}
            <div className="grid grid-cols-3 gap-4 mb-8 max-w-md mx-auto">
              <div className="text-center">
                <div className="text-2xl font-bold">10K+</div>
                <div className="text-sm text-purple-200">Documents Analyzed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">500+</div>
                <div className="text-sm text-purple-200">Companies Trust Us</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">99.9%</div>
                <div className="text-sm text-purple-200">Uptime</div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => onNavigate('register')}
                className="bg-white text-osmo-purple px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Start Free Trial
              </button>
              <button
                onClick={() => onNavigate('contact')}
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-osmo-purple transition-all duration-300 transform hover:scale-105"
              >
                Contact Sales
              </button>
            </div>
            
            <p className="text-sm text-purple-200 mt-4">
              No credit card required • 14-day free trial • Cancel anytime
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PricingPage;
