import { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import ConfirmDialog from '../components/ConfirmDialog'
import DeployModal from '../components/DeployModal'
import RebuildModal from '../components/RebuildModal'
import { api } from '../api/client'

interface Instance {
  _id: string; slug: string; isPreview: boolean; deployedAt: string; lastUpdatedAt: string
  templateId: { name: string; slug: string } | null
}

export default function Instances() {
  const [instances, setInstances] = useState<Instance[]>([])
  const [loading, setLoading] = useState(true)
  const [showDeploy, setShowDeploy] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [resetId, setResetId] = useState<string | null>(null)
  const [newPw, setNewPw] = useState('')
  const [rebuildInst, setRebuildInst] = useState<{ id: string; slug: string } | null>(null)

  const load = () => {
    api.get<Instance[]>('/api/admin/instances').then(r => setInstances(r.data)).finally(() => setLoading(false))
  }
  useEffect(load, [])

  const confirmDelete = async () => {
    if (!deleteId) return
    setDeleting(true)
    await api.delete(`/api/admin/instances/${deleteId}`)
    setDeleteId(null); setDeleting(false); load()
  }

  const resetPassword = async (id: string) => {
    if (!newPw) return
    await api.patch(`/api/admin/instances/${id}/password`, { password: newPw })
    setResetId(null); setNewPw('')
  }

  const fmt = (d: string) => new Date(d).toLocaleDateString('ar-EG')

  return (
    <Layout title="الحسابات المنشورة">
      {deleteId && <ConfirmDialog message="حذف هذا الحساب نهائياً؟" onConfirm={confirmDelete} onCancel={() => setDeleteId(null)} loading={deleting} />}
      {showDeploy && <DeployModal onClose={() => setShowDeploy(false)} onDeployed={load} />}
      {rebuildInst && <RebuildModal instanceId={rebuildInst.id} slug={rebuildInst.slug} onClose={() => { setRebuildInst(null); load() }} />}

      <div className="flex justify-between items-center mb-6">
        <p className="text-[#9d8fa8] text-sm">{instances.length} حساب</p>
        <button id="deploy-new-btn" onClick={() => setShowDeploy(true)} className="btn-gold">
          + نشر حساب جديد
        </button>
      </div>

      <div className="card p-0 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-[#9d8fa8]">جاري التحميل...</div>
        ) : instances.length === 0 ? (
          <div className="p-8 text-center text-[#9d8fa8]">لا توجد حسابات بعد</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>الرابط</th><th>القالب</th><th>معاينة؟</th>
                <th>تاريخ النشر</th><th>آخر تحديث</th><th>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {instances.map(inst => (
                <tr key={inst._id}>
                  <td>
                    <a href={`https://${inst.slug}.farhty.online`} target="_blank" rel="noopener noreferrer"
                       className="text-[#e8b857] hover:underline font-mono text-xs">{inst.slug}.farhty.online ↗</a>
                  </td>
                  <td className="text-[#9d8fa8] text-xs">{inst.templateId?.name || '—'}</td>
                  <td><span className={`badge ${inst.isPreview ? 'badge-yellow' : 'badge-gray'}`}>{inst.isPreview ? 'معاينة' : 'مباشر'}</span></td>
                  <td className="text-[#9d8fa8] text-xs">{fmt(inst.deployedAt)}</td>
                  <td className="text-[#9d8fa8] text-xs">{fmt(inst.lastUpdatedAt)}</td>
                  <td>
                    <div className="flex items-center gap-2 flex-wrap">
                      {resetId === inst._id ? (
                        <div className="flex gap-1">
                          <input value={newPw} onChange={e => setNewPw(e.target.value)} placeholder="كلمة جديدة" className="w-28 text-xs py-1" dir="ltr" />
                          <button onClick={() => resetPassword(inst._id)} className="btn-gold py-1 px-2 text-xs">حفظ</button>
                          <button onClick={() => setResetId(null)} className="btn-ghost py-1 px-2 text-xs">إلغاء</button>
                        </div>
                      ) : (
                        <button id={`reset-pw-${inst._id}`} onClick={() => setResetId(inst._id)} className="btn-ghost py-1 px-3 text-xs">تغيير كلمة المرور</button>
                      )}
                      <button
                        id={`rebuild-inst-${inst._id}`}
                        onClick={() => setRebuildInst({ id: inst._id, slug: inst.slug })}
                        className="py-1 px-3 text-xs rounded-lg text-[#e8b857] hover:bg-[#e8b857]/10 transition-all"
                        title="إعادة بناء القالب ونشره"
                      >
                        🔄 إعادة بناء
                      </button>
                      <button id={`delete-inst-${inst._id}`} onClick={() => setDeleteId(inst._id)} className="py-1 px-3 text-xs rounded-lg text-red-400 hover:bg-red-900/20 transition-all">حذف</button>
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
