import { useContext } from 'react'
import { TemplateContext } from './useTemplateData.tsx'
import { api } from '../services/api'

export function useTemplateFields() {
  const { instance, fieldData, setFieldData, slug } = useContext(TemplateContext)

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
      { headers: { Authorization: `Bearer ${token}` } }
    )
  }

  const isSaving = false

  return { get, set, save, isSaving }
}

// Alias for backward compatibility
export const useTemplateFieldsWithSave = useTemplateFields
