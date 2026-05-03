import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Layout from '../components/Layout'
import FieldBuilder, { TemplateField } from '../components/FieldBuilder'
import { api } from '../api/client'

interface FormData {
  name: string; slug: string; price: number; description: string
  language: string; status: string; version: string
  features: { music: boolean; gallery: boolean; rsvp: boolean; countdownTimer: boolean; rtl: boolean; pages: number }
  fields: TemplateField[]
  previewImages: string[]; previewVideo: string
}

const DEFAULT: FormData = {
  name: '', slug: '', price: 299, description: '', language: 'ar', status: 'draft', version: '1.0.0',
  features: { music: false, gallery: false, rsvp: false, countdownTimer: false, rtl: true, pages: 3 },
  fields: [], previewImages: [], previewVideo: ''
}

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}

export default function TemplateForm() {
  const { id } = useParams<{ id: string }>()
  const isEdit = !!id
  const navigate = useNavigate()
  const [form, setForm] = useState<FormData>(DEFAULT)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isEdit) return
    api.get(`/api/admin/templates/${id}`).then(r => {
      const d = r.data
      setForm({
        name: d.name, slug: d.slug, price: d.price, description: d.description || '',
        language: d.language, status: d.status, version: d.version || '1.0.0',
        features: d.features || DEFAULT.features,
        fields: d.fields || [], previewImages: d.previewImages || [], previewVideo: d.previewVideo || ''
      })
    }).catch(() => setError('تعذّر تحميل القالب'))
  }, [id, isEdit])

  const set = (patch: Partial<FormData>) => setForm(f => ({ ...f, ...patch }))
  const setFeat = (key: string, val: boolean | number) =>
    setForm(f => ({ ...f, features: { ...f.features, [key]: val } }))

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true); setError('')
    try {
      if (isEdit) {
        await api.put(`/api/admin/templates/${id}`, form)
      } else {
        await api.post('/api/admin/templates', form)
      }
      navigate('/templates')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'خطأ'
      setError(msg)
    } finally {
      setSaving(false)
    }
  }

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="card mb-6">
      <h3 className="font-bold text-[#e8b857] mb-4">{title}</h3>
      {children}
    </div>
  )

  return (
    <Layout title={isEdit ? 'تعديل القالب' : 'قالب جديد'}>
      <form onSubmit={submit} className="max-w-4xl">

        {/* 1. Basic Info */}
        <Section title="المعلومات الأساسية">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label>الاسم</label>
              <input id="form-name" value={form.name} onChange={e => { set({ name: e.target.value }); if (!isEdit) set({ slug: slugify(e.target.value) }) }} required />
            </div>
            <div>
              <label>الرابط (slug)</label>
              <input id="form-slug" value={form.slug} onChange={e => set({ slug: e.target.value })} dir="ltr" required />
            </div>
            <div>
              <label>السعر (جنيه)</label>
              <input id="form-price" type="number" value={form.price} onChange={e => set({ price: +e.target.value })} required />
            </div>
            <div>
              <label>اللغة</label>
              <select id="form-language" value={form.language} onChange={e => set({ language: e.target.value })}>
                <option value="ar">عربي</option>
                <option value="en">English</option>
                <option value="both">كلاهما</option>
              </select>
            </div>
            <div>
              <label>الحالة</label>
              <select id="form-status" value={form.status} onChange={e => set({ status: e.target.value })}>
                <option value="draft">مسودة</option>
                <option value="active">نشط</option>
              </select>
            </div>
            <div>
              <label>الإصدار</label>
              <input id="form-version" value={form.version} onChange={e => set({ version: e.target.value })} dir="ltr" />
            </div>
            <div className="md:col-span-2">
              <label>الوصف</label>
              <textarea id="form-description" value={form.description} onChange={e => set({ description: e.target.value })} rows={3} />
            </div>
          </div>
        </Section>

        {/* 2. Features */}
        <Section title="المميزات">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { key: 'music', label: 'موسيقى' },
              { key: 'gallery', label: 'معرض صور' },
              { key: 'rsvp', label: 'RSVP' },
              { key: 'countdownTimer', label: 'عداد تنازلي' },
              { key: 'rtl', label: 'RTL (عربي)' },
            ].map(f => (
              <label key={f.key} className="flex items-center gap-3 cursor-pointer">
                <span className="toggle">
                  <input
                    type="checkbox"
                    id={`feat-${f.key}`}
                    checked={form.features[f.key as keyof typeof form.features] as boolean}
                    onChange={e => setFeat(f.key, e.target.checked)}
                  />
                  <span className="toggle-slider" />
                </span>
                <span className="text-sm text-[#f0e8d8]">{f.label}</span>
              </label>
            ))}
            <div>
              <label>عدد الصفحات</label>
              <input id="feat-pages" type="number" min={1} max={10} value={form.features.pages} onChange={e => setFeat('pages', +e.target.value)} />
            </div>
          </div>
        </Section>

        {/* 3. Preview Assets */}
        <Section title="روابط المعاينة">
          <div className="space-y-3">
            <div>
              <label>رابط صورة المعاينة (Cloudinary URL)</label>
              <input
                id="form-preview-img"
                value={form.previewImages[0] || ''}
                onChange={e => set({ previewImages: e.target.value ? [e.target.value] : [] })}
                dir="ltr"
                placeholder="https://res.cloudinary.com/..."
              />
            </div>
            <div>
              <label>رابط فيديو المعاينة (اختياري)</label>
              <input
                id="form-preview-video"
                value={form.previewVideo}
                onChange={e => set({ previewVideo: e.target.value })}
                dir="ltr"
                placeholder="https://res.cloudinary.com/..."
              />
            </div>
          </div>
        </Section>

        {/* 4. Field Builder */}
        <Section title="حقول القالب">
          <FieldBuilder fields={form.fields} onChange={fields => set({ fields })} />
        </Section>

        {error && <p className="text-red-400 text-sm mb-4 badge badge-red p-3">{error}</p>}

        <div className="flex gap-3">
          <button id="form-submit-btn" type="submit" disabled={saving} className="btn-gold px-8 py-3">
            {saving ? 'جاري الحفظ...' : isEdit ? 'حفظ التغييرات' : 'إنشاء القالب'}
          </button>
          <button type="button" onClick={() => navigate('/templates')} className="btn-ghost px-6 py-3">
            إلغاء
          </button>
        </div>
      </form>
    </Layout>
  )
}
