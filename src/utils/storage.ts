import { INITIAL_DEMO_DATA } from '../demoData';
import { AppData } from '../types';

const STORAGE_KEY = 'VAN_HOC_HUB_DATA_V1';

export function loadAppData(): AppData {
  if (typeof window === 'undefined') return INITIAL_DEMO_DATA;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      saveAppData(INITIAL_DEMO_DATA);
      return INITIAL_DEMO_DATA;
    }
    const parsed = JSON.parse(raw);

    // Auto-migrate previous teacher profile if still having default placeholder
    if (parsed.teacherProfile && parsed.teacherProfile.name === 'Dương Thành Tín') {
      parsed.teacherProfile.name = 'Kiều Cao Long';
      parsed.teacherProfile.subject = 'Toán';
      parsed.teacherProfile.school = 'Trường THCS Thạch Thất 2';
      parsed.teacherProfile.email = 'longfto80@gmail.com';
    }
    if (Array.isArray(parsed.classes)) {
      parsed.classes = parsed.classes.map((c: any) => ({
        ...c,
        teacher: c.teacher === 'Dương Thành Tín' ? 'Kiều Cao Long' : c.teacher,
        academicYear: c.academicYear === '2025 - 2026' ? '2026 - 2027' : c.academicYear,
      }));
    }

    // Ensure all critical root keys exist
    const merged: AppData = {
      ...INITIAL_DEMO_DATA,
      ...parsed,
      teacherProfile: {
        ...INITIAL_DEMO_DATA.teacherProfile,
        ...(parsed.teacherProfile || {}),
      },
      gradeFormula: {
        ...INITIAL_DEMO_DATA.gradeFormula,
        ...(parsed.gradeFormula || {})
      }
    };
    saveAppData(merged);
    return merged;
  } catch (err) {
    console.error('Failed to parse stored data, falling back to demo', err);
    return INITIAL_DEMO_DATA;
  }
}

export function saveAppData(data: AppData): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error('Failed to save data to localStorage', err);
  }
}

export function exportDataAsJSON(data: AppData): void {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data, null, 2));
  const downloadAnchor = document.createElement('a');
  const nowStr = new Date().toISOString().slice(0, 10);
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `van_hoc_hub_backup_${nowStr}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

export function importDataFromJSON(file: File): Promise<AppData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const parsed = JSON.parse(text);
        if (!parsed.classes || !parsed.students) {
          throw new Error('Định dạng file sao lưu không hợp lệ.');
        }
        resolve(parsed as AppData);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error('Lỗi khi đọc file.'));
    reader.readAsText(file);
  });
}

export function resetToDemoData(): AppData {
  saveAppData(INITIAL_DEMO_DATA);
  return JSON.parse(JSON.stringify(INITIAL_DEMO_DATA));
}

export const loadDataFromStorage = loadAppData;
export const saveDataToStorage = saveAppData;
export function clearStorage(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('Failed to clear storage', err);
  }
}
