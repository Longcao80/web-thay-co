import { useState, useEffect, useCallback } from 'react';
import { AppData, Student, ClassItem, Lesson, Assignment, AttendanceRecord, StudentGrade, GradeFormula, TeacherComment, TeacherProfile } from './types';
import { initialDemoData } from './demoData';
import { loadDataFromStorage, saveDataToStorage, clearStorage } from './utils/storage';
import { playTone } from './utils/audio';

// Components
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { QuickSearchModal } from './components/QuickSearchModal';
import { Toast } from './components/Toast';
import { ConfirmModal } from './components/ConfirmModal';

// Views
import { DashboardView } from './views/DashboardView';
import { ClassesView } from './views/ClassesView';
import { StudentsView } from './views/StudentsView';
import { AttendanceView } from './views/AttendanceView';
import { LessonsView } from './views/LessonsView';
import { AssignmentsView } from './views/AssignmentsView';
import { GradesView } from './views/GradesView';
import { CommentsView } from './views/CommentsView';
import { ProgressView } from './views/ProgressView';
import { SettingsView } from './views/SettingsView';

const TAB_META: Record<string, { title: string; subtitle: string }> = {
  dashboard: { title: 'Tổng quan học tập', subtitle: 'Báo cáo tổng hợp số liệu giảng dạy môn Toán' },
  classes: { title: 'Quản lý lớp học', subtitle: 'Danh sách các lớp giảng dạy và phân bổ học sinh' },
  students: { title: 'Hồ sơ học sinh', subtitle: 'Thông tin cá nhân, liên hệ phụ huynh và quá trình học tập' },
  attendance: { title: 'Sổ điểm danh chuyên cần', subtitle: 'Theo dõi sự có mặt, nghỉ học có phép, không phép' },
  lessons: { title: 'Quản lý bài học & Giáo án', subtitle: 'Kế hoạch bài giảng các phân môn Toán học' },
  assignments: { title: 'Giao & Chấm bài tập', subtitle: 'Theo dõi tiến độ làm bài và phản hồi nhận xét học sinh' },
  grades: { title: 'Sổ điểm điện tử', subtitle: 'Quản lý điểm thường xuyên, giữa kỳ, cuối kỳ môn Toán' },
  comments: { title: 'Sổ nhận xét học sinh', subtitle: 'Ghi chú đánh giá năng lực, phẩm chất và lời khen' },
  progress: { title: 'Theo dõi tiến độ học tập', subtitle: 'Đánh giá xu hướng tiến bộ và chỉ số chuyên cần' },
  settings: { title: 'Cài đặt hệ thống', subtitle: 'Hồ sơ giáo viên, công thức điểm, sao lưu và xuất file độc lập' },
};

