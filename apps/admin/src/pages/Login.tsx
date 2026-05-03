import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api, TOKEN_KEY } from '../api/client'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await api.post<{ token: string }>('/api/auth/login', { username, password })
      localStorage.setItem(TOKEN_KEY, res.data.token)
      navigate('/')
    } catch {
      setError('بيانات الدخول غير صحيحة. حاول مرة أخرى.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0d0b0e] flex items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-[#c8973a] to-[#e8b857] flex items-center justify-center text-[#0d0b0e] font-black text-2xl mb-4">
            ف
          </div>
          <h1 className="text-2xl font-black text-gradient-gold">فارهتي</h1>
          <p className="text-[#9d8fa8] text-sm mt-1">لوحة التحكم</p>
        </div>

        {/* Form */}
        <form onSubmit={submit} className="card space-y-4">
          <h2 className="text-[#f0e8d8] font-bold text-lg mb-2">تسجيل الدخول</h2>

          <div>
            <label>اسم المستخدم</label>
            <input
              id="login-username"
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="admin"
              autoComplete="username"
              dir="ltr"
            />
          </div>

          <div>
            <label>كلمة المرور</label>
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              dir="ltr"
            />
          </div>

          {error && (
            <p id="login-error" className="text-red-400 text-sm text-center bg-red-900/20 rounded-lg p-3">
              {error}
            </p>
          )}

          <button
            id="login-submit-btn"
            type="submit"
            disabled={loading}
            className="btn-gold w-full py-3 text-base"
          >
            {loading ? 'جاري الدخول...' : 'دخول'}
          </button>
        </form>
      </div>
    </div>
  )
}
