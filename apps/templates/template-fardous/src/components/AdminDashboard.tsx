import { useState, useRef } from 'react'
import { useTemplateData, useTemplateFieldsWithSave, api } from '@farhty/template-sdk'

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
      const msg = e instanceof Error ? e.message : 'Upload failed'
      setUploadStates(p => ({ ...p, [key]: 'error' }))
      setUploadErrors(p => ({ ...p, [key]: msg }))
      setTimeout(() => { setUploadStates(p => ({ ...p, [key]: 'idle' })); setUploadErrors(p => { const n = { ...p }; delete n[key]; return n }) }, 5000)
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
    <div style={{ minHeight: '100vh', background: 'var(--cream)', fontFamily: '"Cormorant Garamond", serif', direction: 'ltr' }}>
      <div style={{ background: 'var(--emerald-deep)', padding: '1.5rem 1rem', textAlign: 'center' }}>
        <h1 style={{ color: 'var(--gold-soft)', fontFamily: '"Cormorant Garamond", serif', fontSize: '1.6rem', fontWeight: 400, letterSpacing: '0.1em' }}>
          فردوس — Dashboard
        </h1>
        <p style={{ color: 'rgba(212,184,112,0.6)', marginTop: '0.25rem', fontSize: '0.72rem', letterSpacing: '0.1em' }}>
          Manage your invitation content
        </p>
      </div>

      <div style={{ maxWidth: '640px', margin: '0 auto', padding: '2.5rem 1rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>

        {/* Couple */}
        <Section title="The Couple">
          <Field label="Bride's Name"><TextIn value={get('bride_name') ?? ''} onChange={v => set('bride_name', v)} placeholder="Noor" /></Field>
          <Field label="Groom's Name"><TextIn value={get('groom_name') ?? ''} onChange={v => set('groom_name', v)} placeholder="Yusuf" /></Field>
          <Field label="Bride's Family Name"><TextIn value={get('family_bride') ?? ''} onChange={v => set('family_bride', v)} placeholder="Al-Hassan" /></Field>
          <Field label="Groom's Family Name"><TextIn value={get('family_groom') ?? ''} onChange={v => set('family_groom', v)} placeholder="Al-Rahman" /></Field>
          <Field label="Event Type"><TextIn value={get('event_type') ?? ''} onChange={v => set('event_type', v)} placeholder="Walīmah" /></Field>
          <Field label="Wedding Date">
            <input type="date" value={get('wedding_date') as string ?? ''} onChange={e => set('wedding_date', e.target.value)} style={{ ...inputStyle, direction: 'ltr' }} />
          </Field>
          <Field label="Wedding Time (HH:MM)">
            <input type="time" value={get('wedding_time') as string ?? ''} onChange={e => set('wedding_time', e.target.value)} style={{ ...inputStyle, direction: 'ltr' }} />
          </Field>
        </Section>

        {/* Quran Verse */}
        <Section title="Quran Verse">
          <Field label="Arabic Text" hint="The Arabic verse displayed in the invitation">
            <textarea value={get('quran_verse_ar') as string ?? ''} onChange={e => set('quran_verse_ar', e.target.value)} rows={3} style={{ ...inputStyle, resize: 'vertical', direction: 'rtl' }} />
          </Field>
          <Field label="English Translation">
            <textarea value={get('quran_verse_en') as string ?? ''} onChange={e => set('quran_verse_en', e.target.value)} rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
          </Field>
          <Field label="Reference (e.g. Surah Ar-Rūm 30:21)">
            <TextIn value={get('quran_verse_ref') as string ?? ''} onChange={v => set('quran_verse_ref', v)} placeholder="— Surah Ar-Rūm 30:21" />
          </Field>
        </Section>

        {/* Venue */}
        <Section title="Venue">
          <Field label="Venue Name"><TextIn value={get('venue_name') as string ?? ''} onChange={v => set('venue_name', v)} placeholder="Al-Andalus Hall" /></Field>
          <Field label="Venue Address"><TextIn value={get('venue_address') as string ?? ''} onChange={v => set('venue_address', v)} placeholder="Heliopolis, Cairo · Egypt" /></Field>
          <Field label="Google Maps Embed URL" hint="Share → Embed a map → copy the src URL from the iframe">
            <input type="url" value={get('venue_map_url') as string ?? ''} onChange={e => set('venue_map_url', e.target.value)} placeholder="https://www.google.com/maps/embed?pb=..." style={{ ...inputStyle, direction: 'ltr' }} />
          </Field>
          {get('venue_map_url') && (
            <div style={{ borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(184,150,46,0.3)' }}>
              <iframe src={get('venue_map_url') as string} width="100%" height="200" style={{ border: 'none', display: 'block' }} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
            </div>
          )}
          <Field label="Directions Link" hint="Google Maps → Share → copy the short link">
            <input type="url" value={get('venue_map_link') as string ?? ''} onChange={e => set('venue_map_link', e.target.value)} placeholder="https://maps.google.com/?q=..." style={{ ...inputStyle, direction: 'ltr' }} />
          </Field>
        </Section>

        {/* Media */}
        <Section title="Media">
          <Field label="Hero / Background Image">
            <ImageUpload
              value={get('hero_image') as string ?? ''}
              status={ust['hero_image'] || 'idle'}
              error={uploadErrors['hero_image']}
              onUpload={f => handleUpload('hero_image', f, 'templates/fardous/hero')}
            />
          </Field>
          <Field label="Quran Recitation URL" hint="Direct URL to an MP3 file (default: Mishary Alafasy — Ar-Rum 30:21)">
            <input type="url" value={get('audio_url') as string ?? ''} onChange={e => set('audio_url', e.target.value)} placeholder="https://everyayah.com/data/..." style={{ ...inputStyle, direction: 'ltr' }} />
          </Field>
          <Field label="Accent Color">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <input type="color" value={get('accent_color') as string ?? '#B8962E'} onChange={e => set('accent_color', e.target.value)} style={{ width: '48px', height: '36px', border: 'none', cursor: 'pointer', background: 'transparent' }} />
              <span style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: 'var(--gold-deep)' }}>{get('accent_color') as string ?? '#B8962E'}</span>
            </div>
          </Field>
        </Section>

        {/* Wish wall moderation */}
        {wishes.length > 0 && (
          <Section title={`Wish Wall (${wishes.length} wishes — ${wishes.filter(w => w.visible !== false).length} visible)`}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {wishes.map((w, i) => {
                const visible = w.visible !== false
                return (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '1rem', background: visible ? 'white' : 'rgba(247,243,233,0.5)', border: '1px solid rgba(184,150,46,0.2)', borderRadius: '8px', opacity: visible ? 1 : 0.55 }}>
                    <button onClick={() => toggleWishVisible(i)} title={visible ? 'Hide from guests' : 'Show to guests'} style={{ flexShrink: 0, width: '32px', height: '32px', borderRadius: '50%', border: `1px solid ${visible ? 'var(--gold)' : 'var(--gold-deep)'}`, background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg viewBox="0 0 20 20" fill="none" style={{ width: '14px', height: '14px' }}>
                        {visible
                          ? <><path d="M2 10s3-6 8-6 8 6 8 6-3 6-8 6-8-6-8-6z" stroke="var(--gold)" strokeWidth="1.2"/><circle cx="10" cy="10" r="2" stroke="var(--gold)" strokeWidth="1.2"/></>
                          : <><path d="M3 3l14 14M8.5 8.5A2 2 0 0012 12m-6.5-5.5C4.2 7.7 2 10 2 10s3 6 8 6c1.5 0 2.9-.4 4-.9" stroke="var(--gold-deep)" strokeWidth="1.2" strokeLinecap="round"/><path d="M14 13.5C15.7 12.2 18 10 18 10s-3-6-8-6c-.7 0-1.4.1-2 .3" stroke="var(--gold-deep)" strokeWidth="1.2" strokeLinecap="round"/></>
                        }
                      </svg>
                    </button>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: '0.85rem', lineHeight: 1.7 }}>{w.message}</p>
                      <p style={{ fontSize: '0.65rem', color: 'var(--gold)', marginTop: '0.3rem' }}>— {w.name}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </Section>
        )}

        {/* Save */}
        <button
          onClick={handleSave}
          disabled={saving}
          style={{ display: 'block', width: '100%', padding: '1rem', borderRadius: '999px', background: 'var(--gradient-gold)', boxShadow: 'var(--shadow-gold)', color: 'var(--cream)', fontFamily: '"Cormorant Garamond", serif', fontSize: '1rem', letterSpacing: '0.1em', border: 'none', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.6 : 1, transition: 'opacity 0.3s ease' }}
        >
          {saving ? 'Saving…' : saveStatus === 'saved' ? '✓ Saved!' : saveStatus === 'error' ? 'Error — try again' : 'Save Changes'}
        </button>
      </div>
    </div>
  )
}

const inputStyle: React.CSSProperties = { width: '100%', padding: '10px 0', background: 'transparent', border: 'none', borderBottom: '1px solid var(--gold-deep)', outline: 'none', fontFamily: '"Cormorant Garamond", serif', fontSize: '1rem', color: 'var(--ink)' }

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: 'white', boxShadow: '0 1px 16px rgba(0,0,0,0.04)', borderRadius: '4px' }}>
      <div style={{ padding: '0.9rem 1.5rem', borderBottom: '1px solid rgba(184,150,46,0.15)' }}>
        <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontWeight: 400, fontSize: '1.1rem', letterSpacing: '0.05em', color: 'var(--emerald-deep)' }}>{title}</h2>
      </div>
      <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>{children}</div>
    </div>
  )
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--gold-deep)', marginBottom: '0.5rem' }}>{label}</label>
      {children}
      {hint && <p style={{ marginTop: '0.3rem', fontSize: '0.65rem', color: 'var(--gold-deep)', opacity: 0.7, lineHeight: 1.6 }}>{hint}</p>}
    </div>
  )
}

