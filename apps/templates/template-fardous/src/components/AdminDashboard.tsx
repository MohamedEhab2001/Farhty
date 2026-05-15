import { useState, useRef } from 'react'
import { useTemplateData, useTemplateFieldsWithSave, api } from '@farhty/template-sdk'
import mosqueImg from '../assets/mosque.jpg'


type UploadStatus = 'idle' | 'uploading' | 'success' | 'error'

async function uploadToCloudinary(file: File, folder: string, slug: string): Promise<string> {
  const token = localStorage.getItem(`farhty_token_${slug}`)
  const signRes = await api.post('/api/upload/sign', { folder }, { headers: { Authorization: `Bearer ${token}` } })
  const { signature, timestamp, apiKey, cloudName } = signRes.data
  if (!cloudName) throw new Error('cloud_name missing — server misconfigured')
  const fd = new FormData()
  fd.append('file', file); fd.append('signature', signature); fd.append('timestamp', String(timestamp))
  fd.append('api_key', apiKey); fd.append('folder', folder)
  const upRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, { method: 'POST', body: fd })
  const upData = await upRes.json()
  if (upData.error) throw new Error(upData.error.message || 'Cloudinary rejected upload')
  return upData.secure_url as string
}

const parseWishes = (raw: unknown): { name: string; message: string; visible?: boolean }[] => {
  if (Array.isArray(raw)) return raw
  if (typeof raw === 'string') { try { return JSON.parse(raw) } catch { return [] } }
  return []
}

