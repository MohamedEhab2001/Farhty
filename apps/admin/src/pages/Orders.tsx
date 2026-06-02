import { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import { api } from '../api/client'

interface Order {
  _id: string
  customerName: string; customerEmail: string; customerPhone: string
  instanceSlug: string
  paymentMethod: string
  easykashRef: string
  status: 'pending' | 'confirmed' | 'deployed'; notes: string; createdAt: string
  templateId: { name: string } | null
}

const STATUS_TABS = ['all', 'pending', 'confirmed', 'deployed'] as const
const STATUS_LABEL: Record<string, string> = { all: 'الكل', pending: 'معلقة', confirmed: 'مؤكدة', deployed: 'منشورة' }
const STATUS_BADGE: Record<string, string> = { pending: 'badge-red', confirmed: 'badge-green', deployed: 'badge-gray' }
const STATUS_AR: Record<string, string> = { pending: 'معلقة', confirmed: 'مؤكدة', deployed: 'منشورة' }

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [tab, setTab] = useState<typeof STATUS_TABS[number]>('all')
  const [loading, setLoading] = useState(true)

  const load = () => {
    api.get<Order[]>('/api/admin/orders').then(r => setOrders(r.data)).finally(() => setLoading(false))
  }
  useEffect(load, [])

  const confirm = async (id: string) => {
    await api.patch(`/api/admin/orders/${id}/status`, { status: 'confirmed' })
    load()
  }

  const markDeployed = async (id: string) => {
    await api.patch(`/api/admin/orders/${id}/status`, { status: 'deployed' })
    load()
  }

  const filtered = tab === 'all' ? orders : orders.filter(o => o.status === tab)
  const fmt = (d: string) => new Date(d).toLocaleDateString('ar-EG')

  return (
    <Layout title="الطلبات">
      {/* Tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {STATUS_TABS.map(t => (
          <button
            key={t}
            id={`orders-tab-${t}`}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${tab === t ? 'bg-[#c8973a20] text-[#e8b857] border border-[#c8973a30]' : 'btn-ghost'}`}
          >
            {STATUS_LABEL[t]}
            {t !== 'all' && <span className="mr-2 text-xs">({orders.filter(o => o.status === t).length})</span>}
          </button>
        ))}
      </div>

      <div className="card p-0 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-[#9d8fa8]">جاري التحميل...</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-[#9d8fa8]">لا توجد طلبات</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>العميل</th><th>التصميم</th><th>الرابط</th>
                <th>طريقة الدفع</th><th>الحالة</th><th>التاريخ</th><th>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(o => (
                <tr key={o._id}>
                  <td>
                    <div className="text-sm text-[#f0e8d8]">{o.customerName || '—'}</div>
                    <div className="text-xs text-[#9d8fa8] font-mono" dir="ltr">{o.customerPhone || o.customerEmail || ''}</div>
                  </td>
                  <td className="text-[#f0e8d8]">{o.templateId?.name || '—'}</td>
                  <td>
                    {o.instanceSlug ? (
                      <a
                        href={`https://${o.instanceSlug}.farhty.online`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-mono text-[#c8973a] hover:underline"
                        dir="ltr"
                      >
                        {o.instanceSlug}.farhty.online
                      </a>
                    ) : <span className="text-[#9d8fa8]">—</span>}
                  </td>
                  <td>
                    <span className={`badge ${o.paymentMethod === 'easykash' ? 'badge-green' : 'badge-gray'}`}>
                      {o.paymentMethod}
                    </span>
                  </td>
                  <td><span className={`badge ${STATUS_BADGE[o.status]}`}>{STATUS_AR[o.status]}</span></td>
                  <td className="text-[#9d8fa8] text-xs">{fmt(o.createdAt)}</td>
                  <td>
                    <div className="flex gap-2">
                      {o.status === 'pending' && o.paymentMethod !== 'easykash' && (
                        <button id={`confirm-order-${o._id}`} onClick={() => confirm(o._id)} className="btn-gold py-1 px-3 text-xs">تأكيد الدفع</button>
                      )}
                      {o.status === 'confirmed' && o.paymentMethod !== 'easykash' && (
                        <button id={`deploy-order-${o._id}`} onClick={() => markDeployed(o._id)} className="btn-ghost py-1 px-3 text-xs">تم النشر</button>
                      )}
                      {o.paymentMethod === 'easykash' && (
                        <span className="text-xs text-[#9d8fa8]">تلقائي</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </Layout>
  )
}
