import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../hooks/redux';
import { login } from '../../store/slices/authSlice';

interface LoginCredentials {
  email: string;
  password: string;
  role: 'hr' | 'candidate';
}

const Login: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'hr' | 'candidate'>('candidate');
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: '',
    password: '',
    role: 'candidate'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [shake, setShake] = useState(false);

  // Predefined credentials
  const validCredentials = {
    hr: [
      { email: 'hr@talentflow.com', password: 'hr123' },
      { email: 'admin@talentflow.com', password: 'admin123' },
      { email: 'recruiter@company.com', password: 'recruiter123' }
    ],
    candidate: [
      { email: 'candidate@talentflow.com', password: 'candidate123' },
      { email: 'john.doe@email.com', password: 'john123' },
      { email: 'sarah.wilson@email.com', password: 'sarah123' },
      { email: 'demo@candidate.com', password: 'demo123' }
    ]
  };

  useEffect(() => {
    // Auto-fill demo credentials when tab changes
    const demoCredential = validCredentials[activeTab][0];
    setCredentials(prev => ({
      ...prev,
      email: demoCredential.email,
      password: demoCredential.password,
      role: activeTab
    }));
  }, [activeTab]);

  const handleInputChange = (field: keyof LoginCredentials, value: string) => {
    setCredentials(prev => ({ ...prev, [field]: value }));
  };

  const validateCredentials = (email: string, password: string, role: 'hr' | 'candidate'): boolean => {
    return validCredentials[role].some(cred => 
      cred.email === email && cred.password === password
    );
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const isValid = validateCredentials(credentials.email, credentials.password, credentials.role);
    
    if (isValid) {
      setTimeout(() => {
        if (credentials.role === 'hr') {
          dispatch(login({ 
            role: 'hr',
            userId: 'hr-1'
          }));
          navigate('/jobs');
        } else {
          const candidateId = `candidate-${Math.floor(Math.random() * 1000) + 1}`;
          dispatch(login({ 
            role: 'candidate', 
            userId: candidateId
          }));
          navigate('/candidate-dashboard');
        }
        setIsLoading(false);
      }, 400);
    } else {
      setShake(true);
      setIsLoading(false);
      setTimeout(() => setShake(false), 500);
    }
  };

  const handleQuickLogin = (role: 'hr' | 'candidate', index: number = 0) => {
    const credential = validCredentials[role][index];
    setCredentials({
      email: credential.email,
      password: credential.password,
      role
    });
    setActiveTab(role);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 relative overflow-hidden">
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
        
        {/* Enhanced Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-20 w-4 h-4 bg-blue-400/20 rounded-full animate-bounce"></div>
        <div className="absolute bottom-32 right-32 w-6 h-6 bg-purple-400/20 rounded-full animate-bounce delay-300"></div>
        <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-cyan-400/20 rounded-full animate-bounce delay-700"></div>
      </div>

      {/* Main Content - Improved Alignment */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-10 items-center">
          {/* Left Side - Branding */}
          <div className="flex flex-col justify-center space-y-8">
            {/* Logo & Brand */}
            <div className="text-center xl:text-left space-y-6">
              <div className="inline-flex items-center justify-center xl:justify-start space-x-4 group">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/30 group-hover:scale-110 transition-transform duration-500">
                  <span className="text-white font-bold text-2xl">TF</span>
                </div>
                <div>
                  <h1 className="text-4xl lg:text-5xl font-bold text-white mb-3">TalentFlow</h1>
                  <p className="text-xl text-blue-200 font-light">
                    Enterprise Hiring Platform
                  </p>
                </div>
              </div>
            </div>

            {/* Demo Credentials - Slightly larger */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 max-w-md mx-auto xl:mx-0">
              <h3 className="text-xl font-semibold text-white mb-5 text-center xl:text-left">Demo Credentials</h3>
              
              {/* HR Credentials */}
              <div className="mb-5">
                <h4 className="text-base font-semibold text-white mb-3 flex items-center">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                  HR Team
                </h4>
                <div className="space-y-3 text-sm text-blue-200">
                  <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                    <div><span className="font-medium">Email:</span> hr@talentflow.com</div>
                    <div><span className="font-medium">Password:</span> hr123</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                    <div><span className="font-medium">Email:</span> admin@talentflow.com</div>
                    <div><span className="font-medium">Password:</span> admin123</div>
                  </div>
                </div>
              </div>

              {/* Candidate Credentials */}
              <div>
                <h4 className="text-base font-semibold text-white mb-3 flex items-center">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full mr-2"></span>
                  Candidate
                </h4>
                <div className="space-y-3 text-sm text-blue-200">
                  <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                    <div><span className="font-medium">Email:</span> candidate@talentflow.com</div>
                    <div><span className="font-medium">Password:</span> candidate123</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                    <div><span className="font-medium">Email:</span> john.doe@email.com</div>
                    <div><span className="font-medium">Password:</span> john123</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form - Slightly larger */}
          <div className="flex justify-center xl:justify-start">
            <div className="w-full max-w-md space-y-8">
              {/* Header - Updated Welcome Back to Welcome Back! */}
              <div className="text-center xl:text-left">
                <h2 className="text-3xl lg:text-4xl font-bold text-white mb-3">
                  Welcome Back!
                </h2>
                <p className="text-blue-200 text-lg">
                  Sign in to access your portal
                </p>
              </div>

              {/* Login Card */}
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-7 transition-all duration-500 hover:bg-white/15 hover:shadow-2xl hover:shadow-blue-500/20">
                {/* Role Tabs */}
                <div className="flex space-x-3 mb-6">
                  {[
                    { id: 'candidate', label: 'Candidate', icon: '👤' },
                    { id: 'hr', label: 'HR Team', icon: '💼' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as 'hr' | 'candidate')}
                      className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
                        activeTab === tab.id
                          ? 'bg-white/20 text-white border border-white/30 shadow-lg'
                          : 'bg-white/5 text-blue-200 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <span className="text-sm">{tab.icon}</span>
                      <span className="text-sm">{tab.label}</span>
                    </button>
                  ))}
                </div>

                {/* Login Form */}
                <form onSubmit={handleLogin} className="space-y-5">
                  <div className={`space-y-4 transition-all duration-500 ${shake ? 'animate-shake' : ''}`}>
                    {/* Email Field */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-blue-200">Email Address</label>
                      <div className="relative">
                        <input
                          type="email"
                          value={credentials.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                          placeholder="Enter your email"
                          required
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* Password Field */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-blue-200">Password</label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={credentials.password}
                          onChange={(e) => handleInputChange('password', e.target.value)}
                          className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                          placeholder="Enter your password"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-400 hover:text-blue-300 transition-colors duration-200"
                        >
                          {showPassword ? (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.59 6.59m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Login Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white py-3 px-6 rounded-xl font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:transform-none group relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    {isLoading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Signing In...</span>
                      </div>
                    ) : (
                      <span className="relative">Sign In as {activeTab === 'hr' ? 'HR Team' : 'Candidate'}</span>
                    )}
                  </button>
                </form>

                {/* Quick Login Buttons */}
                <div className="mt-5 space-y-2">
                  <p className="text-center text-blue-300 text-sm font-medium">Quick Access</p>
                  <div className="grid grid-cols-2 gap-2">
                    {validCredentials[activeTab].slice(0, 2).map((credential, index) => (
                      <button
                        key={index}
                        onClick={() => handleQuickLogin(activeTab, index)}
                        className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-blue-200 hover:text-white py-2 px-3 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105"
                      >
                        Demo {index + 1}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="text-center pt-4">
                <p className="text-sm text-blue-300/70">
                  Secure Enterprise Platform • © 2024 TalentFlow
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1.5 h-1.5 bg-white/10 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${10 + Math.random() * 10}s`
            }}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default Login;