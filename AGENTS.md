# Preorder Manager — Project Brief for Antigravity

## What We Are Building

A full-stack **Preorder Manager** app with Next.js 16 + Prisma + SQLite.  
Two screens: a **list page** and a **create/edit page**.  
UI must match the reference screenshots exactly (clean, minimal, light theme).

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Database | SQLite (file-based, `dev.db`) |
| ORM | Prisma |
| Icons | Lucide React |
| UI primitives | Radix UI (Checkbox, Switch) |

> No Express. All backend logic lives in Next.js `app/api/` route handlers.

---

## Folder Structure

```
preorder-manager/
├── app/
│   ├── page.tsx                   ← Preorder list page (Screen 1)
│   ├── preorders/
│   │   ├── new/
│   │   │   └── page.tsx           ← Create preorder page (Screen 2)
│   │   └── [id]/
│   │       └── edit/
│   │           └── page.tsx       ← Edit preorder page (Screen 2, prefilled)
│   └── api/
│       └── preorders/
│           ├── route.ts           ← GET (list) + POST (create)
│           └── [id]/
│               └── route.ts       ← GET + PATCH (update/toggle) + DELETE
├── components/
│   ├── PreorderTable.tsx          ← Table with checkboxes, toggles, actions
│   ├── PreorderFilters.tsx        ← All / Active / Inactive tabs
│   ├── SortDropdown.tsx           ← Sort by Name / Created At / Starts At / Ends At
│   ├── Pagination.tsx             ← Showing X to Y from Z
│   └── PreorderForm.tsx           ← Shared form for create + edit
├── lib/
│   └── prisma.ts                  ← Prisma singleton client
├── prisma/
│   ├── schema.prisma              ← Preorder model
│   ├── migrations/                ← Auto-generated
│   └── seed.ts                    ← Sample data (8 preorders)
└── .env                           ← DATABASE_URL="file:./dev.db"
```

---

## Database Schema

```prisma
model Preorder {
  id           String    @id @default(cuid())
  name         String
  products     Int       @default(1)
  preorderWhen String    @default("regardless-of-stock")
  startsAt     DateTime
  endsAt       DateTime?
  isActive     Boolean   @default(true)
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
}
```

---

## API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/preorders?filter=all&sortBy=createdAt&order=desc&page=1&limit=10` | List with filter, sort, pagination |
| POST | `/api/preorders` | Create new preorder |
| GET | `/api/preorders/:id` | Get single preorder |
| PATCH | `/api/preorders/:id` | Update fields or toggle isActive |
| DELETE | `/api/preorders/:id` | Delete preorder |

### Query Params for GET /api/preorders

- `filter` → `all` | `active` | `inactive`
- `sortBy` → `name` | `createdAt` | `startsAt` | `endsAt`
- `order` → `asc` | `desc`
- `page` → number (default `1`)
- `limit` → number (default `10`)

---

## Screen 1 — Preorder List Page (`/`)

### UI Elements
- Page title: **"Preorders"** (top left)
- **"Create Preorder"** button (top right) → navigates to `/preorders/new`
- Filter tabs: **All | Active | Inactive** (top left of table)
- Sort icon button (top right of table) → opens dropdown with:
  - Sort by: Name / Created At / Starts At / Ends At
  - Direction: Ascending / Descending
- Table columns: `☐ | Name | Products | Preorder when | Starts at | Ends at | Status | Actions`
- Each row has:
  - Checkbox (individual select)
  - Toggle switch (updates `isActive` in DB on change, shows feedback)
  - Pencil icon → navigates to `/preorders/:id/edit`
  - Trash icon → deletes from DB, refreshes list
- Select-all checkbox in header (selects/deselects all visible rows)
- Pagination footer: **"Showing X to Y from Z"** with prev/next arrows
- Empty state if no preorders found

### Backend Logic (must be server-side, not client-only)
- Filtering by isActive
- Sorting by selected field + direction
- Pagination (skip/take in Prisma query)

---

## Screen 2 — Create / Edit Page (`/preorders/new` and `/preorders/:id/edit`)

### UI Elements
- **"← Back"** button (top left) → navigates to `/`
- **"Cancel"** button (top right) → navigates to `/`
- **"Save changes"** button (top right, black) → submits form, shows loader while saving, redirects to `/` on success
- Card titled **"Preorder details"** with subtitle: *"These values appear in the preorders list."*
- Form fields (each with label, helper text, and input):

