-- ============================================
-- Nexus — Triggers & Helper Functions
-- ============================================

-- Auto-create profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, name, handle, avatar)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE(
      NEW.raw_user_meta_data->>'handle',
      lower(replace(split_part(NEW.email, '@', 1), '.', '_'))
    ),
    COALESCE(
      NEW.raw_user_meta_data->>'avatar',
      'https://api.dicebear.com/7.x/avataaars/svg?seed=' || NEW.id
    )
  );

  -- Create default data vault categories for new user
  INSERT INTO public.data_vault_categories (user_id, icon, name, size_mb, can_delete)
  VALUES
    (NEW.id, '📝', 'โพสต์ของคุณ', 0, false),
    (NEW.id, '💬', 'ความคิดเห็น', 0, true),
    (NEW.id, '❤️', 'สิ่งที่กดไลก์', 0, true),
    (NEW.id, '🔍', 'ประวัติการค้นหา', 0, true),
    (NEW.id, '👥', 'การติดตาม/ผู้ติดตาม', 0, false);

  -- Create default tracking preferences (all off by default)
  INSERT INTO public.tracking_preferences (user_id, label, status)
  VALUES
    (NEW.id, 'Interest-based Content Targeting', 'off'),
    (NEW.id, 'Location-based Content', 'off'),
    (NEW.id, 'Cross-session Activity Tracking', 'off'),
    (NEW.id, 'Engagement Pattern Analysis', 'off');

  RETURN NEW;
END;
$$;

-- Attach trigger to auth.users
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ── Update likes_count when like added/removed ──
CREATE OR REPLACE FUNCTION public.update_likes_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.posts SET likes_count = likes_count + 1 WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.posts SET likes_count = GREATEST(likes_count - 1, 0) WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END;
$$;

CREATE OR REPLACE TRIGGER on_like_change
  AFTER INSERT OR DELETE ON public.likes
  FOR EACH ROW EXECUTE FUNCTION public.update_likes_count();

-- ── Update comments_count when comment added/removed ──
CREATE OR REPLACE FUNCTION public.update_comments_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.posts SET comments_count = comments_count + 1 WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.posts SET comments_count = GREATEST(comments_count - 1, 0) WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END;
$$;

CREATE OR REPLACE TRIGGER on_comment_change
  AFTER INSERT OR DELETE ON public.comments
  FOR EACH ROW EXECUTE FUNCTION public.update_comments_count();

-- ── Update community members_count ──
CREATE OR REPLACE FUNCTION public.update_members_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.communities SET members_count = members_count + 1 WHERE id = NEW.community_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.communities SET members_count = GREATEST(members_count - 1, 0) WHERE id = OLD.community_id;
  END IF;
  RETURN NULL;
END;
$$;

CREATE OR REPLACE TRIGGER on_member_change
  AFTER INSERT OR DELETE ON public.community_members
  FOR EACH ROW EXECUTE FUNCTION public.update_members_count();

-- ── Privacy-safe view: anonymous posts hide user_id ──
CREATE OR REPLACE VIEW public.safe_posts AS
  SELECT
    id,
    CASE WHEN is_anonymous THEN NULL ELSE user_id END AS user_id,
    is_anonymous,
    CASE WHEN is_anonymous THEN anon_handle ELSE NULL END AS anon_handle,
    text,
    images,
    likes_count,
    comments_count,
    shares_count,
    emotional_tone,
    algo_reason,
    visibility,
    community_id,
    created_at,
    updated_at
  FROM public.posts;

-- ── updated_at auto-update ──
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER set_posts_updated_at
  BEFORE UPDATE ON public.posts
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
