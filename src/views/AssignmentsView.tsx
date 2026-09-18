import { useState } from 'react';
import {
  FileText,
  Plus,
  Edit2,
  Trash2,
  Calendar,
  X,
  Search,
  CheckCircle2,
  XCircle,
  Eye,
} from 'lucide-react';
import { AppData, Assignment, AssignmentStatus } from '../types';

interface AssignmentsViewProps {
  appData: AppData;
  onAddAssignment: (assignment: Omit<Assignment, 'id'>) => void;
  onUpdateAssignment: (assignment: Assignment) => void;
  onDeleteAssignment: (assignmentId: string) => void;
  onOpenConfirmModal: (opts: {
    title: string;
    message: string;
    onConfirm: () => void;
  }) => void;
}

export function AssignmentsView({
  appData,
  onAddAssignment,
  onUpdateAssignment,
  onDeleteAssignment,
  onOpenConfirmModal,
}: AssignmentsViewProps) {
  const { classes, students, assignments } = appData;

  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);

  // Form fields
  const [title, setTitle] = useState('');
  const [classId, setClassId] = useState(classes[0]?.id || '');
  const [requirements, setRequirements] = useState('');
  const [assignedDate, setAssignedDate] = useState(new Date().toISOString().slice(0, 10));
  const [dueDate, setDueDate] = useState(
    new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10)
  );
  const [status, setStatus] = useState<AssignmentStatus>('Đang thực hiện');

  // Filtered list
  const filteredAssignments = assignments.filter((a) => {
    const matchesSearch =
      a.title.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
      a.requirements.toLowerCase().includes(searchTerm.toLowerCase().trim());
    const matchesClass = filterClass === 'all' || a.classId === filterClass;
    const matchesStatus = filterStatus === 'all' || a.status === filterStatus;
    return matchesSearch && matchesClass && matchesStatus;
  });

  const handleOpenAdd = () => {
    setEditingAssignment(null);
    setTitle('');
    setClassId(classes[0]?.id || '');
    setRequirements('');
    setAssignedDate(new Date().toISOString().slice(0, 10));
    setDueDate(new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10));
    setStatus('Đang thực hiện');
    setIsFormOpen(true);
  };

  const handleOpenEdit = (a: Assignment, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingAssignment(a);
    setTitle(a.title);
    setClassId(a.classId);
    setRequirements(a.requirements);
    setAssignedDate(a.assignedDate);
    setDueDate(a.dueDate);
    setStatus(a.status);
    setIsFormOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const matchedClass = classes.find((c) => c.id === classId);
    const className = matchedClass ? matchedClass.name : '';

    if (editingAssignment) {
      onUpdateAssignment({
        ...editingAssignment,
        title: title.trim(),
        classId,
        className,
        requirements: requirements.trim(),
        assignedDate,
        dueDate,
        status,
      });
    } else {
      // Initialize submissions for all students of this class
      const classStudents = students.filter((s) => s.classId === classId);
      const initialSubmissions: Record<string, { submitted: boolean }> = {};
      classStudents.forEach((s) => {
        initialSubmissions[s.id] = { submitted: false };
      });

      onAddAssignment({
        title: title.trim(),
        classId,
        className,
        requirements: requirements.trim(),
        assignedDate,
        dueDate,
        status,
        submissions: initialSubmissions,
      });
    }
    setIsFormOpen(false);
  };

  const handleDelete = (a: Assignment, e: React.MouseEvent) => {
    e.stopPropagation();
    onOpenConfirmModal({
      title: 'Xóa bài tập?',
      message: `Bạn có chắc chắn muốn xóa bài tập "${a.title}" của lớp ${a.className}?`,
      onConfirm: () => {
        onDeleteAssignment(a.id);
        if (selectedAssignment?.id === a.id) setSelectedAssignment(null);
      },
    });
  };

  // Toggle submission status for student in details modal
  const handleToggleStudentSubmission = (assignmentId: string, studentId: string) => {
    const target = assignments.find((a) => a.id === assignmentId);
    if (!target) return;

    const currentSub = target.submissions?.[studentId] || { submitted: false };
    const newSub = {
      ...currentSub,
      submitted: !currentSub.submitted,
      submittedDate: !currentSub.submitted ? new Date().toISOString().slice(0, 10) : undefined,
    };

    const updated = {
      ...target,
      submissions: {
        ...(target.submissions || {}),
        [studentId]: newSub,
      },
    };
    onUpdateAssignment(updated);
    setSelectedAssignment(updated);
  };

  // Update score or feedback for student
  const handleUpdateStudentScore = (
    assignmentId: string,
    studentId: string,
    score: number,
    feedback: string
  ) => {
    const target = assignments.find((a) => a.id === assignmentId);
    if (!target) return;

    const currentSub = target.submissions?.[studentId] || { submitted: true };
    const updated = {
      ...target,
      submissions: {
        ...(target.submissions || {}),
        [studentId]: {
          ...currentSub,
          submitted: true,
          score,
          feedback,
        },
      },
    };
    onUpdateAssignment(updated);
    setSelectedAssignment(updated);
  };

  const getStatusBadge = (st: AssignmentStatus) => {
    switch (st) {
      case 'Đã hoàn thành':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Sắp hết hạn':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Đang thực hiện':
        return 'bg-sky-50 text-sky-700 border-sky-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg md:text-xl font-bold text-slate-800 flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-600" />
              Giao và theo dõi bài tập ({assignments.length} bài)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Theo dõi tiến độ nộp bài tự luận, bài tập rèn kỹ năng viết và đọc hiểu Ngữ văn
            </p>
          </div>

          <button
            id="btn-add-assignment"
            type="button"
            onClick={handleOpenAdd}
            className="px-4 py-2 rounded-xl text-xs md:text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 shadow-sm transition-all flex items-center gap-2 cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            <span>+ Giao bài tập</span>
          </button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm theo tên bài, nội dung..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs md:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div>
            <select
              value={filterClass}
              onChange={(e) => setFilterClass(e.target.value)}
              className="w-full px-3 py-2 text-xs md:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-sky-500 text-slate-700"
            >
              <option value="all">Tất cả lớp</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  Lớp {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 text-xs md:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-sky-500 text-slate-700"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="Đang thực hiện">Đang thực hiện</option>
              <option value="Sắp hết hạn">Sắp hết hạn</option>
              <option value="Đã hoàn thành">Đã hoàn thành</option>
            </select>
          </div>
        </div>
      </div>

      {/* Assignments Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-3xs">
                <th className="py-3 px-4">Tên bài tập</th>
                <th className="py-3 px-4">Lớp</th>
                <th className="py-3 px-4">Ngày giao</th>
                <th className="py-3 px-4">Hạn nộp</th>
                <th className="py-3 px-4">Đã nộp</th>
                <th className="py-3 px-4">Chưa nộp</th>
                <th className="py-3 px-4">Trạng thái</th>
                <th className="py-3 px-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredAssignments.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400 text-xs">
                    Không tìm thấy bài tập nào phù hợp.
                  </td>
                </tr>
              ) : (
                filteredAssignments.map((a) => {
                  const classStudents = students.filter((s) => s.classId === a.classId);
                  const totalCount = classStudents.length;
                  const submittedCount = Object.values(a.submissions || {}).filter(
                    (sub) => sub.submitted
                  ).length;
                  const unfinishedCount = Math.max(0, totalCount - submittedCount);

                  return (
                    <tr
                      key={a.id}
                      onClick={() => setSelectedAssignment(a)}
                      className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                    >
                      <td className="py-3.5 px-4 font-bold text-slate-900 group-hover:text-indigo-700 transition-colors max-w-sm">
                        <div>{a.title}</div>
                        <div className="text-3xs font-normal text-slate-400 line-clamp-1 mt-0.5">
                          {a.requirements}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 font-bold">
                          {a.className}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 font-medium">{a.assignedDate}</td>
                      <td className="py-3.5 px-4 font-semibold text-slate-800">{a.dueDate}</td>
                      <td className="py-3.5 px-4 font-bold text-emerald-700">
                        {submittedCount} em
                      </td>
                      <td className="py-3.5 px-4 font-bold text-rose-600">
                        {unfinishedCount} em
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-2xs font-semibold border ${getStatusBadge(
                            a.status
                          )}`}
                        >
                          {a.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div
                          className="flex items-center justify-end gap-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            title="Xem chi tiết & chấm bài"
                            onClick={() => setSelectedAssignment(a)}
                            className="p-1.5 text-slate-400 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            title="Sửa bài tập"
                            onClick={(e) => handleOpenEdit(a, e)}
                            className="p-1.5 text-slate-400 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            title="Xóa bài tập"
                            onClick={(e) => handleDelete(a, e)}
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

      {/* Assignment Detail & Marking Drawer/Modal */}
      {selectedAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 bg-gradient-to-r from-[#0f2b48] to-[#1e4672] text-white flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded bg-white/20 text-amber-200 text-2xs font-bold">
                    Lớp {selectedAssignment.className}
                  </span>
                  <span className="text-2xs text-slate-300">
                    Hạn nộp: {selectedAssignment.dueDate}
                  </span>
                </div>
                <h3 className="text-lg font-bold">{selectedAssignment.title}</h3>
              </div>
              <button
                onClick={() => setSelectedAssignment(null)}
                className="text-slate-300 hover:text-white p-1.5 rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-700">
              {/* Requirements Box */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h4 className="font-bold text-slate-900 text-xs mb-1 uppercase tracking-wider">
                  Yêu cầu & Đề bài chi tiết
                </h4>
                <p className="text-slate-800 text-sm leading-relaxed whitespace-pre-line">
                  {selectedAssignment.requirements}
                </p>
              </div>

              {/* Submissions tracking list */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                    Danh sách nộp bài & Chấm điểm (Lớp {selectedAssignment.className})
                  </h4>
                  <span className="text-2xs text-slate-500">
                    Bấm để chuyển trạng thái nộp / chưa nộp
                  </span>
                </div>

                <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                  {students
                    .filter((s) => s.classId === selectedAssignment.classId)
                    .map((s) => {
                      const sub = selectedAssignment.submissions?.[s.id] || { submitted: false };
                      return (
                        <div
                          key={s.id}
                          className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white hover:bg-slate-50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() =>
                                handleToggleStudentSubmission(selectedAssignment.id, s.id)
                              }
                              className={`p-1.5 rounded-lg font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer ${
                                sub.submitted
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-rose-100 text-rose-800'
                              }`}
                            >
                              {sub.submitted ? (
                                <>
                                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                  <span>Đã nộp</span>
                                </>
                              ) : (
                                <>
                                  <XCircle className="w-4 h-4 text-rose-600" />
                                  <span>Chưa nộp</span>
                                </>
                              )}
                            </button>

                            <div>
                              <p className="font-bold text-slate-900 text-sm">{s.fullName}</p>
                              <p className="text-3xs text-slate-400 font-mono">
                                {s.studentCode} {sub.submittedDate && `• Ngày nộp: ${sub.submittedDate}`}
                              </p>
                            </div>
                          </div>

                          {/* Score & Feedback Inputs */}
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                              <span className="text-2xs font-semibold text-slate-500">Điểm:</span>
                              <input
                                type="number"
                                step="0.1"
                                min="0"
                                max="10"
                                placeholder="--"
                                value={sub.score ?? ''}
                                onChange={(e) =>
                                  handleUpdateStudentScore(
                                    selectedAssignment.id,
                                    s.id,
                                    parseFloat(e.target.value) || 0,
                                    sub.feedback || ''
                                  )
                                }
                                className="w-14 px-2 py-1 text-xs border border-slate-200 rounded-lg text-center font-bold text-amber-700 bg-slate-50 focus:bg-white"
                              />
                            </div>

                            <input
                              type="text"
                              placeholder="Lời phê ngắn của thầy..."
                              value={sub.feedback || ''}
                              onChange={(e) =>
                                handleUpdateStudentScore(
                                  selectedAssignment.id,
                                  s.id,
                                  sub.score ?? 0,
                                  e.target.value
                                )
                              }
                              className="w-48 sm:w-60 px-2.5 py-1 text-xs border border-slate-200 rounded-lg bg-slate-50 focus:bg-white"
                            />
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedAssignment(null)}
                className="px-5 py-2 rounded-xl text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800"
              >
                Hoàn tất xem bài
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Assignment Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="text-base font-bold text-slate-900">
                {editingAssignment ? 'Chỉnh sửa Bài tập' : 'Giao bài tập mới'}
              </h3>
              <button
                onClick={() => setIsFormOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tiêu đề bài tập <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="VD: Viết đoạn văn ngắn cảm nghĩ về hình tượng Thánh Gióng"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Giao cho Lớp <span className="text-rose-500">*</span>
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
                    Trạng thái
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as AssignmentStatus)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-sky-500 bg-white"
                  >
                    <option value="Đang thực hiện">Đang thực hiện</option>
                    <option value="Sắp hết hạn">Sắp hết hạn</option>
                    <option value="Đã hoàn thành">Đã hoàn thành</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Ngày giao
                  </label>
                  <input
                    type="date"
                    value={assignedDate}
                    onChange={(e) => setAssignedDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Hạn nộp bài
                  </label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Yêu cầu bài tập / Tiêu chí đánh giá
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Quy định độ dài, hình thức trình bày, yêu cầu nội dung và ngữ pháp..."
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
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
                  {editingAssignment ? 'Lưu thay đổi' : 'Giao bài tập'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
