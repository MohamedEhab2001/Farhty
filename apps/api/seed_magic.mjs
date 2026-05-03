import mongoose from 'mongoose';

const TemplateSchema = new mongoose.Schema({
  name: String,
  slug: String,
  price: Number,
  description: String,
  language: String,
  features: Object,
  fields: Array,
  previewImages: Array,
  status: String,
  version: String,
}, { timestamps: true });

const Template = mongoose.model('Template', TemplateSchema);

async function seed() {
  await mongoose.connect('mongodb+srv://mohamedehab567t_db_user:knn1mNbCTRnj070k@farhty.ubpv33z.mongodb.net/farhty');
  
  await Template.findOneAndUpdate(
    { slug: 'magic' },
    {
      name: '???',
      slug: 'magic',
      price: 1500,
      description: '????? ??????? ???? ?? ????? ????? ????',
      language: 'ar',
      features: {
        music: false,
        gallery: false,
        rsvp: false,
        countdownTimer: true,
        rtl: true,
        pages: 1
      },
      fields: [
        { key: 'bride_name', label: '??? ??????', type: 'text', defaultValue: '???', required: true },
        { key: 'groom_name', label: '??? ??????', type: 'text', defaultValue: '???', required: true },
        { key: 'couple_message', label: '????? ??????', type: 'text', defaultValue: '??? ???? ?????? ????? ??????? ????????? ???? ?????.', required: false },
        { key: 'wedding_date', label: '????? ??????', type: 'date', required: true },
        { key: 'wedding_location', label: '???? ??????', type: 'text', defaultValue: '???? ?????? — ???? ??????', required: false }
      ],
      previewImages: ['/bride.png'],
      status: 'active',
      version: '1.0.0'
    },
    { upsert: true, new: true }
  );
  
  console.log('Template created successfully in farhty database!');
  process.exit(0);
}

seed().catch(console.error);
