import { useState } from 'react';
import {
  Users,
  Search,
  Plus,
  Edit2,
  Trash2,
  Eye,
  X,
  Phone,
  Calendar,
  Award,
  CalendarCheck,
  FileText,
  MessageSquareQuote,
  TrendingUp,
  FileSpreadsheet,
  Download,
  Upload,
} from 'lucide-react';
import { AppData, Student, StudentStatus } from '../types';
import { calculateStudentAverage, getGradeClassification } from '../utils/gradeCalculator';
import { StudentImportModal } from '../components/StudentImportModal';
import { exportStudentsToExcel } from '../utils/excelParser';

interface StudentsViewProps {
  appData: AppData;
  activeProfileStudent: Student | null;
  onCloseProfile: () => void;
  onSelectStudentProfile: (student: Student) => void;
  onAddStudent: (student: Omit<Student, 'id'>) => void;
  onAddMultipleStudents?: (students: Omit<Student, 'id'>[]) => void;
  onUpdateStudent: (student: Student) => void;
  onDeleteStudent: (studentId: string) => void;
  onOpenConfirmModal: (opts: {
    title: string;
    message: string;
    onConfirm: () => void;
  }) => void;
  onNavigateToTab?: (tab: string) => void;
  onShowToast?: (message: string, type?: 'success' | 'warning' | 'info') => void;
}

