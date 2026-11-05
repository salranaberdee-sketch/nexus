// ============================================
// NEXUS — Post Component
// ============================================

/**
 * Render a single post card
 */
function renderPost(post) {
  const user = post.isAnonymous ? null : getUserById(post.userId);
  const anonHandle = post.anonHandle || `Anon_${Math.floor(Math.random() * 9999)}`;

  // Build author section
  let avatarHtml = '';
  let authorNameHtml = '';

  if (post.isAnonymous) {
    avatarHtml = `<div class="post-avatar anon-avatar">🕵️</div>`;
    authorNameHtml = `
      <div class="post-author-name">
        ${anonHandle}
        <span class="anon-tag">Anonymous</span>
      </div>
    `;
  } else if (user) {
    avatarHtml = `<img src="${user.avatar}" alt="${user.name}" class="post-avatar" />`;
    authorNameHtml = `
      <div class="post-author-name">
        ${user.name}
        ${user.verified ? '<span class="verified-badge" title="Verified Human">✓</span>' : ''}
      </div>
    `;
  }

  // Build algo reason button
  const algoReasonText = getAlgoReason(post.algoReason);
  const algoBtn = algoReasonText
    ? `<button class="post-why-btn" onclick="showAlgoExplain('${post.algoReason}')">ทำไมถึงเห็น?</button>`
    : '';

  // Build media
  let mediaHtml = '';
  if (post.images && post.images.length > 0) {
    if (post.images.length === 1) {
      mediaHtml = `
        <div class="post-media">
          <img src="${post.images[0]}" alt="Post image" loading="lazy" 
               onerror="this.parentElement.style.display='none'" />
        </div>
      `;
    } else {
      const cols = post.images.length >= 3 ? 'cols-3' : 'cols-2';
      const imgs = post.images.map(src =>
        `<img src="${src}" alt="Post image" loading="lazy" />`
      ).join('');
      mediaHtml = `
        <div class="post-media">
          <div class="media-grid ${cols}">${imgs}</div>
        </div>
      `;
    }
  }

  // Build poll
  let pollHtml = '';
  if (post.poll) {
    const totalVotes = post.poll.totalVotes || post.poll.options.reduce((a, b) => a + b.votes, 0);
    const optionsHtml = post.poll.options.map((opt, i) => {
      const pct = totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0;
      return `
        <div class="poll-option-item ${post.poll.voted ? 'voted' : ''}" 
             onclick="votePoll(${post.id}, ${i})">
          <div class="poll-fill" style="width:${pct}%"></div>
          <div class="poll-option-text">
            <span>${opt.text}</span>
            <span class="poll-pct">${pct}%</span>
          </div>
        </div>
      `;
    }).join('');

    pollHtml = `
      <div class="post-poll">
        <p style="font-size:14px;font-weight:600;margin-bottom:10px;">${post.poll.question}</p>
        ${optionsHtml}
        <p style="font-size:12px;color:var(--text-muted);margin-top:8px;">
          ${formatCount(totalVotes)} โหวต
        </p>
      </div>
    `;
  }

  // Build comments preview
  const commentsHtml = (post.commentList || []).slice(0, 2).map(c => {
    const cu = getUserById(c.userId);
    if (!cu) return '';
    return `
      <div class="comment-item">
        <img src="${cu.avatar}" alt="${cu.name}" class="comment-avatar" />
        <div class="comment-bubble">
          <div class="comment-author">${cu.name}</div>
          <div class="comment-text">${c.text}</div>
        </div>
      </div>
    `;
  }).join('');

  return `
    <div class="post-card" id="post-${post.id}">
      <!-- Header -->
      <div class="post-header">
        ${avatarHtml}
        <div class="post-author-info">
          ${authorNameHtml}
          <div class="post-meta">
            <span>${post.timestamp}</span>
            ${algoBtn}
          </div>
        </div>
        <button class="post-menu-btn" onclick="showPostMenu(${post.id})">
          <i class="fas fa-ellipsis-h"></i>
        </button>
      </div>

      <!-- Text -->
      <div class="post-body">
        <div class="post-text">${formatPostText(post.text)}</div>
      </div>

      <!-- Media -->
      ${mediaHtml}

      <!-- Poll -->
      ${pollHtml}

      <!-- Emotional Tone -->
      ${getEmotionalToneBadge(post.emotionalTone)}

      <!-- Action Buttons -->
      <div class="post-actions">
        <button class="action-btn ${post.liked ? 'liked' : ''}" 
                onclick="toggleLike(${post.id})" id="like-btn-${post.id}">
          <i class="${post.liked ? 'fas' : 'far'} fa-heart"></i>
          <span id="like-count-${post.id}">${formatCount(post.likes)}</span>
        </button>
        <button class="action-btn" onclick="toggleComments(${post.id})">
          <i class="far fa-comment"></i>
          <span>${formatCount(post.comments)}</span>
        </button>
        <button class="action-btn" onclick="sharePost(${post.id})">
          <i class="fas fa-share"></i>
          <span>${formatCount(post.shares)}</span>
        </button>
        <button class="action-btn" onclick="tipCreator(${post.id})" 
                style="${post.isAnonymous ? 'display:none' : ''}">
          <i class="fas fa-coins"></i>
          <span>Support</span>
        </button>
      </div>

      <!-- Comments -->
      <div class="comments-section" id="comments-${post.id}">
        <div id="comment-list-${post.id}">
          ${commentsHtml}
        </div>
        <div class="add-comment">
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=nexus123" 
               class="comment-avatar" alt="You" />
          <input type="text" class="comment-input" 
                 placeholder="เขียนความคิดเห็น..." 
                 id="comment-input-${post.id}"
                 onkeydown="if(event.key==='Enter') submitComment(${post.id})" />
          <button class="comment-submit" onclick="submitComment(${post.id})">
            <i class="fas fa-paper-plane"></i>
          </button>
        </div>
      </div>
    </div>
  `;
}

