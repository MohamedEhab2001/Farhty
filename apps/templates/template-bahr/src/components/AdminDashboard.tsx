import { useState } from 'react'
import { useTemplateData, useTemplateFields, api } from '@farhty/template-sdk'

type UploadState = 'idle' | 'uploading' | 'success' | 'error'

/* ─── Helpers ──────────────────────────────────────────────────────────────── */
function groupFields(fields: { group?: string; [k: string]: unknown }[]) {
  const map = new Map<string, typeof fields>()
  for (const f of fields) {
    const g = (f.group as string) || 'عام'
    if (!map.has(g)) map.set(g, [])
    map.get(g)!.push(f)
  }
  return Array.from(map.entries()).map(([name, fields]) => ({ name, fields }))
}

/* ─── Toggle switch ────────────────────────────────────────────────────────── */
function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      style={{
        width: 44, height: 24, borderRadius: 999,
        background: checked ? '#4a7fa5' : '#d1d5db',
        border: 'none', cursor: 'pointer', position: 'relative', transition: 'background 0.2s',
      }}
    >
      <span style={{
        position: 'absolute', top: 3, width: 18, height: 18, borderRadius: '50%',
        background: '#fff', transition: 'right 0.2s',
        right: checked ? 3 : 23,
      }} />
    </button>
  )
}

