import React, { useState } from 'react';
import { Search, MapPin, Check, ArrowLeft, Building2 } from 'lucide-react';
import { CampusInfo } from '../types/activity';
import { CAMPUS_LIST } from '../data/initialData';

interface CampusSelectorPageProps {
  currentCampus: string;
  currentSubCampus?: string;
  isInitial?: boolean;
  onSelectCampus: (campusName: string, subCampus?: string) => void;
  onClose?: () => void;
}

export const CampusSelectorPage: React.FC<CampusSelectorPageProps> = ({
  currentCampus,
  currentSubCampus = '全部校区',
  isInitial = false,
  onSelectCampus,
  onClose,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedName, setSelectedName] = useState(currentCampus || '广东建设职业技术学院');
  const [selectedSubCampus, setSelectedSubCampus] = useState(currentSubCampus || '全部校区');

  const filteredCampuses: CampusInfo[] = CAMPUS_LIST.filter((c) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      c.name.toLowerCase().includes(q) ||
      c.shortName.toLowerCase().includes(q) ||
      c.city.toLowerCase().includes(q) ||
      c.district.toLowerCase().includes(q) ||
      c.subCampuses.some((sub) => sub.toLowerCase().includes(q))
    );
  });

  const handleSelectSchool = (campus: CampusInfo) => {
    setSelectedName(campus.name);
    if (selectedName !== campus.name) {
      setSelectedSubCampus('全部校区');
    }
  };

  const handleConfirm = () => {
    onSelectCampus(selectedName, selectedSubCampus);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-[#F7F7F5] text-[#171717]">
      {/* Top Bar */}
      <div className="pt-[12px] px-5 pb-2 flex items-center justify-between shrink-0">
        {!isInitial && onClose ? (
          <button
            type="button"
            onClick={onClose}
            aria-label="返回上一页"
            className="w-10 h-10 -ml-2 rounded-full flex items-center justify-center text-[#171717] hover:bg-black/5 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-[#FF5A4F] text-white font-bold text-sm flex items-center justify-center">
              一
            </span>
            <span className="text-sm font-semibold text-[#171717]">一场 · 校园活动</span>
          </div>
        )}
        <span className="text-xs text-[#9A8984]">默认：广东建设职业技术学院</span>
      </div>

      {/* Header Content */}
      <div className="px-5 pt-1 pb-3 shrink-0">
        <h1 className="text-[22px] font-bold tracking-tight text-[#171717]">选择你的校园</h1>
        <p className="text-xs text-[#514744] mt-1">支持高校切换与校内分校区二级筛选。</p>

        {/* Search Input */}
        <div className="mt-3 relative">
          <Search className="w-4 h-4 text-[#9A8984] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索学校名称、校区或所在城市"
            aria-label="搜索学校"
            className="w-full h-10 pl-10 pr-4 bg-white rounded-[14px] text-sm text-[#171717] placeholder-[#9A8984] border border-[#F0EEEC] focus:outline-none focus:border-[#FF5A4F]"
          />
        </div>
      </div>

      {/* Campus Cards List */}
      <div className="flex-1 px-5 space-y-2.5 pb-4 overflow-y-auto no-scrollbar">
        {filteredCampuses.map((campus) => {
          const isSelected = selectedName === campus.name;
          const isDefault = campus.name === '广东建设职业技术学院';
          const subOptions = ['全部校区', ...(campus.subCampuses || [])];

          return (
            <div
              key={campus.id}
              onClick={() => handleSelectSchool(campus)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') handleSelectSchool(campus);
              }}
              className={`w-full text-left p-3.5 rounded-[18px] bg-white transition-all border cursor-pointer ${
                isSelected
                  ? 'border-[#FF5A4F] ring-1 ring-[#FF5A4F]/30'
                  : 'border-[#F0EEEC] hover:border-[#9A8984]/40'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                      isSelected ? 'bg-[#FFF0ED] text-[#FF5A4F]' : 'bg-[#F7F7F5] text-[#514744]'
                    }`}
                  >
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[15px] font-semibold text-[#171717] truncate">
                        {campus.name}
                      </span>
                      {isDefault && (
                        <span className="text-xs font-medium text-[#FF5A4F]">默认学校</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-[#9A8984] mt-0.5">
                      <MapPin className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">
                        {campus.city} · {campus.district}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#514744] mt-1.5 tabular-nums">
                      <span>近期 {campus.activeCount} 场活动</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-[#9A8984]">{campus.studentCountText}</span>
                    </div>
                  </div>
                </div>

                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-1 ${
                    isSelected
                      ? 'bg-[#FF5A4F] text-white'
                      : 'border border-[#F0EEEC] bg-[#F7F7F5] text-transparent'
                  }`}
                >
                  <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
                </div>
              </div>

              {/* 校内分校区二级选择 */}
              {isSelected && subOptions.length > 1 && (
                <div
                  className="mt-3 pt-2.5 border-t border-[#F0EEEC] flex items-center gap-1.5 flex-wrap"
                  onClick={(e) => e.stopPropagation()}
                >
                  <span className="text-[11px] text-[#9A8984] mr-1">校内校区：</span>
                  {subOptions.map((sub) => {
                    const subActive = selectedSubCampus === sub;
                    return (
                      <button
                        key={sub}
                        type="button"
                        onClick={() => setSelectedSubCampus(sub)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                          subActive
                            ? 'bg-[#FF5A4F] text-white font-semibold'
                            : 'bg-[#F7F7F5] text-[#514744] hover:text-[#171717]'
                        }`}
                      >
                        {sub}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {filteredCampuses.length === 0 && (
          <div className="bg-white rounded-[18px] p-8 text-center border border-[#F0EEEC]">
            <p className="text-sm text-[#514744]">未找到匹配的高校</p>
            <p className="text-xs text-[#9A8984] mt-1">试试输入「广东建设职业技术学院」或「清远校区」</p>
          </div>
        )}
      </div>

      {/* Bottom Sticky Confirm Button */}
      <div className="shrink-0 p-4 bg-white border-t border-[#F0EEEC]">
        <button
          type="button"
          onClick={handleConfirm}
          className="w-full h-[50px] rounded-[26px] bg-[#FF5A4F] text-white font-semibold text-[15px] flex items-center justify-center transition-transform active:scale-[0.99]"
        >
          进入「{selectedName}
          {selectedSubCampus && selectedSubCampus !== '全部校区' ? ` · ${selectedSubCampus}` : ''}」
        </button>
      </div>
    </div>
  );
};
