import ReactDOM from 'react-dom/client'
import MinimalDarkApp from './MinimalDarkApp'
import './index.css'

console.log('🌟 Loading OSEM Dark Theme Test...')

ReactDOM.createRoot(document.getElementById('root')!).render(
  <MinimalDarkApp />
)

console.log('✨ Dark theme test loaded successfully')