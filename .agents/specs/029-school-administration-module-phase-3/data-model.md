# Data Model: School Administration Module Phase 3

> Feature ID: `029-school-administration-module-phase-3`  

---

## 1. Entity Definitions

### 1.1 Feedback Ticket (`FeedbackTicket`)
- `id`: string (UUID)
- `schoolCode`: string
- `academicYearId`: string (FK -> AcademicYear)
- `title`: string
- `content`: string
- `category`: 'noi_dung' | 'hinh_thuc' | 'chat_luong' | 'ky_nang' | 'thai_do' | 'quy_trinh' | 'trai_nghiem' | 'chien_luoc'
- `status`: 'yeu_cau_moi' | 'dang_xu_ly' | 'hoan_tat' | 'mo_lai'
- `priority`: 'thap' | 'trung_binh' | 'cao' | 'khan_cap'
- `studentId`: string (FK -> Student)
- `studentName`: string
- `classId`: string (FK -> Class)
- `className`: string
- `parentId`: string (FK -> Parent)
- `parentName`: string
- `parentEmail`: string
- `assignedHandlerId`: string | null (FK -> Teacher/Staff)
- `assignedHandlerName`: string | null
- `waitingOn`: 'parent' | 'school'
- `discussions`: DiscussionMessage[]
- `createdAt`: string (ISO datetime)
- `updatedAt`: string (ISO datetime)

### 1.2 Discussion Message (`DiscussionMessage`)
- `id`: string (UUID)
- `authorId`: string
- `authorName`: string
- `authorRole`: 'admin' | 'parent' | 'teacher'
- `content`: string
- `imageUrls`: string[]
- `createdAt`: string (ISO datetime)

### 1.3 School Event (`SchoolEvent`)
- `id`: string (UUID)
- `schoolCode`: string
- `title`: string
- `startDate`: string (YYYY-MM-DD)
- `endDate`: string (YYYY-MM-DD)
- `category`: 'holiday' | 'internal' | 'parent_invited'
- `location`: string | null
- `descriptionHtml`: string | null
- `avatarUrl`: string | null
- `attachmentUrls`: string[]
- `createdAt`: string (ISO datetime)

### 1.4 Academic Year (`AcademicYearRecord`)
- `id`: string (UUID)
- `schoolCode`: string
- `name`: string (e.g., "Năm học 2026 - 2027", "Kỳ 1 2026 - 2027")
- `startDate`: string (YYYY-MM-DD)
- `endDate`: string (YYYY-MM-DD)
- `isCurrent`: boolean (dynamically computed based on system date)
- `createdAt`: string (ISO datetime)

### 1.5 Archived Student (`ArchivedStudentRecord`)
- `id`: string (UUID, studentId)
- `studentCode`: string
- `fullName`: string
- `nickname`: string
- `formerClassId`: string
- `formerClassName`: string
- `archivedDate`: string (YYYY-MM-DD)
- `archivedByStaffId`: string
- `archivedByStaffName`: string
- `reason`: string
- `notes`: string | null
- `avatarUrl`: string | null
