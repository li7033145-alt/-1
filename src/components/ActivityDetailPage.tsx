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
} from 'lucide-react';
import { Activity, UserProfile } from '../types/activity';
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
  onBack: () => void;
  onToggleFavorite: (activityId: string) => void;
  onRegisterSuccess: (
    activityId: string,
    form: { attendeeName: string; studentId: string; phone: string; department: string; note?: string }
  ) => void;
  onGoToMyRegistrations: () => void;
}

export const ActivityDetailPage: React.FC<ActivityDetailPageProps> = ({
  activity,
  userProfile,
  onBack,
  onToggleFavorite,
  onRegisterSuccess,
  onGoToMyRegistrations,
}) => {
  const [showRegisterSheet, setShowRegisterSheet] = useState(false);
  const [showShareSheet, setShowShareSheet] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);
  const [justRegisteredBanner, setJustRegisteredBanner] = useState(false);

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
    </div>
  );
};
