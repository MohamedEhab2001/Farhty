import { useTemplateFields } from '@farhty/template-sdk'

export default function Footer() {
  const { get } = useTemplateFields()
  const brideName = get('bride_name') ?? 'ليلى'
  const groomName = get('groom_name') ?? 'كريم'

  return (
    <footer className="bg-ivory py-12 text-center" style={{ borderTop: '1px solid rgba(196,163,90,0.15)' }}>
      <p className="font-tajawal font-light text-warm-gray" style={{ fontSize: '0.75rem' }}>
        {groomName} &amp; {brideName} &nbsp;·&nbsp; صُمِّمت بكل حب بواسطة{' '}
        <span style={{ color: 'var(--gold)' }}>فرحتي</span>
      </p>
    </footer>
  )
}
