import { useState, useEffect } from 'react'
import { TOKEN_KEY } from '../api/client'
import DeployLog from './DeployLog'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

interface Template { _id: string; name: string; slug: string }

interface DeployModalProps {
  onClose: () => void
  onDeployed: () => void
}

type DeployStatus = 'idle' | 'deploying' | 'done' | 'failed'

export default function DeployModal({ onClose, onDeployed }: DeployModalProps) {
  const [templates, setTemplates] = useState<Template[]>([])
  const [templateId, setTemplateId] = useState('')
  const [slug, setSlug] = useState('')
  const [password, setPassword] = useState('')
  const [isPreview, setIsPreview] = useState(false)
  const [status, setStatus] = useState<DeployStatus>('idle')
  const [lines, setLines] = useState<string[]>([])

  useEffect(() => {
    fetch(`${API_URL}/api/admin/templates`, {
      headers: { Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}` }
    })
      .then(r => r.json())
      .then((data: Template[]) => setTemplates(data))
      .catch(() => {})
  }, [])

  const deploy = () => {
    if (!templateId || !slug || !password) return
    setStatus('deploying')
    setLines([])

    const token = localStorage.getItem(TOKEN_KEY)

    // Use fetch + ReadableStream to consume SSE
    fetch(`${API_URL}/api/admin/instances`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ templateId, slug, password, isPreview }),
    }).then(async res => {
      const reader = res.body!.getReader()
      const decoder = new TextDecoder()
      let buf = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buf += decoder.decode(value, { stream: true })
        const parts = buf.split('\n\n')
        buf = parts.pop() || ''
        for (const part of parts) {
          const line = part.replace(/^data:\s?/, '').trim()
          if (!line) continue
          if (line === 'DONE') {
            setStatus('done')
            onDeployed()
          } else if (line === 'FAILED') {
            setStatus('failed')
          } else {
            setLines(prev => [...prev, line])
          }
        }
      }
      if (status !== 'done') setStatus('done')
    }).catch(() => setStatus('failed'))
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" dir="rtl">
      <div className="bg-[#1e1928] border border-[#2e2840] rounded-2xl w-full max-w-xl mx-4 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2e2840]">
          <h2 className="font-bold text-[#f0e8d8]">🚀 نشر حساب جديد</h2>
          <button onClick={onClose} className="text-[#9d8fa8] hover:text-white transition-colors">✕</button>
        </div>

        <div className="p-6 space-y-4">
          {status === 'idle' && (
            <>
              <div>
                <label>القالب</label>
                <select id="deploy-template-select" value={templateId} onChange={e => setTemplateId(e.target.value)}>
                  <option value="">اختر القالب...</option>
                  {templates.map(t => (
                    <option key={t._id} value={t._id}>{t.name} ({t.slug})</option>
                  ))}
                </select>
              </div>

              <div>
                <label>الرابط (slug)</label>
                <input
                  id="deploy-slug-input"
                  value={slug}
                  onChange={e => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                  placeholder="ahmed-sara"
                  dir="ltr"
                />
                {slug && (
                  <p className="text-[#9d8fa8] text-xs mt-1 font-mono" dir="ltr">
                    → {slug}.farhty.online
                  </p>
                )}
              </div>

              <div>
                <label>كلمة مرور العميل</label>
                <input
                  id="deploy-password-input"
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>

              <div className="flex items-center gap-3">
                <label className="toggle flex-shrink-0">
                  <input
                    type="checkbox"
                    checked={isPreview}
                    onChange={e => setIsPreview(e.target.checked)}
                    id="deploy-preview-toggle"
                  />
                  <span className="toggle-slider" />
                </label>
                <span className="text-sm text-[#9d8fa8]">وضع المعاينة (بدون كلمة مرور)</span>
              </div>

              <button
                id="deploy-submit-btn"
                onClick={deploy}
                disabled={!templateId || !slug || !password}
                className="btn-gold w-full py-3"
              >
                نشر الآن
              </button>
            </>
          )}

          {(status === 'deploying' || status === 'done' || status === 'failed') && (
            <DeployLog lines={lines} status={status} slug={slug} />
          )}
        </div>
      </div>
    </div>
  )
}
