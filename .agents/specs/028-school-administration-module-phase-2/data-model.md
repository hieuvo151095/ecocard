# Data Model Specification: School Administration Module Phase 2

**Feature ID:** `028-school-administration-module-phase-2`  
**Status:** DRAFT (Planning Genesis Mode — No Code Generated)

---

## 1. Domain Entities & TypeScript Contracts

### 1.1 Bảng Thông Tin (Announcement Board)

```typescript
export type AnnouncementStatus = 'ban_nhap' | 'chua_gui' | 'da_gui';
export type AnnouncementChannel = 'app' | 'email' | 'app_and_email';
export type AnnouncementCategory = 
  | 'thong_bao_chung'
  | 'ke_hoach_hoc_tap'
  | 'thuc_don'
  | 'su_kien'
  | 'lich_nghi'
  | 'thoi_khoa_bieu';

export type AnnouncementAudienceType = 
  | 'toan_truong'
  | 'toan_bo_giao_vien'
  | 'toan_bo_phu_huynh'
  | 'lop_hoc'
  | 'ca_nhan';

export type ClassRecipientFilter = 'all' | 'teachers_only' | 'parents_only';

export interface AnnouncementAttachment {
  id: string;
  name: string;
  url: string;
  sizeBytes: number;
  mimeType: string;
}

export interface Announcement {
  id: string;
  schoolCode: string;
  title: string;
  contentHtml: string;
  category: AnnouncementCategory;
  channel: AnnouncementChannel;
  audienceType: AnnouncementAudienceType;
  targetClassIds?: string[];
  classRecipientFilter?: ClassRecipientFilter;
  targetIndividualIds?: string[];
  includeFutureAccounts: boolean;
  status: AnnouncementStatus;
  scheduledAt?: string; // ISO 8601
  sentAt?: string;      // ISO 8601
  viewCount: number;
  attachments: AnnouncementAttachment[];
  authorId: string;
  authorName: string;
  linkedMenuId?: string; // Reference if spawned by menu publish
  createdAt: string;
  updatedAt: string;
}
```

---

### 1.2 Bình Chọn (Polls & Surveys)

```typescript
export type PollStatus = 'da_tao' | 'da_gui' | 'da_dong';

export interface PollOption {
  id: string;
  text: string;
  voteCount: number;
  percentage: number;
}

export interface StudentVoteRecord {
  studentId: string;
  studentName: string;
  classId: string;
  className: string;
  selectedOptionIds: string[];
  votedAt?: string;
  hasVoted: boolean;
  history: Array<{
    optionIds: string[];
    changedAt: string;
  }>;
}

export interface Poll {
  id: string;
  schoolCode: string;
  title: string;
  description: string;
  coverImageUrl?: string;
  deadlineAt: string; // ISO 8601
  options: PollOption[];
  allowMultipleChoices: boolean;
  resultsVisibleToParents: boolean;
  status: PollStatus;
  targetAudience: 'toan_truong' | 'lop_hoc';
  targetClassIds?: string[];
  totalVotes: number;
  roster: StudentVoteRecord[];
  createdAt: string;
  updatedAt: string;
}
```

---

### 1.3 Thực Đơn (Weekly Meal Menus)

```typescript
export type MenuFormat = 'grid' | 'file';
export type MenuStatus = 'ban_nhap' | 'da_xuat_ban';
export type MealType = 'an_sang' | 'an_trua' | 'an_xe';
export type DayOfWeek = 'thu_2' | 'thu_3' | 'thu_4' | 'thu_5' | 'thu_6' | 'thu_7';
export type TraceabilityStatus = 'dat_chuan' | 'chua_truy_xuat';

export interface FoodIngredient {
  id: string;
  name: string;
  gtin?: string;
  lotNumber?: string;
  internalStampCode?: string;
  supplierName?: string;
  traceabilityStatus: TraceabilityStatus;
}

export interface DishItem {
  id: string;
  name: string;
  ingredients: FoodIngredient[];
}

export interface MenuGridCell {
  dayOfWeek: DayOfWeek;
  mealType: MealType;
  dishes: DishItem[];
}

export interface MenuSendHistoryEntry {
  id: string;
  sentAt: string;
  sentBy: string;
  mode: 'gui_thong_bao' | 'chi_xuat_ban';
  linkedAnnouncementId?: string;
}

export interface WeeklyMenu {
  id: string;
  schoolCode: string;
  weekNumber: number; // e.g. Week 38
  startDate: string;  // YYYY-MM-DD
  endDate: string;    // YYYY-MM-DD
  targetType: 'toan_truong' | 'lop_hoc';
  targetClassIds?: string[];
  format: MenuFormat;
  status: MenuStatus;
  gridCells?: MenuGridCell[]; // Present if format === 'grid'
  fileAttachment?: {
    url: string;
    name: string;
    sizeBytes: number;
  };                          // Present if format === 'file'
  publishedViaAnnouncement: boolean;
  sendHistory: MenuSendHistoryEntry[];
  createdAt: string;
  updatedAt: string;
}
```

