import React, { useState } from 'react';
import { Check, Copy, Grid, Sparkles } from 'lucide-react';
import { PrimaryTab } from '../types/activity';

export interface OriginalNavIconProps {
  selected?: boolean;
  size?: number;
  showGrid?: boolean;
  className?: string;
}

const DEFAULT_COLOR = '#3A3533';
const SELECTED_COLOR = '#FF5A4F';

/**
 * 1. 首页图标（入口、空间与探索感）
 * 几何构成：圆角拱门空间体块 + 偏心负形通道 + 悬浮探索圆点
 * 不使用传统屋顶房子造型，以建筑空间入口与透视负形表达「进入校园空间、探索未知活动」。
 */
export const NavIconHome: React.FC<OriginalNavIconProps> = ({
  selected = false,
  size = 24,
  showGrid = false,
  className = '',
}) => {
  const color = selected ? SELECTED_COLOR : DEFAULT_COLOR;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {showGrid && <ConstructionGridOverlay />}
      {selected ? (
        <g>
          {/* 选中态：实心几何空间拱体 + 负形内切通道 + 珊瑚橙探索焦点 */}
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M4 11C4 6.58172 7.58172 3 12 3C16.4183 3 20 6.58172 20 11V19C20 20.1046 19.1046 21 18 21H6C4.89543 21 4 20.1046 4 19V11ZM10.5 13.5C10.5 11.8431 11.8431 10.5 13.5 10.5C15.1569 10.5 16.5 11.8431 16.5 13.5V21H10.5V13.5Z"
            fill={color}
          />
          <circle cx="9" cy="8.5" r="1.75" fill="#FFF0ED" />
        </g>
      ) : (
        <g>
          {/* 默认态：外拱门空间轮廓 + 内部负形门廊弧线 + 探索圆点 */}
          <path
            d="M4.75 19V11C4.75 6.99594 7.99594 3.75 12 3.75C16.0041 3.75 19.25 6.99594 19.25 11V19C19.25 19.6904 18.6904 20.25 18 20.25H6C5.30964 20.25 4.75 19.6904 4.75 19Z"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M11 20V14C11 12.3431 12.3431 11 14 11C15.6569 11 17 12.3431 17 14"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle cx="9.25" cy="8.75" r="1.6" fill={color} />
        </g>
      )}
    </svg>
  );
};

/**
 * 2. 活动图标（聚集、连接与活动发生的概念）
 * 几何构成：双交叠几何环块 + 负形引力缺口 + 对角能量节点
 * 不使用传统日历网格，以两个相向汇聚的圆弧块面与中心交汇负形表达「人群聚集、连接碰撞、活动正在发生」。
 */
export const NavIconActivities: React.FC<OriginalNavIconProps> = ({
  selected = false,
  size = 24,
  showGrid = false,
  className = '',
}) => {
  const color = selected ? SELECTED_COLOR : DEFAULT_COLOR;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {showGrid && <ConstructionGridOverlay />}
      {selected ? (
        <g>
          {/* 左下聚集块面（带中心负形切槽） */}
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M3.5 13.5C3.5 9.91015 6.41015 7 10 7H12.5C13.3284 7 14 7.67157 14 8.5C14 9.32843 13.3284 10 12.5 10H10C8.067 10 6.5 11.567 6.5 13.5C6.5 15.433 8.067 17 10 17H13.5C14.3284 17 15 17.6716 15 18.5C15 19.3284 14.3284 20 13.5 20H10C6.41015 20 3.5 17.0899 3.5 13.5Z"
            fill={color}
          />
          {/* 右上连接块面 */}
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M10.5 4C9.67157 4 9 4.67157 9 5.5C9 6.32843 9.67157 7 10.5 7H14C15.933 7 17.5 8.567 17.5 10.5C17.5 12.433 15.933 14 14 14H11.5C10.6716 14 10 14.6716 10 15.5C10 16.3284 10.6716 17 11.5 17H14C17.5899 17 20.5 14.0899 20.5 10.5C20.5 6.91015 17.5899 4 14 4H10.5Z"
            fill={color}
          />
          {/* 中心碰撞发生核心圆与右上活力点 */}
          <circle cx="12" cy="12" r="2" fill={color} />
          <circle cx="18.5" cy="18.5" r="2" fill={color} />
        </g>
      ) : (
        <g>
          {/* 左下环弧 */}
          <path
            d="M13.5 19.25H10C6.82436 19.25 4.25 16.6756 4.25 13.5C4.25 10.3244 6.82436 7.75 10 7.75H12.5"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* 右上环弧 */}
          <path
            d="M10.5 4.75H14C17.1756 4.75 19.75 7.32436 19.75 10.5C19.75 13.6756 17.1756 16.25 14 16.25H11.5"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* 中心聚集核心点与连接节点 */}
          <circle cx="12" cy="12" r="2" fill={color} />
          <circle cx="18.25" cy="18.25" r="1.75" fill={color} />
        </g>
      )}
    </svg>
  );
};