export default function App() {
  const [appData, setAppData] = useState<AppData>(() => loadDataFromStorage());
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeProfileStudent, setActiveProfileStudent] = useState<Student | null>(null);

  // Audio effect state
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    return localStorage.getItem('VAN_HOC_HUB_SOUND') !== 'false';
  });

  // Toast Notification
  const [toast, setToast] = useState<{
    message: string | null;
    type: 'success' | 'warning' | 'info';
  }>({
    message: null,
    type: 'success',
  });

  const showToast = useCallback((message: string, type: 'success' | 'warning' | 'info' = 'success') => {
    setToast({ message, type });
    if (soundEnabled) {
      if (type === 'success') playTone('success', soundEnabled);
      else if (type === 'warning') playTone('delete', soundEnabled);
      else playTone('click', soundEnabled);
    }
  }, [soundEnabled]);

  // Confirm Modal state
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  const openConfirmModal = useCallback((opts: {
    title: string;
    message: string;
    onConfirm: () => void;
  }) => {
    setConfirmModal({
      isOpen: true,
      title: opts.title,
      message: opts.message,
      onConfirm: opts.onConfirm,
    });
  }, []);

  // Update AppData and sync to storage
  const updateAppData = (updater: (prev: AppData) => AppData, activityLog?: string) => {
    setAppData((prev) => {
      const updated = updater(prev);
      if (activityLog) {
        const newLog = {
          id: `act-${Date.now()}`,
          timestamp: 'Vừa xong',
          action: activityLog,
          type: 'general' as const,
        };
        updated.activityLogs = [newLog, ...(updated.activityLogs || []).slice(0, 19)];
      }
      saveDataToStorage(updated);
      return updated;
    });
  };

  // Keyboard shortcut Cmd/Ctrl + K for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Sound toggle
  const toggleSound = () => {
    setSoundEnabled((prev) => {
      const next = !prev;
      localStorage.setItem('VAN_HOC_HUB_SOUND', String(next));
      if (next) playTone('click', true);
      return next;
    });
  };

  // Class Actions
  const handleAddClass = (newClass: Omit<ClassItem, 'id'>) => {
    const id = `cls-${Date.now()}`;
    const item: ClassItem = { ...newClass, id };
    updateAppData(
      (prev) => ({
        ...prev,
        classes: [...prev.classes, item],
      }),
      `Đã thêm lớp học mới: Lớp ${item.name}`
    );
    showToast(`Đã tạo lớp ${item.name} thành công!`, 'success');
  };

  const handleUpdateClass = (updated: ClassItem) => {
    updateAppData(
      (prev) => ({
        ...prev,
        classes: prev.classes.map((c) => (c.id === updated.id ? updated : c)),
      }),
      `Đã cập nhật thông tin lớp: Lớp ${updated.name}`
    );
    showToast(`Đã lưu thay đổi lớp ${updated.name}!`, 'success');
  };

  const handleDeleteClass = (classId: string) => {
    const target = appData.classes.find((c) => c.id === classId);
    updateAppData(
      (prev) => ({
        ...prev,
        classes: prev.classes.filter((c) => c.id !== classId),
        students: prev.students.filter((s) => s.classId !== classId),
      }),
      `Đã xóa lớp: Lớp ${target?.name || ''}`
    );
    showToast('Đã xóa lớp học thành công!', 'info');
  };

  // Student Actions
  const handleAddStudent = (newStudent: Omit<Student, 'id'>) => {
    const id = `std-${Date.now()}`;
    const item: Student = { ...newStudent, id };
    updateAppData(
      (prev) => ({
        ...prev,
        students: [...prev.students, item],
      }),
      `Đã thêm học sinh mới: ${item.fullName} (${item.className})`
    );
    showToast(`Đã thêm học sinh ${item.fullName}!`, 'success');
  };

  const handleAddMultipleStudents = (newStudents: Omit<Student, 'id'>[]) => {
    const timestamp = Date.now();
    const createdList: Student[] = newStudents.map((s, idx) => ({
      ...s,
      id: `std-${timestamp}-${idx}`,
    }));
    updateAppData(
      (prev) => ({
        ...prev,
        students: [...prev.students, ...createdList],
      }),
      `Đã nhập danh sách ${createdList.length} học sinh từ tệp Excel/CSV`
    );
    showToast(`Đã thêm thành công ${createdList.length} học sinh từ tệp Excel!`, 'success');
  };

  const handleUpdateStudent = (updated: Student) => {
    updateAppData(
      (prev) => ({
        ...prev,
        students: prev.students.map((s) => (s.id === updated.id ? updated : s)),
      }),
      `Đã cập nhật thông tin học sinh: ${updated.fullName}`
    );
    showToast(`Đã cập nhật hồ sơ ${updated.fullName}!`, 'success');
  };

  const handleDeleteStudent = (studentId: string) => {
    const target = appData.students.find((s) => s.id === studentId);
    updateAppData(
      (prev) => {
        const nextGrades = { ...prev.grades };
        delete nextGrades[studentId];
        return {
          ...prev,
          students: prev.students.filter((s) => s.id !== studentId),
          grades: nextGrades,
        };
      },
      `Đã xóa học sinh: ${target?.fullName || ''}`
    );
    showToast('Đã xóa học sinh thành công!', 'info');
  };

  // Attendance Actions
  const handleSaveAttendance = (records: AttendanceRecord[]) => {
    updateAppData((prev) => {
      const keySet = new Set(records.map((r) => `${r.classId}_${r.date}_${r.studentId}`));
      const filteredExisting = prev.attendance.filter(
        (a) => !keySet.has(`${a.classId}_${a.date}_${a.studentId}`)
      );
      return {
        ...prev,
        attendance: [...filteredExisting, ...records],
      };
    }, `Đã lưu điểm danh lớp cho ${records.length} học sinh`);
    showToast('Đã lưu dữ liệu điểm danh thành công!', 'success');
  };

  // Lesson Actions
  const handleAddLesson = (newLesson: Omit<Lesson, 'id'>) => {
    const id = `lsn-${Date.now()}`;
    const item: Lesson = { ...newLesson, id };
    updateAppData(
      (prev) => ({
        ...prev,
        lessons: [item, ...prev.lessons],
      }),
      `Đã thêm giáo án mới: ${item.title}`
    );
    showToast(`Đã thêm bài học "${item.title}"!`, 'success');
  };

  const handleUpdateLesson = (updated: Lesson) => {
    updateAppData(
      (prev) => ({
        ...prev,
        lessons: prev.lessons.map((l) => (l.id === updated.id ? updated : l)),
      }),
      `Đã cập nhật giáo án: ${updated.title}`
    );
    showToast(`Đã lưu bài học "${updated.title}"!`, 'success');
  };

  const handleDeleteLesson = (lessonId: string) => {
    updateAppData(
      (prev) => ({
        ...prev,
        lessons: prev.lessons.filter((l) => l.id !== lessonId),
      }),
      'Đã xóa bài học'
    );
    showToast('Đã xóa bài học!', 'info');
  };

  // Assignment Actions
  const handleAddAssignment = (newAssignment: Omit<Assignment, 'id'>) => {
    const id = `asg-${Date.now()}`;
    const item: Assignment = { ...newAssignment, id };
    updateAppData(
      (prev) => ({
        ...prev,
        assignments: [item, ...prev.assignments],
      }),
      `Đã giao bài tập mới: ${item.title} cho lớp ${item.className}`
    );
    showToast(`Đã giao bài tập "${item.title}"!`, 'success');
  };

  const handleUpdateAssignment = (updated: Assignment) => {
    updateAppData(
      (prev) => ({
        ...prev,
        assignments: prev.assignments.map((a) => (a.id === updated.id ? updated : a)),
      }),
      `Đã cập nhật bài tập: ${updated.title}`
    );
    showToast(`Đã cập nhật bài tập "${updated.title}"!`, 'success');
  };

  const handleDeleteAssignment = (assignmentId: string) => {
    updateAppData(
      (prev) => ({
        ...prev,
        assignments: prev.assignments.filter((a) => a.id !== assignmentId),
      }),
      'Đã xóa bài tập'
    );
    showToast('Đã xóa bài tập!', 'info');
  };

  // Grade Actions
  const handleSaveGrades = (updatedGrades: Record<string, StudentGrade>) => {
    updateAppData(
      (prev) => ({
        ...prev,
        grades: updatedGrades,
      }),
      'Đã cập nhật bảng điểm môn Ngữ văn'
    );
    showToast('Đã lưu bảng điểm thành công!', 'success');
  };

  const handleUpdateFormula = (formula: GradeFormula) => {
    updateAppData(
      (prev) => ({
        ...prev,
        gradeFormula: formula,
      }),
      'Đã cập nhật công thức tính điểm'
    );
    showToast('Đã cập nhật công thức tính điểm!', 'success');
  };

  // Comment Actions
  const handleAddComment = (comment: Omit<TeacherComment, 'id'>) => {
    const id = `cmt-${Date.now()}`;
    const item: TeacherComment = { ...comment, id };
    updateAppData(
      (prev) => ({
        ...prev,
        comments: [item, ...prev.comments],
      }),
      `Đã ghi nhận xét cho học sinh: ${item.studentName}`
    );
    showToast(`Đã ghi nhận xét cho ${item.studentName}!`, 'success');
  };

  const handleDeleteComment = (commentId: string) => {
    updateAppData(
      (prev) => ({
        ...prev,
        comments: prev.comments.filter((c) => c.id !== commentId),
      }),
      'Đã xóa nhận xét học sinh'
    );
    showToast('Đã xóa nhận xét!', 'info');
  };

  // Notifications
  const handleMarkNotificationRead = (notifId: string) => {
    updateAppData((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) => (n.id === notifId ? { ...n, isRead: true } : n)),
    }));
  };

  const handleClearAllNotifications = () => {
    updateAppData((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) => ({ ...n, isRead: true })),
    }));
    showToast('Đã đánh dấu đã đọc tất cả thông báo!', 'info');
  };

  // Settings Actions
  const handleUpdateTeacherProfile = (profile: TeacherProfile) => {
    updateAppData((prev) => ({
      ...prev,
      teacherProfile: profile,
    }));
  };

  const handleExportJson = () => {
    const jsonStr = JSON.stringify(appData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `VanHocHub_Backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Đã xuất tệp sao lưu JSON thành công!', 'success');
  };

  const handleImportJson = (imported: AppData) => {
    setAppData(imported);
    saveDataToStorage(imported);
  };

  const handleResetDemoData = () => {
    setAppData(initialDemoData);
    saveDataToStorage(initialDemoData);
    showToast('Đã khôi phục dữ liệu mẫu ban đầu!', 'info');
  };

  const handleClearAllData = () => {
    clearStorage();
    const emptyState: AppData = {
      ...initialDemoData,
      classes: [],
      students: [],
      assignments: [],
      attendance: [],
      grades: {},
      comments: [],
      activityLogs: [
        {
          id: `act-${Date.now()}`,
          timestamp: 'Vừa xong',
          action: 'Đã xóa toàn bộ dữ liệu hệ thống',
          type: 'general',
        },
      ],
    };
    setAppData(emptyState);
    saveDataToStorage(emptyState);
    showToast('Đã xóa toàn bộ dữ liệu hệ thống!', 'warning');
  };

  // Navigation helper
  const handleNavigate = (tab: string, targetId?: string) => {
    setActiveTab(tab);
    if (tab === 'students' && targetId) {
      const found = appData.students.find((s) => s.id === targetId);
      if (found) setActiveProfileStudent(found);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentMeta = TAB_META[activeTab] || { title: 'Văn Học Hub', subtitle: 'Quản trị học tập Ngữ văn' };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans text-slate-800 antialiased selection:bg-amber-200 selection:text-slate-900">
      {/* Top Header */}
      <Header
        currentTab={activeTab}
        tabTitle={currentMeta.title}
        tabSubtitle={currentMeta.subtitle}
        notifications={appData.notifications || []}
        soundEnabled={soundEnabled}
        teacherProfile={appData.teacherProfile}
        onToggleSound={toggleSound}
        onOpenSearch={() => setIsSearchOpen(true)}
        onToggleMobileSidebar={() => setSidebarOpen((prev) => !prev)}
        onMarkNotificationRead={handleMarkNotificationRead}
        onClearAllNotifications={handleClearAllNotifications}
        onNavigateToTab={handleNavigate}
      />

      {/* Main Container */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Navigation */}
        <Sidebar
          currentTab={activeTab}
          onSelectTab={handleNavigate}
          isMobileOpen={sidebarOpen}
          onCloseMobile={() => setSidebarOpen(false)}
          teacherProfile={appData.teacherProfile}
        />

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {activeTab === 'dashboard' && (
            <DashboardView
              appData={appData}
              onNavigate={handleNavigate}
              onSelectStudentProfile={(student) => {
                setActiveProfileStudent(student);
                setActiveTab('students');
              }}
            />
          )}

          {activeTab === 'classes' && (
            <ClassesView
              appData={appData}
              onAddClass={handleAddClass}
              onUpdateClass={handleUpdateClass}
              onDeleteClass={handleDeleteClass}
              onOpenConfirmModal={openConfirmModal}
              onSelectStudentProfile={(student) => {
                setActiveProfileStudent(student);
                setActiveTab('students');
              }}
            />
          )}

          {activeTab === 'students' && (
            <StudentsView
              appData={appData}
              activeProfileStudent={activeProfileStudent}
              onCloseProfile={() => setActiveProfileStudent(null)}
              onSelectStudentProfile={(student) => setActiveProfileStudent(student)}
              onAddStudent={handleAddStudent}
              onAddMultipleStudents={handleAddMultipleStudents}
              onUpdateStudent={handleUpdateStudent}
              onDeleteStudent={handleDeleteStudent}
              onOpenConfirmModal={openConfirmModal}
              onShowToast={showToast}
            />
          )}

          {activeTab === 'attendance' && (
            <AttendanceView
              appData={appData}
              onSaveAttendance={handleSaveAttendance}
            />
          )}

          {activeTab === 'lessons' && (
            <LessonsView
              appData={appData}
              onAddLesson={handleAddLesson}
              onUpdateLesson={handleUpdateLesson}
              onDeleteLesson={handleDeleteLesson}
              onOpenConfirmModal={openConfirmModal}
            />
          )}

          {activeTab === 'assignments' && (
            <AssignmentsView
              appData={appData}
              onAddAssignment={handleAddAssignment}
              onUpdateAssignment={handleUpdateAssignment}
              onDeleteAssignment={handleDeleteAssignment}
              onOpenConfirmModal={openConfirmModal}
            />
          )}

          {activeTab === 'grades' && (
            <GradesView
              appData={appData}
              onSaveGrades={handleSaveGrades}
              onUpdateFormula={handleUpdateFormula}
            />
          )}

          {activeTab === 'comments' && (
            <CommentsView
              appData={appData}
              onAddComment={handleAddComment}
              onDeleteComment={handleDeleteComment}
              onOpenConfirmModal={openConfirmModal}
            />
          )}

          {activeTab === 'progress' && (
            <ProgressView
              appData={appData}
              onSelectStudentProfile={(student) => {
                setActiveProfileStudent(student);
                setActiveTab('students');
              }}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsView
              appData={appData}
              onUpdateTeacherProfile={handleUpdateTeacherProfile}
              onUpdateFormula={handleUpdateFormula}
              onExportJson={handleExportJson}
              onImportJson={handleImportJson}
              onResetDemoData={handleResetDemoData}
              onClearAllData={handleClearAllData}
              soundEnabled={soundEnabled}
              onToggleSound={toggleSound}
              onOpenConfirmModal={openConfirmModal}
              showToast={(msg, type) => showToast(msg, type === 'error' ? 'warning' : type)}
            />
          )}
        </main>
      </div>

      {/* Global Modals & Notifications */}
      <QuickSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        appData={appData}
        onNavigate={handleNavigate}
      />

      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast((t) => ({ ...t, message: null }))}
      />

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal((m) => ({ ...m, isOpen: false }))}
      />
    </div>
  );
}