function TextIn({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={inputStyle} />
}

function ImageUpload({ value, status, error, onUpload }: { value: string; status: UploadStatus; error?: string; onUpload: (f: File) => void }) {
  const inputRef = useRef<HTMLInputElement>(null)
  const uploading = status === 'uploading'
  return (
    <div>
      <label style={{ display: 'block', width: '100%', padding: '1rem', border: '1px dashed rgba(184,150,46,0.4)', textAlign: 'center', cursor: uploading ? 'not-allowed' : 'pointer', fontSize: '0.8rem', letterSpacing: '0.08em', color: 'var(--gold)', opacity: uploading ? 0.5 : 1, borderRadius: '4px' }}>
        {uploading ? 'Uploading…' : '+ Choose Image'}
        <input ref={inputRef} type="file" accept="image/*" style={{ display: 'none' }} disabled={uploading} onChange={e => { const f = e.target.files?.[0]; if (f) { onUpload(f); e.currentTarget.value = '' } }} />
      </label>
      {status === 'success' && <p style={{ color: '#3a8c4b', fontSize: '0.72rem', marginTop: '0.4rem', textAlign: 'center' }}>Upload successful</p>}
      {status === 'error' && error && <div style={{ background: '#FEE', padding: '0.5rem', marginTop: '0.4rem', fontSize: '0.72rem', color: '#C00', borderRadius: '4px' }}>{error}</div>}
      {value && <img src={value} alt="" style={{ width: '100%', marginTop: '0.75rem', maxHeight: '200px', objectFit: 'cover', borderRadius: '4px' }} />}
    </div>
  )
}
