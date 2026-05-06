import { useEffect, useRef, useState } from 'react'

export default function BotanicalDivider() {
  const ref = useRef<SVGSVGElement>(null)
  const [drawn, setDrawn] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setDrawn(true) },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      className="w-full flex items-center justify-center py-10 bg-ivory"
      aria-hidden="true"
    >
      <svg
        ref={ref}
        viewBox="0 0 900 80"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: '100%', maxWidth: '800px', height: 'auto' }}
        fill="none"
      >
        {/* Central horizontal line */}
        <line
          x1="50" y1="40" x2="850" y2="40"
          stroke="#C4A35A"
          strokeWidth="0.6"
          strokeDasharray="1200"
          strokeDashoffset={drawn ? 0 : 1200}
          style={{ transition: 'stroke-dashoffset 2s cubic-bezier(0.22,1,0.36,1)' }}
        />

        {/* Left leaf cluster */}
        <g transform="translate(110,40)" opacity="0.85">
          <path
            d="M0,0 C-12,-18 -28,-22 -38,-14 C-28,-6 -12,-10 0,0Z"
            stroke="#C4A35A" strokeWidth="0.7"
            strokeDasharray="200" strokeDashoffset={drawn ? 0 : 200}
            style={{ transition: 'stroke-dashoffset 1.6s ease 0.4s' }}
          />
          <path
            d="M0,0 C-8,16 -22,20 -32,14 C-22,6 -8,10 0,0Z"
            stroke="#C4A35A" strokeWidth="0.7"
            strokeDasharray="200" strokeDashoffset={drawn ? 0 : 200}
            style={{ transition: 'stroke-dashoffset 1.6s ease 0.6s' }}
          />
          <path
            d="M0,0 C-18,-10 -30,-4 -30,8 C-18,6 -8,4 0,0Z"
            stroke="#C4A35A" strokeWidth="0.7"
            strokeDasharray="200" strokeDashoffset={drawn ? 0 : 200}
            style={{ transition: 'stroke-dashoffset 1.6s ease 0.8s' }}
          />
          {/* Stem */}
          <line x1="-18" y1="-14" x2="0" y2="0" stroke="#C4A35A" strokeWidth="0.6"
            strokeDasharray="30" strokeDashoffset={drawn ? 0 : 30}
            style={{ transition: 'stroke-dashoffset 0.8s ease 0.2s' }}
          />
          <line x1="-20" y1="14" x2="0" y2="0" stroke="#C4A35A" strokeWidth="0.6"
            strokeDasharray="30" strokeDashoffset={drawn ? 0 : 30}
            style={{ transition: 'stroke-dashoffset 0.8s ease 0.4s' }}
          />
        </g>

        {/* Right leaf cluster (mirrored) */}
        <g transform="translate(790,40) scale(-1,1)" opacity="0.85">
          <path
            d="M0,0 C-12,-18 -28,-22 -38,-14 C-28,-6 -12,-10 0,0Z"
            stroke="#C4A35A" strokeWidth="0.7"
            strokeDasharray="200" strokeDashoffset={drawn ? 0 : 200}
            style={{ transition: 'stroke-dashoffset 1.6s ease 0.4s' }}
          />
          <path
            d="M0,0 C-8,16 -22,20 -32,14 C-22,6 -8,10 0,0Z"
            stroke="#C4A35A" strokeWidth="0.7"
            strokeDasharray="200" strokeDashoffset={drawn ? 0 : 200}
            style={{ transition: 'stroke-dashoffset 1.6s ease 0.6s' }}
          />
          <path
            d="M0,0 C-18,-10 -30,-4 -30,8 C-18,6 -8,4 0,0Z"
            stroke="#C4A35A" strokeWidth="0.7"
            strokeDasharray="200" strokeDashoffset={drawn ? 0 : 200}
            style={{ transition: 'stroke-dashoffset 1.6s ease 0.8s' }}
          />
          <line x1="-18" y1="-14" x2="0" y2="0" stroke="#C4A35A" strokeWidth="0.6"
            strokeDasharray="30" strokeDashoffset={drawn ? 0 : 30}
            style={{ transition: 'stroke-dashoffset 0.8s ease 0.2s' }}
          />
          <line x1="-20" y1="14" x2="0" y2="0" stroke="#C4A35A" strokeWidth="0.6"
            strokeDasharray="30" strokeDashoffset={drawn ? 0 : 30}
            style={{ transition: 'stroke-dashoffset 0.8s ease 0.4s' }}
          />
        </g>

        {/* Center small diamond */}
        <path
          d="M450,33 L456,40 L450,47 L444,40 Z"
          stroke="#C4A35A" strokeWidth="0.8" fill="none"
          strokeDasharray="50" strokeDashoffset={drawn ? 0 : 50}
          style={{ transition: 'stroke-dashoffset 0.8s ease 1s' }}
        />

        {/* Small branches left of center */}
        <g transform="translate(360,40)" opacity="0.7">
          <path d="M0,0 C-8,-12 -18,-14 -22,-8" stroke="#C4A35A" strokeWidth="0.6"
            strokeDasharray="100" strokeDashoffset={drawn ? 0 : 100}
            style={{ transition: 'stroke-dashoffset 1s ease 0.9s' }}
          />
          <path d="M0,0 C-8,12 -18,14 -22,8" stroke="#C4A35A" strokeWidth="0.6"
            strokeDasharray="100" strokeDashoffset={drawn ? 0 : 100}
            style={{ transition: 'stroke-dashoffset 1s ease 1.1s' }}
          />
        </g>

        {/* Small branches right of center */}
        <g transform="translate(540,40) scale(-1,1)" opacity="0.7">
          <path d="M0,0 C-8,-12 -18,-14 -22,-8" stroke="#C4A35A" strokeWidth="0.6"
            strokeDasharray="100" strokeDashoffset={drawn ? 0 : 100}
            style={{ transition: 'stroke-dashoffset 1s ease 0.9s' }}
          />
          <path d="M0,0 C-8,12 -18,14 -22,8" stroke="#C4A35A" strokeWidth="0.6"
            strokeDasharray="100" strokeDashoffset={drawn ? 0 : 100}
            style={{ transition: 'stroke-dashoffset 1s ease 1.1s' }}
          />
        </g>
      </svg>
    </div>
  )
}
