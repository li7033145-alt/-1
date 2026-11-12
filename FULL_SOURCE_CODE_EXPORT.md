# 一场 - 校园活动发现与报名平台 完整源码导出

## package.json
```json
{
  "name": "react-example",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite --port=3000 --host=0.0.0.0",
    "build": "vite build",
    "preview": "vite preview",
    "clean": "rm -rf dist server.js",
    "lint": "tsc --noEmit"
  },
  "dependencies": {
    "@google/genai": "^2.4.0",
    "@tailwindcss/vite": "^4.3.3",
    "@vitejs/plugin-react": "^6.1.1",
    "lucide-react": "^0.546.0",
    "react": "^19.0.1",
    "react-dom": "^19.0.1",
    "vite": "^8.3.0",
    "express": "^4.21.2",
    "dotenv": "^17.2.3",
    "motion": "^12.23.24"
  },
  "devDependencies": {
    "@types/node": "^22.14.0",
    "@types/react": "^19.3.0",
    "@types/react-dom": "^19.3.0",
    "autoprefixer": "^10.4.21",
    "esbuild": "^0.25.0",
    "tailwindcss": "^4.3.3",
    "tsx": "^4.21.0",
    "typescript": "^7.0.2",
    "@types/express": "^4.17.21"
  }
}

```

## tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "experimentalDecorators": true,
    "useDefineForClassFields": false,
    "module": "ESNext",
    "types": ["vite/client"],
    "lib": [
      "ES2022",
      "DOM",
      "DOM.Iterable"
    ],
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "isolatedModules": true,
    "moduleDetection": "force",
    "allowJs": true,
    "jsx": "react-jsx",
    "paths": {
      "@/*": [
        "./*"
      ]
    },
    "allowImportingTsExtensions": true,
    "noEmit": true
  },
  "exclude": ["dist"]
}

```

## vite.config.ts
```ts
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});

```

## metadata.json
```json
{
  "name": "一场 - 校园活动发现与报名平台",
  "description": "校园里，总有一场值得去。为高校大学生提供校园活动发现、活动报名、活动发布和个人活动管理服务。",
  "requestFramePermissions": [],
  "majorCapabilities": ["MAJOR_CAPABILITY_SERVER_SIDE_GEMINI_API"]
}

```

## index.html
```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <title>一场 - 校园活动发现与报名平台</title>
    <meta name="description" content="校园里，总有一场值得去。为高校大学生提供校园活动发现、活动报名、活动发布和个人活动管理服务。" />
    <meta property="og:title" content="一场 - 校园活动发现与报名平台" />
    <meta property="og:description" content="校园里，总有一场值得去。为高校大学生提供校园活动发现、活动报名、活动发布和个人活动管理服务。" />
    <meta property="og:type" content="website" />
    <meta name="twitter:card" content="summary_large_image" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@500;600;700&display=swap" rel="stylesheet" />
  </head>
  <body class="bg-[#F7F7F5] text-[#171717] antialiased selection:bg-[#FF5A4F]/15 selection:text-[#FF5A4F]">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>


```

## src/main.tsx
```tsx
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(<App />);

```

## src/index.css
```css
@import "tailwindcss";

