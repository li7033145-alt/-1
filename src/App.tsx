import React, { useEffect, useRef, useState } from 'react';
import { Layers, Smartphone } from 'lucide-react';
import {
  Activity,
  ActivityCategory,
  PrimaryTab,
  PublishFormData,
  StatusFilter,
  TimeRangeFilter,
  UserProfile,
} from './types/activity';
import {
  DEFAULT_CAMPUS,
  DEMO_NOW_ISO,
  INITIAL_ACTIVITIES,
  INITIAL_USER_PROFILE,
} from './data/initialData';
import { applyRegistration, computeActivityStatus } from './utils/activityRules';
import { BottomNav } from './components/BottomNav';
import { CampusSelectorPage } from './components/CampusSelectorPage';
import { HomePage } from './components/HomePage';
import { ActivitiesPage } from './components/ActivitiesPage';
import { ActivityDetailPage } from './components/ActivityDetailPage';
import { PublishPage } from './components/PublishPage';
import { ProfilePage, ProfileSubPage } from './components/ProfilePage';
import { IconDesignArtboard } from './components/OriginalNavIcons';

const STORAGE_KEYS = {
  ACTIVITIES: 'yichang_activities_v1',
  PROFILE: 'yichang_profile_v1',
  CAMPUS: 'yichang_campus_v1',
  ONBOARDED: 'yichang_onboarded_v1',
};