/**
 * Toggle like on a post
 */
function toggleLike(postId) {
  const post = MOCK_POSTS.find(p => p.id === postId);
  if (!post) return;

  post.liked = !post.liked;
  post.likes += post.liked ? 1 : -1;

  const btn = document.getElementById(`like-btn-${postId}`);
  const count = document.getElementById(`like-count-${postId}`);

  if (btn) {
    btn.classList.toggle('liked', post.liked);
    const icon = btn.querySelector('i');
    if (icon) {
      icon.className = post.liked ? 'fas fa-heart' : 'far fa-heart';
    }
  }

  if (count) count.textContent = formatCount(post.likes);

  if (post.liked) {
    showToast('❤️ Liked!', 'success', 1500);
  }
}

/**
 * Toggle comments section
 */
function toggleComments(postId) {
  const section = document.getElementById(`comments-${postId}`);
  if (section) {
    section.classList.toggle('open');
    if (section.classList.contains('open')) {
      const input = document.getElementById(`comment-input-${postId}`);
      if (input) setTimeout(() => input.focus(), 100);
    }
  }
}

/**
 * Submit a comment
 */
function submitComment(postId) {
  const input = document.getElementById(`comment-input-${postId}`);
  if (!input || !input.value.trim()) return;

  const text = input.value.trim();
  const list = document.getElementById(`comment-list-${postId}`);

  const commentHtml = `
    <div class="comment-item" style="animation:fade-in 0.3s ease">
      <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=nexus123" 
           class="comment-avatar" alt="You" />
      <div class="comment-bubble">
        <div class="comment-author">คุณ</div>
        <div class="comment-text">${text}</div>
      </div>
    </div>
  `;

  if (list) list.insertAdjacentHTML('beforeend', commentHtml);
  input.value = '';
  showToast('💬 ส่งความคิดเห็นแล้ว', 'success', 1500);
}

/**
 * Share post
 */
function sharePost(postId) {
  showToast('📤 คัดลอก Link สำเร็จ! พร้อมแชร์', 'success');
}

/**
 * Tip creator
 */
function tipCreator(postId) {
  showToast('💰 Direct Support — ฟีเจอร์นี้จะพร้อมเร็วๆ นี้!', 'info');
}

/**
 * Vote in poll
 */
function votePoll(postId, optionIndex) {
  const post = MOCK_POSTS.find(p => p.id === postId);
  if (!post || !post.poll || post.poll.voted) return;

  post.poll.voted = true;
  post.poll.options[optionIndex].votes++;
  post.poll.totalVotes++;

  // Re-render post
  const card = document.getElementById(`post-${postId}`);
  if (card) {
    const newHtml = renderPost(post);
    const temp = document.createElement('div');
    temp.innerHTML = newHtml;
    card.replaceWith(temp.firstElementChild);
  }
  showToast('🗳️ บันทึกโหวตของคุณแล้ว!', 'success');
}

/**
 * Show algo explanation
 */
function showAlgoExplain(reason) {
  const explanations = {
    friend: '👥 Post นี้ขึ้น feed เพราะเพื่อนของคุณ 3 คน interact กับมัน',
    interest: '🎯 ตรงกับ Topics ที่คุณ follow ได้แก่ #เทคโนโลยี และ #Privacy',
    trending: '🔥 กำลังเป็นที่นิยมในชุมชนของคุณ — 1.2K engagements ใน 2 ชั่วโมง',
    local: '📍 Creator อยู่ในพื้นที่เดียวกับคุณ',
    diverse: '🌈 เลือกขึ้น feed เพื่อความหลากหลาย ป้องกัน echo chamber'
  };
  showToast(explanations[reason] || 'Algorithm เลือกให้โดยอัตโนมัติ', 'info', 4000);
}

/**
 * Show post menu
 */
function showPostMenu(postId) {
  showToast('ตัวเลือก: บันทึก, รายงาน, ซ่อน, ดู Original Source', 'info', 3000);
}
