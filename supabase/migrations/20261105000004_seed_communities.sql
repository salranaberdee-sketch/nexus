-- ============================================
-- Nexus — Seed: Default Communities
-- ============================================

INSERT INTO public.communities (name, description, emoji, gradient, members_count, posts_per_day, health_score)
VALUES
  ('Digital Privacy', 'พูดคุยเรื่องความเป็นส่วนตัวในยุคดิจิทัล', '🔒', 'linear-gradient(135deg, #7C3AED, #4F46E5)', 2847, '34/วัน', 92),
  ('Thai Creators', 'Community ของ content creator ไทย', '🎨', 'linear-gradient(135deg, #EC4899, #EF4444)', 1203, '28/วัน', 88),
  ('Tech & AI', 'เทคโนโลยีและ AI ที่น่าสนใจ', '🤖', 'linear-gradient(135deg, #06B6D4, #3B82F6)', 4521, '67/วัน', 79),
  ('Mental Wellness', 'พื้นที่ปลอดภัยสำหรับพูดคุยเรื่องสุขภาพจิต', '🌱', 'linear-gradient(135deg, #10B981, #06B6D4)', 892, '12/วัน', 95),
  ('Open Source TH', 'นักพัฒนา open source ในไทย', '💻', 'linear-gradient(135deg, #F59E0B, #EF4444)', 634, '19/วัน', 85);
