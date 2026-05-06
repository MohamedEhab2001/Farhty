import { useState } from 'react'
import { useTemplateData } from '../hooks/useTemplateData.tsx'
import { useTemplateFieldsWithSave } from '../hooks/useTemplateFields'
import { TemplateField } from '../types'
import { api } from '../services/api'

type UploadStatus = 'idle' | 'uploading' | 'success' | 'error'

export function CustomerDashboard() {
  const { instance, slug, fieldData, setFieldData } = useTemplateData()
  const { get, set, save } = useTemplateFieldsWithSave()
  const [open, setOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved' | 'error'>('idle')
  const [uploadStates, setUploadStates] = useState<Record<string, UploadStatus>>({})
  const [uploadErrors, setUploadErrors] = useState<Record<string, string>>({})

  if (!instance) return null

  const setUploadState = (key: string, status: UploadStatus, errorMsg?: string) => {
    setUploadStates(prev => ({ ...prev, [key]: status }))
    if (status === 'error' && errorMsg) {
      setUploadErrors(prev => ({ ...prev, [key]: errorMsg }))
      setTimeout(() => {
        setUploadStates(prev => ({ ...prev, [key]: 'idle' }))
        setUploadErrors(prev => { const n = { ...prev }; delete n[key]; return n })
      }, 5000)
    } else if (status === 'success') {
      setTimeout(() => setUploadStates(prev => ({ ...prev, [key]: 'idle' })), 3000)
    }
  }

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
    setUploadState(field.key, 'uploading')
    try {
      const tokenKey = `farhty_token_${slug}`
      const token = localStorage.getItem(tokenKey)
      const signRes = await api.post('/api/upload/sign',
        { folder: field.cloudinaryFolder || `instances/${slug}` },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      const { signature, timestamp, apiKey, cloudName, folder } = signRes.data

      if (!cloudName) {
        throw new Error('cloud_name is missing from sign response — server misconfigured')
      }

      const fd = new FormData()
      fd.append('file', file)
      fd.append('signature', signature)
      fd.append('timestamp', String(timestamp))
      fd.append('api_key', apiKey)
      fd.append('folder', folder || field.cloudinaryFolder || `instances/${slug}`)
      const upRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/${field.type === 'audio' ? 'video' : 'image'}/upload`, {
        method: 'POST', body: fd
      })
      const upData = await upRes.json()
      if (upData.error) {
        throw new Error(upData.error.message || 'Upload rejected by Cloudinary')
      }
      set(field.key, upData.secure_url)
      setUploadState(field.key, 'success')
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Upload failed'
      setUploadState(field.key, 'error', msg)
    }
  }

  // Group fields by their group property
  const groupedFields: { group: string; fields: TemplateField[] }[] = []
  const groupMap = new Map<string, TemplateField[]>()
  for (const field of instance.fields) {
    const g = field.group || ''
    if (!groupMap.has(g)) {
      groupMap.set(g, [])
      groupedFields.push({ group: g, fields: groupMap.get(g)! })
    }
    groupMap.get(g)!.push(field)
  }

  return (
    <>
      <style>{`
        .farhty-dashboard-panel {
          position: fixed; bottom: 80px; left: 16px; z-index: 9990;
          background: #1e1928; border: 1px solid #2e2840; border-radius: 20px;
          width: 340px; max-height: 70vh; overflow-y: auto;
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
        .farhty-field-hint { font-size: 10px; color: #6b5f75; margin-top: 2px; }
        .farhty-field-input {
          background: #0d0b0e; border: 1px solid #2e2840; color: #f0e8d8;
          border-radius: 8px; padding: 8px 10px; width: 100%;
          font-family: Cairo, sans-serif; font-size: 13px;
          outline: none; transition: border-color 0.2s;
          box-sizing: border-box;
        }
        .farhty-field-input:focus { border-color: #c8973a; }
        .farhty-field-select {
          background: #0d0b0e; border: 1px solid #2e2840; color: #f0e8d8;
          border-radius: 8px; padding: 8px 10px; width: 100%;
          font-family: Cairo, sans-serif; font-size: 13px;
          outline: none; cursor: pointer; box-sizing: border-box;
        }
        .farhty-group-header {
          font-size: 13px; color: #e8b857; font-weight: 700;
          padding: 10px 16px 6px; border-top: 1px solid #2e2840;
          margin-top: 4px;
        }
        .farhty-group-header:first-child { border-top: none; margin-top: 0; }
        .farhty-save-btn {
          width: 100%; padding: 10px; border-radius: 10px;
          background: linear-gradient(135deg, #c8973a, #e8b857);
          color: #0d0b0e; font-weight: 900; font-size: 14px; border: none;
          cursor: pointer; font-family: Cairo, sans-serif;
          transition: opacity 0.2s;
        }
        .farhty-save-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .farhty-upload-btn {
          display: block; width: 100%; padding: 8px; border-radius: 8px;
          background: #2e2840; border: 1px dashed #c8973a; color: #e8b857;
          font-family: Cairo, sans-serif; font-size: 12px;
          cursor: pointer; text-align: center; transition: opacity 0.2s;
        }
        .farhty-upload-btn:disabled { opacity: 0.5; pointer-events: none; }
        .farhty-upload-status {
          font-size: 11px; margin-top: 4px; text-align: center;
          font-family: Cairo, sans-serif;
        }
        .farhty-upload-error {
          background: rgba(248,113,113,0.15); border: 1px solid #f87171;
          border-radius: 6px; padding: 6px 8px; margin-top: 6px;
          font-size: 11px; color: #f87171; font-family: Cairo, sans-serif;
          word-break: break-word;
        }
        .farhty-array-item {
          background: #15111a; border: 1px solid #2e2840; border-radius: 10px;
          padding: 10px; margin-bottom: 8px; position: relative;
        }
        .farhty-array-remove {
          position: absolute; top: 6px; left: 6px; width: 20px; height: 20px;
          border-radius: 50%; background: #f8717133; border: none;
          color: #f87171; font-size: 12px; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
        }
        .farhty-array-add {
          width: 100%; padding: 6px; border-radius: 8px;
          background: transparent; border: 1px dashed #c8973a44;
          color: #c8973a; font-family: Cairo, sans-serif; font-size: 12px;
          cursor: pointer; transition: border-color 0.2s;
        }
        .farhty-array-add:hover { border-color: #c8973a; }
      `}</style>

      {/* Toggle button */}
      <button
        id="customer-dashboard-toggle"
        className="farhty-dashboard-toggle"
        onClick={() => setOpen(o => !o)}
        title="تعديل بياناتك"
      >
        {open ? '\u2715' : '\u270F\uFE0F'}
      </button>

      {/* Panel */}
      {open && (
        <div id="customer-dashboard-panel" className="farhty-dashboard-panel">
          <div style={{ padding: '16px 16px 0', borderBottom: '1px solid #2e2840', marginBottom: 4 }}>
            <p style={{ color: '#e8b857', fontWeight: 700, fontSize: 14, margin: '0 0 12px' }}>
              تعديل بياناتك
            </p>
          </div>

          {groupedFields.map(({ group, fields }) => (
            <div key={group}>
              {group && <div className="farhty-group-header">{group}</div>}
              <div style={{ padding: '0 16px' }}>
                {fields.map(field => (
                  <div key={field.key} style={{ marginBottom: 14 }}>
                    <p className="farhty-field-label">{field.label}</p>
                    <FieldInput
                      field={field}
                      value={get(field.key)}
                      onChange={v => set(field.key, v)}
                      onUpload={handleUpload}
                      uploadStatus={uploadStates[field.key] || 'idle'}
                      uploadError={uploadErrors[field.key]}
                    />
                    {field.hint && <p className="farhty-field-hint">{field.hint}</p>}
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div style={{ padding: '8px 16px 16px' }}>
            <button
              id="customer-dashboard-save-btn"
              className="farhty-save-btn"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? 'جاري الحفظ...' :
               saveStatus === 'saved' ? 'تم الحفظ!' :
               saveStatus === 'error' ? 'فشل الحفظ' : 'حفظ التغييرات'}
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
  uploadStatus: UploadStatus
  uploadError?: string
}

function FieldInput({ field, value, onChange, onUpload, uploadStatus, uploadError }: FieldInputProps) {
  switch (field.type) {
    case 'text':
      return <input className="farhty-field-input" value={value || ''} onChange={e => onChange(e.target.value)} placeholder={field.placeholder} />

    case 'textarea':
      return <textarea className="farhty-field-input" value={value || ''} onChange={e => onChange(e.target.value)} placeholder={field.placeholder} rows={3} style={{ resize: 'vertical' }} />

    case 'number':
      return <input type="number" className="farhty-field-input" value={value ?? ''} onChange={e => onChange(e.target.value === '' ? '' : Number(e.target.value))} placeholder={field.placeholder} min={field.min ?? undefined} max={field.max ?? undefined} dir="ltr" />

    case 'url':
      return <input type="url" className="farhty-field-input" value={value || ''} onChange={e => onChange(e.target.value)} placeholder={field.placeholder || 'https://...'} dir="ltr" />

    case 'iframe':
      return (
        <div>
          <input type="url" className="farhty-field-input" value={value || ''} onChange={e => onChange(e.target.value)} placeholder={field.placeholder || 'https://www.google.com/maps/embed?...'} dir="ltr" />
          {value && (
            <div style={{ marginTop: 8, borderRadius: 8, overflow: 'hidden', border: '1px solid #2e2840' }}>
              <iframe src={value} style={{ width: '100%', height: 120, border: 'none' }} title={field.label} loading="lazy" />
            </div>
          )}
        </div>
      )

    case 'select':
      return (
        <select className="farhty-field-select" value={value || ''} onChange={e => onChange(e.target.value)}>
          <option value="">{field.placeholder || 'اختر...'}</option>
          {(field.options || []).map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      )

    case 'time':
      return <input type="time" className="farhty-field-input" value={value || ''} onChange={e => onChange(e.target.value)} dir="ltr" />

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
    case 'audio': {
      const isUploading = uploadStatus === 'uploading'
      return (
        <div>
          <label
            className="farhty-upload-btn"
            style={isUploading ? { opacity: 0.5, pointerEvents: 'none' } : {}}
          >
            {isUploading ? 'جاري الرفع...' : field.type === 'image' ? 'اختر صورة' : 'اختر ملف صوتي'}
            <input
              type="file"
              accept={field.type === 'image' ? 'image/*' : 'audio/*'}
              onChange={e => { const f = e.target.files?.[0]; if (f) onUpload(field, f) }}
              style={{ display: 'none' }}
              disabled={isUploading}
            />
          </label>
          {uploadStatus === 'success' && (
            <p className="farhty-upload-status" style={{ color: '#4ade80' }}>تم الرفع بنجاح</p>
          )}
          {uploadStatus === 'error' && uploadError && (
            <div className="farhty-upload-error">{uploadError}</div>
          )}
          {value && field.type === 'image' && (
            <img src={value} alt="" style={{ width: '100%', borderRadius: 8, marginTop: 8, maxHeight: 120, objectFit: 'cover' }} />
          )}
          {value && field.type === 'audio' && (
            <audio src={value} controls style={{ width: '100%', marginTop: 8 }} />
          )}
        </div>
      )
    }

    case 'array':
      return <ArrayFieldInput field={field} value={value} onChange={onChange} />

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
          placeholder={field.placeholder || '[ { "key": "value" } ]'}
          style={{ resize: 'vertical', fontSize: 12, fontFamily: 'monospace' }}
        />
      )

    default:
      return <input className="farhty-field-input" value={value || ''} onChange={e => onChange(e.target.value)} placeholder={field.placeholder} />
  }
}

// ─── Array Field with proper UX ──────────────────────────────────────────────

function ArrayFieldInput({ field, value, onChange }: {
  field: TemplateField
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange: (v: any) => void
}) {
  const items: Record<string, string>[] = Array.isArray(value) ? value :
    (typeof value === 'string' ? (() => { try { return JSON.parse(value) } catch { return [] } })() : [])

  const schema = field.itemSchema || []

  const addItem = () => {
    const empty: Record<string, string> = {}
    for (const s of schema) empty[s.key] = ''
    onChange([...items, empty])
  }

  const removeItem = (idx: number) => {
    onChange(items.filter((_, i) => i !== idx))
  }

  const updateItem = (idx: number, key: string, val: string) => {
    const updated = items.map((item, i) => i === idx ? { ...item, [key]: val } : item)
    onChange(updated)
  }

  return (
    <div>
      {items.map((item, idx) => (
        <div key={idx} className="farhty-array-item">
          <button className="farhty-array-remove" onClick={() => removeItem(idx)} title="حذف">&times;</button>
          {schema.map(s => (
            <div key={s.key} style={{ marginBottom: 6 }}>
              <p style={{ fontSize: 10, color: '#6b5f75', marginBottom: 2 }}>{s.label}</p>
              {s.type === 'time' ? (
                <input type="time" className="farhty-field-input" value={item[s.key] || ''} onChange={e => updateItem(idx, s.key, e.target.value)} dir="ltr" style={{ fontSize: 12, padding: '5px 8px' }} />
              ) : (
                <input className="farhty-field-input" value={item[s.key] || ''} onChange={e => updateItem(idx, s.key, e.target.value)} placeholder={s.placeholder} style={{ fontSize: 12, padding: '5px 8px' }} />
              )}
            </div>
          ))}
        </div>
      ))}
      <button className="farhty-array-add" onClick={addItem}>+ إضافة</button>
    </div>
  )
}
