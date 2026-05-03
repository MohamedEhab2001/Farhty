# Phase 1 — The API

## Stack
- Node.js + Express + TypeScript
- Mongoose (MongoDB)
- JWT for admin auth
- bcrypt for password hashing
- Cloudinary SDK
- child_process for deploy script execution
- SSE (Server-Sent Events) for deploy log streaming

---

## Folder Structure

```
apps/api/
├── src/
│   ├── index.ts
│   ├── config/
│   │   └── db.ts
│   ├── models/
│   │   ├── Template.ts
│   │   ├── Instance.ts
│   │   ├── Order.ts
│   │   ├── Admin.ts
│   │   └── Testimonial.ts
│   ├── routes/
│   │   ├── auth.ts
│   │   ├── templates.ts
│   │   ├── instances.ts
│   │   ├── orders.ts
│   │   ├── testimonials.ts
│   │   └── upload.ts
│   ├── middleware/
│   │   ├── adminAuth.ts
│   │   └── instanceAuth.ts
│   └── services/
│       ├── deploy.service.ts
│       └── cloudinary.service.ts
├── .env
├── .env.example
├── package.json
└── tsconfig.json
```

---

## Models

### Template
```typescript
{
  name: string                          // "Layla"
  slug: string                          // "template-001" — unique
  price: number                         // 299
  description: string
  language: 'ar' | 'en' | 'both'
  features: {
    music: boolean
    gallery: boolean
    rsvp: boolean
    countdownTimer: boolean
    rtl: boolean
    pages: number
  }
  fields: [
    {
      key: string                       // "bride_name"
      label: string                     // "اسم العروسة"
      type: 'text' | 'image' | 'audio' | 'date' | 'color' | 'boolean'
      defaultValue: any
      cloudinaryFolder: string          // "templates/template-001/hero"
      required: boolean
    }
  ]
  previewImages: string[]               // Cloudinary URLs
  previewVideo: string                  // Cloudinary URL (optional)
  status: 'draft' | 'active'
  version: string                       // "1.0.0"
  createdAt: Date
  updatedAt: Date
}
```

### Instance
```typescript
{
  templateId: ObjectId                  // ref: Template
  slug: string                          // "ahmed-sara" → ahmed-sara.farhty.online
  password: string                      // bcrypt hashed
  isPreview: boolean                    // disables password gate
  data: Map<string, any>               // customer filled values — flexible
  deployedAt: Date
  lastUpdatedAt: Date
}
```

### Order
```typescript
{
  templateId: ObjectId
  instanceId: ObjectId                  // linked after deployment
  customerPhone: string
  paymentMethod: 'vodafone' | 'instapay'
  status: 'pending' | 'confirmed' | 'deployed'
  notes: string
  createdAt: Date
}
```

### Admin
```typescript
{
  username: string                      // single record
  password: string                      // bcrypt hashed
}
```

### Testimonial
```typescript
{
  name: string
  location: string
  text: string
  rating: number                        // 1-5
  avatar: string                        // Cloudinary URL
  createdAt: Date
}
```

---

## API Routes

### Auth
```
POST   /api/auth/login                  → { username, password } → { token }
GET    /api/auth/me                     → verify token → { username }
```

### Templates — Public
```
GET    /api/templates                   → list active templates (store)
GET    /api/templates/:slug             → single template + fields schema
```

### Templates — Admin (JWT required)
```
POST   /api/admin/templates             → create template record
PUT    /api/admin/templates/:id         → update template
PATCH  /api/admin/templates/:id/status  → toggle draft/active
DELETE /api/admin/templates/:id         → delete template
```

### Instances — Admin (JWT required)
```
POST   /api/admin/instances             → create instance + trigger deploy (SSE)
GET    /api/admin/instances             → list all instances
PATCH  /api/admin/instances/:id/password → reset password
DELETE /api/admin/instances/:id         → delete instance
```

### Instances — Customer
```
POST   /api/instances/auth              → { slug, password } → { token }
GET    /api/instances/by-domain         → reads Host header → returns InstanceData
PATCH  /api/instances/:id/data          → save customer field data (instanceAuth)
```

### Upload
```
POST   /api/upload/sign                 → { folder } → signed Cloudinary upload URL
```

### Orders — Admin (JWT required)
```
GET    /api/admin/orders                → list all orders
POST   /api/admin/orders                → create order
PATCH  /api/admin/orders/:id/status     → update status
```

### Testimonials — Public
```
GET    /api/testimonials                → list all testimonials
```

### Testimonials — Admin (JWT required)
```
POST   /api/admin/testimonials          → create
PUT    /api/admin/testimonials/:id      → update
DELETE /api/admin/testimonials/:id      → delete
```

### Health
```
GET    /health                          → { status: 'ok' }
```

---

## Key Design: `GET /api/instances/by-domain`

This is what every deployed template calls on load:

```
Request arrives from ahmed-sara.farhty.online
→ API reads Host header
→ extracts slug: "ahmed-sara"
→ finds Instance where slug = "ahmed-sara"
→ populates templateId → gets fields schema + features
→ returns:
  {
    instanceId,
    templateId,
    slug,
    isPreview,
    features,
    fields,           ← the schema
    data              ← customer's saved values
  }
```

The template renders entirely from this response. It never hardcodes its schema.

---

## Deploy Flow (SSE)

`POST /api/admin/instances` returns an SSE stream:

```
data: [12:03:01] Building template-001...
data: [12:03:08] Build complete ✓
data: [12:03:08] Copying to /var/www/instances/ahmed-sara/...
data: [12:03:09] Writing instance config...
data: [12:03:09] Saving to MongoDB...
data: [12:03:10] ✓ Deployed → ahmed-sara.farhty.online
data: DONE
```

Admin dashboard listens on EventSource and renders this as a terminal log.

---

## Environment Variables

```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/farhty
JWT_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=
WHATSAPP_NUMBER=201000000000
INSTAPAY_ID=
VODAFONE_CASH_NUMBER=
```

---

## Seed Script

On first run, seed:
- One Admin record from env vars
- Three default Testimonials

---

## Notes
- All admin routes protected by `adminAuth` middleware (validates JWT)
- Instance data routes protected by `instanceAuth` middleware (validates instance session token)
- Instance session tokens are slug-scoped: stored client-side in localStorage as `farhty_token_[slug]`
- bcrypt rounds: 12
