
# 🛍️ Preorder Manager

A professional, full-stack **Preorder Manager** web application built with **Next.js 16 (App Router)**, **TypeScript**, **Tailwind CSS**, and **Prisma 6** running on **SQLite**. 

This application provides store owners with an elegant, responsive dashboard to manage customer preorder campaigns for products that are coming soon or out of stock.

---

## 📖 What is Preorder Manager?

Preorders allow online retailers to capture customer intent and secure sales before products are physically in stock. **Preorder Manager** is a back-office tool that lets merchants:
1. **Monitor Active Campaigns:** See at a glance which products are up for preorder, how many items are allocated, when the campaign starts/ends, and toggle campaign visibility on the fly.
2. **Configure Reservation Rules:** Decide whether customers can preorder a product "regardless of stock" or only when it goes "out-of-stock".
3. **Create & Edit Preorder Rules:** Set up starts/ends timelines, product reservation limits, and activate/deactivate campaigns via a modern form.

---

## ✨ Key Features

### 📋 Preorders Dashboard (List View)
* **Status Filtering Tabs:** Quickly switch between **All**, **Active**, and **Inactive** preorder campaigns.
* **Dynamic Sorting Dropdown:** Sort campaigns by *Name*, *Created At*, *Starts At*, or *Ends At* in both *Ascending* and *Descending* orders.
* **Instant Action Controls:**
  * **Select All / Indeterminate Checkbox:** Multi-select table items using Radix UI primitives.
  * **Quick Toggle Switch:** Turn campaigns active/inactive instantly with a single click (saves immediately to the database).
  * **Pencil & Trash Actions:** Inline edit redirection and delete verification.
* **Footer Pagination:** Responsive pagination displaying bounds (`Showing X to Y from Z`) for easy navigation.

### 📝 Campaign Creator & Editor (Form View)
* **Form Validations:** Ensure required fields (Name and Starts At date) are provided, with chronological date checks (end date must be after start date).
* **Two-Column Settings Layout:** Standardized settings menu grouping configuration descriptions on the left and form input fields on the right.
* **Boilerplate Prefilling:** Modifying an existing campaign dynamically loads all historical database variables.
* **Submitting Indicators:** Disables buttons and shows a visual `Saving...` loader while database operations are in flight.

---

## 🛠️ Tech Stack & Architecture

| Layer | Technology | Description |
|---|---|---|
| **Frontend Framework** | **Next.js 16 (App Router)** | Full-stack React framework utilizing modern App router routing, layouts, and API Route Handlers. |
| **Language** | **TypeScript** | Statically-typed programming language ensuring type safety across client and API boundaries. |
| **Styling** | **Tailwind CSS v4** | Utility-first CSS framework for custom responsive styling. |
| **UI Primitives** | **Radix UI** | Headless accessible components for UI elements (`@radix-ui/react-checkbox`, `@radix-ui/react-switch`). |
| **Database** | **SQLite (`dev.db`)** | Local file-based lightweight database perfect for development and persistent server environments. |
| **ORM** | **Prisma 7** | Modern TypeScript ORM using the `PrismaBetterSqlite3` driver adapter for SQLite. |
| **Icons** | **Lucide React** | Clean, consistent SVG icon set. |

---

## 🗄️ Database Schema

The SQLite schema represents preorder configurations in [schema.prisma](file:///e:/$%20%20202T%20Web%20projects/Job%20assignments/Full-Stack/Preorder_Manager-Xubitar/preorder-manager/prisma/schema.prisma):

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

## 🔌 API Endpoints Reference

All API logic is served server-side through Next.js API Route Handlers in `app/api/preorders/`:

| Method | Endpoint | Query Parameters / Body | Purpose |
|---|---|---|---|
| **GET** | `/api/preorders` | `filter`, `sortBy`, `order`, `page`, `limit` | List preorders with sorting, pagination, and status filters |
| **POST** | `/api/preorders` | `{ name, products, preorderWhen, startsAt, endsAt, isActive }` | Create a new preorder campaign |
| **GET** | `/api/preorders/:id` | None | Retrieve a single preorder by ID |
| **PATCH** | `/api/preorders/:id` | `{ name?, products?, preorderWhen?, startsAt?, endsAt?, isActive? }` | Modify fields or toggle `isActive` state |
| **DELETE** | `/api/preorders/:id` | None | Permanently delete a preorder campaign |

---

## 📂 Folder Structure

```
preorder-manager/
├── app/
│   ├── page.tsx                   ← Preorder List Page (Dashboard)
│   ├── layout.tsx                 ← Root Layout (fonts, global styles & SEO metadata)
│   ├── globals.css                ← Tailwind config and Radix overrides
│   ├── preorders/
│   │   ├── new/
│   │   │   └── page.tsx           ← Create Preorder Page
│   │   └── [id]/
│   │       └── edit/
│   │           └── page.tsx       ← Edit Preorder Page (Prefilled)
│   └── api/
│       └── preorders/
│           ├── route.ts           ← GET (list) & POST (create) handler
│           └── [id]/
│               └── route.ts       ← GET, PATCH & DELETE handlers
├── components/
│   ├── PreorderTable.tsx          ← Table component (checkboxes, status toggles)
│   ├── PreorderFilters.tsx        ← Tab selectors (All / Active / Inactive)
│   ├── SortDropdown.tsx           ← Overlay with sort settings and ascending/descending
│   ├── Pagination.tsx             ← Pagination controls
│   └── PreorderForm.tsx           ← Reusable create/edit form
├── lib/
│   └── prisma.ts                  ← Singleton database client using driver adapters
├── prisma/
│   ├── schema.prisma              ← Data models definitions
│   ├── seed.ts                    ← Seeding database script (8 preorders)
│   └── migrations/                ← Database migration files
├── prisma.config.ts               ← Prisma 7 configuration file (schema path, URL, seed)
└── .env                           ← Environment configuration file
```

---

## 🚀 Local Installation & Setup

Follow these steps to run the application locally on your machine:

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd preorder-manager
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup the database & seed sample records
Prisma 7 utilizes connection parameters defined in the root `prisma.config.ts`. Execute the migration command to construct the database schema, then seed the 8 sample preorder campaigns:
```bash
npx prisma migrate dev --name init
npx prisma db seed
```

### 4. Run the development server
Start the hot-reloading local web server:
```bash
npm run dev
```

### 5. Access the app
Open your browser and navigate to **[http://localhost:3000](http://localhost:3000)**.
