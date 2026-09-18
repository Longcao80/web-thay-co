import { useState } from 'react';
import {
  TrendingUp,
  Award,
  CalendarCheck,
  FileText,
  Search,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Sparkles,
} from 'lucide-react';
import { AppData, Student } from '../types';
import { calculateStudentAverage, getGradeClassification } from '../utils/gradeCalculator';

interface ProgressViewProps {
  appData: AppData;
  onSelectStudentProfile: (student: Student) => void;
}

export function ProgressView({ appData, onSelectStudentProfile }: ProgressViewProps) {
  const { classes, students, assignments, attendance, grades, gradeFormula } = appData;

  const [selectedClassId, setSelectedClassId] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'avg-desc' | 'avg-asc' | 'assignment' | 'attendance'>('avg-desc');

  // Compute student stats
  const studentsWithProgress = students.map((s) => {
    // Grade avg
    const avg = calculateStudentAverage(grades[s.id], gradeFormula);
    const classification = getGradeClassification(avg);

    // Attendance
    const studentAtt = attendance.filter((a) => a.studentId === s.id);
    const presentCount = studentAtt.filter((a) => a.status === 'present').length;
    const attRate =
      studentAtt.length > 0 ? Math.round((presentCount / studentAtt.length) * 100) : 96;

    // Assignment completion
    const classAssignments = assignments.filter((a) => a.classId === s.classId);
    let finishedAssignments = 0;
    classAssignments.forEach((a) => {
      if (a.submissions?.[s.id]?.submitted) finishedAssignments++;
    });
    const assignmentCompletionRate =
      classAssignments.length > 0
        ? Math.round((finishedAssignments / classAssignments.length) * 100)
        : 100;

    // Score trend comparison (Regular 1 vs Midterm vs Final)
    const g = grades[s.id];
    let trend: 'up' | 'down' | 'stable' = 'stable';
    if (g) {
      const reg1 = g.regularScores?.[0];
      const final = g.finalScore || g.midtermScore;
      if (reg1 !== null && reg1 !== undefined && final !== null && final !== undefined) {
        if (final - reg1 >= 0.5) trend = 'up';
        else if (reg1 - final >= 0.5) trend = 'down';
      }
    }

    return {
      student: s,
      avg: avg ?? 0,
      classification,
      attRate,
      assignmentCompletionRate,
      finishedAssignments,
      totalAssignments: classAssignments.length,
      trend,
    };
  });

  // Filter
  const filtered = studentsWithProgress.filter((item) => {
    const matchesClass = selectedClassId === 'all' || item.student.classId === selectedClassId;
    const matchesSearch =
      item.student.fullName.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
      item.student.studentCode.toLowerCase().includes(searchTerm.toLowerCase().trim());
    return matchesClass && matchesSearch;
  });

  // Sort
  filtered.sort((a, b) => {
    if (sortBy === 'avg-desc') return b.avg - a.avg;
    if (sortBy === 'avg-asc') return a.avg - b.avg;
    if (sortBy === 'assignment') return b.assignmentCompletionRate - a.assignmentCompletionRate;
    if (sortBy === 'attendance') return b.attRate - a.attRate;
    return 0;
  });

  return (
    <div className="space-y-6">
      {/* Top Header & Controls */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg md:text-xl font-bold text-slate-800 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              Theo dõi tiến độ học tập môn Ngữ văn
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Đánh giá đa chiều: Điểm trung bình, Tỷ lệ hoàn thành bài tập, Chuyên cần và Xu hướng tiến bộ
            </p>
          </div>
        </div>

        {/* Filter & Sort Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm theo tên học sinh, mã HS..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs md:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div>
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="w-full px-3 py-2 text-xs md:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-sky-500 text-slate-700 font-medium"
            >
              <option value="all">Tất cả lớp học ({classes.length} lớp)</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  Lớp {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2 text-xs md:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-sky-500 text-slate-700 font-medium"
            >
              <option value="avg-desc">Điểm TB: Cao đến thấp</option>
              <option value="avg-asc">Điểm TB: Thấp đến cao</option>
              <option value="assignment">Tỷ lệ bài tập: Cao nhất</option>
              <option value="attendance">Chuyên cần: Cao nhất</option>
            </select>
          </div>
        </div>
      </div>

      {/* Student Progress Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((item) => {
          const { student, avg, classification, attRate, assignmentCompletionRate, finishedAssignments, totalAssignments, trend } = item;

          return (
            <div
              key={student.id}
              onClick={() => onSelectStudentProfile(student)}
              className="bg-white rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all p-5 flex flex-col justify-between cursor-pointer group"
            >
              <div>
                {/* Card Top */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 text-amber-300 font-bold text-sm flex items-center justify-center">
                      {student.fullName.split(' ').slice(-1)[0].charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 group-hover:text-sky-700 transition-colors">
                        {student.fullName}
                      </h3>
                      <p className="text-2xs text-slate-400 font-mono">
                        {student.studentCode} • Lớp {student.className}
                      </p>
                    </div>
                  </div>

                  {/* Trend Badge */}
                  <div>
                    {trend === 'up' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-3xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <ArrowUpRight className="w-3 h-3" /> Đang tiến bộ
                      </span>
                    )}
                    {trend === 'down' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-3xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                        <ArrowDownRight className="w-3 h-3" /> Cần chú ý
                      </span>
                    )}
                    {trend === 'stable' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-3xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                        <Minus className="w-3 h-3" /> Giữ ổn định
                      </span>
                    )}
                  </div>
                </div>

                {/* Metrics Bars */}
                <div className="mt-4 space-y-3 pt-3 border-t border-slate-100">
                  {/* Grade Score */}
                  <div>
                    <div className="flex justify-between text-2xs mb-1 font-semibold">
                      <span className="text-slate-600 flex items-center gap-1">
                        <Award className="w-3 h-3 text-amber-500" /> Điểm TB Ngữ văn
                      </span>
                      <span className="font-bold text-amber-700">
                        {avg > 0 ? avg.toFixed(1) : '--'} / 10 ({classification.label})
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-amber-500 h-full rounded-full"
                        style={{ width: `${Math.min(100, (avg / 10) * 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Assignment Rate */}
                  <div>
                    <div className="flex justify-between text-2xs mb-1 font-semibold">
                      <span className="text-slate-600 flex items-center gap-1">
                        <FileText className="w-3 h-3 text-indigo-500" /> Hoàn thành bài tập
                      </span>
                      <span className="font-bold text-indigo-700">
                        {assignmentCompletionRate}% ({finishedAssignments}/{totalAssignments})
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-indigo-600 h-full rounded-full"
                        style={{ width: `${assignmentCompletionRate}%` }}
                      />
                    </div>
                  </div>

                  {/* Attendance Rate */}
                  <div>
                    <div className="flex justify-between text-2xs mb-1 font-semibold">
                      <span className="text-slate-600 flex items-center gap-1">
                        <CalendarCheck className="w-3 h-3 text-emerald-500" /> Mức độ chuyên cần
                      </span>
                      <span className="font-bold text-emerald-700">{attRate}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-500 h-full rounded-full"
                        style={{ width: `${attRate}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Quick Evaluation Note */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-2xs text-slate-500">
                <span className="italic line-clamp-1">
                  {student.notes || 'Học lực đồng đều, thái độ tốt'}
                </span>
                <span className="text-sky-700 font-semibold group-hover:underline flex items-center gap-0.5 flex-shrink-0">
                  <Sparkles className="w-3 h-3 text-amber-500" /> Xem hồ sơ
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
