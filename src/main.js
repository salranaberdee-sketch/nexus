// ============================================
// NEXUS — Main Application Controller
// ============================================

// ── Auth Form Handlers (global scope) ──────
async function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  const btn = e.target.querySelector('button[type=submit]');
  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> กำลังเข้าสู่ระบบ...';
  await nexusAuth.signIn(email, password);
  btn.disabled = false;
  btn.innerHTML = '<i class="fas fa-sign-in-alt"></i> เข้าสู่ระบบ';
}

async function handleRegister(e) {
  e.preventDefault();
  const name = document.getElementById('regName').value;
  const handle = document.getElementById('regHandle').value.replace('@','').toLowerCase();
  const email = document.getElementById('regEmail').value;
  const password = document.getElementById('regPassword').value;
  const btn = e.target.querySelector('button[type=submit]');
  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> กำลังสมัคร...';
  await nexusAuth.signUp(email, password, name, handle);
  btn.disabled = false;
  btn.innerHTML = '<i class="fas fa-user-plus"></i> สมัครสมาชิก';
}

// Style active auth tab
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('auth-tab')) {
    document.querySelectorAll('.auth-tab').forEach(t => {
      t.style.background = t.classList.contains('active') ? 'var(--bg-card)' : 'transparent';
      t.style.color = t.classList.contains('active') ? 'var(--primary)' : 'var(--text-secondary)';
      t.style.fontWeight = t.classList.contains('active') ? '600' : '400';
    });
  }
});

