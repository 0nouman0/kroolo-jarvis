import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function NavigationHeader() {
  const { user, signOut } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <header className="bg-white/90 backdrop-blur-lg border-b border-gray-200/50 shadow-lg relative z-50 sticky top-0">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          
          {/* Enhanced Logo */}
          <div 
            onClick={() => navigate('/')}
            className="flex items-center cursor-pointer group"
          >
            <h1 className="text-3xl font-black bg-gradient-to-r from-slate-800 via-purple-700 to-indigo-700 bg-clip-text text-transparent group-hover:from-purple-700 group-hover:via-indigo-700 group-hover:to-blue-700 transition-all duration-300">
              Poligap
            </h1>
            <div className="ml-2 w-2 h-2 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full group-hover:animate-pulse"></div>
          </div>

          {/* Enhanced Navigation Links */}
          <nav className="hidden md:flex items-center space-x-2">
            <button
              onClick={() => navigate('/analyzer')}
              className={`px-4 py-2 rounded-xl font-bold transition-all duration-300 transform hover:-translate-y-0.5 ${
                currentPath === '/analyzer' 
                  ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg' 
                  : 'text-gray-700 hover:bg-purple-50 hover:text-purple-700 hover:shadow-md'
              }`}
            >
              🔍 Analyzer
            </button>
            <button
              onClick={() => navigate('/generator')}
              className={`px-4 py-2 rounded-xl font-bold transition-all duration-300 transform hover:-translate-y-0.5 ${
                currentPath === '/generator' 
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-lg' 
                  : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700 hover:shadow-md'
              }`}
            >
              ⚡ Generator
            </button>
            <button
              onClick={() => navigate('/history')}
              className={`px-4 py-2 rounded-xl font-bold transition-all duration-300 transform hover:-translate-y-0.5 ${
                currentPath === '/history' 
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg' 
                  : 'text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 hover:shadow-md'
              }`}
            >
              📊 History
            </button>
            <button
              onClick={() => navigate('/compliances')}
              className={`px-4 py-2 rounded-xl font-bold transition-all duration-300 transform hover:-translate-y-0.5 ${
                currentPath === '/compliances' 
                  ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg' 
                  : 'text-gray-700 hover:bg-pink-50 hover:text-pink-700 hover:shadow-md'
              }`}
            >
              📚 Learn
            </button>
            <button
              onClick={() => navigate('/pricing')}
              className={`px-4 py-2 rounded-xl font-bold transition-all duration-300 transform hover:-translate-y-0.5 ${
                currentPath === '/pricing' 
                  ? 'bg-gradient-to-r from-yellow-500 to-orange-600 text-white shadow-lg' 
                  : 'text-gray-700 hover:bg-yellow-50 hover:text-yellow-700 hover:shadow-md'
              }`}
            >
              💰 Pricing
            </button>
          </nav>

          {/* Enhanced User Actions */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="relative">
                {/* Enhanced Account Button */}
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="group flex items-center space-x-3 bg-gradient-to-r from-purple-600 to-indigo-700 text-white px-6 py-3 rounded-xl font-bold hover:from-purple-700 hover:to-indigo-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30 shadow-inner">
                    <span className="font-black text-lg">
                      {user.user_metadata?.first_name?.charAt(0) || user.email?.charAt(0) || '?'}
                    </span>
                  </div>
                  <span className="hidden sm:inline">
                    {user.user_metadata?.first_name || 'Account'}
                  </span>
                  <span className="text-sm transform group-hover:rotate-180 transition-transform duration-300">▼</span>
                </button>

                {/* Enhanced User Dropdown Menu */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-3 w-72 bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/30 py-3 z-50 transform animate-in slide-in-from-top-2 duration-300">
                    <div className="px-6 py-4 border-b border-gray-200/50">
                      <p className="text-xl font-black bg-gradient-to-r from-slate-800 to-purple-700 bg-clip-text text-transparent">
                        {user.user_metadata?.full_name || 'User'}
                      </p>
                      <p className="text-sm text-gray-600 font-medium mt-1">{user.email}</p>
                    </div>
                    
                    <div className="p-2">
                      <button
                        onClick={() => {
                          navigate('/profile');
                          setShowUserMenu(false);
                        }}
                        className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-indigo-50 hover:text-purple-700 transition-all duration-200 rounded-xl font-medium flex items-center space-x-3 group"
                      >
                        <span className="text-xl group-hover:scale-110 transition-transform duration-200">👤</span>
                        <span>My Profile</span>
                      </button>
                    </div>
                    
                    <div className="border-t border-gray-200/50 mt-1 pt-2 px-2">
                      <button
                        onClick={handleSignOut}
                        className="w-full text-left px-4 py-3 text-red-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 hover:text-red-700 transition-all duration-200 rounded-xl font-medium flex items-center space-x-3 group"
                      >
                        <span className="text-xl group-hover:scale-110 transition-transform duration-200">🚪</span>
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => navigate('/login')}
                  className="text-gray-700 font-bold hover:text-purple-700 transition-colors duration-300 px-4 py-2 rounded-xl hover:bg-purple-50 transform hover:-translate-y-0.5"
                >
                  Sign In
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white px-6 py-3 rounded-xl font-bold hover:from-purple-700 hover:to-indigo-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <span className="flex items-center space-x-2">
                    <span>🚀</span>
                    <span>Get Started</span>
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Click outside to close dropdown */}
      {showUserMenu && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowUserMenu(false)}
        ></div>
      )}
    </header>
  );
}

export default NavigationHeader;