---

### 1.4 Điểm Danh NV (Staff Attendance)

```typescript
export type StaffRole = 'admin' | 'quan_ly' | 'giao_vien' | 'nhan_vien';
export type StaffAttendanceStatus = 'present' | 'absent_excused' | 'absent_unexcused' | 'unmarked';

export interface StaffMember {
  id: string;
  schoolCode: string;
  staffCode?: string;
  fullName: string;
  displayName: string;
  avatarUrl?: string;
  roles: StaffRole[];
  assignedClassIds?: string[]; // Classes managed or taught
  email: string;
  phone?: string;
  birthDate?: string;
  address?: string;
  verified: boolean;
}

export interface StaffDailyAttendanceRecord {
  id: string;
  staffId: string;
  staff: StaffMember;
  date: string; // YYYY-MM-DD
  checkInTime?: string;  // HH:mm
  checkOutTime?: string; // HH:mm
  attendanceStatus: StaffAttendanceStatus;
  absenceNote?: string;
  generalNote?: string;
  recordedBy: string;
  recordedAt: string;
  updatedAt: string;
}

export interface StaffAttendanceSummary {
  date: string;
  totalStaff: number;
  presentCount: number;
  excusedCount: number;
  unexcusedCount: number;
}
```

---

### 1.5 Sổ Tay PH (Parent Handbook)

```typescript
export type ArticleStatus = 'ban_nhap' | 'da_phat_hanh';

export interface HandbookAttachment {
  id: string;
  name: string;
  url: string;
  sizeBytes: number;
}

export interface HandbookArticle {
  id: string;
  categoryId: string;
  title: string;
  contentHtml: string;
  status: ArticleStatus;
  sortOrder: number;
  attachments: HandbookAttachment[];
  publishedAt?: string;
  authorName: string;
  createdAt: string;
  updatedAt: string;
}

export interface HandbookCategory {
  id: string;
  schoolCode: string;
  name: string;
  description?: string;
  parentId?: string; // Null if Root Category, string if Sub-Category (Tier 2)
  sortOrder: number;
  subCategories?: HandbookCategory[];
  articles: HandbookArticle[];
  createdAt: string;
  updatedAt: string;
}
```

---

## 2. Redux State Slice Contracts

```typescript
export interface SchoolAdminPhase2State {
  announcements: {
    items: Announcement[];
    selectedId: string | null;
    filter: {
      status?: AnnouncementStatus;
      category?: AnnouncementCategory;
      searchQuery: string;
    };
    loading: boolean;
  };
  polls: {
    items: Poll[];
    selectedId: string | null;
    filter: {
      status?: PollStatus;
      classId?: string;
      searchQuery: string;
    };
    loading: boolean;
  };
  menus: {
    items: WeeklyMenu[];
    selectedId: string | null;
    filter: {
      classId?: string;
      month?: string;
      format?: MenuFormat;
      searchQuery: string;
    };
    loading: boolean;
  };
  staffAttendance: {
    date: string; // Selected date (YYYY-MM-DD)
    records: StaffDailyAttendanceRecord[];
    summary: StaffAttendanceSummary;
    filter: {
      classId?: string;
      role?: StaffRole;
      searchQuery: string;
      sortDirection: 'asc' | 'desc';
    };
    loading: boolean;
  };
  handbook: {
    categories: HandbookCategory[];
    activeCategoryId: string | null;
    selectedArticleId: string | null;
    filter: {
      status?: ArticleStatus;
      searchQuery: string;
    };
    loading: boolean;
  };
}
```
