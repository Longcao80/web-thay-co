import { useState, useRef, useEffect } from 'react';
import {
  Search,
  Bell,
  Volume2,
  VolumeX,
  Menu,
  CheckCheck,
  ExternalLink,
  BookOpen,
} from 'lucide-react';
import { NotificationItem, TeacherProfile } from '../types';

interface HeaderProps {
  currentTab: string;
  tabTitle: string;
  tabSubtitle?: string;
  notifications: NotificationItem[];
  soundEnabled: boolean;
  teacherProfile?: TeacherProfile;
  onToggleSound: () => void;
  onOpenSearch: () => void;
  onToggleMobileSidebar: () => void;
  onMarkNotificationRead: (id: string) => void;
  onClearAllNotifications: () => void;
  onNavigateToTab: (tab: string) => void;
}

export function Header({
  tabTitle,
  tabSubtitle,
  notifications,
  soundEnabled,
  teacherProfile,
  onToggleSound,
  onOpenSearch,
  onToggleMobileSidebar,
  onMarkNotificationRead,
  onClearAllNotifications,
  onNavigateToTab,
}: HeaderProps) {
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // Format Vietnamese date
  const now = new Date();
  const dateString = now.toLocaleDateString('vi-VN', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
  // Capitalize first letter (e.g. "Thứ Sáu, 18/09/2026")
  const formattedDate = dateString.charAt(0).toUpperCase() + dateString.slice(1);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header
      id="app-header"
      className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 md:px-8 py-3.5 flex items-center justify-between gap-4 transition-all"
    >
      {/* Left: Mobile hamburger & Page Title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          id="btn-mobile-menu"
          type="button"
          onClick={onToggleMobileSidebar}
          className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
          aria-label="Mở menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="min-w-0">
          <h1 className="text-lg md:text-xl font-bold text-slate-800 tracking-tight truncate flex items-center gap-2">
            <span>{tabTitle}</span>
          </h1>
          {tabSubtitle && (
            <p className="text-xs text-slate-500 truncate hidden sm:block">
              {tabSubtitle}
            </p>
          )}
        </div>
      </div>

      {/* Center: Search trigger */}
      <div className="flex-1 max-w-md hidden md:block">
        <button
          id="global-search-trigger"
          type="button"
          onClick={onOpenSearch}
          className="w-full flex items-center justify-between px-3.5 py-2 text-xs md:text-sm bg-slate-50 hover:bg-slate-100/90 text-slate-500 border border-slate-200 rounded-xl transition-all shadow-2xs group cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <Search className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
            <span>Tìm nhanh học sinh, lớp, bài học, bài tập...</span>
          </div>
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-2xs font-mono bg-white border border-slate-200 text-slate-400 rounded-md shadow-2xs">
            Ctrl K
          </kbd>
        </button>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
        {/* Mobile Search Button */}
        <button
          id="btn-mobile-search"
          type="button"
          onClick={onOpenSearch}
          className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100"
          aria-label="Tìm kiếm"
        >
          <Search className="w-5 h-5" />
        </button>

        {/* Current Date */}
        <div className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-600">
          <BookOpen className="w-3.5 h-3.5 text-amber-600" />
          <span>{formattedDate}</span>
        </div>

        {/* Sound feedback toggle */}
        <button
          id="btn-sound-toggle"
          type="button"
          onClick={onToggleSound}
          title={soundEnabled ? 'Âm thanh phản hồi: ĐANG BẬT' : 'Âm thanh phản hồi: ĐÃ TẮT'}
          className={`p-2 rounded-xl border transition-all cursor-pointer ${
            soundEnabled
              ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
              : 'bg-slate-50 text-slate-400 border-slate-200 hover:bg-slate-100'
          }`}
          aria-label="Bật tắt âm thanh"
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>

        {/* Notifications Popover */}
        <div className="relative" ref={notifRef}>
          <button
            id="btn-notifications"
            type="button"
            onClick={() => setShowNotifDropdown(!showNotifDropdown)}
            className="relative p-2 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 border border-slate-200 transition-all cursor-pointer"
            aria-label="Xem thông báo"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-2xs font-bold rounded-full flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifDropdown && (
            <div
              id="notifications-dropdown"
              className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150"
            >
              <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm text-slate-800">Thông báo quản lý</span>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 bg-rose-100 text-rose-700 text-xs font-semibold rounded-full">
                      {unreadCount} mới
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={onClearAllNotifications}
                    className="text-xs text-sky-700 hover:text-sky-800 font-medium flex items-center gap-1"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    Đọc tất cả
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-400">
                    Không có thông báo mới nào
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => onMarkNotificationRead(n.id)}
                      className={`p-3.5 hover:bg-slate-50/80 transition-colors cursor-pointer ${
                        !n.isRead ? 'bg-amber-50/40' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-medium text-xs text-slate-800">{n.title}</span>
                        <span className="text-2xs text-slate-400 whitespace-nowrap">{n.time}</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">{n.message}</p>
                    </div>
                  ))
                )}
              </div>

              <div className="p-2.5 bg-slate-50 border-t border-slate-200 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setShowNotifDropdown(false);
                    onNavigateToTab('assignments');
                  }}
                  className="text-xs text-slate-600 hover:text-slate-900 font-medium inline-flex items-center gap-1.5"
                >
                  <span>Xem nhanh bài tập cần chấm</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Teacher Avatar & Identity Badge */}
        {(() => {
          const tName = teacherProfile?.name || 'Kiều Cao Long';
          const tSubject = teacherProfile?.subject || 'Toán';
          const words = tName.trim().split(/\s+/);
          const initials = words.length > 1
            ? (words[0][0] + words[words.length - 1][0]).toUpperCase()
            : words[0]?.slice(0, 2).toUpperCase() || 'KL';

          return (
            <div className="flex items-center gap-2.5 pl-1.5 border-l border-slate-200">
              <div
                id="user-avatar"
                className="w-9 h-9 rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 text-amber-300 font-bold text-xs flex items-center justify-center shadow-xs border border-slate-700/30"
              >
                {initials}
              </div>
              <div className="hidden md:block text-left leading-tight">
                <p className="text-xs font-bold text-slate-800">{tName}</p>
                <p className="text-2xs text-slate-500">Giáo viên {tSubject}</p>
              </div>
            </div>
          );
        })()}
      </div>
    </header>
  );
}
