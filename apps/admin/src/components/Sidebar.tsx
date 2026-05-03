import { NavLink, useNavigate } from 'react-router-dom'
import { useAdminAuth } from '../hooks/useAdminAuth'

const NAV_ITEMS = [
  { to: '/', label: 'الرئيسية', icon: '📊', exact: true },
  { to: '/templates', label: 'القوالب', icon: '🎨' },
  { to: '/instances', label: 'الحسابات', icon: '🚀' },
  { to: '/orders', label: 'الطلبات', icon: '📦' },
  { to: '/testimonials', label: 'التقييمات', icon: '⭐' },
]

export default function Sidebar() {
  const { logout } = useAdminAuth()
  const navigate = useNavigate()

  return (
    <aside className="fixed top-0 right-0 h-full w-60 bg-[#181420] border-l border-[#2e2840] flex flex-col z-30">
      {/* Logo */}
      <div className="p-6 border-b border-[#2e2840]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#c8973a] to-[#e8b857] flex items-center justify-center text-[#0d0b0e] font-black text-base">
            ف
          </div>
          <div>
            <p className="font-black text-[#f0e8d8] text-sm">فارهتي</p>
            <p className="text-[#9d8fa8] text-xs">لوحة التحكم</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.exact}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-[#c8973a20] text-[#e8b857] border border-[#c8973a30]'
                  : 'text-[#9d8fa8] hover:bg-[#2e2840] hover:text-[#f0e8d8]'
              }`
            }
          >
            <span className="text-base">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-[#2e2840]">
        <button
          id="logout-btn"
          onClick={() => { logout(); navigate('/login'); }}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-[#9d8fa8] hover:bg-[#2e2840] hover:text-red-400 transition-all duration-200"
        >
          <span>🚪</span> تسجيل الخروج
        </button>
      </div>
    </aside>
  )
}