| Field | Input Type | Notes |
|---|---|---|
| Name * | Text input | Required |
| Products | Number input with up/down arrows | Shows "product(s)" label next to it |
| Preorder when | Select dropdown | Options: `regardless-of-stock`, `out-of-stock` |
| Starts at | DateTime-local input | Required |
| Ends at | DateTime-local input | Optional, "Leave empty for no end date." |
| Status | Toggle switch | Label: "Active" / "Inactive" |

- For **edit page**: all fields pre-filled from DB
- For **create page**: all fields empty / default values
- Both Cancel buttons (top + bottom) redirect to `/`
- Loader shown on Save button while request is in flight

---

## Steps — Do Them in This Order

### ✅ Step 1 — Project Setup & Dependencies
```bash
npx create-next-app@latest preorder-manager --typescript --tailwind --app
cd preorder-manager
npm install prisma @prisma/client lucide-react
npm install @radix-ui/react-checkbox @radix-ui/react-switch
npx prisma init --datasource-provider sqlite
```

### ✅ Step 2 — Prisma Schema + Migration + Seed
- Write the Preorder model in `prisma/schema.prisma`
- Run `npx prisma migrate dev --name init`
- Write `prisma/seed.ts` with 8 sample preorders (matching screenshot data)
- Add seed script to `package.json` and run `npx prisma db seed`
- Write `lib/prisma.ts` singleton

### 👉 Step 3 — API Routes (Backend)
- Create `app/api/preorders/route.ts` → GET + POST
- Create `app/api/preorders/[id]/route.ts` → GET + PATCH + DELETE
- GET supports `filter`, `sortBy`, `order`, `page`, `limit` query params
- All filtering, sorting, pagination done in Prisma (server-side)

### Step 4 — List Page UI (`app/page.tsx`)
- Filter tabs (All / Active / Inactive)
- Sort dropdown
- Table with checkboxes, toggles, edit + delete actions
- Pagination
- Wire up to API: fetch on filter/sort/page change

### Step 5 — Create/Edit Form Page
- Shared `PreorderForm` component
- Create page: empty form → POST
- Edit page: fetch by ID → pre-fill → PATCH
- Loading state on submit button
- Redirect to `/` on success

### Step 6 — Polish
- Empty state in table
- Error handling
- Loading skeletons
- Match screenshot UI precisely (font sizes, spacing, border radius, toggle style)

---

## Hosting Options — Next.js + Prisma + SQLite

> **The honest answer:** SQLite is a file on disk. Most serverless platforms
> reset the filesystem on every deploy, so your data disappears.
> Here are your real options:

| Platform | Works? | Notes |
|---|---|---|
| **Railway** | ✅ Best option | Persistent disk, free $5 credit/month. Deploy as Node server. SQLite file survives redeploys. |
| **Render** | ✅ Good option | Free tier with persistent disk available. Set start command to `npm start`. |
| **Fly.io** | ✅ Works | Free tier, persistent volumes. Slightly more setup. |
| **Vercel** | ❌ Does not work | Serverless — filesystem resets every request. SQLite data lost. |
| **Netlify** | ❌ Does not work | Same reason as Vercel. |
| **Turso** | ✅ If you switch | Turso is cloud SQLite compatible with Prisma. Free tier 500MB. Needs `@prisma/adapter-turso` and minor config change. |

### Recommended for this assignment → Railway

```
1. Push code to GitHub
2. Go to railway.app → New Project → Deploy from GitHub
3. Set environment variable: DATABASE_URL=file:./dev.db
4. Set build command: npx prisma migrate deploy && npm run build
5. Set start command: npm start
6. Done — Railway gives you a public URL
```

> Since the assignment says hosting is **optional**, submitting a
> GitHub repo + README with local setup steps is fully acceptable.

---

## README Template (include this in submission)

```markdown
# Preorder Manager

## Setup

1. Clone the repo
   git clone <your-repo-url>
   cd preorder-manager

2. Install dependencies
   npm install

3. Set up the database
   npx prisma migrate dev --name init
   npx prisma db seed

4. Start the dev server
   npm run dev

5. Open http://localhost:3000

## Notes
- Database file is at prisma/dev.db (SQLite, auto-created on migrate)
- No external DB needed — runs fully local
```