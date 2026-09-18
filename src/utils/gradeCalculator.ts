import { GradeFormulaConfig, StudentGrade } from '../types';

export function calculateStudentAverage(grade: StudentGrade | undefined, formula: GradeFormulaConfig): number | null {
  if (!grade) return null;

  const validRegulars: number[] = (grade.regularScores || []).filter(
    (s): s is number => typeof s === 'number' && s !== null && !isNaN(s)
  );
  const avgRegular = validRegulars.length > 0 ? validRegulars.reduce((a, b) => a + b, 0) / validRegulars.length : null;

  const hasRegular = avgRegular !== null;
  const hasMidterm = grade.midtermScore !== null && !isNaN(grade.midtermScore);
  const hasFinal = grade.finalScore !== null && !isNaN(grade.finalScore);

  let totalPoints = 0;
  let totalWeight = 0;

  if (hasRegular) {
    totalPoints += (avgRegular as number) * formula.regularWeight;
    totalWeight += formula.regularWeight;
  }
  if (hasMidterm) {
    totalPoints += (grade.midtermScore as number) * formula.midtermWeight;
    totalWeight += formula.midtermWeight;
  }
  if (hasFinal) {
    totalPoints += (grade.finalScore as number) * formula.finalWeight;
    totalWeight += formula.finalWeight;
  }

  if (totalWeight === 0) return null;

  const rawScore = totalPoints / totalWeight;
  return Math.round(rawScore * 10) / 10;
}

export function getGradeClassification(score: number | null): { label: string; color: string; badgeClass: string } {
  if (score === null || isNaN(score)) {
    return { label: 'Chưa đủ điểm', color: 'gray', badgeClass: 'bg-slate-100 text-slate-700 border-slate-200' };
  }
  if (score >= 8.0) {
    return { label: 'Tốt (Giỏi)', color: 'emerald', badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
  }
  if (score >= 6.5) {
    return { label: 'Khá', color: 'blue', badgeClass: 'bg-blue-50 text-blue-700 border-blue-200' };
  }
  if (score >= 5.0) {
    return { label: 'Đạt', color: 'amber', badgeClass: 'bg-amber-50 text-amber-700 border-amber-200' };
  }
  return { label: 'Cần cố gắng', color: 'rose', badgeClass: 'bg-rose-50 text-rose-700 border-rose-200' };
}
