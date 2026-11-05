// ============================================
// NEXUS — Helper Utilities
// ============================================

/**
 * Format text with hashtag and mention highlighting
 */
function formatPostText(text) {
  return text
    .replace(/#(\w+)/g, '<span class="hashtag">#$1</span>')
    .replace(/@(\w+)/g, '<span class="mention">@$1</span>');
}

/**
 * Get user by ID
 */
function getUserById(id) {
  return MOCK_USERS.find(u => u.id === id) || null;
}

/**
 * Format number (1200 → 1.2K)
 */
function formatCount(num) {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return String(num);
}

/**
 * Show toast notification
 */
function showToast(message, type = 'info', duration = 3000) {
  const icons = { info: '💬', success: '✅', error: '❌', warning: '⚠️' };
  const container = document.getElementById('toastContainer');

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span class="toast-icon">${icons[type] || icons.info}</span>
    <span class="toast-msg">${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('removing');
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

/**
 * Get emotional tone badge HTML
 */
function getEmotionalToneBadge(tone) {
  const tones = {
    positive: { emoji: '😊', label: 'เนื้อหาเชิงบวก', class: 'positive' },
    neutral: { emoji: '😐', label: 'เนื้อหาเป็นกลาง', class: 'neutral' },
    negative: { emoji: '😟', label: 'เนื้อหาเชิงลบ', class: 'negative' },
    mixed: { emoji: '🤔', label: 'เนื้อหาผสม', class: 'mixed' }
  };
  const t = tones[tone] || tones.neutral;
  return `<span class="emotional-tone ${t.class}">${t.emoji} ${t.label}</span>`;
}

/**
 * Get algorithm reason label
 */
function getAlgoReason(reason) {
  const reasons = {
    friend: 'เพราะเพื่อนของคุณ interact',
    interest: 'ตรงกับความสนใจของคุณ',
    trending: 'กำลังเป็นที่นิยม',
    local: 'จากพื้นที่ใกล้คุณ',
    diverse: 'เพื่อความหลากหลายของ feed'
  };
  return reasons[reason] || '';
}

/**
 * Screen time tracker
 */
const ScreenTimeTracker = {
  startTime: Date.now(),
  minutes: 0,
  goal: 60,

  update() {
    this.minutes = Math.floor((Date.now() - this.startTime) / 60000);
    const pct = Math.min((this.minutes / this.goal) * 100, 100);
    
    const numEl = document.getElementById('screenTimeNum');
    const barEl = document.getElementById('timeBarFill');
    
    if (numEl) numEl.textContent = this.minutes;
    if (barEl) barEl.style.width = pct + '%';

    // Warning at 45 min
    if (this.minutes === 45) {
      showToast('⏰ คุณใช้งาน Nexus มา 45 นาทีแล้ว พักสักครู่ไหม?', 'warning', 5000);
    }
  }
};

// Update every minute
setInterval(() => ScreenTimeTracker.update(), 60000);
// Also update every 10 seconds for demo (faster increment)
setInterval(() => {
  ScreenTimeTracker.minutes = Math.min(ScreenTimeTracker.minutes + 1, 90);
  const pct = Math.min((ScreenTimeTracker.minutes / ScreenTimeTracker.goal) * 100, 100);
  const numEl = document.getElementById('screenTimeNum');
  const barEl = document.getElementById('timeBarFill');
  if (numEl) numEl.textContent = ScreenTimeTracker.minutes;
  if (barEl) barEl.style.width = pct + '%';
}, 10000);

/**
 * Simple debounce
 */
function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

/**
 * Show page by ID
 */
function showPage(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

  const page = document.getElementById(`page-${pageId}`);
  if (page) page.classList.add('active');

  const navItem = document.querySelector(`[data-page="${pageId}"]`);
  if (navItem) navItem.classList.add('active');

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Close panel
 */
function closePanel(type) {
  const overlay = document.getElementById(`${type}Overlay`);
  if (overlay) overlay.style.display = 'none';
}

/**
 * Export data (simulated)
 */
function exportData(format) {
  const formats = { json: 'data.json', csv: 'data.csv', pdf: 'report.pdf' };
  showToast(`📥 กำลัง export ${format.toUpperCase()} ข้อมูลของคุณ...`, 'info');
  setTimeout(() => {
    showToast(`✅ Export ${format.toUpperCase()} สำเร็จ! ไฟล์พร้อมดาวน์โหลด`, 'success');
  }, 1500);
}

/**
 * Trigger media input
 */
function triggerMedia(type) {
  const messages = {
    photo: '📸 เลือกรูปภาพ (ในเวอร์ชันนี้เป็น demo)',
    video: '🎥 อัพโหลดวิดีโอ (ในเวอร์ชันนี้เป็น demo)',
    poll: null,
    location: '📍 เปิดแชร์ Location (ในเวอร์ชันนี้เป็น demo)'
  };

  if (type === 'poll') {
    const pb = document.getElementById('pollBuilder');
    if (pb) pb.style.display = pb.style.display === 'none' ? 'block' : 'none';
  } else if (messages[type]) {
    showToast(messages[type], 'info');
  }
}

/**
 * Add poll option
 */
function addPollOption() {
  const container = document.getElementById('pollOptions');
  const count = container.querySelectorAll('.poll-option').length + 1;
  if (count >= 6) {
    showToast('สามารถเพิ่มได้สูงสุด 5 ตัวเลือก', 'warning');
    return;
  }
  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = `ตัวเลือก ${count}`;
  input.className = 'poll-option';
  container.appendChild(input);
}

/**
 * Close onboarding
 */
function closeOnboarding() {
  const overlay = document.getElementById('onboardingOverlay');
  if (overlay) {
    overlay.style.opacity = '0';
    overlay.style.transition = 'opacity 0.3s';
    setTimeout(() => overlay.classList.add('hidden'), 300);
  }
  localStorage.setItem('nexus_onboarded', '1');
}

/**
 * Toggle doomscroll mode
 */
let doomscrollActive = false;
function toggleDoomscroll() {
  doomscrollActive = !doomscrollActive;
  const btn = document.getElementById('doomToggle');
  if (btn) {
    if (doomscrollActive) {
      btn.innerHTML = '<i class="fas fa-shield-alt"></i> Anti-Doomscroll: เปิดอยู่';
      btn.classList.add('active');
      showToast('🛡️ Anti-Doomscroll Mode เปิดแล้ว! Feed จะแสดงเนื้อหาเชิงบวกมากขึ้น', 'success');
    } else {
      btn.innerHTML = '<i class="fas fa-shield-alt"></i> เปิด Anti-Doomscroll';
      btn.classList.remove('active');
      showToast('Anti-Doomscroll Mode ปิดแล้ว', 'info');
    }
  }
}

/**
 * Set algorithm mode
 */
function setAlgoMode(mode) {
  document.querySelectorAll('.algo-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.mode === mode);
  });
  const labels = {
    smart: 'Smart Algorithm',
    chrono: 'ล่าสุดก่อน',
    local: 'ใกล้ฉัน',
    diverse: 'หลากหลาย'
  };
  showToast(`🎛️ เปลี่ยน Feed เป็นโหมด "${labels[mode] || mode}" แล้ว`, 'success');
}

/**
 * Show create community modal (simulated)
 */
function showCreateCommunity() {
  showToast('🏘️ ฟีเจอร์สร้างชุมชนจะพร้อมในเวอร์ชันถัดไป!', 'info');
}

/**
 * Close diversity alert
 */
function closeDiversityAlert() {
  const alert = document.getElementById('diversityAlert');
  if (alert) alert.style.display = 'none';
}
