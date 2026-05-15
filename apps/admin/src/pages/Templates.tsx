import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import ConfirmDialog from '../components/ConfirmDialog'
import RebuildAllModal from '../components/RebuildAllModal'
import FlashSaleModal from '../components/FlashSaleModal'
import { api } from '../api/client'

interface Template {
  _id: string; name: string; slug: string; language: string
  price: number; status: string; version: string
  salePrice?: number; saleEndsAt?: string
}

const LANG_LABEL: Record<string, string> = { ar: 'عربي', en: 'English', both: 'عربي+English' }

export default function Templates() {
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [rebuildAll, setRebuildAll] = useState<{ id: string; name: string } | null>(null)
  const [flashSaleTarget, setFlashSaleTarget] = useState<Template | null>(null)
  const navigate = useNavigate()

  const load = () => {
    api.get<Template[]>('/api/admin/templates').then(r => setTemplates(r.data)).finally(() => setLoading(false))
  }
  useEffect(load, [])

  const toggleStatus = async (t: Template) => {
    const next = t.status === 'active' ? 'draft' : 'active'
    await api.patch(`/api/admin/templates/${t._id}/status`, { status: next })
    load()
  }

  const confirmDelete = async () => {
    if (!deleteId) return
    setDeleting(true)
    await api.delete(`/api/admin/templates/${deleteId}`)
    setDeleteId(null)
    setDeleting(false)
    load()
  }

  return (
    <Layout title="القوالب">
      {rebuildAll && (
        <RebuildAllModal
          templateId={rebuildAll.id}
          templateName={rebuildAll.name}
          onClose={() => setRebuildAll(null)}
        />
      )}
      {flashSaleTarget && (
        <FlashSaleModal
          templateId={flashSaleTarget._id}
          templateName={flashSaleTarget.name}
          currentSalePrice={flashSaleTarget.salePrice}
          currentSaleEndsAt={flashSaleTarget.saleEndsAt}
          onClose={() => setFlashSaleTarget(null)}
          onSaved={load}
        />
      )}
      {deleteId && (
        <ConfirmDialog
          message="هل تريد حذف هذا القالب نهائياً؟"
          onConfirm={confirmDelete}
          onCancel={() => setDeleteId(null)}
          loading={deleting}
        />
      )}

      <div className="flex justify-between items-center mb-6">
        <p className="text-[#9d8fa8] text-sm">{templates.length} قالب</p>
        <button id="new-template-btn" onClick={() => navigate('/templates/new')} className="btn-gold">
          + قالب جديد
        </button>
      </div>

      <div className="card p-0 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-[#9d8fa8]">جاري التحميل...</div>
        ) : templates.length === 0 ? (
          <div className="p-8 text-center text-[#9d8fa8]">لا توجد قوالب بعد</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>الاسم</th>
                <th>اللغة</th>
                <th>السعر</th>
                <th>الحالة</th>
                <th>الإصدار</th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {templates.map(t => (
                <tr key={t._id}>
                  <td className="font-semibold text-[#f0e8d8]">{t.name}</td>
                  <td><span className="badge badge-gray">{LANG_LABEL[t.language] || t.language}</span></td>
                  <td>
                    {t.salePrice ? (
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[#e8b857] font-semibold">{t.salePrice} ج</span>
                        <span className="text-[#9d8fa8] text-xs line-through">{t.price} ج</span>
                        {t.saleEndsAt && (
                          <span className="text-[#ff6b6b] text-xs">
                            حتى {new Date(t.saleEndsAt).toLocaleDateString('ar-EG')}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-[#e8b857] font-semibold">{t.price} ج</span>
                    )}
                  </td>
                  <td>
                    <span className={`badge ${t.status === 'active' ? 'badge-green' : 'badge-yellow'}`}>
                      {t.status === 'active' ? 'نشط' : 'مسودة'}
                    </span>
                  </td>
                  <td className="text-[#9d8fa8] font-mono text-xs">{t.version}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <button
                        id={`edit-tpl-${t._id}`}
                        onClick={() => navigate(`/templates/${t._id}/edit`)}
                        className="btn-ghost py-1 px-3 text-xs"
                      >تعديل</button>
                      <button
                        id={`toggle-tpl-${t._id}`}
                        onClick={() => toggleStatus(t)}
                        className="btn-ghost py-1 px-3 text-xs"
                      >{t.status === 'active' ? 'إلغاء النشر' : 'نشر'}</button>
                      <a
                        href={`https://preview-${t.slug}.farhty.online`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-ghost py-1 px-3 text-xs"
                      >معاينة ↗</a>
                      <button
                        id={`rebuild-all-${t._id}`}
                        onClick={() => setRebuildAll({ id: t._id, name: t.name })}
                        className="py-1 px-3 text-xs rounded-lg text-[#e8b857] hover:bg-[#e8b857]/10 transition-all"
                        title="إعادة بناء جميع الحسابات المنشورة من هذا القالب"
                      >🔄 إعادة بناء الكل</button>
                      <button
                        id={`flash-sale-${t._id}`}
                        onClick={() => setFlashSaleTarget(t)}
                        className={`py-1 px-3 text-xs rounded-lg transition-all ${t.salePrice ? 'text-[#e8b857] bg-[#e8b857]/10 hover:bg-[#e8b857]/20' : 'text-[#9d8fa8] hover:bg-[#3d2c38]/40'}`}
                        title="إدارة عرض فلاش"
                      >{t.salePrice ? '⚡ عرض نشط' : '⚡ فلاش'}</button>
                      <button
                        id={`delete-tpl-${t._id}`}
                        onClick={() => setDeleteId(t._id)}
                        className="py-1 px-3 text-xs rounded-lg text-red-400 hover:bg-red-900/20 transition-all"
                      >حذف</button>
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
