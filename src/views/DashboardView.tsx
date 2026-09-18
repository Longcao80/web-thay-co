import {
  GraduationCap,
  Users,
  FileText,
  AlertCircle,
  CalendarCheck,
  Award,
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
} from 'lucide-react';
import { AppData, Student } from '../types';
import { calculateStudentAverage } from '../utils/gradeCalculator';

interface DashboardViewProps {
  appData: AppData;
  onNavigate: (tab: string, targetId?: string) => void;
  onSelectStudentProfile: (student: Student) => void;
}

export function DashboardView({ appData, onNavigate, onSelectStudentProfile }: DashboardViewProps) {
  const { classes, students, assignments, attendance, grades, gradeFormula, activityLogs } = appData;

  // Compute live statistics
  const totalClasses = classes.length;
  const totalStudents = students.length;
  const totalAssignments = assignments.length;

  // Unfinished assignments count
  let totalUnfinishedSubmissions = 0;
  assignments.forEach((a) => {
    const classStudents = students.filter((s) => s.classId === a.classId);
    classStudents.forEach((s) => {
      const sub = a.submissions?.[s.id];
      if (!sub || !sub.submitted) {
        totalUnfinishedSubmissions++;
      }
    });
  });

  // Attendance rate calculation
  const totalAttendanceRecords = attendance.length;
  const presentRecords = attendance.filter((r) => r.status === 'present').length;
  const attendanceRate =
    totalAttendanceRecords > 0
      ? Math.round((presentRecords / totalAttendanceRecords) * 1000) / 10
      : 96.0;

  // Average grade calculation
  let sumGrades = 0;
  let countGrades = 0;
  students.forEach((s) => {
    const g = grades[s.id];
    const avg = calculateStudentAverage(g, gradeFormula);
    if (avg !== null) {
      sumGrades += avg;
      countGrades++;
    }
  });
  const overallAvgGrade = countGrades > 0 ? (sumGrades / countGrades).toFixed(1) : '7.8';

  // Average per class for chart
  const classGradeStats = classes.map((c) => {
    const cStudents = students.filter((s) => s.classId === c.id);
    let cSum = 0;
    let cCount = 0;
    cStudents.forEach((s) => {
      const avg = calculateStudentAverage(grades[s.id], gradeFormula);
      if (avg !== null) {
        cSum += avg;
        cCount++;
      }
    });
    const avgScore = cCount > 0 ? Math.round((cSum / cCount) * 10) / 10 : 7.5;
    return {
      name: c.name,
      avgScore,
      count: cStudents.length,
    };
  });

  // Grade classification distribution
  let goodCount = 0;
  let fairCount = 0;
  let passCount = 0;
  let needWorkCount = 0;
  students.forEach((s) => {
    const avg = calculateStudentAverage(grades[s.id], gradeFormula);
    if (avg !== null) {
      if (avg >= 8.0) goodCount++;
      else if (avg >= 6.5) fairCount++;
      else if (avg >= 5.0) passCount++;
      else needWorkCount++;
    }
  });

  // Students needing attention
  const attentionStudents = students.filter((s) => {
    const isNeedWork = s.status === 'Cần cố gắng';
    const recentAtt = attendance.find((a) => a.studentId === s.id);
    const isAbsentOrLate = recentAtt?.status === 'absent' || recentAtt?.status === 'late';
    return isNeedWork || isAbsentOrLate;
  });

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div
        id="dashboard-welcome-card"
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0f2b48] via-[#16385d] to-[#1e4672] p-6 md:p-8 text-white shadow-lg border border-slate-700/40"
      >
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-300/30 text-amber-200 text-xs font-semibold mb-3">
            <BookOpen className="w-3.5 h-3.5 text-amber-300" />
            Năm học 2026 - 2027 • Bộ môn {appData.teacherProfile?.subject || 'Toán'}
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white font-serif">
            Xin chào, thầy {appData.teacherProfile?.name || 'Kiều Cao Long'}!
          </h2>
          <p className="mt-2 text-sm md:text-base text-slate-200 leading-relaxed">
            Chúc thầy một ngày dạy học hiệu quả và tràn đầy cảm hứng truyền lửa đam mê {appData.teacherProfile?.subject || 'Toán học'} cho các em học sinh {appData.teacherProfile?.school || 'THCS Thạch Thất 2'}.
          </p>
        </div>

        {/* Decorative subtle literary watermark */}
        <div className="absolute right-4 -bottom-6 opacity-10 pointer-events-none hidden md:block">
          <BookOpen className="w-48 h-48 text-white" />
        </div>
      </div>

      {/* 6 Key Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5 md:gap-4">
        {/* Classes */}
        <div
          onClick={() => onNavigate('classes')}
          className="bg-white p-4 md:p-5 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md hover:border-sky-300 transition-all cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <GraduationCap className="w-5 h-5" />
          </div>
          <p className="text-2xs font-semibold text-slate-500 uppercase tracking-wider">Lớp phụ trách</p>
          <p className="text-xl md:text-2xl font-bold text-slate-900 mt-1">{totalClasses} <span className="text-xs font-normal text-slate-500">lớp</span></p>
          <p className="text-2xs text-slate-400 mt-0.5">Khối 6, 7, 8, 9</p>
        </div>

        {/* Students */}
        <div
          onClick={() => onNavigate('students')}
          className="bg-white p-4 md:p-5 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <Users className="w-5 h-5" />
          </div>
          <p className="text-2xs font-semibold text-slate-500 uppercase tracking-wider">Tổng học sinh</p>
          <p className="text-xl md:text-2xl font-bold text-slate-900 mt-1">{totalStudents} <span className="text-xs font-normal text-slate-500">em</span></p>
          <p className="text-2xs text-emerald-700 font-medium mt-0.5">Sĩ số ổn định</p>
        </div>

        {/* Assignments active */}
        <div
          onClick={() => onNavigate('assignments')}
          className="bg-white p-4 md:p-5 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <FileText className="w-5 h-5" />
          </div>
          <p className="text-2xs font-semibold text-slate-500 uppercase tracking-wider">Bài tập đang giao</p>
          <p className="text-xl md:text-2xl font-bold text-slate-900 mt-1">{totalAssignments} <span className="text-xs font-normal text-slate-500">bài</span></p>
          <p className="text-2xs text-slate-400 mt-0.5">Đề tự luận & viết</p>
        </div>

        {/* Unfinished */}
        <div
          onClick={() => onNavigate('assignments')}
          className="bg-white p-4 md:p-5 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md hover:border-rose-300 transition-all cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <AlertCircle className="w-5 h-5" />
          </div>
          <p className="text-2xs font-semibold text-slate-500 uppercase tracking-wider">Chưa nộp bài</p>
          <p className="text-xl md:text-2xl font-bold text-rose-600 mt-1">{totalUnfinishedSubmissions} <span className="text-xs font-normal text-slate-500">lượt</span></p>
          <p className="text-2xs text-rose-700 font-medium mt-0.5">Cần nhắc nhở</p>
        </div>

        {/* Attendance */}
        <div
          onClick={() => onNavigate('attendance')}
          className="bg-white p-4 md:p-5 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md hover:border-amber-300 transition-all cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <CalendarCheck className="w-5 h-5" />
          </div>
          <p className="text-2xs font-semibold text-slate-500 uppercase tracking-wider">Chuyên cần</p>
          <p className="text-xl md:text-2xl font-bold text-slate-900 mt-1">{attendanceRate}%</p>
          <p className="text-2xs text-emerald-700 font-medium mt-0.5">Tỷ lệ chuyên cần cao</p>
        </div>

        {/* Average grade */}
        <div
          onClick={() => onNavigate('grades')}
          className="bg-white p-4 md:p-5 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md hover:border-amber-400 transition-all cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <Award className="w-5 h-5" />
          </div>
          <p className="text-2xs font-semibold text-slate-500 uppercase tracking-wider">Điểm trung bình</p>
          <p className="text-xl md:text-2xl font-bold text-amber-600 mt-1">{overallAvgGrade}</p>
          <p className="text-2xs text-slate-400 mt-0.5">Thang điểm 10</p>
        </div>
      </div>

      {/* Main Grid: Charts & Modules */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Section A: Tình hình học tập (Visual SVG chart) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-sky-700" />
                A. Tình hình học tập môn Ngữ văn
              </h3>
              <p className="text-xs text-slate-500">Điểm trung bình theo lớp & phân bố kết quả đánh giá</p>
            </div>
            <button
              onClick={() => onNavigate('grades')}
              className="text-xs text-sky-700 hover:text-sky-800 font-semibold flex items-center gap-1 cursor-pointer"
            >
              Xem sổ điểm <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Class comparison bar chart */}
            <div>
              <p className="text-xs font-bold text-slate-600 mb-3 uppercase tracking-wider">
                Điểm TB theo từng lớp (Thang điểm 10)
              </p>
              <div className="space-y-3">
                {classGradeStats.map((item) => {
                  const percent = Math.min(100, Math.max(10, (item.avgScore / 10) * 100));
                  return (
                    <div key={item.name} className="space-y-1">
                      <div className="flex justify-between text-xs font-medium">
                        <span className="text-slate-800 font-bold">Lớp {item.name} ({item.count} HS)</span>
                        <span className="text-sky-700 font-bold">{item.avgScore} / 10</span>
                      </div>
                      <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-sky-600 to-indigo-600 h-full rounded-full transition-all duration-500"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Classification distribution bars */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <p className="text-xs font-bold text-slate-600 mb-3 uppercase tracking-wider">
                Phân bố mức học lực học sinh
              </p>
              <div className="space-y-2.5">
                <div>
                  <div className="flex justify-between text-2xs font-semibold mb-1">
                    <span className="text-emerald-700">Tốt / Giỏi (≥ 8.0)</span>
                    <span className="font-bold text-slate-700">{goodCount} em</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full"
                      style={{ width: `${(goodCount / (totalStudents || 1)) * 100}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-2xs font-semibold mb-1">
                    <span className="text-sky-700">Khá (6.5 – 7.9)</span>
                    <span className="font-bold text-slate-700">{fairCount} em</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-sky-500 h-full rounded-full"
                      style={{ width: `${(fairCount / (totalStudents || 1)) * 100}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-2xs font-semibold mb-1">
                    <span className="text-amber-700">Đạt (5.0 – 6.4)</span>
                    <span className="font-bold text-slate-700">{passCount} em</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-amber-500 h-full rounded-full"
                      style={{ width: `${(passCount / (totalStudents || 1)) * 100}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-2xs font-semibold mb-1">
                    <span className="text-rose-600">Cần cố gắng (&lt; 5.0)</span>
                    <span className="font-bold text-slate-700">{needWorkCount} em</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-rose-500 h-full rounded-full"
                      style={{ width: `${(needWorkCount / (totalStudents || 1)) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section C: Học sinh cần chú ý */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-500" />
                C. Học sinh cần chú ý
              </h3>
              <p className="text-xs text-slate-500">Nghỉ học, chưa nộp bài, điểm giảm</p>
            </div>
            <button
              onClick={() => onNavigate('students')}
              className="text-xs text-slate-500 hover:text-slate-800 font-medium"
            >
              Tất cả ({attentionStudents.length})
            </button>
          </div>

          <div className="space-y-2.5 flex-1 overflow-y-auto max-h-72">
            {attentionStudents.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">
                Không có học sinh nào trong diện cần chú ý đặc biệt.
              </p>
            ) : (
              attentionStudents.map((s) => {
                const recentAtt = attendance.find((a) => a.studentId === s.id);
                return (
                  <div
                    key={s.id}
                    onClick={() => onSelectStudentProfile(s)}
                    className="p-3 rounded-xl border border-rose-100 bg-rose-50/40 hover:bg-rose-50 transition-colors cursor-pointer flex items-center justify-between gap-3 group"
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-800 group-hover:text-rose-700">
                          {s.fullName}
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-white text-3xs font-semibold text-slate-600 border border-slate-200">
                          {s.className}
                        </span>
                      </div>
                      <p className="text-2xs text-rose-700 mt-1 font-medium">
                        {recentAtt?.status === 'absent'
                          ? 'Vắng học hôm nay'
                          : recentAtt?.status === 'late'
                          ? 'Đi học muộn'
                          : s.notes || 'Cần theo dõi sát bài tập'}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-rose-600 flex-shrink-0" />
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Section B & D: Recent Assignments & Activity Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Section B: Bài tập gần đây */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-600" />
                B. Bài tập gần đây
              </h3>
              <p className="text-xs text-slate-500">Tình trạng nộp bài và tiến độ chấm điểm</p>
            </div>
            <button
              onClick={() => onNavigate('assignments')}
              className="text-xs text-indigo-700 hover:text-indigo-800 font-semibold flex items-center gap-1 cursor-pointer"
            >
              Giao bài mới <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider text-3xs">
                  <th className="py-2.5 px-3">Tên bài tập</th>
                  <th className="py-2.5 px-3">Lớp</th>
                  <th className="py-2.5 px-3">Hạn nộp</th>
                  <th className="py-2.5 px-3">Đã nộp</th>
                  <th className="py-2.5 px-3">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {assignments.slice(0, 4).map((a) => {
                  const classStudents = students.filter((s) => s.classId === a.classId);
                  const submittedCount = Object.values(a.submissions || {}).filter(
                    (sub) => sub.submitted
                  ).length;
                  const totalClassCount = classStudents.length;

                  const statusColors: Record<string, string> = {
                    'Đã hoàn thành': 'bg-emerald-50 text-emerald-700 border-emerald-200',
                    'Sắp hết hạn': 'bg-amber-50 text-amber-700 border-amber-200',
                    'Đang thực hiện': 'bg-sky-50 text-sky-700 border-sky-200',
                  };

                  return (
                    <tr
                      key={a.id}
                      onClick={() => onNavigate('assignments', a.id)}
                      className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                    >
                      <td className="py-3 px-3 font-semibold text-slate-900 max-w-xs truncate">
                        {a.title}
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-bold">
                          {a.className}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-medium text-slate-600">{a.dueDate}</td>
                      <td className="py-3 px-3">
                        <span className="font-bold text-slate-800">
                          {submittedCount}
                        </span>{' '}
                        / {totalClassCount}
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-2xs font-semibold border ${
                            statusColors[a.status] || 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {a.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section D: Hoạt động gần đây */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-600" />
                D. Hoạt động gần đây
              </h3>
              <p className="text-xs text-slate-500">Nhật ký thao tác giảng dạy</p>
            </div>
          </div>

          <div className="space-y-3.5">
            {activityLogs.slice(0, 5).map((log) => (
              <div key={log.id} className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-sky-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-slate-800 font-medium leading-snug">
                    {log.action}
                  </p>
                  <p className="text-3xs text-slate-400 mt-0.5">{log.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
