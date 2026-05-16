import { useEffect, useRef, useState } from 'react'
import Layout from '../components/Layout'
import ConfirmDialog from '../components/ConfirmDialog'
import { api } from '../api/client'

interface Promo {
  _id: string
  type: 'banner' | 'popup'
  title: string
  subtitle?: string
  badge?: string
  ctaLabel: string
  ctaLink?: string
  imageUrl?: string
  theme: 'purple' | 'gold' | 'rose' | 'dark'
  isActive: boolean
  order: number
  expiresAt?: string
}

type PromoForm = Omit<Promo, '_id' | 'isActive'>

const EMPTY_FORM: PromoForm = {
  type: 'banner',
  title: '',
  subtitle: '',
  badge: '',
  ctaLabel: 'اطلب الآن',
  ctaLink: '#templates',
  imageUrl: '',
  theme: 'purple',
  order: 0,
  expiresAt: '',
}

const THEME_LABELS: Record<string, string> = {
  purple: 'بنفسجي',
  gold: 'ذهبي',
  rose: 'وردي',
  dark: 'داكن',
}

const THEME_DOTS: Record<string, string> = {
  purple: 'bg-[#a66b96]',
  gold: 'bg-[#e8b857]',
  rose: 'bg-[#e88a7d]',
  dark: 'bg-[#3d2c38] border border-[#9d8fa8]',
}

