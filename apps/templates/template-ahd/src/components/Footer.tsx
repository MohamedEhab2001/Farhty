import { useTemplateFields } from '@farhty/template-sdk'

export default function Footer() {
  const { get } = useTemplateFields()
  const brideName = get('bride_name') ?? 'Layla'
  const groomName = get('groom_name') ?? 'Karim'

  return (
    <footer
      className="bg-ivory py-12 text-center"
      style={{ borderTop: '1px solid rgba(196,163,90,0.15)' }}
    >
      <p
        className="font-body font-light tracking-[0.2em] uppercase text-warm-gray"
        style={{ fontSize: '0.62rem' }}
      >
        {groomName} &amp; {brideName} &nbsp;·&nbsp; Made with love by{' '}
        <span style={{ color: 'var(--gold)' }}>Farhty</span>
      </p>
    </footer>
  )
}
