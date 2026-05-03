import { useEffect, useRef } from 'react'

interface DeployLogProps {
  lines: string[]
  status: 'deploying' | 'done' | 'failed' | 'idle'
  slug: string
}

export default function DeployLog({ lines, status, slug }: DeployLogProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [lines])

  return (
    <div className="bg-[#070509] border border-[#2e2840] rounded-xl overflow-hidden font-mono">
      {/* Terminal header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-[#2e2840] bg-[#0d0b0e]">
        <div className="w-3 h-3 rounded-full bg-red-500" />
        <div className="w-3 h-3 rounded-full bg-yellow-500" />
        <div className="w-3 h-3 rounded-full bg-green-500" />
        <span className="text-[#9d8fa8] text-xs mr-2">
          {slug ? `Deploying ${slug}.farhty.online...` : 'Deploy Log'}
        </span>
      </div>

      {/* Log lines */}
      <div className="p-4 min-h-48 max-h-80 overflow-y-auto text-sm">
        {lines.length === 0 && status === 'deploying' && (
          <p className="text-[#9d8fa8] animate-pulse">جاري الاتصال...</p>
        )}
        {lines.map((line, i) => (
          <p
            key={i}
            className={`leading-relaxed mb-0.5 ${
              line.includes('✓') || line.includes('DONE') ? 'text-green-400' :
              line.includes('❌') || line.includes('FAILED') ? 'text-red-400' :
              line.includes('⚠️') ? 'text-yellow-400' :
              'text-[#c8973a]'
            }`}
          >
            {line.replace('data: ', '')}
          </p>
        ))}
        {status === 'deploying' && (
          <span className="inline-block w-2 h-4 bg-[#c8973a] animate-pulse" />
        )}
        <div ref={bottomRef} />
      </div>

      {/* Result */}
      {status === 'done' && (
        <div className="px-4 pb-4 border-t border-[#2e2840] pt-4">
          <p className="text-green-400 text-sm font-semibold mb-3">✓ تم النشر بنجاح!</p>
          <a
            href={`https://${slug}.farhty.online`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gold text-sm inline-block"
          >
            فتح {slug}.farhty.online →
          </a>
        </div>
      )}
      {status === 'failed' && (
        <div className="px-4 pb-4 border-t border-[#2e2840] pt-4">
          <p className="text-red-400 text-sm">فشل النشر — راجع السجل أعلاه</p>
        </div>
      )}
    </div>
  )
}
