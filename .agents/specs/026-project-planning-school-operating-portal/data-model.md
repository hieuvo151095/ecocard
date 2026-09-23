# Data Model Specification: School Operating Portal

> Feature ID: `026-project-planning-school-operating-portal`  
> Governance: Marcus Fleet V34 Enterprise Architecture

---

## 1. Core Organizational Entities

### 1.1 `School` (Tenant Root)
- `id`: UUID (Primary Key)
- `school_code`: VARCHAR(50) (Unique, Tenant Identifier e.g. `demo`)
- `name`: VARCHAR(255) (e.g., `Trường THCS Demo Soha`)
- `brand_partner`: VARCHAR(50) (White-label branding config `APP_PARTNER`)
- `settings`: JSONB (School hours, attendance cutoff time, payment gateway credentials)
- `created_at`: TIMESTAMP

### 1.2 `Class`
- `id`: UUID (Primary Key)
- `school_id`: UUID (Foreign Key -> School)
- `name`: VARCHAR(100) (e.g., `Lớp 6A1`)
- `grade_level`: INT (e.g., `6`, `7`, `8`, `9`)
- `homeroom_teacher_id`: UUID (Foreign Key -> User)
- `academic_year`: VARCHAR(20) (e.g., `2025-2026`)

### 1.3 `Student`
- `id`: UUID (Primary Key)
- `school_id`: UUID (Foreign Key -> School)
- `class_id`: UUID (Foreign Key -> Class)
- `student_code`: VARCHAR(50) (e.g., `HS2026001`)
- `full_name`: VARCHAR(255)
- `date_of_birth`: DATE
- `gender`: VARCHAR(10)
- `status`: VARCHAR(20) (`active`, `transferred`, `withdrawn`)

### 1.4 `Guardian`
- `id`: UUID (Primary Key)
- `student_id`: UUID (Foreign Key -> Student)
- `full_name`: VARCHAR(255)
- `relationship`: VARCHAR(50) (`father`, `mother`, `relative`)
- `phone_number`: VARCHAR(20)
- `is_authorized_pickup`: BOOLEAN

---

## 2. Module 1: Vận Hành (Operations) Entities

### 2.1 `AttendanceRecord`
- `id`: UUID (Primary Key)
- `school_id`: UUID (Foreign Key -> School)
- `class_id`: UUID (Foreign Key -> Class)
- `student_id`: UUID (Foreign Key -> Student)
- `date`: DATE
- `arrival_time`: TIME (nullable)
- `departure_time`: TIME (nullable)
- `status`: VARCHAR(20) (`present`, `excused_absent`, `unexcused_absent`, `unmarked`)
- `is_late`: BOOLEAN (True if arrival_time > school opening threshold)
- `temperature`: DECIMAL(3,1) (e.g., `37.0`)
- `health_condition`: VARCHAR(50) (`Bình thường`, `Cảm sốt`, `Sốt cao`, etc.)
- `notes`: TEXT
- `pickup_guardian_id`: UUID (Foreign Key -> Guardian, nullable)
- `refund_eligible`: BOOLEAN (True if excused absence is approved for meal refund)

### 2.2 `ActivityPost`
- `id`: UUID (Primary Key)
- `school_id`: UUID (Foreign Key -> School)
- `class_id`: UUID (Foreign Key -> Class)
- `author_id`: UUID (Foreign Key -> User)
- `content`: TEXT
- `audience_scope`: VARCHAR(20) (`class`, `school`, `multi_class`)
- `approval_status`: VARCHAR(20) (`pending_review`, `approved`, `rejected`)
- `pinned`: BOOLEAN
- `created_at`: TIMESTAMP

### 2.3 `MediaAlbum` & `MediaItem`
- `id`: UUID (Primary Key)
- `class_id`: UUID (Foreign Key -> Class)
- `name`: VARCHAR(255)
- `type`: VARCHAR(20) (`system_activity`, `system_attendance`, `custom`)
- `MediaItem`: `id`, `album_id`, `file_url`, `media_type` (`photo`, `video`), `uploaded_at`

