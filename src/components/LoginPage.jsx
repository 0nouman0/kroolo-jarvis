import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [company, setCompany] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const { signIn, signUp, resetPassword } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      if (isLogin) {
        // Login
        const { data, error } = await signIn(email, password);
        if (error) {
          setError(error.message);
        } else {
          setMessage('Login successful! Welcome back!');
          // Redirect to home page instead of analyzer
          setTimeout(() => navigate('/'), 500);
        }
      } else {
        // Sign up
        if (password !== confirmPassword) {
          setError('Passwords do not match');
          setLoading(false);
          return;
        }

        const { data, error } = await signUp(email, password, {
          first_name: firstName,
          last_name: lastName,
          company: company
        });

        if (error) {
          setError(error.message);
        } else if (data && data.user) {
          // User is successfully created and logged in
          setMessage('Account created successfully! Welcome to Poligap!');
          setTimeout(() => navigate('/'), 500);
        } else {
          setMessage('Account created! Please check your email to verify your account.');
        }
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Auth error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError('Please enter your email address first');
      return;
    }

    setLoading(true);
    setError('');
    
    const { data, error } = await resetPassword(email);
    
    if (error) {
      setError(error.message);
    } else {
      setMessage('Password reset email sent! Check your inbox.');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50 flex items-center justify-center px-6 py-12 relative overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-purple-200/30 to-pink-200/30 rounded-3xl opacity-60 animate-pulse"></div>
        <div className="absolute top-60 right-20 w-24 h-24 bg-gradient-to-br from-blue-200/30 to-cyan-200/30 rounded-full opacity-70 animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-40 left-1/3 w-40 h-20 bg-gradient-to-r from-indigo-200/30 to-purple-200/30 rounded-2xl opacity-50 animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-gradient-to-br from-emerald-200/30 to-teal-200/30 rounded-full opacity-60 animate-pulse" style={{animationDelay: '3s'}}></div>
      </div>

      <div className="relative z-10 w-full max-w-lg">
        {/* Enhanced Header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center mb-6">
            <button
              onClick={() => navigate('/')}
              className="group bg-gradient-to-r from-slate-700 to-slate-800 text-white px-6 py-3 rounded-xl font-bold hover:from-slate-800 hover:to-slate-900 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 mr-4"
            >
              <span className="flex items-center space-x-2">
                <span className="group-hover:-translate-x-1 transition-transform duration-300">←</span>
                <span>Back</span>
              </span>
            </button>
            <h1 className="text-4xl font-black bg-gradient-to-r from-slate-800 via-purple-700 to-indigo-700 bg-clip-text text-transparent">
              Poligap
            </h1>
          </div>
          <p className="text-xl text-gray-600 font-medium">
            {isLogin ? 'Welcome back to AI-powered compliance' : 'Join the future of compliance management'}
          </p>
        </div>

        {/* Enhanced Auth Form */}
        <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/30 p-10">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black bg-gradient-to-r from-slate-800 to-purple-700 bg-clip-text text-transparent mb-2">
              {isLogin ? 'Sign In' : 'Create Account'}
            </h2>
            <p className="text-gray-600 font-medium">
              {isLogin ? 'Access your compliance dashboard' : 'Start your compliance journey today'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Enhanced Sign Up Only Fields */}
            {!isLogin && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="group">
                    <label className="block text-slate-800 font-bold mb-3 text-sm">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl text-slate-800 placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-300 bg-white/80 backdrop-blur-sm group-hover:border-gray-300"
                      placeholder="John"
                      required={!isLogin}
                    />
                  </div>
                  <div className="group">
                    <label className="block text-slate-800 font-bold mb-3 text-sm">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl text-slate-800 placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-300 bg-white/80 backdrop-blur-sm group-hover:border-gray-300"
                      placeholder="Doe"
                      required={!isLogin}
                    />
                  </div>
                </div>
                
                <div className="group">
                  <label className="block text-slate-800 font-bold mb-3 text-sm">
                    Company (Optional)
                  </label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl text-slate-800 placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-300 bg-white/80 backdrop-blur-sm group-hover:border-gray-300"
                    placeholder="Your Company Name"
                  />
                </div>
              </>
            )}

            {/* Enhanced Email */}
            <div className="group">
              <label className="block text-slate-800 font-bold mb-3 text-sm">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl text-slate-800 placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-300 bg-white/80 backdrop-blur-sm group-hover:border-gray-300"
                placeholder="john@example.com"
                required
              />
            </div>

            {/* Enhanced Password */}
            <div className="group">
              <label className="block text-slate-800 font-bold mb-3 text-sm">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl text-slate-800 placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-300 bg-white/80 backdrop-blur-sm group-hover:border-gray-300"
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>

            {/* Enhanced Confirm Password (Sign Up Only) */}
            {!isLogin && (
              <div className="group">
                <label className="block text-slate-800 font-bold mb-3 text-sm">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl text-slate-800 placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-300 bg-white/80 backdrop-blur-sm group-hover:border-gray-300"
                  placeholder="••••••••"
                  required={!isLogin}
                  minLength={6}
                />
              </div>
            )}

            {/* Enhanced Error Message */}
            {error && (
              <div className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-xl p-4 shadow-lg">
                <div className="flex items-center">
                  <span className="text-red-500 mr-3 text-xl">⚠️</span>
                  <p className="text-red-700 font-medium">{error}</p>
                </div>
              </div>
            )}

            {/* Enhanced Success Message */}
            {message && (
              <div className="bg-gradient-to-r from-emerald-50 to-green-50 border-2 border-emerald-200 rounded-xl p-4 shadow-lg">
                <div className="flex items-center">
                  <span className="text-emerald-500 mr-3 text-xl">✅</span>
                  <p className="text-emerald-700 font-medium">{message}</p>
                </div>
              </div>
            )}

            {/* Enhanced Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-700 text-white py-4 px-6 rounded-xl font-bold hover:from-purple-700 hover:to-indigo-800 focus:outline-none focus:ring-4 focus:ring-purple-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5 text-lg"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent mr-3"></div>
                  {isLogin ? 'Signing in...' : 'Creating account...'}
                </div>
              ) : (
                <span className="flex items-center justify-center space-x-2">
                  <span>{isLogin ? '🚀' : '✨'}</span>
                  <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                </span>
              )}
            </button>

            {/* Enhanced Forgot Password (Login Only) */}
            {isLogin && (
              <div className="text-center">
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-purple-600 hover:text-indigo-700 font-semibold transition-colors duration-300 underline decoration-2 underline-offset-4 hover:decoration-indigo-700"
                >
                  Forgot your password?
                </button>
              </div>
            )}

            {/* Enhanced Toggle Login/Signup */}
            <div className="text-center pt-6 border-t border-gray-200">
              <p className="text-gray-600 font-medium">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setError('');
                    setMessage('');
                  }}
                  className="text-purple-600 hover:text-indigo-700 font-bold ml-2 transition-colors duration-300 underline decoration-2 underline-offset-4 hover:decoration-indigo-700"
                >
                  {isLogin ? 'Sign up here' : 'Sign in here'}
                </button>
              </p>
            </div>
          </form>
        </div>

        {/* Enhanced Features Preview */}
        <div className="mt-10 text-center">
          <p className="text-gray-600 font-medium mb-6">What you'll get with Poligap:</p>
          <div className="grid grid-cols-3 gap-6">
            <div className="group cursor-pointer transform hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:shadow-xl transition-all duration-300">
                <span className="text-white text-2xl">🤖</span>
              </div>
              <p className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors">AI Analysis</p>
              <p className="text-xs text-gray-500 mt-1">Smart document processing</p>
            </div>
            <div className="group cursor-pointer transform hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:shadow-xl transition-all duration-300">
                <span className="text-white text-2xl">🛡️</span>
              </div>
              <p className="text-sm font-bold text-slate-800 group-hover:text-emerald-600 transition-colors">Compliance</p>
              <p className="text-xs text-gray-500 mt-1">Multi-framework support</p>
            </div>
            <div className="group cursor-pointer transform hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:shadow-xl transition-all duration-300">
                <span className="text-white text-2xl">📊</span>
              </div>
              <p className="text-sm font-bold text-slate-800 group-hover:text-purple-600 transition-colors">Reports</p>
              <p className="text-xs text-gray-500 mt-1">Professional insights</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
