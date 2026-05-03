// ─── Types ───────────────────────────────────────────────────────────────────
export type { FieldType, TemplateField, TemplateFeatures, InstanceData, SdkConfig } from './types'

// ─── Hooks ───────────────────────────────────────────────────────────────────
export { useTemplateData, TemplateProvider } from './hooks/useTemplateData.tsx'
export { useTemplateFields, useTemplateFieldsWithSave } from './hooks/useTemplateFields'
export { useInstanceAuth } from './hooks/useInstanceAuth'

// ─── Components ──────────────────────────────────────────────────────────────
export { LoadingScreen } from './components/LoadingScreen'
export { PasswordGate } from './components/PasswordGate'
export { PreviewBanner } from './components/PreviewBanner'
export { CustomerDashboard } from './components/CustomerDashboard'
