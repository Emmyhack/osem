import { Routes, Route } from 'react-router-dom'
import ErrorBoundary from './components/ErrorBoundary'
import HomePage from './pages/HomePage'
import GroupsPageIntegrated from './pages/GroupsPageIntegrated'
import GroupDetailPageIntegrated from './pages/GroupDetailPageIntegrated'
import ProfilePageIntegrated from './pages/ProfilePageIntegrated'
import CreateGroupPage from './pages/CreateGroupPage'
import DashboardPage from './pages/DashboardPage'
import DebugPage from './pages/DebugPage'
import SimpleTestPage from './pages/SimpleTestPage'

function IntegratedApp() {
  console.log('IntegratedApp component rendering...')
  
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-900">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/debug" element={<DebugPage />} />
          <Route path="/test" element={<SimpleTestPage />} />
          <Route path="/groups" element={<GroupsPageIntegrated />} />
          <Route path="/groups/:id" element={<GroupDetailPageIntegrated />} />
          <Route path="/create" element={<CreateGroupPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/profile" element={<ProfilePageIntegrated />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </div>
    </ErrorBoundary>
  )
}

export default IntegratedApp