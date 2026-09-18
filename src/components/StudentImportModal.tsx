import { useState, useRef, useId } from 'react';
import {
  X,
  FileSpreadsheet,
  Upload,
  Download,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  RefreshCw,
  Users,
  Info,
} from 'lucide-react';
import { ClassItem, Student } from '../types';
import {
  parseStudentExcelFile,
  downloadSampleExcelTemplate,
  downloadSampleCsvTemplate,
  ParsedStudentRow,
} from '../utils/excelParser';

interface StudentImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  classes: ClassItem[];
  existingStudents: Student[];
  onImportSuccess: (importedStudents: Omit<Student, 'id'>[]) => void;
  onShowToast: (message: string, type?: 'success' | 'warning' | 'info') => void;
}

export function StudentImportModal({
  isOpen,
  onClose,
  classes,
  existingStudents,
  onImportSuccess,
  onShowToast,
}: StudentImportModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fileInputId = useId();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Target class selection mode: 'auto' | 'fixed'
  const [classMode, setClassMode] = useState<'auto' | 'fixed'>('auto');
  const [targetClassId, setTargetClassId] = useState<string>(classes[0]?.id || '');

  // Parsed rows
  const [parsedRows, setParsedRows] = useState<ParsedStudentRow[]>([]);
  const [hasParsed, setHasParsed] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);

  // Filter valid only
  const [filterOnlyValid, setFilterOnlyValid] = useState(false);

  if (!isOpen) return null;

  const handleProcessFile = async (file: File) => {
    setSelectedFile(file);
    setIsProcessing(true);
    setParseError(null);

    try {
      const buffer = await file.arrayBuffer();
      const result = parseStudentExcelFile(
        buffer,
        classes,
        existingStudents,
        classMode === 'fixed' ? targetClassId : undefined
      );

      if (result.rows.length === 0) {
        setParseError('Không tìm thấy dữ liệu học sinh hợp lệ trong tệp đã chọn. Vui lòng kiểm tra lại file hoặc tải mẫu chuẩn.');
        setParsedRows([]);
        setHasParsed(true);
      } else {
        setParsedRows(result.rows);
        setHasParsed(true);
      }
    } catch (err) {
      console.error('Lỗi khi đọc file Excel:', err);
      setParseError('Không thể xử lý tệp Excel/CSV này. Vui lòng đảm bảo tệp không bị khóa hoặc hỏng.');
      setParsedRows([]);
      setHasParsed(true);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleProcessFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const ext = file.name.split('.').pop()?.toLowerCase();
      if (ext === 'xlsx' || ext === 'xls' || ext === 'csv') {
        handleProcessFile(file);
      } else {
        onShowToast('Vui lòng chọn định dạng file .xlsx, .xls hoặc .csv', 'warning');
      }
    }
  };

  const handleReParseWithNewClassMode = async (newMode: 'auto' | 'fixed', newClassId?: string) => {
    setClassMode(newMode);
    const activeClassId = newClassId !== undefined ? newClassId : targetClassId;
    if (newClassId !== undefined) setTargetClassId(newClassId);

    if (selectedFile) {
      setIsProcessing(true);
      try {
        const buffer = await selectedFile.arrayBuffer();
        const result = parseStudentExcelFile(
          buffer,
          classes,
          existingStudents,
          newMode === 'fixed' ? activeClassId : undefined
        );
        setParsedRows(result.rows);
      } catch (e) {
        console.error(e);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleResetFile = () => {
    setSelectedFile(null);
    setParsedRows([]);
    setHasParsed(false);
    setParseError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const validRows = parsedRows.filter((r) => r.isValid);
  const rowsToDisplay = filterOnlyValid ? validRows : parsedRows;

  const handleConfirmImport = () => {
    if (validRows.length === 0) {
      onShowToast('Không có học sinh hợp lệ nào để nhập.', 'warning');
      return;
    }

    const studentsToAdd: Omit<Student, 'id'>[] = validRows.map((r) => ({
      studentCode: r.studentCode,
      fullName: r.fullName,
      classId: r.classId,
      className: r.className,
      gender: r.gender,
      birthDate: r.birthDate,
      parentPhone: r.parentPhone,
      status: r.status,
      notes: r.notes,
    }));

    onImportSuccess(studentsToAdd);
    onClose();
    handleResetFile();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-xs">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base md:text-lg text-slate-800 flex items-center gap-2">
                Nhập danh sách học sinh từ Excel / CSV
              </h3>
              <p className="text-xs text-slate-500">
                Tự động nhận diện cột Họ tên, Mã HS, Lớp, Ngày sinh, Giới tính, SĐT từ bảng tính
              </p>
            </div>
          </div>
          <button
            type="button"
            id="btn-close-import-modal"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 md:p-6 overflow-y-auto space-y-5 flex-1">
          {/* Step 1: Download Templates & Guidelines */}
          <div className="bg-amber-50/80 border border-amber-200/70 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="space-y-1 text-slate-700">
              <p className="font-semibold text-amber-900 flex items-center gap-1.5">
                <Info className="w-4 h-4 text-amber-600 shrink-0" />
                Mẹo nhập nhanh danh sách:
              </p>
              <p className="text-slate-600">
                Chỉ cần có cột <strong className="text-slate-800">"Họ và tên"</strong>. Hệ thống tự động nhận diện theo mẫu vnEdu, SMAS hoặc bạn có thể tải mẫu Excel chuẩn dưới đây:
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                id="btn-download-sample-excel"
                onClick={() => downloadSampleExcelTemplate(classes)}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Tải mẫu Excel (.xlsx)</span>
              </button>
              <button
                type="button"
                id="btn-download-sample-csv"
                onClick={() => downloadSampleCsvTemplate(classes)}
                className="px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-800 text-white font-medium flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Mẫu CSV</span>
              </button>
            </div>
          </div>

          {/* Class assignment options */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
            <label className="block text-xs font-semibold text-slate-700">
              Cách gán lớp cho học sinh:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <label
                className={`p-3 rounded-xl border flex items-start gap-2.5 cursor-pointer transition-colors ${
                  classMode === 'auto'
                    ? 'border-emerald-500 bg-emerald-50/50 text-emerald-950 font-medium'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100/60'
                }`}
              >
                <input
                  type="radio"
                  name="classMode"
                  value="auto"
                  checked={classMode === 'auto'}
                  onChange={() => handleReParseWithNewClassMode('auto')}
                  className="mt-0.5 text-emerald-600 focus:ring-emerald-500"
                />
                <div>
                  <div className="font-semibold">Tự động nhận diện theo cột "Lớp"</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Học sinh sẽ được đưa vào đúng lớp ghi trong file Excel (ví dụ 6A1, 6A2...)
                  </div>
                </div>
              </label>

              <label
                className={`p-3 rounded-xl border flex items-start gap-2.5 cursor-pointer transition-colors ${
                  classMode === 'fixed'
                    ? 'border-emerald-500 bg-emerald-50/50 text-emerald-950 font-medium'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100/60'
                }`}
              >
                <input
                  type="radio"
                  name="classMode"
                  value="fixed"
                  checked={classMode === 'fixed'}
                  onChange={() => handleReParseWithNewClassMode('fixed')}
                  className="mt-0.5 text-emerald-600 focus:ring-emerald-500"
                />
                <div className="w-full">
                  <div className="font-semibold">Gán toàn bộ học sinh vào một lớp cố định:</div>
                  <select
                    value={targetClassId}
                    disabled={classMode !== 'fixed'}
                    onChange={(e) => handleReParseWithNewClassMode('fixed', e.target.value)}
                    className="mt-1.5 w-full px-2.5 py-1 text-xs border border-slate-300 rounded-lg bg-white disabled:bg-slate-100 disabled:text-slate-400 focus:ring-2 focus:ring-emerald-500"
                  >
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        Lớp {c.name} (Khối {c.gradeLevel})
                      </option>
                    ))}
                  </select>
                </div>
              </label>
            </div>
          </div>

          {/* File Upload / Drag & Drop Area */}
          {!hasParsed ? (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                isDragging
                  ? 'border-emerald-500 bg-emerald-50/60 scale-[0.99]'
                  : 'border-slate-300 hover:border-emerald-400 hover:bg-slate-50/60'
              }`}
            >
              <input
                ref={fileInputRef}
                id={fileInputId}
                type="file"
                accept=".xlsx, .xls, .csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, text/csv"
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="flex flex-col items-center justify-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-xs">
                  {isProcessing ? (
                    <RefreshCw className="w-7 h-7 animate-spin" />
                  ) : (
                    <Upload className="w-7 h-7" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    {isProcessing
                      ? 'Đang đọc và phân tích bảng tính...'
                      : 'Kéo thả tệp Excel (.xlsx, .xls) hoặc CSV vào đây'}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    hoặc nhấn vào khung để duyệt file từ máy tính
                  </p>
                </div>
                <div className="inline-flex items-center gap-2 text-[11px] font-medium text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
                  <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Hỗ trợ định dạng Excel (.xlsx, .xls) và .csv chuẩn Unicode
                </div>
              </div>
            </div>
          ) : (
            /* Selected File Summary and Quick Actions */
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">{selectedFile?.name}</p>
                  <p className="text-[11px] text-slate-500">
                    {(selectedFile?.size ? (selectedFile.size / 1024).toFixed(1) : '0')} KB • Tìm thấy {parsedRows.length} dòng
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  id="btn-reselect-file"
                  onClick={handleResetFile}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-200/70 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Chọn tệp khác</span>
                </button>
              </div>
            </div>
          )}

          {/* Parse Error */}
          {parseError && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <div>
                <p className="font-semibold">{parseError}</p>
                <p className="mt-0.5 text-rose-600/90">
                  Hãy thử tải lại file mẫu chuẩn của hệ thống để so sánh cấu trúc cột.
                </p>
              </div>
            </div>
          )}

          {/* Preview Table */}
          {hasParsed && parsedRows.length > 0 && (
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-slate-800">Kết quả xem trước ({parsedRows.length} học sinh):</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    {validRows.length} hợp lệ
                  </span>
                  {parsedRows.length - validRows.length > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-semibold flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3 text-amber-600" />
                      {parsedRows.length - validRows.length} dòng có lỗi
                    </span>
                  )}
                </div>

                <label className="inline-flex items-center gap-1.5 cursor-pointer select-none text-slate-600 hover:text-slate-900">
                  <input
                    type="checkbox"
                    checked={filterOnlyValid}
                    onChange={(e) => setFilterOnlyValid(e.target.checked)}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Chỉ hiển thị dòng hợp lệ ({validRows.length})</span>
                </label>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden max-h-64 overflow-y-auto bg-white shadow-2xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100/90 text-slate-600 uppercase font-semibold text-[10px] sticky top-0 z-10 border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3 w-10 text-center">STT</th>
                      <th className="py-2.5 px-3">Mã HS</th>
                      <th className="py-2.5 px-3">Họ và tên</th>
                      <th className="py-2.5 px-3">Lớp</th>
                      <th className="py-2.5 px-3 text-center">Giới tính</th>
                      <th className="py-2.5 px-3">Ngày sinh</th>
                      <th className="py-2.5 px-3">SĐT Phụ huynh</th>
                      <th className="py-2.5 px-3">Trạng thái</th>
                      <th className="py-2.5 px-3 text-right">Kiểm tra</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {rowsToDisplay.map((row, index) => (
                      <tr
                        key={`${row.studentCode}-${index}`}
                        className={`hover:bg-slate-50 transition-colors ${
                          !row.isValid ? 'bg-amber-50/40 text-amber-950' : ''
                        }`}
                      >
                        <td className="py-2 px-3 text-center text-slate-400 font-mono text-[11px]">
                          {index + 1}
                        </td>
                        <td className="py-2 px-3 font-mono font-medium text-slate-700">
                          {row.studentCode}
                        </td>
                        <td className="py-2 px-3 font-semibold text-slate-900">
                          {row.fullName}
                        </td>
                        <td className="py-2 px-3">
                          <span className="px-2 py-0.5 bg-slate-100 rounded text-slate-700 font-medium">
                            {row.className}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-center">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                              row.gender === 'Nam'
                                ? 'bg-sky-100 text-sky-700'
                                : 'bg-rose-100 text-rose-700'
                            }`}
                          >
                            {row.gender}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-slate-600 font-mono text-[11px]">
                          {row.birthDate}
                        </td>
                        <td className="py-2 px-3 text-slate-600 font-mono text-[11px]">
                          {row.parentPhone || '—'}
                        </td>
                        <td className="py-2 px-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                              row.status === 'Tích cực'
                                ? 'bg-emerald-100 text-emerald-700'
                                : row.status === 'Đang tiến bộ'
                                ? 'bg-amber-100 text-amber-700'
                                : 'bg-rose-100 text-rose-700'
                            }`}
                          >
                            {row.status}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-right">
                          {row.isValid ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              Hợp lệ
                            </span>
                          ) : (
                            <span
                              className="inline-flex items-center gap-1 text-[11px] font-medium text-rose-600 cursor-help"
                              title={row.errors.join(', ')}
                            >
                              <AlertTriangle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                              <span className="truncate max-w-[120px]">{row.errors[0]}</span>
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="p-4 px-6 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
          <div className="text-xs text-slate-500">
            {hasParsed && validRows.length > 0 ? (
              <span>
                Sẵn sàng thêm <strong className="text-slate-800">{validRows.length}</strong> học sinh vào hệ thống.
              </span>
            ) : (
              <span>Chưa có dữ liệu nào được chọn</span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              id="btn-cancel-import"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="button"
              id="btn-confirm-import-students"
              disabled={validRows.length === 0}
              onClick={handleConfirmImport}
              className="px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Users className="w-4 h-4" />
              <span>Xác nhận nhập ({validRows.length}) học sinh</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