/**
 * 3. 发布图标（创造、展开与发起活动的概念）
 * 几何构成：双折翼展开块面 + 负形菱感星芒核心 + 右上发射圆点
 * 不使用十字加号，以折纸般的动态展开双翼与中心负形光圈表达「从无到有创造、展开一场新活动」。
 */
export const NavIconPublish: React.FC<OriginalNavIconProps> = ({
  selected = false,
  size = 24,
  showGrid = false,
  className = '',
}) => {
  const color = selected ? SELECTED_COLOR : DEFAULT_COLOR;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {showGrid && <ConstructionGridOverlay />}
      {selected ? (
        <g>
          {/* 选中态：实心圆角方块内嵌负形展开通道与右上破界发起点 */}
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M4 8.5C4 6.01472 6.01472 4 8.5 4H13.5C14.3284 4 15 4.67157 15 5.5C15 6.32843 14.3284 7 13.5 7H9.5C8.11929 7 7 8.11929 7 9.5V14.5C7 15.8807 8.11929 17 9.5 17H14.5C15.8807 17 17 15.8807 17 14.5V10.5C17 9.67157 17.6716 9 18.5 9C19.3284 9 20 9.67157 20 10.5V15.5C20 17.9853 17.9853 20 15.5 20H8.5C6.01472 20 4 17.9853 4 15.5V8.5Z"
            fill={color}
          />
          {/* 中心向外展开的创造菱块与右上发起圆点 */}
          <rect
            x="12"
            y="8.4"
            width="5.1"
            height="5.1"
            rx="1.4"
            transform="rotate(45 12 8.4)"
            fill={color}
          />
          <circle cx="18.25" cy="5.75" r="2.25" fill={color} />
        </g>
      ) : (
        <g>
          {/* 默认态：左下展开基座弧线 + 中心旋转方块 + 右上发起短线与圆点 */}
          <path
            d="M13.5 4.75H8.5C6.42893 4.75 4.75 6.42893 4.75 8.5V15.5C4.75 17.5711 6.42893 19.25 8.5 19.25H15.5C17.5711 19.25 19.25 17.5711 19.25 15.5V10.5"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
          />
          <rect
            x="12"
            y="8.7"
            width="4.6"
            height="4.6"
            rx="1.2"
            transform="rotate(45 12 8.7)"
            fill={color}
          />
          <circle cx="18" cy="6" r="2" fill={color} />
        </g>
      )}
    </svg>
  );
};

/**
 * 4. 我的图标（个人与独立空间的概念）
 * 几何构成：半包围新月弧形舱体 + 独立负形内室 + 偏心自我内核圆
 * 不使用具象人头肩膀轮廓，以环抱式几何围合空间与独立圆核表达「自我的独立精神角落与个人活动归属」。
 */
export const NavIconProfile: React.FC<OriginalNavIconProps> = ({
  selected = false,
  size = 24,
  showGrid = false,
  className = '',
}) => {
  const color = selected ? SELECTED_COLOR : DEFAULT_COLOR;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {showGrid && <ConstructionGridOverlay />}
      {selected ? (
        <g>
          {/* 选中态：厚重C型环抱空间块面（带负形内腔） + 独立个人圆核 + 底部基座短线 */}
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12 3.5C7.30558 3.5 3.5 7.30558 3.5 12C3.5 16.6944 7.30558 20.5 12 20.5H17.5C18.8807 20.5 20 19.3807 20 18V15.5C20 14.6716 19.3284 14 18.5 14C17.6716 14 17 14.6716 17 15.5V17.5H12C8.96243 17.5 6.5 15.0376 6.5 12C6.5 8.96243 8.96243 6.5 12 6.5C13.6569 6.5 15.1429 7.23295 16.15 8.395C16.693 9.021 17.64 9.088 18.266 8.545C18.892 8.002 18.959 7.055 18.416 6.429C16.857 4.631 14.561 3.5 12 3.5Z"
            fill={color}
          />
          <circle cx="13.25" cy="11.5" r="2.75" fill={color} />
        </g>
      ) : (
        <g>
          {/* 默认态：半包围独立空间弧线 + 内部偏心独立圆核 */}
          <path
            d="M17.5 6.75C16.124 5.216 14.125 4.25 11.9 4.25C7.675 4.25 4.25 7.675 4.25 11.9C4.25 16.125 7.675 19.55 11.9 19.55H17.5C18.6046 19.55 19.5 18.6546 19.5 17.55V15.25"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="13.25" cy="11.5" r="2.5" fill={color} />
        </g>
      )}
    </svg>
  );
};

