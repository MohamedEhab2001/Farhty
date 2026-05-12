import { useState } from 'react'
import { useTemplateData, useTemplateFieldsWithSave, api } from '@farhty/template-sdk'
import type { TemplateField } from '@farhty/template-sdk'

type UploadStatus = 'idle' | 'uploading' | 'success' | 'error'

async function uploadToCloudinary(file: File, folder: string, slug: string, isAudio = false): Promise<string> {
  const token = localStorage.getItem(`farhty_token_${slug}`)
  const signRes = await api.post('/api/upload/sign', { folder }, { headers: { Authorization: `Bearer ${token}` } })
  const { signature, timestamp, apiKey, cloudName } = signRes.data
  if (!cloudName) throw new Error('cloud_name missing — server misconfigured')

  const fd = new FormData()
  fd.append('file', file)
  fd.append('signature', signature)
  fd.append('timestamp', String(timestamp))
  fd.append('api_key', apiKey)
  fd.append('folder', folder)

  const upRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/${isAudio ? 'video' : 'image'}/upload`, { method: 'POST', body: fd })
  const upData = await upRes.json()
  if (upData.error) throw new Error(upData.error.message || 'Cloudinary rejected upload')
  return upData.secure_url as string
}

function parseJSONArray(raw: unknown): any[] {
  if (Array.isArray(raw)) return raw
  if (typeof raw === 'string' && raw.trim()) {
    try {
      const parsed = JSON.parse(raw)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  }
  return []
}

function parseImages(raw: unknown): string[] {
  return parseJSONArray(raw).filter(Boolean).map(String)
}

const s = (val: unknown): string => {
  if (typeof val === 'string') return val
  if (val === null || val === undefined) return ''
  return String(val)
}

export default function AdminDashboard() {
  const { instance, slug } = useTemplateData()
  const { get, set, save } = useTemplateFieldsWithSave()
  const [saving, setSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved' | 'error'>('idle')
  const [uploadStates, setUploadStates] = useState<Record<string, UploadStatus>>({})
  const [uploadErrors, setUploadErrors] = useState<Record<string, string>>({})

  if (!instance) return null

  const handleUpload = async (key: string, file: File, folder: string, isAudio = false) => {
    setUploadStates(prev => ({ ...prev, [key]: 'uploading' }))
    setUploadErrors(prev => { const n = { ...prev }; delete n[key]; return n })
    try {
      const url = await uploadToCloudinary(file, folder, slug, isAudio)
      set(key, url)
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

  const handleArrayUpload = async (key: string, file: File, folder: string) => {
    setUploadStates(prev => ({ ...prev, [key + '_add']: 'uploading' }))
    try {
      const url = await uploadToCloudinary(file, folder, slug)
      const existing = parseImages(get(key))
      set(key, [...existing, url])
      setUploadStates(prev => ({ ...prev, [key + '_add']: 'success' }))
      setTimeout(() => setUploadStates(prev => ({ ...prev, [key + '_add']: 'idle' })), 2500)
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'فشل الرفع'
      setUploadStates(prev => ({ ...prev, [key + '_add']: 'error' }))
      setUploadErrors(prev => ({ ...prev, [key + '_add']: msg }))
      setTimeout(() => {
        setUploadStates(prev => ({ ...prev, [key + '_add']: 'idle' }))
        setUploadErrors(prev => { const n = { ...prev }; delete n[key + '_add']; return n })
      }, 5000)
    }
  }

  const removeImage = (key: string, index: number) => {
    const arr = parseImages(get(key))
    arr.splice(index, 1)
    set(key, [...arr])
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await save()
      setSaveStatus('saved')
      setTimeout(() => setSaveStatus('idle'), 2000)
    } catch {
      setSaveStatus('error')
      setTimeout(() => setSaveStatus('idle'), 3000)
    } finally {
      setSaving(false)
    }
  }

  const fields = instance.fields || []
  const groups: Record<string, TemplateField[]> = {}
  const ungrouped: TemplateField[] = []

  fields.forEach((f: TemplateField) => {
    if (f.type === 'audio' || f.type === 'color' || f.key === 'music_file' || f.key === 'audio_url' || f.key === 'music_on' || f.group === 'الموسيقى' || f.group === 'الإعدادات') return
    const g = f.group || 'عام'
    if (!groups[g]) groups[g] = []
    groups[g].push(f)
    if (!f.group) ungrouped.push(f)
  })

  if (ungrouped.length > 0 && !groups['عام']) {
    groups['عام'] = ungrouped
  } else if (ungrouped.length > 0) {
    const existing = groups['عام'] || []
    groups['عام'] = [...existing, ...ungrouped]
  }

  const renderField = (field: TemplateField) => {
    const val = get(field.key) ?? field.defaultValue ?? ''
    const isUploading = uploadStates[field.key] === 'uploading'

    switch (field.type) {
      case 'text':
        return (
          <div key={field.key} className="mb-5">
            <label className="block text-warm-dark/70 text-sm mb-2 font-body">{field.label}</label>
            <input
              type="text"
              value={s(val)}
              onChange={e => set(field.key, e.target.value)}
              placeholder={field.placeholder}
              className="areej-input"
            />
            {field.hint && <p className="text-warm-dark/30 text-xs mt-1">{field.hint}</p>}
          </div>
        )

      case 'textarea':
        return (
          <div key={field.key} className="mb-5">
            <label className="block text-warm-dark/70 text-sm mb-2 font-body">{field.label}</label>
            <textarea
              value={s(val)}
              onChange={e => set(field.key, e.target.value)}
              placeholder={field.placeholder}
              rows={3}
              className="areej-input resize-none"
            />
          </div>
        )

      case 'number':
        return (
          <div key={field.key} className="mb-5">
            <label className="block text-warm-dark/70 text-sm mb-2 font-body">{field.label}</label>
            <input
              type="number"
              value={s(val)}
              onChange={e => set(field.key, Number(e.target.value))}
              min={field.min ?? undefined}
              max={field.max ?? undefined}
              placeholder={field.placeholder}
              className="areej-input"
              dir="ltr"
            />
          </div>
        )

      case 'url':
        return (
          <div key={field.key} className="mb-5">
            <label className="block text-warm-dark/70 text-sm mb-2 font-body">{field.label}</label>
            <input
              type="url"
              value={s(val)}
              onChange={e => set(field.key, e.target.value)}
              placeholder={field.placeholder}
              className="areej-input"
              dir="ltr"
            />
          </div>
        )

      case 'iframe':
        return (
          <div key={field.key} className="mb-5">
            <label className="block text-warm-dark/70 text-sm mb-2 font-body">{field.label}</label>
            <input
              type="url"
              value={s(val)}
              onChange={e => set(field.key, e.target.value)}
              placeholder={field.placeholder || 'https://www.google.com/maps/embed?...'}
              className="areej-input"
              dir="ltr"
            />
            {field.hint && <p className="text-warm-dark/30 text-xs mt-1">{field.hint}</p>}
            {s(val) && (
              <div className="mt-3 rounded-xl overflow-hidden border border-rose/10">
                <iframe
                  src={s(val)}
                  width="100%"
                  height="200"
                  style={{ border: 'none', filter: 'invert(90%) hue-rotate(180deg) brightness(0.9) contrast(1.1)' }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={field.label}
                />
              </div>
            )}
          </div>
        )

      case 'select':
        return (
          <div key={field.key} className="mb-5">
            <label className="block text-warm-dark/70 text-sm mb-2 font-body">{field.label}</label>
            <select
              value={s(val)}
              onChange={e => set(field.key, e.target.value)}
              className="areej-input bg-transparent"
            >
              {(field.options || []).map(opt => (
                <option key={opt.value} value={opt.value} className="bg-charcoal text-warm-dark">{opt.label}</option>
              ))}
            </select>
          </div>
        )

      case 'time':
        return (
          <div key={field.key} className="mb-5">
            <label className="block text-warm-dark/70 text-sm mb-2 font-body">{field.label}</label>
            <input
              type="time"
              value={s(val)}
              onChange={e => set(field.key, e.target.value)}
              className="areej-input"
              dir="ltr"
            />
          </div>
        )

      case 'date':
        return (
          <div key={field.key} className="mb-5">
            <label className="block text-warm-dark/70 text-sm mb-2 font-body">{field.label}</label>
            <input
              type="date"
              value={s(val)}
              onChange={e => set(field.key, e.target.value)}
              className="areej-input"
              dir="ltr"
            />
          </div>
        )

      case 'color':
        return (
          <div key={field.key} className="mb-5">
            <label className="block text-warm-dark/70 text-sm mb-2 font-body">{field.label}</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={s(val) || '#C9A96E'}
                onChange={e => set(field.key, e.target.value)}
                className="w-12 h-9 border-0 cursor-pointer bg-transparent"
              />
              <span className="font-mono text-warm-dark/50 text-sm">{s(val) || '#C9A96E'}</span>
            </div>
          </div>
        )

      case 'boolean':
        return (
          <div key={field.key} className="mb-5 flex items-center justify-between">
            <label className="text-warm-dark/70 text-sm font-body">{field.label}</label>
            <button
              onClick={() => set(field.key, !get(field.key))}
              className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${get(field.key) ? 'bg-rose' : 'bg-ivory/20'}`}
            >
              <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform duration-300 ${get(field.key) ? 'translate-x-0' : '-translate-x-6'}`} />
            </button>
          </div>
        )

      case 'image': {
        const folder = field.cloudinaryFolder || `templates/areej/${field.key}`
        return (
          <div key={field.key} className="mb-5">
            <label className="block text-warm-dark/70 text-sm mb-2 font-body">{field.label}</label>
            <label
              className="inline-block px-4 py-2 border border-rose/30 rounded-xl text-rose/80 text-sm font-body cursor-pointer hover:bg-rose/10 transition-colors"
              style={isUploading ? { opacity: 0.5, pointerEvents: 'none' } : {}}
            >
              {isUploading ? 'جاري الرفع...' : 'اختر صورة'}
              <input
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                disabled={isUploading}
                onChange={e => { const f = e.target.files?.[0]; if (f) handleUpload(field.key, f, folder) }}
              />
            </label>
            {uploadStates[field.key] === 'success' && <p className="text-green-400 text-sm mt-2">تم الرفع بنجاح</p>}
            {uploadStates[field.key] === 'error' && <p className="text-red-400 text-sm mt-2 bg-red-400/10 p-2 rounded">{uploadErrors[field.key]}</p>}
            {s(val) && <img src={s(val)} alt="" className="mt-3 rounded-xl max-w-xs max-h-40 object-cover border border-rose/10" />}
          </div>
        )
      }

      case 'audio': {
        const folder = field.cloudinaryFolder || `templates/areej/${field.key}`
        return (
          <div key={field.key} className="mb-5">
            <label className="block text-warm-dark/70 text-sm mb-2 font-body">{field.label}</label>
            <label
              className="inline-block px-4 py-2 border border-rose/30 rounded-xl text-rose/80 text-sm font-body cursor-pointer hover:bg-rose/10 transition-colors"
              style={uploadStates[field.key] === 'uploading' ? { opacity: 0.5, pointerEvents: 'none' } : {}}
            >
              {uploadStates[field.key] === 'uploading' ? 'جاري الرفع...' : 'اختر ملف صوتي'}
              <input
                type="file"
                accept="audio/*"
                style={{ display: 'none' }}
                disabled={uploadStates[field.key] === 'uploading'}
                onChange={e => { const f = e.target.files?.[0]; if (f) handleUpload(field.key, f, folder, true) }}
              />
            </label>
            {uploadStates[field.key] === 'success' && <p className="text-green-400 text-sm mt-2">تم الرفع بنجاح</p>}
            {uploadStates[field.key] === 'error' && <p className="text-red-400 text-sm mt-2 bg-red-400/10 p-2 rounded">{uploadErrors[field.key]}</p>}
            {s(val) && <audio src={s(val)} controls className="mt-3 w-full" />}
          </div>
        )
      }

      case 'array': {
        const items: any[] = Array.isArray(get(field.key)) ? get(field.key) : (field.defaultValue || [])
        return (
          <div key={field.key} className="mb-5">
            <label className="block text-warm-dark/70 text-sm mb-3 font-body">{field.label}</label>
            {items.map((item: any, idx: number) => (
              <div key={idx} className="glass-panel rounded-xl p-4 mb-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-warm-dark/50 text-xs">{field.label} {idx + 1}</span>
                  <button
                    onClick={() => {
                      const updated = [...items]
                      updated.splice(idx, 1)
                      set(field.key, updated)
                    }}
                    className="text-red-400/70 hover:text-red-400 text-sm"
                  >
                    حذف
                  </button>
                </div>
                {(field.itemSchema || []).map((sch: any) => (
                  <div key={sch.key} className="mb-2">
                    <label className="text-warm-dark/40 text-xs">{sch.label}</label>
                    {sch.type === 'time' ? (
                      <input
                        type="time"
                        value={item[sch.key] || ''}
                        onChange={e => {
                          const updated = [...items]
                          updated[idx] = { ...updated[idx], [sch.key]: e.target.value }
                          set(field.key, updated)
                        }}
                        className="areej-input text-sm"
                        dir="ltr"
                      />
                    ) : (
                      <input
                        type="text"
                        value={item[sch.key] || ''}
                        onChange={e => {
                          const updated = [...items]
                          updated[idx] = { ...updated[idx], [sch.key]: e.target.value }
                          set(field.key, updated)
                        }}
                        placeholder={sch.placeholder}
                        className="areej-input text-sm"
                      />
                    )}
                  </div>
                ))}
              </div>
            ))}
            <button
              onClick={() => {
                const newItem: any = {}
                ;(field.itemSchema || []).forEach((sch: any) => { newItem[sch.key] = '' })
                set(field.key, [...items, newItem])
              }}
              className="text-rose/70 text-sm font-body hover:text-rose transition-colors"
            >
              + إضافة
            </button>
          </div>
        )
      }

      case 'json': {
        if (field.key === 'wish_entries' || field.key === 'rsvp_entries' || field.key === 'wishes') {
          const items = parseJSONArray(val)
          return (
            <div key={field.key} className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <label className="text-warm-dark/70 text-sm font-body">{field.label}</label>
              </div>
              <div className="glass-panel rounded-2xl overflow-hidden border border-rose/10 bg-white/30">
                <div className="overflow-x-auto">
                  <table className="w-full text-right border-collapse">
                    <thead className="bg-rose/5 text-rose/70 text-[10px] font-body uppercase tracking-wider">
                      {field.key.includes('wish') ? (
                        <tr>
                          <th className="p-4 font-semibold">الاسم</th>
                          <th className="p-4 font-semibold">الرسالة</th>
                          <th className="p-4 w-16"></th>
                        </tr>
                      ) : (
                        <tr>
                          <th className="p-4 font-semibold">الاسم</th>
                          <th className="p-4 font-semibold text-center">الحضور</th>
                          <th className="p-4 font-semibold text-center">الضيوف</th>
                          <th className="p-4 w-16"></th>
                        </tr>
                      )}
                    </thead>
                    <tbody className="divide-y divide-rose/5">
                      {items.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="p-10 text-center">
                            <div className="flex flex-col items-center gap-2 opacity-30">
                              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                              </svg>
                              <span className="text-xs font-body">لا يوجد بيانات حالياً</span>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        items.map((item: any, idx: number) => (
                          <tr key={idx} className="hover:bg-rose/5 transition-colors group">
                            <td className="p-4 text-warm-dark text-sm font-body font-medium">{item.name || 'مجهول'}</td>
                            {field.key.includes('wish') ? (
                              <td className="p-4 text-warm-dark/60 text-xs leading-relaxed max-w-xs">{item.message}</td>
                            ) : (
                              <>
                                <td className="p-4 text-center">
                                  <span className={`inline-block text-[10px] px-2 py-0.5 rounded-full font-body ${item.attending ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    {item.attending ? 'سيحضر' : 'لن يحضر'}
                                  </span>
                                </td>
                                <td className="p-4 text-center text-warm-dark/60 text-xs font-mono">{item.guests || 0}</td>
                              </>
                            )}
                            <td className="p-4 text-center">
                              <button
                                onClick={() => {
                                  const updated = [...items]
                                  updated.splice(idx, 1)
                                  set(field.key, updated)
                                }}
                                className="text-red-400/40 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                title="حذف"
                              >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <polyline points="3 6 5 6 21 6"></polyline>
                                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                </svg>
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )
        }
        if (field.key === 'gallery_images') {
          const images = parseImages(get(field.key))
          return (
            <div key={field.key} className="mb-5">
              <label className="block text-warm-dark/70 text-sm mb-2 font-body">{field.label}</label>
              <label
                className="inline-block px-4 py-2 border border-rose/30 rounded-xl text-rose/80 text-sm font-body cursor-pointer hover:bg-rose/10 transition-colors"
                style={uploadStates[field.key + '_add'] === 'uploading' ? { opacity: 0.5, pointerEvents: 'none' } : {}}
              >
                {uploadStates[field.key + '_add'] === 'uploading' ? 'جاري الرفع...' : '+ إضافة صورة'}
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  disabled={uploadStates[field.key + '_add'] === 'uploading'}
                  onChange={e => { const f = e.target.files?.[0]; if (f) handleArrayUpload(field.key, f, field.cloudinaryFolder || 'templates/areej/gallery') }}
                />
              </label>
              {images.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mt-3">
                  {images.map((img: string, i: number) => (
                    <div key={i} className="relative group">
                      <img src={img} alt="" className="w-full h-24 object-cover rounded-lg border border-rose/10" />
                      <button
                        onClick={() => removeImage(field.key, i)}
                        className="absolute top-1 left-1 w-5 h-5 bg-red-500/80 rounded-full text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        x
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        }
        return (
          <div key={field.key} className="mb-5">
            <label className="block text-warm-dark/70 text-sm mb-2 font-body">{field.label}</label>
            <textarea
              value={typeof val === 'string' ? val : JSON.stringify(val, null, 2)}
              onChange={e => {
                try { set(field.key, JSON.parse(e.target.value)) } catch { set(field.key, e.target.value) }
              }}
              rows={4}
              className="areej-input resize-none font-mono text-sm"
              dir="ltr"
            />
            {field.hint && <p className="text-warm-dark/30 text-xs mt-1">{field.hint}</p>}
          </div>
        )
      }

      default:
        return (
          <div key={field.key} className="mb-5">
            <label className="block text-warm-dark/70 text-sm mb-2 font-body">{field.label}</label>
            <input
              type="text"
              value={s(val)}
              onChange={e => set(field.key, e.target.value)}
              className="areej-input"
            />
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-[#FFF9F5]" style={{ fontFamily: 'Tajawal, sans-serif', direction: 'rtl' }}>
      <div className="bg-gradient-to-b from-white to-[#FFF9F5] py-8 px-4 text-center border-b border-rose/10">
        <h1 className="font-display text-2xl rose-shimmer">أريج — لوحة التحكم</h1>
        <p className="text-warm-dark/40 text-sm mt-1 font-body">إدارة محتوى الدعوة</p>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-10 space-y-8">
        {Object.entries(groups).map(([group, groupFields]) => (
          <div key={group} className="glass-panel rounded-[2rem] p-6 md:p-8">
            <h2 className="font-display text-lg rose-shimmer mb-6 pb-3 border-b border-rose/10">{group}</h2>
            {groupFields.map(renderField)}
          </div>
        ))}

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full py-4 rounded-xl bg-rose/20 border border-rose/30 text-rose font-body text-base tracking-wide hover:bg-rose/30 transition-all duration-300 disabled:opacity-50"
        >
          {saving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
        </button>

        {saveStatus === 'saved' && (
          <div className="areej-toast" style={{ direction: 'rtl' }}>تم الحفظ بنجاح</div>
        )}
        {saveStatus === 'error' && (
          <div className="areej-toast" style={{ direction: 'rtl', borderColor: 'rgba(239,68,68,0.3)' }}>حدث خطأ أثناء الحفظ</div>
        )}
      </div>
    </div>
  )
}