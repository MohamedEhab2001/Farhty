import { useState } from 'react'
import { useTemplateData, useTemplateFieldsWithSave } from '@farhty/template-sdk'
import { api } from '@farhty/template-sdk'

type UploadStatus = 'idle' | 'uploading' | 'success' | 'error'

export default function AdminDashboard() {
  const { instance } = useTemplateData()
  const { get, set, save } = useTemplateFieldsWithSave()
  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved' | 'error'>('idle')
  const [uploadStatus, setUploadStatus] = useState<Record<string, UploadStatus>>({})
  const [uploadError, setUploadError] = useState<string>('')

  if (!instance) return null

  const slug = instance.slug

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await save()
      setSaveStatus('saved')
      setTimeout(() => setSaveStatus('idle'), 3000)
    } catch {
      setSaveStatus('error')
      setTimeout(() => setSaveStatus('idle'), 3000)
    } finally {
      setIsSaving(false)
    }
  }

  const handleUpload = async (key: string, folder: string, file: File) => {
    setUploadStatus(prev => ({ ...prev, [key]: 'uploading' }))
    setUploadError('')
    const tokenKey = `farhty_token_${slug}`
    const token = localStorage.getItem(tokenKey)
    try {
      const signRes = await api.post('/api/upload/sign', { folder }, { headers: { Authorization: `Bearer ${token}` } })
      const { signature, timestamp, apiKey, cloudName } = signRes.data
      if (!cloudName) {
        throw new Error('Cloudinary not configured. Please check your API server environment variables.')
      }
      const fd = new FormData()
      fd.append('file', file)
      fd.append('signature', signature)
      fd.append('timestamp', String(timestamp))
      fd.append('api_key', apiKey)
      fd.append('folder', folder)
      const isAudio = key === 'music_file'
      const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/${isAudio ? 'video' : 'image'}/upload`
      const upRes = await fetch(uploadUrl, { method: 'POST', body: fd })
      const upData = await upRes.json()
      if (upData.error) {
        throw new Error(upData.error.message || 'Upload rejected by Cloudinary')
      }
      set(key, upData.secure_url)
      setUploadStatus(prev => ({ ...prev, [key]: 'success' }))
      setTimeout(() => setUploadStatus(prev => ({ ...prev, [key]: 'idle' })), 3000)
    } catch (e: any) {
      console.error('Upload failed', e)
      setUploadStatus(prev => ({ ...prev, [key]: 'error' }))
      setUploadError(e?.message || 'Upload failed')
      setTimeout(() => {
        setUploadStatus(prev => ({ ...prev, [key]: 'idle' }))
        setUploadError('')
      }, 5000)
    }
  }

  const rsvpEntries: { name: string; attending: boolean; guests: number; timestamp: string }[] = (() => {
    const raw = get('rsvp_entries')
    if (Array.isArray(raw)) return raw
    if (typeof raw === 'string') { try { return JSON.parse(raw) } catch { return [] } }
    return []
  })()

  const wishEntries: { name: string; message: string; timestamp: string }[] = (() => {
    const raw = get('wish_entries')
    if (Array.isArray(raw)) return raw
    if (typeof raw === 'string') { try { return JSON.parse(raw) } catch { return [] } }
    return []
  })()

  return (
    <div dir="rtl" className="min-h-screen bg-blush-50 font-tajawal text-blush-900 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="font-amiri text-3xl text-blush-800 mb-2">لوحة التحكم</h1>
          <p className="text-blush-500 text-sm">قالب وردة — تعديل بيانات الدعوة</p>
        </div>

        {uploadError && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-700 text-sm text-center">
            {uploadError}
          </div>
        )}
        <div className="space-y-6">
          <Section title="بيانات العروسين">
            <Field label="اسم العروسة">
              <input type="text" value={get('bride_name') ?? ''} onChange={e => set('bride_name', e.target.value)} className={inputClass} />
            </Field>
            <Field label="اسم العريس">
              <input type="text" value={get('groom_name') ?? ''} onChange={e => set('groom_name', e.target.value)} className={inputClass} />
            </Field>
            <Field label="اسم والد العروسة">
              <input type="text" value={get('father_bride_name') ?? ''} onChange={e => set('father_bride_name', e.target.value)} className={inputClass} />
            </Field>
            <Field label="اسم والد العريس">
              <input type="text" value={get('father_groom_name') ?? ''} onChange={e => set('father_groom_name', e.target.value)} className={inputClass} />
            </Field>
            <Field label="تاريخ الزفاف">
              <input type="date" value={get('wedding_date') ?? ''} onChange={e => set('wedding_date', e.target.value)} className={inputClass} dir="ltr" />
            </Field>
          </Section>

          <Section title="وسائط">
            <Field label="صورة الغلاف">
              <div className="flex items-center gap-3">
                {get('hero_image') && <img src={get('hero_image')} alt="hero" className="w-20 h-20 rounded-xl object-cover border border-blush-200" />}
                <label className={`${buttonClass} cursor-pointer ${uploadStatus.hero_image === 'uploading' ? 'opacity-50 pointer-events-none' : ''}`}>
                  {uploadStatus.hero_image === 'uploading' ? 'جاري الرفع...' : uploadStatus.hero_image === 'success' ? 'تم الرفع ✓' : uploadStatus.hero_image === 'error' ? 'فشل الرفع' : 'رفع صورة'}
                  <input type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) handleUpload('hero_image', 'templates/warda/hero', f) }} />
                </label>
              </div>
            </Field>
            <Field label="اللون الرئيسي">
              <div className="flex items-center gap-3">
                <input type="color" value={get('accent_color') ?? '#D4A0A0'} onChange={e => set('accent_color', e.target.value)} className="w-10 h-10 rounded-lg border border-blush-200 cursor-pointer" />
                <span className="text-sm text-blush-500 font-mospace">{get('accent_color') ?? '#D4A0A0'}</span>
              </div>
            </Field>
            <Field label="الموسيقى">
              <div className="space-y-2">
                <label className={`${buttonClass} cursor-pointer inline-block ${uploadStatus.music_file === 'uploading' ? 'opacity-50 pointer-events-none' : ''}`}>
                  {uploadStatus.music_file === 'uploading' ? 'جاري الرفع...' : uploadStatus.music_file === 'success' ? 'تم الرفع ✓' : uploadStatus.music_file === 'error' ? 'فشل الرفع' : 'رفع ملف صوتي'}
                  <input type="file" accept="audio/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) handleUpload('music_file', 'templates/warda/audio', f) }} />
                </label>
                {get('music_file') && <audio src={get('music_file')} controls className="w-full mt-2" />}
              </div>
            </Field>
          </Section>

          <Section title="الحفل والموقع">
            <Field label="اسم القاعة">
              <input type="text" value={get('venue_name') ?? ''} onChange={e => set('venue_name', e.target.value)} className={inputClass} />
            </Field>
            <Field label="عنوان القاعة">
              <input type="text" value={get('venue_address') ?? ''} onChange={e => set('venue_address', e.target.value)} className={inputClass} />
            </Field>
            <Field label="صورة الخريطة">
              <div className="flex items-center gap-3">
                {get('venue_map_image') && <img src={get('venue_map_image')} alt="map" className="w-20 h-20 rounded-xl object-cover border border-blush-200" />}
                <label className={`${buttonClass} cursor-pointer ${uploadStatus.venue_map_image === 'uploading' ? 'opacity-50 pointer-events-none' : ''}`}>
                  {uploadStatus.venue_map_image === 'uploading' ? 'جاري الرفع...' : uploadStatus.venue_map_image === 'success' ? 'تم الرفع ✓' : uploadStatus.venue_map_image === 'error' ? 'فشل الرفع' : 'رفع صورة الخريطة'}
                  <input type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) handleUpload('venue_map_image', 'templates/warda/venue', f) }} />
                </label>
              </div>
            </Field>
            <Field label="برنامج الحفل (JSON)">
              <textarea
                value={typeof get('schedule_items') === 'string' ? get('schedule_items') : JSON.stringify(get('schedule_items') ?? [], null, 2)}
                onChange={e => {
                  try { set('schedule_items', JSON.parse(e.target.value)) } catch { set('schedule_items', e.target.value) }
                }}
                className={`${inputClass} resize-y font-mono text-sm`}
                rows={4}
                placeholder='[{"time": "٦:٠٠ م", "label": "استقبال الضيوف"}]'
              />
            </Field>
          </Section>

          <Section title="رسالة الختام">
            <Field label="رسالة العروسين">
              <input type="text" value={get('customer_message') ?? ''} onChange={e => set('customer_message', e.target.value)} className={inputClass} />
            </Field>
          </Section>

          {rsvpEntries.length > 0 && (
            <Section title="تأكيدات الحضور">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-blush-200">
                      <th className="text-right py-2 px-2 font-tajawal text-blush-600">الاسم</th>
                      <th className="text-right py-2 px-2 font-tajawal text-blush-600">الحضور</th>
                      <th className="text-right py-2 px-2 font-tajawal text-blush-600">العدد</th>
                      <th className="text-right py-2 px-2 font-tajawal text-blush-600">التاريخ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rsvpEntries.map((e, i) => (
                      <tr key={i} className="border-b border-blush-100/50">
                        <td className="py-2 px-2">{e.name}</td>
                        <td className="py-2 px-2">{e.attending ? 'حاضر' : 'معتذر'}</td>
                        <td className="py-2 px-2">{e.guests || '-'}</td>
                        <td className="py-2 px-2 text-blush-400 text-xs">{new Date(e.timestamp).toLocaleDateString('ar-EG')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Section>
          )}

          {wishEntries.length > 0 && (
            <Section title="التهاني">
              <div className="space-y-3">
                {wishEntries.map((w, i) => (
                  <div key={i} className="bg-blush-50 rounded-xl p-3 border border-blush-200/50">
                    <p className="text-blush-800 text-sm">{w.message}</p>
                    <p className="text-blush-400 text-xs mt-1">— {w.name} • {new Date(w.timestamp).toLocaleDateString('ar-EG')}</p>
                  </div>
                ))}
              </div>
            </Section>
          )}

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full py-3 rounded-xl font-amiri text-lg bg-gradient-to-l from-blush-400 to-rose-gold text-white shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? 'جاري الحفظ...' : saveStatus === 'saved' ? 'تم الحفظ بنجاح ✓' : saveStatus === 'error' ? 'فشل الحفظ، حاول مرة أخرى' : 'حفظ التغييرات'}
          </button>
        </div>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-blush-200/60 p-5 shadow-sm">
      <h3 className="font-amiri text-lg text-blush-700 mb-4 pb-2 border-b border-blush-100">{title}</h3>
      <div className="space-y-4">{children}</div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm text-blush-600 mb-1.5">{label}</label>
      {children}
    </div>
  )
}

const inputClass = "w-full bg-blush-50 border border-blush-200 rounded-xl px-4 py-2.5 font-tajawal text-blush-900 placeholder-blush-300 focus:outline-none focus:border-rose-gold focus:ring-1 focus:ring-rose-gold/30 transition-all"
const buttonClass = "px-4 py-2 rounded-xl bg-blush-100 border border-blush-200 text-blush-700 text-sm font-tajawal hover:bg-blush-200 transition-all"