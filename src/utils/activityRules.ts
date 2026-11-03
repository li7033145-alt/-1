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

    if (criteria.category !== '全部' && act.category !== criteria.category) {
      return false;
    }

    if (q) {
      const hay = `${act.title} ${act.description} ${act.location} ${act.organizer} ${act.category}`.toLowerCase();
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
