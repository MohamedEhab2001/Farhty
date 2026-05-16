import { useTemplateData, LoadingScreen, PasswordGate, PreviewBanner } from '@farhty/template-sdk'
import AdminDashboard from './components/AdminDashboard'
import Invitation from './components/Invitation'

export default function App() {
  const { instance, isLoading, isAuthenticated } = useTemplateData()
  const isAdminRoute = window.location.pathname === '/admin'

  if (isLoading || !instance) return <LoadingScreen bg="#e8f4f8" />

  if (isAdminRoute) {
    if (!isAuthenticated) return <PasswordGate />
    return <AdminDashboard />
  }

  return (
    <>
      {instance.isPreview && <PreviewBanner templateName="Bahr — دعوة بحرية" />}
      <Invitation />
    </>
  )
}
