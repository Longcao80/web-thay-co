import { AppData } from './types';

export const INITIAL_DEMO_DATA: AppData = {
  classes: [
    {
      id: 'cls-6a',
      name: '6A',
      gradeLevel: 6,
      room: 'Phòng 102 - Tầng 1',
      academicYear: '2026 - 2027',
      totalStudents: 6,
      teacher: 'Kiều Cao Long',
      note: 'Lớp đầu cấp, học sinh tích cực, ham học hỏi và chăm chỉ rèn luyện tư duy.'
    },
    {
      id: 'cls-7a',
      name: '7A',
      gradeLevel: 7,
      room: 'Phòng 201 - Tầng 2',
      academicYear: '2026 - 2027',
      totalStudents: 5,
      teacher: 'Kiều Cao Long',
      note: 'Lớp có tinh thần giải toán sôi nổi, kỹ năng suy luận hình học tốt.'
    },
    {
      id: 'cls-8a',
      name: '8A',
      gradeLevel: 8,
      room: 'Phòng 301 - Tầng 3',
      academicYear: '2026 - 2027',
      totalStudents: 5,
      teacher: 'Kiều Cao Long',
      note: 'Kỹ năng giải phương trình và đại số tiến bộ rõ rệt, sôi nổi trong giờ học.'
    },
    {
      id: 'cls-9a',
      name: '9A',
      gradeLevel: 9,
      room: 'Phòng 304 - Tầng 3',
      academicYear: '2026 - 2027',
      totalStudents: 5,
      teacher: 'Kiều Cao Long',
      note: 'Lớp cuối cấp, tập trung ôn thi vào 10 và rèn luyện kỹ năng giải toán phân hóa cao.'
    }
  ],

  students: [
    // Lớp 6A (6 học sinh)
    {
      id: 'hs-601',
      studentCode: 'HS-0601',
      fullName: 'Nguyễn Hoàng An',
      classId: 'cls-6a',
      className: '6A',
      gender: 'Nam',
      birthDate: '2014-03-15',
      parentPhone: '0912 345 678',
      status: 'Tích cực',
      notes: 'Chăm chỉ phát biểu, rất thích các truyện truyền thuyết và cổ tích.'
    },
    {
      id: 'hs-602',
      studentCode: 'HS-0602',
      fullName: 'Trần Mai Chi',
      classId: 'cls-6a',
      className: '6A',
      gender: 'Nữ',
      birthDate: '2014-07-22',
      parentPhone: '0988 123 456',
      status: 'Tích cực',
      notes: 'Chữ viết đẹp, diễn đạt văn chương trong sáng, giàu cảm xúc.'
    },
    {
      id: 'hs-603',
      studentCode: 'HS-0603',
      fullName: 'Lê Minh Đức',
      classId: 'cls-6a',
      className: '6A',
      gender: 'Nam',
      birthDate: '2014-11-05',
      parentPhone: '0903 555 789',
      status: 'Đang tiến bộ',
      notes: 'Kỹ năng đọc diễn cảm có tiến bộ, cần rèn luyện thêm cách lập dàn ý.'
    },
    {
      id: 'hs-604',
      studentCode: 'HS-0604',
      fullName: 'Phạm Quỳnh Giang',
      classId: 'cls-6a',
      className: '6A',
      gender: 'Nữ',
      birthDate: '2014-02-18',
      parentPhone: '0977 444 321',
      status: 'Tích cực',
      notes: 'Tư duy logic tốt, tiếp thu phần kiến thức Tiếng Việt rất nhanh.'
    },
    {
      id: 'hs-605',
      studentCode: 'HS-0605',
      fullName: 'Vũ Quốc Huy',
      classId: 'cls-6a',
      className: '6A',
      gender: 'Nam',
      birthDate: '2014-09-30',
      parentPhone: '0934 888 999',
      status: 'Cần cố gắng',
      notes: 'Thường quên hoàn thành bài tập chuẩn bị bài trước ở nhà.'
    },
    {
      id: 'hs-606',
      studentCode: 'HS-0606',
      fullName: 'Đỗ Thảo Linh',
      classId: 'cls-6a',
      className: '6A',
      gender: 'Nữ',
      birthDate: '2014-05-12',
      parentPhone: '0915 222 333',
      status: 'Đang tiến bộ',
      notes: 'Đã bạo dạn hơn khi đứng trước lớp trình bày cảm nghĩ về nhân vật.'
    },

    // Lớp 7A (5 học sinh)
    {
      id: 'hs-701',
      studentCode: 'HS-0701',
      fullName: 'Bùi Tuấn Kiệt',
      classId: 'cls-7a',
      className: '7A',
      gender: 'Nam',
      birthDate: '2013-04-10',
      parentPhone: '0908 111 222',
      status: 'Tích cực',
      notes: 'Học sinh giỏi toàn diện, thường xuyên hỗ trợ các bạn trong nhóm học tập.'
    },
    {
      id: 'hs-702',
      studentCode: 'HS-0702',
      fullName: 'Đặng Ngọc Lan',
      classId: 'cls-7a',
      className: '7A',
      gender: 'Nữ',
      birthDate: '2013-08-25',
      parentPhone: '0945 666 777',
      status: 'Tích cực',
      notes: 'Cảm thụ thơ ca tốt, viết đoạn văn bộc lộ cảm xúc sâu lắng.'
    },
    {
      id: 'hs-703',
      studentCode: 'HS-0703',
      fullName: 'Hoàng Văn Nam',
      classId: 'cls-7a',
      className: '7A',
      gender: 'Nam',
      birthDate: '2013-12-01',
      parentPhone: '0922 333 444',
      status: 'Cần cố gắng',
      notes: 'Hay đi học muộn trong tuần vừa qua, cần nhắc nhở kỷ luật giờ giấc.'
    },
    {
      id: 'hs-704',
      studentCode: 'HS-0704',
      fullName: 'Dương Khánh Như',
      classId: 'cls-7a',
      className: '7A',
      gender: 'Nữ',
      birthDate: '2013-01-19',
      parentPhone: '0963 888 111',
      status: 'Đang tiến bộ',
      notes: 'Có sự tự tin khi phát biểu, phần Ngữ pháp tiếng Việt cần rèn thêm.'
    },
    {
      id: 'hs-705',
      studentCode: 'HS-0705',
      fullName: 'Ngô Trọng Phát',
      classId: 'cls-7a',
      className: '7A',
      gender: 'Nam',
      birthDate: '2013-06-14',
      parentPhone: '0981 777 555',
      status: 'Đang tiến bộ',
      notes: 'Vẽ sơ đồ tư duy tóm tắt nội dung bài học rất sáng tạo.'
    },

    // Lớp 8A (5 học sinh)
    {
      id: 'hs-801',
      studentCode: 'HS-0801',
      fullName: 'Phan Minh Quân',
      classId: 'cls-8a',
      className: '8A',
      gender: 'Nam',
      birthDate: '2012-02-28',
      parentPhone: '0919 222 888',
      status: 'Tích cực',
      notes: 'Kỹ năng làm văn nghị luận xã hội sắc bén, dẫn chứng phong phú.'
    },
    {
      id: 'hs-802',
      studentCode: 'HS-0802',
      fullName: 'Võ Thanh Tâm',
      classId: 'cls-8a',
      className: '8A',
      gender: 'Nữ',
      birthDate: '2012-05-17',
      parentPhone: '0909 333 999',
      status: 'Tích cực',
      notes: 'Lời văn trau chuốt, ý tứ mạch lạc, bài làm kiểm tra luôn đạt điểm cao.'
    },
    {
      id: 'hs-803',
      studentCode: 'HS-0803',
      fullName: 'Lý Quốc Thịnh',
      classId: 'cls-8a',
      className: '8A',
      gender: 'Nam',
      birthDate: '2012-10-09',
      parentPhone: '0937 444 666',
      status: 'Cần cố gắng',
      notes: 'Điểm kiểm tra giữa kỳ có dấu hiệu sụt giảm, cần phụ đạo thêm phân tích tác phẩm.'
    },
    {
      id: 'hs-804',
      studentCode: 'HS-0804',
      fullName: 'Trương Ánh Uyên',
      classId: 'cls-8a',
      className: '8A',
      gender: 'Nữ',
      birthDate: '2012-07-03',
      parentPhone: '0978 123 987',
      status: 'Đang tiến bộ',
      notes: 'Rất tích cực ghi chép bài, chú ý nghe thầy giảng trên lớp.'
    },
    {
      id: 'hs-805',
      studentCode: 'HS-0805',
      fullName: 'Hà Gia Vĩ',
      classId: 'cls-8a',
      className: '8A',
      gender: 'Nam',
      birthDate: '2012-09-21',
      parentPhone: '0943 555 123',
      status: 'Đang tiến bộ',
      notes: 'Có chuyển biến tốt về khả năng diễn đạt và dùng từ ngữ chuẩn xác.'
    },

    // Lớp 9A (5 học sinh)
    {
      id: 'hs-901',
      studentCode: 'HS-0901',
      fullName: 'Trần Bảo Anh',
      classId: 'cls-9a',
      className: '9A',
      gender: 'Nữ',
      birthDate: '2011-03-08',
      parentPhone: '0901 888 777',
      status: 'Tích cực',
      notes: 'Học sinh giỏi cấp trường môn Ngữ văn, khả năng viết nghị luận văn học rất xuất sắc.'
    },
    {
      id: 'hs-902',
      studentCode: 'HS-0902',
      fullName: 'Lê Hoàng Bách',
      classId: 'cls-9a',
      className: '9A',
      gender: 'Nam',
      birthDate: '2011-06-19',
      parentPhone: '0982 999 444',
      status: 'Tích cực',
      notes: 'Tư duy độc lập, có cái nhìn mới mẻ và sâu sắc về các nhân vật văn học.'
    },
    {
      id: 'hs-903',
      studentCode: 'HS-0903',
      fullName: 'Nguyễn Thùy Dương',
      classId: 'cls-9a',
      className: '9A',
      gender: 'Nữ',
      birthDate: '2011-10-14',
      parentPhone: '0918 333 555',
      status: 'Đang tiến bộ',
      notes: 'Có sự chuẩn bị chu đáo trước mỗi kỳ kiểm tra, điểm số duy trì ổn định.'
    },
    {
      id: 'hs-904',
      studentCode: 'HS-0904',
      fullName: 'Phạm Đăng Khôi',
      classId: 'cls-9a',
      className: '9A',
      gender: 'Nam',
      birthDate: '2011-01-27',
      parentPhone: '0931 777 222',
      status: 'Cần cố gắng',
      notes: 'Chưa tập trung cao độ trong các tiết ôn tập, cần rèn thêm kỹ năng làm văn nhanh.'
    },
    {
      id: 'hs-905',
      studentCode: 'HS-0905',
      fullName: 'Đoàn Kim Ngân',
      classId: 'cls-9a',
      className: '9A',
      gender: 'Nữ',
      birthDate: '2011-12-03',
      parentPhone: '0979 444 888',
      status: 'Tích cực',
      notes: 'Kỹ năng trình bày bài thi sạch đẹp, diễn đạt chặt chẽ và truyền cảm.'
    }
  ],

  attendance: [
    // Ngày gần nhất cho 6A
    { id: 'att-1', date: '2026-09-18', classId: 'cls-6a', studentId: 'hs-601', status: 'present' },
    { id: 'att-2', date: '2026-09-18', classId: 'cls-6a', studentId: 'hs-602', status: 'present' },
    { id: 'att-3', date: '2026-09-18', classId: 'cls-6a', studentId: 'hs-603', status: 'present' },
    { id: 'att-4', date: '2026-09-18', classId: 'cls-6a', studentId: 'hs-604', status: 'present' },
    { id: 'att-5', date: '2026-09-18', classId: 'cls-6a', studentId: 'hs-605', status: 'late', note: 'Đi muộn 10 phút' },
    { id: 'att-6', date: '2026-09-18', classId: 'cls-6a', studentId: 'hs-606', status: 'present' },

    // 7A
    { id: 'att-7', date: '2026-09-18', classId: 'cls-7a', studentId: 'hs-701', status: 'present' },
    { id: 'att-8', date: '2026-09-18', classId: 'cls-7a', studentId: 'hs-702', status: 'present' },
    { id: 'att-9', date: '2026-09-18', classId: 'cls-7a', studentId: 'hs-703', status: 'absent', note: 'Gia đình chưa báo phép' },
    { id: 'att-10', date: '2026-09-18', classId: 'cls-7a', studentId: 'hs-704', status: 'present' },
    { id: 'att-11', date: '2026-09-18', classId: 'cls-7a', studentId: 'hs-705', status: 'present' },

    // 8A
    { id: 'att-12', date: '2026-09-18', classId: 'cls-8a', studentId: 'hs-801', status: 'present' },
    { id: 'att-13', date: '2026-09-18', classId: 'cls-8a', studentId: 'hs-802', status: 'present' },
    { id: 'att-14', date: '2026-09-18', classId: 'cls-8a', studentId: 'hs-803', status: 'excused', note: 'Có đơn xin nghỉ ốm' },
    { id: 'att-15', date: '2026-09-18', classId: 'cls-8a', studentId: 'hs-804', status: 'present' },
    { id: 'att-16', date: '2026-09-18', classId: 'cls-8a', studentId: 'hs-805', status: 'present' },

    // 9A
    { id: 'att-17', date: '2026-09-18', classId: 'cls-9a', studentId: 'hs-901', status: 'present' },
    { id: 'att-18', date: '2026-09-18', classId: 'cls-9a', studentId: 'hs-902', status: 'present' },
    { id: 'att-19', date: '2026-09-18', classId: 'cls-9a', studentId: 'hs-903', status: 'present' },
    { id: 'att-20', date: '2026-09-18', classId: 'cls-9a', studentId: 'hs-904', status: 'present' },
    { id: 'att-21', date: '2026-09-18', classId: 'cls-9a', studentId: 'hs-905', status: 'present' },
  ],

  lessons: [
    {
      id: 'les-1',
      title: 'Đọc hiểu văn bản: Thánh Gióng',
      gradeLevel: 6,
      topic: 'Truyền thuyết dân gian Việt Nam',
      category: 'Đọc hiểu',
      date: '2026-09-15',
      durationMinutes: 90,
      objectives: 'Nắm được các chi tiết kỳ ảo, ý nghĩa biểu tượng người anh hùng cứu nước và tinh thần đoàn kết dân tộc.',
      mainContent: 'Phân tích hoàn cảnh ra đời kỳ lạ của Thánh Gióng; sự lớn lên phi thường; chiến công đánh giặc Ân; dấu tích còn lại.',
      notes: 'Chuẩn bị tranh minh họa làng Phù Đổng và đền Gióng.'
    },
    {
      id: 'les-2',
      title: 'Thực hành Tiếng Việt: Từ đơn và Từ phức',
      gradeLevel: 6,
      topic: 'Cấu tạo từ tiếng Việt',
      category: 'Tiếng Việt',
      date: '2026-09-17',
      durationMinutes: 45,
      objectives: 'Phân biệt từ đơn và từ phức (từ ghép, từ láy); nhận biết tác dụng gợi hình gợi cảm của từ láy.',
      mainContent: 'Khái niệm từ đơn, từ ghép, từ láy; các dạng bài tập phân loại từ trong ngữ cảnh văn bản Thánh Gióng.',
      notes: 'Cho học sinh làm việc theo nhóm 4 em để tìm nhanh từ láy.'
    },
    {
      id: 'les-3',
      title: 'Đọc hiểu: Tinh thần yêu nước của nhân dân ta',
      gradeLevel: 7,
      topic: 'Văn bản nghị luận chứng minh',
      category: 'Văn học',
      date: '2026-09-14',
      durationMinutes: 90,
      objectives: 'Hiểu được lòng yêu nước nồng nàn của dân tộc ta qua các thời kỳ; nghệ thuật lập luận mẫu mực của Chủ tịch Hồ Chí Minh.',
      mainContent: 'Bố cục bài văn; luận điểm chính; hệ thống dẫn chứng toàn diện qua lịch sử và thực tiễn kháng chiến; hình ảnh so sánh đặc sắc.',
      notes: 'Nhấn mạnh nghệ thuật dẫn chứng mạch lạc và liên kết câu.'
    },
    {
      id: 'les-4',
      title: 'Kỹ năng Viết: Viết bài văn biểu cảm về một sự việc',
      gradeLevel: 7,
      topic: 'Tập làm văn biểu cảm',
      category: 'Viết',
      date: '2026-09-19',
      durationMinutes: 90,
      objectives: 'Biết cách bộc lộ cảm xúc chân thật, tự nhiên trước một sự việc có ý nghĩa trong cuộc sống.',
      mainContent: 'Các bước làm bài văn biểu cảm: Tìm ý, lập dàn ý 3 phần, cách dùng từ ngữ gợi cảm và biện pháp tu từ.',
      notes: 'Yêu cầu mỗi học sinh chuẩn bị một kỷ niệm đáng nhớ về tình bạn hoặc mái trường.'
    },
    {
      id: 'les-5',
      title: 'Đọc hiểu: Tức nước vỡ bờ (Trích Tắt đèn - Ngô Tất Tố)',
      gradeLevel: 8,
      topic: 'Văn học hiện thực phê phán 1930 - 1945',
      category: 'Đọc hiểu',
      date: '2026-09-16',
      durationMinutes: 90,
      objectives: 'Thấy được bộ mặt tàn bạo của chế độ thực dân phong kiến và phẩm chất kiên cường, giàu đức hy sinh của chị Dậu.',
      mainContent: 'Diễn biến xung đột giữa chị Dậu và cai lệ, người nhà lý trưởng; diễn biến tâm lý từ van xin nhẫn nhục đến phản kháng quyết liệt.',
      notes: 'Liên hệ quy luật "ở đâu có áp bức, ở đó có đấu tranh".'
    },
    {
      id: 'les-6',
      title: 'Nói và nghe: Trình bày ý kiến về một vấn đề xã hội',
      gradeLevel: 8,
      topic: 'Rèn luyện kỹ năng thuyết trình',
      category: 'Nói và nghe',
      date: '2026-09-20',
      durationMinutes: 45,
      objectives: 'Tự tin trình bày quan điểm cá nhân một cách rõ ràng, có căn cứ thuyết phục và văn hóa tranh biện lành mạnh.',
      mainContent: 'Chủ đề: "Văn hóa ứng xử trên không gian mạng của học sinh THCS". Hướng dẫn mở đầu, triển khai luận cứ và kết luận.',
      notes: 'Bố trí lớp hình chữ U để học sinh dễ tương tác.'
    },
    {
      id: 'les-7',
      title: 'Đọc hiểu: Đồng chí (Chính Hữu)',
      gradeLevel: 9,
      topic: 'Thơ ca thời kỳ kháng chiến chống Pháp',
      category: 'Văn học',
      date: '2026-09-12',
      durationMinutes: 90,
      objectives: 'Cảm nhận vẻ đẹp chân thực, giản dị của người lính và tình đồng chí, đồng đội gắn bó keo sơn trong gian khổ.',
      mainContent: 'Cơ sở hình thành tình đồng chí; biểu hiện của tình đồng đội trong gian khó; bức tranh kết thúc tuyệt đẹp: "Đầu súng trăng treo".',
      notes: 'Khắc sâu hình ảnh biểu tượng "Đầu súng trăng treo".'
    },
    {
      id: 'les-8',
      title: 'Kỹ năng Viết: Nghị luận về một tác phẩm thơ',
      gradeLevel: 9,
      topic: 'Nghị luận văn học ôn thi vào lớp 10',
      category: 'Viết',
      date: '2026-09-18',
      durationMinutes: 90,
      objectives: 'Nắm vững phương pháp phân tích, cảm nhận đoạn thơ/bài thơ; kết hợp giữa cảm xúc và lý lẽ sắc sảo.',
      mainContent: 'Quy trình nghị luận thơ: Giới thiệu tác giả tác phẩm, phân tích giá trị nội dung và nghệ thuật, đánh giá khái quát.',
      notes: 'Cung cấp sơ đồ cấu trúc đoạn văn nghị luận mẫu cho học sinh ôn tập.'
    }
  ],

  assignments: [
    {
      id: 'asg-1',
      title: 'Viết đoạn văn ngắn (7-10 câu) cảm nghĩ về hình tượng Thánh Gióng',
      classId: 'cls-6a',
      className: '6A',
      requirements: 'Nêu rõ cảm xúc của em về lòng yêu nước và ước mơ của nhân dân gửi gắm qua hình tượng người anh hùng làng Gióng. Có sử dụng ít nhất một từ láy.',
      assignedDate: '2026-09-15',
      dueDate: '2026-09-22',
      status: 'Đang thực hiện',
      submissions: {
        'hs-601': { submitted: true, submittedDate: '2026-09-16', score: 8.5, feedback: 'Đoạn văn viết cảm xúc, dùng từ láy khéo léo.' },
        'hs-602': { submitted: true, submittedDate: '2026-09-17', score: 9.0, feedback: 'Rất sáng tạo, cảm nhận sâu sắc.' },
        'hs-603': { submitted: true, submittedDate: '2026-09-17', score: 7.5, feedback: 'Ý tốt, cần chú ý dấu câu kết đoạn.' },
        'hs-604': { submitted: true, submittedDate: '2026-09-18', score: 8.0, feedback: 'Bố cục rõ ràng, có dẫn chứng phù hợp.' },
        'hs-605': { submitted: false },
        'hs-606': { submitted: true, submittedDate: '2026-09-18', score: 7.5, feedback: 'Tiến bộ so với bài trước.' }
      }
    },
    {
      id: 'asg-2',
      title: 'Lập dàn ý bài văn biểu cảm về người thầy/cô giáo em yêu quý',
      classId: 'cls-7a',
      className: '7A',
      requirements: 'Xây dựng dàn ý chi tiết gồm Mở bài, Thân bài (3 luận điểm biểu cảm gắn với kỷ niệm), Kết bài. Chuẩn bị nộp bản thảo trên giấy A4.',
      assignedDate: '2026-09-14',
      dueDate: '2026-09-20',
      status: 'Sắp hết hạn',
      submissions: {
        'hs-701': { submitted: true, submittedDate: '2026-09-16', score: 8.5, feedback: 'Dàn ý chi tiết, giàu cảm xúc chân thực.' },
        'hs-702': { submitted: true, submittedDate: '2026-09-17', score: 9.0, feedback: 'Kỷ niệm lựa chọn rất đắt giá.' },
        'hs-703': { submitted: false },
        'hs-704': { submitted: true, submittedDate: '2026-09-18', score: 7.5, feedback: 'Thân bài cần bổ sung thêm chi tiết cụ thể.' },
        'hs-705': { submitted: true, submittedDate: '2026-09-17', score: 8.0, feedback: 'Trình bày sơ đồ dàn ý rất đẹp.' }
      }
    },
    {
      id: 'asg-3',
      title: 'Phân tích diễn biến tâm lý chị Dậu trong đoạn trích Tức nước vỡ bờ',
      classId: 'cls-8a',
      className: '8A',
      requirements: 'Viết bài văn hoàn chỉnh khoảng 1,5 đến 2 trang giấy thi. Làm sáng tỏ sự chuyển biến từ nhẫn nhục van xin sang phản kháng quyết liệt.',
      assignedDate: '2026-09-16',
      dueDate: '2026-09-23',
      status: 'Đang thực hiện',
      submissions: {
        'hs-801': { submitted: true, submittedDate: '2026-09-17', score: 9.0, feedback: 'Lập luận sắc bén, dẫn chứng chọn lọc.' },
        'hs-802': { submitted: true, submittedDate: '2026-09-18', score: 8.5, feedback: 'Văn phong truyền cảm, hiểu bài sâu.' },
        'hs-803': { submitted: false },
        'hs-804': { submitted: true, submittedDate: '2026-09-18', score: 7.5, feedback: 'Cần chú ý liên kết giữa các đoạn.' },
        'hs-805': { submitted: true, submittedDate: '2026-09-17', score: 8.0, feedback: 'Có chuyển biến rõ rệt trong diễn đạt.' }
      }
    },
    {
      id: 'asg-4',
      title: 'Cảm nhận vẻ đẹp hình ảnh "Đầu súng trăng treo" trong bài thơ Đồng chí',
      classId: 'cls-9a',
      className: '9A',
      requirements: 'Viết đoạn văn quy nạp hoặc tổng phân hợp (khoảng 200 chữ) làm nổi bật vẻ đẹp hiện thực hòa quyện lãng mạn của câu thơ kết bài.',
      assignedDate: '2026-09-12',
      dueDate: '2026-09-17',
      status: 'Đã hoàn thành',
      submissions: {
        'hs-901': { submitted: true, submittedDate: '2026-09-14', score: 9.5, feedback: 'Bài viết xuất sắc, am hiểu văn cảnh sâu sắc.' },
        'hs-902': { submitted: true, submittedDate: '2026-09-15', score: 9.0, feedback: 'Phát hiện tinh tế về nhịp điệu và hình ảnh.' },
        'hs-903': { submitted: true, submittedDate: '2026-09-15', score: 8.5, feedback: 'Diễn đạt mượt mà, đúng cấu trúc yêu cầu.' },
        'hs-904': { submitted: true, submittedDate: '2026-09-16', score: 7.0, feedback: 'Đã nộp bài, chú ý không viết lan man.' },
        'hs-905': { submitted: true, submittedDate: '2026-09-15', score: 8.5, feedback: 'Cảm thụ nghệ thuật rất tốt.' }
      }
    }
  ],

  grades: {
    // 6A
    'hs-601': { studentId: 'hs-601', regularScores: [8.5, 9.0, 8.0], midtermScore: 8.5, finalScore: 8.8, note: 'Học lực Tốt' },
    'hs-602': { studentId: 'hs-602', regularScores: [9.0, 9.5, 9.0], midtermScore: 9.2, finalScore: 9.5, note: 'Học lực Xuất sắc' },
    'hs-603': { studentId: 'hs-603', regularScores: [7.0, 7.5, 7.0], midtermScore: 7.2, finalScore: 7.5, note: 'Học lực Khá' },
    'hs-604': { studentId: 'hs-604', regularScores: [8.0, 8.5, 8.0], midtermScore: 8.0, finalScore: 8.2, note: 'Học lực Khá - Tốt' },
    'hs-605': { studentId: 'hs-605', regularScores: [6.0, 6.5, 5.5], midtermScore: 6.0, finalScore: 6.2, note: 'Học lực Đạt, cần kèm thêm' },
    'hs-606': { studentId: 'hs-606', regularScores: [7.5, 7.0, 7.5], midtermScore: 7.8, finalScore: 7.5, note: 'Học lực Khá' },

    // 7A
    'hs-701': { studentId: 'hs-701', regularScores: [8.5, 9.0, 9.0], midtermScore: 8.8, finalScore: 9.0, note: 'Học lực Tốt' },
    'hs-702': { studentId: 'hs-702', regularScores: [9.0, 9.0, 9.5], midtermScore: 9.0, finalScore: 9.2, note: 'Học lực Xuất sắc' },
    'hs-703': { studentId: 'hs-703', regularScores: [6.5, 6.0, 6.0], midtermScore: 6.2, finalScore: 6.0, note: 'Học lực Đạt' },
    'hs-704': { studentId: 'hs-704', regularScores: [7.5, 8.0, 7.5], midtermScore: 7.6, finalScore: 7.8, note: 'Học lực Khá' },
    'hs-705': { studentId: 'hs-705', regularScores: [8.0, 7.5, 8.0], midtermScore: 8.0, finalScore: 8.2, note: 'Học lực Khá' },

    // 8A
    'hs-801': { studentId: 'hs-801', regularScores: [9.0, 8.5, 9.0], midtermScore: 9.0, finalScore: 9.2, note: 'Học lực Tốt' },
    'hs-802': { studentId: 'hs-802', regularScores: [8.5, 9.0, 8.5], midtermScore: 8.8, finalScore: 8.7, note: 'Học lực Tốt' },
    'hs-803': { studentId: 'hs-803', regularScores: [6.0, 5.5, 6.0], midtermScore: 5.8, finalScore: 6.0, note: 'Học lực Đạt, điểm có xu hướng giảm' },
    'hs-804': { studentId: 'hs-804', regularScores: [7.5, 8.0, 7.5], midtermScore: 7.7, finalScore: 7.8, note: 'Học lực Khá' },
    'hs-805': { studentId: 'hs-805', regularScores: [8.0, 8.0, 8.5], midtermScore: 8.2, finalScore: 8.4, note: 'Học lực Khá' },

    // 9A
    'hs-901': { studentId: 'hs-901', regularScores: [9.5, 9.5, 9.0], midtermScore: 9.6, finalScore: 9.8, note: 'Học sinh giỏi đội tuyển' },
    'hs-902': { studentId: 'hs-902', regularScores: [9.0, 9.0, 8.5], midtermScore: 8.9, finalScore: 9.1, note: 'Học lực Tốt' },
    'hs-903': { studentId: 'hs-903', regularScores: [8.5, 8.0, 8.5], midtermScore: 8.4, finalScore: 8.6, note: 'Học lực Tốt' },
    'hs-904': { studentId: 'hs-904', regularScores: [6.5, 7.0, 6.5], midtermScore: 6.8, finalScore: 6.5, note: 'Học lực Đạt' },
    'hs-905': { studentId: 'hs-905', regularScores: [8.5, 8.5, 9.0], midtermScore: 8.6, finalScore: 8.8, note: 'Học lực Tốt' }
  },

  gradeFormula: {
    regularWeight: 1,
    midtermWeight: 2,
    finalWeight: 3,
    description: 'Công thức cấu hình mẫu: (Điểm TB Thường xuyên × 1 + Điểm Giữa kỳ × 2 + Điểm Cuối kỳ × 3) / 6. Thầy Tín có thể tùy chỉnh trọng số hệ số theo quy định riêng của nhà trường.'
  },

  comments: [
    {
      id: 'cm-1',
      studentId: 'hs-601',
      studentName: 'Nguyễn Hoàng An',
      className: '6A',
      content: 'Tích cực tham gia hoạt động học tập, có tiến bộ rõ rệt trong việc cảm thụ các văn bản văn học dân gian.',
      date: '2026-09-17',
      tags: ['Tích cực', 'Tiến bộ']
    },
    {
      id: 'cm-2',
      studentId: 'hs-605',
      studentName: 'Vũ Quốc Huy',
      className: '6A',
      content: 'Cần chú ý hoàn thành bài tập đúng hạn và rèn thêm kỹ năng đọc hiểu văn bản.',
      date: '2026-09-16',
      tags: ['Cần cố gắng', 'Bài tập']
    },
    {
      id: 'cm-3',
      studentId: 'hs-703',
      studentName: 'Hoàng Văn Nam',
      className: '7A',
      content: 'Cần chú ý giờ giấc sinh hoạt và đi học đúng giờ, tập trung hơn trong giờ nghe giảng.',
      date: '2026-09-18',
      tags: ['Kỷ luật', 'Chuyên cần']
    },
    {
      id: 'cm-4',
      studentId: 'hs-803',
      studentName: 'Lý Quốc Thịnh',
      className: '8A',
      content: 'Cần luyện thêm kỹ năng viết và xây dựng dàn ý trước khi làm bài thi để cải thiện điểm số.',
      date: '2026-09-15',
      tags: ['Kỹ năng viết', 'Cần phụ đạo']
    },
    {
      id: 'cm-5',
      studentId: 'hs-901',
      studentName: 'Trần Bảo Anh',
      className: '9A',
      content: 'Khả năng tư duy văn học độc lập, hành văn sắc sảo và giàu nhạc điệu.',
      date: '2026-09-14',
      tags: ['Khen ngợi', 'Xuất sắc']
    }
  ],

  activityLogs: [
    {
      id: 'act-1',
      action: 'Đã cập nhật điểm đánh giá định kỳ lớp 8A',
      timestamp: 'Hôm nay lúc 08:30',
      type: 'grade'
    },
    {
      id: 'act-2',
      action: 'Đã giao bài tập mới: "Phân tích diễn biến tâm lý chị Dậu" cho lớp 8A',
      timestamp: 'Hôm qua lúc 15:45',
      type: 'assignment'
    },
    {
      id: 'act-3',
      action: 'Đã điểm danh chuyên cần buổi sáng lớp 7B và 6A',
      timestamp: 'Hôm qua lúc 07:15',
      type: 'attendance'
    },
    {
      id: 'act-4',
      action: 'Đã thêm bài học mới môn Ngữ văn 9: "Nghị luận về một tác phẩm thơ"',
      timestamp: '16/09/2026',
      type: 'lesson' as any
    },
    {
      id: 'act-5',
      action: 'Đã lưu nhận xét định kỳ cho 5 học sinh lớp 6A',
      timestamp: '15/09/2026',
      type: 'comment'
    }
  ],

  notifications: [
    {
      id: 'notif-1',
      title: 'Nhắc nhở bài tập',
      message: 'Có 3 học sinh lớp 7A và 8A chưa nộp bài tập sắp đến hạn.',
      time: '15 phút trước',
      isRead: false,
      type: 'warning'
    },
    {
      id: 'notif-2',
      title: 'Chuyên cần',
      message: 'Học sinh Hoàng Văn Nam (7A) vắng học hôm nay chưa có đơn xin phép.',
      time: '2 giờ trước',
      isRead: false,
      type: 'warning'
    },
    {
      id: 'notif-3',
      title: 'Cập nhật điểm số',
      message: 'Bảng điểm giữa kỳ của lớp 9A đã được đồng bộ vào hệ thống.',
      time: 'Hôm qua',
      isRead: true,
      type: 'success'
    },
    {
      id: 'notif-4',
      title: 'Lịch giảng dạy',
      message: 'Tiết dạy chuyên đề Văn học lớp 8A dự kiến vào thứ Ba tuần tới.',
      time: '2 ngày trước',
      isRead: true,
      type: 'info'
    }
  ],

  teacherProfile: {
    name: 'Kiều Cao Long',
    subject: 'Toán',
    school: 'Trường THCS Thạch Thất 2',
    email: 'longfto80@gmail.com',
    phone: '0912 345 678'
  },

  soundEnabled: true
};

export const initialDemoData = INITIAL_DEMO_DATA;
