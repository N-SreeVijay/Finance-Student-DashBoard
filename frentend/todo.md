# Fee Management System MVP - Frontend Implementation

## Core Files to Create/Modify:

### 1. **src/types/index.ts** - TypeScript interfaces
- Student, Transaction, Challan, Scholarship, Notification types
- Mock data structures

### 2. **src/data/mockData.ts** - Mock data
- Sample student profile
- Fee structure and bank details
- Transaction history
- Notifications

### 3. **src/components/Layout/Sidebar.tsx** - Navigation sidebar
- Student menu items (Dashboard, Profile, Bank Info, Upload, Scholarship, Transactions, Notifications)

### 4. **src/components/Layout/Header.tsx** - Top navigation
- User info, logout button

### 5. **src/pages/Dashboard.tsx** - Main dashboard
- Fee overview cards
- Progress bars for paid/pending fees
- Quick stats

### 6. **src/pages/Profile.tsx** - Student profile management
- Edit personal information form
- Save changes (mock functionality)

### 7. **src/pages/BankInfo.tsx** - Bank and fee information
- Static display of bank details
- Fee structure table

### 8. **src/pages/ChallanUpload.tsx** - Challan upload system
- File upload component
- OCR placeholder functionality
- Manual entry fallback form
- Preview uploaded challan

## Implementation Strategy:
- Use shadcn/ui components for consistent UI
- Implement responsive design with Tailwind CSS
- Mock all data interactions
- Focus on user experience and visual design
- Prepare structure for easy backend integration later

## Key Features:
- Role-based navigation (Student focus for MVP)
- File upload with preview
- Form validation
- Responsive tables and cards
- Progress indicators
- Mock OCR processing simulation