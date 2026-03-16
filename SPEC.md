# Seduulur Alumni Website - Specification Document

## 1. Project Overview

**Project Name:** Seduulur Alumni Website  
**Type:** Alumni Management Web Application  
**Core Functionality:** A comprehensive alumni platform with gallery, kas (dues) payment management, agenda/events, and AI-powered WhatsApp reminders for unpaid dues.  
**Target Users:** Alumni members, administrators (minimum 5 users), and visitors

---

## 2. UI/UX Specification

### 2.1 Layout Structure

**Pages:**
1. **Home/Landing Page** - Hero section, agenda display, quick stats, navigation
2. **Gallery Page** - Photo gallery with lightbox
3. **Payments Page** - Payment history and submission
4. **Login Page** - Authentication portal
5. **Admin Dashboard** - Full management interface

**Responsive Breakpoints:**
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

### 2.2 Visual Design

**Color Palette:**
- Primary: `#1a1a2e` (Deep Navy)
- Secondary: `#16213e` (Dark Blue)
- Accent: `#e94560` (Coral Red)
- Success: `#00d9a5` (Mint Green)
- Warning: `#ffc93c` (Golden Yellow)
- Text Primary: `#ffffff`
- Text Secondary: `#a0a0a0`
- Background: `#0f0f1a` (Near Black)
- Card Background: `#1e1e32`

**Typography:**
- Headings: 'Outfit', sans-serif (Google Fonts)
- Body: 'Plus Jakarta Sans', sans-serif (Google Fonts)
- Sizes: H1: 3.5rem, H2: 2.5rem, H3: 1.75rem, Body: 1rem

**Spacing System:**
- Base unit: 8px
- Sections: 80px padding
- Cards: 24px padding
- Elements: 16px gap

**Visual Effects:**
- Glassmorphism cards with backdrop-filter
- Gradient overlays on hero
- Smooth hover transitions (0.3s ease)
- Parallax scrolling effects
- Animated counters
- Staggered reveal animations on scroll

### 2.3 Components

**Navigation:**
- Fixed top navbar with glass effect
- Logo on left, menu items on right
- Mobile hamburger menu
- Active state indicator

**Hero Section:**
- Full viewport height
- Animated gradient background
- Floating particles effect
- Call-to-action buttons

**Cards:**
- Glassmorphism style
- Hover lift effect (transform: translateY(-8px))
- Subtle glow on hover

**Buttons:**
- Primary: Coral red with glow effect
- Secondary: Outline style
- Hover: Scale(1.05) with shadow

**Forms:**
- Floating labels
- Focus glow effect
- Validation feedback

**Tables (Admin):**
- Striped rows
- Hover highlight
- Sortable columns
- Pagination

---

## 3. Functionality Specification

### 3.1 Authentication

**Login Credentials:**
- Username: `SEDUULURALUMNI`
- Password: `alumni123`
- Support for 5+ admin users
- Session management with localStorage
- Auto-logout after inactivity

### 3.2 Features

**Public Pages:**
1. **Home Page**
   - Welcome hero with animated text
   - Upcoming agendas displayed prominently
   - Quick statistics (total alumni, total payments, events)
   - Recent gallery preview

2. **Gallery Page**
   - Grid layout with masonry effect
   - Lightbox modal for full view
   - Category filtering
   - Upload functionality for admins

3. **Payment Page**
   - Payment submission form
   - Payment history table
   - Monthly payment status
   - Download receipt option

**Admin Dashboard:**
1. **Overview Panel**
   - Total alumni count
   - Monthly income chart
   - Payment compliance rate
   - Recent activities

2. **Alumni Management**
   - Add/Edit/Delete alumni
   - View alumni details
   - Search and filter

3. **Payment Management**
   - View all payments
   - Input manual payments
   - Monthly/Yearly reports
   - Export to CSV

4. **Agenda Management**
   - Create/Edit/Delete events
   - Set date, time, location
   - Mark as active/upcoming

5. **AI WhatsApp Reminder**
   - List of users with unpaid dues
   - One-click WhatsApp reminder
   - AI-generated reminder message
   - Auto-fetch phone from alumni data

### 3.3 AI WhatsApp Feature

**How it works:**
1. Admin selects month/year with unpaid alumni
2. AI generates polite reminder message
3. System opens WhatsApp with pre-filled message
4. Message includes: Name, Amount Due, Due Date, Payment Link

**Message Template:**
```
Halo [Nama Alumni]! 👋

Saya dari Tim Seduulur Alumni ingin mengingatkan bahwa iuran kas bulan [Bulan] sebesar Rp [Jumlah] belum kami terima. 

Bantuan Anda sangat berarti untuk keberlangsungan acara-alumni kita. 

Silakan melakukan pembayaran melalui:
[Payment Info]

Terima kasih atas perhatiannya! 🙏

Salam hangat,
Tim Seduulur Alumni
```

### 3.4 Data Structure

**Alumni:**
```json
{
  "id": "string",
  "name": "string",
  "email": "string",
  "phone": "string",
  "graduationYear": "number",
  "major": "string",
  "address": "string",
  "photo": "string",
  "joinDate": "date"
}
```

**Payments:**
```json
{
  "id": "string",
  "alumniId": "string",
  "amount": "number",
  "month": "string",
  "year": "number",
  "paymentDate": "date",
  "paymentMethod": "string",
  "status": "paid/pending",
  "receipt": "string"
}
```

**Agendas:**
```json
{
  "id": "string",
  "title": "string",
  "description": "string",
  "date": "date",
  "time": "string",
  "location": "string",
  "type": "monthly/yearly",
  "image": "string",
  "active": "boolean"
}
```

---

## 4. Technical Implementation

**Stack:**
- HTML5
- CSS3 (Custom properties, animations, flexbox, grid)
- JavaScript (ES6+)
- LocalStorage for data persistence
- No external frameworks (vanilla JS)

**Database:**
- JSON-based with LocalStorage
- Pre-seeded with sample data

**External Resources:**
- Google Fonts (Outfit, Plus Jakarta Sans)
- Font Awesome 6 (icons)
- Unsplash (placeholder images)

---

## 5. Acceptance Criteria

1. ✅ Website loads without errors
2. ✅ Login works with provided credentials
3. ✅ Admin dashboard accessible after login
4. ✅ Gallery displays images with lightbox
5. ✅ Payment form submits and saves data
6. ✅ Agenda displays on homepage and agenda page
7. ✅ AI WhatsApp feature opens with correct message
8. ✅ Responsive on all devices
9. ✅ Animations smooth and performant
10. ✅ At least 5 admin accounts supported
