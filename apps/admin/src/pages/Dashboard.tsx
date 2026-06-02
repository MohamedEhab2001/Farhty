import { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import { api } from '../api/client'

interface Order {
  _id: string
  status: 'pending' | 'confirmed' | 'deployed'
  paymentMethod: string
  customerName: string
  customerEmail: string
  customerPhone: string
  instanceSlug: string
  createdAt: string
  templateId: { name: string; price: number } | null
}

interface Stats {
  activeTemplates: number
  totalInstances: number
  todayOrders: number
  todayRevenue: number
  pendingOrders: number
  needsAttention: number // EasyKash confirmed but not deployed
}

function isToday(dateStr: string) {
  const d = new Date(dateStr)
  const now = new Date()
  return d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear()
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({
    activeTemplates: 0, totalInstances: 0,
    todayOrders: 0, todayRevenue: 0,
    pendingOrders: 0, needsAttention: 0,
  })
  const [attentionOrders, setAttentionOrders] = useState<Order[]>([])
  const [recentOrders, setRecentOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get('/api/admin/templates'),
      api.get('/api/admin/instances'),
      api.get('/api/admin/orders'),
    ]).then(([tpls, insts, ords]) => {
      const templates = tpls.data as { status: string }[]
      const instances = insts.data as unknown[]
      const orders = ords.data as Order[]

      const todayOrders = orders.filter(o => isToday(o.createdAt))
      const todayRevenue = todayOrders.reduce((sum, o) => sum + (o.templateId?.price ?? 0), 0)
      const attention = orders.filter(o => o.paymentMethod === 'easykash' && o.status === 'confirmed')

      setStats({
        activeTemplates: (templates as { status: string }[]).filter(t => t.status === 'active').length,
        totalInstances: instances.length,
        todayOrders: todayOrders.length,
        todayRevenue,
        pendingOrders: orders.filter(o => o.status === 'pending').length,
        needsAttention: attention.length,
      })
      setAttentionOrders(attention)
      setRecentOrders(orders.slice(0, 8))
    }).catch(() => { }).finally(() => setLoading(false))
  }, [])

  const CARDS = [
    { label: 'طلبات اليوم', value: stats.todayOrders, sub: null, color: '#a66b96', icon: <OrderIcon /> },
    { label: 'إيرادات اليوم', value: stats.todayRevenue, sub: 'جنيه', color: '#c8973a', icon: <RevenueIcon /> },
    { label: 'طلبات معلقة', value: stats.pendingOrders, sub: null, color: stats.pendingOrders > 0 ? '#f87171' : '#9d8fa8', icon: <PendingIcon />, pulse: stats.pendingOrders > 0 },
    { label: 'تحتاج مراجعة', value: stats.needsAttention, sub: null, color: stats.needsAttention > 0 ? '#fb923c' : '#9d8fa8', icon: <AttentionIcon />, pulse: stats.needsAttention > 0 },
    { label: 'تصاميم نشطة', value: stats.activeTemplates, sub: null, color: '#60a5fa', icon: <TemplateIcon /> },
    { label: 'دعوات منشورة', value: stats.totalInstances, sub: null, color: '#4ade80', icon: <InstanceIcon /> },
  ]

  const fmt = (d: string) => new Date(d).toLocaleDateString('ar-EG', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })

  return (
    <Layout title="الرئيسية">

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {CARDS.map((c, i) => (
          <div key={i} className="card relative overflow-hidden p-4">
            {c.pulse && <span className="absolute top-2.5 left-2.5 w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />}
            <div className="mb-2 opacity-60" style={{ color: c.color }}>{c.icon}</div>
            <p className="text-2xl font-black" style={{ color: c.color }}>
              {loading ? '—' : c.value}{c.sub && <span className="text-sm font-normal mr-1">{c.sub}</span>}
            </p>
            <p className="text-[#9d8fa8] text-xs mt-0.5">{c.label}</p>
          </div>
        ))}
      </div>

      {/* Needs attention */}
      {!loading && attentionOrders.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-[#fb923c] mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse inline-block" />
            تحتاج مراجعة — دفع تم لكن لم يُنشر ({attentionOrders.length})
          </h2>
          <div className="card p-0 overflow-hidden">
            <table>
              <thead>
                <tr>
                  <th>العميل</th><th>التصميم</th><th>الرابط المطلوب</th><th>التاريخ</th><th>تواصل</th>
                </tr>
              </thead>
              <tbody>
                {attentionOrders.map(o => {
                  const msg = encodeURIComponent(`مرحبا ${o.customerName}، شكراً على طلبك لتصميم ${o.templateId?.name ?? ''}. نعتذر عن التأخير وسنرسل لك رابط دعوتك خلال دقائق.`)
                  const wa = `https://wa.me/${o.customerPhone.replace(/\D/g, '')}?text=${msg}`
                  return (
                    <tr key={o._id}>
                      <td>
                        <div className="text-sm text-[#f0e8d8]">{o.customerName || '—'}</div>
                        <div className="text-xs text-[#9d8fa8]">{o.customerEmail || ''}</div>
                      </td>
                      <td className="text-[#f0e8d8] text-sm">{o.templateId?.name || '—'}</td>
                      <td className="font-mono text-xs text-[#9d8fa8]" dir="ltr">{o.instanceSlug}.farhty.online</td>
                      <td className="text-[#9d8fa8] text-xs">{fmt(o.createdAt)}</td>
                      <td>
                        <a href={wa} target="_blank" rel="noreferrer"
                          className="btn-gold py-1 px-3 text-xs inline-flex items-center gap-1">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M11.999 2C6.478 2 2 6.478 2 12c0 1.85.505 3.58 1.385 5.063L2 22l5.09-1.371A9.94 9.94 0 0012 22c5.522 0 10-4.478 10-10S17.522 2 12 2z"/></svg>
                          واتساب
                        </a>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Recent orders */}
      <div>
        <h2 className="text-sm font-semibold text-[#9d8fa8] mb-3">آخر الطلبات</h2>
        <div className="card p-0 overflow-hidden">
          {loading ? (
            <div className="p-6 text-center text-[#9d8fa8] text-sm">جاري التحميل...</div>
          ) : recentOrders.length === 0 ? (
            <div className="p-6 text-center text-[#9d8fa8] text-sm">لا توجد طلبات بعد</div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>العميل</th><th>التصميم</th><th>طريقة الدفع</th><th>الحالة</th><th>التاريخ</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map(o => (
                  <tr key={o._id}>
                    <td>
                      <div className="text-sm text-[#f0e8d8]">{o.customerName || '—'}</div>
                      <div className="text-xs text-[#9d8fa8] font-mono" dir="ltr">{o.customerPhone || ''}</div>
                    </td>
                    <td className="text-[#f0e8d8] text-sm">{o.templateId?.name || '—'}</td>
                    <td><span className={`badge ${o.paymentMethod === 'easykash' ? 'badge-green' : 'badge-gray'}`}>{o.paymentMethod}</span></td>
                    <td>
                      <span className={`badge ${o.status === 'deployed' ? 'badge-green' : o.status === 'confirmed' ? 'badge-gray' : 'badge-red'}`}>
                        {o.status === 'deployed' ? 'منشور' : o.status === 'confirmed' ? 'مؤكد' : 'معلق'}
                      </span>
                    </td>
                    <td className="text-[#9d8fa8] text-xs">{fmt(o.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

    </Layout>
  )
}

function OrderIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
}
function RevenueIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
}
function PendingIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
}
function AttentionIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
}
function TemplateIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>
}
function InstanceIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="10 15 12 17 14 15"/><path d="M7.5 10.5C7.5 8 9.5 6 12 6s4.5 2 4.5 4.5"/></svg>
}
