import { useState, useRef, useEffect } from 'react';
import {
  Settings,
  User,
  School,
  BookOpen,
  Download,
  Upload,
  RotateCcw,
  Trash2,
  Volume2,
  VolumeX,
  FileCode2,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { AppData, GradeFormula, TeacherProfile } from '../types';
import { downloadStandaloneHtmlFile } from '../utils/exportHtml';

interface SettingsViewProps {
  appData: AppData;
  onUpdateTeacherProfile: (profile: TeacherProfile) => void;
  onUpdateFormula: (formula: GradeFormula) => void;
  onExportJson: () => void;
  onImportJson: (imported: AppData) => void;
  onResetDemoData: () => void;
  onClearAllData: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenConfirmModal: (opts: {
    title: string;
    message: string;
    onConfirm: () => void;
  }) => void;
  showToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export function SettingsView({
  appData,
  onUpdateTeacherProfile,
  onUpdateFormula,
  onExportJson,
  onImportJson,
  onResetDemoData,
  onClearAllData,
  soundEnabled,
  onToggleSound,
  onOpenConfirmModal,
  showToast,
}: SettingsViewProps) {
  const { teacherProfile, gradeFormula } = appData;

  const [name, setName] = useState(teacherProfile.name);
  const [subject, setSubject] = useState(teacherProfile.subject);
  const [school, setSchool] = useState(teacherProfile.school);
  const [email, setEmail] = useState(teacherProfile.email || '');
  const [phone, setPhone] = useState(teacherProfile.phone || '');

  useEffect(() => {
    setName(teacherProfile.name);
    setSubject(teacherProfile.subject);
    setSchool(teacherProfile.school);
    setEmail(teacherProfile.email || '');
    setPhone(teacherProfile.phone || '');
  }, [teacherProfile.name, teacherProfile.subject, teacherProfile.school, teacherProfile.email, teacherProfile.phone]);

  const [regularWeight, setRegularWeight] = useState(gradeFormula.regularWeight);
  const [midtermWeight, setMidtermWeight] = useState(gradeFormula.midtermWeight);
  const [finalWeight, setFinalWeight] = useState(gradeFormula.finalWeight);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateTeacherProfile({
      name: name.trim(),
      subject: subject.trim(),
      school: school.trim(),
      email: email.trim(),
      phone: phone.trim(),
    });
    showToast('Đã lưu thông tin hồ sơ giáo viên thành công!', 'success');
  };

  const handleSaveFormula = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateFormula({
      regularWeight: Number(regularWeight) || 1,
      midtermWeight: Number(midtermWeight) || 2,
      finalWeight: Number(finalWeight) || 3,
    });
    showToast('Đã cập nhật công thức tính điểm trung bình!', 'success');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.classes && parsed.students && parsed.teacherProfile) {
          onImportJson(parsed);
          showToast('Khôi phục dữ liệu từ tệp JSON thành công!', 'success');
        } else {
          showToast('Tệp JSON không đúng định dạng của Văn Học Hub.', 'error');
        }
      } catch (err) {
        showToast('Không thể đọc tệp sao lưu JSON.', 'error');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDownloadStandaloneHtml = () => {
    try {
      downloadStandaloneHtmlFile(appData);
      showToast('Đã tải xuống file HTML độc lập chạy không cần mạng!', 'success');
    } catch (e) {
      showToast('Có lỗi xảy ra khi tạo file HTML độc lập.', 'error');
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <h2 className="text-lg md:text-xl font-bold text-slate-800 flex items-center gap-2">
          <Settings className="w-5 h-5 text-slate-700" />
          Cài đặt hệ thống & Quản lý dữ liệu
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Tùy chỉnh thông tin người dùng, công thức tính điểm, sao lưu và xuất file chạy độc lập
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Box 1: Teacher Profile */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <User className="w-4 h-4 text-sky-700" />
            <h3 className="font-bold text-sm text-slate-900">Thông tin giáo viên phụ trách</h3>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Họ và tên giáo viên <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-sky-500 text-slate-800 font-medium"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Môn giảng dạy <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-sky-500 text-slate-800 font-medium"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Đơn vị công tác (Trường học) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={school}
                onChange={(e) => setSchool(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-sky-500 text-slate-800 font-medium"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Email liên hệ</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Số điện thoại</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl cursor-pointer"
              >
                Cập nhật thông tin
              </button>
            </div>
          </form>
        </div>

        {/* Box 2: Formula & Audio Settings */}
        <div className="space-y-6">
          {/* Grade Formula */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <BookOpen className="w-4 h-4 text-amber-600" />
              <h3 className="font-bold text-sm text-slate-900">
                Hệ số tính điểm trung bình (Thông tư 22)
              </h3>
            </div>

            <form onSubmit={handleSaveFormula} className="space-y-3 text-xs">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Hệ số TX</label>
                  <input
                    type="number"
                    min="1"
                    max="3"
                    value={regularWeight}
                    onChange={(e) => setRegularWeight(Number(e.target.value) || 1)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-center font-bold text-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Hệ số GK</label>
                  <input
                    type="number"
                    min="1"
                    max="4"
                    value={midtermWeight}
                    onChange={(e) => setMidtermWeight(Number(e.target.value) || 2)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-center font-bold text-sky-700"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Hệ số CK</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={finalWeight}
                    onChange={(e) => setFinalWeight(Number(e.target.value) || 3)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-center font-bold text-indigo-700"
                  />
                </div>
              </div>

              <p className="text-3xs text-slate-400">
                Điểm TB = (Tổng ĐĐGtx × {regularWeight} + ĐĐGgk × {midtermWeight} + ĐĐGck × {finalWeight}) / Tổng số hệ số.
              </p>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl cursor-pointer"
                >
                  Lưu cấu hình hệ số
                </button>
              </div>
            </form>
          </div>

          {/* Sound & Interface */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                  soundEnabled ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-400'
                }`}
              >
                {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              </div>
              <div>
                <p className="font-bold text-xs text-slate-900">Hiệu ứng âm thanh tương tác</p>
                <p className="text-2xs text-slate-400">
                  Âm thanh phản hồi êm dịu khi lưu dữ liệu, chuyển tab và thực hiện tác vụ
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onToggleSound}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                soundEnabled
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'bg-slate-200 text-slate-700'
              }`}
            >
              {soundEnabled ? 'Đang BẬT' : 'Đang TẮT'}
            </button>
          </div>
        </div>
      </div>

      {/* Box 3: Data Management & Offline Standalone HTML */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-6">
        <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Download className="w-4 h-4 text-emerald-600" />
              Quản lý sao lưu & Xuất tệp ứng dụng
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Dữ liệu được lưu trữ tự động trên máy tính qua LocalStorage và có thể sao lưu linh hoạt
            </p>
          </div>
        </div>

        {/* Big Standalone HTML Export Banner */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-50 via-amber-100/50 to-orange-50 border border-amber-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-amber-500 text-white font-bold text-3xs uppercase tracking-wider">
              <FileCode2 className="w-3.5 h-3.5" /> 1 Tệp HTML duy nhất
            </div>
            <h4 className="font-bold text-slate-900 text-sm">
              Tải phiên bản Web App Standalone (1 file HTML chạy Offline)
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Xuất toàn bộ hệ thống kèm dữ liệu hiện tại thành <strong>1 file HTML duy nhất</strong>. Thầy Tín có thể sao chép vào USB, gửi qua Zalo hoặc mở trực tiếp trên máy tính/điện thoại mà không cần cài đặt hay kết nối Internet.
            </p>
          </div>

          <button
            type="button"
            onClick={handleDownloadStandaloneHtml}
            className="px-5 py-2.5 rounded-xl font-bold text-xs bg-slate-900 text-amber-300 hover:bg-slate-800 shadow-md flex items-center gap-2 flex-shrink-0 cursor-pointer"
          >
            <Download className="w-4 h-4 text-amber-400" />
            <span>Tải tệp .HTML độc lập</span>
          </button>
        </div>

        {/* JSON Backup & Restore Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          {/* Export JSON */}
          <button
            type="button"
            onClick={onExportJson}
            className="p-4 rounded-xl border border-slate-200 hover:border-sky-300 bg-slate-50 hover:bg-sky-50/50 transition-all text-left group cursor-pointer"
          >
            <Download className="w-5 h-5 text-sky-700 mb-2 group-hover:scale-110 transition-transform" />
            <p className="font-bold text-xs text-slate-900">Sao lưu ra tệp JSON</p>
            <p className="text-3xs text-slate-500 mt-0.5">Tải tệp dữ liệu máy tính (.json)</p>
          </button>

          {/* Import JSON */}
          <div>
            <input
              type="file"
              ref={fileInputRef}
              accept=".json"
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full p-4 rounded-xl border border-slate-200 hover:border-emerald-300 bg-slate-50 hover:bg-emerald-50/50 transition-all text-left group cursor-pointer"
            >
              <Upload className="w-5 h-5 text-emerald-700 mb-2 group-hover:scale-110 transition-transform" />
              <p className="font-bold text-xs text-slate-900">Khôi phục từ JSON</p>
              <p className="text-3xs text-slate-500 mt-0.5">Nạp lại dữ liệu đã sao lưu</p>
            </button>
          </div>

          {/* Reset Demo Data */}
          <button
            type="button"
            onClick={() => {
              onOpenConfirmModal({
                title: 'Khôi phục dữ liệu mẫu gốc?',
                message:
                  'Hệ thống sẽ nạp lại toàn bộ dữ liệu mẫu ban đầu (các lớp 6A, 7A, 8A, 9A, danh sách học sinh và điểm mẫu). Dữ liệu bạn vừa chỉnh sửa sẽ bị ghi đè.',
                onConfirm: onResetDemoData,
              });
            }}
            className="p-4 rounded-xl border border-slate-200 hover:border-amber-300 bg-slate-50 hover:bg-amber-50/50 transition-all text-left group cursor-pointer"
          >
            <RotateCcw className="w-5 h-5 text-amber-700 mb-2 group-hover:scale-110 transition-transform" />
            <p className="font-bold text-xs text-slate-900">Nạp lại dữ liệu mẫu</p>
            <p className="text-3xs text-slate-500 mt-0.5">Khôi phục trạng thái chuẩn</p>
          </button>

          {/* Clear All Data */}
          <button
            type="button"
            onClick={() => {
              onOpenConfirmModal({
                title: 'Xóa toàn bộ dữ liệu?',
                message:
                  'CẢNH BÁO: Toàn bộ danh sách lớp, học sinh, điểm số, bài tập và lịch sử nhận xét sẽ bị xóa sạch khỏi bộ nhớ. Hãy cân nhắc sao lưu JSON trước khi thực hiện.',
                onConfirm: onClearAllData,
              });
            }}
            className="p-4 rounded-xl border border-rose-200 hover:border-rose-400 bg-rose-50/50 hover:bg-rose-100/50 transition-all text-left group cursor-pointer"
          >
            <Trash2 className="w-5 h-5 text-rose-600 mb-2 group-hover:scale-110 transition-transform" />
            <p className="font-bold text-xs text-rose-700">Xóa trắng dữ liệu</p>
            <p className="text-3xs text-rose-500 mt-0.5">Reset hệ thống về ban đầu</p>
          </button>
        </div>
      </div>
    </div>
  );
}
