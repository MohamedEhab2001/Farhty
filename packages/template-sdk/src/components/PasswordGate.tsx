import { useState } from 'react'
import { useInstanceAuth } from '../hooks/useInstanceAuth'
import { useTemplateData } from '../hooks/useTemplateData.tsx'

export function PasswordGate() {
  const [password, setPassword] = useState('')
  const [shake, setShake] = useState(false)
  const { authenticate, isAuthenticating, error } = useInstanceAuth()
  const { setInstance } = useTemplateData()

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    const ok = await authenticate(password)
    if (!ok) {
      setShake(true)
      setTimeout(() => setShake(false), 600)
    } else {
      // Force re-render by navigating (instance context will update)
      window.location.reload()
    }
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, backgroundColor: '#0d0b0e',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'Cairo, sans-serif', direction: 'rtl', zIndex: 9998,
    }}>
      <style>{`
        @keyframes shake {
          0%,100%{transform:translateX(0)}
          20%,60%{transform:translateX(-8px)}
          40%,80%{transform:translateX(8px)}
        }
        .farhty-gate-shake { animation: shake 0.5s ease; }
        .farhty-gate-input {
          background: #181420; border: 1px solid #2e2840; color: #f0e8d8;
          border-radius: 12px; padding: 12px 16px; width: 100%;
          font-family: Cairo, sans-serif; font-size: 16px;
          outline: none; transition: border-color 0.2s; direction: ltr;
        }
        .farhty-gate-input:focus { border-color: #c8973a; }
        .farhty-gate-btn {
          width: 100%; padding: 14px;
          background: linear-gradient(135deg, #c8973a, #e8b857);
          color: #0d0b0e; font-weight: 900; font-size: 16px;
          border: none; border-radius: 12px; cursor: pointer;
          font-family: Cairo, sans-serif; transition: opacity 0.2s;
        }
        .farhty-gate-btn:disabled { opacity: 0.6; cursor: not-allowed; }
      `}</style>

      <div style={{ width: '100%', maxWidth: 360, padding: 16 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 64, height: 64, borderRadius: 16,
            background: 'linear-gradient(135deg, #c8973a, #e8b857)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 12px', fontSize: 24, fontWeight: 900, color: '#0d0b0e',
          }}>ف</div>
          <h1 style={{ color: '#f0e8d8', fontSize: 20, fontWeight: 900, margin: 0 }}>دعوتك بانتظارك</h1>
          <p style={{ color: '#9d8fa8', fontSize: 13, marginTop: 6 }}>أدخل كلمة المرور للدخول</p>
        </div>

        <form onSubmit={submit} className={shake ? 'farhty-gate-shake' : ''}>
          <div style={{ marginBottom: 16 }}>
            <input
              id="password-gate-input"
              type="password"
              className="farhty-gate-input"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="كلمة المرور"
              autoFocus
            />
          </div>
          {error && (
            <p id="password-gate-error" style={{ color: '#f87171', fontSize: 13, textAlign: 'center', marginBottom: 12 }}>
              {error}
            </p>
          )}
          <button
            id="password-gate-submit"
            type="submit"
            className="farhty-gate-btn"
            disabled={isAuthenticating || !password}
          >
            {isAuthenticating ? 'جاري التحقق...' : 'دخول'}
          </button>
        </form>
      </div>
    </div>
  )
}
