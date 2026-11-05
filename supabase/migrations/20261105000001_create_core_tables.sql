-- ============================================
-- Nexus — Core Tables Migration
-- ============================================

-- 1. PROFILES (extends auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  handle TEXT UNIQUE NOT NULL,
  avatar TEXT DEFAULT 'https://api.dicebear.com/7.x/avataaars/svg?seed=default',
  bio TEXT DEFAULT '',
  verified BOOLEAN DEFAULT FALSE,
  is_creator BOOLEAN DEFAULT FALSE,
  privacy_score INTEGER DEFAULT 85 CHECK (privacy_score >= 0 AND privacy_score <= 100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. POSTS
CREATE TABLE public.posts (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  is_anonymous BOOLEAN DEFAULT FALSE,
  anon_handle TEXT, -- "Anon_XXXX" server-side only
  text TEXT NOT NULL CHECK (char_length(text) <= 2000),
  images TEXT[] DEFAULT '{}',
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  shares_count INTEGER DEFAULT 0,
  emotional_tone TEXT DEFAULT 'neutral' CHECK (emotional_tone IN ('positive','neutral','negative','mixed')),
  algo_reason TEXT DEFAULT 'interest' CHECK (algo_reason IN ('friend','interest','trending','local','diverse')),
  visibility TEXT DEFAULT 'public' CHECK (visibility IN ('public','friends','private')),
  community_id BIGINT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. POLLS (linked to posts)
CREATE TABLE public.polls (
  id BIGSERIAL PRIMARY KEY,
  post_id BIGINT REFERENCES public.posts(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  total_votes INTEGER DEFAULT 0,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.poll_options (
  id BIGSERIAL PRIMARY KEY,
  poll_id BIGINT REFERENCES public.polls(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  votes INTEGER DEFAULT 0,
  display_order INTEGER DEFAULT 0
);

-- 4. COMMENTS
CREATE TABLE public.comments (
  id BIGSERIAL PRIMARY KEY,
  post_id BIGINT REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  text TEXT NOT NULL CHECK (char_length(text) <= 1000),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. LIKES
CREATE TABLE public.likes (
  id BIGSERIAL PRIMARY KEY,
  post_id BIGINT REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

-- 6. FOLLOWS
CREATE TABLE public.follows (
  id BIGSERIAL PRIMARY KEY,
  follower_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  following_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(follower_id, following_id),
  CHECK (follower_id != following_id)
);

-- 7. COMMUNITIES
CREATE TABLE public.communities (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  emoji TEXT DEFAULT '💬',
  gradient TEXT DEFAULT 'linear-gradient(135deg, #7C3AED, #06B6D4)',
  members_count INTEGER DEFAULT 0,
  posts_per_day TEXT DEFAULT '0/วัน',
  health_score INTEGER DEFAULT 75 CHECK (health_score >= 0 AND health_score <= 100),
  creator_id UUID REFERENCES public.profiles(id),
  is_private BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. COMMUNITY MEMBERS
CREATE TABLE public.community_members (
  id BIGSERIAL PRIMARY KEY,
  community_id BIGINT REFERENCES public.communities(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member' CHECK (role IN ('member','moderator','admin')),
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(community_id, user_id)
);

-- 9. NOTIFICATIONS
CREATE TABLE public.notifications (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  from_user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  type TEXT NOT NULL CHECK (type IN ('like','comment','share','follow','support','mention','system')),
  text TEXT NOT NULL,
  related_post_id BIGINT REFERENCES public.posts(id) ON DELETE SET NULL,
  is_read BOOLEAN DEFAULT FALSE,
  can_disable BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. DATA VAULT CATEGORIES (privacy page)
CREATE TABLE public.data_vault_categories (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  icon TEXT DEFAULT '📁',
  name TEXT NOT NULL,
  size_mb NUMERIC DEFAULT 0,
  can_delete BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. TRACKING PREFERENCES
CREATE TABLE public.tracking_preferences (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  status TEXT DEFAULT 'off' CHECK (status IN ('on','off')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES (for RLS policy performance)
-- ============================================
CREATE INDEX idx_posts_user_id ON public.posts(user_id);
CREATE INDEX idx_posts_community_id ON public.posts(community_id);
CREATE INDEX idx_posts_created_at ON public.posts(created_at DESC);
CREATE INDEX idx_comments_post_id ON public.comments(post_id);
CREATE INDEX idx_likes_post_id ON public.likes(post_id);
CREATE INDEX idx_likes_user_id ON public.likes(user_id);
CREATE INDEX idx_follows_follower ON public.follows(follower_id);
CREATE INDEX idx_follows_following ON public.follows(following_id);
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_is_read ON public.notifications(is_read);
CREATE INDEX idx_community_members_user ON public.community_members(user_id);
