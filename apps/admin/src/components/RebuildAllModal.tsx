import { useEffect, useState } from 'react'
import { TOKEN_KEY } from '../api/client'
import DeployLog from './DeployLog'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

interface RebuildAllModalProps {
  templateId: string
  templateName: string
  onClose: () => void
}

type Status = 'rebuilding' | 'done' | 'failed'

export default function RebuildAllModal({ templateId, templateName, onClose }: RebuildAllModalProps) {
  const [status, setStatus] = useState<Status>('rebuilding')
  const [lines, setLines] = useState<string[]>([])

  useEffect(() => {
    start()
  }, [])

  const start = () => {
    setStatus('rebuilding')
    setLines([])

    const token = localStorage.getItem(TOKEN_KEY)

    fetch(`${API_URL}/api/admin/templates/${templateId}/rebuild-instances`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
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
          if (line === 'DONE') setStatus('done')
          else if (line === 'FAILED') setStatus('failed')
          else setLines(prev => [...prev, line])
        }
      }
    }).catch(() => setStatus('failed'))
  }

  const logStatus = status === 'rebuilding' ? 'deploying' : status

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" dir="rtl">
      <div className="bg-[#1e1928] border border-[#2e2840] rounded-2xl w-full max-w-xl mx-4 shadow-2xl overflow-hidden">

        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2e2840]">
          <div>
            <h2 className="font-bold text-[#f0e8d8]">إعادة بناء جميع حسابات القالب</h2>
            <p className="text-[#9d8fa8] text-xs mt-0.5">{templateName}</p>
          </div>
          <button onClick={onClose} className="text-[#9d8fa8] hover:text-white transition-colors text-lg">✕</button>
        </div>

        <div className="p-6">
          <DeployLog lines={lines} status={logStatus} slug={templateName} />

          {(status === 'done' || status === 'failed') && (
            <div className="mt-4 flex gap-3 justify-end">
              {status === 'failed' && (
                <button onClick={start} className="btn-gold text-sm">إعادة المحاولة</button>
              )}
              <button onClick={onClose} className="btn-ghost text-sm">إغلاق</button>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