document.addEventListener('DOMContentLoaded', async () => {

  // ── Init Supabase Auth ──
  await initAuth();

  // ── Initialize Pages ──
  initFeed();
  initExplore();
  initCommunities();
  initPrivacy();

  // ── Theme Toggle ──
  const themeBtn = document.getElementById('themeToggle');
  if (themeBtn) {
    const savedTheme = localStorage.getItem('nexus_theme') || 'light';
    document.body.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    themeBtn.addEventListener('click', () => {
      const current = document.body.getAttribute('data-theme');
      const next = current === 'light' ? 'dark' : 'light';
      document.body.setAttribute('data-theme', next);
      localStorage.setItem('nexus_theme', next);
      updateThemeIcon(next);
      showToast(next === 'dark' ? '🌙 Dark Mode เปิดแล้ว' : '☀️ Light Mode เปิดแล้ว', 'info', 1500);
    });
  }

  function updateThemeIcon(theme) {
    const icon = themeBtn && themeBtn.querySelector('i');
    if (icon) icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
  }

  // ── Navbar Scroll Effect ──
  window.addEventListener('scroll', debounce(() => {
    const navbar = document.getElementById('navbar');
    if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 10);
  }, 50));

  // ── Navigation ──
  document.querySelectorAll('.nav-item[data-page]').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      showPage(item.dataset.page);
    });
  });

  // ── Feed Filters ──
  document.querySelectorAll('.filter-pill').forEach(pill => {
    pill.addEventListener('click', function() {
      handleFeedFilter(this.dataset.filter);
    });
  });

  // ── Algorithm Mode ──
  document.querySelectorAll('.algo-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      setAlgoMode(this.dataset.mode);
    });
  });

  // ── Post Submit ──
  const submitBtn = document.getElementById('submitPost');
  if (submitBtn) {
    submitBtn.addEventListener('click', submitNewPost);
  }

  // ── Load More ──
  const loadMoreBtn = document.getElementById('loadMoreBtn');
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', loadMorePosts);
  }

  // ── Notifications ──
  const notifBtn = document.getElementById('notifBtn');
  if (notifBtn) {
    notifBtn.addEventListener('click', () => {
      const overlay = document.getElementById('notifOverlay');
      if (overlay) {
        overlay.style.display = 'block';
        renderNotifications();
      }
    });
  }

  const notifOverlay = document.getElementById('notifOverlay');
  if (notifOverlay) {
    notifOverlay.addEventListener('click', (e) => {
      if (e.target === notifOverlay) closePanel('notif');
    });
  }

  function renderNotifications() {
    const body = document.getElementById('notifPanelBody');
    if (!body) return;
    body.innerHTML = MOCK_NOTIFICATIONS.map(n => `
      <div class="notif-item ${n.unread ? 'unread' : ''}">
        ${n.avatar
          ? `<img src="${n.avatar}" class="notif-avatar" alt="Notif" />`
          : `<div class="notif-avatar" style="background:linear-gradient(135deg,#7C3AED,#06B6D4);display:flex;align-items:center;justify-content:center;font-size:16px;border-radius:50%;">🔔</div>`
        }
        <div style="flex:1">
          <div class="notif-text">${n.text}</div>
          <div class="notif-time">${n.time}</div>
        </div>
      </div>
    `).join('');
    // Clear badge
    const badge = notifBtn.querySelector('.badge');
    if (badge) badge.style.display = 'none';
  }

  // ── Messages Button ──
  const msgBtn = document.getElementById('msgBtn');
  if (msgBtn) {
    msgBtn.addEventListener('click', () => {
      showToast('💬 Messages — เปิดให้ใช้งานเร็วๆ นี้!', 'info');
    });
  }

  // ── Anonymous Mode Toggle ──
  const toggleAnonBtn = document.getElementById('toggleAnonMode');
  if (toggleAnonBtn) {
    let anonPageActive = false;
    toggleAnonBtn.addEventListener('click', () => {
      anonPageActive = !anonPageActive;
      const dot = document.getElementById('anonStatusDot');
      const text = document.getElementById('anonStatusText');
      if (dot) dot.className = `status-dot ${anonPageActive ? 'active' : 'inactive'}`;
      if (text) text.textContent = `Anonymous Mode: ${anonPageActive ? 'เปิดอยู่' : 'ปิดอยู่'}`;
      toggleAnonBtn.classList.toggle('active', anonPageActive);
      toggleAnonBtn.innerHTML = anonPageActive
        ? '<i class="fas fa-user-secret"></i> ปิด Anonymous Mode'
        : '<i class="fas fa-user-secret"></i> เปิด Anonymous Mode';
      showToast(anonPageActive
        ? '🕵️ Anonymous Mode เปิดแล้ว! ตัวตนของคุณถูกปกป้อง'
        : '👤 กลับสู่โปรไฟล์ปกติแล้ว', 'success');
    });
  }

  // ── Mobile Menu ──
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const sidebarLeft = document.getElementById('sidebarLeft');
  if (mobileMenuBtn && sidebarLeft) {
    mobileMenuBtn.addEventListener('click', () => {
      sidebarLeft.classList.toggle('open');
    });
    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (!sidebarLeft.contains(e.target) && e.target !== mobileMenuBtn) {
        sidebarLeft.classList.remove('open');
      }
    });
  }

  // ── Mood Buttons ──
  document.querySelectorAll('.mood-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.mood-btn').forEach(b => b.classList.remove('selected'));
      this.classList.add('selected');
      const moods = {
        great: '😄 ดีมากเลย! วันนี้ขอให้สนุก',
        good: '🙂 ดีนะ ขอให้วันนี้เป็นวันที่ดี',
        ok: '😐 โอเคนะ ถ้าอยากระบายมีชุมชนอยู่นะ',
        bad: '😔 ไม่เป็นไรนะ ลองเปิด Anti-Doomscroll ดูไหม?'
      };
      showToast(moods[this.dataset.mood] || 'บันทึกอารมณ์แล้ว', 'info', 3000);
    });
  });

  // ── Global Search ──
  const searchInput = document.getElementById('globalSearch');
  if (searchInput) {
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && searchInput.value.trim()) {
        showToast(`🔍 ค้นหา "${searchInput.value.trim()}"...`, 'info', 2000);
      }
    });

    // Keyboard shortcut ⌘K / Ctrl+K
    document.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInput.focus();
        searchInput.select();
      }
    });
  }

  // ── Anonymous toggle in create post ──
  const anonToggle = document.getElementById('anonToggle');
  if (anonToggle) {
    anonToggle.addEventListener('change', function() {
      const hint = document.querySelector('.anon-hint');
      if (hint) {
        hint.textContent = this.checked
          ? `จะแสดงเป็น "Anon_${Math.floor(Math.random()*9000)+1000}"`
          : 'จะแสดงเป็น "Anon_xxxx"';
      }
    });
  }

  // ── Onboarding check ──
  if (!localStorage.getItem('nexus_onboarded')) {
    // Show onboarding
  } else {
    closeOnboarding();
  }

  // ── Keyboard shortcut hints ──
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closePanel('notif');
      const sidebarLeft = document.getElementById('sidebarLeft');
      if (sidebarLeft) sidebarLeft.classList.remove('open');
    }
  });

  // ── Simulated "Echo Chamber" check ──
  // After 15 seconds, show diversity alert (simulates algorithm detecting echo chamber)
  setTimeout(() => {
    const alert = document.getElementById('diversityAlert');
    if (alert) alert.style.display = 'flex';
  }, 15000);

  console.log('%cNexus Social Network — Initialized ✓', 
    'background: linear-gradient(135deg, #7C3AED, #06B6D4); color: white; padding: 8px 16px; border-radius: 8px; font-size: 14px; font-weight: bold;');
  console.log('%c"Your feed, your rules. Your data, yours."', 
    'color: #7C3AED; font-style: italic; font-size: 12px;');
});
