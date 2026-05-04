import { useState } from 'react'
import { useTemplateData, useTemplateFieldsWithSave, api } from '@farhty/template-sdk'

type UploadStatus = 'idle' | 'uploading' | 'success' | 'error'

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
    try {
      const token = localStorage.getItem(`farhty_token_${slug}`)
      const signRes = await api.post('/api/upload/sign',
        { folder },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      const { signature, timestamp, apiKey, cloudName } = signRes.data

      if (!cloudName) throw new Error('cloud_name missing — server misconfigured')

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
      if (upData.error) throw new Error(upData.error.message || 'Cloudinary rejected upload')

      set(key, upData.secure_url)
      setUploadStates(prev => ({ ...prev, [key]: 'success' }))
      setTimeout(() => setUploadStates(prev => ({ ...prev, [key]: 'idle' })), 3000)
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Upload failed'
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

  const rsvpEntries = (() => {
    const raw = get('rsvp_entries')
    if (Array.isArray(raw)) return raw
    if (typeof raw === 'string') { try { return JSON.parse(raw) } catch { return [] } }
    return []
  })()

  const wishEntries = (() => {
    const raw = get('wish_entries')
    if (Array.isArray(raw)) return raw
    if (typeof raw === 'string') { try { return JSON.parse(raw) } catch { return [] } }
    return []
  })()

  return (
    <div className="min-h-screen bg-ivory" dir="rtl" style={{ fontFamily: "'Noto Naskh Arabic', serif" }}>
      {/* Header */}
      <div className="bg-mahogany py-6 px-4 text-center">
        <h1 className="text-cream text-2xl font-bold" style={{ fontFamily: 'Amiri, serif' }}>
          لوحة تحكم فيروز
        </h1>
        <p className="text-cream/60 text-sm mt-1">تعديل بيانات الدعوة</p>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-8">

        {/* ─── Section: Couple Info ─── */}
        <Section title="بيانات العروسين">
          <Field label="اسم العريس">
            <TextInput value={get('groom_name') ?? ''} onChange={v => set('groom_name', v)} />
          </Field>
          <Field label="اسم العروسة">
            <TextInput value={get('bride_name') ?? ''} onChange={v => set('bride_name', v)} />
          </Field>
          <Field label="تاريخ الزفاف">
            <input
              type="date"
              value={get('wedding_date') ?? ''}
              onChange={e => set('wedding_date', e.target.value)}
              dir="ltr"
              className="w-full px-4 py-3 rounded-xl border border-gold/30 bg-ivory text-espresso outline-none focus:border-gold"
            />
          </Field>
          <Field label="عبارة ترحيبية">
            <TextInput value={get('tagline') ?? ''} onChange={v => set('tagline', v)} placeholder="بداية قصة جديدة من الحب" />
          </Field>
        </Section>

        {/* ─── Section: Media ─── */}
        <Section title="الصور والوسائط">
          <Field label="صورة الغلاف">
            <ImageUpload
              value={get('hero_image')}
              uploadStatus={uploadStates['hero_image'] || 'idle'}
              uploadError={uploadErrors['hero_image']}
              onUpload={f => handleUpload('hero_image', f, `templates/fayrouz/hero`)}
            />
          </Field>
          <Field label="اللون الرئيسي">
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={get('accent_color') ?? '#C9A96E'}
                onChange={e => set('accent_color', e.target.value)}
                className="w-12 h-10 rounded-lg border-none cursor-pointer"
              />
              <span className="text-espresso/60 text-sm font-mono">{get('accent_color') ?? '#C9A96E'}</span>
            </div>
          </Field>
        </Section>

        {/* ─── Section: Venue ─── */}
        <Section title="تفاصيل الحفل">
          <Field label="اسم القاعة">
            <TextInput value={get('venue_name') ?? ''} onChange={v => set('venue_name', v)} placeholder="قاعة الأفراح" />
          </Field>
          <Field label="العنوان">
            <TextInput value={get('venue_address') ?? ''} onChange={v => set('venue_address', v)} placeholder="القاهرة، مصر" />
          </Field>
          <Field label="رابط خرائط جوجل (embed)">
            <TextInput value={get('map_url') ?? ''} onChange={v => set('map_url', v)} placeholder="https://www.google.com/maps/embed?..." dir="ltr" />
          </Field>
        </Section>

        {/* ─── Section: RSVP Entries (read-only) ─── */}
        {rsvpEntries.length > 0 && (
          <Section title={`تأكيدات الحضور (${rsvpEntries.length})`}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gold/20 text-espresso/60">
                    <th className="py-2 text-right">الاسم</th>
                    <th className="py-2 text-right">الحالة</th>
                    <th className="py-2 text-right">العدد</th>
                  </tr>
                </thead>
                <tbody>
                  {rsvpEntries.map((entry: { name: string; attending: boolean; guests: number }, i: number) => (
                    <tr key={i} className="border-b border-gold/10">
                      <td className="py-2">{entry.name}</td>
                      <td className="py-2">
                        <span className={`px-2 py-0.5 rounded-full text-xs ${entry.attending ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {entry.attending ? 'حضور' : 'اعتذار'}
                        </span>
                      </td>
                      <td className="py-2">{entry.guests || 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>
        )}

        {/* ─── Section: Wishes (read-only) ─── */}
        {wishEntries.length > 0 && (
          <Section title={`التهاني (${wishEntries.length})`}>
            <div className="space-y-3">
              {wishEntries.map((wish: { name: string; message: string }, i: number) => (
                <div key={i} className="bg-ivory rounded-xl p-4 border border-gold/15">
                  <p className="text-espresso/80 text-sm">{wish.message}</p>
                  <p className="text-gold text-xs mt-2 font-semibold">— {wish.name}</p>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* ─── Save Button ─── */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full py-4 rounded-xl bg-gradient-to-l from-gold to-[#E8C85A] text-espresso
                     font-bold text-lg shadow-lg hover:shadow-xl disabled:opacity-50 transition-all"
        >
          {saving ? 'جاري الحفظ...' :
           saveStatus === 'saved' ? 'تم الحفظ بنجاح!' :
           saveStatus === 'error' ? 'فشل الحفظ' : 'حفظ التغييرات'}
        </button>
      </div>
    </div>
  )
}

// ─── Reusable sub-components ──────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-cream rounded-2xl border border-gold/20 overflow-hidden">
      <div className="bg-mahogany/5 px-6 py-3 border-b border-gold/15">
        <h2 className="text-espresso font-bold text-lg" style={{ fontFamily: 'Amiri, serif' }}>{title}</h2>
      </div>
      <div className="px-6 py-5 space-y-5">{children}</div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm text-espresso/70 mb-1.5 font-medium">{label}</label>
      {children}
    </div>
  )
}

function TextInput({ value, onChange, placeholder, dir }: {
  value: string; onChange: (v: string) => void; placeholder?: string; dir?: string
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      dir={dir}
      className="w-full px-4 py-3 rounded-xl border border-gold/30 bg-ivory text-espresso outline-none focus:border-gold transition-colors"
    />
  )
}

function ImageUpload({ value, uploadStatus, uploadError, onUpload }: {
  value: string
  uploadStatus: UploadStatus
  uploadError?: string
  onUpload: (file: File) => void
}) {
  const isUploading = uploadStatus === 'uploading'

  return (
    <div>
      <label
        className={`block w-full py-3 px-4 rounded-xl border-2 border-dashed border-gold/40 text-center
                    cursor-pointer hover:border-gold transition-colors text-gold/80
                    ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
      >
        {isUploading ? 'جاري الرفع...' : 'اختر صورة'}
        <input
          type="file"
          accept="image/*"
          className="hidden"
          disabled={isUploading}
          onChange={e => { const f = e.target.files?.[0]; if (f) onUpload(f) }}
        />
      </label>
      {uploadStatus === 'success' && (
        <p className="text-green-600 text-sm mt-1 text-center">تم الرفع بنجاح</p>
      )}
      {uploadStatus === 'error' && uploadError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-2 mt-2 text-red-600 text-xs">
          {uploadError}
        </div>
      )}
      {value && (
        <img src={value} alt="" className="w-full rounded-xl mt-3 max-h-48 object-cover border border-gold/20" />
      )}
    </div>
  )
}
