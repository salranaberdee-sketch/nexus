-- ============================================
-- Nexus — Row Level Security Policies
-- Privacy First Pillar: every table needs RLS
-- ============================================

-- ── PROFILES ──────────────────────────────
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles are viewable by all"
  ON public.profiles FOR SELECT TO authenticated, anon
  USING (true);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT TO authenticated
  WITH CHECK ((select auth.uid()) = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE TO authenticated
  USING ((select auth.uid()) = id)
  WITH CHECK ((select auth.uid()) = id);

CREATE POLICY "Users can delete own profile"
  ON public.profiles FOR DELETE TO authenticated
  USING ((select auth.uid()) = id);

-- ── POSTS ─────────────────────────────────
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public posts are viewable by all"
  ON public.posts FOR SELECT TO authenticated, anon
  USING (visibility = 'public');

CREATE POLICY "Own posts always viewable"
  ON public.posts FOR SELECT TO authenticated
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Authenticated users can create posts"
  ON public.posts FOR INSERT TO authenticated
  WITH CHECK (
    (select auth.uid()) = user_id
    OR is_anonymous = true
  );

CREATE POLICY "Users can update own posts"
  ON public.posts FOR UPDATE TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can delete own posts"
  ON public.posts FOR DELETE TO authenticated
  USING ((select auth.uid()) = user_id);

-- ── POLLS ─────────────────────────────────
ALTER TABLE public.polls ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Polls viewable by all"
  ON public.polls FOR SELECT TO authenticated, anon
  USING (true);

CREATE POLICY "Post owner can create poll"
  ON public.polls FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.posts
      WHERE id = post_id AND user_id = (select auth.uid())
    )
  );

CREATE POLICY "Post owner can update poll"
  ON public.polls FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.posts
      WHERE id = post_id AND user_id = (select auth.uid())
    )
  );

CREATE POLICY "Post owner can delete poll"
  ON public.polls FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.posts
      WHERE id = post_id AND user_id = (select auth.uid())
    )
  );

-- ── POLL OPTIONS ──────────────────────────
ALTER TABLE public.poll_options ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Poll options viewable by all"
  ON public.poll_options FOR SELECT TO authenticated, anon
  USING (true);

CREATE POLICY "Post owner can manage poll options"
  ON public.poll_options FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.polls p
      JOIN public.posts po ON po.id = p.post_id
      WHERE p.id = poll_id AND po.user_id = (select auth.uid())
    )
  );

CREATE POLICY "Post owner can update poll options"
  ON public.poll_options FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.polls p
      JOIN public.posts po ON po.id = p.post_id
      WHERE p.id = poll_id AND po.user_id = (select auth.uid())
    )
  );

CREATE POLICY "Post owner can delete poll options"
  ON public.poll_options FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.polls p
      JOIN public.posts po ON po.id = p.post_id
      WHERE p.id = poll_id AND po.user_id = (select auth.uid())
    )
  );

-- ── COMMENTS ──────────────────────────────
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Comments are viewable by all"
  ON public.comments FOR SELECT TO authenticated, anon
  USING (true);

CREATE POLICY "Authenticated users can comment"
  ON public.comments FOR INSERT TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can update own comments"
  ON public.comments FOR UPDATE TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can delete own comments"
  ON public.comments FOR DELETE TO authenticated
  USING ((select auth.uid()) = user_id);

-- ── LIKES ─────────────────────────────────
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Likes are viewable by all"
  ON public.likes FOR SELECT TO authenticated, anon
  USING (true);

CREATE POLICY "Authenticated users can like"
  ON public.likes FOR INSERT TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can unlike own likes"
  ON public.likes FOR DELETE TO authenticated
  USING ((select auth.uid()) = user_id);

-- ── FOLLOWS ───────────────────────────────
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Follows are viewable by all"
  ON public.follows FOR SELECT TO authenticated, anon
  USING (true);

CREATE POLICY "Authenticated users can follow"
  ON public.follows FOR INSERT TO authenticated
  WITH CHECK ((select auth.uid()) = follower_id);

CREATE POLICY "Users can unfollow"
  ON public.follows FOR DELETE TO authenticated
  USING ((select auth.uid()) = follower_id);

-- ── COMMUNITIES ───────────────────────────
ALTER TABLE public.communities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public communities viewable by all"
  ON public.communities FOR SELECT TO authenticated, anon
  USING (is_private = false);

CREATE POLICY "Members can view private communities"
  ON public.communities FOR SELECT TO authenticated
  USING (
    is_private = true AND
    EXISTS (
      SELECT 1 FROM public.community_members
      WHERE community_id = id AND user_id = (select auth.uid())
    )
  );

CREATE POLICY "Authenticated users can create communities"
  ON public.communities FOR INSERT TO authenticated
  WITH CHECK ((select auth.uid()) = creator_id);

CREATE POLICY "Community admin can update"
  ON public.communities FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.community_members
      WHERE community_id = id
        AND user_id = (select auth.uid())
        AND role = 'admin'
    )
  );

CREATE POLICY "Community admin can delete"
  ON public.communities FOR DELETE TO authenticated
  USING ((select auth.uid()) = creator_id);

-- ── COMMUNITY MEMBERS ─────────────────────
ALTER TABLE public.community_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Community members viewable by all"
  ON public.community_members FOR SELECT TO authenticated, anon
  USING (true);

CREATE POLICY "Users can join communities"
  ON public.community_members FOR INSERT TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can leave communities"
  ON public.community_members FOR DELETE TO authenticated
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Admins can update member roles"
  ON public.community_members FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.community_members cm
      WHERE cm.community_id = community_id
        AND cm.user_id = (select auth.uid())
        AND cm.role = 'admin'
    )
  );

-- ── NOTIFICATIONS ─────────────────────────
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users see own notifications"
  ON public.notifications FOR SELECT TO authenticated
  USING ((select auth.uid()) = user_id);

CREATE POLICY "System can create notifications"
  ON public.notifications FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update own notifications"
  ON public.notifications FOR UPDATE TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can delete own notifications"
  ON public.notifications FOR DELETE TO authenticated
  USING ((select auth.uid()) = user_id);

-- ── DATA VAULT CATEGORIES ─────────────────
ALTER TABLE public.data_vault_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users see own vault data"
  ON public.data_vault_categories FOR SELECT TO authenticated
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can add vault categories"
  ON public.data_vault_categories FOR INSERT TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can update own vault"
  ON public.data_vault_categories FOR UPDATE TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can delete own vault data"
  ON public.data_vault_categories FOR DELETE TO authenticated
  USING ((select auth.uid()) = user_id);

-- ── TRACKING PREFERENCES ──────────────────
ALTER TABLE public.tracking_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users see own tracking prefs"
  ON public.tracking_preferences FOR SELECT TO authenticated
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can add tracking prefs"
  ON public.tracking_preferences FOR INSERT TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can update own tracking prefs"
  ON public.tracking_preferences FOR UPDATE TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can delete own tracking prefs"
  ON public.tracking_preferences FOR DELETE TO authenticated
  USING ((select auth.uid()) = user_id);
