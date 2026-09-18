import { useState, useEffect, useRef } from 'react';
import { Search, X, Users, GraduationCap, BookOpen, FileText, ArrowRight } from 'lucide-react';
import { AppData } from '../types';

interface QuickSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  appData: AppData;
  onNavigate: (tab: string, targetId?: string) => void;
}

export function QuickSearchModal({ isOpen, onClose, appData, onNavigate }: QuickSearchModalProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const normalized = query.toLowerCase().trim();

  const matchingStudents = normalized
    ? appData.students.filter(
        (s) =>
          s.fullName.toLowerCase().includes(normalized) ||
          s.studentCode.toLowerCase().includes(normalized) ||
          s.className.toLowerCase().includes(normalized)
      )
    : [];

  const matchingClasses = normalized
    ? appData.classes.filter(
        (c) =>
          c.name.toLowerCase().includes(normalized) ||
          c.room.toLowerCase().includes(normalized) ||
          `khối ${c.gradeLevel}`.includes(normalized)
      )
    : [];

  const matchingLessons = normalized
    ? appData.lessons.filter(
        (l) =>
          l.title.toLowerCase().includes(normalized) ||
          l.topic.toLowerCase().includes(normalized) ||
          l.category.toLowerCase().includes(normalized)
      )
    : [];

  const matchingAssignments = normalized
    ? appData.assignments.filter(
        (a) =>
          a.title.toLowerCase().includes(normalized) ||
          a.className.toLowerCase().includes(normalized) ||
          a.requirements.toLowerCase().includes(normalized)
      )
    : [];

  const totalResults =
    matchingStudents.length +
    matchingClasses.length +
    matchingLessons.length +
    matchingAssignments.length;

  return (
    <div
      id="quick-search-modal"
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-900/60 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Input bar */}
        <div className="p-4 border-b border-slate-200 flex items-center gap-3 bg-slate-50">
          <Search className="w-5 h-5 text-slate-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm theo tên học sinh, lớp 6A-9A, bài học, bài tập văn học..."
            className="flex-1 bg-transparent text-sm md:text-base text-slate-800 placeholder-slate-400 focus:outline-hidden"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs text-slate-400 hover:text-slate-600 px-1.5 py-1 rounded"
            >
              Xóa
            </button>
          )}
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-200/60"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Area */}
        <div className="overflow-y-auto p-4 space-y-4">
          {!query ? (
            <div className="text-center py-10 text-slate-400 text-xs">
              <p className="font-medium text-slate-500 text-sm mb-1">Tra cứu nhanh dữ liệu Ngữ văn</p>
              <p>Nhập tên học sinh (ví dụ: An, Chi, Đức...), lớp (6A, 7A...), bài học hoặc bài tập</p>
            </div>
          ) : totalResults === 0 ? (
            <div className="text-center py-10 text-slate-400 text-xs">
              Không tìm thấy kết quả phù hợp với "{query}"
            </div>
          ) : (
            <>
              {/* Students */}
              {matchingStudents.length > 0 && (
                <div>
                  <p className="text-2xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-sky-600" />
                    Học sinh ({matchingStudents.length})
                  </p>
                  <div className="space-y-1.5">
                    {matchingStudents.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => {
                          onNavigate('students', s.id);
                          onClose();
                        }}
                        className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 border border-slate-100 transition-colors text-left group cursor-pointer"
                      >
                        <div>
                          <p className="text-xs md:text-sm font-bold text-slate-800 group-hover:text-sky-700">
                            {s.fullName}{' '}
                            <span className="text-2xs font-normal text-slate-400">
                              ({s.studentCode})
                            </span>
                          </p>
                          <p className="text-2xs text-slate-500">
                            Lớp: <span className="font-semibold text-slate-700">{s.className}</span> | {s.gender} | SĐT PH: {s.parentPhone}
                          </p>
                        </div>
                        <span className="text-xs text-slate-400 group-hover:text-sky-600 flex items-center gap-1">
                          Hồ sơ <ArrowRight className="w-3 h-3" />
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Classes */}
              {matchingClasses.length > 0 && (
                <div>
                  <p className="text-2xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-amber-600" />
                    Lớp học ({matchingClasses.length})
                  </p>
                  <div className="space-y-1.5">
                    {matchingClasses.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => {
                          onNavigate('classes', c.id);
                          onClose();
                        }}
                        className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 border border-slate-100 transition-colors text-left group cursor-pointer"
                      >
                        <div>
                          <p className="text-xs md:text-sm font-bold text-slate-800 group-hover:text-amber-700">
                            Lớp {c.name} - Khối {c.gradeLevel}
                          </p>
                          <p className="text-2xs text-slate-500">{c.room} • {c.academicYear}</p>
                        </div>
                        <span className="text-xs text-slate-400 group-hover:text-amber-600 flex items-center gap-1">
                          Chi tiết <ArrowRight className="w-3 h-3" />
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Lessons */}
              {matchingLessons.length > 0 && (
                <div>
                  <p className="text-2xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                    Bài học ({matchingLessons.length})
                  </p>
                  <div className="space-y-1.5">
                    {matchingLessons.map((l) => (
                      <button
                        key={l.id}
                        type="button"
                        onClick={() => {
                          onNavigate('lessons', l.id);
                          onClose();
                        }}
                        className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 border border-slate-100 transition-colors text-left group cursor-pointer"
                      >
                        <div>
                          <p className="text-xs md:text-sm font-bold text-slate-800 group-hover:text-emerald-700">
                            {l.title}
                          </p>
                          <p className="text-2xs text-slate-500">
                            Khối {l.gradeLevel} • {l.category} • {l.topic}
                          </p>
                        </div>
                        <span className="text-xs text-slate-400 group-hover:text-emerald-600 flex items-center gap-1">
                          Xem bài <ArrowRight className="w-3 h-3" />
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Assignments */}
              {matchingAssignments.length > 0 && (
                <div>
                  <p className="text-2xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-indigo-600" />
                    Bài tập ({matchingAssignments.length})
                  </p>
                  <div className="space-y-1.5">
                    {matchingAssignments.map((a) => (
                      <button
                        key={a.id}
                        type="button"
                        onClick={() => {
                          onNavigate('assignments', a.id);
                          onClose();
                        }}
                        className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 border border-slate-100 transition-colors text-left group cursor-pointer"
                      >
                        <div>
                          <p className="text-xs md:text-sm font-bold text-slate-800 group-hover:text-indigo-700">
                            {a.title}
                          </p>
                          <p className="text-2xs text-slate-500">
                            Lớp {a.className} • Hạn nộp: {a.dueDate} • {a.status}
                          </p>
                        </div>
                        <span className="text-xs text-slate-400 group-hover:text-indigo-600 flex items-center gap-1">
                          Theo dõi <ArrowRight className="w-3 h-3" />
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-3xs text-slate-400 flex items-center justify-between">
          <span>Nhấn ESC để đóng</span>
          <span>Hệ thống quản trị Văn Học Hub</span>
        </div>
      </div>
    </div>
  );
}
