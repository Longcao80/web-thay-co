import { useState } from 'react';
import {
  Award,
  Save,
  Settings2,
  CheckCircle2,
  X,
} from 'lucide-react';
import { AppData, StudentGrade, GradeFormula } from '../types';
import { calculateStudentAverage, getGradeClassification } from '../utils/gradeCalculator';

interface GradesViewProps {
  appData: AppData;
  onSaveGrades: (updatedGrades: Record<string, StudentGrade>) => void;
  onUpdateFormula: (formula: GradeFormula) => void;
}

export function GradesView({ appData, onSaveGrades, onUpdateFormula }: GradesViewProps) {
  const { classes, students, grades, gradeFormula } = appData;

  const [selectedClassId, setSelectedClassId] = useState<string>(classes[0]?.id || '');
  const [localGrades, setLocalGrades] = useState<Record<string, StudentGrade>>(() => ({ ...grades }));
  const [isFormulaModalOpen, setIsFormulaModalOpen] = useState(false);

  // Formula edit state
  const [tempFormula, setTempFormula] = useState<GradeFormula>(gradeFormula);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const currentClass = classes.find((c) => c.id === selectedClassId);
  const classStudents = students.filter((s) => s.classId === selectedClassId);

  // Handle cell edit
  const handleScoreChange = (
    studentId: string,
    field: 'regular' | 'midterm' | 'final',
    value: string,
    regularIndex = 0
  ) => {
    setHasUnsavedChanges(true);
    const parsed = value === '' ? null : Math.min(10, Math.max(0, parseFloat(value) || 0));

    setLocalGrades((prev) => {
      const existing = prev[studentId] || {
        studentId,
        regularScores: [null, null, null],
        midtermScore: null,
        finalScore: null,
      };

      if (field === 'regular') {
        const newRegulars = [...existing.regularScores];
        newRegulars[regularIndex] = parsed;
        return {
          ...prev,
          [studentId]: {
            ...existing,
            regularScores: newRegulars,
          },
        };
      } else if (field === 'midterm') {
        return {
          ...prev,
          [studentId]: {
            ...existing,
            midtermScore: parsed,
          },
        };
      } else {
        return {
          ...prev,
          [studentId]: {
            ...existing,
            finalScore: parsed,
          },
        };
      }
    });
  };

  const handleSave = () => {
    onSaveGrades(localGrades);
    setHasUnsavedChanges(false);
  };

  const handleSaveFormula = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateFormula(tempFormula);
    setIsFormulaModalOpen(false);
  };

  // Grade classification distribution for the selected class
  let countGood = 0;
  let countFair = 0;
  let countPass = 0;
  let countFail = 0;
  let sumAvg = 0;
  let countValid = 0;

  classStudents.forEach((s) => {
    const g = localGrades[s.id];
    const avg = calculateStudentAverage(g, gradeFormula);
    if (avg !== null) {
      sumAvg += avg;
      countValid++;
      if (avg >= 8.0) countGood++;
      else if (avg >= 6.5) countFair++;
      else if (avg >= 5.0) countPass++;
      else countFail++;
    }
  });

  const classAvgScore = countValid > 0 ? (sumAvg / countValid).toFixed(1) : '--';

  return (
    <div className="space-y-6">
      {/* Top Header & Select Class */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg md:text-xl font-bold text-slate-800 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-600" />
              Sổ điểm điện tử môn Ngữ văn
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Đánh giá định kỳ & thường xuyên theo Thông tư 22/2021/TT-BGDĐT
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setTempFormula(gradeFormula);
                setIsFormulaModalOpen(true);
              }}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Settings2 className="w-4 h-4 text-slate-500" />
              <span>Công thức tính điểm</span>
            </button>

            <button
              id="btn-save-grades"
              type="button"
              onClick={handleSave}
              className={`px-4 py-2 rounded-xl text-xs md:text-sm font-semibold text-white transition-all flex items-center gap-2 cursor-pointer ${
                hasUnsavedChanges
                  ? 'bg-amber-600 hover:bg-amber-700 shadow-md ring-2 ring-amber-400'
                  : 'bg-slate-900 hover:bg-slate-800 shadow-sm'
              }`}
            >
              <Save className="w-4 h-4 text-amber-400" />
              <span>{hasUnsavedChanges ? 'Lưu thay đổi (*)' : 'Lưu bảng điểm'}</span>
            </button>
          </div>
        </div>

        {/* Select Class Dropdown & Formula Notice */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100">
          <div className="flex items-center gap-3">
            <label className="text-xs font-bold text-slate-700">Chọn lớp xem sổ điểm:</label>
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="px-3 py-1.5 text-xs md:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-sky-500 text-slate-800 font-bold"
            >
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  Lớp {c.name} (Khối {c.gradeLevel})
                </option>
              ))}
            </select>
          </div>

          <div className="text-2xs text-slate-500 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200/60">
            Công thức hiện tại:{' '}
            <span className="font-semibold text-slate-700">
              Điểm TB = (Tổng TX×{gradeFormula.regularWeight} + GK×{gradeFormula.midtermWeight} + CK×{gradeFormula.finalWeight}) / Tổng hệ số
            </span>
          </div>
        </div>
      </div>

      {/* Class Statistics Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
        <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200/80">
          <span className="text-3xs font-bold text-amber-800 uppercase">Điểm TB Lớp {currentClass?.name}</span>
          <p className="text-2xl font-extrabold text-amber-700 mt-1">{classAvgScore}</p>
          <span className="text-3xs text-slate-500">Đã nhập: {countValid}/{classStudents.length} HS</span>
        </div>

        <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-200/80">
          <span className="text-3xs font-bold text-emerald-800 uppercase">Mức Tốt (≥ 8.0)</span>
          <p className="text-2xl font-extrabold text-emerald-700 mt-1">{countGood} em</p>
          <span className="text-3xs text-emerald-600">
            {classStudents.length > 0 ? Math.round((countGood / classStudents.length) * 100) : 0}%
          </span>
        </div>

        <div className="bg-sky-50/60 p-4 rounded-2xl border border-sky-200/80">
          <span className="text-3xs font-bold text-sky-800 uppercase">Mức Khá (6.5 – 7.9)</span>
          <p className="text-2xl font-extrabold text-sky-700 mt-1">{countFair} em</p>
          <span className="text-3xs text-sky-600">
            {classStudents.length > 0 ? Math.round((countFair / classStudents.length) * 100) : 0}%
          </span>
        </div>

        <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200/80">
          <span className="text-3xs font-bold text-amber-800 uppercase">Mức Đạt (5.0 – 6.4)</span>
          <p className="text-2xl font-extrabold text-amber-700 mt-1">{countPass} em</p>
          <span className="text-3xs text-amber-600">
            {classStudents.length > 0 ? Math.round((countPass / classStudents.length) * 100) : 0}%
          </span>
        </div>

        <div className="bg-rose-50/60 p-4 rounded-2xl border border-rose-200/80">
          <span className="text-3xs font-bold text-rose-800 uppercase">Cần cố gắng (&lt; 5.0)</span>
          <p className="text-2xl font-extrabold text-rose-700 mt-1">{countFail} em</p>
          <span className="text-3xs text-rose-600">
            {classStudents.length > 0 ? Math.round((countFail / classStudents.length) * 100) : 0}%
          </span>
        </div>
      </div>

      {/* Main Grade Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <span className="font-bold text-xs md:text-sm text-slate-800">
            Bảng điểm chi tiết lớp {currentClass?.name} ({classStudents.length} học sinh)
          </span>
          <span className="text-2xs text-slate-500">
            Thầy có thể sửa trực tiếp số điểm vào ô tương ứng
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-3xs">
                <th className="py-3 px-3">STT</th>
                <th className="py-3 px-3">Mã HS</th>
                <th className="py-3 px-3">Họ và tên</th>
                <th className="py-3 px-3 text-center">ĐĐGtx 1 (HS 1)</th>
                <th className="py-3 px-3 text-center">ĐĐGtx 2 (HS 1)</th>
                <th className="py-3 px-3 text-center">ĐĐGtx 3 (HS 1)</th>
                <th className="py-3 px-3 text-center text-sky-700">Giữa kỳ (HS {gradeFormula.midtermWeight})</th>
                <th className="py-3 px-3 text-center text-indigo-700">Cuối kỳ (HS {gradeFormula.finalWeight})</th>
                <th className="py-3 px-3 text-center font-bold text-amber-700">Điểm TB</th>
                <th className="py-3 px-3 text-center">Xếp loại học lực</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {classStudents.map((s, idx) => {
                const g = localGrades[s.id] || {
                  studentId: s.id,
                  regularScores: [null, null, null],
                  midtermScore: null,
                  finalScore: null,
                };
                const avg = calculateStudentAverage(g, gradeFormula);
                const classification = getGradeClassification(avg);

                return (
                  <tr key={s.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-2.5 px-3 font-mono text-slate-400">{idx + 1}</td>
                    <td className="py-2.5 px-3 font-mono font-medium text-slate-600">{s.studentCode}</td>
                    <td className="py-2.5 px-3 font-bold text-slate-900 whitespace-nowrap">
                      {s.fullName}
                    </td>

                    {/* TX 1 */}
                    <td className="py-2.5 px-3 text-center">
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="10"
                        placeholder="--"
                        value={g.regularScores[0] ?? ''}
                        onChange={(e) => handleScoreChange(s.id, 'regular', e.target.value, 0)}
                        className="w-14 px-1.5 py-1 text-xs border border-slate-200 rounded-lg text-center font-semibold text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-sky-500 bg-slate-50 focus:bg-white"
                      />
                    </td>

                    {/* TX 2 */}
                    <td className="py-2.5 px-3 text-center">
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="10"
                        placeholder="--"
                        value={g.regularScores[1] ?? ''}
                        onChange={(e) => handleScoreChange(s.id, 'regular', e.target.value, 1)}
                        className="w-14 px-1.5 py-1 text-xs border border-slate-200 rounded-lg text-center font-semibold text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-sky-500 bg-slate-50 focus:bg-white"
                      />
                    </td>

                    {/* TX 3 */}
                    <td className="py-2.5 px-3 text-center">
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="10"
                        placeholder="--"
                        value={g.regularScores[2] ?? ''}
                        onChange={(e) => handleScoreChange(s.id, 'regular', e.target.value, 2)}
                        className="w-14 px-1.5 py-1 text-xs border border-slate-200 rounded-lg text-center font-semibold text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-sky-500 bg-slate-50 focus:bg-white"
                      />
                    </td>

                    {/* Giữa kỳ */}
                    <td className="py-2.5 px-3 text-center">
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="10"
                        placeholder="--"
                        value={g.midtermScore ?? ''}
                        onChange={(e) => handleScoreChange(s.id, 'midterm', e.target.value)}
                        className="w-14 px-1.5 py-1 text-xs border border-sky-200 rounded-lg text-center font-bold text-sky-700 focus:outline-hidden focus:ring-1 focus:ring-sky-500 bg-sky-50/40 focus:bg-white"
                      />
                    </td>

                    {/* Cuối kỳ */}
                    <td className="py-2.5 px-3 text-center">
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="10"
                        placeholder="--"
                        value={g.finalScore ?? ''}
                        onChange={(e) => handleScoreChange(s.id, 'final', e.target.value)}
                        className="w-14 px-1.5 py-1 text-xs border border-indigo-200 rounded-lg text-center font-bold text-indigo-700 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 bg-indigo-50/40 focus:bg-white"
                      />
                    </td>

                    {/* Điểm TB */}
                    <td className="py-2.5 px-3 text-center">
                      <span className="text-sm font-extrabold text-amber-600">
                        {avg !== null ? avg.toFixed(1) : '--'}
                      </span>
                    </td>

                    {/* Xếp loại */}
                    <td className="py-2.5 px-3 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-3xs font-bold border ${classification.badgeClass}`}
                      >
                        {classification.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Bottom Save Bar */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span className="text-xs text-slate-600">
              Định dạng thang điểm 10 theo quy chuẩn giáo dục phổ thông.
            </span>
          </div>

          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 shadow-xs flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4 text-amber-400" />
            <span>Lưu bảng điểm lớp {currentClass?.name}</span>
          </button>
        </div>
      </div>

      {/* Formula Settings Modal */}
      {isFormulaModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="text-base font-bold text-slate-900">
                Cài đặt công thức tính điểm trung bình
              </h3>
              <button
                onClick={() => setIsFormulaModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveFormula} className="p-6 space-y-4 text-xs">
              <p className="text-slate-500">
                Thầy có thể điều chỉnh hệ số các cột điểm cho phù hợp với quy định từng học kỳ:
              </p>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Hệ số điểm thường xuyên (ĐĐGtx)
                </label>
                <input
                  type="number"
                  min="1"
                  max="3"
                  value={tempFormula.regularWeight}
                  onChange={(e) =>
                    setTempFormula((f: GradeFormula) => ({ ...f, regularWeight: Number(e.target.value) || 1 }))
                  }
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Hệ số điểm giữa kỳ (ĐĐGgk)
                </label>
                <input
                  type="number"
                  min="1"
                  max="4"
                  value={tempFormula.midtermWeight}
                  onChange={(e) =>
                    setTempFormula((f: GradeFormula) => ({ ...f, midtermWeight: Number(e.target.value) || 2 }))
                  }
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Hệ số điểm cuối kỳ (ĐĐGck)
                </label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={tempFormula.finalWeight}
                  onChange={(e) =>
                    setTempFormula((f: GradeFormula) => ({ ...f, finalWeight: Number(e.target.value) || 3 }))
                  }
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsFormulaModalOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl cursor-pointer"
                >
                  Cập nhật công thức
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
