# Nexus — รายงานการวิเคราะห์โปรเจกต์ทั้งหมด

> วันที่วิเคราะห์: 2026-11-02
> ขอบเขต: ทุกไฟล์ในโปรเจกต์ (`index.html`, `src/**`, `styles/main.css`)

---

## 1. ภาพรวมโปรเจกต์

**Nexus** — เว็บ prototype (mockup) ของโซเชียลเน็ตเวิร์กแนว "Privacy-first / Algorithm ที่ผู้ใช้คุมเอง"
ธีมการตลาด: *"Social Network ที่ทำสิ่งที่ Facebook ทำไม่ได้"*

- **เทคโนโลยี**: Static HTML + CSS + Vanilla JS ล้วน — ไม่มี build tool, ไม่มี `package.json`, ไม่มี framework
- **รูปแบบ**: Single Page App แบบจำลอง สลับหน้าด้วยการซ่อน/แสดง `div.page` (ไม่โหลดหน้าใหม่)
- **ข้อมูล**: เป็น mock data ทั้งหมด ไม่มี backend / API / ฐานข้อมูล

---

## 2. โครงสร้างไฟล์ & สถาปัตยกรรม

```
nexus/
├── index.html              # โครงหน้าเว็บทั้งหมด (~660 บรรทัด)
├── public/                 # โฟลเดอร์ว่าง (ยังไม่มีอะไร)
└── src/
    ├── main.js             # controller หลัก (event, theme, nav)
    ├── data/mockData.js    # ข้อมูลจำลองทั้งหมด
    ├── utils/helpers.js    # ฟังก์ชันช่วย + ScreenTimeTracker
    ├── components/post.js  # render การ์ดโพสต์ + interaction
    ├── pages/feed.js
    ├── pages/explore.js
    ├── pages/communities.js
    ├── pages/privacy.js
    └── styles/main.css     # 2,164 บรรทัด
```

- ลำดับการโหลดสคริปต์ใน `index.html` ถูกต้อง (mockData → helpers → post → pages → main)
- `main.js` เรียก `init*()` ครบทุกหน้าอยู่ใน `DOMContentLoaded`
- โครงสร้างโดยรวม **ทำงานได้จริง ไม่มี error ตอนโหลด**

---

## 3. ฟีเจอร์ที่มี

| หน้า | ฟีเจอร์ |
|---|---|
| Feed | สร้างโพสต์ (text / anonymous / visibility / poll), like, comment, share, vote, filter pills, load more |
| ควบคุม Feed | 4 โหมด (Smart / ล่าสุด / ใกล้ฉัน / หลากหลาย) |
| Explore | trending tags, topics grid |
| Communities | การ์ดชุมชน + health bar |
| Creator Hub | stats, monetization cards (static) |
| Data Vault | privacy score, data categories, export, tracking list |
| Anonymous | toggle + feature cards |
| อื่นๆ | Dark/Light theme, notifications panel, toast, onboarding modal, wellbeing widget, anti-doomscroll |

---

## 4. ปัญหา / Bugs (เรียงตามความรุนแรง)

### 🔴 ร้ายแรง — ควรแก้ก่อน

1. **Mobile menu เปิดไม่ได้**
   ใน `src/main.js` (บรรทัด 142–155) ปุ่ม hamburger มี `<i>` อยู่ข้างใน เมื่อคลิก event จะ bubble ไปถึง document listener ซึ่งเช็ค `e.target !== mobileMenuBtn` → `e.target` เป็น `<i>` จึงไม่ตรงเงื่อนไข → สั่ง `remove('open')` ทันที ทำให้เมนูเปิดแล้วปิดทันทีในคลิกเดียว

2. **`handleFeedFilter` ใช้ global `event`**
   `src/pages/feed.js` (บรรทัด 105–108) อ้าง `event.target` ซึ่งพึ่ง `window.event` (ไม่รองรับใน Firefox และเป็น anti-pattern) → filter พังในบางเบราว์เซอร์

3. **HTML Injection (XSS)**
   ข้อความที่ผู้ใช้พิมพ์ถูกยัดเข้า `innerHTML` ตรงๆ โดยไม่ escape ทั้งใน:
   - `src/utils/helpers.js` → `formatPostText` (บรรทัด 8–12)
   - `src/components/post.js` → `submitComment` (บรรทัด 226–247)
   - `src/pages/feed.js` → `submitNewPost` (บรรทัด 161)
   → พิมพ์ `<img onerror=...>` แล้วรันสคริปต์ได้

### 🟠 ปานกลาง — logic ขัดกันเอง

4. **ตัวจับเวลา Screen Time ขัดกัน**
   `src/utils/helpers.js` (บรรทัด 105–115) มี 2 `setInterval` ทำงานทับกัน: ตัวหนึ่ง recompute จากเวลาจริงทุก 60 วิ (จะรีเซ็ตเป็น ~0) อีกตัวบวก +1 ทุก 10 วิ → ตัวเลขกระโดด/ไม่สอดคล้อง

5. **Diversity Alert มี timer ซ้อน 2 จุด**
   `src/pages/feed.js` (บรรทัด 29–33) ตั้งไว้ 5 วิ และ `src/main.js` (บรรทัด 220–225) ตั้งไว้ 15 วิ → alert เด้งเสมอที่ 5 วิโดยไม่มี logic "ตรวจ echo chamber" จริง และตัวที่ 2 ไม่มีผล

