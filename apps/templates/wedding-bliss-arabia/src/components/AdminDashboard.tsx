import { useState } from 'react'
import { useTemplateData, useTemplateFieldsWithSave, api } from '@farhty/template-sdk'
import type { TemplateField } from '@farhty/template-sdk'

type UploadStatus = 'idle' | 'uploading' | 'success' | 'error'

const groupLabels: Record<string, string> = {
  'Couple Info': 'معلومات العروسين',
  'Media': 'الوسائط',
  'Settings': 'الإعدادات',
  'Our Story': 'قصتنا',
  'Quran Verse': 'الآية القرآنية',
  'Events': 'المناسبات',
  'Venue': 'المكان',
  'Responses': 'الردود',
  'General': 'عام',
}

const fieldLabels: Record<string, string> = {
  bride_name: 'اسم العروس (إنجليزي)',
  groom_name: 'اسم العريس (إنجليزي)',
  bride_name_ar: 'اسم العروس (عربي)',
  groom_name_ar: 'اسم العريس (عربي)',
  wedding_date: 'تاريخ الزفاف',
  tagline: 'رسالة الترحيب',
  hero_image: 'صورة الخلفية الرئيسية',
  couple_image: 'صورة العروسين',
  venue_image: 'صورة المكان',
  music_file: 'الموسيقى الخلفية',
  accent_color: 'اللون المميز',
  our_story: 'قصتنا (إنجليزي)',
  our_story_ar: 'عنوان قصتنا (عربي)',
  quran_verse_ar: 'الآية القرآنية (عربي)',
  quran_verse_en: 'ترجمة الآية (إنجليزي)',
  quran_verse_ref: 'مرجع الآية',
  events: 'المناسبات / البرنامج',
  venue_name: 'اسم المكان',
  venue_name_ar: 'اسم المكان (عربي)',
  venue_address: 'عنوان المكان',
  venue_map_url: 'خريطة المكان (Google Maps)',
  venue_directions_url: 'رابط الاتجاهات',
  rsvp_entries: 'ردود الحضور',
  wish_entries: 'رسائل التهنئة',
}