// ─── Image upload component ────────────────────────────────────────────────
function ImageUpload({ value, onChange }: { value: string; onChange: (url: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) { setError('الملف يجب أن يكون صورة'); return }
    if (file.size > 5 * 1024 * 1024) { setError('الحجم الأقصى 5 ميغابايت'); return }
    setError('')
    setUploading(true)
    try {
      const { data } = await api.post('/api/upload/admin-sign', { folder: 'promos' })
      const fd = new FormData()
      fd.append('file', file)
      fd.append('api_key', data.apiKey)
      fd.append('timestamp', String(data.timestamp))
      fd.append('signature', data.signature)
      fd.append('folder', data.folder)
      const res = await fetch(`https://api.cloudinary.com/v1_1/${data.cloudName}/image/upload`, {
        method: 'POST',
        body: fd,
      })
      const json = await res.json()
      if (json.secure_url) { onChange(json.secure_url) }
      else { setError('فشل الرفع') }
    } catch {
      setError('حدث خطأ أثناء الرفع')
    } finally {
      setUploading(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  return (
    <div>
      <label className="block text-sm text-[#9d8fa8] mb-1">صورة البنر</label>

      {value ? (
        <div className="relative rounded-xl overflow-hidden border border-[#3d2c38]" style={{ aspectRatio: '3/1' }}>
          <img src={value} alt="banner preview" className="w-full h-full object-cover" />
          <button
            onClick={() => onChange('')}
            className="absolute top-2 left-2 w-7 h-7 rounded-lg bg-black/60 text-white hover:bg-black/80 flex items-center justify-center text-xs transition-all"
          >
            ✕
          </button>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={e => e.preventDefault()}
          onClick={() => inputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors ${
            uploading ? 'border-[#e8b857]/50 bg-[#e8b857]/5' : 'border-[#3d2c38] hover:border-[#9d8fa8] bg-[#120d18]'
          }`}
          style={{ minHeight: '100px' }}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <div className="w-6 h-6 border-2 border-[#e8b857] border-t-transparent rounded-full animate-spin" />
              <span className="text-[#9d8fa8] text-xs">جاري الرفع...</span>
            </div>
          ) : (
            <>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[#9d8fa8]">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              <span className="text-[#9d8fa8] text-xs text-center">اسحب الصورة هنا أو انقر للاختيار</span>
              <span className="text-[#9d8fa8]/50 text-xs">PNG, JPG, WEBP — حتى 5 ميغابايت</span>
            </>
          )}
        </div>
      )}

      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }} />
    </div>
  )
}

// ─── Form modal ────────────────────────────────────────────────────────────────
function PromoFormModal({
  initial,
  onClose,
  onSaved,
}: {
  initial?: Promo
  onClose: () => void
  onSaved: () => void
}) {
  const [form, setForm] = useState<PromoForm>(
    initial
      ? {
          type: initial.type,
          title: initial.title,
          subtitle: initial.subtitle ?? '',
          badge: initial.badge ?? '',
          ctaLabel: initial.ctaLabel,
          ctaLink: initial.ctaLink ?? '#templates',
          imageUrl: initial.imageUrl ?? '',
          theme: initial.theme,
          order: initial.order,
          expiresAt: initial.expiresAt ? new Date(initial.expiresAt).toISOString().slice(0, 16) : '',
        }
      : EMPTY_FORM
  )
  const [saving, setSaving] = useState(false)

  const set = (k: keyof PromoForm, v: unknown) => setForm(f => ({ ...f, [k]: v }))

  const handleSave = async () => {
    if (!form.title.trim() || !form.ctaLabel.trim()) return
    setSaving(true)
    const payload = { ...form, expiresAt: form.expiresAt || null }
    if (initial) {
      await api.put(`/api/admin/promos/${initial._id}`, payload)
    } else {
      await api.post('/api/admin/promos', payload)
    }
    setSaving(false)
    onSaved()
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" dir="rtl">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[#1a1220] border border-[#3d2c38] rounded-2xl p-6 w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-bold text-[#f0e8d8] mb-5">
          {initial ? 'تعديل العرض' : 'عرض جديد'}
        </h2>

        <div className="space-y-4">
          {/* Type */}
          <div>
            <label className="block text-sm text-[#9d8fa8] mb-2">النوع</label>
            <div className="flex gap-2">
              {(['banner', 'popup'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => set('type', t)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all border ${
                    form.type === t
                      ? 'bg-[#e8b857]/10 border-[#e8b857] text-[#e8b857]'
                      : 'bg-transparent border-[#3d2c38] text-[#9d8fa8] hover:border-[#9d8fa8]'
                  }`}
                >
                  {t === 'banner' ? '🖼️ بنر' : '💬 نافذة منبثقة'}
                </button>
              ))}
            </div>
          </div>

          {/* Image upload — banners only */}
          {form.type === 'banner' && (
            <ImageUpload value={form.imageUrl ?? ''} onChange={url => set('imageUrl', url)} />
          )}

          {/* Title */}
          <div>
            <label className="block text-sm text-[#9d8fa8] mb-1">العنوان *</label>
            <input
              value={form.title}
              onChange={e => set('title', e.target.value)}
              placeholder="مثال: عرض فلاش — وفر ٣٠٪ اليوم فقط!"
              className="w-full bg-[#120d18] border border-[#3d2c38] rounded-lg px-3 py-2 text-[#f0e8d8] text-sm focus:outline-none focus:border-[#e8b857] transition-colors"
            />
          </div>

          {/* Subtitle */}
          <div>
            <label className="block text-sm text-[#9d8fa8] mb-1">النص الفرعي</label>
            <textarea
              value={form.subtitle}
              onChange={e => set('subtitle', e.target.value)}
              rows={2}
              placeholder="وصف قصير للعرض..."
              className="w-full bg-[#120d18] border border-[#3d2c38] rounded-lg px-3 py-2 text-[#f0e8d8] text-sm focus:outline-none focus:border-[#e8b857] transition-colors resize-none"
            />
          </div>

          {/* Badge */}
          <div>
            <label className="block text-sm text-[#9d8fa8] mb-1">الشارة (اختياري)</label>
            <input
              value={form.badge}
              onChange={e => set('badge', e.target.value)}
              placeholder="مثال: ⚡ عرض محدود  أو  خصم ٣٠٪"
              className="w-full bg-[#120d18] border border-[#3d2c38] rounded-lg px-3 py-2 text-[#f0e8d8] text-sm focus:outline-none focus:border-[#e8b857] transition-colors"
            />
          </div>

          {/* CTA */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-[#9d8fa8] mb-1">نص الزر *</label>
              <input
                value={form.ctaLabel}
                onChange={e => set('ctaLabel', e.target.value)}
                placeholder="اطلب الآن"
                className="w-full bg-[#120d18] border border-[#3d2c38] rounded-lg px-3 py-2 text-[#f0e8d8] text-sm focus:outline-none focus:border-[#e8b857] transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm text-[#9d8fa8] mb-1">رابط الزر</label>
              <input
                value={form.ctaLink}
                onChange={e => set('ctaLink', e.target.value)}
                placeholder="#templates"
                className="w-full bg-[#120d18] border border-[#3d2c38] rounded-lg px-3 py-2 text-[#f0e8d8] text-sm focus:outline-none focus:border-[#e8b857] transition-colors"
              />
            </div>
          </div>

          {/* Theme */}
          <div>
            <label className="block text-sm text-[#9d8fa8] mb-1">لون الـ Overlay</label>
            <div className="flex gap-2 flex-wrap">
              {(['purple', 'gold', 'rose', 'dark'] as const).map(th => (
                <button
                  key={th}
                  onClick={() => set('theme', th)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                    form.theme === th
                      ? 'border-[#e8b857] bg-[#e8b857]/10 text-[#e8b857]'
                      : 'border-[#3d2c38] text-[#9d8fa8] hover:border-[#9d8fa8]'
                  }`}
                >
                  <span className={`w-2.5 h-2.5 rounded-full ${THEME_DOTS[th]}`} />
                  {THEME_LABELS[th]}
                </button>
              ))}
            </div>
          </div>

          {/* Order + ExpiresAt */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-[#9d8fa8] mb-1">الترتيب</label>
              <input
                type="number"
                value={form.order}
                onChange={e => set('order', parseInt(e.target.value) || 0)}
                className="w-full bg-[#120d18] border border-[#3d2c38] rounded-lg px-3 py-2 text-[#f0e8d8] text-sm focus:outline-none focus:border-[#e8b857] transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm text-[#9d8fa8] mb-1">ينتهي في (اختياري)</label>
              <input
                type="datetime-local"
                value={form.expiresAt}
                onChange={e => set('expiresAt', e.target.value)}
                className="w-full bg-[#120d18] border border-[#3d2c38] rounded-lg px-3 py-2 text-[#f0e8d8] text-sm focus:outline-none focus:border-[#e8b857] transition-colors"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-2 mt-6">
          <button onClick={onClose} className="btn-ghost py-2 px-4 text-sm flex-1">إلغاء</button>
          <button
            onClick={handleSave}
            disabled={saving || !form.title.trim() || !form.ctaLabel.trim()}
            className="btn-gold py-2 px-4 text-sm flex-1 disabled:opacity-50"
          >
            {saving ? 'جاري الحفظ...' : 'حفظ'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Main page ─────────────────────────────────────────────────────────────────
export default function Promos() {
  const [promos, setPromos] = useState<Promo[]>([])
  const [loading, setLoading] = useState(true)
  const [editTarget, setEditTarget] = useState<Promo | 'new' | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  const load = () => {
    api.get<Promo[]>('/api/admin/promos').then(r => setPromos(r.data)).finally(() => setLoading(false))
  }
  useEffect(load, [])

  const toggleActive = async (p: Promo) => {
    await api.patch(`/api/admin/promos/${p._id}/status`, { isActive: !p.isActive })
    load()
  }

  const confirmDelete = async () => {
    if (!deleteId) return
    setDeleting(true)
    await api.delete(`/api/admin/promos/${deleteId}`)
    setDeleteId(null)
    setDeleting(false)
    load()
  }

  const banners = promos.filter(p => p.type === 'banner')
  const popups = promos.filter(p => p.type === 'popup')

  return (
    <Layout title="العروض والإعلانات">
      {editTarget !== null && (
        <PromoFormModal
          initial={editTarget === 'new' ? undefined : editTarget}
          onClose={() => setEditTarget(null)}
          onSaved={load}
        />
      )}
      {deleteId && (
        <ConfirmDialog
          message="هل تريد حذف هذا العرض نهائياً؟"
          onConfirm={confirmDelete}
          onCancel={() => setDeleteId(null)}
          loading={deleting}
        />
      )}

      <div className="flex justify-between items-center mb-6">
        <p className="text-[#9d8fa8] text-sm">{promos.length} عرض</p>
        <button onClick={() => setEditTarget('new')} className="btn-gold">
          + عرض جديد
        </button>
      </div>

      {loading ? (
        <div className="p-8 text-center text-[#9d8fa8]">جاري التحميل...</div>
      ) : (
        <div className="space-y-8">
          {/* Banners */}
          <div>
            <h2 className="text-[#f0e8d8] font-semibold mb-3 flex items-center gap-2">
              <span>🖼️</span> البنرات ({banners.length})
            </h2>
            <div className="card p-0 overflow-hidden">
              {banners.length === 0 ? (
                <div className="p-6 text-center text-[#9d8fa8] text-sm">لا توجد بنرات بعد</div>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>الصورة</th>
                      <th>العنوان</th>
                      <th>الشارة</th>
                      <th>اللون</th>
                      <th>الترتيب</th>
                      <th>الحالة</th>
                      <th>الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {banners.map(p => (
                      <tr key={p._id}>
                        <td>
                          {p.imageUrl ? (
                            <div className="w-20 h-7 rounded overflow-hidden bg-[#120d18]">
                              <img src={p.imageUrl} alt="" className="w-full h-full object-cover" />
                            </div>
                          ) : (
                            <span className="text-[#9d8fa8] text-xs">لا توجد</span>
                          )}
                        </td>
                        <td>
                          <div className="font-semibold text-[#f0e8d8] text-sm">{p.title}</div>
                          {p.subtitle && <div className="text-[#9d8fa8] text-xs mt-0.5 truncate max-w-[160px]">{p.subtitle}</div>}
                        </td>
                        <td>{p.badge ? <span className="badge badge-gray">{p.badge}</span> : <span className="text-[#9d8fa8]">—</span>}</td>
                        <td>
                          <div className="flex items-center gap-1.5">
                            <span className={`w-3 h-3 rounded-full ${THEME_DOTS[p.theme]}`} />
                            <span className="text-[#9d8fa8] text-xs">{THEME_LABELS[p.theme]}</span>
                          </div>
                        </td>
                        <td className="text-[#9d8fa8] text-sm">{p.order}</td>
                        <td>
                          <span className={`badge ${p.isActive ? 'badge-green' : 'badge-yellow'}`}>
                            {p.isActive ? 'نشط' : 'متوقف'}
                          </span>
                        </td>
                        <td>
                          <div className="flex items-center gap-2">
                            <button onClick={() => setEditTarget(p)} className="btn-ghost py-1 px-3 text-xs">تعديل</button>
                            <button onClick={() => toggleActive(p)} className="btn-ghost py-1 px-3 text-xs">
                              {p.isActive ? 'إيقاف' : 'تفعيل'}
                            </button>
                            <button onClick={() => setDeleteId(p._id)} className="py-1 px-3 text-xs rounded-lg text-red-400 hover:bg-red-900/20 transition-all">حذف</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Popups */}
          <div>
            <h2 className="text-[#f0e8d8] font-semibold mb-3 flex items-center gap-2">
              <span>💬</span> النوافذ المنبثقة ({popups.length})
              {popups.filter(p => p.isActive).length > 1 && (
                <span className="text-xs text-[#e8b857] bg-[#e8b857]/10 px-2 py-0.5 rounded-full">
                  تنبيه: أكثر من نافذة نشطة — ستظهر الأولى فقط
                </span>
              )}
            </h2>
            <div className="card p-0 overflow-hidden">
              {popups.length === 0 ? (
                <div className="p-6 text-center text-[#9d8fa8] text-sm">لا توجد نوافذ منبثقة بعد</div>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>العنوان</th>
                      <th>الشارة</th>
                      <th>اللون</th>
                      <th>الحالة</th>
                      <th>الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {popups.map(p => (
                      <tr key={p._id}>
                        <td>
                          <div className="font-semibold text-[#f0e8d8] text-sm">{p.title}</div>
                          {p.subtitle && <div className="text-[#9d8fa8] text-xs mt-0.5 truncate max-w-[200px]">{p.subtitle}</div>}
                        </td>
                        <td>{p.badge ? <span className="badge badge-gray">{p.badge}</span> : <span className="text-[#9d8fa8]">—</span>}</td>
                        <td>
                          <div className="flex items-center gap-1.5">
                            <span className={`w-3 h-3 rounded-full ${THEME_DOTS[p.theme]}`} />
                            <span className="text-[#9d8fa8] text-xs">{THEME_LABELS[p.theme]}</span>
                          </div>
                        </td>
                        <td>
                          <span className={`badge ${p.isActive ? 'badge-green' : 'badge-yellow'}`}>
                            {p.isActive ? 'نشطة' : 'متوقفة'}
                          </span>
                        </td>
                        <td>
                          <div className="flex items-center gap-2">
                            <button onClick={() => setEditTarget(p)} className="btn-ghost py-1 px-3 text-xs">تعديل</button>
                            <button onClick={() => toggleActive(p)} className="btn-ghost py-1 px-3 text-xs">
                              {p.isActive ? 'إيقاف' : 'تفعيل'}
                            </button>
                            <button onClick={() => setDeleteId(p._id)} className="py-1 px-3 text-xs rounded-lg text-red-400 hover:bg-red-900/20 transition-all">حذف</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}
    </Layout>
  )
}
