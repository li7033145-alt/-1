import React, { useEffect, useRef } from 'react';
import { Search, MapPin, ChevronRight, Clock, X } from 'lucide-react';
import {
  Activity,
  ActivityCategory,
  StatusFilter,
  TimeRangeFilter,
} from '../types/activity';
import { DEMO_NOW_ISO } from '../data/initialData';
import {
  computeActivityStatus,
  filterActivities,
  formatDateTimeRange,
  getStatusLabel,
} from '../utils/activityRules';
import { CoverArtwork } from './CoverArtwork';

interface ActivitiesPageProps {
  currentCampus: string;
  activities: Activity[];
  selectedCategory: ActivityCategory;
  searchKeyword: string;
  timeRange: TimeRangeFilter;
  statusFilter: StatusFilter;
  autoFocusSearch?: boolean;
  onChangeCategory: (cat: ActivityCategory) => void;
  onChangeSearch: (kw: string) => void;
  onChangeTimeRange: (tr: TimeRangeFilter) => void;
  onChangeStatusFilter: (sf: StatusFilter) => void;
  onOpenCampusSelector: () => void;
  onSelectActivity: (activityId: string) => void;
  onClearAutoFocus?: () => void;
}

const CATEGORIES: ActivityCategory[] = ['全部', '讲座', '比赛', '文体', '社团', '展览'];

const TIME_FILTERS: { id: TimeRangeFilter; label: string }[] = [
  { id: 'all', label: '全部时间' },
  { id: 'today', label: '今天' },
  { id: 'week', label: '本周' },
  { id: 'month', label: '本月' },
];

const STATUS_FILTERS: { id: StatusFilter; label: string }[] = [
  { id: 'all', label: '全部状态' },
  { id: 'open', label: '报名中' },
  { id: 'full', label: '报名已满' },
  { id: 'closed', label: '报名已截止' },
  { id: 'ended', label: '已结束' },
  { id: 'upcoming', label: '即将开放' },
];

