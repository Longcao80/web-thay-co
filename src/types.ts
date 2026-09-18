export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';

export type LessonCategory = 'Đọc hiểu' | 'Văn học' | 'Tiếng Việt' | 'Viết' | 'Nói và nghe';

export type AssignmentStatus = 'Đang thực hiện' | 'Sắp hết hạn' | 'Đã hoàn thành';

export type StudentStatus = 'Tích cực' | 'Đang tiến bộ' | 'Cần cố gắng';

export interface ClassItem {
  id: string;
  name: string;
  gradeLevel: number;
  room: string;
  academicYear: string;
  totalStudents: number;
  teacher: string;
  note?: string;
}

export interface Student {
  id: string;
  studentCode: string;
  fullName: string;
  classId: string;
  className: string;
  gender: 'Nam' | 'Nữ';
  birthDate: string;
  parentPhone: string;
  status: StudentStatus;
  notes?: string;
}

export interface AttendanceRecord {
  id: string;
  date: string; // YYYY-MM-DD
  classId: string;
  studentId: string;
  status: AttendanceStatus;
  note?: string;
}

export interface Lesson {
  id: string;
  title: string;
  gradeLevel: number;
  topic: string;
  category: LessonCategory;
  date: string;
  durationMinutes: number;
  objectives: string;
  mainContent: string;
  notes: string;
}

export interface AssignmentSubmission {
  submitted: boolean;
  submittedDate?: string;
  score?: number;
  feedback?: string;
}

export interface Assignment {
  id: string;
  title: string;
  classId: string;
  className: string;
  requirements: string;
  assignedDate: string;
  dueDate: string;
  status: AssignmentStatus;
  submissions: Record<string, AssignmentSubmission>; // key is studentId
}

export interface StudentGrade {
  studentId: string;
  regularScores: (number | null)[]; // Điểm thường xuyên
  midtermScore: number | null; // Điểm giữa kỳ
  finalScore: number | null; // Điểm cuối kỳ
  note?: string;
}

export interface GradeFormulaConfig {
  regularWeight: number; // Mặc định 1
  midtermWeight: number; // Mặc định 2
  finalWeight: number; // Mặc định 3
  description?: string;
}

export type GradeFormula = GradeFormulaConfig;

export interface TeacherProfile {
  name: string;
  subject: string;
  school: string;
  email?: string;
  phone?: string;
}

export interface TeacherComment {
  id: string;
  studentId: string;
  studentName: string;
  classId?: string;
  className?: string;
  content: string;
  date: string;
  author?: string;
  tags?: string[];
}

export type StudentComment = TeacherComment;

export interface ActivityLog {
  id: string;
  action: string;
  timestamp: string;
  type: 'grade' | 'assignment' | 'attendance' | 'comment' | 'class' | 'student' | 'general';
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  type: 'warning' | 'info' | 'success';
}

export interface AppData {
  classes: ClassItem[];
  students: Student[];
  attendance: AttendanceRecord[];
  lessons: Lesson[];
  assignments: Assignment[];
  grades: Record<string, StudentGrade>; // key is studentId
  comments: TeacherComment[];
  activityLogs: ActivityLog[];
  notifications: NotificationItem[];
  gradeFormula: GradeFormulaConfig;
  teacherProfile: TeacherProfile;
  soundEnabled: boolean;
}
