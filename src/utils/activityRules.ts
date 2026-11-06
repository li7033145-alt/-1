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

