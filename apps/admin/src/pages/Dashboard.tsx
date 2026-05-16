import { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import { api } from '../api/client'

interface Stats {
  activeTemplates: number
  totalInstances: number
  pendingOrders: number
  confirmedOrders: number
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({ activeTemplates: 0, totalInstances: 0, pendingOrders: 0, confirmedOrders: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get('/api/admin/templates'),
      api.get('/api/admin/instances'),
      api.get('/api/admin/orders'),
    ]).then(([tpls, insts, orders]) => {
      const templates = tpls.data as { status: string }[]
      const instances = insts.data as unknown[]
      const ordersList = orders.data as { status: string; createdAt: string }[]
      const thisMonth = new Date().getMonth()
      setStats({
        activeTemplates: templates.filter(t => t.status === 'active').length,
        totalInstances: instances.length,
        pendingOrders: ordersList.filter(o => o.status === 'pending').length,
        confirmedOrders: ordersList.filter(o => {
          return o.status === 'confirmed' && new Date(o.createdAt).getMonth() === thisMonth
        }).length,
      })
    }).catch(() => { }).finally(() => setLoading(false))
  }, [])

  const CARDS = [
    { label: 'تصاميم نشطة', value: stats.activeTemplates, icon: '🎨', color: '#c8973a' },
    { label: 'حسابات منشورة', value: stats.totalInstances, icon: '🚀', color: '#4ade80' },
    { label: 'طلبات معلقة', value: stats.pendingOrders, icon: '📦', color: stats.pendingOrders > 0 ? '#f87171' : '#9d8fa8', badge: stats.pendingOrders > 0 },
    { label: 'طلبات مؤكدة (هذا الشهر)', value: stats.confirmedOrders, icon: '✅', color: '#60a5fa' },
  ]

  return (
    <Layout title="الرئيسية">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {CARDS.map((c, i) => (
          <div key={i} className="card relative overflow-hidden">
            {c.badge && (
              <span className="absolute top-3 left-3 w-3 h-3 rounded-full bg-red-500 animate-pulse" />
            )}
            <div className="text-3xl mb-3">{c.icon}</div>
            <p className="text-3xl font-black" style={{ color: c.color }}>
              {loading ? '...' : c.value}
            </p>
            <p className="text-[#9d8fa8] text-sm mt-1">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="card">
        <p className="text-[#9d8fa8] text-sm">
          مرحباً بك في لوحة تحكم فارهتي. استخدم القائمة الجانبية للتنقل.
        </p>
      </div>
    </Layout>
  )
}
