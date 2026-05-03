import 'dotenv/config';
import bcrypt from 'bcrypt';
import { connectDB } from './config/db';
import { Admin } from './models/Admin';
import { Testimonial } from './models/Testimonial';

const BCRYPT_ROUNDS = 12;

const DEFAULT_TESTIMONIALS = [
  {
    name: 'سارة وأحمد',
    location: 'القاهرة، مصر',
    text: 'دعوتنا كانت خيالية! كل ضيف سألنا عنها، والتصميم كان راقي جداً وعصري. شكراً فارهتي على هذه التجربة الجميلة.',
    rating: 5,
    avatar: '',
  },
  {
    name: 'نور ومحمد',
    location: 'الإسكندرية، مصر',
    text: 'سهل الاستخدام وسريع جداً في الإعداد. أحببنا كيف يمكننا تغيير كل التفاصيل بأنفسنا. الدعوة الإلكترونية هي المستقبل!',
    rating: 5,
    avatar: '',
  },
  {
    name: 'ليلى وعمر',
    location: 'الجيزة، مصر',
    text: 'فريق الدعم كان متعاوناً جداً وساعدنا في كل خطوة. التصميم الذي اخترناه أسعد كل أهلنا وأصدقائنا.',
    rating: 5,
    avatar: '',
  },
];

async function seed(): Promise<void> {
  await connectDB();

  const username = process.env.ADMIN_USERNAME || 'admin';
  const plainPassword = process.env.ADMIN_PASSWORD;
  const passwordHash = process.env.ADMIN_PASSWORD_HASH;

  const existingAdmin = await Admin.findOne({ username });
  if (!existingAdmin) {
    let hash: string;

    if (plainPassword) {
      // Hash the plain text password from env
      hash = await bcrypt.hash(plainPassword, BCRYPT_ROUNDS);
      console.log(`✅ Admin created: ${username} / ${plainPassword}`);
    } else if (passwordHash) {
      // Use pre-hashed value directly
      hash = passwordHash;
      console.log(`✅ Admin created from ADMIN_PASSWORD_HASH`);
    } else {
      // Fallback default
      hash = await bcrypt.hash('admin123', BCRYPT_ROUNDS);
      console.log(`✅ Admin created with default password: admin123 — CHANGE THIS!`);
    }

    await Admin.create({ username, password: hash });
  } else {
    console.log(`ℹ️  Admin "${username}" already exists — skipping`);
  }

  // Seed Testimonials
  const count = await Testimonial.countDocuments();
  if (count === 0) {
    await Testimonial.insertMany(DEFAULT_TESTIMONIALS);
    console.log('✅ 3 default testimonials seeded');
  } else {
    console.log(`ℹ️  ${count} testimonial(s) already exist — skipping`);
  }

  console.log('✅ Seed complete');
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