const ConstructionGridOverlay: React.FC = () => (
  <g stroke="#171717" strokeOpacity="0.1" strokeWidth="0.35">
    <rect x="2" y="2" width="20" height="20" rx="4" fill="none" />
    <circle cx="12" cy="12" r="8.5" fill="none" />
    <circle cx="12" cy="12" r="4.5" fill="none" />
    <line x1="12" y1="0" x2="12" y2="24" />
    <line x1="0" y1="12" x2="24" y2="12" />
    <line x1="2" y1="2" x2="22" y2="22" />
    <line x1="22" y1="2" x2="2" y2="22" />
  </g>
);

export interface IconSpecMetadata {
  id: PrimaryTab;
  name: string;
  concept: string;
  geometryDesc: string;
  negativeSpaceDesc: string;
  Component: React.FC<OriginalNavIconProps>;
  defaultSvgCode: string;
  selectedSvgCode: string;
}

export const ORIGINAL_ICON_SPECS: IconSpecMetadata[] = [
  {
    id: 'home',
    name: '首页',
    concept: '入口 · 空间 · 探索感',
    geometryDesc: '圆角拱形建筑体块 + 悬浮探索圆点',
    negativeSpaceDesc: '右下偏心内切门廊负形通道，引导视线向内探索',
    Component: NavIconHome,
    defaultSvgCode: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M4.75 19V11C4.75 6.99594 7.99594 3.75 12 3.75C16.0041 3.75 19.25 6.99594 19.25 11V19C19.25 19.6904 18.6904 20.25 18 20.25H6C5.30964 20.25 4.75 19.6904 4.75 19Z" stroke="#3A3533" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M11 20V14C11 12.3431 12.3431 11 14 11C15.6569 11 17 12.3431 17 14" stroke="#3A3533" stroke-width="2" stroke-linecap="round"/>
  <circle cx="9.25" cy="8.75" r="1.6" fill="#3A3533"/>
</svg>`,
    selectedSvgCode: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path fill-rule="evenodd" clip-rule="evenodd" d="M4 11C4 6.58172 7.58172 3 12 3C16.4183 3 20 6.58172 20 11V19C20 20.1046 19.1046 21 18 21H6C4.89543 21 4 20.1046 4 19V11ZM10.5 13.5C10.5 11.8431 11.8431 10.5 13.5 10.5C15.1569 10.5 16.5 11.8431 16.5 13.5V21H10.5V13.5Z" fill="#FF5A4F"/>
  <circle cx="9" cy="8.5" r="1.75" fill="#FFF0ED"/>
</svg>`,
  },
  {
    id: 'activities',
    name: '活动',
    concept: '聚集 · 连接 · 活动发生',
    geometryDesc: '错位交叠双U型环轨 + 中心能量焦点',
    negativeSpaceDesc: '双环之间保留 2px 呼吸负形通道，中心圆核凝聚人气',
    Component: NavIconActivities,
    defaultSvgCode: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M13.5 19.25H10C6.82436 19.25 4.25 16.6756 4.25 13.5C4.25 10.3244 6.82436 7.75 10 7.75H12.5" stroke="#3A3533" stroke-width="2" stroke-linecap="round"/>
  <path d="M10.5 4.75H14C17.1756 4.75 19.75 7.32436 19.75 10.5C19.75 13.6756 17.1756 16.25 14 16.25H11.5" stroke="#3A3533" stroke-width="2" stroke-linecap="round"/>
  <circle cx="12" cy="12" r="2" fill="#3A3533"/>
  <circle cx="18.25" cy="18.25" r="1.75" fill="#3A3533"/>
</svg>`,
    selectedSvgCode: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path fill-rule="evenodd" clip-rule="evenodd" d="M3.5 13.5C3.5 9.91015 6.41015 7 10 7H12.5C13.3284 7 14 7.67157 14 8.5C14 9.32843 13.3284 10 12.5 10H10C8.067 10 6.5 11.567 6.5 13.5C6.5 15.433 8.067 17 10 17H13.5C14.3284 17 15 17.6716 15 18.5C15 19.3284 14.3284 20 13.5 20H10C6.41015 20 3.5 17.0899 3.5 13.5Z" fill="#FF5A4F"/>
  <path fill-rule="evenodd" clip-rule="evenodd" d="M10.5 4C9.67157 4 9 4.67157 9 5.5C9 6.32843 9.67157 7 10.5 7H14C15.933 7 17.5 8.567 17.5 10.5C17.5 12.433 15.933 14 14 14H11.5C10.6716 14 10 14.6716 10 15.5C10 16.3284 10.6716 17 11.5 17H14C17.5899 17 20.5 14.0899 20.5 10.5C20.5 6.91015 17.5899 4 14 4H10.5Z" fill="#FF5A4F"/>
  <circle cx="12" cy="12" r="2" fill="#FF5A4F"/>
  <circle cx="18.5" cy="18.5" r="2" fill="#FF5A4F"/>
</svg>`,
  },
  {
    id: 'publish',
    name: '发布',
    concept: '创造 · 展开 · 发起活动',
    geometryDesc: '开放式折角画布 + 45°旋转创造方块 + 破界圆点',
    negativeSpaceDesc: '右上角象限完全留白破界，形成由中心向外辐射展开的张力',
    Component: NavIconPublish,
    defaultSvgCode: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M13.5 4.75H8.5C6.42893 4.75 4.75 6.42893 4.75 8.5V15.5C4.75 17.5711 6.42893 19.25 8.5 19.25H15.5C17.5711 19.25 19.25 17.5711 19.25 15.5V10.5" stroke="#3A3533" stroke-width="2" stroke-linecap="round"/>
  <rect x="12" y="8.7" width="4.6" height="4.6" rx="1.2" transform="rotate(45 12 8.7)" fill="#3A3533"/>
  <circle cx="18" cy="6" r="2" fill="#3A3533"/>
</svg>`,
    selectedSvgCode: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path fill-rule="evenodd" clip-rule="evenodd" d="M4 8.5C4 6.01472 6.01472 4 8.5 4H13.5C14.3284 4 15 4.67157 15 5.5C15 6.32843 14.3284 7 13.5 7H9.5C8.11929 7 7 8.11929 7 9.5V14.5C7 15.8807 8.11929 17 9.5 17H14.5C15.8807 17 17 15.8807 17 14.5V10.5C17 9.67157 17.6716 9 18.5 9C19.3284 9 20 9.67157 20 10.5V15.5C20 17.9853 17.9853 20 15.5 20H8.5C6.01472 20 4 17.9853 4 15.5V8.5Z" fill="#FF5A4F"/>
  <rect x="12" y="8.4" width="5.1" height="5.1" rx="1.4" transform="rotate(45 12 8.4)" fill="#FF5A4F"/>
  <circle cx="18.25" cy="5.75" r="2.25" fill="#FF5A4F"/>
</svg>`,
  },
  {
    id: 'profile',
    name: '我的',
    concept: '个人 · 独立空间 · 归属',
    geometryDesc: 'C型半围合弧舱 + 底部折角延伸 + 偏心自我圆核',
    negativeSpaceDesc: '弧线内部留出独立精神空间，圆核安放于黄金偏心位置',
    Component: NavIconProfile,
    defaultSvgCode: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M17.5 6.75C16.124 5.216 14.125 4.25 11.9 4.25C7.675 4.25 4.25 7.675 4.25 11.9C4.25 16.125 7.675 19.55 11.9 19.55H17.5C18.6046 19.55 19.5 18.6546 19.5 17.55V15.25" stroke="#3A3533" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="13.25" cy="11.5" r="2.5" fill="#3A3533"/>
</svg>`,
    selectedSvgCode: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path fill-rule="evenodd" clip-rule="evenodd" d="M12 3.5C7.30558 3.5 3.5 7.30558 3.5 12C3.5 16.6944 7.30558 20.5 12 20.5H17.5C18.8807 20.5 20 19.3807 20 18V15.5C20 14.6716 19.3284 14 18.5 14C17.6716 14 17 14.6716 17 15.5V17.5H12C8.96243 17.5 6.5 15.0376 6.5 12C6.5 8.96243 8.96243 6.5 12 6.5C13.6569 6.5 15.1429 7.23295 16.15 8.395C16.693 9.021 17.64 9.088 18.266 8.545C18.892 8.002 18.959 7.055 18.416 6.429C16.857 4.631 14.561 3.5 12 3.5Z" fill="#FF5A4F"/>
  <circle cx="13.25" cy="11.5" r="2.75" fill="#FF5A4F"/>
</svg>`,
  },
];