export const ActivitiesPage: React.FC<ActivitiesPageProps> = ({
  currentCampus,
  activities,
  selectedCategory,
  searchKeyword,
  timeRange,
  statusFilter,
  autoFocusSearch,
  onChangeCategory,
  onChangeSearch,
  onChangeTimeRange,
  onChangeStatusFilter,
  onOpenCampusSelector,
  onSelectActivity,
  onClearAutoFocus,
}) => {
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocusSearch && searchInputRef.current) {
      searchInputRef.current.focus();
      onClearAutoFocus?.();
    }
  }, [autoFocusSearch, onClearAutoFocus]);

  const filteredList = filterActivities(
    activities,
    {
      campus: currentCampus,
      category: selectedCategory,
      keyword: searchKeyword,
      timeRange,
      statusFilter,
    },
    DEMO_NOW_ISO
  );

  const handleResetFilters = () => {
    onChangeCategory('全部');
    onChangeSearch('');
    onChangeTimeRange('all');
    onChangeStatusFilter('all');
  };

  return (
    <div className="pb-6">
      {/* 1. 顶部区域 */}
      <header className="px-5 pt-3 pb-3.5 bg-white border-b border-[#F0EEEC] sticky top-0 z-20">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h1 className="text-[22px] font-bold tracking-tight text-[#171717]">校园活动</h1>
            <p className="text-xs text-[#9A8984] mt-0.5">发现校园里的精彩</p>
          </div>
          <button
            type="button"
            onClick={onOpenCampusSelector}
            aria-label={`切换学校，当前：${currentCampus}`}
            className="flex items-center gap-1 text-xs font-semibold text-[#171717] bg-[#F7F7F5] hover:bg-[#FFF0ED] hover:text-[#FF5A4F] px-3 py-1.5 rounded-full transition-colors max-w-[185px]"
          >
            <MapPin className="w-3.5 h-3.5 text-[#FF5A4F] shrink-0" />
            <span className="truncate">{currentCampus}</span>
            <ChevronRight className="w-3.5 h-3.5 text-[#9A8984] shrink-0" />
          </button>
        </div>

        {/* 2. 搜索区域 */}
        <div className="mt-3 relative">
          <Search className="w-4 h-4 text-[#9A8984] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchKeyword}
            onChange={(e) => onChangeSearch(e.target.value)}
            placeholder="搜索活动名称、关键词"
            aria-label="搜索活动名称、关键词"
            className="w-full h-10 pl-9 pr-9 rounded-[14px] bg-[#F7F7F5] text-sm text-[#171717] placeholder-[#9A8984] focus:outline-none focus:ring-1 focus:ring-[#FF5A4F]"
          />
          {searchKeyword && (
            <button
              type="button"
              onClick={() => onChangeSearch('')}
              aria-label="清除搜索关键词"
              className="w-7 h-7 rounded-full flex items-center justify-center text-[#9A8984] hover:text-[#171717] absolute right-1.5 top-1/2 -translate-y-1/2"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* 3. 分类导航 */}
        <div
          role="tablist"
          aria-label="活动分类导航"
          className="mt-3 flex items-center gap-1.5 overflow-x-auto no-scrollbar"
        >
          {CATEGORIES.map((cat) => {
            const active = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => onChangeCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 transition-colors ${
                  active
                    ? 'bg-[#FF5A4F] text-white'
                    : 'bg-[#F7F7F5] text-[#514744] hover:text-[#171717]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* 4. 筛选区域（时间筛选 + 状态筛选） */}
        <div className="mt-2.5 pt-2.5 border-t border-[#F0EEEC] space-y-2">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {TIME_FILTERS.map((tf) => {
              const active = timeRange === tf.id;
              return (
                <button
                  key={tf.id}
                  type="button"
                  onClick={() => onChangeTimeRange(tf.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs whitespace-nowrap shrink-0 transition-colors ${
                    active
                      ? 'bg-[#FFF0ED] text-[#FF5A4F] font-semibold'
                      : 'text-[#9A8984] hover:text-[#514744]'
                  }`}
                >
                  {tf.label}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {STATUS_FILTERS.map((sf) => {
              const active = statusFilter === sf.id;
              return (
                <button
                  key={sf.id}
                  type="button"
                  onClick={() => onChangeStatusFilter(sf.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs whitespace-nowrap shrink-0 transition-colors ${
                    active
                      ? 'bg-[#FFF0ED] text-[#FF5A4F] font-semibold'
                      : 'text-[#9A8984] hover:text-[#514744]'
                  }`}
                >
                  {sf.label}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* 5. 活动列表 */}
      <div className="px-5 pt-4 space-y-4">
        {filteredList.map((act) => {
          const computedStatus = computeActivityStatus(act, DEMO_NOW_ISO);
          const statusLabel = getStatusLabel(computedStatus);

          return (
            <article
              key={act.id}
              onClick={() => onSelectActivity(act.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') onSelectActivity(act.id);
              }}
              className="bg-white rounded-[18px] overflow-hidden border border-[#F0EEEC] cursor-pointer hover:border-[#FF5A4F]/40 transition-colors"
            >
              <div className="h-[152px] w-full relative">
                <CoverArtwork cover={act.cover} title={act.title} className="w-full h-full" />
              </div>

              <div className="p-4">
                <div className="flex items-center justify-between gap-2 text-xs">
                  <span className="text-[#9A8984] font-medium">
                    {act.category} · {act.organizer}
                  </span>
                  <span
                    className={`font-semibold shrink-0 ${
                      computedStatus === 'open'
                        ? 'text-[#FF5A4F]'
                        : computedStatus === 'full'
                        ? 'text-[#514744]'
                        : 'text-[#9A8984]'
                    }`}
                  >
                    {statusLabel}
                  </span>
                </div>

                <h2 className="text-[17px] font-bold text-[#171717] mt-1 leading-snug">
                  {act.title}
                </h2>

                <div className="mt-2.5 space-y-1 text-xs text-[#514744]">
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
                      {computedStatus === 'ended'
                        ? `${act.registeredCount}人已参与`
                        : `${act.registeredCount}/${act.capacity} 人`}
                    </span>
                  </div>
                </div>
              </div>
            </article>
          );
        })}

        {filteredList.length === 0 && (
          <div className="bg-white rounded-[18px] p-8 text-center border border-[#F0EEEC]">
            <p className="text-sm font-semibold text-[#171717]">没有找到符合筛选条件的活动</p>
            <p className="text-xs text-[#9A8984] mt-1">
              尝试切换分类或重置筛选条件查看全部校园活动
            </p>
            <button
              type="button"
              onClick={handleResetFilters}
              className="mt-4 px-5 py-2 rounded-full bg-[#FFF0ED] text-[#FF5A4F] text-xs font-semibold"
            >
              重置筛选条件
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
