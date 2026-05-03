import { useContext } from 'react'
import { TemplateContext } from './useTemplateData.tsx'
import { api } from '../services/api'

export function useTemplateFields() {
  const { instance, fieldData, setFieldData } = useContext(TemplateContext)
  const [isSaving, setIsSaving] = [false, (_: boolean) => {}]

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const get = (key: string): any => {
    return fieldData[key] ?? instance?.fields.find(f => f.key === key)?.defaultValue ?? ''
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const set = (key: string, value: any) => {
    setFieldData(prev => ({ ...prev, [key]: value }))
  }

  return { get, set, isSaving }
}

// Hook with saving support — use this one in CustomerDashboard
export function useTemplateFieldsWithSave() {
  const { instance, fieldData, setFieldData, slug } = useContext(TemplateContext)
  const [_saving, _setSaving] = [false, (_: boolean) => {}]
  // We need a ref-based approach, so we use a closure trick with useState-like behavior
  // The actual saving state lives in CustomerDashboard component

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const get = (key: string): any => {
    return fieldData[key] ?? instance?.fields.find(f => f.key === key)?.defaultValue ?? ''
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const set = (key: string, value: any) => {
    setFieldData(prev => ({ ...prev, [key]: value }))
  }

  const save = async (): Promise<void> => {
    if (!instance) return
    const tokenKey = `farhty_token_${slug}`
    const token = localStorage.getItem(tokenKey)
    await api.patch(
      `/api/instances/${instance.instanceId}/data`,
      fieldData,
      { headers: { Authorization: `Bearer ${token}`, Host: window.location.hostname } }
    )
  }

  return { get, set, save }
}