### 2.4 `FaceTag`
- `id`: UUID (Primary Key)
- `media_item_id`: UUID (Foreign Key -> MediaItem)
- `student_id`: UUID (Foreign Key -> Student)
- `bounding_box`: JSONB (`x`, `y`, `width`, `height`)
- `confidence_score`: FLOAT
- `verification_status`: VARCHAR(20) (`auto_detected`, `teacher_confirmed`)

---

## 3. Module 2: Học Tập (Academics) Entities

### 3.1 `TimetablePeriod`
- `id`: UUID (Primary Key)
- `class_id`: UUID (Foreign Key -> Class)
- `day_of_week`: INT (2 = Thứ 2, ..., 7 = Thứ 7)
- `period_number`: INT (1 to 9)
- `subject_name`: VARCHAR(100)
- `teacher_id`: UUID (Foreign Key -> User)
- `room`: VARCHAR(50)
- `version`: INT

### 3.2 `Assignment` & `Submission`
- `Assignment`: `id`, `class_id`, `subject_name`, `title`, `description`, `due_date`, `attachment_url`
- `Submission`: `id`, `assignment_id`, `student_id`, `status` (`submitted`, `missing`, `late`), `submitted_at`, `score`, `teacher_notes`

### 3.3 `GradebookEntry`
- `id`: UUID (Primary Key)
- `student_id`: UUID (Foreign Key -> Student)
- `class_id`: UUID (Foreign Key -> Class)
- `subject_name`: VARCHAR(100)
- `semester`: VARCHAR(20) (`semester_1`, `semester_2`, `full_year`)
- `oral_score`: DECIMAL(3,1)
- `test_15m_score`: DECIMAL(3,1)
- `test_1period_score`: DECIMAL(3,1)
- `midterm_score`: DECIMAL(3,1)
- `final_score`: DECIMAL(3,1)
- `average_score`: DECIMAL(3,1)

---

## 4. Module 3: Tài Chính (Finance) Entities

### 4.1 `FeeCatalogItem`
- `id`: UUID (Primary Key)
- `school_id`: UUID (Foreign Key -> School)
- `name`: VARCHAR(255) (e.g., `Học phí cơ bản`, `Tiền ăn trưa`, `Xe đưa đón`)
- `fee_type`: VARCHAR(20) (`mandatory`, `voluntary`)
- `period`: VARCHAR(20) (`monthly`, `term`, `yearly`, `one_time`)
- `standard_price`: DECIMAL(12,2)

### 4.2 `ClassFeeSchedule`
- `id`: UUID (Primary Key)
- `class_id`: UUID (Foreign Key -> Class)
- `fee_catalog_item_id`: UUID (Foreign Key -> FeeCatalogItem)
- `price_override`: DECIMAL(12,2)

### 4.3 `Invoice` & `InvoiceItem`
- `Invoice`: `id`, `student_id`, `invoice_number`, `billing_month`, `total_amount`, `paid_amount`, `meal_deduction_amount`, `payment_status` (`created`, `sent`, `partially_paid`, `paid`, `overdue`, `cancelled`), `vietqr_string`, `due_date`
- `InvoiceItem`: `id`, `invoice_id`, `fee_catalog_item_id`, `item_name`, `unit_price`, `quantity`, `discount_amount`, `final_amount`

### 4.4 `ExpenseVoucher`
- `id`: UUID (Primary Key)
- `school_id`: UUID (Foreign Key -> School)
- `voucher_code`: VARCHAR(50) (e.g., `PC2026-001`)
- `category`: VARCHAR(100)
- `recipient`: VARCHAR(255)
- `amount`: DECIMAL(12,2)
- `disbursement_date`: DATE
- `status`: VARCHAR(20) (`pending_approval`, `approved`, `disbursed`, `cancelled`)
- `cancellation_reason`: TEXT

### 4.5 `ReconciliationSession`
- `id`: UUID (Primary Key)
- `school_id`: UUID (Foreign Key -> School)
- `session_date`: DATE
- `total_transactions`: INT
- `total_received_amount`: DECIMAL(12,2)
- `gateway_fee_amount`: DECIMAL(12,2)
- `net_reconciled_amount`: DECIMAL(12,2)
- `status`: VARCHAR(20) (`balanced`, `discrepancy_detected`)