@layer base {
  :root {
    --brand-coral: #FF5A4F;
    --bg-page: #F7F7F5;
    --bg-card: #FFFFFF;
    --text-primary: #171717;
    --text-body: #514744;
    --text-muted: #9A8984;
    --border-divider: #F0EEEC;
    --bg-coral-light: #FFF0ED;
    --bg-disabled: #EAE9E7;
    --text-disabled: #99938F;
  }

  body {
    font-family: 'Plus Jakarta Sans', 'Noto Sans SC', -apple-system, BlinkMacSystemFont, sans-serif;
    background-color: #F7F7F5;
    color: #171717;
    -webkit-tap-highlight-color: transparent;
  }
  * {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  *::-webkit-scrollbar {
    display: none;
    width: 0;
    height: 0;
  }
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.tabular-nums {
  font-variant-numeric: tabular-nums;
}

```

## src/types/activity.ts
```ts
export type ActivityCategory = '全部' | '讲座' | '比赛' | '文体' | '社团' | '展览';

export type ActivityStatus =
  | 'open'      // 状态 A：报名中
  | 'full'      // 状态 B：报名已满
  | 'closed'    // 状态 C：报名已截止
  | 'ended'     // 状态 D：活动已结束
  | 'upcoming'; // 状态 E：未开放报名（即将开放）

export type PublishReviewStatus =
  | 'draft'     // 草稿
  | 'pending'   // 审核中
  | 'approved'  // 审核通过
  | 'rejected'  // 审核未通过
  | 'ended';    // 已结束

export type TimeRangeFilter = 'all' | 'today' | 'week' | 'month';
export type StatusFilter = 'all' | 'open' | 'full' | 'ended' | 'closed' | 'upcoming';

export interface ScheduleItem {
  time: string;
  title: string;
  detail: string;
}

export interface ActivityRecap {
  summary: string;
  highlights: string[];
  attendeeFeedback: {
    user: string;
    department: string;
    comment: string;
  }[];
}

export interface RegistrationRecord {
  registeredAt: string;
  attendeeName: string;
  studentId: string;
  phone: string;
  department: string;
  note?: string;
}

export interface Activity {
  id: string;
  title: string;
  cover: string; // cover preset key or data URL
  category: Exclude<ActivityCategory, '全部'>;
  description: string;
  startTime: string;              // ISO 8601 string
  endTime: string;                // ISO 8601 string
  registrationStartTime: string;  // ISO 8601 string
  registrationDeadline: string;   // ISO 8601 string
  location: string;
  organizer: string;
  organizerInfo: string;
  capacity: number;
  registeredCount: number;
  status: ActivityStatus;
  favorite: boolean;
  campus: string;
  subCampus?: string;
  schedule: ScheduleItem[];
  requirements: string[];
  contact: string;
  isOngoingOnHome?: boolean;
  isStartingSoonOnHome?: boolean;
  isHotOnHome?: boolean;
  isFeaturedOnHome?: boolean;
  isRegistered?: boolean;
  registrationRecord?: RegistrationRecord;
  isUserPublished?: boolean;
  reviewStatus?: PublishReviewStatus;
  rejectReason?: string;
  recap?: ActivityRecap;
}

export interface CampusInfo {
  id: string;
  name: string;
  city: string;
  district: string;
  shortName: string;
  subCampuses: string[];
  activeCount: number;
  studentCountText: string;
  weatherText: string;
}

export type InterestPreference = '艺术' | '体育' | '讲座' | '音乐' | '竞赛' | '社团';

export interface UserProfile {
  nickname: string;
  studentId: string;
  department: string;
  grade: string;
  phone: string;
  bio: string;
  campus: string;
  subCampus?: string;
  interests?: InterestPreference[];
  notificationsEnabled: boolean;
  calendarSyncEnabled: boolean;
}

export interface PublishFormData {
  id?: string;
  title: string;
  cover: string;
  category: Exclude<ActivityCategory, '全部'>;
  description: string;
  startDate: string;
  startClock: string;
  endDate: string;
  endClock: string;
  regStartDate: string;
  regStartClock: string;
  regDeadlineDate: string;
  regDeadlineClock: string;
  subCampus?: string;
  location: string;
  organizer: string;
  capacity: string;
  requirementsText: string;
  contact: string;
}

export type BuddyTag = '同去现场' | '组队参赛' | '约拍互勉' | '跨校区同行';

export interface BuddyPost {
  id: string;
  activityId: string;
  activityTitle: string;
  activityStartTime: string;
  campus: string;
  subCampus: string;
  authorName: string;
  authorDepartment: string;
  authorGrade: string;
  tag: BuddyTag;
  title: string;
  description: string;
  meetingPoint: string;
  maxCount: number;
  currentCount: number;
  participants: string[];
  contactCode: string;
  createdAt: string;
  isJoined?: boolean;
  isMine?: boolean;
}

export type PrimaryTab = 'home' | 'activities' | 'publish' | 'profile';

export type SubView =
  | { type: 'none' }
  | { type: 'campus-select'; isInitial?: boolean }
  | { type: 'activity-detail'; activityId: string }
  | { type: 'publish-preview'; formData: PublishFormData }
  | { type: 'publish-success'; activityId: string; title: string }
  | { type: 'my-registrations' }
  | { type: 'my-buddies' }
  | { type: 'my-favorites' }
  | { type: 'my-published' }
  | { type: 'profile-settings'; section?: 'profile' | 'settings' | 'about' };

```

## src/utils/activityRules.ts
```ts
import {
  Activity,
  ActivityCategory,
  ActivityStatus,
  PublishFormData,
  RegistrationRecord,
  StatusFilter,
  TimeRangeFilter,
} from '../types/activity';

/**
 * 状态判断规则（严格遵循需求文档第六章第6节）：
 * 1. 活动结束时间已过，优先判断为活动已结束 ('ended')。
 * 2. 报名截止时间已过但活动尚未结束，判断为报名已截止 ('closed')。
 * 3. 报名人数达到人数上限，判断为报名已满 ('full')。
 * 4. 报名时间尚未开放，判断为即将开放 ('upcoming')。
 * 5. 报名时间开放且名额充足，判断为报名中 ('open')。
 */
export function computeActivityStatus(
  activity: Pick<
    Activity,
    | 'startTime'
    | 'endTime'
    | 'registrationStartTime'
    | 'registrationDeadline'
    | 'capacity'
    | 'registeredCount'
  >,
  nowIso: string
): ActivityStatus {
  const now = new Date(nowIso).getTime();
  const end = new Date(activity.endTime).getTime();
  const regDeadline = new Date(activity.registrationDeadline).getTime();
  const regStart = new Date(activity.registrationStartTime).getTime();

  if (now > end) {
    return 'ended';
  }
  if (now > regDeadline && now <= end) {
    return 'closed';
  }
  if (activity.registeredCount >= activity.capacity) {
    return 'full';
  }
  if (now < regStart) {
    return 'upcoming';
  }
  return 'open';
}

export function getStatusLabel(status: ActivityStatus): string {
  switch (status) {
    case 'open':
      return '报名中';
    case 'full':
      return '报名已满';
    case 'closed':
      return '报名已截止';
    case 'ended':
      return '已结束';
    case 'upcoming':
      return '即将开放';
  }
}

export function getPrimaryActionLabel(status: ActivityStatus, isRegistered?: boolean): string {
  if (isRegistered) {
    return '已报名';
  }
  switch (status) {
    case 'open':
      return '立即报名';
    case 'full':
      return '报名已满';
    case 'closed':
      return '报名已截止';
    case 'ended':
      return '活动已结束';
    case 'upcoming':
      return '暂未开放';
  }
}

export function canUserRegister(
  activity: Activity,
  nowIso: string
): { allowed: boolean; reason?: string; computedStatus: ActivityStatus } {
  const computedStatus = computeActivityStatus(activity, nowIso);
  if (activity.isRegistered) {
    return { allowed: false, reason: '您已报名该活动', computedStatus };
  }
  if (computedStatus === 'ended') {
    return { allowed: false, reason: '本场活动已结束', computedStatus };
  }
  if (computedStatus === 'closed') {
    return { allowed: false, reason: '报名已截止', computedStatus };
  }
  if (computedStatus === 'full' || activity.registeredCount >= activity.capacity) {
    return { allowed: false, reason: '报名人数已满', computedStatus };
  }
  if (computedStatus === 'upcoming') {
    return { allowed: false, reason: '报名尚未开放', computedStatus };
  }
  return { allowed: true, computedStatus: 'open' };
}

export function applyRegistration(
  activity: Activity,
  record: Omit<RegistrationRecord, 'registeredAt'>,
  nowIso: string
): Activity {
  const check = canUserRegister(activity, nowIso);
  if (!check.allowed) {
    return activity;
  }
  const nextCount = Math.min(activity.capacity, activity.registeredCount + 1);
  const updated: Activity = {
    ...activity,
    registeredCount: nextCount,
    isRegistered: true,
    registrationRecord: {
      ...record,
      registeredAt: nowIso,
    },
  };
  updated.status = computeActivityStatus(updated, nowIso);
  return updated;
}

export interface ActivityFilterCriteria {
  campus: string;
  subCampus?: string;
  category: ActivityCategory;
  keyword: string;
  timeRange: TimeRangeFilter;
  statusFilter: StatusFilter;
}

export function filterActivities(
  activities: Activity[],
  criteria: ActivityFilterCriteria,
  nowIso: string
): Activity[] {
  const now = new Date(nowIso);
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const endOfToday = startOfToday + 24 * 60 * 60 * 1000 - 1;
  const endOfWeek = startOfToday + 7 * 24 * 60 * 60 * 1000;
  const endOfMonth = startOfToday + 31 * 24 * 60 * 60 * 1000;

  const q = criteria.keyword.trim().toLowerCase();

  return activities.filter((act) => {
    // Do not show unapproved drafts in public discovery lists
    if (act.reviewStatus && act.reviewStatus !== 'approved' && act.reviewStatus !== 'ended') {
      return false;
    }

    if (criteria.campus && act.campus !== criteria.campus) {
      return false;
    }

    if (
      criteria.subCampus &&
      criteria.subCampus !== '全部校区' &&
      act.subCampus &&
      act.subCampus !== criteria.subCampus
    ) {
      return false;
    }

    if (criteria.category !== '全部' && act.category !== criteria.category) {
      return false;
    }

    if (q) {
      const hay = `${act.title} ${act.description} ${act.location} ${act.subCampus || ''} ${act.organizer} ${act.category}`.toLowerCase();
      if (!hay.includes(q)) {
        return false;
      }
    }

    const effectiveStatus = computeActivityStatus(act, nowIso);
    if (criteria.statusFilter !== 'all' && effectiveStatus !== criteria.statusFilter) {
      return false;
    }

    if (criteria.timeRange !== 'all') {
      const startMs = new Date(act.startTime).getTime();
      const endMs = new Date(act.endTime).getTime();
      if (criteria.timeRange === 'today') {
        const overlapsToday = startMs <= endOfToday && endMs >= startOfToday;
        if (!overlapsToday) return false;
      } else if (criteria.timeRange === 'week') {
        const overlapsWeek = startMs <= endOfWeek && endMs >= startOfToday - 2 * 24 * 60 * 60 * 1000;
        if (!overlapsWeek) return false;
      } else if (criteria.timeRange === 'month') {
        const overlapsMonth = startMs <= endOfMonth && endMs >= startOfToday - 30 * 24 * 60 * 60 * 1000;
        if (!overlapsMonth) return false;
      }
    }

    return true;
  });
}

export function getMyRegistrationPhase(
  activity: Activity,
  nowIso: string
): 'upcoming' | 'ongoing' | 'ended' {
  const now = new Date(nowIso).getTime();
  const start = new Date(activity.startTime).getTime();
  const end = new Date(activity.endTime).getTime();
  if (now > end || activity.status === 'ended') {
    return 'ended';
  }
  if (now >= start && now <= end) {
    return 'ongoing';
  }
  return 'upcoming';
}

export function validatePublishForm(form: PublishFormData): {
  valid: boolean;
  errors: Partial<Record<keyof PublishFormData, string>>;
} {
  const errors: Partial<Record<keyof PublishFormData, string>> = {};

  if (!form.title.trim()) errors.title = '请填写活动名称';
  if (!form.cover.trim()) errors.cover = '请选择或上传活动封面';
  if (!form.category) errors.category = '请选择活动分类';
  if (!form.description.trim() || form.description.trim().length < 10) {
    errors.description = '请填写不少于 10 个字的活动介绍';
  }
  if (!form.startDate || !form.startClock) errors.startDate = '请设置活动开始时间';
  if (!form.endDate || !form.endClock) errors.endDate = '请设置活动结束时间';
  if (!form.regStartDate || !form.regStartClock) errors.regStartDate = '请设置报名开始时间';
  if (!form.regDeadlineDate || !form.regDeadlineClock) errors.regDeadlineDate = '请设置报名截止时间';
  if (!form.location.trim()) errors.location = '请填写活动地点';
  if (!form.organizer.trim()) errors.organizer = '请填写主办方名称';

  const capNum = Number(form.capacity);
  if (!form.capacity || Number.isNaN(capNum) || capNum < 1 || capNum > 10000) {
    errors.capacity = '请输入有效的人数上限（1-10000）';
  }

  if (!form.requirementsText.trim()) errors.requirementsText = '请填写参与要求';
  if (!form.contact.trim()) errors.contact = '请填写联系方式';

  if (form.startDate && form.startClock && form.endDate && form.endClock) {
    const startMs = new Date(`${form.startDate}T${form.startClock}:00`).getTime();
    const endMs = new Date(`${form.endDate}T${form.endClock}:00`).getTime();
    if (endMs <= startMs) {
      errors.endDate = '活动结束时间必须晚于开始时间';
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function formatDateTimeRange(startIso: string, endIso: string): string {
  const s = new Date(startIso);
  const e = new Date(endIso);
  const pad = (n: number) => String(n).padStart(2, '0');
  const sMonth = pad(s.getMonth() + 1);
  const sDay = pad(s.getDate());
  const sTime = `${pad(s.getHours())}:${pad(s.getMinutes())}`;
  const eMonth = pad(e.getMonth() + 1);
  const eDay = pad(e.getDate());
  const eTime = `${pad(e.getHours())}:${pad(e.getMinutes())}`;

  if (sMonth === eMonth && sDay === eDay) {
    return `${sMonth}月${sDay}日 ${sTime} - ${eTime}`;
  }
  return `${sMonth}月${sDay}日 ${sTime} - ${eMonth}月${eDay}日 ${eTime}`;
}

export function formatShortDate(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, '0');
  const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  return `${pad(d.getMonth() + 1)}月${pad(d.getDate())}日 ${weekDays[d.getDay()]} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function toggleJoinBuddyPost(
  post: import('../types/activity').BuddyPost,
  userName: string
): import('../types/activity').BuddyPost {
  if (post.isMine) {
    // Creator cannot leave their own post via toggleJoin
    return post;
  }
  if (post.isJoined) {
    const nextParticipants = post.participants.filter((p) => p !== userName);
    return {
      ...post,
      isJoined: false,
      currentCount: Math.max(1, post.currentCount - 1),
      participants: nextParticipants,
    };
  }
  if (post.currentCount >= post.maxCount) {
    return post;
  }
  return {
    ...post,
    isJoined: true,
    currentCount: Math.min(post.maxCount, post.currentCount + 1),
    participants: post.participants.includes(userName)
      ? post.participants
      : [...post.participants, userName],
  };
}

export interface BuddyFilterCriteria {
  campus: string;
  subCampus?: string;
  tag?: import('../types/activity').BuddyTag | '全部';
  keyword?: string;
  onlyOpen?: boolean;
}

export function filterBuddyPosts(
  posts: import('../types/activity').BuddyPost[],
  criteria: BuddyFilterCriteria
): import('../types/activity').BuddyPost[] {
  const q = (criteria.keyword || '').trim().toLowerCase();

  return posts.filter((post) => {
    if (criteria.campus && post.campus !== criteria.campus) {
      return false;
    }
    if (
      criteria.subCampus &&
      criteria.subCampus !== '全部校区' &&
      post.subCampus !== criteria.subCampus
    ) {
      return false;
    }
    if (criteria.tag && criteria.tag !== '全部' && post.tag !== criteria.tag) {
      return false;
    }
    if (criteria.onlyOpen && post.currentCount >= post.maxCount) {
      return false;
    }
    if (q) {
      const hay = `${post.title} ${post.description} ${post.activityTitle} ${post.authorName} ${post.authorDepartment} ${post.meetingPoint} ${post.subCampus} ${post.tag}`.toLowerCase();
      if (!hay.includes(q)) {
        return false;
      }
    }
    return true;
  });
}

export const ALL_INTEREST_PREFERENCES: import('../types/activity').InterestPreference[] = [
  '艺术',
  '体育',
  '讲座',
  '音乐',
  '竞赛',
  '社团',
];

export function inferActivityInterestTags(
  act: Pick<Activity, 'title' | 'description' | 'category' | 'cover' | 'organizer'>
): import('../types/activity').InterestPreference[] {
  const tags = new Set<import('../types/activity').InterestPreference>();
  const text = `${act.title} ${act.description} ${act.organizer}`;

  // 1. Primary category mapping first so each activity has an unambiguous primary domain
  if (act.category === '讲座') {
    tags.add('讲座');
  } else if (act.category === '展览') {
    tags.add('艺术');
  } else if (act.category === '比赛') {
    if (/设计|美术|插画|摄影|文创|美学/.test(text)) {
      tags.add('艺术');
    }
    tags.add('竞赛');
  } else if (act.category === '社团') {
    if (/摄影|胶片|手作|插画|陶艺|艺术/.test(text)) {
      tags.add('艺术');
    }
    tags.add('社团');
  } else if (act.category === '文体') {
    if (
      act.cover === 'basketball' ||
      /篮球|羽毛球|飞盘|足球|体育|运动|球场|团体挑战赛/.test(text)
    ) {
      tags.add('体育');
    } else {
      tags.add('音乐');
      tags.add('艺术');
    }
  }

  // 2. Secondary keyword enrichment
  if (/摄影|设计|美术|古建|胶片|版画|插画|艺术|美学|文创|手作/.test(text)) {
    tags.add('艺术');
  }
  if (
    act.cover === 'basketball' ||
    /篮球|羽毛球|飞盘|足球|体育|运动|球场|团体挑战赛/.test(text)
  ) {
    tags.add('体育');
  }
  if (/讲座|论坛|沙龙|讲堂|学术|报告|测绘/.test(text)) {
    tags.add('讲座');
  }
  if (
    act.cover === 'music' ||
    act.cover === 'gala' ||
    /音乐|乐队|民谣|歌手|交响|晚会|合唱|弹唱/.test(text)
  ) {
    tags.add('音乐');
  }
  if (/大赛|辩论|争霸赛|挑战赛|竞赛|决赛/.test(text)) {
    tags.add('竞赛');
  }
  if (/市集|社团|协会|创客|嘉年华|俱乐部|暗房/.test(text)) {
    tags.add('社团');
  }

  return Array.from(tags);
}

export interface CuratedActivityRecommendation {
  activity: Activity;
  matchScore: number;
  primaryInterest?: import('../types/activity').InterestPreference;
  matchedInterests: import('../types/activity').InterestPreference[];
  matchBadge: string;
  matchReason: string;
}

export interface DailyCurationCriteria {
  campus: string;
  subCampus?: string;
  interests: import('../types/activity').InterestPreference[];
  department?: string;
  nowIso: string;
  limit?: number;
}

export function getDailyCuratedActivities(
  activities: Activity[],
  criteria: DailyCurationCriteria
): CuratedActivityRecommendation[] {
  const limit = criteria.limit ?? 3;
  const activeInterests = criteria.interests || [];
  const hasSpecificSubCampus =
    Boolean(criteria.subCampus) && criteria.subCampus !== '全部校区';

  // Filter approved public activities belonging to current university
  const pool = activities.filter(
    (act) =>
      act.campus === criteria.campus &&
      (!act.reviewStatus || act.reviewStatus === 'approved' || act.reviewStatus === 'ended')
  );

  // Score each activity
  const scored = pool.map((act) => {
    const status = computeActivityStatus(act, criteria.nowIso);
    const inferredTags = inferActivityInterestTags(act);
    const matchedInterests = activeInterests.filter((pref) => inferredTags.includes(pref));

    const isSubCampusMatch = hasSpecificSubCampus
      ? !act.subCampus || act.subCampus === criteria.subCampus
      : true;

    let rawScore = 0;

    // 1. Sub-campus affinity (strongest spatial filter)
    if (hasSpecificSubCampus) {
      rawScore += isSubCampusMatch ? 50 : 5;
    } else {
      rawScore += 30;
    }

    // 2. Interest preference match
    if (matchedInterests.length > 0) {
      rawScore += 35 + Math.min(12, (matchedInterests.length - 1) * 4);
    } else if (activeInterests.length === 0) {
      rawScore += 20;
    }

    // 3. Activity status liveliness (prefer open/upcoming over ended)
    if (status === 'open') rawScore += 24;
    else if (status === 'upcoming') rawScore += 15;
    else if (status === 'full') rawScore += 10;
    else if (status === 'closed') rawScore += 6;

    // 4. Department & popularity affinity
    if (
      criteria.department &&
      /建筑|软件|设计|信息|土木/.test(criteria.department) &&
      /建筑|设计|AI|数字|古建|工程/.test(`${act.title} ${act.description} ${act.organizer}`)
    ) {
      rawScore += 6;
    }
    if (act.isFeaturedOnHome) rawScore += 4;
    if (act.isHotOnHome) rawScore += 3;

    const matchScore = Math.min(99, Math.max(68, rawScore));

    return {
      act,
      status,
      inferredTags,
      matchedInterests,
      isSubCampusMatch,
      rawScore,
      matchScore,
    };
  });

  scored.sort((a, b) => b.rawScore - a.rawScore);

  const selected: CuratedActivityRecommendation[] = [];
  const usedIds = new Set<string>();

  const buildRecommendation = (
    item: (typeof scored)[number],
    preferredInterest?: import('../types/activity').InterestPreference
  ): CuratedActivityRecommendation => {
    const primaryInterest =
      preferredInterest && item.matchedInterests.includes(preferredInterest)
        ? preferredInterest
        : item.matchedInterests[0];

    const subCampusText = item.act.subCampus || '本校区';
    const matchBadge = primaryInterest
      ? `匹配「${primaryInterest}」偏好`
      : item.isSubCampusMatch && hasSpecificSubCampus
      ? `${subCampusText}精选`
      : '校园高热精选';

    const matchReason = primaryInterest
      ? `${subCampusText} · 契合你的「${primaryInterest}」兴趣画像`
      : `${subCampusText} · 近期高人气推荐`;

    return {
      activity: item.act,
      matchScore: item.matchScore,
      primaryInterest,
      matchedInterests: item.matchedInterests,
      matchBadge,
      matchReason,
    };
  };

  // Pass 1: Cover each of the user's selected interests across the top recommendations (preferring primary tag match first)
  for (const pref of activeInterests) {
    if (selected.length >= limit) break;
    const candidate =
      scored.find(
        (item) =>
          !usedIds.has(item.act.id) &&
          item.isSubCampusMatch &&
          item.inferredTags[0] === pref &&
          item.status !== 'ended'
      ) ||
      scored.find(
        (item) =>
          !usedIds.has(item.act.id) &&
          item.isSubCampusMatch &&
          item.matchedInterests.includes(pref) &&
          item.status !== 'ended'
      ) ||
      scored.find(
        (item) =>
          !usedIds.has(item.act.id) &&
          item.isSubCampusMatch &&
          item.matchedInterests.includes(pref)
      );

    if (candidate) {
      usedIds.add(candidate.act.id);
      selected.push(buildRecommendation(candidate, pref));
    }
  }

  // Pass 2: Fill remaining slots from highest-scoring sub-campus matches
  for (const item of scored) {
    if (selected.length >= limit) break;
    if (!usedIds.has(item.act.id) && item.isSubCampusMatch) {
      usedIds.add(item.act.id);
      selected.push(buildRecommendation(item));
    }
  }

  // Pass 3: Fallback if the sub-campus has fewer than `limit` total activities
  for (const item of scored) {
    if (selected.length >= limit) break;
    if (!usedIds.has(item.act.id)) {
      usedIds.add(item.act.id);
      selected.push(buildRecommendation(item));
    }
  }

  return selected;
}


```

## src/utils/activityRules.test.ts
```ts
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  applyRegistration,
  canUserRegister,
  computeActivityStatus,
  filterActivities,
  getPrimaryActionLabel,
  getStatusLabel,
  validatePublishForm,
} from './activityRules';
import { Activity, PublishFormData } from '../types/activity';

const REF_NOW = '2026-11-03T14:00:00';

function makeBaseActivity(overrides: Partial<Activity> = {}): Activity {
  return {
    id: 'act-test-1',
    title: '校园音乐节',
    cover: 'music',
    category: '文体',
    description: '一年一度的草坪校园音乐节，欢迎全校同学参与。',
    startTime: '2026-11-06T18:30:00',
    endTime: '2026-11-06T21:30:00',
    registrationStartTime: '2026-10-28T09:00:00',
    registrationDeadline: '2026-11-06T12:00:00',
    location: '清远校区南区中心草坪',
    organizer: '校学生会文艺部',
    organizerInfo: '广东建设职业技术学院校团委指导学生组织',
    capacity: 150,
    registeredCount: 80,
    status: 'open',
    favorite: false,
    campus: '广东建设职业技术学院',
    schedule: [],
    requirements: ['需携带校园卡入场'],
    contact: '李同学 13800138000',
    ...overrides,
  };
}

test('computeActivityStatus enforces all 5 status priority rules accurately', () => {
  // Rule 1: Ended takes highest priority even if capacity is full
  const endedAct = makeBaseActivity({
    startTime: '2026-10-20T14:00:00',
    endTime: '2026-10-20T17:00:00',
    registrationDeadline: '2026-10-19T18:00:00',
    registeredCount: 150,
    capacity: 150,
  });
  assert.equal(computeActivityStatus(endedAct, REF_NOW), 'ended');
  assert.equal(getStatusLabel('ended'), '已结束');
  assert.equal(getPrimaryActionLabel('ended'), '活动已结束');

  // Rule 2: Registration deadline passed but event not ended -> closed
  const closedAct = makeBaseActivity({
    startTime: '2026-11-04T19:00:00',
    endTime: '2026-11-04T21:00:00',
    registrationStartTime: '2026-10-25T09:00:00',
    registrationDeadline: '2026-11-02T23:59:00',
    registeredCount: 90,
    capacity: 150,
  });
  assert.equal(computeActivityStatus(closedAct, REF_NOW), 'closed');
  assert.equal(getStatusLabel('closed'), '报名已截止');
  assert.equal(getPrimaryActionLabel('closed'), '报名已截止');

  // Rule 3: Capacity reached -> full
  const fullAct = makeBaseActivity({
    registeredCount: 150,
    capacity: 150,
  });
  assert.equal(computeActivityStatus(fullAct, REF_NOW), 'full');
  assert.equal(getStatusLabel('full'), '报名已满');
  assert.equal(getPrimaryActionLabel('full'), '报名已满');

  // Rule 4: Registration not yet started -> upcoming
  const upcomingAct = makeBaseActivity({
    registrationStartTime: '2026-11-08T09:00:00',
    registrationDeadline: '2026-11-15T18:00:00',
    startTime: '2026-11-16T19:00:00',
    endTime: '2026-11-16T21:00:00',
    registeredCount: 0,
  });
  assert.equal(computeActivityStatus(upcomingAct, REF_NOW), 'upcoming');
  assert.equal(getStatusLabel('upcoming'), '即将开放');
  assert.equal(getPrimaryActionLabel('upcoming'), '暂未开放');

  // Rule 5: Open and spots available -> open
  const openAct = makeBaseActivity();
  assert.equal(computeActivityStatus(openAct, REF_NOW), 'open');
  assert.equal(getStatusLabel('open'), '报名中');
  assert.equal(getPrimaryActionLabel('open'), '立即报名');
});

test('applyRegistration increments registeredCount, prevents exceeding capacity, and transitions to full at limit', () => {
  const actNearFull = makeBaseActivity({
    capacity: 150,
    registeredCount: 149,
  });

  const checkBefore = canUserRegister(actNearFull, REF_NOW);
  assert.equal(checkBefore.allowed, true);

  const afterReg = applyRegistration(
    actNearFull,
    {
      attendeeName: '林晓阳',
      studentId: '2024081106',
      phone: '13922334455',
      department: '建筑信息工程学院',
    },
    REF_NOW
  );

  assert.equal(afterReg.registeredCount, 150);
  assert.equal(afterReg.isRegistered, true);
  assert.equal(afterReg.status, 'full');
  assert.equal(afterReg.registrationRecord?.attendeeName, '林晓阳');

  // Attempting to register again or on a full event is blocked
  const checkAfter = canUserRegister(afterReg, REF_NOW);
  assert.equal(checkAfter.allowed, false);
});

test('filterActivities filters by campus, category, keyword, and status accurately', () => {
  const list: Activity[] = [
    makeBaseActivity({ id: '1', title: '校园音乐节', category: '文体', subCampus: '清远校区', registeredCount: 80 }),
    makeBaseActivity({
      id: '2',
      title: '校园摄影展',
      category: '展览',
      subCampus: '清远校区',
      startTime: '2026-10-10T10:00:00',
      endTime: '2026-10-18T18:00:00',
      registrationDeadline: '2026-10-18T12:00:00',
    }),
    makeBaseActivity({
      id: '3',
      title: '创意市集',
      category: '社团',
      subCampus: '广州校区',
      registeredCount: 150,
      capacity: 150,
    }),
    makeBaseActivity({
      id: '4',
      title: '跨校讲座',
      category: '讲座',
      campus: '华南理工大学',
      subCampus: '大学城校区',
    }),
  ];

  const byCampus = filterActivities(
    list,
    {
      campus: '广东建设职业技术学院',
      subCampus: '全部校区',
      category: '全部',
      keyword: '',
      timeRange: 'all',
      statusFilter: 'all',
    },
    REF_NOW
  );
  assert.equal(byCampus.length, 3);

  const bySubCampusGz = filterActivities(
    list,
    {
      campus: '广东建设职业技术学院',
      subCampus: '广州校区',
      category: '全部',
      keyword: '',
      timeRange: 'all',
      statusFilter: 'all',
    },
    REF_NOW
  );
  assert.equal(bySubCampusGz.length, 1);
  assert.equal(bySubCampusGz[0].id, '3');

  const byCategory = filterActivities(
    list,
    {
      campus: '广东建设职业技术学院',
      category: '社团',
      keyword: '',
      timeRange: 'all',
      statusFilter: 'all',
    },
    REF_NOW
  );
  assert.equal(byCategory.length, 1);
  assert.equal(byCategory[0].title, '创意市集');

  const byStatusFull = filterActivities(
    list,
    {
      campus: '广东建设职业技术学院',
      category: '全部',
      keyword: '',
      timeRange: 'all',
      statusFilter: 'full',
    },
    REF_NOW
  );
  assert.equal(byStatusFull.length, 1);
  assert.equal(byStatusFull[0].id, '3');
});

test('validatePublishForm validates required fields and date ordering', () => {
  const validForm: PublishFormData = {
    title: '秋季校园吉他弹唱会',
    cover: 'music',
    category: '文体',
    description: '带上你的吉他与热爱，在南区草坪一起弹唱青春民谣。',
    startDate: '2026-11-12',
    startClock: '19:00',
    endDate: '2026-11-12',
    endClock: '21:00',
    regStartDate: '2026-11-03',
    regStartClock: '12:00',
    regDeadlineDate: '2026-11-11',
    regDeadlineClock: '22:00',
    location: '南区灯光球场旁草坪',
    organizer: '吉他协会',
    capacity: '80',
    requirementsText: '本校在校学生均可报名，欢迎自带乐器。',
    contact: '陈同学 13612345678',
  };

  const okResult = validatePublishForm(validForm);
  assert.equal(okResult.valid, true);

  const badResult = validatePublishForm({
    ...validForm,
    title: '',
    capacity: '0',
    endDate: '2026-11-10',
  });
  assert.equal(badResult.valid, false);
  assert.ok(badResult.errors.title);
  assert.ok(badResult.errors.capacity);
  assert.ok(badResult.errors.endDate);
});

test('toggleJoinBuddyPost and filterBuddyPosts handle buddy recruitment accurately', async () => {
  const { toggleJoinBuddyPost, filterBuddyPosts } = await import('./activityRules');
  const samplePost: import('../types/activity').BuddyPost = {
    id: 'b-1',
    activityId: 'act-music-2026',
    activityTitle: '校园音乐节',
    activityStartTime: '2026-11-06T18:30:00',
    campus: '广东建设职业技术学院',
    subCampus: '清远校区',
    authorName: '陈梓轩',
    authorDepartment: '土木工程学院',
    authorGrade: '2024级',
    tag: '同去现场',
    title: '草坪前排听摇滚找2个搭子',
    description: '带了野餐垫和荧光棒，一起去占前排位置合唱！',
    meetingPoint: '清远校区南区草坪西侧入口',
    maxCount: 3,
    currentCount: 2,
    participants: ['陈梓轩', '何嘉敏'],
    contactCode: '微信群口令：音乐节前排小分队',
    createdAt: '2026-11-03T10:00:00',
    isJoined: false,
  };

  // Join increments count and adds user
  const joined = toggleJoinBuddyPost(samplePost, '林晓阳');
  assert.equal(joined.isJoined, true);
  assert.equal(joined.currentCount, 3);
  assert.ok(joined.participants.includes('林晓阳'));

  // Leave decrements count and removes user
  const left = toggleJoinBuddyPost(joined, '林晓阳');
  assert.equal(left.isJoined, false);
  assert.equal(left.currentCount, 2);

  // Filter by subCampus and onlyOpen
  const posts = [
    samplePost,
    {
      ...samplePost,
      id: 'b-2',
      subCampus: '广州校区',
      tag: '组队参赛' as const,
      currentCount: 3,
      maxCount: 3,
    },
  ];

  const openOnly = filterBuddyPosts(posts, {
    campus: '广东建设职业技术学院',
    subCampus: '全部校区',
    onlyOpen: true,
  });
  assert.equal(openOnly.length, 1);
  assert.equal(openOnly[0].id, 'b-1');

  const gzOnly = filterBuddyPosts(posts, {
    campus: '广东建设职业技术学院',
    subCampus: '广州校区',
  });
  assert.equal(gzOnly.length, 1);
  assert.equal(gzOnly[0].id, 'b-2');
});

test('getDailyCuratedActivities recommends 3 activities matching sub-campus and interest preferences', async () => {
  const { getDailyCuratedActivities } = await import('./activityRules');
  const { INITIAL_ACTIVITIES, DEMO_NOW_ISO } = await import('../data/initialData');

  // 1. Qingyuan sub-campus with ['艺术', '体育', '讲座']
  const qyRecs = getDailyCuratedActivities(INITIAL_ACTIVITIES, {
    campus: '广东建设职业技术学院',
    subCampus: '清远校区',
    interests: ['艺术', '体育', '讲座'],
    department: '建筑信息工程学院 · 软件技术',
    nowIso: DEMO_NOW_ISO,
    limit: 3,
  });

  assert.equal(qyRecs.length, 3);
  assert.ok(qyRecs.every((r) => r.activity.subCampus === '清远校区'));
  assert.equal(qyRecs[0].primaryInterest, '艺术');
  assert.equal(qyRecs[1].primaryInterest, '体育');
  assert.equal(qyRecs[2].primaryInterest, '讲座');

  // 2. Guangzhou sub-campus with ['艺术', '体育', '讲座']
  const gzRecs = getDailyCuratedActivities(INITIAL_ACTIVITIES, {
    campus: '广东建设职业技术学院',
    subCampus: '广州校区',
    interests: ['艺术', '体育', '讲座'],
    department: '建筑信息工程学院 · 软件技术',
    nowIso: DEMO_NOW_ISO,
    limit: 3,
  });

  assert.equal(gzRecs.length, 3);
  assert.ok(gzRecs.every((r) => r.activity.subCampus === '广州校区'));
  assert.equal(gzRecs[0].primaryInterest, '艺术');
  assert.equal(gzRecs[1].primaryInterest, '体育');
  assert.equal(gzRecs[2].primaryInterest, '讲座');
});


```

## src/data/initialData.ts
```ts
import { Activity, CampusInfo, UserProfile } from '../types/activity';

export const DEFAULT_CAMPUS = '广东建设职业技术学院';
export const DEFAULT_SUB_CAMPUS = '全部校区';

// Fixed reference timestamp matching current environment date (2026-11-03T14:00:00)
export const DEMO_NOW_ISO = '2026-11-03T14:00:00';

export const CAMPUS_LIST: CampusInfo[] = [
  {
    id: 'gdcvi',
    name: '广东建设职业技术学院',
    shortName: '广建院',
    city: '清远 / 广州',
    district: '清远校区 · 广州校区',
    subCampuses: ['清远校区', '广州校区'],
    activeCount: 10,
    studentCountText: '1.8万+ 在校同学正在使用',
    weatherText: '11月3日 周二 · 晴 24°C',
  },
  {
    id: 'scut',
    name: '华南理工大学',
    shortName: '华工',
    city: '广州',
    district: '大学城校区 · 五山校区 · 国际校区',
    subCampuses: ['大学城校区', '五山校区', '国际校区'],
    activeCount: 5,
    studentCountText: '3.2万+ 在校同学正在使用',
    weatherText: '11月3日 周二 · 晴 25°C',
  },
  {
    id: 'gdut',
    name: '广东工业大学',
    shortName: '广工',
    city: '广州',
    district: '大学城校区 · 龙洞校区 · 东风路校区',
    subCampuses: ['大学城校区', '龙洞校区', '东风路校区'],
    activeCount: 4,
    studentCountText: '2.9万+ 在校同学正在使用',
    weatherText: '11月3日 周二 · 多云 24°C',
  },
  {
    id: 'gafa',
    name: '广州美术学院',
    shortName: '广美',
    city: '广州',
    district: '大学城校区 · 昌岗校区',
    subCampuses: ['大学城校区', '昌岗校区'],
    activeCount: 4,
    studentCountText: '1.1万+ 在校同学正在使用',
    weatherText: '11月3日 周二 · 晴 25°C',
  },
  {
    id: 'szpu',
    name: '深圳职业技术大学',
    shortName: '深职大',
    city: '深圳',
    district: '西丽湖校区 · 留仙洞校区 · 官龙山校区',
    subCampuses: ['西丽湖校区', '留仙洞校区', '官龙山校区'],
    activeCount: 4,
    studentCountText: '2.6万+ 在校同学正在使用',
    weatherText: '11月3日 周二 · 晴 26°C',
  },
];

export const INITIAL_USER_PROFILE: UserProfile = {
  nickname: '林晓阳',
  studentId: '2024081106',
  department: '建筑信息工程学院 · 软件技术',
  grade: '2024级',
  phone: '13826048819',
  bio: '热爱校园摄影与乐队现场，周末常驻南区草坪与图书馆。',
  campus: DEFAULT_CAMPUS,
  subCampus: '清远校区',
  interests: ['艺术', '体育', '讲座'],
  notificationsEnabled: true,
  calendarSyncEnabled: true,
};

export const INITIAL_ACTIVITIES: Activity[] = [
  // 1. 校园音乐节 —— 状态 A：报名中（清远校区）
  {
    id: 'act-music-2026',
    title: '校园音乐节',
    cover: 'music',
    category: '文体',
    description:
      '秋夜晚风与草坪灯火交织，广东建设职业技术学院第十四届「声浪与星河」校园草坪音乐节热力开唱！特邀校内六大独立学生乐队、十佳歌手冠军及街舞社同台演出，现场设有荧光手环领取点与弹幕互动大屏，邀你一起在草坪上合唱青春。',
    startTime: '2026-11-06T18:30:00',
    endTime: '2026-11-06T21:30:00',
    registrationStartTime: '2026-10-25T09:00:00',
    registrationDeadline: '2026-11-06T16:00:00',
    location: '清远校区南区中心草坪',
    organizer: '校团委文艺部 · 大学生艺术团',
    organizerInfo: '广东建设职业技术学院官方学生文艺组织，连续十四年承办校级迎新与草坪音乐节。',
    capacity: 150,
    registeredCount: 80,
    status: 'open',
    favorite: true,
    campus: '广东建设职业技术学院',
    subCampus: '清远校区',
    isFeaturedOnHome: true,
    isHotOnHome: true,
    isStartingSoonOnHome: true,
    schedule: [
      { time: '18:00 - 18:30', title: '观众签到入场', detail: '在南区草坪入口签到并领取荧光手环与节目单' },
      { time: '18:30 - 19:30', title: '上半场：乐队不插电民谣专场', detail: '木吉他协会与飞行岛乐队带来校园原创民谣串烧' },
      { time: '19:30 - 20:45', title: '下半场：摇滚与街舞燃炸舞台', detail: '棱镜回声乐队 & 热舞社联袂演出，开启全场合唱' },
      { time: '20:45 - 21:30', title: '星光大合唱与合影留念', detail: '全场合唱《夜空中最亮的星》，拍摄大合照' },
    ],
    requirements: [
      '限本校在校学生报名，入场请出示本人校园卡签到',
      '请爱护草坪环境，现场禁止携带明火及玻璃瓶装饮品',
      '如遇降雨天气将顺延至体育馆二楼主场馆举行，届时将短信通知',
    ],
    contact: '苏同学 13826019920（企业微信同号）',
  },

  // 2. 篮球友谊赛 —— 状态 A：报名中（清远校区）
  {
    id: 'act-basketball-2026',
    title: '篮球友谊赛',
    cover: 'basketball',
    category: '文体',
    description:
      '建筑信息工程学院 VS 土木工程学院秋季篮球友谊交流赛火热开打！无论你是想作为替补球员登场切磋，还是加入场边啦啦队与中场三分球投篮挑战赛赢取定制运动水壶，都可以立即报名参与。',
    startTime: '2026-11-03T16:30:00',
    endTime: '2026-11-03T19:00:00',
    registrationStartTime: '2026-10-28T08:00:00',
    registrationDeadline: '2026-11-03T16:00:00',
    location: '清远校区北区灯光篮球场 1号场',
    organizer: '校篮球协会 · 体育部',
    organizerInfo: '广建院五星级体育社团，每周组织院系联赛、路人王单挑赛与裁判培训。',
    capacity: 120,
    registeredCount: 86,
    status: 'open',
    favorite: false,
    campus: '广东建设职业技术学院',
    subCampus: '清远校区',
    isOngoingOnHome: true,
    isHotOnHome: true,
    isRegistered: true,
    registrationRecord: {
      registeredAt: '2026-11-01T10:20:00',
      attendeeName: '林晓阳',
      studentId: '2024081106',
      phone: '13826048819',
      department: '建筑信息工程学院 · 软件技术',
      note: '参与中场三分球趣味投篮互动',
    },
    schedule: [
      { time: '16:15 - 16:30', title: '签到与热身检录', detail: '观众与互动选手在 1号球场记分台签到领取饮用水' },
      { time: '16:30 - 17:30', title: '上半场正赛对决', detail: '建信学院代表队 VS 土木学院代表队前两节较量' },
      { time: '17:30 - 17:50', title: '中场三分球大赛', detail: '报名观众可上场挑战 60 秒定点投篮，赢取纪念篮球' },
      { time: '17:50 - 19:00', title: '下半场决胜与颁奖', detail: '决出本场 MVP 并颁发友谊赛奖杯' },
    ],
    requirements: [
      '观赛及参与中场互动同学请穿运动鞋进入塑胶场地',
      '请文明观赛，服从现场裁判与工作人员引导',
    ],
    contact: '周队长 13922105581',
  },

  // 3. 校园设计大赛 —— 状态 A：报名中（广州校区）
  {
    id: 'act-design-2026',
    title: '校园设计大赛',
    cover: 'design',
    category: '比赛',
    description:
      '第七届「筑梦未来」校园空间与文创视觉设计大赛正式开启报名！涵盖校园公共微空间改造、广建院特色文创周边、数字界面交互三大赛道。优秀作品将获得校级创新学分认定、奖金扶持及图书馆一楼专题展出机会。',
    startTime: '2026-11-08T14:00:00',
    endTime: '2026-11-08T17:30:00',
    registrationStartTime: '2026-10-26T09:00:00',
    registrationDeadline: '2026-11-07T23:59:00',
    location: '广州校区艺术设计楼 302 创客路演厅',
    organizer: '建筑与艺术设计学院团总支',
    organizerInfo: '专注培养建筑美学、室内空间与数字视觉创新人才，搭建校企联合实训平台。',
    capacity: 100,
    registeredCount: 64,
    status: 'open',
    favorite: true,
    campus: '广东建设职业技术学院',
    subCampus: '广州校区',
    isFeaturedOnHome: true,
    isStartingSoonOnHome: true,
    isHotOnHome: true,
    schedule: [
      { time: '14:00 - 14:30', title: '大赛命题解析与往届金奖分享', detail: '指导老师详解三大赛道评分标准与制图规范' },
      { time: '14:30 - 16:30', title: '跨专业组队工作坊 & 方案快题指导', detail: '现场自由组队，导师一对一打磨草图方案' },
      { time: '16:30 - 17:30', title: '初赛路演抽签与答疑', detail: '确认作品提交格式与终评展板制作要求' },
    ],
    requirements: [
      '支持个人或 2-4 人跨学院组队参赛（清远与广州校区同学均可报名）',
      '请自备笔记本电脑或手绘草图本参与工作坊',
      '参赛作品须为本人原创，严禁抄袭或代做',
    ],
    contact: '陈老师 / 梁同学 13719083321',
  },

  // 4. 创意市集 —— 状态 B：报名已满（清远校区）
  {
    id: 'act-market-2026',
    title: '创意市集',
    cover: 'market',
    category: '社团',
    description:
      '「秋日奇遇」校园林荫创意手作市集！汇聚陶艺社、插画社、汉服社、咖啡文化社等 36 个学生主理摊位，现场提供手工流体熊制作、校园建筑明信片盖章、手冲咖啡品鉴与旧书盲盒交换。',
    startTime: '2026-11-03T12:00:00',
    endTime: '2026-11-05T20:00:00',
    registrationStartTime: '2026-10-20T09:00:00',
    registrationDeadline: '2026-11-05T12:00:00',
    location: '清远校区图书馆前银杏林荫大道',
    organizer: '学生社团联合会',
    organizerInfo: '统筹全校 68 个注册学生社团，打造多元活力的校园社团文化名片。',
    capacity: 150,
    registeredCount: 150,
    status: 'full',
    favorite: true,
    campus: '广东建设职业技术学院',
    subCampus: '清远校区',
    isOngoingOnHome: true,
    isHotOnHome: true,
    isRegistered: true,
    registrationRecord: {
      registeredAt: '2026-10-27T19:15:00',
      attendeeName: '林晓阳',
      studentId: '2024081106',
      phone: '13826048819',
      department: '建筑信息工程学院 · 软件技术',
      note: '已预约校园建筑套色印章集章卡',
    },
    schedule: [
      { time: '12:00 - 14:30', title: '午间开市 & 集章卡派发', detail: '前 150 名预约同学签到领取限定集章册与手作体验券' },
      { time: '14:30 - 17:30', title: '社团手作工坊体验', detail: '陶艺彩绘、植物拓印帆布袋及旧书盲盒互换' },
      { time: '17:30 - 20:00', title: '暮色灯串夜市与街头吉他弹唱', detail: '林荫道亮灯，开启夜间漫步交流' },
    ],
    requirements: [
      '手作体验名额（150人）目前已满额，未预约同学仍可自由前往市集逛展消费',
      '请自备环保袋，共同维护林荫道整洁',
    ],
    contact: '社联林同学 15918726630',
  },

  // 5. 校园摄影展 —— 状态 D：活动已结束（清远校区）
  {
    id: 'act-photo-2026',
    title: '校园摄影展',
    cover: 'photo',
    category: '展览',
    description:
      '「定格广建的四时晨昏」2026 秋季校园纪实与建筑光影摄影展。精选全校师生投稿的 120 幅胶片与数码摄影佳作，分为「清晨早八路」「实训工坊之光」「落日球场」「宿舍人间烟火」四大展区。',
    startTime: '2026-10-18T09:00:00',
    endTime: '2026-10-28T18:00:00',
    registrationStartTime: '2026-10-10T09:00:00',
    registrationDeadline: '2026-10-27T18:00:00',
    location: '清远校区图书馆一楼阳光展厅',
    organizer: '青年摄影协会 · 党委宣传部',
    organizerInfo: '用镜头记录校园变迁与青春面孔，定期举办暗房冲洗、人像外拍与年度摄影大展。',
    capacity: 150,
    registeredCount: 150,
    status: 'ended',
    favorite: false,
    campus: '广东建设职业技术学院',
    subCampus: '清远校区',
    isRegistered: true,
    registrationRecord: {
      registeredAt: '2026-10-16T15:40:00',
      attendeeName: '林晓阳',
      studentId: '2024081106',
      phone: '13826048819',
      department: '建筑信息工程学院 · 软件技术',
      note: '已签到并领取展览纪念明信片套装',
    },
    schedule: [
      { time: '09:00 - 12:00', title: '自由观展与语音导览', detail: '扫描画框旁导览卡即可收听摄影师创作故事' },
      { time: '14:30 - 16:00', title: '策展人专场导览 & 胶片摄影沙龙', detail: '一等奖得主现场分享校园建筑构图与用光技巧' },
      { time: '16:00 - 18:00', title: '观众投票与明信片加盖纪念章', detail: '票选「我最喜爱的校园瞬间」人气作品' },
    ],
    requirements: [
      '展厅内请保持安静，请勿触摸装裱画芯',
      '欢迎拍照打卡分享，但请关闭闪光灯',
    ],
    contact: '摄影协会赵同学 13580429110',
    recap: {
      summary:
        '为期 10 天的「定格广建的四时晨昏」校园摄影展圆满落幕，累计吸引 150 位预约导览同学及逾千名师生驻足观展。建筑工程系张同学拍摄的《实训楼的晚霞》获评最具人气作品。',
      highlights: [
        '共展出 120 幅精选师生摄影作品，派发纪念明信片 600 余套',
        '举办 3 场校园建筑摄影构图沙龙，现场交流气氛热烈',
        '全部获奖作品已收录至图书馆数字影像馆长期保存',
      ],
      attendeeFeedback: [
        {
          user: '林晓阳',
          department: '建筑信息工程学院',
          comment: '看到好多熟悉的教学楼和球场角落被拍得这么有电影感，明信片非常精致！',
        },
        {
          user: '何诗雨',
          department: '建筑与艺术设计学院',
          comment: '策展导览干货满满，学到了很多建筑几何光影的抓拍技巧。',
        },
      ],
    },
  },

  // 6. 学术讲座 —— 状态 D：活动已结束（广州校区）
  {
    id: 'act-lecture-2026',
    title: '学术讲座',
    cover: 'lecture',
    category: '讲座',
    description:
      '【建院名师大讲堂第 42 期】绿色智能建造与 BIM 数字孪生工程实践。特邀国家级装配式建筑专家与校友总工程师返校开讲，深入剖析智能建造在湾区大型地标工程中的落地应用与大学生职业发展路径。',
    startTime: '2026-10-25T14:30:00',
    endTime: '2026-10-25T17:00:00',
    registrationStartTime: '2026-10-15T09:00:00',
    registrationDeadline: '2026-10-24T22:00:00',
    location: '广州校区行政楼一楼学术报告厅',
    organizer: '教务处 · 土木工程学院',
    organizerInfo: '广东建设职业技术学院学术交流中心，致力于引入行业前沿技术与校企导师资源。',
    capacity: 150,
    registeredCount: 150,
    status: 'ended',
    favorite: false,
    campus: '广东建设职业技术学院',
    subCampus: '广州校区',
    schedule: [
      { time: '14:00 - 14:30', title: '考勤签到入场', detail: '刷校园卡签到，计入第二课堂学术讲座学时' },
      { time: '14:30 - 16:15', title: '主题报告：BIM 与智能建造新趋势', detail: '结合湾区超级工程案例解析数字化施工全流程' },
      { time: '16:15 - 17:00', title: '校友圆桌互动与就业规划答疑', detail: '现场解答实习投递、技能证书考取与专升本建议' },
    ],
    requirements: [
      '请提前 15 分钟入场完毕并将手机调至静音状态',
      '全程参与并完成签退可获 0.5 第二课堂素质拓展学分',
    ],
    contact: '土木学院科研办 020-36008802',
    recap: {
      summary:
        '本场讲座座无虚席，150 名同学全程参与。主讲嘉宾通过三维数字孪生实景演示，让同学们直观理解了智能建造如何重塑传统工程行业，现场互动提问超过 15 人次。',
      highlights: [
        '150 名报名同学全员完成第二课堂学时认证',
        '讲座配套课件与 BIM 学习路线图已同步至校内学习通专区',
      ],
      attendeeFeedback: [
        {
          user: '陈俊杰',
          department: '土木工程学院',
          comment: '师兄分享的施工现场数字化案例特别接地气，对大二实习方向清晰了很多！',
        },
      ],
    },
  },

  // 7. 校际华语辩论赛决赛观摩 —— 状态 C：报名已截止（清远校区）
  {
    id: 'act-debate-2026',
    title: '校际华语辩论赛决赛观摩',
    cover: 'debate',
    category: '比赛',
    description:
      '第十二届「建言杯」校园华语辩论赛巅峰总决赛！正反双方围绕「人工智能时代，通才比专才更具竞争力还是专才比通才更具竞争力」展开深度交锋，现场观众可参与最佳辩手大众评审投票。',
    startTime: '2026-11-04T19:00:00',
    endTime: '2026-11-04T21:15:00',
    registrationStartTime: '2026-10-22T09:00:00',
    registrationDeadline: '2026-11-02T22:00:00',
    location: '清远校区学生活动中心二楼多功能厅',
    organizer: '校辩论队 · 语言文化协会',
    organizerInfo: '曾获省高校辩论邀请赛四强，致力于培养青年大学生的逻辑思辨与公共表达能力。',
    capacity: 120,
    registeredCount: 108,
    status: 'closed',
    favorite: false,
    campus: '广东建设职业技术学院',
    subCampus: '清远校区',
    isStartingSoonOnHome: true,
    schedule: [
      { time: '18:30 - 19:00', title: '观众签到入场并领取表决器', detail: '对号入座，赛前印象票投递' },
      { time: '19:00 - 20:20', title: '冠军争夺战正赛', detail: '开篇立论、质询小结、自由辩论与总结陈词' },
      { time: '20:20 - 21:15', title: '评委奇袭点评与颁奖盛典', detail: '揭晓总冠军队伍及全程最佳辩手' },
    ],
    requirements: [
      '大众评审席位报名已于 11月2日 22:00 截止',
      '比赛进行期间请勿随意走动或大声喧哗',
    ],
    contact: '辩论队吴同学 13602914472',
  },

  // 8. 星光迎新晚会节目海选及观摩 —— 状态 E：未开放报名（广州校区）
  {
    id: 'act-gala-2026',
    title: '星光迎新晚会节目海选及观摩',
    cover: 'gala',
    category: '文体',
    description:
      '2026 年度「筑梦新程」大型迎新晚会节目公开海选与大众评审招募！涵盖声乐、器乐、街舞、民族舞、相声小品与创意光影秀，报名通道将于 11月8日 上午 09:00 正式开启，敬请期待。',
    startTime: '2026-11-18T18:30:00',
    endTime: '2026-11-18T21:30:00',
    registrationStartTime: '2026-11-08T09:00:00',
    registrationDeadline: '2026-11-16T18:00:00',
    location: '广州校区大礼堂主舞台',
    organizer: '校团委 · 校学生会',
    organizerInfo: '广东建设职业技术学院校级大型晚会筹备组。',
    capacity: 200,
    registeredCount: 0,
    status: 'upcoming',
    favorite: false,
    campus: '广东建设职业技术学院',
    subCampus: '广州校区',
    isStartingSoonOnHome: true,
    schedule: [
      { time: '18:30 - 19:45', title: '歌舞类节目舞台联排竞演', detail: '灯光音响全要素合成展示' },
      { time: '19:45 - 21:00', title: '语言类及器乐类节目展示', detail: '导演组与大众评审现场打分' },
      { time: '21:00 - 21:30', title: '公布晋级正式晚会节目名单', detail: '入选节目进入终极彩排阶段' },
    ],
    requirements: [
      '报名通道将于 11月08日 09:00 准时开放，可提前点击左下角收藏关注',
      '节目参演同学需自备伴奏音频（WAV/MP3 格式）',
    ],
    contact: '校学生会文娱部 13802887615',
  },

  // 9. 广府传统建筑木构模型展与工坊 —— 状态 A：报名中（广州校区特色活动）
  {
    id: 'act-gz-arch-2026',
    title: '广府古建筑测绘与榫卯模型展',
    cover: 'photo',
    category: '展览',
    description:
      '广州校区古建筑保护协会年度特展！展出陈家祠、余荫山房等岭南古建筑测绘手稿与 1:20 纯手工榫卯斗拱木构模型，现场每天开放两场鲁班锁与斗拱拆装互动体验。',
    startTime: '2026-11-03T10:00:00',
    endTime: '2026-11-07T18:00:00',
    registrationStartTime: '2026-10-26T09:00:00',
    registrationDeadline: '2026-11-07T12:00:00',
    location: '广州校区综合实训楼一楼展厅',
    organizer: '古建筑保护协会 · 建筑工程系',
    organizerInfo: '广州校区特色专业社团，专注于岭南传统建筑修缮与木作技艺传承。',
    capacity: 90,
    registeredCount: 52,
    status: 'open',
    favorite: false,
    campus: '广东建设职业技术学院',
    subCampus: '广州校区',
    isOngoingOnHome: true,
    isHotOnHome: true,
    schedule: [
      { time: '10:00 - 14:30', title: '古建测绘手稿与木构模型自由观展', detail: '配备专业解说员讲解岭南建筑三雕两塑一彩' },
      { time: '14:30 - 17:30', title: '榫卯斗拱亲手拼装体验工坊', detail: '分组完成一朵四铺作斗拱实体拼装挑战' },
    ],
    requirements: ['欢迎广州校区及清远校区跨区交流同学报名参与'],
    contact: '古建社何同学 13622889012',
  },

  // 10. AI 辅助建筑设计与数字美学讲座 —— 状态 A：报名中（清远校区讲座特色活动）
  {
    id: 'act-qy-lecture-2026',
    title: 'AI 辅助建筑设计与数字美学讲座',
    cover: 'lecture',
    category: '讲座',
    description:
      '聚焦生成式 AI 与参数化建模在现代建筑空间与视觉艺术设计中的前沿应用。特邀青年建筑师与数字艺术策展人现场演示工作流，并开放互动体验。',
    startTime: '2026-11-05T15:00:00',
    endTime: '2026-11-05T17:00:00',
    registrationStartTime: '2026-10-27T09:00:00',
    registrationDeadline: '2026-11-05T12:00:00',
    location: '清远校区信息楼一楼学术报告厅',
    organizer: '建筑信息工程学院 · 数字化设计研习社',
    organizerInfo: '专注 BIM、参数化建模与数字艺术跨界创新的学生学术组织。',
    capacity: 120,
    registeredCount: 78,
    status: 'open',
    favorite: false,
    campus: '广东建设职业技术学院',
    subCampus: '清远校区',
    isStartingSoonOnHome: true,
    schedule: [
      { time: '14:40 - 15:00', title: '签到入场与案例手册领取', detail: '刷校园卡签到，计入第二课堂学时' },
      { time: '15:00 - 16:30', title: '主题分享：从草图到数字空间生成', detail: '现场演示建筑概念生成与光影渲染技巧' },
      { time: '16:30 - 17:00', title: '互动问答与作品集点评', detail: '针对学生日常课程设计进行一对一建议' },
    ],
    requirements: ['对建筑美学、数字设计或 AI 工具感兴趣的同学均可报名'],
    contact: '研习社陈同学 13826057712',
  },

  // 11. 广州校区秋季羽毛球混合团体挑战赛 —— 状态 A：报名中（广州校区体育特色活动）
  {
    id: 'act-gz-badminton-2026',
    title: '秋季羽毛球混合团体挑战赛',
    cover: 'basketball',
    category: '文体',
    description:
      '广州校区羽毛球协会年度人气体育赛事！包含男双、女双、混双及趣味发球挑战赛，现场开放个人组队匹配与观赛互动抽奖，欢迎热爱羽毛球运动的同学挥拍上场。',
    startTime: '2026-11-06T16:00:00',
    endTime: '2026-11-06T19:00:00',
    registrationStartTime: '2026-10-26T09:00:00',
    registrationDeadline: '2026-11-06T12:00:00',
    location: '广州校区综合体育馆羽毛球场',
    organizer: '广州校区羽毛球协会 · 体育部',
    organizerInfo: '广州校区活力运动社团，每周组织球技切磋与院系交流赛。',
    capacity: 80,
    registeredCount: 54,
    status: 'open',
    favorite: false,
    campus: '广东建设职业技术学院',
    subCampus: '广州校区',
    isStartingSoonOnHome: true,
    schedule: [
      { time: '15:45 - 16:00', title: '参赛选手与互动观众检录', detail: '领取比赛号码布与运动能量饮品' },
      { time: '16:00 - 18:30', title: '混合团体小组循环赛与淘汰赛', detail: '双打项目精彩对决' },
      { time: '18:30 - 19:00', title: '趣味九宫格发球挑战与颁奖', detail: '赢取定制羽毛球拍手胶与纪念奖牌' },
    ],
    requirements: ['入场请穿无痕运动球鞋，可自带球拍或现场借用社团备用拍'],
    contact: '羽协刘同学 13719228840',
  },

  // --- 我的发布专属演示数据（覆盖：草稿、审核中、审核通过、审核未通过、已结束） ---
  {
    id: 'pub-approved-1',
    title: '周末校园胶片约拍与暗房体验',
    cover: 'photo',
    category: '社团',
    description:
      '由建筑信息工程学院摄影爱好者发起的周末胶片体验活动，一起用黑白胶卷记录校园老建筑，并在社团暗房亲手体验显影与定影全过程。',
    startTime: '2026-11-09T15:00:00',
    endTime: '2026-11-09T18:00:00',
    registrationStartTime: '2026-11-01T09:00:00',
    registrationDeadline: '2026-11-08T20:00:00',
    location: '清远校区学生活动中心 406 暗房工作室',
    organizer: '林晓阳 · 青年摄影协会',
    organizerInfo: '校摄影协会胶片小组发起人',
    capacity: 30,
    registeredCount: 19,
    status: 'open',
    favorite: false,
    campus: '广东建设职业技术学院',
    subCampus: '清远校区',
    isUserPublished: true,
    reviewStatus: 'approved',
    schedule: [
      { time: '15:00 - 16:20', title: '校园建筑黑白胶片实拍', detail: '分组在图书馆与实训楼周边取景拍摄' },
      { time: '16:20 - 18:00', title: '暗房冲卷与数码扫描分享', detail: '手把手教学显影液配比与底片冲洗' },
    ],
    requirements: ['无需自带胶片相机，社团提供 5 台公用机械单反及黑白胶卷'],
    contact: '林晓阳 13826048819',
  },
  {
    id: 'pub-pending-1',
    title: '前端开发与小程序实战夜校沙龙',
    cover: 'lecture',
    category: '讲座',
    description:
      '面向对 Web 前端与移动端小程序开发感兴趣的同学，分享如何从零搭建校园工具应用、组件化开发技巧以及参加省职业技能大赛的备赛经验。',
    startTime: '2026-11-14T19:00:00',
    endTime: '2026-11-14T21:00:00',
    registrationStartTime: '2026-11-04T09:00:00',
    registrationDeadline: '2026-11-13T22:00:00',
    location: '清远校区信息楼 504 创新机房',
    organizer: '林晓阳 · 开发者研习社',
    organizerInfo: '建筑信息工程学院学生技术交流社团',
    capacity: 60,
    registeredCount: 0,
    status: 'open',
    favorite: false,
    campus: '广东建设职业技术学院',
    subCampus: '清远校区',
    isUserPublished: true,
    reviewStatus: 'pending',
    schedule: [
      { time: '19:00 - 20:00', title: '校园移动端产品设计与拆解', detail: '现场演示交互原型与状态管理方案' },
      { time: '20:00 - 21:00', title: '自由结对编程与答疑', detail: '指导大一同学配置开发环境' },
    ],
    requirements: ['建议自备笔记本电脑，零基础同学亦可报名旁听'],
    contact: '林晓阳 13826048819',
  },
  {
    id: 'pub-draft-1',
    title: '秋日南区草坪飞盘新手体验赛',
    cover: 'basketball',
    category: '文体',
    description:
      '零门槛极限飞盘新手教学与 5v5 欢乐躲避盘友谊赛，帮助大家在下课后走出宿舍，认识不同院系的新朋友！',
    startTime: '2026-11-15T16:30:00',
    endTime: '2026-11-15T18:30:00',
    registrationStartTime: '2026-11-05T09:00:00',
    registrationDeadline: '2026-11-14T20:00:00',
    location: '清远校区南区足球场副场',
    organizer: '林晓阳 · 飞盘爱好者俱乐部',
    organizerInfo: '校园轻运动社群',
    capacity: 40,
    registeredCount: 0,
    status: 'open',
    favorite: false,
    campus: '广东建设职业技术学院',
    subCampus: '清远校区',
    isUserPublished: true,
    reviewStatus: 'draft',
    schedule: [
      { time: '16:30 - 17:15', title: '正反手传接盘基础教学', detail: '教练分组带练热身' },
      { time: '17:15 - 18:30', title: '分组趣味赛与合影', detail: '新手友好，不计胜负' },
    ],
    requirements: ['请穿着宽松运动服装及防滑运动鞋，自备饮用水'],
    contact: '林晓阳 13826048819',
  },
  {
    id: 'pub-rejected-1',
    title: '宿舍楼天台夜间露天观影会',
    cover: 'gala',
    category: '文体',
    description:
      '计划在周末晚间举办露天电影放映与影评交流活动，放映经典青春励志影片。',
    startTime: '2026-11-12T20:00:00',
    endTime: '2026-11-12T22:30:00',
    registrationStartTime: '2026-11-04T09:00:00',
    registrationDeadline: '2026-11-11T18:00:00',
    location: '清远校区南区学生公寓 6栋天台（待变更）',
    organizer: '林晓阳 · 光影电影社',
    organizerInfo: '校园电影文化爱好者社团',
    capacity: 50,
    registeredCount: 0,
    status: 'open',
    favorite: false,
    campus: '广东建设职业技术学院',
    subCampus: '清远校区',
    isUserPublished: true,
    reviewStatus: 'rejected',
    rejectReason: '场地安全提醒：宿舍楼天台夜间不具备大型集会安全条件，请将活动地点修改为「学生活动中心放映厅」或「南区小剧场」后重新提交。',
    schedule: [
      { time: '20:00 - 22:00', title: '正片放映', detail: '经典校园电影放映' },
      { time: '22:00 - 22:30', title: '映后映谈交流', detail: '自由分享观后感' },
    ],
    requirements: ['遵守场地管理规定，按时返回宿舍'],
    contact: '林晓阳 13826048819',
  },
  {
    id: 'pub-ended-1',
    title: '2026 新生校园摄影漫步打卡活动',
    cover: 'photo',
    category: '展览',
    description:
      '带领 2026 级大一新生边走边拍，熟悉清远校区图书馆、鲁班广场、中心湖与实训基地地标建筑。',
    startTime: '2026-10-12T15:00:00',
    endTime: '2026-10-12T17:30:00',
    registrationStartTime: '2026-10-05T09:00:00',
    registrationDeadline: '2026-10-11T22:00:00',
    location: '清远校区鲁班文化广场集合',
    organizer: '林晓阳 · 青年摄影协会',
    organizerInfo: '广建院青年摄影协会',
    capacity: 45,
    registeredCount: 45,
    status: 'ended',
    favorite: false,
    campus: '广东建设职业技术学院',
    subCampus: '清远校区',
    isUserPublished: true,
    reviewStatus: 'ended',
    schedule: [
      { time: '15:00 - 17:00', title: '校园地标漫步与构图教学', detail: '途经鲁班广场、图书馆、南区球场' },
      { time: '17:00 - 17:30', title: '返图评选与社团招新纪念品发放', detail: '现场打印优秀手机摄影作品' },
    ],
    requirements: ['手机或相机均可参与'],
    contact: '林晓阳 13826048819',
  },

  // --- 其他高校演示数据 ---
  {
    id: 'scut-music-1',
    title: '鲤工湖畔草坪交响音乐夜',
    cover: 'music',
    category: '文体',
    description: '华南理工大学艺术团交响乐团与流行乐队联袂呈现，在大学城校区湖畔草坪奏响秋日乐章。',
    startTime: '2026-11-07T19:00:00',
    endTime: '2026-11-07T21:30:00',
    registrationStartTime: '2026-10-28T09:00:00',
    registrationDeadline: '2026-11-07T12:00:00',
    location: '大学城校区中心湖畔大草坪',
    organizer: '华工学生艺术团',
    organizerInfo: '华南理工大学校级艺术社团',
    capacity: 200,
    registeredCount: 142,
    status: 'open',
    favorite: false,
    campus: '华南理工大学',
    subCampus: '大学城校区',
    isFeaturedOnHome: true,
    isHotOnHome: true,
    isStartingSoonOnHome: true,
    schedule: [{ time: '19:00 - 21:30', title: '湖畔交响与乐队演出', detail: '全曲目现场演绎' }],
    requirements: ['凭华工校园卡入场'],
    contact: '华工团委文艺部 13800138111',
  },
  {
    id: 'scut-lecture-1',
    title: '具身智能与人形机器人前沿论坛',
    cover: 'lecture',
    category: '讲座',
    description: '探讨大模型赋能下的具身智能机器人运动控制与多模态感知技术，现场展示双足机器人步态演示。',
    startTime: '2026-11-03T14:30:00',
    endTime: '2026-11-03T17:30:00',
    registrationStartTime: '2026-10-26T09:00:00',
    registrationDeadline: '2026-11-03T14:00:00',
    location: '五山校区逸夫人文馆报告厅',
    organizer: '计算机科学与工程学院',
    organizerInfo: '华南理工大学学术讲坛',
    capacity: 180,
    registeredCount: 180,
    status: 'full',
    favorite: false,
    campus: '华南理工大学',
    subCampus: '五山校区',
    isOngoingOnHome: true,
    isHotOnHome: true,
    schedule: [{ time: '14:30 - 17:30', title: '学术报告与机器人现场演示', detail: '互动问答' }],
    requirements: ['全校本硕博同学均可参加'],
    contact: '学院科研秘书 020-87110000',
  },
  {
    id: 'gdut-basketball-1',
    title: '广工粤狮杯院系三人篮球争霸赛',
    cover: 'basketball',
    category: '比赛',
    description: '热血主场，粤狮出击！广东工业大学大学城校区三人篮球精英赛，诚邀全校篮球爱好者观赛助威。',
    startTime: '2026-11-05T17:00:00',
    endTime: '2026-11-05T20:00:00',
    registrationStartTime: '2026-10-25T09:00:00',
    registrationDeadline: '2026-11-05T12:00:00',
    location: '大学城校区西区体育馆主场',
    organizer: '广工体育部 · 篮球协会',
    organizerInfo: '广东工业大学学生体育组织',
    capacity: 160,
    registeredCount: 118,
    status: 'open',
    favorite: false,
    campus: '广东工业大学',
    subCampus: '大学城校区',
    isFeaturedOnHome: true,
    isHotOnHome: true,
    isStartingSoonOnHome: true,
    schedule: [{ time: '17:00 - 20:00', title: '八强淘汰赛及扣篮表演赛', detail: '现场抽奖送球队纪念T恤' }],
    requirements: ['文明观赛，穿运动鞋入场'],
    contact: '广工篮协 13726009911',
  },
  {
    id: 'gafa-design-1',
    title: '广美秋日青年插画与版画艺术周',
    cover: 'design',
    category: '展览',
    description: '展出视觉艺术设计学院与版画系 80 余位青年创作者的丝网版画、独立绘本与动态视觉装置。',
    startTime: '2026-11-04T10:00:00',
    endTime: '2026-11-10T18:00:00',
    registrationStartTime: '2026-10-24T09:00:00',
    registrationDeadline: '2026-11-09T18:00:00',
    location: '大学城校区美术馆二楼展厅',
    organizer: '广州美术学院学生会学术部',
    organizerInfo: '广美青年艺术策展团队',
    capacity: 120,
    registeredCount: 75,
    status: 'open',
    favorite: false,
    campus: '广州美术学院',
    subCampus: '大学城校区',
    isFeaturedOnHome: true,
    isHotOnHome: true,
    isOngoingOnHome: true,
    schedule: [{ time: '10:00 - 18:00', title: '版画原作观展与丝网印刷体验', detail: '每日下午两点艺术家导览' }],
    requirements: ['凭校园卡免费入馆'],
    contact: '广美策展组 13500112233',
  },
  {
    id: 'szpu-market-1',
    title: '西丽湖创客硬件与文创嘉年华',
    cover: 'market',
    category: '社团',
    description: '深职大创客中心年度开放日，集结 3D 打印工坊、无人机编队体验、工业设计潮玩与校园乐队路演。',
    startTime: '2026-11-06T14:00:00',
    endTime: '2026-11-06T20:30:00',
    registrationStartTime: '2026-10-26T09:00:00',
    registrationDeadline: '2026-11-06T12:00:00',
    location: '西丽湖校区创客广场',
    organizer: '创新创业学院 · 创客协会',
    organizerInfo: '深圳职业技术大学学生创客平台',
    capacity: 180,
    registeredCount: 112,
    status: 'open',
    favorite: false,
    campus: '深圳职业技术大学',
    subCampus: '西丽湖校区',
    isFeaturedOnHome: true,
    isHotOnHome: true,
    isStartingSoonOnHome: true,
    schedule: [{ time: '14:00 - 20:30', title: '创客展位互动与项目路演', detail: '集齐 6 枚印章可兑换定制周边' }],
    requirements: ['全校师生均可报名参与'],
    contact: '创客协会 13688990011',
  },
];

export const INITIAL_BUDDY_POSTS: import('../types/activity').BuddyPost[] = [
  {
    id: 'buddy-music-1',
    activityId: 'act-music-2026',
    activityTitle: '校园音乐节',
    activityStartTime: '2026-11-06T18:30:00',
    campus: '广东建设职业技术学院',
    subCampus: '清远校区',
    authorName: '苏念初',
    authorDepartment: '建筑与艺术设计学院',
    authorGrade: '2024级',
    tag: '同去现场',
    title: '草坪前排听棱镜回声乐队，带了防水野餐垫！',
    description:
      '已经备好大号野餐垫、荧光手环和柠檬茶，想找 2-3 位喜欢校园民谣和乐队现场的同学一起提前半小时进场占前排，散场还可以一起去南区夜宵街！',
    meetingPoint: '11月6日 18:00 清远校区南区草坪西门签到处',
    maxCount: 4,
    currentCount: 2,
    participants: ['苏念初', '周晓敏'],
    contactCode: '微信号：sunian_2024（备注：音乐节搭子）',
    createdAt: '2026-11-03T11:20:00',
    isJoined: false,
  },
  {
    id: 'buddy-music-2',
    activityId: 'act-music-2026',
    activityTitle: '校园音乐节',
    activityStartTime: '2026-11-06T18:30:00',
    campus: '广东建设职业技术学院',
    subCampus: '清远校区',
    authorName: '林晓阳',
    authorDepartment: '建筑信息工程学院 · 软件技术',
    authorGrade: '2024级',
    tag: '约拍互勉',
    title: '带富士相机拍音乐节舞台与草坪氛围感照片',
    description:
      '本人摄影社成员，带富士 XT-5 + 大光圈定焦镜头去音乐节，找几位想拍晚风荧光棒氛围照的同学互拍，当晚即可直出返图！',
    meetingPoint: '11月6日 18:15 南区中心草坪灯塔下',
    maxCount: 4,
    currentCount: 3,
    participants: ['林晓阳', '张佳怡', '李梓豪'],
    contactCode: '微信：linxy_photo（音乐节互勉小分队）',
    createdAt: '2026-11-02T20:10:00',
    isJoined: true,
    isMine: true,
  },
  {
    id: 'buddy-design-1',
    activityId: 'act-design-2026',
    activityTitle: '校园设计大赛',
    activityStartTime: '2026-11-08T14:00:00',
    campus: '广东建设职业技术学院',
    subCampus: '广州校区',
    authorName: '温知夏',
    authorDepartment: '建筑与艺术设计学院 · 室内设计',
    authorGrade: '2023级',
    tag: '组队参赛',
    title: '数字交互与文创赛道3缺1！招前端或视觉排版队友',
    description:
      '我们已有 1 名空间建模 + 2 名插画视觉同学，曾获上届院级银奖。想找一位懂 UI 交互或展板排版的同学冲刺今年校级金奖与创新学分！',
    meetingPoint: '广州校区艺术设计楼 302 路演厅前排 / 可线上先沟通',
    maxCount: 4,
    currentCount: 3,
    participants: ['温知夏', '罗子恒', '林晓阳'],
    contactCode: '组队群口令：#筑梦设计冲金小队#（微信：wenzhixia_art）',
    createdAt: '2026-11-01T16:45:00',
    isJoined: true,
  },
  {
    id: 'buddy-arch-1',
    activityId: 'act-gz-arch-2026',
    activityTitle: '广府古建筑测绘与榫卯模型展',
    activityStartTime: '2026-11-03T10:00:00',
    campus: '广东建设职业技术学院',
    subCampus: '广州校区',
    authorName: '何景行',
    authorDepartment: '土木工程学院 · 古建筑工程技术',
    authorGrade: '2024级',
    tag: '同去现场',
    title: '周四下午场一起去拼四铺作榫卯斗拱模型！',
    description:
      '工坊需要两人一组协作完成斗拱拼装挑战，我对鲁班锁和宋式斗拱结构很熟，找一位动手能力强或者想拍古建模型细节的搭子一起组队拿纪念徽章。',
    meetingPoint: '广州校区综合实训楼一楼展厅入口签到台',
    maxCount: 2,
    currentCount: 1,
    participants: ['何景行'],
    contactCode: '微信：he_arch2024（备注：斗拱工坊搭子）',
    createdAt: '2026-11-03T09:30:00',
    isJoined: false,
  },
  {
    id: 'buddy-basketball-1',
    activityId: 'act-basketball-2026',
    activityTitle: '篮球友谊赛',
    activityStartTime: '2026-11-03T16:30:00',
    campus: '广东建设职业技术学院',
    subCampus: '清远校区',
    authorName: '陆星河',
    authorDepartment: '建筑信息工程学院',
    authorGrade: '2024级',
    tag: '同去现场',
    title: '建信学院主场加油团 + 中场三分大赛搭子',
    description:
      '一起去 1 号灯光球场给院队呐喊助威，中场休息一起报名 60 秒三分投篮挑战赛，打完球还可以约北区二饭堂！',
    meetingPoint: '16:15 清远校区北区 1 号灯光球场看台西侧',
    maxCount: 5,
    currentCount: 3,
    participants: ['陆星河', '赵宇轩', '邓皓'],
    contactCode: '微信：luxinghe_ball（备注：篮球赛搭子）',
    createdAt: '2026-11-03T12:10:00',
    isJoined: false,
  },
  {
    id: 'buddy-market-1',
    activityId: 'act-market-2026',
    activityTitle: '创意市集',
    activityStartTime: '2026-11-03T12:00:00',
    campus: '广东建设职业技术学院',
    subCampus: '清远校区',
    authorName: '许清欢',
    authorDepartment: '市政与交通工程学院',
    authorGrade: '2025级',
    tag: '跨校区同行',
    title: '周末广州校区过来清远校区逛银杏市集集章',
    description:
      '准备搭乘校际交通车来清远校区逛创意市集、盖校园建筑套色印章，找同路同学一起逛摊位、互拍银杏大道照片！',
    meetingPoint: '清远校区图书馆前银杏林荫大道入口',
    maxCount: 4,
    currentCount: 4,
    participants: ['许清欢', '唐果', '宋佳', '吴敏'],
    contactCode: '微信：xuqh_2025（市集逛展小队）',
    createdAt: '2026-11-02T14:00:00',
    isJoined: false,
  },
  {
    id: 'buddy-scut-1',
    activityId: 'scut-music-1',
    activityTitle: '鲤工湖畔草坪交响音乐夜',
    activityStartTime: '2026-11-07T19:00:00',
    campus: '华南理工大学',
    subCampus: '大学城校区',
    authorName: '沈嘉树',
    authorDepartment: '软件学院',
    authorGrade: '2024级',
    tag: '同去现场',
    title: '五山校区跨校区去大学城听湖畔交响夜',
    description: '周六傍晚从五山坐地铁去大学城中心湖草坪，散场一起拼车回五山！',
    meetingPoint: '大学城南地铁站 C 口 / 中心湖草坪',
    maxCount: 4,
    currentCount: 2,
    participants: ['沈嘉树', '林宇'],
    contactCode: '微信：scut_shen（备注：交响夜搭子）',
    createdAt: '2026-11-03T10:30:00',
    isJoined: false,
  },
];

```

## src/App.tsx
```tsx
import React, { useEffect, useRef, useState } from 'react';
import {
  Activity,
  ActivityCategory,
  BuddyPost,
  BuddyTag,
  InterestPreference,
  PrimaryTab,
  PublishFormData,
  StatusFilter,
  TimeRangeFilter,
  UserProfile,
} from './types/activity';
import {
  DEFAULT_CAMPUS,
  DEFAULT_SUB_CAMPUS,
  DEMO_NOW_ISO,
  INITIAL_ACTIVITIES,
  INITIAL_BUDDY_POSTS,
  INITIAL_USER_PROFILE,
} from './data/initialData';
import {
  applyRegistration,
  computeActivityStatus,
  toggleJoinBuddyPost,
} from './utils/activityRules';
import { BottomNav } from './components/BottomNav';
import { CampusSelectorPage } from './components/CampusSelectorPage';
import { HomePage } from './components/HomePage';
import { ActivitiesPage } from './components/ActivitiesPage';
import { ActivityDetailPage } from './components/ActivityDetailPage';
import { PublishPage } from './components/PublishPage';
import { ProfilePage, ProfileSubPage } from './components/ProfilePage';

const STORAGE_KEYS = {
  ACTIVITIES: 'yichang_activities_v3',
  BUDDIES: 'yichang_buddies_v1',
  PROFILE: 'yichang_profile_v2',
  CAMPUS: 'yichang_campus_v1',
  SUB_CAMPUS: 'yichang_subcampus_v1',
  ONBOARDED: 'yichang_onboarded_v1',
};

export default function App() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Check ?autostart=1 to optionally skip initial campus selection screen
  const isAutoStart =
    typeof window !== 'undefined' &&
    new URLSearchParams(window.location.search).get('autostart') === '1';

  const [hasSelectedCampus, setHasSelectedCampus] = useState<boolean>(() => {
    if (isAutoStart) return true;
    try {
      return localStorage.getItem(STORAGE_KEYS.ONBOARDED) === 'true';
    } catch {
      return false;
    }
  });

  const [currentCampus, setCurrentCampus] = useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.CAMPUS) || DEFAULT_CAMPUS;
    } catch {
      return DEFAULT_CAMPUS;
    }
  });

  const [currentSubCampus, setCurrentSubCampus] = useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.SUB_CAMPUS) || DEFAULT_SUB_CAMPUS;
    } catch {
      return DEFAULT_SUB_CAMPUS;
    }
  });

  const [activities, setActivities] = useState<Activity[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore storage error
    }
    return INITIAL_ACTIVITIES;
  });

  const [buddyPosts, setBuddyPosts] = useState<BuddyPost[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BUDDIES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return INITIAL_BUDDY_POSTS;
  });

  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROFILE);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_USER_PROFILE;
  });

  // Navigation state
  const [activeTab, setActiveTab] = useState<PrimaryTab>('home');
  const [activitiesViewMode, setActivitiesViewMode] = useState<'activities' | 'buddies'>(
    'activities'
  );
  const [showCampusModal, setShowCampusModal] = useState<boolean>(false);
  const [activeDetailId, setActiveDetailId] = useState<string | null>(null);
  const [mobileShowArtboard, setMobileShowArtboard] = useState<boolean>(false);

  // Activities Page filter state
  const [selectedCategory, setSelectedCategory] = useState<ActivityCategory>('全部');
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [timeRange, setTimeRange] = useState<TimeRangeFilter>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [autoFocusSearch, setAutoFocusSearch] = useState<boolean>(false);

  // Publish Page state
  const [publishMode, setPublishMode] = useState<'form' | 'preview' | 'success'>('form');
  const [editingDraft, setEditingDraft] = useState<PublishFormData | null>(null);
  const [previewFormData, setPreviewFormData] = useState<PublishFormData | null>(null);
  const [lastSubmittedTitle, setLastSubmittedTitle] = useState<string>('');

  // Profile subpage state
  const [profileSubPage, setProfileSubPage] = useState<ProfileSubPage>('main');
  const [settingsSection, setSettingsSection] = useState<'profile' | 'settings' | 'about'>(
    'profile'
  );

  // Persist changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities));
    } catch {
      // ignore
    }
  }, [activities]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.BUDDIES, JSON.stringify(buddyPosts));
    } catch {
      // ignore
    }
  }, [buddyPosts]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(userProfile));
    } catch {
      // ignore
    }
  }, [userProfile]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CAMPUS, currentCampus);
    } catch {
      // ignore
    }
  }, [currentCampus]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SUB_CAMPUS, currentSubCampus);
    } catch {
      // ignore
    }
  }, [currentSubCampus]);

  // Scroll to top when screen changes
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [
    activeTab,
    activitiesViewMode,
    activeDetailId,
    showCampusModal,
    publishMode,
    profileSubPage,
    hasSelectedCampus,
    mobileShowArtboard,
  ]);

  const handleSelectCampus = (campusName: string, subCampus?: string) => {
    const nextSub = subCampus || DEFAULT_SUB_CAMPUS;
    setCurrentCampus(campusName);
    setCurrentSubCampus(nextSub);
    setUserProfile((prev) => ({
      ...prev,
      campus: campusName,
      subCampus: nextSub !== '全部校区' ? nextSub : prev.subCampus,
    }));
    setHasSelectedCampus(true);
    setShowCampusModal(false);
    try {
      localStorage.setItem(STORAGE_KEYS.ONBOARDED, 'true');
    } catch {
      // ignore
    }
  };

  const handleSelectTab = (tab: PrimaryTab) => {
    setHasSelectedCampus(true);
    setActiveDetailId(null);
    setShowCampusModal(false);
    setMobileShowArtboard(false);
    setActiveTab(tab);
    if (tab === 'publish') {
      setPublishMode('form');
    }
    if (tab === 'profile') {
      setProfileSubPage('main');
    }
  };

  const handleJumpToCategory = (category: ActivityCategory, focusSearch = false) => {
    setActivitiesViewMode('activities');
    setSelectedCategory(category);
    setStatusFilter('all');
    setTimeRange('all');
    if (focusSearch) {
      setAutoFocusSearch(true);
    }
    setActiveDetailId(null);
    setActiveTab('activities');
  };

  const handleJumpToBuddySquare = () => {
    setActivitiesViewMode('buddies');
    setActiveDetailId(null);
    setActiveTab('activities');
  };

  const handleToggleFavorite = (activityId: string) => {
    setActivities((prev) =>
      prev.map((act) => (act.id === activityId ? { ...act, favorite: !act.favorite } : act))
    );
  };

  const handleToggleJoinBuddy = (buddyId: string) => {
    setBuddyPosts((prev) =>
      prev.map((post) =>
        post.id === buddyId ? toggleJoinBuddyPost(post, userProfile.nickname) : post
      )
    );
  };

  const handleToggleInterestPreference = (interest: InterestPreference) => {
    setUserProfile((prev) => {
      const current: InterestPreference[] =
        prev.interests && prev.interests.length > 0
          ? prev.interests
          : ['艺术', '体育', '讲座'];
      const exists = current.includes(interest);
      if (exists && current.length === 1) {
        // Keep at least one interest tag active for persona matching
        return prev;
      }
      const nextInterests: InterestPreference[] = exists
        ? current.filter((item) => item !== interest)
        : [...current, interest];
      return {
        ...prev,
        interests: nextInterests,
      };
    });
  };

  const handleCreateBuddyPost = (data: {
    activityId: string;
    activityTitle: string;
    activityStartTime: string;
    campus: string;
    subCampus: string;
    tag: BuddyTag;
    title: string;
    description: string;
    meetingPoint: string;
    maxCount: number;
    contactCode: string;
  }) => {
    const newPost: BuddyPost = {
      id: `buddy-${Date.now()}`,
      ...data,
      authorName: userProfile.nickname,
      authorDepartment: userProfile.department,
      authorGrade: userProfile.grade,
      currentCount: 1,
      participants: [userProfile.nickname],
      createdAt: DEMO_NOW_ISO,
      isJoined: true,
      isMine: true,
    };
    setBuddyPosts((prev) => [newPost, ...prev]);
  };

  const handleRegisterSuccess = (
    activityId: string,
    form: {
      attendeeName: string;
      studentId: string;
      phone: string;
      department: string;
      note?: string;
    }
  ) => {
    setActivities((prev) =>
      prev.map((act) => (act.id === activityId ? applyRegistration(act, form, DEMO_NOW_ISO) : act))
    );
  };

  const buildActivityFromForm = (
    formData: PublishFormData,
    reviewStatus: 'draft' | 'pending'
  ): Activity => {
    const startIso = `${formData.startDate}T${formData.startClock}:00`;
    const endIso = `${formData.endDate}T${formData.endClock}:00`;
    const regStartIso = `${formData.regStartDate}T${formData.regStartClock}:00`;
    const regDeadlineIso = `${formData.regDeadlineDate}T${formData.regDeadlineClock}:00`;
    const cap = Math.max(1, Number(formData.capacity) || 100);

    const baseObj = {
      startTime: startIso,
      endTime: endIso,
      registrationStartTime: regStartIso,
      registrationDeadline: regDeadlineIso,
      capacity: cap,
      registeredCount: 0,
    };

    return {
      id: formData.id || `pub-${Date.now()}`,
      title: formData.title.trim(),
      cover: formData.cover || 'music',
      category: formData.category,
      description: formData.description.trim(),
      ...baseObj,
      status: computeActivityStatus(baseObj, DEMO_NOW_ISO),
      location: formData.location.trim() || '校内活动场地',
      organizer: formData.organizer.trim() || userProfile.nickname,
      organizerInfo: `${currentCampus}学生自主发起活动`,
      favorite: false,
      campus: currentCampus,
      subCampus:
        formData.subCampus ||
        (currentSubCampus !== '全部校区' ? currentSubCampus : '清远校区'),
      schedule: [
        {
          time: `${formData.startClock} - ${formData.endClock}`,
          title: '主体活动开展与互动',
          detail: '按活动公告流程签到入场参与',
        },
      ],
      requirements: formData.requirementsText
        .split(/[；;\n]/)
        .map((s) => s.trim())
        .filter(Boolean),
      contact: formData.contact.trim() || userProfile.phone,
      isUserPublished: true,
      reviewStatus,
    };
  };

  const handleSaveDraft = (formData: PublishFormData) => {
    const draftAct = buildActivityFromForm(formData, 'draft');
    setActivities((prev) => {
      const exists = prev.some((a) => a.id === draftAct.id);
      if (exists) {
        return prev.map((a) => (a.id === draftAct.id ? draftAct : a));
      }
      return [draftAct, ...prev];
    });
  };

  const handleSubmitPublish = (formData: PublishFormData) => {
    const submittedAct = buildActivityFromForm(formData, 'pending');
    setActivities((prev) => {
      const exists = prev.some((a) => a.id === submittedAct.id);
      if (exists) {
        return prev.map((a) => (a.id === submittedAct.id ? submittedAct : a));
      }
      return [submittedAct, ...prev];
    });
    setLastSubmittedTitle(submittedAct.title);
    setEditingDraft(null);
    setPreviewFormData(null);
    setPublishMode('success');
  };

  const handleSimulateApprove = (activityId: string) => {
    setActivities((prev) =>
      prev.map((a) =>
        a.id === activityId
          ? { ...a, reviewStatus: 'approved', isStartingSoonOnHome: true }
          : a
      )
    );
  };

  const handleResetDemoData = () => {
    setActivities(INITIAL_ACTIVITIES);
    setBuddyPosts(INITIAL_BUDDY_POSTS);
    setUserProfile(INITIAL_USER_PROFILE);
    setCurrentCampus(DEFAULT_CAMPUS);
    setCurrentSubCampus(DEFAULT_SUB_CAMPUS);
    try {
      localStorage.removeItem(STORAGE_KEYS.ACTIVITIES);
      localStorage.removeItem(STORAGE_KEYS.BUDDIES);
      localStorage.removeItem(STORAGE_KEYS.PROFILE);
      localStorage.removeItem(STORAGE_KEYS.CAMPUS);
      localStorage.removeItem(STORAGE_KEYS.SUB_CAMPUS);
    } catch {
      // ignore
    }
  };

  const activeDetailActivity = activeDetailId
    ? activities.find((a) => a.id === activeDetailId) || null
    : null;

  const showBottomNav =
    hasSelectedCampus &&
    !showCampusModal &&
    !activeDetailActivity &&
    !(activeTab === 'publish' && publishMode === 'preview') &&
    !(activeTab === 'profile' && profileSubPage !== 'main');

  return (
    <div className="min-h-screen bg-[#ECEAE6] flex items-center justify-center">
      {/* 移动端主画布容器（390x844 标准尺寸，无手机边框、无顶部状态栏、无滚动条） */}
      <div className="w-full max-w-[430px] sm:w-[390px] h-[100dvh] sm:h-[844px] bg-[#F7F7F5] flex flex-col overflow-hidden relative shrink-0">
        {/* 可纵向滚动的页面主体视口 */}
        <main
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar relative"
        >
          {!hasSelectedCampus || showCampusModal ? (
            <CampusSelectorPage
              currentCampus={currentCampus}
              currentSubCampus={currentSubCampus}
              isInitial={!hasSelectedCampus}
              onSelectCampus={handleSelectCampus}
              onClose={hasSelectedCampus ? () => setShowCampusModal(false) : undefined}
            />
          ) : activeDetailActivity ? (
            <ActivityDetailPage
              activity={activeDetailActivity}
              userProfile={userProfile}
              buddyPosts={buddyPosts}
              onBack={() => setActiveDetailId(null)}
              onToggleFavorite={handleToggleFavorite}
              onRegisterSuccess={handleRegisterSuccess}
              onToggleJoinBuddy={handleToggleJoinBuddy}
              onCreateBuddyPost={handleCreateBuddyPost}
              onGoToMyRegistrations={() => {
                setActiveDetailId(null);
                setActiveTab('profile');
                setProfileSubPage('my-registrations');
              }}
            />
          ) : activeTab === 'home' ? (
            <HomePage
              currentCampus={currentCampus}
              currentSubCampus={currentSubCampus}
              userProfile={userProfile}
              activities={activities}
              buddyPosts={buddyPosts}
              onChangeSubCampus={setCurrentSubCampus}
              onToggleInterestPreference={handleToggleInterestPreference}
              onOpenCampusSelector={() => setShowCampusModal(true)}
              onSelectActivity={(id) => setActiveDetailId(id)}
              onJumpToCategory={handleJumpToCategory}
              onJumpToBuddySquare={handleJumpToBuddySquare}
              onToggleJoinBuddy={handleToggleJoinBuddy}
            />
          ) : activeTab === 'activities' ? (
            <ActivitiesPage
              currentCampus={currentCampus}
              currentSubCampus={currentSubCampus}
              activities={activities}
              buddyPosts={buddyPosts}
              viewMode={activitiesViewMode}
              selectedCategory={selectedCategory}
              searchKeyword={searchKeyword}
              timeRange={timeRange}
              statusFilter={statusFilter}
              autoFocusSearch={autoFocusSearch}
              onChangeViewMode={setActivitiesViewMode}
              onChangeSubCampus={setCurrentSubCampus}
              onChangeCategory={setSelectedCategory}
              onChangeSearch={setSearchKeyword}
              onChangeTimeRange={setTimeRange}
              onChangeStatusFilter={setStatusFilter}
              onOpenCampusSelector={() => setShowCampusModal(true)}
              onSelectActivity={(id) => setActiveDetailId(id)}
              onToggleJoinBuddy={handleToggleJoinBuddy}
              onClearAutoFocus={() => setAutoFocusSearch(false)}
            />
          ) : activeTab === 'publish' ? (
            <PublishPage
              currentCampus={currentCampus}
              currentSubCampus={currentSubCampus}
              initialDraft={editingDraft}
              mode={publishMode}
              previewData={previewFormData}
              lastSubmittedTitle={lastSubmittedTitle}
              onSaveDraft={handleSaveDraft}
              onProceedToPreview={(data) => {
                setPreviewFormData(data);
                setPublishMode('preview');
              }}
              onBackToEdit={() => setPublishMode('form')}
              onSubmitPublish={handleSubmitPublish}
              onGoToMyPublished={() => {
                setPublishMode('form');
                setActiveTab('profile');
                setProfileSubPage('my-published');
              }}
              onGoHome={() => {
                setPublishMode('form');
                setActiveTab('home');
              }}
            />
          ) : (
            <ProfilePage
              userProfile={userProfile}
              currentCampus={currentCampus}
              activities={activities}
              buddyPosts={buddyPosts}
              subPage={profileSubPage}
              initialSettingsTab={settingsSection}
              onChangeSubPage={(sub, sec) => {
                setProfileSubPage(sub);
                if (sec) setSettingsSection(sec);
              }}
              onOpenCampusSelector={() => setShowCampusModal(true)}
              onSelectActivity={(id) => setActiveDetailId(id)}
              onToggleFavorite={handleToggleFavorite}
              onToggleJoinBuddy={handleToggleJoinBuddy}
              onEditPublishedActivity={(formData) => {
                setEditingDraft(formData);
                setPublishMode('form');
                setActiveTab('publish');
              }}
              onSimulateApproveActivity={handleSimulateApprove}
              onUpdateProfile={setUserProfile}
              onResetDemoData={handleResetDemoData}
              onGoToDiscover={() => {
                setProfileSubPage('main');
                setActivitiesViewMode('buddies');
                setActiveTab('activities');
              }}
            />
          )}
        </main>

        {/* 固定底部导航栏（应用全新原创几何+负形图标） */}
        {showBottomNav && (
          <BottomNav activeTab={activeTab} onSelectTab={handleSelectTab} />
        )}
      </div>
    </div>
  );
}

```

## src/components/CoverArtwork.tsx
```tsx
import React, { useState } from 'react';
import musicFestivalImg from '../assets/images/campus_music_festival_1793980126412.jpg';
import basketballGameImg from '../assets/images/campus_basketball_game_1793980127239.jpg';
import designExhibitionImg from '../assets/images/campus_design_exhibition_1793980127841.jpg';
import aiLectureImg from '../assets/images/campus_ai_lecture_1793980129562.jpg';
import creativeMarketImg from '../assets/images/campus_creative_market_1793980129791.jpg';

export interface CoverPreset {
  key: string;
  label: string;
  subtitle: string;
}

export const COVER_PRESETS: CoverPreset[] = [
  { key: 'music', label: '草坪音乐节', subtitle: '舞台灯光 · 乐队演出' },
  { key: 'photo', label: '光影摄影展', subtitle: '画廊展厅 · 纪实影像' },
  { key: 'basketball', label: '热血篮球赛', subtitle: '落日球场 · 院系对抗' },
  { key: 'design', label: '校园设计赛', subtitle: '创意工坊 · 模型作品' },
  { key: 'market', label: '林荫创意市集', subtitle: '手作摊位 · 社团文创' },
  { key: 'lecture', label: '前沿学术讲堂', subtitle: '报告大厅 · 思想交锋' },
  { key: 'debate', label: '思辨华语辩论', subtitle: '唇枪舌剑 · 决赛现场' },
  { key: 'gala', label: '星光迎新晚会', subtitle: '礼堂舞台 · 节目海选' },
];

const PRESET_PHOTO_MAP: Record<string, string> = {
  music: musicFestivalImg,
  gala: musicFestivalImg,
  basketball: basketballGameImg,
  design: designExhibitionImg,
  photo: designExhibitionImg,
  lecture: aiLectureImg,
  debate: aiLectureImg,
  market: creativeMarketImg,
};

interface CoverArtworkProps {
  cover: string;
  title?: string;
  className?: string;
}

export const CoverArtwork: React.FC<CoverArtworkProps> = ({
  cover,
  title = '校园活动封面',
  className = 'w-full h-full',
}) => {
  const [imgError, setImgError] = useState(false);

  const resolvedPhotoSrc =
    cover.startsWith('data:image/') || cover.startsWith('http') || cover.startsWith('/')
      ? cover
      : PRESET_PHOTO_MAP[cover];

  if (resolvedPhotoSrc && !imgError) {
    return (
      <div className={`relative overflow-hidden bg-[#EAE9E7] ${className}`}>
        <img
          src={resolvedPhotoSrc}
          alt={title}
          referrerPolicy="no-referrer"
          onError={() => setImgError(true)}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  switch (cover) {
    case 'music':
      return (
        <div className={`relative overflow-hidden bg-[#241B2F] ${className}`} role="img" aria-label={title}>
          <svg viewBox="0 0 600 360" preserveAspectRatio="xMidYMid slice" className="w-full h-full">
            <defs>
              <linearGradient id="musicSky" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1E1836" />
                <stop offset="55%" stopColor="#5D2E46" />
                <stop offset="100%" stopColor="#FF5A4F" />
              </linearGradient>
              <radialGradient id="stageGlow" cx="50%" cy="62%" r="45%">
                <stop offset="0%" stopColor="#FFB88C" stopOpacity="0.95" />
                <stop offset="60%" stopColor="#FF5A4F" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#1E1836" stopOpacity="0" />
              </radialGradient>
            </defs>
            <rect width="600" height="360" fill="url(#musicSky)" />
            <circle cx="300" cy="215" r="195" fill="url(#stageGlow)" />
            {/* String lights */}
            <path d="M0,55 Q150,95 300,65 T600,75" fill="none" stroke="#FFF0ED" strokeWidth="1.2" strokeOpacity="0.5" />
            {[60, 125, 190, 255, 325, 395, 465, 535].map((cx, idx) => (
              <circle key={idx} cx={cx} cy={idx % 2 === 0 ? 74 : 69} r="4.5" fill="#FFE3B3" />
            ))}
            {/* Stage truss & arch */}
            <path d="M135,265 L165,125 L435,125 L465,265 Z" fill="#171326" fillOpacity="0.72" stroke="#FF9278" strokeWidth="2" />
            {/* Spotlights */}
            <polygon points="210,128 140,280 250,280" fill="#FFE5C4" fillOpacity="0.18" />
            <polygon points="390,128 350,280 460,280" fill="#FFE5C4" fillOpacity="0.18" />
            <polygon points="300,128 245,280 355,280" fill="#FF7B6B" fillOpacity="0.24" />
            {/* Band silhouettes on stage */}
            <circle cx="300" cy="198" r="11" fill="#FFF0ED" />
            <path d="M286,248 L292,211 L308,211 L314,248 Z" fill="#FFF0ED" />
            <line x1="278" y1="224" x2="326" y2="212" stroke="#FF5A4F" strokeWidth="4" strokeLinecap="round" />
            <circle cx="235" cy="206" r="9" fill="#FFD1C2" />
            <path d="M224,248 L229,217 L241,217 L246,248 Z" fill="#FFD1C2" />
            <circle cx="368" cy="210" r="9" fill="#FFD1C2" />
            <rect x="352" y="226" width="32" height="20" rx="4" fill="#FFD1C2" fillOpacity="0.85" />
            {/* Campus lawn & cheering crowd silhouettes */}
            <path d="M0,255 Q300,235 600,255 L600,360 L0,360 Z" fill="#191321" />
            {[45, 92, 140, 188, 236, 285, 334, 382, 430, 478, 526, 565].map((x, i) => (
              <g key={i} transform={`translate(${x}, ${285 + (i % 3) * 8})`}>
                <circle cx="0" cy="0" r="13" fill="#2A2035" />
                <path d="M-18,45 Q-16,14 0,14 Q16,14 18,45 Z" fill="#231A2D" />
              </g>
            ))}
          </svg>
        </div>
      );

    case 'photo':
      return (
        <div className={`relative overflow-hidden bg-[#EFECE6] ${className}`} role="img" aria-label={title}>
          <svg viewBox="0 0 600 360" preserveAspectRatio="xMidYMid slice" className="w-full h-full">
            <rect width="600" height="360" fill="#F3EFEA" />
            {/* Sunlight window beam */}
            <polygon points="0,0 260,0 440,360 110,360" fill="#FFFDF9" fillOpacity="0.78" />
            {/* Gallery floor */}
            <rect x="0" y="268" width="600" height="92" fill="#D8C8B8" />
            <line x1="0" y1="268" x2="600" y2="268" stroke="#C2B09E" strokeWidth="2" />
            {/* Framed photographs on gallery wall */}
            <g transform="translate(76, 66)">
              <rect width="124" height="148" rx="4" fill="#262322" />
              <rect x="8" y="8" width="108" height="132" fill="#FAF8F5" />
              <rect x="22" y="22" width="80" height="92" fill="#D97F6C" />
              <circle cx="48" cy="52" r="12" fill="#FFF3EB" />
              <path d="M22,94 L54,68 L78,86 L102,62 L102,114 L22,114 Z" fill="#4A3B39" />
            </g>
            <g transform="translate(238, 54)">
              <rect width="136" height="164" rx="4" fill="#262322" />
              <rect x="9" y="9" width="118" height="146" fill="#FAF8F5" />
              <rect x="24" y="24" width="88" height="104" fill="#3D5A6C" />
              <path d="M24,106 Q68,72 112,102 L112,128 L24,128 Z" fill="#E7A977" />
              <circle cx="84" cy="54" r="14" fill="#FDEBD0" />
            </g>
            <g transform="translate(412, 72)">
              <rect width="114" height="140" rx="4" fill="#262322" />
              <rect x="8" y="8" width="98" height="124" fill="#FAF8F5" />
              <rect x="20" y="20" width="74" height="86" fill="#7CA08A" />
              <circle cx="57" cy="63" r="21" fill="#F7F4EA" fillOpacity="0.85" />
            </g>
            {/* Student viewer silhouette */}
            <circle cx="215" cy="214" r="16" fill="#2E2927" />
            <path d="M192,330 C192,262 200,238 215,238 C230,238 238,262 238,330 Z" fill="#3B3330" />
            <circle cx="385" cy="222" r="15" fill="#514744" />
            <path d="M364,335 C364,270 371,244 385,244 C399,244 406,270 406,335 Z" fill="#FF5A4F" />
          </svg>
        </div>
      );

    case 'basketball':
      return (
        <div className={`relative overflow-hidden bg-[#D96B43] ${className}`} role="img" aria-label={title}>
          <svg viewBox="0 0 600 360" preserveAspectRatio="xMidYMid slice" className="w-full h-full">
            <defs>
              <linearGradient id="courtSunset" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#FF865E" />
                <stop offset="55%" stopColor="#E0533C" />
                <stop offset="100%" stopColor="#3B2737" />
              </linearGradient>
            </defs>
            <rect width="600" height="360" fill="url(#courtSunset)" />
            <circle cx="465" cy="92" r="46" fill="#FFE6B8" fillOpacity="0.85" />
            {/* Court floor */}
            <path d="M0,228 L600,228 L600,360 L0,360 Z" fill="#2E4756" />
            <path d="M80,228 L520,228 L585,360 L15,360 Z" fill="#3A5A6B" stroke="#F7F7F5" strokeWidth="2.5" strokeOpacity="0.65" />
            <ellipse cx="300" cy="292" rx="95" ry="28" fill="none" stroke="#F7F7F5" strokeWidth="2.5" strokeOpacity="0.65" />
            {/* Backboard and hoop */}
            <line x1="152" y1="115" x2="152" y2="255" stroke="#1E1E24" strokeWidth="8" />
            <rect x="132" y="82" width="58" height="44" rx="4" fill="#FFF8F2" stroke="#1E1E24" strokeWidth="3" />
            <rect x="150" y="98" width="22" height="16" fill="none" stroke="#FF5A4F" strokeWidth="2.5" />
            <line x1="172" y1="114" x2="196" y2="114" stroke="#FF5A4F" strokeWidth="4" />
            <path d="M174,114 L179,136 L191,136 L194,114" fill="none" stroke="#FFF0ED" strokeWidth="2" strokeDasharray="3,2" />
            {/* Basketball in mid-air */}
            <circle cx="242" cy="96" r="16" fill="#FF6B35" stroke="#231917" strokeWidth="2" />
            <path d="M228,96 Q242,84 256,96 M242,80 L242,112" fill="none" stroke="#231917" strokeWidth="1.8" />
            {/* Players */}
            <circle cx="290" cy="168" r="13" fill="#231917" />
            <path d="M268,242 L282,184 L304,184 L314,242 Z" fill="#FFF0ED" />
            <circle cx="364" cy="186" r="13" fill="#231917" />
            <path d="M346,258 L354,202 L376,202 L384,258 Z" fill="#FF5A4F" />
          </svg>
        </div>
      );

    case 'design':
      return (
        <div className={`relative overflow-hidden bg-[#F3ECE6] ${className}`} role="img" aria-label={title}>
          <svg viewBox="0 0 600 360" preserveAspectRatio="xMidYMid slice" className="w-full h-full">
            <rect width="600" height="360" fill="#F4EFEA" />
            {/* Architectural grid lines */}
            <g stroke="#E2D9D0" strokeWidth="1">
              <line x1="0" y1="90" x2="600" y2="90" />
              <line x1="0" y1="180" x2="600" y2="180" />
              <line x1="0" y1="270" x2="600" y2="270" />
              <line x1="150" y1="0" x2="150" y2="360" />
              <line x1="300" y1="0" x2="300" y2="360" />
              <line x1="450" y1="0" x2="450" y2="360" />
            </g>
            {/* Geometric poster boards & architectural models */}
            <rect x="85" y="52" width="175" height="236" rx="12" fill="#FFFFFF" stroke="#D9CEC3" strokeWidth="2" />
            <circle cx="172" cy="134" r="46" fill="#FF5A4F" />
            <path d="M126,180 L218,180 L172,112 Z" fill="#232B38" fillOpacity="0.88" />
            <rect x="118" y="210" width="108" height="10" rx="5" fill="#514744" />
            <rect x="118" y="230" width="72" height="8" rx="4" fill="#9A8984" />

            <rect x="296" y="76" width="218" height="212" rx="12" fill="#232B38" />
            <circle cx="452" cy="136" r="34" fill="#FFB88C" />
            <rect x="326" y="114" width="84" height="84" rx="10" fill="#FF5A4F" fillOpacity="0.9" />
            <rect x="358" y="148" width="94" height="78" rx="8" fill="#FFF0ED" />
            <text x="328" y="262" fill="#FFF0ED" fontSize="15" fontWeight="700" fontFamily="sans-serif">
              CAMPUS DESIGN STUDIO
            </text>
          </svg>
        </div>
      );

    case 'market':
      return (
        <div className={`relative overflow-hidden bg-[#E5EFE9] ${className}`} role="img" aria-label={title}>
          <svg viewBox="0 0 600 360" preserveAspectRatio="xMidYMid slice" className="w-full h-full">
            <rect width="600" height="360" fill="#EBF3ED" />
            {/* Campus trees canopy */}
            <circle cx="95" cy="48" r="95" fill="#76A085" fillOpacity="0.55" />
            <circle cx="515" cy="36" r="110" fill="#648F73" fillOpacity="0.55" />
            <circle cx="310" cy="22" r="85" fill="#89B096" fillOpacity="0.45" />
            {/* Market booth awning */}
            <g transform="translate(115, 92)">
              <line x1="18" y1="48" x2="18" y2="210" stroke="#7A553E" strokeWidth="6" />
              <line x1="352" y1="48" x2="352" y2="210" stroke="#7A553E" strokeWidth="6" />
              {/* Striped canopy */}
              {[0, 1, 2, 3, 4, 5, 6, 7].map((idx) => (
                <path
                  key={idx}
                  d={`M${idx * 46},0 L${(idx + 1) * 46},0 L${(idx + 1) * 46},48 Q${idx * 46 + 23},62 ${idx * 46},48 Z`}
                  fill={idx % 2 === 0 ? '#FF5A4F' : '#FFFDF9'}
                />
              ))}
              {/* Craft table & handmade goods */}
              <rect x="0" y="158" width="370" height="68" rx="8" fill="#D59B6E" />
              <rect x="14" y="168" width="342" height="44" rx="4" fill="#FFF6EC" />
              {/* Ceramics, tote bags, plants */}
              <rect x="48" y="122" width="34" height="36" rx="6" fill="#FF5A4F" />
              <circle cx="118" cy="138" r="18" fill="#E9B872" />
              <path d="M168,158 L178,118 L212,118 L222,158 Z" fill="#4E7D63" />
              <rect x="255" y="116" width="42" height="42" rx="6" fill="#3B4E5C" />
              <circle cx="322" cy="140" r="16" fill="#E07A5F" />
            </g>
          </svg>
        </div>
      );

    case 'lecture':
      return (
        <div className={`relative overflow-hidden bg-[#222B35] ${className}`} role="img" aria-label={title}>
          <svg viewBox="0 0 600 360" preserveAspectRatio="xMidYMid slice" className="w-full h-full">
            <rect width="600" height="360" fill="#1F2933" />
            {/* Wooden acoustic wall panels */}
            <rect x="30" y="24" width="540" height="210" rx="10" fill="#313D4B" />
            {/* Presentation screen */}
            <rect x="145" y="46" width="310" height="154" rx="8" fill="#F8FAFC" />
            <rect x="168" y="68" width="130" height="14" rx="4" fill="#FF5A4F" />
            <rect x="168" y="94" width="195" height="10" rx="3" fill="#475569" />
            <rect x="168" y="114" width="165" height="10" rx="3" fill="#94A3B8" />
            {/* Chart graphic on slide */}
            <rect x="380" y="112" width="16" height="58" rx="3" fill="#FF857A" />
            <rect x="404" y="88" width="16" height="82" rx="3" fill="#FF5A4F" />
            {/* Speaker at podium */}
            <rect x="106" y="176" width="38" height="62" rx="4" fill="#9A6B4C" />
            <circle cx="125" cy="142" r="11" fill="#FDE2CE" />
            <path d="M110,176 Q125,156 140,176 Z" fill="#FF5A4F" />
            {/* Tiered auditorium audience silhouettes */}
            {[90, 155, 220, 285, 350, 415, 480].map((x, idx) => (
              <g key={idx} transform={`translate(${x}, 278)`}>
                <circle cx="0" cy="0" r="14" fill="#435264" />
                <path d="M-24,48 Q-20,16 0,16 Q20,16 24,48 Z" fill="#364454" />
              </g>
            ))}
          </svg>
        </div>
      );

    case 'debate':
      return (
        <div className={`relative overflow-hidden bg-[#2C2229] ${className}`} role="img" aria-label={title}>
          <svg viewBox="0 0 600 360" preserveAspectRatio="xMidYMid slice" className="w-full h-full">
            <rect width="600" height="360" fill="#2A2128" />
            <circle cx="300" cy="145" r="150" fill="#FF5A4F" fillOpacity="0.18" />
            {/* Pro vs Con podiums */}
            <rect x="85" y="190" width="150" height="90" rx="8" fill="#3E323B" stroke="#FF5A4F" strokeWidth="2" />
            <rect x="365" y="190" width="150" height="90" rx="8" fill="#3E323B" stroke="#9A8984" strokeWidth="2" />
            <text x="132" y="242" fill="#FF5A4F" fontSize="22" fontWeight="700">正方</text>
            <text x="412" y="242" fill="#F7F7F5" fontSize="22" fontWeight="700">反方</text>
            <circle cx="300" cy="135" r="38" fill="#FFF0ED" />
            <text x="282" y="143" fill="#FF5A4F" fontSize="22" fontWeight="700">VS</text>
          </svg>
        </div>
      );

    default:
      return (
        <div className={`relative overflow-hidden bg-[#31243E] ${className}`} role="img" aria-label={title}>
          <svg viewBox="0 0 600 360" preserveAspectRatio="xMidYMid slice" className="w-full h-full">
            <defs>
              <linearGradient id="galaGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#261C35" />
                <stop offset="50%" stopColor="#723854" />
                <stop offset="100%" stopColor="#FF5A4F" />
              </linearGradient>
            </defs>
            <rect width="600" height="360" fill="url(#galaGrad)" />
            <circle cx="300" cy="180" r="120" fill="#FFF0ED" fillOpacity="0.14" />
            <circle cx="300" cy="180" r="72" fill="#FFF0ED" fillOpacity="0.22" />
            <path d="M245,235 L300,115 L355,235 Z" fill="#FFF0ED" fillOpacity="0.85" />
          </svg>
        </div>
      );
  }
};

```

## src/components/BottomNav.tsx
```tsx
import React from 'react';
import { PrimaryTab } from '../types/activity';
import {
  NavIconHome,
  NavIconActivities,
  NavIconPublish,
  NavIconProfile,
  OriginalNavIconProps,
} from './OriginalNavIcons';

interface BottomNavProps {
  activeTab: PrimaryTab;
  onSelectTab: (tab: PrimaryTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onSelectTab }) => {
  const navItems: {
    id: PrimaryTab;
    label: string;
    ariaLabel?: string;
    Icon: React.FC<OriginalNavIconProps>;
  }[] = [
    { id: 'home', label: '首页', Icon: NavIconHome },
    { id: 'activities', label: '活动', Icon: NavIconActivities },
    { id: 'publish', label: '发布', ariaLabel: '发布活动', Icon: NavIconPublish },
    { id: 'profile', label: '我的', Icon: NavIconProfile },
  ];

  return (
    <nav
      aria-label="底部主导航"
      className="sticky bottom-0 left-0 right-0 z-30 bg-white border-t border-[#F0EEEC] px-2 pt-2 pb-[22px] shrink-0"
    >
      <div className="grid grid-cols-4 items-center">
        {navItems.map((item) => {
          const IconComponent = item.Icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectTab(item.id)}
              aria-label={item.ariaLabel || item.label}
              aria-current={isActive ? 'page' : undefined}
              className="flex flex-col items-center justify-center min-h-[48px] py-0.5 transition-transform active:scale-95 focus:outline-none"
            >
              <IconComponent selected={isActive} size={24} />
              <span
                className={`text-[11px] mt-1 font-medium whitespace-nowrap transition-colors ${
                  isActive ? 'text-[#FF5A4F] font-semibold' : 'text-[#514744]'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

```

## src/components/OriginalNavIcons.tsx
```tsx
import React, { useState } from 'react';
import { Check, Copy, Grid, Sparkles } from 'lucide-react';
import { PrimaryTab } from '../types/activity';

export interface OriginalNavIconProps {
  selected?: boolean;
  size?: number;
  showGrid?: boolean;
  className?: string;
}

const DEFAULT_COLOR = '#3A3533';
const SELECTED_COLOR = '#FF5A4F';

/**
 * 1. 首页图标（入口、空间与探索感）
 * 几何构成：圆角拱门空间体块 + 偏心负形通道 + 悬浮探索圆点
 * 不使用传统屋顶房子造型，以建筑空间入口与透视负形表达「进入校园空间、探索未知活动」。
 */
export const NavIconHome: React.FC<OriginalNavIconProps> = ({
  selected = false,
  size = 24,
  showGrid = false,
  className = '',
}) => {
  const color = selected ? SELECTED_COLOR : DEFAULT_COLOR;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {showGrid && <ConstructionGridOverlay />}
      {selected ? (
        <g>
          {/* 选中态：实心几何空间拱体 + 负形内切通道 + 珊瑚橙探索焦点 */}
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M4 11C4 6.58172 7.58172 3 12 3C16.4183 3 20 6.58172 20 11V19C20 20.1046 19.1046 21 18 21H6C4.89543 21 4 20.1046 4 19V11ZM10.5 13.5C10.5 11.8431 11.8431 10.5 13.5 10.5C15.1569 10.5 16.5 11.8431 16.5 13.5V21H10.5V13.5Z"
            fill={color}
          />
          <circle cx="9" cy="8.5" r="1.75" fill="#FFF0ED" />
        </g>
      ) : (
        <g>
          {/* 默认态：外拱门空间轮廓 + 内部负形门廊弧线 + 探索圆点 */}
          <path
            d="M4.75 19V11C4.75 6.99594 7.99594 3.75 12 3.75C16.0041 3.75 19.25 6.99594 19.25 11V19C19.25 19.6904 18.6904 20.25 18 20.25H6C5.30964 20.25 4.75 19.6904 4.75 19Z"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M11 20V14C11 12.3431 12.3431 11 14 11C15.6569 11 17 12.3431 17 14"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle cx="9.25" cy="8.75" r="1.6" fill={color} />
        </g>
      )}
    </svg>
  );
};

/**
 * 2. 活动图标（聚集、连接与活动发生的概念）
 * 几何构成：双交叠几何环块 + 负形引力缺口 + 对角能量节点
 * 不使用传统日历网格，以两个相向汇聚的圆弧块面与中心交汇负形表达「人群聚集、连接碰撞、活动正在发生」。
 */
export const NavIconActivities: React.FC<OriginalNavIconProps> = ({
  selected = false,
  size = 24,
  showGrid = false,
  className = '',
}) => {
  const color = selected ? SELECTED_COLOR : DEFAULT_COLOR;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {showGrid && <ConstructionGridOverlay />}
      {selected ? (
        <g>
          {/* 左下聚集块面（带中心负形切槽） */}
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M3.5 13.5C3.5 9.91015 6.41015 7 10 7H12.5C13.3284 7 14 7.67157 14 8.5C14 9.32843 13.3284 10 12.5 10H10C8.067 10 6.5 11.567 6.5 13.5C6.5 15.433 8.067 17 10 17H13.5C14.3284 17 15 17.6716 15 18.5C15 19.3284 14.3284 20 13.5 20H10C6.41015 20 3.5 17.0899 3.5 13.5Z"
            fill={color}
          />
          {/* 右上连接块面 */}
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M10.5 4C9.67157 4 9 4.67157 9 5.5C9 6.32843 9.67157 7 10.5 7H14C15.933 7 17.5 8.567 17.5 10.5C17.5 12.433 15.933 14 14 14H11.5C10.6716 14 10 14.6716 10 15.5C10 16.3284 10.6716 17 11.5 17H14C17.5899 17 20.5 14.0899 20.5 10.5C20.5 6.91015 17.5899 4 14 4H10.5Z"
            fill={color}
          />
          {/* 中心碰撞发生核心圆与右上活力点 */}
          <circle cx="12" cy="12" r="2" fill={color} />
          <circle cx="18.5" cy="18.5" r="2" fill={color} />
        </g>
      ) : (
        <g>
          {/* 左下环弧 */}
          <path
            d="M13.5 19.25H10C6.82436 19.25 4.25 16.6756 4.25 13.5C4.25 10.3244 6.82436 7.75 10 7.75H12.5"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* 右上环弧 */}
          <path
            d="M10.5 4.75H14C17.1756 4.75 19.75 7.32436 19.75 10.5C19.75 13.6756 17.1756 16.25 14 16.25H11.5"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* 中心聚集核心点与连接节点 */}
          <circle cx="12" cy="12" r="2" fill={color} />
          <circle cx="18.25" cy="18.25" r="1.75" fill={color} />
        </g>
      )}
    </svg>
  );
};

/**
 * 3. 发布图标（创造、展开与发起活动的概念）
 * 几何构成：双折翼展开块面 + 负形菱感星芒核心 + 右上发射圆点
 * 不使用十字加号，以折纸般的动态展开双翼与中心负形光圈表达「从无到有创造、展开一场新活动」。
 */
export const NavIconPublish: React.FC<OriginalNavIconProps> = ({
  selected = false,
  size = 24,
  showGrid = false,
  className = '',
}) => {
  const color = selected ? SELECTED_COLOR : DEFAULT_COLOR;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {showGrid && <ConstructionGridOverlay />}
      {selected ? (
        <g>
          {/* 选中态：实心圆角方块内嵌负形展开通道与右上破界发起点 */}
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M4 8.5C4 6.01472 6.01472 4 8.5 4H13.5C14.3284 4 15 4.67157 15 5.5C15 6.32843 14.3284 7 13.5 7H9.5C8.11929 7 7 8.11929 7 9.5V14.5C7 15.8807 8.11929 17 9.5 17H14.5C15.8807 17 17 15.8807 17 14.5V10.5C17 9.67157 17.6716 9 18.5 9C19.3284 9 20 9.67157 20 10.5V15.5C20 17.9853 17.9853 20 15.5 20H8.5C6.01472 20 4 17.9853 4 15.5V8.5Z"
            fill={color}
          />
          {/* 中心向外展开的创造菱块与右上发起圆点 */}
          <rect
            x="12"
            y="8.4"
            width="5.1"
            height="5.1"
            rx="1.4"
            transform="rotate(45 12 8.4)"
            fill={color}
          />
          <circle cx="18.25" cy="5.75" r="2.25" fill={color} />
        </g>
      ) : (
        <g>
          {/* 默认态：左下展开基座弧线 + 中心旋转方块 + 右上发起短线与圆点 */}
          <path
            d="M13.5 4.75H8.5C6.42893 4.75 4.75 6.42893 4.75 8.5V15.5C4.75 17.5711 6.42893 19.25 8.5 19.25H15.5C17.5711 19.25 19.25 17.5711 19.25 15.5V10.5"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
          />
          <rect
            x="12"
            y="8.7"
            width="4.6"
            height="4.6"
            rx="1.2"
            transform="rotate(45 12 8.7)"
            fill={color}
          />
          <circle cx="18" cy="6" r="2" fill={color} />
        </g>
      )}
    </svg>
  );
};

/**
 * 4. 我的图标（个人与独立空间的概念）
 * 几何构成：半包围新月弧形舱体 + 独立负形内室 + 偏心自我内核圆
 * 不使用具象人头肩膀轮廓，以环抱式几何围合空间与独立圆核表达「自我的独立精神角落与个人活动归属」。
 */
export const NavIconProfile: React.FC<OriginalNavIconProps> = ({
  selected = false,
  size = 24,
  showGrid = false,
  className = '',
}) => {
  const color = selected ? SELECTED_COLOR : DEFAULT_COLOR;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {showGrid && <ConstructionGridOverlay />}
      {selected ? (
        <g>
          {/* 选中态：厚重C型环抱空间块面（带负形内腔） + 独立个人圆核 + 底部基座短线 */}
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12 3.5C7.30558 3.5 3.5 7.30558 3.5 12C3.5 16.6944 7.30558 20.5 12 20.5H17.5C18.8807 20.5 20 19.3807 20 18V15.5C20 14.6716 19.3284 14 18.5 14C17.6716 14 17 14.6716 17 15.5V17.5H12C8.96243 17.5 6.5 15.0376 6.5 12C6.5 8.96243 8.96243 6.5 12 6.5C13.6569 6.5 15.1429 7.23295 16.15 8.395C16.693 9.021 17.64 9.088 18.266 8.545C18.892 8.002 18.959 7.055 18.416 6.429C16.857 4.631 14.561 3.5 12 3.5Z"
            fill={color}
          />
          <circle cx="13.25" cy="11.5" r="2.75" fill={color} />
        </g>
      ) : (
        <g>
          {/* 默认态：半包围独立空间弧线 + 内部偏心独立圆核 */}
          <path
            d="M17.5 6.75C16.124 5.216 14.125 4.25 11.9 4.25C7.675 4.25 4.25 7.675 4.25 11.9C4.25 16.125 7.675 19.55 11.9 19.55H17.5C18.6046 19.55 19.5 18.6546 19.5 17.55V15.25"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="13.25" cy="11.5" r="2.5" fill={color} />
        </g>
      )}
    </svg>
  );
};

const ConstructionGridOverlay: React.FC = () => (
  <g stroke="#171717" strokeOpacity="0.1" strokeWidth="0.35">
    <rect x="2" y="2" width="20" height="20" rx="4" fill="none" />
    <circle cx="12" cy="12" r="8.5" fill="none" />
    <circle cx="12" cy="12" r="4.5" fill="none" />
    <line x1="12" y1="0" x2="12" y2="24" />
    <line x1="0" y1="12" x2="24" y2="12" />
    <line x1="2" y1="2" x2="22" y2="22" />
    <line x1="22" y1="2" x2="2" y2="22" />
  </g>
);

export interface IconSpecMetadata {
  id: PrimaryTab;
  name: string;
  concept: string;
  geometryDesc: string;
  negativeSpaceDesc: string;
  Component: React.FC<OriginalNavIconProps>;
  defaultSvgCode: string;
  selectedSvgCode: string;
}

export const ORIGINAL_ICON_SPECS: IconSpecMetadata[] = [
  {
    id: 'home',
    name: '首页',
    concept: '入口 · 空间 · 探索感',
    geometryDesc: '圆角拱形建筑体块 + 悬浮探索圆点',
    negativeSpaceDesc: '右下偏心内切门廊负形通道，引导视线向内探索',
    Component: NavIconHome,
    defaultSvgCode: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M4.75 19V11C4.75 6.99594 7.99594 3.75 12 3.75C16.0041 3.75 19.25 6.99594 19.25 11V19C19.25 19.6904 18.6904 20.25 18 20.25H6C5.30964 20.25 4.75 19.6904 4.75 19Z" stroke="#3A3533" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M11 20V14C11 12.3431 12.3431 11 14 11C15.6569 11 17 12.3431 17 14" stroke="#3A3533" stroke-width="2" stroke-linecap="round"/>
  <circle cx="9.25" cy="8.75" r="1.6" fill="#3A3533"/>
</svg>`,
    selectedSvgCode: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path fill-rule="evenodd" clip-rule="evenodd" d="M4 11C4 6.58172 7.58172 3 12 3C16.4183 3 20 6.58172 20 11V19C20 20.1046 19.1046 21 18 21H6C4.89543 21 4 20.1046 4 19V11ZM10.5 13.5C10.5 11.8431 11.8431 10.5 13.5 10.5C15.1569 10.5 16.5 11.8431 16.5 13.5V21H10.5V13.5Z" fill="#FF5A4F"/>
  <circle cx="9" cy="8.5" r="1.75" fill="#FFF0ED"/>
</svg>`,
  },
  {
    id: 'activities',
    name: '活动',
    concept: '聚集 · 连接 · 活动发生',
    geometryDesc: '错位交叠双U型环轨 + 中心能量焦点',
    negativeSpaceDesc: '双环之间保留 2px 呼吸负形通道，中心圆核凝聚人气',
    Component: NavIconActivities,
    defaultSvgCode: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M13.5 19.25H10C6.82436 19.25 4.25 16.6756 4.25 13.5C4.25 10.3244 6.82436 7.75 10 7.75H12.5" stroke="#3A3533" stroke-width="2" stroke-linecap="round"/>
  <path d="M10.5 4.75H14C17.1756 4.75 19.75 7.32436 19.75 10.5C19.75 13.6756 17.1756 16.25 14 16.25H11.5" stroke="#3A3533" stroke-width="2" stroke-linecap="round"/>
  <circle cx="12" cy="12" r="2" fill="#3A3533"/>
  <circle cx="18.25" cy="18.25" r="1.75" fill="#3A3533"/>
</svg>`,
    selectedSvgCode: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path fill-rule="evenodd" clip-rule="evenodd" d="M3.5 13.5C3.5 9.91015 6.41015 7 10 7H12.5C13.3284 7 14 7.67157 14 8.5C14 9.32843 13.3284 10 12.5 10H10C8.067 10 6.5 11.567 6.5 13.5C6.5 15.433 8.067 17 10 17H13.5C14.3284 17 15 17.6716 15 18.5C15 19.3284 14.3284 20 13.5 20H10C6.41015 20 3.5 17.0899 3.5 13.5Z" fill="#FF5A4F"/>
  <path fill-rule="evenodd" clip-rule="evenodd" d="M10.5 4C9.67157 4 9 4.67157 9 5.5C9 6.32843 9.67157 7 10.5 7H14C15.933 7 17.5 8.567 17.5 10.5C17.5 12.433 15.933 14 14 14H11.5C10.6716 14 10 14.6716 10 15.5C10 16.3284 10.6716 17 11.5 17H14C17.5899 17 20.5 14.0899 20.5 10.5C20.5 6.91015 17.5899 4 14 4H10.5Z" fill="#FF5A4F"/>
  <circle cx="12" cy="12" r="2" fill="#FF5A4F"/>
  <circle cx="18.5" cy="18.5" r="2" fill="#FF5A4F"/>
</svg>`,
  },
  {
    id: 'publish',
    name: '发布',
    concept: '创造 · 展开 · 发起活动',
    geometryDesc: '开放式折角画布 + 45°旋转创造方块 + 破界圆点',
    negativeSpaceDesc: '右上角象限完全留白破界，形成由中心向外辐射展开的张力',
    Component: NavIconPublish,
    defaultSvgCode: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M13.5 4.75H8.5C6.42893 4.75 4.75 6.42893 4.75 8.5V15.5C4.75 17.5711 6.42893 19.25 8.5 19.25H15.5C17.5711 19.25 19.25 17.5711 19.25 15.5V10.5" stroke="#3A3533" stroke-width="2" stroke-linecap="round"/>
  <rect x="12" y="8.7" width="4.6" height="4.6" rx="1.2" transform="rotate(45 12 8.7)" fill="#3A3533"/>
  <circle cx="18" cy="6" r="2" fill="#3A3533"/>
</svg>`,
    selectedSvgCode: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path fill-rule="evenodd" clip-rule="evenodd" d="M4 8.5C4 6.01472 6.01472 4 8.5 4H13.5C14.3284 4 15 4.67157 15 5.5C15 6.32843 14.3284 7 13.5 7H9.5C8.11929 7 7 8.11929 7 9.5V14.5C7 15.8807 8.11929 17 9.5 17H14.5C15.8807 17 17 15.8807 17 14.5V10.5C17 9.67157 17.6716 9 18.5 9C19.3284 9 20 9.67157 20 10.5V15.5C20 17.9853 17.9853 20 15.5 20H8.5C6.01472 20 4 17.9853 4 15.5V8.5Z" fill="#FF5A4F"/>
  <rect x="12" y="8.4" width="5.1" height="5.1" rx="1.4" transform="rotate(45 12 8.4)" fill="#FF5A4F"/>
  <circle cx="18.25" cy="5.75" r="2.25" fill="#FF5A4F"/>
</svg>`,
  },
  {
    id: 'profile',
    name: '我的',
    concept: '个人 · 独立空间 · 归属',
    geometryDesc: 'C型半围合弧舱 + 底部折角延伸 + 偏心自我圆核',
    negativeSpaceDesc: '弧线内部留出独立精神空间，圆核安放于黄金偏心位置',
    Component: NavIconProfile,
    defaultSvgCode: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M17.5 6.75C16.124 5.216 14.125 4.25 11.9 4.25C7.675 4.25 4.25 7.675 4.25 11.9C4.25 16.125 7.675 19.55 11.9 19.55H17.5C18.6046 19.55 19.5 18.6546 19.5 17.55V15.25" stroke="#3A3533" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="13.25" cy="11.5" r="2.5" fill="#3A3533"/>
</svg>`,
    selectedSvgCode: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path fill-rule="evenodd" clip-rule="evenodd" d="M12 3.5C7.30558 3.5 3.5 7.30558 3.5 12C3.5 16.6944 7.30558 20.5 12 20.5H17.5C18.8807 20.5 20 19.3807 20 18V15.5C20 14.6716 19.3284 14 18.5 14C17.6716 14 17 14.6716 17 15.5V17.5H12C8.96243 17.5 6.5 15.0376 6.5 12C6.5 8.96243 8.96243 6.5 12 6.5C13.6569 6.5 15.1429 7.23295 16.15 8.395C16.693 9.021 17.64 9.088 18.266 8.545C18.892 8.002 18.959 7.055 18.416 6.429C16.857 4.631 14.561 3.5 12 3.5Z" fill="#FF5A4F"/>
  <circle cx="13.25" cy="11.5" r="2.75" fill="#FF5A4F"/>
</svg>`,
  },
];

interface IconDesignArtboardProps {
  activeTab: PrimaryTab;
  onSelectTab: (tab: PrimaryTab) => void;
  compact?: boolean;
}

export const IconDesignArtboard: React.FC<IconDesignArtboardProps> = ({
  activeTab,
  onSelectTab,
  compact = false,
}) => {
  const [showGrid, setShowGrid] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopySvg = (key: string, svgCode: string) => {
    navigator.clipboard?.writeText(svgCode).catch(() => {});
    setCopiedId(key);
    setTimeout(() => setCopiedId(null), 1800);
  };

  return (
    <div className="bg-white rounded-[24px] p-5 border border-[#F0EEEC] space-y-6">
      {/* 画板头部：设计系统规范 */}
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#F0EEEC] pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#FF5A4F]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>原创底部导航图标设计规范画板 · 几何构成 + 负形设计</span>
          </div>
          <h2 className="text-[19px] font-bold text-[#171717] mt-1">
            「一场」校园活动小程序 · 原创几何负形图标系统
          </h2>
          <p className="text-xs text-[#514744] mt-1">
            摒弃传统房屋、日历、十字加号与具象人像；基于 24×24px 黄金网格，以圆弧、切槽、块面与负形构建现代克制的品牌识别。
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowGrid((v) => !v)}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-colors ${
            showGrid
              ? 'bg-[#FFF0ED] text-[#FF5A4F]'
              : 'bg-[#F7F7F5] text-[#514744]'
          }`}
        >
          <Grid className="w-3.5 h-3.5" />
          <span>{showGrid ? '隐藏 24px 制图网格' : '显示 24px 制图网格'}</span>
        </button>
      </div>

      {/* 统一几何规范参数条 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
        <div className="p-3 rounded-2xl bg-[#F7F7F5]">
          <span className="text-[#9A8984] block">画布与视口基准</span>
          <strong className="text-[#171717] mt-0.5 block tabular-nums">
            24 × 24 px (适配 20-24px)
          </strong>
        </div>
        <div className="p-3 rounded-2xl bg-[#F7F7F5]">
          <span className="text-[#9A8984] block">线条与负形槽宽</span>
          <strong className="text-[#171717] mt-0.5 block tabular-nums">
            2.0 px 圆端描边 / 3.0 px 负形
          </strong>
        </div>
        <div className="p-3 rounded-2xl bg-[#F7F7F5] flex items-center justify-between">
          <div>
            <span className="text-[#9A8984] block">默认状态色</span>
            <strong className="text-[#171717] mt-0.5 block tabular-nums">#3A3533 深灰</strong>
          </div>
          <span className="w-5 h-5 rounded-full bg-[#3A3533] shrink-0" />
        </div>
        <div className="p-3 rounded-2xl bg-[#FFF0ED] flex items-center justify-between">
          <div>
            <span className="text-[#9A8984] block">选中状态色</span>
            <strong className="text-[#FF5A4F] mt-0.5 block tabular-nums">#FF5A4F 珊瑚橙</strong>
          </div>
          <span className="w-5 h-5 rounded-full bg-[#FF5A4F] shrink-0" />
        </div>
      </div>

      {/* Part 1: 四个原创图标的默认态 vs 选中态 + 多尺寸还原度对比 */}
      <div className={`grid ${compact ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2'} gap-3.5`}>
        {ORIGINAL_ICON_SPECS.map((spec) => {
          const IconComp = spec.Component;
          const isCurrentTab = activeTab === spec.id;
          return (
            <div
              key={spec.id}
              onClick={() => onSelectTab(spec.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') onSelectTab(spec.id);
              }}
              className={`p-4 rounded-[18px] border transition-all cursor-pointer ${
                isCurrentTab
                  ? 'border-[#FF5A4F] bg-[#FFF0ED]/25'
                  : 'border-[#F0EEEC] bg-[#F7F7F5]/60 hover:border-[#9A8984]/40'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div>
                  <span className="text-[15px] font-bold text-[#171717]">
                    {spec.name}
                  </span>
                  <span className="ml-2 text-xs font-medium text-[#FF5A4F]">
                    {spec.concept}
                  </span>
                </div>
                <span className="text-[11px] text-[#9A8984] tabular-nums">24×24 Vector</span>
              </div>

              {/* 默认状态 vs 选中状态 + 24px/20px 真机原寸检验 */}
              <div className="mt-3 grid grid-cols-3 gap-2.5 items-center">
                {/* 默认状态 */}
                <div className="bg-white rounded-2xl p-3 border border-[#F0EEEC] flex flex-col items-center">
                  <div className="w-12 h-12 flex items-center justify-center">
                    <IconComp selected={false} size={44} showGrid={showGrid} />
                  </div>
                  <span className="text-[11px] text-[#514744] font-medium mt-1.5">
                    默认状态
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopySvg(`${spec.id}-def`, spec.defaultSvgCode);
                    }}
                    className="mt-1.5 text-[10px] text-[#9A8984] hover:text-[#171717] flex items-center gap-1"
                  >
                    {copiedId === `${spec.id}-def` ? (
                      <>
                        <Check className="w-3 h-3 text-[#FF5A4F]" />
                        <span className="text-[#FF5A4F]">已复制SVG</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>复制SVG</span>
                      </>
                    )}
                  </button>
                </div>

                {/* 选中状态 */}
                <div className="bg-white rounded-2xl p-3 border border-[#F0EEEC] flex flex-col items-center">
                  <div className="w-12 h-12 flex items-center justify-center">
                    <IconComp selected={true} size={44} showGrid={showGrid} />
                  </div>
                  <span className="text-[11px] text-[#FF5A4F] font-semibold mt-1.5">
                    选中状态
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopySvg(`${spec.id}-sel`, spec.selectedSvgCode);
                    }}
                    className="mt-1.5 text-[10px] text-[#9A8984] hover:text-[#FF5A4F] flex items-center gap-1"
                  >
                    {copiedId === `${spec.id}-sel` ? (
                      <>
                        <Check className="w-3 h-3 text-[#FF5A4F]" />
                        <span className="text-[#FF5A4F]">已复制SVG</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>复制SVG</span>
                      </>
                    )}
                  </button>
                </div>

                {/* 24px / 20px 原寸视效检验 */}
                <div className="bg-white rounded-2xl p-3 border border-[#F0EEEC] flex flex-col items-center justify-center h-full space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col items-center">
                      <IconComp selected={false} size={24} />
                      <span className="text-[10px] text-[#9A8984] mt-1 tabular-nums">24px</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <IconComp selected={true} size={20} />
                      <span className="text-[10px] text-[#9A8984] mt-1 tabular-nums">20px</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-[#9A8984]">小尺寸清晰度</span>
                </div>
              </div>

              {/* 造型构成解析 */}
              <div className="mt-2.5 text-[11px] text-[#514744] space-y-0.5">
                <p>
                  <strong className="text-[#171717]">几何构成：</strong>
                  {spec.geometryDesc}
                </p>
                <p>
                  <strong className="text-[#171717]">负形设计：</strong>
                  {spec.negativeSpaceDesc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Part 2: 在「一场」底部导航栏中的实际使用效果预览 */}
      <div className="pt-2 border-t border-[#F0EEEC] space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#171717]">
              「一场」底部导航栏实际应用效果（点击可实时切换选中态与左侧页面）
            </h3>
            <p className="text-xs text-[#9A8984]">
              390px 标准宽度 · 图标 24px + 文字 11px 上下排列 · 透明图标背景
            </p>
          </div>
        </div>

        <div className="bg-[#F7F7F5] rounded-[22px] p-4 border border-[#F0EEEC]">
          <div className="max-w-[390px] mx-auto bg-white rounded-[20px] border border-[#F0EEEC] px-2 py-2 shadow-2xs">
            <div className="grid grid-cols-4 items-center">
              {ORIGINAL_ICON_SPECS.map((spec) => {
                const IconComp = spec.Component;
                const isSelected = activeTab === spec.id;
                return (
                  <button
                    key={spec.id}
                    type="button"
                    onClick={() => onSelectTab(spec.id)}
                    className="flex flex-col items-center justify-center py-1.5 transition-transform active:scale-95 focus:outline-none"
                  >
                    <IconComp selected={isSelected} size={24} />
                    <span
                      className={`text-[11px] mt-1 font-semibold tracking-tight ${
                        isSelected ? 'text-[#FF5A4F]' : 'text-[#514744]'
                      }`}
                    >
                      {spec.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

```

## src/components/CampusSelectorPage.tsx
```tsx
import React, { useState } from 'react';
import { Search, MapPin, Check, ArrowLeft, Building2 } from 'lucide-react';
import { CampusInfo } from '../types/activity';
import { CAMPUS_LIST } from '../data/initialData';

interface CampusSelectorPageProps {
  currentCampus: string;
  currentSubCampus?: string;
  isInitial?: boolean;
  onSelectCampus: (campusName: string, subCampus?: string) => void;
  onClose?: () => void;
}

export const CampusSelectorPage: React.FC<CampusSelectorPageProps> = ({
  currentCampus,
  currentSubCampus = '全部校区',
  isInitial = false,
  onSelectCampus,
  onClose,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedName, setSelectedName] = useState(currentCampus || '广东建设职业技术学院');
  const [selectedSubCampus, setSelectedSubCampus] = useState(currentSubCampus || '全部校区');

  const filteredCampuses: CampusInfo[] = CAMPUS_LIST.filter((c) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      c.name.toLowerCase().includes(q) ||
      c.shortName.toLowerCase().includes(q) ||
      c.city.toLowerCase().includes(q) ||
      c.district.toLowerCase().includes(q) ||
      c.subCampuses.some((sub) => sub.toLowerCase().includes(q))
    );
  });

  const handleSelectSchool = (campus: CampusInfo) => {
    setSelectedName(campus.name);
    if (selectedName !== campus.name) {
      setSelectedSubCampus('全部校区');
    }
  };

  const handleConfirm = () => {
    onSelectCampus(selectedName, selectedSubCampus);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-[#F7F7F5] text-[#171717]">
      {/* Top Bar */}
      <div className="pt-[12px] px-5 pb-2 flex items-center justify-between shrink-0">
        {!isInitial && onClose ? (
          <button
            type="button"
            onClick={onClose}
            aria-label="返回上一页"
            className="w-10 h-10 -ml-2 rounded-full flex items-center justify-center text-[#171717] hover:bg-black/5 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-[#FF5A4F] text-white font-bold text-sm flex items-center justify-center">
              一
            </span>
            <span className="text-sm font-semibold text-[#171717]">一场 · 校园活动</span>
          </div>
        )}
        <span className="text-xs text-[#9A8984]">默认：广东建设职业技术学院</span>
      </div>

      {/* Header Content */}
      <div className="px-5 pt-1 pb-3 shrink-0">
        <h1 className="text-[22px] font-bold tracking-tight text-[#171717]">选择你的校园</h1>
        <p className="text-xs text-[#514744] mt-1">支持高校切换与校内分校区二级筛选。</p>

        {/* Search Input */}
        <div className="mt-3 relative">
          <Search className="w-4 h-4 text-[#9A8984] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索学校名称、校区或所在城市"
            aria-label="搜索学校"
            className="w-full h-10 pl-10 pr-4 bg-white rounded-[14px] text-sm text-[#171717] placeholder-[#9A8984] border border-[#F0EEEC] focus:outline-none focus:border-[#FF5A4F]"
          />
        </div>
      </div>

      {/* Campus Cards List */}
      <div className="flex-1 px-5 space-y-2.5 pb-4 overflow-y-auto no-scrollbar">
        {filteredCampuses.map((campus) => {
          const isSelected = selectedName === campus.name;
          const isDefault = campus.name === '广东建设职业技术学院';
          const subOptions = ['全部校区', ...(campus.subCampuses || [])];

          return (
            <div
              key={campus.id}
              onClick={() => handleSelectSchool(campus)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') handleSelectSchool(campus);
              }}
              className={`w-full text-left p-3.5 rounded-[18px] bg-white transition-all border cursor-pointer ${
                isSelected
                  ? 'border-[#FF5A4F] ring-1 ring-[#FF5A4F]/30'
                  : 'border-[#F0EEEC] hover:border-[#9A8984]/40'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                      isSelected ? 'bg-[#FFF0ED] text-[#FF5A4F]' : 'bg-[#F7F7F5] text-[#514744]'
                    }`}
                  >
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[15px] font-semibold text-[#171717] truncate">
                        {campus.name}
                      </span>
                      {isDefault && (
                        <span className="text-xs font-medium text-[#FF5A4F]">默认学校</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-[#9A8984] mt-0.5">
                      <MapPin className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">
                        {campus.city} · {campus.district}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#514744] mt-1.5 tabular-nums">
                      <span>近期 {campus.activeCount} 场活动</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-[#9A8984]">{campus.studentCountText}</span>
                    </div>
                  </div>
                </div>

                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-1 ${
                    isSelected
                      ? 'bg-[#FF5A4F] text-white'
                      : 'border border-[#F0EEEC] bg-[#F7F7F5] text-transparent'
                  }`}
                >
                  <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
                </div>
              </div>

              {/* 校内分校区二级选择 */}
              {isSelected && subOptions.length > 1 && (
                <div
                  className="mt-3 pt-2.5 border-t border-[#F0EEEC] flex items-center gap-1.5 flex-wrap"
                  onClick={(e) => e.stopPropagation()}
                >
                  <span className="text-[11px] text-[#9A8984] mr-1">校内校区：</span>
                  {subOptions.map((sub) => {
                    const subActive = selectedSubCampus === sub;
                    return (
                      <button
                        key={sub}
                        type="button"
                        onClick={() => setSelectedSubCampus(sub)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                          subActive
                            ? 'bg-[#FF5A4F] text-white font-semibold'
                            : 'bg-[#F7F7F5] text-[#514744] hover:text-[#171717]'
                        }`}
                      >
                        {sub}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {filteredCampuses.length === 0 && (
          <div className="bg-white rounded-[18px] p-8 text-center border border-[#F0EEEC]">
            <p className="text-sm text-[#514744]">未找到匹配的高校</p>
            <p className="text-xs text-[#9A8984] mt-1">试试输入「广东建设职业技术学院」或「清远校区」</p>
          </div>
        )}
      </div>

      {/* Bottom Sticky Confirm Button */}
      <div className="shrink-0 p-4 bg-white border-t border-[#F0EEEC]">
        <button
          type="button"
          onClick={handleConfirm}
          className="w-full h-[50px] rounded-[26px] bg-[#FF5A4F] text-white font-semibold text-[15px] flex items-center justify-center transition-transform active:scale-[0.99]"
        >
          进入「{selectedName}
          {selectedSubCampus && selectedSubCampus !== '全部校区' ? ` · ${selectedSubCampus}` : ''}」
        </button>
      </div>
    </div>
  );
};

```

## src/components/HomePage.tsx
```tsx
import React from 'react';
import {
  Search,
  MapPin,
  ChevronRight,
  Clock,
  Sparkles,
  Users,
  Flame,
} from 'lucide-react';
import {
  Activity,
  ActivityCategory,
  BuddyPost,
  InterestPreference,
  UserProfile,
} from '../types/activity';
import { CAMPUS_LIST, DEMO_NOW_ISO } from '../data/initialData';
import {
  ALL_INTEREST_PREFERENCES,
  computeActivityStatus,
  filterBuddyPosts,
  formatDateTimeRange,
  formatShortDate,
  getDailyCuratedActivities,
  getStatusLabel,
} from '../utils/activityRules';
import { CoverArtwork } from './CoverArtwork';

interface HomePageProps {
  currentCampus: string;
  currentSubCampus: string;
  userProfile: UserProfile;
  activities: Activity[];
  buddyPosts: BuddyPost[];
  onChangeSubCampus: (subCampus: string) => void;
  onToggleInterestPreference: (interest: InterestPreference) => void;
  onOpenCampusSelector: () => void;
  onSelectActivity: (activityId: string) => void;
  onJumpToCategory: (category: ActivityCategory, focusSearch?: boolean) => void;
  onJumpToBuddySquare: () => void;
  onToggleJoinBuddy: (buddyId: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  currentCampus,
  currentSubCampus,
  userProfile,
  activities,
  buddyPosts,
  onChangeSubCampus,
  onToggleInterestPreference,
  onOpenCampusSelector,
  onSelectActivity,
  onJumpToCategory,
  onJumpToBuddySquare,
  onToggleJoinBuddy,
}) => {
  const [pressedCuratedId, setPressedCuratedId] = React.useState<string | null>(null);
  const [parallaxState, setParallaxState] = React.useState<{
    id: string | null;
    zoneX: 'left' | 'center' | 'right';
    zoneY: 'top' | 'center' | 'bottom';
  }>({ id: null, zoneX: 'center', zoneY: 'center' });

  const handleCardPointerMove = (
    e: React.PointerEvent<HTMLButtonElement>,
    actId: string
  ) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / Math.max(1, rect.width);
    const relY = (e.clientY - rect.top) / Math.max(1, rect.height);
    const zoneX: 'left' | 'center' | 'right' =
      relX < 0.38 ? 'left' : relX > 0.62 ? 'right' : 'center';
    const zoneY: 'top' | 'center' | 'bottom' =
      relY < 0.38 ? 'top' : relY > 0.62 ? 'bottom' : 'center';

    if (
      parallaxState.id !== actId ||
      parallaxState.zoneX !== zoneX ||
      parallaxState.zoneY !== zoneY
    ) {
      setParallaxState({ id: actId, zoneX, zoneY });
    }
  };

  const handleCardPointerReset = () => {
    setPressedCuratedId(null);
    setParallaxState({ id: null, zoneX: 'center', zoneY: 'center' });
  };

  const campusInfo =
    CAMPUS_LIST.find((c) => c.name === currentCampus) || CAMPUS_LIST[0];

  const subCampusOptions = ['全部校区', ...(campusInfo.subCampuses || [])];

  const activeInterests: InterestPreference[] =
    userProfile.interests && userProfile.interests.length > 0
      ? userProfile.interests
      : ['艺术', '体育', '讲座'];

  // 今日精选：基于当前校区与用户兴趣画像自动推荐 3 个活动卡片
  const dailyCuratedList = getDailyCuratedActivities(activities, {
    campus: currentCampus,
    subCampus: currentSubCampus,
    interests: activeInterests,
    department: userProfile.department,
    nowIso: DEMO_NOW_ISO,
    limit: 3,
  });

  const heroCurated = dailyCuratedList[0];
  const secondaryCurated = dailyCuratedList.slice(1, 3);

  const campusBuddyPosts = filterBuddyPosts(buddyPosts, {
    campus: currentCampus,
    subCampus: currentSubCampus,
  }).slice(0, 2);

  // Filter approved public activities for the current campus & selected sub-campus
  const allSchoolActivities = activities.filter(
    (a) =>
      a.campus === currentCampus &&
      (!a.reviewStatus || a.reviewStatus === 'approved' || a.reviewStatus === 'ended')
  );

  const campusActivities = allSchoolActivities.filter((a) => {
    if (!currentSubCampus || currentSubCampus === '全部校区') return true;
    return !a.subCampus || a.subCampus === currentSubCampus;
  });

  const ongoingActivities = campusActivities.filter((a) => a.isOngoingOnHome).slice(0, 2);
  const startingSoonActivities = campusActivities
    .filter((a) => a.isStartingSoonOnHome && a.id !== heroCurated?.activity.id)
    .slice(0, 2);
  const hotActivities = campusActivities.filter((a) => a.isHotOnHome).slice(0, 3);

  const renderStatusText = (act: Activity) => {
    const status = computeActivityStatus(act, DEMO_NOW_ISO);
    const label = getStatusLabel(status);
    if (status === 'open') {
      return <span className="text-xs font-bold text-[#FF5A4F] shrink-0 whitespace-nowrap">{label}</span>;
    }
    if (status === 'full') {
      return <span className="text-xs font-medium text-[#514744] shrink-0 whitespace-nowrap">{label}</span>;
    }
    return <span className="text-xs font-medium text-[#9A8984] shrink-0 whitespace-nowrap">{label}</span>;
  };

  const getCoverParallaxClass = (actId: string) => {
    const isParallaxActive = parallaxState.id === actId;
    return isParallaxActive
      ? `${
          parallaxState.zoneX === 'left'
            ? 'translate-x-1.5'
            : parallaxState.zoneX === 'right'
            ? '-translate-x-1.5'
            : ''
        } ${
          parallaxState.zoneY === 'top'
            ? 'translate-y-1.5'
            : parallaxState.zoneY === 'bottom'
            ? '-translate-y-1.5'
            : ''
        } scale-110`
      : 'group-hover:scale-105 group-hover:-translate-x-0.5 group-hover:-translate-y-0.5 group-active:scale-105';
  };

  const getContentParallaxClass = (actId: string) => {
    const isParallaxActive = parallaxState.id === actId;
    return isParallaxActive
      ? `${
          parallaxState.zoneX === 'left'
            ? '-translate-x-0.5'
            : parallaxState.zoneX === 'right'
            ? 'translate-x-0.5'
            : ''
        } ${
          parallaxState.zoneY === 'top'
            ? '-translate-y-0.5'
            : parallaxState.zoneY === 'bottom'
            ? 'translate-y-0.5'
            : '-translate-y-0.5'
        }`
      : 'group-hover:-translate-y-0.5 group-active:translate-y-0';
  };

  return (
    <div className="pb-8 bg-[#F4F2EE]">
      {/* 1. 顶部导航栏：品牌 + 学校切换 + 搜索 + 校区二级切换 */}
      <header className="px-4 pt-3 pb-3 bg-white border-b border-[#ECE9E4]">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="text-[23px] font-black tracking-tight text-[#171717] leading-none shrink-0">
              一场
            </span>
            <button
              type="button"
              onClick={onOpenCampusSelector}
              aria-label={`当前学校：${currentCampus}，点击切换校园`}
              className="flex items-center gap-1 text-xs font-bold text-[#171717] bg-[#F7F6F3] hover:bg-[#FFF0ED] hover:text-[#FF5A4F] px-3 py-1.5 rounded-full transition-colors max-w-[195px]"
            >
              <MapPin className="w-3.5 h-3.5 text-[#FF5A4F] shrink-0" />
              <span className="truncate">{currentCampus}</span>
              <ChevronRight className="w-3.5 h-3.5 text-[#9A8984] shrink-0" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => onJumpToCategory('全部', true)}
            aria-label="搜索感兴趣的校园活动"
            className="h-8 px-3.5 rounded-full bg-[#F7F6F3] hover:bg-[#ECE9E4] flex items-center gap-1.5 text-xs font-medium text-[#514744] shrink-0 transition-colors"
          >
            <Search className="w-3.5 h-3.5 text-[#9A8984]" />
            <span>搜索</span>
          </button>
        </div>

        {/* 二级校内校区切换栏 */}
        {subCampusOptions.length > 1 && (
          <div
            role="tablist"
            aria-label="校内校区切换"
            className="mt-2.5 p-1 rounded-[12px] bg-[#F4F2EE] flex items-center gap-1 overflow-x-auto no-scrollbar"
          >
            {subCampusOptions.map((sub) => {
              const active = currentSubCampus === sub;
              const count =
                sub === '全部校区'
                  ? allSchoolActivities.length
                  : allSchoolActivities.filter((a) => !a.subCampus || a.subCampus === sub).length;
              return (
                <button
                  key={sub}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => onChangeSubCampus(sub)}
                  className={`flex-1 min-w-[80px] py-1.5 px-2.5 rounded-[9px] text-xs transition-all flex items-center justify-center gap-1 whitespace-nowrap ${
                    active
                      ? 'bg-white text-[#171717] font-extrabold shadow-[0_1px_3px_rgba(0,0,0,0.06)]'
                      : 'text-[#6E635F] font-medium hover:text-[#171717]'
                  }`}
                >
                  <span>{sub}</span>
                  <span
                    className={`text-[10px] tabular-nums ${
                      active ? 'text-[#FF5A4F] font-bold' : 'text-[#9A8984]'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </header>

      {/* 模块一：今日精选 · 独立白底主视觉舞台 */}
      {dailyCuratedList.length > 0 && (
        <section
          aria-label="今日精选"
          data-testid="daily-curated-section"
          className="bg-white px-4 pt-3.5 pb-4 border-b-[8px] border-[#ECE9E2]"
        >
          {/* 模块标题栏：强字重对比 + 清晰副标题 */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="w-1 h-5 rounded-full bg-[#FF5A4F] shrink-0" />
              <h2 className="text-[19px] font-black text-[#171717] tracking-tight leading-none">
                今日精选
              </h2>
              <span className="text-xs font-normal text-[#8C7E79] pl-0.5">
                {currentSubCampus === '全部校区' ? '全校高契合度推荐' : `${currentSubCampus}定制`}
              </span>
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#FF5A4F] bg-[#FFF0ED] px-2.5 py-1 rounded-full">
              <Sparkles className="w-3 h-3" />
              <span>TOP 3</span>
            </span>
          </div>

          {/* 独立呼吸感兴趣偏好筛选行 */}
          <div className="mt-2.5 mb-3 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {ALL_INTEREST_PREFERENCES.map((pref) => {
              const isSelected = activeInterests.includes(pref);
              return (
                <button
                  key={pref}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => onToggleInterestPreference(pref)}
                  className={`flex-1 py-1.5 px-2.5 rounded-lg text-xs transition-all active:scale-95 whitespace-nowrap text-center ${
                    isSelected
                      ? 'bg-[#171717] text-white font-extrabold shadow-[0_2px_6px_rgba(23,23,23,0.14)]'
                      : 'bg-[#F6F4F0] text-[#6E635F] font-medium hover:text-[#171717]'
                  }`}
                >
                  {pref}
                </button>
              );
            })}
          </div>

          {/* 1大2小 Bento 海报组：充裕卡片内边距 + 强字重对比 */}
          <div className="space-y-2.5">
            {heroCurated && (() => {
              const act = heroCurated.activity;
              const status = computeActivityStatus(act, DEMO_NOW_ISO);
              const isPressed = pressedCuratedId === act.id;
              return (
                <button
                  key={act.id}
                  type="button"
                  data-testid="daily-curated-card"
                  data-pressed={isPressed ? 'true' : 'false'}
                  onClick={() => onSelectActivity(act.id)}
                  onPointerDown={() => setPressedCuratedId(act.id)}
                  onPointerUp={() => setPressedCuratedId(null)}
                  onPointerCancel={handleCardPointerReset}
                  onPointerLeave={handleCardPointerReset}
                  onPointerMove={(e) => handleCardPointerMove(e, act.id)}
                  onTouchStart={() => setPressedCuratedId(act.id)}
                  onTouchEnd={() => setPressedCuratedId(null)}
                  className={`relative w-full h-[176px] rounded-[22px] overflow-hidden text-left group select-none cursor-pointer transition-transform duration-300 ease-out will-change-transform shadow-[0_10px_28px_rgba(23,23,23,0.10)] ${
                    isPressed ? 'scale-[0.97]' : 'hover:-translate-y-0.5 active:scale-[0.97]'
                  }`}
                >
                  {/* 视差背景摄影层 */}
                  <div
                    className={`w-full h-full transition-transform duration-300 ease-out will-change-transform ${getCoverParallaxClass(
                      act.id
                    )}`}
                  >
                    <CoverArtwork
                      cover={act.cover}
                      title={act.title}
                      className="w-full h-full"
                    />
                  </div>

                  {/* 电影感高对比度渐变遮罩 + 轻微内阴影（Inner Shadow）提升卡片深邃立体感 */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/15 shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.42),inset_0_-22px_36px_rgba(0,0,0,0.48),inset_0_0_0_1px_rgba(255,255,255,0.18)] pointer-events-none" />

                  {/* 顶部悬浮标签：增大内边距 p-4 */}
                  <div className="absolute top-3.5 left-4 right-4 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="px-2.5 py-1 rounded-lg bg-[#FF5A4F] text-white text-xs font-black tracking-wide">
                        TOP 1 · {heroCurated.primaryInterest || act.category}
                      </span>
                      {act.subCampus && (
                        <span className="px-2.5 py-1 rounded-lg bg-black/55 backdrop-blur-xs text-white/95 text-xs font-medium">
                          {act.subCampus}
                        </span>
                      )}
                    </div>
                    <span className="px-2.5 py-1 rounded-lg bg-white/95 text-[#171717] text-xs font-extrabold tabular-nums">
                      {heroCurated.matchScore}% 契合
                    </span>
                  </div>

                  {/* 底部前景信息：调大至 24px 超粗主标题 vs 12px 轻量辅助信息 */}
                  <div
                    className={`absolute bottom-3.5 left-4 right-4 flex items-end justify-between gap-3 transition-transform duration-300 ease-out will-change-transform ${getContentParallaxClass(
                      act.id
                    )}`}
                  >
                    <div className="min-w-0 flex-1 text-white">
                      <h3 className="text-[24px] font-black leading-none tracking-tight truncate drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
                        {act.title}
                      </h3>
                      <p className="text-xs font-normal text-white/85 mt-1.5 truncate">
                        {formatShortDate(act.startTime)} · {act.location}
                      </p>
                    </div>
                    <span className="px-4 py-2 rounded-full bg-[#FF5A4F] text-white text-xs font-extrabold shrink-0 shadow-md">
                      {status === 'open' ? '去抢位' : getStatusLabel(status)}
                    </span>
                  </div>
                </button>
              );
            })()}

            {/* TOP 2 & TOP 3 双列摄影卡片：轻微内阴影 + 调大活动标题字号字重 */}
            {secondaryCurated.length > 0 && (
              <div className="grid grid-cols-2 gap-3">
                {secondaryCurated.map((rec, idx) => {
                  const act = rec.activity;
                  const status = computeActivityStatus(act, DEMO_NOW_ISO);
                  const isPressed = pressedCuratedId === act.id;
                  const rank = idx + 2;
                  return (
                    <button
                      key={act.id}
                      type="button"
                      data-testid="daily-curated-card"
                      data-pressed={isPressed ? 'true' : 'false'}
                      onClick={() => onSelectActivity(act.id)}
                      onPointerDown={() => setPressedCuratedId(act.id)}
                      onPointerUp={() => setPressedCuratedId(null)}
                      onPointerCancel={handleCardPointerReset}
                      onPointerLeave={handleCardPointerReset}
                      onPointerMove={(e) => handleCardPointerMove(e, act.id)}
                      onTouchStart={() => setPressedCuratedId(act.id)}
                      onTouchEnd={() => setPressedCuratedId(null)}
                      className={`relative h-[116px] rounded-[18px] overflow-hidden text-left group select-none cursor-pointer transition-transform duration-300 ease-out will-change-transform shadow-[0_6px_16px_rgba(23,23,23,0.07)] ${
                        isPressed
                          ? 'scale-[0.96]'
                          : 'hover:-translate-y-0.5 active:scale-[0.96]'
                      }`}
                    >
                      <div
                        className={`w-full h-full transition-transform duration-300 ease-out will-change-transform ${getCoverParallaxClass(
                          act.id
                        )}`}
                      >
                        <CoverArtwork
                          cover={act.cover}
                          title={act.title}
                          className="w-full h-full"
                        />
                      </div>

                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/15 shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.38),inset_0_-18px_28px_rgba(0,0,0,0.46),inset_0_0_0_1px_rgba(255,255,255,0.16)] pointer-events-none" />

                      <div className="absolute top-2.5 left-3 right-3 flex items-center justify-between gap-1">
                        <span className="px-2 py-0.5 rounded-md bg-black/65 text-white text-[11px] font-extrabold">
                          TOP {rank} · {rec.primaryInterest || act.category}
                        </span>
                        <span className="px-1.5 py-0.5 rounded-md bg-white/95 text-[#FF5A4F] text-[10px] font-extrabold tabular-nums">
                          {rec.matchScore}%
                        </span>
                      </div>

                      <div
                        className={`absolute bottom-2.5 left-3 right-3 text-white transition-transform duration-300 ease-out will-change-transform ${getContentParallaxClass(
                          act.id
                        )}`}
                      >
                        <h3 className="text-[17px] font-black leading-tight tracking-tight truncate drop-shadow-[0_2px_6px_rgba(0,0,0,0.5)]">
                          {act.title}
                        </h3>
                        <div className="flex items-center justify-between gap-1 text-[11px] font-normal text-white/80 mt-0.5">
                          <span className="truncate">
                            {act.subCampus ? act.subCampus.replace('校区', '') : act.category}
                          </span>
                          <span className="text-[#FF8A80] font-bold shrink-0">
                            {getStatusLabel(status)}
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      )}

      {/* 模块二：活动搭子 · 结伴同行（采用更轻盈的字号与字重，与上方活动主卡形成鲜明层级区分） */}
      {campusBuddyPosts.length > 0 && (
        <section
          aria-label="活动搭子与结伴"
          className="bg-white px-4 py-4 border-b-[8px] border-[#ECE9E2]"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="w-1 h-4 rounded-full bg-[#FF5A4F] shrink-0" />
              <h2 className="text-[16px] font-bold text-[#171717] tracking-tight leading-none">
                活动搭子
              </h2>
              <span className="text-xs font-normal text-[#8C7E79] pl-0.5">
                同场结伴 · 拒绝落单
              </span>
            </div>
            <button
              type="button"
              onClick={onJumpToBuddySquare}
              className="text-xs font-semibold text-[#FF5A4F] hover:opacity-80 flex items-center gap-0.5 bg-[#FFF0ED] px-2.5 py-1 rounded-full"
            >
              <Users className="w-3.5 h-3.5 mr-0.5" />
              <span>搭子广场</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {campusBuddyPosts.map((post) => {
              const isFull = post.currentCount >= post.maxCount;
              const remaining = Math.max(0, post.maxCount - post.currentCount);
              return (
                <div
                  key={post.id}
                  className="bg-[#FAF8F5] rounded-[20px] p-3.5 border border-[#EAE5DC] flex flex-col justify-between gap-2.5"
                >
                  {/* 上半部：搭子主题标签 + 13px 轻量结伴诉求 + 关联活动 */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-1.5">
                      <span className="text-[10px] font-bold text-[#FF5A4F] bg-[#FFF0ED] px-2 py-0.5 rounded-md shrink-0">
                        {post.tag}
                      </span>
                      <span className="text-[11px] font-normal text-[#8C7E79] truncate">
                        {post.subCampus.replace('校区', '')}
                      </span>
                    </div>

                    {/* 搭子招募标题：采用 13px font-semibold，与活动卡片的 17px-24px font-black 形成明显主次区分 */}
                    <h3 className="text-[13px] font-semibold text-[#3B3330] leading-snug line-clamp-1">
                      {post.title}
                    </h3>

                    <button
                      type="button"
                      onClick={() => onSelectActivity(post.activityId)}
                      className="inline-flex items-center max-w-full text-[11px] font-medium text-[#6E635F] bg-white px-2 py-0.5 rounded-lg border border-[#EAE5DC] hover:border-[#FF5A4F] hover:text-[#FF5A4F] transition-colors truncate"
                    >
                      <span className="truncate">#{post.activityTitle}</span>
                    </button>
                  </div>

                  {/* 下半部：发起人轻量化展示 + 缺口人数与操作按钮 */}
                  <div className="pt-2.5 border-t border-[#ECE7DF] flex items-center justify-between gap-1.5">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <div className="w-6 h-6 rounded-full bg-[#2B2523] text-white font-bold text-[11px] flex items-center justify-center shrink-0">
                        {post.authorName.slice(0, 1)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-[11px] font-medium text-[#3B3330] truncate leading-none">
                          {post.authorName}
                        </p>
                        <p className="text-[10px] font-semibold text-[#FF5A4F] mt-1 leading-none tabular-nums">
                          {isFull ? '已满员' : `差 ${remaining} 人 (${post.currentCount}/${post.maxCount})`}
                        </p>
                      </div>
                    </div>

                    {post.isMine ? (
                      <span className="px-2.5 py-1 rounded-full bg-[#FFF0ED] text-[#FF5A4F] text-[11px] font-bold shrink-0">
                        我发起
                      </span>
                    ) : post.isJoined ? (
                      <button
                        type="button"
                        onClick={() => onToggleJoinBuddy(post.id)}
                        className="px-3 py-1 rounded-full bg-[#EAE7E1] text-[#514744] text-xs font-semibold shrink-0"
                      >
                        已加入
                      </button>
                    ) : isFull ? (
                      <span className="px-2.5 py-1 rounded-full bg-[#EAE7E1] text-[#9A8984] text-[11px] font-semibold shrink-0">
                        已满
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onToggleJoinBuddy(post.id)}
                        className="px-3 py-1 rounded-full bg-[#FF5A4F] text-white text-xs font-bold active:scale-95 transition-transform shrink-0 shadow-[0_2px_8px_rgba(255,90,79,0.24)]"
                      >
                        加入
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 模块三：校园动态广场（正在发生 / 即将开始 / 热门活动） */}
      <div className="bg-white px-4 pt-5 pb-6 space-y-6">
        {/* 正在发生区域 */}
        {ongoingActivities.length > 0 && (
          <section aria-label="正在发生">
            <div className="flex items-center justify-between mb-3.5">
              <div className="flex items-center gap-2">
                <span className="w-1 h-5 rounded-full bg-[#171717] shrink-0" />
                <h2 className="text-[19px] font-black text-[#171717] tracking-tight leading-none">
                  正在发生
                </h2>
                <span className="text-xs font-normal text-[#8C7E79]">现场直击</span>
              </div>
            </div>
            <div className="space-y-3">
              {ongoingActivities.map((act) => (
                <button
                  key={act.id}
                  type="button"
                  onClick={() => onSelectActivity(act.id)}
                  className="w-full text-left bg-[#FAF8F5] rounded-[20px] p-3.5 border border-[#EAE5DC] shadow-[inset_0_2px_6px_rgba(23,23,23,0.05),inset_0_1px_0_rgba(255,255,255,0.85)] flex items-center gap-4 hover:border-[#FF5A4F]/40 transition-colors"
                >
                  <div className="relative w-24 h-20 rounded-2xl overflow-hidden shrink-0">
                    <CoverArtwork cover={act.cover} title={act.title} className="w-full h-full" />
                    <div className="absolute inset-0 shadow-[inset_0_2px_8px_rgba(0,0,0,0.22)] pointer-events-none" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-[18px] font-black tracking-tight text-[#171717] truncate">
                        {act.title}
                      </h3>
                      {renderStatusText(act)}
                    </div>
                    <p className="text-xs font-normal text-[#6E635F] mt-1.5 truncate">
                      {formatShortDate(act.startTime)}
                    </p>
                    <div className="flex items-center justify-between text-xs text-[#9A8984] mt-1.5 tabular-nums">
                      <span className="truncate">{act.location}</span>
                      <span className="shrink-0 ml-2 font-semibold text-[#514744]">
                        {act.registeredCount}/{act.capacity}人
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* 即将开始区域 */}
        {startingSoonActivities.length > 0 && (
          <section aria-label="即将开始">
            <div className="flex items-center justify-between mb-3.5">
              <div className="flex items-center gap-2">
                <span className="w-1 h-5 rounded-full bg-[#171717] shrink-0" />
                <h2 className="text-[19px] font-black text-[#171717] tracking-tight leading-none">
                  即将开始
                </h2>
              </div>
              <span className="text-xs font-normal text-[#8C7E79]">提前锁定名额</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {startingSoonActivities.map((act) => (
                <button
                  key={act.id}
                  type="button"
                  onClick={() => onSelectActivity(act.id)}
                  className="text-left bg-[#FAF8F5] rounded-[20px] overflow-hidden border border-[#EAE5DC] shadow-[inset_0_2px_6px_rgba(23,23,23,0.05),inset_0_1px_0_rgba(255,255,255,0.85)] flex flex-col hover:border-[#FF5A4F]/40 transition-colors"
                >
                  <div className="relative h-28 w-full">
                    <CoverArtwork cover={act.cover} title={act.title} className="w-full h-full" />
                    <div className="absolute inset-0 shadow-[inset_0_2px_10px_rgba(0,0,0,0.22)] pointer-events-none" />
                  </div>
                  <div className="p-3.5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-1 text-[11px] text-[#8C7E79]">
                        <span className="font-semibold">{act.category}</span>
                        {renderStatusText(act)}
                      </div>
                      <h3 className="text-[17px] font-black tracking-tight text-[#171717] mt-1 line-clamp-1">
                        {act.title}
                      </h3>
                    </div>
                    <div className="mt-2.5 pt-2.5 border-t border-[#ECE7DF] text-[11px] font-normal text-[#8C7E79] space-y-0.5 tabular-nums">
                      <p className="truncate">{formatShortDate(act.startTime)}</p>
                      <p className="truncate">{act.location}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* 热门活动区域 */}
        <section aria-label="热门活动">
          <div className="flex items-center justify-between mb-3.5">
            <div className="flex items-center gap-2">
              <span className="w-1 h-5 rounded-full bg-[#FF5A4F] shrink-0" />
              <h2 className="text-[19px] font-black text-[#171717] tracking-tight leading-none">
                热门活动
              </h2>
              <Flame className="w-4 h-4 text-[#FF5A4F]" />
            </div>
            <button
              type="button"
              onClick={() => onJumpToCategory('全部')}
              className="text-xs font-bold text-[#6E635F] hover:text-[#FF5A4F] flex items-center gap-0.5"
            >
              <span>查看全部</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="space-y-4">
            {hotActivities.map((act) => {
              const status = computeActivityStatus(act, DEMO_NOW_ISO);
              return (
                <div
                  key={act.id}
                  onClick={() => onSelectActivity(act.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') onSelectActivity(act.id);
                  }}
                  className="bg-[#FAF8F5] rounded-[20px] overflow-hidden border border-[#EAE5DC] shadow-[inset_0_2px_6px_rgba(23,23,23,0.05),inset_0_1px_0_rgba(255,255,255,0.85)] cursor-pointer hover:border-[#FF5A4F]/40 transition-colors"
                >
                  <div className="relative h-[148px] w-full">
                    <CoverArtwork cover={act.cover} title={act.title} className="w-full h-full" />
                    <div className="absolute inset-0 shadow-[inset_0_2px_12px_rgba(0,0,0,0.22)] pointer-events-none" />
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-[19px] font-black tracking-tight text-[#171717] truncate">
                        {act.title}
                      </h3>
                      <span
                        className={`text-xs font-extrabold shrink-0 ${
                          status === 'open'
                            ? 'text-[#FF5A4F]'
                            : status === 'full'
                            ? 'text-[#514744]'
                            : 'text-[#9A8984]'
                        }`}
                      >
                        {getStatusLabel(status)}
                      </span>
                    </div>
                    <div className="mt-2 space-y-1 text-xs font-normal text-[#6E635F]">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#9A8984] shrink-0" />
                        <span className="truncate">
                          {formatDateTimeRange(act.startTime, act.endTime)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <MapPin className="w-3.5 h-3.5 text-[#9A8984] shrink-0" />
                          <span className="truncate">{act.location}</span>
                        </div>
                        <span className="text-xs font-semibold text-[#514744] tabular-nums shrink-0">
                          {status === 'ended'
                            ? `${act.registeredCount}人已参与`
                            : `已报名 ${act.registeredCount}/${act.capacity} 人`}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
};

```

## src/components/ActivitiesPage.tsx
```tsx
import React, { useEffect, useRef, useState } from 'react';
import { Search, MapPin, ChevronRight, Clock, X, Users } from 'lucide-react';
import {
  Activity,
  ActivityCategory,
  BuddyPost,
  BuddyTag,
  StatusFilter,
  TimeRangeFilter,
} from '../types/activity';
import { CAMPUS_LIST, DEMO_NOW_ISO } from '../data/initialData';
import {
  computeActivityStatus,
  filterActivities,
  filterBuddyPosts,
  formatDateTimeRange,
  getStatusLabel,
} from '../utils/activityRules';
import { CoverArtwork } from './CoverArtwork';

interface ActivitiesPageProps {
  currentCampus: string;
  currentSubCampus: string;
  activities: Activity[];
  buddyPosts: BuddyPost[];
  viewMode: 'activities' | 'buddies';
  selectedCategory: ActivityCategory;
  searchKeyword: string;
  timeRange: TimeRangeFilter;
  statusFilter: StatusFilter;
  autoFocusSearch?: boolean;
  onChangeViewMode: (mode: 'activities' | 'buddies') => void;
  onChangeSubCampus: (subCampus: string) => void;
  onChangeCategory: (cat: ActivityCategory) => void;
  onChangeSearch: (kw: string) => void;
  onChangeTimeRange: (tr: TimeRangeFilter) => void;
  onChangeStatusFilter: (sf: StatusFilter) => void;
  onOpenCampusSelector: () => void;
  onSelectActivity: (activityId: string) => void;
  onToggleJoinBuddy: (buddyId: string) => void;
  onClearAutoFocus?: () => void;
}

const CATEGORIES: ActivityCategory[] = ['全部', '讲座', '比赛', '文体', '社团', '展览'];

const BUDDY_TAG_FILTERS: (BuddyTag | '全部')[] = [
  '全部',
  '同去现场',
  '组队参赛',
  '约拍互勉',
  '跨校区同行',
];

const TIME_FILTERS: { id: TimeRangeFilter; label: string }[] = [
  { id: 'all', label: '全部时间' },
  { id: 'today', label: '今天' },
  { id: 'week', label: '本周' },
  { id: 'month', label: '本月' },
];

const STATUS_FILTERS: { id: StatusFilter; label: string }[] = [
  { id: 'all', label: '全部状态' },
  { id: 'open', label: '报名中' },
  { id: 'full', label: '报名已满' },
  { id: 'closed', label: '报名已截止' },
  { id: 'ended', label: '已结束' },
  { id: 'upcoming', label: '即将开放' },
];

export const ActivitiesPage: React.FC<ActivitiesPageProps> = ({
  currentCampus,
  currentSubCampus,
  activities,
  buddyPosts,
  viewMode,
  selectedCategory,
  searchKeyword,
  timeRange,
  statusFilter,
  autoFocusSearch,
  onChangeViewMode,
  onChangeSubCampus,
  onChangeCategory,
  onChangeSearch,
  onChangeTimeRange,
  onChangeStatusFilter,
  onOpenCampusSelector,
  onSelectActivity,
  onToggleJoinBuddy,
  onClearAutoFocus,
}) => {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [selectedBuddyTag, setSelectedBuddyTag] = useState<BuddyTag | '全部'>('全部');
  const [onlyOpenBuddies, setOnlyOpenBuddies] = useState<boolean>(false);
  const [copiedBuddyId, setCopiedBuddyId] = useState<string | null>(null);

  const campusInfo =
    CAMPUS_LIST.find((c) => c.name === currentCampus) || CAMPUS_LIST[0];
  const subCampusOptions = ['全部校区', ...(campusInfo.subCampuses || [])];

  useEffect(() => {
    if (autoFocusSearch && searchInputRef.current) {
      searchInputRef.current.focus();
      onClearAutoFocus?.();
    }
  }, [autoFocusSearch, onClearAutoFocus]);

  const filteredList = filterActivities(
    activities,
    {
      campus: currentCampus,
      subCampus: currentSubCampus,
      category: selectedCategory,
      keyword: searchKeyword,
      timeRange,
      statusFilter,
    },
    DEMO_NOW_ISO
  );

  const filteredBuddies = filterBuddyPosts(buddyPosts, {
    campus: currentCampus,
    subCampus: currentSubCampus,
    tag: selectedBuddyTag,
    keyword: searchKeyword,
    onlyOpen: onlyOpenBuddies,
  });

  const handleResetFilters = () => {
    onChangeSubCampus('全部校区');
    onChangeCategory('全部');
    onChangeSearch('');
    onChangeTimeRange('all');
    onChangeStatusFilter('all');
    setSelectedBuddyTag('全部');
    setOnlyOpenBuddies(false);
  };

  const handleCopyCode = (id: string, code: string) => {
    navigator.clipboard?.writeText(code).catch(() => {});
    setCopiedBuddyId(id);
    setTimeout(() => setCopiedBuddyId(null), 2000);
  };

  return (
    <div className="pb-6">
      {/* 1. 顶部区域 */}
      <header className="px-5 pt-3 pb-3.5 bg-white border-b border-[#F0EEEC] sticky top-0 z-20">
        <div className="flex items-center justify-between gap-2">
          {/* 顶部视图切换：校园活动 / 找搭子广场 */}
          <div className="flex items-center gap-3.5 shrink-0">
            <button
              type="button"
              onClick={() => onChangeViewMode('activities')}
              className={`text-left transition-colors relative pb-1.5 whitespace-nowrap shrink-0 ${
                viewMode === 'activities'
                  ? 'text-[20px] font-bold tracking-tight text-[#171717]'
                  : 'text-[16px] font-semibold text-[#9A8984] hover:text-[#514744]'
              }`}
            >
              <span>校园活动</span>
              {viewMode === 'activities' && (
                <span className="absolute bottom-0 left-0 right-0 h-[3px] rounded-full bg-[#FF5A4F]" />
              )}
            </button>

            <button
              type="button"
              onClick={() => onChangeViewMode('buddies')}
              className={`text-left transition-colors relative pb-1.5 flex items-center gap-1 whitespace-nowrap shrink-0 ${
                viewMode === 'buddies'
                  ? 'text-[20px] font-bold tracking-tight text-[#171717]'
                  : 'text-[16px] font-semibold text-[#9A8984] hover:text-[#514744]'
              }`}
            >
              <span>找搭子</span>
              <span className="text-[11px] font-semibold px-1.5 py-0.5 rounded-full bg-[#FFF0ED] text-[#FF5A4F] tabular-nums">
                {buddyPosts.filter((b) => b.campus === currentCampus).length}
              </span>
              {viewMode === 'buddies' && (
                <span className="absolute bottom-0 left-0 right-0 h-[3px] rounded-full bg-[#FF5A4F]" />
              )}
            </button>
          </div>

          <button
            type="button"
            onClick={onOpenCampusSelector}
            aria-label={`切换学校，当前：${currentCampus}`}
            className="flex items-center gap-1 text-xs font-semibold text-[#171717] bg-[#F7F7F5] hover:bg-[#FFF0ED] hover:text-[#FF5A4F] px-2.5 py-1.5 rounded-full transition-colors max-w-[162px] min-w-0"
          >
            <MapPin className="w-3.5 h-3.5 text-[#FF5A4F] shrink-0" />
            <span className="truncate">{currentCampus}</span>
            <ChevronRight className="w-3.5 h-3.5 text-[#9A8984] shrink-0" />
          </button>
        </div>

        {/* 二级校内校区切换栏 */}
        {subCampusOptions.length > 1 && (
          <div
            role="tablist"
            aria-label="校内校区筛选"
            className="mt-2.5 p-1 rounded-[14px] bg-[#F7F7F5] flex items-center gap-1 overflow-x-auto no-scrollbar"
          >
            {subCampusOptions.map((sub) => {
              const active = currentSubCampus === sub;
              return (
                <button
                  key={sub}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => onChangeSubCampus(sub)}
                  className={`flex-1 min-w-[84px] py-1.5 px-2.5 rounded-[10px] text-xs font-semibold transition-all whitespace-nowrap ${
                    active
                      ? 'bg-white text-[#FF5A4F] shadow-[0_1px_2px_rgba(0,0,0,0.04)]'
                      : 'text-[#514744] hover:text-[#171717]'
                  }`}
                >
                  {sub}
                </button>
              );
            })}
          </div>
        )}

        {/* 2. 搜索区域 */}
        <div className="mt-2.5 relative">
          <Search className="w-4 h-4 text-[#9A8984] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchKeyword}
            onChange={(e) => onChangeSearch(e.target.value)}
            placeholder={
              viewMode === 'buddies'
                ? '搜索搭子主题、关联活动或院系'
                : '搜索活动名称、关键词'
            }
            aria-label="搜索活动名称、关键词"
            className="w-full h-10 pl-9 pr-9 rounded-[14px] bg-[#F7F7F5] text-sm text-[#171717] placeholder-[#9A8984] focus:outline-none focus:ring-1 focus:ring-[#FF5A4F]"
          />
          {searchKeyword && (
            <button
              type="button"
              onClick={() => onChangeSearch('')}
              aria-label="清除搜索关键词"
              className="w-7 h-7 rounded-full flex items-center justify-center text-[#9A8984] hover:text-[#171717] absolute right-1.5 top-1/2 -translate-y-1/2"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {viewMode === 'activities' ? (
          <>
            {/* 3. 活动分类导航 */}
            <div
              role="tablist"
              aria-label="活动分类导航"
              className="mt-3 flex items-center gap-1.5 overflow-x-auto no-scrollbar"
            >
              {CATEGORIES.map((cat) => {
                const active = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => onChangeCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 transition-colors ${
                      active
                        ? 'bg-[#FF5A4F] text-white'
                        : 'bg-[#F7F7F5] text-[#514744] hover:text-[#171717]'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* 4. 筛选区域（时间筛选 + 状态筛选） */}
            <div className="mt-2.5 pt-2.5 border-t border-[#F0EEEC] space-y-2">
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                {TIME_FILTERS.map((tf) => {
                  const active = timeRange === tf.id;
                  return (
                    <button
                      key={tf.id}
                      type="button"
                      onClick={() => onChangeTimeRange(tf.id)}
                      className={`px-2.5 py-1 rounded-lg text-xs whitespace-nowrap shrink-0 transition-colors ${
                        active
                          ? 'bg-[#FFF0ED] text-[#FF5A4F] font-semibold'
                          : 'text-[#9A8984] hover:text-[#514744]'
                      }`}
                    >
                      {tf.label}
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                {STATUS_FILTERS.map((sf) => {
                  const active = statusFilter === sf.id;
                  return (
                    <button
                      key={sf.id}
                      type="button"
                      onClick={() => onChangeStatusFilter(sf.id)}
                      className={`px-2.5 py-1 rounded-lg text-xs whitespace-nowrap shrink-0 transition-colors ${
                        active
                          ? 'bg-[#FFF0ED] text-[#FF5A4F] font-semibold'
                          : 'text-[#9A8984] hover:text-[#514744]'
                      }`}
                    >
                      {sf.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        ) : (
          /* 找搭子模式筛选栏 */
          <div className="mt-3 flex items-center justify-between gap-2">
            <div
              role="tablist"
              aria-label="结伴主题筛选"
              className="flex items-center gap-1.5 overflow-x-auto no-scrollbar"
            >
              {BUDDY_TAG_FILTERS.map((tag) => {
                const active = selectedBuddyTag === tag;
                return (
                  <button
                    key={tag}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setSelectedBuddyTag(tag)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 transition-colors ${
                      active
                        ? 'bg-[#FF5A4F] text-white'
                        : 'bg-[#F7F7F5] text-[#514744] hover:text-[#171717]'
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => setOnlyOpenBuddies((v) => !v)}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 border transition-colors ${
                onlyOpenBuddies
                  ? 'bg-[#FFF0ED] text-[#FF5A4F] border-[#FF5A4F]/30'
                  : 'bg-white text-[#9A8984] border-[#F0EEEC]'
              }`}
            >
              只看缺人
            </button>
          </div>
        )}
      </header>

      {/* 5. 列表内容区 */}
      {viewMode === 'activities' ? (
        <div className="px-5 pt-4 space-y-4">
          {filteredList.map((act) => {
            const computedStatus = computeActivityStatus(act, DEMO_NOW_ISO);
            const statusLabel = getStatusLabel(computedStatus);
            const actBuddyCount = buddyPosts.filter((b) => b.activityId === act.id).length;

            return (
              <article
                key={act.id}
                onClick={() => onSelectActivity(act.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') onSelectActivity(act.id);
                }}
                className="bg-white rounded-[18px] overflow-hidden border border-[#F0EEEC] cursor-pointer hover:border-[#FF5A4F]/40 transition-colors"
              >
                <div className="h-[152px] w-full relative">
                  <CoverArtwork cover={act.cover} title={act.title} className="w-full h-full" />
                </div>

                <div className="p-4">
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className="text-[#9A8984] font-medium">
                      {act.category}
                      {act.subCampus ? ` · ${act.subCampus}` : ''} · {act.organizer}
                    </span>
                    <span
                      className={`font-semibold shrink-0 ${
                        computedStatus === 'open'
                          ? 'text-[#FF5A4F]'
                          : computedStatus === 'full'
                          ? 'text-[#514744]'
                          : 'text-[#9A8984]'
                      }`}
                    >
                      {statusLabel}
                    </span>
                  </div>

                  <h2 className="text-[17px] font-bold text-[#171717] mt-1 leading-snug">
                    {act.title}
                  </h2>

                  <div className="mt-2.5 space-y-1 text-xs text-[#514744]">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#9A8984] shrink-0" />
                      <span className="truncate">
                        {formatDateTimeRange(act.startTime, act.endTime)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <MapPin className="w-3.5 h-3.5 text-[#9A8984] shrink-0" />
                        <span className="truncate">{act.location}</span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0 tabular-nums">
                        {actBuddyCount > 0 && (
                          <span className="text-[11px] font-medium text-[#FF5A4F] bg-[#FFF0ED] px-2 py-0.5 rounded-md">
                            {actBuddyCount}组搭子
                          </span>
                        )}
                        <span className="text-xs text-[#9A8984]">
                          {computedStatus === 'ended'
                            ? `${act.registeredCount}人已参与`
                            : `${act.registeredCount}/${act.capacity} 人`}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}

          {filteredList.length === 0 && (
            <div className="bg-white rounded-[18px] p-8 text-center border border-[#F0EEEC]">
              <p className="text-sm font-semibold text-[#171717]">没有找到符合筛选条件的活动</p>
              <p className="text-xs text-[#9A8984] mt-1">
                尝试切换分类或重置筛选条件查看全部校园活动
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="mt-4 px-5 py-2 rounded-full bg-[#FFF0ED] text-[#FF5A4F] text-xs font-semibold"
              >
                重置筛选条件
              </button>
            </div>
          )}
        </div>
      ) : (
        /* 找搭子广场列表 */
        <div className="px-5 pt-4 space-y-3.5">
          {filteredBuddies.map((post) => {
            const isFull = post.currentCount >= post.maxCount;
            return (
              <article
                key={post.id}
                className="bg-white rounded-[18px] p-4 border border-[#F0EEEC] space-y-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-9 h-9 rounded-full bg-[#FFF0ED] text-[#FF5A4F] font-bold text-sm flex items-center justify-center shrink-0">
                      {post.authorName.slice(0, 1)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-bold text-[#171717] truncate">
                          {post.authorName}
                        </span>
                        <span className="text-xs text-[#9A8984] shrink-0">
                          {post.subCampus}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#9A8984] truncate">
                        {post.authorGrade} · {post.authorDepartment}
                      </p>
                    </div>
                  </div>

                  <span className="text-xs font-semibold text-[#FF5A4F] bg-[#FFF0ED] px-2.5 py-1 rounded-lg shrink-0">
                    {post.tag}
                  </span>
                </div>

                <div>
                  <h2 className="text-[16px] font-bold text-[#171717] leading-snug">
                    {post.title}
                  </h2>
                  <p className="text-xs text-[#514744] mt-1.5 leading-relaxed">
                    {post.description}
                  </p>
                </div>

                {/* 关联活动与集合点 */}
                <div className="p-2.5 rounded-xl bg-[#F7F7F5] space-y-1.5 text-xs">
                  <button
                    type="button"
                    onClick={() => onSelectActivity(post.activityId)}
                    className="w-full flex items-center justify-between text-left text-[#171717] hover:text-[#FF5A4F] font-semibold"
                  >
                    <span className="truncate">关联活动：{post.activityTitle}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-[#9A8984] shrink-0" />
                  </button>
                  <div className="flex items-center gap-1.5 text-[11px] text-[#514744]">
                    <MapPin className="w-3.5 h-3.5 text-[#FF5A4F] shrink-0" />
                    <span className="truncate">集合地点：{post.meetingPoint}</span>
                  </div>
                </div>

                {/* 已加入或我发起时解锁联系暗号 */}
                {(post.isJoined || post.isMine) && (
                  <div className="p-2.5 rounded-xl bg-[#FFF0ED]/70 border border-[#FF5A4F]/20 flex items-center justify-between gap-2">
                    <div className="min-w-0 text-xs">
                      <span className="text-[#9A8984] block text-[11px]">
                        结伴联系暗号（已解锁）
                      </span>
                      <span className="font-semibold text-[#171717] truncate block mt-0.5">
                        {post.contactCode}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopyCode(post.id, post.contactCode)}
                      className="px-2.5 py-1 rounded-lg bg-white text-[#FF5A4F] text-xs font-semibold shrink-0"
                    >
                      {copiedBuddyId === post.id ? '已复制' : '复制'}
                    </button>
                  </div>
                )}

                <div className="pt-2 border-t border-[#F0EEEC] flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-xs text-[#514744] tabular-nums min-w-0 truncate">
                    <Users className="w-3.5 h-3.5 text-[#9A8984] shrink-0" />
                    <span className="font-semibold text-[#171717]">
                      {post.currentCount}/{post.maxCount}人
                    </span>
                    <span className="text-[#9A8984] truncate">
                      （{post.participants.join('、')}）
                    </span>
                  </div>

                  {post.isMine ? (
                    <span className="text-xs font-semibold text-[#FF5A4F] shrink-0">
                      我发起的
                    </span>
                  ) : post.isJoined ? (
                    <button
                      type="button"
                      onClick={() => onToggleJoinBuddy(post.id)}
                      className="px-3.5 py-1.5 rounded-full bg-[#F7F7F5] text-[#514744] hover:text-[#FF5A4F] text-xs font-semibold shrink-0"
                    >
                      已加入 · 退出
                    </button>
                  ) : isFull ? (
                    <span className="px-3.5 py-1.5 rounded-full bg-[#EAE9E7] text-[#99938F] text-xs font-semibold shrink-0">
                      已满员
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onToggleJoinBuddy(post.id)}
                      className="px-4 py-1.5 rounded-full bg-[#FF5A4F] text-white text-xs font-semibold shrink-0 active:scale-95 transition-transform"
                    >
                      加入结伴
                    </button>
                  )}
                </div>
              </article>
            );
          })}

          {filteredBuddies.length === 0 && (
            <div className="bg-white rounded-[18px] p-8 text-center border border-[#F0EEEC]">
              <p className="text-sm font-semibold text-[#171717]">暂无符合条件的活动搭子</p>
              <p className="text-xs text-[#9A8984] mt-1">
                可以切换校区或进入任意活动详情页发起新的结伴招募
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="mt-4 px-5 py-2 rounded-full bg-[#FFF0ED] text-[#FF5A4F] text-xs font-semibold"
              >
                重置筛选条件
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

```

## src/components/ActivityDetailPage.tsx
```tsx
import React, { useState } from 'react';
import {
  ArrowLeft,
  Heart,
  Share2,
  Clock,
  MapPin,
  Users,
  Building2,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Phone,
  X,
  Copy,
  Check,
  Plus,
  MessageSquareHeart,
} from 'lucide-react';
import { Activity, BuddyPost, BuddyTag, UserProfile } from '../types/activity';
import { DEMO_NOW_ISO } from '../data/initialData';
import {
  computeActivityStatus,
  formatDateTimeRange,
  formatShortDate,
  getStatusLabel,
} from '../utils/activityRules';
import { CoverArtwork } from './CoverArtwork';

interface ActivityDetailPageProps {
  activity: Activity;
  userProfile: UserProfile;
  buddyPosts: BuddyPost[];
  onBack: () => void;
  onToggleFavorite: (activityId: string) => void;
  onRegisterSuccess: (
    activityId: string,
    form: { attendeeName: string; studentId: string; phone: string; department: string; note?: string }
  ) => void;
  onToggleJoinBuddy: (buddyId: string) => void;
  onCreateBuddyPost: (data: {
    activityId: string;
    activityTitle: string;
    activityStartTime: string;
    campus: string;
    subCampus: string;
    tag: BuddyTag;
    title: string;
    description: string;
    meetingPoint: string;
    maxCount: number;
    contactCode: string;
  }) => void;
  onGoToMyRegistrations: () => void;
}

const BUDDY_TAGS: BuddyTag[] = ['同去现场', '组队参赛', '约拍互勉', '跨校区同行'];

export const ActivityDetailPage: React.FC<ActivityDetailPageProps> = ({
  activity,
  userProfile,
  buddyPosts,
  onBack,
  onToggleFavorite,
  onRegisterSuccess,
  onToggleJoinBuddy,
  onCreateBuddyPost,
  onGoToMyRegistrations,
}) => {
  const [showRegisterSheet, setShowRegisterSheet] = useState(false);
  const [showShareSheet, setShowShareSheet] = useState(false);
  const [showCreateBuddySheet, setShowCreateBuddySheet] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);
  const [copiedBuddyId, setCopiedBuddyId] = useState<string | null>(null);
  const [justRegisteredBanner, setJustRegisteredBanner] = useState(false);

  // Create buddy form state
  const [buddyTag, setBuddyTag] = useState<BuddyTag>('同去现场');
  const [buddyTitle, setBuddyTitle] = useState('');
  const [buddyDesc, setBuddyDesc] = useState('');
  const [buddyMeetingPoint, setBuddyMeetingPoint] = useState(`${activity.location}入口`);
  const [buddyMaxCount, setBuddyMaxCount] = useState(4);
  const [buddyContact, setBuddyContact] = useState(`微信：${userProfile.phone}（备注：${activity.title}搭子）`);
  const [buddyError, setBuddyError] = useState('');

  const activityBuddies = buddyPosts.filter((b) => b.activityId === activity.id);

  const [attendeeName, setAttendeeName] = useState(userProfile.nickname);
  const [studentId, setStudentId] = useState(userProfile.studentId);
  const [department, setDepartment] = useState(userProfile.department);
  const [phone, setPhone] = useState(userProfile.phone);
  const [note, setNote] = useState('');
  const [formError, setFormError] = useState('');

  const status = computeActivityStatus(activity, DEMO_NOW_ISO);
  const statusLabel = getStatusLabel(status);
  const remainingSpots = Math.max(0, activity.capacity - activity.registeredCount);
  const progressPercent = Math.min(
    100,
    Math.round((activity.registeredCount / Math.max(1, activity.capacity)) * 100)
  );

  const handleConfirmRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    if (!attendeeName.trim() || !studentId.trim() || !phone.trim() || !department.trim()) {
      setFormError('请完整填写姓名、学号、所属院系和联系电话');
      return;
    }
    setFormError('');
    onRegisterSuccess(activity.id, {
      attendeeName: attendeeName.trim(),
      studentId: studentId.trim(),
      phone: phone.trim(),
      department: department.trim(),
      note: note.trim() || undefined,
    });
    setShowRegisterSheet(false);
    setJustRegisteredBanner(true);
  };

  const handleCopyShareLink = () => {
    const shareText = `【一场 · 校园活动】${activity.title}（${activity.location}），快来一起参加吧！`;
    navigator.clipboard?.writeText(shareText).catch(() => {});
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
  };

  const handleCopyBuddyContact = (id: string, code: string) => {
    navigator.clipboard?.writeText(code).catch(() => {});
    setCopiedBuddyId(id);
    setTimeout(() => setCopiedBuddyId(null), 2000);
  };

  const handleCreateBuddySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!buddyTitle.trim() || !buddyDesc.trim() || !buddyContact.trim()) {
      setBuddyError('请完整填写结伴标题、结伴说明和联系暗号');
      return;
    }
    setBuddyError('');
    onCreateBuddyPost({
      activityId: activity.id,
      activityTitle: activity.title,
      activityStartTime: activity.startTime,
      campus: activity.campus,
      subCampus: activity.subCampus || '清远校区',
      tag: buddyTag,
      title: buddyTitle.trim(),
      description: buddyDesc.trim(),
      meetingPoint: buddyMeetingPoint.trim() || `${activity.location}入口`,
      maxCount: buddyMaxCount,
      contactCode: buddyContact.trim(),
    });
    setBuddyTitle('');
    setBuddyDesc('');
    setShowCreateBuddySheet(false);
  };

  // Bottom primary button configuration per state A / B / C / D / E
  const renderPrimaryActionButton = () => {
    if (status === 'open') {
      if (activity.isRegistered) {
        return (
          <button
            type="button"
            disabled
            className="flex-1 h-[50px] rounded-[26px] bg-[#FFF0ED] text-[#FF5A4F] font-semibold text-[15px] flex items-center justify-center cursor-default"
          >
            已报名
          </button>
        );
      }
      return (
        <button
          type="button"
          onClick={() => setShowRegisterSheet(true)}
          className="flex-1 h-[50px] rounded-[26px] bg-[#FF5A4F] text-white font-semibold text-[15px] flex items-center justify-center transition-transform active:scale-[0.99]"
        >
          立即报名
        </button>
      );
    }

    if (status === 'full') {
      return (
        <button
          type="button"
          disabled
          className="flex-1 h-[50px] rounded-[26px] bg-[#EAE9E7] text-[#99938F] font-semibold text-[15px] flex items-center justify-center cursor-not-allowed"
        >
          报名已满
        </button>
      );
    }

    if (status === 'closed') {
      return (
        <button
          type="button"
          disabled
          className="flex-1 h-[50px] rounded-[26px] bg-[#EAE9E7] text-[#99938F] font-semibold text-[15px] flex items-center justify-center cursor-not-allowed"
        >
          报名已截止
        </button>
      );
    }

    if (status === 'ended') {
      return (
        <button
          type="button"
          disabled
          className="flex-1 h-[50px] rounded-[26px] bg-[#EAE9E7] text-[#99938F] font-semibold text-[15px] flex items-center justify-center cursor-not-allowed"
        >
          活动已结束
        </button>
      );
    }

    // status === 'upcoming'
    return (
      <button
        type="button"
        disabled
        className="flex-1 h-[50px] rounded-[26px] bg-[#EAE9E7] text-[#99938F] font-semibold text-[15px] flex items-center justify-center cursor-not-allowed"
      >
        暂未开放
      </button>
    );
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-[#F7F7F5]">
      <div className="flex-1 overflow-y-auto pb-6">
        {/* 顶部封面 + 返回按钮 + 收藏按钮 */}
        <div className="relative h-[216px] w-full">
        <CoverArtwork cover={activity.cover} title={activity.title} className="w-full h-full" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-transparent to-black/35" />

        <div className="absolute top-3 left-4 right-4 flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            aria-label="返回上一页"
            className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/60 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={() => onToggleFavorite(activity.id)}
            aria-label={activity.favorite ? '取消收藏活动' : '收藏活动'}
            className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/60 transition-colors"
          >
            <Heart
              className={`w-5 h-5 ${
                activity.favorite ? 'fill-[#FF5A4F] text-[#FF5A4F]' : 'text-white'
              }`}
            />
          </button>
        </div>
      </div>

      {/* 主体内容 */}
      <div className="px-5 -mt-4 relative z-10 space-y-4">
        {/* 状态 D（已结束）顶部温馨提示栏 */}
        {status === 'ended' && (
          <div className="bg-white rounded-[18px] px-4 py-3 border border-[#F0EEEC] flex items-center gap-2.5 text-xs text-[#514744]">
            <AlertCircle className="w-4 h-4 text-[#9A8984] shrink-0" />
            <span>本场活动已结束，感谢关注。</span>
          </div>
        )}

        {/* 报名成功即时反馈横幅 */}
        {justRegisteredBanner && (
          <div className="bg-[#FFF0ED] rounded-[18px] p-4 border border-[#FF5A4F]/30 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <CheckCircle2 className="w-5 h-5 text-[#FF5A4F] shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-bold text-[#171717]">报名成功！名额已锁定</p>
                <p className="text-xs text-[#514744] truncate">
                  已同步至您的个人报名记录
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onGoToMyRegistrations}
              className="text-xs font-semibold text-[#FF5A4F] whitespace-nowrap shrink-0 underline"
            >
              查看我的报名
            </button>
          </div>
        )}

        {/* 如果该活动已满员或已结束，但用户此前已报名，提示已报名记录 */}
        {activity.isRegistered && status !== 'open' && (
          <div className="bg-white rounded-[18px] px-4 py-3 border border-[#F0EEEC] flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs text-[#514744]">
              <CheckCircle2 className="w-4 h-4 text-[#FF5A4F] shrink-0" />
              <span>您已报名过本场活动</span>
            </div>
            <button
              type="button"
              onClick={onGoToMyRegistrations}
              className="text-xs font-semibold text-[#FF5A4F] shrink-0"
            >
              我的报名
            </button>
          </div>
        )}

        {/* 活动核心信息卡片 */}
        <section className="bg-white rounded-[18px] p-4 border border-[#F0EEEC]">
          <div className="flex items-center justify-between gap-2 text-xs">
            <span className="text-[#9A8984] font-medium">
              {activity.category} · {activity.campus}
              {activity.subCampus ? ` (${activity.subCampus})` : ''}
            </span>
            <span
              className={`font-semibold ${
                status === 'open'
                  ? 'text-[#FF5A4F]'
                  : status === 'full'
                  ? 'text-[#514744]'
                  : 'text-[#9A8984]'
              }`}
            >
              {statusLabel}
            </span>
          </div>

          <h1 className="text-[20px] font-bold text-[#171717] mt-1.5 leading-snug">
            {activity.title}
          </h1>

          {/* 报名人数与进度条展示（严格遵循五种状态规范） */}
          <div className="mt-3.5 pt-3.5 border-t border-[#F0EEEC]">
            {status === 'ended' ? (
              <div className="flex items-center justify-between text-xs text-[#514744] tabular-nums">
                <span>历史参与统计</span>
                <span className="font-semibold text-[#171717]">
                  {activity.registeredCount}人已参与
                </span>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between text-xs tabular-nums">
                  <span className="text-[#514744]">
                    当前报名：<strong className="text-[#171717]">{activity.registeredCount}/{activity.capacity} 人</strong>
                  </span>
                  {status === 'open' && (
                    <span className="text-[#FF5A4F] font-semibold">
                      剩余 {remainingSpots} 个名额
                    </span>
                  )}
                  {status === 'full' && (
                    <span className="text-[#9A8984] font-medium">100% 满额</span>
                  )}
                  {status === 'closed' && (
                    <span className="text-[#9A8984]">报名通道已关闭</span>
                  )}
                  {status === 'upcoming' && (
                    <span className="text-[#9A8984]">
                      {formatShortDate(activity.registrationStartTime)} 开放报名
                    </span>
                  )}
                </div>
                <div className="mt-2 h-2 w-full rounded-full bg-[#F0EEEC] overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      status === 'open' ? 'bg-[#FF5A4F]' : 'bg-[#9A8984]'
                    }`}
                    style={{ width: `${status === 'full' ? 100 : progressPercent}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* 时间、地点、主办方列表 */}
          <div className="mt-4 pt-3.5 border-t border-[#F0EEEC] space-y-2.5 text-xs text-[#514744]">
            <div className="flex items-start gap-2.5">
              <Clock className="w-4 h-4 text-[#FF5A4F] shrink-0 mt-0.5" />
              <div>
                <span className="text-[#9A8984] block">活动时间</span>
                <span className="font-medium text-[#171717] mt-0.5 block">
                  {formatDateTimeRange(activity.startTime, activity.endTime)}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Calendar className="w-4 h-4 text-[#FF5A4F] shrink-0 mt-0.5" />
              <div>
                <span className="text-[#9A8984] block">报名起止时间</span>
                <span className="font-medium text-[#171717] mt-0.5 block">
                  {formatDateTimeRange(
                    activity.registrationStartTime,
                    activity.registrationDeadline
                  )}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-[#FF5A4F] shrink-0 mt-0.5" />
              <div>
                <span className="text-[#9A8984] block">活动地点</span>
                <span className="font-medium text-[#171717] mt-0.5 block">
                  {activity.location}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Building2 className="w-4 h-4 text-[#FF5A4F] shrink-0 mt-0.5" />
              <div>
                <span className="text-[#9A8984] block">主办方</span>
                <span className="font-medium text-[#171717] mt-0.5 block">
                  {activity.organizer}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 同场找搭子 · 结伴同行模块 */}
        <section
          aria-label="同场找搭子与结伴同行"
          className="bg-white rounded-[18px] p-4 border border-[#F0EEEC]"
        >
          <div className="flex items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-[16px] font-bold text-[#171717]">同场找搭子 · 结伴同行</h2>
                <span className="text-xs font-semibold text-[#FF5A4F] tabular-nums">
                  ({activityBuddies.length})
                </span>
              </div>
              <p className="text-xs text-[#9A8984] mt-0.5">
                找同好一起去现场、跨专业组队或互拍返图
              </p>
            </div>
            {status !== 'ended' && (
              <button
                type="button"
                onClick={() => setShowCreateBuddySheet(true)}
                className="px-3 py-1.5 rounded-full bg-[#FFF0ED] text-[#FF5A4F] text-xs font-semibold flex items-center gap-1 shrink-0 active:scale-95 transition-transform"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>发起结伴</span>
              </button>
            )}
          </div>

          <div className="mt-3.5 space-y-3">
            {activityBuddies.map((post) => {
              const isFull = post.currentCount >= post.maxCount;
              return (
                <div
                  key={post.id}
                  className="p-3.5 rounded-[16px] bg-[#F7F7F5] border border-[#F0EEEC] space-y-2.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-7 h-7 rounded-full bg-[#FFF0ED] text-[#FF5A4F] font-bold text-xs flex items-center justify-center shrink-0">
                        {post.authorName.slice(0, 1)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-[#171717] truncate">
                            {post.authorName}
                          </span>
                          <span className="text-[11px] text-[#9A8984] truncate">
                            {post.authorGrade} · {post.authorDepartment.split('·')[0].trim()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <span className="text-[11px] font-semibold text-[#FF5A4F] bg-white px-2 py-0.5 rounded-md border border-[#FF5A4F]/20 shrink-0">
                      {post.tag}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-[#171717]">{post.title}</h3>
                    <p className="text-xs text-[#514744] mt-1 leading-relaxed">
                      {post.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 text-[11px] text-[#9A8984]">
                    <MapPin className="w-3 h-3 text-[#FF5A4F] shrink-0" />
                    <span className="truncate">集合：{post.meetingPoint}</span>
                  </div>

                  {/* 已加入或我发起的：展示联系暗号 */}
                  {(post.isJoined || post.isMine) && (
                    <div className="p-2.5 rounded-xl bg-white border border-[#F0EEEC] flex items-center justify-between gap-2">
                      <div className="min-w-0 text-xs">
                        <span className="text-[#9A8984] block text-[11px]">
                          结伴联系暗号（已解锁）
                        </span>
                        <span className="font-semibold text-[#171717] truncate block mt-0.5">
                          {post.contactCode}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopyBuddyContact(post.id, post.contactCode)}
                        className="px-2.5 py-1 rounded-lg bg-[#FFF0ED] text-[#FF5A4F] text-[11px] font-semibold shrink-0"
                      >
                        {copiedBuddyId === post.id ? '已复制' : '复制'}
                      </button>
                    </div>
                  )}

                  <div className="pt-2 border-t border-[#F0EEEC] flex items-center justify-between gap-2">
                    <div className="text-xs text-[#514744] tabular-nums min-w-0 truncate">
                      <span className="font-semibold text-[#171717]">
                        {post.currentCount}/{post.maxCount}人
                      </span>
                      <span className="text-[#9A8984] ml-1.5">
                        已加入：{post.participants.join('、')}
                      </span>
                    </div>

                    {post.isMine ? (
                      <span className="text-xs font-semibold text-[#FF5A4F] shrink-0">
                        我发起的
                      </span>
                    ) : post.isJoined ? (
                      <button
                        type="button"
                        onClick={() => onToggleJoinBuddy(post.id)}
                        className="px-3 py-1 rounded-full bg-white border border-[#F0EEEC] text-xs font-medium text-[#514744] hover:text-[#FF5A4F] shrink-0"
                      >
                        已加入 · 退出
                      </button>
                    ) : isFull ? (
                      <span className="px-3 py-1 rounded-full bg-[#EAE9E7] text-[#99938F] text-xs font-semibold shrink-0">
                        已满员
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onToggleJoinBuddy(post.id)}
                        className="px-3.5 py-1 rounded-full bg-[#FF5A4F] text-white text-xs font-semibold shrink-0 active:scale-95 transition-transform"
                      >
                        加入结伴
                      </button>
                    )}
                  </div>
                </div>
              );
            })}

            {activityBuddies.length === 0 && (
              <div className="p-5 rounded-[16px] bg-[#F7F7F5] text-center space-y-2">
                <MessageSquareHeart className="w-6 h-6 text-[#FF5A4F] mx-auto" />
                <p className="text-xs font-semibold text-[#171717]">
                  这场活动还没有同学发起结伴
                </p>
                <p className="text-[11px] text-[#9A8984]">
                  发起第一个搭子招募，认识志同道合的新朋友吧！
                </p>
                {status !== 'ended' && (
                  <button
                    type="button"
                    onClick={() => setShowCreateBuddySheet(true)}
                    className="mt-1 px-4 py-1.5 rounded-full bg-[#FF5A4F] text-white text-xs font-semibold"
                  >
                    发起本场结伴
                  </button>
                )}
              </div>
            )}
          </div>
        </section>

        {/* 正文区域 1：活动介绍 */}
        <section className="bg-white rounded-[18px] p-4 border border-[#F0EEEC]">
          <h2 className="text-[16px] font-bold text-[#171717]">活动介绍</h2>
          <p className="text-sm text-[#514744] leading-relaxed mt-2 whitespace-pre-line">
            {activity.description}
          </p>
        </section>

        {/* 正文区域 2：活动流程 */}
        {activity.schedule && activity.schedule.length > 0 && (
          <section className="bg-white rounded-[18px] p-4 border border-[#F0EEEC]">
            <h2 className="text-[16px] font-bold text-[#171717]">活动流程</h2>
            <div className="mt-3 space-y-3.5">
              {activity.schedule.map((step, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#FFF0ED] text-[#FF5A4F] text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 tabular-nums">
                    {idx + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-xs font-semibold text-[#FF5A4F] tabular-nums">
                      {step.time}
                    </span>
                    <h3 className="text-sm font-semibold text-[#171717] mt-0.5">
                      {step.title}
                    </h3>
                    <p className="text-xs text-[#514744] mt-0.5">{step.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 正文区域 3：活动地点与活动要求 */}
        <section className="bg-white rounded-[18px] p-4 border border-[#F0EEEC] space-y-4">
          <div>
            <h2 className="text-[16px] font-bold text-[#171717]">活动地点</h2>
            <div className="mt-2 p-3 rounded-xl bg-[#F7F7F5] flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <MapPin className="w-4 h-4 text-[#FF5A4F] shrink-0" />
                <span className="text-xs font-medium text-[#171717] truncate">
                  {activity.campus} · {activity.location}
                </span>
              </div>
              <span className="text-[11px] text-[#9A8984] shrink-0">校内导航可达</span>
            </div>
          </div>

          <div className="pt-3 border-t border-[#F0EEEC]">
            <h2 className="text-[16px] font-bold text-[#171717]">活动要求</h2>
            <ul className="mt-2 space-y-1.5 text-xs text-[#514744]">
              {activity.requirements.map((req, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-[#FF5A4F] font-bold">·</span>
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 正文区域 4：主办方信息 */}
        <section className="bg-white rounded-[18px] p-4 border border-[#F0EEEC]">
          <h2 className="text-[16px] font-bold text-[#171717]">主办方信息</h2>
          <div className="mt-2.5 flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FFF0ED] text-[#FF5A4F] flex items-center justify-center font-bold text-sm shrink-0">
              {activity.organizer.slice(0, 1)}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-bold text-[#171717]">{activity.organizer}</h3>
              <p className="text-xs text-[#514744] mt-1">{activity.organizerInfo}</p>
              <div className="flex items-center gap-1.5 text-xs text-[#9A8984] mt-2">
                <Phone className="w-3.5 h-3.5" />
                <span>咨询联系：{activity.contact}</span>
              </div>
            </div>
          </div>
        </section>

        {/* 状态 D 专属：活动回顾区域 */}
        {status === 'ended' && activity.recap && (
          <section className="bg-white rounded-[18px] p-4 border border-[#F0EEEC]">
            <div className="flex items-center justify-between">
              <h2 className="text-[16px] font-bold text-[#171717]">活动回顾</h2>
              <span className="text-xs text-[#FF5A4F] font-medium">精彩纪实</span>
            </div>
            <p className="text-sm text-[#514744] leading-relaxed mt-2">
              {activity.recap.summary}
            </p>
            <div className="mt-3 p-3 rounded-xl bg-[#F7F7F5] space-y-1.5">
              {activity.recap.highlights.map((hl, idx) => (
                <p key={idx} className="text-xs text-[#171717] flex items-start gap-2">
                  <span className="text-[#FF5A4F] font-bold">✓</span>
                  <span>{hl}</span>
                </p>
              ))}
            </div>
            {activity.recap.attendeeFeedback.length > 0 && (
              <div className="mt-3 space-y-2.5 pt-3 border-t border-[#F0EEEC]">
                <p className="text-xs font-semibold text-[#9A8984]">参与同学评价</p>
                {activity.recap.attendeeFeedback.map((fb, idx) => (
                  <div key={idx} className="text-xs bg-[#F7F7F5] p-3 rounded-xl">
                    <div className="flex items-center justify-between text-[#9A8984]">
                      <span className="font-semibold text-[#171717]">{fb.user}</span>
                      <span>{fb.department}</span>
                    </div>
                    <p className="text-[#514744] mt-1">“{fb.comment}”</p>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
        </div>
      </div>

      {/* 底部固定操作栏：收藏、分享、主要操作按钮 */}
      <div className="shrink-0 z-30 bg-white border-t border-[#F0EEEC] px-5 py-2.5 flex items-center gap-3">
        <button
          type="button"
          onClick={() => onToggleFavorite(activity.id)}
          aria-label={activity.favorite ? '已收藏，点击取消收藏' : '收藏'}
          className="flex flex-col items-center justify-center min-w-[48px] min-h-[48px] text-xs text-[#514744] hover:text-[#FF5A4F] transition-colors"
        >
          <Heart
            className={`w-5 h-5 ${
              activity.favorite ? 'fill-[#FF5A4F] text-[#FF5A4F]' : 'text-[#514744]'
            }`}
          />
          <span className="text-[11px] mt-0.5">{activity.favorite ? '已收藏' : '收藏'}</span>
        </button>

        <button
          type="button"
          onClick={() => setShowShareSheet(true)}
          aria-label="分享活动"
          className="flex flex-col items-center justify-center min-w-[48px] min-h-[48px] text-xs text-[#514744] hover:text-[#FF5A4F] transition-colors"
        >
          <Share2 className="w-5 h-5" />
          <span className="text-[11px] mt-0.5">分享</span>
        </button>

        {renderPrimaryActionButton()}
      </div>

      {/* 报名确认弹窗 Sheet */}
      {showRegisterSheet && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="确认报名信息"
          className="fixed inset-0 z-50 bg-black/50 flex items-end justify-center"
        >
          <div className="w-full max-w-[430px] bg-white rounded-t-[24px] p-5 space-y-4 animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-[18px] font-bold text-[#171717]">填写报名信息</h3>
                <p className="text-xs text-[#9A8984] mt-0.5">
                  {activity.title} · 剩余 {remainingSpots} 个名额
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowRegisterSheet(false)}
                aria-label="关闭报名弹窗"
                className="w-8 h-8 rounded-full bg-[#F7F7F5] flex items-center justify-center text-[#514744]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmRegistration} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-[#514744] mb-1">
                  真实姓名 <span className="text-[#FF5A4F]">*</span>
                </label>
                <input
                  type="text"
                  value={attendeeName}
                  onChange={(e) => setAttendeeName(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-[#F7F7F5] text-sm text-[#171717] border border-[#F0EEEC] focus:outline-none focus:border-[#FF5A4F]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#514744] mb-1">
                    学号 <span className="text-[#FF5A4F]">*</span>
                  </label>
                  <input
                    type="text"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-[#F7F7F5] text-sm text-[#171717] border border-[#F0EEEC] focus:outline-none focus:border-[#FF5A4F]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#514744] mb-1">
                    联系电话 <span className="text-[#FF5A4F]">*</span>
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-[#F7F7F5] text-sm text-[#171717] border border-[#F0EEEC] focus:outline-none focus:border-[#FF5A4F]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#514744] mb-1">
                  所属学院与专业 <span className="text-[#FF5A4F]">*</span>
                </label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-[#F7F7F5] text-sm text-[#171717] border border-[#F0EEEC] focus:outline-none focus:border-[#FF5A4F]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#514744] mb-1">
                  报名备注（选填）
                </label>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="如有同行同学或特殊说明可填写"
                  className="w-full h-10 px-3 rounded-xl bg-[#F7F7F5] text-sm text-[#171717] border border-[#F0EEEC] focus:outline-none focus:border-[#FF5A4F]"
                />
              </div>

              {formError && <p className="text-xs text-[#FF5A4F]">{formError}</p>}

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowRegisterSheet(false)}
                  className="w-1/3 h-[50px] rounded-[26px] bg-[#F7F7F5] text-[#514744] font-semibold text-sm"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="flex-1 h-[50px] rounded-[26px] bg-[#FF5A4F] text-white font-semibold text-[15px]"
                >
                  确认提交报名
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 分享弹窗 Sheet */}
      {showShareSheet && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="分享活动"
          className="fixed inset-0 z-50 bg-black/50 flex items-end justify-center"
        >
          <div className="w-full max-w-[430px] bg-white rounded-t-[24px] p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[#171717]">分享给同校好友</h3>
              <button
                type="button"
                onClick={() => setShowShareSheet(false)}
                aria-label="关闭分享弹窗"
                className="w-8 h-8 rounded-full bg-[#F7F7F5] flex items-center justify-center"
              >
                <X className="w-4 h-4 text-[#514744]" />
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#F7F7F5] text-xs text-[#514744] space-y-1">
              <p className="font-bold text-[#171717]">{activity.title}</p>
              <p>
                时间：{formatDateTimeRange(activity.startTime, activity.endTime)}
              </p>
              <p>
                地点：{activity.campus} · {activity.location}
              </p>
            </div>

            <button
              type="button"
              onClick={handleCopyShareLink}
              className="w-full h-[50px] rounded-[26px] bg-[#FF5A4F] text-white font-semibold text-sm flex items-center justify-center gap-2"
            >
              {copiedShare ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>已复制活动邀请口令</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>复制活动邀请链接与口令</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* 发起结伴弹窗 Sheet */}
      {showCreateBuddySheet && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="发起活动结伴"
          className="fixed inset-0 z-50 bg-black/50 flex items-end justify-center"
        >
          <div className="w-full max-w-[430px] bg-white rounded-t-[24px] p-5 space-y-3.5 max-h-[88dvh] overflow-y-auto no-scrollbar">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-[18px] font-bold text-[#171717]">发起同场结伴</h3>
                <p className="text-xs text-[#9A8984] mt-0.5 truncate">
                  关联活动：{activity.title}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateBuddySheet(false)}
                aria-label="关闭发起结伴弹窗"
                className="w-8 h-8 rounded-full bg-[#F7F7F5] flex items-center justify-center text-[#514744]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateBuddySubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#171717] mb-1.5">
                  结伴主题标签
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {BUDDY_TAGS.map((t) => {
                    const active = buddyTag === t;
                    return (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setBuddyTag(t)}
                        className={`py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                          active
                            ? 'bg-[#FF5A4F] text-white'
                            : 'bg-[#F7F7F5] text-[#514744]'
                        }`}
                      >
                        {t}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#171717] mb-1">
                  结伴一句话标题 <span className="text-[#FF5A4F]">*</span>
                </label>
                <input
                  type="text"
                  value={buddyTitle}
                  onChange={(e) => setBuddyTitle(e.target.value)}
                  placeholder="例如：草坪前排一起听歌合唱，带了野餐垫！"
                  aria-label="结伴一句话标题"
                  className="w-full h-10 px-3 rounded-xl bg-[#F7F7F5] text-sm text-[#171717] border border-[#F0EEEC] focus:outline-none focus:border-[#FF5A4F]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#171717] mb-1">
                  详细说明与期待搭子 <span className="text-[#FF5A4F]">*</span>
                </label>
                <textarea
                  rows={2}
                  value={buddyDesc}
                  onChange={(e) => setBuddyDesc(e.target.value)}
                  placeholder="介绍一下你的计划、出发时间或组队分工需求..."
                  aria-label="详细说明与期待搭子"
                  className="w-full p-3 rounded-xl bg-[#F7F7F5] text-sm text-[#171717] border border-[#F0EEEC] focus:outline-none focus:border-[#FF5A4F] resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#171717] mb-1">
                    目标总人数（含自己）
                  </label>
                  <div className="flex items-center gap-1.5">
                    {[2, 3, 4, 6].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setBuddyMaxCount(num)}
                        className={`flex-1 h-9 rounded-xl text-xs font-semibold tabular-nums ${
                          buddyMaxCount === num
                            ? 'bg-[#FFF0ED] text-[#FF5A4F] border border-[#FF5A4F]'
                            : 'bg-[#F7F7F5] text-[#514744]'
                        }`}
                      >
                        {num}人
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#171717] mb-1">
                    集合地点
                  </label>
                  <input
                    type="text"
                    value={buddyMeetingPoint}
                    onChange={(e) => setBuddyMeetingPoint(e.target.value)}
                    aria-label="集合地点"
                    className="w-full h-9 px-3 rounded-xl bg-[#F7F7F5] text-xs text-[#171717] border border-[#F0EEEC]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#171717] mb-1">
                  联系微信号 / 进群口令（仅加入成员可见） <span className="text-[#FF5A4F]">*</span>
                </label>
                <input
                  type="text"
                  value={buddyContact}
                  onChange={(e) => setBuddyContact(e.target.value)}
                  aria-label="联系微信号或进群口令"
                  className="w-full h-10 px-3 rounded-xl bg-[#F7F7F5] text-xs text-[#171717] border border-[#F0EEEC]"
                />
              </div>

              {buddyError && <p className="text-xs text-[#FF5A4F]">{buddyError}</p>}

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateBuddySheet(false)}
                  className="w-1/3 h-[48px] rounded-[24px] bg-[#F7F7F5] text-[#514744] font-semibold text-sm"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="flex-1 h-[48px] rounded-[24px] bg-[#FF5A4F] text-white font-semibold text-[15px]"
                >
                  发布结伴招募
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

```

## src/components/PublishPage.tsx
```tsx
import React, { useState } from 'react';
import {
  Upload,
  CheckCircle2,
  Clock,
  MapPin,
  Building2,
  Calendar,
  Phone,
  ArrowLeft,
  Save,
  Eye,
  Sparkles,
} from 'lucide-react';
import { ActivityCategory, PublishFormData } from '../types/activity';
import { CAMPUS_LIST } from '../data/initialData';
import { COVER_PRESETS, CoverArtwork } from './CoverArtwork';
import { formatDateTimeRange, validatePublishForm } from '../utils/activityRules';

interface PublishPageProps {
  currentCampus: string;
  currentSubCampus?: string;
  initialDraft?: PublishFormData | null;
  mode: 'form' | 'preview' | 'success';
  previewData?: PublishFormData | null;
  lastSubmittedTitle?: string;
  onSaveDraft: (formData: PublishFormData) => void;
  onProceedToPreview: (formData: PublishFormData) => void;
  onBackToEdit: () => void;
  onSubmitPublish: (formData: PublishFormData) => void;
  onGoToMyPublished: () => void;
  onGoHome: () => void;
}

const CATEGORIES: Exclude<ActivityCategory, '全部'>[] = [
  '讲座',
  '比赛',
  '文体',
  '社团',
  '展览',
];

const DEFAULT_FORM: PublishFormData = {
  title: '',
  cover: 'music',
  category: '文体',
  description: '',
  startDate: '2026-11-15',
  startClock: '19:00',
  endDate: '2026-11-15',
  endClock: '21:00',
  regStartDate: '2026-11-04',
  regStartClock: '09:00',
  regDeadlineDate: '2026-11-14',
  regDeadlineClock: '22:00',
  subCampus: '清远校区',
  location: '',
  organizer: '',
  capacity: '100',
  requirementsText: '限本校在校学生报名，入场请携带校园卡签到。',
  contact: '',
};

export const PublishPage: React.FC<PublishPageProps> = ({
  currentCampus,
  currentSubCampus,
  initialDraft,
  mode,
  previewData,
  lastSubmittedTitle,
  onSaveDraft,
  onProceedToPreview,
  onBackToEdit,
  onSubmitPublish,
  onGoToMyPublished,
  onGoHome,
}) => {
  const campusInfo =
    CAMPUS_LIST.find((c) => c.name === currentCampus) || CAMPUS_LIST[0];
  const subCampusList = campusInfo.subCampuses || ['清远校区', '广州校区'];
  const defaultSub =
    currentSubCampus && currentSubCampus !== '全部校区'
      ? currentSubCampus
      : subCampusList[0];

  const [form, setForm] = useState<PublishFormData>(
    () => initialDraft || { ...DEFAULT_FORM, subCampus: defaultSub }
  );
  const [errors, setErrors] = useState<Partial<Record<keyof PublishFormData, string>>>({});
  const [draftSavedToast, setDraftSavedToast] = useState(false);

  const updateField = <K extends keyof PublishFormData>(key: K, value: PublishFormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        updateField('cover', reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleQuickFillDemo = () => {
    setForm({
      title: '秋日南区草坪吉他弹唱夜',
      cover: 'music',
      category: '文体',
      description:
        '带上你的木吉他与故事，在南区中心草坪一起围坐弹唱校园民谣与流行金曲。现场备有荧光棒与歌词本，欢迎全校音乐爱好者报名参与！',
      startDate: '2026-11-15',
      startClock: '19:00',
      endDate: '2026-11-15',
      endClock: '21:00',
      regStartDate: '2026-11-04',
      regStartClock: '09:00',
      regDeadlineDate: '2026-11-14',
      regDeadlineClock: '22:00',
      location: '清远校区南区中心草坪',
      organizer: '吉他协会 · 大学生艺术团',
      capacity: '80',
      requirementsText: '本校在校学生均可报名，欢迎自带木吉他、尤克里里或沙锤参与互动。',
      contact: '林晓阳 13826048819',
    });
    setErrors({});
  };

  const handleSaveDraftClick = () => {
    if (!form.title.trim()) {
      setErrors({ title: '保存草稿请至少填写活动名称' });
      return;
    }
    onSaveDraft(form);
    setDraftSavedToast(true);
    setTimeout(() => setDraftSavedToast(false), 2500);
  };

  const handlePreviewClick = (e: React.FormEvent) => {
    e.preventDefault();
    const check = validatePublishForm(form);
    if (!check.valid) {
      setErrors(check.errors);
      return;
    }
    setErrors({});
    onProceedToPreview(form);
  };

  // --- 5. 发布成功页 ---
  if (mode === 'success') {
    return (
      <div className="min-h-full bg-[#F7F7F5] px-5 py-12 flex flex-col items-center justify-center text-center">
        <div className="w-full bg-white rounded-[18px] p-6 border border-[#F0EEEC] space-y-5">
          <div className="w-16 h-16 rounded-full bg-[#FFF0ED] text-[#FF5A4F] flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-9 h-9" strokeWidth={2.2} />
          </div>

          <div>
            <h1 className="text-[20px] font-bold text-[#171717]">活动已提交，等待审核。</h1>
            {lastSubmittedTitle && (
              <p className="text-sm font-medium text-[#514744] mt-1.5">
                《{lastSubmittedTitle}》
              </p>
            )}
            <p className="text-xs text-[#9A8984] mt-2 leading-relaxed">
              校团委或社团联合会将在 1-2 个工作日内完成内容合规与场地核验，你可以在「我的 - 我的发布」中实时查看审核状态。
            </p>
          </div>

          <div className="pt-2 space-y-3">
            <button
              type="button"
              onClick={onGoToMyPublished}
              className="w-full h-[52px] rounded-[26px] bg-[#FF5A4F] text-white font-semibold text-[15px] flex items-center justify-center transition-transform active:scale-[0.99]"
            >
              查看我的发布
            </button>
            <button
              type="button"
              onClick={onGoHome}
              className="w-full h-[52px] rounded-[26px] bg-[#F7F7F5] text-[#514744] font-semibold text-[15px] flex items-center justify-center hover:bg-[#F0EEEC] transition-colors"
            >
              返回首页
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- 4. 活动预览页（与正式活动详情页保持相同布局） ---
  if (mode === 'preview' && previewData) {
    const startIso = `${previewData.startDate}T${previewData.startClock}:00`;
    const endIso = `${previewData.endDate}T${previewData.endClock}:00`;
    const regStartIso = `${previewData.regStartDate}T${previewData.regStartClock}:00`;
    const regDeadlineIso = `${previewData.regDeadlineDate}T${previewData.regDeadlineClock}:00`;

    return (
      <div className="flex flex-col min-h-full bg-[#F7F7F5] pb-24">
        {/* 顶部封面 + 返回修改按钮 */}
        <div className="relative h-[220px] w-full">
          <CoverArtwork cover={previewData.cover} title={previewData.title} className="w-full h-full" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-transparent to-black/35" />

          <div className="absolute top-3 left-4 right-4 flex items-center justify-between">
            <button
              type="button"
              onClick={onBackToEdit}
              aria-label="返回修改"
              className="px-3 h-9 rounded-full bg-black/45 backdrop-blur-sm text-white text-xs font-medium flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>返回修改</span>
            </button>
            <span className="text-xs font-semibold text-white bg-black/45 backdrop-blur-sm px-3 py-1 rounded-full">
              发布预览模式
            </span>
          </div>
        </div>

        <div className="px-5 -mt-4 relative z-10 space-y-4">
          {/* 核心信息卡片 */}
          <section className="bg-white rounded-[18px] p-4 border border-[#F0EEEC]">
            <div className="flex items-center justify-between gap-2 text-xs">
              <span className="text-[#9A8984] font-medium">
                {previewData.category} · {currentCampus}
                {previewData.subCampus ? ` (${previewData.subCampus})` : ''}
              </span>
              <span className="text-[#FF5A4F] font-semibold">报名中（预览）</span>
            </div>

            <h1 className="text-[20px] font-bold text-[#171717] mt-1.5 leading-snug">
              {previewData.title}
            </h1>

            <div className="mt-3.5 pt-3.5 border-t border-[#F0EEEC]">
              <div className="flex items-center justify-between text-xs tabular-nums">
                <span className="text-[#514744]">
                  报名人数限制：<strong className="text-[#171717]">0/{previewData.capacity} 人</strong>
                </span>
                <span className="text-[#FF5A4F] font-semibold">
                  剩余 {previewData.capacity} 个名额
                </span>
              </div>
              <div className="mt-2 h-2 w-full rounded-full bg-[#F0EEEC] overflow-hidden">
                <div className="h-full rounded-full bg-[#FF5A4F] w-[4%]" />
              </div>
            </div>

            <div className="mt-4 pt-3.5 border-t border-[#F0EEEC] space-y-2.5 text-xs text-[#514744]">
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-[#FF5A4F] shrink-0 mt-0.5" />
                <div>
                  <span className="text-[#9A8984] block">活动时间</span>
                  <span className="font-medium text-[#171717] mt-0.5 block">
                    {formatDateTimeRange(startIso, endIso)}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Calendar className="w-4 h-4 text-[#FF5A4F] shrink-0 mt-0.5" />
                <div>
                  <span className="text-[#9A8984] block">报名起止时间</span>
                  <span className="font-medium text-[#171717] mt-0.5 block">
                    {formatDateTimeRange(regStartIso, regDeadlineIso)}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#FF5A4F] shrink-0 mt-0.5" />
                <div>
                  <span className="text-[#9A8984] block">活动地点</span>
                  <span className="font-medium text-[#171717] mt-0.5 block">
                    {previewData.location}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Building2 className="w-4 h-4 text-[#FF5A4F] shrink-0 mt-0.5" />
                <div>
                  <span className="text-[#9A8984] block">主办方</span>
                  <span className="font-medium text-[#171717] mt-0.5 block">
                    {previewData.organizer}
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* 活动介绍 */}
          <section className="bg-white rounded-[18px] p-4 border border-[#F0EEEC]">
            <h2 className="text-[16px] font-bold text-[#171717]">活动介绍</h2>
            <p className="text-sm text-[#514744] leading-relaxed mt-2 whitespace-pre-line">
              {previewData.description}
            </p>
          </section>

          {/* 参与要求与联系方式 */}
          <section className="bg-white rounded-[18px] p-4 border border-[#F0EEEC] space-y-3">
            <div>
              <h2 className="text-[16px] font-bold text-[#171717]">参与要求</h2>
              <p className="text-xs text-[#514744] mt-1.5 leading-relaxed">
                {previewData.requirementsText}
              </p>
            </div>
            <div className="pt-3 border-t border-[#F0EEEC] flex items-center gap-2 text-xs text-[#9A8984]">
              <Phone className="w-3.5 h-3.5 text-[#FF5A4F]" />
              <span>负责人联系方式：{previewData.contact}</span>
            </div>
          </section>
        </div>

        {/* 底部操作栏：返回修改 + 提交发布 */}
        <div className="sticky bottom-0 left-0 right-0 z-30 bg-white border-t border-[#F0EEEC] px-5 py-3 flex items-center gap-3">
          <button
            type="button"
            onClick={onBackToEdit}
            className="w-2/5 h-[50px] rounded-[26px] bg-[#F7F7F5] text-[#514744] font-semibold text-sm flex items-center justify-center"
          >
            返回修改
          </button>
          <button
            type="button"
            onClick={() => onSubmitPublish(previewData)}
            className="flex-1 h-[50px] rounded-[26px] bg-[#FF5A4F] text-white font-semibold text-[15px] flex items-center justify-center transition-transform active:scale-[0.99]"
          >
            提交发布
          </button>
        </div>
      </div>
    );
  }

  // --- 1-3. 发布表单页 ---
  return (
    <div className="pb-6">
      {/* 1. 页面顶部 */}
      <header className="px-5 pt-3 pb-4 bg-white border-b border-[#F0EEEC] flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-bold tracking-tight text-[#171717]">发布一场活动</h1>
          <p className="text-xs text-[#9A8984] mt-0.5">让更多同学发现你的精彩</p>
        </div>
        <button
          type="button"
          onClick={handleQuickFillDemo}
          className="px-3 py-1.5 rounded-full bg-[#FFF0ED] text-[#FF5A4F] text-xs font-semibold flex items-center gap-1 active:scale-95 transition-transform"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>填入示例</span>
        </button>
      </header>

      {draftSavedToast && (
        <div className="mx-5 mt-3 px-4 py-2.5 rounded-2xl bg-[#FFF0ED] text-[#FF5A4F] text-xs font-semibold flex items-center justify-between">
          <span>草稿已保存！可在「我的 - 我的发布」中继续编辑。</span>
          <button type="button" onClick={onGoToMyPublished} className="underline">
            去查看
          </button>
        </div>
      )}

      {/* 2. 发布表单 */}
      <form onSubmit={handlePreviewClick} className="px-5 pt-4 space-y-4">
        {/* 基本信息与封面卡片 */}
        <section className="bg-white rounded-[18px] p-4 border border-[#F0EEEC] space-y-4">
          <div>
            <label htmlFor="pub-title" className="block text-xs font-semibold text-[#171717] mb-1.5">
              活动名称 <span className="text-[#FF5A4F]">*</span>
            </label>
            <input
              id="pub-title"
              type="text"
              value={form.title}
              onChange={(e) => updateField('title', e.target.value)}
              placeholder="例如：第十四届校园草坪音乐节"
              className="w-full h-11 px-3.5 rounded-xl bg-[#F7F7F5] text-sm text-[#171717] placeholder-[#9A8984] border border-[#F0EEEC] focus:outline-none focus:border-[#FF5A4F]"
            />
            {errors.title && <p className="text-xs text-[#FF5A4F] mt-1">{errors.title}</p>}
          </div>

          {/* 活动封面上传与预设选择 */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-[#171717]">
                活动封面上传 <span className="text-[#FF5A4F]">*</span>
              </label>
              <label className="text-xs text-[#FF5A4F] font-semibold cursor-pointer flex items-center gap-1">
                <Upload className="w-3.5 h-3.5" />
                <span>上传本地图片</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            <div className="h-[136px] w-full rounded-2xl overflow-hidden border border-[#F0EEEC]">
              <CoverArtwork
                cover={form.cover}
                title={form.title || '预览封面'}
                className="w-full h-full"
              />
            </div>

            <div className="mt-2.5 grid grid-cols-4 gap-2">
              {COVER_PRESETS.slice(0, 4).map((preset) => {
                const selected = form.cover === preset.key;
                return (
                  <button
                    key={preset.key}
                    type="button"
                    onClick={() => updateField('cover', preset.key)}
                    className={`py-1.5 px-2 rounded-xl text-[11px] font-medium border text-center truncate transition-colors ${
                      selected
                        ? 'border-[#FF5A4F] bg-[#FFF0ED] text-[#FF5A4F]'
                        : 'border-[#F0EEEC] bg-[#F7F7F5] text-[#514744]'
                    }`}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 活动分类 */}
          <div>
            <label className="block text-xs font-semibold text-[#171717] mb-1.5">
              活动分类 <span className="text-[#FF5A4F]">*</span>
            </label>
            <div className="grid grid-cols-5 gap-2">
              {CATEGORIES.map((cat) => {
                const active = form.category === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => updateField('category', cat)}
                    className={`h-9 rounded-xl text-xs font-semibold transition-colors ${
                      active
                        ? 'bg-[#FF5A4F] text-white'
                        : 'bg-[#F7F7F5] text-[#514744] hover:text-[#171717]'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 活动介绍 */}
          <div>
            <label htmlFor="pub-desc" className="block text-xs font-semibold text-[#171717] mb-1.5">
              活动介绍 <span className="text-[#FF5A4F]">*</span>
            </label>
            <textarea
              id="pub-desc"
              rows={4}
              value={form.description}
              onChange={(e) => updateField('description', e.target.value)}
              placeholder="详细介绍活动亮点、嘉宾阵容、日程安排与收获..."
              className="w-full p-3.5 rounded-xl bg-[#F7F7F5] text-sm text-[#171717] placeholder-[#9A8984] border border-[#F0EEEC] focus:outline-none focus:border-[#FF5A4F] resize-none"
            />
            {errors.description && (
              <p className="text-xs text-[#FF5A4F] mt-1">{errors.description}</p>
            )}
          </div>
        </section>

        {/* 时间与地点设置卡片 */}
        <section className="bg-white rounded-[18px] p-4 border border-[#F0EEEC] space-y-3.5">
          <h2 className="text-sm font-bold text-[#171717]">时间与场地安排</h2>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-xs font-medium text-[#514744] mb-1">
                活动开始日期 <span className="text-[#FF5A4F]">*</span>
              </label>
              <input
                type="date"
                value={form.startDate}
                onChange={(e) => updateField('startDate', e.target.value)}
                className="w-full h-10 px-2.5 rounded-xl bg-[#F7F7F5] text-xs text-[#171717] border border-[#F0EEEC]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#514744] mb-1">
                开始时间 <span className="text-[#FF5A4F]">*</span>
              </label>
              <input
                type="time"
                value={form.startClock}
                onChange={(e) => updateField('startClock', e.target.value)}
                className="w-full h-10 px-2.5 rounded-xl bg-[#F7F7F5] text-xs text-[#171717] border border-[#F0EEEC]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-xs font-medium text-[#514744] mb-1">
                活动结束日期 <span className="text-[#FF5A4F]">*</span>
              </label>
              <input
                type="date"
                value={form.endDate}
                onChange={(e) => updateField('endDate', e.target.value)}
                className="w-full h-10 px-2.5 rounded-xl bg-[#F7F7F5] text-xs text-[#171717] border border-[#F0EEEC]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#514744] mb-1">
                结束时间 <span className="text-[#FF5A4F]">*</span>
              </label>
              <input
                type="time"
                value={form.endClock}
                onChange={(e) => updateField('endClock', e.target.value)}
                className="w-full h-10 px-2.5 rounded-xl bg-[#F7F7F5] text-xs text-[#171717] border border-[#F0EEEC]"
              />
            </div>
          </div>
          {errors.endDate && <p className="text-xs text-[#FF5A4F]">{errors.endDate}</p>}

          <div className="grid grid-cols-2 gap-2.5 pt-1 border-t border-[#F0EEEC]">
            <div>
              <label className="block text-xs font-medium text-[#514744] mb-1">
                报名开始时间 <span className="text-[#FF5A4F]">*</span>
              </label>
              <input
                type="date"
                value={form.regStartDate}
                onChange={(e) => updateField('regStartDate', e.target.value)}
                className="w-full h-10 px-2.5 rounded-xl bg-[#F7F7F5] text-xs text-[#171717] border border-[#F0EEEC]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#514744] mb-1">
                报名截止时间 <span className="text-[#FF5A4F]">*</span>
              </label>
              <input
                type="date"
                value={form.regDeadlineDate}
                onChange={(e) => updateField('regDeadlineDate', e.target.value)}
                className="w-full h-10 px-2.5 rounded-xl bg-[#F7F7F5] text-xs text-[#171717] border border-[#F0EEEC]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#171717] mb-1.5">
              所属校区 <span className="text-[#FF5A4F]">*</span>
            </label>
            <div className="flex items-center gap-2 flex-wrap mb-3">
              {subCampusList.map((sub) => {
                const active = (form.subCampus || subCampusList[0]) === sub;
                return (
                  <button
                    key={sub}
                    type="button"
                    onClick={() => updateField('subCampus', sub)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                      active
                        ? 'bg-[#FF5A4F] text-white'
                        : 'bg-[#F7F7F5] text-[#514744] hover:text-[#171717]'
                    }`}
                  >
                    {sub}
                  </button>
                );
              })}
            </div>

            <label htmlFor="pub-location" className="block text-xs font-semibold text-[#171717] mb-1.5">
              活动地点 <span className="text-[#FF5A4F]">*</span>
            </label>
            <input
              id="pub-location"
              type="text"
              value={form.location}
              onChange={(e) => updateField('location', e.target.value)}
              placeholder="例如：清远校区南区中心草坪 / 图书馆报告厅"
              className="w-full h-11 px-3.5 rounded-xl bg-[#F7F7F5] text-sm text-[#171717] placeholder-[#9A8984] border border-[#F0EEEC] focus:outline-none focus:border-[#FF5A4F]"
            />
            {errors.location && <p className="text-xs text-[#FF5A4F] mt-1">{errors.location}</p>}
          </div>
        </section>

        {/* 组织者与报名要求卡片 */}
        <section className="bg-white rounded-[18px] p-4 border border-[#F0EEEC] space-y-3.5">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="pub-org" className="block text-xs font-semibold text-[#171717] mb-1.5">
                主办方 <span className="text-[#FF5A4F]">*</span>
              </label>
              <input
                id="pub-org"
                type="text"
                value={form.organizer}
                onChange={(e) => updateField('organizer', e.target.value)}
                placeholder="例如：校学生会 / 吉他社"
                className="w-full h-11 px-3 rounded-xl bg-[#F7F7F5] text-sm text-[#171717] placeholder-[#9A8984] border border-[#F0EEEC] focus:outline-none focus:border-[#FF5A4F]"
              />
              {errors.organizer && (
                <p className="text-xs text-[#FF5A4F] mt-1">{errors.organizer}</p>
              )}
            </div>

            <div>
              <label htmlFor="pub-cap" className="block text-xs font-semibold text-[#171717] mb-1.5">
                报名人数上限 <span className="text-[#FF5A4F]">*</span>
              </label>
              <input
                id="pub-cap"
                type="number"
                min={1}
                max={10000}
                value={form.capacity}
                onChange={(e) => updateField('capacity', e.target.value)}
                placeholder="150"
                className="w-full h-11 px-3 rounded-xl bg-[#F7F7F5] text-sm text-[#171717] placeholder-[#9A8984] border border-[#F0EEEC] focus:outline-none focus:border-[#FF5A4F] tabular-nums"
              />
              {errors.capacity && (
                <p className="text-xs text-[#FF5A4F] mt-1">{errors.capacity}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="pub-req" className="block text-xs font-semibold text-[#171717] mb-1.5">
              参与要求 <span className="text-[#FF5A4F]">*</span>
            </label>
            <input
              id="pub-req"
              type="text"
              value={form.requirementsText}
              onChange={(e) => updateField('requirementsText', e.target.value)}
              placeholder="例如：需携带本人校园卡签到入场"
              className="w-full h-11 px-3.5 rounded-xl bg-[#F7F7F5] text-sm text-[#171717] placeholder-[#9A8984] border border-[#F0EEEC] focus:outline-none focus:border-[#FF5A4F]"
            />
            {errors.requirementsText && (
              <p className="text-xs text-[#FF5A4F] mt-1">{errors.requirementsText}</p>
            )}
          </div>

          <div>
            <label htmlFor="pub-contact" className="block text-xs font-semibold text-[#171717] mb-1.5">
              联系方式 <span className="text-[#FF5A4F]">*</span>
            </label>
            <input
              id="pub-contact"
              type="text"
              value={form.contact}
              onChange={(e) => updateField('contact', e.target.value)}
              placeholder="负责人姓名与手机号 / 企业微信"
              className="w-full h-11 px-3.5 rounded-xl bg-[#F7F7F5] text-sm text-[#171717] placeholder-[#9A8984] border border-[#F0EEEC] focus:outline-none focus:border-[#FF5A4F]"
            />
            {errors.contact && <p className="text-xs text-[#FF5A4F] mt-1">{errors.contact}</p>}
          </div>
        </section>

        {/* 3. 页面底部操作：保存草稿 + 下一步：预览活动 */}
        <div className="pt-2 flex items-center gap-3">
          <button
            type="button"
            onClick={handleSaveDraftClick}
            className="w-2/5 h-[52px] rounded-[26px] bg-white border border-[#F0EEEC] text-[#514744] font-semibold text-sm flex items-center justify-center gap-1.5 hover:bg-[#FFF0ED] hover:text-[#FF5A4F] transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>保存草稿</span>
          </button>
          <button
            type="submit"
            className="flex-1 h-[52px] rounded-[26px] bg-[#FF5A4F] text-white font-semibold text-[15px] flex items-center justify-center gap-1.5 transition-transform active:scale-[0.99]"
          >
            <Eye className="w-4 h-4" />
            <span>下一步：预览活动</span>
          </button>
        </div>
      </form>
    </div>
  );
};

```

## src/components/ProfilePage.tsx
```tsx
import React, { useState } from 'react';
import {
  ChevronRight,
  ArrowLeft,
  CalendarCheck,
  Heart,
  FileText,
  MapPin,
  UserCheck,
  Settings,
  Info,
  Clock,
  Edit3,
  Trash2,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Users,
} from 'lucide-react';
import {
  Activity,
  BuddyPost,
  PublishFormData,
  PublishReviewStatus,
  UserProfile,
} from '../types/activity';
import { DEMO_NOW_ISO } from '../data/initialData';
import {
  computeActivityStatus,
  formatDateTimeRange,
  getMyRegistrationPhase,
  getStatusLabel,
} from '../utils/activityRules';
import { CoverArtwork } from './CoverArtwork';

export type ProfileSubPage =
  | 'main'
  | 'my-registrations'
  | 'my-buddies'
  | 'my-favorites'
  | 'my-published'
  | 'profile-settings';

interface ProfilePageProps {
  userProfile: UserProfile;
  currentCampus: string;
  activities: Activity[];
  buddyPosts: BuddyPost[];
  subPage: ProfileSubPage;
  initialSettingsTab?: 'profile' | 'settings' | 'about';
  onChangeSubPage: (page: ProfileSubPage, settingsTab?: 'profile' | 'settings' | 'about') => void;
  onOpenCampusSelector: () => void;
  onSelectActivity: (activityId: string) => void;
  onToggleFavorite: (activityId: string) => void;
  onToggleJoinBuddy: (buddyId: string) => void;
  onEditPublishedActivity: (formData: PublishFormData) => void;
  onSimulateApproveActivity?: (activityId: string) => void;
  onUpdateProfile: (profile: UserProfile) => void;
  onResetDemoData: () => void;
  onGoToDiscover: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  userProfile,
  currentCampus,
  activities,
  buddyPosts,
  subPage,
  initialSettingsTab = 'profile',
  onChangeSubPage,
  onOpenCampusSelector,
  onSelectActivity,
  onToggleFavorite,
  onToggleJoinBuddy,
  onEditPublishedActivity,
  onSimulateApproveActivity,
  onUpdateProfile,
  onResetDemoData,
  onGoToDiscover,
}) => {
  const [regTab, setRegTab] = useState<'all' | 'upcoming' | 'ongoing' | 'ended'>('all');
  const [buddyTab, setBuddyTab] = useState<'all' | 'joined' | 'mine'>('all');
  const [copiedBuddyId, setCopiedBuddyId] = useState<string | null>(null);
  const [pubTab, setPubTab] = useState<'all' | 'pending' | 'ongoing' | 'ended'>('all');
  const [settingsTab, setSettingsTab] = useState<'profile' | 'settings' | 'about'>(
    initialSettingsTab
  );
  const [profileForm, setProfileForm] = useState<UserProfile>(userProfile);
  const [savedNotice, setSavedNotice] = useState(false);

  // Synchronized statistics
  const myRegisteredList = activities.filter((a) => a.isRegistered);
  const myBuddiesList = buddyPosts.filter((b) => b.isJoined || b.isMine);
  const myFavoritesList = activities.filter((a) => a.favorite);
  const myPublishedList = activities.filter((a) => a.isUserPublished);

  const convertActivityToFormData = (act: Activity): PublishFormData => {
    const startParts = act.startTime.split('T');
    const endParts = act.endTime.split('T');
    const regStartParts = act.registrationStartTime.split('T');
    const regDeadParts = act.registrationDeadline.split('T');

    return {
      id: act.id,
      title: act.title,
      cover: act.cover,
      category: act.category,
      description: act.description,
      startDate: startParts[0] || '2026-11-15',
      startClock: (startParts[1] || '19:00').slice(0, 5),
      endDate: endParts[0] || '2026-11-15',
      endClock: (endParts[1] || '21:00').slice(0, 5),
      regStartDate: regStartParts[0] || '2026-11-04',
      regStartClock: (regStartParts[1] || '09:00').slice(0, 5),
      regDeadlineDate: regDeadParts[0] || '2026-11-14',
      regDeadlineClock: (regDeadParts[1] || '22:00').slice(0, 5),
      location: act.location,
      organizer: act.organizer,
      capacity: String(act.capacity),
      requirementsText: act.requirements.join('；'),
      contact: act.contact,
    };
  };

  // --- 二级页面 1：我的报名页面 ---
  if (subPage === 'my-registrations') {
    const filteredRegs = myRegisteredList.filter((act) => {
      if (regTab === 'all') return true;
      const phase = getMyRegistrationPhase(act, DEMO_NOW_ISO);
      return phase === regTab;
    });

    const regTabs: { id: 'all' | 'upcoming' | 'ongoing' | 'ended'; label: string }[] = [
      { id: 'all', label: '全部' },
      { id: 'upcoming', label: '待开始' },
      { id: 'ongoing', label: '进行中' },
      { id: 'ended', label: '已结束' },
    ];

    return (
      <div className="min-h-full bg-[#F7F7F5] pb-8">
        <header className="px-5 pt-3 pb-3 bg-white border-b border-[#F0EEEC] sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onChangeSubPage('main')}
              aria-label="返回我的页面"
              className="w-9 h-9 -ml-1.5 rounded-full flex items-center justify-center text-[#171717] hover:bg-[#F7F7F5]"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-[18px] font-bold text-[#171717]">我的报名</h1>
          </div>

          <div className="mt-3 grid grid-cols-4 gap-1.5 bg-[#F7F7F5] p-1 rounded-xl">
            {regTabs.map((t) => {
              const active = regTab === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setRegTab(t.id)}
                  className={`py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    active ? 'bg-white text-[#FF5A4F] shadow-xs' : 'text-[#514744]'
                  }`}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        </header>

        <div className="px-5 pt-4 space-y-3.5">
          {filteredRegs.map((act) => {
            const phase = getMyRegistrationPhase(act, DEMO_NOW_ISO);
            const phaseLabel =
              phase === 'ended'
                ? '已结束 · 已参与'
                : phase === 'ongoing'
                ? '进行中 · 已报名'
                : '待开始 · 报名成功';

            return (
              <div
                key={act.id}
                onClick={() => onSelectActivity(act.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') onSelectActivity(act.id);
                }}
                className="bg-white rounded-[18px] p-3.5 border border-[#F0EEEC] flex flex-col gap-3 cursor-pointer hover:border-[#FF5A4F]/40 transition-colors"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-24 h-20 rounded-xl overflow-hidden shrink-0">
                    <CoverArtwork cover={act.cover} title={act.title} className="w-full h-full" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] text-[#9A8984]">{act.category}</span>
                      <span
                        className={`text-xs font-semibold ${
                          phase === 'ended' ? 'text-[#9A8984]' : 'text-[#FF5A4F]'
                        }`}
                      >
                        {phaseLabel}
                      </span>
                    </div>
                    <h3 className="text-[15px] font-bold text-[#171717] mt-0.5 truncate">
                      {act.title}
                    </h3>
                    <p className="text-xs text-[#514744] mt-1 truncate">
                      {formatDateTimeRange(act.startTime, act.endTime)}
                    </p>
                    <p className="text-xs text-[#9A8984] mt-0.5 truncate">{act.location}</p>
                  </div>
                </div>
              </div>
            );
          })}

          {filteredRegs.length === 0 && (
            <div className="bg-white rounded-[18px] p-8 text-center border border-[#F0EEEC]">
              <p className="text-sm font-semibold text-[#171717]">暂无对应状态的报名记录</p>
              <p className="text-xs text-[#9A8984] mt-1">去发现感兴趣的校园活动并报名参加吧</p>
              <button
                type="button"
                onClick={onGoToDiscover}
                className="mt-4 px-5 py-2.5 rounded-full bg-[#FF5A4F] text-white text-xs font-semibold"
              >
                去发现活动
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // --- 二级页面 1.5：我的结伴页面 ---
  if (subPage === 'my-buddies') {
    const filteredMyBuddies = myBuddiesList.filter((b) => {
      if (buddyTab === 'mine') return Boolean(b.isMine);
      if (buddyTab === 'joined') return Boolean(b.isJoined && !b.isMine);
      return true;
    });

    const buddyTabs: { id: 'all' | 'joined' | 'mine'; label: string }[] = [
      { id: 'all', label: '全部结伴' },
      { id: 'joined', label: '我加入的' },
      { id: 'mine', label: '我发起的' },
    ];

    return (
      <div className="min-h-full bg-[#F7F7F5] pb-8">
        <header className="px-5 pt-3 pb-3 bg-white border-b border-[#F0EEEC] sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onChangeSubPage('main')}
              aria-label="返回我的页面"
              className="w-9 h-9 -ml-1.5 rounded-full flex items-center justify-center text-[#171717] hover:bg-[#F7F7F5]"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-[18px] font-bold text-[#171717]">我的结伴</h1>
          </div>

          <div className="mt-3 grid grid-cols-3 gap-1.5 bg-[#F7F7F5] p-1 rounded-xl">
            {buddyTabs.map((t) => {
              const active = buddyTab === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setBuddyTab(t.id)}
                  className={`py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    active ? 'bg-white text-[#FF5A4F] shadow-xs' : 'text-[#514744]'
                  }`}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        </header>

        <div className="px-5 pt-4 space-y-3.5">
          {filteredMyBuddies.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-[18px] p-4 border border-[#F0EEEC] space-y-3"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-xs font-semibold text-[#FF5A4F] bg-[#FFF0ED] px-2.5 py-0.5 rounded-md">
                    {post.tag}
                  </span>
                  <span className="text-xs text-[#9A8984] truncate">
                    {post.subCampus} · 发起人：{post.authorName}
                  </span>
                </div>
                <span className="text-xs font-semibold text-[#171717] tabular-nums shrink-0">
                  {post.currentCount}/{post.maxCount}人
                </span>
              </div>

              <div>
                <h3 className="text-[15px] font-bold text-[#171717]">{post.title}</h3>
                <p className="text-xs text-[#514744] mt-1 leading-relaxed">
                  {post.description}
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-[#F7F7F5] space-y-1 text-xs">
                <p className="text-[#171717] font-medium">
                  关联活动：{post.activityTitle}
                </p>
                <p className="text-[#514744]">集合地点：{post.meetingPoint}</p>
              </div>

              <div className="p-2.5 rounded-xl bg-[#FFF0ED]/70 border border-[#FF5A4F]/20 flex items-center justify-between gap-2">
                <div className="min-w-0 text-xs">
                  <span className="text-[#9A8984] block text-[11px]">联系微信号 / 群口令</span>
                  <span className="font-semibold text-[#171717] truncate block mt-0.5">
                    {post.contactCode}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard?.writeText(post.contactCode).catch(() => {});
                    setCopiedBuddyId(post.id);
                    setTimeout(() => setCopiedBuddyId(null), 2000);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-white text-[#FF5A4F] text-xs font-semibold shrink-0"
                >
                  {copiedBuddyId === post.id ? '已复制' : '复制'}
                </button>
              </div>

              <div className="pt-2 border-t border-[#F0EEEC] flex items-center justify-between gap-2">
                {post.isMine ? (
                  <span className="text-xs text-[#9A8984]">我发起的结伴招募</span>
                ) : (
                  <button
                    type="button"
                    onClick={() => onToggleJoinBuddy(post.id)}
                    className="text-xs text-[#9A8984] hover:text-[#FF5A4F]"
                  >
                    退出该结伴
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => onSelectActivity(post.activityId)}
                  className="text-xs font-semibold text-[#FF5A4F]"
                >
                  查看关联活动
                </button>
              </div>
            </div>
          ))}

          {filteredMyBuddies.length === 0 && (
            <div className="bg-white rounded-[18px] p-8 text-center border border-[#F0EEEC]">
              <p className="text-sm font-semibold text-[#171717]">暂无结伴记录</p>
              <p className="text-xs text-[#9A8984] mt-1">
                去「找搭子」广场或活动详情页加入感兴趣的同场结伴吧
              </p>
              <button
                type="button"
                onClick={onGoToDiscover}
                className="mt-4 px-5 py-2.5 rounded-full bg-[#FF5A4F] text-white text-xs font-semibold"
              >
                去发现搭子
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // --- 二级页面 2：我的收藏页面 ---
  if (subPage === 'my-favorites') {
    return (
      <div className="min-h-full bg-[#F7F7F5] pb-8">
        <header className="px-5 pt-3 pb-3 bg-white border-b border-[#F0EEEC] sticky top-0 z-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onChangeSubPage('main')}
              aria-label="返回我的页面"
              className="w-9 h-9 -ml-1.5 rounded-full flex items-center justify-center text-[#171717] hover:bg-[#F7F7F5]"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-[18px] font-bold text-[#171717]">我的收藏</h1>
          </div>
          <span className="text-xs text-[#9A8984] tabular-nums">
            共 {myFavoritesList.length} 场活动
          </span>
        </header>

        <div className="px-5 pt-4 space-y-3.5">
          {myFavoritesList.map((act) => {
            const status = computeActivityStatus(act, DEMO_NOW_ISO);
            return (
              <div
                key={act.id}
                className="bg-white rounded-[18px] p-3.5 border border-[#F0EEEC] space-y-3"
              >
                <div
                  onClick={() => onSelectActivity(act.id)}
                  className="flex items-start gap-3.5 cursor-pointer"
                >
                  <div className="w-24 h-20 rounded-xl overflow-hidden shrink-0">
                    <CoverArtwork cover={act.cover} title={act.title} className="w-full h-full" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <span className="text-[#9A8984]">{act.category}</span>
                      <span
                        className={`font-semibold ${
                          status === 'open' ? 'text-[#FF5A4F]' : 'text-[#9A8984]'
                        }`}
                      >
                        {getStatusLabel(status)}
                      </span>
                    </div>
                    <h3 className="text-[15px] font-bold text-[#171717] mt-0.5 truncate">
                      {act.title}
                    </h3>
                    <p className="text-xs text-[#514744] mt-1 truncate">
                      {formatDateTimeRange(act.startTime, act.endTime)}
                    </p>
                    <p className="text-xs text-[#9A8984] mt-0.5 truncate">{act.location}</p>
                  </div>
                </div>

                <div className="pt-2.5 border-t border-[#F0EEEC] flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => onToggleFavorite(act.id)}
                    className="text-xs text-[#9A8984] hover:text-[#FF5A4F] flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>取消收藏</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onSelectActivity(act.id)}
                    className="text-xs font-semibold text-[#FF5A4F]"
                  >
                    查看活动详情
                  </button>
                </div>
              </div>
            );
          })}

          {myFavoritesList.length === 0 && (
            <div className="bg-white rounded-[18px] p-10 text-center border border-[#F0EEEC] space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#FFF0ED] text-[#FF5A4F] flex items-center justify-center mx-auto">
                <Heart className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-[#171717]">还没有收藏的校园活动</p>
                <p className="text-xs text-[#9A8984] mt-1">
                  遇到感兴趣的讲座、音乐节或比赛，可以点击爱心先收藏起来
                </p>
              </div>
              <button
                type="button"
                onClick={onGoToDiscover}
                className="mt-2 px-6 py-2.5 rounded-full bg-[#FF5A4F] text-white text-xs font-semibold"
              >
                去发现活动
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // --- 二级页面 3：我的发布页面 ---
  if (subPage === 'my-published') {
    const getReviewBadge = (reviewStatus?: PublishReviewStatus) => {
      switch (reviewStatus) {
        case 'draft':
          return { text: '草稿', color: 'text-[#514744]' };
        case 'pending':
          return { text: '审核中', color: 'text-[#FF5A4F]' };
        case 'approved':
          return { text: '审核通过 · 进行中', color: 'text-[#171717]' };
        case 'rejected':
          return { text: '审核未通过', color: 'text-[#FF5A4F]' };
        case 'ended':
          return { text: '已结束', color: 'text-[#9A8984]' };
        default:
          return { text: '审核通过', color: 'text-[#171717]' };
      }
    };

    const filteredPublished = myPublishedList.filter((act) => {
      if (pubTab === 'all') return true;
      if (pubTab === 'pending') {
        return act.reviewStatus === 'pending' || act.reviewStatus === 'draft' || act.reviewStatus === 'rejected';
      }
      if (pubTab === 'ongoing') {
        return act.reviewStatus === 'approved' && act.status !== 'ended';
      }
      if (pubTab === 'ended') {
        return act.reviewStatus === 'ended' || act.status === 'ended';
      }
      return true;
    });

    const pubTabs: { id: 'all' | 'pending' | 'ongoing' | 'ended'; label: string }[] = [
      { id: 'all', label: '全部' },
      { id: 'pending', label: '审核中' },
      { id: 'ongoing', label: '进行中' },
      { id: 'ended', label: '已结束' },
    ];

    return (
      <div className="min-h-full bg-[#F7F7F5] pb-8">
        <header className="px-5 pt-3 pb-3 bg-white border-b border-[#F0EEEC] sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onChangeSubPage('main')}
              aria-label="返回我的页面"
              className="w-9 h-9 -ml-1.5 rounded-full flex items-center justify-center text-[#171717] hover:bg-[#F7F7F5]"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-[18px] font-bold text-[#171717]">我的发布</h1>
          </div>

          <div className="mt-3 grid grid-cols-4 gap-1.5 bg-[#F7F7F5] p-1 rounded-xl">
            {pubTabs.map((t) => {
              const active = pubTab === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setPubTab(t.id)}
                  className={`py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    active ? 'bg-white text-[#FF5A4F] shadow-xs' : 'text-[#514744]'
                  }`}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        </header>

        <div className="px-5 pt-4 space-y-3.5">
          {filteredPublished.map((act) => {
            const badge = getReviewBadge(act.reviewStatus);
            return (
              <div
                key={act.id}
                className="bg-white rounded-[18px] p-4 border border-[#F0EEEC] space-y-3"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-24 h-20 rounded-xl overflow-hidden shrink-0">
                    <CoverArtwork cover={act.cover} title={act.title} className="w-full h-full" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <span className="text-[#9A8984]">{act.category}</span>
                      <span className={`font-semibold ${badge.color}`}>{badge.text}</span>
                    </div>
                    <h3 className="text-[15px] font-bold text-[#171717] mt-0.5 truncate">
                      {act.title}
                    </h3>
                    <p className="text-xs text-[#514744] mt-1 truncate">
                      {formatDateTimeRange(act.startTime, act.endTime)}
                    </p>
                    <p className="text-xs text-[#9A8984] mt-0.5 tabular-nums">
                      报名人数：{act.registeredCount}/{act.capacity} 人
                    </p>
                  </div>
                </div>

                {act.reviewStatus === 'rejected' && act.rejectReason && (
                  <div className="p-2.5 rounded-xl bg-[#FFF0ED] text-xs text-[#514744] flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-[#FF5A4F] shrink-0 mt-0.5" />
                    <span>{act.rejectReason}</span>
                  </div>
                )}

                <div className="pt-2.5 border-t border-[#F0EEEC] flex items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => onEditPublishedActivity(convertActivityToFormData(act))}
                      className="text-xs font-medium text-[#514744] hover:text-[#FF5A4F] flex items-center gap-1"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>编辑内容</span>
                    </button>

                    {act.reviewStatus === 'pending' && onSimulateApproveActivity && (
                      <button
                        type="button"
                        onClick={() => onSimulateApproveActivity(act.id)}
                        className="text-xs font-medium text-[#9A8984] hover:text-[#171717]"
                      >
                        模拟通过审核
                      </button>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => onSelectActivity(act.id)}
                    className="text-xs font-semibold text-[#FF5A4F]"
                  >
                    查看详情
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // --- 二级页面 4：个人资料及设置页 ---
  if (subPage === 'profile-settings') {
    const handleSaveProfile = (e: React.FormEvent) => {
      e.preventDefault();
      onUpdateProfile(profileForm);
      setSavedNotice(true);
      setTimeout(() => setSavedNotice(false), 2000);
    };

    return (
      <div className="min-h-full bg-[#F7F7F5] pb-8">
        <header className="px-5 pt-3 pb-3 bg-white border-b border-[#F0EEEC] sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onChangeSubPage('main')}
              aria-label="返回我的页面"
              className="w-9 h-9 -ml-1.5 rounded-full flex items-center justify-center text-[#171717] hover:bg-[#F7F7F5]"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-[18px] font-bold text-[#171717]">个人资料与设置</h1>
          </div>

          <div className="mt-3 grid grid-cols-3 gap-1.5 bg-[#F7F7F5] p-1 rounded-xl">
            {[
              { id: 'profile', label: '个人资料' },
              { id: 'settings', label: '通用设置' },
              { id: 'about', label: '关于一场' },
            ].map((t) => {
              const active = settingsTab === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setSettingsTab(t.id as 'profile' | 'settings' | 'about')}
                  className={`py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    active ? 'bg-white text-[#FF5A4F] shadow-xs' : 'text-[#514744]'
                  }`}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        </header>

        <div className="px-5 pt-4 space-y-4">
          {settingsTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="bg-white rounded-[18px] p-4 border border-[#F0EEEC] space-y-3.5">
              {savedNotice && (
                <div className="p-3 rounded-xl bg-[#FFF0ED] text-[#FF5A4F] text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>个人资料已保存并同步！</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-[#171717] mb-1">昵称</label>
                <input
                  type="text"
                  value={profileForm.nickname}
                  onChange={(e) => setProfileForm({ ...profileForm, nickname: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl bg-[#F7F7F5] text-sm text-[#171717] border border-[#F0EEEC]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#171717] mb-1">学号</label>
                  <input
                    type="text"
                    value={profileForm.studentId}
                    onChange={(e) => setProfileForm({ ...profileForm, studentId: e.target.value })}
                    className="w-full h-10 px-3 rounded-xl bg-[#F7F7F5] text-sm text-[#171717] border border-[#F0EEEC]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#171717] mb-1">年级</label>
                  <input
                    type="text"
                    value={profileForm.grade}
                    onChange={(e) => setProfileForm({ ...profileForm, grade: e.target.value })}
                    className="w-full h-10 px-3 rounded-xl bg-[#F7F7F5] text-sm text-[#171717] border border-[#F0EEEC]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#171717] mb-1">院系与专业</label>
                <input
                  type="text"
                  value={profileForm.department}
                  onChange={(e) => setProfileForm({ ...profileForm, department: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl bg-[#F7F7F5] text-sm text-[#171717] border border-[#F0EEEC]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#171717] mb-1">联系电话</label>
                <input
                  type="tel"
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl bg-[#F7F7F5] text-sm text-[#171717] border border-[#F0EEEC]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#171717] mb-1">个人签名</label>
                <textarea
                  rows={2}
                  value={profileForm.bio}
                  onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                  className="w-full p-3 rounded-xl bg-[#F7F7F5] text-sm text-[#171717] border border-[#F0EEEC] resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full h-[50px] rounded-[26px] bg-[#FF5A4F] text-white font-semibold text-sm"
              >
                保存个人资料
              </button>
            </form>
          )}

          {settingsTab === 'settings' && (
            <div className="space-y-4">
              <div className="bg-white rounded-[18px] p-4 border border-[#F0EEEC] space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-[#171717]">活动开始前消息提醒</p>
                    <p className="text-xs text-[#9A8984] mt-0.5">在已报名活动开始前 2 小时推送提醒</p>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={profileForm.notificationsEnabled}
                    onClick={() => {
                      const next = {
                        ...profileForm,
                        notificationsEnabled: !profileForm.notificationsEnabled,
                      };
                      setProfileForm(next);
                      onUpdateProfile(next);
                    }}
                    className={`w-11 h-6 rounded-full transition-colors p-0.5 ${
                      profileForm.notificationsEnabled ? 'bg-[#FF5A4F]' : 'bg-[#EAE9E7]'
                    }`}
                  >
                    <span
                      className={`block w-5 h-5 rounded-full bg-white transition-transform ${
                        profileForm.notificationsEnabled ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                <div className="pt-3 border-t border-[#F0EEEC] flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-[#171717]">自动加入手机课表日历</p>
                    <p className="text-xs text-[#9A8984] mt-0.5">报名成功后自动在校园日程中标记</p>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={profileForm.calendarSyncEnabled}
                    onClick={() => {
                      const next = {
                        ...profileForm,
                        calendarSyncEnabled: !profileForm.calendarSyncEnabled,
                      };
                      setProfileForm(next);
                      onUpdateProfile(next);
                    }}
                    className={`w-11 h-6 rounded-full transition-colors p-0.5 ${
                      profileForm.calendarSyncEnabled ? 'bg-[#FF5A4F]' : 'bg-[#EAE9E7]'
                    }`}
                  >
                    <span
                      className={`block w-5 h-5 rounded-full bg-white transition-transform ${
                        profileForm.calendarSyncEnabled ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-[18px] p-4 border border-[#F0EEEC] space-y-2">
                <p className="text-sm font-semibold text-[#171717]">演示数据管理</p>
                <p className="text-xs text-[#9A8984]">
                  所有报名、收藏、发布草稿与学校切换均已持久化保存在本地存储中。如需恢复初始演示状态，可点击下方按钮。
                </p>
                <button
                  type="button"
                  onClick={onResetDemoData}
                  className="mt-2 w-full h-11 rounded-2xl bg-[#FFF0ED] text-[#FF5A4F] text-xs font-semibold flex items-center justify-center gap-1.5"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>重置为初始演示数据</span>
                </button>
              </div>
            </div>
          )}

          {settingsTab === 'about' && (
            <div className="bg-white rounded-[18px] p-5 border border-[#F0EEEC] space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#FF5A4F] text-white font-bold text-xl flex items-center justify-center">
                  一场
                </div>
                <div>
                  <h2 className="text-base font-bold text-[#171717]">一场 · 校园活动平台</h2>
                  <p className="text-xs text-[#514744]">校园里，总有一场值得去。</p>
                </div>
              </div>
              <p className="text-xs text-[#514744] leading-relaxed">
                「一场」是一款面向高校在校大学生的轻量化校园活动发现、报名、发布与个人活动管理应用。无论是一场草坪音乐节、一场院系篮球赛，还是一场前沿学术讲座，在这里都能快速找到志同道合的校园伙伴。
              </p>
              <div className="pt-3 border-t border-[#F0EEEC] text-xs text-[#9A8984] space-y-1">
                <p>默认示范高校：广东建设职业技术学院</p>
                <p>适用对象：全国高校在校大学生及学生社团组织</p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // --- 一级页面：我的 主视图 ---
  return (
    <div className="pb-6">
      <header className="px-5 pt-3 pb-2">
        <h1 className="text-[22px] font-bold tracking-tight text-[#171717]">我的</h1>
      </header>

      <div className="px-5 space-y-4">
        {/* 1. 顶部个人信息区域 */}
        <section className="bg-white rounded-[18px] p-4 border border-[#F0EEEC]">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-14 h-14 rounded-full bg-[#FFF0ED] text-[#FF5A4F] font-bold text-xl flex items-center justify-center shrink-0 border border-[#FF5A4F]/20">
                {userProfile.nickname.slice(0, 1)}
              </div>
              <div className="min-w-0">
                <h2 className="text-[18px] font-bold text-[#171717] truncate">
                  {userProfile.nickname}
                </h2>
                <p className="text-xs text-[#514744] mt-0.5 truncate">{currentCampus}</p>
                <p className="text-[11px] text-[#9A8984] mt-0.5 truncate">
                  {userProfile.department} · {userProfile.grade}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onChangeSubPage('profile-settings', 'profile')}
              className="px-3 py-1.5 rounded-full bg-[#F7F7F5] text-xs font-medium text-[#514744] hover:text-[#FF5A4F] shrink-0 flex items-center gap-0.5"
            >
              <span>个人资料</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 2. 活动数据统计 */}
          <div className="mt-4 pt-4 border-t border-[#F0EEEC] grid grid-cols-4 gap-1.5 text-center">
            <button
              type="button"
              onClick={() => onChangeSubPage('my-registrations')}
              className="py-1 rounded-xl hover:bg-[#F7F7F5] transition-colors"
            >
              <span className="block text-[20px] font-bold text-[#171717] tabular-nums">
                {myRegisteredList.length}
              </span>
              <span className="text-xs text-[#9A8984] mt-0.5 block">我的报名</span>
            </button>

            <button
              type="button"
              onClick={() => onChangeSubPage('my-buddies')}
              className="py-1 rounded-xl hover:bg-[#F7F7F5] transition-colors"
            >
              <span className="block text-[20px] font-bold text-[#171717] tabular-nums">
                {myBuddiesList.length}
              </span>
              <span className="text-xs text-[#9A8984] mt-0.5 block">我的结伴</span>
            </button>

            <button
              type="button"
              onClick={() => onChangeSubPage('my-favorites')}
              className="py-1 rounded-xl hover:bg-[#F7F7F5] transition-colors"
            >
              <span className="block text-[20px] font-bold text-[#171717] tabular-nums">
                {myFavoritesList.length}
              </span>
              <span className="text-xs text-[#9A8984] mt-0.5 block">我的收藏</span>
            </button>

            <button
              type="button"
              onClick={() => onChangeSubPage('my-published')}
              className="py-1 rounded-xl hover:bg-[#F7F7F5] transition-colors"
            >
              <span className="block text-[20px] font-bold text-[#171717] tabular-nums">
                {myPublishedList.length}
              </span>
              <span className="text-xs text-[#9A8984] mt-0.5 block">我的发布</span>
            </button>
          </div>
        </section>

        {/* 3. 我的活动入口卡片 */}
        <section className="bg-white rounded-[18px] p-4 border border-[#F0EEEC]">
          <h2 className="text-[15px] font-bold text-[#171717] mb-3">我的活动</h2>
          <div className="grid grid-cols-4 gap-2">
            <button
              type="button"
              onClick={() => onChangeSubPage('my-registrations')}
              className="p-2.5 rounded-2xl bg-[#F7F7F5] hover:bg-[#FFF0ED] transition-colors flex flex-col items-center text-center group"
            >
              <div className="w-9 h-9 rounded-full bg-white text-[#FF5A4F] flex items-center justify-center shadow-2xs">
                <CalendarCheck className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-[#171717] mt-2">我的报名</span>
              <span className="text-[11px] text-[#9A8984] mt-0.5 tabular-nums">
                {myRegisteredList.length} 场记录
              </span>
            </button>

            <button
              type="button"
              onClick={() => onChangeSubPage('my-buddies')}
              className="p-2.5 rounded-2xl bg-[#F7F7F5] hover:bg-[#FFF0ED] transition-colors flex flex-col items-center text-center group"
            >
              <div className="w-9 h-9 rounded-full bg-white text-[#FF5A4F] flex items-center justify-center shadow-2xs">
                <Users className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-[#171717] mt-2">我的结伴</span>
              <span className="text-[11px] text-[#9A8984] mt-0.5 tabular-nums">
                {myBuddiesList.length} 组同行
              </span>
            </button>

            <button
              type="button"
              onClick={() => onChangeSubPage('my-favorites')}
              className="p-2.5 rounded-2xl bg-[#F7F7F5] hover:bg-[#FFF0ED] transition-colors flex flex-col items-center text-center group"
            >
              <div className="w-9 h-9 rounded-full bg-white text-[#FF5A4F] flex items-center justify-center shadow-2xs">
                <Heart className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-[#171717] mt-2">我的收藏</span>
              <span className="text-[11px] text-[#9A8984] mt-0.5 tabular-nums">
                {myFavoritesList.length} 场心仪
              </span>
            </button>

            <button
              type="button"
              onClick={() => onChangeSubPage('my-published')}
              className="p-2.5 rounded-2xl bg-[#F7F7F5] hover:bg-[#FFF0ED] transition-colors flex flex-col items-center text-center group"
            >
              <div className="w-9 h-9 rounded-full bg-white text-[#FF5A4F] flex items-center justify-center shadow-2xs">
                <FileText className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-[#171717] mt-2">我的发布</span>
              <span className="text-[11px] text-[#9A8984] mt-0.5 tabular-nums">
                {myPublishedList.length} 场管理
              </span>
            </button>
          </div>
        </section>

        {/* 4. 其他设置 */}
        <section className="bg-white rounded-[18px] border border-[#F0EEEC] divide-y divide-[#F0EEEC] overflow-hidden">
          <button
            type="button"
            onClick={onOpenCampusSelector}
            className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-[#F7F7F5] transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#FFF0ED] text-[#FF5A4F] flex items-center justify-center">
                <MapPin className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium text-[#171717]">切换校园</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-[#9A8984]">
              <span className="truncate max-w-[150px]">{currentCampus}</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </button>

          <button
            type="button"
            onClick={() => onChangeSubPage('profile-settings', 'profile')}
            className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-[#F7F7F5] transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#F7F7F5] text-[#514744] flex items-center justify-center">
                <UserCheck className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium text-[#171717]">个人资料</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-[#9A8984]">
              <span>学号 · 院系设置</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </button>

          <button
            type="button"
            onClick={() => onChangeSubPage('profile-settings', 'settings')}
            className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-[#F7F7F5] transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#F7F7F5] text-[#514744] flex items-center justify-center">
                <Settings className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium text-[#171717]">设置</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-[#9A8984]">
              <span>通知提醒 · 数据重置</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </button>

          <button
            type="button"
            onClick={() => onChangeSubPage('profile-settings', 'about')}
            className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-[#F7F7F5] transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#F7F7F5] text-[#514744] flex items-center justify-center">
                <Info className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium text-[#171717]">关于一场</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-[#9A8984]">
              <span>校园里，总有一场值得去</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </button>
        </section>
      </div>
    </div>
  );
};

```

