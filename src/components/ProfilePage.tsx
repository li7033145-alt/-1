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
} from 'lucide-react';
import {
  Activity,
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
  | 'my-favorites'
  | 'my-published'
  | 'profile-settings';

interface ProfilePageProps {
  userProfile: UserProfile;
  currentCampus: string;
  activities: Activity[];
  subPage: ProfileSubPage;
  initialSettingsTab?: 'profile' | 'settings' | 'about';
  onChangeSubPage: (page: ProfileSubPage, settingsTab?: 'profile' | 'settings' | 'about') => void;
  onOpenCampusSelector: () => void;
  onSelectActivity: (activityId: string) => void;
  onToggleFavorite: (activityId: string) => void;
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
  subPage,
  initialSettingsTab = 'profile',
  onChangeSubPage,
  onOpenCampusSelector,
  onSelectActivity,
  onToggleFavorite,
  onEditPublishedActivity,
  onSimulateApproveActivity,
  onUpdateProfile,
  onResetDemoData,
  onGoToDiscover,
}) => {
  const [regTab, setRegTab] = useState<'all' | 'upcoming' | 'ongoing' | 'ended'>('all');
  const [pubTab, setPubTab] = useState<'all' | 'pending' | 'ongoing' | 'ended'>('all');
  const [settingsTab, setSettingsTab] = useState<'profile' | 'settings' | 'about'>(
    initialSettingsTab
  );
  const [profileForm, setProfileForm] = useState<UserProfile>(userProfile);
  const [savedNotice, setSavedNotice] = useState(false);

  // Synchronized statistics
  const myRegisteredList = activities.filter((a) => a.isRegistered);
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
          <div className="mt-4 pt-4 border-t border-[#F0EEEC] grid grid-cols-3 gap-2 text-center">
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
          <div className="grid grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => onChangeSubPage('my-registrations')}
              className="p-3 rounded-2xl bg-[#F7F7F5] hover:bg-[#FFF0ED] transition-colors flex flex-col items-center text-center group"
            >
              <div className="w-10 h-10 rounded-full bg-white text-[#FF5A4F] flex items-center justify-center shadow-2xs">
                <CalendarCheck className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold text-[#171717] mt-2">我的报名</span>
              <span className="text-[11px] text-[#9A8984] mt-0.5 tabular-nums">
                {myRegisteredList.length} 场记录
              </span>
            </button>

            <button
              type="button"
              onClick={() => onChangeSubPage('my-favorites')}
              className="p-3 rounded-2xl bg-[#F7F7F5] hover:bg-[#FFF0ED] transition-colors flex flex-col items-center text-center group"
            >
              <div className="w-10 h-10 rounded-full bg-white text-[#FF5A4F] flex items-center justify-center shadow-2xs">
                <Heart className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold text-[#171717] mt-2">我的收藏</span>
              <span className="text-[11px] text-[#9A8984] mt-0.5 tabular-nums">
                {myFavoritesList.length} 场心仪
              </span>
            </button>

            <button
              type="button"
              onClick={() => onChangeSubPage('my-published')}
              className="p-3 rounded-2xl bg-[#F7F7F5] hover:bg-[#FFF0ED] transition-colors flex flex-col items-center text-center group"
            >
              <div className="w-10 h-10 rounded-full bg-white text-[#FF5A4F] flex items-center justify-center shadow-2xs">
                <FileText className="w-5 h-5" />
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
