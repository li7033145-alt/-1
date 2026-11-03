import React from 'react';
import {
  Search,
  MapPin,
  ChevronRight,
  Clock,
  Users,
  Sparkles,
  BookOpen,
  Trophy,
  Music,
  Palette,
  Compass,
  Sun,
} from 'lucide-react';
import { Activity, ActivityCategory } from '../types/activity';
import { CAMPUS_LIST, DEMO_NOW_ISO } from '../data/initialData';
import {
  computeActivityStatus,
  formatDateTimeRange,
  formatShortDate,
  getStatusLabel,
} from '../utils/activityRules';
import { CoverArtwork } from './CoverArtwork';

interface HomePageProps {
  currentCampus: string;
  activities: Activity[];
  onOpenCampusSelector: () => void;
  onSelectActivity: (activityId: string) => void;
  onJumpToCategory: (category: ActivityCategory, focusSearch?: boolean) => void;
}

const CATEGORY_ITEMS: {
  name: ActivityCategory;
  icon: React.FC<{ className?: string; strokeWidth?: number }>;
}[] = [
  { name: '全部', icon: Compass },
  { name: '讲座', icon: BookOpen },
  { name: '比赛', icon: Trophy },
  { name: '文体', icon: Music },
  { name: '社团', icon: Users },
  { name: '展览', icon: Palette },
];

