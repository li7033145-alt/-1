import React, { useRef, useState } from 'react';
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
  UserCheck,
  UserMinus,
  FileText,
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
    form: {
      attendeeName: string;
      studentId: string;
      phone: string;
      department: string;
      note?: string;
      registrationMode?: 'solo' | 'group';
      buddyId?: string;
    }
  ) => void;
  onCancelRegistration: (activityId: string) => void;
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
  onCancelRegistration,
  onToggleJoinBuddy,
  onCreateBuddyPost,
  onGoToMyRegistrations,
}) => {
  const buddySectionRef = useRef<HTMLElement>(null);

  const [showRegisterSheet, setShowRegisterSheet] = useState(false);
  const [showCancelConfirmSheet, setShowCancelConfirmSheet] = useState(false);
  const [showShareSheet, setShowShareSheet] = useState(false);
  const [showCreateBuddySheet, setShowCreateBuddySheet] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);
  const [copiedBuddyId, setCopiedBuddyId] = useState<string | null>(null);
  const [justRegisteredBanner, setJustRegisteredBanner] = useState(false);
  const [justCanceledBanner, setJustCanceledBanner] = useState(false);

  // Registration modal state: Solo vs Group (linked buddy) mode
  const [registrationMode, setRegistrationMode] = useState<'solo' | 'group'>('solo');
  const [groupSubMode, setGroupSubMode] = useState<'join-existing' | 'create-new'>('join-existing');
  const [selectedExistingBuddyId, setSelectedExistingBuddyId] = useState<string>('');

  // Inline group creation fields inside registration modal
  const [regBuddyTag, setRegBuddyTag] = useState<BuddyTag>('同去现场');
  const [regBuddyTitle, setRegBuddyTitle] = useState<string>('');
  const [regBuddyMeetingPoint, setRegBuddyMeetingPoint] = useState<string>(
    `${activity.location}入口`
  );
  const [regBuddyMaxCount, setRegBuddyMaxCount] = useState<number>(4);

  // Standalone create buddy sheet state
  const [buddyTag, setBuddyTag] = useState<BuddyTag>('同去现场');
  const [buddyTitle, setBuddyTitle] = useState('');
  const [buddyDesc, setBuddyDesc] = useState('');
  const [buddyMeetingPoint, setBuddyMeetingPoint] = useState(`${activity.location}入口`);
  const [buddyMaxCount, setBuddyMaxCount] = useState(4);
  const [buddyContact, setBuddyContact] = useState(
    `微信：${userProfile.phone}（备注：${activity.title}搭子）`
  );
  const [buddyError, setBuddyError] = useState('');

  const activityBuddies = buddyPosts.filter((b) => b.activityId === activity.id);
  const openActivityBuddies = activityBuddies.filter((b) => b.currentCount < b.maxCount);

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

  const openRegisterModal = (defaultMode?: 'solo' | 'group') => {
    setFormError('');
    setJustCanceledBanner(false);
    if (defaultMode) {
      setRegistrationMode(defaultMode);
    }
    if (openActivityBuddies.length > 0 && !selectedExistingBuddyId) {
      setSelectedExistingBuddyId(openActivityBuddies[0].id);
      setGroupSubMode('join-existing');
    } else if (openActivityBuddies.length === 0) {
      setGroupSubMode('create-new');
    }
    setShowRegisterSheet(true);
  };

  const handleConfirmRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    if (!attendeeName.trim() || !studentId.trim() || !phone.trim() || !department.trim()) {
      setFormError('请完整填写姓名、学号、所属院系和联系电话');
      return;
    }

    if (registrationMode === 'group') {
      if (groupSubMode === 'join-existing' && !selectedExistingBuddyId) {
        setFormError('请选择一个要关联的同场搭子小队，或切换为发起新组团');
        return;
      }
      if (groupSubMode === 'create-new' && !regBuddyTitle.trim()) {
        setFormError('请填写组团结伴的一句话招募标题');
        return;
      }
    }

    setFormError('');

    if (registrationMode === 'group') {
      if (groupSubMode === 'join-existing' && selectedExistingBuddyId) {
        const target = activityBuddies.find((b) => b.id === selectedExistingBuddyId);
        if (target && !target.isJoined && !target.isMine) {
          onToggleJoinBuddy(selectedExistingBuddyId);
        }
      } else if (groupSubMode === 'create-new') {
        onCreateBuddyPost({
          activityId: activity.id,
          activityTitle: activity.title,
          activityStartTime: activity.startTime,
          campus: activity.campus,
          subCampus: activity.subCampus || '清远校区',
          tag: regBuddyTag,
          title: regBuddyTitle.trim(),
          description: note.trim() || `已报名《${activity.title}》，寻找同场伙伴一起参加！`,
          meetingPoint: regBuddyMeetingPoint.trim() || `${activity.location}入口`,
          maxCount: regBuddyMaxCount,
          contactCode: `微信：${phone.trim()}（备注：${activity.title}组团）`,
        });
      }
    }

    onRegisterSuccess(activity.id, {
      attendeeName: attendeeName.trim(),
      studentId: studentId.trim(),
      phone: phone.trim(),
      department: department.trim(),
      note: note.trim() || undefined,
      registrationMode,
      buddyId:
        registrationMode === 'group' && groupSubMode === 'join-existing'
          ? selectedExistingBuddyId
          : undefined,
    });
    setShowRegisterSheet(false);
    setJustRegisteredBanner(true);
  };

  const handleConfirmCancelRegistration = () => {
    onCancelRegistration(activity.id);
    setShowCancelConfirmSheet(false);
    setJustRegisteredBanner(false);
    setJustCanceledBanner(true);
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

  const scrollToBuddySection = () => {
    buddySectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Bottom bar primary action button
  const renderPrimaryActionButton = () => {
    if (activity.isRegistered && status !== 'ended') {
      return (
        <div className="flex-1 flex items-center gap-2">
          <button
            type="button"
            data-testid="btn-open-cancel-modal"
            onClick={() => setShowCancelConfirmSheet(true)}
            className="h-[46px] px-3.5 rounded-[8px] bg-[#F7F7F5] border border-[#E6E3DF] text-[#514744] hover:text-[#FF5A4F] hover:border-[#FF5A4F] font-semibold text-xs flex items-center justify-center gap-1 transition-colors shrink-0"
          >
            <UserMinus className="w-3.5 h-3.5" />
            <span>取消报名</span>
          </button>
          <button
            type="button"
            onClick={scrollToBuddySection}
            className="flex-1 h-[46px] rounded-[8px] bg-[#FFF0ED] border border-[#FF5A4F]/30 text-[#FF5A4F] font-bold text-xs flex items-center justify-center gap-1.5 transition-transform active:scale-[0.99]"
          >
            <Users className="w-4 h-4" />
            <span>已报名 · 查看找搭子 ({activityBuddies.length})</span>
          </button>
        </div>
      );
    }

    if (status === 'open') {
      return (
        <button
          type="button"
          data-testid="btn-open-register-modal"
          onClick={() => openRegisterModal('solo')}
          className="flex-1 h-[46px] rounded-[8px] bg-[#FF5A4F] text-white font-bold text-[15px] flex items-center justify-center transition-transform active:scale-[0.99]"
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
          className="flex-1 h-[46px] rounded-[8px] bg-[#EAE9E7] text-[#99938F] font-semibold text-[15px] flex items-center justify-center cursor-not-allowed"
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
          className="flex-1 h-[46px] rounded-[8px] bg-[#EAE9E7] text-[#99938F] font-semibold text-[15px] flex items-center justify-center cursor-not-allowed"
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
          className="flex-1 h-[46px] rounded-[8px] bg-[#EAE9E7] text-[#99938F] font-semibold text-[15px] flex items-center justify-center cursor-not-allowed"
        >
          活动已结束
        </button>
      );
    }

    return (
      <button
        type="button"
        disabled
        className="flex-1 h-[46px] rounded-[8px] bg-[#EAE9E7] text-[#99938F] font-semibold text-[15px] flex items-center justify-center cursor-not-allowed"
      >
        暂未开放
      </button>
    );
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-[#F4F2EE]">
      <div className="flex-1 overflow-y-auto pb-6">
        {/* 顶部紧凑封面图 + 导航栏（保留充足首屏空间展示核心活动介绍） */}
        <div className="relative h-[156px] w-full">
          <CoverArtwork cover={activity.cover} title={activity.title} className="w-full h-full" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/45" />

          <div className="absolute top-3 left-4 right-4 flex items-center justify-between">
            <button
              type="button"
              onClick={onBack}
              aria-label="返回上一页"
              className="w-9 h-9 rounded-[8px] bg-black/45 backdrop-blur-xs text-white flex items-center justify-center hover:bg-black/65 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={() => onToggleFavorite(activity.id)}
              aria-label={activity.favorite ? '取消收藏活动' : '收藏活动'}
              className="w-9 h-9 rounded-[8px] bg-black/45 backdrop-blur-xs text-white flex items-center justify-center hover:bg-black/65 transition-colors"
            >
              <Heart
                className={`w-5 h-5 ${
                  activity.favorite ? 'fill-[#FF5A4F] text-[#FF5A4F]' : 'text-white'
                }`}
              />
            </button>
          </div>
        </div>

        {/* 主体内容区：首屏直接展示「核心活动介绍（时间、地点、报名说明）」 */}
        <div className="px-4 -mt-3 relative z-10 space-y-3">
          {/* 状态 D（已结束）提示栏 */}
          {status === 'ended' && (
            <div className="bg-white rounded-[10px] px-4 py-3 border border-[#E6E3DF] flex items-center gap-2.5 text-xs text-[#514744]">
              <AlertCircle className="w-4 h-4 text-[#9A8984] shrink-0" />
              <span>本场活动已结束，以下为活动详情与精彩回顾。</span>
            </div>
          )}

          {/* 取消报名反馈横幅 */}
          {justCanceledBanner && (
            <div className="bg-white rounded-[10px] p-3.5 border border-[#E6E3DF] flex items-center justify-between gap-2 text-xs text-[#514744]">
              <span>已取消本场活动报名，名额已释放。如需参加可重新报名。</span>
              <button
                type="button"
                onClick={() => setJustCanceledBanner(false)}
                className="text-[#9A8984] hover:text-[#171717]"
              >
                关闭
              </button>
            </div>
          )}

          {/* 已报名状态横幅 */}
          {activity.isRegistered && (
            <div className="bg-[#FFF0ED] rounded-[10px] p-3.5 border border-[#FF5A4F]/30">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <CheckCircle2 className="w-4 h-4 text-[#FF5A4F] shrink-0" />
                  <p className="text-xs font-bold text-[#171717] truncate">
                    {justRegisteredBanner ? '报名成功！名额已锁定' : '您已报名本场活动'}
                    {activity.registrationRecord?.registrationMode === 'group'
                      ? '（组团报名 · 已关联搭子）'
                      : '（个人报名）'}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={onGoToMyRegistrations}
                    className="text-xs font-semibold text-[#FF5A4F] underline"
                  >
                    我的报名
                  </button>
                  {status !== 'ended' && (
                    <button
                      type="button"
                      onClick={() => setShowCancelConfirmSheet(true)}
                      className="px-2 py-1 rounded-[6px] bg-white text-[#514744] hover:text-[#FF5A4F] text-xs font-semibold border border-[#E6E3DF]"
                    >
                      取消报名
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 首屏核心卡片：标题 + 活动介绍 + 时间 / 地点 / 报名说明 一体化首屏呈现 */}
          <section
            aria-label="核心活动介绍"
            data-testid="activity-intro-section"
            className="bg-white rounded-[10px] p-4 border border-[#E6E3DF] space-y-3.5"
          >
            {/* 分类、校区与状态 */}
            <div>
              <div className="flex items-center justify-between gap-2 text-xs">
                <span className="text-[#8C7E79] font-medium">
                  {activity.category} · {activity.campus}
                  {activity.subCampus ? ` (${activity.subCampus})` : ''}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-[6px] font-bold ${
                    status === 'open'
                      ? 'bg-[#FFF0ED] text-[#FF5A4F]'
                      : status === 'full'
                      ? 'bg-[#F4F2EE] text-[#514744]'
                      : 'bg-[#F4F2EE] text-[#9A8984]'
                  }`}
                >
                  {statusLabel}
                </span>
              </div>

              <h1 className="text-[20px] font-black text-[#171717] mt-1.5 leading-snug">
                {activity.title}
              </h1>
            </div>

            {/* 核心活动介绍文案（首屏直接可见） */}
            <div className="p-3 rounded-[8px] bg-[#FAF9F7] border border-[#ECE9E4]">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-extrabold text-[#171717] flex items-center gap-1.5">
                  <span className="w-1 h-3.5 rounded-[2px] bg-[#FF5A4F]" />
                  活动介绍
                </span>
                <span className="text-[11px] text-[#8C7E79]">首屏核心概览</span>
              </div>
              <p className="text-[13px] text-[#3B3330] leading-relaxed whitespace-pre-line">
                {activity.description}
              </p>
            </div>

            {/* 核心要素：时间、地点、报名说明（名额/起止/参与要求） */}
            <div className="space-y-2.5 pt-1">
              <div className="flex items-start gap-2.5 text-xs">
                <Clock className="w-4 h-4 text-[#FF5A4F] shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <span className="text-[#8C7E79]">活动时间：</span>
                  <span className="font-bold text-[#171717]">
                    {formatDateTimeRange(activity.startTime, activity.endTime)}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 text-xs">
                <MapPin className="w-4 h-4 text-[#FF5A4F] shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <span className="text-[#8C7E79]">活动地点：</span>
                  <span className="font-bold text-[#171717]">{activity.location}</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 text-xs">
                <Building2 className="w-4 h-4 text-[#FF5A4F] shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <span className="text-[#8C7E79]">主办单位：</span>
                  <span className="font-medium text-[#171717]">{activity.organizer}</span>
                </div>
              </div>

              {/* 报名说明区块（含报名起止时间、名额进度、参与要求与须知） */}
              <div className="p-3 rounded-[8px] bg-[#F7F7F5] border border-[#ECE9E4] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#171717] flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-[#FF5A4F]" />
                    报名说明与参与要求
                  </span>
                  <span className="text-[#FF5A4F] font-bold tabular-nums">
                    {status === 'open'
                      ? `剩余 ${remainingSpots}/${activity.capacity} 名额`
                      : `已报 ${activity.registeredCount}/${activity.capacity} 人`}
                  </span>
                </div>

                {/* 进度条 */}
                <div className="h-1.5 w-full rounded-[4px] bg-[#E6E3DF] overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      status === 'open' ? 'bg-[#FF5A4F]' : 'bg-[#9A8984]'
                    }`}
                    style={{ width: `${status === 'full' ? 100 : progressPercent}%` }}
                  />
                </div>

                <div className="flex items-center gap-1.5 text-xs text-[#514744]">
                  <Calendar className="w-3.5 h-3.5 text-[#8C7E79] shrink-0" />
                  <span>
                    报名时间：
                    {formatDateTimeRange(
                      activity.registrationStartTime,
                      activity.registrationDeadline
                    )}
                  </span>
                </div>

                <ul className="space-y-1 pt-1 border-t border-[#E6E3DF]/70 text-xs text-[#514744]">
                  {activity.requirements.map((req, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-[#FF5A4F] font-bold">·</span>
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* 板块 2：活动流程与主办方详情 */}
          {activity.schedule && activity.schedule.length > 0 && (
            <section className="bg-white rounded-[10px] p-4 border border-[#E6E3DF]">
              <h2 className="text-[16px] font-black text-[#171717]">活动流程安排</h2>
              <div className="mt-3 space-y-3">
                {activity.schedule.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-[6px] bg-[#FFF0ED] text-[#FF5A4F] text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 tabular-nums">
                      {idx + 1}
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-xs font-bold text-[#FF5A4F] tabular-nums">
                        {step.time}
                      </span>
                      <h3 className="text-sm font-bold text-[#171717] mt-0.5">{step.title}</h3>
                      <p className="text-xs text-[#514744] mt-0.5">{step.detail}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-3.5 pt-3 border-t border-[#F0EEEC] flex items-center justify-between text-xs text-[#8C7E79]">
                <span>主办方：{activity.organizer}</span>
                <span className="flex items-center gap-1">
                  <Phone className="w-3 h-3" />
                  {activity.contact}
                </span>
              </div>
            </section>
          )}

          {/* 板块 3：「立即报名」主操作区（位于「找搭子」模块之前） */}
          <section
            aria-label="活动报名主操作区"
            data-testid="inline-registration-cta-section"
            className="bg-white rounded-[10px] p-4 border border-[#E6E3DF] space-y-2.5"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-[16px] font-black text-[#171717]">活动报名通道</h2>
                <p className="text-xs text-[#8C7E79] mt-0.5">
                  点击下方按钮可选择「个人报名」或「组团报名（关联搭子）」
                </p>
              </div>
              <span className="text-xs font-bold text-[#FF5A4F] tabular-nums">
                {activity.registeredCount}/{activity.capacity}人
              </span>
            </div>

            {activity.isRegistered ? (
              <div className="flex items-center gap-2 pt-1">
                <div className="flex-1 h-10 px-3 rounded-[8px] bg-[#FFF0ED] text-[#FF5A4F] text-xs font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>
                    已完成
                    {activity.registrationRecord?.registrationMode === 'group'
                      ? '组团报名'
                      : '个人报名'}
                  </span>
                </div>
                {status !== 'ended' && (
                  <button
                    type="button"
                    onClick={() => setShowCancelConfirmSheet(true)}
                    className="h-10 px-3.5 rounded-[8px] bg-[#F7F7F5] border border-[#E6E3DF] text-[#514744] hover:text-[#FF5A4F] text-xs font-semibold"
                  >
                    取消报名
                  </button>
                )}
              </div>
            ) : status === 'open' ? (
              <button
                type="button"
                data-testid="btn-inline-register"
                onClick={() => openRegisterModal('solo')}
                className="w-full h-11 rounded-[8px] bg-[#FF5A4F] text-white font-bold text-sm flex items-center justify-center gap-2 transition-transform active:scale-[0.99]"
              >
                <span>立即报名（选择个人 / 组团报名）</span>
              </button>
            ) : (
              <button
                type="button"
                disabled
                className="w-full h-11 rounded-[8px] bg-[#EAE9E7] text-[#99938F] font-semibold text-sm cursor-not-allowed"
              >
                {statusLabel}
              </button>
            )}
          </section>

          {/* 板块 4：「找搭子」模块（严格移至「立即报名」按钮之后） */}
          <section
            ref={buddySectionRef}
            aria-label="找搭子与同场组团"
            data-testid="buddy-section-after-register"
            className="bg-white rounded-[10px] p-4 border border-[#E6E3DF]"
          >
            <div className="flex items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-1.5">
                  <h2 className="text-[15px] font-bold text-[#171717]">找搭子 · 同场组团结伴</h2>
                  <span className="text-xs font-semibold text-[#FF5A4F] tabular-nums">
                    ({activityBuddies.length}组)
                  </span>
                </div>
                <p className="text-xs text-[#8C7E79] mt-0.5">
                  {activity.isRegistered
                    ? '您已报名，可直接加入下方同场搭子小队或发起新组团'
                    : '报名时可选择「组团报名（关联搭子）」一键加入以下小队'}
                </p>
              </div>
              {status !== 'ended' && (
                <button
                  type="button"
                  onClick={() => {
                    if (activity.isRegistered) {
                      setShowCreateBuddySheet(true);
                    } else if (status === 'open') {
                      openRegisterModal('group');
                    }
                  }}
                  className="px-2.5 py-1.5 rounded-[6px] bg-[#FFF0ED] text-[#FF5A4F] text-xs font-bold flex items-center gap-1 shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{activity.isRegistered ? '发起搭子' : '组团报名'}</span>
                </button>
              )}
            </div>

            {activityBuddies.length === 0 ? (
              <div className="mt-3 p-3.5 rounded-[8px] bg-[#F7F7F5] text-center">
                <p className="text-xs text-[#514744]">本场活动暂无人发起搭子小队</p>
              </div>
            ) : (
              <div className="mt-3 space-y-2.5">
                {activityBuddies.map((post) => {
                  const isFull = post.currentCount >= post.maxCount;
                  return (
                    <div
                      key={post.id}
                      className="p-3 rounded-[8px] bg-[#F7F7F5] border border-[#ECE9E4] space-y-2"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-6 h-6 rounded-[6px] bg-[#171717] text-white font-bold text-xs flex items-center justify-center shrink-0">
                            {post.authorName.slice(0, 1)}
                          </div>
                          <span className="text-xs font-bold text-[#171717] truncate">
                            {post.authorName}
                          </span>
                          <span className="text-[11px] text-[#8C7E79] truncate">
                            {post.authorGrade} · {post.authorDepartment}
                          </span>
                        </div>
                        <span className="px-1.5 py-0.5 rounded-[4px] bg-[#FFF0ED] text-[11px] font-semibold text-[#FF5A4F] shrink-0">
                          {post.tag}
                        </span>
                      </div>

                      <div>
                        <h3 className="text-xs font-bold text-[#171717]">{post.title}</h3>
                        <p className="text-xs text-[#514744] mt-0.5">{post.description}</p>
                      </div>

                      {(post.isJoined || post.isMine) && (
                        <div className="p-2 rounded-[6px] bg-white border border-[#E6E3DF] flex items-center justify-between gap-2 text-xs">
                          <span className="font-semibold text-[#171717] truncate">
                            {post.contactCode}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopyBuddyContact(post.id, post.contactCode)}
                            className="px-2 py-0.5 rounded-[4px] bg-[#FFF0ED] text-[#FF5A4F] text-[11px] font-semibold shrink-0"
                          >
                            {copiedBuddyId === post.id ? '已复制' : '复制'}
                          </button>
                        </div>
                      )}

                      <div className="pt-2 border-t border-[#E6E3DF] flex items-center justify-between gap-2 text-xs">
                        <span className="text-[#514744] tabular-nums">
                          已组队 {post.currentCount}/{post.maxCount} 人
                        </span>
                        {post.isMine ? (
                          <span className="text-[#FF5A4F] font-semibold">我发起的</span>
                        ) : post.isJoined ? (
                          <button
                            type="button"
                            onClick={() => onToggleJoinBuddy(post.id)}
                            className="px-2.5 py-1 rounded-[6px] bg-white border border-[#E6E3DF] text-[#514744] font-medium"
                          >
                            已加入 · 退出
                          </button>
                        ) : isFull ? (
                          <span className="text-[#9A8984]">已满员</span>
                        ) : activity.isRegistered ? (
                          <button
                            type="button"
                            onClick={() => onToggleJoinBuddy(post.id)}
                            className="px-3 py-1 rounded-[6px] bg-[#FF5A4F] text-white font-semibold"
                          >
                            加入搭子
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedExistingBuddyId(post.id);
                              setGroupSubMode('join-existing');
                              openRegisterModal('group');
                            }}
                            className="px-3 py-1 rounded-[6px] bg-[#FFF0ED] text-[#FF5A4F] font-bold"
                          >
                            关联该队组团报名
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* 状态 D 专属：活动回顾区域 */}
          {status === 'ended' && activity.recap && (
            <section className="bg-white rounded-[10px] p-4 border border-[#E6E3DF]">
              <div className="flex items-center justify-between">
                <h2 className="text-[16px] font-black text-[#171717]">活动回顾</h2>
                <span className="text-xs text-[#FF5A4F] font-semibold">精彩纪实</span>
              </div>
              <p className="text-sm text-[#514744] leading-relaxed mt-2">
                {activity.recap.summary}
              </p>
              <div className="mt-3 p-3 rounded-[8px] bg-[#F7F7F5] space-y-1.5">
                {activity.recap.highlights.map((hl, idx) => (
                  <p key={idx} className="text-xs text-[#171717] flex items-start gap-2">
                    <span className="text-[#FF5A4F] font-bold">✓</span>
                    <span>{hl}</span>
                  </p>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      {/* 底部固定操作栏：收藏、分享、立即报名 */}
      <div className="shrink-0 z-30 bg-white border-t border-[#E6E3DF] px-4 py-2.5 flex items-center gap-2.5">
        <button
          type="button"
          onClick={() => onToggleFavorite(activity.id)}
          aria-label={activity.favorite ? '已收藏，点击取消收藏' : '收藏'}
          className="flex flex-col items-center justify-center min-w-[44px] min-h-[44px] text-xs text-[#514744] hover:text-[#FF5A4F] transition-colors"
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
          className="flex flex-col items-center justify-center min-w-[44px] min-h-[44px] text-xs text-[#514744] hover:text-[#FF5A4F] transition-colors"
        >
          <Share2 className="w-5 h-5" />
          <span className="text-[11px] mt-0.5">分享</span>
        </button>

        {renderPrimaryActionButton()}
      </div>

      {/* 点击报名按钮弹窗：选择「个人报名」或「组团报名（关联搭子）」 */}
      {showRegisterSheet && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="选择报名方式"
          data-testid="register-mode-dialog"
          className="fixed inset-0 z-50 bg-black/50 flex items-end justify-center"
        >
          <div className="w-full max-w-[430px] bg-white rounded-t-[14px] p-5 space-y-4 max-h-[88dvh] overflow-y-auto no-scrollbar">
            <div className="flex items-center justify-between border-b border-[#F0EEEC] pb-3">
              <div>
                <h3 className="text-[18px] font-black text-[#171717]">选择报名方式</h3>
                <p className="text-xs text-[#8C7E79] mt-0.5">
                  {activity.title} · 剩余 {remainingSpots} 个名额
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowRegisterSheet(false)}
                aria-label="关闭报名弹窗"
                className="w-8 h-8 rounded-[6px] bg-[#F7F7F5] flex items-center justify-center text-[#514744]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmRegistration} className="space-y-3.5">
              {/* 1. 选择报名模式：个人报名 vs 组团报名（关联搭子） */}
              <div>
                <label className="block text-xs font-bold text-[#171717] mb-2">
                  1. 请选择报名类型 <span className="text-[#FF5A4F]">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    data-testid="mode-solo-btn"
                    onClick={() => setRegistrationMode('solo')}
                    className={`p-3 rounded-[8px] border text-left transition-all ${
                      registrationMode === 'solo'
                        ? 'border-[#FF5A4F] bg-[#FFF0ED]/70'
                        : 'border-[#E6E3DF] bg-[#F7F7F5]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-[#171717]">个人报名</span>
                      <UserCheck
                        className={`w-4 h-4 ${
                          registrationMode === 'solo' ? 'text-[#FF5A4F]' : 'text-[#9A8984]'
                        }`}
                      />
                    </div>
                    <p className="text-[11px] text-[#514744] mt-1">
                      单人直接报名，快速锁定个人入场名额
                    </p>
                  </button>

                  <button
                    type="button"
                    data-testid="mode-group-btn"
                    onClick={() => setRegistrationMode('group')}
                    className={`p-3 rounded-[8px] border text-left transition-all ${
                      registrationMode === 'group'
                        ? 'border-[#FF5A4F] bg-[#FFF0ED]/70'
                        : 'border-[#E6E3DF] bg-[#F7F7F5]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-[#171717]">组团报名</span>
                      <Users
                        className={`w-4 h-4 ${
                          registrationMode === 'group' ? 'text-[#FF5A4F]' : 'text-[#9A8984]'
                        }`}
                      />
                    </div>
                    <p className="text-[11px] text-[#514744] mt-1">
                      关联搭子小队结伴同行，或发起新组团
                    </p>
                  </button>
                </div>
              </div>

              {/* 如果选择「组团报名（关联搭子）」，展开搭子关联面板 */}
              {registrationMode === 'group' && (
                <div
                  data-testid="group-buddy-association-panel"
                  className="p-3.5 rounded-[8px] bg-[#F7F7F5] border border-[#E6E3DF] space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#171717]">关联同场搭子小队</span>
                    <span className="text-[11px] text-[#FF5A4F] font-semibold">
                      组团报名专属
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setGroupSubMode('join-existing')}
                      className={`flex-1 py-1.5 rounded-[6px] text-xs font-bold transition-colors ${
                        groupSubMode === 'join-existing'
                          ? 'bg-[#171717] text-white'
                          : 'bg-white text-[#514744] border border-[#E6E3DF]'
                      }`}
                    >
                      关联已有搭子 ({openActivityBuddies.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setGroupSubMode('create-new')}
                      className={`flex-1 py-1.5 rounded-[6px] text-xs font-bold transition-colors ${
                        groupSubMode === 'create-new'
                          ? 'bg-[#171717] text-white'
                          : 'bg-white text-[#514744] border border-[#E6E3DF]'
                      }`}
                    >
                      发起新搭子组团
                    </button>
                  </div>

                  {groupSubMode === 'join-existing' ? (
                    openActivityBuddies.length > 0 ? (
                      <div className="space-y-2">
                        {openActivityBuddies.map((b) => {
                          const selected = selectedExistingBuddyId === b.id;
                          return (
                            <div
                              key={b.id}
                              onClick={() => setSelectedExistingBuddyId(b.id)}
                              role="button"
                              tabIndex={0}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ')
                                  setSelectedExistingBuddyId(b.id);
                              }}
                              className={`p-2.5 rounded-[6px] border cursor-pointer transition-colors ${
                                selected
                                  ? 'bg-white border-[#FF5A4F]'
                                  : 'bg-white/70 border-[#E6E3DF]'
                              }`}
                            >
                              <div className="flex items-center justify-between text-xs">
                                <span className="font-bold text-[#171717] truncate">
                                  {b.title}
                                </span>
                                <span className="text-[#FF5A4F] font-semibold shrink-0 ml-2">
                                  {b.currentCount}/{b.maxCount}人
                                </span>
                              </div>
                              <p className="text-[11px] text-[#8C7E79] mt-0.5 truncate">
                                发起人：{b.authorName} · 集合：{b.meetingPoint}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-xs text-[#8C7E79] py-2 text-center">
                        暂无空缺小队，请点击上方「发起新搭子组团」创建你的队伍
                      </p>
                    )
                  ) : (
                    <div className="space-y-2.5">
                      <div className="grid grid-cols-4 gap-1.5">
                        {BUDDY_TAGS.map((t) => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => setRegBuddyTag(t)}
                            className={`py-1 rounded-[6px] text-[11px] font-semibold ${
                              regBuddyTag === t
                                ? 'bg-[#FF5A4F] text-white'
                                : 'bg-white text-[#514744] border border-[#E6E3DF]'
                            }`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                      <input
                        type="text"
                        value={regBuddyTitle}
                        onChange={(e) => setRegBuddyTitle(e.target.value)}
                        placeholder="一句话组团口号，如：南区草坪前排一起听歌！"
                        aria-label="一句话组团口号"
                        className="w-full h-9 px-3 rounded-[6px] bg-white text-xs text-[#171717] border border-[#E6E3DF]"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={regBuddyMeetingPoint}
                          onChange={(e) => setRegBuddyMeetingPoint(e.target.value)}
                          placeholder="集合地点"
                          aria-label="组团集合地点"
                          className="w-full h-9 px-2.5 rounded-[6px] bg-white text-xs text-[#171717] border border-[#E6E3DF]"
                        />
                        <div className="flex items-center gap-1">
                          {[2, 3, 4, 6].map((n) => (
                            <button
                              key={n}
                              type="button"
                              onClick={() => setRegBuddyMaxCount(n)}
                              className={`flex-1 h-9 rounded-[6px] text-xs font-semibold ${
                                regBuddyMaxCount === n
                                  ? 'bg-[#FF5A4F] text-white'
                                  : 'bg-white text-[#514744] border border-[#E6E3DF]'
                              }`}
                            >
                              {n}人
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 2. 确认报名人基本信息 */}
              <div className="space-y-2.5 pt-1">
                <label className="block text-xs font-bold text-[#171717]">
                  2. 确认报名人信息 <span className="text-[#FF5A4F]">*</span>
                </label>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-medium text-[#514744] mb-1">
                      真实姓名
                    </label>
                    <input
                      type="text"
                      value={attendeeName}
                      onChange={(e) => setAttendeeName(e.target.value)}
                      className="w-full h-9 px-3 rounded-[6px] bg-[#F7F7F5] text-xs text-[#171717] border border-[#E6E3DF]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-[#514744] mb-1">
                      学号
                    </label>
                    <input
                      type="text"
                      value={studentId}
                      onChange={(e) => setStudentId(e.target.value)}
                      className="w-full h-9 px-3 rounded-[6px] bg-[#F7F7F5] text-xs text-[#171717] border border-[#E6E3DF]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-medium text-[#514744] mb-1">
                      联系电话
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full h-9 px-3 rounded-[6px] bg-[#F7F7F5] text-xs text-[#171717] border border-[#E6E3DF]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-[#514744] mb-1">
                      所属院系专业
                    </label>
                    <input
                      type="text"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full h-9 px-3 rounded-[6px] bg-[#F7F7F5] text-xs text-[#171717] border border-[#E6E3DF]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-[#514744] mb-1">
                    报名备注（选填）
                  </label>
                  <input
                    type="text"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="如有特殊说明可填写"
                    className="w-full h-9 px-3 rounded-[6px] bg-[#F7F7F5] text-xs text-[#171717] border border-[#E6E3DF]"
                  />
                </div>
              </div>

              {formError && <p className="text-xs font-medium text-[#FF5A4F]">{formError}</p>}

              <div className="pt-2 flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowRegisterSheet(false)}
                  className="w-1/3 h-11 rounded-[8px] bg-[#F7F7F5] border border-[#E6E3DF] text-[#514744] font-semibold text-sm"
                >
                  取消
                </button>
                <button
                  type="submit"
                  data-testid="btn-confirm-registration"
                  className="flex-1 h-11 rounded-[8px] bg-[#FF5A4F] text-white font-bold text-sm"
                >
                  {registrationMode === 'group' ? '确认组团报名（关联搭子）' : '确认个人报名'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 取消报名确认弹窗 Sheet */}
      {showCancelConfirmSheet && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="确认取消报名"
          className="fixed inset-0 z-50 bg-black/50 flex items-end justify-center"
        >
          <div className="w-full max-w-[430px] bg-white rounded-t-[14px] p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-[17px] font-black text-[#171717]">确认取消报名？</h3>
              <button
                type="button"
                onClick={() => setShowCancelConfirmSheet(false)}
                aria-label="关闭取消报名弹窗"
                className="w-8 h-8 rounded-[6px] bg-[#F7F7F5] flex items-center justify-center text-[#514744]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3.5 rounded-[8px] bg-[#F7F7F5] border border-[#ECE9E4] text-xs text-[#514744] space-y-1">
              <p className="font-bold text-[#171717]">{activity.title}</p>
              <p>取消后，您的报名记录将被移除，名额将立即释放给其他同学。</p>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setShowCancelConfirmSheet(false)}
                className="flex-1 h-11 rounded-[8px] bg-[#F7F7F5] border border-[#E6E3DF] text-[#514744] font-semibold text-sm"
              >
                保留报名
              </button>
              <button
                type="button"
                data-testid="btn-confirm-cancel-registration"
                onClick={handleConfirmCancelRegistration}
                className="flex-1 h-11 rounded-[8px] bg-[#FF5A4F] text-white font-bold text-sm"
              >
                确认取消报名
              </button>
            </div>
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
          <div className="w-full max-w-[430px] bg-white rounded-t-[14px] p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[#171717]">分享给同校好友</h3>
              <button
                type="button"
                onClick={() => setShowShareSheet(false)}
                aria-label="关闭分享弹窗"
                className="w-8 h-8 rounded-[6px] bg-[#F7F7F5] flex items-center justify-center"
              >
                <X className="w-4 h-4 text-[#514744]" />
              </button>
            </div>

            <div className="p-3.5 rounded-[8px] bg-[#F7F7F5] text-xs text-[#514744] space-y-1">
              <p className="font-bold text-[#171717]">{activity.title}</p>
              <p>时间：{formatDateTimeRange(activity.startTime, activity.endTime)}</p>
              <p>
                地点：{activity.campus} · {activity.location}
              </p>
            </div>

            <button
              type="button"
              onClick={handleCopyShareLink}
              className="w-full h-11 rounded-[8px] bg-[#FF5A4F] text-white font-bold text-sm flex items-center justify-center gap-2"
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
          <div className="w-full max-w-[430px] bg-white rounded-t-[14px] p-5 space-y-3.5 max-h-[88dvh] overflow-y-auto no-scrollbar">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-[17px] font-bold text-[#171717]">发起同场结伴</h3>
                <p className="text-xs text-[#8C7E79] mt-0.5 truncate">
                  关联活动：{activity.title}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateBuddySheet(false)}
                aria-label="关闭发起结伴弹窗"
                className="w-8 h-8 rounded-[6px] bg-[#F7F7F5] flex items-center justify-center text-[#514744]"
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
                        className={`py-1.5 rounded-[6px] text-xs font-semibold transition-colors ${
                          active ? 'bg-[#FF5A4F] text-white' : 'bg-[#F7F7F5] text-[#514744]'
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
                  className="w-full h-10 px-3 rounded-[8px] bg-[#F7F7F5] text-sm text-[#171717] border border-[#E6E3DF]"
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
                  className="w-full p-3 rounded-[8px] bg-[#F7F7F5] text-sm text-[#171717] border border-[#E6E3DF] resize-none"
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
                        className={`flex-1 h-9 rounded-[6px] text-xs font-semibold tabular-nums ${
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
                    className="w-full h-9 px-3 rounded-[6px] bg-[#F7F7F5] text-xs text-[#171717] border border-[#E6E3DF]"
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
                  className="w-full h-10 px-3 rounded-[8px] bg-[#F7F7F5] text-xs text-[#171717] border border-[#E6E3DF]"
                />
              </div>

              {buddyError && <p className="text-xs text-[#FF5A4F]">{buddyError}</p>}

              <div className="pt-2 flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowCreateBuddySheet(false)}
                  className="w-1/3 h-11 rounded-[8px] bg-[#F7F7F5] text-[#514744] font-semibold text-sm"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="flex-1 h-11 rounded-[8px] bg-[#FF5A4F] text-white font-bold text-sm"
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
