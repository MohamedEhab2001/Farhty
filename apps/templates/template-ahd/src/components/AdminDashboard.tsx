import { useState, useRef } from 'react'
import { useTemplateData, useTemplateFieldsWithSave, api } from '@farhty/template-sdk'

type UploadStatus = 'idle' | 'uploading' | 'success' | 'error'

async function uploadToCloudinary(file: File, folder: string, slug: string): Promise<string> {
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

  const upRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, { method: 'POST', body: fd })
  const upData = await upRes.json()
  if (upData.error) throw new Error(upData.error.message || 'Cloudinary rejected upload')
  return upData.secure_url as string
}

function parseImages(raw: unknown): string[] {
  if (Array.isArray(raw)) return raw.filter(Boolean)
  if (typeof raw === 'string') { try { return (JSON.parse(raw) as string[]).filter(Boolean) } catch { return [] } }
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

  // ── رفع صورة واحدة (hero) ──────────────────────────────────────────────
  const handleUpload = async (key: string, file: File, folder: string) => {
    setUploadStates(prev => ({ ...prev, [key]: 'uploading' }))
    setUploadErrors(prev => { const n = { ...prev }; delete n[key]; return n })
    try {
      const url = await uploadToCloudinary(file, folder, slug)
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

  // ── رفع صورة واحدة وإضافتها للمصفوفة (story / gallery) ────────────────
  const handleArrayUpload = async (key: string, file: File, folder: string) => {
    setUploadStates(prev => ({ ...prev, [key]: 'uploading' }))
    setUploadErrors(prev => { const n = { ...prev }; delete n[key]; return n })
    try {
      const url = await uploadToCloudinary(file, folder, slug)
      const existing = parseImages(get(key))
      set(key, [...existing, url])
      setUploadStates(prev => ({ ...prev, [key]: 'success' }))
      setTimeout(() => setUploadStates(prev => ({ ...prev, [key]: 'idle' })), 2500)
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

  // parse helpers
  const parseJson = (raw: unknown) => {
    if (Array.isArray(raw)) return raw
    if (typeof raw === 'string') { try { return JSON.parse(raw) } catch { return [] } }
    return []
  }

  const rsvpEntries: { name: string; attending: boolean; guests: number }[] = parseJson(get('rsvp_entries'))
  const wishEntries: { name: string; message: string; timestamp?: string; visible?: boolean }[] = parseJson(get('wish_entries'))
  const storyImages = parseImages(get('story_images'))
  const galleryImages = parseImages(get('gallery_images'))

  // stats
  const attending = rsvpEntries.filter(e => e.attending)
  const totalGuests = attending.reduce((sum, e) => sum + (e.guests || 0), 0)

  // toggle wish visibility and immediately save
  const toggleWishVisible = async (index: number) => {
    const updated = wishEntries.map((w, i) =>
      i === index ? { ...w, visible: w.visible === false ? true : false } : w
    )
    set('wish_entries', updated)
    setSaving(true)
    try {
      await save()
      setSaveStatus('saved')
      setTimeout(() => setSaveStatus('idle'), 1500)
    } catch {
      setSaveStatus('error')
      setTimeout(() => setSaveStatus('idle'), 3000)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-ivory" style={{ fontFamily: 'Tajawal, sans-serif', direction: 'rtl' }}>

      {/* رأس الصفحة */}
      <div className="bg-navy py-6 px-4 text-center">
        <h1 className="text-champagne" style={{ fontFamily: 'Amiri, serif', fontSize: '1.6rem', fontWeight: 400, letterSpacing: '0.05em' }}>
          عهد — لوحة التحكم
        </h1>
        <p className="text-champagne/50 mt-1" style={{ fontSize: '0.72rem' }}>إدارة محتوى الدعوة</p>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-10 space-y-8">

        {/* ─── بيانات الزوجين ─── */}
        <Section title="بيانات الزوجين">
          <Field label="اسم العريس">
            <TextInput value={get('groom_name') ?? ''} onChange={v => set('groom_name', v)} placeholder="كريم" />
          </Field>
          <Field label="اسم العروسة">
            <TextInput value={get('bride_name') ?? ''} onChange={v => set('bride_name', v)} placeholder="ليلى" />
          </Field>
          <Field label="تاريخ الزفاف">
            <input type="date" value={get('wedding_date') ?? ''} onChange={e => set('wedding_date', e.target.value)} style={inputLineStyle} dir="ltr" />
          </Field>
          <Field label="وقت الحفل">
            <TextInput value={get('wedding_time') ?? ''} onChange={v => set('wedding_time', v)} placeholder="٦:٠٠ مساءً" />
          </Field>
          <Field label="العبارة المائلة فوق الأسماء">
            <TextInput value={get('tagline') ?? ''} onChange={v => set('tagline', v)} placeholder="معًا إلى الأبد" />
          </Field>
        </Section>

        {/* ─── الوسائط ─── */}
        <Section title="الوسائط">
          <Field label="صورة الغلاف (البورتريه)">
            <SingleImageUpload
              value={get('hero_image') ?? ''}
              uploadStatus={uploadStates['hero_image'] || 'idle'}
              uploadError={uploadErrors['hero_image']}
              onUpload={f => handleUpload('hero_image', f, 'templates/ahd/hero')}
            />
          </Field>
          {/* <Field label="اللون الرئيسي">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <input
                type="color"
                value={get('accent_color') ?? '#C4A35A'}
                onChange={e => set('accent_color', e.target.value)}
                style={{ width: '48px', height: '36px', border: 'none', cursor: 'pointer', background: 'transparent' }}
              />
              <span style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: '#8A8078' }}>
                {get('accent_color') ?? '#C4A35A'}
              </span>
            </div>
          </Field> */}
        </Section>

        {/* ─── حفل الزواج ─── */}
        <Section title="حفل الزواج">
          <Field label="اسم القاعة"><TextInput value={get('ceremony_venue') ?? ''} onChange={v => set('ceremony_venue', v)} placeholder="قاعة القصر الملكي" /></Field>
          <Field label="الوقت"><TextInput value={get('ceremony_time') ?? ''} onChange={v => set('ceremony_time', v)} placeholder="٥:٠٠ مساءً" /></Field>
          <Field label="العنوان"><TextInput value={get('ceremony_address') ?? ''} onChange={v => set('ceremony_address', v)} placeholder="شارع النيل ٤٥٦، الزمالك، القاهرة" /></Field>
        </Section>

        {/* ─── حفل الاستقبال ─── */}
        <Section title="حفل الحناء">
          <Field label="اسم القاعة"><TextInput value={get('reception_venue') ?? ''} onChange={v => set('reception_venue', v)} placeholder="قاعة الأفراح الكبرى" /></Field>
          <Field label="الوقت"><TextInput value={get('reception_time') ?? ''} onChange={v => set('reception_time', v)} placeholder="٧:٠٠ مساءً" /></Field>
          <Field label="العنوان"><TextInput value={get('reception_address') ?? ''} onChange={v => set('reception_address', v)} placeholder="شارع الحديقة ٤٥٦، القاهرة" /></Field>
        </Section>

        {/* ─── الموقع على الخريطة ─── */}
        <Section title="الموقع والخريطة">
          <Field label="رابط تضمين خرائط جوجل (src من iframe)">
            <TextInput
              value={get('map_embed_url') ?? ''}
              onChange={v => set('map_embed_url', v)}
              placeholder="https://www.google.com/maps/embed?pb=..."
            />
            <p style={{ marginTop: '0.4rem', fontSize: '0.65rem', color: '#8A8078', lineHeight: 1.6 }}>
              خرائط جوجل ← مشاركة ← تضمين خريطة ← انسخ قيمة الـ <code>src</code> فقط من الـ iframe.
            </p>
          </Field>

          {get('map_embed_url') && (
            <div style={{ borderRadius: '4px', overflow: 'hidden', border: '1px solid rgba(196,163,90,0.25)' }}>
              <iframe
                src={get('map_embed_url') as string}
                width="100%" height="220"
                style={{ border: 0, display: 'block' }}
                allowFullScreen loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="معاينة موقع القاعة"
              />
            </div>
          )}

          <Field label="رابط الاتجاهات (زر احصل على الاتجاهات)">
            <TextInput value={get('map_location_url') ?? ''} onChange={v => set('map_location_url', v)} placeholder="https://maps.google.com/?q=..." />
            <p style={{ marginTop: '0.4rem', fontSize: '0.65rem', color: '#8A8078' }}>
              خرائط جوجل ← مشاركة ← انسخ الرابط القصير.
            </p>
          </Field>
        </Section>

        {/* ─── قصتنا ─── */}
        <Section title="قصتنا">
          <Field label="نص القصة">
            <textarea
              value={get('story_text') ?? ''}
              onChange={e => set('story_text', e.target.value)}
              rows={5}
              placeholder="احكِ قصتكما..."
              style={{ ...inputLineStyle, resize: 'vertical', fontFamily: 'Tajawal, sans-serif', fontSize: '0.9rem' }}
            />
          </Field>
          <Field label={`صور قصتنا (${storyImages.length} صورة)`}>
            <ArrayImageUpload
              images={storyImages}
              uploadStatus={uploadStates['story_images'] || 'idle'}
              uploadError={uploadErrors['story_images']}
              onUpload={f => handleArrayUpload('story_images', f, 'templates/ahd/story')}
              onRemove={i => removeImage('story_images', i)}
            />
          </Field>
        </Section>

        {/* ─── معرض الصور ─── */}
        <Section title="معرض الصور">
          <Field label={`صور المعرض (${galleryImages.length} صورة)`}>
            <ArrayImageUpload
              images={galleryImages}
              uploadStatus={uploadStates['gallery_images'] || 'idle'}
              uploadError={uploadErrors['gallery_images']}
              onUpload={f => handleArrayUpload('gallery_images', f, 'templates/ahd/gallery')}
              onRemove={i => removeImage('gallery_images', i)}
            />
          </Field>
        </Section>

        {/* ─── تأكيدات الحضور ─── */}
        <Section title={`تأكيدات الحضور (${rsvpEntries.length})`}>
          {rsvpEntries.length === 0 ? (
            <p style={{ fontSize: '0.8rem', color: '#8A8078', textAlign: 'center' }}>لا توجد ردود بعد</p>
          ) : (
            <>
              {/* ملخص سريع */}
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                {[
                  { label: 'إجمالي الردود', value: rsvpEntries.length, color: '#1E2B3A' },
                  { label: 'سيحضرون', value: attending.length, color: '#155724' },
                  { label: 'اعتذروا', value: rsvpEntries.length - attending.length, color: '#721C24' },
                  { label: 'إجمالي الضيوف', value: totalGuests, color: '#C4A35A' },
                ].map(s => (
                  <div key={s.label} style={{ flex: '1 1 100px', background: '#F8F4EC', padding: '0.75rem 1rem', textAlign: 'center' }}>
                    <p style={{ fontFamily: 'Amiri, serif', fontSize: '1.5rem', color: s.color, lineHeight: 1 }}>{s.value}</p>
                    <p style={{ fontSize: '0.62rem', color: '#8A8078', marginTop: '0.25rem' }}>{s.label}</p>
                  </div>
                ))}
              </div>

              {/* جدول */}
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', fontSize: '0.85rem', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(196,163,90,0.2)' }}>
                      {['الاسم', 'الحالة', 'عدد الضيوف'].map(h => (
                        <th key={h} style={{ padding: '8px 0', textAlign: 'right', color: '#8A8078', fontWeight: 300, fontSize: '0.65rem' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rsvpEntries.map((entry, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid rgba(196,163,90,0.08)' }}>
                        <td style={{ padding: '10px 0' }}>{entry.name}</td>
                        <td style={{ padding: '10px 0' }}>
                          <span style={{ padding: '2px 10px', borderRadius: '999px', fontSize: '0.65rem', background: entry.attending ? '#D4EDDA' : '#F8D7DA', color: entry.attending ? '#155724' : '#721C24' }}>
                            {entry.attending ? 'حاضر' : 'معتذر'}
                          </span>
                        </td>
                        <td style={{ padding: '10px 0' }}>{entry.attending ? (entry.guests || 0) : '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </Section>

        {/* ─── الأمنيات مع تحكم في الظهور ─── */}
        <Section title={`الأمنيات (${wishEntries.length}) — ${wishEntries.filter(w => w.visible !== false).length} ظاهرة`}>
          {wishEntries.length === 0 ? (
            <p style={{ fontSize: '0.8rem', color: '#8A8078', textAlign: 'center' }}>لا توجد أمنيات بعد</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {wishEntries.map((wish, i) => {
                const isVisible = wish.visible !== false
                return (
                  <div
                    key={i}
                    style={{
                      display: 'flex', alignItems: 'flex-start', gap: '0.75rem',
                      padding: '1rem', background: isVisible ? 'white' : '#F8F4EC',
                      boxShadow: '0 1px 8px rgba(0,0,0,0.05)',
                      opacity: isVisible ? 1 : 0.55,
                      transition: 'opacity 0.3s ease',
                    }}
                  >
                    {/* زر التبديل */}
                    <button
                      onClick={() => toggleWishVisible(i)}
                      title={isVisible ? 'إخفاء عن الضيوف' : 'إظهار للضيوف'}
                      style={{
                        flexShrink: 0, width: '32px', height: '32px',
                        borderRadius: '50%', border: `1px solid ${isVisible ? '#C4A35A' : '#8A8078'}`,
                        background: 'transparent', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      {isVisible ? (
                        // عين مفتوحة
                        <svg viewBox="0 0 20 20" fill="none" style={{ width: '14px', height: '14px' }}>
                          <path d="M2 10s3-6 8-6 8 6 8 6-3 6-8 6-8-6-8-6z" stroke="#C4A35A" strokeWidth="1.2" />
                          <circle cx="10" cy="10" r="2" stroke="#C4A35A" strokeWidth="1.2" />
                        </svg>
                      ) : (
                        // عين مغلقة
                        <svg viewBox="0 0 20 20" fill="none" style={{ width: '14px', height: '14px' }}>
                          <path d="M3 3l14 14M8.5 8.5A2 2 0 0012 12m-6.5-5.5C4.2 7.7 2 10 2 10s3 6 8 6c1.5 0 2.9-.4 4-.9" stroke="#8A8078" strokeWidth="1.2" strokeLinecap="round" />
                          <path d="M14 13.5C15.7 12.2 18 10 18 10s-3-6-8-6c-.7 0-1.4.1-2 .3" stroke="#8A8078" strokeWidth="1.2" strokeLinecap="round" />
                        </svg>
                      )}
                    </button>

                    {/* المحتوى */}
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: '0.85rem', color: '#3C3C3C', lineHeight: 1.8, marginBottom: '0.3rem' }}>{wish.message}</p>
                      <p style={{ fontSize: '0.65rem', color: '#C4A35A' }}>— {wish.name}</p>
                      {!isVisible && (
                        <p style={{ fontSize: '0.6rem', color: '#8A8078', marginTop: '0.3rem' }}>مخفية عن الضيوف</p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </Section>

        {/* ─── الأقسام — إظهار وإخفاء ─── */}
        <Section title="الأقسام — إظهار وإخفاء">
          {instance.features.countdown && (
            <SectionToggle label="العد التنازلي" fieldKey="section_countdown_visible" get={get} set={set} />
          )}
          {instance.features.ourStory && (
            <SectionToggle label="قصتنا" fieldKey="section_ourstory_visible" get={get} set={set} />
          )}
          {instance.features.eventDetails && (
            <SectionToggle label="تفاصيل الحفل" fieldKey="section_eventdetails_visible" get={get} set={set} />
          )}
          {instance.features.venueMap && (
            <SectionToggle label="الموقع والخريطة" fieldKey="section_location_visible" get={get} set={set} />
          )}
          {instance.features.rsvp && (
            <SectionToggle label="تأكيد الحضور" fieldKey="section_rsvp_visible" get={get} set={set} />
          )}
          {instance.features.wishWall && (
            <SectionToggle label="جدار الأمنيات" fieldKey="section_wishwall_visible" get={get} set={set} />
          )}
          {instance.features.gallery && (
            <SectionToggle label="معرض الصور" fieldKey="section_gallery_visible" get={get} set={set} />
          )}
          {instance.features.shareButton && (
            <SectionToggle label="زر المشاركة" fieldKey="section_sharebutton_visible" get={get} set={set} />
          )}
        </Section>

        {/* ─── حفظ ─── */}
        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            display: 'block', width: '100%', padding: '1rem', borderRadius: '999px',
            background: '#1E2B3A', color: '#F5E6C8',
            fontFamily: 'Tajawal, sans-serif', fontWeight: 300, fontSize: '0.9rem',
            border: 'none', cursor: saving ? 'not-allowed' : 'pointer',
            opacity: saving ? 0.6 : 1, transition: 'opacity 0.3s ease',
          }}
        >
          {saving ? 'جاري الحفظ...'
            : saveStatus === 'saved' ? 'تم الحفظ!'
              : saveStatus === 'error' ? 'خطأ — حاول مرة أخرى'
                : 'حفظ التغييرات'}
        </button>

      </div>
    </div>
  )
}

// ─── Shared input style ────────────────────────────────────────────────────────
const inputLineStyle: React.CSSProperties = {
  width: '100%', padding: '10px 0', background: 'transparent',
  border: 'none', borderBottom: '1px solid #8A8078', outline: 'none',
  fontFamily: 'Tajawal, sans-serif', fontSize: '0.95rem', color: '#3C3C3C',
}

// ─── Section wrapper ───────────────────────────────────────────────────────────
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: 'white', boxShadow: '0 1px 16px rgba(0,0,0,0.05)' }}>
      <div style={{ padding: '0.9rem 1.5rem', borderBottom: '1px solid rgba(196,163,90,0.15)' }}>
        <h2 style={{ fontFamily: 'Amiri, serif', fontWeight: 400, fontSize: '1rem', color: '#3C3C3C' }}>{title}</h2>
      </div>
      <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {children}
      </div>
    </div>
  )
}

// ─── Field wrapper ─────────────────────────────────────────────────────────────
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ display: 'block', fontFamily: 'Tajawal, sans-serif', fontWeight: 300, fontSize: '0.65rem', color: '#8A8078', marginBottom: '0.5rem' }}>
        {label}
      </label>
      {children}
    </div>
  )
}

// ─── Text input ────────────────────────────────────────────────────────────────
function TextInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <input
      type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      style={inputLineStyle}
      onFocus={e => e.target.style.borderBottomColor = '#C4A35A'}
      onBlur={e => e.target.style.borderBottomColor = '#8A8078'}
    />
  )
}

// ─── Single image upload (hero) ────────────────────────────────────────────────
function SingleImageUpload({ value, uploadStatus, uploadError, onUpload }: {
  value: string; uploadStatus: UploadStatus; uploadError?: string; onUpload: (f: File) => void
}) {
  const isUploading = uploadStatus === 'uploading'
  return (
    <div>
      <label style={{
        display: 'block', width: '100%', padding: '1rem',
        border: '1px dashed rgba(196,163,90,0.4)', textAlign: 'center',
        cursor: isUploading ? 'not-allowed' : 'pointer',
        fontFamily: 'Tajawal, sans-serif', fontWeight: 300, fontSize: '0.8rem',
        color: '#C4A35A', opacity: isUploading ? 0.5 : 1,
      }}>
        {isUploading ? 'جاري الرفع...' : '+ اختر صورة'}
        <input type="file" accept="image/*" style={{ display: 'none' }} disabled={isUploading}
          onChange={e => { const f = e.target.files?.[0]; if (f) onUpload(f) }} />
      </label>
      {uploadStatus === 'success' && <p style={{ color: '#3a8c4b', fontSize: '0.72rem', marginTop: '0.4rem', textAlign: 'center' }}>تم الرفع بنجاح</p>}
      {uploadStatus === 'error' && uploadError && <div style={{ background: '#FEE', padding: '0.5rem', marginTop: '0.4rem', fontSize: '0.72rem', color: '#C00' }}>{uploadError}</div>}
      {value && <img src={value} alt="" style={{ width: '100%', marginTop: '0.75rem', maxHeight: '200px', objectFit: 'cover' }} />}
    </div>
  )
}

// ─── Section visibility toggle ────────────────────────────────────────────────
function SectionToggle({ label, fieldKey, get, set }: {
  label: string
  fieldKey: string
  get: (key: string) => unknown
  set: (key: string, value: unknown) => void
}) {
  const isVisible = get(fieldKey) !== false
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <span style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '0.9rem', color: isVisible ? '#3C3C3C' : '#8A8078' }}>
        {label}
      </span>
      <button
        onClick={() => set(fieldKey, !isVisible)}
        style={{
          position: 'relative', width: '44px', height: '24px', borderRadius: '999px',
          background: isVisible ? '#C4A35A' : '#D9D9D9',
          border: 'none', cursor: 'pointer', transition: 'background 0.25s ease', flexShrink: 0,
        }}
        title={isVisible ? 'إخفاء القسم' : 'إظهار القسم'}
      >
        <span style={{
          position: 'absolute', top: '3px',
          right: isVisible ? '3px' : '23px',
          width: '18px', height: '18px', borderRadius: '50%',
          background: 'white', transition: 'right 0.25s ease',
          boxShadow: '0 1px 4px rgba(0,0,0,0.18)',
        }} />
      </button>
    </div>
  )
}

// ─── Array image upload — one at a time ────────────────────────────────────────
function ArrayImageUpload({ images, uploadStatus, uploadError, onUpload, onRemove }: {
  images: string[]
  uploadStatus: UploadStatus
  uploadError?: string
  onUpload: (f: File) => void
  onRemove: (i: number) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const isUploading = uploadStatus === 'uploading'

  return (
    <div>
      {/* زر إضافة صورة واحدة */}
      <label style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
        padding: '1rem', border: '1px dashed rgba(196,163,90,0.4)',
        cursor: isUploading ? 'not-allowed' : 'pointer',
        fontFamily: 'Tajawal, sans-serif', fontWeight: 300,
        fontSize: '0.8rem', color: '#C4A35A',
        opacity: isUploading ? 0.5 : 1,
      }}>
        <svg viewBox="0 0 20 20" fill="none" style={{ width: '16px', height: '16px' }}>
          <path d="M10 4v12M4 10h12" stroke="#C4A35A" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
        {isUploading ? 'جاري رفع الصورة...' : 'أضف صورة'}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          disabled={isUploading}
          onChange={e => { const f = e.target.files?.[0]; if (f) { onUpload(f); e.target.value = '' } }}
        />
      </label>

      {uploadStatus === 'success' && <p style={{ color: '#3a8c4b', fontSize: '0.72rem', marginTop: '0.4rem', textAlign: 'center' }}>تمت إضافة الصورة</p>}
      {uploadStatus === 'error' && uploadError && <div style={{ background: '#FEE', padding: '0.5rem', marginTop: '0.4rem', fontSize: '0.72rem', color: '#C00' }}>{uploadError}</div>}

      {/* شبكة الصور المرفوعة */}
      {images.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginTop: '0.75rem' }}>
          {images.map((url, i) => (
            <div key={`${url}-${i}`} style={{ position: 'relative', aspectRatio: '1', overflow: 'hidden' }}>
              <img src={url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              <button
                onClick={() => onRemove(i)}
                style={{
                  position: 'absolute', top: '4px', right: '4px',
                  width: '20px', height: '20px', borderRadius: '50%',
                  background: 'rgba(0,0,0,0.55)', border: 'none',
                  color: 'white', fontSize: '13px', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
                title="حذف الصورة"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {images.length === 0 && !isUploading && (
        <p style={{ textAlign: 'center', marginTop: '0.5rem', fontSize: '0.65rem', color: '#8A8078' }}>لا توجد صور بعد</p>
      )}
    </div>
  )
}
