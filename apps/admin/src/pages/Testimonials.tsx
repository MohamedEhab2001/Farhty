import { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import ConfirmDialog from '../components/ConfirmDialog'
import { api } from '../api/client'

interface Testimonial {
  _id: string; name: string; location: string; text: string; rating: number; avatar: string
}

const EMPTY = { name: '', location: '', text: '', rating: 5, avatar: '' }

function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(i => (
        <button key={i} type="button" onClick={() => onChange(i)} className={`text-xl ${i <= value ? 'text-[#e8b857]' : 'text-[#2e2840]'}`}>★</button>
      ))}
    </div>
  )
}

export default function Testimonials() {
  const [list, setList] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Partial<Testimonial> | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [saving, setSaving] = useState(false)

  const load = () => {
    api.get<Testimonial[]>('/api/testimonials').then(r => setList(r.data)).finally(() => setLoading(false))
  }
  useEffect(load, [])

  const save = async () => {
    if (!editing) return
    setSaving(true)
    try {
      if (editing._id) {
        await api.put(`/api/admin/testimonials/${editing._id}`, editing)
      } else {
        await api.post('/api/admin/testimonials', editing)
      }
      setEditing(null); load()
    } finally {
      setSaving(false) }
  }

  const confirmDelete = async () => {
    if (!deleteId) return
    setDeleting(true)
    await api.delete(`/api/admin/testimonials/${deleteId}`)
    setDeleteId(null); setDeleting(false); load()
  }

  return (
    <Layout title="التقييمات">
      {deleteId && <ConfirmDialog message="حذف هذا التقييم؟" onConfirm={confirmDelete} onCancel={() => setDeleteId(null)} loading={deleting} />}

      <div className="flex justify-between items-center mb-6">
        <p className="text-[#9d8fa8] text-sm">{list.length} تقييم</p>
        <button id="add-testimonial-btn" onClick={() => setEditing({ ...EMPTY })} className="btn-gold">+ إضافة تقييم</button>
      </div>

      {/* Form */}
      {editing !== null && (
        <div className="card mb-6">
          <h3 className="font-bold text-[#e8b857] mb-4">{editing._id ? 'تعديل التقييم' : 'تقييم جديد'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div><label>الاسم</label><input id="testimonial-name" value={editing.name || ''} onChange={e => setEditing(p => ({ ...p!, name: e.target.value }))} /></div>
            <div><label>الموقع</label><input id="testimonial-location" value={editing.location || ''} onChange={e => setEditing(p => ({ ...p!, location: e.target.value }))} /></div>
            <div className="md:col-span-2"><label>النص</label><textarea id="testimonial-text" value={editing.text || ''} onChange={e => setEditing(p => ({ ...p!, text: e.target.value }))} rows={3} /></div>
            <div>
              <label>التقييم</label>
              <StarPicker value={editing.rating || 5} onChange={v => setEditing(p => ({ ...p!, rating: v }))} />
            </div>
          </div>
          <div className="flex gap-3">
            <button id="testimonial-save-btn" onClick={save} disabled={saving} className="btn-gold">{saving ? '...' : 'حفظ'}</button>
            <button onClick={() => setEditing(null)} className="btn-ghost">إلغاء</button>
          </div>
        </div>
      )}

      <div className="card p-0 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-[#9d8fa8]">جاري التحميل...</div>
        ) : (
          <table>
            <thead>
              <tr><th>الاسم</th><th>الموقع</th><th>التقييم</th><th>النص</th><th>الإجراءات</th></tr>
            </thead>
            <tbody>
              {list.map(t => (
                <tr key={t._id}>
                  <td className="font-semibold text-[#f0e8d8]">{t.name}</td>
                  <td className="text-[#9d8fa8] text-xs">{t.location}</td>
                  <td className="text-[#e8b857]">{'★'.repeat(t.rating)}</td>
                  <td className="text-[#9d8fa8] text-xs max-w-48 truncate">{t.text}</td>
                  <td>
                    <div className="flex gap-2">
                      <button id={`edit-test-${t._id}`} onClick={() => setEditing({ ...t })} className="btn-ghost py-1 px-3 text-xs">تعديل</button>
                      <button id={`delete-test-${t._id}`} onClick={() => setDeleteId(t._id)} className="py-1 px-3 text-xs rounded-lg text-red-400 hover:bg-red-900/20 transition-all">حذف</button>
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
