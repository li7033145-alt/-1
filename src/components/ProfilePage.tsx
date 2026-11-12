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
  Edit3,
  Trash2,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Users,
  LogOut,
  UserMinus,
  Sparkles,
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
import { AuthScreenPhase } from './SplashAndAuthPage';

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
  onCancelRegistration: (activityId: string) => void;
  onToggleFavorite: (activityId: string) => void;
  onToggleJoinBuddy: (buddyId: string) => void;
  onEditPublishedActivity: (formData: PublishFormData) => void;
  onSimulateApproveActivity?: (activityId: string) => void;
  onUpdateProfile: (profile: UserProfile) => void;
  onResetDemoData: () => void;
  onGoToDiscover: () => void;
  onOpenAuthScreen: (phase: AuthScreenPhase) => void;
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
  onCancelRegistration,
  onToggleFavorite,
  onToggleJoinBuddy,
  onEditPublishedActivity,
  onSimulateApproveActivity,
  onUpdateProfile,
  onResetDemoData,
  onGoToDiscover,
  onOpenAuthScreen,
}) => {
  const [regTab, setRegTab] = useState<'all' | 'upcoming' | 'ongoing' | 'ended'>('all');
  const [confirmCancelId, setConfirmCancelId] = useState<string | null>(null);
  const [canceledToastTitle, setCanceledToastTitle] = useState<string | null>(null);
  const [buddyTab, setBuddyTab] = useState<'all' | 'joined' | 'mine'>('all');
  const [copiedBuddyId, setCopiedBuddyId] = useState<string | null>(null);
  const [pubTab, setPubTab] = useState<'all' | 'pending' | 'ongoing' | 'ended'>('all');
  const [settingsTab, setSettingsTab] = useState<'profile' | 'settings' | 'about'>(
    initialSettingsTab
  );
  const [profileForm, setProfileForm] = useState<UserProfile>(userProfile);
  const [savedNotice, setSavedNotice] = useState(false);

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
      subCampus: act.subCampus || '清远校区',
      location: act.location,
      organizer: act.organizer,
      capacity: String(act.capacity),
      requirementsText: act.requirements.join('；'),
      contact: act.contact,
    };
  };

  // --- 二级页面 1：我的报名页面（支持直接取消报名） ---
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
      <div className="min-h-full bg-[#F4F2EE] pb-8">
        <header className="px-4 pt-3 pb-3 bg-white border-b border-[#E6E3DF] sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onChangeSubPage('main')}
              aria-label="返回我的页面"
              className="w-9 h-9 -ml-1.5 rounded-[8px] flex items-center justify-center text-[#171717] hover:bg-[#F7F7F5]"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-[18px] font-black text-[#171717]">我的报名</h1>
          </div>

          <div className="mt-3 grid grid-cols-4 gap-1.5 bg-[#F4F2EE] p-1 rounded-[8px]">
            {regTabs.map((t) => {
              const active = regTab === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setRegTab(t.id)}
                  className={`py-1.5 rounded-[6px] text-xs font-bold transition-colors ${
                    active ? 'bg-white text-[#FF5A4F] shadow-2xs' : 'text-[#514744]'
                  }`}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        </header>

        {canceledToastTitle && (
          <div className="mx-4 mt-3 px-3.5 py-2.5 rounded-[8px] bg-white border border-[#E6E3DF] text-xs text-[#514744] flex items-center justify-between">
            <span>已取消《{canceledToastTitle}》的报名，名额已释放。</span>
            <button
              type="button"
              onClick={() => setCanceledToastTitle(null)}
              className="text-[#FF5A4F] font-semibold"
            >
              知道了
            </button>
          </div>
        )}

        <div className="px-4 pt-3.5 space-y-3">
          {filteredRegs.map((act) => {
            const phase = getMyRegistrationPhase(act, DEMO_NOW_ISO);
            const phaseLabel =
              phase === 'ended'
                ? '已结束 · 已参与'
                : phase === 'ongoing'
                ? '进行中 · 已报名'
                : '待开始 · 报名成功';
            const isConfirmingCancel = confirmCancelId === act.id;

            return (
              <div
                key={act.id}
                className="bg-white rounded-[10px] p-3.5 border border-[#E6E3DF] flex flex-col gap-3"
              >
                <div
                  onClick={() => onSelectActivity(act.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') onSelectActivity(act.id);
                  }}
                  className="flex items-start gap-3 cursor-pointer"
                >
                  <div className="w-24 h-20 rounded-[8px] overflow-hidden shrink-0">
                    <CoverArtwork cover={act.cover} title={act.title} className="w-full h-full" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] text-[#8C7E79]">
                        {act.category}
                        {act.registrationRecord?.registrationMode === 'group'
                          ? ' · 组团报名'
                          : ' · 个人报名'}
                      </span>
                      <span
                        className={`text-xs font-bold ${
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
                    <p className="text-xs text-[#8C7E79] mt-0.5 truncate">{act.location}</p>
                  </div>
                </div>

                {/* 底部操作栏：查看详情 + 取消报名 */}
                <div className="pt-2.5 border-t border-[#F0EEEC] flex items-center justify-between gap-2">
                  {phase === 'ended' ? (
                    <span className="text-xs text-[#8C7E79]">活动已结束，无法取消报名</span>
                  ) : isConfirmingCancel ? (
                    <div className="flex items-center gap-2 w-full justify-between">
                      <span className="text-xs font-semibold text-[#FF5A4F]">
                        确认取消该场报名吗？
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setConfirmCancelId(null)}
                          className="px-2.5 py-1 rounded-[6px] bg-[#F7F7F5] text-xs font-medium text-[#514744]"
                        >
                          再想想
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            onCancelRegistration(act.id);
                            setConfirmCancelId(null);
                            setCanceledToastTitle(act.title);
                          }}
                          className="px-2.5 py-1 rounded-[6px] bg-[#FF5A4F] text-white text-xs font-bold"
                        >
                          确认取消
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => setConfirmCancelId(act.id)}
                        className="px-2.5 py-1 rounded-[6px] bg-[#F7F7F5] border border-[#E6E3DF] text-xs font-semibold text-[#514744] hover:text-[#FF5A4F] hover:border-[#FF5A4F] flex items-center gap-1 transition-colors"
                      >
                        <UserMinus className="w-3.5 h-3.5" />
                        <span>取消报名</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onSelectActivity(act.id)}
                        className="text-xs font-bold text-[#FF5A4F]"
                      >
                        查看活动详情
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}

          {filteredRegs.length === 0 && (
            <div className="bg-white rounded-[10px] p-8 text-center border border-[#E6E3DF]">
              <p className="text-sm font-bold text-[#171717]">暂无对应状态的报名记录</p>
              <p className="text-xs text-[#8C7E79] mt-1">去发现感兴趣的校园活动并报名参加吧</p>
              <button
                type="button"
                onClick={onGoToDiscover}
                className="mt-4 px-5 py-2 rounded-[8px] bg-[#FF5A4F] text-white text-xs font-bold"
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
      <div className="min-h-full bg-[#F4F2EE] pb-8">
        <header className="px-4 pt-3 pb-3 bg-white border-b border-[#E6E3DF] sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onChangeSubPage('main')}
              aria-label="返回我的页面"
              className="w-9 h-9 -ml-1.5 rounded-[8px] flex items-center justify-center text-[#171717] hover:bg-[#F7F7F5]"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-[18px] font-black text-[#171717]">我的结伴</h1>
          </div>

          <div className="mt-3 grid grid-cols-3 gap-1.5 bg-[#F4F2EE] p-1 rounded-[8px]">
            {buddyTabs.map((t) => {
              const active = buddyTab === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setBuddyTab(t.id)}
                  className={`py-1.5 rounded-[6px] text-xs font-bold transition-colors ${
                    active ? 'bg-white text-[#FF5A4F] shadow-2xs' : 'text-[#514744]'
                  }`}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        </header>

        <div className="px-4 pt-3.5 space-y-3">
          {filteredMyBuddies.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-[10px] p-4 border border-[#E6E3DF] space-y-3"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-xs font-bold text-[#FF5A4F]">{post.tag}</span>
                  <span className="text-xs text-[#8C7E79] truncate">
                    · {post.subCampus} · 发起人：{post.authorName}
                  </span>
                </div>
                <span className="text-xs font-bold text-[#171717] tabular-nums shrink-0">
                  {post.currentCount}/{post.maxCount}人
                </span>
              </div>

              <div>
                <h3 className="text-[15px] font-bold text-[#171717]">{post.title}</h3>
                <p className="text-xs text-[#514744] mt-1 leading-relaxed">{post.description}</p>
              </div>

              <div className="p-2.5 rounded-[8px] bg-[#F7F7F5] space-y-1 text-xs">
                <p className="text-[#171717] font-semibold">关联活动：{post.activityTitle}</p>
                <p className="text-[#514744]">集合地点：{post.meetingPoint}</p>
              </div>

              <div className="p-2.5 rounded-[8px] bg-[#FFF0ED]/70 border border-[#FF5A4F]/20 flex items-center justify-between gap-2">
                <div className="min-w-0 text-xs">
                  <span className="text-[#8C7E79] block text-[11px]">联系微信号 / 群口令</span>
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
                  className="px-2.5 py-1 rounded-[6px] bg-white text-[#FF5A4F] text-xs font-bold shrink-0"
                >
                  {copiedBuddyId === post.id ? '已复制' : '复制'}
                </button>
              </div>

              <div className="pt-2 border-t border-[#F0EEEC] flex items-center justify-between gap-2">
                {post.isMine ? (
                  <span className="text-xs text-[#8C7E79]">我发起的结伴招募</span>
                ) : (
                  <button
                    type="button"
                    onClick={() => onToggleJoinBuddy(post.id)}
                    className="text-xs text-[#8C7E79] hover:text-[#FF5A4F]"
                  >
                    退出该结伴
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => onSelectActivity(post.activityId)}
                  className="text-xs font-bold text-[#FF5A4F]"
                >
                  查看关联活动
                </button>
              </div>
            </div>
          ))}

          {filteredMyBuddies.length === 0 && (
            <div className="bg-white rounded-[10px] p-8 text-center border border-[#E6E3DF]">
              <p className="text-sm font-bold text-[#171717]">暂无结伴记录</p>
              <p className="text-xs text-[#8C7E79] mt-1">
                在活动详情页报名时选择「组团报名」即可加入或发起结伴
              </p>
              <button
                type="button"
                onClick={onGoToDiscover}
                className="mt-4 px-5 py-2 rounded-[8px] bg-[#FF5A4F] text-white text-xs font-bold"
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
      <div className="min-h-full bg-[#F4F2EE] pb-8">
        <header className="px-4 pt-3 pb-3 bg-white border-b border-[#E6E3DF] sticky top-0 z-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onChangeSubPage('main')}
              aria-label="返回我的页面"
              className="w-9 h-9 -ml-1.5 rounded-[8px] flex items-center justify-center text-[#171717] hover:bg-[#F7F7F5]"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-[18px] font-black text-[#171717]">我的收藏</h1>
          </div>
          <span className="text-xs text-[#8C7E79] tabular-nums">
            共 {myFavoritesList.length} 场活动
          </span>
        </header>

        <div className="px-4 pt-3.5 space-y-3">
          {myFavoritesList.map((act) => {
            const status = computeActivityStatus(act, DEMO_NOW_ISO);
            return (
              <div
                key={act.id}
                className="bg-white rounded-[10px] p-3.5 border border-[#E6E3DF] space-y-3"
              >
                <div
                  onClick={() => onSelectActivity(act.id)}
                  className="flex items-start gap-3 cursor-pointer"
                >
                  <div className="w-24 h-20 rounded-[8px] overflow-hidden shrink-0">
                    <CoverArtwork cover={act.cover} title={act.title} className="w-full h-full" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <span className="text-[#8C7E79]">{act.category}</span>
                      <span
                        className={`font-bold ${
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
                    <p className="text-xs text-[#8C7E79] mt-0.5 truncate">{act.location}</p>
                  </div>
                </div>

                <div className="pt-2.5 border-t border-[#F0EEEC] flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => onToggleFavorite(act.id)}
                    className="text-xs text-[#8C7E79] hover:text-[#FF5A4F] flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>取消收藏</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onSelectActivity(act.id)}
                    className="text-xs font-bold text-[#FF5A4F]"
                  >
                    查看活动详情
                  </button>
                </div>
              </div>
            );
          })}

          {myFavoritesList.length === 0 && (
            <div className="bg-white rounded-[10px] p-10 text-center border border-[#E6E3DF] space-y-3">
              <div className="w-11 h-11 rounded-[8px] bg-[#FFF0ED] text-[#FF5A4F] flex items-center justify-center mx-auto">
                <Heart className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-[#171717]">还没有收藏的校园活动</p>
                <p className="text-xs text-[#8C7E79] mt-1">
                  遇到感兴趣的讲座、音乐节或比赛，可以点击爱心先收藏起来
                </p>
              </div>
              <button
                type="button"
                onClick={onGoToDiscover}
                className="mt-2 px-5 py-2 rounded-[8px] bg-[#FF5A4F] text-white text-xs font-bold"
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
        return (
          act.reviewStatus === 'pending' ||
          act.reviewStatus === 'draft' ||
          act.reviewStatus === 'rejected'
        );
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
      <div className="min-h-full bg-[#F4F2EE] pb-8">
        <header className="px-4 pt-3 pb-3 bg-white border-b border-[#E6E3DF] sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onChangeSubPage('main')}
              aria-label="返回我的页面"
              className="w-9 h-9 -ml-1.5 rounded-[8px] flex items-center justify-center text-[#171717] hover:bg-[#F7F7F5]"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-[18px] font-black text-[#171717]">我的发布</h1>
          </div>

          <div className="mt-3 grid grid-cols-4 gap-1.5 bg-[#F4F2EE] p-1 rounded-[8px]">
            {pubTabs.map((t) => {
              const active = pubTab === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setPubTab(t.id)}
                  className={`py-1.5 rounded-[6px] text-xs font-bold transition-colors ${
                    active ? 'bg-white text-[#FF5A4F] shadow-2xs' : 'text-[#514744]'
                  }`}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        </header>

        <div className="px-4 pt-3.5 space-y-3">
          {filteredPublished.map((act) => {
            const badge = getReviewBadge(act.reviewStatus);
            return (
              <div
                key={act.id}
                className="bg-white rounded-[10px] p-4 border border-[#E6E3DF] space-y-3"
              >
                <div className="flex items-start gap-3">
                  <div className="w-24 h-20 rounded-[8px] overflow-hidden shrink-0">
                    <CoverArtwork cover={act.cover} title={act.title} className="w-full h-full" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <span className="text-[#8C7E79]">{act.category}</span>
                      <span className={`font-bold ${badge.color}`}>{badge.text}</span>
                    </div>
                    <h3 className="text-[15px] font-bold text-[#171717] mt-0.5 truncate">
                      {act.title}
                    </h3>
                    <p className="text-xs text-[#514744] mt-1 truncate">
                      {formatDateTimeRange(act.startTime, act.endTime)}
                    </p>
                    <p className="text-xs text-[#8C7E79] mt-0.5 tabular-nums">
                      报名人数：{act.registeredCount}/{act.capacity} 人
                    </p>
                  </div>
                </div>

                {act.reviewStatus === 'rejected' && act.rejectReason && (
                  <div className="p-2.5 rounded-[8px] bg-[#FFF0ED] text-xs text-[#514744] flex items-start gap-2">
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
                        className="text-xs font-medium text-[#8C7E79] hover:text-[#171717]"
                      >
                        模拟通过审核
                      </button>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => onSelectActivity(act.id)}
                    className="text-xs font-bold text-[#FF5A4F]"
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
      <div className="min-h-full bg-[#F4F2EE] pb-8">
        <header className="px-4 pt-3 pb-3 bg-white border-b border-[#E6E3DF] sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onChangeSubPage('main')}
              aria-label="返回我的页面"
              className="w-9 h-9 -ml-1.5 rounded-[8px] flex items-center justify-center text-[#171717] hover:bg-[#F7F7F5]"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-[18px] font-black text-[#171717]">个人资料与设置</h1>
          </div>

          <div className="mt-3 grid grid-cols-3 gap-1.5 bg-[#F4F2EE] p-1 rounded-[8px]">
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
                  className={`py-1.5 rounded-[6px] text-xs font-bold transition-colors ${
                    active ? 'bg-white text-[#FF5A4F] shadow-2xs' : 'text-[#514744]'
                  }`}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        </header>

        <div className="px-4 pt-3.5 space-y-3.5">
          {settingsTab === 'profile' && (
            <form
              onSubmit={handleSaveProfile}
              className="bg-white rounded-[10px] p-4 border border-[#E6E3DF] space-y-3.5"
            >
              {savedNotice && (
                <div className="p-3 rounded-[8px] bg-[#FFF0ED] text-[#FF5A4F] text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>个人资料已保存并同步！</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-[#171717] mb-1">昵称</label>
                <input
                  type="text"
                  value={profileForm.nickname}
                  onChange={(e) => setProfileForm({ ...profileForm, nickname: e.target.value })}
                  className="w-full h-10 px-3 rounded-[8px] bg-[#F7F7F5] text-sm text-[#171717] border border-[#E6E3DF]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#171717] mb-1">学号</label>
                  <input
                    type="text"
                    value={profileForm.studentId}
                    onChange={(e) => setProfileForm({ ...profileForm, studentId: e.target.value })}
                    className="w-full h-10 px-3 rounded-[8px] bg-[#F7F7F5] text-sm text-[#171717] border border-[#E6E3DF]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#171717] mb-1">年级</label>
                  <input
                    type="text"
                    value={profileForm.grade}
                    onChange={(e) => setProfileForm({ ...profileForm, grade: e.target.value })}
                    className="w-full h-10 px-3 rounded-[8px] bg-[#F7F7F5] text-sm text-[#171717] border border-[#E6E3DF]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#171717] mb-1">院系与专业</label>
                <input
                  type="text"
                  value={profileForm.department}
                  onChange={(e) => setProfileForm({ ...profileForm, department: e.target.value })}
                  className="w-full h-10 px-3 rounded-[8px] bg-[#F7F7F5] text-sm text-[#171717] border border-[#E6E3DF]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#171717] mb-1">联系电话</label>
                <input
                  type="tel"
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                  className="w-full h-10 px-3 rounded-[8px] bg-[#F7F7F5] text-sm text-[#171717] border border-[#E6E3DF]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#171717] mb-1">个人签名</label>
                <textarea
                  rows={2}
                  value={profileForm.bio}
                  onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                  className="w-full p-3 rounded-[8px] bg-[#F7F7F5] text-sm text-[#171717] border border-[#E6E3DF] resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full h-11 rounded-[8px] bg-[#FF5A4F] text-white font-bold text-sm"
              >
                保存个人资料
              </button>
            </form>
          )}

          {settingsTab === 'settings' && (
            <div className="space-y-3.5">
              <div className="bg-white rounded-[10px] p-4 border border-[#E6E3DF] space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-[#171717]">活动开始前消息提醒</p>
                    <p className="text-xs text-[#8C7E79] mt-0.5">
                      在已报名活动开始前 2 小时推送提醒
                    </p>
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
                    className={`w-11 h-6 rounded-[6px] transition-colors p-0.5 ${
                      profileForm.notificationsEnabled ? 'bg-[#FF5A4F]' : 'bg-[#EAE9E7]'
                    }`}
                  >
                    <span
                      className={`block w-5 h-5 rounded-[4px] bg-white transition-transform ${
                        profileForm.notificationsEnabled ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                <div className="pt-3 border-t border-[#F0EEEC] flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-[#171717]">自动加入手机课表日历</p>
                    <p className="text-xs text-[#8C7E79] mt-0.5">
                      报名成功后自动在校园日程中标记
                    </p>
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
                    className={`w-11 h-6 rounded-[6px] transition-colors p-0.5 ${
                      profileForm.calendarSyncEnabled ? 'bg-[#FF5A4F]' : 'bg-[#EAE9E7]'
                    }`}
                  >
                    <span
                      className={`block w-5 h-5 rounded-[4px] bg-white transition-transform ${
                        profileForm.calendarSyncEnabled ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-[10px] p-4 border border-[#E6E3DF] space-y-2">
                <p className="text-sm font-bold text-[#171717]">演示数据管理</p>
                <p className="text-xs text-[#8C7E79]">
                  所有报名、收藏、发布草稿与学校切换均已持久化保存在本地存储中。如需恢复初始演示状态，可点击下方按钮。
                </p>
                <button
                  type="button"
                  onClick={onResetDemoData}
                  className="mt-2 w-full h-10 rounded-[8px] bg-[#FFF0ED] text-[#FF5A4F] text-xs font-bold flex items-center justify-center gap-1.5"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>重置为初始演示数据</span>
                </button>
              </div>
            </div>
          )}

          {settingsTab === 'about' && (
            <div className="bg-white rounded-[10px] p-5 border border-[#E6E3DF] space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-[10px] bg-[#FF5A4F] text-white font-black text-xl flex items-center justify-center">
                  一场
                </div>
                <div>
                  <h2 className="text-base font-black text-[#171717]">一场 · 校园活动平台</h2>
                  <p className="text-xs text-[#514744]">校园里，总有一场值得去。</p>
                </div>
              </div>
              <p className="text-xs text-[#514744] leading-relaxed">
                「一场」是一款面向高校在校大学生的轻量化校园活动发现、报名、发布与个人活动管理应用。无论是一场草坪音乐节、一场院系篮球赛，还是一场前沿学术讲座，在这里都能快速找到志同道合的校园伙伴。
              </p>
              <div className="pt-3 border-t border-[#F0EEEC] text-xs text-[#8C7E79] space-y-1">
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
    <div className="pb-6 bg-[#F4F2EE] min-h-full">
      <header className="px-4 pt-3 pb-2 flex items-center justify-between">
        <h1 className="text-[22px] font-black tracking-tight text-[#171717]">我的</h1>
        <button
          type="button"
          onClick={() => onOpenAuthScreen('login')}
          className="px-2.5 py-1 rounded-[6px] bg-white border border-[#E6E3DF] text-xs font-semibold text-[#514744] hover:text-[#FF5A4F] flex items-center gap-1"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>切换账号 / 登录页</span>
        </button>
      </header>

      <div className="px-4 space-y-3.5">
        {/* 1. 顶部个人信息区域 */}
        <section className="bg-white rounded-[10px] p-4 border border-[#E6E3DF]">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-13 h-13 rounded-[10px] bg-[#FFF0ED] text-[#FF5A4F] font-black text-xl flex items-center justify-center shrink-0 border border-[#FF5A4F]/20">
                {userProfile.nickname.slice(0, 1)}
              </div>
              <div className="min-w-0">
                <h2 className="text-[18px] font-black text-[#171717] truncate">
                  {userProfile.nickname}
                </h2>
                <p className="text-xs text-[#514744] mt-0.5 truncate">{currentCampus}</p>
                <p className="text-[11px] text-[#8C7E79] mt-0.5 truncate">
                  {userProfile.department} · {userProfile.grade}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onChangeSubPage('profile-settings', 'profile')}
              className="px-2.5 py-1.5 rounded-[6px] bg-[#F7F7F5] border border-[#E6E3DF] text-xs font-semibold text-[#514744] hover:text-[#FF5A4F] shrink-0 flex items-center gap-0.5"
            >
              <span>编辑资料</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 2. 活动数据统计 */}
          <div className="mt-4 pt-3.5 border-t border-[#F0EEEC] grid grid-cols-4 gap-1.5 text-center">
            <button
              type="button"
              onClick={() => onChangeSubPage('my-registrations')}
              className="py-1 rounded-[6px] hover:bg-[#F7F7F5] transition-colors"
            >
              <span className="block text-[20px] font-black text-[#171717] tabular-nums">
                {myRegisteredList.length}
              </span>
              <span className="text-xs text-[#8C7E79] mt-0.5 block">我的报名</span>
            </button>

            <button
              type="button"
              onClick={() => onChangeSubPage('my-buddies')}
              className="py-1 rounded-[6px] hover:bg-[#F7F7F5] transition-colors"
            >
              <span className="block text-[20px] font-black text-[#171717] tabular-nums">
                {myBuddiesList.length}
              </span>
              <span className="text-xs text-[#8C7E79] mt-0.5 block">我的结伴</span>
            </button>

            <button
              type="button"
              onClick={() => onChangeSubPage('my-favorites')}
              className="py-1 rounded-[6px] hover:bg-[#F7F7F5] transition-colors"
            >
              <span className="block text-[20px] font-black text-[#171717] tabular-nums">
                {myFavoritesList.length}
              </span>
              <span className="text-xs text-[#8C7E79] mt-0.5 block">我的收藏</span>
            </button>

            <button
              type="button"
              onClick={() => onChangeSubPage('my-published')}
              className="py-1 rounded-[6px] hover:bg-[#F7F7F5] transition-colors"
            >
              <span className="block text-[20px] font-black text-[#171717] tabular-nums">
                {myPublishedList.length}
              </span>
              <span className="text-xs text-[#8C7E79] mt-0.5 block">我的发布</span>
            </button>
          </div>
        </section>

        {/* 3. 我的活动管理卡片 */}
        <section className="bg-white rounded-[10px] p-4 border border-[#E6E3DF]">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[15px] font-black text-[#171717]">我的活动与报名管理</h2>
            <span className="text-[11px] text-[#8C7E79]">点击「我的报名」可取消报名</span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            <button
              type="button"
              onClick={() => onChangeSubPage('my-registrations')}
              className="p-2.5 rounded-[8px] bg-[#F7F7F5] border border-[#ECE9E4] hover:border-[#FF5A4F] transition-colors flex flex-col items-center text-center"
            >
              <div className="w-8 h-8 rounded-[6px] bg-white text-[#FF5A4F] flex items-center justify-center border border-[#E6E3DF]">
                <CalendarCheck className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-[#171717] mt-2">我的报名</span>
              <span className="text-[11px] text-[#8C7E79] mt-0.5 tabular-nums">
                {myRegisteredList.length} 场记录
              </span>
            </button>

            <button
              type="button"
              onClick={() => onChangeSubPage('my-buddies')}
              className="p-2.5 rounded-[8px] bg-[#F7F7F5] border border-[#ECE9E4] hover:border-[#FF5A4F] transition-colors flex flex-col items-center text-center"
            >
              <div className="w-8 h-8 rounded-[6px] bg-white text-[#FF5A4F] flex items-center justify-center border border-[#E6E3DF]">
                <Users className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-[#171717] mt-2">我的结伴</span>
              <span className="text-[11px] text-[#8C7E79] mt-0.5 tabular-nums">
                {myBuddiesList.length} 组同行
              </span>
            </button>

            <button
              type="button"
              onClick={() => onChangeSubPage('my-favorites')}
              className="p-2.5 rounded-[8px] bg-[#F7F7F5] border border-[#ECE9E4] hover:border-[#FF5A4F] transition-colors flex flex-col items-center text-center"
            >
              <div className="w-8 h-8 rounded-[6px] bg-white text-[#FF5A4F] flex items-center justify-center border border-[#E6E3DF]">
                <Heart className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-[#171717] mt-2">我的收藏</span>
              <span className="text-[11px] text-[#8C7E79] mt-0.5 tabular-nums">
                {myFavoritesList.length} 场心仪
              </span>
            </button>

            <button
              type="button"
              onClick={() => onChangeSubPage('my-published')}
              className="p-2.5 rounded-[8px] bg-[#F7F7F5] border border-[#ECE9E4] hover:border-[#FF5A4F] transition-colors flex flex-col items-center text-center"
            >
              <div className="w-8 h-8 rounded-[6px] bg-white text-[#FF5A4F] flex items-center justify-center border border-[#E6E3DF]">
                <FileText className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-[#171717] mt-2">我的发布</span>
              <span className="text-[11px] text-[#8C7E79] mt-0.5 tabular-nums">
                {myPublishedList.length} 场管理
              </span>
            </button>
          </div>
        </section>

        {/* 4. 系统与账号设置 */}
        <section className="bg-white rounded-[10px] border border-[#E6E3DF] divide-y divide-[#F0EEEC] overflow-hidden">
          <button
            type="button"
            onClick={onOpenCampusSelector}
            className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-[#F7F7F5] transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-[6px] bg-[#FFF0ED] text-[#FF5A4F] flex items-center justify-center">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <span className="text-sm font-semibold text-[#171717] block">切换学校与分校区</span>
                <span className="text-xs text-[#8C7E79]">{currentCampus}</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#9A8984]" />
          </button>

          <button
            type="button"
            onClick={() => onChangeSubPage('profile-settings', 'profile')}
            className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-[#F7F7F5] transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-[6px] bg-[#F7F7F5] text-[#514744] flex items-center justify-center">
                <UserCheck className="w-4 h-4" />
              </div>
              <div>
                <span className="text-sm font-semibold text-[#171717] block">个人资料与学生认证</span>
                <span className="text-xs text-[#8C7E79]">
                  学号：{userProfile.studentId} · 已认证
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#9A8984]" />
          </button>

          <button
            type="button"
            onClick={() => onChangeSubPage('profile-settings', 'settings')}
            className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-[#F7F7F5] transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-[6px] bg-[#F7F7F5] text-[#514744] flex items-center justify-center">
                <Settings className="w-4 h-4" />
              </div>
              <div>
                <span className="text-sm font-semibold text-[#171717] block">消息通知与通用设置</span>
                <span className="text-xs text-[#8C7E79]">课表同步、提醒开关与演示数据重置</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#9A8984]" />
          </button>

          <button
            type="button"
            onClick={() => onOpenAuthScreen('splash')}
            className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-[#F7F7F5] transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-[6px] bg-[#FFF0ED] text-[#FF5A4F] flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <span className="text-sm font-semibold text-[#171717] block">
                  查看启动加载页与注册页
                </span>
                <span className="text-xs text-[#8C7E79]">预览品牌加载动画、登录与新同学注册</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#9A8984]" />
          </button>

          <button
            type="button"
            onClick={() => onChangeSubPage('profile-settings', 'about')}
            className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-[#F7F7F5] transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-[6px] bg-[#F7F7F5] text-[#514744] flex items-center justify-center">
                <Info className="w-4 h-4" />
              </div>
              <div>
                <span className="text-sm font-semibold text-[#171717] block">关于「一场」</span>
                <span className="text-xs text-[#8C7E79]">校园里，总有一场值得去</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#9A8984]" />
          </button>
        </section>

        <button
          type="button"
          onClick={() => onOpenAuthScreen('login')}
          className="w-full h-11 rounded-[8px] bg-white border border-[#E6E3DF] text-[#FF5A4F] font-bold text-sm flex items-center justify-center gap-1.5 hover:bg-[#FFF0ED] transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>退出当前账号 / 返回登录页</span>
        </button>
      </div>
    </div>
  );
};
