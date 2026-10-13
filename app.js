const stats = [
  { title: 'Hội viên', value: 1842, icon: '👥', tone: 'blue' },
  { title: 'Gói đang hiệu lực', value: 986, icon: '💳', tone: 'green' },
  { title: 'Lớp đang mở', value: 42, icon: '🏋️', tone: 'orange' },
  { title: 'Tỷ lệ hài lòng', value: '94%', icon: '⭐', tone: 'purple' }
];

const stories = [
  { id: 'US01', name: 'Quản lý Hội viên', module: 'Master Data', actor: 'Quản lý', status: 'Ready' },
  { id: 'US02', name: 'Quản lý Gói dịch vụ', module: 'Master Data', actor: 'Quản lý', status: 'Ready' },
  { id: 'US03', name: 'Đăng ký & Gia hạn Gói', module: 'Master Data', actor: 'Lễ tân', status: 'Ready' },
  { id: 'US04', name: 'Theo dõi Hiệu lực Gói', module: 'Master Data', actor: 'Quản lý', status: 'Ready' },
  { id: 'US05', name: 'Quản lý Lớp tập & Lịch học', module: 'Classes', actor: 'Quản lý', status: 'Ready' },
  { id: 'US06', name: 'Huấn luyện viên & Phân công', module: 'Classes', actor: 'Quản lý', status: 'Ready' },
  { id: 'US07', name: 'Đăng ký Lớp tập', module: 'Registration', actor: 'Lễ tân', status: 'Ready' },
  { id: 'US08', name: 'Kiểm tra Sức chứa', module: 'Registration', actor: 'Hệ thống', status: 'Ready' },
  { id: 'US09', name: 'Hủy / Cập nhật Đăng ký', module: 'Registration', actor: 'Lễ tân', status: 'Ready' },
  { id: 'US10', name: 'Xem Lịch sử Hội viên', module: 'Reports', actor: 'Quản lý', status: 'Ready' },
  { id: 'US11', name: 'Báo cáo theo Gói / Lớp', module: 'Reports', actor: 'Quản lý', status: 'Ready' },
  { id: 'US12', name: 'Báo cáo Lớp còn chỗ / Đã đầy', module: 'Reports', actor: 'Quản lý', status: 'Ready' },
  { id: 'US13', name: 'Tài khoản & Phân quyền', module: 'Security', actor: 'Quản lý', status: 'Ready' }
];

const packages = [
  { code: 'G01', name: 'Premium 12 tháng', price: '7.900.000đ', status: 'Hiệu lực', badge: 'success' },
  { code: 'G02', name: 'Gold 6 tháng', price: '4.200.000đ', status: 'Hiệu lực', badge: 'success' },
  { code: 'G03', name: 'Basic 1 tháng', price: '850.000đ', status: 'Sắp hết hạn', badge: 'warning' }
];

const classes = [
  { name: 'Yoga HLV Lan', coach: 'Lan Anh', time: 'T2 - 18:00', capacity: '18/20' },
  { name: 'HIIT Burn', coach: 'Minh', time: 'T4 - 19:30', capacity: '12/15' },
  { name: 'Boxing', coach: 'Hùng', time: 'T6 - 18:30', capacity: '20/20' }
];

const reportData = [
  { label: 'Yoga', value: 80 },
  { label: 'HIIT', value: 68 },
  { label: 'Boxing', value: 100 },
  { label: 'Cardio', value: 52 }
];

const statsGrid = document.getElementById('statsGrid');
const storyGrid = document.getElementById('storyGrid');
const packageTable = document.getElementById('packageTable');
const classTable = document.getElementById('classTable');
const reportBars = document.getElementById('reportBars');

statsGrid.innerHTML = stats.map((stat) => `
  <article class="stat-card">
    <div class="stat-top">
      <div>
        <p class="mini-label">${stat.title}</p>
      </div>
      <div class="stat-icon ${stat.tone}">${stat.icon}</div>
    </div>
    <h3>${stat.value}</h3>
    <p>So với tháng trước</p>
  </article>
`).join('');

storyGrid.innerHTML = stories.map((story) => `
  <article class="story-card">
    <span class="story-tag">${story.module}</span>
    <h4>${story.id} - ${story.name}</h4>
    <p>${story.actor} • ${story.module}</p>
    <div class="story-meta">
      <span>${story.actor}</span>
      <span class="story-status">${story.status}</span>
    </div>
  </article>
`).join('');

packageTable.innerHTML = packages.map((item) => `
  <tr>
    <td>${item.code}</td>
    <td>${item.name}</td>
    <td>${item.price}</td>
    <td><span class="badge ${item.badge}">${item.status}</span></td>
  </tr>
`).join('');

classTable.innerHTML = classes.map((item) => `
  <tr>
    <td>${item.name}</td>
    <td>${item.coach}</td>
    <td>${item.time}</td>
    <td><span class="badge ${item.capacity === '20/20' ? 'danger' : item.capacity.includes('18') ? 'warning' : 'success'}">${item.capacity}</span></td>
  </tr>
`).join('');

reportBars.innerHTML = reportData.map((item) => `
  <div class="report-row">
    <div class="label">
      <span>${item.label}</span>
      <span>${item.value}%</span>
    </div>
    <div class="bar-track">
      <div class="bar-fill" style="width: ${item.value}%"></div>
    </div>
  </div>
`).join('');