6. **Filter บางตัวได้ผลว่างเปล่า**
   `src/pages/feed.js` (บรรทัด 109–115) กรอง `algoReason === 'local'` แต่ใน mockData **ไม่มีโพสต์ไหนมีค่า `'local'`** → กด "ชุมชน" ได้ผลลัพธ์ว่าง, "ใกล้ฉัน" ได้แค่ 1 โพสต์

7. **ลบข้อมูลเป็นของปลอม**
   `src/pages/privacy.js` → `deleteDataCategory` (บรรทัด 46–50) แค่ toast แล้ว re-render จาก array เดิม → รายการไม่หายจริง

### 🟡 เล็กน้อย — คุณภาพโค้ด

8. **Dead code**
   - `currentPage`, `postsPerPage` ใน `src/pages/feed.js` (บรรทัด 5–6) ไม่ถูกใช้เลย
   - CSS ว่างเปล่า `.algo-transparency {}` (main.css บรรทัด 1245) และ `.anti-doom {}` (บรรทัด 1376)
   - class `.text-pink` นิยามซ้ำ 2 ที่ (main.css บรรทัด 535 และ 760)

9. **ID โพสต์ชนกันได้**
   `loadMorePosts` (feed.js บรรทัด 182–197) สุ่ม id `p.id + 100 + rand(100)` อาจชนกับโพสต์ที่โหลดรอบก่อน → `getElementById` ทำงานผิดตัว

10. **Hashtag ภาษาไทยไม่ถูก highlight**
    regex `#(\w+)` ใน JS ไม่รองรับอักษรไทย (ต้องมี flag `u` + `\p{L}`)

11. **`onerror` จัดการรูปไม่สม่ำเสมอ**
    มีแค่กรณีรูปเดี่ยว (post.js บรรทัด 46–47) แต่ media grid หลายรูปไม่มี

---

## 5. ฟีเจอร์ที่ยังเป็น "เดโม/สตับ" (ต้องรับรู้ก่อนขึ้น prod)

- **สร้าง Poll ไม่ทำงาน** — โชว์ poll builder ได้ แต่ `submitNewPost` (feed.js 125–170) ไม่ดึงคำถาม/ตัวเลือกไปสร้าง poll จริง และ **ไม่สนใจค่า `visibility`** ที่เลือกไว้เลย
- อัปโหลดรูป/วิดีโอ/สถานที่ → toast เฉยๆ (`triggerMedia` helpers.js 166–180)
- Export JSON/CSV/PDF → ไม่มีไฟล์ออกจริง (`exportData` helpers.js 155–161)
- Typing comment ไม่บวกจำนวน comment
- เปลี่ยน algo mode ไม่จัดเรียง feed จริง
- Messages / Creator Hub / Monetization เป็น static

---

## 6. ปัญหา Dark Mode

`--primary-light` (#EDE9FE สีสว่าง) **ไม่ถูก override ในธีมมืด** → หลายจุดคอนทราสต์แย่:

- `.nav-item.active`
- `.notif-item.unread`
- `.post-why-btn`
- `.poll-fill`
- `.btn-follow`
- chip ที่ hardcode สีอ่อน (`#ECFDF5`, `#EDE9FE`) ใน creator/stat-icon (index.html 308–338) และ `.reason-pill.friend`

---

## 7. ประเด็น Deploy (สำคัญ)

- ไม่มี `package.json`, `vercel.json` และ **ไม่มี `index.html` ที่ root** (อยู่ที่ `nexus/`)
  → คำสั่ง `npx vercel --prod` จะได้หน้า 404 หรือ deploy โฟลเดอร์ว่าง ต้องตั้ง Root Directory ชี้ไป `nexus`
- ไม่มี favicon, ไม่มี meta description
- พึ่ง CDN ภายนอก (Google Fonts, Font Awesome, DiceBear, picsum) → ถ้า offline ไอคอน/รูปจะหาย

---

## 8. สรุปคะแนนภาพรวม

**จุดแข็ง**
- โครงสร้างไฟล์แยกส่วนอ่านง่าย
- ธีม/สไตล์สวยและสม่ำเสมอ จัดระบบด้วย CSS variables ดี
- แนวคิดผลิตภัณฑ์ชัดเจน

**จุดอ่อนหลัก**
- 3 bug ร้ายแรง (mobile menu, filter, XSS)
- ตัวเลข/ลิสต์บางส่วนเป็นสตับ
- ยังไม่พร้อม deploy เพราะไม่มี config

---

## 9. รายการงานที่เสนอ (ยังไม่ดำเนินการ)

| ลำดับ | งาน | ระดับ |
|---|---|---|
| 1 | แก้ mobile menu ไม่ให้ปิดตัวเอง | 🔴 |
| 2 | แก้ `handleFeedFilter` เลิกใช้ global `event` | 🔴 |
| 3 | Escape ข้อความก่อนใส่ innerHTML (กัน XSS) | 🔴 |
| 4 | แก้ ScreenTimeTracker ให้เหลือ timer เดียว | 🟠 |
| 5 | ลบ Diversity Alert timer ที่ซ้ำซ้อน | 🟠 |
| 6 | ปรับ filter/data ให้สอดคล้อง (เพิ่ม `local` หรือแก้เงื่อนไข) | 🟠 |
| 7 | ทำ `deleteDataCategory` ให้ลบจริง | 🟠 |
| 8 | ล้าง dead code / CSS ซ้ำ | 🟡 |
| 9 | ปรับ dark mode contrast | 🟡 |
| 10 | เพิ่ม config ให้ `npx vercel --prod` ทำงานได้ | 🔴 (deploy) |