export const HomePage: React.FC<HomePageProps> = ({
  currentCampus,
  activities,
  onOpenCampusSelector,
  onSelectActivity,
  onJumpToCategory,
}) => {
  const campusInfo =
    CAMPUS_LIST.find((c) => c.name === currentCampus) || CAMPUS_LIST[0];

  // Filter approved public activities for the current campus
  const campusActivities = activities.filter(
    (a) =>
      a.campus === currentCampus &&
      (!a.reviewStatus || a.reviewStatus === 'approved' || a.reviewStatus === 'ended')
  );

  const featuredActivity =
    campusActivities.find((a) => a.isFeaturedOnHome) || campusActivities[0];

  const ongoingActivities = campusActivities.filter((a) => a.isOngoingOnHome).slice(0, 2);
  const startingSoonActivities = campusActivities
    .filter((a) => a.isStartingSoonOnHome && a.id !== featuredActivity?.id)
    .slice(0, 2);
  const hotActivities = campusActivities.filter((a) => a.isHotOnHome).slice(0, 3);

  const renderStatusText = (act: Activity) => {
    const status = computeActivityStatus(act, DEMO_NOW_ISO);
    const label = getStatusLabel(status);
    if (status === 'open') {
      return <span className="text-xs font-semibold text-[#FF5A4F]">{label}</span>;
    }
    if (status === 'full') {
      return <span className="text-xs font-medium text-[#514744]">{label}</span>;
    }
    return <span className="text-xs font-medium text-[#9A8984]">{label}</span>;
  };

  return (
    <div className="pb-6">
      {/* 1. 顶部区域 */}
      <header className="px-5 pt-3 pb-4 bg-white border-b border-[#F0EEEC]">
        <div className="flex items-start justify-between gap-3">
          {/* 左侧：品牌名称与宣传语 */}
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[24px] font-bold tracking-tight text-[#171717] leading-none">
                一场
              </span>
            </div>
            <p className="text-xs text-[#514744] mt-1.5">
              校园里，总有一场值得去。
            </p>
          </div>

          {/* 右侧：当前学校、切换入口与天气日期 */}
          <div className="flex flex-col items-end shrink-0">
            <button
              type="button"
              onClick={onOpenCampusSelector}
              aria-label={`当前学校：${currentCampus}，点击切换校园`}
              className="flex items-center gap-1 text-xs font-semibold text-[#171717] bg-[#F7F7F5] hover:bg-[#FFF0ED] hover:text-[#FF5A4F] px-3 py-1.5 rounded-full transition-colors max-w-[195px]"
            >
              <MapPin className="w-3.5 h-3.5 text-[#FF5A4F] shrink-0" />
              <span className="truncate">{currentCampus}</span>
              <ChevronRight className="w-3.5 h-3.5 text-[#9A8984] shrink-0" />
            </button>
            <div className="flex items-center gap-1 text-[11px] text-[#9A8984] mt-1.5">
              <Sun className="w-3 h-3 text-[#FF5A4F]" />
              <span>{campusInfo.weatherText}</span>
            </div>
          </div>
        </div>

        {/* 搜索框入口 */}
        <button
          type="button"
          onClick={() => onJumpToCategory('全部', true)}
          aria-label="搜索感兴趣的校园活动"
          className="mt-3.5 w-full h-11 px-4 rounded-[16px] bg-[#F7F7F5] flex items-center gap-2.5 text-left text-sm text-[#9A8984] hover:bg-[#F0EEEC]/80 transition-colors"
        >
          <Search className="w-4 h-4 text-[#9A8984] shrink-0" />
          <span>搜索感兴趣的校园活动</span>
        </button>
      </header>

      <div className="px-5 pt-4 space-y-6">
        {/* 2. 首页推荐区域 */}
        {featuredActivity && (
          <section aria-label="重点活动推荐">
            <div className="bg-white rounded-[18px] overflow-hidden border border-[#F0EEEC]">
              <div
                onClick={() => onSelectActivity(featuredActivity.id)}
                className="relative h-[188px] w-full cursor-pointer"
              >
                <CoverArtwork
                  cover={featuredActivity.cover}
                  title={featuredActivity.title}
                  className="w-full h-full"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute top-3 left-3.5 right-3.5 flex items-center justify-between text-xs text-white/90">
                  <span className="font-medium">
                    重点推荐 · {featuredActivity.category}
                  </span>
                  <span className="font-semibold text-[#FFF0ED]">
                    {getStatusLabel(computeActivityStatus(featuredActivity, DEMO_NOW_ISO))}
                  </span>
                </div>
                <div className="absolute bottom-3.5 left-3.5 right-3.5 text-white">
                  <h2 className="text-[20px] font-bold leading-snug">
                    {featuredActivity.title}
                  </h2>
                  <p className="text-xs text-white/85 mt-1 truncate">
                    {formatDateTimeRange(featuredActivity.startTime, featuredActivity.endTime)} ·{' '}
                    {featuredActivity.location}
                  </p>
                </div>
              </div>

              <div className="px-4 py-3 flex items-center justify-between gap-3">
                <div className="text-xs text-[#514744] tabular-nums">
                  <span>
                    已报名 {featuredActivity.registeredCount}/{featuredActivity.capacity} 人
                  </span>
                  <span className="mx-1.5 text-[#9A8984]">·</span>
                  <span className="text-[#9A8984]">{featuredActivity.organizer}</span>
                </div>
                <button
                  type="button"
                  onClick={() => onSelectActivity(featuredActivity.id)}
                  className="px-3.5 py-1.5 rounded-full bg-[#FF5A4F] text-white text-xs font-semibold whitespace-nowrap shrink-0 active:scale-95 transition-transform"
                >
                  查看详情
                </button>
              </div>
            </div>
          </section>
        )}

        {/* 3. 活动分类区域 */}
        <section aria-label="发现活动">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[17px] font-bold text-[#171717]">发现活动</h2>
            <button
              type="button"
              onClick={() => onJumpToCategory('全部')}
              className="text-xs text-[#9A8984] hover:text-[#FF5A4F] flex items-center gap-0.5"
            >
              <span>全部活动</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="bg-white rounded-[18px] p-3.5 border border-[#F0EEEC] grid grid-cols-6 gap-1">
            {CATEGORY_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => onJumpToCategory(item.name)}
                  className="flex flex-col items-center justify-center py-1.5 rounded-xl hover:bg-[#FFF0ED]/60 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-2xl bg-[#FFF0ED] text-[#FF5A4F] flex items-center justify-center group-active:scale-95 transition-transform">
                    <Icon className="w-5 h-5" strokeWidth={1.9} />
                  </div>
                  <span className="text-xs font-medium text-[#171717] mt-1.5 whitespace-nowrap">
                    {item.name}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* 4. 正在发生区域 */}
        {ongoingActivities.length > 0 && (
          <section aria-label="正在发生">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <h2 className="text-[17px] font-bold text-[#171717]">正在发生</h2>
                <span className="text-xs text-[#9A8984]">现场直击</span>
              </div>
            </div>
            <div className="space-y-3">
              {ongoingActivities.map((act) => (
                <button
                  key={act.id}
                  type="button"
                  onClick={() => onSelectActivity(act.id)}
                  className="w-full text-left bg-white rounded-[18px] p-3.5 border border-[#F0EEEC] flex items-center gap-3.5 hover:border-[#FF5A4F]/40 transition-colors"
                >
                  <div className="w-24 h-20 rounded-xl overflow-hidden shrink-0">
                    <CoverArtwork cover={act.cover} title={act.title} className="w-full h-full" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-[15px] font-bold text-[#171717] truncate">
                        {act.title}
                      </h3>
                      {renderStatusText(act)}
                    </div>
                    <p className="text-xs text-[#514744] mt-1 truncate">
                      {formatShortDate(act.startTime)}
                    </p>
                    <div className="flex items-center justify-between text-xs text-[#9A8984] mt-1.5 tabular-nums">
                      <span className="truncate">{act.location}</span>
                      <span className="shrink-0 ml-2">
                        {act.registeredCount}/{act.capacity}人
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* 5. 即将开始区域 */}
        {startingSoonActivities.length > 0 && (
          <section aria-label="即将开始">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-[17px] font-bold text-[#171717]">即将开始</h2>
              <span className="text-xs text-[#9A8984]">提前锁定名额</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {startingSoonActivities.map((act) => (
                <button
                  key={act.id}
                  type="button"
                  onClick={() => onSelectActivity(act.id)}
                  className="text-left bg-white rounded-[18px] overflow-hidden border border-[#F0EEEC] flex flex-col hover:border-[#FF5A4F]/40 transition-colors"
                >
                  <div className="h-24 w-full">
                    <CoverArtwork cover={act.cover} title={act.title} className="w-full h-full" />
                  </div>
                  <div className="p-3 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-1 text-[11px] text-[#9A8984]">
                        <span>{act.category}</span>
                        {renderStatusText(act)}
                      </div>
                      <h3 className="text-sm font-bold text-[#171717] mt-1 line-clamp-1">
                        {act.title}
                      </h3>
                    </div>
                    <div className="mt-2 pt-2 border-t border-[#F0EEEC] text-[11px] text-[#9A8984] space-y-0.5 tabular-nums">
                      <p className="truncate">{formatShortDate(act.startTime)}</p>
                      <p className="truncate">{act.location}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* 6. 热门活动区域 */}
        <section aria-label="热门活动">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[17px] font-bold text-[#171717]">热门活动</h2>
            <button
              type="button"
              onClick={() => onJumpToCategory('全部')}
              className="text-xs text-[#9A8984] hover:text-[#FF5A4F] flex items-center gap-0.5"
            >
              <span>查看更多</span>
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
                  className="bg-white rounded-[18px] overflow-hidden border border-[#F0EEEC] cursor-pointer hover:border-[#FF5A4F]/40 transition-colors"
                >
                  <div className="h-[140px] w-full relative">
                    <CoverArtwork cover={act.cover} title={act.title} className="w-full h-full" />
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-[16px] font-bold text-[#171717] truncate">
                        {act.title}
                      </h3>
                      <span
                        className={`text-xs font-semibold shrink-0 ${
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
                    <div className="mt-2 space-y-1 text-xs text-[#514744]">
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
                        <span className="text-xs text-[#9A8984] tabular-nums shrink-0">
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
