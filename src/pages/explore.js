// ============================================
// NEXUS — Explore Page
// ============================================

function initExplore() {
  renderTrendingTags();
  renderExploreGrid();
}

function renderTrendingTags() {
  const grid = document.getElementById('trendingTagsGrid');
  if (!grid) return;

  grid.innerHTML = TRENDING_TAGS_LIST.map(tag => `
    <div class="tag-chip" onclick="filterByTag('${tag}')">${tag}</div>
  `).join('');
}

function renderExploreGrid() {
  const grid = document.getElementById('exploreGrid');
  if (!grid) return;

  grid.innerHTML = EXPLORE_TOPICS.map(topic => `
    <div class="explore-card" onclick="exploreTopic('${topic.title}')">
      <div class="explore-card-img">${topic.emoji}</div>
      <div class="explore-card-body">
        <div class="explore-card-title">${topic.title}</div>
        <div class="explore-card-meta">${topic.posts} โพสต์</div>
      </div>
    </div>
  `).join('');
}

function filterByTag(tag) {
  showToast(`🔍 กำลังค้นหา ${tag}...`, 'info', 2000);
}

function exploreTopic(topic) {
  showToast(`🌐 สำรวจหัวข้อ "${topic}"`, 'info', 2000);
}
