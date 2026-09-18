import { AppData } from '../types';

export function downloadStandaloneHtmlFile(data: AppData): void {
  const dataJsonString = JSON.stringify(data).replace(/</g, '\\u003c');

  const htmlContent = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>VĂN HỌC HUB – QUẢN TRỊ HỌC TẬP (Bản Độc Lập Offline)</title>
  <style>
    :root {
      --primary: #0f2b48;
      --primary-light: #1e3a5f;
      --accent: #d97706;
      --bg: #f8fafc;
      --card-bg: #ffffff;
      --text: #1e293b;
      --text-muted: #64748b;
      --border: #e2e8f0;
      --success: #10b981;
      --warning: #f59e0b;
      --danger: #ef4444;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      background-color: var(--bg);
      color: var(--text);
      display: flex;
      min-height: 100vh;
    }
    aside {
      width: 260px;
      background: var(--primary);
      color: #fff;
      display: flex;
      flex-direction: column;
      flex-shrink: 0;
    }
    .brand {
      padding: 24px 20px;
      border-bottom: 1px solid rgba(255,255,255,0.1);
    }
    .brand h1 { font-size: 1.15rem; font-weight: 700; letter-spacing: 0.5px; color: #f8fafc; }
    .brand .author { font-size: 0.85rem; color: #cbd5e1; margin-top: 4px; }
    .brand .school { font-size: 0.75rem; color: #94a3b8; margin-top: 2px; }
    .menu { list-style: none; padding: 16px 8px; flex: 1; }
    .menu li {
      padding: 10px 16px;
      margin-bottom: 4px;
      border-radius: 8px;
      cursor: pointer;
      font-size: 0.9rem;
      display: flex;
      align-items: center;
      gap: 12px;
      color: #cbd5e1;
      transition: all 0.2s;
    }
    .menu li:hover { background: rgba(255,255,255,0.08); color: #fff; }
    .menu li.active { background: var(--accent); color: #fff; font-weight: 600; }
    main { flex: 1; display: flex; flex-direction: column; min-width: 0; overflow-y: auto; }
    header {
      background: #fff;
      border-bottom: 1px solid var(--border);
      padding: 16px 28px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: sticky;
      top: 0;
      z-index: 10;
    }
    .header-title { font-size: 1.25rem; font-weight: 700; color: var(--primary); }
    .header-info { display: flex; align-items: center; gap: 16px; font-size: 0.875rem; }
    .avatar-circle {
      width: 38px; height: 38px; border-radius: 50%;
      background: var(--primary-light); color: #fff;
      display: flex; align-items: center; justify-content: center;
      font-weight: 700; font-size: 0.875rem;
    }
    .content-area { padding: 28px; max-width: 1300px; margin: 0 auto; width: 100%; }
    .stats-grid {
      display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 16px; margin-bottom: 24px;
    }
    .stat-card {
      background: var(--card-bg); border: 1px solid var(--border);
      border-radius: 12px; padding: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    }
    .stat-card .label { font-size: 0.8rem; color: var(--text-muted); text-transform: uppercase; font-weight: 600; }
    .stat-card .val { font-size: 1.75rem; font-weight: 700; color: var(--primary); margin-top: 6px; }
    .card {
      background: var(--card-bg); border: 1px solid var(--border);
      border-radius: 12px; padding: 24px; margin-bottom: 24px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    }
    .card h2 { font-size: 1.1rem; color: var(--primary); margin-bottom: 16px; font-weight: 700; }
    table { width: 100%; border-collapse: collapse; font-size: 0.9rem; }
    th, td { padding: 12px 14px; text-align: left; border-bottom: 1px solid var(--border); }
    th { background: #f1f5f9; color: var(--text-muted); font-weight: 600; font-size: 0.8rem; }
    tr:hover td { background: #f8fafc; }
    .badge {
      display: inline-block; padding: 4px 10px; border-radius: 9999px;
      font-size: 0.75rem; font-weight: 600;
    }
    .badge-success { background: #dcfce7; color: #166534; }
    .badge-warning { background: #fef3c7; color: #92400e; }
    .badge-danger { background: #fee2e2; color: #991b1b; }
    .badge-info { background: #e0f2fe; color: #075985; }
    .btn {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 8px 16px; border-radius: 8px; font-size: 0.875rem;
      font-weight: 600; border: none; cursor: pointer; transition: all 0.2s;
    }
    .btn-primary { background: var(--primary); color: #fff; }
    .btn-primary:hover { background: var(--primary-light); }
    .btn-accent { background: var(--accent); color: #fff; }
    .demo-banner {
      background: #fffbeb; border: 1px solid #fde68a; color: #92400e;
      padding: 10px 16px; border-radius: 8px; font-size: 0.85rem;
      margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center;
    }
    @media (max-width: 768px) {
      body { flex-direction: column; }
      aside { width: 100%; }
    }
  </style>
</head>
<body>
  <aside>
    <div class="brand">
      <h1>${data.teacherProfile?.subject ? data.teacherProfile.subject.toUpperCase() + ' THCS' : 'TOÁN THCS'}</h1>
      <div class="author">Thầy ${data.teacherProfile?.name || 'Kiều Cao Long'}</div>
      <div class="school">Giáo viên ${data.teacherProfile?.subject || 'Toán'} - ${data.teacherProfile?.school || 'THCS Thạch Thất 2'}</div>
    </div>
    <ul class="menu" id="sideMenu">
      <li class="active" onclick="switchTab('dashboard')">📊 Tổng quan</li>
      <li onclick="switchTab('classes')">🏫 Lớp học</li>
      <li onclick="switchTab('students')">🎓 Học sinh</li>
      <li onclick="switchTab('attendance')">📋 Chuyên cần</li>
      <li onclick="switchTab('lessons')">📖 Bài học</li>
      <li onclick="switchTab('assignments')">✍️ Bài tập</li>
      <li onclick="switchTab('grades')">🎯 Điểm số</li>
      <li onclick="switchTab('comments')">💬 Nhận xét</li>
      <li onclick="switchTab('progress')">📈 Tiến độ học tập</li>
      <li onclick="switchTab('settings')">⚙️ Cài đặt & Sao lưu</li>
    </ul>
  </aside>

  <main>
    <header>
      <div class="header-title" id="pageTitle">Tổng quan học tập</div>
      <div class="header-info">
        <span id="currentDateDisplay"></span>
        <div class="avatar-circle">KL</div>
        <span>${data.teacherProfile?.name || 'Kiều Cao Long'}</span>
      </div>
    </header>

    <div class="content-area">
      <div class="demo-banner">
        <span>📌 <strong>BẢN ĐỘC LẬP TỔNG THỂ (OFFLINE)</strong> — Dữ liệu lưu an toàn trên trình duyệt hiện tại.</span>
        <span>Môn: ${data.teacherProfile?.subject || 'Toán'} THCS</span>
      </div>

      <!-- TAB: DASHBOARD -->
      <div id="tab-dashboard" class="tab-content">
        <div style="margin-bottom: 24px;">
          <h2 style="font-size: 1.5rem; color: var(--primary); font-weight: 700;">Xin chào, thầy ${data.teacherProfile?.name || 'Kiều Cao Long'}!</h2>
          <p style="color: var(--text-muted); margin-top: 4px;">Chúc thầy một ngày dạy học hiệu quả và tràn đầy đam mê Toán học.</p>
        </div>

        <div class="stats-grid">
          <div class="stat-card">
            <div class="label">Lớp phụ trách</div>
            <div class="val" id="statClasses">4 lớp</div>
          </div>
          <div class="stat-card">
            <div class="label">Tổng học sinh</div>
            <div class="val" id="statStudents">21 HS</div>
          </div>
          <div class="stat-card">
            <div class="label">Bài tập đang giao</div>
            <div class="val" id="statAssignments">4 bài</div>
          </div>
          <div class="stat-card">
            <div class="label">Chưa nộp bài</div>
            <div class="val" style="color: var(--danger);" id="statUnfinished">3 em</div>
          </div>
          <div class="stat-card">
            <div class="label">Tỷ lệ chuyên cần</div>
            <div class="val" style="color: var(--success);" id="statAttendance">95.2%</div>
          </div>
          <div class="stat-card">
            <div class="label">Điểm trung bình</div>
            <div class="val" style="color: var(--accent);" id="statAvgGrade">8.1</div>
          </div>
        </div>

        <div class="card">
          <h2>Bài tập gần đây</h2>
          <table id="recentAssignmentsTable">
            <thead>
              <tr>
                <th>Tên bài tập</th>
                <th>Lớp</th>
                <th>Hạn nộp</th>
                <th>Đã nộp</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody></tbody>
          </table>
        </div>

        <div class="card">
          <h2>Học sinh cần lưu ý & hỗ trợ</h2>
          <table id="attentionStudentsTable">
            <thead>
              <tr>
                <th>Mã HS</th>
                <th>Họ và tên</th>
                <th>Lớp</th>
                <th>Lý do cần chú ý</th>
                <th>Tình trạng</th>
              </tr>
            </thead>
            <tbody></tbody>
          </table>
        </div>
      </div>

      <!-- TAB: CLASSES -->
      <div id="tab-classes" class="tab-content" style="display: none;">
        <div class="card">
          <h2>Danh sách lớp học</h2>
          <table id="classesTable">
            <thead>
              <tr>
                <th>Tên lớp</th>
                <th>Khối</th>
                <th>Phòng học</th>
                <th>Sĩ số</th>
                <th>Giáo viên</th>
                <th>Ghi chú</th>
              </tr>
            </thead>
            <tbody></tbody>
          </table>
        </div>
      </div>

      <!-- TAB: STUDENTS -->
      <div id="tab-students" class="tab-content" style="display: none;">
        <div class="card">
          <h2>Danh sách học sinh THCS</h2>
          <table id="studentsTable">
            <thead>
              <tr>
                <th>Mã HS</th>
                <th>Họ và tên</th>
                <th>Lớp</th>
                <th>Giới tính</th>
                <th>SĐT Phụ huynh</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody></tbody>
          </table>
        </div>
      </div>

      <!-- TAB: ATTENDANCE -->
      <div id="tab-attendance" class="tab-content" style="display: none;">
        <div class="card">
          <h2>Theo dõi chuyên cần ngày hôm nay</h2>
          <table id="attendanceTable">
            <thead>
              <tr>
                <th>Mã HS</th>
                <th>Họ và tên</th>
                <th>Lớp</th>
                <th>Trạng thái chuyên cần</th>
                <th>Ghi chú</th>
              </tr>
            </thead>
            <tbody></tbody>
          </table>
        </div>
      </div>

      <!-- TAB: LESSONS -->
      <div id="tab-lessons" class="tab-content" style="display: none;">
        <div class="card">
          <h2>Quản lý giáo án & Bài học Ngữ văn</h2>
          <table id="lessonsTable">
            <thead>
              <tr>
                <th>Tên bài học</th>
                <th>Khối</th>
                <th>Phân loại</th>
                <th>Chủ đề</th>
                <th>Ngày dạy</th>
              </tr>
            </thead>
            <tbody></tbody>
          </table>
        </div>
      </div>

      <!-- TAB: ASSIGNMENTS -->
      <div id="tab-assignments" class="tab-content" style="display: none;">
        <div class="card">
          <h2>Bài tập & Đề bài tự luận Ngữ văn</h2>
          <table id="allAssignmentsTable">
            <thead>
              <tr>
                <th>Tiêu đề bài tập</th>
                <th>Lớp</th>
                <th>Ngày giao</th>
                <th>Hạn nộp</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody></tbody>
          </table>
        </div>
      </div>

      <!-- TAB: GRADES -->
      <div id="tab-grades" class="tab-content" style="display: none;">
        <div class="card">
          <h2>Bảng tổng hợp điểm số môn Ngữ văn</h2>
          <table id="gradesTable">
            <thead>
              <tr>
                <th>Mã HS</th>
                <th>Họ và tên</th>
                <th>Lớp</th>
                <th>Điểm TX</th>
                <th>Giữa kỳ</th>
                <th>Cuối kỳ</th>
                <th>Điểm TB</th>
                <th>Đánh giá</th>
              </tr>
            </thead>
            <tbody></tbody>
          </table>
        </div>
      </div>

      <!-- TAB: COMMENTS -->
      <div id="tab-comments" class="tab-content" style="display: none;">
        <div class="card">
          <h2>Sổ nhận xét học sinh của thầy ${data.teacherProfile?.name || 'Kiều Cao Long'}</h2>
          <div id="commentsContainer"></div>
        </div>
      </div>

      <!-- TAB: PROGRESS -->
      <div id="tab-progress" class="tab-content" style="display: none;">
        <div class="card">
          <h2>Tiến độ & Kết quả học tập toàn diện</h2>
          <div id="progressOverview"></div>
        </div>
      </div>

      <!-- TAB: SETTINGS -->
      <div id="tab-settings" class="tab-content" style="display: none;">
        <div class="card">
          <h2>Cài đặt & Quản trị dữ liệu</h2>
          <p style="color: var(--text-muted); margin-bottom: 16px;">
            Toàn bộ dữ liệu của thầy ${data.teacherProfile?.name || 'Kiều Cao Long'} được lưu an toàn trong trình duyệt cục bộ. Thầy có thể tải bản sao lưu bất cứ lúc nào.
          </p>
          <button class="btn btn-primary" onclick="exportJSON()">📥 Xuất bản sao lưu JSON</button>
          <button class="btn btn-accent" style="margin-left: 8px;" onclick="resetDemo()">🔄 Khôi phục dữ liệu mẫu ban đầu</button>
        </div>
      </div>

    </div>
  </main>

  <script>
    const APP_DATA = ${dataJsonString};

    function init() {
      document.getElementById('currentDateDisplay').textContent = new Date().toLocaleDateString('vi-VN', {
        weekday: 'long', year: 'numeric', month: 'numeric', day: 'numeric'
      });
      renderDashboard();
      renderClasses();
      renderStudents();
      renderAttendance();
      renderLessons();
      renderAssignments();
      renderGrades();
      renderComments();
      renderProgress();
    }

    function switchTab(tabId) {
      document.querySelectorAll('.tab-content').forEach(el => el.style.display = 'none');
      const target = document.getElementById('tab-' + tabId);
      if (target) target.style.display = 'block';

      const titles = {
        dashboard: 'Tổng quan học tập',
        classes: 'Quản lý lớp học',
        students: 'Quản lý học sinh',
        attendance: 'Theo dõi chuyên cần',
        lessons: 'Quản lý bài học Ngữ văn',
        assignments: 'Giao & Theo dõi bài tập',
        grades: 'Quản lý bảng điểm',
        comments: 'Nhận xét học sinh',
        progress: 'Tiến độ học tập',
        settings: 'Cài đặt hệ thống'
      };
      document.getElementById('pageTitle').textContent = titles[tabId] || 'Văn Học Hub';

      document.querySelectorAll('#sideMenu li').forEach((el, idx) => {
        el.classList.remove('active');
        const keys = Object.keys(titles);
        if (keys[idx] === tabId) el.classList.add('active');
      });
    }

    function renderDashboard() {
      document.getElementById('statClasses').textContent = APP_DATA.classes.length + ' lớp';
      document.getElementById('statStudents').textContent = APP_DATA.students.length + ' HS';
      document.getElementById('statAssignments').textContent = APP_DATA.assignments.length + ' bài';

      let unfinished = 0;
      APP_DATA.assignments.forEach(a => {
        const subs = a.submissions || {};
        APP_DATA.students.filter(s => s.classId === a.classId).forEach(s => {
          if (!subs[s.id] || !subs[s.id].submitted) unfinished++;
        });
      });
      document.getElementById('statUnfinished').textContent = unfinished + ' em';

      const tbody = document.querySelector('#recentAssignmentsTable tbody');
      tbody.innerHTML = APP_DATA.assignments.map(a => \`
        <tr>
          <td><strong>\${a.title}</strong></td>
          <td><span class="badge badge-info">\${a.className}</span></td>
          <td>\${a.dueDate}</td>
          <td>\${Object.values(a.submissions || {}).filter(sub => sub.submitted).length} / \${APP_DATA.students.filter(s => s.classId === a.classId).length}</td>
          <td><span class="badge \${a.status === 'Đã hoàn thành' ? 'badge-success' : a.status === 'Sắp hết hạn' ? 'badge-warning' : 'badge-info'}">\${a.status}</span></td>
        </tr>
      \`).join('');

      const attTbody = document.querySelector('#attentionStudentsTable tbody');
      const needAttn = APP_DATA.students.filter(s => s.status === 'Cần cố gắng');
      attTbody.innerHTML = needAttn.map(s => \`
        <tr>
          <td>\${s.studentCode}</td>
          <td><strong>\${s.fullName}</strong></td>
          <td>\${s.className}</td>
          <td>\${s.notes || 'Cần theo dõi bài vở và chuyên cần'}</td>
          <td><span class="badge badge-danger">Cần hỗ trợ</span></td>
        </tr>
      \`).join('');
    }

    function renderClasses() {
      const tbody = document.querySelector('#classesTable tbody');
      tbody.innerHTML = APP_DATA.classes.map(c => \`
        <tr>
          <td><strong>\${c.name}</strong></td>
          <td>Khối \${c.gradeLevel}</td>
          <td>\${c.room}</td>
          <td>\${APP_DATA.students.filter(s => s.classId === c.id).length} học sinh</td>
          <td>\${c.teacher}</td>
          <td>\${c.note || ''}</td>
        </tr>
      \`).join('');
    }

    function renderStudents() {
      const tbody = document.querySelector('#studentsTable tbody');
      tbody.innerHTML = APP_DATA.students.map(s => \`
        <tr>
          <td>\${s.studentCode}</td>
          <td><strong>\${s.fullName}</strong></td>
          <td>\${s.className}</td>
          <td>\${s.gender}</td>
          <td>\${s.parentPhone}</td>
          <td><span class="badge \${s.status === 'Tích cực' ? 'badge-success' : s.status === 'Đang tiến bộ' ? 'badge-info' : 'badge-warning'}">\${s.status}</span></td>
        </tr>
      \`).join('');
    }

    function renderAttendance() {
      const tbody = document.querySelector('#attendanceTable tbody');
      tbody.innerHTML = APP_DATA.students.map(s => {
        const att = (APP_DATA.attendance || []).find(a => a.studentId === s.id);
        const st = att ? att.status : 'present';
        const map = { present: 'Có mặt', absent: 'Vắng', late: 'Đi muộn', excused: 'Có phép' };
        const clsMap = { present: 'badge-success', absent: 'badge-danger', late: 'badge-warning', excused: 'badge-info' };
        return \`
          <tr>
            <td>\${s.studentCode}</td>
            <td><strong>\${s.fullName}</strong></td>
            <td>\${s.className}</td>
            <td><span class="badge \${clsMap[st] || 'badge-success'}">\${map[st] || 'Có mặt'}</span></td>
            <td>\${att?.note || ''}</td>
          </tr>
        \`;
      }).join('');
    }

    function renderLessons() {
      const tbody = document.querySelector('#lessonsTable tbody');
      tbody.innerHTML = APP_DATA.lessons.map(l => \`
        <tr>
          <td><strong>\${l.title}</strong></td>
          <td>Khối \${l.gradeLevel}</td>
          <td><span class="badge badge-info">\${l.category}</span></td>
          <td>\${l.topic}</td>
          <td>\${l.date}</td>
        </tr>
      \`).join('');
    }

    function renderAssignments() {
      const tbody = document.querySelector('#allAssignmentsTable tbody');
      tbody.innerHTML = APP_DATA.assignments.map(a => \`
        <tr>
          <td><strong>\${a.title}</strong></td>
          <td>\${a.className}</td>
          <td>\${a.assignedDate}</td>
          <td>\${a.dueDate}</td>
          <td><span class="badge \${a.status === 'Đã hoàn thành' ? 'badge-success' : 'badge-warning'}">\${a.status}</span></td>
        </tr>
      \`).join('');
    }

    function renderGrades() {
      const tbody = document.querySelector('#gradesTable tbody');
      tbody.innerHTML = APP_DATA.students.map(s => {
        const g = APP_DATA.grades[s.id];
        const regAvg = g && g.regularScores?.length ? (g.regularScores.reduce((a,b)=>a+b,0)/g.regularScores.length).toFixed(1) : '-';
        const gk = g?.midtermScore !== null && g?.midtermScore !== undefined ? g.midtermScore : '-';
        const ck = g?.finalScore !== null && g?.finalScore !== undefined ? g.finalScore : '-';
        let dtb = '-';
        if (g && regAvg !== '-' && gk !== '-' && ck !== '-') {
          dtb = ((parseFloat(regAvg)*1 + parseFloat(gk)*2 + parseFloat(ck)*3) / 6).toFixed(1);
        }
        return \`
          <tr>
            <td>\${s.studentCode}</td>
            <td><strong>\${s.fullName}</strong></td>
            <td>\${s.className}</td>
            <td>\${regAvg}</td>
            <td>\${gk}</td>
            <td>\${ck}</td>
            <td><strong>\${dtb}</strong></td>
            <td>\${g?.note || ''}</td>
          </tr>
        \`;
      }).join('');
    }

    function renderComments() {
      const box = document.getElementById('commentsContainer');
      box.innerHTML = APP_DATA.comments.map(c => \`
        <div style="border-left: 3px solid var(--accent); padding: 12px 16px; margin-bottom: 12px; background: #f8fafc; border-radius: 0 8px 8px 0;">
          <div style="display: flex; justify-content: space-between; font-weight: 600; font-size: 0.9rem;">
            <span>\${c.studentName} (\${c.className})</span>
            <span style="color: var(--text-muted); font-size: 0.8rem;">\${c.date}</span>
          </div>
          <p style="margin-top: 6px; font-size: 0.875rem; color: #334155;">\${c.content}</p>
        </div>
      \`).join('');
    }

    function renderProgress() {
      const p = document.getElementById('progressOverview');
      p.innerHTML = \`
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
          <div style="background: #f1f5f9; padding: 16px; border-radius: 8px;">
            <h3 style="font-size: 1rem; margin-bottom: 8px; color: var(--primary);">Tiến độ hoàn thành chương trình</h3>
            <p style="font-size: 0.9rem; color: var(--text-muted);">Đã hoàn thành 8 chuyên đề trọng tâm Ngữ văn học kỳ I.</p>
            <div style="width: 100%; height: 10px; background: #e2e8f0; border-radius: 5px; margin-top: 10px; overflow: hidden;">
              <div style="width: 75%; height: 100%; background: var(--success);"></div>
            </div>
          </div>
          <div style="background: #f1f5f9; padding: 16px; border-radius: 8px;">
            <h3 style="font-size: 1rem; margin-bottom: 8px; color: var(--primary);">Chất lượng bộ môn</h3>
            <p style="font-size: 0.9rem; color: var(--text-muted);">Tỷ lệ học sinh đạt điểm Khá - Tốt chiếm 85.7%.</p>
            <div style="width: 100%; height: 10px; background: #e2e8f0; border-radius: 5px; margin-top: 10px; overflow: hidden;">
              <div style="width: 85.7%; height: 100%; background: var(--accent);"></div>
            </div>
          </div>
        </div>
      \`;
    }

    function exportJSON() {
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(APP_DATA, null, 2));
      const a = document.createElement('a');
      a.href = dataStr;
      a.download = 'van_hoc_hub_backup.json';
      a.click();
    }

    function resetDemo() {
      if (confirm('Thầy có chắc chắn muốn khôi phục về dữ liệu DEMO ban đầu?')) {
        localStorage.clear();
        location.reload();
      }
    }

    window.onload = init;
  </script>
</body>
</html>`;

  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'VAN_HOC_HUB_THAY_TIN_OFFLINE.html';
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
