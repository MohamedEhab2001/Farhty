import { useState, useRef } from 'react'
import { useTemplateData, useTemplateFieldsWithSave, api } from '@farhty/template-sdk'

type UploadStatus = 'idle' | 'uploading' | 'success' | 'error'

// ─── Upload a single file to Cloudinary via signed URL ────────────────────────
async function uploadToCloudinary(
  file: File,
  folder: string,
  slug: string,
): Promise<string> {
  const token = localStorage.getItem(`farhty_token_${slug}`)
  const signRes = await api.post(
    '/api/upload/sign',
    { folder },
    { headers: { Authorization: `Bearer ${token}` } },
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
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: 'POST', body: fd },
  )
  const upData = await upRes.json()
  if (upData.error) throw new Error(upData.error.message || 'Cloudinary rejected upload')
  return upData.secure_url as string
}

// ─── Parse a field value into a string[] ──────────────────────────────────────
function parseImages(raw: unknown): string[] {
  if (Array.isArray(raw)) return raw.filter(Boolean)
  if (typeof raw === 'string') {
    try { return (JSON.parse(raw) as string[]).filter(Boolean) } catch { return [] }
  }
  return []
}

export default function AdminDashboard() {
  const { instance, slug } = useTemplateData()
  const { get, set, save } = useTemplateFieldsWithSave()
  const [saving, setSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved' | 'error'>('idle')

  // Single-image upload states (hero)
  const [uploadStates, setUploadStates] = useState<Record<string, UploadStatus>>({})
  const [uploadErrors, setUploadErrors] = useState<Record<string, string>>({})

  // Multi-image upload progress
  const [multiUploadProgress, setMultiUploadProgress] = useState<Record<string, string>>({})

  if (!instance) return null

  // ── Single image upload ───────────────────────────────────────────────────
  const handleUpload = async (key: string, file: File, folder: string) => {
    setUploadStates(prev => ({ ...prev, [key]: 'uploading' }))
    setUploadErrors(prev => { const n = { ...prev }; delete n[key]; return n })
    try {
      const url = await uploadToCloudinary(file, folder, slug)
      set(key, url)
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

  // ── Multi image upload (appends to array in field) ────────────────────────
  const handleMultiUpload = async (
    key: string,
    files: FileList,
    folder: string,
  ) => {
    const existing = parseImages(get(key))
    const newUrls: string[] = []
    const total = files.length

    for (let i = 0; i < total; i++) {
      setMultiUploadProgress(prev => ({
        ...prev,
        [key]: `Uploading ${i + 1} / ${total}…`,
      }))
      try {
        const url = await uploadToCloudinary(files[i], folder, slug)
        newUrls.push(url)
      } catch (e) {
        console.error(`Failed to upload ${files[i].name}:`, e)
      }
    }

    set(key, [...existing, ...newUrls])
    setMultiUploadProgress(prev => ({ ...prev, [key]: '' }))
  }

  // ── Remove one image from an array field ──────────────────────────────────
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

  const rsvpEntries = parseImages(get('rsvp_entries')) as unknown as {
    name: string; attending: boolean; guests: number
  }[]
  const wishEntries = parseImages(get('wish_entries')) as unknown as {
    name: string; message: string
  }[]

  const storyImages  = parseImages(get('story_images'))
  const galleryImages = parseImages(get('gallery_images'))

  return (
    <div className="min-h-screen bg-ivory" style={{ fontFamily: 'Jost, sans-serif', direction: 'ltr' }}>

      {/* Header */}
      <div className="bg-navy py-6 px-4 text-center">
        <h1
          className="text-champagne tracking-widest uppercase"
          style={{ fontFamily: 'Cormorant SC, serif', fontSize: '1.5rem', fontWeight: 400 }}
        >
          Ahd — Dashboard
        </h1>
        <p className="text-champagne/50 mt-1 uppercase tracking-[0.2em]" style={{ fontSize: '0.62rem' }}>
          Manage invitation content
        </p>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-10 space-y-8">

        {/* ─── Couple ─── */}
        <Section title="Couple">
          <Field label="Groom Name">
            <TextInput value={get('groom_name') ?? ''} onChange={v => set('groom_name', v)} placeholder="Karim" />
          </Field>
          <Field label="Bride Name">
            <TextInput value={get('bride_name') ?? ''} onChange={v => set('bride_name', v)} placeholder="Layla" />
          </Field>
          <Field label="Wedding Date">
            <input
              type="date"
              value={get('wedding_date') ?? ''}
              onChange={e => set('wedding_date', e.target.value)}
              style={inputLineStyle}
            />
          </Field>
          <Field label="Wedding Time">
            <TextInput value={get('wedding_time') ?? ''} onChange={v => set('wedding_time', v)} placeholder="6:00 PM" />
          </Field>
          <Field label="Italic Tagline Above Names">
            <TextInput value={get('tagline') ?? ''} onChange={v => set('tagline', v)} placeholder="Together Forever" />
          </Field>
        </Section>

        {/* ─── Media ─── */}
        <Section title="Media">
          <Field label="Hero Portrait Photo">
            <ImageUpload
              value={get('hero_image') ?? ''}
              uploadStatus={uploadStates['hero_image'] || 'idle'}
              uploadError={uploadErrors['hero_image']}
              onUpload={f => handleUpload('hero_image', f, 'templates/ahd/hero')}
            />
          </Field>
          <Field label="Accent Color">
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
          </Field>
        </Section>

        {/* ─── Ceremony ─── */}
        <Section title="Ceremony">
          <Field label="Venue Name">
            <TextInput value={get('ceremony_venue') ?? ''} onChange={v => set('ceremony_venue', v)} placeholder="St. Mary's Cathedral" />
          </Field>
          <Field label="Time">
            <TextInput value={get('ceremony_time') ?? ''} onChange={v => set('ceremony_time', v)} placeholder="5:00 PM" />
          </Field>
          <Field label="Address">
            <TextInput value={get('ceremony_address') ?? ''} onChange={v => set('ceremony_address', v)} placeholder="123 Church Street, Cairo" />
          </Field>
        </Section>

        {/* ─── Reception ─── */}
        <Section title="Reception">
          <Field label="Venue Name">
            <TextInput value={get('reception_venue') ?? ''} onChange={v => set('reception_venue', v)} placeholder="The Grand Ballroom" />
          </Field>
          <Field label="Time">
            <TextInput value={get('reception_time') ?? ''} onChange={v => set('reception_time', v)} placeholder="7:00 PM" />
          </Field>
          <Field label="Address">
            <TextInput value={get('reception_address') ?? ''} onChange={v => set('reception_address', v)} placeholder="456 Garden Avenue, Cairo" />
          </Field>
        </Section>

        {/* ─── Location / Map ─── */}
        <Section title="Location & Map">
          <Field label='Google Maps Embed URL (src from <iframe>)'>
            <TextInput
              value={get('map_embed_url') ?? ''}
              onChange={v => set('map_embed_url', v)}
              placeholder="https://www.google.com/maps/embed?pb=..."
            />
            <p style={{ marginTop: '0.4rem', fontSize: '0.65rem', color: '#8A8078', lineHeight: 1.5 }}>
              In Google Maps → Share → Embed a map → copy only the <code>src</code> value from the iframe tag.
            </p>
          </Field>

          {/* Live preview of the iframe */}
          {get('map_embed_url') && (
            <div style={{ borderRadius: '4px', overflow: 'hidden', border: '1px solid rgba(196,163,90,0.25)' }}>
              <iframe
                src={get('map_embed_url') as string}
                width="100%"
                height="220"
                style={{ border: 0, display: 'block' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Venue Map Preview"
              />
            </div>
          )}

          <Field label="Google Maps Link (for Get Directions button)">
            <TextInput
              value={get('map_location_url') ?? ''}
              onChange={v => set('map_location_url', v)}
              placeholder="https://maps.google.com/?q=..."
            />
            <p style={{ marginTop: '0.4rem', fontSize: '0.65rem', color: '#8A8078' }}>
              In Google Maps → Share → copy the short link.
            </p>
          </Field>
        </Section>

        {/* ─── Our Story ─── */}
        <Section title="Our Story">
          <Field label="Story Text">
            <textarea
              value={get('story_text') ?? ''}
              onChange={e => set('story_text', e.target.value)}
              rows={5}
              placeholder="Tell your story..."
              style={{ ...inputLineStyle, resize: 'vertical', fontFamily: 'Jost, sans-serif', fontSize: '0.9rem' }}
            />
          </Field>

          <Field label={`Story Photos (${storyImages.length} uploaded)`}>
            <MultiImageUpload
              images={storyImages}
              progress={multiUploadProgress['story_images']}
              onUpload={files => handleMultiUpload('story_images', files, 'templates/ahd/story')}
              onRemove={i => removeImage('story_images', i)}
            />
          </Field>
        </Section>

        {/* ─── Gallery ─── */}
        <Section title="Gallery">
          <Field label={`Gallery Photos (${galleryImages.length} uploaded)`}>
            <MultiImageUpload
              images={galleryImages}
              progress={multiUploadProgress['gallery_images']}
              onUpload={files => handleMultiUpload('gallery_images', files, 'templates/ahd/gallery')}
              onRemove={i => removeImage('gallery_images', i)}
            />
          </Field>
        </Section>

        {/* ─── RSVP Entries (read-only) ─── */}
        {rsvpEntries.length > 0 && (
          <Section title={`RSVPs (${rsvpEntries.length})`}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', fontSize: '0.85rem', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(196,163,90,0.2)' }}>
                    {['Name', 'Status', 'Guests'].map(h => (
                      <th key={h} style={{ padding: '8px 0', textAlign: 'left', color: '#8A8078', fontWeight: 300, letterSpacing: '0.1em', fontSize: '0.65rem', textTransform: 'uppercase' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rsvpEntries.map((entry, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid rgba(196,163,90,0.08)' }}>
                      <td style={{ padding: '10px 0' }}>{entry.name}</td>
                      <td style={{ padding: '10px 0' }}>
                        <span style={{
                          padding: '2px 10px', borderRadius: '999px', fontSize: '0.65rem',
                          letterSpacing: '0.1em', textTransform: 'uppercase',
                          background: entry.attending ? '#D4EDDA' : '#F8D7DA',
                          color: entry.attending ? '#155724' : '#721C24',
                        }}>
                          {entry.attending ? 'Attending' : 'Declined'}
                        </span>
                      </td>
                      <td style={{ padding: '10px 0' }}>{entry.guests || 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>
        )}

        {/* ─── Wishes (read-only) ─── */}
        {wishEntries.length > 0 && (
          <Section title={`Wishes (${wishEntries.length})`}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {wishEntries.map((wish, i) => (
                <div key={i} style={{ padding: '1rem', background: 'white', boxShadow: '0 1px 8px rgba(0,0,0,0.05)' }}>
                  <p style={{ fontSize: '0.85rem', color: '#3C3C3C', lineHeight: 1.7, marginBottom: '0.4rem' }}>{wish.message}</p>
                  <p style={{ fontSize: '0.65rem', color: '#C4A35A', letterSpacing: '0.15em', textTransform: 'uppercase' }}>— {wish.name}</p>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* ─── Save ─── */}
        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            display: 'block', width: '100%', padding: '1rem', borderRadius: '999px',
            background: '#1E2B3A', color: '#F5E6C8', fontFamily: 'Jost, sans-serif',
            fontWeight: 300, fontSize: '0.75rem', letterSpacing: '0.25em',
            textTransform: 'uppercase', border: 'none',
            cursor: saving ? 'not-allowed' : 'pointer',
            opacity: saving ? 0.6 : 1, transition: 'opacity 0.3s ease',
          }}
        >
          {saving ? 'Saving…'
           : saveStatus === 'saved' ? 'Saved!'
           : saveStatus === 'error' ? 'Error — Try Again'
           : 'Save Changes'}
        </button>

      </div>
    </div>
  )
}

// ─── Shared inline style for date/textarea border-bottom inputs ───────────────
const inputLineStyle: React.CSSProperties = {
  width: '100%', padding: '10px 0', background: 'transparent',
  border: 'none', borderBottom: '1px solid #8A8078', outline: 'none',
  fontFamily: 'Jost, sans-serif', fontSize: '0.95rem', color: '#3C3C3C',
}

// ─── Section wrapper ──────────────────────────────────────────────────────────
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: 'white', boxShadow: '0 1px 16px rgba(0,0,0,0.05)' }}>
      <div style={{ padding: '0.9rem 1.5rem', borderBottom: '1px solid rgba(196,163,90,0.15)' }}>
        <h2 style={{ fontFamily: 'Cormorant SC, serif', fontWeight: 400, fontSize: '0.85rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#3C3C3C' }}>
          {title}
        </h2>
      </div>
      <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {children}
      </div>
    </div>
  )
}

// ─── Field wrapper ────────────────────────────────────────────────────────────
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ display: 'block', fontFamily: 'Jost, sans-serif', fontWeight: 300, fontSize: '0.62rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#8A8078', marginBottom: '0.5rem' }}>
        {label}
      </label>
      {children}
    </div>
  )
}

// ─── Single-line text input ───────────────────────────────────────────────────
function TextInput({ value, onChange, placeholder }: {
  value: string; onChange: (v: string) => void; placeholder?: string
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      style={inputLineStyle}
      onFocus={e => e.target.style.borderBottomColor = '#C4A35A'}
      onBlur={e => e.target.style.borderBottomColor = '#8A8078'}
    />
  )
}

// ─── Single image upload (hero) ───────────────────────────────────────────────
function ImageUpload({ value, uploadStatus, uploadError, onUpload }: {
  value: string; uploadStatus: 'idle' | 'uploading' | 'success' | 'error'
  uploadError?: string; onUpload: (file: File) => void
}) {
  const isUploading = uploadStatus === 'uploading'
  return (
    <div>
      <label style={{
        display: 'block', width: '100%', padding: '1rem',
        border: '1px dashed rgba(196,163,90,0.4)', textAlign: 'center',
        cursor: isUploading ? 'not-allowed' : 'pointer',
        fontFamily: 'Jost, sans-serif', fontWeight: 300, fontSize: '0.7rem',
        letterSpacing: '0.15em', textTransform: 'uppercase', color: '#C4A35A',
        opacity: isUploading ? 0.5 : 1, transition: 'border-color 0.3s',
      }}>
        {isUploading ? 'Uploading…' : '+ Choose Image'}
        <input type="file" accept="image/*" style={{ display: 'none' }} disabled={isUploading}
          onChange={e => { const f = e.target.files?.[0]; if (f) onUpload(f) }} />
      </label>
      {uploadStatus === 'success' && (
        <p style={{ color: '#3a8c4b', fontSize: '0.72rem', marginTop: '0.4rem', textAlign: 'center' }}>Uploaded successfully</p>
      )}
      {uploadStatus === 'error' && uploadError && (
        <div style={{ background: '#FEE', padding: '0.5rem', marginTop: '0.4rem', fontSize: '0.72rem', color: '#C00' }}>{uploadError}</div>
      )}
      {value && (
        <img src={value} alt="" style={{ width: '100%', marginTop: '0.75rem', maxHeight: '200px', objectFit: 'cover' }} />
      )}
    </div>
  )
}

// ─── Multi-image upload with thumbnail grid ───────────────────────────────────
function MultiImageUpload({ images, progress, onUpload, onRemove }: {
  images: string[]
  progress: string | undefined
  onUpload: (files: FileList) => void
  onRemove: (index: number) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const isUploading = Boolean(progress)

  return (
    <div>
      {/* Drop zone / file picker */}
      <label
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: '0.5rem', padding: '1rem',
          border: '1px dashed rgba(196,163,90,0.4)', cursor: isUploading ? 'not-allowed' : 'pointer',
          fontFamily: 'Jost, sans-serif', fontWeight: 300, fontSize: '0.7rem',
          letterSpacing: '0.15em', textTransform: 'uppercase', color: '#C4A35A',
          opacity: isUploading ? 0.5 : 1,
        }}
      >
        <svg viewBox="0 0 20 20" fill="none" style={{ width: '16px', height: '16px' }}>
          <path d="M10 4v12M4 10h12" stroke="#C4A35A" strokeWidth="1.4" strokeLinecap="round"/>
        </svg>
        {isUploading ? progress : 'Add Images (multiple)'}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          style={{ display: 'none' }}
          disabled={isUploading}
          onChange={e => { if (e.target.files?.length) { onUpload(e.target.files); e.target.value = '' } }}
        />
      </label>

      {/* Thumbnail grid */}
      {images.length > 0 && (
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '0.5rem', marginTop: '0.75rem',
        }}>
          {images.map((url, i) => (
            <div key={`${url}-${i}`} style={{ position: 'relative', aspectRatio: '1', overflow: 'hidden' }}>
              <img src={url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              {/* Remove button */}
              <button
                onClick={() => onRemove(i)}
                style={{
                  position: 'absolute', top: '4px', right: '4px',
                  width: '20px', height: '20px', borderRadius: '50%',
                  background: 'rgba(0,0,0,0.55)', border: 'none',
                  color: 'white', fontSize: '12px', lineHeight: '20px',
                  textAlign: 'center', cursor: 'pointer', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                }}
                title="Remove image"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {images.length === 0 && !isUploading && (
        <p style={{ textAlign: 'center', marginTop: '0.5rem', fontSize: '0.65rem', color: '#8A8078' }}>
          No images yet
        </p>
      )}
    </div>
  )
}
