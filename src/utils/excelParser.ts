import * as XLSX from 'xlsx';
import { Student, StudentStatus, ClassItem } from '../types';

export interface ParsedStudentRow {
  studentCode: string;
  fullName: string;
  className: string;
  classId: string;
  gender: 'Nam' | 'Nữ';
  birthDate: string;
  parentPhone: string;
  status: StudentStatus;
  notes: string;
  isValid: boolean;
  errors: string[];
}

export interface ParseResult {
  rows: ParsedStudentRow[];
  totalRows: number;
  validRows: number;
  errorCount: number;
}

// Convert Excel serial date or various date formats to YYYY-MM-DD
export function normalizeExcelDate(val: unknown): string {
  if (!val) return '2013-05-15';

  if (val instanceof Date && !isNaN(val.getTime())) {
    return val.toISOString().slice(0, 10);
  }

  if (typeof val === 'number') {
    // Excel base date calculation
    const excelEpoch = new Date(Date.UTC(1899, 11, 30));
    const jsDate = new Date(excelEpoch.getTime() + val * 86400000);
    if (!isNaN(jsDate.getTime())) {
      return jsDate.toISOString().slice(0, 10);
    }
  }

  const str = String(val).trim();
  // Check DD/MM/YYYY or DD-MM-YYYY
  const dmyMatch = str.match(/^(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{4})$/);
  if (dmyMatch) {
    const day = dmyMatch[1].padStart(2, '0');
    const month = dmyMatch[2].padStart(2, '0');
    const year = dmyMatch[3];
    return `${year}-${month}-${day}`;
  }

  // Check YYYY-MM-DD
  const ymdMatch = str.match(/^(\d{4})[\/\-\.](\d{1,2})[\/\-\.](\d{1,2})$/);
  if (ymdMatch) {
    const year = ymdMatch[1];
    const month = ymdMatch[2].padStart(2, '0');
    const day = ymdMatch[3].padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  return '2013-05-15';
}

// Helper to find header key matching flexible Vietnamese/English aliases
function findValueByAliases(row: Record<string, unknown>, aliases: string[]): unknown {
  const keys = Object.keys(row);
  for (const alias of aliases) {
    const matchedKey = keys.find(
      (k) => k.toLowerCase().trim().replace(/[\s_\-\.\:]+/g, '') === alias.toLowerCase().replace(/[\s_\-\.\:]+/g, '')
    );
    if (matchedKey && row[matchedKey] !== undefined && row[matchedKey] !== null) {
      return row[matchedKey];
    }
  }
  return undefined;
}

export function parseStudentExcelFile(
  fileData: ArrayBuffer,
  classes: ClassItem[],
  existingStudents: Student[],
  defaultClassId?: string
): ParseResult {
  const workbook = XLSX.read(fileData, { type: 'array', cellDates: true });
  const firstSheetName = workbook.SheetNames[0];
  if (!firstSheetName) {
    return { rows: [], totalRows: 0, validRows: 0, errorCount: 0 };
  }

  const worksheet = workbook.Sheets[firstSheetName];
  const rawRows: Record<string, unknown>[] = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

  const existingCodeSet = new Set(existingStudents.map((s) => s.studentCode.trim().toLowerCase()));
  const seenFileCodes = new Set<string>();

  const rows: ParsedStudentRow[] = [];

  rawRows.forEach((row, idx) => {
    // Skip empty rows
    const hasAnyContent = Object.values(row).some((v) => String(v).trim() !== '');
    if (!hasAnyContent) return;

    const errors: string[] = [];

    // 1. Full name (Họ và tên hoặc Họ đệm + Tên)
    let fullName = String(
      findValueByAliases(row, [
        'Họ và tên',
        'Họ tên',
        'Họ và Tên',
        'Tên học sinh',
        'Họ tên học sinh',
        'Full Name',
        'Name',
        'HoTen',
        'Ho ten',
        'Họ & Tên',
      ]) || ''
    ).trim();

    // Support separate Họ đệm and Tên (common in vnEdu/SMAS export)
    if (!fullName) {
      const hoDem = String(findValueByAliases(row, ['Họ đệm', 'Họ lót', 'Họ', 'Hodem', 'Ho dem']) || '').trim();
      const ten = String(findValueByAliases(row, ['Tên', 'Ten']) || '').trim();
      if (hoDem || ten) {
        fullName = `${hoDem} ${ten}`.trim();
      }
    }

    if (!fullName) {
      errors.push('Thiếu họ và tên học sinh');
    }

    // 2. Class
    let classId = defaultClassId || '';
    let className = '';

    const rawClass = String(
      findValueByAliases(row, ['Lớp', 'Tên lớp', 'Lớp học', 'Class', 'Lop', 'Ten lop']) || ''
    ).trim();

    if (rawClass) {
      // Find class by name (e.g. "6A1", "Lớp 6A1")
      const matched = classes.find((c) => {
        const cleanName = c.name.toLowerCase().replace(/^lớp\s*/i, '').trim();
        const cleanInput = rawClass.toLowerCase().replace(/^lớp\s*/i, '').trim();
        return cleanName === cleanInput || c.name.toLowerCase() === rawClass.toLowerCase();
      });

      if (matched) {
        classId = matched.id;
        className = matched.name;
      } else {
        className = rawClass;
      }
    }

    if (!classId && classes.length > 0) {
      classId = classes[0].id;
      className = classes[0].name;
    } else if (classId && !className) {
      const found = classes.find((c) => c.id === classId);
      className = found ? found.name : 'Chưa xếp lớp';
    }

    // 3. Student Code
    let studentCode = String(
      findValueByAliases(row, [
        'Mã học sinh',
        'Mã HS',
        'Mã định danh',
        'Mã số',
        'Code',
        'StudentCode',
        'MaHS',
        'Ma HS',
        'Mã',
      ]) || ''
    ).trim();

    if (!studentCode) {
      // Auto-generate code
      const gradeNum = classes.find((c) => c.id === classId)?.gradeLevel || 6;
      const num = existingStudents.length + rows.length + 1;
      studentCode = `HS-0${gradeNum}${num < 10 ? '0' + num : num}`;
    }

    const codeLower = studentCode.toLowerCase();
    if (existingCodeSet.has(codeLower) || seenFileCodes.has(codeLower)) {
      errors.push(`Mã học sinh "${studentCode}" đã tồn tại`);
    } else {
      seenFileCodes.add(codeLower);
    }

    // 4. Gender
    const rawGender = String(
      findValueByAliases(row, ['Giới tính', 'Phái', 'Gender', 'Gioitinh', 'Gioi tinh']) || ''
    ).trim().toLowerCase();
    const gender: 'Nam' | 'Nữ' = rawGender === 'nữ' || rawGender === 'nu' || rawGender === 'female' || rawGender === 'f' ? 'Nữ' : 'Nam';

    // 5. Birth Date
    const rawBirthDate = findValueByAliases(row, [
      'Ngày sinh',
      'Ngày tháng năm sinh',
      'Birth Date',
      'DOB',
      'Ngaysinh',
      'Ngay sinh',
    ]);
    const birthDate = normalizeExcelDate(rawBirthDate);

    // 6. Parent phone
    let parentPhone = String(
      findValueByAliases(row, [
        'SĐT Phụ huynh',
        'SĐT',
        'Số điện thoại',
        'Điện thoại',
        'Điện thoại PH',
        'SĐT PH',
        'Phone',
        'SDT',
        'Telephone',
      ]) || ''
    ).trim();
    // Format phone if digits
    if (parentPhone && !parentPhone.startsWith('0') && /^\d{9}$/.test(parentPhone)) {
      parentPhone = '0' + parentPhone;
    }

    // 7. Status
    const rawStatus = String(
      findValueByAliases(row, ['Trạng thái', 'Trạng thái học tập', 'Status', 'Xếp loại', 'Học lực']) || ''
    ).trim();
    let status: StudentStatus = 'Tích cực';
    if (rawStatus.includes('tiến bộ') || rawStatus.toLowerCase().includes('progress')) {
      status = 'Đang tiến bộ';
    } else if (rawStatus.includes('cố gắng') || rawStatus.toLowerCase().includes('need')) {
      status = 'Cần cố gắng';
    }

    // 8. Notes
    const notes = String(
      findValueByAliases(row, ['Ghi chú', 'Ghi chú sư phạm', 'Notes', 'Note', 'Ghichu', 'Nhận xét']) || ''
    ).trim();

    rows.push({
      studentCode,
      fullName,
      className,
      classId,
      gender,
      birthDate,
      parentPhone,
      status,
      notes,
      isValid: errors.length === 0,
      errors,
    });
  });

  const validRows = rows.filter((r) => r.isValid).length;
  const errorCount = rows.length - validRows;

  return {
    rows,
    totalRows: rows.length,
    validRows,
    errorCount,
  };
}

// Generate and download a sample Excel file (.xlsx)
export function downloadSampleExcelTemplate(classes: ClassItem[]) {
  const defaultClassName = classes[0]?.name || '6A1';
  const secondClassName = classes[1]?.name || classes[0]?.name || '6A2';

  const sampleData = [
    {
      'Mã học sinh': 'HS-0601',
      'Họ và tên': 'Nguyễn Hoàng Nam',
      'Lớp': defaultClassName,
      'Giới tính': 'Nam',
      'Ngày sinh': '15/05/2013',
      'SĐT Phụ huynh': '0912345678',
      'Trạng thái': 'Tích cực',
      'Ghi chú': 'Chăm chỉ phát biểu, diễn đạt lưu loát',
    },
    {
      'Mã học sinh': 'HS-0602',
      'Họ và tên': 'Trần Mai Phương',
      'Lớp': defaultClassName,
      'Giới tính': 'Nữ',
      'Ngày sinh': '22/08/2013',
      'SĐT Phụ huynh': '0987654321',
      'Trạng thái': 'Đang tiến bộ',
      'Ghi chú': 'Kỹ năng làm văn cải thiện rõ rệt',
    },
    {
      'Mã học sinh': 'HS-0603',
      'Họ và tên': 'Lê Đức Minh',
      'Lớp': secondClassName,
      'Giới tính': 'Nam',
      'Ngày sinh': '10/11/2013',
      'SĐT Phụ huynh': '0903123456',
      'Trạng thái': 'Cần cố gắng',
      'Ghi chú': 'Cần rèn thêm chính tả và ngữ pháp',
    },
  ];

  const worksheet = XLSX.utils.json_to_sheet(sampleData);

  // Set column widths for nice appearance
  worksheet['!cols'] = [
    { wch: 14 }, // Mã học sinh
    { wch: 22 }, // Họ và tên
    { wch: 10 }, // Lớp
    { wch: 10 }, // Giới tính
    { wch: 14 }, // Ngày sinh
    { wch: 16 }, // SĐT Phụ huynh
    { wch: 16 }, // Trạng thái
    { wch: 35 }, // Ghi chú
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'DanhSachHocSinh');

  XLSX.writeFile(workbook, 'Mau_Danh_Sach_Hoc_Sinh.xlsx');
}

// Generate and download a sample CSV file (.csv) with UTF-8 BOM
export function downloadSampleCsvTemplate(classes: ClassItem[]) {
  const defaultClassName = classes[0]?.name || '6A1';
  const csvContent =
    '\uFEFF' +
    'Mã học sinh,Họ và tên,Lớp,Giới tính,Ngày sinh,SĐT Phụ huynh,Trạng thái,Ghi chú\n' +
    `HS-0601,Nguyễn Hoàng Nam,${defaultClassName},Nam,15/05/2013,0912345678,Tích cực,Chăm chỉ phát biểu\n` +
    `HS-0602,Trần Mai Phương,${defaultClassName},Nữ,22/08/2013,0987654321,Đang tiến bộ,Kỹ năng làm văn cải thiện\n` +
    `HS-0603,Lê Đức Minh,${defaultClassName},Nam,10/11/2013,0903123456,Cần cố gắng,Cần rèn luyện chữ viết`;

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'Mau_Danh_Sach_Hoc_Sinh.csv';
  a.click();
  URL.revokeObjectURL(url);
}

// Export existing students list to Excel (.xlsx)
export function exportStudentsToExcel(students: Student[], fileName = 'Danh_Sach_Hoc_Sinh.xlsx') {
  const data = students.map((s, index) => ({
    'STT': index + 1,
    'Mã học sinh': s.studentCode,
    'Họ và tên': s.fullName,
    'Lớp': s.className,
    'Giới tính': s.gender,
    'Ngày sinh': s.birthDate,
    'SĐT Phụ huynh': s.parentPhone,
    'Trạng thái': s.status,
    'Ghi chú': s.notes || '',
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  worksheet['!cols'] = [
    { wch: 6 },  // STT
    { wch: 14 }, // Mã học sinh
    { wch: 24 }, // Họ và tên
    { wch: 12 }, // Lớp
    { wch: 10 }, // Giới tính
    { wch: 14 }, // Ngày sinh
    { wch: 16 }, // SĐT Phụ huynh
    { wch: 16 }, // Trạng thái
    { wch: 30 }, // Ghi chú
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'HocSinh');
  XLSX.writeFile(workbook, fileName);
}