export function StudentsView({
  appData,
  activeProfileStudent,
  onCloseProfile,
  onSelectStudentProfile,
  onAddStudent,
  onAddMultipleStudents,
  onUpdateStudent,
  onDeleteStudent,
  onOpenConfirmModal,
  onShowToast,
}: StudentsViewProps) {
  const { classes, students, assignments, attendance, grades, gradeFormula, comments } = appData;

  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Add / Edit Modal state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  // Export current students to Excel
  const handleExportExcel = () => {
    const list = filteredStudents.length > 0 ? filteredStudents : students;
    if (list.length === 0) {
      if (onShowToast) onShowToast('Không có dữ liệu học sinh để xuất.', 'warning');
      return;
    }
    const currentClassObj = classes.find((c) => c.id === filterClass);
    const fileName = currentClassObj
      ? `Danh_Sach_Hoc_Sinh_Lop_${currentClassObj.name}.xlsx`
      : 'Danh_Sach_Toan_Bo_Hoc_Sinh.xlsx';
    exportStudentsToExcel(list, fileName);
    if (onShowToast) {
      onShowToast(`Đã xuất ${list.length} học sinh ra tệp Excel thành công!`, 'success');
    }
  };

  // Import batch students
  const handleImportSuccess = (importedStudents: Omit<Student, 'id'>[]) => {
    if (onAddMultipleStudents) {
      onAddMultipleStudents(importedStudents);
    } else {
      importedStudents.forEach((s) => onAddStudent(s));
      if (onShowToast) {
        onShowToast(`Đã thêm thành công ${importedStudents.length} học sinh!`, 'success');
      }
    }
  };

  // Form Fields
  const [studentCode, setStudentCode] = useState('');
  const [fullName, setFullName] = useState('');
  const [classId, setClassId] = useState(classes[0]?.id || '');
  const [gender, setGender] = useState<'Nam' | 'Nữ'>('Nam');
  const [birthDate, setBirthDate] = useState('2013-05-15');
  const [parentPhone, setParentPhone] = useState('');
  const [status, setStatus] = useState<StudentStatus>('Tích cực');
  const [notes, setNotes] = useState('');

  // Filter students
  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.fullName.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
      s.studentCode.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
      s.parentPhone.includes(searchTerm.trim());
    const matchesClass = filterClass === 'all' || s.classId === filterClass;
    const matchesStatus = filterStatus === 'all' || s.status === filterStatus;
    return matchesSearch && matchesClass && matchesStatus;
  });

  const handleOpenAdd = () => {
    setEditingStudent(null);
    const nextCodeNum = students.length + 1;
    setStudentCode(`HS-0${classes[0]?.gradeLevel || 6}${nextCodeNum < 10 ? '0' + nextCodeNum : nextCodeNum}`);
    setFullName('');
    setClassId(classes[0]?.id || '');
    setGender('Nam');
    setBirthDate('2013-05-15');
    setParentPhone('');
    setStatus('Tích cực');
    setNotes('');
    setIsFormOpen(true);
  };

  const handleOpenEdit = (s: Student, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingStudent(s);
    setStudentCode(s.studentCode);
    setFullName(s.fullName);
    setClassId(s.classId);
    setGender(s.gender);
    setBirthDate(s.birthDate);
    setParentPhone(s.parentPhone);
    setStatus(s.status);
    setNotes(s.notes || '');
    setIsFormOpen(true);
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !studentCode.trim()) return;

    const matchedClass = classes.find((c) => c.id === classId);
    const className = matchedClass ? matchedClass.name : 'Chưa xếp lớp';

    if (editingStudent) {
      onUpdateStudent({
        ...editingStudent,
        studentCode: studentCode.trim(),
        fullName: fullName.trim(),
        classId,
        className,
        gender,
        birthDate,
        parentPhone: parentPhone.trim(),
        status,
        notes: notes.trim(),
      });
    } else {
      onAddStudent({
        studentCode: studentCode.trim(),
        fullName: fullName.trim(),
        classId,
        className,
        gender,
        birthDate,
        parentPhone: parentPhone.trim(),
        status,
        notes: notes.trim(),
      });
    }
    setIsFormOpen(false);
  };

  const handleDelete = (s: Student, e: React.MouseEvent) => {
    e.stopPropagation();
    onOpenConfirmModal({
      title: `Xóa học sinh ${s.fullName}?`,
      message: `Bạn có chắc chắn muốn xóa học sinh mã ${s.studentCode} thuộc lớp ${s.className}? Dữ liệu điểm và chuyên cần tương ứng cũng sẽ bị gỡ bỏ.`,
      onConfirm: () => {
        onDeleteStudent(s.id);
        if (activeProfileStudent?.id === s.id) onCloseProfile();
      },
    });
  };

  // Helper metrics for single student
  const getStudentMetrics = (s: Student) => {
    const studentGrades = grades[s.id];
    const avgGrade = calculateStudentAverage(studentGrades, gradeFormula);
    const classification = getGradeClassification(avgGrade);

    // Chuyên cần
    const studentAtt = attendance.filter((a) => a.studentId === s.id);
    const presentCount = studentAtt.filter((a) => a.status === 'present').length;
    const attRate =
      studentAtt.length > 0 ? Math.round((presentCount / studentAtt.length) * 100) : 96;

    // Bài tập
    const classAssignments = assignments.filter((a) => a.classId === s.classId);
    let finishedCount = 0;
    classAssignments.forEach((a) => {
      if (a.submissions?.[s.id]?.submitted) finishedCount++;
    });

    return {
      avgGrade,
      classification,
      attRate,
      finishedCount,
      totalAssignments: classAssignments.length,
      studentGrades,
      studentAtt,
      commentsList: comments.filter((c) => c.studentId === s.id),
    };
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Search / Filters */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg md:text-xl font-bold text-slate-800 flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-700" />
              Danh sách học sinh ({students.length})
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Quản lý hồ sơ học tập, chuyên cần và bảng điểm toàn diện môn Ngữ văn
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap self-start sm:self-auto">
            <button
              id="btn-export-students-excel"
              type="button"
              onClick={handleExportExcel}
              title="Xuất danh sách học sinh ra file Excel"
              className="px-3 py-2 rounded-xl text-xs md:text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-4 h-4 text-slate-500" />
              <span className="hidden sm:inline">Xuất Excel</span>
            </button>

            <button
              id="btn-import-students-excel"
              type="button"
              onClick={() => setIsImportModalOpen(true)}
              title="Nhập danh sách học sinh từ file Excel hoặc CSV"
              className="px-3.5 py-2 rounded-xl text-xs md:text-sm font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span>Nhập Excel</span>
            </button>

            <button
              id="btn-add-student"
              type="button"
              onClick={handleOpenAdd}
              className="px-4 py-2 rounded-xl text-xs md:text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 shadow-sm transition-all flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-amber-400" />
              <span>+ Thêm học sinh</span>
            </button>
          </div>
        </div>

        {/* Filters bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100">
          {/* Search box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm theo tên, mã HS, SĐT phụ huynh..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs md:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-sky-500 focus:bg-white"
            />
          </div>

          {/* Class Filter */}
          <div>
            <select
              value={filterClass}
              onChange={(e) => setFilterClass(e.target.value)}
              className="w-full px-3 py-2 text-xs md:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-sky-500 text-slate-700"
            >
              <option value="all">Tất cả lớp học ({classes.length} lớp)</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  Lớp {c.name} (Khối {c.gradeLevel})
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 text-xs md:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-sky-500 text-slate-700"
            >
              <option value="all">Tất cả trạng thái học tập</option>
              <option value="Tích cực">Tích cực</option>
              <option value="Đang tiến bộ">Đang tiến bộ</option>
              <option value="Cần cố gắng">Cần cố gắng</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Student Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-3xs">
                <th className="py-3 px-3.5">STT</th>
                <th className="py-3 px-3.5">Mã HS</th>
                <th className="py-3 px-3.5">Họ và tên</th>
                <th className="py-3 px-3.5">Lớp</th>
                <th className="py-3 px-3.5">Chuyên cần</th>
                <th className="py-3 px-3.5">Điểm TB</th>
                <th className="py-3 px-3.5">Bài tập hoàn thành</th>
                <th className="py-3 px-3.5">Trạng thái</th>
                <th className="py-3 px-3.5 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400 text-xs">
                    Không tìm thấy học sinh nào phù hợp với bộ lọc hiện tại.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((s, idx) => {
                  const metrics = getStudentMetrics(s);
                  return (
                    <tr
                      key={s.id}
                      onClick={() => onSelectStudentProfile(s)}
                      className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                    >
                      <td className="py-3 px-3.5 font-mono text-slate-400">{idx + 1}</td>
                      <td className="py-3 px-3.5 font-mono font-medium text-slate-600">{s.studentCode}</td>
                      <td className="py-3 px-3.5">
                        <span className="font-bold text-slate-900 group-hover:text-sky-700 transition-colors">
                          {s.fullName}
                        </span>
                        <span className="text-3xs text-slate-400 block sm:hidden">
                          {s.gender} • SĐT: {s.parentPhone}
                        </span>
                      </td>
                      <td className="py-3 px-3.5">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-bold">
                          {s.className}
                        </span>
                      </td>
                      <td className="py-3 px-3.5 font-semibold text-emerald-700">
                        {metrics.attRate}%
                      </td>
                      <td className="py-3 px-3.5">
                        {metrics.avgGrade !== null ? (
                          <span className="font-bold text-amber-600">
                            {metrics.avgGrade.toFixed(1)}
                          </span>
                        ) : (
                          <span className="text-slate-400">--</span>
                        )}
                      </td>
                      <td className="py-3 px-3.5">
                        <span className="font-semibold text-slate-800">
                          {metrics.finishedCount}
                        </span>{' '}
                        / {metrics.totalAssignments}
                      </td>
                      <td className="py-3 px-3.5">
                        <span
                          className={`px-2 py-0.5 rounded-full text-2xs font-semibold ${
                            s.status === 'Tích cực'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : s.status === 'Đang tiến bộ'
                              ? 'bg-sky-50 text-sky-700 border border-sky-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          {s.status}
                        </span>
                      </td>
                      <td className="py-3 px-3.5 text-right">
                        <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                          <button
                            title="Xem hồ sơ học sinh"
                            onClick={() => onSelectStudentProfile(s)}
                            className="p-1.5 text-slate-400 hover:text-sky-700 hover:bg-sky-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            title="Chỉnh sửa thông tin"
                            onClick={(e) => handleOpenEdit(s, e)}
                            className="p-1.5 text-slate-400 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            title="Xóa học sinh"
                            onClick={(e) => handleDelete(s, e)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* STUDENT PROFILE MODAL / DRAWER */}
      {activeProfileStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-5 bg-gradient-to-r from-[#0f2b48] to-[#1e4672] text-white flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-amber-400 text-slate-950 font-extrabold text-base flex items-center justify-center shadow-md">
                  {activeProfileStudent.fullName.split(' ').slice(-1)[0].charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold">{activeProfileStudent.fullName}</h3>
                    <span className="px-2 py-0.5 rounded-full text-2xs font-semibold bg-white/20 text-amber-200">
                      {activeProfileStudent.className}
                    </span>
                  </div>
                  <p className="text-2xs text-slate-300 mt-0.5">
                    Mã HS: <span className="font-mono font-semibold">{activeProfileStudent.studentCode}</span> • {activeProfileStudent.gender}
                  </p>
                </div>
              </div>

              <button
                onClick={onCloseProfile}
                className="text-slate-300 hover:text-white p-1 rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body with All Tabs Information */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-700">
              {/* Top Key Metrics */}
              {(() => {
                const metrics = getStudentMetrics(activeProfileStudent);
                return (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/60">
                      <span className="text-3xs font-bold text-amber-800 uppercase flex items-center gap-1">
                        <Award className="w-3 h-3" /> Điểm TB Ngữ văn
                      </span>
                      <p className="text-xl font-bold text-amber-700 mt-1">
                        {metrics.avgGrade !== null ? metrics.avgGrade.toFixed(1) : '--'}
                      </p>
                      <span className={`mt-1 inline-block px-2 py-0.5 rounded-full text-3xs font-semibold border ${metrics.classification.badgeClass}`}>
                        {metrics.classification.label}
                      </span>
                    </div>

                    <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200/60">
                      <span className="text-3xs font-bold text-emerald-800 uppercase flex items-center gap-1">
                        <CalendarCheck className="w-3 h-3" /> Chuyên cần
                      </span>
                      <p className="text-xl font-bold text-emerald-700 mt-1">
                        {metrics.attRate}%
                      </p>
                      <span className="text-3xs text-emerald-600 block mt-1">Đầy đủ và đúng giờ</span>
                    </div>

                    <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-200/60">
                      <span className="text-3xs font-bold text-indigo-800 uppercase flex items-center gap-1">
                        <FileText className="w-3 h-3" /> Bài tập hoàn thành
                      </span>
                      <p className="text-xl font-bold text-indigo-700 mt-1">
                        {metrics.finishedCount} / {metrics.totalAssignments}
                      </p>
                      <span className="text-3xs text-indigo-600 block mt-1">Đã nộp bài đầy đủ</span>
                    </div>

                    <div className="p-3 bg-sky-50 rounded-xl border border-sky-200/60">
                      <span className="text-3xs font-bold text-sky-800 uppercase flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" /> Trạng thái
                      </span>
                      <p className="text-base font-bold text-sky-800 mt-1">
                        {activeProfileStudent.status}
                      </p>
                      <span className="text-3xs text-slate-500 block mt-1">Đánh giá chung</span>
                    </div>
                  </div>
                );
              })()}

              {/* Basic Info & Contact */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                <h4 className="font-bold text-slate-900 text-xs mb-2.5 uppercase tracking-wider">
                  Thông tin cá nhân & Phụ huynh
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <div>
                      <p className="text-3xs text-slate-400">Ngày sinh</p>
                      <p className="font-medium text-slate-800">{activeProfileStudent.birthDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-slate-400" />
                    <div>
                      <p className="text-3xs text-slate-400">Số điện thoại phụ huynh</p>
                      <p className="font-medium text-slate-800">{activeProfileStudent.parentPhone || 'Chưa cập nhật'}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-3xs text-slate-400">Ghi chú cá nhân</p>
                    <p className="font-medium text-slate-800 italic">
                      "{activeProfileStudent.notes || 'Không có ghi chú đặc biệt'}"
                    </p>
                  </div>
                </div>
              </div>

              {/* Grade details */}
              <div>
                <h4 className="font-bold text-slate-900 text-xs mb-2 uppercase tracking-wider flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-600" />
                  Bảng điểm môn Ngữ văn
                </h4>
                {(() => {
                  const sg = grades[activeProfileStudent.id];
                  const avg = calculateStudentAverage(sg, gradeFormula);
                  return (
                    <div className="overflow-x-auto border border-slate-200 rounded-xl">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 text-slate-500 text-3xs uppercase font-semibold">
                          <tr>
                            <th className="py-2.5 px-3">Điểm TX 1</th>
                            <th className="py-2.5 px-3">Điểm TX 2</th>
                            <th className="py-2.5 px-3">Điểm TX 3</th>
                            <th className="py-2.5 px-3">Giữa kỳ (GK)</th>
                            <th className="py-2.5 px-3">Cuối kỳ (CK)</th>
                            <th className="py-2.5 px-3 font-bold text-amber-700">Điểm TB</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          <tr>
                            <td className="py-2.5 px-3 font-semibold">{sg?.regularScores?.[0] ?? '--'}</td>
                            <td className="py-2.5 px-3 font-semibold">{sg?.regularScores?.[1] ?? '--'}</td>
                            <td className="py-2.5 px-3 font-semibold">{sg?.regularScores?.[2] ?? '--'}</td>
                            <td className="py-2.5 px-3 font-semibold text-sky-700">{sg?.midtermScore ?? '--'}</td>
                            <td className="py-2.5 px-3 font-semibold text-indigo-700">{sg?.finalScore ?? '--'}</td>
                            <td className="py-2.5 px-3 font-extrabold text-amber-600 text-sm">
                              {avg !== null ? avg.toFixed(1) : '--'}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  );
                })()}
              </div>

              {/* Teacher Comments History */}
              <div>
                <h4 className="font-bold text-slate-900 text-xs mb-2 uppercase tracking-wider flex items-center gap-1.5">
                  <MessageSquareQuote className="w-4 h-4 text-sky-700" />
                  Nhận xét của giáo viên (Thầy Kiều Cao Long)
                </h4>
                {(() => {
                  const studentComments = comments.filter((c) => c.studentId === activeProfileStudent.id);
                  if (studentComments.length === 0) {
                    return (
                      <p className="text-slate-400 italic p-3 bg-slate-50 rounded-xl border border-slate-100">
                        Chưa có nhận xét riêng cho học sinh này. Thầy có thể bổ sung trong mục "8. Nhận xét".
                      </p>
                    );
                  }
                  return (
                    <div className="space-y-2">
                      {studentComments.map((c) => (
                        <div key={c.id} className="p-3 bg-amber-50/40 rounded-xl border border-amber-200/60">
                          <div className="flex justify-between items-center text-3xs text-slate-400 font-semibold">
                            <span>{c.author || 'Thầy Kiều Cao Long'}</span>
                            <span>{c.date}</span>
                          </div>
                          <p className="text-xs text-slate-800 mt-1 leading-relaxed">{c.content}</p>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={onCloseProfile}
                className="px-5 py-2 rounded-xl text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800"
              >
                Đóng hồ sơ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Student Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="text-base font-bold text-slate-900">
                {editingStudent ? `Chỉnh sửa: ${editingStudent.fullName}` : 'Thêm học sinh mới'}
              </h3>
              <button
                onClick={() => setIsFormOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick link to Excel import if adding new */}
            {!editingStudent && (
              <div className="bg-emerald-50 border-b border-emerald-100/80 px-5 py-3 flex items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2 text-emerald-900">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>Có sẵn danh sách từ Excel (.xlsx, .csv, vnEdu, SMAS)?</span>
                </div>
                <button
                  type="button"
                  id="btn-switch-to-excel-import"
                  onClick={() => {
                    setIsFormOpen(false);
                    setIsImportModalOpen(true);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium flex items-center gap-1 shrink-0 transition-colors cursor-pointer shadow-2xs"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Nhập từ Excel</span>
                </button>
              </div>
            )}

            <form onSubmit={handleSubmitForm} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Mã học sinh <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={studentCode}
                    onChange={(e) => setStudentCode(e.target.value)}
                    placeholder="VD: HS-0806"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Họ và tên <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="VD: Nguyễn Văn A"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Lớp <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={classId}
                    onChange={(e) => setClassId(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-sky-500 bg-white"
                  >
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        Lớp {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Giới tính
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as 'Nam' | 'Nữ')}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-sky-500 bg-white"
                  >
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Ngày sinh
                  </label>
                  <input
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    SĐT Phụ huynh
                  </label>
                  <input
                    type="text"
                    placeholder="VD: 0912 345 678"
                    value={parentPhone}
                    onChange={(e) => setParentPhone(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Trạng thái học tập
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as StudentStatus)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-sky-500 bg-white"
                >
                  <option value="Tích cực">Tích cực</option>
                  <option value="Đang tiến bộ">Đang tiến bộ</option>
                  <option value="Cần cố gắng">Cần cố gắng</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Ghi chú sư phạm
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ghi chú về học lực, tính cách, kỹ năng viết..."
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-sky-500 resize-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-xs cursor-pointer"
                >
                  {editingStudent ? 'Lưu thay đổi' : 'Thêm vào danh sách'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Excel / CSV Student Import Modal */}
      <StudentImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        classes={classes}
        existingStudents={students}
        onImportSuccess={handleImportSuccess}
        onShowToast={onShowToast || (() => {})}
      />
    </div>
  );
}