interface IconDesignArtboardProps {
  activeTab: PrimaryTab;
  onSelectTab: (tab: PrimaryTab) => void;
  compact?: boolean;
}

export const IconDesignArtboard: React.FC<IconDesignArtboardProps> = ({
  activeTab,
  onSelectTab,
  compact = false,
}) => {
  const [showGrid, setShowGrid] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopySvg = (key: string, svgCode: string) => {
    navigator.clipboard?.writeText(svgCode).catch(() => {});
    setCopiedId(key);
    setTimeout(() => setCopiedId(null), 1800);
  };

  return (
    <div className="bg-white rounded-[24px] p-5 border border-[#F0EEEC] space-y-6">
      {/* 画板头部：设计系统规范 */}
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#F0EEEC] pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#FF5A4F]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>原创底部导航图标设计规范画板 · 几何构成 + 负形设计</span>
          </div>
          <h2 className="text-[19px] font-bold text-[#171717] mt-1">
            「一场」校园活动小程序 · 原创几何负形图标系统
          </h2>
          <p className="text-xs text-[#514744] mt-1">
            摒弃传统房屋、日历、十字加号与具象人像；基于 24×24px 黄金网格，以圆弧、切槽、块面与负形构建现代克制的品牌识别。
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowGrid((v) => !v)}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-colors ${
            showGrid
              ? 'bg-[#FFF0ED] text-[#FF5A4F]'
              : 'bg-[#F7F7F5] text-[#514744]'
          }`}
        >
          <Grid className="w-3.5 h-3.5" />
          <span>{showGrid ? '隐藏 24px 制图网格' : '显示 24px 制图网格'}</span>
        </button>
      </div>

      {/* 统一几何规范参数条 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
        <div className="p-3 rounded-2xl bg-[#F7F7F5]">
          <span className="text-[#9A8984] block">画布与视口基准</span>
          <strong className="text-[#171717] mt-0.5 block tabular-nums">
            24 × 24 px (适配 20-24px)
          </strong>
        </div>
        <div className="p-3 rounded-2xl bg-[#F7F7F5]">
          <span className="text-[#9A8984] block">线条与负形槽宽</span>
          <strong className="text-[#171717] mt-0.5 block tabular-nums">
            2.0 px 圆端描边 / 3.0 px 负形
          </strong>
        </div>
        <div className="p-3 rounded-2xl bg-[#F7F7F5] flex items-center justify-between">
          <div>
            <span className="text-[#9A8984] block">默认状态色</span>
            <strong className="text-[#171717] mt-0.5 block tabular-nums">#3A3533 深灰</strong>
          </div>
          <span className="w-5 h-5 rounded-full bg-[#3A3533] shrink-0" />
        </div>
        <div className="p-3 rounded-2xl bg-[#FFF0ED] flex items-center justify-between">
          <div>
            <span className="text-[#9A8984] block">选中状态色</span>
            <strong className="text-[#FF5A4F] mt-0.5 block tabular-nums">#FF5A4F 珊瑚橙</strong>
          </div>
          <span className="w-5 h-5 rounded-full bg-[#FF5A4F] shrink-0" />
        </div>
      </div>

      {/* Part 1: 四个原创图标的默认态 vs 选中态 + 多尺寸还原度对比 */}
      <div className={`grid ${compact ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2'} gap-3.5`}>
        {ORIGINAL_ICON_SPECS.map((spec) => {
          const IconComp = spec.Component;
          const isCurrentTab = activeTab === spec.id;
          return (
            <div
              key={spec.id}
              onClick={() => onSelectTab(spec.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') onSelectTab(spec.id);
              }}
              className={`p-4 rounded-[18px] border transition-all cursor-pointer ${
                isCurrentTab
                  ? 'border-[#FF5A4F] bg-[#FFF0ED]/25'
                  : 'border-[#F0EEEC] bg-[#F7F7F5]/60 hover:border-[#9A8984]/40'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div>
                  <span className="text-[15px] font-bold text-[#171717]">
                    {spec.name}
                  </span>
                  <span className="ml-2 text-xs font-medium text-[#FF5A4F]">
                    {spec.concept}
                  </span>
                </div>
                <span className="text-[11px] text-[#9A8984] tabular-nums">24×24 Vector</span>
              </div>

              {/* 默认状态 vs 选中状态 + 24px/20px 真机原寸检验 */}
              <div className="mt-3 grid grid-cols-3 gap-2.5 items-center">
                {/* 默认状态 */}
                <div className="bg-white rounded-2xl p-3 border border-[#F0EEEC] flex flex-col items-center">
                  <div className="w-12 h-12 flex items-center justify-center">
                    <IconComp selected={false} size={44} showGrid={showGrid} />
                  </div>
                  <span className="text-[11px] text-[#514744] font-medium mt-1.5">
                    默认状态
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopySvg(`${spec.id}-def`, spec.defaultSvgCode);
                    }}
                    className="mt-1.5 text-[10px] text-[#9A8984] hover:text-[#171717] flex items-center gap-1"
                  >
                    {copiedId === `${spec.id}-def` ? (
                      <>
                        <Check className="w-3 h-3 text-[#FF5A4F]" />
                        <span className="text-[#FF5A4F]">已复制SVG</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>复制SVG</span>
                      </>
                    )}
                  </button>
                </div>

                {/* 选中状态 */}
                <div className="bg-white rounded-2xl p-3 border border-[#F0EEEC] flex flex-col items-center">
                  <div className="w-12 h-12 flex items-center justify-center">
                    <IconComp selected={true} size={44} showGrid={showGrid} />
                  </div>
                  <span className="text-[11px] text-[#FF5A4F] font-semibold mt-1.5">
                    选中状态
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopySvg(`${spec.id}-sel`, spec.selectedSvgCode);
                    }}
                    className="mt-1.5 text-[10px] text-[#9A8984] hover:text-[#FF5A4F] flex items-center gap-1"
                  >
                    {copiedId === `${spec.id}-sel` ? (
                      <>
                        <Check className="w-3 h-3 text-[#FF5A4F]" />
                        <span className="text-[#FF5A4F]">已复制SVG</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>复制SVG</span>
                      </>
                    )}
                  </button>
                </div>

                {/* 24px / 20px 原寸视效检验 */}
                <div className="bg-white rounded-2xl p-3 border border-[#F0EEEC] flex flex-col items-center justify-center h-full space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col items-center">
                      <IconComp selected={false} size={24} />
                      <span className="text-[10px] text-[#9A8984] mt-1 tabular-nums">24px</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <IconComp selected={true} size={20} />
                      <span className="text-[10px] text-[#9A8984] mt-1 tabular-nums">20px</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-[#9A8984]">小尺寸清晰度</span>
                </div>
              </div>

              {/* 造型构成解析 */}
              <div className="mt-2.5 text-[11px] text-[#514744] space-y-0.5">
                <p>
                  <strong className="text-[#171717]">几何构成：</strong>
                  {spec.geometryDesc}
                </p>
                <p>
                  <strong className="text-[#171717]">负形设计：</strong>
                  {spec.negativeSpaceDesc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Part 2: 在「一场」底部导航栏中的实际使用效果预览 */}
      <div className="pt-2 border-t border-[#F0EEEC] space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#171717]">
              「一场」底部导航栏实际应用效果（点击可实时切换选中态与左侧页面）
            </h3>
            <p className="text-xs text-[#9A8984]">
              390px 标准宽度 · 图标 24px + 文字 11px 上下排列 · 透明图标背景
            </p>
          </div>
        </div>

        <div className="bg-[#F7F7F5] rounded-[22px] p-4 border border-[#F0EEEC]">
          <div className="max-w-[390px] mx-auto bg-white rounded-[20px] border border-[#F0EEEC] px-2 py-2 shadow-2xs">
            <div className="grid grid-cols-4 items-center">
              {ORIGINAL_ICON_SPECS.map((spec) => {
                const IconComp = spec.Component;
                const isSelected = activeTab === spec.id;
                return (
                  <button
                    key={spec.id}
                    type="button"
                    onClick={() => onSelectTab(spec.id)}
                    className="flex flex-col items-center justify-center py-1.5 transition-transform active:scale-95 focus:outline-none"
                  >
                    <IconComp selected={isSelected} size={24} />
                    <span
                      className={`text-[11px] mt-1 font-semibold tracking-tight ${
                        isSelected ? 'text-[#FF5A4F]' : 'text-[#514744]'
                      }`}
                    >
                      {spec.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
