import { useState } from 'react'
import { useTemplateData, useTemplateFields, api } from '@farhty/template-sdk'
import type { TemplateField } from '@farhty/template-sdk'

type UploadState = 'idle' | 'uploading' | 'success' | 'error'

export function AdminDashboard() {
  const { instance, slug } = useTemplateData()
  const { get, set, save } = useTemplateFields()
  const [uploadStates, setUploadStates] = useState<Record<string, UploadState>>({})
  const [uploadErrors, setUploadErrors] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [saveError, setSaveError] = useState('')

  if (!instance) return null

  // Group fields by field.group preserving insertion order
  const groupMap = new Map<string, TemplateField[]>()
  for (const field of instance.fields) {
    const group = field.group || 'عام'
    if (!groupMap.has(group)) groupMap.set(group, [])
    groupMap.get(group)!.push(field)
  }

  const handleUpload = async (key: string, file: File, folder: string, isAudio = false) => {
    setUploadStates(prev => ({ ...prev, [key]: 'uploading' }))
    try {
      const token = localStorage.getItem(`farhty_token_${slug}`)
      const signRes = await api.post(
        '/api/upload/sign',
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
    setSaveError('')
    try {
      await save()
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch {
      setSaveError('فشل الحفظ، حاول مرة أخرى')
      setTimeout(() => setSaveError(''), 4000)
    } finally {
      setSaving(false)
    }
  }

  const inputCls =
    'w-full bg-transparent border border-gold/30 rounded-lg px-4 py-3 font-arabic text-ivory placeholder:text-ivory/40 focus:outline-none focus:border-gold/70 transition'
  const labelCls = 'block text-xs text-gold/80 tracking-[0.2em] mb-2 font-body'
  const hintCls = 'text-xs text-ivory/40 mt-1.5 font-arabic leading-relaxed'

  const renderField = (field: TemplateField): JSX.Element | null => {
    const key = field.key
    const val = get(key)
    const uState = uploadStates[key] ?? 'idle'
    const uError = uploadErrors[key]

    const wrap = (input: JSX.Element, extra?: JSX.Element) => (
      <div key={key}>
        <label className={labelCls}>
          {field.label}
          {field.required && <span className="text-red-400 mr-1">*</span>}
        </label>
        {input}
        {extra}
        {field.hint && <p className={hintCls}>{field.hint}</p>}
      </div>
    )

    switch (field.type) {
      case 'text':
        return wrap(
          <input
            type="text"
            value={(val as string) ?? ''}
            onChange={e => set(key, e.target.value)}
            placeholder={field.placeholder}
            className={inputCls}
          />
        )

      case 'textarea':
        return wrap(
          <textarea
            value={(val as string) ?? ''}
            onChange={e => set(key, e.target.value)}
            placeholder={field.placeholder}
            rows={4}
            className={`${inputCls} resize-none`}
          />
        )

      case 'number':
        return wrap(
          <input
            type="number"
            value={(val as number) ?? ''}
            onChange={e => set(key, Number(e.target.value))}
            min={field.min ?? undefined}
            max={field.max ?? undefined}
            placeholder={field.placeholder}
            dir="ltr"
            className={inputCls}
          />
        )

      case 'url':
        return wrap(
          <input
            type="url"
            value={(val as string) ?? ''}
            onChange={e => set(key, e.target.value)}
            placeholder={field.placeholder}
            dir="ltr"
            className={inputCls}
          />
        )

      case 'iframe':
        return wrap(
          <div>
            <input
              type="url"
              value={(val as string) ?? ''}
              onChange={e => set(key, e.target.value)}
              placeholder={field.placeholder ?? 'https://www.google.com/maps/embed?...'}
              dir="ltr"
              className={inputCls}
            />
            {val && (
              <iframe
                src={val as string}
                className="mt-3 w-full rounded-xl border border-gold/20"
                height={220}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={field.label}
              />
            )}
          </div>
        )

      case 'select':
        return wrap(
          <select
            value={(val as string) ?? ''}
            onChange={e => set(key, e.target.value)}
            className={`${inputCls} cursor-pointer`}
          >
            <option value="">— اختر —</option>
            {field.options?.map(opt => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        )

      case 'time':
        return wrap(
          <input
            type="time"
            value={(val as string) ?? ''}
            onChange={e => set(key, e.target.value)}
            dir="ltr"
            className={inputCls}
          />
        )

      case 'date':
        return wrap(
          <input
            type="date"
            value={(val as string) ?? ''}
            onChange={e => set(key, e.target.value)}
            dir="ltr"
            className={inputCls}
          />
        )

      case 'color':
        return wrap(
          <div className="flex items-center gap-4">
            <input
              type="color"
              value={(val as string) ?? '#C9A96E'}
              onChange={e => set(key, e.target.value)}
              className="w-12 h-10 rounded-lg cursor-pointer border border-gold/30 bg-transparent p-1"
            />
            <span className="font-body text-ivory/60 text-sm" dir="ltr">
              {(val as string) ?? ''}
            </span>
          </div>
        )

      case 'boolean':
        return (
          <div key={key} className="flex items-center justify-between py-1">
            <label className="font-arabic text-sm text-ivory/90">
              {field.label}
              {field.required && <span className="text-red-400 mr-1">*</span>}
            </label>
            <button
              type="button"
              onClick={() => set(key, !(val as boolean))}
              className={`relative w-12 h-6 rounded-full transition-colors ${val ? 'bg-gold' : 'bg-ivory/20'
                }`}
            >
              <span
                className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${val ? 'right-1' : 'left-1'
                  }`}
              />
            </button>
          </div>
        )

      case 'image': {
        const folder = field.cloudinaryFolder ?? 'templates/asala'
        return wrap(
          <div>
            <label
              className="inline-flex items-center gap-2 cursor-pointer px-4 py-2.5 rounded-lg border border-gold/30 text-ivory/80 font-arabic text-sm hover:border-gold hover:text-ivory transition"
              style={uState === 'uploading' ? { opacity: 0.5, pointerEvents: 'none' } : {}}
            >
              {uState === 'uploading' ? 'جاري الرفع...' : '↑ اختر صورة'}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={uState === 'uploading'}
                onChange={e => {
                  const f = e.target.files?.[0]
                  if (f) handleUpload(key, f, folder)
                }}
              />
            </label>
            {uState === 'success' && (
              <p className="text-green-400 text-sm mt-2 font-arabic">تم الرفع بنجاح</p>
            )}
            {uState === 'error' && (
              <p className="text-red-400 text-sm mt-2 font-arabic bg-red-500/10 px-3 py-2 rounded-lg">
                {uError}
              </p>
            )}
            {val && (
              <img
                src={val as string}
                alt={field.label}
                className="mt-3 w-28 h-28 object-cover rounded-xl border border-gold/20"
              />
            )}
          </div>
        )
      }

      case 'audio': {
        const folder = field.cloudinaryFolder ?? 'templates/asala'
        return wrap(
          <div>
            <label
              className="inline-flex items-center gap-2 cursor-pointer px-4 py-2.5 rounded-lg border border-gold/30 text-ivory/80 font-arabic text-sm hover:border-gold hover:text-ivory transition"
              style={uState === 'uploading' ? { opacity: 0.5, pointerEvents: 'none' } : {}}
            >
              {uState === 'uploading' ? 'جاري الرفع...' : '♪ اختر ملف صوتي'}
              <input
                type="file"
                accept="audio/*"
                className="hidden"
                disabled={uState === 'uploading'}
                onChange={e => {
                  const f = e.target.files?.[0]
                  if (f) handleUpload(key, f, folder, true)
                }}
              />
            </label>
            {uState === 'success' && (
              <p className="text-green-400 text-sm mt-2 font-arabic">تم الرفع بنجاح</p>
            )}
            {uState === 'error' && (
              <p className="text-red-400 text-sm mt-2 font-arabic bg-red-500/10 px-3 py-2 rounded-lg">
                {uError}
              </p>
            )}
            {val && <audio src={val as string} controls className="mt-3 w-full rounded-lg" />}
          </div>
        )
      }

      case 'array': {
        const items = (Array.isArray(val) ? val : []) as Record<string, unknown>[]
        return wrap(
          <div>
            <div className="space-y-3">
              {items.map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-gold/10 p-4"
                  style={{ background: 'oklch(0.14 0.02 25 / 0.6)' }}
                >
                  <div className="flex justify-end mb-3">
                    <button
                      type="button"
                      onClick={() => set(key, items.filter((_, i) => i !== idx))}
                      className="text-red-400/60 hover:text-red-400 font-arabic text-sm transition"
                    >
                      × حذف
                    </button>
                  </div>
                  <div className="space-y-3">
                    {field.itemSchema?.map(sub => (
                      <div key={sub.key}>
                        <label className="block text-xs text-gold/60 mb-1.5 font-body">{sub.label}</label>
                        <input
                          type={
                            sub.type === 'time'
                              ? 'time'
                              : sub.type === 'number'
                                ? 'number'
                                : 'text'
                          }
                          value={(item[sub.key] as string) ?? ''}
                          onChange={e => {
                            const newItems = items.map((it, i) =>
                              i === idx ? { ...it, [sub.key]: e.target.value } : it
                            )
                            set(key, newItems)
                          }}
                          placeholder={sub.placeholder}
                          dir={
                            sub.type === 'time' || sub.type === 'number' || sub.type === 'url'
                              ? 'ltr'
                              : undefined
                          }
                          className="w-full bg-transparent border border-gold/20 rounded-lg px-3 py-2 font-arabic text-ivory text-sm placeholder:text-ivory/30 focus:outline-none focus:border-gold/50 transition"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => {
                const newItem: Record<string, unknown> = {}
                field.itemSchema?.forEach(s => { newItem[s.key] = '' })
                set(key, [...items, newItem])
              }}
              className="mt-3 w-full py-2.5 rounded-lg border border-gold/30 border-dashed text-gold/60 hover:text-gold hover:border-gold font-arabic text-sm transition"
            >
              + إضافة عنصر
            </button>
          </div>
        )
      }

      case 'json':
        return wrap(
          <textarea
            value={typeof val === 'string' ? val : JSON.stringify(val ?? [], null, 2)}
            onChange={e => {
              try {
                set(key, JSON.parse(e.target.value))
              } catch {
                set(key, e.target.value)
              }
            }}
            rows={6}
            dir="ltr"
            placeholder={field.placeholder ?? '[]'}
            className="w-full bg-transparent border border-gold/30 rounded-lg px-4 py-3 font-body text-ivory/80 text-sm focus:outline-none focus:border-gold/60 transition resize-none"
          />
        )

      default:
        return null
    }
  }

  return (
    <div dir="rtl" className="min-h-screen" style={{ background: 'oklch(0.12 0.03 25)' }}>
      {/* Sticky header */}
      <div className="sticky top-0 z-50 glass-card border-b border-gold/20">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="font-arabic text-lg text-gradient-gold">لوحة التحكم</h1>
            <p className="text-ivory/40 text-xs font-body mt-0.5">تصميم أصالة</p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2.5 rounded-lg bg-gradient-gold text-primary-foreground font-arabic font-medium shadow-gold disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98] transition"
          >
            {saving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
          </button>
        </div>
      </div>

      {/* Success toast */}
      {saved && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] glass-card border border-gold/40 px-6 py-3 rounded-full font-arabic text-gold shadow-gold text-sm">
          تم الحفظ بنجاح ✓
        </div>
      )}

      {/* Error toast */}
      {saveError && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] bg-red-900/80 border border-red-500/40 px-6 py-3 rounded-full font-arabic text-red-300 text-sm">
          {saveError}
        </div>
      )}

      {/* Field groups */}
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        {Array.from(groupMap.entries()).map(([groupName, fields]) => (
          <div
            key={groupName}
            className="glass-card rounded-2xl border border-gold/15 overflow-hidden"
          >
            {/* Group heading */}
            <div
              className="px-6 py-4 border-b border-gold/10"
              style={{ background: 'oklch(0.20 0.04 25 / 0.5)' }}
            >
              <h2 className="font-arabic text-base text-gold">{groupName}</h2>
            </div>

            {/* Fields */}
            <div className="px-6 py-5 space-y-5">
              {fields.map(field => renderField(field))}
            </div>
          </div>
        ))}

        {/* Bottom save */}
        <div className="pt-2 pb-10">
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full py-4 rounded-xl bg-gradient-gold text-primary-foreground font-arabic text-lg shadow-gold disabled:opacity-50 hover:scale-[1.01] active:scale-[0.99] transition"
          >
            {saving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
          </button>
        </div>
      </div>
    </div>
  )
}
