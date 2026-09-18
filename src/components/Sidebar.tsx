import {
  LayoutDashboard,
  GraduationCap,
  Users,
  CalendarCheck,
  BookOpen,
  FileText,
  Award,
  MessageSquareQuote,
  TrendingUp,
  Settings,
  Feather,
  X,
  Sparkles,
  Calculator,
} from 'lucide-react';
import { TeacherProfile } from '../types';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  teacherProfile?: TeacherProfile;
}

interface MenuItem {
  id: string;
  name: string;
  icon: React.ElementType;
  badge?: string;
}

export const MENU_ITEMS: MenuItem[] = [
  { id: 'dashboard', name: '1. Tổng quan', icon: LayoutDashboard },
  { id: 'classes', name: '2. Lớp học', icon: GraduationCap },
  { id: 'students', name: '3. Học sinh', icon: Users },
  { id: 'attendance', name: '4. Chuyên cần', icon: CalendarCheck },
  { id: 'lessons', name: '5. Bài học', icon: BookOpen },
  { id: 'assignments', name: '6. Bài tập', icon: FileText },
  { id: 'grades', name: '7. Điểm số', icon: Award },
  { id: 'comments', name: '8. Nhận xét', icon: MessageSquareQuote },
  { id: 'progress', name: '9. Tiến độ học tập', icon: TrendingUp },
  { id: 'settings', name: '10. Cài đặt', icon: Settings },
];

export function Sidebar({
  currentTab,
  onSelectTab,
  isMobileOpen,
  onCloseMobile,
  teacherProfile,
}: SidebarProps) {
  return (
    <>
      {/* Mobile backdrop overlay */}
      {isMobileOpen && (
        <div
          id="sidebar-backdrop"
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs lg:hidden transition-opacity"
        />
      )}

      {/* Main Sidebar */}
      <aside
        id="app-sidebar"
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-[#0d2238] text-slate-200 flex flex-col border-r border-slate-800/80 shadow-2xl lg:static lg:shadow-none transition-transform duration-200 ease-in-out ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top Header / Brand identity */}
        <div className="p-5 border-b border-slate-800/80 bg-[#0a1b2d] flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center text-slate-950 shadow-md shadow-amber-500/20 flex-shrink-0 mt-0.5">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-extrabold tracking-wide text-white uppercase font-serif">
                  TOÁN THCS
                </span>
              </div>
              <p className="text-xs font-semibold text-amber-300 mt-1">{teacherProfile?.name || 'Kiều Cao Long'}</p>
              <p className="text-2xs text-slate-400">Giáo viên {teacherProfile?.subject || 'Toán'}</p>
              <p className="text-2xs text-slate-400">{teacherProfile?.school || 'THCS Thạch Thất 2'}</p>
            </div>
          </div>

          {/* Close button on mobile */}
          <button
            onClick={onCloseMobile}
            className="lg:hidden text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10"
            aria-label="Đóng menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Demo status tag */}
        <div className="mx-4 mt-3 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-between text-2xs text-amber-300 font-medium">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-amber-400" />
            DỮ LIỆU DEMO CHUẨN
          </span>
          <span className="bg-amber-500/20 px-1.5 py-0.5 rounded text-3xs font-bold uppercase tracking-wider text-amber-200">
            Offline
          </span>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
          <p className="px-3 py-1.5 text-3xs font-bold text-slate-400 tracking-wider uppercase">
            Chức năng quản trị
          </p>

          {MENU_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                id={`sidebar-tab-${item.id}`}
                type="button"
                onClick={() => {
                  onSelectTab(item.id);
                  onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs md:text-sm font-medium transition-all group cursor-pointer ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/10'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                      isActive ? 'text-slate-950' : 'text-amber-400/80 group-hover:text-amber-300'
                    }`}
                  />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-3xs px-2 py-0.5 rounded-full font-semibold ${
                      isActive
                        ? 'bg-slate-900 text-amber-300'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom footer quote */}
        <div className="p-4 border-t border-slate-800/80 bg-[#0a1b2d] text-center">
          <p className="text-3xs italic text-slate-400 line-clamp-2">
            "Toán học là chiếc chìa khóa mở cánh cửa tư duy và sáng tạo"
          </p>
          <div className="mt-2 text-3xs text-slate-400 font-mono">
            Năm học 2026 - 2027
          </div>
        </div>
      </aside>
    </>
  );
}
