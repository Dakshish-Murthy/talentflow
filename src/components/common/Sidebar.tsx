import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useLocation, useNavigate } from 'react-router-dom';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname === path;
  const isActiveStartsWith = (path: string) => location.pathname.startsWith(path);

  const hrNavigation = [
    { name: 'Jobs Board', href: '/jobs', icon: '💼', exact: true },
    { name: 'Candidates', href: '/candidates', icon: '👥', exact: true },
    { name: 'Assessments', href: '/assessments', icon: '📝', exact: false },
  ];

  const candidateNavigation = [
    { name: 'Dashboard', href: '/candidate-dashboard', icon: '🏠', exact: true },
    { name: 'Browse Jobs', href: '/browse-jobs', icon: '🔍', exact: true },
    { name: 'My Applications', href: '/my-applications', icon: '📨', exact: true },
  ];

  const navigation = user?.role === 'hr' ? hrNavigation : candidateNavigation;

  const handleNavigation = (href: string) => {
    navigate(href);
    onClose();
  };

  const checkActive = (item: any) => {
    return item.exact ? isActive(item.href) : isActiveStartsWith(item.href);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        flex flex-col h-full bg-white shadow-xl lg:shadow-none
        fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">TF</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">TalentFlow</h1>
              <p className="text-xs text-gray-500 capitalize">{user?.role} Portal</p>
            </div>
          </div>
          
          {/* Close button for mobile */}
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navigation - Scrollable if needed */}
        <div className="flex-1 overflow-y-auto">
          <nav className="mt-8 px-4 space-y-2">
            {navigation.map((item) => {
              const active = checkActive(item);
              return (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item.href)}
                  className={`
                    w-full flex items-center space-x-3 px-4 py-3 text-left rounded-xl transition-all duration-200 group
                    ${active 
                      ? 'bg-gradient-to-r from-blue-50 to-blue-25 border border-blue-100 text-blue-700 shadow-sm' 
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }
                  `}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className={`font-medium ${active ? 'text-blue-700' : 'text-gray-700'}`}>
                    {item.name}
                  </span>
                  {active && (
                    <div className="ml-auto w-2 h-2 bg-blue-500 rounded-full"></div>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Quick Stats for HR */}
          {user?.role === 'hr' && (
            <div className="mt-8 mx-4 p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Quick Stats</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">Active Jobs</span>
                  <span className="text-sm font-semibold text-blue-600">12</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">New Candidates</span>
                  <span className="text-sm font-semibold text-green-600">8</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">Pending Reviews</span>
                  <span className="text-sm font-semibold text-yellow-600">5</span>
                </div>
              </div>
            </div>
          )}

          {/* Quick Stats for Candidate */}
          {user?.role === 'candidate' && (
            <div className="mt-8 mx-4 p-4 bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl border border-green-200">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">My Progress</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">Applications</span>
                  <span className="text-sm font-semibold text-blue-600">3</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">Interviews</span>
                  <span className="text-sm font-semibold text-green-600">1</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">Assessments</span>
                  <span className="text-sm font-semibold text-purple-600">2</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer - Fixed at bottom */}
        <div className="flex-shrink-0 p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.name || 'User'}
              </p>
              <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;