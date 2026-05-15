import { useState } from 'react'
import { api } from '../api/client'

interface FlashSaleModalProps {
  templateId: string
  templateName: string
  currentSalePrice?: number
  currentSaleEndsAt?: string
  onClose: () => void
  onSaved: () => void
}

export default function FlashSaleModal({
  templateId,
  templateName,
  currentSalePrice,
  currentSaleEndsAt,
  onClose,
  onSaved,
}: FlashSaleModalProps) {
  const [salePrice, setSalePrice] = useState(currentSalePrice?.toString() ?? '')
  const [saleEndsAt, setSaleEndsAt] = useState(
    currentSaleEndsAt ? new Date(currentSaleEndsAt).toISOString().slice(0, 16) : ''
  )
  const [saving, setSaving] = useState(false)
  const [clearing, setClearing] = useState(false)

  const handleSave = async () => {
    const price = parseFloat(salePrice)
    if (isNaN(price) || price <= 0) return
    setSaving(true)
    await api.patch(`/api/admin/templates/${templateId}/sale`, {
      salePrice: price,
      saleEndsAt: saleEndsAt || null,
    })
    setSaving(false)
    onSaved()
    onClose()
  }

  const handleClear = async () => {
    setClearing(true)
    await api.patch(`/api/admin/templates/${templateId}/sale`, { salePrice: null, saleEndsAt: null })
    setClearing(false)
    onSaved()
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" dir="rtl">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[#1a1220] border border-[#3d2c38] rounded-2xl p-6 w-full max-w-sm shadow-2xl">
        <h2 className="text-lg font-bold text-[#f0e8d8] mb-1">تفعيل عرض فلاش</h2>
        <p className="text-[#9d8fa8] text-sm mb-5">{templateName}</p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-[#9d8fa8] mb-1">سعر العرض (جنيه)</label>
            <input
              type="number"
              min="1"
              value={salePrice}
              onChange={e => setSalePrice(e.target.value)}
              placeholder="مثال: 199"
              className="w-full bg-[#120d18] border border-[#3d2c38] rounded-lg px-3 py-2 text-[#f0e8d8] text-sm focus:outline-none focus:border-[#e8b857] transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm text-[#9d8fa8] mb-1">ينتهي في (اختياري)</label>
            <input
              type="datetime-local"
              value={saleEndsAt}
              onChange={e => setSaleEndsAt(e.target.value)}
              className="w-full bg-[#120d18] border border-[#3d2c38] rounded-lg px-3 py-2 text-[#f0e8d8] text-sm focus:outline-none focus:border-[#e8b857] transition-colors"
            />
          </div>
        </div>

        <div className="flex gap-2 mt-6">
          <button onClick={onClose} className="btn-ghost py-2 px-4 text-sm flex-1">إلغاء</button>
          {currentSalePrice && (
            <button
              onClick={handleClear}
              disabled={clearing}
              className="py-2 px-4 text-sm rounded-lg text-red-400 hover:bg-red-900/20 transition-all disabled:opacity-50"
            >
              {clearing ? '...' : 'إلغاء العرض'}
            </button>
          )}
          <button
            onClick={handleSave}
            disabled={saving || !salePrice}
            className="btn-gold py-2 px-4 text-sm flex-1 disabled:opacity-50"
          >
            {saving ? 'جاري الحفظ...' : 'حفظ العرض'}
          </button>
        </div>
      </div>
    </div>
  )
}
