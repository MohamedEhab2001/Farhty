import { useEffect, useRef } from 'react'

export default function FluidCursor() {
  const outerRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Disable on touch devices
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return

    const outer = outerRef.current
    const inner = innerRef.current
    if (!outer || !inner) return

    let targetX = 0
    let targetY = 0
    let currentX = 0
    let currentY = 0
    let isHovering = false

    const lerp = (start: number, end: number, factor: number) => start + (end - start) * factor

    const onMove = (e: MouseEvent) => {
      targetX = e.clientX
      targetY = e.clientY
      inner.style.left = `${targetX}px`
      inner.style.top = `${targetY}px`
    }

    const onEnterInteractive = () => { isHovering = true }
    const onLeaveInteractive = () => { isHovering = false }

    const animate = () => {
      currentX = lerp(currentX, targetX, 0.12)
      currentY = lerp(currentY, targetY, 0.12)
      outer.style.left = `${currentX}px`
      outer.style.top = `${currentY}px`

      if (isHovering) {
        outer.style.width = '60px'
        outer.style.height = '60px'
        outer.style.borderColor = 'rgba(201,169,110,0.3)'
        outer.style.backgroundColor = 'rgba(201,169,110,0.08)'
      } else {
        outer.style.width = '24px'
        outer.style.height = '24px'
        outer.style.borderColor = '#C9A96E'
        outer.style.backgroundColor = 'transparent'
      }

      requestAnimationFrame(animate)
    }

    document.addEventListener('mousemove', onMove)

    const interactives = document.querySelectorAll('a, button, input, textarea, select, label, [role="button"]')
    interactives.forEach(el => {
      el.addEventListener('mouseenter', onEnterInteractive)
      el.addEventListener('mouseleave', onLeaveInteractive)
    })

    const raf = requestAnimationFrame(animate)
    document.body.style.cursor = 'none'

    return () => {
      document.removeEventListener('mousemove', onMove)
      interactives.forEach(el => {
        el.removeEventListener('mouseenter', onEnterInteractive)
        el.removeEventListener('mouseleave', onLeaveInteractive)
      })
      cancelAnimationFrame(raf)
      document.body.style.cursor = ''
    }
  }, [])

  // Don't render on touch devices
  if (typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0)) {
    return null
  }

  return (
    <>
      <div
        ref={outerRef}
        className="pointer-events-none fixed z-[99999] rounded-full border transition-[width,height,background-color] duration-200"
        style={{
          width: 24, height: 24,
          borderWidth: 1.5, borderColor: '#C9A96E',
          transform: 'translate(-50%, -50%)',
          mixBlendMode: 'multiply',
        }}
      />
      <div
        ref={innerRef}
        className="pointer-events-none fixed z-[99999] rounded-full bg-gold"
        style={{
          width: 6, height: 6,
          transform: 'translate(-50%, -50%)',
        }}
      />
    </>
  )
}