/* ─── Array field editor ───────────────────────────────────────────────────── */
function ArrayEditor({ field, value, onChange }: {
  field: { itemSchema?: { key: string; label: string; type: string; placeholder?: string }[] }
  value: Record<string, string>[]
  onChange: (v: Record<string, string>[]) => void
}) {
  const schema = field.itemSchema ?? []
  const addItem = () => onChange([...value, Object.fromEntries(schema.map(s => [s.key, '']))])
  const removeItem = (i: number) => onChange(value.filter((_, idx) => idx !== i))
  const updateItem = (i: number, key: string, val: string) => {
    const next = [...value]
    next[i] = { ...next[i], [key]: val }
    onChange(next)
  }

  return (
    <div className="space-y-3">
      {value.map((item, i) => (
        <div key={i} style={{ background: 'rgba(74,127,165,0.08)', borderRadius: 12, padding: '12px 14px', position: 'relative' }}>
          <button onClick={() => removeItem(i)} style={{ position: 'absolute', top: 8, left: 8, background: 'rgba(239,68,68,0.15)', border: 'none', color: '#ef4444', borderRadius: 6, width: 24, height: 24, cursor: 'pointer', fontSize: 14, fontWeight: 700 }}>×</button>
          <div className="grid grid-cols-2 gap-3 mt-1">
            {schema.map(s => (
              <div key={s.key}>
                <label style={{ display: 'block', fontSize: 11, color: '#4a7fa5', marginBottom: 4 }}>{s.label}</label>
                <input
                  type={s.type === 'time' ? 'time' : s.type === 'number' ? 'number' : 'text'}
                  value={item[s.key] ?? ''}
                  onChange={e => updateItem(i, s.key, e.target.value)}
                  placeholder={s.placeholder}
                  dir={s.type === 'time' ? 'ltr' : undefined}
                  style={{ width: '100%', background: '#fff', border: '1px solid rgba(200,169,110,0.3)', borderRadius: 8, padding: '6px 10px', fontSize: 13, color: '#1a3a4a', outline: 'none' }}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
      <button onClick={addItem} style={{ background: 'rgba(74,127,165,0.12)', border: '1px dashed rgba(74,127,165,0.4)', borderRadius: 10, padding: '8px 16px', color: '#4a7fa5', cursor: 'pointer', fontSize: 13, width: '100%' }}>
        + إضافة عنصر
      </button>
    </div>
  )
}

/* ─── Main Dashboard ───────────────────────────────────────────────────────── */
export default function AdminDashboard() {
  const { instance, slug } = useTemplateData()
  const { get, set, save, isSaving } = useTemplateFields()

  const [uploadStates, setUploadStates] = useState<Record<string, UploadState>>({})
  const [uploadErrors, setUploadErrors] = useState<Record<string, string>>({})
  const [showToast, setShowToast] = useState(false)

  const handleSave = async () => {
    await save()
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  const handleUpload = async (key: string, file: File, folder: string, isAudio = false) => {
    setUploadStates(prev => ({ ...prev, [key]: 'uploading' }))
    try {
      const token = localStorage.getItem(`farhty_token_${slug}`)
      const signRes = await api.post('/api/upload/sign', { folder }, { headers: { Authorization: `Bearer ${token}` } })
      const { signature, timestamp, apiKey, cloudName } = signRes.data

      if (!cloudName) throw new Error('cloud_name مفقود — تحقق من إعدادات الخادم')

      const fd = new FormData()
      fd.append('file', file)
      fd.append('signature', signature)
      fd.append('timestamp', String(timestamp))
      fd.append('api_key', apiKey)
      fd.append('folder', folder)

      const upRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/${isAudio ? 'video' : 'image'}/upload`, { method: 'POST', body: fd })
      const upData = await upRes.json()
      if (upData.error) throw new Error(upData.error.message || 'رفض Cloudinary الرفع')

      set(key, upData.secure_url)
      setUploadStates(prev => ({ ...prev, [key]: 'success' }))
      setTimeout(() => setUploadStates(prev => ({ ...prev, [key]: 'idle' })), 3000)
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'فشل الرفع'
      setUploadStates(prev => ({ ...prev, [key]: 'error' }))
      setUploadErrors(prev => ({ ...prev, [key]: msg }))
      setTimeout(() => {
        setUploadStates(prev => ({ ...prev, [key]: 'idle' }))
        setUploadErrors(prev => { const n = { ...prev }; delete n[key]; return n })
      }, 5000)
    }
  }

  /* ── Readable RSVP list ─────────────────────────────────────────────────── */
  const renderRsvpEntries = (val: unknown) => {
    const entries: { name?: string; attending?: boolean; guests?: number }[] =
      Array.isArray(val) ? val : (typeof val === 'string' ? JSON.parse(val || '[]') : [])

    const attending = entries.filter(e => e.attending !== false)
    const declined  = entries.filter(e => e.attending === false)
    const totalGuests = attending.reduce((s, e) => s + (Number(e.guests) || 1), 0)

    if (entries.length === 0) {
      return (
        <div style={{ textAlign: 'center', padding: '24px', background: '#f8fbfd', borderRadius: 12, border: '1px dashed rgba(74,127,165,0.25)', color: '#4a7fa5', fontSize: 13 }}>
          لا توجد ردود حتى الآن
        </div>
      )
    }

    return (
      <div>
        {/* Summary bar */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 14, flexWrap: 'wrap' }}>
          <span style={{ background: 'rgba(34,197,94,0.12)', color: '#16a34a', border: '1px solid rgba(34,197,94,0.25)', borderRadius: 999, padding: '4px 14px', fontSize: 12, fontWeight: 600 }}>
            ✓ {attending.length} سيحضر — {totalGuests} ضيف
          </span>
          {declined.length > 0 && (
            <span style={{ background: 'rgba(239,68,68,0.10)', color: '#dc2626', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 999, padding: '4px 14px', fontSize: 12, fontWeight: 600 }}>
              ✗ {declined.length} اعتذر
            </span>
          )}
          <span style={{ background: 'rgba(74,127,165,0.10)', color: '#4a7fa5', border: '1px solid rgba(74,127,165,0.2)', borderRadius: 999, padding: '4px 14px', fontSize: 12 }}>
            الإجمالي: {entries.length}
          </span>
        </div>
        {/* Entry cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {entries.map((e, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#fff', border: '1px solid rgba(74,127,165,0.15)', borderRadius: 10, padding: '10px 14px' }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0, background: e.attending !== false ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.10)' }}>
                {e.attending !== false ? '✓' : '✗'}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: '#1e4d6b' }}>{e.name || '—'}</p>
                {e.attending !== false && (
                  <p style={{ margin: 0, fontSize: 11, color: '#4a7fa5', marginTop: 2 }}>{e.guests ?? 1} {(e.guests ?? 1) === 1 ? 'ضيف' : 'ضيوف'}</p>
                )}
              </div>
              <span style={{ fontSize: 11, color: e.attending !== false ? '#16a34a' : '#dc2626', fontWeight: 600 }}>
                {e.attending !== false ? 'سيحضر' : 'اعتذر'}
              </span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  /* ── Readable Wish list ──────────────────────────────────────────────────── */
  const renderWishEntries = (val: unknown) => {
    const entries: { name?: string; message?: string }[] =
      Array.isArray(val) ? val : (typeof val === 'string' ? JSON.parse(val || '[]') : [])

    if (entries.length === 0) {
      return (
        <div style={{ textAlign: 'center', padding: '24px', background: '#f8fbfd', borderRadius: 12, border: '1px dashed rgba(74,127,165,0.25)', color: '#4a7fa5', fontSize: 13 }}>
          لا توجد تهاني حتى الآن
        </div>
      )
    }

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <p style={{ margin: 0, fontSize: 11, color: '#4a7fa5', marginBottom: 4 }}>{entries.length} تهنئة</p>
        {entries.map((e, i) => (
          <div key={i} style={{ background: '#fff', border: '1px solid rgba(74,127,165,0.15)', borderRadius: 12, padding: '12px 14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg,#e8f2f8,#c8e0ef)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, flexShrink: 0 }}>
                💌
              </div>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#1e4d6b' }}>{e.name || '—'}</span>
            </div>
            <p style={{ margin: 0, fontSize: 13, color: '#4a7fa5', lineHeight: 1.65, fontFamily: 'Amiri, serif' }}>{e.message || ''}</p>
          </div>
        ))}
      </div>
    )
  }

  const renderField = (field: Record<string, unknown>) => {
    const key      = field.key as string
    const type     = field.type as string
    const folder   = (field.cloudinaryFolder as string) || 'templates/template-bahr'
    const opts     = (field.options as { label: string; value: string }[]) ?? []
    const uState   = uploadStates[key] ?? 'idle'
    const val      = get(key)

    // Readable overrides — must come before the type switch
    if (key === 'rsvp_entries') return renderRsvpEntries(val)
    if (key === 'wish_entries') return renderWishEntries(val)

    const inputStyle: React.CSSProperties = {
      width: '100%', background: '#f8fbfd', border: '1px solid rgba(74,127,165,0.25)',
      borderRadius: 10, padding: '10px 14px', fontSize: 14, color: '#1a3a4a',
      outline: 'none', fontFamily: 'Poppins, sans-serif',
    }

    switch (type) {
      case 'text':
      case 'url':
        return (
          <input
            type={type === 'url' ? 'url' : 'text'}
            value={(val as string) ?? ''}
            onChange={e => set(key, e.target.value)}
            placeholder={field.placeholder as string}
            dir={type === 'url' ? 'ltr' : 'rtl'}
            style={inputStyle}
          />
        )
      case 'textarea':
        return (
          <textarea
            value={(val as string) ?? ''}
            onChange={e => set(key, e.target.value)}
            placeholder={field.placeholder as string}
            rows={4}
            style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.75, fontFamily: 'Amiri, serif' }}
          />
        )
      case 'number':
        return (
          <input type="number" value={(val as number) ?? 0} onChange={e => set(key, Number(e.target.value))}
            min={field.min as number} max={field.max as number} style={inputStyle} />
        )
      case 'date':
        return <input type="date" value={(val as string) ?? ''} onChange={e => set(key, e.target.value)} dir="ltr" style={inputStyle} />
      case 'time':
        return <input type="time" value={(val as string) ?? ''} onChange={e => set(key, e.target.value)} dir="ltr" style={inputStyle} />
      case 'color':
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <input type="color" value={(val as string) ?? '#c8a96e'} onChange={e => set(key, e.target.value)}
              style={{ width: 44, height: 44, borderRadius: 10, border: 'none', cursor: 'pointer', padding: 2 }} />
            <span style={{ fontFamily: 'monospace', color: '#4a7fa5', fontSize: 13 }}>{(val as string) ?? '#c8a96e'}</span>
          </div>
        )
      case 'boolean':
        return (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0' }}>
            <span style={{ fontSize: 14, color: '#1e4d6b' }}>{(val as boolean) !== false ? 'مفعّل' : 'معطّل'}</span>
            <Toggle checked={(val as boolean) !== false} onChange={v => set(key, v)} />
          </div>
        )
      case 'select':
        return (
          <select value={(val as string) ?? ''} onChange={e => set(key, e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
            {opts.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        )
      case 'iframe':
        return (
          <div>
            <input type="url" value={(val as string) ?? ''} onChange={e => set(key, e.target.value)}
              placeholder={field.placeholder as string} dir="ltr" style={inputStyle} />
            {(val as string) && (
              <div style={{ marginTop: 10, borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(74,127,165,0.2)' }}>
                <iframe src={val as string} width="100%" height="220" style={{ border: 'none', display: 'block' }} loading="lazy" />
              </div>
            )}
          </div>
        )
      case 'image':
        return (
          <div>
            <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'linear-gradient(135deg,#1e4d6b,#4a7fa5)', color: '#fff', padding: '10px 18px', borderRadius: 10, cursor: 'pointer', fontSize: 14, ...(uState === 'uploading' ? { opacity: 0.55, pointerEvents: 'none' as const } : {}) }}>
              {uState === 'uploading' ? 'جاري الرفع...' : '📷 اختر صورة'}
              <input type="file" accept="image/*" style={{ display: 'none' }} disabled={uState === 'uploading'}
                onChange={e => { const f = e.target.files?.[0]; if (f) handleUpload(key, f, folder) }} />
            </label>
            {uState === 'success' && <p style={{ color: '#22c55e', fontSize: 12, marginTop: 6 }}>✓ تم الرفع بنجاح</p>}
            {uState === 'error' && <p style={{ color: '#ef4444', fontSize: 12, marginTop: 6, background: 'rgba(239,68,68,0.08)', padding: '6px 10px', borderRadius: 6 }}>{uploadErrors[key]}</p>}
            {(val as string) && <img src={val as string} alt="" style={{ marginTop: 10, maxHeight: 140, maxWidth: '100%', borderRadius: 10, objectFit: 'cover' }} />}
          </div>
        )
      case 'audio':
        return (
          <div>
            <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'linear-gradient(135deg,#1e4d6b,#4a7fa5)', color: '#fff', padding: '10px 18px', borderRadius: 10, cursor: 'pointer', fontSize: 14, ...(uState === 'uploading' ? { opacity: 0.55, pointerEvents: 'none' as const } : {}) }}>
              {uState === 'uploading' ? 'جاري الرفع...' : '🎵 اختر ملف صوتي'}
              <input type="file" accept="audio/*" style={{ display: 'none' }} disabled={uState === 'uploading'}
                onChange={e => { const f = e.target.files?.[0]; if (f) handleUpload(key, f, folder, true) }} />
            </label>
            {uState === 'success' && <p style={{ color: '#22c55e', fontSize: 12, marginTop: 6 }}>✓ تم الرفع</p>}
            {uState === 'error' && <p style={{ color: '#ef4444', fontSize: 12, marginTop: 6 }}>{uploadErrors[key]}</p>}
            {(val as string) && <audio controls src={val as string} style={{ marginTop: 10, width: '100%', borderRadius: 8 }} />}
          </div>
        )
      case 'array': {
        const arrVal: Record<string, string>[] = Array.isArray(val) ? val : []
        return <ArrayEditor field={field as { itemSchema?: { key: string; label: string; type: string; placeholder?: string }[] }} value={arrVal} onChange={v => set(key, v)} />
      }
      case 'json':
        return (
          <textarea
            value={typeof val === 'string' ? val : JSON.stringify(val ?? [], null, 2)}
            onChange={e => { try { set(key, JSON.parse(e.target.value)) } catch { set(key, e.target.value) } }}
            rows={5}
            style={{ ...inputStyle, fontFamily: 'monospace', fontSize: 12, resize: 'vertical' }}
          />
        )
      default:
        return <input type="text" value={(val as string) ?? ''} onChange={e => set(key, e.target.value)} style={inputStyle} />
    }
  }

  const groups = groupFields(instance.fields as Record<string, unknown>[])

  return (
    <div dir="rtl" style={{ minHeight: '100vh', background: '#f0f6fa', fontFamily: 'Poppins, sans-serif' }}>
      {/* Toast */}
      {showToast && (
        <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 100, background: '#22c55e', color: '#fff', borderRadius: 12, padding: '12px 20px', fontSize: 14, fontWeight: 600, boxShadow: '0 8px 32px rgba(0,0,0,0.15)' }}>
          ✓ تم الحفظ بنجاح
        </div>
      )}

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg,#1e4d6b,#4a7fa5)', color: '#fff', padding: '20px 24px' }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, fontFamily: 'Amiri, serif', margin: 0 }}>لوحة التحكم — Bahr</h1>
        <p style={{ fontSize: 13, opacity: 0.7, margin: '4px 0 0' }}>تحرير بيانات الدعوة</p>
      </div>

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '24px 16px 120px' }}>
        {groups.map(group => (
          <div key={group.name} style={{ background: '#fff', borderRadius: 16, padding: '20px 20px', marginBottom: 20, boxShadow: '0 2px 12px rgba(30,77,107,0.08)' }}>
            {/* Group heading */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <div style={{ flex: 1, height: 1, background: 'linear-gradient(to left,transparent,rgba(74,127,165,0.3))' }} />
              <h2 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#1e4d6b', fontFamily: 'Amiri, serif', whiteSpace: 'nowrap' }}>{group.name}</h2>
              <div style={{ flex: 1, height: 1, background: 'linear-gradient(to right,transparent,rgba(74,127,165,0.3))' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              {group.fields.map(field => {
                const f = field as Record<string, unknown>
                return (
                  <div key={f.key as string}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                      <label style={{ fontSize: 13, fontWeight: 600, color: '#1e4d6b' }}>{f.label as string}</label>
                      {(f.required as boolean) && <span style={{ fontSize: 10, color: '#ef4444' }}>مطلوب</span>}
                    </div>
                    {renderField(f)}
                    {(f.hint as string) && (
                      <p style={{ fontSize: 11, color: '#4a7fa5', marginTop: 5, lineHeight: 1.6 }}>{f.hint as string}</p>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ))}

        {/* Save button */}
        <button
          onClick={handleSave}
          disabled={isSaving}
          style={{
            position: 'fixed', bottom: 24, right: '50%', transform: 'translateX(50%)',
            background: isSaving ? '#4a7fa5' : 'linear-gradient(135deg,#1e4d6b,#4a7fa5)',
            color: '#fff', border: 'none', borderRadius: 999, padding: '16px 40px',
            fontSize: 15, fontWeight: 700, cursor: 'pointer', boxShadow: '0 8px 24px rgba(30,77,107,0.35)',
            display: 'flex', alignItems: 'center', gap: 10, transition: 'all 0.2s',
            whiteSpace: 'nowrap', zIndex: 50,
          }}
        >
          {isSaving ? (
            <>
              <span style={{ width: 18, height: 18, border: '2.5px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} />
              جاري الحفظ...
            </>
          ) : '💾 حفظ التغييرات'}
        </button>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  )
}
