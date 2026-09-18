import { useState } from 'react';
import {
  BookOpen,
  Plus,
  Edit2,
  Trash2,
  Eye,
  X,
  Search,
  BookMarked,
  Clock,
  Calendar,
} from 'lucide-react';
import { AppData, Lesson, LessonCategory } from '../types';

interface LessonsViewProps {
  appData: AppData;
  onAddLesson: (lesson: Omit<Lesson, 'id'>) => void;
  onUpdateLesson: (lesson: Lesson) => void;
  onDeleteLesson: (lessonId: string) => void;
  onOpenConfirmModal: (opts: {
    title: string;
    message: string;
    onConfirm: () => void;
  }) => void;
}

const CATEGORIES: LessonCategory[] = ['Đọc hiểu', 'Văn học', 'Tiếng Việt', 'Viết', 'Nói và nghe'];

export function LessonsView({
  appData,
  onAddLesson,
  onUpdateLesson,
  onDeleteLesson,
  onOpenConfirmModal,
}: LessonsViewProps) {
  const { lessons } = appData;

  const [searchTerm, setSearchTerm] = useState('');
  const [filterGrade, setFilterGrade] = useState<number | 'all'>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [gradeLevel, setGradeLevel] = useState<number>(6);
  const [topic, setTopic] = useState('');
  const [category, setCategory] = useState<LessonCategory>('Đọc hiểu');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [durationMinutes, setDurationMinutes] = useState<number>(90);
  const [objectives, setObjectives] = useState('');
  const [mainContent, setMainContent] = useState('');
  const [notes, setNotes] = useState('');

  // Filter lessons
  const filteredLessons = lessons.filter((l) => {
    const matchesSearch =
      l.title.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
      l.topic.toLowerCase().includes(searchTerm.toLowerCase().trim());
    const matchesGrade = filterGrade === 'all' || l.gradeLevel === filterGrade;
    const matchesCategory = filterCategory === 'all' || l.category === filterCategory;
    return matchesSearch && matchesGrade && matchesCategory;
  });

  const handleOpenAdd = () => {
    setEditingLesson(null);
    setTitle('');
    setGradeLevel(6);
    setTopic('');
    setCategory('Đọc hiểu');
    setDate(new Date().toISOString().slice(0, 10));
    setDurationMinutes(90);
    setObjectives('');
    setMainContent('');
    setNotes('');
    setIsFormOpen(true);
  };

  const handleOpenEdit = (l: Lesson, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingLesson(l);
    setTitle(l.title);
    setGradeLevel(l.gradeLevel);
    setTopic(l.topic);
    setCategory(l.category);
    setDate(l.date);
    setDurationMinutes(l.durationMinutes);
    setObjectives(l.objectives);
    setMainContent(l.mainContent);
    setNotes(l.notes);
    setIsFormOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editingLesson) {
      onUpdateLesson({
        ...editingLesson,
        title: title.trim(),
        gradeLevel: Number(gradeLevel),
        topic: topic.trim(),
        category,
        date,
        durationMinutes: Number(durationMinutes),
        objectives: objectives.trim(),
        mainContent: mainContent.trim(),
        notes: notes.trim(),
      });
    } else {
      onAddLesson({
        title: title.trim(),
        gradeLevel: Number(gradeLevel),
        topic: topic.trim(),
        category,
        date,
        durationMinutes: Number(durationMinutes),
        objectives: objectives.trim(),
        mainContent: mainContent.trim(),
        notes: notes.trim(),
      });
    }
    setIsFormOpen(false);
  };

  const handleDelete = (l: Lesson, e: React.MouseEvent) => {
    e.stopPropagation();
    onOpenConfirmModal({
      title: `Xóa bài học?`,
      message: `Bạn có chắc chắn muốn xóa bài học "${l.title}"?`,
      onConfirm: () => {
        onDeleteLesson(l.id);
        if (selectedLesson?.id === l.id) setSelectedLesson(null);
      },
    });
  };

  const getCategoryBadgeClass = (cat: LessonCategory) => {
    switch (cat) {
      case 'Đọc hiểu':
        return 'bg-sky-50 text-sky-700 border-sky-200';
      case 'Văn học':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Tiếng Việt':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Viết':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Nói và nghe':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top action header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg md:text-xl font-bold text-slate-800 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-600" />
              Kế hoạch bài dạy môn Ngữ văn ({lessons.length} bài)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Soạn giảng theo mạch kiến thức: Đọc hiểu, Văn học, Tiếng Việt, Viết, Nói và nghe
            </p>
          </div>

          <button
            id="btn-add-lesson"
            type="button"
            onClick={handleOpenAdd}
            className="px-4 py-2 rounded-xl text-xs md:text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 shadow-sm transition-all flex items-center gap-2 cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            <span>+ Thêm bài học</span>
          </button>
        </div>

        {/* Filter bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm theo tên bài học, chủ đề..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs md:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div>
            <select
              value={filterGrade}
              onChange={(e) => setFilterGrade(e.target.value === 'all' ? 'all' : Number(e.target.value))}
              className="w-full px-3 py-2 text-xs md:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-sky-500 text-slate-700"
            >
              <option value="all">Tất cả khối lớp</option>
              <option value={6}>Khối 6</option>
              <option value={7}>Khối 7</option>
              <option value={8}>Khối 8</option>
              <option value={9}>Khối 9</option>
            </select>
          </div>

          <div>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-3 py-2 text-xs md:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-sky-500 text-slate-700"
            >
              <option value="all">Tất cả phân loại chuyên môn</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Lessons Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredLessons.length === 0 ? (
          <div className="col-span-full bg-white p-12 rounded-2xl border border-slate-200 text-center text-slate-400 text-xs">
            Không tìm thấy bài học nào phù hợp với điều kiện tìm kiếm.
          </div>
        ) : (
          filteredLessons.map((l) => (
            <div
              key={l.id}
              onClick={() => setSelectedLesson(l)}
              className="bg-white rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all p-5 flex flex-col justify-between cursor-pointer group"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 font-bold text-2xs">
                      Khối {l.gradeLevel}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-2xs font-semibold border ${getCategoryBadgeClass(l.category)}`}>
                      {l.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100" onClick={(e) => e.stopPropagation()}>
                    <button
                      title="Sửa bài học"
                      onClick={(e) => handleOpenEdit(l, e)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      title="Xóa bài học"
                      onClick={(e) => handleDelete(l, e)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h3 className="text-sm md:text-base font-bold text-slate-900 mt-2.5 group-hover:text-indigo-700 transition-colors line-clamp-2">
                  {l.title}
                </h3>

                <p className="text-2xs text-slate-500 mt-1 flex items-center gap-1">
                  <BookMarked className="w-3 h-3 text-slate-400" />
                  <span>Chủ đề: {l.topic}</span>
                </p>

                <p className="text-xs text-slate-600 mt-3 line-clamp-3 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <strong className="text-slate-800">Mục tiêu:</strong> {l.objectives}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-2xs text-slate-500">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" /> {l.date}
                </span>
                <span className="flex items-center gap-1 font-medium">
                  <Clock className="w-3.5 h-3.5 text-slate-400" /> {l.durationMinutes} phút
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* View Lesson Details Modal */}
      {selectedLesson && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
            <div className="p-5 bg-gradient-to-r from-[#0f2b48] to-[#1e4672] text-white flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="px-2 py-0.5 rounded bg-white/20 text-amber-200 text-2xs font-bold">
                    Khối {selectedLesson.gradeLevel}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-white/20 text-white text-2xs font-semibold">
                    {selectedLesson.category}
                  </span>
                  <span className="text-2xs text-slate-300">
                    {selectedLesson.durationMinutes} phút • {selectedLesson.date}
                  </span>
                </div>
                <h3 className="text-lg font-bold">{selectedLesson.title}</h3>
                <p className="text-xs text-amber-200 mt-0.5">Chủ đề: {selectedLesson.topic}</p>
              </div>
              <button
                onClick={() => setSelectedLesson(null)}
                className="text-slate-300 hover:text-white p-1.5 rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs text-slate-700 leading-relaxed">
              <div className="bg-sky-50/60 p-4 rounded-xl border border-sky-100">
                <h4 className="font-bold text-sky-900 text-xs mb-1 uppercase tracking-wider">
                  Mục tiêu bài dạy (Yêu cầu cần đạt)
                </h4>
                <p className="text-slate-700 text-sm">{selectedLesson.objectives}</p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-xs mb-1.5 uppercase tracking-wider">
                  Nội dung trọng tâm & Hoạt động dạy học
                </h4>
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-sm whitespace-pre-line text-slate-800">
                  {selectedLesson.mainContent}
                </div>
              </div>

              {selectedLesson.notes && (
                <div>
                  <h4 className="font-bold text-slate-900 text-xs mb-1 uppercase tracking-wider">
                    Ghi chú & Đồ dùng dạy học
                  </h4>
                  <p className="p-3 bg-amber-50/50 rounded-xl border border-amber-100 text-xs text-amber-900 italic">
                    "{selectedLesson.notes}"
                  </p>
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedLesson(null)}
                className="px-5 py-2 rounded-xl text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Lesson Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="text-base font-bold text-slate-900">
                {editingLesson ? 'Chỉnh sửa Bài học Ngữ văn' : 'Thêm Bài học mới'}
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
                  Tên bài học <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="VD: Đọc hiểu văn bản: Thánh Gióng"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
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

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Phân loại chuyên môn <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as LessonCategory)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-sky-500 bg-white"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Chủ đề bài học
                  </label>
                  <input
                    type="text"
                    placeholder="VD: Truyền thuyết dân gian"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Ngày giảng dạy
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mục tiêu bài dạy (Kiến thức, Năng lực, Phẩm chất)
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Mô tả yêu cầu cần đạt về năng lực đọc hiểu, viết, nói..."
                  value={objectives}
                  onChange={(e) => setObjectives(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-sky-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nội dung chính / Tiến trình các bước
                </label>
                <textarea
                  rows={3}
                  placeholder="Các hoạt động khởi động, hình thành kiến thức, luyện tập..."
                  value={mainContent}
                  onChange={(e) => setMainContent(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-sky-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Ghi chú sư phạm & Đồ dùng
                </label>
                <input
                  type="text"
                  placeholder="Tranh ảnh minh họa, máy chiếu, bảng phụ..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-sky-500"
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
                  {editingLesson ? 'Lưu thay đổi' : 'Tạo bài học'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
