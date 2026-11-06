import React, { useEffect, useRef, useState } from 'react';
import { Search, MapPin, ChevronRight, Clock, X, Users } from 'lucide-react';
import {
  Activity,
  ActivityCategory,
  BuddyPost,
  BuddyTag,
  StatusFilter,
  TimeRangeFilter,
} from '../types/activity';
import { CAMPUS_LIST, DEMO_NOW_ISO } from '../data/initialData';
import {
  computeActivityStatus,
  filterActivities,
  filterBuddyPosts,
  formatDateTimeRange,
  getStatusLabel,
} from '../utils/activityRules';
import { CoverArtwork } from './CoverArtwork';

interface ActivitiesPageProps {
  currentCampus: string;
  currentSubCampus: string;
  activities: Activity[];
  buddyPosts: BuddyPost[];
  viewMode: 'activities' | 'buddies';
  selectedCategory: ActivityCategory;
  searchKeyword: string;
  timeRange: TimeRangeFilter;
  statusFilter: StatusFilter;
  autoFocusSearch?: boolean;
  onChangeViewMode: (mode: 'activities' | 'buddies') => void;
  onChangeSubCampus: (subCampus: string) => void;
  onChangeCategory: (cat: ActivityCategory) => void;
  onChangeSearch: (kw: string) => void;
  onChangeTimeRange: (tr: TimeRangeFilter) => void;
  onChangeStatusFilter: (sf: StatusFilter) => void;
  onOpenCampusSelector: () => void;
  onSelectActivity: (activityId: string) => void;
  onToggleJoinBuddy: (buddyId: string) => void;
  onClearAutoFocus?: () => void;
}

const CATEGORIES: ActivityCategory[] = ['全部', '讲座', '比赛', '文体', '社团', '展览'];

