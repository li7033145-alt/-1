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

