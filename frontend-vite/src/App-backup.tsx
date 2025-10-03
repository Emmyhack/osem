import { Routes, Route } from 'react-router-dom'
import ErrorBoundary from './components/ErrorBoundary'

// Import integrated pages
import HomePage from './pages/HomePage'
import GroupsPageIntegrated from './pages/GroupsPageIntegrated'
import GroupDetailPageIntegrated from './pages/GroupDetailPageIntegrated'
import CreateGroupPage from './pages/CreateGroupPage'
import DashboardPage from './pages/DashboardPage'
import ProfilePageIntegrated from './pages/ProfilePageIntegrated'

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
          <Route path="/profile" element={<ProfilePageIntegrated />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </div>
    </ErrorBoundary>
  )
}

export default App