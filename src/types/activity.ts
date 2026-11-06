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