export default function AdminDashboard() {
  const { instance, slug } = useTemplateData()
  const { get, set, save } = useTemplateFieldsWithSave()
  const [saving, setSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved' | 'error'>('idle')
  const [uploadStates, setUploadStates] = useState<Record<string, UploadStatus>>({})
  const [uploadErrors, setUploadErrors] = useState<Record<string, string>>({})

  if (!instance) return null

  const handleUpload = async (key: string, file: File, folder: string) => {
    setUploadStates(p => ({ ...p, [key]: 'uploading' }))
    setUploadErrors(p => { const n = { ...p }; delete n[key]; return n })
    try {
      const url = await uploadToCloudinary(file, folder, slug)
      set(key, url)
      setUploadStates(p => ({ ...p, [key]: 'success' }))
      setTimeout(() => setUploadStates(p => ({ ...p, [key]: 'idle' })), 3000)
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'فشل الرفع'
      setUploadStates(p => ({ ...p, [key]: 'error' }))
      setUploadErrors(p => ({ ...p, [key]: msg }))
      setTimeout(() => {
        setUploadStates(p => ({ ...p, [key]: 'idle' }))
        setUploadErrors(p => { const n = { ...p }; delete n[key]; return n })
      }, 5000)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try { await save(); setSaveStatus('saved'); setTimeout(() => setSaveStatus('idle'), 2000) }
    catch { setSaveStatus('error'); setTimeout(() => setSaveStatus('idle'), 3000) }
    finally { setSaving(false) }
  }

  const wishes = parseWishes(get('wish_entries'))
  const toggleWishVisible = async (i: number) => {
    const updated = wishes.map((w, idx) => idx === i ? { ...w, visible: w.visible === false ? true : false } : w)
    set('wish_entries', updated)
    setSaving(true)
    try { await save(); setSaveStatus('saved'); setTimeout(() => setSaveStatus('idle'), 1500) }
    catch { setSaveStatus('error'); setTimeout(() => setSaveStatus('idle'), 3000) }
    finally { setSaving(false) }
  }

  const ust = uploadStates

  return (
    <div dir="rtl" style={{ minHeight: '100vh', background: 'var(--cream)', fontFamily: 'Tajawal, sans-serif' }}>

      <div style={{ background: 'var(--emerald-deep)', padding: '1.5rem 1rem', textAlign: 'center' }}>
        <h1 style={{ color: 'var(--gold-soft)', fontFamily: 'Amiri, serif', fontSize: '1.8rem', fontWeight: 400 }}>
          فردوس — لوحة التحكم
        </h1>
        <p style={{ color: 'rgba(212,184,112,0.6)', marginTop: '0.25rem', fontSize: '0.8rem' }}>
          إدارة محتوى دعوة الزفاف
        </p>
      </div>

      <div style={{ maxWidth: '640px', margin: '0 auto', padding: '2.5rem 1rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>

        {/* بيانات الزوجين */}
        <Section title="بيانات الزوجين">
          <Field label="اسم العروسة">
            <TextIn value={get('bride_name') as string ?? ''} onChange={v => set('bride_name', v)} placeholder="نور" />
          </Field>
          <Field label="اسم العريس">
            <TextIn value={get('groom_name') as string ?? ''} onChange={v => set('groom_name', v)} placeholder="يوسف" />
          </Field>
          <Field label="عائلة العروسة">
            <TextIn value={get('family_bride') as string ?? ''} onChange={v => set('family_bride', v)} placeholder="آل الحسن" />
          </Field>
          <Field label="عائلة العريس">
            <TextIn value={get('family_groom') as string ?? ''} onChange={v => set('family_groom', v)} placeholder="آل الرحمان" />
          </Field>
          <Field label="نوع الحفل">
            <TextIn value={get('event_type') as string ?? ''} onChange={v => set('event_type', v)} placeholder="وليمة" />
          </Field>
          <Field label="تاريخ الزفاف">
            <input type="date" value={get('wedding_date') as string ?? ''} onChange={e => set('wedding_date', e.target.value)} style={{ ...inputStyle, direction: 'ltr', textAlign: 'left' }} />
          </Field>
          <Field label="وقت الحفل">
            <input type="time" value={get('wedding_time') as string ?? ''} onChange={e => set('wedding_time', e.target.value)} style={{ ...inputStyle, direction: 'ltr', textAlign: 'left' }} />
          </Field>
        </Section>

        {/* الآية القرآنية */}
        <Section title="الآية القرآنية">
          <Field label="نص الآية" hint="الآية الكريمة التي تظهر في الدعوة">
            <textarea
              value={get('quran_verse_ar') as string ?? ''}
              onChange={e => set('quran_verse_ar', e.target.value)}
              rows={3}
              dir="rtl"
              style={{ ...inputStyle, resize: 'vertical', fontFamily: 'Amiri, serif', fontSize: '1.1rem' }}
            />
          </Field>
          <Field label="مرجع الآية">
            <TextIn value={get('quran_verse_ref') as string ?? ''} onChange={v => set('quran_verse_ref', v)} placeholder="— سورة الروم ٣٠:٢١" />
          </Field>
        </Section>

        {/* مكان الحفل */}
        <Section title="مكان الحفل">
          <Field label="اسم القاعة">
            <TextIn value={get('venue_name') as string ?? ''} onChange={v => set('venue_name', v)} placeholder="قاعة الأندلس" />
          </Field>
          <Field label="العنوان">
            <TextIn value={get('venue_address') as string ?? ''} onChange={v => set('venue_address', v)} placeholder="مصر الجديدة، القاهرة" />
          </Field>
          <Field label="رابط تضمين خرائط جوجل (src من iframe)" hint="خرائط جوجل ← مشاركة ← تضمين خريطة ← انسخ قيمة الـ src فقط">
            <input type="url" value={get('venue_map_url') as string ?? ''} onChange={e => set('venue_map_url', e.target.value)} placeholder="https://www.google.com/maps/embed?pb=..." style={{ ...inputStyle, direction: 'ltr', textAlign: 'left' }} />
          </Field>
          {get('venue_map_url') && (
            <div style={{ borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(184,150,46,0.3)' }}>
              <iframe src={get('venue_map_url') as string} width="100%" height="200" style={{ border: 'none', display: 'block' }} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
            </div>
          )}
          <Field label="رابط الاتجاهات" hint="خرائط جوجل ← مشاركة ← انسخ الرابط القصير">
            <input type="url" value={get('venue_map_link') as string ?? ''} onChange={e => set('venue_map_link', e.target.value)} placeholder="https://maps.google.com/?q=..." style={{ ...inputStyle, direction: 'ltr', textAlign: 'left' }} />
          </Field>
        </Section>

        {/* الوسائط */}
        <Section title="الوسائط">
          <Field label="صورة الغلاف / الخلفية">
            <ImageUpload
              value={get('hero_image') as string ?? ''}
              defaultValue={mosqueImg}
              status={ust['hero_image'] || 'idle'}
              error={uploadErrors['hero_image']}
              onUpload={f => handleUpload('hero_image', f, 'templates/fardous/hero')}
              onClear={() => set('hero_image', '')}
            />
          </Field>
          {/* <Field label="رابط تلاوة القرآن (MP3)" hint="رابط مباشر لملف MP3 — الافتراضي: تلاوة المشاري العفاسي لسورة الروم">
            <input type="url" value={get('audio_url') as string ?? ''} onChange={e => set('audio_url', e.target.value)} placeholder="https://everyayah.com/data/..." style={{ ...inputStyle, direction: 'ltr', textAlign: 'left' }} />
          </Field> */}
          {/* <Field label="اللون الرئيسي">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <input type="color" value={get('accent_color') as string ?? '#B8962E'} onChange={e => set('accent_color', e.target.value)} style={{ width: '48px', height: '36px', border: 'none', cursor: 'pointer', background: 'transparent' }} />
              <span style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: 'var(--gold-deep)' }}>
                {get('accent_color') as string ?? '#B8962E'}
              </span>
            </div>
          </Field> */}
        </Section>

        {/* جدار الأمنيات */}
        {wishes.length > 0 && (
          <Section title={`دفتر التهنئة (${wishes.length} — ${wishes.filter(w => w.visible !== false).length} ظاهرة)`}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {wishes.map((w, i) => {
                const visible = w.visible !== false
                return (
                  <div
                    key={i}
                    style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '1rem', background: visible ? 'white' : 'rgba(247,243,233,0.5)', border: '1px solid rgba(184,150,46,0.2)', borderRadius: '8px', opacity: visible ? 1 : 0.55 }}
                  >
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: '0.85rem', lineHeight: 1.7 }}>{w.message}</p>
                      <p style={{ fontSize: '0.65rem', color: 'var(--gold)', marginTop: '0.3rem' }}>— {w.name}</p>
                    </div>
                    <button
                      onClick={() => toggleWishVisible(i)}
                      title={visible ? 'إخفاء عن الضيوف' : 'إظهار للضيوف'}
                      style={{ flexShrink: 0, width: '32px', height: '32px', borderRadius: '50%', border: `1px solid ${visible ? 'var(--gold)' : 'var(--gold-deep)'}`, background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      <svg viewBox="0 0 20 20" fill="none" style={{ width: '14px', height: '14px' }}>
                        {visible
                          ? <><path d="M2 10s3-6 8-6 8 6 8 6-3 6-8 6-8-6-8-6z" stroke="var(--gold)" strokeWidth="1.2" /><circle cx="10" cy="10" r="2" stroke="var(--gold)" strokeWidth="1.2" /></>
                          : <><path d="M3 3l14 14M8.5 8.5A2 2 0 0012 12m-6.5-5.5C4.2 7.7 2 10 2 10s3 6 8 6c1.5 0 2.9-.4 4-.9" stroke="var(--gold-deep)" strokeWidth="1.2" strokeLinecap="round" /><path d="M14 13.5C15.7 12.2 18 10 18 10s-3-6-8-6c-.7 0-1.4.1-2 .3" stroke="var(--gold-deep)" strokeWidth="1.2" strokeLinecap="round" /></>
                        }
                      </svg>
                    </button>
                  </div>
                )
              })}
            </div>
          </Section>
        )}

        {/* زر الحفظ */}
        <button
          onClick={handleSave}
          disabled={saving}
          style={{ display: 'block', width: '100%', padding: '1rem', borderRadius: '999px', background: 'var(--gradient-gold)', boxShadow: 'var(--shadow-gold)', color: 'var(--cream)', fontFamily: 'Tajawal, sans-serif', fontWeight: 500, fontSize: '1rem', letterSpacing: '0.05em', border: 'none', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.6 : 1, transition: 'opacity 0.3s ease' }}
        >
          {saving ? 'جاري الحفظ...' : saveStatus === 'saved' ? '✓ تم الحفظ!' : saveStatus === 'error' ? 'خطأ — حاول مرة أخرى' : 'حفظ التغييرات'}
        </button>

      </div>
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 0', background: 'transparent',
  border: 'none', borderBottom: '1px solid var(--gold-deep)', outline: 'none',
  fontFamily: 'Tajawal, sans-serif', fontSize: '0.95rem', color: 'var(--ink)', direction: 'rtl',
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: 'white', boxShadow: '0 1px 16px rgba(0,0,0,0.04)', borderRadius: '4px' }}>
      <div style={{ padding: '0.9rem 1.5rem', borderBottom: '1px solid rgba(184,150,46,0.15)' }}>
        <h2 style={{ fontFamily: 'Amiri, serif', fontWeight: 400, fontSize: '1.1rem', color: 'var(--emerald-deep)' }}>{title}</h2>
      </div>
      <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>{children}</div>
    </div>
  )
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: '0.7rem', letterSpacing: '0.08em', color: 'var(--gold-deep)', marginBottom: '0.5rem', fontFamily: 'Tajawal, sans-serif' }}>
        {label}
      </label>
      {children}
      {hint && <p style={{ marginTop: '0.3rem', fontSize: '0.65rem', color: 'var(--gold-deep)', opacity: 0.7, lineHeight: 1.7, fontFamily: 'Tajawal, sans-serif' }}>{hint}</p>}
    </div>
  )
}

