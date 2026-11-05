// ============================================
// NEXUS — Mock Data
// ============================================

const MOCK_USERS = [
  { id: 1, name: "Alex Nexus", handle: "alex.nexus", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=nexus123", verified: true, mutual: 0 },
  { id: 2, name: "Ploy Siriwan", handle: "ploy.siri", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ploy456", verified: true, mutual: 12 },
  { id: 3, name: "Tom Developer", handle: "tomdev", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=tom789", verified: false, mutual: 5 },
  { id: 4, name: "Mint Creator", handle: "mintcreates", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mint001", verified: true, mutual: 8 },
  { id: 5, name: "Bright AI", handle: "bright.ai", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=bright22", verified: false, mutual: 3 },
  { id: 6, name: "Fern Design", handle: "ferndesign", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=fern55", verified: true, mutual: 14 },
];

const MOCK_POSTS = [
  {
    id: 1,
    userId: 2,
    isAnonymous: false,
    text: "เพิ่งลองใช้ #Nexus ได้สักสัปดาห์แล้ว ต้องบอกว่าฟีเจอร์ Algorithm Transparency นี่ดีมากเลย 🙌\n\nตอนแรกนึกว่าจะใช้ยาก แต่กลายเป็นว่ามันช่วยให้เราควบคุม feed ตัวเองได้จริงๆ ไม่ต้องดูแต่เนื้อหาเดิมๆ\n\nใครที่เบื่อ echo chamber แนะนำมากครับ/ค่ะ #SocialMedia #Privacy",
    images: [],
    likes: 247,
    comments: 38,
    shares: 19,
    liked: false,
    timestamp: "2 ชั่วโมงที่แล้ว",
    emotionalTone: "positive",
    algoReason: "friend",
    commentList: [
      { userId: 3, text: "เห็นด้วยมากเลย! โหมด Chronological นี่ดีมากกว่า algo เดิมๆ", time: "1 ชม." },
      { userId: 4, text: "รอให้ Creator Hub เปิดเต็มๆ เร็วๆ นี้นะ!", time: "45 นาที" }
    ]
  },
  {
    id: 2,
    userId: 3,
    isAnonymous: false,
    text: "🧵 Thread: ทำไมผมถึงย้ายออกจาก Facebook หลังใช้มา 12 ปี\n\n1/ ข้อมูลส่วนตัวถูก track ทุกอย่าง แม้แต่ตอนออกจาก app แล้ว\n2/ Feed เต็มไปด้วยข่าวปลอมที่ algorithm ชอบโปรโมท\n3/ ถูก ban โดยไม่มีคำอธิบาย แล้วอุทธรณ์ก็ไม่ได้ผล\n\n#DigitalPrivacy #SocialMediaExodus",
    images: [],
    likes: 1203,
    comments: 156,
    shares: 89,
    liked: false,
    timestamp: "5 ชั่วโมงที่แล้ว",
    emotionalTone: "mixed",
    algoReason: "trending",
    commentList: [
      { userId: 5, text: "เหมือนกันเลย! ถูก ban โพสต์โดยไม่รู้สาเหตุ", time: "4 ชม." }
    ]
  },
  {
    id: 3,
    userId: null,
    isAnonymous: true,
    anonHandle: "Anon_4829",
    text: "อยากถามแบบ anonymous ว่า... พวกคุณรู้สึกว่า social media ทำให้ชีวิตดีขึ้นหรือแย่ลงมากกว่ากัน?\n\nส่วนตัวรู้สึกว่า doomscrolling ทุกวันทำให้รู้สึกแย่มาก แต่ก็หยุดไม่ได้ 😔",
    images: [],
    poll: {
      question: "Social media ทำให้ชีวิตคุณ...",
      options: [
        { text: "ดีขึ้นมาก", votes: 234 },
        { text: "ดีขึ้นบ้าง", votes: 412 },
        { text: "ไม่ต่างกัน", votes: 187 },
        { text: "แย่ลง", votes: 389 }
      ],
      totalVotes: 1222,
      voted: false
    },
    likes: 88,
    comments: 203,
    shares: 45,
    liked: false,
    timestamp: "8 ชั่วโมงที่แล้ว",
    emotionalTone: "neutral",
    algoReason: "diverse",
    commentList: []
  },
  {
    id: 4,
    userId: 4,
    isAnonymous: false,
    text: "🎉 ยอด Direct Support เดือนนี้แตะ ฿50,000 เป็นครั้งแรกในชีวิต!\n\nขอบคุณ Supporters ทุกคนมากๆ ที่ support งานของเราโดยตรง ไม่ผ่านโฆษณา ✨\n\nนี่แหละคือความแตกต่างของ #Nexus — creator ได้เงินถึงมือจริงๆ\n\n#CreatorEconomy #DirectSupport",
    images: ["https://picsum.photos/seed/creator1/600/400"],
    likes: 892,
    comments: 67,
    shares: 124,
    liked: true,
    timestamp: "1 วันที่แล้ว",
    emotionalTone: "positive",
    algoReason: "interest",
    commentList: [
      { userId: 6, text: "ยินดีด้วยนะ! อยากรู้ว่าทำ content แนวไหนคะ?", time: "20 ชม." },
      { userId: 2, text: "ดีใจด้วยมากเลย! ระบบ creator นี่ดีจริงๆ", time: "18 ชม." }
    ]
  },
  {
    id: 5,
    userId: 6,
    isAnonymous: false,
    text: "ลองทดสอบ Data Vault ของ Nexus แล้ว 😱\n\nสิ่งที่เราเห็น:\n• ข้อมูลที่เก็บมีแค่ที่จำเป็น ไม่มี 3rd party tracking\n• Export ออกมาได้ทันที ไม่ต้องรอ 30 วัน (เหมือน FB)\n• ลบข้อมูลได้จริง ไม่ใช่แค่ปุ่ม placeholder\n\nนี่คือ standard ที่ทุก platform ควรทำ 👏\n\n#DataPrivacy #DigitalRights",
    images: [],
    likes: 2341,
    comments: 189,
    shares: 567,
    liked: false,
    timestamp: "2 วันที่แล้ว",
    emotionalTone: "positive",
    algoReason: "friend",
    commentList: []
  }
];

const MOCK_TRENDING = [
  { tag: "#DigitalPrivacy", count: "48.2K โพสต์", fire: true },
  { tag: "#CreatorEconomy", count: "23.1K โพสต์", fire: true },
  { tag: "#AntiDoomscroll", count: "12.8K โพสต์", fire: false },
  { tag: "#AlgorithmFree", count: "9.4K โพสต์", fire: false },
  { tag: "#DataVault", count: "7.2K โพสต์", fire: false },
];

const MOCK_COMMUNITIES = [
  {
    id: 1,
    name: "Thai Tech Circle",
    description: "ชุมชนนักพัฒนาและคนรักเทคโนโลยีไทย",
    emoji: "💻",
    gradient: "linear-gradient(135deg, #7C3AED, #3B82F6)",
    members: 12847,
    posts: "234/วัน",
    health: 88
  },
  {
    id: 2,
    name: "Digital Privacy TH",
    description: "รู้สิทธิ์ด้านข้อมูลส่วนตัว",
    emoji: "🔐",
    gradient: "linear-gradient(135deg, #374151, #6B7280)",
    members: 8293,
    posts: "89/วัน",
    health: 95
  },
  {
    id: 3,
    name: "Creator Hub TH",
    description: "ชุมชน content creator ไทย",
    emoji: "🎨",
    gradient: "linear-gradient(135deg, #F59E0B, #EF4444)",
    members: 21456,
    posts: "512/วัน",
    health: 79
  },
  {
    id: 4,
    name: "Mental Wellness",
    description: "ดูแลสุขภาพจิตในยุคดิจิทัล",
    emoji: "🧘",
    gradient: "linear-gradient(135deg, #10B981, #06B6D4)",
    members: 5721,
    posts: "45/วัน",
    health: 98
  },
  {
    id: 5,
    name: "Open Source TH",
    description: "พัฒนา open source ด้วยกัน",
    emoji: "🌐",
    gradient: "linear-gradient(135deg, #06B6D4, #10B981)",
    members: 4102,
    posts: "67/วัน",
    health: 91
  },
  {
    id: 6,
    name: "Photography Club",
    description: "แชร์ภาพถ่าย เรียนรู้ด้วยกัน",
    emoji: "📷",
    gradient: "linear-gradient(135deg, #EC4899, #F59E0B)",
    members: 15933,
    posts: "389/วัน",
    health: 82
  }
];

const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ploy456",
    text: "<strong>Ploy Siriwan</strong> liked your post เรื่อง Algorithm Transparency",
    time: "5 นาที",
    unread: true
  },
  {
    id: 2,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=tom789",
    text: "<strong>Tom Developer</strong> commented: \"เห็นด้วยมากเลย ควรมีทุก platform\"",
    time: "23 นาที",
    unread: true
  },
  {
    id: 3,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mint001",
    text: "<strong>Mint Creator</strong> started following you",
    time: "1 ชั่วโมง",
    unread: true
  },
  {
    id: 4,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=bright22",
    text: "<strong>Bright AI</strong> shared your post ไปยัง Tech Circle",
    time: "3 ชั่วโมง",
    unread: false
  },
  {
    id: 5,
    avatar: null,
    text: "🎉 ยินดีด้วย! Data Vault ของคุณได้ Privacy Score 80/100",
    time: "1 วัน",
    unread: false
  }
];

const MOCK_DATA_CATEGORIES = [
  { icon: "👤", name: "โปรไฟล์และข้อมูลส่วนตัว", size: "2.3 MB", canDelete: false },
  { icon: "📝", name: "โพสต์และความคิดเห็น", size: "45.8 MB", canDelete: true },
  { icon: "📸", name: "รูปภาพที่อัพโหลด", size: "312.1 MB", canDelete: true },
  { icon: "🤝", name: "รายชื่อเพื่อนและ Followers", size: "0.8 MB", canDelete: false },
  { icon: "🔍", name: "ประวัติการค้นหา", size: "1.2 MB", canDelete: true },
  { icon: "👁️", name: "ประวัติการดูเนื้อหา (เราไม่เก็บ)", size: "0 KB", canDelete: false },
  { icon: "📍", name: "Location Data (เราไม่เก็บ)", size: "0 KB", canDelete: false },
];

const MOCK_TRACKING = [
  { label: "3rd Party Pixel Tracking", status: "off" },
  { label: "Cross-site Tracking", status: "off" },
  { label: "Behavioral Profiling for Ads", status: "off" },
  { label: "Location Tracking", status: "off" },
  { label: "Face Recognition", status: "off" },
  { label: "Usage Analytics (anonymized)", status: "on" },
];

const EXPLORE_TOPICS = [
  { emoji: "🤖", title: "AI & Technology", posts: "124K" },
  { emoji: "🌿", title: "สิ่งแวดล้อม", posts: "89K" },
  { emoji: "🎨", title: "Art & Design", posts: "234K" },
  { emoji: "🏋️", title: "สุขภาพ & ฟิตเนส", posts: "156K" },
  { emoji: "📚", title: "การศึกษา", posts: "78K" },
  { emoji: "🍜", title: "อาหาร & การท่องเที่ยว", posts: "312K" },
];

const TRENDING_TAGS_LIST = [
  "#DigitalPrivacy", "#CreatorEconomy", "#OpenSource",
  "#MentalHealth", "#AIEthics", "#DecentralizedWeb",
  "#AntiDoomscroll", "#DataRights", "#CommunityFirst",
  "#ThaiTech", "#SustainableTech", "#DigitalMinimalism"
];
