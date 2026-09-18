import { useState } from 'react';
import {
  MessageSquareQuote,
  Plus,
  Trash2,
  Send,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { AppData, StudentComment } from '../types';

interface CommentsViewProps {
  appData: AppData;
  onAddComment: (comment: Omit<StudentComment, 'id'>) => void;
  onDeleteComment: (commentId: string) => void;
  onOpenConfirmModal: (opts: {
    title: string;
    message: string;
    onConfirm: () => void;
  }) => void;
}

const QUICK_COMMENTS = [
  'Có ý thức học tập tốt, tiếp thu bài nhanh và chăm chỉ chuẩn bị bài.',
  'Cần rèn luyện thêm kỹ năng viết đoạn văn và liên kết câu mạch lạc.',
  'Tích cực phát biểu xây dựng bài, nhiệt tình trong các tiết học Văn.',
  'Cần chú ý lỗi chính tả và cách dùng từ ngữ chính xác hơn trong bài viết.',
  'Chăm chỉ, hoàn thành bài tập về nhà đúng hạn, chữ viết nề nếp cẩn thận.',
  'Đọc diễn cảm tốt, có năng khiếu cảm thụ văn học nhạy bén, sâu sắc.',
  'Cần tập trung hơn trong giờ nghe giảng và ghi chép bài đầy đủ.',
  'Có sự tiến bộ rõ rệt trong bài viết tập làm văn gần đây.',
];

export function CommentsView({
  appData,
  onAddComment,
  onDeleteComment,
  onOpenConfirmModal,
}: CommentsViewProps) {
  const { classes, students, comments } = appData;

  const [selectedClassId, setSelectedClassId] = useState<string>(classes[0]?.id || '');
  const classStudents = students.filter((s) => s.classId === selectedClassId);
  const [selectedStudentId, setSelectedStudentId] = useState<string>(classStudents[0]?.id || '');

  const [commentText, setCommentText] = useState('');
  const [commentDate, setCommentDate] = useState(new Date().toISOString().slice(0, 10));

  // Sync selectedStudentId if class changes
  const handleClassChange = (newClassId: string) => {
    setSelectedClassId(newClassId);
    const firstStudent = students.find((s) => s.classId === newClassId);
    setSelectedStudentId(firstStudent?.id || '');
  };

  const currentStudent = students.find((s) => s.id === selectedStudentId);
  const studentComments = comments.filter((c) => c.studentId === selectedStudentId);

  const handleAppendQuickComment = (quick: string) => {
    if (!commentText.trim()) {
      setCommentText(quick);
    } else {
      setCommentText((prev) => `${prev} ${quick}`);
    }
  };

  const handleSendComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !currentStudent) return;

    onAddComment({
      studentId: currentStudent.id,
      studentName: currentStudent.fullName,
      classId: selectedClassId,
      date: commentDate,
      content: commentText.trim(),
      author: 'Thầy Kiều Cao Long',
    });

    setCommentText('');
  };

  const handleDelete = (comment: StudentComment) => {
    onOpenConfirmModal({
      title: 'Xóa nhận xét?',
      message: `Bạn có chắc chắn muốn xóa nhận xét ngày ${comment.date} của học sinh ${comment.studentName}?`,
      onConfirm: () => onDeleteComment(comment.id),
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <div>
          <h2 className="text-lg md:text-xl font-bold text-slate-800 flex items-center gap-2">
            <MessageSquareQuote className="w-5 h-5 text-sky-700" />
            Nhận xét & Đánh giá quá trình học tập
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Ghi nhận những tiến bộ, điểm mạnh và nhắc nhở học sinh THCS rèn luyện kỹ năng Ngữ văn
          </p>
        </div>

        {/* Selection Bar: Class & Student */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              1. Chọn Lớp học
            </label>
            <select
              value={selectedClassId}
              onChange={(e) => handleClassChange(e.target.value)}
              className="w-full px-3 py-2 text-xs md:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-sky-500 text-slate-800 font-bold"
            >
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  Lớp {c.name} (Khối {c.gradeLevel})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              2. Chọn Học sinh nhận xét
            </label>
            <select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="w-full px-3 py-2 text-xs md:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-sky-500 text-slate-800 font-bold"
            >
              {classStudents.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.fullName} ({s.studentCode})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main split: Input Box on Left, History on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left: Comment Editor & Quick Templates (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Plus className="w-4 h-4 text-sky-700" />
                Viết lời phê cho: <span className="text-sky-700">{currentStudent?.fullName || '...'}</span>
              </span>
              <div className="flex items-center gap-1 text-xs text-slate-500">
                <Calendar className="w-3.5 h-3.5" />
                <input
                  type="date"
                  value={commentDate}
                  onChange={(e) => setCommentDate(e.target.value)}
                  className="px-2 py-0.5 border border-slate-200 rounded-lg text-xs"
                />
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSendComment} className="space-y-3">
              <textarea
                rows={4}
                required
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Nhập nội dung nhận xét của Thầy Kiều Cao Long vào đây (hoặc bấm chọn các mẫu câu tiện ích bên dưới)..."
                className="w-full p-3.5 text-xs md:text-sm border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-sky-500 focus:bg-white resize-none leading-relaxed"
              />

              <div className="flex items-center justify-between pt-1">
                <span className="text-2xs text-slate-400">
                  Ký tên: <strong className="text-slate-700">Thầy Kiều Cao Long</strong>
                </span>

                <button
                  type="submit"
                  disabled={!commentText.trim()}
                  className="px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5 text-amber-400" />
                  <span>Lưu lời nhận xét</span>
                </button>
              </div>
            </form>
          </div>

          {/* Quick Comment Templates Bank */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 mb-3 uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Ngân hàng mẫu nhận xét nhanh (Click để chèn)
            </div>

            <div className="flex flex-wrap gap-2">
              {QUICK_COMMENTS.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleAppendQuickComment(item)}
                  className="text-left px-3 py-1.5 text-2xs rounded-xl bg-slate-50 hover:bg-sky-50 text-slate-700 hover:text-sky-800 border border-slate-200 hover:border-sky-300 transition-colors cursor-pointer"
                >
                  + {item}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Comment History of this student (2 cols) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col">
          <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-800">
              Lịch sử nhận xét ({studentComments.length})
            </h3>
            <span className="text-2xs text-slate-400">
              {currentStudent?.fullName}
            </span>
          </div>

          <div className="mt-4 space-y-3 flex-1 overflow-y-auto max-h-[460px]">
            {studentComments.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs">
                Chưa có nhận xét nào trước đây cho học sinh này.
              </div>
            ) : (
              studentComments.map((c) => (
                <div
                  key={c.id}
                  className="p-3.5 rounded-xl border border-slate-200 bg-amber-50/30 hover:bg-amber-50/60 transition-colors group relative"
                >
                  <div className="flex items-center justify-between text-2xs text-slate-500 mb-1">
                    <span className="font-bold text-slate-800">{c.author || 'Thầy Kiều Cao Long'}</span>
                    <span>{c.date}</span>
                  </div>

                  <p className="text-xs text-slate-800 leading-relaxed mt-1 whitespace-pre-line">
                    {c.content}
                  </p>

                  <button
                    title="Xóa nhận xét này"
                    onClick={() => handleDelete(c)}
                    className="absolute top-2.5 right-2 opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-600 rounded-md transition-opacity cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