export default function App() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Check ?autostart=1 to optionally skip initial campus selection screen
  const isAutoStart =
    typeof window !== 'undefined' &&
    new URLSearchParams(window.location.search).get('autostart') === '1';

  const [hasSelectedCampus, setHasSelectedCampus] = useState<boolean>(() => {
    if (isAutoStart) return true;
    try {
      return localStorage.getItem(STORAGE_KEYS.ONBOARDED) === 'true';
    } catch {
      return false;
    }
  });

  const [currentCampus, setCurrentCampus] = useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.CAMPUS) || DEFAULT_CAMPUS;
    } catch {
      return DEFAULT_CAMPUS;
    }
  });

  const [activities, setActivities] = useState<Activity[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore storage error
    }
    return INITIAL_ACTIVITIES;
  });

  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROFILE);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_USER_PROFILE;
  });

  // Navigation state
  const [activeTab, setActiveTab] = useState<PrimaryTab>('home');
  const [showCampusModal, setShowCampusModal] = useState<boolean>(false);
  const [activeDetailId, setActiveDetailId] = useState<string | null>(null);
  const [mobileShowArtboard, setMobileShowArtboard] = useState<boolean>(false);

  // Activities Page filter state
  const [selectedCategory, setSelectedCategory] = useState<ActivityCategory>('全部');
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [timeRange, setTimeRange] = useState<TimeRangeFilter>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [autoFocusSearch, setAutoFocusSearch] = useState<boolean>(false);

  // Publish Page state
  const [publishMode, setPublishMode] = useState<'form' | 'preview' | 'success'>('form');
  const [editingDraft, setEditingDraft] = useState<PublishFormData | null>(null);
  const [previewFormData, setPreviewFormData] = useState<PublishFormData | null>(null);
  const [lastSubmittedTitle, setLastSubmittedTitle] = useState<string>('');

  // Profile subpage state
  const [profileSubPage, setProfileSubPage] = useState<ProfileSubPage>('main');
  const [settingsSection, setSettingsSection] = useState<'profile' | 'settings' | 'about'>(
    'profile'
  );

  // Persist changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities));
    } catch {
      // ignore
    }
  }, [activities]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(userProfile));
    } catch {
      // ignore
    }
  }, [userProfile]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CAMPUS, currentCampus);
    } catch {
      // ignore
    }
  }, [currentCampus]);

  // Scroll to top when screen changes
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [activeTab, activeDetailId, showCampusModal, publishMode, profileSubPage, hasSelectedCampus, mobileShowArtboard]);

  const handleSelectCampus = (campusName: string) => {
    setCurrentCampus(campusName);
    setUserProfile((prev) => ({ ...prev, campus: campusName }));
    setHasSelectedCampus(true);
    setShowCampusModal(false);
    try {
      localStorage.setItem(STORAGE_KEYS.ONBOARDED, 'true');
    } catch {
      // ignore
    }
  };

  const handleSelectTab = (tab: PrimaryTab) => {
    setHasSelectedCampus(true);
    setActiveDetailId(null);
    setShowCampusModal(false);
    setMobileShowArtboard(false);
    setActiveTab(tab);
    if (tab === 'publish') {
      setPublishMode('form');
    }
    if (tab === 'profile') {
      setProfileSubPage('main');
    }
  };

  const handleJumpToCategory = (category: ActivityCategory, focusSearch = false) => {
    setSelectedCategory(category);
    setStatusFilter('all');
    setTimeRange('all');
    if (focusSearch) {
      setAutoFocusSearch(true);
    }
    setActiveDetailId(null);
    setActiveTab('activities');
  };

  const handleToggleFavorite = (activityId: string) => {
    setActivities((prev) =>
      prev.map((act) => (act.id === activityId ? { ...act, favorite: !act.favorite } : act))
    );
  };

  const handleRegisterSuccess = (
    activityId: string,
    form: {
      attendeeName: string;
      studentId: string;
      phone: string;
      department: string;
      note?: string;
    }
  ) => {
    setActivities((prev) =>
      prev.map((act) => (act.id === activityId ? applyRegistration(act, form, DEMO_NOW_ISO) : act))
    );
  };

  const buildActivityFromForm = (
    formData: PublishFormData,
    reviewStatus: 'draft' | 'pending'
  ): Activity => {
    const startIso = `${formData.startDate}T${formData.startClock}:00`;
    const endIso = `${formData.endDate}T${formData.endClock}:00`;
    const regStartIso = `${formData.regStartDate}T${formData.regStartClock}:00`;
    const regDeadlineIso = `${formData.regDeadlineDate}T${formData.regDeadlineClock}:00`;
    const cap = Math.max(1, Number(formData.capacity) || 100);

    const baseObj = {
      startTime: startIso,
      endTime: endIso,
      registrationStartTime: regStartIso,
      registrationDeadline: regDeadlineIso,
      capacity: cap,
      registeredCount: 0,
    };

    return {
      id: formData.id || `pub-${Date.now()}`,
      title: formData.title.trim(),
      cover: formData.cover || 'music',
      category: formData.category,
      description: formData.description.trim(),
      ...baseObj,
      status: computeActivityStatus(baseObj, DEMO_NOW_ISO),
      location: formData.location.trim() || '校内活动场地',
      organizer: formData.organizer.trim() || userProfile.nickname,
      organizerInfo: `${currentCampus}学生自主发起活动`,
      favorite: false,
      campus: currentCampus,
      schedule: [
        {
          time: `${formData.startClock} - ${formData.endClock}`,
          title: '主体活动开展与互动',
          detail: '按活动公告流程签到入场参与',
        },
      ],
      requirements: formData.requirementsText
        .split(/[；;\n]/)
        .map((s) => s.trim())
        .filter(Boolean),
      contact: formData.contact.trim() || userProfile.phone,
      isUserPublished: true,
      reviewStatus,
    };
  };

  const handleSaveDraft = (formData: PublishFormData) => {
    const draftAct = buildActivityFromForm(formData, 'draft');
    setActivities((prev) => {
      const exists = prev.some((a) => a.id === draftAct.id);
      if (exists) {
        return prev.map((a) => (a.id === draftAct.id ? draftAct : a));
      }
      return [draftAct, ...prev];
    });
  };

  const handleSubmitPublish = (formData: PublishFormData) => {
    const submittedAct = buildActivityFromForm(formData, 'pending');
    setActivities((prev) => {
      const exists = prev.some((a) => a.id === submittedAct.id);
      if (exists) {
        return prev.map((a) => (a.id === submittedAct.id ? submittedAct : a));
      }
      return [submittedAct, ...prev];
    });
    setLastSubmittedTitle(submittedAct.title);
    setEditingDraft(null);
    setPreviewFormData(null);
    setPublishMode('success');
  };

  const handleSimulateApprove = (activityId: string) => {
    setActivities((prev) =>
      prev.map((a) =>
        a.id === activityId
          ? { ...a, reviewStatus: 'approved', isStartingSoonOnHome: true }
          : a
      )
    );
  };

  const handleResetDemoData = () => {
    setActivities(INITIAL_ACTIVITIES);
    setUserProfile(INITIAL_USER_PROFILE);
    setCurrentCampus(DEFAULT_CAMPUS);
    try {
      localStorage.removeItem(STORAGE_KEYS.ACTIVITIES);
      localStorage.removeItem(STORAGE_KEYS.PROFILE);
      localStorage.removeItem(STORAGE_KEYS.CAMPUS);
    } catch {
      // ignore
    }
  };

  const activeDetailActivity = activeDetailId
    ? activities.find((a) => a.id === activeDetailId) || null
    : null;

  const showBottomNav =
    hasSelectedCampus &&
    !showCampusModal &&
    !activeDetailActivity &&
    !(activeTab === 'publish' && publishMode === 'preview') &&
    !(activeTab === 'profile' && profileSubPage !== 'main');

  return (
    <div className="min-h-screen bg-[#ECEAE6] flex items-center justify-center">
      {/* 移动端主画布容器（390x844 标准尺寸，无手机边框、无顶部状态栏、无滚动条） */}
      <div className="w-full max-w-[430px] sm:w-[390px] h-[100dvh] sm:h-[844px] bg-[#F7F7F5] flex flex-col overflow-hidden relative shrink-0">
        {/* 可纵向滚动的页面主体视口 */}
        <main
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar relative"
        >
          {!hasSelectedCampus || showCampusModal ? (
              <CampusSelectorPage
                currentCampus={currentCampus}
                isInitial={!hasSelectedCampus}
                onSelectCampus={handleSelectCampus}
                onClose={hasSelectedCampus ? () => setShowCampusModal(false) : undefined}
              />
            ) : activeDetailActivity ? (
              <ActivityDetailPage
                activity={activeDetailActivity}
                userProfile={userProfile}
                onBack={() => setActiveDetailId(null)}
                onToggleFavorite={handleToggleFavorite}
                onRegisterSuccess={handleRegisterSuccess}
                onGoToMyRegistrations={() => {
                  setActiveDetailId(null);
                  setActiveTab('profile');
                  setProfileSubPage('my-registrations');
                }}
              />
            ) : activeTab === 'home' ? (
              <HomePage
                currentCampus={currentCampus}
                activities={activities}
                onOpenCampusSelector={() => setShowCampusModal(true)}
                onSelectActivity={(id) => setActiveDetailId(id)}
                onJumpToCategory={handleJumpToCategory}
              />
            ) : activeTab === 'activities' ? (
              <ActivitiesPage
                currentCampus={currentCampus}
                activities={activities}
                selectedCategory={selectedCategory}
                searchKeyword={searchKeyword}
                timeRange={timeRange}
                statusFilter={statusFilter}
                autoFocusSearch={autoFocusSearch}
                onChangeCategory={setSelectedCategory}
                onChangeSearch={setSearchKeyword}
                onChangeTimeRange={setTimeRange}
                onChangeStatusFilter={setStatusFilter}
                onOpenCampusSelector={() => setShowCampusModal(true)}
                onSelectActivity={(id) => setActiveDetailId(id)}
                onClearAutoFocus={() => setAutoFocusSearch(false)}
              />
            ) : activeTab === 'publish' ? (
              <PublishPage
                currentCampus={currentCampus}
                initialDraft={editingDraft}
                mode={publishMode}
                previewData={previewFormData}
                lastSubmittedTitle={lastSubmittedTitle}
                onSaveDraft={handleSaveDraft}
                onProceedToPreview={(data) => {
                  setPreviewFormData(data);
                  setPublishMode('preview');
                }}
                onBackToEdit={() => setPublishMode('form')}
                onSubmitPublish={handleSubmitPublish}
                onGoToMyPublished={() => {
                  setPublishMode('form');
                  setActiveTab('profile');
                  setProfileSubPage('my-published');
                }}
                onGoHome={() => {
                  setPublishMode('form');
                  setActiveTab('home');
                }}
              />
            ) : (
              <ProfilePage
                userProfile={userProfile}
                currentCampus={currentCampus}
                activities={activities}
                subPage={profileSubPage}
                initialSettingsTab={settingsSection}
                onChangeSubPage={(sub, sec) => {
                  setProfileSubPage(sub);
                  if (sec) setSettingsSection(sec);
                }}
                onOpenCampusSelector={() => setShowCampusModal(true)}
                onSelectActivity={(id) => setActiveDetailId(id)}
                onToggleFavorite={handleToggleFavorite}
                onEditPublishedActivity={(formData) => {
                  setEditingDraft(formData);
                  setPublishMode('form');
                  setActiveTab('publish');
                }}
                onSimulateApproveActivity={handleSimulateApprove}
                onUpdateProfile={setUserProfile}
                onResetDemoData={handleResetDemoData}
                onGoToDiscover={() => {
                  setProfileSubPage('main');
                  setActiveTab('activities');
                }}
              />
            )}
          </main>

        {/* 固定底部导航栏（应用全新原创几何+负形图标） */}
        {showBottomNav && (
          <BottomNav activeTab={activeTab} onSelectTab={handleSelectTab} />
        )}
      </div>
    </div>
  );
}
