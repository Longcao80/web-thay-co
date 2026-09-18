import { useState } from 'react';
import {
  GraduationCap,
  Plus,
  Edit2,
  Trash2,
  Users,
  FileText,
  Award,
  CalendarCheck,
  ArrowLeft,
  X,
  Eye,
} from 'lucide-react';
import { AppData, ClassItem, Student } from '../types';
import { calculateStudentAverage } from '../utils/gradeCalculator';

interface ClassesViewProps {
  appData: AppData;
  onAddClass: (newClass: Omit<ClassItem, 'id'>) => void;
  onUpdateClass: (updated: ClassItem) => void;
  onDeleteClass: (classId: string) => void;
  onOpenConfirmModal: (opts: {
    title: string;
    message: string;
    onConfirm: () => void;
  }) => void;
  onSelectStudentProfile: (student: Student) => void;
}

export function ClassesView({
  appData,
  onAddClass,
  onUpdateClass,
  onDeleteClass,
  onOpenConfirmModal,
  onSelectStudentProfile,
}: ClassesViewProps) {
  const { classes, students, assignments, attendance, grades, gradeFormula } = appData;

  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<ClassItem | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [gradeLevel, setGradeLevel] = useState<number>(6);
  const [room, setRoom] = useState('');
  const [academicYear, setAcademicYear] = useState('2026 - 2027');
  const [note, setNote] = useState('');

  const selectedClass = classes.find((c) => c.id === selectedClassId);
  const classStudents = selectedClassId ? students.filter((s) => s.classId === selectedClassId) : [];

  const handleOpenAdd = () => {
    setEditingClass(null);
    setName('');
    setGradeLevel(6);
    setRoom('Phòng 102 - Tầng 1');
    setAcademicYear('2026 - 2027');
    setNote('');
    setIsFormModalOpen(true);
  };

  const handleOpenEdit = (c: ClassItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingClass(c);
    setName(c.name);
    setGradeLevel(c.gradeLevel);
    setRoom(c.room);
    setAcademicYear(c.academicYear);
    setNote(c.note || '');
    setIsFormModalOpen(true);
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingClass) {
      onUpdateClass({
        ...editingClass,
        name: name.trim(),
        gradeLevel: Number(gradeLevel),
        room: room.trim(),
        academicYear: academicYear.trim(),
        note: note.trim(),
      });
    } else {
      onAddClass({
        name: name.trim(),
        gradeLevel: Number(gradeLevel),
        room: room.trim(),
        academicYear: academicYear.trim(),
        totalStudents: 0,
        teacher: 'Kiều Cao Long',
        note: note.trim(),
      });
    }
    setIsFormModalOpen(false);
  };

  const handleDelete = (c: ClassItem, e: React.MouseEvent) => {
    e.stopPropagation();
    onOpenConfirmModal({
      title: `Xóa lớp ${c.name}?`,
      message: `Bạn có chắc chắn muốn xóa lớp học này không? Toàn bộ danh sách học sinh thuộc lớp ${c.name} cũng sẽ bị xóa bỏ khỏi hệ thống.`,
      onConfirm: () => {
        onDeleteClass(c.id);
        if (selectedClassId === c.id) setSelectedClassId(null);
      },
    });
  };

  // Compute metrics for a class
  const getClassMetrics = (c: ClassItem) => {
    const cStudents = students.filter((s) => s.classId === c.id);
    const cAssignments = assignments.filter((a) => a.classId === c.id);

    // Điểm TB
    let sumScore = 0;
    let countScore = 0;
    cStudents.forEach((s) => {
      const avg = calculateStudentAverage(grades[s.id], gradeFormula);
      if (avg !== null) {
        sumScore += avg;
        countScore++;
      }
    });
    const avgGrade = countScore > 0 ? (sumScore / countScore).toFixed(1) : '--';

    // Chuyên cần
    const cAttendance = attendance.filter((a) => a.classId === c.id);
    const presentCount = cAttendance.filter((a) => a.status === 'present').length;
    const attRate =
      cAttendance.length > 0 ? Math.round((presentCount / cAttendance.length) * 100) : 96;

    return {
      studentCount: cStudents.length,
      assignmentCount: cAssignments.length,
      avgGrade,
      attendanceRate: attRate,
    };
  };

  return (
    <div className="space-y-6">
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <h2 className="text-lg md:text-xl font-bold text-slate-800 flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-sky-700" />
            {selectedClass ? `Chi tiết Lớp ${selectedClass.name}` : 'Quản lý danh sách Lớp học'}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {selectedClass
              ? `Khối ${selectedClass.gradeLevel} • ${selectedClass.room} • GV: ${selectedClass.teacher || 'Kiều Cao Long'}`
              : 'Theo dõi sĩ số, chuyên cần và điểm số tổng quan từng lớp'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {selectedClass && (
            <button
              onClick={() => setSelectedClassId(null)}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> Quay lại danh sách lớp
            </button>
          )}
          <button
            id="btn-add-class"
            type="button"
            onClick={handleOpenAdd}
            className="px-4 py-2 rounded-xl text-xs md:text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 shadow-sm transition-all flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            <span>+ Thêm lớp</span>
          </button>
        </div>
      </div>

      {/* View Details of Single Class */}
      {selectedClass ? (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Class Summary Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white p-5 rounded-2xl border border-slate-200">
            <div className="p-3 bg-sky-50/60 rounded-xl border border-sky-100">
              <span className="text-3xs font-bold text-sky-800 uppercase">Sĩ số học sinh</span>
              <p className="text-xl font-bold text-sky-900 mt-1">{classStudents.length} em</p>
            </div>
            <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-100">
              <span className="text-3xs font-bold text-amber-800 uppercase">Điểm TB Ngữ văn</span>
              <p className="text-xl font-bold text-amber-900 mt-1">
                {getClassMetrics(selectedClass).avgGrade} / 10
              </p>
            </div>
            <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100">
              <span className="text-3xs font-bold text-emerald-800 uppercase">Tỷ lệ chuyên cần</span>
              <p className="text-xl font-bold text-emerald-900 mt-1">
                {getClassMetrics(selectedClass).attendanceRate}%
              </p>
            </div>
            <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100">
              <span className="text-3xs font-bold text-indigo-800 uppercase">Số bài tập</span>
              <p className="text-xl font-bold text-indigo-900 mt-1">
                {getClassMetrics(selectedClass).assignmentCount} bài
              </p>
            </div>
          </div>

          {/* Students list inside class */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <span className="font-bold text-sm text-slate-800">
                Danh sách học sinh lớp {selectedClass.name} ({classStudents.length})
              </span>
              <span className="text-xs text-slate-500">Bấm vào học sinh để xem hồ sơ chi tiết</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-3xs">
                    <th className="py-3 px-4">STT</th>
                    <th className="py-3 px-4">Mã HS</th>
                    <th className="py-3 px-4">Họ và tên</th>
                    <th className="py-3 px-4">Giới tính</th>
                    <th className="py-3 px-4">Điểm TB</th>
                    <th className="py-3 px-4">SĐT Phụ huynh</th>
                    <th className="py-3 px-4">Trạng thái</th>
                    <th className="py-3 px-4 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {classStudents.map((s, idx) => {
                    const avg = calculateStudentAverage(grades[s.id], gradeFormula);
                    return (
                      <tr
                        key={s.id}
                        className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                        onClick={() => onSelectStudentProfile(s)}
                      >
                        <td className="py-3 px-4 font-mono text-slate-400">{idx + 1}</td>
                        <td className="py-3 px-4 font-mono font-medium text-slate-600">{s.studentCode}</td>
                        <td className="py-3 px-4 font-bold text-slate-900">{s.fullName}</td>
                        <td className="py-3 px-4">{s.gender}</td>
                        <td className="py-3 px-4 font-bold text-amber-600">
                          {avg !== null ? avg.toFixed(1) : '--'}
                        </td>
                        <td className="py-3 px-4 text-slate-500">{s.parentPhone}</td>
                        <td className="py-3 px-4">
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
                        <td className="py-3 px-4 text-right">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectStudentProfile(s);
                            }}
                            className="text-xs text-sky-700 hover:text-sky-800 font-semibold inline-flex items-center gap-1 cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" /> Xem hồ sơ
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* Class Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {classes.map((c) => {
            const metrics = getClassMetrics(c);
            return (
              <div
                key={c.id}
                id={`class-card-${c.id}`}
                onClick={() => setSelectedClassId(c.id)}
                className="bg-white rounded-2xl border border-slate-200 shadow-2xs hover:shadow-lg hover:border-slate-300 transition-all p-5 flex flex-col justify-between cursor-pointer group"
              >
                <div>
                  {/* Top card bar */}
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-2xs font-bold text-amber-600 uppercase tracking-wider">
                        Khối {c.gradeLevel}
                      </span>
                      <h3 className="text-2xl font-extrabold text-slate-900 group-hover:text-sky-700 transition-colors">
                        Lớp {c.name}
                      </h3>
                      <p className="text-2xs text-slate-500 mt-0.5">{c.room}</p>
                    </div>

                    <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100">
                      <button
                        title="Chỉnh sửa lớp"
                        onClick={(e) => handleOpenEdit(c, e)}
                        className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        title="Xóa lớp"
                        onClick={(e) => handleDelete(c, e)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Teacher & Notes */}
                  <div className="mt-3 pt-3 border-t border-slate-100 text-xs">
                    <p className="text-slate-700 font-medium">
                      Giáo viên: <span className="font-bold">{c.teacher}</span>
                    </p>
                    {c.note && (
                      <p className="text-2xs text-slate-500 mt-1 line-clamp-2 italic">
                        "{c.note}"
                      </p>
                    )}
                  </div>

                  {/* Metrics Grid */}
                  <div className="mt-4 grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs">
                    <div className="flex items-center gap-2">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      <div>
                        <p className="text-3xs text-slate-400">Sĩ số</p>
                        <p className="font-bold text-slate-800">{metrics.studentCount} HS</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <FileText className="w-3.5 h-3.5 text-slate-400" />
                      <div>
                        <p className="text-3xs text-slate-400">Bài tập</p>
                        <p className="font-bold text-slate-800">{metrics.assignmentCount} bài</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-1 border-t border-slate-200/60">
                      <Award className="w-3.5 h-3.5 text-amber-500" />
                      <div>
                        <p className="text-3xs text-slate-400">Điểm TB</p>
                        <p className="font-bold text-amber-600">{metrics.avgGrade}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-1 border-t border-slate-200/60">
                      <CalendarCheck className="w-3.5 h-3.5 text-emerald-500" />
                      <div>
                        <p className="text-3xs text-slate-400">Chuyên cần</p>
                        <p className="font-bold text-emerald-700">{metrics.attendanceRate}%</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom CTA */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-sky-700 group-hover:text-sky-800">
                  <span>Xem chi tiết danh sách lớp</span>
                  <Eye className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Class Modal */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="text-base font-bold text-slate-900">
                {editingClass ? `Chỉnh sửa Lớp ${editingClass.name}` : 'Thêm Lớp học mới'}
              </h3>
              <button
                onClick={() => setIsFormModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tên lớp <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="VD: 6B, 8C..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Khối lớp <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={gradeLevel}
                    onChange={(e) => setGradeLevel(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-sky-500 bg-white"
                  >
                    <option value={6}>Khối 6</option>
                    <option value={7}>Khối 7</option>
                    <option value={8}>Khối 8</option>
                    <option value={9}>Khối 9</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Phòng học
                  </label>
                  <input
                    type="text"
                    placeholder="VD: Phòng 103 - Tầng 1"
                    value={room}
                    onChange={(e) => setRoom(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Năm học
                  </label>
                  <input
                    type="text"
                    value={academicYear}
                    onChange={(e) => setAcademicYear(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Đặc điểm lớp / Ghi chú sư phạm
                </label>
                <textarea
                  rows={3}
                  placeholder="Ghi chú về tình hình học sinh, tinh thần học tập bộ môn Ngữ văn..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-sky-500 resize-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsFormModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-xs cursor-pointer"
                >
                  {editingClass ? 'Lưu thay đổi' : 'Tạo lớp học'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
