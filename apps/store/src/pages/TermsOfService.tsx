import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { motion } from 'framer-motion'

export default function TermsOfService() {
  return (
    <div dir="rtl" className="min-h-screen flex flex-col bg-[#fdfbf7]">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-20 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl sm:text-5xl font-bold text-[#3d2c38] mb-12 text-center">شروط الاستخدام</h1>
            
            <div className="space-y-12 text-[#8c7a87] leading-relaxed text-lg">
              <section className="bg-white p-8 rounded-2xl border border-[#ebdce3]/40 shadow-sm">
                <h2 className="text-2xl font-bold text-[#3d2c38] mb-4 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-[#a66b9610] text-[#a66b96] flex items-center justify-center text-sm">١</span>
                  قبول الشروط
                </h2>
                <p>
                  باستخدامك لمنصة "فرحتي"، فإنك توافق على الالتزام بشروط الاستخدام الموضحة هنا. هذه الشروط تحكم علاقتك بالمنصة عند شراء واستخدام دعوات الزفاف الرقمية.
                </p>
              </section>

              <section className="bg-white p-8 rounded-2xl border border-[#ebdce3]/40 shadow-sm">
                <h2 className="text-2xl font-bold text-[#3d2c38] mb-4 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-[#a66b9610] text-[#a66b96] flex items-center justify-center text-sm">٢</span>
                  طبيعة الخدمة
                </h2>
                <p>
                  "فرحتي" هي منصة توفر قوالب دعوات زفاف إلكترونية تفاعلية. بعد الشراء، يحصل العميل على رابط مخصص لدعوته مع إمكانية تعديل البيانات والصور من خلال لوحة تحكم بسيطة.
                </p>
              </section>

              <section className="bg-white p-8 rounded-2xl border border-[#ebdce3]/40 shadow-sm">
                <h2 className="text-2xl font-bold text-[#3d2c38] mb-4 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-[#a66b9610] text-[#a66b96] flex items-center justify-center text-sm">٣</span>
                  الدفع والتفعيل
                </h2>
                <ul className="list-disc pr-6 space-y-3">
                  <li>يتم تفعيل الخدمة فور تأكيد عملية الدفع عبر الوسائل المتاحة (فودافون كاش أو إنستاباي).</li>
                  <li>الأسعار المعلنة هي أسعار نهائية مقابل الحصول على الرابط والخدمات المرفقة به.</li>
                </ul>
              </section>

              <section className="bg-white p-8 rounded-2xl border border-[#ebdce3]/40 shadow-sm">
                <h2 className="text-2xl font-bold text-[#3d2c38] mb-4 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-[#a66b9610] text-[#a66b96] flex items-center justify-center text-sm">٤</span>
                  سياسة الاسترداد
                </h2>
                <p>
                  نحن نضمن رضاكم التام. يمكنكم طلب استرداد كامل المبلغ خلال 24 ساعة من تاريخ الشراء إذا لم تكن الخدمة مرضية لكم، شريطة عدم استخدام الرابط بشكل نهائي.
                </p>
              </section>

              <section className="bg-white p-8 rounded-2xl border border-[#ebdce3]/40 shadow-sm">
                <h2 className="text-2xl font-bold text-[#3d2c38] mb-4 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-[#a66b9610] text-[#a66b96] flex items-center justify-center text-sm">٥</span>
                  مسؤولية المحتوى
                </h2>
                <p>
                  العميل مسؤول بشكل كامل عن دقة البيانات والصور المرفوعة في الدعوة. تحتفظ المنصة بالحق في إزالة أي محتوى مخالف للآداب العامة أو القوانين المعمول بها.
                </p>
              </section>

              <section className="bg-white p-8 rounded-2xl border border-[#ebdce3]/40 shadow-sm">
                <h2 className="text-2xl font-bold text-[#3d2c38] mb-4 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-[#a66b9610] text-[#a66b96] flex items-center justify-center text-sm">٦</span>
                  التوافر والدعم
                </h2>
                <p>
                  نحن نسعى لضمان توفر رابط الدعوة بنسبة 99% حتى موعد الزفاف. في حال وجود أي مشكلة تقنية، نوفر دعماً فنياً سريعاً عبر الواتساب لحل المشكلة فوراً.
                </p>
              </section>

              <section className="bg-[#a66b9605] p-8 rounded-2xl border border-[#a66b9620] text-center">
                <h2 className="text-2xl font-bold text-[#3d2c38] mb-4">لديك سؤال؟</h2>
                <p className="mb-6">
                  إذا كان لديك أي استفسار بخصوص شروط الاستخدام، نحن هنا للمساعدة.
                </p>
                <a 
                  href="https://wa.me/201027708044" 
                  className="btn-primary"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  تحدث معنا
                </a>
              </section>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
