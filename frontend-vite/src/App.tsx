import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import ErrorBoundary from './components/ErrorBoundary'

// Import integrated pages
import HomePage from './pages/HomePage'
import GroupsPageIntegrated from './pages/GroupsPageIntegrated'
import GroupDetailPageIntegrated from './pages/GroupDetailPageIntegrated'
import CreateGroupPage from './pages/CreateGroupPage'
import DashboardPage from './pages/DashboardPage'
import CompleteDashboard from './pages/CompleteDashboard'
import ProfilePageIntegrated from './pages/ProfilePageIntegrated'
import StakingDashboard from './components/StakingDashboard'
import OptimizedYieldTracker from './components/OptimizedYieldTracker'
import StakingSettings from './components/StakingSettings'
import Documentation from './components/Documentation'

function App() {
  console.log('App component rendering...')
  
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-900">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/groups" element={<GroupsPageIntegrated />} />
          <Route path="/groups/:id" element={<GroupDetailPageIntegrated />} />
          <Route path="/create" element={<CreateGroupPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/complete" element={<CompleteDashboard />} />
          <Route path="/staking" element={<StakingDashboard />} />
          <Route path="/yield" element={<OptimizedYieldTracker />} />
          <Route path="/settings" element={<StakingSettings />} />
          <Route path="/docs" element={<Documentation />} />
          <Route path="/profile" element={<ProfilePageIntegrated />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1f2937',
              color: '#f9fafb',
              border: '1px solid #374151'
            }
          }}
        />
      </div>
    </ErrorBoundary>
  )
}

export default App