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