function TextIn({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={inputStyle} />
}

function ImageUpload({ value, defaultValue, status, error, onUpload, onClear }: { value: string; defaultValue?: string; status: UploadStatus; error?: string; onUpload: (f: File) => void; onClear?: () => void }) {
  const inputRef = useRef<HTMLInputElement>(null)
  const uploading = status === 'uploading'
  const displayUrl = value || defaultValue

  return (
    <div>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <label style={{ flex: 1, display: 'block', padding: '1rem', border: '1px dashed rgba(184,150,46,0.4)', textAlign: 'center', cursor: uploading ? 'not-allowed' : 'pointer', fontSize: '0.85rem', color: 'var(--gold)', opacity: uploading ? 0.5 : 1, borderRadius: '4px', fontFamily: 'Tajawal, sans-serif' }}>
          {uploading ? 'جاري الرفع...' : value ? 'تغيير الصورة' : '+ اختر صورة'}
          <input ref={inputRef} type="file" accept="image/*" style={{ display: 'none' }} disabled={uploading} onChange={e => { const f = e.target.files?.[0]; if (f) { onUpload(f); e.currentTarget.value = '' } }} />
        </label>

        {value && onClear && (
          <button
            onClick={onClear}
            style={{ padding: '0 1rem', border: '1px solid rgba(220, 38, 38, 0.2)', background: 'rgba(220, 38, 38, 0.05)', color: '#dc2626', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem', fontFamily: 'Tajawal, sans-serif' }}
          >
            إزالة
          </button>
        )}
      </div>

      {status === 'success' && <p style={{ color: '#3a8c4b', fontSize: '0.75rem', marginTop: '0.4rem', textAlign: 'center', fontFamily: 'Tajawal, sans-serif' }}>تم الرفع بنجاح</p>}
      {status === 'error' && error && <div style={{ background: '#FEE', padding: '0.5rem', marginTop: '0.4rem', fontSize: '0.75rem', color: '#C00', borderRadius: '4px', fontFamily: 'Tajawal, sans-serif' }}>{error}</div>}

      {displayUrl && (
        <div style={{ relative: 'true', marginTop: '0.75rem' }}>
          <img src={displayUrl} alt="" style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '4px', opacity: value ? 1 : 0.5 }} />
          {!value && (
            <p style={{ fontSize: '0.65rem', color: 'var(--gold-deep)', textAlign: 'center', marginTop: '0.25rem', opacity: 0.8 }}>
              (يتم عرض الصورة الافتراضية حالياً)
            </p>
          )}
        </div>
      )}
    </div>
  )
}
