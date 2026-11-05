// ============================================
// NEXUS — Feed Page
// ============================================

let currentPage = 1;
const postsPerPage = 5;

/**
 * Render all posts in feed
 */
function renderFeed(posts) {
  const container = document.getElementById('postsFeed');
  if (!container) return;

  container.innerHTML = '';
  posts.forEach(post => {
    container.insertAdjacentHTML('beforeend', renderPost(post));
  });
}

/**
 * Initialize feed
 */
function initFeed() {
  renderFeed(MOCK_POSTS);
  renderTrending();
  renderSuggested();

  // Show diversity alert after 5 seconds
  setTimeout(() => {
    const alert = document.getElementById('diversityAlert');
    if (alert) alert.style.display = 'flex';
  }, 5000);
}

/**
 * Render trending list in right sidebar
 */
function renderTrending() {
  const list = document.getElementById('trendingList');
  if (!list) return;

  list.innerHTML = MOCK_TRENDING.map((item, i) => `
    <div class="trending-item" onclick="searchTag('${item.tag}')">
      <span class="trending-num">${i + 1}</span>
      <div class="trending-info">
        <div class="trending-tag">${item.tag}</div>
        <div class="trending-count">${item.count}</div>
      </div>
      ${item.fire ? '<span class="trending-fire">🔥</span>' : ''}
    </div>
  `).join('');
}

/**
 * Render suggested people
 */
function renderSuggested() {
  const list = document.getElementById('suggestedList');
  if (!list) return;

  const suggested = MOCK_USERS.filter(u => u.id !== 1).slice(0, 4);

  list.innerHTML = suggested.map(user => `
    <div class="suggested-person">
      <img src="${user.avatar}" alt="${user.name}" class="suggested-avatar" />
      <div class="suggested-info">
        <div class="suggested-name">${user.name}</div>
        <div class="suggested-mutual">${user.mutual > 0 ? `${user.mutual} เพื่อนร่วม` : 'แนะนำสำหรับคุณ'}</div>
      </div>
      <button class="btn-follow" onclick="followUser(${user.id}, this)">ติดตาม</button>
    </div>
  `).join('');
}

/**
 * Follow user
 */
function followUser(userId, btn) {
  const user = getUserById(userId);
  if (!user) return;

  if (btn.classList.contains('following')) {
    btn.textContent = 'ติดตาม';
    btn.classList.remove('following');
    showToast(`เลิกติดตาม ${user.name} แล้ว`, 'info', 2000);
  } else {
    btn.textContent = '✓ ติดตามแล้ว';
    btn.classList.add('following');
    showToast(`✅ ติดตาม ${user.name} แล้ว!`, 'success', 2000);
  }
}

/**
 * Search tag (simulated)
 */
function searchTag(tag) {
  document.getElementById('globalSearch').value = tag;
  showToast(`🔍 ค้นหา ${tag}`, 'info', 2000);
}

/**
 * Handle feed filter
 */
function handleFeedFilter(filter) {
  document.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
  event.target.classList.add('active');

  const filterMap = {
    all: MOCK_POSTS,
    friends: MOCK_POSTS.filter(p => !p.isAnonymous),
    communities: MOCK_POSTS.filter(p => p.algoReason === 'local'),
    trending: MOCK_POSTS.filter(p => p.algoReason === 'trending' || p.likes > 500),
    local: MOCK_POSTS.filter(p => p.algoReason === 'local' || p.algoReason === 'diverse')
  };

  const filtered = filterMap[filter] || MOCK_POSTS;
  renderFeed(filtered);
  showToast(`🔄 กรอง Feed เป็น "${filter === 'all' ? 'ทั้งหมด' : filter}" แล้ว`, 'info', 1500);
}

/**
 * Submit new post
 */
function submitNewPost() {
  const input = document.getElementById('postInput');
  const anonToggle = document.getElementById('anonToggle');
  const visibility = document.getElementById('postVisibility');

  if (!input) return;

  const text = input.innerText.trim();
  if (!text) {
    showToast('✍️ กรุณาเขียนบางอย่างก่อนโพสต์', 'warning');
    return;
  }

  const isAnon = anonToggle ? anonToggle.checked : false;

  const newPost = {
    id: MOCK_POSTS.length + 100 + Math.floor(Math.random() * 100),
    userId: isAnon ? null : 1,
    isAnonymous: isAnon,
    anonHandle: isAnon ? `Anon_${Math.floor(Math.random() * 9000) + 1000}` : null,
    text: text,
    images: [],
    likes: 0,
    comments: 0,
    shares: 0,
    liked: false,
    timestamp: 'เพิ่งโพสต์',
    emotionalTone: 'neutral',
    algoReason: 'friend',
    commentList: []
  };

  MOCK_POSTS.unshift(newPost);

  const container = document.getElementById('postsFeed');
  if (container) {
    container.insertAdjacentHTML('afterbegin', renderPost(newPost));
  }

  input.innerText = '';
  if (anonToggle) anonToggle.checked = false;

  const icon = isAnon ? '🕵️' : '✅';
  const msg = isAnon ? 'โพสต์แบบ Anonymous สำเร็จ!' : 'โพสต์สำเร็จ!';
  showToast(`${icon} ${msg}`, 'success');
}

/**
 * Load more posts (simulated)
 */
function loadMorePosts() {
  const btn = document.getElementById('loadMoreBtn');
  if (btn) {
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> กำลังโหลด...';
    btn.disabled = true;
  }

  setTimeout(() => {
    // Add randomized posts
    const extraPosts = MOCK_POSTS.slice(0, 3).map(p => ({
      ...p,
      id: p.id + 100 + Math.floor(Math.random() * 100),
      timestamp: '3 วันที่แล้ว',
      liked: false,
      likes: Math.floor(Math.random() * 1000) + 10
    }));

    const container = document.getElementById('postsFeed');
    if (container) {
      extraPosts.forEach(post => {
        container.insertAdjacentHTML('beforeend', renderPost(post));
      });
    }

    if (btn) {
      btn.innerHTML = '<i class="fas fa-arrow-down"></i> โหลดเพิ่มเติม';
      btn.disabled = false;
    }

    showToast('📄 โหลดโพสต์เพิ่มเติมแล้ว', 'info', 2000);
  }, 1000);
}
