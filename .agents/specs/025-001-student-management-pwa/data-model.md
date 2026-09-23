# Data Model Specifications

## Student Entity
```json
{
  "id": "HS2026-889",
  "name": "Nguyễn Văn An",
  "class": "12A1",
  "school": "THPT Chuyên KHTN",
  "academicYear": "2025-2026",
  "homeroomTeacher": "Thầy Lê Hoàng Nam"
}
```

## Attendance Log Entity
```json
{
  "date": "2026-02-18",
  "month": "02",
  "status": "PRESENT | ABSENT_PERMISSION | ABSENT_NO_PERMISSION",
  "note": "Có mặt đúng giờ"
}
```

## Grade Subject Entity
```json
{
  "subjectCode": "MATH",
  "subjectName": "Toán Học",
  "hk1": {
    "regular": [9.0, 9.5, 8.5],
    "midterm": 9.0,
    "final": 9.2,
    "gpa": 9.1
  },
  "hk2": {
    "regular": [9.5, 10.0, 9.0],
    "midterm": 9.5,
    "final": 9.5,
    "gpa": 9.5
  },
  "annualGpa": 9.37
}
```
