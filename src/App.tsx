import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import Layout from './components/common/Layout';
import Login from './components/auth/Login';
import JobsBoard from './components/jobs/JobsBoard';
import JobDetail from './components/jobs/JobDetail';
import CandidatesList from './components/candidates/CandidatesList';
import CandidateProfile from './components/candidates/CandidateProfile';
import AssessmentBuilder from './components/assessments/AssessmentBuilder';
import AssessmentForm from './components/assessments/AssessmentForm';
import CandidateJobsBoard from './components/candidates/JobsBoard';
import JobApplication from './components/candidates/JobApplication';
import ApplicationSuccess from './components/candidates/ApplicationSuccess';
import CandidateDashboard from './components/candidates/CandidateDashboard';

// Import the new components
import AssessmentsList from './components/assessments/AssessmentsList';
import MyApplications from './components/candidates/MyApplications';
import CandidatesView from './components/candidates/CandidatesView';

import { useAppSelector } from './hooks/redux';
import { db } from './services/database';

// Initialize database - moved inside component
const initializeApp = async () => {
  try {
    await db.open();
    console.log('Database initialized successfully');
    return true;
  } catch (error) {
    console.error('Failed to initialize database:', error);
    return false;
  }
};

const ProtectedRoute: React.FC<{ 
  children: React.ReactNode; 
  requiredRole?: 'hr' | 'candidate' 
}> = ({ children, requiredRole }) => {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (requiredRole && user?.role !== requiredRole) {
    // Redirect to appropriate dashboard based on actual role
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <Login />} />
      
      {/* Default route - redirects based on role */}
      <Route path="/" element={
        <ProtectedRoute>
          <Layout>
            {user?.role === 'hr' ? <JobsBoard /> : <CandidateDashboard />}
          </Layout>
        </ProtectedRoute>
      } />

      {/* HR-only routes */}
      <Route path="/jobs" element={
        <ProtectedRoute requiredRole="hr">
          <Layout>
            <JobsBoard />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/jobs/:jobId" element={
        <ProtectedRoute requiredRole="hr">
          <Layout>
            <JobDetail />
          </Layout>
        </ProtectedRoute>
      } />
      
      {/* Candidates routes with both list and kanban views */}
      <Route path="/candidates" element={
        <ProtectedRoute requiredRole="hr">
          <Layout>
            <CandidatesView />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/candidates/list" element={
        <ProtectedRoute requiredRole="hr">
          <Layout>
            <CandidatesList />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/candidates/:candidateId" element={
        <ProtectedRoute requiredRole="hr">
          <Layout>
            <CandidateProfile />
          </Layout>
        </ProtectedRoute>
      } />
      
      {/* Add the new assessments routes */}
      <Route path="/assessments" element={
        <ProtectedRoute requiredRole="hr">
          <Layout>
            <AssessmentsList />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/assessments/:jobId" element={
        <ProtectedRoute requiredRole="hr">
          <Layout>
            <AssessmentBuilder />
          </Layout>
        </ProtectedRoute>
      } />

      {/* Candidate-only routes */}
      <Route path="/candidate-dashboard" element={
        <ProtectedRoute requiredRole="candidate">
          <Layout>
            <CandidateDashboard />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/browse-jobs" element={
        <ProtectedRoute requiredRole="candidate">
          <Layout>
            <CandidateJobsBoard />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/application/:jobId" element={
        <ProtectedRoute requiredRole="candidate">
          <Layout>
            <JobApplication />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/application/success" element={
        <ProtectedRoute requiredRole="candidate">
          <Layout>
            <ApplicationSuccess />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/assessment/:jobId" element={
        <ProtectedRoute requiredRole="candidate">
          <Layout>
            <AssessmentForm />
          </Layout>
        </ProtectedRoute>
      } />

      {/* Add the new my-applications route */}
      <Route path="/my-applications" element={
        <ProtectedRoute requiredRole="candidate">
          <Layout>
            <MyApplications />
          </Layout>
        </ProtectedRoute>
      } />

      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App: React.FC = () => {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const init = async () => {
      await initializeApp();
      setIsInitialized(true);
    };
    
    init();
  }, []);

  // Show loading while initializing
  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Initializing TalentFlow...</p>
        </div>
      </div>
    );
  }

  return (
    <Provider store={store}>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <AppRoutes />
        </div>
      </Router>
    </Provider>
  );
};

export default App;