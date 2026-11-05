// ============================================
// NEXUS — Communities Page
// ============================================

function initCommunities() {
  renderCommunitiesGrid();
}

function renderCommunitiesGrid() {
  const grid = document.getElementById('communitiesGrid');
  if (!grid) return;

  grid.innerHTML = MOCK_COMMUNITIES.map(community => `
    <div class="community-card" onclick="openCommunity(${community.id})">
      <div class="community-cover" style="background:${community.gradient}">
        ${community.emoji}
      </div>
      <div class="community-body">
        <div class="community-name">${community.name}</div>
        <div class="community-desc">${community.description}</div>
        <div class="community-stats">
          <span>👥 ${(community.members / 1000).toFixed(1)}K สมาชิก</span>
          <span>📝 ${community.posts}</span>
        </div>
        <div style="margin-top:8px;">
          <div style="display:flex;justify-content:space-between;font-size:11px;color:var(--text-muted);margin-bottom:3px;">
            <span>Community Health</span>
            <span style="color:var(--success);font-weight:600;">${community.health}%</span>
          </div>
          <div class="community-health-bar">
            <div class="chb-fill" style="width:${community.health}%"></div>
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

function openCommunity(id) {
  const community = MOCK_COMMUNITIES.find(c => c.id === id);
  if (community) {
    showToast(`🏘️ เข้าชุมชน "${community.name}"`, 'info', 2000);
  }
}