const BUDDY_TAG_FILTERS: (BuddyTag | '全部')[] = [
  '全部',
  '同去现场',
  '组队参赛',
  '约拍互勉',
  '跨校区同行',
];

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
  currentSubCampus,
  activities,
  buddyPosts,
  viewMode,
  selectedCategory,
  searchKeyword,
  timeRange,
  statusFilter,
  autoFocusSearch,
  onChangeViewMode,
  onChangeSubCampus,
  onChangeCategory,
  onChangeSearch,
  onChangeTimeRange,
  onChangeStatusFilter,
  onOpenCampusSelector,
  onSelectActivity,
  onToggleJoinBuddy,
  onClearAutoFocus,
}) => {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [selectedBuddyTag, setSelectedBuddyTag] = useState<BuddyTag | '全部'>('全部');
  const [onlyOpenBuddies, setOnlyOpenBuddies] = useState<boolean>(false);
  const [copiedBuddyId, setCopiedBuddyId] = useState<string | null>(null);

  const campusInfo =
    CAMPUS_LIST.find((c) => c.name === currentCampus) || CAMPUS_LIST[0];
  const subCampusOptions = ['全部校区', ...(campusInfo.subCampuses || [])];

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
      subCampus: currentSubCampus,
      category: selectedCategory,
      keyword: searchKeyword,
      timeRange,
      statusFilter,
    },
    DEMO_NOW_ISO
  );

  const filteredBuddies = filterBuddyPosts(buddyPosts, {
    campus: currentCampus,
    subCampus: currentSubCampus,
    tag: selectedBuddyTag,
    keyword: searchKeyword,
    onlyOpen: onlyOpenBuddies,
  });

  const handleResetFilters = () => {
    onChangeSubCampus('全部校区');
    onChangeCategory('全部');
    onChangeSearch('');
    onChangeTimeRange('all');
    onChangeStatusFilter('all');
    setSelectedBuddyTag('全部');
    setOnlyOpenBuddies(false);
  };

  const handleCopyCode = (id: string, code: string) => {
    navigator.clipboard?.writeText(code).catch(() => {});
    setCopiedBuddyId(id);
    setTimeout(() => setCopiedBuddyId(null), 2000);
  };

  return (
    <div className="pb-6">
      {/* 1. 顶部区域 */}
      <header className="px-5 pt-3 pb-3.5 bg-white border-b border-[#F0EEEC] sticky top-0 z-20">
        <div className="flex items-center justify-between gap-2">
          {/* 顶部视图切换：校园活动 / 找搭子广场 */}
          <div className="flex items-center gap-3.5 shrink-0">
            <button
              type="button"
              onClick={() => onChangeViewMode('activities')}
              className={`text-left transition-colors relative pb-1.5 whitespace-nowrap shrink-0 ${
                viewMode === 'activities'
                  ? 'text-[20px] font-bold tracking-tight text-[#171717]'
                  : 'text-[16px] font-semibold text-[#9A8984] hover:text-[#514744]'
              }`}
            >
              <span>校园活动</span>
              {viewMode === 'activities' && (
                <span className="absolute bottom-0 left-0 right-0 h-[3px] rounded-full bg-[#FF5A4F]" />
              )}
            </button>

            <button
              type="button"
              onClick={() => onChangeViewMode('buddies')}
              className={`text-left transition-colors relative pb-1.5 flex items-center gap-1 whitespace-nowrap shrink-0 ${
                viewMode === 'buddies'
                  ? 'text-[20px] font-bold tracking-tight text-[#171717]'
                  : 'text-[16px] font-semibold text-[#9A8984] hover:text-[#514744]'
              }`}
            >
              <span>找搭子</span>
              <span className="text-[11px] font-semibold px-1.5 py-0.5 rounded-full bg-[#FFF0ED] text-[#FF5A4F] tabular-nums">
                {buddyPosts.filter((b) => b.campus === currentCampus).length}
              </span>
              {viewMode === 'buddies' && (
                <span className="absolute bottom-0 left-0 right-0 h-[3px] rounded-full bg-[#FF5A4F]" />
              )}
            </button>
          </div>

          <button
            type="button"
            onClick={onOpenCampusSelector}
            aria-label={`切换学校，当前：${currentCampus}`}
            className="flex items-center gap-1 text-xs font-semibold text-[#171717] bg-[#F7F7F5] hover:bg-[#FFF0ED] hover:text-[#FF5A4F] px-2.5 py-1.5 rounded-full transition-colors max-w-[162px] min-w-0"
          >
            <MapPin className="w-3.5 h-3.5 text-[#FF5A4F] shrink-0" />
            <span className="truncate">{currentCampus}</span>
            <ChevronRight className="w-3.5 h-3.5 text-[#9A8984] shrink-0" />
          </button>
        </div>

        {/* 二级校内校区切换栏 */}
        {subCampusOptions.length > 1 && (
          <div
            role="tablist"
            aria-label="校内校区筛选"
            className="mt-2.5 p-1 rounded-[14px] bg-[#F7F7F5] flex items-center gap-1 overflow-x-auto no-scrollbar"
          >
            {subCampusOptions.map((sub) => {
              const active = currentSubCampus === sub;
              return (
                <button
                  key={sub}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => onChangeSubCampus(sub)}
                  className={`flex-1 min-w-[84px] py-1.5 px-2.5 rounded-[10px] text-xs font-semibold transition-all whitespace-nowrap ${
                    active
                      ? 'bg-white text-[#FF5A4F] shadow-[0_1px_2px_rgba(0,0,0,0.04)]'
                      : 'text-[#514744] hover:text-[#171717]'
                  }`}
                >
                  {sub}
                </button>
              );
            })}
          </div>
        )}

        {/* 2. 搜索区域 */}
        <div className="mt-2.5 relative">
          <Search className="w-4 h-4 text-[#9A8984] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchKeyword}
            onChange={(e) => onChangeSearch(e.target.value)}
            placeholder={
              viewMode === 'buddies'
                ? '搜索搭子主题、关联活动或院系'
                : '搜索活动名称、关键词'
            }
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

        {viewMode === 'activities' ? (
          <>
            {/* 3. 活动分类导航 */}
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
          </>
        ) : (
          /* 找搭子模式筛选栏 */
          <div className="mt-3 flex items-center justify-between gap-2">
            <div
              role="tablist"
              aria-label="结伴主题筛选"
              className="flex items-center gap-1.5 overflow-x-auto no-scrollbar"
            >
              {BUDDY_TAG_FILTERS.map((tag) => {
                const active = selectedBuddyTag === tag;
                return (
                  <button
                    key={tag}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setSelectedBuddyTag(tag)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 transition-colors ${
                      active
                        ? 'bg-[#FF5A4F] text-white'
                        : 'bg-[#F7F7F5] text-[#514744] hover:text-[#171717]'
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => setOnlyOpenBuddies((v) => !v)}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 border transition-colors ${
                onlyOpenBuddies
                  ? 'bg-[#FFF0ED] text-[#FF5A4F] border-[#FF5A4F]/30'
                  : 'bg-white text-[#9A8984] border-[#F0EEEC]'
              }`}
            >
              只看缺人
            </button>
          </div>
        )}
      </header>

      {/* 5. 列表内容区 */}
      {viewMode === 'activities' ? (
        <div className="px-5 pt-4 space-y-4">
          {filteredList.map((act) => {
            const computedStatus = computeActivityStatus(act, DEMO_NOW_ISO);
            const statusLabel = getStatusLabel(computedStatus);
            const actBuddyCount = buddyPosts.filter((b) => b.activityId === act.id).length;

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
                      {act.category}
                      {act.subCampus ? ` · ${act.subCampus}` : ''} · {act.organizer}
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
                      <div className="flex items-center gap-2 shrink-0 tabular-nums">
                        {actBuddyCount > 0 && (
                          <span className="text-[11px] font-medium text-[#FF5A4F] bg-[#FFF0ED] px-2 py-0.5 rounded-md">
                            {actBuddyCount}组搭子
                          </span>
                        )}
                        <span className="text-xs text-[#9A8984]">
                          {computedStatus === 'ended'
                            ? `${act.registeredCount}人已参与`
                            : `${act.registeredCount}/${act.capacity} 人`}
                        </span>
                      </div>
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
      ) : (
        /* 找搭子广场列表 */
        <div className="px-5 pt-4 space-y-3.5">
          {filteredBuddies.map((post) => {
            const isFull = post.currentCount >= post.maxCount;
            return (
              <article
                key={post.id}
                className="bg-white rounded-[18px] p-4 border border-[#F0EEEC] space-y-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-9 h-9 rounded-full bg-[#FFF0ED] text-[#FF5A4F] font-bold text-sm flex items-center justify-center shrink-0">
                      {post.authorName.slice(0, 1)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-bold text-[#171717] truncate">
                          {post.authorName}
                        </span>
                        <span className="text-xs text-[#9A8984] shrink-0">
                          {post.subCampus}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#9A8984] truncate">
                        {post.authorGrade} · {post.authorDepartment}
                      </p>
                    </div>
                  </div>

                  <span className="text-xs font-semibold text-[#FF5A4F] bg-[#FFF0ED] px-2.5 py-1 rounded-lg shrink-0">
                    {post.tag}
                  </span>
                </div>

                <div>
                  <h2 className="text-[16px] font-bold text-[#171717] leading-snug">
                    {post.title}
                  </h2>
                  <p className="text-xs text-[#514744] mt-1.5 leading-relaxed">
                    {post.description}
                  </p>
                </div>

                {/* 关联活动与集合点 */}
                <div className="p-2.5 rounded-xl bg-[#F7F7F5] space-y-1.5 text-xs">
                  <button
                    type="button"
                    onClick={() => onSelectActivity(post.activityId)}
                    className="w-full flex items-center justify-between text-left text-[#171717] hover:text-[#FF5A4F] font-semibold"
                  >
                    <span className="truncate">关联活动：{post.activityTitle}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-[#9A8984] shrink-0" />
                  </button>
                  <div className="flex items-center gap-1.5 text-[11px] text-[#514744]">
                    <MapPin className="w-3.5 h-3.5 text-[#FF5A4F] shrink-0" />
                    <span className="truncate">集合地点：{post.meetingPoint}</span>
                  </div>
                </div>

                {/* 已加入或我发起时解锁联系暗号 */}
                {(post.isJoined || post.isMine) && (
                  <div className="p-2.5 rounded-xl bg-[#FFF0ED]/70 border border-[#FF5A4F]/20 flex items-center justify-between gap-2">
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
                      onClick={() => handleCopyCode(post.id, post.contactCode)}
                      className="px-2.5 py-1 rounded-lg bg-white text-[#FF5A4F] text-xs font-semibold shrink-0"
                    >
                      {copiedBuddyId === post.id ? '已复制' : '复制'}
                    </button>
                  </div>
                )}

                <div className="pt-2 border-t border-[#F0EEEC] flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-xs text-[#514744] tabular-nums min-w-0 truncate">
                    <Users className="w-3.5 h-3.5 text-[#9A8984] shrink-0" />
                    <span className="font-semibold text-[#171717]">
                      {post.currentCount}/{post.maxCount}人
                    </span>
                    <span className="text-[#9A8984] truncate">
                      （{post.participants.join('、')}）
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
                      className="px-3.5 py-1.5 rounded-full bg-[#F7F7F5] text-[#514744] hover:text-[#FF5A4F] text-xs font-semibold shrink-0"
                    >
                      已加入 · 退出
                    </button>
                  ) : isFull ? (
                    <span className="px-3.5 py-1.5 rounded-full bg-[#EAE9E7] text-[#99938F] text-xs font-semibold shrink-0">
                      已满员
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onToggleJoinBuddy(post.id)}
                      className="px-4 py-1.5 rounded-full bg-[#FF5A4F] text-white text-xs font-semibold shrink-0 active:scale-95 transition-transform"
                    >
                      加入结伴
                    </button>
                  )}
                </div>
              </article>
            );
          })}

          {filteredBuddies.length === 0 && (
            <div className="bg-white rounded-[18px] p-8 text-center border border-[#F0EEEC]">
              <p className="text-sm font-semibold text-[#171717]">暂无符合条件的活动搭子</p>
              <p className="text-xs text-[#9A8984] mt-1">
                可以切换校区或进入任意活动详情页发起新的结伴招募
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
      )}
    </div>
  );
};
