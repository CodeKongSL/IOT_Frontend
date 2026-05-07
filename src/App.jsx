import { useEffect } from 'react'
import DashboardLayout from './layouts/DashboardLayout'
import Dashboard from './pages/Dashboard'
import useUiStore from './store/useUiStore'

function App() {
  const { theme } = useUiStore()

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  return (
    <DashboardLayout>
      <Dashboard />
    </DashboardLayout>
  )
}

export default App
