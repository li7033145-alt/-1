import React from 'react';
import { PrimaryTab } from '../types/activity';
import {
  NavIconHome,
  NavIconActivities,
  NavIconPublish,
  NavIconProfile,
  OriginalNavIconProps,
} from './OriginalNavIcons';

interface BottomNavProps {
  activeTab: PrimaryTab;
  onSelectTab: (tab: PrimaryTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onSelectTab }) => {
  const navItems: {
    id: PrimaryTab;
    label: string;
    ariaLabel?: string;
    Icon: React.FC<OriginalNavIconProps>;
  }[] = [
    { id: 'home', label: '首页', Icon: NavIconHome },
    { id: 'activities', label: '活动', Icon: NavIconActivities },
    { id: 'publish', label: '发布', ariaLabel: '发布活动', Icon: NavIconPublish },
    { id: 'profile', label: '我的', Icon: NavIconProfile },
  ];

  return (
    <nav
      aria-label="底部主导航"
      className="sticky bottom-0 left-0 right-0 z-30 bg-white border-t border-[#F0EEEC] px-2 pt-2 pb-[22px] shrink-0"
    >
      <div className="grid grid-cols-4 items-center">
        {navItems.map((item) => {
          const IconComponent = item.Icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectTab(item.id)}
              aria-label={item.ariaLabel || item.label}
              aria-current={isActive ? 'page' : undefined}
              className="flex flex-col items-center justify-center min-h-[48px] py-0.5 transition-transform active:scale-95 focus:outline-none"
            >
              <IconComponent selected={isActive} size={24} />
              <span
                className={`text-[11px] mt-1 font-medium whitespace-nowrap transition-colors ${
                  isActive ? 'text-[#FF5A4F] font-semibold' : 'text-[#514744]'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
