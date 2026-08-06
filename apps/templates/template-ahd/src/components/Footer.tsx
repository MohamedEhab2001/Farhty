import { useTemplateFields } from '@farhty/template-sdk'

export default function Footer() {
  const { get } = useTemplateFields()
  const brideName = get('bride_name') ?? 'ليلى'
  const groomName = get('groom_name') ?? 'كريم'

  return (
    <footer className="bg-ivory py-12 text-center" style={{ borderTop: '1px solid rgba(196,163,90,0.15)' }}>
      <p className="font-tajawal font-light text-warm-gray" style={{ fontSize: '0.75rem' }}>
        {groomName} &amp; {brideName} &nbsp;·&nbsp; صممت بكل حب بواسطة{' '}
        <a
          href="https://farhty.online"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:no-underline"
          style={{ color: 'var(--gold)' }}
        >
          فرحتي
        </a>
      </p>
    </footer>
  )
}
