// ============================================
// Nexus — Supabase Client
// ============================================

const SUPABASE_URL = 'https://dufnwnmluyjgxokhblwj.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_sRHwHwT-7FUKClGzFh31OQ_PXO1xt4S';

// Initialize Supabase client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Current session state
let currentUser = null;
let currentProfile = null;

// ── Auth State Management ──────────────────

async function initAuth() {
  // Check existing session
  const { data: { session } } = await supabase.auth.getSession();
  if (session) {
    currentUser = session.user;
    await loadProfile(currentUser.id);
  }

  // Listen for auth changes
  supabase.auth.onAuthStateChange(async (event, session) => {
    if (event === 'SIGNED_IN' && session) {
      currentUser = session.user;
      await loadProfile(currentUser.id);
      hideAuthModal();
      updateNavAvatar();
      showToast('ยินดีต้อนรับกลับมา! 👋', 'success');
    } else if (event === 'SIGNED_OUT') {
      currentUser = null;
      currentProfile = null;
      updateNavAvatar();
    }
  });
}

async function loadProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (!error && data) {
    currentProfile = data;
  }
}

// ── Sign Up ────────────────────────────────

async function signUp(email, password, name, handle) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name, handle }
    }
  });

  if (error) {
    showToast('❌ ' + error.message, 'error');
    return false;
  }

  showToast('✅ สร้างบัญชีสำเร็จ! กรุณายืนยัน email', 'success');
  return true;
}

// ── Sign In ────────────────────────────────

async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    showToast('❌ ' + (error.message === 'Invalid login credentials' ? 'Email หรือรหัสผ่านไม่ถูกต้อง' : error.message), 'error');
    return false;
  }
  return true;
}

// ── Sign Out ───────────────────────────────

async function signOut() {
  await supabase.auth.signOut();
  showToast('ออกจากระบบแล้ว', 'info');
}

// ── Update Nav Avatar ──────────────────────

function updateNavAvatar() {
  const navAvatar = document.getElementById('navAvatar');
  const navAvatarImg = document.getElementById('navAvatarImg');
  const loginBtn = document.getElementById('loginBtn');

  if (currentProfile) {
    if (navAvatarImg) navAvatarImg.src = currentProfile.avatar;
    if (navAvatar) navAvatar.style.display = 'flex';
    if (loginBtn) loginBtn.style.display = 'none';
  } else {
    if (navAvatar) navAvatar.style.display = 'none';
    if (loginBtn) loginBtn.style.display = 'flex';
  }
}

// ── Auth Modal ─────────────────────────────

function showAuthModal(tab = 'login') {
  const modal = document.getElementById('authModal');
  if (modal) {
    modal.classList.add('active');
    switchAuthTab(tab);
  }
}

function hideAuthModal() {
  const modal = document.getElementById('authModal');
  if (modal) modal.classList.remove('active');
}

function switchAuthTab(tab) {
  document.querySelectorAll('.auth-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tab));
  document.querySelectorAll('.auth-form').forEach(f => f.classList.toggle('active', f.id === `${tab}Form`));
}

// ── Expose globally ────────────────────────
window.nexusAuth = { signUp, signIn, signOut, showAuthModal, hideAuthModal, switchAuthTab };
window.getCurrentUser = () => currentUser;
window.getCurrentProfile = () => currentProfile;
