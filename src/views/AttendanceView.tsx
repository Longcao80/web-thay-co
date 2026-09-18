import { useState } from 'react';
import {
  CalendarCheck,
  CheckCircle2,
  XCircle,
  Clock,
  HelpCircle,
  Save,
  CheckCheck,
} from 'lucide-react';
import { AppData, AttendanceRecord, AttendanceStatus } from '../types';

interface AttendanceViewProps {
  appData: AppData;
  onSaveAttendance: (records: AttendanceRecord[]) => void;
}

export function AttendanceView({ appData, onSaveAttendance }: AttendanceViewProps) {
  const { classes, students, attendance } = appData;

  const todayStr = new Date().toISOString().slice(0, 10);
  const [selectedClassId, setSelectedClassId] = useState<string>(classes[0]?.id || '');
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);

  // Local editable attendance state: key is studentId -> status and note
  const classStudents = students.filter((s) => s.classId === selectedClassId);

  // Initialize local attendance map from existing records or default to 'present'
  const [localStatuses, setLocalStatuses] = useState<
    Record<string, { status: AttendanceStatus; note: string }>
  >(() => {
    const map: Record<string, { status: AttendanceStatus; note: string }> = {};
    classStudents.forEach((s) => {
      const rec = attendance.find((a) => a.classId === selectedClassId && a.date === selectedDate && a.studentId === s.id);
      map[s.id] = {
        status: rec ? rec.status : 'present',
        note: rec?.note || '',
      };
    });
    return map;
  });

  // When class or date changes, re-sync local state
  const handleClassChange = (newClassId: string) => {
    setSelectedClassId(newClassId);
    const targetStudents = students.filter((s) => s.classId === newClassId);
    const map: Record<string, { status: AttendanceStatus; note: string }> = {};
    targetStudents.forEach((s) => {
      const rec = attendance.find((a) => a.classId === newClassId && a.date === selectedDate && a.studentId === s.id);
      map[s.id] = {
        status: rec ? rec.status : 'present',
        note: rec?.note || '',
      };
    });
    setLocalStatuses(map);
  };

  const handleDateChange = (newDate: string) => {
    setSelectedDate(newDate);
    const map: Record<string, { status: AttendanceStatus; note: string }> = {};
    classStudents.forEach((s) => {
      const rec = attendance.find((a) => a.classId === selectedClassId && a.date === newDate && a.studentId === s.id);
      map[s.id] = {
        status: rec ? rec.status : 'present',
        note: rec?.note || '',
      };
    });
    setLocalStatuses(map);
  };

  const handleSetStatus = (studentId: string, status: AttendanceStatus) => {
    setLocalStatuses((prev) => ({
      ...prev,
      [studentId]: {
        ...(prev[studentId] || { note: '' }),
        status,
      },
    }));
  };

  const handleSetNote = (studentId: string, note: string) => {
    setLocalStatuses((prev) => ({
      ...prev,
      [studentId]: {
        ...(prev[studentId] || { status: 'present' }),
        note,
      },
    }));
  };

  const handleMarkAllPresent = () => {
    const updated: Record<string, { status: AttendanceStatus; note: string }> = {};
    classStudents.forEach((s) => {
      updated[s.id] = {
        status: 'present',
        note: '',
      };
    });
    setLocalStatuses(updated);
  };

  const handleSave = () => {
    const newRecords: AttendanceRecord[] = classStudents.map((s) => {
      const st = localStatuses[s.id]?.status || 'present';
      const nt = localStatuses[s.id]?.note || '';
      return {
        id: `att-${selectedClassId}-${selectedDate}-${s.id}`,
        date: selectedDate,
        classId: selectedClassId,
        studentId: s.id,
        status: st,
        note: nt,
      };
    });
    onSaveAttendance(newRecords);
  };

  // Compute live statistics for selected class & date
  let countPresent = 0;
  let countAbsent = 0;
  let countLate = 0;
  let countExcused = 0;

  classStudents.forEach((s) => {
    const st = localStatuses[s.id]?.status || 'present';
    if (st === 'present') countPresent++;
    else if (st === 'absent') countAbsent++;
    else if (st === 'late') countLate++;
    else if (st === 'excused') countExcused++;
  });

  const totalCurrent = classStudents.length;
  const attendanceRate =
    totalCurrent > 0
      ? Math.round(((countPresent + countLate * 0.8 + countExcused * 0.9) / totalCurrent) * 100)
      : 100;

  return (
    <div className="space-y-6">
      {/* Top Header & Selection Controls */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg md:text-xl font-bold text-slate-800 flex items-center gap-2">
              <CalendarCheck className="w-5 h-5 text-amber-600" />
              Điểm danh chuyên cần theo buổi học
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Theo dõi tình hình đi học của học sinh, phát hiện sớm các trường hợp vắng hoặc muộn
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleMarkAllPresent}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <CheckCheck className="w-4 h-4 text-emerald-600" />
              <span>Đánh dấu tất cả có mặt</span>
            </button>
            <button
              id="btn-save-attendance"
              type="button"
              onClick={handleSave}
              className="px-4 py-2 rounded-xl text-xs md:text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 shadow-sm transition-all flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4 text-amber-400" />
              <span>Lưu điểm danh</span>
            </button>
          </div>
        </div>

        {/* Select Class and Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Chọn Lớp học
            </label>
            <select
              value={selectedClassId}
              onChange={(e) => handleClassChange(e.target.value)}
              className="w-full px-3 py-2 text-xs md:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-sky-500 text-slate-700 font-medium"
            >
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  Lớp {c.name} (Khối {c.gradeLevel} - {c.room})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Ngày học
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => handleDateChange(e.target.value)}
              className="w-full px-3 py-2 text-xs md:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-sky-500 text-slate-700 font-medium"
            />
          </div>
        </div>
      </div>

      {/* Live Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
        <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-200/80">
          <div className="flex items-center gap-2 text-emerald-800 text-2xs font-bold uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Có mặt
          </div>
          <p className="text-2xl font-extrabold text-emerald-900 mt-2">
            {countPresent} <span className="text-xs font-medium text-emerald-700">/ {totalCurrent}</span>
          </p>
        </div>

        <div className="bg-rose-50/60 p-4 rounded-2xl border border-rose-200/80">
          <div className="flex items-center gap-2 text-rose-800 text-2xs font-bold uppercase tracking-wider">
            <XCircle className="w-4 h-4 text-rose-600" /> Vắng không phép
          </div>
          <p className="text-2xl font-extrabold text-rose-900 mt-2">
            {countAbsent} <span className="text-xs font-medium text-rose-700">em</span>
          </p>
        </div>

        <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200/80">
          <div className="flex items-center gap-2 text-amber-800 text-2xs font-bold uppercase tracking-wider">
            <Clock className="w-4 h-4 text-amber-600" /> Đi muộn
          </div>
          <p className="text-2xl font-extrabold text-amber-900 mt-2">
            {countLate} <span className="text-xs font-medium text-amber-700">em</span>
          </p>
        </div>

        <div className="bg-sky-50/60 p-4 rounded-2xl border border-sky-200/80">
          <div className="flex items-center gap-2 text-sky-800 text-2xs font-bold uppercase tracking-wider">
            <HelpCircle className="w-4 h-4 text-sky-600" /> Có phép
          </div>
          <p className="text-2xl font-extrabold text-sky-900 mt-2">
            {countExcused} <span className="text-xs font-medium text-sky-700">em</span>
          </p>
        </div>

        <div className="col-span-2 sm:col-span-1 bg-slate-900 text-white p-4 rounded-2xl border border-slate-800">
          <span className="text-amber-300 text-2xs font-bold uppercase tracking-wider">
            Tỷ lệ chuyên cần
          </span>
          <p className="text-2xl font-extrabold text-white mt-2">
            {attendanceRate}%
          </p>
        </div>
      </div>

      {/* Attendance List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <span className="font-bold text-xs md:text-sm text-slate-800">
            Danh sách học sinh điểm danh ({classStudents.length} học sinh)
          </span>
          <span className="text-2xs text-slate-500">
            Bấm chọn trực tiếp trạng thái để điểm danh
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-3xs">
                <th className="py-3 px-4">STT</th>
                <th className="py-3 px-4">Mã HS</th>
                <th className="py-3 px-4">Họ và tên</th>
                <th className="py-3 px-4">Trạng thái chuyên cần</th>
                <th className="py-3 px-4">Ghi chú (Lý do, phút đi muộn...)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {classStudents.map((s, idx) => {
                const current = localStatuses[s.id] || { status: 'present', note: '' };
                const st = current.status;

                return (
                  <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-slate-400">{idx + 1}</td>
                    <td className="py-3.5 px-4 font-mono font-medium text-slate-600">{s.studentCode}</td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-900">{s.fullName}</span>
                      <span className="text-3xs text-slate-400 block sm:hidden">{s.gender}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="inline-flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
                        {/* Có mặt */}
                        <button
                          type="button"
                          onClick={() => handleSetStatus(s.id, 'present')}
                          className={`px-3 py-1 rounded-lg font-semibold text-2xs transition-all cursor-pointer ${
                            st === 'present'
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'text-slate-600 hover:text-emerald-700'
                          }`}
                        >
                          Có mặt
                        </button>

                        {/* Đi muộn */}
                        <button
                          type="button"
                          onClick={() => handleSetStatus(s.id, 'late')}
                          className={`px-3 py-1 rounded-lg font-semibold text-2xs transition-all cursor-pointer ${
                            st === 'late'
                              ? 'bg-amber-500 text-white shadow-xs'
                              : 'text-slate-600 hover:text-amber-700'
                          }`}
                        >
                          Đi muộn
                        </button>

                        {/* Có phép */}
                        <button
                          type="button"
                          onClick={() => handleSetStatus(s.id, 'excused')}
                          className={`px-3 py-1 rounded-lg font-semibold text-2xs transition-all cursor-pointer ${
                            st === 'excused'
                              ? 'bg-sky-600 text-white shadow-xs'
                              : 'text-slate-600 hover:text-sky-700'
                          }`}
                        >
                          Có phép
                        </button>

                        {/* Vắng */}
                        <button
                          type="button"
                          onClick={() => handleSetStatus(s.id, 'absent')}
                          className={`px-3 py-1 rounded-lg font-semibold text-2xs transition-all cursor-pointer ${
                            st === 'absent'
                              ? 'bg-rose-600 text-white shadow-xs'
                              : 'text-slate-600 hover:text-rose-700'
                          }`}
                        >
                          Vắng
                        </button>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <input
                        type="text"
                        placeholder="Thêm ghi chú..."
                        value={current.note}
                        onChange={(e) => handleSetNote(s.id, e.target.value)}
                        className="w-full max-w-xs px-2.5 py-1 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-sky-500 bg-slate-50 focus:bg-white"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Bottom Save bar */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Sau khi điểm danh xong, vui lòng bấm "Lưu điểm danh" để lưu trữ vào hệ thống.
          </span>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 shadow-xs flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4 text-amber-400" />
            <span>Lưu điểm danh lớp {classes.find((c) => c.id === selectedClassId)?.name}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
