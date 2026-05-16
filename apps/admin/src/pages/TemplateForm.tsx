import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Layout from '../components/Layout'
import { api } from '../api/client'

const DEFAULT_JSON = JSON.stringify(
  {
    name: '',
    slug: '',
    price: 399,
    description: '',
    language: 'ar',
    features: {
      countdown: true,
      ourStory: true,
      eventDetails: true,
      rsvp: true,
      wishWall: true,
      gallery: true,
      shareButton: true,
      venueMap: true,
      rtl: true,
      pages: 1,
    },
    fields: [],
    previewImages: [],
    previewVideo: '',
    status: 'draft',
    version: '1.0.0',
  },
  null,
  2
)

export default function TemplateForm() {
  const { id } = useParams<{ id: string }>()
  const isEdit = !!id
  const navigate = useNavigate()
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const [json, setJson] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(isEdit)

  useEffect(() => {
    if (!isEdit) {
      setJson(DEFAULT_JSON)
      return
    }
    api
      .get(`/api/admin/templates/${id}`)
      .then(r => {
        const { _id, __v, createdAt, updatedAt, ...clean } = r.data
        setJson(JSON.stringify(clean, null, 2))
      })
      .catch(() => setError('تعذّر تحميل التصميم'))
      .finally(() => setLoading(false))
  }, [id, isEdit])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key !== 'Tab') return
    e.preventDefault()
    const el = e.currentTarget
    const start = el.selectionStart
    const end = el.selectionEnd
    const updated = json.substring(0, start) + '  ' + json.substring(end)
    setJson(updated)
    requestAnimationFrame(() => {
      el.selectionStart = el.selectionEnd = start + 2
    })
  }

  const format = () => {
    setError('')
    try {
      setJson(JSON.stringify(JSON.parse(json), null, 2))
    } catch (e) {
      setError(`JSON غير صالح: ${e instanceof Error ? e.message : 'خطأ في التنسيق'}`)
    }
  }

  const submit = async () => {
    setError('')
    let parsed: unknown
    try {
      parsed = JSON.parse(json)
    } catch (e) {
      setError(`JSON غير صالح: ${e instanceof Error ? e.message : 'خطأ في التنسيق'}`)
      textareaRef.current?.focus()
      return
    }
    setSaving(true)
    try {
      if (isEdit) {
        await api.put(`/api/admin/templates/${id}`, parsed)
      } else {
        await api.post('/api/admin/templates', parsed)
      }
      navigate('/templates')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'خطأ في الحفظ'
      setError(msg)
    } finally {
      setSaving(false)
    }
  }

  const lineCount = json.split('\n').length

  if (loading) {
    return (
      <Layout title="تعديل التصميم">
        <p style={{ color: '#9d8fa8' }}>جاري التحميل...</p>
      </Layout>
    )
  }

  return (
    <Layout title={isEdit ? 'تعديل التصميم' : 'تصميم جديد'}>
      <div style={{ maxWidth: '900px' }}>

        <p style={{ color: '#9d8fa8', fontSize: '13px', marginBottom: '16px' }}>
          {isEdit
            ? 'عدّل قيم JSON مباشرة ثم احفظ.'
            : 'أضف بيانات التصميم بصيغة JSON ثم أنشئه.'}
        </p>

        {/* Editor card */}
        <div className="card" style={{ padding: 0, overflow: 'hidden', marginBottom: '16px' }}>

          {/* Toolbar */}
          <div style={{
            background: '#181420',
            borderBottom: '1px solid #2e2840',
            padding: '8px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <span style={{ fontSize: '12px', color: '#9d8fa8', fontFamily: 'monospace' }}>
              {isEdit ? `template-${id}.json` : 'new-template.json'}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '11px', color: '#2e2840' }}>{lineCount} lines</span>
              <button
                onClick={format}
                style={{
                  background: 'transparent',
                  border: '1px solid #2e2840',
                  color: '#9d8fa8',
                  borderRadius: '6px',
                  padding: '3px 10px',
                  fontSize: '11px',
                  cursor: 'pointer',
                  fontFamily: 'Cairo, sans-serif',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#c8973a'; e.currentTarget.style.color = '#c8973a' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#2e2840'; e.currentTarget.style.color = '#9d8fa8' }}
              >
                Format
              </button>
            </div>
          </div>

          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={json}
            onChange={e => setJson(e.target.value)}
            onKeyDown={handleKeyDown}
            dir="ltr"
            spellCheck={false}
            style={{
              width: '100%',
              minHeight: '640px',
              fontFamily: "'Fira Code', 'Cascadia Code', 'Courier New', monospace",
              fontSize: '13px',
              lineHeight: '1.65',
              background: '#0d0b0e',
              color: '#f0e8d8',
              border: 'none',
              borderRadius: 0,
              padding: '16px 20px',
              resize: 'vertical',
              outline: 'none',
              direction: 'ltr',
              textAlign: 'left',
            }}
          />
        </div>

        {/* Error */}
        {error && (
          <div style={{
            background: '#dc262620',
            border: '1px solid #dc262630',
            borderRadius: '10px',
            color: '#f87171',
            padding: '10px 14px',
            marginBottom: '16px',
            fontFamily: 'monospace',
            fontSize: '12px',
            direction: 'ltr',
            textAlign: 'left',
          }}>
            {error}
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={submit} disabled={saving} className="btn-gold" style={{ padding: '10px 32px' }}>
            {saving ? 'جاري الحفظ...' : isEdit ? 'حفظ التغييرات' : 'إنشاء التصميم'}
          </button>
          <button onClick={() => navigate('/templates')} className="btn-ghost" style={{ padding: '10px 24px' }}>
            إلغاء
          </button>
        </div>

      </div>
    </Layout>
  )
}
