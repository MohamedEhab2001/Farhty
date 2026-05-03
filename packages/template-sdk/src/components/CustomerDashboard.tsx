import { useState } from 'react'
import { useTemplateData } from '../hooks/useTemplateData.tsx'
import { useTemplateFieldsWithSave } from '../hooks/useTemplateFields'
import { TemplateField } from '../types'
import { api } from '../services/api'

export function CustomerDashboard() {
  const { instance, slug, fieldData, setFieldData } = useTemplateData()
  const { get, set, save } = useTemplateFieldsWithSave()
  const [open, setOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved' | 'error'>('idle')

  if (!instance) return null

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await save()
      setSaveStatus('saved')
      setTimeout(() => setSaveStatus('idle'), 2000)
    } catch {
      setSaveStatus('error')
      setTimeout(() => setSaveStatus('idle'), 3000)
    } finally {
      setIsSaving(false)
    }
  }

  const handleUpload = async (field: TemplateField, file: File) => {
    try {
      const tokenKey = `farhty_token_${slug}`
      const token = localStorage.getItem(tokenKey)
      // Get signed params
      const signRes = await api.post('/api/upload/sign',
        { folder: field.cloudinaryFolder || `instances/${slug}` },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      const { signature, timestamp, api_key: apiKey, cloud_name: cloudName } = signRes.data
      // Upload to Cloudinary
      const fd = new FormData()
      fd.append('file', file)
      fd.append('signature', signature)
      fd.append('timestamp', String(timestamp))
      fd.append('api_key', apiKey)
      fd.append('folder', field.cloudinaryFolder || `instances/${slug}`)
      const upRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/${field.type === 'audio' ? 'video' : 'image'}/upload`, {
        method: 'POST', body: fd
      })
      const upData = await upRes.json()
      set(field.key, upData.secure_url)
    } catch (e) {
      console.error('Upload failed', e)
    }
  }

  return (
    <>
      <style>{`
        .farhty-dashboard-panel {
          position: fixed; bottom: 80px; left: 16px; z-index: 9990;
          background: #1e1928; border: 1px solid #2e2840; border-radius: 20px;
          width: 320px; max-height: 70vh; overflow-y: auto;
          font-family: Cairo, sans-serif; direction: rtl;
          box-shadow: 0 20px 60px rgba(0,0,0,0.5);
        }
        .farhty-dashboard-toggle {
          position: fixed; bottom: 20px; left: 16px; z-index: 9991;
          width: 52px; height: 52px; border-radius: 50%;
          background: linear-gradient(135deg, #c8973a, #e8b857);
          border: none; cursor: pointer; font-size: 22px;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 4px 20px rgba(200,151,58,0.4);
          transition: transform 0.2s;
        }
        .farhty-dashboard-toggle:hover { transform: scale(1.08); }
        .farhty-field-label { font-size: 12px; color: #9d8fa8; margin-bottom: 4px; }
        .farhty-field-input {
          background: #0d0b0e; border: 1px solid #2e2840; color: #f0e8d8;
          border-radius: 8px; padding: 8px 10px; width: 100%;
          font-family: Cairo, sans-serif; font-size: 13px;
          outline: none; transition: border-color 0.2s;
        }
        .farhty-field-input:focus { border-color: #c8973a; }
        .farhty-save-btn {
          width: 100%; padding: 10px; border-radius: 10px;
          background: linear-gradient(135deg, #c8973a, #e8b857);
          color: #0d0b0e; font-weight: 900; font-size: 14px; border: none;
          cursor: pointer; font-family: Cairo, sans-serif;
          transition: opacity 0.2s;
        }
        .farhty-save-btn:disabled { opacity: 0.6; cursor: not-allowed; }
      `}</style>

      {/* Toggle button */}
      <button
        id="customer-dashboard-toggle"
        className="farhty-dashboard-toggle"
        onClick={() => setOpen(o => !o)}
        title="تعديل بياناتك"
      >
        {open ? '✕' : '✏️'}
      </button>

      {/* Panel */}
      {open && (
        <div id="customer-dashboard-panel" className="farhty-dashboard-panel">
          <div style={{ padding: '16px 16px 0', borderBottom: '1px solid #2e2840', marginBottom: 12 }}>
            <p style={{ color: '#e8b857', fontWeight: 700, fontSize: 14, margin: '0 0 12px' }}>
              ✏️ تعديل بياناتك
            </p>
          </div>

          <div style={{ padding: '0 16px 16px' }}>
            {instance.fields.map(field => (
              <div key={field.key} style={{ marginBottom: 14 }}>
                <p className="farhty-field-label">{field.label}</p>
                <FieldInput field={field} value={get(field.key)} onChange={v => set(field.key, v)} onUpload={handleUpload} />
              </div>
            ))}

            <button
              id="customer-dashboard-save-btn"
              className="farhty-save-btn"
              onClick={handleSave}
              disabled={isSaving}
              style={{ marginTop: 8 }}
            >
              {isSaving ? '⏳ جاري الحفظ...' :
               saveStatus === 'saved' ? '✓ تم الحفظ!' :
               saveStatus === 'error' ? '❌ فشل الحفظ' : 'حفظ التغييرات'}
            </button>
          </div>
        </div>
      )}
    </>
  )
}

// ─── Field Input by type ──────────────────────────────────────────────────────

interface FieldInputProps {
  field: TemplateField
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange: (v: any) => void
  onUpload: (field: TemplateField, file: File) => void
}

function FieldInput({ field, value, onChange, onUpload }: FieldInputProps) {
  switch (field.type) {
    case 'text':
      return <input className="farhty-field-input" value={value || ''} onChange={e => onChange(e.target.value)} />

    case 'date':
      return <input type="date" className="farhty-field-input" value={value || ''} onChange={e => onChange(e.target.value)} dir="ltr" />

    case 'color':
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <input type="color" value={value || '#000000'} onChange={e => onChange(e.target.value)}
            style={{ width: 40, height: 36, border: 'none', borderRadius: 6, cursor: 'pointer' }} />
          <span style={{ color: '#f0e8d8', fontSize: 12, fontFamily: 'monospace' }}>{value || '#000000'}</span>
        </div>
      )

    case 'boolean':
      return (
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
          <input type="checkbox" checked={!!value} onChange={e => onChange(e.target.checked)}
            style={{ width: 16, height: 16 }} />
          <span style={{ color: '#9d8fa8', fontSize: 13 }}>{value ? 'مفعّل' : 'معطّل'}</span>
        </label>
      )

    case 'image':
    case 'audio':
      return (
        <div>
          <input
            type="file"
            accept={field.type === 'image' ? 'image/*' : 'audio/*'}
            onChange={e => { const f = e.target.files?.[0]; if (f) onUpload(field, f) }}
            className="farhty-field-input"
            style={{ padding: '6px 10px', fontSize: 12 }}
          />
          {value && field.type === 'image' && (
            <img src={value} alt="" style={{ width: '100%', borderRadius: 8, marginTop: 8, maxHeight: 120, objectFit: 'cover' }} />
          )}
          {value && field.type === 'audio' && (
            <audio src={value} controls style={{ width: '100%', marginTop: 8 }} />
          )}
        </div>
      )

    case 'json':
      return (
        <textarea
          className="farhty-field-input"
          value={typeof value === 'string' ? value : JSON.stringify(value, null, 2)}
          onChange={e => {
            try {
              onChange(JSON.parse(e.target.value))
            } catch {
              onChange(e.target.value)
            }
          }}
          rows={4}
          placeholder='[ { "key": "value" } ]'
          style={{ resize: 'vertical', fontSize: 12, fontFamily: 'monospace' }}
        />
      )

    default:
      return <input className="farhty-field-input" value={value || ''} onChange={e => onChange(e.target.value)} />
  }
}
