// ============================================
// NEXUS — Privacy / Data Vault Page
// ============================================

function initPrivacy() {
  renderDataCategories();
  renderTrackingList();
}

function renderDataCategories() {
  const list = document.getElementById('dataCategoriesList');
  if (!list) return;

  list.innerHTML = MOCK_DATA_CATEGORIES.map(item => `
    <div class="data-category-item">
      <span class="dci-icon">${item.icon}</span>
      <div class="dci-info">
        <div class="dci-name">${item.name}</div>
        <div class="dci-size">${item.size}</div>
      </div>
      ${item.canDelete ? `
        <button class="btn-delete-data" onclick="deleteDataCategory('${item.name}')">
          ลบ
        </button>
      ` : `
        <span style="font-size:11px;color:var(--text-muted)">จำเป็น</span>
      `}
    </div>
  `).join('');
}

function renderTrackingList() {
  const list = document.getElementById('trackingList');
  if (!list) return;

  list.innerHTML = MOCK_TRACKING.map(item => `
    <div class="tracking-item">
      <span class="tracking-label">${item.label}</span>
      <span class="tracking-status ${item.status}">
        ${item.status === 'off' ? '✓ ปิด' : '⚠️ เปิด (Anonymized)'}
      </span>
    </div>
  `).join('');
}

function deleteDataCategory(name) {
  showToast(`🗑️ ลบข้อมูล "${name}" สำเร็จ!`, 'success');
  // Refresh list
  setTimeout(renderDataCategories, 500);
}