export default function AdminDashboard() {
  const { instance, slug } = useTemplateData()
  const { get, set, save } = useTemplateFieldsWithSave()
  const [saving, setSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved' | 'error'>('idle')
  const [uploadStates, setUploadStates] = useState<Record<string, UploadStatus>>({})
  const [uploadErrors, setUploadErrors] = useState<Record<string, string>>({})

  if (!instance) return null

  const groups: { name: string; fields: TemplateField[] }[] = []
  const groupMap = new Map<string, TemplateField[]>()
  for (const field of instance.fields) {
    const g = field.group || 'General'
    if (!groupMap.has(g)) {
      groupMap.set(g, [])
      groups.push({ name: g, fields: groupMap.get(g)! })
    }
    groupMap.get(g)!.push(field)
  }

  const handleUpload = async (key: string, file: File, folder: string, isAudio = false) => {
    setUploadStates(prev => ({ ...prev, [key]: 'uploading' }))
    try {
      const token = localStorage.getItem(`farhty_token_${slug}`)
      const signRes = await api.post('/api/upload/sign',
        { folder },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      const { signature, timestamp, apiKey, cloudName } = signRes.data

      if (!cloudName) throw new Error('cloud_name missing')

      const fd = new FormData()
      fd.append('file', file)
      fd.append('signature', signature)
      fd.append('timestamp', String(timestamp))
      fd.append('api_key', apiKey)
      fd.append('folder', folder)

      const upRes = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/${isAudio ? 'video' : 'image'}/upload`,
        { method: 'POST', body: fd }
      )
      const upData = await upRes.json()
      if (upData.error) throw new Error(upData.error.message || 'فشل الرفع')

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

  const parseArray = (key: string) => {
    const raw = get(key)
    if (Array.isArray(raw)) return raw
    if (typeof raw === 'string') { try { return JSON.parse(raw) } catch { return [] } }
    return []
  }

  const rsvpEntries = parseArray('rsvp_entries')
  const wishEntries = parseArray('wish_entries')

  return (
    <div className="min-h-screen" dir="rtl" style={{ background: 'var(--gradient-emerald)', fontFamily: "'Reem Kufi', 'Amiri', serif" }}>
      {/* Header */}
      <div className="py-6 px-4 text-center border-b border-gold/20">
        <img src="./فرحتي ذهبي.png" alt="فرحتي" className="h-10 mx-auto mb-3" />
        <h1 className="font-arabic text-2xl text-gold font-bold">لوحة التحكم</h1>
        <p className="text-ivory/50 text-sm mt-1">إدارة دعوة الزفاف</p>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-8">
        {groups.map(group => (
          <Section key={group.name} title={groupLabels[group.name] || group.name}>
            {group.fields.map(field => (
              <DynamicField
                key={field.key}
                field={field}
                value={get(field.key)}
                onChange={v => set(field.key, v)}
                onUpload={handleUpload}
                uploadStatus={uploadStates[field.key] || 'idle'}
                uploadError={uploadErrors[field.key]}
                slug={slug}
              />
            ))}
          </Section>
        ))}

        {/* RSVP entries */}
        {rsvpEntries.length > 0 && (
          <Section title={`ردود الحضور (${rsvpEntries.length})`}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gold/20 text-ivory/60">
                    <th className="py-2 text-right">الاسم</th>
                    <th className="py-2 text-right">الحالة</th>
                    <th className="py-2 text-right">عدد الضيوف</th>
                  </tr>
                </thead>
                <tbody>
                  {rsvpEntries.map((entry: { name: string; attending: boolean; guests: number }, i: number) => (
                    <tr key={i} className="border-b border-gold/10">
                      <td className="py-2 text-ivory/80">{entry.name}</td>
                      <td className="py-2">
                        <span className={`px-2 py-0.5 rounded text-xs ${entry.attending ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>
                          {entry.attending ? 'حاضر' : 'معتذر'}
                        </span>
                      </td>
                      <td className="py-2 text-ivory/80">{entry.guests || 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>
        )}

        {/* Wish entries */}
        {wishEntries.length > 0 && (
          <Section title={`التهاني (${wishEntries.length})`}>
            <div className="space-y-3">
              {wishEntries.map((wish: { name: string; message: string }, i: number) => (
                <div key={i} className="p-4 border border-gold/15 rounded" style={{ background: 'oklch(0.18 0.05 155 / 0.4)' }}>
                  <p className="text-ivory/70 text-sm italic">&ldquo;{wish.message}&rdquo;</p>
                  <p className="text-gold/60 text-xs mt-2">— {wish.name}</p>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Save button */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full py-4 text-sm tracking-[0.1em] font-semibold
                     disabled:opacity-50 transition-all rounded"
          style={{
            background: 'var(--gradient-gold)',
            color: 'oklch(0.22 0.06 155)',
          }}
        >
          {saving ? 'جاري الحفظ...' :
           saveStatus === 'saved' ? 'تم الحفظ بنجاح!' :
           saveStatus === 'error' ? 'فشل الحفظ' : 'حفظ التغييرات'}
        </button>
      </div>
    </div>
  )
}

// ─── Section card ────────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border border-gold/20 overflow-hidden rounded" style={{ background: 'oklch(0.18 0.05 155 / 0.5)' }}>
      <div className="px-6 py-3 border-b border-gold/15">
        <h2 className="text-gold font-bold tracking-wide">{title}</h2>
      </div>
      <div className="px-6 py-5 space-y-5">{children}</div>
    </div>
  )
}

// ─── Dynamic field renderer ──────────────────────────────────────────────────

function DynamicField({ field, value, onChange, onUpload, uploadStatus, uploadError, slug }: {
  field: TemplateField
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange: (v: any) => void
  onUpload: (key: string, file: File, folder: string, isAudio?: boolean) => void
  uploadStatus: UploadStatus
  uploadError?: string
  slug: string
}) {
  const label = fieldLabels[field.key] || field.label
  const isLtr = ['url', 'iframe', 'number', 'time', 'date', 'color'].includes(field.type) ||
    field.key.endsWith('_en') || field.key === 'bride_name' || field.key === 'groom_name' ||
    field.key === 'quran_verse_ref'
  const inputClass = `w-full px-4 py-3 bg-transparent border border-gold/30 text-ivory outline-none focus:border-gold transition-colors placeholder:text-ivory/30 rounded ${isLtr ? 'text-left' : ''}`

  return (
    <div>
      <label className="block text-xs tracking-wide text-ivory/50 mb-2 font-semibold">{label}</label>

      {field.type === 'text' && (
        <input type="text" className={inputClass} value={value ?? ''} onChange={e => onChange(e.target.value)} placeholder={field.placeholder} dir={isLtr ? 'ltr' : 'rtl'} />
      )}

      {field.type === 'textarea' && (
        <textarea className={inputClass} value={value ?? ''} onChange={e => onChange(e.target.value)} placeholder={field.placeholder} rows={3} style={{ resize: 'vertical' }} dir={field.key.endsWith('_en') ? 'ltr' : 'rtl'} />
      )}

      {field.type === 'number' && (
        <input type="number" className={inputClass} value={value ?? ''} onChange={e => onChange(e.target.value === '' ? '' : Number(e.target.value))} placeholder={field.placeholder} dir="ltr" />
      )}

      {field.type === 'url' && (
        <input type="url" className={inputClass} value={value ?? ''} onChange={e => onChange(e.target.value)} placeholder={field.placeholder || 'https://...'} dir="ltr" />
      )}

      {field.type === 'iframe' && (
        <div>
          <input type="url" className={inputClass} value={value ?? ''} onChange={e => onChange(e.target.value)} placeholder={field.placeholder || 'https://www.google.com/maps/embed?...'} dir="ltr" />
          {value && (
            <div className="mt-3 rounded overflow-hidden border border-gold/20">
              <iframe src={value} style={{ width: '100%', height: 180, border: 'none' }} title={label} loading="lazy" />
            </div>
          )}
          {field.hint && <p className="text-ivory/30 text-xs mt-1">{field.hint}</p>}
        </div>
      )}

      {field.type === 'select' && (
        <select className={`${inputClass} cursor-pointer`} value={value ?? ''} onChange={e => onChange(e.target.value)} style={{ background: 'oklch(0.18 0.05 155)' }}>
          <option value="">{field.placeholder || 'اختر...'}</option>
          {(field.options || []).map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      )}

      {field.type === 'time' && (
        <input type="time" className={inputClass} value={value ?? ''} onChange={e => onChange(e.target.value)} dir="ltr" />
      )}

      {field.type === 'date' && (
        <input type="date" className={inputClass} value={value ?? ''} onChange={e => onChange(e.target.value)} dir="ltr" />
      )}

      {field.type === 'color' && (
        <div className="flex items-center gap-3">
          <input type="color" value={value || '#000000'} onChange={e => onChange(e.target.value)}
            className="w-12 h-10 border-none cursor-pointer" />
          <span className="text-ivory/60 text-sm font-mono" dir="ltr">{value || '#000000'}</span>
        </div>
      )}

      {field.type === 'boolean' && (
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" checked={!!value} onChange={e => onChange(e.target.checked)}
            className="w-4 h-4 accent-gold" />
          <span className="text-ivory/60 text-sm">{value ? 'مفعّل' : 'معطّل'}</span>
        </label>
      )}

      {(field.type === 'image' || field.type === 'audio') && (
        <div>
          <label
            className={`block w-full py-3 px-4 border border-dashed border-gold/40 text-center rounded
                        cursor-pointer hover:border-gold transition-colors text-gold/80 text-sm
                        ${uploadStatus === 'uploading' ? 'opacity-50 pointer-events-none' : ''}`}
          >
            {uploadStatus === 'uploading' ? 'جاري الرفع...' : field.type === 'image' ? 'اختر صورة' : 'اختر ملف صوتي'}
            <input
              type="file"
              accept={field.type === 'image' ? 'image/*' : 'audio/*'}
              className="hidden"
              disabled={uploadStatus === 'uploading'}
              onChange={e => {
                const f = e.target.files?.[0]
                if (f) onUpload(field.key, f, field.cloudinaryFolder || `instances/${slug}`, field.type === 'audio')
              }}
            />
          </label>
          {uploadStatus === 'success' && <p className="text-green-400 text-sm mt-1 text-center">تم الرفع بنجاح</p>}
          {uploadStatus === 'error' && uploadError && (
            <div className="bg-red-400/10 border border-red-400/30 rounded p-2 mt-2 text-red-400 text-xs">{uploadError}</div>
          )}
          {value && field.type === 'image' && (
            <img src={value} alt="" className="w-full mt-3 max-h-48 object-cover border border-gold/20 rounded" />
          )}
          {value && field.type === 'audio' && (
            <audio src={value} controls className="w-full mt-3" />
          )}
        </div>
      )}

      {field.type === 'array' && (
        <ArrayEditor field={field} value={value} onChange={onChange} />
      )}

      {field.type === 'json' && (
        <textarea
          className={`${inputClass} font-mono text-xs`}
          value={typeof value === 'string' ? value : JSON.stringify(value, null, 2)}
          onChange={e => {
            try { onChange(JSON.parse(e.target.value)) } catch { onChange(e.target.value) }
          }}
          rows={4}
          placeholder={field.placeholder || '[]'}
          style={{ resize: 'vertical' }}
          dir="ltr"
        />
      )}

      {field.hint && field.type !== 'iframe' && <p className="text-ivory/30 text-xs mt-1">{field.hint}</p>}
    </div>
  )
}

// ─── Array editor ────────────────────────────────────────────────────────────

const itemSchemaLabels: Record<string, string> = {
  name_ar: 'اسم المناسبة (عربي)',
  name_en: 'اسم المناسبة (إنجليزي)',
  date: 'التاريخ',
  time: 'الوقت',
  place: 'المكان',
}

function ArrayEditor({ field, value, onChange }: {
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

  const removeItem = (idx: number) => onChange(items.filter((_, i) => i !== idx))

  const updateItem = (idx: number, key: string, val: string) => {
    onChange(items.map((item, i) => i === idx ? { ...item, [key]: val } : item))
  }

  const inputClass = 'w-full px-3 py-2 bg-transparent border border-gold/20 text-ivory text-sm outline-none focus:border-gold transition-colors placeholder:text-ivory/20 rounded'

  return (
    <div>
      {items.map((item, idx) => (
        <div key={idx} className="border border-gold/15 p-3 mb-2 relative rounded" style={{ background: 'oklch(0.18 0.05 155 / 0.3)' }}>
          <button
            onClick={() => removeItem(idx)}
            className="absolute top-2 left-2 w-5 h-5 flex items-center justify-center text-red-400 text-xs hover:text-red-300"
          >
            &times;
          </button>
          {schema.map(s => {
            const isLtr = s.key === 'name_en' || s.key === 'time' || s.key === 'date'
            return (
              <div key={s.key} className="mb-2">
                <p className="text-ivory/40 text-xs mb-1">{itemSchemaLabels[s.key] || s.label}</p>
                {s.type === 'time' ? (
                  <input type="time" className={inputClass} value={item[s.key] || ''} onChange={e => updateItem(idx, s.key, e.target.value)} dir="ltr" />
                ) : (
                  <input className={inputClass} value={item[s.key] || ''} onChange={e => updateItem(idx, s.key, e.target.value)} placeholder={s.placeholder} dir={isLtr ? 'ltr' : 'rtl'} />
                )}
              </div>
            )
          })}
        </div>
      ))}
      <button
        onClick={addItem}
        className="w-full py-2 border border-dashed border-gold/20 text-gold/60 text-sm hover:border-gold/40 transition-colors rounded"
      >
        + إضافة عنصر
      </button>
    </div>
  )
}
