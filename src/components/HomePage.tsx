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
